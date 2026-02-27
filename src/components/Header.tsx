
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

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
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const quickLinks = [
    { path: '/holyybd', label: '📜 HOLYYBD', color: 'text-violet-400' },
    { path: '/bde-landing', label: '✂️ BDE', color: 'text-amber-400' },
    { path: '/sica-landing', label: '🌙 SICA', color: 'text-cyan-400' },
    { path: '/shga-landing', label: '🎁 SHGA', color: 'text-pink-400' },
    { path: '/legacy-landing', label: '🏛️ Legacy', color: 'text-emerald-400' },
  ];

  const searchRoutes = [
    { path: '/', label: 'Marketplace', icon: '🏪' },
    { path: '/dashboard', label: 'Dashboard', icon: '⚡' },
    { path: '/holyybd', label: 'HOLYYBD Public Docs', icon: '📜' },
    { path: '/premalta', label: '$PREMALTA', icon: '🔵' },
    { path: '/revenue', label: 'Revenue Hub', icon: '💰' },
    { path: '/sca/app', label: 'Contract Analyst', icon: '⚖️' },
    { path: '/sovereign-barber', label: 'Sovereign Barber', icon: '💈' },
  ].filter(r => searchQuery && r.label.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <header className="shrink-0 border-b border-slate-900/60 bg-[#020617]/90 backdrop-blur-xl z-30">
      {/* Main Header Row */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        {/* Left: Menu + Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 hover:bg-slate-800 rounded-xl transition-colors"
          >
            <div className="w-5 h-0.5 bg-slate-400 mb-1.5 rounded-full"></div>
            <div className="w-4 h-0.5 bg-slate-400 mb-1.5 rounded-full ml-0.5"></div>
            <div className="w-5 h-0.5 bg-slate-400 rounded-full"></div>
          </button>

          <button onClick={() => navigate('/')} className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-base shadow-lg shadow-indigo-600/30 group-hover:scale-110 transition-transform">
                🧬
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#020617] shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
            </div>
            <div className="hidden sm:block">
              <span className="font-black text-white text-sm tracking-tighter">GANI HYPHA</span>
              <div className="flex items-center gap-1">
                <span className="text-[8px] font-mono text-indigo-400 uppercase tracking-[0.2em]">v5.3 · Session #033</span>
                <span className="text-[8px] font-mono text-slate-700">•</span>
                <span className="text-[8px] font-mono text-amber-400 uppercase tracking-widest">HOLY WAR 🔥</span>
              </div>
            </div>
          </button>
        </div>

        {/* Center: Search + Quick Links */}
        <div className="hidden lg:flex items-center gap-3 flex-1 max-w-lg mx-6">
          {/* Quick Search */}
          <div className="relative flex-1">
            <input
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setShowSearch(true); }}
              onBlur={() => setTimeout(() => setShowSearch(false), 200)}
              onFocus={() => setShowSearch(true)}
              placeholder="🔍 Cari fitur, agent, atau halaman..."
              className="w-full px-4 py-2 rounded-xl text-xs focus:outline-none focus:border-indigo-500 transition-all"
              style={{ background: '#0f1629', border: '1px solid #1e2a3a', color: '#94a3b8' }}
            />
            {showSearch && searchRoutes.length > 0 && (
              <div className="absolute top-full mt-1 left-0 right-0 z-50 rounded-xl overflow-hidden" style={{ background: '#0a0f1e', border: '1px solid #1e2a3a' }}>
                {searchRoutes.map(r => (
                  <button key={r.path} onClick={() => { navigate(r.path); setSearchQuery(''); setShowSearch(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-indigo-600/10 text-left transition-colors">
                    <span>{r.icon}</span>
                    <span className="text-xs text-slate-300">{r.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Stats + Wallet */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Stack badges - only on wider screens */}
          <div className="hidden xl:flex items-center gap-1.5">
            {[
              { label: 'Duitku', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
              { label: 'Fonnte', color: 'text-green-400 bg-green-500/10 border-green-500/20' },
              { label: 'Groq', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
            ].map(badge => (
              <span key={badge.label} className={`px-2 py-0.5 rounded-lg text-[7px] font-black uppercase tracking-widest border ${badge.color}`}>
                {badge.label}
              </span>
            ))}
          </div>

          {/* Rep Score */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-900/60 px-2 py-1.5 rounded-xl border border-slate-800/60">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-[8px] font-black text-emerald-400 uppercase">{reputationScore}%</span>
          </div>

          {/* HYPHA Balance */}
          <div className="flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-2.5 py-1.5">
            <span className="text-indigo-400 text-xs">💎</span>
            <span className="text-[10px] font-black text-white font-mono">{credits.toLocaleString()}</span>
            <span className="text-[8px] font-bold text-indigo-400 uppercase hidden sm:inline">HYPHA</span>
          </div>

          {/* Active Pods */}
          {activePodsCount > 0 && (
            <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-2 py-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[9px] font-black text-emerald-400">{activePodsCount}</span>
            </div>
          )}

          {/* HOLYYBD Quick Link */}
          <button
            onClick={() => navigate('/holyybd')}
            className={`hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
              location.pathname === '/holyybd' ? 'bg-violet-600/20 border border-violet-500/30 text-violet-400' : 'bg-violet-500/10 border border-violet-500/20 text-violet-500 hover:bg-violet-600/20'
            }`}
          >
            📜 HOLY
          </button>

          {/* Wallet Connect */}
          <button
            onClick={onConnectWallet}
            className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
              isWalletConnected
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
            }`}
          >
            {isWalletConnected ? (
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                <span className="hidden sm:inline">{walletAddress?.substring(0, 8)}...</span>
                <span className="sm:hidden">●</span>
              </span>
            ) : (
              <span className="flex items-center gap-1">🔗 <span className="hidden sm:inline">W3</span></span>
            )}
          </button>
        </div>
      </div>

      {/* Quick Nav Bar - secondary row */}
      <div className="hidden lg:flex items-center gap-1 px-6 py-1.5 border-t border-slate-900/40 overflow-x-auto scrollbar-hide">
        {quickLinks.map(link => (
          <button
            key={link.path}
            onClick={() => navigate(link.path)}
            className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
              location.pathname === link.path ? 'bg-slate-800 text-white' : 'text-slate-600 hover:text-slate-400 hover:bg-slate-900/40'
            } ${link.color}`}
          >
            {link.label}
          </button>
        ))}
        <div className="ml-auto text-[8px] font-mono text-slate-700 whitespace-nowrap">
          {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} · Session #033
        </div>
      </div>
    </header>
  );
};

export default Header;
