import { auth } from "@/auth";
import { Textarea } from "@/app/(pages)/chats/components/textarea";
import { DEFAULT_LOGIN_ROUTE } from "@/lib/environment-variables";
import { redirect } from "next/navigation";
import { ChatDisplay } from "../components/chat-display";

export default async function Chat({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const session = await auth();
  if (!session) redirect(DEFAULT_LOGIN_ROUTE);

  const { chatId } = await params;

  return (
    <main className="relative h-full w-full place-items-center pt-4 px-6 flex flex-col">
      <div className="relative max-w-[min(calc(100vw-3rem),64rem)] md:max-w-256 w-full flex-1 flex flex-col gap-6">
        <ChatDisplay className="flex-1"></ChatDisplay>
        <Textarea className="flex-none" />
      </div>
    </main>
  );
}
