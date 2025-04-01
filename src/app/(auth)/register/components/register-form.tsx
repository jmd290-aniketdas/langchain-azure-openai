"use client";

import {
  credentialsRegister,
  credentialsSignIn,
} from "@/actions/auth.server.actions";
import {
  DEFAULT_PASSKEY_REGISTER_ROUTE,
  DEFAULT_PREPROCESS_ROUTE,
} from "@/lib/environment-variables";
import { cn } from "@/lib/utils";
import {
  registerSchema,
  RegisterSchema,
} from "@/lib/validators/register-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { browserSupportsWebAuthn } from "@simplewebauthn/browser";
import { Fingerprint, Loader2, Power, PowerOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";

export default function RegisterForm({ className }: { className?: string }) {
  const router = useRouter();
  const [isRegisterPasskeyEnabled, setRegisterPasskeyEnabled] =
    useState<boolean>(false);
  const [isWebAuthNSupported, setWebAuthNSupported] = useState<boolean>(false);
  useEffect(() => {
    setWebAuthNSupported(browserSupportsWebAuthn());
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: RegisterSchema) => {
    try {
      await credentialsRegister(data);
      toast.success("Successfully Registered with Credentials");
      await credentialsSignIn(data);
      toast.success("Successfully Signed In with Credentials");

      if (isRegisterPasskeyEnabled) {
        router.push(DEFAULT_PASSKEY_REGISTER_ROUTE);
      } else {
        router.push(DEFAULT_PREPROCESS_ROUTE);
      }
    } catch (error) {
      const e = error as Error;
      if (e.message !== "NEXT_REDIRECT") {
        console.error(e);
        toast.error(e.message);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("grid gap-2", className)}
      autoComplete="off"
    >
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="John Doe"
          {...register("name")}
        />
        <p
          className={cn(
            "text-destructive text-xs text-end font-medium opacity-0 transition-[opacity,height] h-0",
            !!errors.name && "opacity-100 h-4"
          )}
        >
          {errors.name?.message}
        </p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          {...register("email")}
        />
        <p
          className={cn(
            "text-destructive text-xs text-end font-medium opacity-0 transition-[opacity,height] h-0",
            !!errors.email && "opacity-100 h-4"
          )}
        >
          {errors.email?.message}
        </p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" {...register("password")} />
        <p
          className={cn(
            "text-destructive text-xs text-end font-medium opacity-0 transition-[opacity,height] h-0",
            !!errors.password && "opacity-100 h-4"
          )}
        >
          {errors.password?.message}
        </p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="cnfPassword">Confirm Password</Label>
        <Input id="cnfPassword" type="password" {...register("cnfPassword")} />
        <p
          className={cn(
            "text-destructive text-xs text-end font-medium opacity-0 transition-[opacity,height] h-0",
            !!errors.cnfPassword && "opacity-100 h-4"
          )}
        >
          {errors.cnfPassword?.message}
        </p>
      </div>

      <Toggle
        variant="outline"
        type="button"
        pressed={isRegisterPasskeyEnabled}
        onPressedChange={setRegisterPasskeyEnabled}
        className={cn("mb-3", !isWebAuthNSupported && "hidden")}
        disabled={!isWebAuthNSupported}
      >
        <span className="relative h-full w-4">
          <Power
            className={cn(
              "absolute top-1/2 -translate-y-1/2 transition-all rotate-0 scale-100",
              isRegisterPasskeyEnabled && "-rotate-90 scale-0"
            )}
          />
          <PowerOff
            className={cn(
              "absolute top-1/2 -translate-y-1/2 transition-all -rotate-90 scale-0",
              isRegisterPasskeyEnabled && "rotate-0 scale-100"
            )}
          />
        </span>
        {isRegisterPasskeyEnabled ? (
          <p>Disable Passkey Registration</p>
        ) : (
          <p>Enable Passkey Registration</p>
        )}
        <Fingerprint />
      </Toggle>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="animate-spin" /> : "Register"}
      </Button>
    </form>
  );
}
