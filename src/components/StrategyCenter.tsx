
// ============================================================
// GANI HYPHA — Strategy Center v1.0
// Deep-Dive Research + Revenue Model + Implementation Plan
// Competitive Analysis + Real-World Execution Steps
// ============================================================

import React, { useState, useMemo } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, Legend
} from 'recharts';

const StrategyCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'competitive' | 'revenue' | 'implementation' | 'roadmap' | 'execution'
  >('overview');

  // ─── COMPETITIVE DATA ─────────────────────────────────────
  const competitors = [
    {
      name: 'Virtuals Protocol', symbol: 'VIRTUAL', chain: 'Base', marketCap: 890_000_000,
      tvl: 350_000_000, agents: 11000, revenue: '~$2M/mo', strengths: ['11K+ agents', 'Revenue Network', 'Base ecosystem'],
      weaknesses: ['No enterprise pods', 'Limited AI depth', 'No multi-industry'], score: 82, color: '#8b5cf6'
    },
    {
      name: 'SingularityNET', symbol: 'AGIX', chain: 'Ethereum', marketCap: 820_000_000,
      tvl: 0, agents: 400, revenue: '~$500K/mo', strengths: ['AI marketplace pioneer', 'ASI Alliance', 'Research focus'],
      weaknesses: ['Complex UX', 'Limited DeFi', 'Slow execution'], score: 71, color: '#06b6d4'
    },
    {
      name: 'Fetch.ai (ASI)', symbol: 'FET', chain: 'Ethereum', marketCap: 2_100_000_000,
      tvl: 0, agents: 2000, revenue: '~$800K/mo', strengths: ['Largest network', 'Cosmos SDK', 'Enterprise deals'],
      weaknesses: ['Complex infra', 'Not user-friendly', 'High entry barrier'], score: 74, color: '#10b981'
    },
    {
      name: 'ai16z / Eliza', symbol: 'AI16Z', chain: 'Solana', marketCap: 1_800_000_000,
      tvl: 0, agents: 500, revenue: '~$1M/mo', strengths: ['Open source Eliza', 'Viral community', 'DAO funded'],
      weaknesses: ['Solana only', 'No enterprise', 'Dev-centric'], score: 68, color: '#f59e0b'
    },
    {
      name: 'GANI HYPHA', symbol: 'HYPHA', chain: 'ETH+Base', marketCap: 68_400_000,
      tvl: 24_000_000, agents: 9, revenue: 'Target $115K/mo', strengths: ['Enterprise pods', 'Industry tokens', 'Full Web3 stack'],
      weaknesses: ['Early stage', 'Small community', 'Pending liquidity'], score: 77, color: '#6366f1'
    },
  ];

  const marketSizeData = [
    { year: '2024', blockchain: 9.27, defi: 20.48, aiAgent: 0.5 },
    { year: '2025', blockchain: 12.76, defi: 45, aiAgent: 3.2 },
    { year: '2026', blockchain: 19.4, defi: 80, aiAgent: 12.6 },
    { year: '2027', blockchain: 32, defi: 130, aiAgent: 38 },
    { year: '2028', blockchain: 55, defi: 200, aiAgent: 95 },
    { year: '2029', blockchain: 90, defi: 310, aiAgent: 210 },
    { year: '2030', blockchain: 165, defi: 230, aiAgent: 594 },
  ];

  const radarData = [
    { metric: 'AI Depth', HYPHA: 88, Virtuals: 65, Fetch: 72, SingNet: 80 },
    { metric: 'Enterprise', HYPHA: 92, Virtuals: 40, Fetch: 65, SingNet: 55 },
    { metric: 'DeFi Integration', HYPHA: 85, Virtuals: 70, Fetch: 45, SingNet: 30 },
    { metric: 'UX/Onboarding', HYPHA: 80, Virtuals: 72, Fetch: 45, SingNet: 50 },
    { metric: 'Token Utility', HYPHA: 90, Virtuals: 75, Fetch: 68, SingNet: 72 },
    { metric: 'Multi-Industry', HYPHA: 95, Virtuals: 40, Fetch: 55, SingNet: 65 },
    { metric: 'Web3 Stack', HYPHA: 93, Virtuals: 60, Fetch: 70, SingNet: 68 },
  ];

  // ─── REVENUE STREAMS ──────────────────────────────────────
  const revenueStreams = [
    {
      stream: 'Blueprint Pod Sales', icon: '📦', type: 'Direct',
      mechanism: 'Users pay HYPHA to unlock enterprise pods (800–8,000 HYPHA/pod)',
      monthlyM1: 5_000, monthlyM6: 45_000, monthlyM12: 180_000, monthlyM24: 750_000,
      margin: 95, notes: '2.5% marketplace fee on all pod transactions', color: '#6366f1'
    },
    {
      stream: 'SaaS Subscriptions', icon: '💳', type: 'Recurring',
      mechanism: 'Pro $19/mo · Enterprise $49–$499/mo per deployed pod',
      monthlyM1: 3_000, monthlyM6: 28_000, monthlyM12: 120_000, monthlyM24: 580_000,
      margin: 85, notes: 'Target 1K subscribers by Month 12 = $120K/mo MRR', color: '#8b5cf6'
    },
    {
      stream: 'DeFi Yield Vault', icon: '📈', type: 'Protocol',
      mechanism: '2% management fee + 20% performance fee on automated yield',
      monthlyM1: 500, monthlyM6: 8_000, monthlyM12: 55_000, monthlyM24: 350_000,
      margin: 92, notes: 'Requires $1M+ TVL. Target: 8–25% APY strategies', color: '#10b981'
    },
    {
      stream: 'Token Swap Fees', icon: '🔄', type: 'Protocol',
      mechanism: '0.3% swap fee (0.25% LP + 0.05% protocol) on HYPHA/PREMALTA pairs',
      monthlyM1: 200, monthlyM6: 5_000, monthlyM12: 25_000, monthlyM24: 150_000,
      margin: 100, notes: 'Scales with DEX volume. $1M/day = $1,500/day protocol fee', color: '#06b6d4'
    },
    {
      stream: 'AI Agent Usage', icon: '🤖', type: 'Metered',
      mechanism: '1 HYPHA per 100 Groq messages; 5 HYPHA per Blueprint; 10 HYPHA per Deploy',
      monthlyM1: 800, monthlyM6: 6_000, monthlyM12: 30_000, monthlyM24: 200_000,
      margin: 90, notes: 'Groq cost ~$0.0001/call, HYPHA revenue ~$0.002/call = 20x margin', color: '#f59e0b'
    },
    {
      stream: 'Industry Tokens', icon: '🪙', type: 'Ecosystem',
      mechanism: 'PROPRT/BARBER/MEDIA/SUPPLY etc — 0.5% on each industry token transaction',
      monthlyM1: 0, monthlyM6: 3_000, monthlyM12: 18_000, monthlyM24: 180_000,
      margin: 100, notes: '9 industry tokens × avg $2K/mo each = $18K/mo at M12', color: '#ef4444'
    },
    {
      stream: 'NFT Collections', icon: '🎨', type: 'One-time',
      mechanism: 'Founder Pods 0.1 ETH (9,999 NFTs), Royalties 2.5% secondary',
      monthlyM1: 0, monthlyM6: 15_000, monthlyM12: 40_000, monthlyM24: 80_000,
      margin: 95, notes: '9,999 × 0.1 ETH = ~$3.2M if sold out. Secondary royalties ongoing', color: '#a855f7'
    },
    {
      stream: 'Enterprise API', icon: '🏢', type: 'B2B',
      mechanism: 'Custom enterprise pod deployment + API access $500–$5,000/mo',
      monthlyM1: 0, monthlyM6: 5_000, monthlyM12: 30_000, monthlyM24: 200_000,
      margin: 80, notes: 'B2B pipeline starts Month 4. Target 10 enterprise clients by M12', color: '#64748b'
    },
  ];

  const revenueTotalByMonth = useMemo(() => [
    { month: 'M1', total: revenueStreams.reduce((a, r) => a + r.monthlyM1, 0) },
    { month: 'M6', total: revenueStreams.reduce((a, r) => a + r.monthlyM6, 0) },
    { month: 'M12', total: revenueStreams.reduce((a, r) => a + r.monthlyM12, 0) },
    { month: 'M24', total: revenueStreams.reduce((a, r) => a + r.monthlyM24, 0) },
  ], []);

  const revenueProjection = useMemo(() => [
    { month: 'M1', total: 9_500, pods: 5_000, saas: 3_000, defi: 700, ai: 800 },
    { month: 'M2', total: 18_000, pods: 9_000, saas: 5_500, defi: 1_500, ai: 2_000 },
    { month: 'M3', total: 28_000, pods: 13_000, saas: 9_000, defi: 3_000, ai: 3_000 },
    { month: 'M4', total: 42_000, pods: 18_000, saas: 13_000, defi: 6_000, ai: 5_000 },
    { month: 'M5', total: 62_000, pods: 24_000, saas: 19_000, defi: 11_000, ai: 8_000 },
    { month: 'M6', total: 100_000, pods: 45_000, saas: 28_000, defi: 15_000, ai: 12_000 },
    { month: 'M7', total: 135_000, pods: 58_000, saas: 38_000, defi: 22_000, ai: 17_000 },
    { month: 'M8', total: 175_000, pods: 72_000, saas: 52_000, defi: 32_000, ai: 19_000 },
    { month: 'M9', total: 225_000, pods: 90_000, saas: 70_000, defi: 45_000, ai: 20_000 },
    { month: 'M10', total: 285_000, pods: 110_000, saas: 88_000, defi: 62_000, ai: 25_000 },
    { month: 'M11', total: 350_000, pods: 135_000, saas: 105_000, defi: 82_000, ai: 28_000 },
    { month: 'M12', total: 498_000, pods: 180_000, saas: 120_000, defi: 132_000, ai: 66_000 },
  ], []);

  // ─── IMPLEMENTATION STEPS ─────────────────────────────────
  const implementationPhases = [
    {
      phase: 'Phase 1 — Foundation (Weeks 1–2)', status: 'NOW', color: 'emerald',
      steps: [
        { task: 'Fund MetaMask wallet dengan 0.1 ETH (gas untuk Base network)', priority: 'CRITICAL', effort: '1h', revenue: '$0 → unlock all', done: false },
        { task: 'Buat Uniswap V3 pool: PREMALTA/USDC ($500 initial)', priority: 'CRITICAL', effort: '2h', revenue: 'Aktivasi $PREMALTA price', done: false },
        { task: 'Lock LP tokens di Uncx.network (6 bulan)', priority: 'HIGH', effort: '1h', revenue: 'Trust signal → lebih banyak buyer', done: false },
        { task: 'Verify PREMALTA contract di BaseScan + submit logo TrustWallet', priority: 'HIGH', effort: '4h', revenue: 'Legitimacy + discovery', done: false },
        { task: 'Setup Supabase real credentials (ganti placeholder)', priority: 'CRITICAL', effort: '2h', revenue: 'Enables real user data persistence', done: false },
        { task: 'Deploy Hono backend API routes (blueprints, deploy, AI chat)', priority: 'HIGH', effort: '8h', revenue: 'Enables real deployments', done: false },
      ]
    },
    {
      phase: 'Phase 2 — Token Launch (Weeks 3–4)', status: 'NEXT', color: 'indigo',
      steps: [
        { task: 'Community building: Twitter/X @GaniHypha, Discord, Telegram', priority: 'HIGH', effort: '8h/week', revenue: 'Audience = buyers', done: false },
        { task: 'Airdrop 10M PREMALTA ke 1,000 early holders', priority: 'HIGH', effort: '4h', revenue: '1K holders → price discovery', done: false },
        { task: 'Deploy HYPHAStaking.sol di Sepolia testnet', priority: 'MEDIUM', effort: '16h', revenue: '18.5% APY locks supply', done: false },
        { task: 'Implement real MetaMask/Web3Auth wallet connection', priority: 'HIGH', effort: '12h', revenue: 'Real user onboarding', done: false },
        { task: 'Launch Pod subscription payments (USDC on-chain)', priority: 'HIGH', effort: '16h', revenue: 'Direct revenue M1: $3K+', done: false },
        { task: 'Apply Coinmarketcap & CoinGecko listing untuk PREMALTA', priority: 'MEDIUM', effort: '6h', revenue: 'Discovery + volume', done: false },
      ]
    },
    {
      phase: 'Phase 3 — DeFi Integration (Month 2)', status: 'PLAN', color: 'purple',
      steps: [
        { task: 'Deploy HYPHAStaking.sol di Ethereum mainnet + audit', priority: 'CRITICAL', effort: '1 week', revenue: 'Staking = supply lock = price up', done: false },
        { task: 'Real Uniswap V3 quote API (ganti simulasi)', priority: 'HIGH', effort: '8h', revenue: 'Real swap = protocol fee', done: false },
        { task: 'Integrate Aave V3 untuk yield vault', priority: 'HIGH', effort: '20h', revenue: '4.8% APY base + 20% performance fee', done: false },
        { task: 'Deploy PREMALTA staking contract di Base', priority: 'HIGH', effort: '12h', revenue: '15% APY → supply lock', done: false },
        { task: 'Setup The Graph subgraph untuk HYPHA token', priority: 'MEDIUM', effort: '16h', revenue: 'Real analytics → trust', done: false },
        { task: 'Integrate Chainlink price oracle (ETH/USD, HYPHA/USDC)', priority: 'HIGH', effort: '8h', revenue: 'Real price feeds', done: false },
      ]
    },
    {
      phase: 'Phase 4 — Marketplace Scale (Month 3–4)', status: 'SCALE', color: 'amber',
      steps: [
        { task: 'Launch PROPRT token (Real Estate pod) di Ethereum', priority: 'HIGH', effort: '1 week', revenue: '$500–5K/mo from Real Estate pod', done: false },
        { task: 'Launch $BARBER token di Polygon (barber pod)', priority: 'HIGH', effort: '4h', revenue: '$200–2K/mo', done: false },
        { task: 'B2B outreach: pitch 20 real estate agencies', priority: 'HIGH', effort: '20h/month', revenue: '$500/mo × 10 clients = $5K', done: false },
        { task: 'NFT Founder Pods launch (9,999 × 0.1 ETH)', priority: 'HIGH', effort: '2 weeks', revenue: 'Up to $3.2M one-time + royalties', done: false },
        { task: 'CEX listing outreach: MEXC, Gate.io untuk PREMALTA', priority: 'MEDIUM', effort: 'Ongoing', revenue: '5–10× volume increase', done: false },
        { task: 'Mobile PWA version (add to homescreen)', priority: 'MEDIUM', effort: '1 week', revenue: 'Mobile users = 60% market', done: false },
      ]
    },
    {
      phase: 'Phase 5 — DAO & Governance (Month 5–6)', status: 'FUTURE', color: 'rose',
      steps: [
        { task: 'Deploy HYPHAGovernor.sol (Governor Bravo compatible)', priority: 'HIGH', effort: '2 weeks', revenue: 'On-chain governance = credibility', done: false },
        { task: 'Launch DAO treasury (Gnosis Safe multisig)', priority: 'HIGH', effort: '4h', revenue: 'Community trust + proposals', done: false },
        { task: 'Integrate Snapshot.org untuk off-chain voting', priority: 'MEDIUM', effort: '8h', revenue: 'Gas-free voting = more participation', done: false },
        { task: 'Cross-chain bridge: HYPHA ETH ↔ Arbitrum via LayerZero', priority: 'MEDIUM', effort: '1 month', revenue: 'Bridge fee 0.3% = revenue', done: false },
        { task: 'Whitepaper publish + institutional investor outreach', priority: 'HIGH', effort: '2 weeks', revenue: 'Seed round $1–5M', done: false },
        { task: 'Apply Binance/Coinbase listing (requires $5M+ MCap)', priority: 'LOW', effort: 'Ongoing', revenue: '100× volume = $1M+/mo fees', done: false },
      ]
    },
  ];

  // ─── REAL-WORLD EXECUTION ─────────────────────────────────
  const executionSteps = [
    {
      category: '🔥 IMMEDIATE (This Week)', urgency: 'critical',
      steps: [
        { action: 'Beli 0.1 ETH → kirim ke Base wallet untuk gas', cost: '~$320', impact: 'Unlock semua deployment capability' },
        { action: 'Buat PREMALTA/USDC pool di app.uniswap.org (Base network)', cost: '$500 USDC', impact: 'Token jadi tradeable, price discovery begins' },
        { action: 'Update VITE_SUPABASE_URL dengan credentials nyata', cost: '$0', impact: 'Real user authentication works' },
        { action: 'Post Twitter/X thread: "GANI HYPHA Web4 Platform is LIVE"', cost: '$0', impact: 'Community awareness, early adopters' },
        { action: 'Submit PREMALTA ke r/cryptomoonshots Reddit', cost: '$0', impact: 'Initial holder acquisition' },
      ]
    },
    {
      category: '⚡ SHORT-TERM (Week 2–4)', urgency: 'high',
      steps: [
        { action: 'Set up TG/Discord dengan whitepaper dan tokenomics pinned', cost: '$0', impact: '500+ community members' },
        { action: 'Deploy staking smart contract Sepolia testnet + test', cost: '~$50 ETH gas', impact: 'APY staking feature live' },
        { action: 'Contact 20 barber shops/real estate agents via DM dengan pitch', cost: '$0', impact: 'First 5–10 paying customers' },
        { action: 'Submit CMC/CoinGecko listing untuk PREMALTA', cost: '$0', impact: 'Discovery & credibility' },
        { action: 'Setup LangSmith monitoring untuk Groq AI usage', cost: '$0 (free tier)', impact: 'Optimize AI costs' },
      ]
    },
    {
      category: '🚀 MEDIUM-TERM (Month 2–3)', urgency: 'medium',
      steps: [
        { action: 'Hire part-time Solidity dev via Upwork ($15–25/hr)', cost: '$2,000–4,000', impact: 'Smart contracts deployed to mainnet' },
        { action: 'Partner dengan 1 crypto KOL (Key Opinion Leader)', cost: '$500–2,000', impact: '10K+ new eyes on project' },
        { action: 'Launch HYPHA Founder Pods NFT mint (free whitelist phase)', cost: '~$500 contract deploy', impact: 'Community binding + revenue' },
        { action: 'Apply MEXC launchpad (low barrier, good visibility)', cost: 'Listing fee varies', impact: '5–10× volume increase' },
        { action: 'File DAO legal wrapper: Wyoming DAO LLC ($500)', cost: '$500/yr', impact: 'Legal compliance + institutional trust' },
      ]
    },
    {
      category: '🌍 LONG-TERM (Month 4–12)', urgency: 'low',
      steps: [
        { action: 'Raise seed round $500K–1M (angels/VCs targeting Web3 AI)', cost: 'Pitch deck + 3 months networking', impact: 'Hire team of 5–8' },
        { action: 'Enterprise partnership: 1 logistics company untuk Supply Chain pod', cost: '3 months sales cycle', impact: '$50K/mo contract = $600K ARR' },
        { action: 'Build native mobile app (React Native + WalletConnect)', cost: '$20K dev cost', impact: '60% mobile market access' },
        { action: 'Cross-chain bridge ETH ↔ Arbitrum ↔ Base via LayerZero', cost: '$30K dev + audit', impact: 'Unified liquidity = higher TVL' },
        { action: 'CEX listing: Gate.io → Bybit → eventually Coinbase', cost: 'Listing fees + legal', impact: 'Liquidity × 10–100' },
      ]
    },
  ];

  // ─── INCOME PROJECTION ────────────────────────────────────
  const incomeScenarios = [
    {
      scenario: 'Conservative', color: '#ef4444',
      m3: 20_000, m6: 65_000, m12: 180_000, m24: 450_000,
      assumptions: ['Slow community growth', 'Limited DEX liquidity', 'No CEX listing'],
      annualY1: 180_000, annualY2: 1_200_000
    },
    {
      scenario: 'Base Case', color: '#f59e0b',
      m3: 35_000, m6: 115_000, m12: 498_000, m24: 1_800_000,
      assumptions: ['100+ pods deployed', 'PREMALTA on 1 CEX', '$1M TVL staking'],
      annualY1: 498_000, annualY2: 6_000_000
    },
    {
      scenario: 'Bull Case', color: '#10b981',
      m3: 80_000, m6: 300_000, m12: 1_200_000, m24: 8_000_000,
      assumptions: ['Viral growth (Virtuals-like)', 'Binance/Coinbase listing', '$10M+ TVL'],
      annualY1: 1_200_000, annualY2: 24_000_000
    },
  ];

  // ─── TOKEN PRICE PROJECTIONS ──────────────────────────────
  const tokenPriceData = [
    { quarter: 'Q1 2026', HYPHA: 0.20, PREMALTA: 0.01, hyphaMarketCap: 68, premaltaMC: 10 },
    { quarter: 'Q2 2026', HYPHA: 0.50, PREMALTA: 0.05, hyphaMarketCap: 171, premaltaMC: 50 },
    { quarter: 'Q3 2026', HYPHA: 1.00, PREMALTA: 0.15, hyphaMarketCap: 342, premaltaMC: 150 },
    { quarter: 'Q4 2026', HYPHA: 2.00, PREMALTA: 0.50, hyphaMarketCap: 684, premaltaMC: 500 },
    { quarter: 'Q1 2027', HYPHA: 3.50, PREMALTA: 1.00, hyphaMarketCap: 1197, premaltaMC: 1000 },
    { quarter: 'Q2 2027', HYPHA: 5.00, PREMALTA: 2.00, hyphaMarketCap: 1710, premaltaMC: 2000 },
    { quarter: 'Q4 2027', HYPHA: 8.00, PREMALTA: 5.00, hyphaMarketCap: 2736, premaltaMC: 5000 },
    { quarter: 'Q2 2028', HYPHA: 12.00, PREMALTA: 10.00, hyphaMarketCap: 4104, premaltaMC: 10000 },
  ];

  // ─── MOAT ANALYSIS ────────────────────────────────────────
  const moatFactors = [
    { factor: 'Industry-Specific Pods', score: 9, desc: '9 verticals vs competitors\' generic agents — real estate, legal, supply chain etc', icon: '🏗️' },
    { factor: 'Dual Token Ecosystem', score: 8, desc: 'HYPHA (governance/utility) + PREMALTA (creator economy) + 9 industry tokens = 11 tokens total', icon: '🪙' },
    { factor: 'Sovereign AI Stack', score: 9, desc: 'Groq + LangChain + CrewAI + Supabase + Cloudflare = full-stack sovereignty', icon: '🤖' },
    { factor: 'Enterprise Blueprint Lock-in', score: 8, desc: 'Pods create sticky subscription revenue + switching cost = business-critical tool', icon: '🔒' },
    { factor: 'Web3 + Web4 + Web5 Vision', score: 10, desc: 'Only platform with clear evolution path: DID → AI Agents → DWN Mesh', icon: '🌐' },
    { factor: 'Revenue Network (A2A)', score: 7, desc: 'Agent-to-Agent economy like Virtuals but enterprise-grade and multi-industry', icon: '🔄' },
    { factor: 'IPFS + DID Persistence', score: 8, desc: 'True decentralization via Pinata + W3C DID = can never be censored', icon: '📌' },
  ];

  const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#a855f7', '#64748b'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs shadow-2xl">
          <p className="text-slate-300 font-bold mb-1">{label}</p>
          {payload.map((p: any, i: number) => (
            <p key={i} style={{ color: p.color }}>{p.name}: {
              typeof p.value === 'number' && p.value > 1000
                ? `$${(p.value / 1000).toFixed(0)}K`
                : typeof p.value === 'number' && p.value > 0 && p.value < 10
                ? `$${p.value.toFixed(2)}`
                : p.value
            }</p>
          ))}
        </div>
      );
    }
    return null;
  };

  const tabs = [
    { id: 'overview', label: '🎯 Overview', desc: 'Platform Summary' },
    { id: 'competitive', label: '⚔️ Competitive', desc: 'Market Analysis' },
    { id: 'revenue', label: '💰 Revenue', desc: 'Income Models' },
    { id: 'implementation', label: '⚙️ Implementation', desc: 'Step-by-Step' },
    { id: 'roadmap', label: '🗺️ Roadmap', desc: 'Execution Plan' },
    { id: 'execution', label: '🚀 Execution', desc: 'Real Steps' },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 md:p-6 pb-20">
      {/* ── Header ── */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/30">🧠</div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter">Strategy Center</h1>
            <p className="text-slate-400 text-sm">Deep-Dive Research · Revenue Models · Implementation Plan · Real-World Execution</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mt-4">
          {[
            { label: 'Market Size 2030', value: '$594B', color: 'text-indigo-400' },
            { label: 'HYPHA Target M12', value: '$498K/mo', color: 'text-emerald-400' },
            { label: 'Competitors Analyzed', value: '4 Major', color: 'text-amber-400' },
            { label: 'Implementation Steps', value: '30+', color: 'text-purple-400' },
          ].map((s, i) => (
            <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2">
              <p className={`text-lg font-black ${s.color}`}>{s.value}</p>
              <p className="text-slate-500 text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tab Nav ── */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === t.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════
          TAB: OVERVIEW
      ═══════════════════════════════════════════════════════ */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Platform Summary */}
          <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-500/20 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">🌐 Platform Deep-Dive: GANI HYPHA Web4 Agent Marketplace</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-indigo-400 font-bold mb-3">What Is GANI HYPHA?</h3>
                <div className="space-y-2 text-sm text-slate-300">
                  <p>• <span className="text-white font-semibold">Web4 Agent Marketplace</span> — platform yang menjual "blueprint pods" berisi AI agent autonomous yang bisa digunakan bisnis dari berbagai industri.</p>
                  <p>• <span className="text-white font-semibold">Dual Token Economy</span> — $HYPHA (governance + utility) + $PREMALTA (creator economy) + 9 industry-specific tokens.</p>
                  <p>• <span className="text-white font-semibold">SaaS × AI × Web3</span> — subscription model + on-chain token utility + DeFi yield = triple revenue streams.</p>
                  <p>• <span className="text-white font-semibold">Stack</span>: React 19 + Hono + Cloudflare Workers + Groq llama-3.3-70b + Supabase + Alchemy + IPFS.</p>
                </div>
              </div>
              <div>
                <h3 className="text-emerald-400 font-bold mb-3">Unique Value Proposition</h3>
                <div className="space-y-2 text-sm text-slate-300">
                  <p>✅ <span className="text-white">Satu-satunya platform</span> dengan 9 industry-specific AI pods berbeda</p>
                  <p>✅ <span className="text-white">Industry tokens</span> per vertical ($PROPRT, $BARBER, $MEDIA, dll)</p>
                  <p>✅ <span className="text-white">Inverse Pyramid architecture</span>: Web3 foundation → Web4 autonomous → Web5 sovereign</p>
                  <p>✅ <span className="text-white">Full DeFi stack</span>: Uniswap V3 + Aave + Curve + Chainlink + The Graph</p>
                  <p>✅ <span className="text-white">Identity soveeign</span>: W3C DID + Web3Auth + Privy + IPFS</p>
                </div>
              </div>
            </div>
          </div>

          {/* Market Opportunity */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-white font-bold mb-4">📊 Market Opportunity (Total Addressable Market)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={marketSizeData}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} /><stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} /><stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="year" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}B`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="blockchain" stroke="#6366f1" fill="url(#g1)" strokeWidth={2} name="Blockchain Market $B" />
                <Area type="monotone" dataKey="defi" stroke="#10b981" fill="url(#g2)" strokeWidth={2} name="DeFi Market $B" />
                <Area type="monotone" dataKey="aiAgent" stroke="#f59e0b" fill="url(#g3)" strokeWidth={2} name="AI Agent Market $B" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {[
                { label: 'Blockchain Market 2030', value: '$165B', growth: 'CAGR 28%', color: 'text-indigo-400' },
                { label: 'DeFi Market 2030', value: '$230B', growth: 'CAGR 35%', color: 'text-emerald-400' },
                { label: 'AI Agent Market 2030', value: '$594B', growth: 'CAGR 68%', color: 'text-amber-400' },
              ].map((m, i) => (
                <div key={i} className="bg-slate-800 rounded-xl p-3 text-center">
                  <p className={`text-xl font-black ${m.color}`}>{m.value}</p>
                  <p className="text-slate-400 text-xs">{m.label}</p>
                  <p className="text-slate-500 text-xs">{m.growth}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Moat Analysis */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-white font-bold mb-4">🏰 Competitive Moat Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {moatFactors.map((m, i) => (
                <div key={i} className="bg-slate-800/60 rounded-xl p-4 flex items-start gap-3">
                  <span className="text-2xl">{m.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-white font-bold text-sm">{m.factor}</span>
                      <span className="text-emerald-400 font-bold text-sm">{m.score}/10</span>
                    </div>
                    <p className="text-slate-400 text-xs">{m.desc}</p>
                    <div className="mt-2 h-1 bg-slate-700 rounded-full">
                      <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: `${m.score * 10}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          TAB: COMPETITIVE ANALYSIS
      ═══════════════════════════════════════════════════════ */}
      {activeTab === 'competitive' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-white font-bold mb-4">⚔️ Competitor Landscape — Web3 AI Agent Marketplace 2026</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-700">
                    {['Protocol', 'Chain', 'Market Cap', 'TVL', 'Agents', 'Monthly Rev', 'Score'].map(h => (
                      <th key={h} className="text-slate-500 uppercase font-bold py-3 px-3 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {competitors.map((c, i) => (
                    <tr key={i} className={`border-b border-slate-800/60 hover:bg-slate-800/30 transition-all ${c.name === 'GANI HYPHA' ? 'bg-indigo-900/20' : ''}`}>
                      <td className="py-3 px-3">
                        <div>
                          <span className="text-white font-bold">{c.name}</span>
                          <span className="text-slate-500 ml-2">${c.symbol}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-400">{c.chain}</td>
                      <td className="py-3 px-3"><span style={{ color: c.color }} className="font-bold">${(c.marketCap / 1_000_000).toFixed(0)}M</span></td>
                      <td className="py-3 px-3 text-slate-400">{c.tvl > 0 ? `$${(c.tvl / 1_000_000).toFixed(0)}M` : 'N/A'}</td>
                      <td className="py-3 px-3 text-slate-300">{c.agents.toLocaleString()}</td>
                      <td className="py-3 px-3 text-emerald-400">{c.revenue}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1 bg-slate-700 rounded-full w-16">
                            <div className="h-full rounded-full" style={{ width: `${c.score}%`, backgroundColor: c.color }} />
                          </div>
                          <span style={{ color: c.color }} className="font-bold">{c.score}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Radar Chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4">📡 Capability Radar: GANI HYPHA vs Competitors</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#1e293b" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: '#6b7280', fontSize: 10 }} />
                  <Radar name="HYPHA" dataKey="HYPHA" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                  <Radar name="Virtuals" dataKey="Virtuals" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} />
                  <Radar name="Fetch.ai" dataKey="Fetch" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4">💡 HYPHA Competitive Advantages</h3>
              <div className="space-y-3">
                {[
                  { advantage: 'Industry-Specific Pods (9 Verticals)', detail: 'Virtuals has 11K+ generic agents. HYPHA targets enterprise verticals with deep specialization.', icon: '🏗️', impact: 'High' },
                  { advantage: 'Enterprise SaaS Model', detail: '$19–$499/mo subscription vs token-only models = predictable recurring revenue.', icon: '💼', impact: 'High' },
                  { advantage: 'Full DeFi Integration', detail: 'Native Uniswap/Aave/Curve integration. Competitors are AI-only, HYPHA is AI+DeFi.', icon: '📈', impact: 'Medium' },
                  { advantage: 'Multi-Industry Tokens', detail: '9 industry tokens ($PROPRT, $BARBER, etc) creates unique micro-economies per sector.', icon: '🪙', impact: 'High' },
                  { advantage: 'Cloudflare Edge + <50ms latency', detail: 'Faster than any competitor using traditional servers. 200+ global PoPs.', icon: '⚡', impact: 'Medium' },
                ].map((a, i) => (
                  <div key={i} className="p-3 bg-slate-800/60 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <span>{a.icon}</span>
                      <span className="text-white font-bold text-sm">{a.advantage}</span>
                      <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-bold ${a.impact === 'High' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>{a.impact}</span>
                    </div>
                    <p className="text-slate-400 text-xs">{a.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SWOT */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { type: 'Strengths 💪', color: 'emerald', items: ['Full Web3 stack integration', 'Industry-specific AI pods', 'Dual token + 9 industry tokens', 'Cloudflare edge infrastructure', 'Multiple revenue streams', 'Groq ultra-fast AI inference'] },
              { type: 'Weaknesses ⚠️', color: 'red', items: ['Small community (early stage)', 'No real blockchain transactions yet', 'PREMALTA no liquidity yet', 'No smart contracts on mainnet', 'Limited brand recognition', 'Single developer risk'] },
              { type: 'Opportunities 🚀', color: 'blue', items: ['Base ecosystem exploding ($12.6B TVL)', 'AI agent market growing 68% CAGR', 'Enterprise demand for AI automation', 'Virtuals Protocol model proves revenue', 'ETHDenver 2026 attention to AI agents', 'Indonesia Web3 market untapped'] },
              { type: 'Threats 🔴', color: 'amber', items: ['Virtuals Protocol scaling fast (11K agents)', 'Regulatory uncertainty (crypto laws)', 'Groq API rate limits / cost increase', 'Smart contract security risks', 'Market bear cycle risk', 'Competitor clone risk'] },
            ].map((s, i) => (
              <div key={i} className={`bg-${s.color}-500/10 border border-${s.color}-500/20 rounded-2xl p-4`}>
                <h4 className={`text-${s.color}-400 font-bold mb-3`}>{s.type}</h4>
                <ul className="space-y-1">
                  {s.items.map((item, j) => (
                    <li key={j} className="text-slate-300 text-xs flex gap-2">
                      <span>•</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          TAB: REVENUE MODEL
      ═══════════════════════════════════════════════════════ */}
      {activeTab === 'revenue' && (
        <div className="space-y-6">
          {/* Revenue Projection Chart */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-white font-bold mb-2">📈 Revenue Projection (12-Month)</h3>
            <p className="text-slate-400 text-xs mb-4">Base case scenario — assumes steady growth with 100+ pods deployed by M12</p>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueProjection}>
                <defs>
                  {[['pods', '#6366f1'], ['saas', '#10b981'], ['defi', '#f59e0b'], ['ai', '#8b5cf6']].map(([key, color]) => (
                    <linearGradient key={key} id={`g_${key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="pods" stroke="#6366f1" fill="url(#g_pods)" strokeWidth={2} name="Pod Sales" stackId="1" />
                <Area type="monotone" dataKey="saas" stroke="#10b981" fill="url(#g_saas)" strokeWidth={2} name="SaaS Sub" stackId="1" />
                <Area type="monotone" dataKey="defi" stroke="#f59e0b" fill="url(#g_defi)" strokeWidth={2} name="DeFi Yield" stackId="1" />
                <Area type="monotone" dataKey="ai" stroke="#8b5cf6" fill="url(#g_ai)" strokeWidth={2} name="AI Usage" stackId="1" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Streams Detail */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-white font-bold mb-4">💎 8 Revenue Streams — Detailed Breakdown</h3>
            <div className="space-y-3">
              {revenueStreams.map((r, i) => (
                <div key={i} className="bg-slate-800/60 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{r.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold text-sm">{r.stream}</span>
                        <span className="text-xs px-2 py-0.5 bg-slate-700 text-slate-300 rounded-full">{r.type}</span>
                      </div>
                      <p className="text-slate-400 text-xs mt-0.5">{r.mechanism}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-3 text-center">
                    {[
                      { label: 'Month 1', value: r.monthlyM1, color: 'text-slate-400' },
                      { label: 'Month 6', value: r.monthlyM6, color: 'text-amber-400' },
                      { label: 'Month 12', value: r.monthlyM12, color: 'text-emerald-400' },
                      { label: 'Month 24', value: r.monthlyM24, color: 'text-indigo-400' },
                    ].map((m, j) => (
                      <div key={j} className="bg-slate-900/60 rounded-lg p-2">
                        <p className={`font-bold text-sm ${m.color}`}>${(m.value / 1000).toFixed(0)}K</p>
                        <p className="text-slate-600 text-xs">{m.label}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-slate-500 text-xs mt-2 italic">{r.notes}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Income Scenarios */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-white font-bold mb-4">🎯 Income Scenarios (Conservative / Base / Bull)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {incomeScenarios.map((s, i) => (
                <div key={i} className="p-4 rounded-xl border" style={{ borderColor: s.color + '40', backgroundColor: s.color + '10' }}>
                  <h4 className="font-bold mb-3" style={{ color: s.color }}>{s.scenario} Case</h4>
                  <div className="space-y-2 mb-3">
                    {[
                      { label: 'Month 3', value: s.m3 },
                      { label: 'Month 6', value: s.m6 },
                      { label: 'Month 12', value: s.m12 },
                      { label: 'Month 24', value: s.m24 },
                    ].map((m, j) => (
                      <div key={j} className="flex justify-between text-xs">
                        <span className="text-slate-400">{m.label}</span>
                        <span className="font-bold text-white">${(m.value / 1000).toFixed(0)}K/mo</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-slate-700 pt-2">
                    <p className="text-xs font-bold text-slate-300">Year 1 ARR: <span style={{ color: s.color }}>${(s.annualY1 / 1000).toFixed(0)}K</span></p>
                    <p className="text-xs font-bold text-slate-300">Year 2 ARR: <span style={{ color: s.color }}>${(s.annualY2 / 1_000_000).toFixed(1)}M</span></p>
                  </div>
                  <ul className="mt-3 space-y-1">
                    {s.assumptions.map((a, j) => <li key={j} className="text-xs text-slate-500">• {a}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Token Price Projections */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-white font-bold mb-4">🚀 Token Price Projections ($HYPHA & $PREMALTA)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={tokenPriceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="quarter" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="HYPHA" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1', r: 3 }} name="$HYPHA Price" />
                <Line type="monotone" dataKey="PREMALTA" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 3 }} name="$PREMALTA Price" />
              </LineChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              {tokenPriceData.filter((_, i) => [0, 3, 4, 7].includes(i)).map((t, i) => (
                <div key={i} className="bg-slate-800 rounded-xl p-3">
                  <p className="text-slate-400 text-xs mb-1">{t.quarter}</p>
                  <p className="text-indigo-400 font-bold">HYPHA: ${t.HYPHA}</p>
                  <p className="text-emerald-400 font-bold">PREMALTA: ${t.PREMALTA}</p>
                  <p className="text-slate-500 text-xs">MCap: ${t.hyphaMarketCap}M</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          TAB: IMPLEMENTATION
      ═══════════════════════════════════════════════════════ */}
      {activeTab === 'implementation' && (
        <div className="space-y-6">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
            <p className="text-amber-400 font-bold">⚠️ Implementation Priority: Foundation first, scale second. Each phase unlocks the next revenue stream.</p>
          </div>

          {implementationPhases.map((phase, phaseIdx) => (
            <div key={phaseIdx} className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold">{phase.phase}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase bg-${phase.color}-500/20 text-${phase.color}-400 border border-${phase.color}-500/30`}>
                  {phase.status}
                </span>
              </div>
              <div className="space-y-3">
                {phase.steps.map((step, stepIdx) => (
                  <div key={stepIdx} className="flex items-start gap-3 p-3 bg-slate-800/60 rounded-xl">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      step.done ? 'bg-emerald-500 border-emerald-500' :
                      step.priority === 'CRITICAL' ? 'border-red-500' :
                      step.priority === 'HIGH' ? 'border-amber-500' : 'border-slate-600'
                    }`}>
                      {step.done && <span className="text-white text-xs">✓</span>}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-medium text-sm">{step.task}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${
                          step.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                          step.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-slate-700 text-slate-400'
                        }`}>{step.priority}</span>
                      </div>
                      <div className="flex gap-4 text-xs text-slate-400">
                        <span>⏱ {step.effort}</span>
                        <span>💰 {step.revenue}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          TAB: ROADMAP
      ═══════════════════════════════════════════════════════ */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          {/* Web3 Integration Roadmap */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-white font-bold mb-4">🗺️ Web3 Integration Roadmap — Step-by-Step</h3>
            <div className="space-y-4">
              {[
                {
                  phase: 'Step 1: Token Infrastructure', timeline: 'Week 1–2', status: 'CRITICAL',
                  web3Actions: [
                    'Fund wallet → 0.1 ETH Base network (gas costs)',
                    'Create PREMALTA/USDC Uniswap V3 pool (Base) — $500 initial',
                    'Lock LP tokens on Uncx.network (6 months minimum)',
                    'Verify PREMALTA contract on BaseScan (source code verification)',
                  ],
                  techStack: 'Uniswap V3 SDK + Base RPC (Alchemy) + Uncx.network',
                  revenue: '$0 → Enables price discovery'
                },
                {
                  phase: 'Step 2: Smart Contract Deployment', timeline: 'Week 3–6', status: 'HIGH',
                  web3Actions: [
                    'Deploy HYPHAToken.sol (ERC-20) to Ethereum Sepolia testnet',
                    'Deploy HYPHAStaking.sol (ERC-4626 vault) with 18.5% APY',
                    'Deploy HYPHAGovernor.sol (Governor Bravo) untuk DAO',
                    'Deploy HYPHATreasury.sol (Gnosis Safe 5/8 multisig)',
                    'Audit contracts dengan Slither/Mythril + manual review',
                    'Deploy all to mainnet setelah audit passed',
                  ],
                  techStack: 'Hardhat + OpenZeppelin + Etherscan verification',
                  revenue: 'Staking lock = supply reduction = price increase'
                },
                {
                  phase: 'Step 3: Real Wallet Integration', timeline: 'Week 4–6', status: 'HIGH',
                  web3Actions: [
                    'Implement wagmi + viem untuk MetaMask connection',
                    'Setup Web3Auth MPC dengan Google/Apple social login',
                    'Privy integration untuk email wallet creation',
                    'WalletConnect v2 untuk mobile wallets',
                    'ENS name resolution untuk user profiles',
                    'EIP-4337 Account Abstraction untuk gasless txns',
                  ],
                  techStack: 'wagmi v2 + viem + Web3Auth SDK + Privy SDK',
                  revenue: 'Real users = real transactions = real fees'
                },
                {
                  phase: 'Step 4: DeFi Protocol Integration', timeline: 'Month 2', status: 'MEDIUM',
                  web3Actions: [
                    'Real Uniswap V3 quotes via Quoter contract (ganti simulasi)',
                    'Aave V3 deposits untuk yield vault (4.8% APY base)',
                    'Chainlink price feed untuk ETH/USD, HYPHA/USDC real-time',
                    'The Graph custom subgraph untuk HYPHA token analytics',
                    'Compound V3 integration untuk lending yield',
                    'Auto-compound via Yearn/Beefy untuk higher APY',
                  ],
                  techStack: 'ethers.js + Uniswap SDK + Aave JS + Chainlink',
                  revenue: '2% mgmt + 20% performance fee on yield vault'
                },
                {
                  phase: 'Step 5: DAO & Cross-Chain', timeline: 'Month 3–4', status: 'PLANNED',
                  web3Actions: [
                    'Snapshot.org integration untuk off-chain voting (free)',
                    'Tally.xyz integration untuk on-chain governance UI',
                    'LayerZero bridge: HYPHA ETH ↔ Arbitrum ↔ Base',
                    'NFT Founder Pods mint contract (9,999 ERC-721)',
                    'Industry token contracts ($PROPRT, $BARBER, etc on Polygon/Base)',
                    'Farcaster Frames untuk pod marketplace social sharing',
                  ],
                  techStack: 'LayerZero SDK + OpenZeppelin ERC-721 + Snapshot API',
                  revenue: 'Bridge fee 0.3% + NFT mint 0.1 ETH + royalties'
                },
              ].map((step, i) => (
                <div key={i} className={`p-5 rounded-xl border ${
                  step.status === 'CRITICAL' ? 'border-red-500/30 bg-red-500/5' :
                  step.status === 'HIGH' ? 'border-amber-500/30 bg-amber-500/5' :
                  step.status === 'MEDIUM' ? 'border-blue-500/30 bg-blue-500/5' :
                  'border-slate-700 bg-slate-800/30'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-bold">{step.phase}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-xs">{step.timeline}</span>
                      <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                        step.status === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                        step.status === 'HIGH' ? 'bg-amber-500/20 text-amber-400' :
                        step.status === 'MEDIUM' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-slate-700 text-slate-400'
                      }`}>{step.status}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-slate-500 text-xs uppercase font-bold mb-2">Web3 Actions</p>
                      <ul className="space-y-1">
                        {step.web3Actions.map((a, j) => (
                          <li key={j} className="text-slate-300 text-xs flex gap-2">
                            <span className="text-indigo-400">→</span>{a}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs uppercase font-bold mb-2">Tech Stack</p>
                      <p className="text-cyan-400 text-xs font-mono bg-slate-900/60 p-2 rounded-lg">{step.techStack}</p>
                      <p className="text-slate-500 text-xs uppercase font-bold mt-3 mb-1">Revenue Impact</p>
                      <p className="text-emerald-400 text-xs">{step.revenue}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* KPI Targets */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-white font-bold mb-4">🎯 KPI Targets & Milestones</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-700">
                    {['KPI', 'Month 1', 'Month 3', 'Month 6', 'Month 12', 'Month 24'].map(h => (
                      <th key={h} className="text-slate-500 uppercase py-2 px-3 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { kpi: '💰 Monthly Revenue', m1: '$9.5K', m3: '$35K', m6: '$115K', m12: '$498K', m24: '$2M' },
                    { kpi: '🌿 HYPHA Holders', m1: '500', m3: '2K', m6: '10K', m12: '50K', m24: '200K' },
                    { kpi: '🔒 TVL (Staking+LP)', m1: '$50K', m3: '$200K', m6: '$1M', m12: '$5M', m24: '$50M' },
                    { kpi: '📦 Pods Deployed', m1: '20', m3: '150', m6: '500', m12: '2K', m24: '10K' },
                    { kpi: '👥 Monthly Active Users', m1: '500', m3: '2K', m6: '10K', m12: '50K', m24: '200K' },
                    { kpi: '💎 HYPHA Price', m1: '$0.20', m3: '$0.50', m6: '$1.00', m12: '$2.50', m24: '$10.00' },
                    { kpi: '🪙 PREMALTA Price', m1: '$0.01', m3: '$0.05', m6: '$0.15', m12: '$0.50', m24: '$2.00' },
                    { kpi: '🔄 DEX Volume/Day', m1: '$5K', m3: '$25K', m6: '$100K', m12: '$500K', m24: '$2M' },
                    { kpi: '🏢 Enterprise Clients', m1: '0', m3: '2', m6: '10', m12: '30', m24: '100' },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-slate-800/60 hover:bg-slate-800/30">
                      <td className="py-2 px-3 text-white font-medium">{row.kpi}</td>
                      <td className="py-2 px-3 text-slate-500">{row.m1}</td>
                      <td className="py-2 px-3 text-amber-400">{row.m3}</td>
                      <td className="py-2 px-3 text-emerald-400">{row.m6}</td>
                      <td className="py-2 px-3 text-indigo-400">{row.m12}</td>
                      <td className="py-2 px-3 text-purple-400">{row.m24}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          TAB: EXECUTION
      ═══════════════════════════════════════════════════════ */}
      {activeTab === 'execution' && (
        <div className="space-y-6">
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
            <p className="text-indigo-300 font-bold">🚀 Real-World Execution Steps — Konkret, Actionable, dengan Cost & Impact yang Jelas</p>
            <p className="text-slate-400 text-sm mt-1">Ini bukan teori. Ini adalah langkah yang perlu dieksekusi hari ini, minggu ini, dan bulan ini.</p>
          </div>

          {executionSteps.map((cat, catIdx) => (
            <div key={catIdx} className={`bg-slate-900 border rounded-2xl p-6 ${
              cat.urgency === 'critical' ? 'border-red-500/40' :
              cat.urgency === 'high' ? 'border-amber-500/40' :
              cat.urgency === 'medium' ? 'border-blue-500/40' : 'border-slate-700'
            }`}>
              <h3 className={`font-bold text-lg mb-4 ${
                cat.urgency === 'critical' ? 'text-red-400' :
                cat.urgency === 'high' ? 'text-amber-400' :
                cat.urgency === 'medium' ? 'text-blue-400' : 'text-slate-300'
              }`}>{cat.category}</h3>
              <div className="space-y-3">
                {cat.steps.map((step, stepIdx) => (
                  <div key={stepIdx} className="flex items-start gap-4 p-4 bg-slate-800/60 rounded-xl">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                      cat.urgency === 'critical' ? 'bg-red-600' :
                      cat.urgency === 'high' ? 'bg-amber-600' :
                      cat.urgency === 'medium' ? 'bg-blue-600' : 'bg-slate-700'
                    }`}>{stepIdx + 1}</div>
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{step.action}</p>
                      <div className="flex gap-4 mt-2">
                        <div className="flex items-center gap-1">
                          <span className="text-slate-500 text-xs">💰 Cost:</span>
                          <span className="text-amber-400 text-xs font-bold">{step.cost}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-slate-500 text-xs">⚡ Impact:</span>
                          <span className="text-emerald-400 text-xs">{step.impact}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* ROI Summary */}
          <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-2xl p-6">
            <h3 className="text-indigo-300 font-bold text-lg mb-4">💎 ROI Summary — Investment vs. Expected Returns</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-bold mb-3">Total Investment Required (Year 1)</h4>
                <div className="space-y-2">
                  {[
                    { item: 'ETH untuk gas fees (ongoing)', cost: '$200–500', priority: 'MUST' },
                    { item: 'PREMALTA liquidity pool initial', cost: '$500', priority: 'MUST' },
                    { item: 'Smart contract audit (Slither+manual)', cost: '$500–2,000', priority: 'HIGH' },
                    { item: 'Part-time Solidity dev (Upwork)', cost: '$2,000–5,000', priority: 'HIGH' },
                    { item: 'Community growth (marketing)', cost: '$1,000–3,000', priority: 'MEDIUM' },
                    { item: 'CEX listing fees', cost: '$2,000–10,000', priority: 'MEDIUM' },
                    { item: 'Legal (Wyoming DAO LLC)', cost: '$500', priority: 'MEDIUM' },
                    { item: 'KOL partnerships (1–2)', cost: '$1,000–3,000', priority: 'MEDIUM' },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-1 border-b border-slate-800/40">
                      <span className="text-slate-300 text-sm">{item.item}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-1.5 py-0.5 rounded ${item.priority === 'MUST' ? 'bg-red-500/20 text-red-400' : item.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700 text-slate-400'}`}>{item.priority}</span>
                        <span className="text-white font-bold text-sm">{item.cost}</span>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-white font-black">TOTAL INVESTMENT</span>
                    <span className="text-amber-400 font-black text-lg">$7,700–24,000</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-white font-bold mb-3">Expected Returns (Base Case)</h4>
                <div className="space-y-3">
                  {[
                    { period: 'Month 3', revenue: '$35K/mo', total: '$70K', roi: '3–9×' },
                    { period: 'Month 6', revenue: '$115K/mo', total: '$380K', roi: '16–49×' },
                    { period: 'Month 12', revenue: '$498K/mo', total: '$2.1M ARR', roi: '88–272×' },
                    { period: 'Month 24', revenue: '$1.8M/mo', total: '$18M+ ARR', roi: '750×+' },
                  ].map((r, i) => (
                    <div key={i} className="p-3 bg-slate-800/60 rounded-xl flex justify-between items-center">
                      <div>
                        <p className="text-white font-bold">{r.period}</p>
                        <p className="text-slate-400 text-xs">{r.revenue}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-emerald-400 font-bold">{r.total}</p>
                        <p className="text-indigo-400 text-xs">ROI: {r.roi}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <p className="text-emerald-400 font-bold">Key Insight</p>
                  <p className="text-slate-300 text-sm mt-1">
                    Investment $7.7K–$24K untuk potensi $498K/mo di Month 12 = ROI 20–60× dalam satu tahun. 
                    Dengan bull case ($1.2M/mo M12), ROI bisa 50–150×.
                    <span className="text-emerald-400 font-bold"> Platform sudah 80% siap — butuh eksekusi, bukan lebih banyak coding.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Critical Success Factors */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-white font-bold mb-4">🏆 Critical Success Factors (CSF) — Yang Menentukan Segalanya</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { csf: 'Community First', priority: 1, desc: 'Tanpa community, tidak ada demand. Twitter/TG/Discord harus aktif HARI INI. Target: 1K followers dalam 30 hari.', action: 'Post 3 threads/week + daily updates' },
                { csf: 'Liquidity is King', priority: 2, desc: 'PREMALTA tidak bisa berkembang tanpa DEX liquidity. $500 cukup untuk mulai. Lock LP 6 bulan = trust signal.', action: 'Buat PREMALTA/USDC pool minggu ini' },
                { csf: 'Real Revenue (Not Just Tokens)', priority: 3, desc: 'SaaS subscription $19–$499/mo jauh lebih valuable dari token speculation. Target 20 paying customers M3.', action: 'B2B outreach: DM 10 businesses/week' },
                { csf: 'Smart Contract Audit', priority: 4, desc: 'Satu bug = reputasi hancur. Gunakan OpenZeppelin templates + Slither static analysis sebelum mainnet.', action: 'Audit sebelum mainnet deployment' },
                { csf: 'Content Marketing', priority: 5, desc: '"Build in public" strategy. Document setiap milestone: pool created, holders milestone, revenue update, tech demos.', action: 'Daily/weekly build-in-public posts' },
                { csf: 'Data-Driven Optimization', priority: 6, desc: 'Use LangSmith untuk monitor AI costs, Alchemy Webhooks untuk on-chain events, Supabase analytics untuk user behavior.', action: 'Setup monitoring dashboards' },
              ].map((csf, i) => (
                <div key={i} className="p-4 bg-slate-800/60 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-xs font-black text-white">{csf.priority}</span>
                    <h4 className="text-white font-bold">{csf.csf}</h4>
                  </div>
                  <p className="text-slate-400 text-xs mb-2">{csf.desc}</p>
                  <p className="text-emerald-400 text-xs font-bold">→ {csf.action}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StrategyCenter;
