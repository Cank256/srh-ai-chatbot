import type {
  CoreAssistantMessage,
  CoreToolMessage,
  Message,
  ToolInvocation,
} from 'ai';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { Message as DBMessage, Document } from '@/lib/db/schema';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ApplicationError extends Error {
  info: string;
  status: number;
}

export const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error(
      'An error occurred while fetching the data.',
    ) as ApplicationError;

    error.info = await res.json();
    error.status = res.status;

    throw error;
  }

  return res.json();
};

export function getLocalStorage(key: string) {
  if (typeof window !== 'undefined') {
    return JSON.parse(localStorage.getItem(key) || '[]');
  }
  return [];
}

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function addToolMessageToChat({
  toolMessage,
  messages,
}: {
  toolMessage: CoreToolMessage;
  messages: Array<Message>;
}): Array<Message> {
  return messages.map((message) => {
    if (message.toolInvocations) {
      return {
        ...message,
        toolInvocations: message.toolInvocations.map((toolInvocation) => {
          const toolResult = toolMessage.content.find(
            (tool) => tool.toolCallId === toolInvocation.toolCallId,
          );

          if (toolResult) {
            return {
              ...toolInvocation,
              state: 'result',
              result: toolResult.result,
            };
          }

          return toolInvocation;
        }),
      };
    }

    return message;
  });
}

export function convertToUIMessages(
  dbMessages: Array<DBMessage>,
): Array<Message> {
  const uiMessages: Array<Message> = [];

  // First pass: convert non-tool messages and collect tool calls
  for (const dbMessage of dbMessages) {
    if (dbMessage.role !== 'tool') {
      let textContent = '';
      const toolInvocations: Array<ToolInvocation> = [];
      if (typeof dbMessage.content === 'string') {
        textContent = dbMessage.content;
      } else if (Array.isArray(dbMessage.content)) {
        for (const contentPart of dbMessage.content) {
          if (contentPart.type === 'text') {
            textContent += contentPart.text;
          } else if (contentPart.type === 'tool-call') {
            toolInvocations.push({
              state: 'call',
              toolCallId: contentPart.toolCallId,
              toolName: contentPart.toolName,
              args: contentPart.args,
            });
          }
        }
      }
      uiMessages.push({
        id: dbMessage.id,
        role: dbMessage.role as Message['role'],
        content: textContent,
        toolInvocations: toolInvocations,
      });
    }
  }

  // Second pass: process tool messages and update corresponding assistant messages
  for (const dbMessage of dbMessages) {
    if (dbMessage.role === 'tool') {
      const toolMessage = dbMessage as CoreToolMessage;
      for (const toolResult of toolMessage.content) {
        for (const uiMessage of uiMessages) {
          if (uiMessage.toolInvocations) {
            const invocationIndex = uiMessage.toolInvocations.findIndex(
              (inv) => inv.toolCallId === toolResult.toolCallId,
            );
            if (invocationIndex !== -1) {
              uiMessage.toolInvocations[invocationIndex] = {
                ...uiMessage.toolInvocations[invocationIndex],
                state: 'result',
                result: toolResult.result,
              };
            }
          }
        }
      }
    }
  }
  return uiMessages;
}

type ResponseMessageWithoutId = CoreToolMessage | CoreAssistantMessage;
type ResponseMessage = ResponseMessageWithoutId & { id: string };

export async function sanitizeResponseMessages({
  messages,
}: {
  messages: Array<ResponseMessage>;
}) {
  const toolResultIds: Array<string> = [];

  for (const message of messages) {
    if (message.role === 'tool') {
      for (const content of message.content) {
        if (content.type === 'tool-result') {
          toolResultIds.push(content.toolCallId);
        }
      }
    }
  }

  const messagesBySanitizedContent = messages.map((message) => {
    if (message.role !== 'assistant') return message;

    if (typeof message.content === 'string') return message;

    const sanitizedContent = message.content.filter((content) =>
      content.type === 'tool-call'
        ? toolResultIds.includes(content.toolCallId)
        : content.type === 'text'
          ? content.text.length > 0
          : true,
    );



    return {
      ...message,
      content: sanitizedContent,
    };
  });

  return messagesBySanitizedContent.filter(
    (message) => message.content.length > 0,
  );
}

export function sanitizeUIMessages(messages: Array<Message>): Array<Message> {
  const messagesBySanitizedToolInvocations = messages.map((message) => {
    if (message.role !== 'assistant') return message;

    if (!message.toolInvocations) return message;

    const toolResultIds: Array<string> = [];

    for (const toolInvocation of message.toolInvocations) {
      if (toolInvocation.state === 'result') {
        toolResultIds.push(toolInvocation.toolCallId);
      }
    }

    const sanitizedToolInvocations = message.toolInvocations.filter(
      (toolInvocation) =>
        toolInvocation.state === 'result' ||
        toolResultIds.includes(toolInvocation.toolCallId),
    );

    return {
      ...message,
      toolInvocations: sanitizedToolInvocations,
    };
  });

  return messagesBySanitizedToolInvocations.filter(
    (message) =>
      message.content.length > 0 ||
      (message.toolInvocations && message.toolInvocations.length > 0),
  );
}

export function getMostRecentUserMessage(messages: Array<Message>) {
  const userMessages = messages.filter((message) => message.role === 'user');
  return userMessages.at(-1);
}

export function getDocumentTimestampByIndex(
  documents: Array<Document>,
  index: number,
) {
  if (!documents) return new Date();
  if (index > documents.length) return new Date();

  return documents[index].createdAt;
}
