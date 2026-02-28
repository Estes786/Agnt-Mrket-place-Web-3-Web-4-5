
// ============================================================
// LANDING NAV — Shared Navbar & Footer untuk semua Landing Pages
// GANI HYPHA Sovereign Ecosystem
// Navigasi cepat antar semua Sovereign Agent Landing Pages
// ============================================================

import React, { useState } from 'react';

interface LandingNavProps {
  currentAgent: 'shga' | 'sica' | 'sca' | 'bde' | 'legacy' | 'sma';
  onCtaClick?: () => void;
  ctaLabel?: string;
  ctaStyle?: string;
  extraNavLinks?: React.ReactNode;
}

const AGENTS = [
  { id: 'shga', icon: '🎁', name: 'SHGA', label: 'Hamper & Gift', path: '/shga-landing', color: 'text-amber-400 hover:text-amber-300', badgeColor: 'bg-red-500', badge: '🔥' },
  { id: 'sica', icon: '🌙', name: 'SICA', label: 'Katering AI', path: '/sica-landing', color: 'text-emerald-400 hover:text-emerald-300', badgeColor: 'bg-green-500', badge: '🌙' },
  { id: 'sca', icon: '⚖️', name: 'SCA', label: 'Legal AI', path: '/sca-landing', color: 'text-blue-400 hover:text-blue-300', badgeColor: 'bg-blue-500', badge: '⚡' },
  { id: 'sma', icon: '👑', name: 'SMA', label: 'Multi-Industry', path: '/sma-landing', color: 'text-violet-400 hover:text-violet-300', badgeColor: 'bg-violet-500', badge: '🚀' },
  { id: 'bde', icon: '✂️', name: 'BDE', label: 'Barbershop AI', path: '/bde-landing', color: 'text-yellow-400 hover:text-yellow-300', badgeColor: 'bg-yellow-600', badge: '💈' },
  { id: 'legacy', icon: '🏛️', name: 'Legacy', label: 'Family Vault', path: '/legacy-landing', color: 'text-purple-400 hover:text-purple-300', badgeColor: 'bg-purple-500', badge: '🔐' },
];

// Shared Sovereign Navigation Bar - digunakan di semua landing pages
export const SovereignNavBar: React.FC<LandingNavProps> = ({
  currentAgent,
  onCtaClick,
  ctaLabel = 'Mulai Sekarang',
  ctaStyle = 'bg-gradient-to-r from-violet-600 to-purple-600 text-white',
  extraNavLinks,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const otherAgents = AGENTS.filter(a => a.id !== currentAgent);
  const current = AGENTS.find(a => a.id === currentAgent);

  const navigateTo = (path: string) => {
    // Gunakan window.location untuk navigasi antar public pages (tidak perlu React Router)
    window.location.href = path;
  };

  return (
    <>
      {/* Top Banner - Sovereign Ecosystem Navigator */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700/50 py-2 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest hidden sm:block">Sovereign Agents:</span>
            <div className="flex items-center gap-1 flex-wrap">
              {AGENTS.map(agent => (
                <button
                  key={agent.id}
                  onClick={() => navigateTo(agent.path)}
                  className={`px-2 py-0.5 rounded-md text-[9px] font-bold transition-all hover:scale-105 active:scale-95 ${
                    agent.id === currentAgent
                      ? 'bg-white/10 text-white border border-white/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {agent.icon} {agent.name}
                  {agent.id === currentAgent && <span className="ml-1 text-green-400">●</span>}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => navigateTo('/store')}
            className="shrink-0 text-[9px] font-bold text-violet-400 hover:text-violet-300 transition-colors hidden sm:flex items-center gap-1"
          >
            🛍️ Store →
          </button>
        </div>
      </div>
    </>
  );
};

// Shared Sovereign Footer - digunakan di semua landing pages
export const SovereignFooter: React.FC<{ currentAgent: string; agentIcon: string; agentColor: string }> = ({
  currentAgent,
  agentIcon,
  agentColor,
}) => {
  const navigateTo = (path: string) => {
    window.location.href = path;
  };

  return (
    <footer className="border-t border-gray-800 py-10 mt-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Agent Links Grid */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-8">
          {AGENTS.map(agent => (
            <button
              key={agent.id}
              onClick={() => navigateTo(agent.path)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all hover:scale-105 active:scale-95 ${
                agent.id === currentAgent
                  ? 'border-white/20 bg-white/5'
                  : 'border-gray-700/50 hover:border-gray-600 bg-gray-900/50'
              }`}
            >
              <span className="text-2xl">{agent.icon}</span>
              <span className={`text-xs font-bold ${agent.id === currentAgent ? 'text-white' : 'text-gray-400'}`}>{agent.name}</span>
              <span className="text-[9px] text-gray-500 text-center leading-tight">{agent.label}</span>
              {agent.id === currentAgent && (
                <span className="text-[8px] text-green-400 font-bold flex items-center gap-0.5">
                  <span className="w-1 h-1 rounded-full bg-green-400 inline-block animate-pulse"></span> Current
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Store CTA */}
        <div className="bg-gradient-to-r from-violet-900/30 to-purple-900/30 border border-violet-500/20 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <div className="font-bold text-white text-sm">🛍️ Sovereign Store — Checkout Semua Agent</div>
            <div className="text-xs text-gray-400 mt-0.5">Bandingkan plans, bayar via Duitku QRIS/VA/E-Wallet</div>
          </div>
          <button
            onClick={() => navigateTo('/store')}
            className="shrink-0 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-bold transition-all active:scale-95"
          >
            Buka Store →
          </button>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-gray-500 text-xs">
          <div className="flex items-center gap-2">
            <span>{agentIcon}</span>
            <span>
              {currentAgent.toUpperCase()} — Part of{' '}
              <a href="https://gani-hypha-web3.pages.dev" className={`${agentColor} transition-colors`}>GANI HYPHA</a> Sovereign Ecosystem
            </span>
          </div>
          <div className="flex gap-4">
            <button onClick={() => navigateTo('/')} className="hover:text-white transition-colors">🏠 Home</button>
            <button onClick={() => navigateTo('/store')} className="hover:text-white transition-colors">🛍️ Store</button>
            <a href="https://wa.me/6285643383832" target="_blank" rel="noreferrer" className="hover:text-green-400 transition-colors">💬 WhatsApp</a>
          </div>
          <div>Akar Dalam, Cabang Tinggi 🙏🏻</div>
        </div>
      </div>
    </footer>
  );
};

export default SovereignNavBar;
