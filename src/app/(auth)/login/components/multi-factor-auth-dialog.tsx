"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { REGEXP_ONLY_DIGITS, REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { useState } from "react";

export function MultiFactorAuthDialog({
  open,
  setOpen,
  onSubmit,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: ({
    totp,
    backupCode,
  }: {
    totp: string;
    backupCode: string;
  }) => void;
}) {
  const [totpValue, setTotpValue] = useState<string>("");
  const [backupCode, setBackupCode] = useState<string>("");
  const [useBackupCode, setUseBackupCode] = useState<boolean>(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="sr-only">Open TOTP Dialog</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Multi-Factor Authentication</DialogTitle>
          <DialogDescription>
            {useBackupCode
              ? "Enter the Backup Code for your account"
              : "Enter the TOTP from your registered Authenticator App"}
          </DialogDescription>
        </DialogHeader>

        {useBackupCode ? (
          <MFALoginBackupCode
            backupCode={backupCode}
            setBackupCode={setBackupCode}
          />
        ) : (
          <MFALoginForm totpValue={totpValue} setTotpValue={setTotpValue} />
        )}

        <DialogFooter className="space-x-3 place-items-center">
          <p
            className="text-sm hover:underline underline-offset-4 text-end cursor-pointer"
            onClick={() => setUseBackupCode((prev) => !prev)}
          >
            {useBackupCode ? "Use TOTP instead?" : "Use Backup Code instead?"}
          </p>
          <Button
            onClick={() =>
              onSubmit({ totp: totpValue, backupCode: backupCode })
            }
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function MFALoginForm({
  totpValue,
  setTotpValue,
}: {
  totpValue: string;
  setTotpValue: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className="mx-auto flex flex-col gap-3">
      <Label htmlFor="totp-input">Enter 6-digit TOTP</Label>
      <InputOTP
        maxLength={6}
        id="totp-input"
        value={totpValue}
        onChange={setTotpValue}
        pattern={REGEXP_ONLY_DIGITS}
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
    </div>
  );
}

function MFALoginBackupCode({
  backupCode,
  setBackupCode,
}: {
  backupCode: string;
  setBackupCode: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className="mx-auto flex flex-col gap-3">
      <Label htmlFor="totp-input">Enter 12-digit Backup Code</Label>
      <section className="overflow-x-auto w-full scrollbar-none">
        <InputOTP
          maxLength={12}
          id="totp-input"
          value={backupCode}
          onChange={setBackupCode}
          pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
            <InputOTPSlot index={6} />
            <InputOTPSlot index={7} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={8} />
            <InputOTPSlot index={9} />
            <InputOTPSlot index={10} />
            <InputOTPSlot index={11} />
          </InputOTPGroup>
        </InputOTP>
      </section>
    </div>
  );
}
