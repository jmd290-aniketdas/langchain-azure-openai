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
import {
  MainSidebarMenuContent,
  SubSidebarMenuContent,
} from "@/types/menus.types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ScratchPad from "../scratchpad";

export function SubMenusContent({
  activeMenu,
  fetcher,
}: {
  activeMenu?: MainSidebarMenuContent;
  fetcher?: () => Promise<SubSidebarMenuContent[]>;
}) {
  const pathname = usePathname();

  const [sidebarMenuContent, setSidebarMenuContent] = useState<
    SubSidebarMenuContent[]
  >([]);

  useEffect(() => {
    if (fetcher) {
      fetcher()
        .then((res) => setSidebarMenuContent(res))
        .catch((err) => toast.error(err.message));
    }
  }, [fetcher]);

  if (!fetcher || !activeMenu) return <></>;

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
          {sidebarMenuContent.map((menu, i) => {
            const { icon: Icon, name, link } = menu;
            return (
              <SidebarMenuItem key={i}>
                <SidebarMenuButton
                  tooltip={name}
                  isActive={pathname === link}
                  asChild
                >
                  <Link href={link}>
                    <Icon />
                    <p>{name}</p>
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
