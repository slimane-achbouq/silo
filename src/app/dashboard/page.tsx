import { PinnedItems } from "@/components/dashboard/PinnedItems";
import { RecentCollections } from "@/components/dashboard/RecentCollections";
import { RecentItems } from "@/components/dashboard/RecentItems";
import { StatsCards } from "@/components/dashboard/StatsCards";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <StatsCards />
      <RecentCollections />
      <PinnedItems />
      <RecentItems />
    </div>
  );
}
