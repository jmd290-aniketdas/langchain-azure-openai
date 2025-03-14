import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";
import { ThemeToggle } from "./theme-toggle";
import { signOut } from "@/auth";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { DEFAULT_LOGIN_ROUTE } from "@/lib/environment-variables";

export function AppTopbar({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "sticky top-0 flex shrink-0 items-center justify-between gap-2 border-b backdrop-blur-md p-4 h-(--header-height) z-50",
        className
      )}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <SidebarTrigger />
        </TooltipTrigger>
        <TooltipContent>
          <p>Toggle Sidebar</p>
        </TooltipContent>
      </Tooltip>

      <section className="flex gap-3 items-center">
        <ThemeToggle className="size-7" />

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: DEFAULT_LOGIN_ROUTE });
          }}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="submit" variant="outline" className="size-7">
                <LogOut />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>
        </form>
      </section>
    </header>
  );
}
