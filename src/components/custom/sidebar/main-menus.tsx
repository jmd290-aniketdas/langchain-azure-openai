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
import Logo from "../logo";

export function MainMenus({
  activeMenu,
  setActiveMenuAction,
}: {
  activeMenu?: MainSidebarMenuContent;
  setActiveMenuAction: React.Dispatch<React.SetStateAction<MainSidebarMenuContent | undefined>>;
}) {
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
