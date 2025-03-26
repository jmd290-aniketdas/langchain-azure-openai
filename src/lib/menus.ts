import {
  MainSidebarMenuContent,
  SubSidebarMenuContent,
} from "@/types/menus.types";
import {
  Folder,
  FolderCog,
  KeyRound,
  LifeBuoy,
  MessageCircle,
  Paintbrush,
  Plus,
  Settings,
  User2,
} from "lucide-react";
import {
  ACCOUNT_SETTINGS_ROOT_LINK,
  APPEARENCE_AND_THEME_ROOT_LINK,
  CHATS_ROOT_LINK,
  FOLDERS_MANAGE_ROOT_LINK,
  PRIVACY_AND_SECURITY_ROOT_LINK,
  SUPPORT_AND_HELP_ROOT_LINK,
} from "./consts";

export const mainSidebarMenuContent: MainSidebarMenuContent[] = [
  {
    icon: MessageCircle,
    name: "Chats",
    tooltip: "Chats",
    action: {
      icon: Plus,
      tag: "New Chat",
      link: CHATS_ROOT_LINK,
    },
  },
  {
    icon: Folder,
    name: "Folders",
    tooltip: "Folders",
    action: {
      icon: FolderCog,
      tag: "Manage Folders",
      link: FOLDERS_MANAGE_ROOT_LINK,
    },
  },
  {
    icon: Settings,
    name: "Settings",
    tooltip: "Settings",
  },
];

export const settingsSidebarMenuContent: SubSidebarMenuContent[] = [
  {
    name: "Account Settings",
    icon: User2,
    link: ACCOUNT_SETTINGS_ROOT_LINK,
    searchTerms: [],
  },
  {
    name: "Privacy & Security",
    icon: KeyRound,
    link: PRIVACY_AND_SECURITY_ROOT_LINK,
    searchTerms: [],
  },
  {
    name: "Appearance & Theme",
    icon: Paintbrush,
    link: APPEARENCE_AND_THEME_ROOT_LINK,
    searchTerms: [],
  },
  {
    name: "Support & Help",
    icon: LifeBuoy,
    link: SUPPORT_AND_HELP_ROOT_LINK,
    searchTerms: [],
  },
];
