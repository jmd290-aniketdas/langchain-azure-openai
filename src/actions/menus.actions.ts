
import {
  mainSidebarMenuContent,
  settingsSidebarMenuContent,
} from "@/lib/menus";
import {
  MainSidebarMenuContent,
  SubSidebarMenuContent,
} from "@/types/menus.types";

const fetchMainSidebarMenuContent = async (): Promise<
  MainSidebarMenuContent[]
> => {
  return mainSidebarMenuContent;
};

const fetchSettingsSidebarMenuContent = async (): Promise<
  SubSidebarMenuContent[]
> => {
  return settingsSidebarMenuContent;
};

const fetchChatSidebarMenuContent = async (): Promise<
  SubSidebarMenuContent[]
> => {
  return [];
};

const fetchFolderSidebarMenuContent = async (): Promise<
  SubSidebarMenuContent[]
> => {
  return [];
};

export {
  fetchChatSidebarMenuContent,
  fetchFolderSidebarMenuContent,
  fetchMainSidebarMenuContent,
  fetchSettingsSidebarMenuContent,
};
