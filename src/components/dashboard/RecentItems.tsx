import { ItemCard } from "@/components/dashboard/ItemCard";
import { getRecentItems } from "@/lib/db/items";

export async function RecentItems() {
  const items = await getRecentItems(10);

  if (items.length === 0) return null;

  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold">Recent items</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
