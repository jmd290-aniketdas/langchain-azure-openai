import { HeaderSection } from "@/components/custom/header-section";
import { ChangePassword } from "./components/change_password";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DEFAULT_LOGIN_ROUTE } from "@/lib/environment-variables";
import { RegisterPasskey } from "./components/register-passkey";
import { KeyRound, Lock } from "lucide-react";

export default async function PrivactAmpSecurity() {
  const session = await auth();
  if (!session) {
    redirect(DEFAULT_LOGIN_ROUTE);
  }
  return (
    <main className="relative h-full w-full place-items-center py-4 px-12 md:px-6">
      <section className="max-w-256 w-full min-h-full space-y-6">
        <h1 className="text-sm font-light text-muted-foreground">
          Privacy & Security
        </h1>

        <section className="space-y-12">
          <HeaderSection
            header={
              <span className="flex gap-2 items-center">
                <KeyRound className="size-4" />
                <p>Register Passkey</p>
              </span>
            }
          >
            <RegisterPasskey session={session} />
          </HeaderSection>

          <HeaderSection
            header={
              <span className="flex gap-2 items-center">
                <Lock className="size-4" />
                <p>Change Password</p>
              </span>
            }
          >
            <ChangePassword session={session} />
          </HeaderSection>
        </section>
      </section>
    </main>
  );
}
