"use client";

import { MFAActivate } from "@/actions/auth.server.actions";
import { delete2FA, set2FAStatus } from "@/actions/users.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { copyToClipboard } from "@/lib/utils";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { CircleCheck, Loader2 } from "lucide-react";
import { User } from "next-auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function Activate2FAForm({
  secret,
  user,
}: {
  secret: string;
  user: User;
}) {
  const router = useRouter();
  const [totp, setTotp] = useState<string>("");
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    if (!user.email) {
      toast.error("User doesn't have registered email");
      return;
    }
    try {
      await MFAActivate(totp, secret, user.email);
      toast.success("2FA is activated via the Authenticator app");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error((error as Error).message);
    } finally {
      setSubmitting(false);
      setTotp("");
    }
  };
  return (
    <form
      className="flex flex-col gap-2 items-center md:items-start"
      onSubmit={onSubmit}
    >
      <Label htmlFor="totp-input">Enter TOTP to activate 2FA</Label>
      <InputOTP
        maxLength={6}
        id="totp-input"
        pattern={REGEXP_ONLY_DIGITS}
        value={totp}
        onChange={(value) => setTotp(value)}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>
            <CircleCheck />
            Activate
          </>
        )}
      </Button>
    </form>
  );
}

export function CopyBackupCode2FA({
  backupCodes,
  className,
}: {
  backupCodes: string;
  className?: string;
}) {
  const onClick = async () => {
    try {
      await copyToClipboard(backupCodes);
      toast.success(
        <section className="flex items-center gap-3">
          <p>Copied to Clipboard</p>
          <code>{backupCodes}</code>
        </section>
      );
    } catch (error) {
      console.error(error);
      toast.error((error as Error).message);
    }
  };
  return (
    <section className={className}>
      <Label htmlFor="backup-code">
        <p>Backup Code:</p>
        <p className="text-xs text-muted-foreground">
          Save this in a secure location.
        </p>
      </Label>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" onClick={onClick} id="backup-code">
            {backupCodes.slice(0, 4) +
              "-" +
              backupCodes.slice(4, 8) +
              "-" +
              backupCodes.slice(8)}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">Click to copy</TooltipContent>
      </Tooltip>
    </section>
  );
}

export function Toggle2FAForm({
  user,
  is2FAEnabled,
  className,
}: {
  user: User;
  is2FAEnabled: boolean;
  className?: string;
}) {
  const [mfaStatus, setMfaStatus] = useState<boolean>(is2FAEnabled);
  const onCheckedChange = async (value: boolean) => {
    try {
      if (!user.email) throw new Error("Email not available in logged in user");
      setMfaStatus(value);
      await set2FAStatus(user.email, value);
      toast.success(
        `Two Factor Authentication ${
          value ? "enabled" : "disabled"
        } successfully`
      );
    } catch (error) {
      console.error(error);
      toast.error((error as Error).message);
    }
  };
  return (
    <section className={className}>
      <Label htmlFor="mfa-status">
        <p>{mfaStatus ? "Disable" : "Enable"} MFA for this account</p>
        <p className="text-xs text-muted-foreground">
          You can Enable and Disable anytime.
        </p>
      </Label>
      <Switch
        checked={mfaStatus}
        onCheckedChange={onCheckedChange}
        id="mfa-status"
      />
    </section>
  );
}

export function Delete2FA({
  user,
  className,
}: {
  user: User;
  className?: string;
}) {
  const [consented, setConsented] = useState<boolean>(false);
  const onClick = async () => {
    try {
      if (!user.email) throw new Error("Email not available in logged in user");
      await delete2FA(user.email);
      toast.success("Two Factor Authentication deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error((error as Error).message);
    }
  };
  return (
    <section className={className}>
      <Label htmlFor="delete-mfa">
        <p>Delete Two Factor Authentication for this account.</p>
        <p className="text-xs text-muted-foreground">
          This action cannot be undone.
        </p>
      </Label>
      <section className="space-y-2">
        <span className="flex gap-2 items-center">
          <Input
            type="checkbox"
            id="confirm-delete-mfa"
            className="size-4"
            checked={consented}
            onChange={(e) => setConsented(e.target.checked)}
          />
          <Label htmlFor="confirm-delete-mfa" className="text-sm">
            Are you sure you want to delete Two Factor Authentication
          </Label>
        </span>
        <Button
          variant="destructive"
          id="delete-mfa"
          disabled={!consented}
          onClick={onClick}
        >
          Delete 2FA
        </Button>
      </section>
    </section>
  );
}
