import { ItemCard } from "@/components/dashboard/ItemCard";
import { getPinnedItems } from "@/lib/dashboard";

export function PinnedItems() {
  const items = getPinnedItems();

  if (items.length === 0) return null;

  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold">Pinned items</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
