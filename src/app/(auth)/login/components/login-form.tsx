"use client";

import {
  credentialSignInWithMFA,
  credentialsSignIn,
  integratedSignIn,
} from "@/actions/auth.server.actions";
import { is2FAEnabled } from "@/actions/users.actions";
import { DEFAULT_LOGGED_IN_ROUTE } from "@/lib/environment-variables";
import { cn } from "@/lib/utils";
import { signInSchema, SignInSchema } from "@/lib/validators/signin-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { MultiFactorAuthDialog } from "./multi-factor-auth-dialog";

export default function LoginForm({ className }: { className?: string }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
  });
  const [TOTPDialogOpen, setTOTPDialogOpen] = useState<boolean>(false);
  const totpPromiseResolver = useRef<
    | (({ totp, backupCode }: { totp: string; backupCode: string }) => void)
    | null
  >(null);

  // Function that returns a promise which resolves with the totp value
  const waitForTOTP = () => {
    return new Promise<{ totp: string; backupCode: string }>((resolve) => {
      totpPromiseResolver.current = resolve;
      setTOTPDialogOpen(true);
    });
  };

  // Call this when the dialog is submitted
  const handleTOTPSubmit = ({
    totp,
    backupCode,
  }: {
    totp: string;
    backupCode: string;
  }) => {
    if (totpPromiseResolver.current) {
      totpPromiseResolver.current({ totp, backupCode });
      totpPromiseResolver.current = null;
    }
    setTOTPDialogOpen(false);
  };

  // Effect to cancel waiting if the dialog is closed externally
  useEffect(() => {
    if (!TOTPDialogOpen && totpPromiseResolver.current) {
      // Resolve with an empty string to indicate cancellation
      totpPromiseResolver.current({ totp: "", backupCode: "" });
      totpPromiseResolver.current = null;
    }
  }, [TOTPDialogOpen]);

  const onSubmit = async (data: SignInSchema) => {
    try {
      const multiFactorEnabled = await is2FAEnabled(data.email);
      if (multiFactorEnabled) {
        const { totp, backupCode } = await waitForTOTP();
        if (!totp && !backupCode)
          throw new Error(
            "TOTP or Backup Code input was canceled or not provided."
          );
        await integratedSignIn({
          provider: "credentialsMFA",
          credentialsMFAData: { ...data, totp, backupCode },
        });
      } else {
        await integratedSignIn({
          provider: "credentialsMFA",
          credentialsData: data,
        });
      }

      toast.success("Successfully Signed In with Credentials");
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("grid gap-2", className)}
      autoComplete="off"
    >
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          autoComplete="off"
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
        <div className="flex items-center">
          <Label htmlFor="password">Password</Label>
          <a
            href="#"
            className="ml-auto text-sm underline-offset-4 hover:underline"
          >
            Forgot your password?
          </a>
        </div>
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

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="animate-spin" /> : "Login"}
      </Button>

      <MultiFactorAuthDialog
        open={TOTPDialogOpen}
        setOpen={setTOTPDialogOpen}
        onSubmit={handleTOTPSubmit}
      />
    </form>
  );
}
