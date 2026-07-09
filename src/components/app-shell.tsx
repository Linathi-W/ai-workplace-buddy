import type { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AiNotice } from "@/components/ai-notice";
import { Separator } from "@/components/ui/separator";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mx-1 h-6" />
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">AI Workplace Productivity Assistant</span>
            </div>
            <div className="ml-auto text-xs text-muted-foreground hidden sm:block">
              Private · session-only · no sign-in
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <AiNotice />
        </div>
      </div>
    </SidebarProvider>
  );
}
