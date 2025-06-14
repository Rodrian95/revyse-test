import { Coin } from "~/types/cripto";

declare global {
  interface Window {
    ENV: {
      COINGECKO_API: string;
      COINS_PER_PAGE: string;
      COINS_VS_CURRENCY: string;
    };
  }
}

function getEnvValue(key: keyof typeof window.ENV): string {
  const value =
    typeof window !== "undefined"
      ? window.ENV?.[key]
      : process.env[`PUBLIC_${key}`];

  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
}

export async function fetchCryptoData(): Promise<Coin[]> {
  try {
    const API_URL = getEnvValue("COINGECKO_API");
    const PER_PAGE = getEnvValue("COINS_PER_PAGE");
    const VS_CURRENCY = getEnvValue("COINS_VS_CURRENCY");

    const currencyRes = await fetch(
      `${API_URL}/coins/markets?vs_currency=${VS_CURRENCY}&per_page=${PER_PAGE}&sparkline=false`
    );

    if (!currencyRes.ok) {
      throw new Error(
        `Failed to fetch currency data: ${currencyRes.statusText}`
      );
    }

    const currency = await currencyRes.json();

    const btcRes = await fetch(
      `${API_URL}/simple/price?ids=${currency
        .map((c: any) => c.id)
        .join(",")}&vs_currencies=btc`
    );

    if (!btcRes.ok) {
      throw new Error(`Failed to fetch BTC prices: ${btcRes.statusText}`);
    }

    const btc = await btcRes.json();

    return currency.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      image: coin.image,
      current_price: coin.current_price,
      price_btc: btc[coin.id]?.btc ?? 0,
    }));
  } catch (err) {
    console.error("Error in fetchCryptoData:", err);
    throw new Error("Unable to fetch cryptocurrency data.");
  }
}
