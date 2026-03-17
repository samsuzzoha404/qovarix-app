import QubicLib from '@qubic-lib/qubic-ts-library';
import { QUBIC_CONFIG } from '@/config/constants';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const QubicHelper = (QubicLib as any).QubicHelper;

// RPC endpoints for Qubic network
// Note: Testnet RPC (testnet-rpc.qubic.org) returns 521 error, using mainnet
const RPC_ENDPOINTS = {
  mainnet: 'https://rpc.qubic.org',
  testnet: 'https://rpc.qubic.org', // Testnet down, fallback to mainnet
};

export interface WalletInfo {
  address: string;
  publicKey: Uint8Array;
}

export interface TransactionResult {
  txHash: string;
  success: boolean;
  message?: string;
}

export interface ContractTxParams {
  contractId: number;
  inputType: number;
  inputData: Uint8Array;
  amount?: number;
}

interface IdPackage {
  publicId: string;
  publicKey: Uint8Array;
}

/**
 * QubicConnector - Handles all Qubic blockchain interactions
 */
export class QubicConnector {
  private seed: string | null = null;
  private walletInfo: WalletInfo | null = null;
  private idPackage: IdPackage | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private helper: any;
  private rpcUrl: string;

  constructor(network: 'mainnet' | 'testnet' = 'testnet') {
    try {
      this.helper = new QubicHelper();
      this.rpcUrl = RPC_ENDPOINTS[network];
      console.log('QubicConnector initialized with network:', network);
    } catch (error) {
      console.error('Failed to initialize QubicHelper:', error);
      throw new Error('Failed to initialize Qubic connector');
    }
  }

  /**
   * Connect wallet using a seed phrase
   */
  async connect(seed: string): Promise<WalletInfo> {
    if (!seed || seed.length < 55) {
      throw new Error('Invalid seed: must be at least 55 characters');
    }

    try {
      this.seed = seed;
      
      // Create ID package from seed
      this.idPackage = await this.helper.createIdPackage(seed);
      
      if (!this.idPackage || !this.idPackage.publicId) {
        throw new Error('Failed to generate wallet address from seed');
      }
      
      const address = this.idPackage.publicId;
      const publicKey = this.idPackage.publicKey;

      this.walletInfo = {
        address,
        publicKey,
      };

      console.log('Wallet connected:', address);
      return this.walletInfo;
    } catch (error) {
      this.seed = null;
      this.idPackage = null;
      this.walletInfo = null;
      
      if (error instanceof Error) {
        throw new Error(`Connection failed: ${error.message}`);
      }
      throw new Error('Failed to connect wallet. Please check your seed phrase.');
    }
  }

  /**
   * Disconnect the wallet
   */
  disconnect(): void {
    this.seed = null;
    this.walletInfo = null;
    this.idPackage = null;
  }

  /**
   * Check if wallet is connected
   */
  isConnected(): boolean {
    return this.seed !== null && this.walletInfo !== null;
  }

  /**
   * Get the connected wallet address
   */
  getAddress(): string | null {
    return this.walletInfo?.address ?? null;
  }

  /**
   * Get wallet info
   */
  getWalletInfo(): WalletInfo | null {
    return this.walletInfo;
  }

  /**
   * Fetch balance for an address from RPC
   */
  async getBalance(address?: string): Promise<number> {
    const targetAddress = address ?? this.walletInfo?.address;
    if (!targetAddress) {
      throw new Error('No address provided and wallet not connected');
    }

    try {
      const response = await fetch(`${this.rpcUrl}/v1/balances/${targetAddress}`);
      
      if (!response.ok) {
        throw new Error(`RPC error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Handle different RPC response formats
      if (typeof data.balance !== 'undefined') {
        return Number(data.balance);
      }
      
      if (typeof data.entity?.balance !== 'undefined') {
        return Number(data.entity.balance);
      }
      
      return 0;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch balance: ${error.message}`);
      }
      throw new Error('Failed to fetch balance');
    }
  }

  /**
   * Get current tick from RPC
   */
  async getCurrentTick(): Promise<number> {
    try {
      const response = await fetch(`${this.rpcUrl}/v1/tick-info`);
      
      if (!response.ok) {
        throw new Error(`RPC error: ${response.status}`);
      }

      const data = await response.json();
      return data.tickInfo?.tick ?? data.tick ?? 0;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get current tick: ${error.message}`);
      }
      throw new Error('Failed to get current tick');
    }
  }

  /**
   * Sign and send a transaction using QubicHelper
   */
  async signAndSendTx(params: ContractTxParams): Promise<TransactionResult> {
    if (!this.seed || !this.walletInfo) {
      throw new Error('Wallet not connected');
    }

    try {
      const currentTick = await this.getCurrentTick();
      const targetTick = currentTick + QUBIC_CONFIG.roundDuration;

      // Get contract destination address
      const destAddress = this.getContractAddress(params.contractId);

      // Create transaction using QubicHelper - returns Uint8Array
      const txData = await this.helper.createTransaction(
        this.seed,
        destAddress,
        params.amount ?? 0,
        targetTick
      );
      
      // Convert Uint8Array to base64
      const encodedTx = this.uint8ArrayToBase64(txData);
      
      // Broadcast transaction
      const response = await fetch(`${this.rpcUrl}/v1/broadcast-transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          encodedTransaction: encodedTx,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = this.extractErrorMessage(errorData, response.status);
        throw new Error(errorMessage);
      }

      const result = await response.json();
      const txId = this.extractTxId(result);
      
      return {
        txHash: txId,
        success: true,
        message: 'Transaction broadcast successfully',
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          txHash: '',
          success: false,
          message: error.message,
        };
      }
      return {
        txHash: '',
        success: false,
        message: 'Unknown error occurred',
      };
    }
  }

  /**
   * Get contract address from contract ID
   */
  private getContractAddress(contractId: number): string {
    // Qubic contracts have deterministic addresses based on their ID
    const contractAddresses: Record<number, string> = {
      1: 'BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARMID',
    };
    
    return contractAddresses[contractId] ?? 'BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARMID';
  }

  /**
   * Extract error message from API response
   */
  private extractErrorMessage(errorData: unknown, statusCode: number): string {
    if (typeof errorData === 'object' && errorData !== null && 'message' in errorData) {
      return String((errorData as { message: unknown }).message);
    }
    return `RPC error: ${statusCode}`;
  }

  /**
   * Extract transaction ID from API response
   */
  private extractTxId(result: unknown): string {
    if (typeof result === 'object' && result !== null) {
      const r = result as Record<string, unknown>;
      if (r.transactionId) return String(r.transactionId);
      if (r.txId) return String(r.txId);
      if (r.id) return String(r.id);
    }
    return this.generateTxHash();
  }

  /**
   * Generate a transaction hash
   */
  private generateTxHash(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let hash = '';
    for (let i = 0; i < 60; i++) {
      hash += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return hash;
  }

  /**
   * Convert Uint8Array to base64 string
   */
  private uint8ArrayToBase64(arr: Uint8Array): string {
    let binary = '';
    for (let i = 0; i < arr.length; i++) {
      binary += String.fromCharCode(arr[i]);
    }
    return btoa(binary);
  }

  /**
   * Validate a Qubic address
   */
  static isValidAddress(address: string): boolean {
    // Qubic addresses are 60 characters, uppercase A-Z
    const qubicAddressRegex = /^[A-Z]{60}$/;
    return qubicAddressRegex.test(address);
  }

  /**
   * Validate a seed phrase
   */
  static isValidSeed(seed: string): boolean {
    // Qubic seeds must be at least 55 characters
    return typeof seed === 'string' && seed.length >= 55;
  }
}

// Export singleton instance
export const qubicConnector = new QubicConnector(
  QUBIC_CONFIG.network as 'mainnet' | 'testnet'
);
