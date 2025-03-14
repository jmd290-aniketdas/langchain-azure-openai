import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { PasskeyRegisterForm } from "@/app/(auth)/register/passkey/components/passkey-register-form";
import { DEFAULT_LOGIN_ROUTE } from "@/lib/environment-variables";

export default async function Passkey() {
  const session = await auth();
  if(!session) redirect(DEFAULT_LOGIN_ROUTE);

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Passkey</CardTitle>
        <CardDescription>Register with your Passkey</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <PasskeyRegisterForm />
      </CardContent>
      <CardFooter className="text-center">
        Click on the button above to initiate registration.
      </CardFooter>
    </Card>
  );
}
