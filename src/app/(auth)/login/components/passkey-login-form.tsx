"use client";

import {
  generateWebAuthNAuthenticationOptions,
  passkeySignIn,
  saveWebAuthNAutenticationResponse,
  verifyWebAuthNAuthenticationResponse,
} from "@/actions/auth.server.actions";
import { cn } from "@/lib/utils";
import {
  browserSupportsWebAuthn,
  startAuthentication,
} from "@simplewebauthn/browser";
import { Fingerprint } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../../../../components/ui/button";
import { useState, useEffect } from "react";
import { DEFAULT_LOGGED_IN_ROUTE } from "@/lib/environment-variables";

export default function PasskeyLoginForm({
  className,
}: {
  className?: string;
}) {
  const router = useRouter();
  const [isWebAuthNSupported, setWebAuthNSupported] = useState<boolean>(false);
  useEffect(() => {
    setWebAuthNSupported(browserSupportsWebAuthn());
  }, []);

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
      router.push(DEFAULT_LOGGED_IN_ROUTE);
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
      className={cn(
        "w-full",
        className,
        !isWebAuthNSupported && "hidden"
      )}
      disabled={!isWebAuthNSupported}
      onClick={onClick}
    >
      <Fingerprint />
      Login with Passkey
    </Button>
  );
}
