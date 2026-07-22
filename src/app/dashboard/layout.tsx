import { Box } from "lucide-react";

import { TopBar } from "@/components/dashboard/TopBar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen">
      <aside className="flex w-64 shrink-0 flex-col border-r border-border">
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <Box className="size-5" />
          <span className="font-semibold">Silo</span>
        </div>
        <div className="p-4">
          <h2>Sidebar</h2>
        </div>
      </aside>
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
