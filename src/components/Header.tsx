
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  credits: number;
  activePodsCount: number;
  toggleSidebar: () => void;
  isWalletConnected: boolean;
  walletAddress?: string;
  onConnectWallet: () => void;
  reputationScore?: number;
}

const Header: React.FC<HeaderProps> = ({
  credits,
  activePodsCount,
  toggleSidebar,
  isWalletConnected,
  walletAddress,
  onConnectWallet,
  reputationScore = 98.4
}) => {
  const navigate = useNavigate();

  return (
    <header className="shrink-0 flex items-center justify-between px-6 py-3 border-b border-slate-900/60 bg-[#020617]/80 backdrop-blur-xl z-30">
      {/* Left: Menu + Brand */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 hover:bg-slate-800 rounded-xl transition-colors"
        >
          <div className="w-5 h-0.5 bg-slate-400 mb-1.5"></div>
          <div className="w-5 h-0.5 bg-slate-400 mb-1.5"></div>
          <div className="w-5 h-0.5 bg-slate-400"></div>
        </button>

        <button onClick={() => navigate('/')} className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-base shadow-lg shadow-indigo-600/30 group-hover:scale-110 transition-transform">
              🧬
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#020617] shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
          </div>
          <div className="hidden sm:block">
            <span className="font-black text-white text-sm tracking-tighter">GANI HYPHA</span>
            <div className="flex items-center gap-1">
              <span className="text-[8px] font-mono text-indigo-400 uppercase tracking-[0.3em]">Web4 v2.0</span>
              <span className="text-[8px] font-mono text-slate-700">•</span>
              <span className="text-[8px] font-mono text-emerald-500 uppercase tracking-widest">GROQ</span>
              <span className="text-[8px] font-mono text-slate-700">•</span>
              <span className="text-[8px] font-mono text-blue-400 uppercase tracking-widest">SUPABASE</span>
            </div>
          </div>
        </button>
      </div>

      {/* Center: Stack badges */}
      <div className="hidden md:flex items-center gap-2">
        {[
          { label: 'Cloudflare', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
          { label: 'Groq', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
          { label: 'Supabase', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
          { label: 'LangChain', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
        ].map(badge => (
          <span key={badge.label} className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border ${badge.color}`}>
            {badge.label}
          </span>
        ))}
      </div>

      {/* Right: Stats + Wallet */}
      <div className="flex items-center gap-3">
        {/* Reputation Score */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800/60">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{reputationScore}%</span>
          <span className="text-[8px] text-slate-600 uppercase">REP</span>
        </div>

        {/* HYPHA Balance */}
        <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-3 py-1.5">
          <span className="text-indigo-400 text-sm">💎</span>
          <div>
            <span className="text-[10px] font-black text-white font-mono">{credits.toLocaleString()}</span>
            <span className="text-[8px] font-bold text-indigo-400 ml-1 uppercase">HYPHA</span>
          </div>
        </div>

        {/* Active Pods */}
        {activePodsCount > 0 && (
          <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black text-emerald-400">{activePodsCount} PODS</span>
          </div>
        )}

        {/* Wallet Connect */}
        <button
          onClick={onConnectWallet}
          className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
            isWalletConnected
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 pulse-btn'
          }`}
        >
          {isWalletConnected ? (
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              {walletAddress?.substring(0, 8)}...
            </span>
          ) : (
            '🔗 Connect W3'
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
