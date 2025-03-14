import {
  MainSidebarMenuContent,
  SubSidebarMenuContent,
} from "@/types/menus.types";
import {
  Folder,
  KeyRound,
  LifeBuoy,
  MessageCircle,
  Paintbrush,
  Plus,
  Settings,
  User2,
} from "lucide-react";

export const mainSidebarMenuContent: MainSidebarMenuContent[] = [
  {
    icon: MessageCircle,
    name: "Chats",
    tooltip: "Chats",
    action: {
        icon: Plus,
        tag: "New Chat",
        link: "/chats",
    },
  },
  {
    icon: Folder,
    name: "Folders",
    tooltip: "Folders",
    action: {
        icon: Plus,
        tag: "New Folder",
        link: "/create_folder",
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
    link: "/settings/account_settings",
    searchTerms: [],
  },
  {
    name: "Privacy & Security",
    icon: KeyRound,
    link: "/settings/privacy_amp_security",
    searchTerms: [],
  },
  {
    name: "Appearance & Theme",
    icon: Paintbrush,
    link: "/settings/appearance_amp_theme",
    searchTerms: [],
  },
  {
    name: "Support & Help",
    icon: LifeBuoy,
    link: "/settings/support_amp_help",
    searchTerms: [],
  },
];
