import { auth } from "@/auth";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getFavoriteCollections, getRecentCollections } from "@/lib/db/collections";
import { getItemTypes } from "@/lib/db/items";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [session, itemTypes, favoriteCollections, recentCollections] = await Promise.all([
    auth(),
    getItemTypes(),
    getFavoriteCollections(),
    getRecentCollections(),
  ]);

  const user = {
    name: session?.user?.name ?? "User",
    email: session?.user?.email ?? "",
    image: session?.user?.image,
  };

  return (
    <DashboardShell
      itemTypes={itemTypes}
      favoriteCollections={favoriteCollections}
      recentCollections={recentCollections}
      user={user}
    >
      {children}
    </DashboardShell>
  );
}
