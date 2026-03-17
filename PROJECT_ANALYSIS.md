# Qovarix App — সম্পূর্ণ প্রজেক্ট বিশ্লেষণ

> বিশ্লেষণের তারিখ: ২০২৬-০৩-১৬
> Branch: `main` | Last commit: `5cb94e4` (Readme updated)

---

## সংক্ষিপ্ত পরিচিতি

**Qovarix** হলো Qubic ব্লকচেইনের উপর তৈরি একটি **Binary Options Trading** প্ল্যাটফর্মের সম্পূর্ণ ফ্রন্টএন্ড ডেমো। ইউজার UP বা DOWN বেট করে ticks-এর মধ্যে। এটি পুরোপুরি **client-only SPA** — কোনো ব্যাকেন্ড নেই, সব ডেটা browser localStorage-এ থাকে। স্মার্ট কন্ট্র্যাক্ট এখনো Qubic নেটওয়ার্কে deploy হয়নি।

---

## ১. টেকনোলজি স্ট্যাক

| লেয়ার | টেকনোলজি |
|---|---|
| UI Framework | React 18.3 + Vite (SWC) |
| Routing | React Router DOM v6 |
| Server State | TanStack Query (React Query) v5 |
| UI Components | shadcn/ui (40+ কম্পোনেন্ট) + Radix UI primitives |
| Styling | Tailwind CSS v3 + custom CSS variables |
| Icons | Lucide React |
| Blockchain SDK | `@qubic-lib/qubic-ts-library` v0.1.6 |
| Notifications | Sonner (toast) |
| Language | TypeScript (strict mode OFF) |
| Build | Vite, dev port 8080 |
| Package Manager | Bun (bun.lockb আছে) + npm (package-lock.json-ও আছে) |

### ইন্সটল কিন্তু **ব্যবহার হচ্ছে না** এমন প্যাকেজ

| প্যাকেজ | কারণ |
|---|---|
| `recharts` | Chart কাস্টম SVG দিয়ে করা হয়েছে |
| `next-themes` | নিজস্ব `ThemeContext` ব্যবহার হচ্ছে |
| `react-hook-form` + `@hookform/resolvers` | কোনো ফর্মে ব্যবহার নেই |
| `zod` | ভ্যালিডেশন নেই |

---

## ২. ফাইল স্ট্রাকচার

```
qovarix-app/
├── public/
│   ├── Logo White.png
│   ├── Logo black.png
│   ├── Qovarix icon big.png
│   └── manifest.json              ← PWA manifest
├── src/
│   ├── main.tsx                   ← App entry point
│   ├── App.tsx                    ← Router + Provider stack
│   ├── index.css                  ← Global CSS, CSS variables, glassmorphism utilities
│   ├── config/
│   │   └── constants.ts           ← QUBIC_CONFIG (simulationMode: true), ROUTES, REFETCH_INTERVALS
│   ├── types/
│   │   └── index.ts               ← সব TypeScript interface
│   ├── lib/
│   │   ├── utils.ts               ← cn(), formatNumber, formatCurrency, formatAddress
│   │   └── qubic/
│   │       ├── connector.ts       ← Qubic RPC wrapper class (balance, tick, broadcast)
│   │       └── contract.ts        ← সব contract function + simulation layer
│   ├── contexts/
│   │   ├── ThemeContext.tsx        ← Dark/light mode provider
│   │   └── WalletContext.tsx       ← Wallet state, demo/real, localStorage
│   ├── hooks/
│   │   ├── useCurrentPrice.ts
│   │   ├── useLiveTick.ts
│   │   ├── usePlaceBet.ts
│   │   ├── useQubicBalance.ts
│   │   ├── useRound.ts
│   │   ├── useRoundsHistory.ts
│   │   ├── useUserBets.ts
│   │   ├── useWallet.ts
│   │   ├── useWalletContext.ts
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── pages/
│   │   ├── Dashboard.tsx          ← হোমপেজ
│   │   ├── PlaceBet.tsx           ← বেট করার পেজ
│   │   ├── RoundsHistory.tsx      ← রাউন্ড হিস্ট্রি টেবিল
│   │   ├── WalletPage.tsx         ← ওয়ালেট + বেট হিস্ট্রি + ক্লেম
│   │   ├── SettingsPage.tsx       ← সেটিংস
│   │   └── NotFound.tsx           ← 404
│   └── components/
│       ├── layout/
│       │   ├── MainLayout.tsx     ← Header + main + Footer shell
│       │   ├── Header.tsx         ← Sticky nav, logo, wallet, mobile menu
│       │   └── Footer.tsx         ← Logo, links, network badge
│       ├── bet/
│       │   ├── BetAmountInput.tsx
│       │   ├── BetDirectionSelector.tsx
│       │   ├── CountdownTimer.tsx
│       │   ├── PayoutCalculator.tsx
│       │   ├── PriceChart.tsx     ← Custom SVG chart (recharts নয়)
│       │   ├── PriceDisplay.tsx
│       │   ├── RecentBets.tsx
│       │   ├── ResultBadge.tsx
│       │   └── RoundInfo.tsx
│       ├── DemoBanner.tsx
│       ├── NavLink.tsx
│       ├── ResetDemoButton.tsx
│       ├── WalletConnectButton.tsx
│       └── ui/                    ← সম্পূর্ণ shadcn/ui লাইব্রেরি (40+ কম্পোনেন্ট)
│           ├── glass-card.tsx     ← কাস্টম glassmorphism card
│           ├── spinner.tsx        ← কাস্টম loading spinner
│           └── [accordion, alert, avatar, badge, button, card, dialog, ...]
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json / tsconfig.app.json
├── package.json
└── bun.lockb
```

---

## ৩. রাউটিং

| Route | Component | বিবরণ |
|---|---|---|
| `/` | `Dashboard` | হোম — প্রাইস, চার্ট, টাইমার, Quick Bet বাটন |
| `/bet` | `PlaceBet` | বেট পেজ — `?direction=UP\|DOWN` query param পড়ে |
| `/history` | `RoundsHistory` | ১০০ রাউন্ড টেবিল, ২০/পেজ pagination |
| `/wallet` | `WalletPage` | ওয়ালেট ব্যালেন্স, স্ট্যাটস, বেট হিস্ট্রি, ক্লেম |
| `/settings` | `SettingsPage` | থিম, নেটওয়ার্ক, নোটিফিকেশন, সিকিউরিটি |
| `*` | `NotFound` | 404 ফলব্যাক |

---

## ৪. Provider Stack (বাইরে থেকে ভেতরে)

```
QueryClientProvider (TanStack Query)
  ThemeProvider (dark/light, localStorage)
    WalletProvider (wallet state, demo/real)
      TooltipProvider (Radix)
        Toaster + Sonner
          BrowserRouter
            Routes
```

---

## ৫. UI ডিজাইন — কিভাবে করা হয়েছে

### ডিজাইন সিস্টেম

- **Glassmorphism** স্টাইল: `backdrop-blur`, semi-transparent backgrounds, subtle border glow
- **রঙ প্যালেট**: Dark theme by default, teal/cyan primary (`#06b6d4`), green for UP, red for DOWN, purple accent
- **ফন্ট**: Inter (body) + JetBrains Mono (numbers/addresses)
- **Custom CSS Variables** (`index.css` এ): `--primary`, `--up`, `--down`, `--glass`, `--glass-border`, `--radius`
- **Custom Tailwind Classes**: `glow-up`, `glow-down`, `glass`, `glass-card`, `gradient-text`, `pulse-glow`

### থিম

- Dark mode default (`<html class="dark">`)
- `/settings` পেজে toggle আছে — **কাজ করে**
- Logo switch হয়: dark → white logo, light → black logo

### Responsive Design

- Mobile breakpoint: `useIsMobile()` hook (768px)
- Header: desktop nav বনাম mobile hamburger Sheet menu
- Balance display মোবাইলে hidden
- Grid layout responsive (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)

### Custom Components

| Component | বিবরণ |
|---|---|
| `GlassCard` | Glassmorphism wrapper — সব কার্ডে ব্যবহার |
| `Spinner` | Loading state indicator |
| `ResultBadge` | UP (green+↑) / DOWN (red+↓) / Pending (grey) pill |
| `PriceChart` | SVG polyline, last 50 data points, gradient fill area, pulsing dot |
| `CountdownTimer` | Ticks remaining + progress bar, red flash ≤5 ticks |

---

## ৬. Data Flow Architecture

```
blockchain (RPC / simulation)
        ↓
  lib/qubic/contract.ts   ←→   lib/qubic/connector.ts
        ↓
  hooks/ (TanStack Query wrappers)
        ↓
  pages/ + components/ (React state consumption)
        ↓
  localStorage (demo state persistence)
```

### Polling Intervals

| Hook | Interval |
|---|---|
| `useLiveTick()` | ১০০০ms |
| `useCurrentPrice()` | ২০০০ms |
| `useCurrentRound()` | ১০০০ms |
| `useRound(id)` | ৫০০০ms |
| `useRoundsHistory(limit)` | ৫০০০ms |
| `useUserBets()` | ৫০০০ms |
| `useUserClaimable()` | ৫০০০ms |
| `useQubicBalance()` | ২০০০ms (real wallet only) |

---

## ৭. Qubic Blockchain Integration

### connector.ts — কি করে

- `@qubic-lib/qubic-ts-library`-এর `QubicHelper` ব্যবহার করে
- Seed → address + publicKey derive করে (`createIdPackage`)
- `GET /v1/balances/{address}` — real balance fetch
- `GET /v1/tick-info` — current tick fetch
- `POST /v1/broadcast-transaction` — signed transaction broadcast
- Contract address hardcoded: `contractId 1 → 'BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARMID'`

### Dev Proxy

```
/api/qubic  →  https://rpc.qubic.org  (vite.config.ts এ CORS bypass)
```

**নোট:** Testnet RPC (`testnet-rpc.qubic.org`) 521 error দেয়, তাই mainnet RPC ব্যবহার হচ্ছে।

### contract.ts — Simulation Layer

প্রতিটি function প্রথমে `simulationMode` চেক করে:

```typescript
// src/config/constants.ts
simulationMode: true  // ← এটা false হলে real API call হবে
```

**Simulation Mechanics:**

| বিষয় | কিভাবে সিমুলেট হয় |
|---|---|
| Price | Random walk, velocity × 0.95 + random force, range `[0.00001, 0.0001]` QVX/USD |
| Ticks | `Math.floor((Date.now() - new Date('2024-01-01')) / 1000)` — epoch-based |
| Rounds | `roundId = Math.floor(tick / 30)` — প্রতি ৩০ tick এ নতুন রাউন্ড |
| Pool sizes | Random 10k–60k QVX fake data |
| Bet resolution | Actual simulated price movement তুলনা করে; fallback `Math.random() > 0.48` |
| Payout | 1.9× (10% house cut) |

### localStorage Keys

| Key | উদ্দেশ্য |
|---|---|
| `qubic_wallet_connected` | Connection persist |
| `qubic_demo_wallet` | Demo mode flag |
| `qubic_demo_balance` | Demo balance |
| `qubic_demo_bets` | Simulated bets (JSON) |
| `qubic_demo_price` | Current price |
| `qubic_demo_price_history` | Price history array |
| `qubic_demo_round_prices` | Per-round start/end prices |
| `theme` | `'dark'` বা `'light'` |
| `qubic_wallet_seed` *(sessionStorage)* | Real seed (session-only) |

---

## ৮. পেজ-বাই-পেজ বিশ্লেষণ

### Dashboard (`/`)
- Wallet সংযুক্ত না থাকলে `WalletConnectButton` দেখায়
- Price display + SVG chart + countdown timer
- UP/DOWN দুটো বড় glassmorphism কার্ড → `/bet?direction=UP|DOWN` এ নিয়ে যায়
- নিচে ৫টা সাম্প্রতিক রাউন্ড, RoundInfo sidebar, RecentBets sidebar

### PlaceBet (`/bet`)
- `?direction` query param থেকে UP/DOWN pre-select হয়
- Direction selector, amount input, payout calculator, round info
- বেট সফল হলে ৩ সেকেন্ডের confirmation card দেখায়

### RoundsHistory (`/history`)
- ১০০ রাউন্ড fetch, client-side ২০/পেজ pagination
- কলাম: Round#, Start Price, End Price, % Change, Result, Total Pool, Winners Pool, Time

### WalletPage (`/wallet`)
- Address copy + external link (link `#` — non-functional)
- Balance, claimable amount
- Stats grid: Total Bets, Wins, Losses, Win Rate, Total Wagered, Total Won
- Bet history list (প্রতিটি বেটের direction, amount, result)
- Claimable per-round Claim বাটন
- **"Claim All" বাটন আছে কিন্তু onClick নেই — dead button**

### SettingsPage (`/settings`)
- Demo mode reset: কাজ করে (সব demo localStorage মুছে ফেলে)
- Appearance (dark toggle): কাজ করে
- Network: Static "Surge Testnet — Connected", "Mainnet coming soon"
- Notifications (3 switch): UI আছে, state save হয় না, কোনো logic নেই
- Security (2 switch): UI আছে, কোনো logic নেই
- Language: Static "English only", "More languages coming soon"

---

## ৯. কোন Feature কাজ করছে / কাজ করছে না

### ✅ সম্পূর্ণ কাজ করছে (Demo Mode)

- Demo wallet connect/disconnect (১০,০০০ QVX দিয়ে শুরু)
- Simulated price feed (random walk + history)
- Round creation (৩০-tick rounds, fake pool data)
- UP/DOWN বেট place করা (balance deduct হয়)
- Bet history দেখা + win/loss resolution
- Claimable winnings list + per-round Claim বাটন
- Dashboard — price, chart, timer, quick-bet links
- Rounds history page (৫ পেজ pagination)
- Wallet page stats + bet history
- Dark/light theme toggle
- Demo data reset
- Page reload-এ auto-reconnect (demo + real wallet)
- PWA manifest
- Mobile responsive navigation
- Sticky header + balance display

### ⚠️ আংশিক কাজ করছে

| ফিচার | অবস্থা |
|---|---|
| Real wallet connect | Address derive + balance fetch কাজ করে; কিন্তু বেট করলে non-existent contract-এ transaction যাবে |
| ExternalLink (wallet page) | `href="#"` — block explorer এ link করে না |
| Price oracle | `tick-info` endpoint tick number দেয়, price নয় — simulation fallback |

### ❌ কাজ করছে না / Placeholder

| ফিচার | কারণ |
|---|---|
| **Smart Contract** | Qubic-এ deploy হয়নি, `simulationMode: true` hard-coded |
| **"Claim All" বাটন** | `onClick` handler নেই — dead UI |
| **Footer links** | সব `href="#"` — Documentation, Surge, Support কোনোটাই real link নয় |
| **Settings Notifications** | Switch UI আছে, state save বা notification logic নেই |
| **Settings Security switches** | Switch UI আছে, কোনো effect নেই |
| **Settings Language** | i18n নেই, static "English only" |
| **Mainnet support** | "Coming soon" |
| **Multi-language** | "Coming soon" |
| **`mapRoundData/mapBetData/mapClaimableData`** | contract.ts-এ defined কিন্তু কোথাও call হয় না — dead code |

---

## ১০. PayoutCalculator Logic

```
houseFee = 2%
totalAfterFee = (upPool + downPool) × 0.98
expectedPayout = totalAfterFee × (betAmount / (winnerPool + betAmount))
profit = expectedPayout - betAmount
multiplier = expectedPayout / betAmount
```

---

## ১১. WalletConnectButton

দুটো Tab (simulation mode-এ):

**Demo Wallet:**
- এক ক্লিকে connect, ১০,০০০ QVX দিয়ে শুরু
- localStorage-এ state persist হয়

**Real Wallet:**
- ৫৫+ character seed phrase input (password field)
- sessionStorage-এ seed রাখে (tab বন্ধ হলে মুছে যায়)
- `QubicHelper.createIdPackage(seed)` দিয়ে address derive
- Balance RPC থেকে fetch করে

---

## ১২. কোড কোয়ালিটি নোট

| বিষয় | অবস্থা |
|---|---|
| TypeScript strict mode | **OFF** — `noImplicitAny: false`, `strictNullChecks: false` |
| Unused imports/variables | `noUnusedLocals: false` — কোনো warning নেই |
| `recharts` installed | কাজ করছে না, bundle size বাড়াচ্ছে |
| `next-themes` installed | কাজ করছে না, custom ThemeContext duplicate করছে |
| Dead code | `mapRoundData/mapBetData/mapClaimableData` — কোথাও call নেই |
| PWA theme color conflict | `manifest.json`-এ `#7c3aed` (purple), CSS-এ teal primary — inconsistent |
| Console error | `NotFound.tsx` `console.error()` call করে |
| Seed in sessionStorage | Security concern — seed plaintext রাখা হচ্ছে |

---

## ১৩. Production-এ নিতে হলে যা করতে হবে

```
১. Qovarix smart contract Qubic network-এ deploy করা
   ↓
২. src/config/constants.ts:
   simulationMode: false  করা
   ↓
৩. Real price oracle implement করা
   (Qubic tick-based price বা external feed)
   ↓
৪. mapRoundData / mapBetData / mapClaimableData
   functions real API response-এর সাথে wire করা
   ↓
৫. WalletPage "Claim All" বাটনে onClick handler যোগ করা
   ↓
৬. Footer links real URL দিয়ে replace করা
   ↓
৭. WalletPage ExternalLink block explorer URL দেওয়া
   ↓
৮. Settings notification/security switches logic implement করা
   ↓
৯. TypeScript strict mode চালু করা + type errors fix করা
   ↓
১০. Unused packages (recharts, next-themes, zod, react-hook-form) সরানো
```

---

## ১৪. App-এর Core Loop (Demo Mode)

```
১. ইউজার Demo Wallet connect করে (১০,০০০ QVX)
         ↓
২. App প্রতি ১s-এ simulated tick poll করে
   App প্রতি ২s-এ simulated price poll করে
   currentRound = Math.floor(tick / 30)
         ↓
৩. ইউজার UP বা DOWN select করে + amount দেয়
         ↓
৪. contract.placeBet() →
   - localStorage balance থেকে amount deduct করে
   - bet localStorage-এ store করে
         ↓
৫. রাউন্ড শেষ হলে (৩০ tick পার):
   contract.getUserBets() →
   - simulated price movement তুলনা করে won/lost decide করে
         ↓
৬. WalletPage-এ Claim করলে →
   - 1.9× payout localStorage balance-এ যোগ হয়
```

---

*এই ফাইলটি প্রজেক্টের বর্তমান একটি সম্পূর্ণ snapshot। প্রজেক্ট পরিবর্তন হলে এটি update করুন।*
