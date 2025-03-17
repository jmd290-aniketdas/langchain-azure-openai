import { auth } from "@/auth";
import { HeaderSection } from "@/components/custom/header-section";
import { DEFAULT_LOGIN_ROUTE } from "@/lib/environment-variables";
import { KeyRound, Loader2, Lock, Shield } from "lucide-react";
import { redirect } from "next/navigation";
import { ChangePassword } from "./components/change_password";
import { RegisterPasskey } from "./components/register-passkey";
import { Manage2FA } from "./components/manage-2fa";
import { Suspense } from "react";

export default async function PrivactAmpSecurity() {
  const session = await auth();
  if (!session || !session.user) {
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
            <RegisterPasskey user={session.user} />
          </HeaderSection>

          <HeaderSection
            header={
              <span className="flex gap-2 items-center">
                <Shield className="size-4" />
                <p>Manage Two Factor Authentication</p>
              </span>
            }
          >
            <Suspense
              fallback={<Loader2 className="animate-spin place-self-center" />}
            >
              <Manage2FA user={session.user} />
            </Suspense>
          </HeaderSection>

          <HeaderSection
            header={
              <span className="flex gap-2 items-center">
                <Lock className="size-4" />
                <p>Change Password</p>
              </span>
            }
          >
            <ChangePassword user={session.user} />
          </HeaderSection>
        </section>
      </section>
    </main>
  );
}
