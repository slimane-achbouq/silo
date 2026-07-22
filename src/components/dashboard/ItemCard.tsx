import { createElement } from "react";
import { Pin } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/dashboard";
import { resolveLucideIcon } from "@/lib/icons";
import type { ItemSummary } from "@/lib/db/items";

interface ItemCardProps {
  item: ItemSummary;
}

export function ItemCard({ item }: ItemCardProps) {
  const preview = item.content || item.url || "";

  return (
    <Card size="sm" className="min-w-0">
      <CardHeader>
        <div className="flex items-center gap-2">
          {createElement(resolveLucideIcon(item.type.icon), {
            className: "size-4 shrink-0",
            style: { color: item.type.color ?? undefined },
          })}
          <Badge variant="outline">{item.type.name}</Badge>
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
        {item.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {item.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
