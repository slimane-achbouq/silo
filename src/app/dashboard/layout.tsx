import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getFavoriteCollections, getRecentCollections } from "@/lib/db/collections";
import { getItemTypes } from "@/lib/db/items";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [itemTypes, favoriteCollections, recentCollections] = await Promise.all([
    getItemTypes(),
    getFavoriteCollections(),
    getRecentCollections(),
  ]);

  return (
    <DashboardShell
      itemTypes={itemTypes}
      favoriteCollections={favoriteCollections}
      recentCollections={recentCollections}
    >
      {children}
    </DashboardShell>
  );
}
