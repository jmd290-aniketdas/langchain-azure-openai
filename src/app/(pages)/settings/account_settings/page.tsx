import { auth } from "@/auth";
import { Separator } from "@/components/ui/separator";
import { DEFAULT_LOGIN_ROUTE } from "@/lib/environment-variables";
import { redirect } from "next/navigation";
import { ChangePassword } from "./components/change_password";
import { DeleteAccount } from "./components/delete_account";
import { LinkedAccounts } from "./components/linked_accounts";
import { ProfileInformation } from "./components/profile_information";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default async function AccountSettings() {
  const session = await auth();
  if (!session) {
    redirect(DEFAULT_LOGIN_ROUTE);
  }

  return (
    <main className="relative h-full w-full place-items-center py-4 px-12 md:px-6">
      <section className="max-w-256 w-full min-h-full space-y-6">
        <h1 className="text-sm font-light text-muted-foreground">
          Account Settings
        </h1>
        <section className="space-y-12">
          <section className="space-y-4">
            <section className="space-y-1">
              <h2 className="text tracking-wider text-muted-foreground">
                Profile Information
              </h2>
              <Separator />
            </section>
            <ProfileInformation session={session} />
          </section>

          <section className="space-y-4">
            <section className="space-y-1">
              <h2 className="text tracking-wider text-muted-foreground">
                Change Password
              </h2>
              <Separator />
            </section>
            <ChangePassword session={session} />
          </section>

          <section className="space-y-4">
            <section className="space-y-1">
              <h2 className="text tracking-wider text-muted-foreground">
                Linked Accounts
              </h2>
              <Separator />
            </section>
            <Suspense fallback={<Loader2 className="animate-spin place-self-center" />}>
              <LinkedAccounts session={session} />
            </Suspense>
          </section>

          <section className="space-y-4">
            <section className="space-y-1">
              <h2 className="text tracking-wider text-muted-foreground">
                Delete Account
              </h2>
              <Separator />
            </section>
            <DeleteAccount session={session} />
          </section>
        </section>
      </section>
    </main>
  );
}
