import { Separator } from "@/components/ui/separator";
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
import { Skeleton } from "@/components/ui/skeleton";
import Logo from "../logo";

export function SidebarSkeletonSmall() {
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
          <SidebarGroupContent className="space-y-1">
            <Skeleton className="w-full aspect-square" />
            <Skeleton className="w-full aspect-square" />
            <Skeleton className="w-full aspect-square" />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <section className="h-14 place-content-center">
          <Skeleton className="w-full aspect-square rounded-full" />
        </section>
      </SidebarFooter>
    </>
  );
}

export function SidebarSkeletonLarge() {
  return (
    <>
      <SidebarHeader className="gap-3.5 border-b px-4 whitespace-nowrap h-(--header-height)">
        <div className="flex w-full h-full items-center gap-3">
          <Skeleton className="h-full aspect-square flex-none" />
          <Skeleton className="size-full flex-1" />
        </div>
      </SidebarHeader>
      <SidebarContent className="px-0 py-3">
        <SidebarGroup className="p-0">
          <SidebarGroupContent className="px-2">
            <Skeleton className="w-full h-8" />
          </SidebarGroupContent>
        </SidebarGroup>
        <Separator />
        <SidebarGroup className="p-0">
          <SidebarGroupContent className="px-2">
            <Skeleton className="w-full h-8" />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent className="space-y-1">
            <Skeleton className="w-full h-8" />
            <Skeleton className="w-full h-8" />
            <Skeleton className="w-full h-8" />
            <Skeleton className="w-full h-8" />
            <Skeleton className="w-full h-8" />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <section className="h-14 flex gap-1 flex-col justify-center">
          <Skeleton className="w-2/3 h-4" />
          <Skeleton className="w-full h-4" />
        </section>
      </SidebarFooter>
    </>
  );
}
