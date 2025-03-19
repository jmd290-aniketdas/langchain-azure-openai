import { MFASecretGenerate } from "@/actions/auth.server.actions";
import {
  fetch2FABackupCode,
  is2FAEnabled,
  is2FASetup,
} from "@/actions/users.actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DEFAULT_LOGIN_ROUTE } from "@/lib/environment-variables";
import { Loader2 } from "lucide-react";
import { Session } from "next-auth";
import { redirect } from "next/navigation";
import {
  Activate2FAForm,
  CopyBackupCode2FA,
  Delete2FA,
  Toggle2FAForm,
} from "./manage-2fa-forms";

export async function Manage2FA({ user }: { user: Session["user"] }) {
  const mfaSetup = await is2FASetup(user.email);

  if (mfaSetup) {
    // TODO: Form to show MFA details and turn off the service
    const backupCodes = await fetch2FABackupCode(user.email);
    const mfaEnabled = await is2FAEnabled(user.email);
    return (
      <section className="space-y-4">
        <section className="space-y-1">
          <p className="text-xs text-muted-foreground">
            Two Factor Authentication is activated in your account via an
            Authenticator app.
          </p>
          <p className="text-xs text-muted-foreground">
            Incase you don't have access to your Authenticator app, you can use
            the Backup Code
          </p>
        </section>
        <section className="grid md:grid-cols-2 gap-4">
          <CopyBackupCode2FA
            backupCodes={backupCodes}
            className="grid grid-cols-subgrid gap-3 items-center col-span-full"
          />
          <Toggle2FAForm
            user={user}
            is2FAEnabled={mfaEnabled}
            className="grid grid-cols-subgrid gap-3 items-center col-span-full"
          />
          <Delete2FA
            user={user}
            className="grid grid-cols-subgrid gap-3 items-center col-span-full"
          />
        </section>
      </section>
    );
  }

  const mfaSecret = await MFASecretGenerate(user.email);

  return (
    <section className="space-y-4">
      <section className="text-xs text-muted-foreground">
        <p>To secure your account, follow these steps:</p>
        <ol className="list-decimal list-inside">
          <li>
            <span className="font-medium text-primary">Scan the QR Code</span> -
            Open your preferred authenticator app (Google Authenticator,
            Microsoft Authenticator, or similar) and scan the QR code below.
          </li>
          <li>
            <span className="font-medium text-primary">Enter the Code</span> -
            Once scanned, your app will generate a 6-digit code. Enter that code
            in the field below.
          </li>
          <li>
            <span className="font-medium text-primary">Enable 2FA</span> -
            Submit the code to activate Multi-Factor Authentication (MFA) for
            your account.
          </li>
        </ol>
        <p>
          This adds an extra layer of security, ensuring only you can access
          your account, even if someone knows your password.
        </p>
      </section>
      <section className="grid md:grid-cols-2 gap-6 items-center px-2">
        <Avatar className="size-48 rounded place-self-center">
          <AvatarImage
            src={mfaSecret.qrCodeDataURL}
            alt="Scan this QR code with your authenticator app"
          />
          <AvatarFallback>
            <Loader2 className="animate-spin size-12" />
          </AvatarFallback>
        </Avatar>

        <Activate2FAForm secret={mfaSecret.secret} user={user} />
      </section>
    </section>
  );
}
