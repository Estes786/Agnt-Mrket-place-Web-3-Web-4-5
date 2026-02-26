// ============================================================
// GANI HYPHA — Autonomous Economy v5.0
// Web2 + Web3 + Web4 + Web5 Unified Economy Engine
// AI-driven income, DeFi, tokenomics, SaaS, micro-services
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// ── Types ────────────────────────────────────────────────────
interface EconomyStream {
  id: string;
  name: string;
  layer: 'Web2' | 'Web3' | 'Web4' | 'Web5';
  type: 'SaaS' | 'DeFi' | 'Token' | 'AI' | 'DAO' | 'NFT' | 'RPC' | 'API';
  monthlyRevenue: number;
  growth: number;
  status: 'active' | 'pending' | 'building';
  icon: string;
  apy?: number;
  users?: number;
  description: string;
}

interface AIAgent {
  id: string;
  name: string;
  role: string;
  status: 'running' | 'idle' | 'learning';
  earnings: number;
  tasksCompleted: number;
  accuracy: number;
  model: string;
  autonomyLevel: number;
}

interface MarketSignal {
  time: string;
  price: number;
  volume: number;
  sentiment: number;
}

// ── Constants ─────────────────────────────────────────────────
const ECONOMY_STREAMS: EconomyStream[] = [
  { id: 'web2-saas', name: 'SaaS Subscriptions', layer: 'Web2', type: 'SaaS', monthlyRevenue: 45000, growth: 34, status: 'active', icon: '💼', users: 234, description: 'Enterprise SaaS plans $19-$999/mo' },
  { id: 'web2-api', name: 'API Marketplace', layer: 'Web2', type: 'API', monthlyRevenue: 18000, growth: 67, status: 'active', icon: '🔌', users: 892, description: 'Groq AI API resell + Web3 RPC proxy' },
  { id: 'web3-defi', name: 'DeFi Yield Farming', layer: 'Web3', type: 'DeFi', monthlyRevenue: 24500, growth: 89, status: 'active', icon: '🌾', apy: 18.5, description: 'Uniswap V3 + Aave V3 + Lido staking' },
  { id: 'web3-token', name: 'Token Economy', layer: 'Web3', type: 'Token', monthlyRevenue: 32000, growth: 124, status: 'active', icon: '🪙', description: 'HYPHA + PREMALTA + Industry tokens' },
  { id: 'web3-nft', name: 'NFT Royalties', layer: 'Web3', type: 'NFT', monthlyRevenue: 8500, growth: 45, status: 'active', icon: '🎨', description: 'Founder pods + AI art + digital assets' },
  { id: 'web4-agent', name: 'AI Agent Pods', layer: 'Web4', type: 'AI', monthlyRevenue: 89000, growth: 156, status: 'active', icon: '🤖', users: 1456, description: '9 autonomous AI agent blueprints' },
  { id: 'web4-dao', name: 'DAO Governance', layer: 'Web4', type: 'DAO', monthlyRevenue: 12000, growth: 78, status: 'active', icon: '🏛️', description: 'vHYPHA voting + proposal fees + treasury' },
  { id: 'web5-dwn', name: 'Decentralized Web Nodes', layer: 'Web5', type: 'AI', monthlyRevenue: 5500, growth: 234, status: 'building', icon: '🕸️', description: 'DWN storage + identity + data sovereignty' },
  { id: 'web5-rpc', name: 'Web5 RPC Services', layer: 'Web5', type: 'RPC', monthlyRevenue: 3200, growth: 189, status: 'building', icon: '⚡', description: 'Cross-chain RPC + oracle feeds + bridges' },
];

const AI_AGENTS: AIAgent[] = [
  { id: 'gani-main', name: 'GANI Master', role: 'Universal Orchestrator', status: 'running', earnings: 4250.50, tasksCompleted: 18429, accuracy: 99.2, model: 'llama-3.3-70b', autonomyLevel: 95 },
  { id: 'yield-agent', name: 'Yield Optimizer', role: 'DeFi Strategy AI', status: 'running', earnings: 3180.75, tasksCompleted: 9847, accuracy: 97.8, model: 'llama-3.3-70b', autonomyLevel: 88 },
  { id: 'trade-agent', name: 'Trade Sentinel', role: 'Market Analysis AI', status: 'running', earnings: 2640.20, tasksCompleted: 24156, accuracy: 94.5, model: 'llama-3.3-70b', autonomyLevel: 82 },
  { id: 'content-agent', name: 'Content Alchemist', role: 'Web2 Content AI', status: 'running', earnings: 1890.00, tasksCompleted: 6234, accuracy: 98.1, model: 'llama-3.3-70b', autonomyLevel: 75 },
  { id: 'dao-agent', name: 'DAO Governor', role: 'Governance AI', status: 'idle', earnings: 980.50, tasksCompleted: 1245, accuracy: 99.8, model: 'llama-3.3-70b', autonomyLevel: 70 },
  { id: 'rpc-agent', name: 'Node Operator', role: 'Infrastructure AI', status: 'running', earnings: 756.30, tasksCompleted: 45678, accuracy: 99.9, model: 'mixtral-8x7b', autonomyLevel: 65 },
];

const LAYER_COLORS: Record<string, string> = {
  Web2: '#6366f1',
  Web3: '#8b5cf6',
  Web4: '#ec4899',
  Web5: '#14b8a6',
};

const PIE_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#10b981'];

// ── Main Component ────────────────────────────────────────────
const AutonomousEconomy: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'streams' | 'agents' | 'market' | 'roadmap'>('overview');
  const [totalRevenue, setTotalRevenue] = useState(237700);
  const [revenueHistory, setRevenueHistory] = useState<{ month: string; web2: number; web3: number; web4: number; web5: number; total: number }[]>([]);
  const [marketSignals, setMarketSignals] = useState<MarketSignal[]>([]);
  const [selectedLayer, setSelectedLayer] = useState<string>('all');
  const [autonomyIndex, setAutonomyIndex] = useState(84.7);
  const [epochBlock, setEpochBlock] = useState(19847234);

  // Generate revenue history data
  useEffect(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const history = months.map((month, i) => {
      const factor = Math.pow(1.18, i);
      return {
        month,
        web2: Math.round(5000 * factor),
        web3: Math.round(3000 * factor * 1.2),
        web4: Math.round(2000 * factor * 1.5),
        web5: Math.round(500 * factor * 2),
        total: Math.round(10500 * factor),
      };
    });
    setRevenueHistory(history);
  }, []);

  // Generate market signals
  useEffect(() => {
    const signals: MarketSignal[] = Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      price: 0.0042 + Math.random() * 0.0012,
      volume: Math.random() * 500000 + 100000,
      sentiment: 50 + Math.random() * 40,
    }));
    setMarketSignals(signals);
  }, []);

  // Live revenue ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalRevenue(prev => prev + (Math.random() * 0.5));
      setAutonomyIndex(prev => Math.min(99.9, prev + (Math.random() - 0.48) * 0.1));
      setEpochBlock(prev => prev + Math.floor(Math.random() * 3));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const filteredStreams = selectedLayer === 'all' 
    ? ECONOMY_STREAMS 
    : ECONOMY_STREAMS.filter(s => s.layer === selectedLayer);

  const totalMonthly = ECONOMY_STREAMS.reduce((sum, s) => sum + s.monthlyRevenue, 0);
  const activeStreams = ECONOMY_STREAMS.filter(s => s.status === 'active').length;
  
  const pieData = ['Web2', 'Web3', 'Web4', 'Web5'].map(layer => ({
    name: layer,
    value: ECONOMY_STREAMS.filter(s => s.layer === layer).reduce((sum, s) => sum + s.monthlyRevenue, 0),
  }));

  const totalAgentEarnings = AI_AGENTS.reduce((sum, a) => sum + a.earnings, 0);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-lg shadow-lg shadow-indigo-500/30">
                🌐
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
                  Autonomous Economy Engine
                  <span className="ml-2 text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">v5.0 LIVE</span>
                </h1>
                <p className="text-xs text-slate-400">Web2 + Web3 + Web4 + Web5 · Unified AI-Driven Income Platform</p>
              </div>
            </div>
          </div>
          {/* Live epoch */}
          <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl px-4 py-2 text-right">
            <div className="text-[10px] text-slate-500 font-mono uppercase">EPOCH BLOCK</div>
            <div className="text-sm font-mono text-amber-400 font-bold">#{epochBlock.toLocaleString()}</div>
            <div className="text-[10px] text-emerald-400">⚡ Autonomous Index: {autonomyIndex.toFixed(1)}%</div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {[
            { label: 'Total MRR', value: `$${(totalMonthly / 1000).toFixed(0)}K`, sub: '+18.4% MoM', color: 'indigo', icon: '💰' },
            { label: 'AI Agent Earnings', value: `$${(totalAgentEarnings / 1000).toFixed(1)}K`, sub: `${AI_AGENTS.filter(a => a.status === 'running').length} active agents`, color: 'purple', icon: '🤖' },
            { label: 'Active Streams', value: `${activeStreams}/${ECONOMY_STREAMS.length}`, sub: 'Revenue channels', color: 'pink', icon: '📡' },
            { label: 'ARR Projection', value: `$${((totalMonthly * 12) / 1000).toFixed(0)}K`, sub: 'Year 1 target', color: 'teal', icon: '🎯' },
          ].map((kpi) => (
            <div key={kpi.label} className={`bg-${kpi.color}-500/5 border border-${kpi.color}-500/20 rounded-xl p-3`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">{kpi.icon}</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{kpi.label}</span>
              </div>
              <div className={`text-xl font-black text-${kpi.color}-400`}>{kpi.value}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{kpi.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 overflow-x-auto scrollbar-hide">
        {(['overview', 'streams', 'agents', 'market', 'roadmap'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
              activeTab === tab
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            {tab === 'overview' && '📊 '}
            {tab === 'streams' && '💰 '}
            {tab === 'agents' && '🤖 '}
            {tab === 'market' && '📈 '}
            {tab === 'roadmap' && '🗺️ '}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          {/* Revenue Chart */}
          <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-4">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <span>📈</span> 12-Month Revenue Projection · All Layers
            </h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueHistory}>
                  <defs>
                    {['web2', 'web3', 'web4', 'web5'].map((key, i) => (
                      <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={PIE_COLORS[i]} stopOpacity={0.4} />
                        <stop offset="95%" stopColor={PIE_COLORS[i]} stopOpacity={0} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#475569', fontSize: 10 }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`} />
                  <Tooltip
                    contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                    formatter={(v: number) => [`$${v.toLocaleString()}`, '']}
                  />
                  {['web2', 'web3', 'web4', 'web5'].map((key, i) => (
                    <Area key={key} type="monotone" dataKey={key} stackId="1"
                      stroke={PIE_COLORS[i]} fill={`url(#grad-${key})`} strokeWidth={1.5} />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-3 mt-3">
              {['Web2', 'Web3', 'Web4', 'Web5'].map((layer, i) => (
                <div key={layer} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i] }} />
                  <span className="text-[11px] text-slate-400">{layer}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pie + Agents */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Revenue Distribution */}
            <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-4">
              <h3 className="text-sm font-bold text-white mb-3">Revenue Distribution</h3>
              <div className="flex items-center gap-4">
                <div className="h-36 w-36 flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" strokeWidth={0}>
                        {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                        formatter={(v: number) => [`$${(v/1000).toFixed(0)}K/mo`, '']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-2">
                  {pieData.map((d, i) => (
                    <div key={d.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i] }} />
                        <span className="text-xs text-slate-300">{d.name}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-white">${(d.value / 1000).toFixed(0)}K</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-slate-700/50">
                    <div className="flex justify-between">
                      <span className="text-xs font-bold text-slate-400">TOTAL MRR</span>
                      <span className="text-xs font-black text-emerald-400">${(totalMonthly / 1000).toFixed(0)}K</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top AI Agents */}
            <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-4">
              <h3 className="text-sm font-bold text-white mb-3">🤖 Top AI Agents · Live Earnings</h3>
              <div className="space-y-2">
                {AI_AGENTS.slice(0, 4).map((agent) => (
                  <div key={agent.id} className="flex items-center gap-3">
                    <div className={`w-1.5 h-8 rounded-full ${agent.status === 'running' ? 'bg-emerald-400' : 'bg-yellow-400'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white truncate">{agent.name}</div>
                      <div className="text-[10px] text-slate-400">{agent.role}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono text-emerald-400 font-bold">${agent.earnings.toLocaleString()}</div>
                      <div className="text-[10px] text-slate-500">{agent.accuracy}% acc</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Live Stats Banner */}
          <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 rounded-2xl p-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              {[
                { label: 'Total AI Tasks', value: AI_AGENTS.reduce((s, a) => s + a.tasksCompleted, 0).toLocaleString(), icon: '⚡' },
                { label: 'Avg Accuracy', value: `${(AI_AGENTS.reduce((s, a) => s + a.accuracy, 0) / AI_AGENTS.length).toFixed(1)}%`, icon: '🎯' },
                { label: 'DeFi APY', value: '18.5%', icon: '🌾' },
                { label: 'HYPHA Staked', value: '2.4M', icon: '🌿' },
                { label: 'Token Holders', value: '12,847', icon: '👥' },
              ].map(stat => (
                <div key={stat.label}>
                  <div className="text-lg">{stat.icon}</div>
                  <div className="text-base font-black text-white">{stat.value}</div>
                  <div className="text-[10px] text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Revenue Streams */}
      {activeTab === 'streams' && (
        <div className="space-y-4">
          {/* Layer filter */}
          <div className="flex gap-2 flex-wrap">
            {['all', 'Web2', 'Web3', 'Web4', 'Web5'].map(layer => (
              <button
                key={layer}
                onClick={() => setSelectedLayer(layer)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedLayer === layer
                    ? 'text-white shadow-lg'
                    : 'bg-slate-800/50 text-slate-400 hover:text-white'
                }`}
                style={selectedLayer === layer && layer !== 'all' ? { background: LAYER_COLORS[layer] } : selectedLayer === layer ? { background: '#4f46e5' } : {}}
              >
                {layer === 'all' ? '🌐 All Layers' : layer}
              </button>
            ))}
          </div>

          {/* Stream Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredStreams.map((stream) => (
              <div key={stream.id} className="bg-slate-900/60 border border-slate-700/30 hover:border-slate-600/50 rounded-xl p-4 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{stream.icon}</span>
                    <div>
                      <div className="text-sm font-bold text-white">{stream.name}</div>
                      <div className="text-[10px] text-slate-500">{stream.description}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className="text-[9px] font-black px-2 py-0.5 rounded-full uppercase"
                      style={{ background: `${LAYER_COLORS[stream.layer]}20`, color: LAYER_COLORS[stream.layer] }}
                    >
                      {stream.layer}
                    </span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      stream.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                      stream.status === 'building' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-slate-500/20 text-slate-400'
                    }`}>
                      {stream.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-xl font-black text-white">${(stream.monthlyRevenue / 1000).toFixed(0)}K</div>
                    <div className="text-[10px] text-slate-500">per month</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-emerald-400">+{stream.growth}%</div>
                    <div className="text-[10px] text-slate-500">MoM growth</div>
                  </div>
                </div>
                {stream.apy && (
                  <div className="mt-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-2 py-1 text-[10px] text-yellow-400 font-bold">
                    APY: {stream.apy}% 🌾
                  </div>
                )}
                {stream.users && (
                  <div className="mt-2 text-[10px] text-slate-500">👥 {stream.users.toLocaleString()} active users</div>
                )}
              </div>
            ))}
          </div>

          {/* Revenue Bar Chart */}
          <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-4">
            <h3 className="text-sm font-bold text-white mb-4">Revenue by Stream</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredStreams.map(s => ({ name: s.name.split(' ').slice(0, 2).join(' '), revenue: s.monthlyRevenue }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 9 }} />
                  <YAxis tick={{ fill: '#475569', fontSize: 9 }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`} />
                  <Tooltip
                    contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                    formatter={(v: number) => [`$${v.toLocaleString()}`, 'Revenue']}
                  />
                  <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                    {filteredStreams.map((stream, i) => (
                      <Cell key={i} fill={LAYER_COLORS[stream.layer] || '#6366f1'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Tab: AI Agents */}
      {activeTab === 'agents' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {AI_AGENTS.map((agent) => (
              <div key={agent.id} className="bg-slate-900/60 border border-slate-700/30 hover:border-purple-500/30 rounded-2xl p-4 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                      agent.status === 'running' ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-yellow-500/20 border border-yellow-500/30'
                    }`}>
                      🤖
                    </div>
                    <div>
                      <div className="text-sm font-black text-white">{agent.name}</div>
                      <div className="text-[10px] text-slate-400">{agent.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${agent.status === 'running' ? 'bg-emerald-400' : 'bg-yellow-400'}`} />
                    <span className={`text-[10px] font-bold ${agent.status === 'running' ? 'text-emerald-400' : 'text-yellow-400'}`}>
                      {agent.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                    <div className="text-xs font-black text-emerald-400">${agent.earnings.toLocaleString()}</div>
                    <div className="text-[9px] text-slate-500">Earnings</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                    <div className="text-xs font-black text-blue-400">{agent.tasksCompleted.toLocaleString()}</div>
                    <div className="text-[9px] text-slate-500">Tasks</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                    <div className="text-xs font-black text-purple-400">{agent.accuracy}%</div>
                    <div className="text-[9px] text-slate-500">Accuracy</div>
                  </div>
                </div>

                {/* Autonomy bar */}
                <div className="mb-2">
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-slate-400">Autonomy Level</span>
                    <span className="text-purple-400 font-bold">{agent.autonomyLevel}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                      style={{ width: `${agent.autonomyLevel}%` }}
                    />
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 font-mono">Model: {agent.model}</div>
              </div>
            ))}
          </div>

          {/* Agent Economy Summary */}
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-4">
            <h3 className="text-sm font-bold text-white mb-3">🤖 Agent Economy Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-lg font-black text-purple-400">${totalAgentEarnings.toLocaleString()}</div>
                <div className="text-[10px] text-slate-400">Total Agent Earnings</div>
              </div>
              <div>
                <div className="text-lg font-black text-emerald-400">{AI_AGENTS.filter(a => a.status === 'running').length}/{AI_AGENTS.length}</div>
                <div className="text-[10px] text-slate-400">Active Agents</div>
              </div>
              <div>
                <div className="text-lg font-black text-blue-400">{AI_AGENTS.reduce((s, a) => s + a.tasksCompleted, 0).toLocaleString()}</div>
                <div className="text-[10px] text-slate-400">Total Tasks Done</div>
              </div>
              <div>
                <div className="text-lg font-black text-pink-400">{(AI_AGENTS.reduce((s, a) => s + a.autonomyLevel, 0) / AI_AGENTS.length).toFixed(0)}%</div>
                <div className="text-[10px] text-slate-400">Avg Autonomy</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Market */}
      {activeTab === 'market' && (
        <div className="space-y-4">
          {/* PREMALTA price */}
          <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">$PREMALTA · Base Network</h3>
                <div className="text-[10px] text-slate-400 font-mono">0xC0125651a46BDEea72a73A1C1A75b82e0E2C94c7</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-emerald-400">$0.0042</div>
                <div className="text-xs text-emerald-400">+24.7% 24h</div>
              </div>
            </div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={marketSignals}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" tick={{ fill: '#475569', fontSize: 9 }} interval={3} />
                  <YAxis tick={{ fill: '#475569', fontSize: 9 }} domain={['auto', 'auto']} tickFormatter={(v) => `$${v.toFixed(4)}`} />
                  <Tooltip
                    contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                    formatter={(v: number) => [`$${v.toFixed(5)}`, 'Price']}
                  />
                  <Line type="monotone" dataKey="price" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Market Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Market Cap', value: '$68.4M', change: '+34%', color: 'emerald' },
              { label: 'TVL (DeFi)', value: '$24M', change: '+89%', color: 'blue' },
              { label: 'Daily Volume', value: '$2.1M', change: '+156%', color: 'purple' },
              { label: 'Liquidity', value: '$4.8M', change: '+67%', color: 'pink' },
            ].map(stat => (
              <div key={stat.label} className={`bg-${stat.color}-500/5 border border-${stat.color}-500/20 rounded-xl p-3`}>
                <div className="text-[10px] text-slate-400 uppercase">{stat.label}</div>
                <div className={`text-lg font-black text-${stat.color}-400`}>{stat.value}</div>
                <div className="text-xs text-emerald-400">{stat.change}</div>
              </div>
            ))}
          </div>

          {/* DeFi Protocols */}
          <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-4">
            <h3 className="text-sm font-bold text-white mb-3">🌾 Active DeFi Positions</h3>
            <div className="space-y-2">
              {[
                { protocol: 'Uniswap V3', pair: 'PREMALTA/USDC', tvl: '$2.4M', apy: '34.5%', network: 'Base' },
                { protocol: 'Aave V3', pair: 'USDC Supply', tvl: '$1.2M', apy: '8.7%', network: 'Ethereum' },
                { protocol: 'Lido', pair: 'stETH Staking', tvl: '$0.8M', apy: '4.2%', network: 'Ethereum' },
                { protocol: 'Curve Finance', pair: 'HYPHA/3pool', tvl: '$0.4M', apy: '22.1%', network: 'Arbitrum' },
              ].map((pos, i) => (
                <div key={i} className="flex items-center gap-3 bg-slate-800/30 rounded-lg p-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-sm">🔗</div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-white">{pos.protocol} · {pos.pair}</div>
                    <div className="text-[10px] text-slate-400">{pos.network}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-white">{pos.tvl}</div>
                    <div className="text-xs text-emerald-400 font-bold">{pos.apy} APY</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Roadmap */}
      {activeTab === 'roadmap' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                phase: 'Phase 1: Foundation',
                period: 'Q1 2025 · NOW',
                status: 'active',
                items: [
                  { done: true, text: 'PREMALTA token deployed on Base' },
                  { done: true, text: 'GANI HYPHA Marketplace launched' },
                  { done: true, text: '9 AI Agent blueprints live' },
                  { done: true, text: 'Revenue Hub + TokenLaunchPad' },
                  { done: false, text: 'PREMALTA/USDC liquidity pool' },
                  { done: false, text: '100 SaaS users onboarded' },
                ],
                color: 'indigo',
              },
              {
                phase: 'Phase 2: Growth Engine',
                period: 'Q2 2025',
                status: 'building',
                items: [
                  { done: false, text: 'Supabase production database' },
                  { done: false, text: 'Real Groq AI integration' },
                  { done: false, text: 'Staking contracts deployed' },
                  { done: false, text: '$PROPRT + $BARBER industry tokens' },
                  { done: false, text: '1,000 MAU target' },
                  { done: false, text: '$115K MRR milestone' },
                ],
                color: 'purple',
              },
              {
                phase: 'Phase 3: Scale',
                period: 'Q3-Q4 2025',
                status: 'planned',
                items: [
                  { done: false, text: 'NFT Founder Pods launch' },
                  { done: false, text: 'CEX listings (Indodax, Gate.io)' },
                  { done: false, text: 'Cross-chain bridge deployment' },
                  { done: false, text: '10,000 MAU target' },
                  { done: false, text: '$498K MRR milestone' },
                  { done: false, text: 'Enterprise API partnerships' },
                ],
                color: 'pink',
              },
              {
                phase: 'Phase 4: Web5 Sovereignty',
                period: 'Q1-Q2 2026',
                status: 'vision',
                items: [
                  { done: false, text: 'DWN (Decentralized Web Nodes)' },
                  { done: false, text: 'Fully autonomous AI economy' },
                  { done: false, text: 'Zero-knowledge proof identity' },
                  { done: false, text: '$2M+ MRR target' },
                  { done: false, text: 'Binance/Coinbase listing' },
                  { done: false, text: 'DAO full governance' },
                ],
                color: 'teal',
              },
            ].map((phase) => (
              <div key={phase.phase} className={`bg-${phase.color}-500/5 border border-${phase.color}-500/20 rounded-2xl p-4`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className={`text-sm font-black text-${phase.color}-400`}>{phase.phase}</h3>
                    <div className="text-[10px] text-slate-400">{phase.period}</div>
                  </div>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                    phase.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                    phase.status === 'building' ? 'bg-yellow-500/20 text-yellow-400' :
                    phase.status === 'planned' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-purple-500/20 text-purple-400'
                  }`}>
                    {phase.status}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {phase.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className={`text-xs mt-0.5 ${item.done ? 'text-emerald-400' : 'text-slate-600'}`}>
                        {item.done ? '✓' : '○'}
                      </span>
                      <span className={`text-xs ${item.done ? 'text-slate-300' : 'text-slate-500'}`}>{item.text}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3">
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r from-${phase.color}-500 to-${phase.color}-400`}
                      style={{ width: `${(phase.items.filter(i => i.done).length / phase.items.length) * 100}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    {phase.items.filter(i => i.done).length}/{phase.items.length} complete
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AutonomousEconomy;
