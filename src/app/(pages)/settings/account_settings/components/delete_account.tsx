"use client";

import { userSignOut } from "@/actions/auth.server.actions";
import { deleteUser } from "@/actions/users.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Session } from "next-auth";
import { useState } from "react";
import { toast } from "sonner";

export function DeleteAccount({ session }: { session: Session }) {
  const [consented, setConsented] = useState<boolean>(false);
  const onClick = async () => {
    try {
      if (!session.user?.email)
        throw new Error("No Email present in session user");
      await deleteUser(session.user.email);
      toast.success(
        "Accout deleted successfully. You will be logged out shortly."
      );
      await userSignOut();
    } catch (error) {
      const e = error as Error;
      if (e.message !== "NEXT_REDIRECT") {
        console.error(e);
        toast.error(e.message);
      }
    }
  };
  return (
    <section className="space-y-4">
      <section className="flex gap-4 items-center">
        <Input
          type="checkbox"
          id="delete_confirmation"
          className="size-4"
          onChange={(e) => setConsented(e.target.checked)}
        />
        <Label htmlFor="delete_confirmation" className="leading-5">
          You are about to permanently delete your account. This action cannot
          be undone.
          <br /> Are you sure you want to delete your account?
        </Label>
      </section>
      <Button variant="destructive" disabled={!consented} onClick={onClick}>
        Delete Account
      </Button>
    </section>
  );
}
