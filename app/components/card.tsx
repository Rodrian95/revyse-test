import type { Coin } from "../types/cripto";
import type { HTMLAttributes } from "react";

type Props = {
  coin: Coin;
  dragHandleProps?: HTMLAttributes<HTMLDivElement> | null;
  draggableProps?: HTMLAttributes<HTMLDivElement>;
  innerRef?: (element: HTMLElement | null) => void;
};

export function CryptoCard({ coin, dragHandleProps, draggableProps, innerRef }: Props) {
  return (
    <div
      ref={innerRef}
      {...draggableProps}
      {...dragHandleProps}
      className="p-4 border shadow rounded bg-white flex flex-col items-center text-center"
    >
      <img src={coin.image} alt={coin.name} className="w-12 h-12 mb-2" />
      <h2 className="text-xl font-semibold text-gray-500">
        {coin.name}{" "}
        <span className="text-gray-500">({coin.symbol})</span>
      </h2>
      <p className="text-gray-500">USD: ${coin.current_price.toFixed(2)}</p>
      <p className="text-gray-500">BTC: {coin.price_btc.toFixed(8)}</p>
    </div>
  );
}