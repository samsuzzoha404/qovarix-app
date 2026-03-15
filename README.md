<div align="center">

# 🎲 Qovarix

### _Decentralized Binary Options Trading on Qubic Blockchain_

[![Live Demo](https://img.shields.io/badge/demo-live-green)](https://qovarix.app/)
[![Built with Qubic](https://img.shields.io/badge/blockchain-Qubic-blue)](https://qubic.org/)
[![Smart Contract](https://img.shields.io/badge/smart%20contract-repo-orange)](https://github.com/arafateasin/Qovarix)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**A revolutionary decentralized trading platform enabling binary options trading on tick-based price movements with transparent, on-chain execution powered by Qubic blockchain.**

[🚀 Live Demo](https://qovarix.app/) • [📜 Smart Contract](https://github.com/arafateasin/Qovarix) • [📖 Documentation](#-documentation) • [🤝 Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🎯 Live Demo](#-live-demo)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [📁 Project Structure](#-project-structure)
- [🎮 How to Use](#-how-to-use)
- [⚙️ Configuration](#️-configuration)
- [🔒 Security & Simulation Mode](#-security--simulation-mode)
- [👥 Team & Contributors](#-team--contributors)
- [🤝 Contributing](#-contributing)
- [📝 License](#-license)
- [📧 Contact](#-contact)

---

## 🎯 Live Demo

**Experience Qovarix:** [https://qovarix.app/](https://qovarix.app/)

**Smart Contract Repository:** [https://github.com/arafateasin/Qovarix](https://github.com/arafateasin/Qovarix)

---

## ✨ Features

<table>
<tr>
<td width="50%" valign="top">

### 💹 Trading Features

- **🎯 Binary Options Trading** - Place UP or DOWN bets on tick movements
- **⚡ Real-Time Price Feeds** - Live tick data from Qubic RPC
- **💰 Transparent Payouts** - 2% house fee with instant settlement
- **📊 Round-Based Trading** - 30-tick rounds (30 seconds) with countdown
- **📈 Historical Data** - Complete betting and rounds history
- **🔄 Live Updates** - Real-time round status and balance tracking

</td>
<td width="50%" valign="top">

### 🎨 User Experience

- **🔐 Wallet Integration** - Secure Qubic wallet connection
- **💎 Modern UI** - Beautiful glass-morphism design
- **🌓 Theme Support** - Dark and light mode
- **📱 Responsive Design** - Optimized for all devices
- **⚙️ Demo Mode** - Test features without real funds
- **🚀 Fast Performance** - Lightning-fast with Vite

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

<table>
<tr>
<td width="33%" valign="top">

### 🎨 Frontend

- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **TailwindCSS** - Styling
- **shadcn/ui** - UI Components
- **React Query** - Data Fetching
- **React Router** - Routing

</td>
<td width="33%" valign="top">

### ⛓️ Blockchain

- **Qubic** - Layer 1 Blockchain
- **@qubic-lib/qubic-ts-library** - TypeScript SDK
- **Custom Smart Contract** - Qovarix SC

</td>
<td width="33%" valign="top">

### 🎭 Design & UX

- **Radix UI** - Accessible Primitives
- **Lucide Icons** - Icon Library
- **date-fns** - Date Utilities
- **Recharts** - Data Visualization
- **Sonner** - Toast Notifications

</td>
</tr>
</table>

---

## 🚀 Getting Started

### 📋 Prerequisites

- **Node.js** 18+ or **Bun**
- **Package Manager**: npm, yarn, pnpm, or bun

### 🔧 Installation

```bash
# 1. Clone the repository
git clone https://github.com/samsuzzoha404/qovarix-app.git
cd qovarix-app

# 2. Install dependencies
npm install
# or
bun install

# 3. Start development server
npm run dev
# or
bun dev

# 4. Open your browser at
# http://localhost:5173
```

### 🏗️ Build for Production

```bash
# Build the project
npm run build
# or
bun run build

# Preview production build
npm run preview
# or
bun preview
```

---

## 📁 Project Structure

```
tick-deriv/
│
├── src/
│   ├── components/              # React Components
│   │   ├── bet/                # Betting UI Components
│   │   │   ├── BetAmountInput.tsx
│   │   │   ├── BetDirectionSelector.tsx
│   │   │   ├── CountdownTimer.tsx
│   │   │   ├── PayoutCalculator.tsx
│   │   │   ├── PriceChart.tsx
│   │   │   └── ...
│   │   ├── layout/             # Layout Components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── MainLayout.tsx
│   │   └── ui/                 # shadcn/ui Components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       └── ...
│   │
│   ├── config/                 # Configuration
│   │   └── constants.ts        # App constants & settings
│   │
│   ├── contexts/               # React Contexts
│   │   ├── ThemeContext.tsx    # Theme management
│   │   └── WalletContext.tsx   # Wallet state
│   │
│   ├── hooks/                  # Custom Hooks
│   │   ├── useCurrentPrice.ts  # Price feed hook
│   │   ├── usePlaceBet.ts      # Betting logic
│   │   ├── useQubicBalance.ts  # Balance tracking
│   │   └── ...
│   │
│   ├── lib/                    # Utilities & Libraries
│   │   ├── utils.ts            # Helper functions
│   │   └── qubic/              # Qubic Integration
│   │       ├── connector.ts    # Wallet connector
│   │       └── contract.ts     # Smart contract interface
│   │
│   ├── pages/                  # Page Components
│   │   ├── Dashboard.tsx       # Main dashboard
│   │   ├── PlaceBet.tsx        # Betting page
│   │   ├── RoundsHistory.tsx   # History view
│   │   └── ...
│   │
│   └── types/                  # TypeScript Types
│       └── index.ts            # Type definitions
│
├── public/                     # Static Assets
├── components.json             # shadcn/ui config
├── tailwind.config.ts          # Tailwind configuration
├── vite.config.ts              # Vite configuration
└── package.json                # Dependencies

```

---

## 🎮 How to Use

### Step 1️⃣: Connect Your Wallet

1. Click the **"Connect Wallet"** button in the header
2. Enter your Qubic wallet seed
3. Or use **Demo Mode** for testing (no real funds)

### Step 2️⃣: Place a Bet

1. Navigate to the **"Place Bet"** page
2. Choose **UP ⬆️** or **DOWN ⬇️** direction
3. Enter bet amount (min: 1, max: 10,000 QUBIC)
4. Review payout calculation (98% return on win)
5. Click **"Place Bet"** to submit

### Step 3️⃣: Track Your Bets

1. Monitor active rounds on the **Dashboard**
2. Watch the countdown timer and current tick
3. Check **"Rounds History"** for past results
4. View your betting history and balance in **"Wallet"** section

---

## ⚙️ Configuration

Key configuration can be found in [`src/config/constants.ts`](src/config/constants.ts):

```typescript
export const QUBIC_CONFIG = {
  network: "mainnet", // Network type
  rpcUrl: "https://rpc.qubic.org",
  tickDuration: 1000, // 1 second per tick
  roundDuration: 30, // 30 ticks per round
  houseFee: 0.02, // 2% house fee
  minBet: 1, // Minimum bet amount
  maxBet: 10000, // Maximum bet amount
  simulationMode: true, // Demo mode (testing)
};
```

---

## 🔒 Security & Simulation Mode

### 🧪 Current Status: Simulation Mode

The platform is currently running in **simulation mode** for safe testing:

- ✅ No real blockchain transactions
- ✅ Simulated price feeds and rounds
- ✅ Safe environment to test all features
- ✅ Perfect for learning and demonstrations

### 🚀 Production Mode

Once the smart contract is fully deployed:

- Real QUBIC transactions
- Live on-chain execution
- Actual payouts and settlements
- Production-grade security

---

## 👥 Team & Contributors

This project was built with passion and dedication by a talented team:

<table>
<tr>
<td align="center" width="50%">
<h3>🔧 Backend & Smart Contract</h3>
<p><strong>Arafat Easin</strong></p>
<p>
• Smart Contract Development (Qubic)<br>
• Backend Architecture<br>
• Blockchain Integration<br>
• Contract Security & Testing
</p>
<p>
📧 <a href="mailto:arafateasin@blocknexalabs.com">arafateasin@blocknexalabs.com</a><br>
🔗 <a href="https://github.com/arafateasin">@arafateasin</a>
</p>
</td>
<td align="center" width="50%">
<h3>🎨 Frontend Development</h3>
<p><strong>Sam Suzzoha</strong></p>
<p>
• Frontend Architecture & Development<br>
• UI/UX Design Implementation<br>
• React & TypeScript Integration<br>
• Real-time Features & Optimization
</p>
<p>
🔗 <a href="https://github.com/samsuzzoha404">@samsuzzoha404</a>
</p>
</td>
</tr>
</table>

### 🙌 Special Thanks

- **[Qubic](https://qubic.org/)** - For providing the blockchain infrastructure
- **[shadcn/ui](https://ui.shadcn.com/)** - For the beautiful component library
- **[Vercel](https://vercel.com/)** - For seamless hosting and deployment

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### 🔄 How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### 📜 Contribution Guidelines

- Follow the existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 📧 Contact

<div align="center">

### 💬 Get in Touch

We'd love to hear from you! Whether you have questions, feedback, or want to collaborate.

<table>
<tr>
<td align="center">
<h4>🔧 Technical & Backend</h4>
<p><strong>Arafat Easin</strong></p>
<p>Smart Contract & Backend Developer</p>
<p>📧 <a href="mailto:arafateasin@blocknexalabs.com">arafateasin@blocknexalabs.com</a></p>
<p>🔗 <a href="https://github.com/arafateasin">GitHub Profile</a></p>
</td>
<td align="center">
<h4>🎨 Frontend & UI/UX</h4>
<p><strong>Sam Suzzoha</strong></p>
<p>Frontend Developer</p>
<p>🔗 <a href="https://github.com/samsuzzoha404">GitHub Profile</a></p>
</td>
</tr>
</table>

### 🔗 Project Links

**📦 Frontend Repository:** [https://github.com/samsuzzoha404/qovarix-app](https://github.com/samsuzzoha404/qovarix-app)

**⚡ Smart Contract Repository:** [https://github.com/arafateasin/Qovarix](https://github.com/arafateasin/Qovarix)

**🌐 Live Application:** [https://qovarix.app/](https://qovarix.app/)

</div>

---

<div align="center">

### 🌟 If you found this project helpful, please consider giving it a star! ⭐

**Built with ❤️ on Qubic Blockchain**

_Empowering decentralized trading, one tick at a time._

</div>
