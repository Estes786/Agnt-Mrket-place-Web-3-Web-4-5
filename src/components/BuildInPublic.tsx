
// ============================================================
// GANI HYPHA — Build In Public Command Center v1.0
// SECRET ROADMAP: Acquisition Channels + Content Strategy
// Persona: Builder bukan sekedar promotor. Show magic, hide tricks.
// "Gyss! Akar Dalam, Cabang Tinggi" 🙏🏻
// ============================================================

import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// ─── GAP ANALYSIS — Apa yang masih MOCK/belum REAL ───────────
const GAP_ANALYSIS = [
  {
    area: 'Wallet Connection',
    current: 'FAKE — Math.random() address, no real MetaMask',
    impact: 'CRITICAL',
    fix: 'Integrate wagmi + viem library, real MetaMask/WalletConnect',
    effort: '2 minggu',
    revenue: 'Unlock real on-chain tx → real fees',
    priority: 1,
    color: '#ef4444'
  },
  {
    area: 'PREMALTA Liquidity',
    current: 'Token deployed tapi 0 liquidity = tidak bisa trade',
    impact: 'CRITICAL',
    fix: 'Add $500 PREMALTA/USDC pool di Uniswap V3 Base',
    effort: '1 hari (butuh $500)',
    revenue: 'Token tradeable → price discovery → holder growth',
    priority: 2,
    color: '#ef4444'
  },
  {
    area: 'Supabase Database',
    current: 'MOCK — tidak ada persistent user data',
    impact: 'HIGH',
    fix: 'Setup Supabase project, real auth, real data tables',
    effort: '3 hari',
    revenue: 'Track SaaS subscribers, real revenue dashboard',
    priority: 3,
    color: '#f59e0b'
  },
  {
    area: 'Payment System',
    current: 'TIDAK ADA — tidak bisa terima pembayaran',
    impact: 'CRITICAL',
    fix: 'Stripe (fiat) + USDC direct (crypto) untuk SaaS plans',
    effort: '1 minggu',
    revenue: 'LANGSUNG enable $19-$999/mo revenue',
    priority: 4,
    color: '#ef4444'
  },
  {
    area: 'Pod Deployment',
    current: 'SIMULATED — timer + random logs, tidak ada real AI',
    impact: 'HIGH',
    fix: 'Real Groq call saat deploy, real webhook pada action',
    effort: '1 minggu',
    revenue: 'Demonstrasi real value → konversi lebih tinggi',
    priority: 5,
    color: '#f59e0b'
  },
  {
    area: 'DAO Voting',
    current: 'SIMULATED — vote tidak disimpan ke mana pun',
    impact: 'MEDIUM',
    fix: 'Supabase table untuk votes + snapshot.org integration',
    effort: '1 minggu',
    revenue: 'Trust building → governance token value',
    priority: 6,
    color: '#06b6d4'
  },
  {
    area: 'DeFi Swap',
    current: 'SIMULATED via Alchemy SDK — tidak real swap',
    impact: 'MEDIUM',
    fix: '0x Protocol / Uniswap SDK untuk real swap',
    effort: '2 minggu',
    revenue: 'Protocol fees dari real volume',
    priority: 7,
    color: '#06b6d4'
  },
  {
    area: 'IPFS Pinning',
    current: 'Pinata configured tapi UI hanya simulasi',
    impact: 'LOW',
    fix: 'Real pinJSONToIPFS call saat deploy pod',
    effort: '3 hari',
    revenue: 'Real decentralized storage proof',
    priority: 8,
    color: '#10b981'
  },
  {
    area: 'Blockchain Metrics',
    current: 'Math.random() untuk block numbers, latency, dsb',
    impact: 'MEDIUM',
    fix: 'Real Alchemy RPC calls untuk live data',
    effort: '3 hari',
    revenue: 'Trust & credibility → retention',
    priority: 9,
    color: '#06b6d4'
  },
  {
    area: 'AI Chat (GANI)',
    current: 'Groq CONFIGURED tapi fallback ke simulasi jika key expired',
    impact: 'HIGH',
    fix: 'Ensure GROQ key di .dev.vars + CF env vars, no fallback',
    effort: '1 hari',
    revenue: 'Core differentiator: real AI = real value',
    priority: 10,
    color: '#f59e0b'
  }
];

// ─── BUILD IN PUBLIC CONTENT CALENDAR ─────────────────────────
const CONTENT_CALENDAR = [
  {
    week: 'Minggu 1',
    theme: 'ORIGIN STORY',
    content: [
      { platform: 'Twitter/X', type: 'Thread', title: 'Why I\'m building GANI HYPHA in public (honest story)', hook: 'I have 0 followers, 0 capital, but I have a platform running on Cloudflare with real API integrations. Thread 🧵', status: 'DRAFT' },
      { platform: 'GitHub', type: 'Public Repo', title: 'Make repo public + add detailed README', hook: 'Stars = social proof', status: 'DONE' },
      { platform: 'Paragraph.com', type: 'Article', title: 'Building a Web3 AI Marketplace with $0 capital: Week 1', hook: 'Honest. Vulnerable. Technical.', status: 'TODO' }
    ]
  },
  {
    week: 'Minggu 2',
    theme: 'SHOW THE BUILD',
    content: [
      { platform: 'Twitter/X', type: 'Demo Video', title: 'Live demo: GANI HYPHA AI pod deployment (30 detik)', hook: 'No pitch. Just show the product working.', status: 'TODO' },
      { platform: 'TikTok/Reels', type: 'Short Video', title: 'Building a Web3 startup with no money - Day 1', hook: 'Personal, raw, relatable', status: 'TODO' },
      { platform: 'Telegram', type: 'Community', title: 'Launch GANI HYPHA Telegram group', hook: 'First 100 members = founding community', status: 'TODO' }
    ]
  },
  {
    week: 'Minggu 3',
    theme: 'TECHNICAL DEPTH',
    content: [
      { platform: 'Twitter/X', type: 'Thread', title: 'How I built a Web3+AI platform on Cloudflare Workers in 2 weeks', hook: 'Technical thread. Dev Twitter loves this.', status: 'TODO' },
      { platform: 'YouTube', type: 'Video', title: 'Full tutorial: Deploy AI agent pod on GANI HYPHA', hook: 'SEO: "AI agent deployment tutorial"', status: 'TODO' },
      { platform: 'Reddit', type: 'Post', title: 'r/webdev + r/cryptomoonshots - Show HN style post', hook: 'Honest feedback. Potential viral.', status: 'TODO' }
    ]
  },
  {
    week: 'Minggu 4',
    theme: 'FIRST CUSTOMERS',
    content: [
      { platform: 'Twitter/X', type: 'Milestone Post', title: 'We got our first 10 SaaS customers! Revenue: $XXX/mo', hook: 'People love watching the journey', status: 'TODO' },
      { platform: 'LinkedIn', type: 'Article', title: 'Why I chose Cloudflare over AWS for my Web3 startup', hook: 'Enterprise audience. B2B leads.', status: 'TODO' },
      { platform: 'Product Hunt', type: 'Launch', title: 'GANI HYPHA: AI Agent Marketplace for Web3', hook: 'Official launch day', status: 'TODO' }
    ]
  }
];

// ─── ACQUISITION CHANNELS (PRIVATE STRATEGY) ─────────────────
const ACQUISITION_CHANNELS = [
  {
    channel: 'Twitter/X (Build in Public)',
    type: 'Organic',
    priority: 'TIER 1',
    cac: '$0',
    timeline: 'Month 1-6',
    ltv: 'High',
    strategy: 'Daily tweets about building. Show metrics. Honest failures. Technical insights.',
    metrics: { followers: 0, target: 10000, monthlyLeads: '50-200' },
    tactics: [
      'Tweet product screenshots setiap 2-3 hari',
      'Reply ke @levelsio, @marc_lou, @tibo_maker (indie hackers)',
      'Use hooks: "I built X in Y days with $0"',
      'Share weekly revenue numbers (even if $0)',
      'Threads on: Web3 AI, Cloudflare Workers, token launches'
    ],
    color: '#1d9bf0'
  },
  {
    channel: 'GitHub Public Repo',
    type: 'Developer',
    priority: 'TIER 1',
    cac: '$0',
    timeline: 'Month 1+',
    ltv: 'High',
    strategy: 'Open source beberapa komponen. Stars = credibility. Issues = engagement.',
    metrics: { stars: 0, target: 500, monthlyLeads: '20-100' },
    tactics: [
      'Good README dengan demo GIF',
      'Contribution guidelines yang jelas',
      'Post di Hacker News "Show HN"',
      'Submit ke awesome-cloudflare, awesome-web3 lists',
      'Regular commits = aktif = trust'
    ],
    color: '#333'
  },
  {
    channel: 'Crypto Twitter / KOL',
    type: 'Community',
    priority: 'TIER 1',
    cac: '$0-50',
    timeline: 'Month 1-3',
    ltv: 'Very High',
    strategy: 'Engage di threads Web3 AI. Tag proyek saat relevant. DM kolaborasi kecil.',
    metrics: { engaged: 0, target: 50, monthlyLeads: '100-500' },
    tactics: [
      'Reply ke Virtuals Protocol, SingularityNET threads',
      'Post $PREMALTA contract address saat launch pool',
      'Alpha leak strategi di private group',
      'Kolaborasi dengan micro-KOL (1K-10K followers)',
      'Join trending CT conversations tentang AI+Web3'
    ],
    color: '#f59e0b'
  },
  {
    channel: 'Product Hunt',
    type: 'Launch',
    priority: 'TIER 2',
    cac: '$0',
    timeline: 'Month 2-3',
    ltv: 'Medium',
    strategy: 'Single launch event. Prepare 2 minggu sebelumnya. Hunter yang bagus.',
    metrics: { upvotes: 0, target: 200, monthlyLeads: '500-2000' },
    tactics: [
      'Find good hunter dengan 5K+ followers',
      'Post Jumat pagi WIB (optimal time)',
      'Prepare 50 supporters sebelum launch',
      'Demo video 60 detik maksimal',
      'Respond semua comments dalam 24 jam'
    ],
    color: '#ff6154'
  },
  {
    channel: 'B2B Direct Outreach',
    type: 'Sales',
    priority: 'TIER 2',
    cac: '$50-200',
    timeline: 'Month 2+',
    ltv: 'Very High ($5K+)',
    strategy: 'DM ke barber shops, real estate agents, content creators. Tawarkan free trial.',
    metrics: { dmSent: 0, target: 500, monthlyLeads: '10-50' },
    tactics: [
      'DM 10 barbershop per minggu via Instagram',
      'Cold email 20 realtors per minggu',
      'LinkedIn outreach ke enterprise decision makers',
      'Offer: "Free 1 month trial, no credit card"',
      'Case study setelah client pertama berhasil'
    ],
    color: '#10b981'
  },
  {
    channel: 'Paragraph.com / Mirror.xyz',
    type: 'Content',
    priority: 'TIER 2',
    cac: '$0',
    timeline: 'Month 1+',
    ltv: 'Medium-High',
    strategy: 'Long-form articles tentang Web3 AI journey. $PREMALTA subscriber rewards.',
    metrics: { subscribers: 0, target: 1000, monthlyLeads: '30-150' },
    tactics: [
      'Weekly blog post tentang build progress',
      'Gate premium content dengan PREMALTA token',
      'Cross-post ke substack / beehiiv',
      'SEO articles: "Web3 AI agent", "deploy token on Base"',
      'Build email list dari subscribers'
    ],
    color: '#8b5cf6'
  },
  {
    channel: 'Reddit (r/webdev, r/crypto, r/SaaS)',
    type: 'Community',
    priority: 'TIER 3',
    cac: '$0',
    timeline: 'Month 1-2',
    ltv: 'Low-Medium',
    strategy: 'Show HN style posts. Be honest. No spam. Add value first.',
    metrics: { upvotes: 0, target: 500, monthlyLeads: '20-100' },
    tactics: [
      '"I built X" post format selalu viral',
      'r/cryptomoonshots untuk $PREMALTA',
      'r/SaaS untuk SaaS angle',
      'r/webdev untuk technical angle',
      'Engage komentar selama 24 jam setelah post'
    ],
    color: '#ff4500'
  },
  {
    channel: 'YouTube / TikTok',
    type: 'Video',
    priority: 'TIER 3',
    cac: '$0',
    timeline: 'Month 2-4',
    ltv: 'High',
    strategy: 'Tutorial videos. Build in public vlogs. Crypto education.',
    metrics: { subscribers: 0, target: 5000, monthlyLeads: '50-300' },
    tactics: [
      '"Building a Web3 startup" series',
      'Tutorial: Deploy AI agent step by step',
      'Face-cam + screen record (personal brand)',
      'Bahasa Indonesia + English subtitles',
      'Leverage platform algo dengan consistency'
    ],
    color: '#ff0000'
  }
];

// ─── PHASE ROADMAP ─────────────────────────────────────────────
const PHASE_ROADMAP = [
  {
    phase: 'PHASE 0',
    title: 'Foundation Fix',
    duration: 'Minggu 1-2',
    status: 'NOW',
    color: '#ef4444',
    goals: ['Fix semua mock → real (Groq, Alchemy live data)', 'Setup .dev.vars dengan semua API keys', 'Add PREMALTA liquidity pool ($500)', 'Setup Supabase real credentials'],
    kpi: { users: 0, revenue: '$0', posts: 2, focus: 'Product ready' }
  },
  {
    phase: 'PHASE 1',
    title: 'Build in Public Launch',
    duration: 'Minggu 3-6',
    status: 'NEXT',
    color: '#f59e0b',
    goals: ['Launch Twitter/X thread pertama (origin story)', 'Post Product Hunt campaign setup', 'First 100 GitHub stars', 'First 10 paying customers ($19/mo Starter)'],
    kpi: { users: 100, revenue: '$190', posts: 20, focus: 'Audience building' }
  },
  {
    phase: 'PHASE 2',
    title: 'Community & Token',
    duration: 'Bulan 2-3',
    status: 'PLANNED',
    color: '#8b5cf6',
    goals: ['1K Twitter followers', 'Telegram group 500 members', 'PREMALTA active trading', '50 SaaS customers ($4,950/mo)'],
    kpi: { users: 500, revenue: '$5K', posts: 60, focus: 'Community flywheel' }
  },
  {
    phase: 'PHASE 3',
    title: 'Scale & Enterprise',
    duration: 'Bulan 4-6',
    status: 'PLANNED',
    color: '#10b981',
    goals: ['Product Hunt launch (#1 of the day)', '10K Twitter followers', '200 SaaS customers', 'First enterprise deal ($5K+/mo)', 'Deploy $HYPHA + $PROPRT tokens'],
    kpi: { users: 2000, revenue: '$50K', posts: 120, focus: 'Revenue scale' }
  },
  {
    phase: 'PHASE 4',
    title: 'Token + CEX',
    duration: 'Bulan 7-12',
    status: 'VISION',
    color: '#06b6d4',
    goals: ['MEXC listing ($HYPHA)', '50K Twitter followers', '10K active platform users', 'VC interest / angel round', '$500K ARR'],
    kpi: { users: 10000, revenue: '$500K', posts: 250, focus: 'Hypergrowth' }
  }
];

// ─── PERSONA GUIDE ─────────────────────────────────────────────
const PERSONA_GUIDE = {
  identity: 'Builder × Visionary × Founder',
  NOT: ['Promotor/pump token', 'Crypto influencer biasa', 'Hype machine', 'Beg for follows'],
  BE: ['Transparent builder', 'Technical expert yang accessible', 'Show progress honestly', 'Teach while building'],
  voice: {
    en: 'Direct, technical, honest. "I built this. Here\'s what worked and what didn\'t."',
    id: 'Gaul tapi substantif. "Gyss ini yang gw build minggu ini, gagal di sini, berhasil di sana."'
  },
  pillars: [
    { name: 'Build Progress', pct: '40%', desc: 'Screenshots, metrics, code snippets, deployments' },
    { name: 'Technical Insights', pct: '30%', desc: 'How I did X, why I chose Y, lessons from Z' },
    { name: 'Business Transparency', pct: '20%', desc: 'Revenue numbers, challenges, pivots' },
    { name: 'Community', pct: '10%', desc: 'Reply, engage, collaborate' }
  ],
  philosophy: '"Show the magic. Hide the tricks." — Tampilkan hasil impressive tanpa reveal semua infrastructure secrets. Audience melihat platform canggih, bukan kode di balik layar.',
  disclaimer: 'Kamu adalah VibeCoder / Orchestrator bukan developer tradisional. Platform ini dibangun dengan AI assistance. Itu KEKUATAN bukan kelemahan. Build in public tentang visi dan eksekusi.'
};

// ─── GROWTH DATA ───────────────────────────────────────────────
const generateGrowthData = () =>
  Array.from({ length: 12 }).map((_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    followers: Math.floor(50 * Math.pow(1.8, i)),
    customers: Math.floor(2 * Math.pow(2.1, i)),
    revenue: Math.floor(38 * Math.pow(2.0, i))
  }));

const BuildInPublic: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'gaps' | 'channels' | 'roadmap' | 'content' | 'persona'>('overview');
  const [selectedPhase, setSelectedPhase] = useState(0);
  const [checkedGaps, setCheckedGaps] = useState<Set<number>>(new Set());
  const growthData = generateGrowthData();

  const criticalGaps = GAP_ANALYSIS.filter(g => g.impact === 'CRITICAL');
  const highGaps = GAP_ANALYSIS.filter(g => g.impact === 'HIGH');

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">

      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <div className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-500/20 mb-3">
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping"></span>
            Build In Public · Secret Blueprint
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Build In Public HQ 🏗️</h1>
          <p className="text-slate-400 text-sm mt-1">
            Gap Analysis · Acquisition Channels · Content Strategy · Secret Roadmap. Gyss! 🙏🏻
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-orange-400">{criticalGaps.length}</div>
          <div className="text-[9px] text-slate-500 uppercase tracking-widest">Critical Gaps</div>
        </div>
      </div>

      {/* ── Critical Alert ── */}
      {criticalGaps.length > 0 && (
        <div className="glass rounded-2xl p-4 border border-red-500/30 bg-red-500/5">
          <div className="flex items-start gap-3">
            <div className="text-xl">🚨</div>
            <div>
              <div className="text-xs font-black text-red-400 uppercase tracking-widest mb-1">
                {criticalGaps.length} CRITICAL GAPS — Platform belum production-ready!
              </div>
              <div className="flex flex-wrap gap-2">
                {criticalGaps.map(g => (
                  <span key={g.area} className="bg-red-500/10 border border-red-500/20 text-red-300 text-[9px] px-2 py-0.5 rounded font-black">
                    ⚠️ {g.area}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Tabs ── */}
      <div className="flex gap-2 border-b border-slate-800/60 pb-4 overflow-x-auto scrollbar-hide">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'gaps', label: 'Gap Analysis', icon: '🔍' },
          { id: 'channels', label: 'Acquisition', icon: '📡' },
          { id: 'roadmap', label: 'Secret Roadmap', icon: '🗺️' },
          { id: 'content', label: 'Content Plan', icon: '✍️' },
          { id: 'persona', label: 'Persona Guide', icon: '🎭' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-orange-600/20 border border-orange-500/40 text-orange-400'
                : 'text-slate-500 hover:text-slate-300 border border-transparent hover:border-slate-800'
            }`}>
            <span>{tab.icon}</span>{tab.label}
          </button>
        ))}
      </div>

      {/* ══════════════ OVERVIEW ══════════════ */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Critical Gaps', value: criticalGaps.length.toString(), sub: 'fix immediately', color: 'red', icon: '🚨' },
              { label: 'High Gaps', value: highGaps.length.toString(), sub: 'fix this week', color: 'yellow', icon: '⚠️' },
              { label: 'Acq. Channels', value: ACQUISITION_CHANNELS.length.toString(), sub: 'identified', color: 'blue', icon: '📡' },
              { label: 'Phase Timeline', value: '12 mo', sub: 'to $500K ARR', color: 'emerald', icon: '🎯' }
            ].map(s => (
              <div key={s.label} className={`glass rounded-2xl p-4 border border-${s.color}-500/20`}>
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className={`text-3xl font-black text-${s.color}-400`}>{s.value}</div>
                <div className="text-[10px] font-black text-white uppercase tracking-widest">{s.label}</div>
                <div className="text-[9px] text-slate-500 mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Growth Projection */}
          <div className="glass rounded-2xl p-5 border border-slate-800/60">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4">
              📈 Growth Projection — Followers × Customers × Revenue (12 months)
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="followerGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1d9bf0" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1d9bf0" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 9 }} />
                <YAxis tick={{ fill: '#475569', fontSize: 9 }} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12 }}
                  labelStyle={{ color: '#94a3b8', fontSize: 10 }} />
                <Area type="monotone" dataKey="followers" stroke="#1d9bf0" fill="url(#followerGrad)" strokeWidth={2} name="Followers" />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="url(#revenueGrad)" strokeWidth={2} name="Revenue ($)" />
                <Area type="monotone" dataKey="customers" stroke="#f59e0b" fill="none" strokeWidth={1.5} strokeDasharray="4 4" name="Customers" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* The 4 Pillars */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '🔧', title: 'Fix the Real', desc: 'Replace semua mock dengan real functionality. Public tidak mau simulasi.', color: 'red' },
              { icon: '📣', title: 'Show the Build', desc: 'Build in Public = daily sharing. Show produk, show metrics, show struggles.', color: 'blue' },
              { icon: '💰', title: 'Generate Revenue', desc: 'First dollar matters lebih dari 1M followers. $19/mo × 10 customers = proof.', color: 'emerald' },
              { icon: '🪙', title: 'Token Flywheel', desc: 'Revenue dari SaaS → fund token liquidity → holders → community → more customers.', color: 'purple' }
            ].map(p => (
              <div key={p.title} className={`glass rounded-2xl p-4 border border-${p.color}-500/20 bg-${p.color}-500/5`}>
                <div className="text-2xl mb-2">{p.icon}</div>
                <div className={`text-xs font-black text-${p.color}-400 uppercase tracking-widest mb-1`}>{p.title}</div>
                <p className="text-[10px] text-slate-400 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════ GAP ANALYSIS ══════════════ */}
      {activeTab === 'gaps' && (
        <div className="space-y-3">
          <div className="text-xs text-slate-500 font-mono mb-4">
            ⚡ {checkedGaps.size}/{GAP_ANALYSIS.length} gaps resolved. Public hanya percaya platform yang REAL, bukan simulasi.
          </div>
          {GAP_ANALYSIS.sort((a, b) => a.priority - b.priority).map((gap, idx) => (
            <div key={gap.area}
              className={`glass rounded-2xl p-5 border transition-all ${
                checkedGaps.has(idx) ? 'border-emerald-500/30 opacity-60' :
                gap.impact === 'CRITICAL' ? 'border-red-500/30 bg-red-500/5' :
                gap.impact === 'HIGH' ? 'border-yellow-500/20' : 'border-slate-800/60'
              }`}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => setCheckedGaps(prev => {
                    const next = new Set(prev);
                    next.has(idx) ? next.delete(idx) : next.add(idx);
                    return next;
                  })}
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    checkedGaps.has(idx)
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-slate-600 hover:border-slate-400'
                  }`}
                >
                  {checkedGaps.has(idx) && <span className="text-xs">✓</span>}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="text-xs font-black text-white">{gap.area}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border ${
                      gap.impact === 'CRITICAL' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                      gap.impact === 'HIGH' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' :
                      'bg-blue-500/10 border-blue-500/30 text-blue-400'
                    }`}>{gap.impact}</span>
                    <span className="bg-slate-800 px-2 py-0.5 rounded text-[9px] text-slate-400 font-mono">
                      Effort: {gap.effort}
                    </span>
                  </div>
                  <div className="text-[10px] text-red-300 font-mono mb-2">❌ NOW: {gap.current}</div>
                  <div className="text-[10px] text-emerald-300 font-mono mb-2">✅ FIX: {gap.fix}</div>
                  <div className="text-[10px] text-indigo-300 font-mono">💰 IMPACT: {gap.revenue}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ══════════════ ACQUISITION CHANNELS ══════════════ */}
      {activeTab === 'channels' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-500 font-mono mb-2">
            🎯 Ordered by TIER. Start Tier 1 dulu, baru expand ke Tier 2-3. Focus beats scatter.
          </div>
          {ACQUISITION_CHANNELS.map(ch => (
            <div key={ch.channel} className="glass rounded-2xl p-5 border border-slate-800/60 hover:border-slate-700/60 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ background: ch.color }} />
                  <div>
                    <div className="text-sm font-black text-white">{ch.channel}</div>
                    <div className="text-[9px] text-slate-500 font-mono">{ch.type} · CAC: {ch.cac} · LTV: {ch.ltv}</div>
                  </div>
                </div>
                <div className={`px-2 py-0.5 rounded-full text-[9px] font-black border ${
                  ch.priority === 'TIER 1' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                  ch.priority === 'TIER 2' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' :
                  'bg-slate-700/40 border-slate-600/40 text-slate-400'
                }`}>{ch.priority}</div>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed mb-3">{ch.strategy}</p>
              <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                <div className="glass rounded-xl p-2 border border-slate-800/60">
                  <div className="text-xs font-black text-white">{ch.metrics.target.toLocaleString()}</div>
                  <div className="text-[8px] text-slate-600 uppercase">Target</div>
                </div>
                <div className="glass rounded-xl p-2 border border-slate-800/60">
                  <div className="text-xs font-black text-emerald-400">{ch.metrics.monthlyLeads}</div>
                  <div className="text-[8px] text-slate-600 uppercase">Mo Leads</div>
                </div>
                <div className="glass rounded-xl p-2 border border-slate-800/60">
                  <div className="text-xs font-black text-indigo-400">{ch.timeline}</div>
                  <div className="text-[8px] text-slate-600 uppercase">Timeline</div>
                </div>
              </div>
              <div className="space-y-1">
                {ch.tactics.map((t, i) => (
                  <div key={i} className="flex items-start gap-2 text-[10px] text-slate-400">
                    <span className="text-slate-600 shrink-0">{i + 1}.</span>
                    {t}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ══════════════ SECRET ROADMAP ══════════════ */}
      {activeTab === 'roadmap' && (
        <div className="space-y-4">
          {/* Phase selector */}
          <div className="flex gap-2 flex-wrap">
            {PHASE_ROADMAP.map((p, i) => (
              <button key={p.phase} onClick={() => setSelectedPhase(i)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                  selectedPhase === i
                    ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-400'
                    : 'border-slate-800 text-slate-500 hover:border-slate-700'
                }`}
              >
                {p.phase}: {p.title}
              </button>
            ))}
          </div>

          {/* Phase detail */}
          {(() => {
            const p = PHASE_ROADMAP[selectedPhase];
            return (
              <div className="glass rounded-2xl p-6 border border-slate-800/60 animate-in fade-in duration-300">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-3 h-full rounded-full self-stretch" style={{ background: p.color, minHeight: 48, width: 4 }} />
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-black text-white">{p.phase}: {p.title}</h2>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border ${
                        p.status === 'NOW' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                        p.status === 'NEXT' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' :
                        p.status === 'PLANNED' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                        'bg-purple-500/10 border-purple-500/30 text-purple-400'
                      }`}>{p.status}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">⏱️ {p.duration}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">🎯 Goals</div>
                    <div className="space-y-2">
                      {p.goals.map(g => (
                        <div key={g} className="flex items-start gap-2 text-[11px] text-slate-300">
                          <span style={{ color: p.color }}>▶</span>
                          {g}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Users', value: p.kpi.users.toLocaleString(), icon: '👥' },
                      { label: 'Revenue', value: p.kpi.revenue, icon: '💰' },
                      { label: 'Posts', value: p.kpi.posts.toString(), icon: '✍️' },
                      { label: 'Focus', value: p.kpi.focus, icon: '🎯' }
                    ].map(k => (
                      <div key={k.label} className="glass rounded-xl p-3 border border-slate-800/60 text-center">
                        <div className="text-lg mb-1">{k.icon}</div>
                        <div className="text-sm font-black text-white">{k.value}</div>
                        <div className="text-[8px] text-slate-500 uppercase">{k.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Full timeline bar */}
          <div className="glass rounded-2xl p-5 border border-slate-800/60">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">12-Month Timeline Overview</div>
            <div className="space-y-3">
              {PHASE_ROADMAP.map(p => (
                <div key={p.phase} className="flex items-center gap-3">
                  <div className="w-20 text-[9px] font-black text-slate-400 uppercase">{p.phase.split(' ')[1]}</div>
                  <div className="flex-1 h-6 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full rounded-full flex items-center px-3" style={{
                      background: p.color + '40',
                      border: `1px solid ${p.color}60`,
                      width: p.phase === 'PHASE 0' ? '10%' : p.phase === 'PHASE 1' ? '25%' : p.phase === 'PHASE 2' ? '50%' : p.phase === 'PHASE 3' ? '75%' : '100%'
                    }}>
                      <span className="text-[8px] font-black truncate" style={{ color: p.color }}>{p.title}</span>
                    </div>
                  </div>
                  <div className="w-20 text-[8px] text-slate-500 font-mono text-right">{p.duration}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ CONTENT PLAN ══════════════ */}
      {activeTab === 'content' && (
        <div className="space-y-5">
          <div className="text-xs text-slate-500 font-mono">
            📅 Content calendar 4 minggu pertama. Theme per minggu. Consistency {">"} Viral.
          </div>
          {CONTENT_CALENDAR.map(week => (
            <div key={week.week} className="glass rounded-2xl p-5 border border-slate-800/60">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-indigo-600/20 border border-indigo-500/30 px-3 py-1 rounded-xl text-[10px] font-black text-indigo-400 uppercase">
                  {week.week}
                </div>
                <div className="text-xs font-black text-white">{week.theme}</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {week.content.map(item => (
                  <div key={item.title} className="glass rounded-xl p-3 border border-slate-800/60">
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-slate-800 px-2 py-0.5 rounded text-[8px] text-slate-400 font-mono">{item.platform}</span>
                      <span className={`text-[8px] font-black ${
                        item.status === 'DONE' ? 'text-emerald-400' :
                        item.status === 'DRAFT' ? 'text-yellow-400' : 'text-slate-500'
                      }`}>{item.status}</span>
                    </div>
                    <div className="text-[10px] font-black text-white mb-1">{item.title}</div>
                    <div className="text-[9px] text-slate-500 italic">Hook: {item.hook}</div>
                    <div className="text-[8px] text-slate-600 mt-1 font-mono">{item.type}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ══════════════ PERSONA GUIDE ══════════════ */}
      {activeTab === 'persona' && (
        <div className="space-y-5">
          {/* Core Identity */}
          <div className="glass rounded-2xl p-6 border border-orange-500/30 bg-orange-500/5">
            <h2 className="text-lg font-black text-orange-400 uppercase tracking-widest mb-4">
              🎭 Your Public Persona Blueprint
            </h2>
            <div className="text-xl font-black text-white mb-4">{PERSONA_GUIDE.identity}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-2">❌ DO NOT BE</div>
                <div className="space-y-1">
                  {PERSONA_GUIDE.NOT.map(n => (
                    <div key={n} className="flex items-center gap-2 text-[10px] text-red-300">
                      <span>—</span>{n}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">✅ ALWAYS BE</div>
                <div className="space-y-1">
                  {PERSONA_GUIDE.BE.map(b => (
                    <div key={b} className="flex items-center gap-2 text-[10px] text-emerald-300">
                      <span>+</span>{b}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-slate-900/40 rounded-xl p-4 border border-slate-800/60">
              <div className="text-[10px] font-black text-yellow-400 uppercase tracking-widest mb-2">🎯 Core Philosophy</div>
              <p className="text-sm text-white font-black italic">"{PERSONA_GUIDE.philosophy}"</p>
            </div>
          </div>

          {/* Content Pillars */}
          <div className="glass rounded-2xl p-5 border border-slate-800/60">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4">📊 Content Pillars</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {PERSONA_GUIDE.pillars.map(p => (
                <div key={p.name} className="glass rounded-xl p-4 border border-slate-800/60 text-center">
                  <div className="text-2xl font-black text-indigo-400">{p.pct}</div>
                  <div className="text-[10px] font-black text-white mt-1">{p.name}</div>
                  <div className="text-[9px] text-slate-500 mt-1 leading-relaxed">{p.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Voice Guide */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass rounded-2xl p-5 border border-blue-500/20">
              <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">🇺🇸 English Voice</div>
              <p className="text-sm text-white leading-relaxed">{PERSONA_GUIDE.voice.en}</p>
            </div>
            <div className="glass rounded-2xl p-5 border border-emerald-500/20">
              <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">🇮🇩 Indonesian Voice</div>
              <p className="text-sm text-white leading-relaxed">{PERSONA_GUIDE.voice.id}</p>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="glass rounded-2xl p-5 border border-purple-500/20 bg-purple-500/5">
            <div className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-2">🤝 Disclaimer Strategy</div>
            <p className="text-sm text-white leading-relaxed">{PERSONA_GUIDE.disclaimer}</p>
            <div className="mt-3 text-[10px] text-slate-400 font-mono">
              💡 Template: "I'm a builder + orchestrator. I work with AI tools (like Genspark/Claude) to build this platform.
              The vision, architecture, and business decisions are mine. AI helps me ship 10x faster. That's the future of building."
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default BuildInPublic;
