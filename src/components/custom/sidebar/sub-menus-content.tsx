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
import { useChatContext } from "@/contexts/chat-context";
import { settingsSidebarMenuContent } from "@/lib/menus";
import { MainSidebarMenuContent, SubSidebarMenuContent } from "@/types/menus.types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ScratchPad from "../scratchpad";

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
          {sidebarMenuContentLoading && (
            <>
              <Skeleton className="w-full h-8" />
              <Skeleton className="w-full h-8" />
              <Skeleton className="w-full h-8" />
              <Skeleton className="w-full h-8" />
              <Skeleton className="w-full h-8" />
            </>
          )}
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
