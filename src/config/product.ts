// ─── Product Identity ─────────────────────────────────────────────────────────
// Centralized source-of-truth for product copy, mode configuration, and token
// terminology. Import from here instead of scattering hardcoded strings.
// ─────────────────────────────────────────────────────────────────────────────

// App environment modes
export enum AppMode {
  Demo = 'demo',
  Testnet = 'testnet',
  Live = 'live',
}

// The active mode for this build. Change this single constant to switch modes.
export const CURRENT_APP_MODE: AppMode = AppMode.Demo;

export const APP_MODE_META: Record<AppMode, {
  label: string;
  badge: string;
  description: string;
  available: boolean;
}> = {
  [AppMode.Demo]: {
    label: 'Demo',
    badge: 'Demo Mode',
    description: 'Simulated trading with demo credits. No real funds involved.',
    available: true,
  },
  [AppMode.Testnet]: {
    label: 'Testnet',
    badge: 'Testnet',
    description: 'Test trading on Base Sepolia with testnet funds.',
    available: false,
  },
  [AppMode.Live]: {
    label: 'Live',
    badge: 'Live',
    description: 'Binary trading on Base mainnet with real collateral.',
    available: false,
  },
};

// ─── Product Copy ─────────────────────────────────────────────────────────────

export const PRODUCT = {
  name: 'Qovarix',
  tagline: 'Ultra-short-term binary trading on Base',
  heroHeadline: 'Binary Trading on Base',
  heroSubtext:
    'Predict price direction in 15–30 second rounds. Non-custodial design. Transparent outcomes. AI signals advisory only.',

  // Chain identity
  chain: 'Base',
  chainTestnet: 'Base Testnet',
  chainMainnet: 'Base Mainnet',

  // Platform positioning
  positioningBullets: [
    'Base-native, non-custodial architecture',
    '15–30 second binary rounds',
    'AI signals are advisory only — not automated, not guaranteed',
    'Transparent round settlement',
  ],

  // AI disclaimer
  aiDisclaimer:
    'AI signals are for informational purposes only. They are not investment advice and do not guarantee any outcome.',

  // Round timing
  roundDurationLabel: '15–30 sec',

  // Footer
  footerTagline: 'Non-custodial binary trading on Base',
  copyrightSuffix: 'Non-custodial binary trading on Base.',
};

// ─── Token & Collateral Terminology ──────────────────────────────────────────

export const TOKEN_LABELS = {
  // Trading side — future USDC/ETH collateral
  tradingBalance: 'Trading Balance',
  tradingBalanceDemoSuffix: '(Demo)',
  collateralUnit: 'QVX',       // demo era unit; future: USDC / ETH
  collateralUnitFull: 'QVX Credits',

  // QVX ecosystem token role
  qvxLabel: 'QVX',
  qvxRole: 'Ecosystem & Rewards Token',
  qvxDescription:
    'QVX is the Qovarix ecosystem token used for protocol fees, burn mechanics, and rewards. It is not the primary trading collateral.',

  // Rewards / winnings side
  rewardsLabel: 'QVX Rewards',
  claimableLabel: 'Claimable Rewards',

  // Pool terminology
  poolUnit: 'QVX',
};

// ─── UI Copy ──────────────────────────────────────────────────────────────────

export const UI_COPY = {
  // Wallet connect dialog
  walletConnectTitle: 'Connect to Qovarix',
  walletConnectSubtext: 'Use Demo Wallet today. Live wallet support is coming in live integration.',
  demoWalletTitle: 'Demo Wallet',
  demoWalletDescription:
    'Instant access with demo credits. Simulate real trading rounds, no real funds required.',

  // Trades
  tradePlacedTitle: 'Trade Placed',
  tradePlacedSubtext: 'Your trade has been entered. Round results in seconds.',
  noTradesYet: 'No trades yet',
  tradeHistory: 'Trade History',
  recentTrades: 'Recent Trades',
  totalTrades: 'Total Trades',

  // Balance labels
  balanceLabel: 'Trading Balance',
  insufficientBalance: 'Insufficient trading balance',

  // Page titles
  placeTradePage: 'Place Trade',
  // Pari-mutuel aligned — no fixed multiplier framing
  placeTradeSubtext: 'Predict price direction. Winners share the round pool after fees. Payout is dynamic until round lock.',

  // Submit button
  placingTrade: 'Placing Trade...',
  placeTrade: 'Place Trade',

  // Payout / pari-mutuel copy
  payoutEstimateLabel: 'Est. Payout',
  payoutEstimateNote: 'Dynamic estimate — updates until round lock',
  payoutPoolShareLabel: 'Est. Pool Share',
  maxLossLabel: 'Max Loss',
  protocolFeeLabel: 'Protocol Fee',
  balanceAfterLabel: 'Balance After',
  roundLockWarning: 'Round is locking — no new positions accepted',
  roundLockedWarning: 'Round locked — settlement in progress',
  awaitingSettlement: 'Awaiting Settlement',
  awaitingSettlementDetail: 'Your position is entered. Round settles in seconds.',

  // Modes
  demoModeActive: 'Demo Mode',
  demoModeDetail:
    'You are using demo credits. All trades are fully simulated. Your session state persists in your browser.',
};
