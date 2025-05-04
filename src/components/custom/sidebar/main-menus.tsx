"use client";

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { mainSidebarMenuContent } from "@/lib/menus";
import { MainSidebarMenuContent } from "@/types/menus.types";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Logo from "../logo";

const pathnameMap = [
  { id: "chats", activeMenu: "Chats" },
  { id: "folders", activeMenu: "Folders" },
  { id: "settings", activeMenu: "Settings" },
];

export function MainMenus({
  activeMenu,
  setActiveMenuAction,
}: {
  activeMenu?: MainSidebarMenuContent;
  setActiveMenuAction: React.Dispatch<React.SetStateAction<MainSidebarMenuContent | undefined>>;
}) {
  const pathname = usePathname();

  useEffect(() => {
    const currentActivePath = pathname.split("/")[1];
    const activeMenu = pathnameMap.find((m) => m.id === currentActivePath);
    const activeMenuObj = mainSidebarMenuContent.find((r) => r.name === activeMenu?.activeMenu);
    setActiveMenuAction(activeMenuObj);
  }, []);

  return (
    <>
      <SidebarHeader className="h-(--header-height)">
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
          <SidebarGroupContent>
            <SidebarMenu>
              {mainSidebarMenuContent.map((menu, i) => {
                const { icon: Icon, tooltip, name } = menu;
                return (
                  <SidebarMenuItem key={i}>
                    <SidebarMenuButton
                      tooltip={tooltip}
                      showTooltip
                      isActive={name === activeMenu?.name}
                      onClick={() => setActiveMenuAction(menu)}
                    >
                      <Icon />
                      <p className="sr-only">{name}</p>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </>
  );
}
