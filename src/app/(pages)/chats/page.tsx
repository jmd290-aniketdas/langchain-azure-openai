import { auth, signOut } from "@/auth";
import { ThemeToggle } from "@/components/custom/theme-toggle";
import { Button } from "@/components/ui/button";
import { DEFAULT_LOGIN_ROUTE } from "@/lib/environment-variables";
import { redirect } from "next/navigation";

export default async function Query() {
  const session = await auth();
  if (!session) redirect(DEFAULT_LOGIN_ROUTE);

  return (
    <main className="relative h-full">
      <section className="size-full flex flex-col items-center justify-center gap-3">
        <h1 className="capitalize text-9xl font-extrabold text-muted">Chats</h1>
        <ThemeToggle />
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: DEFAULT_LOGIN_ROUTE });
          }}
        >
          <Button type="submit" variant="outline">
            Sign Out
          </Button>
        </form>
      </section>
    </main>
  );
}
