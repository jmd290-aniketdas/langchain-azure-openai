import { auth } from "@/auth";
import { HeaderSection } from "@/components/custom/header-section";
import { DEFAULT_LOGIN_ROUTE } from "@/lib/environment-variables";
import { Info, Link, Loader2, Trash2 } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { DeleteAccount } from "./components/delete_account";
import { LinkedAccounts } from "./components/linked_accounts";
import { ProfileInformation } from "./components/profile_information";

export default async function AccountSettings() {
  const session = await auth();
  if (!session) redirect(DEFAULT_LOGIN_ROUTE);

  return (
    <main className="relative h-full w-full place-items-center py-4 px-12 md:px-6">
      <section className="max-w-256 w-full min-h-full space-y-6">
        <h1 className="text-2xl font-extralight text-muted-foreground">
          Account Settings
        </h1>
        <section className="space-y-12">
          <HeaderSection
            header={
              <span className="flex gap-2 items-center">
                <Info className="size-4" />
                <p>Profile Information</p>
              </span>
            }
          >
            <ProfileInformation user={session.user} />
          </HeaderSection>

          <HeaderSection
            header={
              <span className="flex gap-2 items-center">
                <Link className="size-4" />
                <p>Linked Accounts</p>
              </span>
            }
          >
            <Suspense
              fallback={<Loader2 className="animate-spin place-self-center" />}
            >
              <LinkedAccounts session={session} />
            </Suspense>
          </HeaderSection>

          <HeaderSection
            header={
              <span className="flex gap-2 items-center">
                <Trash2 className="size-4" />
                <p>Delete Account</p>
              </span>
            }
          >
            <DeleteAccount session={session} />
          </HeaderSection>
        </section>
      </section>
    </main>
  );
}
