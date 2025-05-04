"use client";

import { cn } from "@/lib/utils";
import { MainSidebarMenuContent } from "@/types/menus.types";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Sidebar, SidebarGroup, SidebarMenuButton, SidebarMenuItem } from "../../ui/sidebar";
import { SidebarFooterLarge, SidebarFooterSmall } from "./footers";
import { MainMenus } from "./main-menus";
import { SidebarSkeletonLarge, SidebarSkeletonSmall } from "./skeletons";
import { SubMenuHeader } from "./sub-menu-header";
import { SubMenusContent } from "./sub-menus-content";

export function AppSidebar({ className, ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, status } = useSession();
  const [activeMenu, setActiveMenu] = useState<MainSidebarMenuContent>();

  if (status === "unauthenticated") {
    return (
      <Sidebar
        collapsible="icon"
        className={cn("overflow-hidden [&>[data-sidebar=sidebar]]:flex-row z-50 bg-transparent", className)}
        {...props}
      >
        <SidebarGroup>
          <SidebarMenuItem>
            <SidebarMenuButton disabled>Not Authenticated</SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarGroup>
      </Sidebar>
    );
  }
  if (status === "loading") {
    return (
      <Sidebar
        collapsible="icon"
        className={cn("overflow-hidden [&>[data-sidebar=sidebar]]:flex-row z-50 bg-transparent", className)}
        {...props}
      >
        <Sidebar
          collapsible="none"
          className="w-(--sidebar-width-icon) border-r group-data-[state=collapsed]:w-0 overflow-hidden transition-all"
        >
          <SidebarSkeletonSmall />
        </Sidebar>
        <Sidebar
          collapsible="none"
          className="flex-1 md:flex group-data-[state=collapsed]:w-(--sidebar-width-icon) overflow-hidden transition-all"
        >
          <SidebarSkeletonLarge />
        </Sidebar>
      </Sidebar>
    );
  }
  if (status === "authenticated") {
    return (
      <Sidebar
        collapsible="icon"
        className={cn("overflow-hidden [&>[data-sidebar=sidebar]]:flex-row z-50 bg-transparent", className)}
        {...props}
      >
        <Sidebar
          collapsible="none"
          className="w-(--sidebar-width-icon) border-r group-data-[state=collapsed]:w-0 overflow-hidden transition-all"
        >
          <MainMenus activeMenu={activeMenu} setActiveMenuAction={setActiveMenu} />
          <SidebarFooterSmall user={session.user} />
        </Sidebar>

        <Sidebar
          collapsible="none"
          className="flex-1 md:flex group-data-[state=collapsed]:w-(--sidebar-width-icon) overflow-hidden transition-all"
        >
          <SubMenuHeader content={activeMenu} />
          <SubMenusContent activeMenu={activeMenu} />
          <SidebarFooterLarge user={session.user} />
        </Sidebar>
      </Sidebar>
    );
  }
}
