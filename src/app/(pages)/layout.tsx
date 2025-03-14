import { AppSidebar } from "@/components/custom/sidebar/app-sidebar";
import { AppTopbar } from "@/components/custom/app-topbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppTopbar />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
