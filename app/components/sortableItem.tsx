import { useSortable } from "@dnd-kit/sortable";
import { Coin } from "~/types/cripto";
import { CryptoCard } from "./card";
import { CSS } from "@dnd-kit/utilities";

export default function SortableItem({ coin }: { coin: Coin }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: coin.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <CryptoCard coin={coin} />
    </div>
  );
}