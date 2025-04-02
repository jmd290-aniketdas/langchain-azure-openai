import { userSignOut } from "@/actions/auth.server.actions";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { SidebarTrigger } from "../ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { ThemeToggle } from "./theme-toggle";

export function AppTopbar({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "sticky top-0 flex shrink-0 items-center justify-between gap-2 border-b bg-sidebar/40 backdrop-blur-xl p-4 h-(--header-height) z-50",
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

        <form action={userSignOut}>
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
