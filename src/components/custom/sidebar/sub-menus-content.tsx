"use client";

import { Separator } from "@/components/ui/separator";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { clamp } from "@/lib/utils";
import { MainSidebarMenuContent, SubSidebarMenuContent } from "@/types/menus.types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import ScratchPad from "../scratchpad";

export function SubMenusContent({ activeMenu }: { activeMenu?: MainSidebarMenuContent }) {
  const pathname = usePathname();
  const {
    chatMenuSidebarContent,
    chatMenuSidebarContentLoading,
    folderMenuSidebarContent,
    folderMenuSidebarContentLoading,
    settingsMenuSidebarContent,
    settingsMenuSidebarContentLoading,
  } = useSidebar();

  const [activeMenuSidebarContent, activeMenuSidebarContentLoading]: [SubSidebarMenuContent[], boolean] = useMemo(() => {
    if (activeMenu?.name === "Chats") return [chatMenuSidebarContent, chatMenuSidebarContentLoading];
    else if (activeMenu?.name === "Folders") return [folderMenuSidebarContent, folderMenuSidebarContentLoading];
    else if (activeMenu?.name === "Settings") return [settingsMenuSidebarContent, settingsMenuSidebarContentLoading];
    return [[], false];
  }, [
    activeMenu,
    chatMenuSidebarContent,
    chatMenuSidebarContentLoading,
    folderMenuSidebarContent,
    folderMenuSidebarContentLoading,
    settingsMenuSidebarContent,
    settingsMenuSidebarContentLoading,
  ]);

  if (!activeMenu) return <></>;
  const ActionIcon = activeMenu.action?.icon;

  return (
    <SidebarContent className="pt-3 relative">
      <section className="space-y-2 flex-none">
        {activeMenu.action && (
          <>
            <section className="px-2">
              <SidebarMenuButton asChild tooltip={activeMenu.action.tag}>
                <Link href={activeMenu.action.link}>
                  {ActionIcon && <ActionIcon />}
                  <p>{activeMenu.action.tag}</p>
                </Link>
              </SidebarMenuButton>
            </section>
            <Separator />
          </>
        )}
        <section className="px-2">
          <SidebarInput
            placeholder="Type to search..."
            className="transition-all group-data-[state=collapsed]:h-0 group-data-[state=collapsed]:opacity-0"
          />
        </section>
      </section>
      <SidebarGroup className="flex-1 overflow-y-auto">
        <SidebarGroupContent className="flex flex-col gap-1">
          {activeMenuSidebarContentLoading &&
            Array(5)
              .fill(0)
              .map((_, i) => (
                <Skeleton
                  key={i}
                  style={
                    {
                      "--animate-delay": `${i ? clamp(i * 133.33, 0, 1333.3) : 0}ms`,
                    } as React.CSSProperties
                  }
                  className="w-full h-8 animation-from-translate-y-16 animation-via-translate-0 -animation-to-translate-y-4 animation-from-opacity-0 animation-via-opacity-100 animation-to-opacity-0 animate-enter-delayed-exit ease-in-out repeat-infinite delay-(--animate-delay)"
                />
              ))}
          {!activeMenuSidebarContentLoading &&
            activeMenuSidebarContent.map((menu, i) => {
              const { icon: Icon, name, link } = menu;
              return (
                <SidebarMenuItem key={i}>
                  <SidebarMenuButton showTooltip tooltip={name} isActive={pathname === link} asChild>
                    <Link href={link}>
                      <Icon />
                      <p className="whitespace-nowrap text-ellipsis overflow-hidden">{name}</p>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
        </SidebarGroupContent>
      </SidebarGroup>

      <section className="space-y-2 flex-none">
        <Separator className="group-data-[state=collapsed]:hidden" />

        <SidebarGroup className="group-data-[state=collapsed]:hidden">
          <SidebarGroupContent>
            <ScratchPad />
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator />
      </section>
    </SidebarContent>
  );
}
