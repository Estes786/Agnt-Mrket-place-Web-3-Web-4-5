
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

interface SidebarProps {
  deployedCount: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const navItems = [
  { path: '/', icon: '🏪', label: 'Marketplace', sub: 'Agent Hub', group: 'core' },
  { path: '/dashboard', icon: '⚡', label: 'Command Center', sub: 'Pod Control', group: 'core' },
  { path: '/architect', icon: '🏗️', label: 'Architect v3', sub: 'Web5 Design', group: 'core' },
  { path: '/master', icon: '🎛️', label: 'Master Control', sub: 'System Monitoring', group: 'core' },
  // Web3 section
  { path: '/tokenomics', icon: '🌿', label: 'Tokenomics', sub: 'HYPHA Engine', group: 'web3' },
  { path: '/premalta', icon: '🔵', label: '$PREMALTA', sub: 'Creator Token · Base', group: 'web3' },
  { path: '/dapps', icon: '🔗', label: 'DApps Hub', sub: 'DeFi + Protocols', group: 'web3' },
  { path: '/dao', icon: '🏛️', label: 'DAO Governance', sub: 'vHYPHA Voting', group: 'web3' },
  { path: '/identity', icon: '🪪', label: 'Web3 Identity', sub: 'DID + Web3Auth', group: 'web3' },
  { path: '/web3', icon: '🌐', label: 'Web3 Panel', sub: 'Stack Overview', group: 'web3' },
  // Content
  { path: '/media-lab', icon: '🎬', label: 'Media Lab', sub: 'Content AI', group: 'content' },
  { path: '/roadmap', icon: '🗺️', label: 'Roadmap', sub: 'Web3→Web5', group: 'content' },
  { path: '/strategy', icon: '🧠', label: 'Strategy Center', sub: 'Revenue · Research', group: 'strategy' },
  { path: '/ai-web5', icon: '🌐', label: 'AI Web5 Roadmap', sub: 'Sovereignty Research', group: 'strategy' },
  { path: '/store', icon: '🛍️', label: 'Sovereign Store', sub: 'SICA · SHGA · SCA · SMA', group: 'income' },
  { path: '/sca/app', icon: '⚖️', label: 'SCA Dashboard', sub: 'AI Legal · Revenue Engine', group: 'income' },
  { path: '/sca-landing', icon: '⚖️', label: 'SCA Landing', sub: 'Contract Analyst · Public Page', group: 'income' },
  { path: '/sica', icon: '🌙', label: 'SICA Dashboard', sub: 'AI Iftar & Catering Agent', group: 'income' },
  { path: '/sica-landing', icon: '🌙', label: 'SICA Landing', sub: 'Katering AI · Public Page', group: 'income' },
  { path: '/shga', icon: '🎁', label: 'SHGA Dashboard', sub: 'AI Gift & Hamper Agent', group: 'income' },
  { path: '/shga-landing', icon: '🎁', label: 'SHGA Landing', sub: 'Hamper & Gift · Public Page', group: 'income' },
  { path: '/sovereign-barber', icon: '💈', label: 'Sovereign Barber', sub: 'AI Barbershop · Community Node', group: 'income' },
  { path: '/bde-landing', icon: '✂️', label: 'BDE Landing', sub: 'Barber Dynasty · Public Page', group: 'income' },
  { path: '/sovereign-legacy', icon: '🏛️', label: 'Sovereign Legacy', sub: 'Family Vault · Home OS · DID', group: 'income' },
  { path: '/legacy-landing', icon: '🔐', label: 'Legacy Landing', sub: 'Family Security · Public Page', group: 'income' },
  { path: '/sma-landing', icon: '👑', label: 'SMA Landing', sub: 'Multi-Industry Agent · Public Page', group: 'income' },
  { path: '/economy', icon: '🌐', label: 'Autonomous Economy', sub: 'Web2→Web5 Engine', group: 'income' },
  { path: '/revenue', icon: '💰', label: 'Revenue Hub', sub: 'SaaS · Micro Services', group: 'income' },
  { path: '/tokens', icon: '🚀', label: 'Token LaunchPad', sub: 'Deploy · Liquidity', group: 'income' },
  { path: '/web5', icon: '🕸️', label: 'Web5 Command', sub: 'DWN · DID · Sovereignty', group: 'web5' },
  { path: '/supabase', icon: '🗄️', label: 'Supabase DB', sub: 'RBAC · Revenue · Users', group: 'backend' },
  { path: '/build', icon: '📡', label: 'Build In Public', sub: 'Progress · Community', group: 'backend' },
  { path: '/holyybd', icon: '📜', label: 'HOLYYBD Docs', sub: 'Public Build Log · Holy Path', group: 'backend', external: true },
];



const groupLabels: Record<string, string> = {
  core: '🧠 Core Platform',
  web3: '⛓️ Web3 Ecosystem',
  content: '🎨 Content & Vision',
  strategy: '🎯 Strategy & Analysis',
  income: '💸 Income Engine',
  web5: '🕸️ Web5 Sovereignty',
  backend: '🗄️ Backend & Community'
};

const Sidebar: React.FC<SidebarProps> = ({ deployedCount, isOpen, setIsOpen }) => {
  const navigate = useNavigate();

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-slate-900/60">
        <button onClick={() => { navigate('/'); setIsOpen(false); }} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-lg shadow-lg shadow-indigo-600/30 group-hover:scale-110 transition-transform">
            🧬
          </div>
          <div>
            <div className="font-black text-white text-sm tracking-tighter">GANI HYPHA</div>
            <div className="text-[8px] font-mono text-indigo-400 uppercase tracking-widest">v5.3 Session #033 · HOLY WAR 🔥</div>
          </div>
        </button>
      </div>

      {/* Stack Indicator */}
      <div className="px-4 py-3 border-b border-slate-900/60">
        <div className="grid grid-cols-2 gap-1.5" style={{maxHeight: '64px', overflow: 'hidden'}}>
          {[
            { label: 'Alchemy', color: 'text-blue-400' },
            { label: 'Groq', color: 'text-purple-400' },
            { label: 'Supabase', color: 'text-emerald-400' },
            { label: 'The Graph', color: 'text-pink-400' },
            { label: 'Infura', color: 'text-orange-400' },
            { label: 'Pinata', color: 'text-yellow-400' },
          { label: 'Fonnte', color: 'text-green-400' },
          { label: 'Duitku', color: 'text-cyan-400' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-1.5 bg-slate-900/40 px-2 py-1 rounded-lg">
              <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className={`text-[8px] font-black uppercase tracking-tighter ${s.color}`}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-hide">
        {['core', 'web3', 'content', 'strategy', 'income', 'web5', 'backend'].map(group => (
          <div key={group} className="mb-3">
            <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest mb-2 px-2">{groupLabels[group]}</p>
            {navItems.filter(i => i.group === group).map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative mb-0.5 ${
                    (item as {external?: boolean}).external ? 'text-violet-400 hover:text-violet-300 hover:bg-violet-900/20 border border-transparent' :
                    isActive
                      ? 'bg-indigo-600/10 border border-indigo-500/30 text-white'
                      : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/40 border border-transparent'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-500 rounded-r-full"></div>}
                    <span className="text-base">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-black uppercase tracking-widest truncate">{item.label}</div>
                      <div className="text-[8px] font-mono text-slate-700 uppercase">{item.sub}</div>
                    </div>
                    {item.path === '/dashboard' && deployedCount > 0 && (
                      <span className="bg-indigo-500/20 text-indigo-400 text-[8px] font-black px-1.5 py-0.5 rounded border border-indigo-500/20">
                        {deployedCount}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-900/60 space-y-3">
        <div className="bg-slate-900/40 rounded-2xl p-3 border border-slate-800/60">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Web3 Stack Health</span>
          </div>
          <div className="space-y-1">
            {[
              { label: 'Alchemy RPC', status: 'ONLINE', color: 'text-emerald-400' },
              { label: 'Groq API', status: 'ACTIVE', color: 'text-purple-400' },
              { label: 'Fonnte WA', status: 'READY', color: 'text-green-400' },
              { label: 'Duitku PG', status: 'SANDBOX', color: 'text-cyan-400' },
              { label: 'The Graph', status: 'SYNCED', color: 'text-pink-400' },
              { label: 'Cloudflare', status: 'DEPLOYED', color: 'text-orange-400' }
            ].map(s => (
              <div key={s.label} className="flex justify-between text-[8px] font-mono">
                <span className="text-slate-600">{s.label}</span>
                <span className={s.color}>{s.status}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="text-center text-[7px] font-black text-slate-800 uppercase tracking-widest">
          Akar Dalam, Cabang Tinggi · Gyss!
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-slate-900/60 bg-[#020617]/80 backdrop-blur-xl h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <>
          <div className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <aside className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-[#020617] border-r border-slate-900/60 z-50 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-900/60">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Navigation</span>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-800 rounded-xl text-slate-500">✕</button>
            </div>
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
};

export default Sidebar;
