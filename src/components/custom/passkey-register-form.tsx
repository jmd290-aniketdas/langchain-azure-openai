"use client";

import {
  generateWebAuthNRegistrationOptions,
  saveWebAuthNRegistrationResponse,
  verifyWebAuthNRegistrationResponse,
} from "@/actions/auth.server";
import { cn } from "@/lib/utils";
import { startRegistration } from "@simplewebauthn/browser";
import { Fingerprint } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";

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
      className={cn("size-48", className)}
      variant="ghost"
      onClick={onClick}
    >
      <Fingerprint className="size-full stroke-1" />
    </Button>
  );
};
