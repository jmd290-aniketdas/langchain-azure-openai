import { auth, signIn } from "@/auth";
import RegisterForm from "@/app/(auth)/register/components/register-form";
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
import { DEFAULT_LOGGED_IN_ROUTE, DEFAULT_LOGIN_ROUTE } from "@/lib/environment-variables";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Register() {
  const session = await auth();
  if (session) redirect(DEFAULT_LOGGED_IN_ROUTE);

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome</CardTitle>
        <CardDescription>
          Register with your Microsoft, Google, or GitHub account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          {/* Social Sign In Buttons */}
          <div className="flex flex-col gap-4">
            {/* Microsoft */}
            <form
              action={async () => {
                "use server";
                await signIn("microsoft-entra-id", { redirectTo: DEFAULT_LOGGED_IN_ROUTE });
              }}
              className="w-full"
            >
              <Button variant="outline" className="w-full">
                <Microsoft />
                Register with Microsoft
              </Button>
            </form>

            {/* Google */}
            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: DEFAULT_LOGGED_IN_ROUTE });
              }}
              className="w-full"
            >
              <Button variant="outline" className="w-full">
                <Google />
                Register with Google
              </Button>
            </form>

            {/* GitHub */}
            <form
              action={async () => {
                "use server";
                await signIn("github", { redirectTo: DEFAULT_LOGGED_IN_ROUTE });
              }}
              className="w-full"
            >
              <Button variant="outline" className="w-full">
                <Github />
                Register with GitHub
              </Button>
            </form>
          </div>

          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>

          {/* Credentials Register Form (with react-hook-form + Zod) */}
          <RegisterForm />

          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href={DEFAULT_LOGIN_ROUTE} className="underline underline-offset-4">
              Sign in
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
