import { cn } from "@/lib/utils";
import { Command } from "lucide-react";
import { Label } from "../ui/label";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { Switch } from "../ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { auth } from "@/auth";
import Logo from "./logo";

export async function AppSidebar({
  className,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const session = await auth();
  return (
    <Sidebar
      collapsible="icon"
      className={cn(
        "overflow-hidden [&>[data-sidebar=sidebar]]:flex-row",
        className
      )}
      {...props}
    >
      <Sidebar
        collapsible="none"
        className="w-(--sidebar-width-icon) border-r group-data-[state=collapsed]:w-0 overflow-hidden transition-all"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" className="h-8 p-0">
                <Logo />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>{/* First Sidebar content */}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <Avatar>
            <AvatarImage src={session?.user?.image ?? undefined} />
            <AvatarFallback></AvatarFallback>
          </Avatar>
        </SidebarFooter>
      </Sidebar>

      <Sidebar
        collapsible="none"
        className="flex-1 md:flex group-data-[state=collapsed]:w-(--sidebar-width-icon) overflow-hidden transition-all"
      >
        <SidebarHeader className="gap-3.5 border-b p-4 whitespace-nowrap">
          <div className="flex w-full items-center justify-between">
            <div className="text-base font-medium text-foreground">Header</div>
            <Label className="flex items-center gap-2 text-sm">
              <span>Sub Header</span>
              <Switch className="shadow-none" />
            </Label>
          </div>
          <SidebarInput placeholder="Type to search..." />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
              {/* 2nd Sidebar Contents */}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  );
}
