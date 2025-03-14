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

export function MainMenus({
  session,
  activeMenu,
  setActiveMenu,
}: {
  session: Session | null;
  activeMenu?: MainSidebarMenuContent;
  setActiveMenu: React.Dispatch<
    React.SetStateAction<MainSidebarMenuContent | undefined>
  >;
}) {
  const [mainSidebarMenuContent, setMainMenuSidebarContent] = useState<
    MainSidebarMenuContent[]
  >([]);

  useEffect(() => {
    fetchMainSidebarMenuContent()
      .then((res) => {
        setMainMenuSidebarContent(res);
        setActiveMenu(res[0]);
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
                      onClick={() => setActiveMenu(menu)}
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
      <SidebarFooter>
        <Avatar>
          <AvatarImage src={session?.user?.image ?? undefined} />
          <AvatarFallback>
            {getAbbreviatedName(session?.user?.name ?? undefined)}
          </AvatarFallback>
        </Avatar>
      </SidebarFooter>
    </>
  );
}
