import { prisma } from "@/lib/prisma";

// TODO: replace with the authenticated user's id once auth is wired up.
const DEMO_USER_EMAIL = "slach@dev.io";

export interface CollectionItemType {
  name: string;
  icon: string | null;
  color: string | null;
  count: number;
}

export interface CollectionSummary {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  itemCount: number;
  updatedAt: Date;
  itemTypes: CollectionItemType[];
}

export async function getRecentCollections(limit = 6): Promise<CollectionSummary[]> {
  const user = await prisma.user.findUnique({ where: { email: DEMO_USER_EMAIL } });
  if (!user) return [];

  const collections = await prisma.collection.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: {
      items: {
        select: {
          type: { select: { name: true, icon: true, color: true } },
        },
      },
    },
  });

  return collections.map((collection) => {
    const typeCounts = new Map<string, CollectionItemType>();
    for (const item of collection.items) {
      const existing = typeCounts.get(item.type.name);
      if (existing) {
        existing.count += 1;
      } else {
        typeCounts.set(item.type.name, {
          name: item.type.name,
          icon: item.type.icon,
          color: item.type.color,
          count: 1,
        });
      }
    }

    return {
      id: collection.id,
      name: collection.name,
      description: collection.description,
      isFavorite: collection.isFavorite,
      itemCount: collection.items.length,
      updatedAt: collection.updatedAt,
      itemTypes: [...typeCounts.values()].sort((a, b) => b.count - a.count),
    };
  });
}
