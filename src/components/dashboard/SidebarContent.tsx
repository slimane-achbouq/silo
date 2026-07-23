import Link from "next/link";
import { Clock, Folder, Star, Layers, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { resolveLucideIcon } from "@/lib/icons";
import { mockUser } from "@/lib/mock-data";
import type { CollectionSummary } from "@/lib/db/collections";
import type { ItemTypeSummary } from "@/lib/db/items";

interface SidebarContentProps {
  itemTypes: ItemTypeSummary[];
  favoriteCollections: CollectionSummary[];
  recentCollections: CollectionSummary[];
  collapsed?: boolean;
  onNavigate?: () => void;
}

function getItemTypeSlug(name: string): string {
  return `${name.toLowerCase()}s`;
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function SidebarLink({
  href,
  icon: Icon,
  iconClassName,
  iconStyle,
  label,
  meta,
  pro,
  collapsed,
  onNavigate,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  iconClassName?: string;
  iconStyle?: React.CSSProperties;
  label: string;
  meta?: string;
  pro?: boolean;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const link = (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground",
        collapsed && "justify-center px-0"
      )}
    >
      <Icon className={cn("size-4 shrink-0", iconClassName)} style={iconStyle} />
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{label}</span>
          {pro && (
            <Badge
              variant="outline"
              className="h-4 shrink-0 px-1.5 text-[10px] font-medium tracking-wide text-muted-foreground uppercase"
            >
              Pro
            </Badge>
          )}
          {meta && (
            <span className="text-xs text-muted-foreground">{meta}</span>
          )}
        </>
      )}
    </Link>
  );

  if (!collapsed) return link;

  return (
    <Tooltip>
      <TooltipTrigger render={link} />
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

function SidebarSectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-2 pt-4 pb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
      {children}
    </div>
  );
}

function CollectionDot({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={cn("rounded-full border border-border", className)}
      style={style}
    />
  );
}

export function SidebarContent({
  itemTypes,
  favoriteCollections,
  recentCollections,
  collapsed = false,
  onNavigate,
}: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col">
      <nav className="flex-1 overflow-y-auto p-2">
        {!collapsed && <SidebarSectionLabel>Library</SidebarSectionLabel>}
        <div className="flex flex-col gap-0.5">
          <SidebarLink
            href="/dashboard"
            icon={Layers}
            label="All items"
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
          <SidebarLink
            href="/favorites"
            icon={Star}
            label="Favorites"
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
          <SidebarLink
            href="/recent"
            icon={Clock}
            label="Recent"
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        </div>

        {!collapsed && <SidebarSectionLabel>Types</SidebarSectionLabel>}
        {collapsed && <Separator className="my-2" />}
        <div className="flex flex-col gap-0.5">
          {itemTypes.map((type) => (
            <SidebarLink
              key={type.id}
              href={`/items/${getItemTypeSlug(type.name)}`}
              icon={resolveLucideIcon(type.icon)}
              iconStyle={{ color: type.color ?? undefined }}
              label={`${capitalize(type.name)}s`}
              meta={String(type.count)}
              pro={type.name === "file" || type.name === "image"}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          ))}
        </div>

        {favoriteCollections.length > 0 && (
          <>
            {!collapsed && (
              <SidebarSectionLabel>Favorite collections</SidebarSectionLabel>
            )}
            {collapsed && <Separator className="my-2" />}
            <div className="flex flex-col gap-0.5">
              {favoriteCollections.map((collection) => (
                <SidebarLink
                  key={collection.id}
                  href={`/collections/${collection.id}`}
                  icon={Folder}
                  iconClassName="text-yellow-400"
                  label={collection.name}
                  collapsed={collapsed}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </>
        )}

        {recentCollections.length > 0 && (
          <>
            {!collapsed && (
              <SidebarSectionLabel>Recent collections</SidebarSectionLabel>
            )}
            {collapsed && <Separator className="my-2" />}
            <div className="flex flex-col gap-0.5">
              {recentCollections.map((collection) => (
                <SidebarLink
                  key={collection.id}
                  href={`/collections/${collection.id}`}
                  icon={CollectionDot}
                  iconStyle={{
                    backgroundColor: collection.itemTypes[0]?.color ?? "var(--muted-foreground)",
                  }}
                  label={collection.name}
                  collapsed={collapsed}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </>
        )}

        <div className="mt-1">
          <SidebarLink
            href="/collections"
            icon={ChevronRight}
            label="View all collections"
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        </div>
      </nav>

      <div className="border-t border-border p-2">
        <div
          className={cn(
            "flex items-center gap-2.5 rounded-md px-2 py-2",
            collapsed && "justify-center px-0"
          )}
        >
          <Avatar size="sm">
            <AvatarFallback>{mockUser.initials}</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{mockUser.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {mockUser.email}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
