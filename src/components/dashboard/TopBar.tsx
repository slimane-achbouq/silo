import { FolderPlus, Menu, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TopBarProps {
  onMenuClick?: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  return (
    <header className="flex h-16 items-center gap-4 border-b border-border px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMenuClick}
      >
        <Menu className="size-4" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>
      <div className="relative flex-1 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search content, tags, titles..."
          className="pl-9"
        />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" className="gap-2">
          <FolderPlus className="size-4" />
          New collection
        </Button>
        <Button className="gap-2">
          <Plus className="size-4" />
          New item
        </Button>
      </div>
    </header>
  );
}
