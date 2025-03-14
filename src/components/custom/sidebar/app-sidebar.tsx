"use client";

import {
  fetchChatSidebarMenuContent,
  fetchFolderSidebarMenuContent,
  fetchSettingsSidebarMenuContent,
} from "@/actions/menus.actions";
import { cn } from "@/lib/utils";
import { MainSidebarMenuContent } from "@/types/menus.types";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { Sidebar } from "../../ui/sidebar";
import { MainMenus } from "./main-menus";
import { SubMenuHeader } from "./sub-menu-header";
import { SubMenusContent } from "./sub-menus-content";

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
  const { data: session } = useSession();
  const [activeMenu, setActiveMenu] = useState<MainSidebarMenuContent>();
  const activeMenuContentFetcher = useMemo(() => {
    return menuMappings.find((m) => m.id === activeMenu?.name)?.fetcher;
  }, [activeMenu]);

  return (
    <Sidebar
      collapsible="icon"
      className={cn(
        "overflow-hidden [&>[data-sidebar=sidebar]]:flex-row z-50 backdrop-blur-md",
        className
      )}
      {...props}
    >
      <Sidebar
        collapsible="none"
        className="w-(--sidebar-width-icon) border-r group-data-[state=collapsed]:w-0 overflow-hidden transition-all"
      >
        <MainMenus
          session={session}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
        />
      </Sidebar>

      <Sidebar
        collapsible="none"
        className="flex-1 md:flex group-data-[state=collapsed]:w-(--sidebar-width-icon) overflow-hidden transition-all"
      >
        <SubMenuHeader content={activeMenu} />
        <SubMenusContent activeMenu={activeMenu} fetcher={activeMenuContentFetcher} />
      </Sidebar>
    </Sidebar>
  );
}
