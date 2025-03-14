import { SidebarHeader } from "@/components/ui/sidebar";
import { MainSidebarMenuContent } from "@/types/menus.types";

export function SubMenuHeader({
  content,
}: {
  content?: MainSidebarMenuContent;
}) {
  if (!content) return <></>;

  const { icon: Icon } = content;
  return (
    <SidebarHeader className="gap-3.5 border-b px-4 whitespace-nowrap h-(--header-height)">
      <div className="flex w-full h-full items-center gap-3">
        <Icon className="size-4" />
        <p className="text-base font-medium text-foreground group-data-[state=collapsed]:hidden">
          {content.name}
        </p>
      </div>
    </SidebarHeader>
  );
}
