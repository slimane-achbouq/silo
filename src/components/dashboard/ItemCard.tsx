import { createElement } from "react";
import { Pin } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  formatRelativeTime,
  getItemType,
  getItemTypeColorClass,
  getItemTypeIcon,
} from "@/lib/dashboard";
import type { MockItem } from "@/lib/mock-data";

interface ItemCardProps {
  item: MockItem;
}

export function ItemCard({ item }: ItemCardProps) {
  const type = getItemType(item.typeId);
  const preview = item.content || item.url || "";

  return (
    <Card size="sm" className="min-w-0">
      <CardHeader>
        <div className="flex items-center gap-2">
          {createElement(getItemTypeIcon(type?.icon ?? ""), {
            className: `size-4 shrink-0 ${getItemTypeColorClass(type?.color ?? "")}`,
          })}
          <Badge variant="outline">{type?.name ?? "Item"}</Badge>
          <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
            {item.isPinned && <Pin className="size-3" />}
            {formatRelativeTime(item.updatedAt)}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="truncate font-medium">{item.title}</p>
        {preview && (
          <p className="mt-1 truncate text-sm text-muted-foreground">
            {preview}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
