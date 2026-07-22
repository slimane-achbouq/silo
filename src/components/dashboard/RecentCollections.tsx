import Link from "next/link";
import { Folder, Star } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRecentCollections } from "@/lib/dashboard";

export function RecentCollections() {
  const collections = getRecentCollections(6);

  if (collections.length === 0) return null;

  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold">Recent collections</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection) => (
          <Link key={collection.id} href={`/collections/${collection.id}`}>
            <Card size="sm" className="h-full transition-colors hover:bg-muted/50">
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
                <p className="truncate text-sm text-muted-foreground">
                  {collection.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
