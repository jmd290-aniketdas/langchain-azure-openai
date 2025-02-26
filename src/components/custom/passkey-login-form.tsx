"use client";

import {
  generateWebAuthNAuthenticationOptions,
  passkeySignIn,
  saveWebAuthNAutenticationResponse,
  verifyWebAuthNAuthenticationResponse,
} from "@/actions/auth.server";
import { addDateTime, cn } from "@/lib/utils";
import { startAuthentication } from "@simplewebauthn/browser";
import { Fingerprint } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { signIn } from "@/auth";

export default function PasskeyLoginForm({
  className,
}: {
  className?: string;
}) {
  const router = useRouter();
  const { update } = useSession();

  const onClick = async () => {
    try {
      const optionsJSON = await generateWebAuthNAuthenticationOptions();
      const attestation = await startAuthentication({ optionsJSON });
      const verification = await verifyWebAuthNAuthenticationResponse(
        attestation,
        optionsJSON
      );
      const authenticator_user = await saveWebAuthNAutenticationResponse(
        verification
      );

      await passkeySignIn({
        email: authenticator_user.user.email,
        credentialId: authenticator_user.credentialID,
      });

      toast.success("Successfully Signed in with Passkey");
      router.push("/query");
    } catch (error) {
      const e = error as Error;
      if (e.message !== "NEXT_REDIRECT") {
        console.error(e);
        toast.error(e.message);
      }
    }
  };

  return (
    <Button
      type="submit"
      variant="outline"
      className={cn("w-full", className)}
      onClick={onClick}
    >
      <Fingerprint />
      Login with Passkey
    </Button>
  );
}
