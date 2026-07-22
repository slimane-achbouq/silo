import { prisma } from "@/lib/prisma";

// TODO: replace with the authenticated user's id once auth is wired up.
const DEMO_USER_EMAIL = "slach@dev.io";

export interface ItemSummary {
  id: string;
  title: string;
  content: string | null;
  url: string | null;
  language: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  updatedAt: Date;
  tags: string[];
  type: {
    name: string;
    icon: string | null;
    color: string | null;
  };
}

const ITEM_INCLUDE = {
  type: { select: { name: true, icon: true, color: true } },
  tags: { select: { tag: { select: { name: true } } } },
} as const;

type ItemWithRelations = {
  id: string;
  title: string;
  content: string | null;
  url: string | null;
  language: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  updatedAt: Date;
  type: { name: string; icon: string | null; color: string | null };
  tags: { tag: { name: string } }[];
};

function toItemSummary(item: ItemWithRelations): ItemSummary {
  return {
    id: item.id,
    title: item.title,
    content: item.content,
    url: item.url,
    language: item.language,
    isFavorite: item.isFavorite,
    isPinned: item.isPinned,
    updatedAt: item.updatedAt,
    tags: item.tags.map(({ tag }) => tag.name),
    type: item.type,
  };
}

export async function getPinnedItems(limit = 6): Promise<ItemSummary[]> {
  const user = await prisma.user.findUnique({ where: { email: DEMO_USER_EMAIL } });
  if (!user) return [];

  const items = await prisma.item.findMany({
    where: { userId: user.id, isPinned: true },
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: ITEM_INCLUDE,
  });

  return items.map(toItemSummary);
}

export async function getRecentItems(limit = 10): Promise<ItemSummary[]> {
  const user = await prisma.user.findUnique({ where: { email: DEMO_USER_EMAIL } });
  if (!user) return [];

  const items = await prisma.item.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: ITEM_INCLUDE,
  });

  return items.map(toItemSummary);
}

export interface DashboardStats {
  totalItems: number;
  totalCollections: number;
  favoriteItems: number;
  favoriteCollections: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const user = await prisma.user.findUnique({ where: { email: DEMO_USER_EMAIL } });
  if (!user) {
    return { totalItems: 0, totalCollections: 0, favoriteItems: 0, favoriteCollections: 0 };
  }

  const [totalItems, totalCollections, favoriteItems, favoriteCollections] = await Promise.all([
    prisma.item.count({ where: { userId: user.id } }),
    prisma.collection.count({ where: { userId: user.id } }),
    prisma.item.count({ where: { userId: user.id, isFavorite: true } }),
    prisma.collection.count({ where: { userId: user.id, isFavorite: true } }),
  ]);

  return { totalItems, totalCollections, favoriteItems, favoriteCollections };
}
