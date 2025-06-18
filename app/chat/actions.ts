'use server';

import { generateText, Message } from 'ai';
import { cookies } from 'next/headers';
import { getActiveModel } from '@/lib/ai/models';

import {
  deleteMessagesByChatIdAfterTimestamp,
  getMessageById,
  updateChatVisiblityById,
} from '@/lib/db/queries';
import { VisibilityType } from '@/components/visibility-selector';


export async function saveChatModelAsCookie(model: string) {
  const cookieStore = await cookies();
  cookieStore.set('chat-model', model);
}

export async function generateTitleFromUserMessage({
  message,
}: {
  message: Message;
}) {
  const model = await getActiveModel();
  const { text: title } = await generateText({
    model: model,
    system: `\n
    - You will generate a short and engaging title based on the user's first message.
    - Ensure the title is not more than 80 characters long.
    - The title should summarize the user's message with a focus on sexual reproductive health.
    - If relevant, tailor the title to topics specific to Uganda, such as:
      - Family planning methods available in Uganda
      - Safe sex education and STI prevention in Uganda
      - Teenage pregnancy awareness and support in Uganda
      - Reproductive health rights and services in Uganda
      - Access to contraception and reproductive health clinics
    - Do not use quotes, colons, or unnecessary punctuation.
    - Keep the tone informative and engaging.`,
    prompt: JSON.stringify(message),
  });

  return title;
}

export async function deleteTrailingMessages({ id }: { id: string }) {
  const [message] = await getMessageById({ id });

  await deleteMessagesByChatIdAfterTimestamp({
    chatId: message.chatId,
    timestamp: message.createdAt,
  });
}

export async function updateChatVisibility({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: VisibilityType;
}) {
  await updateChatVisiblityById({ chatId, visibility });
}
