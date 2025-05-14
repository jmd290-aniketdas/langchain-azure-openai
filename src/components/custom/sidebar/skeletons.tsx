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
import { clamp } from "@/lib/utils";

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
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <Skeleton
                  key={i}
                  style={
                    {
                      "--animate-delay": `${i ? clamp(i * 133.33, 0, 1333.3) : 0}ms`,
                    } as React.CSSProperties
                  }
                  className="size-8 animation-from-translate-y-16 animation-via-translate-0 -animation-to-translate-y-4 animation-from-opacity-0 animation-via-opacity-100 animation-to-opacity-0 animate-enter-delayed-exit ease-in-out repeat-infinite delay-(--animate-delay)"
                />
              ))}
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
            {Array(5)
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
