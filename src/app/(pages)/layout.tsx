import { AppTopbar } from "@/components/custom/app-topbar";
import { AppSidebar } from "@/components/custom/sidebar/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <AppTopbar />
        {children}
      </SidebarInset>
    </>
  );
}
