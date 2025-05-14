"use client";

import { Separator } from "@/components/ui/separator";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { settingsSidebarMenuContent } from "@/lib/menus";
import { MainSidebarMenuContent, SubSidebarMenuContent } from "@/types/menus.types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ScratchPad from "../scratchpad";
import { useChatContext } from "@/contexts/chat-context";
import { clamp } from "@/lib/utils";

export function SubMenusContent({ activeMenu }: { activeMenu?: MainSidebarMenuContent }) {
  const pathname = usePathname();
  const { subSidebarChatMenuContent, subSidebarChatMenuContentLoading } = useChatContext();
  const [sidebarMenuContent, setSidebarMenuContent] = useState<SubSidebarMenuContent[]>([]);
  const [sidebarMenuContentLoading, setSidebarMenuContentLoading] = useState<boolean>(false);

  useEffect(() => {
    if (activeMenu?.name === "Chats") {
      setSidebarMenuContent(subSidebarChatMenuContent);
      setSidebarMenuContentLoading(subSidebarChatMenuContentLoading);
    } else if (activeMenu?.name === "Folders") {
      // TODO
    } else if (activeMenu?.name === "Settings") {
      setSidebarMenuContent(settingsSidebarMenuContent);
      setSidebarMenuContentLoading(false);
    }
  }, [activeMenu, subSidebarChatMenuContent, subSidebarChatMenuContentLoading, settingsSidebarMenuContent]);

  if (!activeMenu) return <></>;

  const ActionIcon = activeMenu.action?.icon;

  return (
    <SidebarContent className="pt-3">
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
      <SidebarGroup className="flex-1">
        <SidebarGroupContent className="flex flex-col gap-1">
          {sidebarMenuContentLoading &&
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
          {!sidebarMenuContentLoading &&
            sidebarMenuContent.map((menu, i) => {
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

      <Separator className="group-data-[state=collapsed]:hidden" />

      <SidebarGroup className="group-data-[state=collapsed]:hidden">
        <SidebarGroupContent>
          <ScratchPad />
        </SidebarGroupContent>
      </SidebarGroup>

      <Separator />
    </SidebarContent>
  );
}
