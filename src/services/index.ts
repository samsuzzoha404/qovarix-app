// ─── Adapter Registry ─────────────────────────────────────────────────────────
// The single place that selects and exposes the active IDataAdapter.
//
// All hooks and providers import `dataAdapter` from here.
// To switch data backends, change ACTIVE_ADAPTER in config/app.ts.
//
// Current adapters:
//   'mock'           → MockAdapter (demo/simulation, active now)
//   'engineApi'      → EngineApiAdapter (scaffold, Phase 3+)
//   'smartContract'  → SmartContractAdapter (scaffold, Phase 4+)
// ─────────────────────────────────────────────────────────────────────────────

import type { IDataAdapter } from './adapter';
import { MockAdapter } from './adapters/mockAdapter';
import { EngineApiAdapter } from './adapters/engineApiAdapter';
import { SmartContractAdapter } from './adapters/smartContractAdapter';
import { ACTIVE_ADAPTER } from '@/config/app';

function createAdapter(): IDataAdapter {
  switch (ACTIVE_ADAPTER) {
    case 'mock':
      return new MockAdapter();
    case 'engineApi':
      // TODO: pass engine API base URL from env
      return new EngineApiAdapter(import.meta.env.VITE_ENGINE_API_URL ?? '');
    case 'smartContract':
      return new SmartContractAdapter();
    default:
      return new MockAdapter();
  }
}

// Singleton — one adapter instance for the lifetime of the app
export const dataAdapter: IDataAdapter = createAdapter();

// Re-export the interface for convenience
export type { IDataAdapter } from './adapter';
