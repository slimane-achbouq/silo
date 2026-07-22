import { Layers, Library, Star, StarHalf } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardStats } from "@/lib/dashboard";

const STAT_CARDS = [
  { key: "totalItems", label: "Items", icon: Layers },
  { key: "totalCollections", label: "Collections", icon: Library },
  { key: "favoriteItems", label: "Favorite items", icon: Star },
  { key: "favoriteCollections", label: "Favorite collections", icon: StarHalf },
] as const;

export function StatsCards() {
  const stats = getDashboardStats();

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {STAT_CARDS.map(({ key, label, icon: Icon }) => (
        <Card key={key}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-muted-foreground">
              <Icon className="size-4" />
              {label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{stats[key]}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
