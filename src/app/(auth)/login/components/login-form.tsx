"use client";

import { credentialsSignIn } from "@/actions/auth.server.actions";
import { cn } from "@/lib/utils";
import { signInSchema, SignInSchema } from "@/lib/validators/signin-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { DEFAULT_LOGGED_IN_ROUTE } from "@/lib/environment-variables";

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

  const onSubmit = async (data: SignInSchema) => {
    try {
      await credentialsSignIn(data);
    } catch (error) {
      const e = error as Error;
      if (e.message !== "NEXT_REDIRECT") {
        console.error(e);
        toast.error(e.message);
      }
    }
    toast.success("Successfully Signed In with Credentials");

    router.push(DEFAULT_LOGGED_IN_ROUTE);
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
    </form>
  );
}
