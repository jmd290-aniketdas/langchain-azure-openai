"use client";

import { userSignOut } from "@/actions/auth.server.actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarFooter } from "@/components/ui/sidebar";
import { DEFAULT_LOGIN_ROUTE } from "@/lib/environment-variables";
import { cn, getAbbreviatedName } from "@/lib/utils";
import {
  Check,
  ChevronRight,
  LifeBuoy,
  LogOut,
  SunMoon,
  TriangleAlert,
} from "lucide-react";
import { Session } from "next-auth";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

export function SidebarFooterSmall({ user }: { user: Session["user"] }) {
  return (
    <SidebarFooter>
      <section className="h-14 place-content-center">
        <Avatar>
          <AvatarImage src={user.image ?? undefined} />
          <AvatarFallback>
            {getAbbreviatedName(user.name ?? undefined)}
          </AvatarFallback>
        </Avatar>
      </section>
    </SidebarFooter>
  );
}

export function SidebarFooterLarge({ user }: { user: Session["user"] }) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const onLogout = async () => {
    await userSignOut();
    router.push(DEFAULT_LOGIN_ROUTE);
  };

  return (
    <SidebarFooter>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-14 group-data-[state=collapsed]:h-9"
          >
            <section className="w-full group-data-[state=collapsed]:hidden flex items-center justify-between gap-2">
              <section className="place-items-start flex-1 overflow-hidden">
                <p className="text-sm truncate">{user.name}</p>
                <p className="text-xs font-light text-muted-foreground truncate">
                  {user.email}
                </p>
              </section>
              <ChevronRight className="flex-none" />
            </section>

            <section className="hidden group-data-[state=collapsed]:block">
              <Avatar>
                <AvatarImage src={user.image ?? undefined} />
                <AvatarFallback>
                  {getAbbreviatedName(user.name ?? undefined)}
                </AvatarFallback>
              </Avatar>
            </section>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" className="w-52">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Account</DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <LifeBuoy />
              FAQ
            </DropdownMenuItem>
            <DropdownMenuItem>
              <TriangleAlert />
              Feedback
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <SunMoon />
                Theme
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Check
                      className={cn(
                        "transition-opacity",
                        theme === "light" ? "opacity-100" : "opacity-0"
                      )}
                    />
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Check
                      className={cn(
                        "transition-opacity",
                        theme === "dark" ? "opacity-100" : "opacity-0"
                      )}
                    />
                    Dark
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={onLogout}>
              <LogOut />
              Logout
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarFooter>
  );
}
