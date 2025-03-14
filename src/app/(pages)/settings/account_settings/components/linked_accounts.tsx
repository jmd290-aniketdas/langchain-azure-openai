import { fetchUserLinkedAccountProviders } from "@/actions/users.actions";
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
import { DEFAULT_LOGIN_ROUTE } from "@/lib/environment-variables";
import { cn } from "@/lib/utils";
import { CheckCircle2, CircleX } from "lucide-react";
import { Session } from "next-auth";
import { redirect } from "next/navigation";

export async function LinkedAccounts({ session }: { session: Session }) {
  if (!session.user?.email) redirect(DEFAULT_LOGIN_ROUTE);

  const linkedAccountProviders = await fetchUserLinkedAccountProviders(
    session.user?.email
  );

  const googleLinked = linkedAccountProviders.includes("google");
  const microsoftLinked = linkedAccountProviders.includes("microsoft");
  const githubLinked = linkedAccountProviders.includes("github");

  return (
    <section className="space-y-2">
      <Card className="flex gap-3 justify-between items-center">
        <CardHeader className="flex-row items-center gap-4 p-3">
          <CardTitle className="bg-muted rounded-md size-8 place-content-center place-items-center">
            <Google />
          </CardTitle>
          <CardDescription className="text-primary">Google</CardDescription>
        </CardHeader>
        <CardContent className="p-3">
          <Button size="sm" variant="outline" className="cursor-not-allowed">
            {googleLinked ? (
              <CheckCircle2 className="stroke-primary" />
            ) : (
              <CircleX className="stroke-destructive" />
            )}
            <p
              className={cn(googleLinked ? "text-primary" : "text-destructive")}
            >
              {googleLinked ? "Connected" : "Not Connected"}
            </p>
          </Button>
        </CardContent>
      </Card>
      <Card className="flex gap-3 justify-between items-center">
        <CardHeader className="flex-row items-center gap-4 p-3">
          <CardTitle className="bg-muted rounded-md size-8 place-content-center place-items-center">
            <Microsoft />
          </CardTitle>
          <CardDescription className="text-primary">Microsoft</CardDescription>
        </CardHeader>
        <CardContent className="p-3">
          <Button size="sm" variant="outline" className="cursor-not-allowed">
            {microsoftLinked ? (
              <CheckCircle2 className="stroke-primary" />
            ) : (
              <CircleX className="stroke-destructive" />
            )}
            <p
              className={cn(
                microsoftLinked ? "text-primary" : "text-destructive"
              )}
            >
              {microsoftLinked ? "Connected" : "Not Connected"}
            </p>
          </Button>
        </CardContent>
      </Card>
      <Card className="flex gap-3 justify-between items-center">
        <CardHeader className="flex-row items-center gap-4 p-3">
          <CardTitle className="bg-muted rounded-md size-8 place-content-center place-items-center">
            <Github />
          </CardTitle>
          <CardDescription className="text-primary">Github</CardDescription>
        </CardHeader>
        <CardContent className="p-3">
          <Button size="sm" variant="outline" className="cursor-not-allowed">
            {githubLinked ? (
              <CheckCircle2 className="stroke-primary" />
            ) : (
              <CircleX className="stroke-destructive" />
            )}
            <p
              className={cn(githubLinked ? "text-primary" : "text-destructive")}
            >
              {githubLinked ? "Connected" : "Not Connected"}
            </p>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
