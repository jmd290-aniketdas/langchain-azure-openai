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
import { HeaderSection } from "@/components/custom/header-section";

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
          <HeaderSection header="Profile Information">
            <ProfileInformation session={session} />
          </HeaderSection>

          <HeaderSection header="Change Password">
            <ChangePassword session={session} />
          </HeaderSection>

          <HeaderSection header="Linked Accounts">
            <Suspense
              fallback={<Loader2 className="animate-spin place-self-center" />}
            >
              <LinkedAccounts session={session} />
            </Suspense>
          </HeaderSection>

          <HeaderSection header="Delete Account">
            <DeleteAccount session={session} />
          </HeaderSection>
        </section>
      </section>
    </main>
  );
}
