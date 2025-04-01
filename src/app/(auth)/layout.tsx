import Logo from "@/components/custom/logo";
import { APP_NAME } from "@/lib/environment-variables";

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <section className="flex gap-3 items-center justify-center">
          <Logo className="size-6 p-px border border-muted bg-background" />
          <p>{APP_NAME}</p>
        </section>
        {children}
        <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary transition-colors">
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </div>
  );
}
