
import React, { useState } from 'react';
import { UserStats } from '../types';

interface Web3PanelProps {
  userStats: UserStats;
  onConnectWallet: () => void;
}

const Web3Panel: React.FC<Web3PanelProps> = ({ userStats, onConnectWallet }) => {
  const [activeSection, setActiveSection] = useState<'did' | 'wallet' | 'defi' | 'stack'>('did');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    await new Promise(r => setTimeout(r, 1500));
    onConnectWallet();
    setIsConnecting(false);
  };

  const stackComponents = [
    {
      name: 'Cloudflare Pages',
      role: 'Frontend + Edge Deployment',
      status: 'ACTIVE',
      color: 'text-orange-400',
      bg: 'bg-orange-500/5 border-orange-500/20',
      detail: 'Serves React SPA globally via 300+ PoPs with 0ms cold start',
      icon: '☁️'
    },
    {
      name: 'Cloudflare Workers',
      role: 'API Backend + Edge Functions',
      status: 'ACTIVE',
      color: 'text-orange-400',
      bg: 'bg-orange-500/5 border-orange-500/20',
      detail: 'Hono framework running on V8 isolates with 10ms CPU budget',
      icon: '⚡'
    },
    {
      name: 'Groq API',
      role: 'LLM Inference (llama-3.3-70b)',
      status: 'CONNECTED',
      color: 'text-purple-400',
      bg: 'bg-purple-500/5 border-purple-500/20',
      detail: 'World\'s fastest LLM inference. 800ms avg response. Free tier available.',
      icon: '🤖'
    },
    {
      name: 'Supabase',
      role: 'PostgreSQL + Realtime + RLS',
      status: 'CONNECTED',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/5 border-emerald-500/20',
      detail: 'Row Level Security for data sovereignty. Realtime subscriptions for live updates.',
      icon: '🗄️'
    },
    {
      name: 'LangChain',
      role: 'AI Workflow Orchestration',
      status: 'READY',
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/5 border-yellow-500/20',
      detail: 'Chain of thought reasoning, tool use, memory management for complex AI tasks.',
      icon: '🔗'
    },
    {
      name: 'CrewAI',
      role: 'Multi-Agent Coordination (CREWSHIP)',
      status: 'READY',
      color: 'text-amber-400',
      bg: 'bg-amber-500/5 border-amber-500/20',
      detail: 'Hierarchical agent crews for research, analysis, and execution tasks.',
      icon: '👥'
    },
    {
      name: 'LangSmith',
      role: 'AI Monitoring + Tracing',
      status: 'MONITORING',
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/5 border-cyan-500/20',
      detail: 'Trace every LangChain workflow. Debug, evaluate, and optimize AI performance.',
      icon: '📊'
    },
    {
      name: 'Web3 DID (W3C)',
      role: 'Decentralized Identity',
      status: userStats.isWalletConnected ? 'VERIFIED' : 'PENDING',
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/5 border-indigo-500/20',
      detail: 'Self-sovereign identity using DID spec. No central authority required.',
      icon: '🆔'
    }
  ];

  const defiProtocols = [
    { name: 'Uniswap V4', chain: 'Ethereum', tvl: '$4.2B', apy: '12-45%', status: 'Available' },
    { name: 'Curve Finance', chain: 'Ethereum', tvl: '$2.8B', apy: '4-18%', status: 'Available' },
    { name: 'Aave V3', chain: 'Polygon', tvl: '$6.1B', apy: '2-12%', status: 'Available' },
    { name: 'Radium', chain: 'Solana', tvl: '$1.2B', apy: '8-35%', status: 'Available' },
    { name: 'Hypha Sovereign Pool', chain: 'HYPHA', tvl: '$42M', apy: '18.5%', status: 'Active' }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
          Web3 Foundation Layer
        </div>
        <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Web3 Control Layer</h2>
        <p className="text-slate-400 max-w-xl mx-auto text-sm">
          Your Web3 foundation: DID identity, wallet integration, DeFi protocols, and complete tech stack overview.
        </p>
      </div>

      {/* Section Tabs */}
      <div className="flex bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/60 w-fit mx-auto gap-0.5">
        {[
          { id: 'did', label: '🆔 DID Identity' },
          { id: 'wallet', label: '👛 Wallet' },
          { id: 'defi', label: '📈 DeFi' },
          { id: 'stack', label: '🔧 Tech Stack' }
        ].map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id as any)}
            className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSection === s.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >{s.label}</button>
        ))}
      </div>

      {/* DID Identity Section */}
      {activeSection === 'did' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass p-8 rounded-[2.5rem] border border-indigo-500/20 bg-indigo-500/5 space-y-6">
              <div>
                <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Sovereign DID Document</h4>
                {userStats.didDocument ? (
                  <div>
                    <div className="font-mono text-[9px] text-indigo-300 bg-black/40 p-4 rounded-2xl border border-indigo-500/20 mb-4 overflow-auto">
                      {`did:hypha:${userStats.didDocument}`}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">DID Verified & Active</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="text-4xl mb-4 opacity-30">🆔</div>
                    <p className="text-slate-500 text-sm mb-4">Connect wallet to mint your Sovereign DID</p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h5 className="text-[9px] font-black text-slate-500 uppercase tracking-widest">DID Capabilities</h5>
                {[
                  { cap: 'Cross-chain Identity', status: userStats.isWalletConnected },
                  { cap: 'Verifiable Credentials', status: userStats.isWalletConnected },
                  { cap: 'DWN Data Sovereignty', status: userStats.isWalletConnected },
                  { cap: 'ZK Proof Generation', status: false }
                ].map(item => (
                  <div key={item.cap} className="flex items-center justify-between p-3 bg-slate-900/40 rounded-xl border border-slate-800/60">
                    <span className="text-xs text-slate-400">{item.cap}</span>
                    <span className={`text-[8px] font-black uppercase ${item.status ? 'text-emerald-400' : 'text-slate-600'}`}>
                      {item.status ? '✓ ACTIVE' : '○ PENDING'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass p-8 rounded-[2.5rem] border border-slate-800/60 space-y-6">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">W3C DID Standard</h4>
              <div className="font-mono text-[9px] text-slate-400 bg-black/40 p-5 rounded-2xl border border-slate-800/60 leading-relaxed">
                {`{
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://w3id.org/security/v1"
  ],
  "id": "did:hypha:${userStats.didDocument || 'pending_sync'}",
  "controller": "did:hypha:sovereign",
  "verificationMethod": [{
    "type": "Ed25519",
    "controller": "did:hypha:self"
  }],
  "service": [{
    "type": "GroqAIService",
    "endpoint": "groq://llama-3.3-70b"
  }, {
    "type": "SupabaseDB",
    "endpoint": "supabase://hypha.db"  
  }]
}`}
              </div>
              <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800/60">
                <span className="text-[8px] font-black text-slate-600 uppercase block mb-2">Protocol</span>
                <span className="text-xs text-indigo-400 font-mono">W3C DID Core Specification v1.0</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Wallet Section */}
      {activeSection === 'wallet' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {!userStats.isWalletConnected ? (
            <div className="glass rounded-[3rem] p-16 border border-slate-800/60 text-center space-y-8">
              <div className="text-6xl">👛</div>
              <div>
                <h3 className="text-3xl font-bold text-white mb-3">Connect Your Web3 Wallet</h3>
                <p className="text-slate-400 text-sm max-w-md mx-auto">
                  Connect MetaMask, WalletConnect, or any Web3 wallet to access DeFi features, governance voting, and HYPHA staking.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 justify-center">
                {['MetaMask', 'WalletConnect', 'Coinbase Wallet', 'Phantom'].map(w => (
                  <button key={w} onClick={handleConnect} disabled={isConnecting}
                    className="flex items-center gap-3 px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 rounded-2xl transition-all text-sm font-bold text-slate-300 disabled:opacity-50"
                  >
                    <span className="text-xl">{w === 'MetaMask' ? '🦊' : w === 'WalletConnect' ? '🔗' : w === 'Coinbase Wallet' ? '🔵' : '👻'}</span>
                    {isConnecting ? 'Connecting...' : w}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass p-8 rounded-[2.5rem] border border-emerald-500/20 bg-emerald-500/5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Wallet Connected</span>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800">
                    <span className="text-[8px] font-black text-slate-600 uppercase block mb-1">Address</span>
                    <span className="text-xs font-mono text-white">{userStats.walletAddress}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800">
                      <span className="text-[8px] font-black text-slate-600 uppercase block mb-1">ETH Balance</span>
                      <span className="text-sm font-bold text-white">{userStats.web3Wallet?.balance || 1.24} ETH</span>
                    </div>
                    <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800">
                      <span className="text-[8px] font-black text-slate-600 uppercase block mb-1">NFTs</span>
                      <span className="text-sm font-bold text-white">{userStats.web3Wallet?.nftCount || 3}</span>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800">
                    <span className="text-[8px] font-black text-slate-600 uppercase block mb-1">Network</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      <span className="text-sm font-bold text-indigo-400">{userStats.web3Wallet?.network || 'Ethereum'} Mainnet</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass p-8 rounded-[2.5rem] border border-indigo-500/20 bg-indigo-500/5 space-y-5">
                <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">HYPHA Balance</h4>
                <div className="text-center py-4">
                  <div className="text-5xl font-black text-white mb-1">{userStats.hyphaBalance.toLocaleString()}</div>
                  <div className="text-indigo-400 font-mono text-sm">HYPHA</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800 text-center">
                    <span className="text-[8px] font-black text-slate-600 uppercase block mb-1">Staked</span>
                    <span className="text-sm font-bold text-emerald-400">{userStats.stakedAmount.toLocaleString()}</span>
                  </div>
                  <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800 text-center">
                    <span className="text-[8px] font-black text-slate-600 uppercase block mb-1">vHYPHA</span>
                    <span className="text-sm font-bold text-purple-400">{userStats.governancePower.toFixed(0)}</span>
                  </div>
                </div>
                <button className="w-full py-3 bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">
                  Bridge HYPHA → ETH
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* DeFi Section */}
      {activeSection === 'defi' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            {[
              { label: 'Total Value Locked', value: '$14.5B', icon: '🔒', color: 'text-indigo-400' },
              { label: 'Your DeFi Position', value: `$${(userStats.stakedAmount * 0.5).toFixed(0)}`, icon: '📊', color: 'text-emerald-400' },
              { label: 'Current APY', value: '18.5%', icon: '📈', color: 'text-amber-400' }
            ].map(s => (
              <div key={s.label} className="glass p-6 rounded-3xl border border-slate-800/60">
                <span className="text-2xl block mb-3">{s.icon}</span>
                <p className={`text-2xl font-black ${s.color} mb-1`}>{s.value}</p>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Available DeFi Protocols</h4>
            {defiProtocols.map(protocol => (
              <div key={protocol.name} className="flex items-center justify-between p-6 glass rounded-2xl border border-slate-800/60 hover:border-indigo-500/30 transition-all group">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xl">
                    {protocol.name.includes('Hypha') ? '🧬' : protocol.chain === 'Solana' ? '◎' : '⟠'}
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white">{protocol.name}</h5>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[8px] font-mono text-indigo-400 uppercase">{protocol.chain}</span>
                      <span className="text-slate-700">•</span>
                      <span className="text-[8px] text-slate-500">TVL: {protocol.tvl}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[8px] font-black text-slate-600 uppercase block">APY</span>
                    <span className="text-sm font-bold text-emerald-400">{protocol.apy}</span>
                  </div>
                  <button className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                    protocol.status === 'Active' ? 'bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600 hover:text-white' :
                    'bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-600 hover:text-white'
                  }`}>{protocol.status === 'Active' ? 'Monitor' : 'Deposit'}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tech Stack Section */}
      {activeSection === 'stack' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <p className="text-slate-500 text-sm text-center">Complete production-ready Web3→Web4 tech stack running in this deployment.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stackComponents.map(component => (
              <div key={component.name} className={`glass p-6 rounded-[2rem] border ${component.bg} hover:shadow-lg transition-all group`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{component.icon}</span>
                    <div>
                      <h4 className={`text-sm font-black uppercase tracking-widest ${component.color}`}>{component.name}</h4>
                      <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest">{component.role}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-lg text-[7px] font-black uppercase ${
                    component.status === 'ACTIVE' || component.status === 'CONNECTED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    component.status === 'READY' || component.status === 'MONITORING' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                    'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>{component.status}</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">{component.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const defiProtocols = [
  { name: 'Uniswap V4', chain: 'Ethereum', tvl: '$4.2B', apy: '12-45%', status: 'Available' },
  { name: 'Curve Finance', chain: 'Ethereum', tvl: '$2.8B', apy: '4-18%', status: 'Available' },
  { name: 'Aave V3', chain: 'Polygon', tvl: '$6.1B', apy: '2-12%', status: 'Available' },
  { name: 'Radium', chain: 'Solana', tvl: '$1.2B', apy: '8-35%', status: 'Available' },
  { name: 'Hypha Sovereign Pool', chain: 'HYPHA', tvl: '$42M', apy: '18.5%', status: 'Active' }
];

export default Web3Panel;
