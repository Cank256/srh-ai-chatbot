import { cookies } from 'next/headers';

import { Chat } from '@/components/chat';
import { getDefaultChatModel } from '@/lib/ai/models';
import { generateUUID } from '@/lib/server-utils';
import { DataStreamHandler } from '@/components/data-stream-handler';

export default async function Page() {
  const id = await generateUUID();
  const defaultModel = await getDefaultChatModel();

  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get('chat-model');

  if (!modelIdFromCookie) {
    return (
      <>
        <Chat
          key={id}
          id={id}
          initialMessages={[]}
          selectedChatModel={defaultModel}
          selectedVisibilityType="private"
          isReadonly={false}
        />
        <DataStreamHandler id={id} />
      </>
    );
  }

  return (
    <>
      <Chat
        key={id}
        id={id}
        initialMessages={[]}
        selectedChatModel={modelIdFromCookie.value}
        selectedVisibilityType="private"
        isReadonly={false}
      />
      <DataStreamHandler id={id} />
    </>
  );
}
