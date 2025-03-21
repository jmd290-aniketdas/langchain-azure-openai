"use client";

import {
  generateWebAuthNRegistrationOptions,
  saveWebAuthNRegistrationResponse,
  verifyWebAuthNRegistrationResponse,
} from "@/actions/auth.server.actions";
import { DEFAULT_PREPROCESS_ROUTE } from "@/lib/environment-variables";
import { cn } from "@/lib/utils";
import {
  browserSupportsWebAuthn,
  startRegistration,
} from "@simplewebauthn/browser";
import { Fingerprint } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "../../../../../components/ui/button";

export const PasskeyRegisterForm = ({ className }: { className?: string }) => {
  const router = useRouter();
  const { update } = useSession();

  const onClick = async () => {
    try {
      const session = await update();
      const email = session?.user?.email;
      if (!email) return;

      const optionsJSON = await generateWebAuthNRegistrationOptions(email);
      const attestation = await startRegistration({ optionsJSON });
      const verification = await verifyWebAuthNRegistrationResponse(
        email,
        attestation,
        optionsJSON
      );
      await saveWebAuthNRegistrationResponse(email, verification);

      toast.success("Successfully Registered with Passkey");
      router.push(DEFAULT_PREPROCESS_ROUTE);
    } catch (error) {
      const e = error as Error;
      if (e.message !== "NEXT_REDIRECT") {
        console.error(e);
        toast.error(e.message);
      }
    }
  };
  useEffect(() => {
    if (!browserSupportsWebAuthn()) {
      toast.warning("Browser doesnot support WebAuthN");
      router.push(DEFAULT_PREPROCESS_ROUTE);
    }
  }, []);

  return (
    <Button
      className={cn("size-48", className)}
      variant="ghost"
      onClick={onClick}
    >
      <Fingerprint className="size-full stroke-1" />
    </Button>
  );
};
