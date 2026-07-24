"use client";

import { useState } from "react";
import { Box, PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { TopBar } from "@/components/dashboard/TopBar";
import { SidebarContent } from "@/components/dashboard/SidebarContent";
import type { CollectionSummary } from "@/lib/db/collections";
import type { ItemTypeSummary } from "@/lib/db/items";

interface DashboardUser {
  name: string;
  email: string;
  image?: string | null;
}

interface DashboardShellProps {
  children: React.ReactNode;
  itemTypes: ItemTypeSummary[];
  favoriteCollections: CollectionSummary[];
  recentCollections: CollectionSummary[];
  user: DashboardUser;
}

export function DashboardShell({
  children,
  itemTypes,
  favoriteCollections,
  recentCollections,
  user,
}: DashboardShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen">
      <aside
        className={cn(
          "hidden shrink-0 flex-col border-r border-border transition-[width] duration-150 md:flex",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div
          className={cn(
            "flex h-16 shrink-0 items-center gap-2 border-b border-border px-6",
            collapsed && "justify-center px-0"
          )}
        >
          <Box className="size-5 shrink-0" />
          {!collapsed && <span className="font-semibold">Silo</span>}
        </div>
        <div className="min-h-0 flex-1">
          <SidebarContent
            itemTypes={itemTypes}
            favoriteCollections={favoriteCollections}
            recentCollections={recentCollections}
            user={user}
            collapsed={collapsed}
          />
        </div>
        <div className="shrink-0 border-t border-border p-2">
          <Button
            variant="ghost"
            className={cn("w-full gap-2", collapsed ? "px-0" : "justify-start")}
            onClick={() => setCollapsed((value) => !value)}
          >
            {collapsed ? (
              <PanelLeftOpen className="size-4" />
            ) : (
              <>
                <PanelLeftClose className="size-4" />
                Collapse
              </>
            )}
          </Button>
        </div>
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 gap-0 p-0 sm:max-w-64">
          <SheetTitle className="sr-only">Sidebar</SheetTitle>
          <div className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-6">
            <Box className="size-5 shrink-0" />
            <span className="font-semibold">Silo</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <SidebarContent
              itemTypes={itemTypes}
              favoriteCollections={favoriteCollections}
              recentCollections={recentCollections}
              user={user}
              onNavigate={() => setMobileOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
