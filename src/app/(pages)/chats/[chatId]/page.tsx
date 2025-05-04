import { Textarea } from "@/app/(pages)/chats/components/textarea";
import { auth } from "@/auth";
import { DEFAULT_LOGIN_ROUTE } from "@/lib/environment-variables";
import { redirect } from "next/navigation";
import { ChatDisplay } from "../components/chat-display";

export default async function Chat() {
  const session = await auth();
  if (!session) redirect(DEFAULT_LOGIN_ROUTE);

  return (
    <main className="relative h-full w-full place-items-center pt-4 px-6 flex flex-col">
      <div className="relative w-full max-w-256 flex-1 flex flex-col gap-6">
        <ChatDisplay className="flex-1" user={session.user} />
        <Textarea className="flex-none" />
      </div>
    </main>
  );
}
