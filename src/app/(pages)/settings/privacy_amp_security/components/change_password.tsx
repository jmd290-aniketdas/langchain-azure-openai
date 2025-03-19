"use client";

import { changePassword } from "@/actions/users.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  passwordUpdateSchema,
  PasswordUpdateSchema,
} from "@/lib/validators/password-update-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Session } from "next-auth";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function ChangePassword({ user }: { user: Session["user"] }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PasswordUpdateSchema>({
    resolver: zodResolver(passwordUpdateSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: PasswordUpdateSchema) => {
    try {
      await changePassword(user.email, data);
      toast.success("Password changed successfully");
    } catch (error) {
      console.error(error);
      toast.error((error as Error).message);
    }
  };

  return (
    <form
      className="space-y-4"
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
    >
      <p className="text-xs text-muted-foreground">
        Keep your account secure by updating your password regularly. <br />
        Use a mix of letters, numbers, and symbols to create a strong password.
      </p>
      <section className="grid gap-2">
        <Label className="text-xs text-muted-foreground" htmlFor="password">
          New Password
        </Label>
        <Input
          placeholder="New Password"
          id="password"
          type="password"
          {...register("password")}
        />
        <p
          className={cn(
            "text-destructive text-xs text-end font-medium opacity-0 transition-[opacity,height] h-0",
            !!errors.password && "opacity-100 h-4"
          )}
        >
          {errors.password?.message}
        </p>
      </section>
      <section className="grid gap-2">
        <Label className="text-xs text-muted-foreground" htmlFor="cnfPassword">
          Confirm Password
        </Label>
        <Input
          placeholder="Confirm Password"
          id="cnfPassword"
          type="password"
          {...register("cnfPassword")}
        />
        <p
          className={cn(
            "text-destructive text-xs text-end font-medium opacity-0 transition-[opacity,height] h-0",
            !!errors.cnfPassword && "opacity-100 h-4"
          )}
        >
          {errors.cnfPassword?.message}
        </p>
      </section>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <Loader2 className="animate-spin" />
        ) : (
          "Change Password"
        )}
      </Button>
    </form>
  );
}
