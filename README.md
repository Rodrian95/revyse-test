# Revyse - Test Crypto Dashboard - Remix + CoinGecko + DnD Kit

This is a dynamic cryptocurrency dashboard built with [Remix](https://remix.run/) that displays real-time pricing data using the [CoinGecko API](https://www.coingecko.com/en/api). It allows users to view, filter, and sort the top cryptocurrencies by dragging and dropping.

## Features

- ✅ Displays top 10 cryptocurrencies
- ✅ Real-time price in USD and BTC
- ✅ Drag & drop reordering using `@dnd-kit/core`
- ✅ Live filtering by name or symbol
- ✅ Manual data refresh
- ✅ Fully responsive layout (TailwindCSS)
- ✅ SSR & Client-friendly (Remix loader + `window.ENV`)

---

## 📦 Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/crypto-dashboard.git
cd crypto-dashboard
```

2. **Install dependencies**

```bash
npm i
```

3. **Create a .env file**

```env
PUBLIC_COINGECKO_API=https://api.coingecko.com/api/v3
PUBLIC_COINS_PER_PAGE=10
PUBLIC_COINS_VS_CURRENCY=usd
```

2. **Start development server**

```bash
npm run dev
```

**Development Notes**

1. Switched from Coinbase to CoinGecko

Coinbase API was initially considered, but it lacked support for multiple IDs and BTC-based conversion in a single query. CoinGecko proved to be more flexible with:
• /coins/markets for USD prices
• /simple/price for BTC conversion

2. Drag & Drop: @dnd-kit/core

react-beautiful-dnd was initially used but caused rendering issues inside Remix (Unable to find drag handle). It was replaced with @dnd-kit/core and @dnd-kit/sortable, which worked seamlessly in our SSR setup.

3. First time using Remix

I never worked with Remix before but I tried to look and see what are best practices for handle ENV variables in server and client side and also to understand how fetching data works.

## 📌 TODO

- [ ] **unit tests**  
      _Reason:_ Due to time constraints and focus on API integration and DnD functionality, test coverage was deferred. Jest is the preferred choice for future implementation.

- [ ] **light/dark mode support**  
      _Reason:_ UI polish was de-prioritized in favor of core logic, SSR integration, and environment config. Tailwind makes this easy to integrate.
