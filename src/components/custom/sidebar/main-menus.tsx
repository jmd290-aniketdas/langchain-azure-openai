"use client";

import { fetchMainSidebarMenuContent } from "@/actions/menus.actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { MainSidebarMenuContent } from "@/types/menus.types";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Logo from "../logo";
import { getAbbreviatedName } from "@/lib/utils";
import { usePathname } from "next/navigation";

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
  setActiveMenuAction: React.Dispatch<
    React.SetStateAction<MainSidebarMenuContent | undefined>
  >;
}) {
  const pathname = usePathname();

  const [mainSidebarMenuContent, setMainMenuSidebarContent] = useState<
    MainSidebarMenuContent[]
  >([]);

  useEffect(() => {
    fetchMainSidebarMenuContent()
      .then((res) => {
        setMainMenuSidebarContent(res);

        const currentActivePath = pathname.split("/")[1];
        const activeMenu = pathnameMap.find((m) => m.id === currentActivePath);
        const activeMenuObj = res.find(
          (r) => r.name === activeMenu?.activeMenu
        );
        setActiveMenuAction(activeMenuObj);
      })
      .catch((err) => toast.error(err.message));
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
