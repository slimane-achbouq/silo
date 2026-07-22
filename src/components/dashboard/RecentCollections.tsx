import { createElement } from "react";
import Link from "next/link";
import { Folder, Star } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRecentCollections } from "@/lib/db/collections";
import { resolveLucideIcon } from "@/lib/icons";

export async function RecentCollections() {
  const collections = await getRecentCollections(6);

  if (collections.length === 0) return null;

  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold">Recent collections</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection) => {
          const dominantColor = collection.itemTypes[0]?.color ?? undefined;

          return (
            <Link key={collection.id} href={`/collections/${collection.id}`}>
              <Card
                size="sm"
                className="h-full border-l-4 transition-colors hover:bg-muted/50"
                style={{ borderLeftColor: dominantColor }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Folder className="size-4 shrink-0 text-yellow-400" />
                    <span className="truncate">{collection.name}</span>
                    {collection.isFavorite && (
                      <Star className="ml-auto size-3.5 shrink-0 fill-yellow-400 text-yellow-400" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {collection.description && (
                    <p className="truncate text-sm text-muted-foreground">
                      {collection.description}
                    </p>
                  )}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {collection.itemTypes.map((type) =>
                        createElement(resolveLucideIcon(type.icon), {
                          key: type.name,
                          className: "size-3.5 shrink-0",
                          style: { color: type.color ?? undefined },
                        })
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {collection.itemCount} {collection.itemCount === 1 ? "item" : "items"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
