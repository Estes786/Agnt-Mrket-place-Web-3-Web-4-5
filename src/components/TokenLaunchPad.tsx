
// ============================================================
// GANI HYPHA — Token LaunchPad v1.0
// Deploy Industry Tokens: $BARBER, $PROPRT, $LEGACY, dll.
// Web2 Revenue → Web3 Token Economy
// Gyss! Akar Dalam, Cabang Tinggi 🙏🏻
// ============================================================

import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// ─── Token Templates ──────────────────────────────────────────
const TOKEN_TEMPLATES = [
  {
    id: 'premalta',
    name: '$PREMALTA',
    fullName: 'PREMALTA Creator Token',
    icon: '🔵',
    status: 'DEPLOYED',
    network: 'Base',
    contract: '0xC0125651a46BDEea72a73A1C1A75b82e0E2C94c7',
    supply: 1_000_000_000,
    price: 0.01,
    liquidity: 0,
    liquidityTarget: 500,
    description: 'Creator economy token on Base. Paragraph.com Writer Coin. Needs Uniswap liquidity pool.',
    utility: ['Writer rewards', 'Content gating', 'Community governance', 'Paragraph.com integration'],
    roadmap: ['✅ Deployed on Base', '⏳ Add PREMALTA/USDC pool (need $500)', '⏳ Lock LP on Uncx.network', '⏳ List on DexScreener'],
    color: '#3b82f6',
    basescanUrl: 'https://basescan.org/address/0xC0125651a46BDEea72a73A1C1A75b82e0E2C94c7',
    uniswapUrl: 'https://app.uniswap.org/#/add/ETH/0xC0125651a46BDEea72a73A1C1A75b82e0E2C94c7/3000?chain=base',
    type: 'creator'
  },
  {
    id: 'hypha',
    name: '$HYPHA',
    fullName: 'HYPHA Governance Token',
    icon: '🌿',
    status: 'PENDING_MAINNET',
    network: 'Ethereum + Arbitrum',
    contract: 'Pending mainnet deployment',
    supply: 1_000_000_000,
    price: 0.20,
    liquidity: 0,
    liquidityTarget: 5000,
    description: 'Primary governance token for GANI HYPHA ecosystem. Controls DAO, pod deployment, and protocol revenue.',
    utility: ['DAO Voting', 'Pod Deployment', 'Protocol Revenue Share', 'Staking 18.5% APY', 'Liquidity Mining'],
    roadmap: ['⏳ Deploy ERC-20 on Sepolia', '⏳ Security audit (OpenZeppelin)', '⏳ Mainnet deployment', '⏳ Uniswap V3 pool', '⏳ CEX listing (MEXC first)'],
    color: '#10b981',
    type: 'governance'
  },
  {
    id: 'proprt',
    name: '$PROPRT',
    fullName: 'Property Industry Token',
    icon: '🏠',
    status: 'PLANNED',
    network: 'Ethereum',
    contract: 'Not deployed',
    supply: 100_000_000,
    price: 0,
    liquidity: 0,
    liquidityTarget: 1000,
    description: 'Industry token for Real Estate Pod. Each property transaction burns PROPRT. Revenue split between pod deployers.',
    utility: ['Property DID minting', 'Agent deployment', 'Revenue share from pod', 'Governance for Real Estate DAO'],
    roadmap: ['⏳ Design tokenomics', '⏳ Deploy ERC-20', '⏳ Integrate with Real Estate Pod', '⏳ Partner with 5 realtors'],
    color: '#06b6d4',
    type: 'industry'
  },
  {
    id: 'barber',
    name: '$BARBER',
    fullName: 'Barber Dynasty Token',
    icon: '✂️',
    status: 'PLANNED',
    network: 'Polygon',
    contract: 'Not deployed',
    supply: 50_000_000,
    price: 0,
    liquidity: 0,
    liquidityTarget: 300,
    description: 'Loyalty + governance token for Barber Dynasty Pod. Customers earn BARBER for each visit. Shops stake for premium features.',
    utility: ['Customer loyalty rewards', 'Booking priority', 'Shop governance vote', 'Premium AI features'],
    roadmap: ['⏳ Design burn mechanism', '⏳ Deploy on Polygon (low gas)', '⏳ Barber shop onboarding', '⏳ WhatsApp bot integration'],
    color: '#f59e0b',
    type: 'industry'
  },
  {
    id: 'yield',
    name: '$YIELD',
    fullName: 'Sovereign Yield Token',
    icon: '📈',
    status: 'PLANNED',
    network: 'Arbitrum',
    contract: 'Not deployed',
    supply: 200_000_000,
    price: 0,
    liquidity: 0,
    liquidityTarget: 10000,
    description: 'DeFi yield token on Arbitrum. Represents shares in the automated yield vault. Auto-compound from Aave/Radiant.',
    utility: ['Yield vault shares', 'Protocol governance', 'Auto-compound DeFi', 'Cross-chain bridge eligible'],
    roadmap: ['⏳ Design vault contract', '⏳ Deploy on Arbitrum', '⏳ Integrate Aave V3 + Radiant', '⏳ Launch yield optimizer UI'],
    color: '#8b5cf6',
    type: 'defi'
  },
  {
    id: 'legacy',
    name: '$LEGACY',
    fullName: 'Family Legacy Token',
    icon: '👑',
    status: 'PLANNED',
    network: 'Arbitrum',
    contract: 'Not deployed',
    supply: 25_000_000,
    price: 0,
    liquidity: 0,
    liquidityTarget: 500,
    description: 'Soulbound token for Family Legacy Pod. Non-transferable. Proves family membership and unlocks private AI spaces.',
    utility: ['Family pod access', 'Soulbound identity', 'Private data vault', 'Inheritance smart contract'],
    roadmap: ['⏳ Design soulbound ERC-5484', '⏳ Privacy-first deployment', '⏳ Integration with family pods', '⏳ Legal framework'],
    color: '#a78bfa',
    type: 'soulbound'
  }
];

// ─── Network Info ─────────────────────────────────────────────
const NETWORKS = {
  'Base': { chainId: '0x2105', rpc: 'https://mainnet.base.org', explorer: 'basescan.org', gas: '$0.001', icon: '🔵', color: '#0052ff' },
  'Ethereum': { chainId: '0x1', rpc: 'https://eth-mainnet.g.alchemy.com/v2/', explorer: 'etherscan.io', gas: '$5-50', icon: '⟠', color: '#627eea' },
  'Polygon': { chainId: '0x89', rpc: 'https://polygon-mainnet.g.alchemy.com/v2/', explorer: 'polygonscan.com', gas: '$0.01', icon: '🟣', color: '#8247e5' },
  'Arbitrum': { chainId: '0xa4b1', rpc: 'https://arb-mainnet.g.alchemy.com/v2/', explorer: 'arbiscan.io', gas: '$0.10', icon: '🔷', color: '#2d374b' }
};

// ─── Token Price Simulation ───────────────────────────────────
const generatePriceData = (initialPrice: number, days: number = 30) =>
  Array.from({ length: days }).map((_, i) => ({
    day: `D${i + 1}`,
    price: +(initialPrice * (1 + (Math.random() - 0.45) * 0.1 * Math.sqrt(i + 1))).toFixed(6)
  }));

// ─── Steps for PREMALTA Liquidity ────────────────────────────
const PREMALTA_STEPS = [
  {
    step: 1, title: 'Prepare Your Wallet', status: 'ACTIVE',
    description: 'Fund MetaMask with ETH on Base network. You need ~$500 USDC + small ETH for gas.',
    actions: [
      { label: 'Add Base to MetaMask', url: 'https://chainlist.org/chain/8453', external: true },
      { label: 'Bridge ETH to Base', url: 'https://bridge.base.org', external: true },
      { label: 'Get USDC on Base', url: 'https://app.uniswap.org/#/swap?chain=base', external: true }
    ]
  },
  {
    step: 2, title: 'Import PREMALTA Token', status: 'ACTIVE',
    description: 'Add PREMALTA to MetaMask using contract address. Verify on BaseScan.',
    actions: [
      { label: 'View on BaseScan', url: 'https://basescan.org/address/0xC0125651a46BDEea72a73A1C1A75b82e0E2C94c7', external: true },
      { label: 'Contract: 0xC012...94c7', url: '#', external: false, copy: '0xC0125651a46BDEea72a73A1C1A75b82e0E2C94c7' }
    ]
  },
  {
    step: 3, title: 'Create Uniswap V3 Pool', status: 'TODO',
    description: 'Add PREMALTA/USDC liquidity on Uniswap V3 Base. Set fee tier: 1% (best for new tokens).',
    actions: [
      { label: 'Open Uniswap (Base)', url: 'https://app.uniswap.org/#/add/ETH/0xC0125651a46BDEea72a73A1C1A75b82e0E2C94c7/3000?chain=base', external: true }
    ]
  },
  {
    step: 4, title: 'Lock LP on Uncx', status: 'TODO',
    description: 'Lock your LP tokens for 6 months on Uncx.network. This builds trust with buyers.',
    actions: [
      { label: 'Open Uncx.network', url: 'https://app.uncx.network/services/lock-liquidity', external: true }
    ]
  },
  {
    step: 5, title: 'List on DexScreener', status: 'TODO',
    description: 'Token will auto-appear on DexScreener after pool creation. Update logo and info.',
    actions: [
      { label: 'DexScreener Update', url: 'https://dexscreener.com/update-token-info', external: true }
    ]
  },
  {
    step: 6, title: 'Community Building', status: 'TODO',
    description: 'Post "PREMALTA is LIVE on Base" on Twitter/X. Setup Telegram group. Engage early holders.',
    actions: [
      { label: 'Post on Twitter/X', url: 'https://twitter.com/compose/tweet', external: true }
    ]
  }
];

const TokenLaunchPad: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'premalta' | 'industry' | 'defi' | 'guide'>('overview');
  const [selectedToken, setSelectedToken] = useState<string>('premalta');
  const [copiedAddress, setCopiedAddress] = useState(false);

  const selected = TOKEN_TEMPLATES.find(t => t.id === selectedToken);

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address).then(() => {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    });
  };

  const statusColor = (status: string) => {
    if (status === 'DEPLOYED') return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
    if (status === 'PENDING_MAINNET') return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
    return 'bg-slate-800/60 border-slate-700/60 text-slate-400';
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">

      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <div className="inline-flex items-center gap-2 bg-purple-500/10 text-purple-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-purple-500/20 mb-3">
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-ping"></span>
            Token Ecosystem · {TOKEN_TEMPLATES.filter(t => t.status === 'DEPLOYED').length} Live
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Token LaunchPad 🚀</h1>
          <p className="text-slate-400 text-sm mt-1">From Web2 Revenue → Web3 Token Economy. Deploy Industry Tokens. Gyss! 🙏🏻</p>
        </div>
      </div>

      {/* ── Token Status Overview ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {TOKEN_TEMPLATES.map(token => (
          <button
            key={token.id}
            onClick={() => { setSelectedToken(token.id); setActiveTab('overview'); }}
            className={`glass rounded-xl p-3 border transition-all text-left ${
              selectedToken === token.id
                ? 'border-indigo-500/40 bg-indigo-500/5'
                : 'border-slate-800/60 hover:border-slate-700/60'
            }`}
          >
            <div className="text-xl mb-1">{token.icon}</div>
            <div className="text-xs font-black text-white">{token.name}</div>
            <div className="text-[8px] text-slate-500 font-mono">{token.network}</div>
            <div className={`mt-1.5 text-[8px] px-1.5 py-0.5 rounded border font-black ${statusColor(token.status)}`}>
              {token.status.replace('_', ' ')}
            </div>
          </button>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-2 border-b border-slate-800/60 pb-4 overflow-x-auto scrollbar-hide">
        {[
          { id: 'overview', label: 'Token Detail', icon: '🪙' },
          { id: 'premalta', label: 'PREMALTA Setup', icon: '🔵' },
          { id: 'industry', label: 'Industry Tokens', icon: '🏭' },
          { id: 'defi', label: 'DeFi Integration', icon: '📈' },
          { id: 'guide', label: 'Deploy Guide', icon: '📚' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-purple-600/20 border border-purple-500/40 text-purple-400'
                : 'text-slate-500 hover:text-slate-300 border border-transparent hover:border-slate-800'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB: Selected Token Detail ── */}
      {activeTab === 'overview' && selected && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Token Info */}
          <div className="lg:col-span-2 space-y-5">
            <div className="glass rounded-2xl p-6 border border-slate-800/60">
              <div className="flex items-center gap-4 mb-5">
                <div className="text-4xl">{selected.icon}</div>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-black text-white tracking-tighter">{selected.name}</h2>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${statusColor(selected.status)}`}>
                      {selected.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{selected.fullName}</div>
                </div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">{selected.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="glass rounded-xl p-3 border border-slate-800/60 text-center">
                  <div className="text-sm font-black text-white">{(selected.supply / 1e9).toFixed(0)}B</div>
                  <div className="text-[8px] text-slate-500 uppercase">Total Supply</div>
                </div>
                <div className="glass rounded-xl p-3 border border-slate-800/60 text-center">
                  <div className="text-sm font-black" style={{ color: selected.color }}>
                    {selected.price > 0 ? `$${selected.price}` : 'TBD'}
                  </div>
                  <div className="text-[8px] text-slate-500 uppercase">Token Price</div>
                </div>
                <div className="glass rounded-xl p-3 border border-slate-800/60 text-center">
                  <div className="text-sm font-black text-white">{selected.network}</div>
                  <div className="text-[8px] text-slate-500 uppercase">Network</div>
                </div>
                <div className="glass rounded-xl p-3 border border-slate-800/60 text-center">
                  <div className="text-sm font-black text-emerald-400">
                    ${selected.liquidity > 0 ? selected.liquidity.toLocaleString() : '0'}
                  </div>
                  <div className="text-[8px] text-slate-500 uppercase">Liquidity</div>
                </div>
              </div>

              {/* Contract Address */}
              {selected.contract !== 'Not deployed' && selected.contract !== 'Pending mainnet deployment' && (
                <div className="bg-slate-900/40 rounded-xl p-3 border border-slate-800/60">
                  <div className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Contract Address</div>
                  <div className="flex items-center gap-2">
                    <code className="text-[10px] text-emerald-400 font-mono flex-1 truncate">{selected.contract}</code>
                    <button
                      onClick={() => copyAddress(selected.contract)}
                      className="text-[9px] bg-slate-800 px-2 py-1 rounded border border-slate-700 text-slate-400 hover:text-white transition-colors"
                    >
                      {copiedAddress ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Price Chart */}
            {selected.price > 0 && (
              <div className="glass rounded-2xl p-5 border border-slate-800/60">
                <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4">Price Simulation (30d)</h3>
                <ResponsiveContainer width="100%" height={150}>
                  <AreaChart data={generatePriceData(selected.price)}>
                    <defs>
                      <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={selected.color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={selected.color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="day" tick={{ fill: '#475569', fontSize: 8 }} interval={4} />
                    <YAxis tick={{ fill: '#475569', fontSize: 8 }} />
                    <Tooltip
                      contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12 }}
                      formatter={(v: any) => [`$${Number(v).toFixed(6)}`, 'Price']}
                    />
                    <Area type="monotone" dataKey="price" stroke={selected.color} fill="url(#priceGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Utility & Roadmap */}
          <div className="space-y-4">
            <div className="glass rounded-2xl p-5 border border-slate-800/60">
              <h3 className="text-xs font-black text-white uppercase tracking-widest mb-3">Token Utility</h3>
              <div className="space-y-2">
                {selected.utility.map(u => (
                  <div key={u} className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span style={{ color: selected.color }}>◆</span>
                    {u}
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-5 border border-slate-800/60">
              <h3 className="text-xs font-black text-white uppercase tracking-widest mb-3">Roadmap</h3>
              <div className="space-y-2">
                {selected.roadmap.map(r => (
                  <div key={r} className="text-[10px] text-slate-400 leading-relaxed">{r}</div>
                ))}
              </div>
            </div>

            {/* Liquidity Status */}
            <div className="glass rounded-2xl p-5 border border-slate-800/60">
              <h3 className="text-xs font-black text-white uppercase tracking-widest mb-3">Liquidity Status</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-[9px] mb-1">
                    <span className="text-slate-500">Current</span>
                    <span className="text-white font-mono">${selected.liquidity}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min((selected.liquidity / selected.liquidityTarget) * 100, 100)}%`,
                        background: selected.color
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] mt-1">
                    <span className="text-slate-600">Target: ${selected.liquidityTarget}</span>
                    <span style={{ color: selected.color }}>
                      {((selected.liquidity / selected.liquidityTarget) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
                {selected.id === 'premalta' && (
                  <a
                    href="https://app.uniswap.org/#/add/ETH/0xC0125651a46BDEea72a73A1C1A75b82e0E2C94c7/3000?chain=base"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center py-2 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 text-[10px] font-black uppercase tracking-widest hover:bg-blue-600/30 transition-all"
                  >
                    Add Liquidity on Uniswap →
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── PREMALTA SETUP TAB ── */}
      {activeTab === 'premalta' && (
        <div className="space-y-6">
          <div className="glass rounded-2xl p-5 border border-blue-500/30 bg-blue-500/5">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-2xl">🔵</div>
              <div>
                <h2 className="text-lg font-black text-white">$PREMALTA Liquidity Setup</h2>
                <p className="text-xs text-slate-400">6-step guide to make PREMALTA tradeable on Uniswap Base</p>
              </div>
            </div>
            <div className="bg-slate-900/40 rounded-xl p-3 border border-slate-800/60 font-mono text-[10px]">
              <span className="text-slate-500">Contract:</span>
              <span className="text-emerald-400 ml-2">0xC0125651a46BDEea72a73A1C1A75b82e0E2C94c7</span>
              <span className="text-slate-500 ml-4">Network:</span>
              <span className="text-blue-400 ml-2">Base L2</span>
              <span className="text-slate-500 ml-4">Liquidity Needed:</span>
              <span className="text-yellow-400 ml-2">~$500 USDC</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PREMALTA_STEPS.map(step => (
              <div
                key={step.step}
                className={`glass rounded-2xl p-5 border ${
                  step.status === 'ACTIVE'
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : 'border-slate-800/60'
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                    step.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}>
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-black text-white">{step.title}</div>
                    <div className={`text-[9px] uppercase font-black mt-0.5 ${step.status === 'ACTIVE' ? 'text-emerald-400' : 'text-slate-600'}`}>
                      {step.status}
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed mb-3">{step.description}</p>
                <div className="space-y-1">
                  {step.actions.map((action, ai) => (
                    action.external ? (
                      <a
                        key={ai}
                        href={action.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        <span>→</span> {action.label}
                      </a>
                    ) : (
                      <button
                        key={ai}
                        onClick={() => action.copy && copyAddress(action.copy)}
                        className="flex items-center gap-2 text-[10px] text-emerald-400 hover:text-emerald-300 transition-colors"
                      >
                        <span>📋</span> {action.label} {copiedAddress ? '✓' : ''}
                      </button>
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── INDUSTRY TOKENS TAB ── */}
      {activeTab === 'industry' && (
        <div className="space-y-4">
          <div className="glass rounded-2xl p-5 border border-slate-800/60">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-2">Industry Token Ecosystem</h3>
            <p className="text-[10px] text-slate-400 leading-relaxed mb-4">
              Setiap industry pod memiliki token-nya sendiri. Revenue dari SaaS/micro-service → fund initial liquidity token industri.
              Setiap token = micro-economy tersendiri. Scale: 9 pods × $500 liquidity each = $4,500 ecosystem capital.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {TOKEN_TEMPLATES.filter(t => t.type === 'industry' || t.type === 'creator').map(token => (
                <div
                  key={token.id}
                  className="glass rounded-xl p-4 border border-slate-800/60 hover:border-slate-700/60 transition-all cursor-pointer"
                  onClick={() => { setSelectedToken(token.id); setActiveTab('overview'); }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{token.icon}</span>
                    <div>
                      <div className="text-sm font-black text-white">{token.name}</div>
                      <div className="text-[8px] text-slate-500 font-mono">{token.network}</div>
                    </div>
                    <div className={`ml-auto text-[8px] px-1.5 py-0.5 rounded border ${statusColor(token.status)}`}>
                      {token.status.split('_')[0]}
                    </div>
                  </div>
                  <div className="text-[9px] text-slate-400 leading-relaxed">{token.description.slice(0, 100)}...</div>
                  <div className="mt-2 text-[9px] text-slate-600">
                    Supply: {(token.supply / 1e6).toFixed(0)}M · Liquidity target: ${token.liquidityTarget}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-5 border border-yellow-500/20 bg-yellow-500/5">
            <h3 className="text-xs font-black text-yellow-400 uppercase tracking-widest mb-2">💡 The Revenue → Token Flywheel</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {[
                { step: '1', label: 'Generate SaaS Revenue', detail: 'Micro services earn $500-5K/mo', icon: '💰' },
                { step: '2', label: 'Fund Token Liquidity', detail: 'Use $500 to create Uniswap pool', icon: '💧' },
                { step: '3', label: 'Community Growth', detail: 'Tradeable token = holder growth', icon: '👥' },
                { step: '4', label: 'Token Price Discovery', detail: 'More holders → higher valuation', icon: '📈' }
              ].map(item => (
                <div key={item.step} className="text-center glass rounded-xl p-3 border border-slate-800/60">
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <div className="text-[9px] font-black text-white">{item.label}</div>
                  <div className="text-[8px] text-slate-500 mt-1">{item.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── DEFI INTEGRATION TAB ── */}
      {activeTab === 'defi' && (
        <div className="space-y-4">
          {[
            {
              protocol: 'Uniswap V3 (Base)', icon: '🦄', status: 'PRIORITY', color: 'pink',
              action: 'Create PREMALTA/USDC pool',
              cost: '$500 + 0.01 ETH gas',
              impact: 'Token becomes tradeable immediately',
              url: 'https://app.uniswap.org/#/add/ETH/0xC0125651a46BDEea72a73A1C1A75b82e0E2C94c7/3000?chain=base',
              steps: ['Bridge USDC to Base', 'Connect wallet on Uniswap', 'Select PREMALTA + USDC pair', 'Set price range (full range initially)', 'Add $500 in each token']
            },
            {
              protocol: 'Aave V3 (Ethereum)', icon: '👻', status: 'MONTH 2', color: 'purple',
              action: 'Integrate yield optimizer',
              cost: '$0 (code integration)',
              impact: '4.8% APY on USDC holdings',
              url: 'https://app.aave.com',
              steps: ['Deploy yield vault contract', 'Connect Aave V3 interface', 'Auto-compound user deposits', 'Charge 2% mgmt fee']
            },
            {
              protocol: 'Lido (Ethereum)', icon: '⚓', status: 'MONTH 3', color: 'blue',
              action: 'ETH liquid staking integration',
              cost: '$0 (code integration)',
              impact: '3.8% APY on ETH + stETH composability',
              url: 'https://lido.fi',
              steps: ['Integrate Lido SDK', 'Accept ETH deposits', 'Issue stETH receipts', 'Compound into DeFi vault']
            }
          ].map(item => (
            <div key={item.protocol} className="glass rounded-2xl p-5 border border-slate-800/60">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{item.icon}</div>
                  <div>
                    <div className="text-sm font-black text-white">{item.protocol}</div>
                    <div className="text-[9px] text-slate-500">{item.action}</div>
                  </div>
                </div>
                <div className={`px-2 py-0.5 rounded-full text-[9px] font-black border bg-${item.color}-500/10 border-${item.color}-500/30 text-${item.color}-400`}>
                  {item.status}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="glass rounded-xl p-2 border border-slate-800/60">
                  <div className="text-[9px] text-slate-500">Cost</div>
                  <div className="text-[10px] font-black text-emerald-400">{item.cost}</div>
                </div>
                <div className="glass rounded-xl p-2 border border-slate-800/60">
                  <div className="text-[9px] text-slate-500">Impact</div>
                  <div className="text-[10px] font-black text-white">{item.impact}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {item.steps.map((s, si) => (
                  <div key={si} className="bg-slate-900/40 px-2 py-0.5 rounded text-[9px] text-slate-400 font-mono">
                    {si + 1}. {s}
                  </div>
                ))}
              </div>
              <a href={item.url} target="_blank" rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors">
                Open {item.protocol} →
              </a>
            </div>
          ))}
        </div>
      )}

      {/* ── DEPLOY GUIDE TAB ── */}
      {activeTab === 'guide' && (
        <div className="space-y-4">
          <div className="glass rounded-2xl p-5 border border-slate-800/60">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4">📚 How to Deploy a Token (Step by Step)</h3>
            <div className="space-y-4">
              {[
                { num: 1, title: 'Design Tokenomics', detail: 'Total supply, distribution %, vesting schedule, utility. Max 1B tokens. Community 40%+ recommended.', tag: 'Planning' },
                { num: 2, title: 'Write Smart Contract', detail: 'Use OpenZeppelin ERC-20 base. Add: burn mechanism, pausable, access control. Test on Sepolia.', tag: 'Dev' },
                { num: 3, title: 'Security Audit', detail: 'Run Slither (free). Optionally hire OpenZeppelin/CertiK. Post audit on GitHub for transparency.', tag: 'Security' },
                { num: 4, title: 'Deploy on Mainnet', detail: 'Deploy to target chain (Base is cheapest for new projects). Verify contract on BaseScan/Etherscan.', tag: 'Launch' },
                { num: 5, title: 'Add Liquidity', detail: 'Create Uniswap V3 pool. Add equal value of your token + USDC. Lock LP for 3-6 months for trust.', tag: 'DeFi' },
                { num: 6, title: 'Community Launch', detail: 'Twitter/X announcement + Telegram + Discord. Submit to CoinGecko, CoinMarketCap, DexScreener.', tag: 'Community' }
              ].map(step => (
                <div key={step.num} className="flex gap-4 glass rounded-xl p-4 border border-slate-800/60">
                  <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-xs font-black text-indigo-400 shrink-0">
                    {step.num}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-black text-white">{step.title}</span>
                      <span className="bg-slate-800 px-2 py-0.5 rounded text-[8px] text-slate-400 font-mono">{step.tag}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TokenLaunchPad;
