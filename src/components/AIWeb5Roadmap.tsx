import React, { useState, useEffect } from 'react';

// ============================================================
// AI SOVEREIGNTY & WEB5 ROADMAP COMPONENT
// GANI HYPHA — Deep Research Results Dashboard
// Version: 4.0 | Date: 2026-02-24
// ============================================================

interface GapItem {
  id: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  current: string;
  required: string;
  solution: string;
  effort: string;
  revenueImpact: string;
  progress: number;
}

interface RoadmapPhase {
  phase: number;
  title: string;
  timeline: string;
  budget: string;
  status: 'completed' | 'active' | 'upcoming' | 'future';
  items: string[];
  metrics: { label: string; value: string }[];
  color: string;
}

interface TechPillar {
  id: string;
  name: string;
  icon: string;
  description: string;
  status: 'production' | 'emerging' | 'research' | 'planned';
  maturity: number;
  relevance: string;
}

const AIWeb5Roadmap: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'gaps' | 'roadmap' | 'tech' | 'revenue'>('overview');
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    setAnimateIn(true);
  }, []);

  // ── GAP ANALYSIS DATA ──────────────────────────────────────
  const gaps: GapItem[] = [
    {
      id: 'gap-1',
      title: 'Blockchain Interaction',
      severity: 'CRITICAL',
      current: 'Semua transaksi adalah simulasi setTimeout',
      required: 'Real on-chain tx via MetaMask/WalletConnect',
      solution: 'wagmi + viem + EIP-7702 session keys',
      effort: '3-4 minggu',
      revenueImpact: '$0 → $10,000+/bulan',
      progress: 15
    },
    {
      id: 'gap-2',
      title: 'DID / SSI Identity',
      severity: 'CRITICAL',
      current: 'DID document hanya generated locally (tidak published)',
      required: 'Real DID resolution + Ceramic Network publication',
      solution: 'ethr-did-resolver + Ceramic mainnet',
      effort: '2 minggu',
      revenueImpact: 'Trust layer = 3x retention',
      progress: 20
    },
    {
      id: 'gap-3',
      title: 'DAO Governance On-Chain',
      severity: 'CRITICAL',
      current: 'Voting hanya update React state lokal',
      required: 'Governor Bravo + Snapshot.org real voting',
      solution: 'Deploy GovernorBravo mainnet + Snapshot space',
      effort: '4-6 minggu',
      revenueImpact: 'Real DAO = $50K+ treasury deployment',
      progress: 5
    },
    {
      id: 'gap-4',
      title: 'Zero-Knowledge Proofs',
      severity: 'HIGH',
      current: 'Tidak ada ZK infrastructure',
      required: 'zkML + ZK identity proofs (Semaphore)',
      solution: 'EZKL framework + WorldID integration',
      effort: '8-12 minggu',
      revenueImpact: 'Privacy AI = $50/user premium tier',
      progress: 0
    },
    {
      id: 'gap-5',
      title: 'Agent-to-Agent Economy',
      severity: 'HIGH',
      current: 'Agents hanya interaksi dengan manusia',
      required: 'x402 protocol + ERC-7521 intents + agent wallets',
      solution: 'EIP-7702 session keys + micro-payment rails',
      effort: '6-8 minggu',
      revenueImpact: 'M2M economy = $30T market share',
      progress: 0
    },
    {
      id: 'gap-6',
      title: 'Decentralized Web Nodes (DWN)',
      severity: 'HIGH',
      current: 'Data tersimpan di Supabase (centralized)',
      required: 'User-controlled DWN for true data sovereignty',
      solution: 'Ceramic Network + Lit Protocol',
      effort: '4-6 minggu',
      revenueImpact: 'Data sovereignty = core differentiator',
      progress: 5
    },
    {
      id: 'gap-7',
      title: 'PREMALTA DEX Liquidity',
      severity: 'HIGH',
      current: 'Contract deployed, 0 liquidity on DEX',
      required: 'Uniswap V3 Base pool + LP lock',
      solution: '$500 USDC seed liquidity (within budget!)',
      effort: '1-2 hari',
      revenueImpact: 'Trading fees + token appreciation',
      progress: 30
    },
    {
      id: 'gap-8',
      title: 'Real Revenue Collection',
      severity: 'HIGH',
      current: 'Revenue model di dokumen, tidak dieksekusi',
      required: 'RevenueDistributor contract + marketplace fees',
      solution: 'Smart contract fee collection system',
      effort: '3-4 minggu',
      revenueImpact: '$0 → $500+/bulan dalam 30 hari',
      progress: 10
    }
  ];

  // ── ROADMAP PHASES ─────────────────────────────────────────
  const phases: RoadmapPhase[] = [
    {
      phase: 0,
      title: 'Foundation & Launch',
      timeline: 'Sekarang (Feb 2026)',
      budget: '$500',
      status: 'active',
      color: '#10b981',
      items: [
        '✅ Platform deployed ke Cloudflare Pages',
        '✅ API services configured (Alchemy, Groq, Pinata)',
        '✅ Smart contracts di Sepolia (5 contracts)',
        '✅ GitHub repository live',
        '🔴 PREMALTA/USDC pool Uniswap V3 Base',
        '🔴 LP lock di Uncx.network (6 bulan)',
        '🔴 CoinGecko/CMC listing request',
        '🔴 Snapshot.org governance space'
      ],
      metrics: [
        { label: 'Platform Status', value: '✅ LIVE' },
        { label: 'Contracts Deployed', value: '5 (Sepolia)' },
        { label: 'Revenue', value: '$0 → $500/mo' },
        { label: 'Budget Required', value: '$500 USDC' }
      ]
    },
    {
      phase: 1,
      title: 'Web3 Activation',
      timeline: 'Bulan 1–3',
      budget: '$2,000–$5,000',
      status: 'upcoming',
      color: '#6366f1',
      items: [
        'Real wallet connection (wagmi + viem)',
        'EIP-7702 session keys untuk agents',
        'Real HYPHA staking transactions',
        'HYPHAToken mainnet deployment',
        'Uniswap V3 HYPHA/ETH pool',
        'Chainlink price oracle',
        'Real DAO governance (Governor Bravo)',
        'The Graph real event indexing'
      ],
      metrics: [
        { label: 'Real Wallets', value: '100 target' },
        { label: 'Real Tx', value: '500/bulan' },
        { label: 'TVL (Staking)', value: '$10,000' },
        { label: 'Revenue Target', value: '$2,500/bulan' }
      ]
    },
    {
      phase: 2,
      title: 'AI Sovereignty Layer',
      timeline: 'Bulan 3–6',
      budget: '$5,000–$15,000',
      status: 'future',
      color: '#8b5cf6',
      items: [
        'Real DID publication via Ceramic Network',
        'W3C Verifiable Credentials on-chain issuance',
        'ERC-6551 Agent NFT dengan wallet sendiri',
        'Autonolas autonomous agent services',
        'x402 M2M payment protocol',
        'Semaphore ZK anonymous voting',
        'WorldID proof-of-humanity',
        'Lit Protocol token-gated access'
      ],
      metrics: [
        { label: 'DID Published', value: '500 target' },
        { label: 'VCs Issued', value: '2,000 target' },
        { label: 'Agent NFTs', value: '200 target' },
        { label: 'Revenue Target', value: '$12,000/bulan' }
      ]
    },
    {
      phase: 3,
      title: 'Web5 Full Deployment',
      timeline: 'Bulan 6–12',
      budget: '$15,000–$50,000',
      status: 'future',
      color: '#06b6d4',
      items: [
        'GANI DWN Node (self-hosted)',
        'zkML agent verification (EZKL)',
        'LayerZero V2 cross-chain bridge',
        'Chainlink CCIP agent coordination',
        'Cloudflare AI local inference',
        'AI Model Registry on-chain',
        'Federated Learning framework',
        'Enterprise DWN (B2B)'
      ],
      metrics: [
        { label: 'zkML Proofs/mo', value: '10,000' },
        { label: 'DWN Nodes', value: '50' },
        { label: 'Networks', value: '4 chains' },
        { label: 'Revenue Target', value: '$150,000/bulan' }
      ]
    },
    {
      phase: 4,
      title: 'Autonomous Sovereign Economy',
      timeline: 'Bulan 12–24',
      budget: '$50,000+',
      status: 'future',
      color: '#f59e0b',
      items: [
        'AI Agent IPO platform (bonding curve)',
        'Agent-to-agent marketplace',
        'Sovereign AI Council (hybrid governance)',
        'HYPHA as AI Economy reserve currency',
        'Full DeFi integration (AAVE, Yearn, GMX)',
        'CEX listings (Coinbase, Binance)',
        'Mobile DApp (React Native)',
        'Hardware wallet support (Ledger, Trezor)'
      ],
      metrics: [
        { label: 'MAU', value: '100,000+' },
        { label: 'TVL', value: '$100M+' },
        { label: 'Daily Volume', value: '$1M+' },
        { label: 'Revenue Target', value: '$1,000,000/bulan' }
      ]
    }
  ];

  // ── TECHNOLOGY PILLARS ─────────────────────────────────────
  const techPillars: TechPillar[] = [
    {
      id: 'ssi',
      name: 'Self-Sovereign Identity',
      icon: '🪪',
      description: 'W3C DID + Verifiable Credentials. Market: $6.64B by 2026.',
      status: 'production',
      maturity: 75,
      relevance: 'Core identity layer untuk semua agent interactions'
    },
    {
      id: 'eip7702',
      name: 'EIP-7702 Session Keys',
      icon: '🔑',
      description: 'Agents trade tanpa expose private keys. Deployed Ethereum post-Pectra.',
      status: 'production',
      maturity: 80,
      relevance: 'KRITIS untuk secure agent autonomy'
    },
    {
      id: 'zkml',
      name: 'zkML — Verifiable AI',
      icon: '🔐',
      description: 'Zero-knowledge proofs untuk AI decisions. EZKL production-ready.',
      status: 'emerging',
      maturity: 45,
      relevance: 'Premium tier: trustless AI execution'
    },
    {
      id: 'dwn',
      name: 'Decentralized Web Nodes',
      icon: '🌐',
      description: 'User-controlled data storage. TBD sunset → Affinidi/Ceramic.',
      status: 'emerging',
      maturity: 50,
      relevance: 'Data sovereignty differentiator'
    },
    {
      id: 'x402',
      name: 'x402 M2M Payments',
      icon: '💳',
      description: 'HTTP 402 micro-payments untuk agent APIs. Stablecoin per-request.',
      status: 'emerging',
      maturity: 40,
      relevance: 'Agent-to-agent economy enabler'
    },
    {
      id: 'autonolas',
      name: 'Autonolas Agents',
      icon: '🤖',
      description: 'Off-chain compute + on-chain settlement. ERC-721 agent services.',
      status: 'production',
      maturity: 70,
      relevance: 'True autonomous agent execution'
    },
    {
      id: 'layerzero',
      name: 'LayerZero V2',
      icon: '🌉',
      description: 'Omnichain messaging. Cross-chain HYPHA bridge.',
      status: 'production',
      maturity: 85,
      relevance: 'Multi-chain sovereignty'
    },
    {
      id: 'worldid',
      name: 'WorldID + Semaphore',
      icon: '👁️',
      description: 'ZK proof-of-humanity + anonymous governance votes.',
      status: 'production',
      maturity: 70,
      relevance: 'Sybil resistance + privacy voting'
    }
  ];

  // ── MARKET DATA ────────────────────────────────────────────
  const marketStats = [
    { label: 'Agentic AI Market 2026', value: '$8.5B', trend: '+430%', color: '#10b981' },
    { label: 'Agentic AI Market 2030', value: '$45B', trend: 'Projected', color: '#6366f1' },
    { label: 'Crypto AI Agent Economy 2030', value: '$30T', trend: 'Projected', color: '#f59e0b' },
    { label: 'SSI Market 2026', value: '$6.64B', trend: 'Active', color: '#06b6d4' },
    { label: 'Sovereign AI Compute 2026', value: '$100B', trend: 'Investment', color: '#8b5cf6' },
    { label: 'Enterprises Deploying Agents', value: '74%', trend: 'In 2 Years', color: '#ef4444' }
  ];

  // ── HELPERS ────────────────────────────────────────────────
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'text-red-400 bg-red-500/20 border-red-500/40';
      case 'HIGH': return 'text-orange-400 bg-orange-500/20 border-orange-500/40';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/40';
      case 'LOW': return 'text-green-400 bg-green-500/20 border-green-500/40';
      default: return 'text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'production': return 'text-green-400 bg-green-500/20';
      case 'emerging': return 'text-yellow-400 bg-yellow-500/20';
      case 'research': return 'text-blue-400 bg-blue-500/20';
      case 'planned': return 'text-gray-400 bg-gray-500/20';
      default: return 'text-gray-400';
    }
  };

  const getPhaseStatusStyle = (status: string) => {
    switch (status) {
      case 'completed': return 'border-green-500/60 bg-green-500/5';
      case 'active': return 'border-indigo-500/60 bg-indigo-500/10 ring-1 ring-indigo-500/30';
      case 'upcoming': return 'border-purple-500/40 bg-purple-500/5';
      case 'future': return 'border-gray-700/60 bg-gray-800/30';
      default: return 'border-gray-700/40';
    }
  };

  const criticalGaps = gaps.filter(g => g.severity === 'CRITICAL').length;
  const highGaps = gaps.filter(g => g.severity === 'HIGH').length;
  const avgProgress = Math.round(gaps.reduce((acc, g) => acc + g.progress, 0) / gaps.length);

  return (
    <div className={`transition-all duration-500 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* ── HEADER ─────────────────────────────────────────── */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="text-3xl">🧠</span>
              <span>AI Sovereignty & Web5 Research</span>
              <span className="text-xs font-mono bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded border border-indigo-500/40">v4.0</span>
            </h1>
            <p className="text-gray-400 mt-1 text-sm">
              Deep Research • Gap Analysis • Strategic Roadmap • 2026–2028
            </p>
          </div>
          <div className="text-right text-xs text-gray-500">
            <div>Research Date: Feb 24, 2026</div>
            <div className="text-yellow-400 font-semibold mt-1">🔬 CLASSIFIED — SOVEREIGN</div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {[
            { label: 'Critical Gaps', value: criticalGaps, color: 'red', icon: '🔴' },
            { label: 'High Priority', value: highGaps, color: 'orange', icon: '🟠' },
            { label: 'Overall Progress', value: `${avgProgress}%`, color: 'indigo', icon: '📊' },
            { label: 'Market by 2030', value: '$45B', color: 'emerald', icon: '📈' }
          ].map((stat, i) => (
            <div key={i} className="bg-gray-900/60 border border-gray-700/60 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{stat.icon}</span>
                <div>
                  <div className={`text-xl font-bold ${
                    stat.color === 'red' ? 'text-red-400' :
                    stat.color === 'orange' ? 'text-orange-400' :
                    stat.color === 'indigo' ? 'text-indigo-400' : 'text-emerald-400'
                  }`}>{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TABS ───────────────────────────────────────────── */}
      <div className="flex gap-1 mb-5 bg-gray-900/60 p-1 rounded-xl border border-gray-700/40 overflow-x-auto">
        {[
          { id: 'overview', label: '🌐 Overview', icon: '🌐' },
          { id: 'gaps', label: '🔍 Gap Analysis', icon: '🔍' },
          { id: 'roadmap', label: '🗺️ Roadmap', icon: '🗺️' },
          { id: 'tech', label: '⚙️ Tech Stack', icon: '⚙️' },
          { id: 'revenue', label: '💰 Revenue', icon: '💰' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ───────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          {/* Market Stats Grid */}
          <div>
            <h2 className="text-lg font-bold text-white mb-3">📊 Market Intelligence 2026</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {marketStats.map((stat, i) => (
                <div key={i} className="bg-gray-900/60 border border-gray-700/60 rounded-xl p-4 hover:border-indigo-500/40 transition-colors">
                  <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
                  <div className="text-xs mt-2 px-2 py-0.5 rounded-full inline-block"
                    style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                    {stat.trend}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Sovereignty Pillars */}
          <div>
            <h2 className="text-lg font-bold text-white mb-3">🏛️ 6 Pilar AI Sovereignty</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { icon: '💾', title: 'Data Sovereignty', desc: 'Kontrol penuh data yang digunakan AI — tidak boleh ada corporate lock-in', status: '⚠️ Partial (Supabase)', color: '#f59e0b' },
                { icon: '🤖', title: 'Model Sovereignty', desc: 'Kemampuan menjalankan dan memodifikasi AI model secara independen', status: '✅ Groq + Cloudflare AI', color: '#10b981' },
                { icon: '⚡', title: 'Compute Sovereignty', desc: 'Independensi dari hyperscaler (AWS/Azure/Google Cloud)', status: '✅ Cloudflare Edge', color: '#10b981' },
                { icon: '🪪', title: 'Identity Sovereignty', desc: 'Identitas digital yang tidak dapat dicabut oleh pihak ketiga', status: '⚠️ Partial DID', color: '#f59e0b' },
                { icon: '💰', title: 'Revenue Sovereignty', desc: 'Monetisasi langsung dari kontribusi AI tanpa platform cut', status: '🔴 Not Active Yet', color: '#ef4444' },
                { icon: '🏛️', title: 'Governance Sovereignty', desc: 'Suara nyata dalam keputusan protokol via on-chain DAO', status: '🔴 UI Only', color: '#ef4444' }
              ].map((pillar, i) => (
                <div key={i} className="bg-gray-900/60 border border-gray-700/60 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{pillar.icon}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-white text-sm">{pillar.title}</div>
                      <div className="text-xs text-gray-400 mt-1">{pillar.desc}</div>
                      <div className="text-xs mt-2 font-mono" style={{ color: pillar.color }}>{pillar.status}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Current State Assessment */}
          <div className="bg-gray-900/60 border border-gray-700/60 rounded-xl p-5">
            <h2 className="text-lg font-bold text-white mb-4">📍 Current State Assessment</h2>
            <div className="space-y-3">
              {[
                { label: 'Frontend (React 19)', progress: 100, color: '#10b981' },
                { label: 'Hono Backend (CF Workers)', progress: 100, color: '#10b981' },
                { label: 'AI Service (Groq LLM)', progress: 100, color: '#10b981' },
                { label: 'Multi-Chain RPC', progress: 80, color: '#f59e0b' },
                { label: 'Smart Contracts (Sepolia)', progress: 80, color: '#f59e0b' },
                { label: 'PREMALTA (Base)', progress: 60, color: '#f59e0b' },
                { label: 'DID / SSI', progress: 40, color: '#ef4444' },
                { label: 'IPFS/Pinata Real', progress: 40, color: '#ef4444' },
                { label: 'DeFi Real Swaps', progress: 5, color: '#ef4444' },
                { label: 'ZK Proofs (zkML)', progress: 0, color: '#6b7280' },
                { label: 'Decentralized Web Nodes', progress: 0, color: '#6b7280' },
                { label: 'Agent-to-Agent Economy', progress: 0, color: '#6b7280' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-40 text-xs text-gray-400 flex-shrink-0">{item.label}</div>
                  <div className="flex-1 bg-gray-800 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${item.progress}%`, backgroundColor: item.color }}
                    />
                  </div>
                  <div className="w-10 text-right text-xs font-mono" style={{ color: item.color }}>
                    {item.progress}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Findings */}
          <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-500/30 rounded-xl p-5">
            <h2 className="text-lg font-bold text-white mb-3">🔬 Key Research Findings</h2>
            <div className="space-y-3 text-sm">
              {[
                { icon: '⚡', text: 'EIP-7702 (session keys) sudah production di Ethereum — solusi untuk secure agent wallet', highlight: 'IMMEDIATE ACTION' },
                { icon: '💰', text: 'Agentic AI market $8.5B → $45B (2030). HYPHA positioned di sweet spot.', highlight: 'OPPORTUNITY' },
                { icon: '🔐', text: 'zkML + FHE fusion (Feb 2026) = privacy-preserving AI on blockchain sudah possible', highlight: 'EMERGING TECH' },
                { icon: '🌐', text: 'TBD (Jack Dorsey Web5) sunset Dec 2024 — Ceramic Network/Affinidi mengisi gap DWN', highlight: 'STRATEGY SHIFT' },
                { icon: '🤖', text: '$30 Trillion autonomous agent economy projected 2030 — 15% financial decisions autonomous', highlight: 'MEGA TREND' },
                { icon: '⚠️', text: 'Hanya 21% enterprise punya mature AI governance — huge consulting opportunity', highlight: 'ENTERPRISE GAP' }
              ].map((finding, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-lg flex-shrink-0">{finding.icon}</span>
                  <div>
                    <span className="text-gray-300">{finding.text}</span>
                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {finding.highlight}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── GAP ANALYSIS TAB ───────────────────────────────── */}
      {activeTab === 'gaps' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">🔍 Platform Gap Analysis</h2>
            <div className="text-xs text-gray-500">Overall completion: {avgProgress}%</div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {gaps.map((gap) => (
              <div key={gap.id} className="bg-gray-900/60 border border-gray-700/60 rounded-xl p-4 hover:border-gray-600/60 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white">{gap.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${getSeverityColor(gap.severity)}`}>
                      {gap.severity}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-indigo-400">{gap.progress}%</div>
                </div>

                <div className="w-full bg-gray-800 rounded-full h-1.5 mb-3">
                  <div
                    className="h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    style={{ width: `${gap.progress}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-2">
                    <div className="text-red-400 font-semibold mb-1">❌ Saat Ini</div>
                    <div className="text-gray-400">{gap.current}</div>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-2">
                    <div className="text-green-400 font-semibold mb-1">✅ Target</div>
                    <div className="text-gray-400">{gap.required}</div>
                  </div>
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-2">
                    <div className="text-blue-400 font-semibold mb-1">🔧 Solusi</div>
                    <div className="text-gray-400 font-mono">{gap.solution}</div>
                  </div>
                  <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-2">
                    <div className="text-purple-400 font-semibold mb-1">💰 Revenue Impact</div>
                    <div className="text-gray-400">{gap.revenueImpact}</div>
                  </div>
                </div>

                <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
                  <span>⏱️ Effort: <span className="text-yellow-400">{gap.effort}</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ROADMAP TAB ─────────────────────────────────────── */}
      {activeTab === 'roadmap' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">🗺️ Strategic Roadmap 2026–2028</h2>

          {phases.map((phase) => (
            <div
              key={phase.phase}
              className={`border rounded-xl overflow-hidden cursor-pointer transition-all ${getPhaseStatusStyle(phase.status)}`}
              onClick={() => setSelectedPhase(selectedPhase === phase.phase ? null : phase.phase)}
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm"
                      style={{ backgroundColor: phase.color }}>
                      {phase.phase}
                    </div>
                    <div>
                      <div className="font-bold text-white">{phase.title}</div>
                      <div className="text-xs text-gray-400">{phase.timeline} • Budget: {phase.budget}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {phase.status === 'active' && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 animate-pulse">
                        🔴 ACTIVE
                      </span>
                    )}
                    {phase.status === 'completed' && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-300">✅ DONE</span>
                    )}
                    <span className="text-gray-400">{selectedPhase === phase.phase ? '▲' : '▼'}</span>
                  </div>
                </div>

                {/* Metrics preview */}
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {phase.metrics.map((metric, i) => (
                    <div key={i} className="text-center">
                      <div className="text-sm font-bold" style={{ color: phase.color }}>{metric.value}</div>
                      <div className="text-xs text-gray-500">{metric.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expanded items */}
              {selectedPhase === phase.phase && (
                <div className="border-t border-gray-700/40 p-4 bg-gray-900/40">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {phase.items.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-gray-500 flex-shrink-0">→</span>
                        <span className={item.startsWith('✅') ? 'text-green-400' : item.startsWith('🔴') ? 'text-red-400' : 'text-gray-300'}>
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Timeline Visual */}
          <div className="bg-gray-900/60 border border-gray-700/60 rounded-xl p-5 mt-4">
            <h3 className="font-semibold text-white mb-4">📅 Timeline Overview</h3>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 to-gray-700" />
              <div className="space-y-4">
                {[
                  { date: 'Feb 2026', label: 'Platform Live 🚀', color: '#10b981' },
                  { date: 'Mar 2026', label: 'PREMALTA DEX + Real Wallets', color: '#6366f1' },
                  { date: 'May 2026', label: 'Real DeFi + HYPHAToken Mainnet', color: '#8b5cf6' },
                  { date: 'Aug 2026', label: 'DID/SSI + Agent NFTs + zkML v1', color: '#06b6d4' },
                  { date: 'Nov 2026', label: 'DWN + Cross-Chain Bridge', color: '#f59e0b' },
                  { date: 'Feb 2027', label: 'Agent Economy + $100K Revenue/mo', color: '#ef4444' },
                  { date: 'Feb 2028', label: 'Autonomous Sovereign Economy + $1M/mo', color: '#a78bfa' }
                ].map((milestone, i) => (
                  <div key={i} className="flex items-center gap-4 pl-8 relative">
                    <div className="absolute left-3 w-3 h-3 rounded-full border-2"
                      style={{ borderColor: milestone.color, backgroundColor: `${milestone.color}40` }} />
                    <div className="w-20 text-xs text-gray-500 font-mono flex-shrink-0">{milestone.date}</div>
                    <div className="text-sm text-gray-300">{milestone.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TECH STACK TAB ─────────────────────────────────── */}
      {activeTab === 'tech' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">⚙️ Recommended Web5 Tech Stack</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {techPillars.map((tech) => (
              <div key={tech.id} className="bg-gray-900/60 border border-gray-700/60 rounded-xl p-4 hover:border-gray-500/60 transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{tech.icon}</span>
                    <div>
                      <div className="font-semibold text-white text-sm">{tech.name}</div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(tech.status)}`}>
                        {tech.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-indigo-400">{tech.maturity}%</div>
                    <div className="text-xs text-gray-500">maturity</div>
                  </div>
                </div>

                <div className="w-full bg-gray-800 rounded-full h-1.5 mb-2">
                  <div
                    className="h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    style={{ width: `${tech.maturity}%` }}
                  />
                </div>

                <p className="text-xs text-gray-400 mb-2">{tech.description}</p>
                <div className="text-xs text-indigo-400 bg-indigo-500/10 rounded-lg p-2 border border-indigo-500/20">
                  💡 {tech.relevance}
                </div>
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="bg-gray-900/60 border border-gray-700/60 rounded-xl p-5">
            <h3 className="font-semibold text-white mb-4">🏆 Competitive Positioning</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-700/60">
                    <th className="text-left py-2 pr-4 text-gray-400">Platform</th>
                    <th className="text-center py-2 px-2 text-gray-400">AI</th>
                    <th className="text-center py-2 px-2 text-gray-400">SSI</th>
                    <th className="text-center py-2 px-2 text-gray-400">Edge</th>
                    <th className="text-center py-2 px-2 text-gray-400">Multi-Chain</th>
                    <th className="text-center py-2 px-2 text-gray-400">DAO</th>
                  </tr>
                </thead>
                <tbody className="space-y-1">
                  {[
                    { name: '🔵 GANI HYPHA', ai: '✅', ssi: '⚠️', edge: '✅', multi: '✅', dao: '⚠️', highlight: true },
                    { name: 'Fetch.ai', ai: '✅', ssi: '❌', edge: '❌', multi: '✅', dao: '⚠️', highlight: false },
                    { name: 'Virtuals Protocol', ai: '✅', ssi: '❌', edge: '❌', multi: '❌', dao: '⚠️', highlight: false },
                    { name: 'Autonolas', ai: '⚠️', ssi: '❌', edge: '❌', multi: '✅', dao: '✅', highlight: false },
                    { name: 'SingularityNET', ai: '✅', ssi: '❌', edge: '❌', multi: '⚠️', dao: '⚠️', highlight: false }
                  ].map((row, i) => (
                    <tr key={i} className={`border-b border-gray-700/30 ${row.highlight ? 'bg-indigo-500/10' : ''}`}>
                      <td className={`py-2 pr-4 font-medium ${row.highlight ? 'text-indigo-300' : 'text-gray-300'}`}>{row.name}</td>
                      <td className="text-center py-2 px-2">{row.ai}</td>
                      <td className="text-center py-2 px-2">{row.ssi}</td>
                      <td className="text-center py-2 px-2">{row.edge}</td>
                      <td className="text-center py-2 px-2">{row.multi}</td>
                      <td className="text-center py-2 px-2">{row.dao}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── REVENUE TAB ────────────────────────────────────── */}
      {activeTab === 'revenue' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">💰 Revenue Generation Plan</h2>

          {/* Budget Allocation */}
          <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-xl p-5">
            <h3 className="font-semibold text-green-400 mb-4">💵 Budget Allocation ($500 Immediate)</h3>
            <div className="space-y-3">
              {[
                { item: 'PREMALTA/USDC Uniswap V3 Pool', amount: '$400', roi: '50-200% APY via LP fees', urgent: true },
                { item: 'Gas fees untuk mainnet deploys', amount: '$50', roi: 'Unlock real transactions', urgent: true },
                { item: 'Chainstack Pro RPC', amount: '$30', roi: 'Better reliability untuk users', urgent: false },
                { item: 'Reserve', amount: '$20', roi: 'Emergency buffer', urgent: false }
              ].map((alloc, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-900/60 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    {alloc.urgent && <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse flex-shrink-0" />}
                    <div>
                      <div className="text-sm font-medium text-white">{alloc.item}</div>
                      <div className="text-xs text-gray-400">{alloc.roi}</div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-green-400 flex-shrink-0">{alloc.amount}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Ramp */}
          <div className="bg-gray-900/60 border border-gray-700/60 rounded-xl p-5">
            <h3 className="font-semibold text-white mb-4">📈 Revenue Ramp Projection</h3>
            <div className="space-y-3">
              {[
                { period: 'Month 1', streams: 'PREMALTA LP fees + Blueprint demos', min: '$200', max: '$600', bg: 'from-gray-800' },
                { period: 'Month 3', streams: 'Real staking + Blueprint sales + AI agent subs', min: '$1,500', max: '$3,500', bg: 'from-blue-900/20' },
                { period: 'Month 6', streams: 'DeFi yield share + Agent economy + Enterprise pods', min: '$8,000', max: '$15,000', bg: 'from-indigo-900/20' },
                { period: 'Month 12', streams: 'Enterprise clients + A2A fees + DeFi protocol fees', min: '$40,000', max: '$80,000', bg: 'from-purple-900/20' },
                { period: 'Month 24', streams: 'Autonomous sovereign economy + CEX listings + $HYPHA appreciation', min: '$500,000', max: '$1,500,000', bg: 'from-yellow-900/20' }
              ].map((rev, i) => (
                <div key={i} className={`bg-gradient-to-r ${rev.bg} to-transparent border border-gray-700/40 rounded-xl p-4`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">{rev.period}</div>
                      <div className="text-xs text-gray-400 mt-1">{rev.streams}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-400">{rev.min}</div>
                      <div className="text-xs text-gray-500">to {rev.max}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Immediate Actions */}
          <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-5">
            <h3 className="font-semibold text-red-400 mb-4">🚨 Immediate Actions (7 Hari)</h3>
            <div className="space-y-3">
              {[
                { step: 1, action: 'Buat PREMALTA/USDC pool di Uniswap V3 Base', url: 'https://app.uniswap.org/pool', urgency: 'TODAY' },
                { step: 2, action: 'Lock LP di Uncx.network selama 6 bulan', url: 'https://app.uncx.network/', urgency: 'TODAY' },
                { step: 3, action: 'Verify PREMALTA contract di Basescan', url: 'https://basescan.org/address/0xC0125651a46BDEea72a73A1C1A75b82e0E2C94c7', urgency: 'DAY 1' },
                { step: 4, action: 'Submit logo PR ke Uniswap token list', url: 'https://github.com/Uniswap/default-token-list', urgency: 'DAY 2' },
                { step: 5, action: 'Setup Snapshot.org governance space', url: 'https://snapshot.org/#/setup', urgency: 'DAY 3' },
                { step: 6, action: 'Request CoinGecko listing', url: 'https://www.coingecko.com/en/coins/new', urgency: 'DAY 5' }
              ].map((action) => (
                <div key={action.step} className="flex items-start gap-3 bg-gray-900/60 rounded-lg p-3">
                  <div className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {action.step}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-300">{action.action}</div>
                    <div className="text-xs text-indigo-400 mt-1 font-mono truncate">{action.url}</div>
                  </div>
                  <span className="text-xs font-bold text-red-400 flex-shrink-0 bg-red-500/10 px-2 py-0.5 rounded">
                    {action.urgency}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIWeb5Roadmap;
