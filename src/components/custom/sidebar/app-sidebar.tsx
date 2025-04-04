"use client";

import {
  fetchChatSidebarMenuContent,
  fetchFolderSidebarMenuContent,
  fetchSettingsSidebarMenuContent,
} from "@/actions/menus.actions";
import { cn, getAbbreviatedName } from "@/lib/utils";
import { MainSidebarMenuContent } from "@/types/menus.types";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import {
  Sidebar,
  SidebarFooter,
  SidebarGroup,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../ui/sidebar";
import { MainMenus } from "./main-menus";
import { SubMenuHeader } from "./sub-menu-header";
import { SubMenusContent } from "./sub-menus-content";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarFooterLarge, SidebarFooterSmall } from "./footers";
import { SidebarSkeletonLarge, SidebarSkeletonSmall } from "./skeletons";

const menuMappings = [
  {
    id: "Chats",
    fetcher: fetchChatSidebarMenuContent,
  },
  {
    id: "Folders",
    fetcher: fetchFolderSidebarMenuContent,
  },
  {
    id: "Settings",
    fetcher: fetchSettingsSidebarMenuContent,
  },
];

export function AppSidebar({
  className,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { data: session, status } = useSession();
  const [activeMenu, setActiveMenu] = useState<MainSidebarMenuContent>();
  const activeMenuContentFetcher = useMemo(() => {
    return menuMappings.find((m) => m.id === activeMenu?.name)?.fetcher;
  }, [activeMenu]);

  if (status === "unauthenticated") {
    return (
      <Sidebar
        collapsible="icon"
        className={cn(
          "overflow-hidden [&>[data-sidebar=sidebar]]:flex-row z-50 bg-transparent",
          className
        )}
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
        className={cn(
          "overflow-hidden [&>[data-sidebar=sidebar]]:flex-row z-50 bg-transparent",
          className
        )}
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
        className={cn(
          "overflow-hidden [&>[data-sidebar=sidebar]]:flex-row z-50 bg-transparent",
          className
        )}
        {...props}
      >
        <Sidebar
          collapsible="none"
          className="w-(--sidebar-width-icon) border-r group-data-[state=collapsed]:w-0 overflow-hidden transition-all"
        >
          <MainMenus
            activeMenu={activeMenu}
            setActiveMenuAction={setActiveMenu}
          />
          <SidebarFooterSmall user={session.user} />
        </Sidebar>

        <Sidebar
          collapsible="none"
          className="flex-1 md:flex group-data-[state=collapsed]:w-(--sidebar-width-icon) overflow-hidden transition-all"
        >
          <SubMenuHeader content={activeMenu} />
          <SubMenusContent
            activeMenu={activeMenu}
            fetcher={activeMenuContentFetcher}
          />
          <SidebarFooterLarge user={session.user} />
        </Sidebar>
      </Sidebar>
    );
  }
}
