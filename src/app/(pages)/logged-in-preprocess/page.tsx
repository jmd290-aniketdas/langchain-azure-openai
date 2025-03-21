import { createBucketForUserIfNotExists } from "@/actions/files.actions";
import { auth } from "@/auth";
import {
  DEFAULT_LOGGED_IN_ROUTE,
  DEFAULT_LOGIN_ROUTE,
} from "@/lib/environment-variables";
import { redirect } from "next/navigation";

export default async function LoggedInPreprocess() {
  const session = await auth();
  if (!session) redirect(DEFAULT_LOGIN_ROUTE);
  await createBucketForUserIfNotExists(session.user.email);
  redirect(DEFAULT_LOGGED_IN_ROUTE);

  return <main>Welcome</main>;
}
