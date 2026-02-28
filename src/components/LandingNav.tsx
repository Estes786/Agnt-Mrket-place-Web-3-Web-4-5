
// ============================================================
// LANDING NAV v2.1 — Shared Navbar & Footer untuk semua Landing Pages
// GANI HYPHA Sovereign Ecosystem
// Navigasi CEPAT antar semua Sovereign Agent Landing Pages
// Fix: sovereign-barber, sovereign-legacy support + performance
// ============================================================

import React from 'react';

type AgentId = 'shga' | 'sica' | 'sca' | 'bde' | 'legacy' | 'sma' | 'sovereign-barber' | 'sovereign-legacy';

interface LandingNavProps {
  currentAgent: AgentId;
  onCtaClick?: () => void;
  ctaLabel?: string;
  ctaStyle?: string;
}

interface AgentDef {
  id: AgentId;
  icon: string;
  name: string;
  label: string;
  path: string;
  color: string;
  badge?: string;
}

const AGENTS: AgentDef[] = [
  { id: 'shga', icon: '🎁', name: 'SHGA', label: 'Hamper & Gift', path: '/shga-landing', color: 'text-amber-400 hover:text-amber-300', badge: '🔥' },
  { id: 'sica', icon: '🌙', name: 'SICA', label: 'Katering AI', path: '/sica-landing', color: 'text-emerald-400 hover:text-emerald-300', badge: '🌙' },
  { id: 'sca', icon: '⚖️', name: 'SCA', label: 'Legal AI', path: '/sca-landing', color: 'text-blue-400 hover:text-blue-300', badge: '⚡' },
  { id: 'sma', icon: '👑', name: 'SMA', label: 'Multi-Industry', path: '/sma-landing', color: 'text-violet-400 hover:text-violet-300', badge: '🚀' },
  { id: 'bde', icon: '✂️', name: 'BDE', label: 'Barbershop', path: '/bde-landing', color: 'text-yellow-400 hover:text-yellow-300', badge: '💈' },
  { id: 'legacy', icon: '🏛️', name: 'Legacy', label: 'Family Vault', path: '/legacy-landing', color: 'text-purple-400 hover:text-purple-300', badge: '🔐' },
];

// Helper: normalize agent id (sovereign-barber → bde, sovereign-legacy → legacy)
const normalizeAgentId = (id: AgentId): string => {
  if (id === 'sovereign-barber') return 'bde';
  if (id === 'sovereign-legacy') return 'legacy';
  return id;
};

// Navigasi cepat — gunakan window.location untuk public pages (tidak perlu React Router)
const goTo = (path: string) => {
  if (typeof window !== 'undefined') {
    window.location.href = path;
  }
};

// ──────────────────────────────────────────────────────────
// SovereignNavBar — Top navigation bar untuk semua landing pages
// ──────────────────────────────────────────────────────────
export const SovereignNavBar: React.FC<LandingNavProps> = ({
  currentAgent,
  onCtaClick,
  ctaLabel = 'Mulai Sekarang',
  ctaStyle = 'bg-violet-600 hover:bg-violet-500 text-white',
}) => {
  const normId = normalizeAgentId(currentAgent);

  return (
    <div className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-sm border-b border-slate-700/40">
      <div className="max-w-6xl mx-auto px-3 py-1.5 flex items-center justify-between gap-2">

        {/* Left: Platform logo + agent tabs */}
        <div className="flex items-center gap-2 min-w-0">
          {/* Logo */}
          <button
            onClick={() => goTo('/')}
            className="shrink-0 flex items-center gap-1.5 mr-1"
            title="Kembali ke Homepage"
          >
            <span className="text-lg">🌿</span>
            <span className="text-[9px] font-black text-slate-400 hidden sm:block tracking-widest uppercase">GANI HYPHA</span>
          </button>

          {/* Separator */}
          <span className="text-slate-700 hidden sm:block">│</span>

          {/* Agent Tabs */}
          <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-hide">
            {AGENTS.map(agent => (
              <button
                key={agent.id}
                onClick={() => goTo(agent.path)}
                className={`shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-bold transition-all hover:scale-105 active:scale-95 ${
                  agent.id === normId
                    ? 'bg-white/10 text-white border border-white/20 shadow-sm'
                    : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <span>{agent.icon}</span>
                <span className="hidden sm:block">{agent.name}</span>
                {agent.id === normId && (
                  <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse ml-0.5"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Store + CTA */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => goTo('/store')}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-[9px] font-bold text-violet-400 hover:text-violet-300 border border-violet-500/20 hover:border-violet-500/40 rounded-lg transition-all"
          >
            🛍️ <span>Store</span>
          </button>
          {onCtaClick && (
            <button
              onClick={onCtaClick}
              className={`px-3 py-1 rounded-lg text-[9px] font-bold transition-all active:scale-95 ${ctaStyle}`}
            >
              {ctaLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────────
// SovereignFooter — Bottom footer untuk semua landing pages
// ──────────────────────────────────────────────────────────
export const SovereignFooter: React.FC<{
  currentAgent: AgentId | string;
  agentIcon: string;
  agentColor: string;
}> = ({ currentAgent, agentIcon, agentColor }) => {
  const normId = normalizeAgentId(currentAgent as AgentId);

  return (
    <footer className="border-t border-gray-800/60 bg-slate-950 pt-10 pb-6 mt-6">
      <div className="max-w-6xl mx-auto px-4">

        {/* Store CTA Banner */}
        <div className="bg-gradient-to-r from-violet-900/40 to-purple-900/40 border border-violet-500/20 rounded-2xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <div className="font-black text-white text-sm flex items-center gap-2">
              🛍️ Sovereign Store — Checkout Semua Agent
              <span className="text-[8px] bg-green-500/20 text-green-400 border border-green-500/20 px-1.5 py-0.5 rounded-full font-bold">LIVE</span>
            </div>
            <div className="text-xs text-gray-400 mt-0.5">Bayar via Duitku QRIS / VA / E-Wallet. Aktif dalam menit!</div>
          </div>
          <button
            onClick={() => goTo('/store')}
            className="shrink-0 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-xl text-sm font-bold transition-all active:scale-95 shadow-lg shadow-violet-900/30"
          >
            Buka Store →
          </button>
        </div>

        {/* Agent Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-8">
          {AGENTS.map(agent => (
            <button
              key={agent.id}
              onClick={() => goTo(agent.path)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all hover:scale-105 active:scale-95 ${
                agent.id === normId
                  ? 'border-white/20 bg-white/5 shadow-sm'
                  : 'border-gray-800/60 hover:border-gray-700 bg-gray-900/40 hover:bg-gray-800/40'
              }`}
            >
              <span className="text-xl">{agent.icon}</span>
              <span className={`text-[10px] font-bold ${agent.id === normId ? 'text-white' : 'text-gray-400'}`}>
                {agent.name}
              </span>
              <span className="text-[8px] text-gray-600 text-center leading-tight">{agent.label}</span>
              {agent.id === normId && (
                <span className="text-[7px] text-green-400 font-black flex items-center gap-0.5">
                  <span className="w-1 h-1 rounded-full bg-green-400 inline-block animate-pulse"></span>
                  Current
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-600 text-[10px] pt-4 border-t border-gray-800/40">
          <div className="flex items-center gap-2 text-gray-500">
            <span>{agentIcon}</span>
            <span>
              {currentAgent.toString().toUpperCase().replace('-', ' ')} — Part of{' '}
              <button onClick={() => goTo('/')} className={`${agentColor} transition-colors`}>GANI HYPHA</button>{' '}
              Sovereign Ecosystem
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => goTo('/')} className="hover:text-white transition-colors flex items-center gap-1">
              🏠 Home
            </button>
            <button onClick={() => goTo('/store')} className="hover:text-white transition-colors flex items-center gap-1">
              🛍️ Store
            </button>
            <a
              href="https://wa.me/6285643383832"
              target="_blank"
              rel="noreferrer"
              className="hover:text-green-400 transition-colors flex items-center gap-1"
            >
              💬 WhatsApp
            </a>
          </div>
          <div className="text-gray-700">Akar Dalam, Cabang Tinggi 🙏🏻 · © 2026 GANI HYPHA</div>
        </div>
      </div>
    </footer>
  );
};

export default SovereignNavBar;
