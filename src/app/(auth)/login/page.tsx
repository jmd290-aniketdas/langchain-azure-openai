import { auth, signIn } from "@/auth";
import LoginForm from "@/app/(auth)/login/components/login-form";
import PasskeyLoginForm from "@/app/(auth)/login/components/passkey-login-form";
import { Github } from "@/components/svgs/github";
import { Google } from "@/components/svgs/google";
import { Microsoft } from "@/components/svgs/microsoft";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DEFAULT_LOGGED_IN_ROUTE,
  DEFAULT_REGISTER_ROUTE,
} from "@/lib/environment-variables";
import Link from "next/link";
import { redirect } from "next/navigation";
import { integratedSignIn } from "@/actions/auth.server.actions";

export default async function Login() {
  const session = await auth();
  if (session) redirect(DEFAULT_LOGGED_IN_ROUTE);

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription>
          Login with your Microsoft or Google or Github account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          {/* Provider Sign-In Buttons */}
          <div className="flex flex-col gap-4">
            {/* Microsoft */}
            <form
              action={async () => {
                "use server";
                await integratedSignIn({ provider: "microsoft-entra-id" });
              }}
              className="w-full"
            >
              <Button variant="outline" className="w-full">
                <Microsoft />
                Login with Microsoft
              </Button>
            </form>

            {/* Google */}
            <form
              action={async () => {
                "use server";
                await integratedSignIn({ provider: "google" });
              }}
              className="w-full"
            >
              <Button variant="outline" className="w-full">
                <Google />
                Login with Google
              </Button>
            </form>

            {/* GitHub */}
            <form
              action={async () => {
                "use server";
                await integratedSignIn({ provider: "github" });
              }}
              className="w-full"
            >
              <Button variant="outline" className="w-full">
                <Github />
                Login with GitHub
              </Button>
            </form>

            {/* Passkey Login */}
            <PasskeyLoginForm />
          </div>

          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>

          {/* Credentials Login Form */}
          <LoginForm />

          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href={DEFAULT_REGISTER_ROUTE}
              className="underline underline-offset-4"
            >
              Sign up
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
