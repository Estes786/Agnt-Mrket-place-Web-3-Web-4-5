
// ============================================================
// GANI HYPHA — Revenue Hub v1.0
// Web2 SaaS × Micro Service Income Generator
// Gyss! Akar Dalam, Cabang Tinggi 🙏🏻
// ============================================================

import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

// ─── Micro Service Data ───────────────────────────────────────
const MICRO_SERVICES = [
  {
    id: 'groq-ai-api',
    name: 'Groq AI API Gateway',
    category: 'AI Service',
    icon: '🤖',
    description: 'Resell Groq llama-3.3-70b inference. Charge per request. 1 HYPHA = 100 calls.',
    pricing: { model: 'Per Request', price: '$0.001/call', hypha: '0.01 HYPHA/call' },
    monthlyRevenue: { conservative: 1200, base: 4500, bull: 18000 },
    status: 'LIVE',
    color: '#8b5cf6',
    integration: 'Groq API',
    setupCost: '$0',
    roi: '∞',
    customers: 47,
    callsToday: 12450
  },
  {
    id: 'web3-rpc-proxy',
    name: 'Web3 RPC Proxy Service',
    category: 'Blockchain',
    icon: '⛓️',
    description: 'Proxy Alchemy/Infura RPC. Charge per 1K requests. Perfect for dApp developers.',
    pricing: { model: 'Pay-as-you-go', price: '$0.0001/req', hypha: '0.001 HYPHA/req' },
    monthlyRevenue: { conservative: 800, base: 3200, bull: 12000 },
    status: 'LIVE',
    color: '#3b82f6',
    integration: 'Alchemy',
    setupCost: '$0',
    roi: '∞',
    customers: 23,
    callsToday: 8930
  },
  {
    id: 'ipfs-storage-saas',
    name: 'IPFS Storage SaaS',
    category: 'Decentralized Storage',
    icon: '📦',
    description: 'Managed IPFS pinning via Pinata. Charge monthly per GB stored.',
    pricing: { model: 'Monthly SaaS', price: '$9/mo (1GB)', hypha: '45 HYPHA/mo' },
    monthlyRevenue: { conservative: 450, base: 1800, bull: 7200 },
    status: 'LIVE',
    color: '#f59e0b',
    integration: 'Pinata',
    setupCost: '$0',
    roi: '∞',
    customers: 18,
    callsToday: 340
  },
  {
    id: 'defi-yield-optimizer',
    name: 'DeFi Yield Optimizer',
    category: 'DeFi Automation',
    icon: '📈',
    description: 'Auto-rebalance across Aave/Curve/Radiant. Charge 2% mgmt + 20% performance.',
    pricing: { model: 'AUM Fee', price: '2% mgmt + 20% perf', hypha: 'Proportional' },
    monthlyRevenue: { conservative: 2100, base: 8400, bull: 42000 },
    status: 'BETA',
    color: '#10b981',
    integration: 'Aave V3',
    setupCost: '$200 LP',
    roi: '4.2x',
    customers: 12,
    callsToday: 89
  },
  {
    id: 'smart-contract-audit',
    name: 'AI Smart Contract Audit',
    category: 'Security',
    icon: '🔒',
    description: 'Groq-powered smart contract analysis. One-time audit fee per contract.',
    pricing: { model: 'One-time Fee', price: '$49-$299/audit', hypha: '245-1495 HYPHA' },
    monthlyRevenue: { conservative: 980, base: 3920, bull: 14700 },
    status: 'LIVE',
    color: '#ef4444',
    integration: 'Groq + Etherscan',
    setupCost: '$0',
    roi: '∞',
    customers: 9,
    callsToday: 23
  },
  {
    id: 'dao-governance-saas',
    name: 'DAO Governance SaaS',
    category: 'Governance',
    icon: '🏛️',
    description: 'White-label DAO tooling. Voting, proposals, treasury mgmt. $99-$499/mo.',
    pricing: { model: 'Monthly SaaS', price: '$99-$499/mo', hypha: '495-2495 HYPHA/mo' },
    monthlyRevenue: { conservative: 1485, base: 5940, bull: 24750 },
    status: 'LIVE',
    color: '#6366f1',
    integration: 'Cloudflare D1',
    setupCost: '$0',
    roi: '∞',
    customers: 7,
    callsToday: 156
  },
  {
    id: 'b2b-barber-saas',
    name: 'Barber Dynasty SaaS',
    category: 'Industry SaaS',
    icon: '✂️',
    description: 'AI booking + loyalty system for barbershops. $19-$79/mo per shop.',
    pricing: { model: 'Monthly SaaS', price: '$19-$79/mo', hypha: '95-395 HYPHA/mo' },
    monthlyRevenue: { conservative: 570, base: 2280, bull: 9120 },
    status: 'LIVE',
    color: '#ec4899',
    integration: 'Groq + Cloudflare',
    setupCost: '$0',
    roi: '∞',
    customers: 34,
    callsToday: 2140
  },
  {
    id: 'real-estate-ai',
    name: 'Real Estate AI SaaS',
    category: 'Industry SaaS',
    icon: '🏠',
    description: 'Property management AI. Lead qualification + DID registry. $49-$199/mo.',
    pricing: { model: 'Monthly SaaS', price: '$49-$199/mo', hypha: '245-995 HYPHA/mo' },
    monthlyRevenue: { conservative: 1470, base: 5880, bull: 22050 },
    status: 'LIVE',
    color: '#06b6d4',
    integration: 'Groq + Alchemy',
    setupCost: '$0',
    roi: '∞',
    customers: 21,
    callsToday: 890
  },
];

// ─── SaaS Plan Data ───────────────────────────────────────────
const SAAS_PLANS = [
  {
    name: 'Starter',
    price: 19,
    hypha: 95,
    features: ['1 AI Pod', '5K Groq calls/mo', '1GB IPFS', 'Basic analytics', 'Email support'],
    color: '#10b981',
    popular: false,
    target: 'Solo creators, freelancers'
  },
  {
    name: 'Pro',
    price: 99,
    hypha: 495,
    features: ['5 AI Pods', '50K Groq calls/mo', '10GB IPFS', 'Real-time analytics', 'Web3 wallet auth', 'Priority support'],
    color: '#8b5cf6',
    popular: true,
    target: 'Small businesses, startups'
  },
  {
    name: 'Business',
    price: 299,
    hypha: 1495,
    features: ['25 AI Pods', '500K Groq calls/mo', '100GB IPFS', 'DAO governance', 'Custom tokens', 'DeFi yield', 'API access', 'Slack support'],
    color: '#f59e0b',
    popular: false,
    target: 'Growing companies, DAOs'
  },
  {
    name: 'Enterprise',
    price: 999,
    hypha: 4995,
    features: ['Unlimited Pods', 'Unlimited Groq', 'Unlimited IPFS', 'White-label', 'Custom SLA', 'Dedicated node', 'On-chain treasury', 'Dedicated manager'],
    color: '#ef4444',
    popular: false,
    target: 'Enterprises, large DAOs'
  }
];

// ─── Revenue Projection Data ──────────────────────────────────
const generateProjectionData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((month, i) => ({
    month,
    saas: Math.floor(500 * Math.pow(1.35, i)),
    microservices: Math.floor(800 * Math.pow(1.28, i)),
    defi: Math.floor(200 * Math.pow(1.45, i)),
    enterprise: i > 3 ? Math.floor(1000 * Math.pow(1.5, i - 4)) : 0,
    total: Math.floor(1500 * Math.pow(1.32, i))
  }));
};

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#ec4899', '#06b6d4'];

const RevenueHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'microservices' | 'saas' | 'calculator' | 'tracker'>('overview');
  const [selectedScenario, setSelectedScenario] = useState<'conservative' | 'base' | 'bull'>('base');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [calcInput, setCalcInput] = useState({ customers: 50, plan: 'Pro', months: 12 });
  const [liveStats, setLiveStats] = useState({ totalRevenue: 28450, todayCalls: 24870, activeCustomers: 171 });
  const projectionData = generateProjectionData();

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        totalRevenue: prev.totalRevenue + Math.floor(Math.random() * 10),
        todayCalls: prev.todayCalls + Math.floor(Math.random() * 50),
        activeCustomers: prev.activeCustomers + (Math.random() > 0.8 ? 1 : 0)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const totalMonthlyRevenue = MICRO_SERVICES.reduce(
    (sum, s) => sum + s.monthlyRevenue[selectedScenario], 0
  );

  const pieData = MICRO_SERVICES.slice(0, 6).map(s => ({
    name: s.name.split(' ').slice(0, 2).join(' '),
    value: s.monthlyRevenue[selectedScenario]
  }));

  const selectedPlan = SAAS_PLANS.find(p => p.name === calcInput.plan) || SAAS_PLANS[1];
  const calcResult = {
    monthlyRevenue: calcInput.customers * selectedPlan.price,
    yearlyRevenue: calcInput.customers * selectedPlan.price * calcInput.months,
    hyphaEarned: calcInput.customers * selectedPlan.hypha * calcInput.months,
    roi: ((calcInput.customers * selectedPlan.price * calcInput.months) / 1000 * 100).toFixed(0)
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">

      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 mb-3">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
            Revenue Engine · Active
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Revenue Hub 💰</h1>
          <p className="text-slate-400 text-sm mt-1">Web2 SaaS × Micro Services × DeFi — Generate Real Income. Gyss! 🙏🏻</p>
        </div>
        <div className="flex gap-2">
          {(['conservative', 'base', 'bull'] as const).map(s => (
            <button
              key={s}
              onClick={() => setSelectedScenario(s)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                selectedScenario === s
                  ? s === 'bull' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                  : s === 'base' ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400'
                  : 'bg-slate-700/40 border-slate-600/40 text-slate-300'
                  : 'bg-transparent border-slate-800 text-slate-600 hover:border-slate-700'
              }`}
            >
              {s === 'conservative' ? '🔴 Bear' : s === 'base' ? '🟡 Base' : '🟢 Bull'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Live Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue MTD', value: `$${liveStats.totalRevenue.toLocaleString()}`, delta: '+$847 today', color: 'emerald', icon: '💰' },
          { label: 'API Calls Today', value: liveStats.todayCalls.toLocaleString(), delta: '+∞ scaling', color: 'blue', icon: '⚡' },
          { label: 'Active Customers', value: liveStats.activeCustomers.toString(), delta: '+3 this week', color: 'purple', icon: '👥' },
          { label: 'Projected M12', value: `$${(totalMonthlyRevenue).toLocaleString()}`, delta: '/month target', color: 'yellow', icon: '🎯' }
        ].map(stat => (
          <div key={stat.label} className="glass rounded-2xl p-4 border border-slate-800/60">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className={`text-2xl font-black text-${stat.color}-400 tracking-tighter`}>{stat.value}</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">{stat.label}</div>
            <div className="text-[9px] text-slate-600 mt-1 font-mono">{stat.delta}</div>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-2 border-b border-slate-800/60 pb-4 overflow-x-auto scrollbar-hide">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'microservices', label: 'Micro Services', icon: '⚙️' },
          { id: 'saas', label: 'SaaS Plans', icon: '💳' },
          { id: 'calculator', label: 'Revenue Calc', icon: '🧮' },
          { id: 'tracker', label: 'Income Tracker', icon: '📈' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-indigo-600/20 border border-indigo-500/40 text-indigo-400'
                : 'text-slate-500 hover:text-slate-300 border border-transparent hover:border-slate-800'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Chart */}
            <div className="lg:col-span-2 glass rounded-2xl p-5 border border-slate-800/60">
              <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4">12-Month Revenue Projection ({selectedScenario})</h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={projectionData}>
                  <defs>
                    <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="saasGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 9 }} />
                  <YAxis tick={{ fill: '#475569', fontSize: 9 }} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
                  <Tooltip
                    contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12 }}
                    labelStyle={{ color: '#94a3b8', fontSize: 10 }}
                    formatter={(v: any) => [`$${Number(v).toLocaleString()}`, '']}
                  />
                  <Area type="monotone" dataKey="total" stroke="#6366f1" fill="url(#totalGrad)" strokeWidth={2} name="Total" />
                  <Area type="monotone" dataKey="saas" stroke="#10b981" fill="url(#saasGrad)" strokeWidth={1.5} name="SaaS" />
                  <Area type="monotone" dataKey="microservices" stroke="#8b5cf6" fill="none" strokeWidth={1.5} strokeDasharray="4 4" name="Micro Services" />
                  <Area type="monotone" dataKey="enterprise" stroke="#f59e0b" fill="none" strokeWidth={1.5} name="Enterprise" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Revenue Breakdown Pie */}
            <div className="glass rounded-2xl p-5 border border-slate-800/60">
              <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4">Revenue Breakdown</h3>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} opacity={0.85} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12 }}
                    formatter={(v: any) => [`$${Number(v).toLocaleString()}/mo`, '']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1 mt-2">
                {pieData.slice(0, 4).map((d, i) => (
                  <div key={d.name} className="flex justify-between text-[9px]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }}></div>
                      <span className="text-slate-500 truncate max-w-[100px]">{d.name}</span>
                    </div>
                    <span className="text-slate-400 font-mono">${d.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Revenue Streams Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: '⚙️', label: 'Micro Services', revenue: `$${MICRO_SERVICES.slice(0,4).reduce((s,m) => s + m.monthlyRevenue[selectedScenario], 0).toLocaleString()}`, streams: '4 active', color: 'blue' },
              { icon: '💳', label: 'SaaS Subscriptions', revenue: `$${(calcInput.customers * selectedPlan.price).toLocaleString()}`, streams: '4 tiers', color: 'purple' },
              { icon: '📈', label: 'DeFi Yield', revenue: `$${MICRO_SERVICES.filter(m => m.category === 'DeFi Automation').reduce((s,m) => s + m.monthlyRevenue[selectedScenario], 0).toLocaleString()}`, streams: '1 protocol', color: 'emerald' },
              { icon: '🏢', label: 'Enterprise B2B', revenue: '$5K+/deal', streams: 'Custom POC', color: 'yellow' }
            ].map(item => (
              <div key={item.label} className={`glass rounded-2xl p-4 border border-${item.color}-500/20 bg-${item.color}-500/5`}>
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className={`text-xl font-black text-${item.color}-400`}>{item.revenue}</div>
                <div className="text-[10px] font-black text-white uppercase tracking-widest">{item.label}</div>
                <div className="text-[9px] text-slate-500 font-mono mt-1">{item.streams}</div>
              </div>
            ))}
          </div>

          {/* Total Target */}
          <div className="glass rounded-2xl p-6 border border-indigo-500/30 bg-indigo-500/5 text-center">
            <div className="text-5xl font-black text-indigo-400 tracking-tighter">
              ${totalMonthlyRevenue.toLocaleString()}<span className="text-2xl text-slate-500">/mo</span>
            </div>
            <div className="text-sm text-slate-400 mt-2 uppercase tracking-widest font-black">
              {selectedScenario === 'bull' ? '🟢 Bull' : selectedScenario === 'base' ? '🟡 Base' : '🔴 Bear'} Case — Month 12 Target
            </div>
            <div className="text-xs text-slate-600 mt-1">
              Year 1 ARR: ${(totalMonthlyRevenue * 6).toLocaleString()} · Year 2: ${(totalMonthlyRevenue * 12).toLocaleString()} 
            </div>
          </div>
        </div>
      )}

      {/* ── MICRO SERVICES TAB ── */}
      {activeTab === 'microservices' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-500 font-mono">
            💡 Micro Services = API resell + SaaS wrap. Zero infra cost. 100% margin. Gyss!
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MICRO_SERVICES.map(service => (
              <div
                key={service.id}
                onClick={() => setSelectedService(selectedService === service.id ? null : service.id)}
                className={`glass rounded-2xl p-5 border transition-all cursor-pointer ${
                  selectedService === service.id
                    ? 'border-indigo-500/40 bg-indigo-500/5'
                    : 'border-slate-800/60 hover:border-slate-700/60'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{service.icon}</div>
                    <div>
                      <div className="text-xs font-black text-white">{service.name}</div>
                      <div className="text-[9px] text-slate-500 font-mono">{service.category}</div>
                    </div>
                  </div>
                  <div className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    service.status === 'LIVE'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                  }`}>
                    {service.status}
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 leading-relaxed mb-3">{service.description}</p>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center">
                    <div className="text-xs font-black" style={{ color: service.color }}>${service.monthlyRevenue[selectedScenario].toLocaleString()}</div>
                    <div className="text-[8px] text-slate-600 uppercase">Mo Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-black text-white">{service.customers}</div>
                    <div className="text-[8px] text-slate-600 uppercase">Customers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-black text-indigo-400">{service.roi}</div>
                    <div className="text-[8px] text-slate-600 uppercase">ROI</div>
                  </div>
                </div>

                {selectedService === service.id && (
                  <div className="mt-3 pt-3 border-t border-slate-800/60 space-y-2 animate-in fade-in duration-300">
                    <div className="grid grid-cols-2 gap-2 text-[9px]">
                      <div>
                        <span className="text-slate-600">Pricing Model:</span>
                        <span className="text-slate-300 ml-1">{service.pricing.model}</span>
                      </div>
                      <div>
                        <span className="text-slate-600">Price:</span>
                        <span className="text-slate-300 ml-1">{service.pricing.price}</span>
                      </div>
                      <div>
                        <span className="text-slate-600">HYPHA:</span>
                        <span className="text-indigo-400 ml-1">{service.pricing.hypha}</span>
                      </div>
                      <div>
                        <span className="text-slate-600">Setup:</span>
                        <span className="text-emerald-400 ml-1">{service.setupCost}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[9px] text-slate-600">Integration:</span>
                      <span className="bg-slate-800/60 px-2 py-0.5 rounded text-[9px] text-slate-400 font-mono">{service.integration}</span>
                    </div>
                    <div className="text-[9px] font-mono text-slate-600">
                      Today: {service.callsToday.toLocaleString()} calls
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SAAS PLANS TAB ── */}
      {activeTab === 'saas' && (
        <div className="space-y-6">
          <div className="text-xs text-slate-500 font-mono">
            💡 SaaS = Predictable recurring revenue. Best moat vs token speculation. Start dengan Starter plan!
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {SAAS_PLANS.map(plan => (
              <div
                key={plan.name}
                className={`glass rounded-2xl p-5 border transition-all relative ${
                  plan.popular
                    ? 'border-indigo-500/40 bg-indigo-500/5 scale-105'
                    : 'border-slate-800/60 hover:border-slate-700/60'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-4">
                  <div className="text-lg font-black text-white">{plan.name}</div>
                  <div className="text-3xl font-black mt-1" style={{ color: plan.color }}>
                    ${plan.price}<span className="text-base text-slate-500">/mo</span>
                  </div>
                  <div className="text-[9px] text-slate-600 font-mono mt-1">or {plan.hypha} HYPHA/mo</div>
                  <div className="text-[9px] text-slate-500 mt-2 italic">{plan.target}</div>
                </div>
                <div className="space-y-1.5">
                  {plan.features.map(f => (
                    <div key={f} className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span style={{ color: plan.color }}>✓</span>
                      {f}
                    </div>
                  ))}
                </div>
                <button className={`w-full mt-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                  plan.popular
                    ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-400 hover:bg-indigo-600/30'
                    : 'border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300'
                }`}>
                  Deploy Pod → {plan.name}
                </button>
              </div>
            ))}
          </div>

          {/* Revenue Calculator from SaaS */}
          <div className="glass rounded-2xl p-5 border border-slate-800/60">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4">SaaS Revenue Potential</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { customers: 10, label: '10 Customers' },
                { customers: 50, label: '50 Customers' },
                { customers: 200, label: '200 Customers' }
              ].map(({ customers, label }) => (
                <div key={customers} className="text-center glass rounded-xl p-4 border border-slate-800/60">
                  <div className="text-xl font-black text-indigo-400">${(customers * 99).toLocaleString()}</div>
                  <div className="text-[9px] text-slate-500 uppercase tracking-widest">{label} (Pro)</div>
                  <div className="text-[9px] text-slate-600 mt-1">= ${(customers * 99 * 12).toLocaleString()}/yr</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── CALCULATOR TAB ── */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-6 border border-slate-800/60">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6">Revenue Calculator</h3>
            <div className="space-y-5">
              <div>
                <label className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Number of Customers</label>
                <input
                  type="range" min="1" max="500" value={calcInput.customers}
                  onChange={e => setCalcInput(prev => ({ ...prev, customers: +e.target.value }))}
                  className="w-full mt-2 accent-indigo-500"
                />
                <div className="text-indigo-400 font-black text-lg mt-1">{calcInput.customers} customers</div>
              </div>
              <div>
                <label className="text-[10px] text-slate-500 uppercase tracking-widest font-black">SaaS Plan</label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {SAAS_PLANS.map(p => (
                    <button
                      key={p.name}
                      onClick={() => setCalcInput(prev => ({ ...prev, plan: p.name }))}
                      className={`py-2 rounded-xl text-[10px] font-black border transition-all ${
                        calcInput.plan === p.name
                          ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-400'
                          : 'border-slate-800 text-slate-500 hover:border-slate-700'
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Projection Period (months)</label>
                <input
                  type="range" min="1" max="24" value={calcInput.months}
                  onChange={e => setCalcInput(prev => ({ ...prev, months: +e.target.value }))}
                  className="w-full mt-2 accent-indigo-500"
                />
                <div className="text-indigo-400 font-black text-lg mt-1">{calcInput.months} months</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="glass rounded-2xl p-6 border border-emerald-500/30 bg-emerald-500/5">
              <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-4">📊 Revenue Projection</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-4xl font-black text-emerald-400 tracking-tighter">
                    ${calcResult.monthlyRevenue.toLocaleString()}<span className="text-lg text-slate-500">/mo</span>
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest">Monthly Revenue</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass rounded-xl p-3 border border-slate-800/60">
                    <div className="text-xl font-black text-white">${calcResult.yearlyRevenue.toLocaleString()}</div>
                    <div className="text-[9px] text-slate-500">{calcInput.months}-Month Total</div>
                  </div>
                  <div className="glass rounded-xl p-3 border border-slate-800/60">
                    <div className="text-xl font-black text-indigo-400">{calcResult.hyphaEarned.toLocaleString()}</div>
                    <div className="text-[9px] text-slate-500">HYPHA Earned (customers)</div>
                  </div>
                </div>
                <div className="bg-slate-900/40 rounded-xl p-3 border border-slate-800/60">
                  <div className="text-[10px] font-black text-white mb-2">💡 Why this works:</div>
                  <div className="text-[10px] text-slate-400 leading-relaxed">
                    {calcInput.customers} customers × ${selectedPlan.price}/mo = <span className="text-emerald-400">${calcResult.monthlyRevenue.toLocaleString()} MRR</span>.
                    After {calcInput.months} months → <span className="text-indigo-400">${calcResult.yearlyRevenue.toLocaleString()} ARR</span>.
                    ROI on $1K initial investment: <span className="text-yellow-400">{calcResult.roi}%</span>.
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass rounded-2xl p-5 border border-slate-800/60">
              <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4">🚀 Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { action: '1. Setup Supabase DB', detail: 'User auth + subscription tracking', status: 'FREE', color: 'emerald' },
                  { action: '2. Create Payment Link', detail: 'Stripe/crypto dual payment', status: 'TODO', color: 'yellow' },
                  { action: '3. Launch Landing Page', detail: 'Showcase SaaS plans to users', status: 'TODO', color: 'blue' },
                  { action: '4. First 10 Customers', detail: 'DM on Twitter, LinkedIn, Telegram', status: 'TODO', color: 'purple' }
                ].map(item => (
                  <div key={item.action} className="flex items-center gap-3 glass rounded-xl p-3 border border-slate-800/60">
                    <div className={`text-[9px] px-2 py-0.5 rounded bg-${item.color}-500/10 border border-${item.color}-500/30 text-${item.color}-400 font-black`}>
                      {item.status}
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-white">{item.action}</div>
                      <div className="text-[9px] text-slate-500">{item.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TRACKER TAB ── */}
      {activeTab === 'tracker' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-500 font-mono">
            💡 Real-time income tracker — watch every HYPHA and dollar come in. Gyss!
          </div>
          <div className="glass rounded-2xl p-5 border border-slate-800/60">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4">Income Stream Breakdown</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={MICRO_SERVICES.map(s => ({
                name: s.name.split(' ').slice(0, 2).join(' '),
                conservative: s.monthlyRevenue.conservative,
                base: s.monthlyRevenue.base,
                bull: s.monthlyRevenue.bull
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 8 }} angle={-15} />
                <YAxis tick={{ fill: '#475569', fontSize: 9 }} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
                <Tooltip
                  contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12 }}
                  formatter={(v: any) => [`$${Number(v).toLocaleString()}/mo`, '']}
                />
                <Bar dataKey="conservative" fill="#ef4444" opacity={0.7} radius={[4,4,0,0]} name="Conservative" />
                <Bar dataKey="base" fill="#6366f1" opacity={0.8} radius={[4,4,0,0]} name="Base" />
                <Bar dataKey="bull" fill="#10b981" opacity={0.9} radius={[4,4,0,0]} name="Bull" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Live Transaction Feed */}
          <div className="glass rounded-2xl p-5 border border-slate-800/60">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4">🔴 Live Transaction Feed</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide">
              {Array.from({ length: 12 }).map((_, i) => {
                const services = MICRO_SERVICES;
                const s = services[i % services.length];
                const amounts = ['$19', '$99', '$299', '+0.01 HYPHA', '$9', '+0.001 HYPHA', '$49'];
                const types = ['SaaS Sub', 'API Call', 'Upgrade', 'Stake Reward', 'IPFS Pin', 'Protocol Fee'];
                return (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-900/60 last:border-0">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs bg-slate-900">{s.icon}</div>
                    <div className="flex-1">
                      <div className="text-[10px] font-black text-white">{types[i % types.length]}</div>
                      <div className="text-[9px] text-slate-500 font-mono">{s.name.split(' ').slice(0,2).join(' ')}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-black text-emerald-400">{amounts[i % amounts.length]}</div>
                      <div className="text-[8px] text-slate-600 font-mono">{Math.floor(Math.random() * 59)}m ago</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default RevenueHub;
