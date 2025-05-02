import { Textarea } from "@/app/(pages)/chats/components/textarea";
import { auth } from "@/auth";
import Logo from "@/components/custom/logo";
import { DEFAULT_LOGIN_ROUTE } from "@/lib/environment-variables";
import { redirect } from "next/navigation";

export default async function Chat() {
  const session = await auth();
  if (!session) redirect(DEFAULT_LOGIN_ROUTE);

  return (
    <main className="relative h-full w-full place-items-center pt-4 md:px-6 flex flex-col">
      <div className="relative max-w-[min(100vw,64rem)] md:max-w-256 w-full flex-1 flex flex-col gap-6">
        <div className="flex-1 place-content-center place-items-center px-1 md:px-3 space-y-1">
          <span className="flex flex-col md:flex-row gap-1 md:gap-2 items-center -ml-10">
            <Logo variant="ghost" size="lg" />
            <h1 className="text-4xl font-medium tracking-tight text-center">
              Welcome, {session.user.name}!
            </h1>
          </span>
          <p className="text-sm font-light tracking-wide text-center">
            How can I help you today?
          </p>
        </div>
        <Textarea className="flex-none" />
      </div>
    </main>
  );
}
