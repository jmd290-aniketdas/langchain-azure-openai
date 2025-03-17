"use client";

import {
  generateWebAuthNRegistrationOptions,
  saveWebAuthNRegistrationResponse,
  verifyWebAuthNRegistrationResponse,
} from "@/actions/auth.server.actions";
import { fetchUserAuthenticators } from "@/actions/users.actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { camelToCapitalized, cn } from "@/lib/utils";
import { Authenticator } from "@/types/users.types";
import { startRegistration } from "@simplewebauthn/browser";
import { Fingerprint, KeyRound, Loader2 } from "lucide-react";
import { User } from "next-auth";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function RegisterPasskey({ user }: { user: User }) {
  const [authenticators, setAuthenticators] = useState<Authenticator[]>([]);
  const [loadingAuthenticators, setLoadingAutheticators] =
    useState<boolean>(true);
  const [isSubmitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (!user?.email) {
      toast.error("No Email present in session user");
      setLoadingAutheticators(false);
      return;
    }

    fetchUserAuthenticators(user.email)
      .then((res) => setAuthenticators(res))
      .catch((e) => {
        console.error(e.message);
        toast.error(e.message);
      })
      .finally(() => setLoadingAutheticators(false));
  }, []);

  const onClick = async () => {
    setSubmitting(true);
    try {
      if (!user?.email) {
        toast.error("No Email present in session user");
        return;
      }

      const optionsJSON = await generateWebAuthNRegistrationOptions(user.email);
      const attestation = await startRegistration({ optionsJSON });
      const verification = await verifyWebAuthNRegistrationResponse(
        user.email,
        attestation,
        optionsJSON
      );
      await saveWebAuthNRegistrationResponse(user.email, verification);

      toast.success("Successfully Registered with Passkey");

      const authenticators = await fetchUserAuthenticators(user.email);
      setAuthenticators(authenticators);
    } catch (error) {
      const e = error as Error;
      if (e.message !== "NEXT_REDIRECT") {
        console.error(e);
        toast.error(e.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="space-y-4">
      <section className="text-xs text-muted-foreground">
        <p>
          Passkeys provide a secure and password-free way to sign in to your
          account.
        </p>
        <ol className="list-decimal list-inside">
          <li>
            <span className="font-medium text-primary">
              Register Your Device
            </span>{" "}
            - Click the &apos;Register Passkey&apos; button below to securely
            link your device to your account.
          </li>
          <li>
            <span className="font-medium text-primary">
              Confirm with Biometrics
            </span>{" "}
            - Use Face ID, Touch ID, or a security key to authenticate.
          </li>
          <li>
            <span className="font-medium text-primary">Sign In Seamlessly</span>{" "}
            - Next time, you can log in with your passkey without needing a
            password.
          </li>
        </ol>
        <p>
          Passkeys are stored securely on your device and prevent phishing
          attacks, making your account more secure.
        </p>
      </section>
      <section className="space-y-2">
        {loadingAuthenticators ? (
          <section className="flex gap-3 items-center min-w-64">
            <section className="bg-muted size-9 place-items-center place-content-center rounded-md">
              <Loader2 className="size-4 animate-spin" />
            </section>
            <p className="capitalize text-xs text-muted-foreground">
              Loading Authenticators
            </p>
          </section>
        ) : (
          <p className="text-xs text-muted-foreground">
            {authenticators.length > 0
              ? `${authenticators.length} Authenticator${
                  authenticators.length !== 1 ? "s" : ""
                } linked to this account`
              : "No Authenticators linked to this account"}
          </p>
        )}
        <section
          className={cn(
            "grid md:grid-cols-3 gap-2",
            authenticators.length === 0 && "hidden"
          )}
        >
          {authenticators.map((auth, i) => (
            <section className="flex gap-3 items-center min-w-64" key={i}>
              <section className="bg-muted size-9 place-items-center place-content-center rounded-md">
                <KeyRound className="size-4" />
              </section>
              <section className="flex flex-col gap-1">
                <p className="text-xs font-medium text-muted-foreground">
                  {camelToCapitalized(auth.credentialDeviceType)} Passkey
                </p>
                <p className="text-xs">
                  Used {auth.counter} Time{auth.counter !== 1 ? "s" : ""}
                </p>
              </section>
            </section>
          ))}
        </section>
      </section>

      <section className="flex gap-3 items-center">
        <Button
          variant="outline"
          size="icon"
          id="register-button"
          disabled={isSubmitting}
          onClick={onClick}
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Fingerprint />
          )}
          <p className="sr-only">Register</p>
        </Button>
        <Label htmlFor="register-button" className="font-normal">
          Register a new Passkey
        </Label>
      </section>
    </section>
  );
}
