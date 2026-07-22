import {
  Code2,
  FileIcon,
  Image as ImageIcon,
  Link2,
  Sparkles,
  StickyNote,
  Terminal,
  type LucideIcon,
} from "lucide-react";

import {
  mockCollections,
  mockItems,
  mockItemTypes,
  type MockCollection,
} from "@/lib/mock-data";

const TYPE_ICONS: Record<string, LucideIcon> = {
  code: Code2,
  sparkles: Sparkles,
  terminal: Terminal,
  note: StickyNote,
  link: Link2,
  file: FileIcon,
  image: ImageIcon,
};

const TYPE_COLOR_CLASSES: Record<string, string> = {
  blue: "text-blue-400",
  purple: "text-purple-400",
  orange: "text-orange-400",
  yellow: "text-yellow-400",
  green: "text-green-400",
  gray: "text-gray-400",
  pink: "text-pink-400",
};

export function getItemTypeIcon(icon: string): LucideIcon {
  return TYPE_ICONS[icon] ?? FileIcon;
}

export function getItemTypeColorClass(color: string): string {
  return TYPE_COLOR_CLASSES[color] ?? "text-muted-foreground";
}

export function getItemTypeSlug(name: string): string {
  return `${name.toLowerCase()}s`;
}

export function getItemCountByType(typeId: string): number {
  return mockItems.filter((item) => item.typeId === typeId).length;
}

export function getFavoriteCollections(): MockCollection[] {
  return mockCollections.filter((collection) => collection.isFavorite);
}

export function getRecentCollections(limit = 4): MockCollection[] {
  const lastActivityByCollection = new Map<string, string>();

  for (const item of mockItems) {
    for (const collectionId of item.collectionIds) {
      const current = lastActivityByCollection.get(collectionId);
      if (!current || item.updatedAt > current) {
        lastActivityByCollection.set(collectionId, item.updatedAt);
      }
    }
  }

  return [...mockCollections]
    .filter((collection) => lastActivityByCollection.has(collection.id))
    .sort((a, b) =>
      lastActivityByCollection.get(b.id)!.localeCompare(
        lastActivityByCollection.get(a.id)!
      )
    )
    .slice(0, limit);
}

export { mockItemTypes };
