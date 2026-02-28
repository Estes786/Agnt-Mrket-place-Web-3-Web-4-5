import React, { useState } from 'react';

// MetaMask Modal Component - Session #034
// Uses window.ethereum (injected by MetaMask browser extension)
// ethers.js v6 BrowserProvider

interface MetaMaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (walletData: WalletData) => void;
}

export interface WalletData {
  address: string;
  shortAddress: string;
  network: string;
  networkId: number;
  balance: string;
  balanceEth: number;
  isVerified: boolean;
  provider: 'metamask' | 'walletconnect' | 'injected';
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
      isMetaMask?: boolean;
      chainId?: string;
    };
  }
}

const NETWORK_NAMES: Record<number, string> = {
  1: 'Ethereum Mainnet',
  8453: 'Base Mainnet',
  137: 'Polygon',
  42161: 'Arbitrum One',
  10: 'Optimism',
  56: 'BSC',
  11155111: 'Sepolia Testnet',
  84532: 'Base Sepolia',
};

export const MetaMaskModal: React.FC<MetaMaskModalProps> = ({ isOpen, onClose, onConnect }) => {
  const [status, setStatus] = useState<'idle' | 'connecting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [walletData, setWalletData] = useState<WalletData | null>(null);

  if (!isOpen) return null;

  const connectMetaMask = async () => {
    setStatus('connecting');
    setErrorMsg('');

    try {
      // Check if MetaMask is installed
      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('MetaMask tidak terdeteksi! Silakan install MetaMask extension di browser Anda.');
      }

      // Request accounts
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      }) as string[];

      if (!accounts || accounts.length === 0) {
        throw new Error('Tidak ada akun yang dipilih di MetaMask.');
      }

      const address = accounts[0];
      const shortAddress = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;

      // Get network/chain ID
      const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' }) as string;
      const chainId = parseInt(chainIdHex, 16);
      const networkName = NETWORK_NAMES[chainId] || `Chain #${chainId}`;

      // Get balance
      const balanceHex = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      }) as string;

      // Convert hex balance to ETH (wei to ETH: divide by 1e18)
      const balanceWei = BigInt(balanceHex);
      const balanceEth = Number(balanceWei) / 1e18;
      const balanceStr = balanceEth.toFixed(4) + ' ETH';

      const data: WalletData = {
        address,
        shortAddress,
        network: networkName,
        networkId: chainId,
        balance: balanceStr,
        balanceEth,
        isVerified: true,
        provider: window.ethereum.isMetaMask ? 'metamask' : 'injected'
      };

      setWalletData(data);
      setStatus('success');

      // Auto-confirm after 1s
      setTimeout(() => {
        onConnect(data);
        onClose();
      }, 1500);

    } catch (err: unknown) {
      const error = err as { code?: number; message?: string };
      let msg = 'Gagal connect wallet.';
      if (error.code === 4001) {
        msg = 'Koneksi ditolak oleh pengguna.';
      } else if (error.message) {
        msg = error.message;
      }
      setErrorMsg(msg);
      setStatus('error');
    }
  };

  const connectDemo = () => {
    // Demo mode for testing without MetaMask
    const demoAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
    const data: WalletData = {
      address: demoAddress,
      shortAddress: '0x742d...f44e',
      network: 'Base Mainnet',
      networkId: 8453,
      balance: '0.0000 ETH',
      balanceEth: 0,
      isVerified: false,
      provider: 'injected'
    };
    setWalletData(data);
    setStatus('success');
    setTimeout(() => {
      onConnect(data);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 border border-purple-500/50 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">🦊 Connect Wallet</h2>
            <p className="text-gray-400 text-sm mt-1">Session #034 – ethers.js v6</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Status: Idle */}
        {status === 'idle' && (
          <div className="space-y-3">
            <p className="text-gray-300 text-sm mb-4">
              Hubungkan wallet Web3 Anda untuk mengakses fitur DeFi, governance voting, dan HYPHA staking.
            </p>

            {/* MetaMask Button */}
            <button
              onClick={connectMetaMask}
              className="w-full flex items-center gap-3 p-4 bg-orange-500/20 border border-orange-500/50 rounded-xl hover:bg-orange-500/30 transition-all group"
            >
              <span className="text-3xl">🦊</span>
              <div className="text-left flex-1">
                <div className="text-white font-semibold">MetaMask</div>
                <div className="text-orange-300 text-xs">Browser Extension Wallet</div>
              </div>
              <span className="text-orange-400 group-hover:translate-x-1 transition-transform">→</span>
            </button>

            {/* Injected Wallet */}
            <button
              onClick={connectMetaMask}
              className="w-full flex items-center gap-3 p-4 bg-blue-500/20 border border-blue-500/50 rounded-xl hover:bg-blue-500/30 transition-all group"
            >
              <span className="text-3xl">💎</span>
              <div className="text-left flex-1">
                <div className="text-white font-semibold">Browser Wallet</div>
                <div className="text-blue-300 text-xs">Rabby, Brave Wallet, etc.</div>
              </div>
              <span className="text-blue-400 group-hover:translate-x-1 transition-transform">→</span>
            </button>

            {/* Demo Mode */}
            <button
              onClick={connectDemo}
              className="w-full flex items-center gap-3 p-4 bg-gray-700/50 border border-gray-600/50 rounded-xl hover:bg-gray-700 transition-all group"
            >
              <span className="text-3xl">🎮</span>
              <div className="text-left flex-1">
                <div className="text-white font-semibold">Demo Mode</div>
                <div className="text-gray-400 text-xs">Test tanpa wallet nyata</div>
              </div>
              <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
            </button>

            {/* Info */}
            <div className="mt-4 p-3 bg-purple-900/30 rounded-lg border border-purple-500/30">
              <p className="text-purple-300 text-xs">
                🔒 Kami tidak pernah menyimpan private key. Koneksi aman via window.ethereum + ethers.js v6.
              </p>
            </div>
          </div>
        )}

        {/* Status: Connecting */}
        {status === 'connecting' && (
          <div className="text-center py-8">
            <div className="text-5xl mb-4 animate-bounce">🦊</div>
            <p className="text-white font-semibold text-lg">Menghubungkan ke MetaMask...</p>
            <p className="text-gray-400 text-sm mt-2">Silakan approve di popup MetaMask Anda</p>
            <div className="mt-6 flex justify-center">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        )}

        {/* Status: Success */}
        {status === 'success' && walletData && (
          <div className="text-center py-4">
            <div className="text-5xl mb-3">✅</div>
            <p className="text-green-400 font-bold text-lg">Wallet Terhubung!</p>
            <div className="mt-4 p-4 bg-green-900/30 rounded-xl border border-green-500/50 text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Alamat</span>
                <span className="text-white text-sm font-mono">{walletData.shortAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Network</span>
                <span className="text-green-300 text-sm">{walletData.network}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Balance</span>
                <span className="text-yellow-300 text-sm">{walletData.balance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Provider</span>
                <span className="text-purple-300 text-sm capitalize">{walletData.provider}</span>
              </div>
            </div>
            <p className="text-gray-400 text-xs mt-3">Mengalihkan ke dashboard...</p>
          </div>
        )}

        {/* Status: Error */}
        {status === 'error' && (
          <div className="text-center py-4">
            <div className="text-5xl mb-3">❌</div>
            <p className="text-red-400 font-bold text-lg">Koneksi Gagal</p>
            <p className="text-gray-300 text-sm mt-2 px-2">{errorMsg}</p>

            {errorMsg.includes('install') && (
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 transition-colors"
              >
                🦊 Download MetaMask
              </a>
            )}

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => setStatus('idle')}
                className="flex-1 py-2 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-600 transition-colors"
              >
                Coba Lagi
              </button>
              <button
                onClick={connectDemo}
                className="flex-1 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors"
              >
                Demo Mode
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetaMaskModal;
