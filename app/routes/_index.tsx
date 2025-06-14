import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { fetchCryptoData } from "~/utils/fetchCrypto";
import type { Coin } from "~/types/cripto";
import SortableItem from "~/components/sortableItem";
import { CRYPTO_ORDER_KEY } from "~/constants/storageKeys";

export const loader = async () => {
  const data = await fetchCryptoData();
  return data;
};

export default function Index() {
  const initialCoins = useLoaderData<typeof loader>();
  const [coins, setCoins] = useState<Coin[]>(initialCoins);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    const savedOrder = localStorage.getItem(CRYPTO_ORDER_KEY);
    if (savedOrder) {
      try {
        const ids: string[] = JSON.parse(savedOrder);
        const ordered = ids
          .map((id) => initialCoins.find((c) => c.id === id))
          .filter((c): c is Coin => !!c);
        const missing = initialCoins.filter((c) => !ids.includes(c.id));
        setCoins([...ordered, ...missing]);
      } catch (e) {
        console.error("Failed to parse saved order", e);
      }
    }
  }, [initialCoins]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = coins.findIndex((c) => c.id === active.id);
      const newIndex = coins.findIndex((c) => c.id === over.id);
      const newOrder = arrayMove(coins, oldIndex, newIndex);
      setCoins(newOrder);
      localStorage.setItem(
        CRYPTO_ORDER_KEY,
        JSON.stringify(newOrder.map((c) => c.id))
      );
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    const data = await fetchCryptoData();

    const savedOrder = localStorage.getItem(CRYPTO_ORDER_KEY);
    if (savedOrder) {
      try {
        const ids: string[] = JSON.parse(savedOrder);
        const ordered = ids
          .map((id) => data.find((c) => c.id === id))
          .filter((c): c is Coin => !!c);
        const missing = data.filter((c) => !ids.includes(c.id));
        setCoins([...ordered, ...missing]);
      } catch (e) {
        console.error("Invalid order format", e);
        setCoins(data);
      }
    } else {
      setCoins(data);
    }

    setLoading(false);
  };

  const filteredCoins = coins.filter((coin) =>
    `${coin.name} ${coin.symbol}`.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-2">
        <input
          type="text"
          placeholder="Search by name or symbol (e.g., BTC)"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-4 py-2 rounded shadow-sm w-full sm:w-1/2"
        />
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh Rates"}
        </button>
      </div>

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <SortableContext
          items={filteredCoins.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredCoins.map((coin) => (
              <SortableItem key={coin.id} coin={coin} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}