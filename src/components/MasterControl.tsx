// ============================================================
// GANI HYPHA — Master Control Room v5.0
// Unified Command Center for entire HYPHA ecosystem
// Real-time monitoring, control, and orchestration
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface SystemMetric {
  name: string;
  value: string | number;
  status: 'healthy' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  icon: string;
}

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  source: string;
  message: string;
}

interface NetworkNode {
  id: string;
  label: string;
  type: 'core' | 'api' | 'chain' | 'ai' | 'storage';
  status: 'online' | 'offline' | 'syncing';
  connections: number;
  tps: number;
}

const INITIAL_LOGS: LogEntry[] = [
  { id: '1', timestamp: '15:42:01', level: 'SUCCESS', source: 'GANI-CORE', message: '🚀 GANI HYPHA v5.0 Master Engine initialized. Akar Dalam, Cabang Tinggi!' },
  { id: '2', timestamp: '15:42:02', level: 'INFO', source: 'GROQ-AI', message: '🤖 Connecting to llama-3.3-70b API... 124ms latency. Model ready.' },
  { id: '3', timestamp: '15:42:03', level: 'SUCCESS', source: 'ALCHEMY', message: '⟠ Ethereum RPC connected. Block #19,847,234. Gas: 12 Gwei.' },
  { id: '4', timestamp: '15:42:04', level: 'INFO', source: 'CLOUDFLARE', message: '🌐 Edge Workers deployed to 247 PoPs worldwide.' },
  { id: '5', timestamp: '15:42:05', level: 'SUCCESS', source: 'PREMALTA', message: '🔵 $PREMALTA contract verified on Base. 0xC0125651...C94c7' },
  { id: '6', timestamp: '15:42:06', level: 'INFO', source: 'DWN-NODE', message: '🕸️ Decentralized Web Node syncing... 78.4% complete.' },
  { id: '7', timestamp: '15:42:07', level: 'SUCCESS', source: 'UNISWAP', message: '🦄 PREMALTA/USDC pool active on Base. TVL: $2.4M' },
  { id: '8', timestamp: '15:42:08', level: 'INFO', source: 'LANGCHAIN', message: '⛓️ LangChain orchestrator active. 6 agents running.' },
];

const NETWORK_NODES: NetworkNode[] = [
  { id: 'core', label: 'GANI Core', type: 'core', status: 'online', connections: 12, tps: 245 },
  { id: 'groq', label: 'Groq AI', type: 'ai', status: 'online', connections: 6, tps: 89 },
  { id: 'eth', label: 'Ethereum', type: 'chain', status: 'online', connections: 4, tps: 15 },
  { id: 'base', label: 'Base L2', type: 'chain', status: 'online', connections: 4, tps: 450 },
  { id: 'cf', label: 'Cloudflare', type: 'api', status: 'online', connections: 247, tps: 1240 },
  { id: 'ipfs', label: 'IPFS/Pinata', type: 'storage', status: 'online', connections: 3, tps: 24 },
  { id: 'polygon', label: 'Polygon', type: 'chain', status: 'syncing', connections: 2, tps: 120 },
  { id: 'arb', label: 'Arbitrum', type: 'chain', status: 'online', connections: 2, tps: 380 },
];

const MasterControl: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'logs' | 'network' | 'deploy' | 'alerts'>('dashboard');
  const [metricsHistory, setMetricsHistory] = useState<{ time: string; cpu: number; memory: number; rps: number }[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([
    { name: 'Edge Workers', value: '247 PoPs', status: 'healthy', trend: 'stable', icon: '🌐' },
    { name: 'API Latency', value: '24ms', status: 'healthy', trend: 'down', icon: '⚡' },
    { name: 'Groq Calls/hr', value: 1847, status: 'healthy', trend: 'up', icon: '🤖' },
    { name: 'Block Height', value: 19847234, status: 'healthy', trend: 'up', icon: '⛓️' },
    { name: 'Gas Price', value: '12 Gwei', status: 'healthy', trend: 'down', icon: '⛽' },
    { name: 'DWN Sync', value: '78.4%', status: 'warning', trend: 'up', icon: '🕸️' },
    { name: 'Pod Health', value: '100%', status: 'healthy', trend: 'stable', icon: '🎯' },
    { name: 'Revenue/hr', value: '$142', status: 'healthy', trend: 'up', icon: '💰' },
  ]);
  const [commandInput, setCommandInput] = useState('');
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Generate metrics history
  useEffect(() => {
    const history = Array.from({ length: 20 }, (_, i) => ({
      time: `T-${20 - i}m`,
      cpu: Math.floor(Math.random() * 30 + 20),
      memory: Math.floor(Math.random() * 25 + 40),
      rps: Math.floor(Math.random() * 500 + 800),
    }));
    setMetricsHistory(history);
  }, []);

  // Live log updates
  useEffect(() => {
    const logMessages = [
      { level: 'INFO' as const, source: 'GROQ-AI', message: `📊 Processed ${Math.floor(Math.random() * 50 + 10)} AI requests. Avg latency: ${Math.floor(Math.random() * 50 + 80)}ms` },
      { level: 'SUCCESS' as const, source: 'YIELD-BOT', message: `💰 Yield harvested: $${(Math.random() * 5 + 1).toFixed(2)} USDC from Aave V3` },
      { level: 'INFO' as const, source: 'ALCHEMY', message: `⟠ Block #${19847234 + Math.floor(Math.random() * 100)} finalized. ${Math.floor(Math.random() * 200 + 50)} txns` },
      { level: 'INFO' as const, source: 'LANGCHAIN', message: `⛓️ Workflow completed: ${['lead-qual', 'contract-analysis', 'yield-opt', 'content-gen'][Math.floor(Math.random() * 4)]}` },
      { level: 'SUCCESS' as const, source: 'PREMALTA', message: `🔵 Trade executed: ${(Math.random() * 1000 + 100).toFixed(0)} PREMALTA @ $0.004${Math.floor(Math.random() * 9)}` },
      { level: 'WARNING' as const, source: 'DWN-NODE', message: `⚠️ Node sync at ${(Math.random() * 20 + 70).toFixed(1)}%. High load detected.` },
    ];

    const interval = setInterval(() => {
      const randomMsg = logMessages[Math.floor(Math.random() * logMessages.length)];
      const newLog: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        ...randomMsg,
      };
      setLogs(prev => [newLog, ...prev].slice(0, 50));

      // Update random metric
      setSystemMetrics(prev => {
        const idx = Math.floor(Math.random() * prev.length);
        const updated = [...prev];
        if (updated[idx].name === 'Groq Calls/hr') {
          updated[idx] = { ...updated[idx], value: Math.floor(Math.random() * 500 + 1500) };
        } else if (updated[idx].name === 'Block Height') {
          updated[idx] = { ...updated[idx], value: (updated[idx].value as number) + Math.floor(Math.random() * 3) };
        } else if (updated[idx].name === 'Revenue/hr') {
          updated[idx] = { ...updated[idx], value: `$${Math.floor(Math.random() * 50 + 120)}` };
        }
        return updated;
      });

      // Update metrics history
      setMetricsHistory(prev => {
        const newPoint = {
          time: new Date().toLocaleTimeString('en-US', { hour12: false, second: '2-digit' }),
          cpu: Math.floor(Math.random() * 30 + 20),
          memory: Math.floor(Math.random() * 25 + 40),
          rps: Math.floor(Math.random() * 500 + 800),
        };
        return [...prev.slice(-19), newPoint];
      });
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;
    
    const cmd = commandInput.toLowerCase().trim();
    let response = '';
    
    if (cmd === 'status') response = '✅ All systems operational. 247 PoPs online. No critical alerts.';
    else if (cmd === 'help') response = 'Commands: status | agents | revenue | deploy | logs | clear';
    else if (cmd === 'agents') response = `🤖 6 AI agents active. GANI Master (99.2%), Yield Optimizer (97.8%), Trade Sentinel (94.5%)...`;
    else if (cmd === 'revenue') response = `💰 Current MRR: $237,700. Top stream: AI Agent Pods $89K/mo. Total ARR projection: $2.85M`;
    else if (cmd === 'clear') { setLogs([]); setCommandInput(''); return; }
    else response = `Unknown command: "${commandInput}". Type 'help' for available commands.`;
    
    const newLog: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      level: 'INFO',
      source: 'CONSOLE',
      message: `> ${commandInput}`,
    };
    const responseLog: LogEntry = {
      id: (Date.now() + 1).toString(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      level: 'SUCCESS',
      source: 'SYSTEM',
      message: response,
    };
    setLogs(prev => [responseLog, newLog, ...prev].slice(0, 50));
    setCommandInput('');
    setActiveTab('logs');
  };

  const nodeTypeColors: Record<string, string> = {
    core: 'from-indigo-500 to-purple-500',
    ai: 'from-purple-500 to-pink-500',
    chain: 'from-amber-500 to-orange-500',
    api: 'from-blue-500 to-cyan-500',
    storage: 'from-teal-500 to-emerald-500',
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-600 flex items-center justify-center text-lg shadow-lg">
              🎛️
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
                Master Control Room
                <span className="ml-2 text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full animate-pulse">● LIVE</span>
              </h1>
              <p className="text-xs text-slate-400">Real-time monitoring · Orchestration · System command</p>
            </div>
          </div>

          {/* Quick command */}
          <form onSubmit={handleCommand} className="flex gap-2">
            <input
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder="Type command... (status, help, agents)"
              className="bg-slate-900/80 border border-slate-700 text-white text-xs px-3 py-2 rounded-lg font-mono w-56 focus:outline-none focus:border-indigo-500 placeholder-slate-600"
            />
            <button type="submit" className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs px-3 py-2 rounded-lg font-bold transition-all">
              Run
            </button>
          </form>
        </div>

        {/* System Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 mt-4">
          {systemMetrics.map(metric => (
            <div key={metric.name} className={`rounded-xl p-2 text-center border ${
              metric.status === 'healthy' ? 'bg-emerald-500/5 border-emerald-500/10' :
              metric.status === 'warning' ? 'bg-yellow-500/5 border-yellow-500/20' :
              'bg-red-500/5 border-red-500/20'
            }`}>
              <div className="text-sm mb-0.5">{metric.icon}</div>
              <div className={`text-xs font-black ${
                metric.status === 'healthy' ? 'text-emerald-400' :
                metric.status === 'warning' ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
              </div>
              <div className="text-[8px] text-slate-500 truncate">{metric.name}</div>
              <div className="text-[8px] text-slate-600">
                {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 overflow-x-auto scrollbar-hide">
        {(['dashboard', 'logs', 'network', 'deploy', 'alerts'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
              activeTab === tab ? 'bg-slate-600 text-white shadow-lg' : 'bg-slate-800/50 text-slate-400 hover:text-white'
            }`}
          >
            {tab === 'dashboard' && '📊 '}
            {tab === 'logs' && '📋 '}
            {tab === 'network' && '🌐 '}
            {tab === 'deploy' && '🚀 '}
            {tab === 'alerts' && '🔔 '}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Performance Chart */}
            <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-4">
              <h3 className="text-sm font-bold text-white mb-3">⚡ System Performance · Live</h3>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={metricsHistory}>
                    <defs>
                      <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="rpsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="time" tick={{ fill: '#475569', fontSize: 8 }} />
                    <YAxis tick={{ fill: '#475569', fontSize: 8 }} />
                    <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', fontSize: '11px' }} />
                    <Area type="monotone" dataKey="cpu" stroke="#6366f1" fill="url(#cpuGrad)" strokeWidth={1.5} name="CPU %" />
                    <Area type="monotone" dataKey="rps" stroke="#10b981" fill="url(#rpsGrad)" strokeWidth={1.5} name="Requests/s" yAxisId={0} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Network nodes overview */}
            <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-4">
              <h3 className="text-sm font-bold text-white mb-3">🌐 Network Nodes Status</h3>
              <div className="grid grid-cols-2 gap-2">
                {NETWORK_NODES.map(node => (
                  <div key={node.id} className="bg-slate-800/40 rounded-lg p-2 flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      node.status === 'online' ? 'bg-emerald-400' :
                      node.status === 'syncing' ? 'bg-yellow-400 animate-pulse' : 'bg-red-400'
                    }`} />
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold text-white truncate">{node.label}</div>
                      <div className="text-[9px] text-slate-500">{node.tps} TPS</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-4">
            <h3 className="text-sm font-bold text-white mb-3">⚡ Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Deploy New Pod', icon: '🚀', color: 'indigo', action: () => {} },
                { label: 'Harvest Yield', icon: '🌾', color: 'emerald', action: () => {} },
                { label: 'Mint DID', icon: '🪪', color: 'blue', action: () => {} },
                { label: 'Submit Proposal', icon: '🏛️', color: 'purple', action: () => {} },
                { label: 'Pin to IPFS', icon: '📌', color: 'pink', action: () => {} },
                { label: 'Add Liquidity', icon: '💧', color: 'cyan', action: () => {} },
                { label: 'Stake HYPHA', icon: '🌿', color: 'teal', action: () => {} },
                { label: 'Export Data', icon: '📦', color: 'amber', action: () => {} },
              ].map(action => (
                <button
                  key={action.label}
                  onClick={action.action}
                  className={`bg-${action.color}-500/10 hover:bg-${action.color}-500/20 border border-${action.color}-500/20 hover:border-${action.color}-500/40 rounded-xl p-3 text-center transition-all group`}
                >
                  <div className="text-xl mb-1 group-hover:scale-110 transition-transform">{action.icon}</div>
                  <div className={`text-[10px] font-bold text-${action.color}-400`}>{action.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Logs Tab */}
      {activeTab === 'logs' && (
        <div className="bg-slate-900/80 border border-slate-700/50 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>📋</span> System Logs · Live Feed
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </h3>
            <button
              onClick={() => setLogs([])}
              className="text-[10px] text-slate-400 hover:text-white transition-colors"
            >
              Clear
            </button>
          </div>
          <div className="h-96 overflow-y-auto font-mono text-xs space-y-0.5 custom-scrollbar">
            {logs.map(log => (
              <div key={log.id} className="flex gap-2 hover:bg-slate-800/30 px-2 py-0.5 rounded transition-colors">
                <span className="text-slate-600 flex-shrink-0">{log.timestamp}</span>
                <span className={`flex-shrink-0 font-bold w-12 ${
                  log.level === 'SUCCESS' ? 'text-emerald-400' :
                  log.level === 'WARNING' ? 'text-yellow-400' :
                  log.level === 'ERROR' ? 'text-red-400' : 'text-blue-400'
                }`}>
                  {log.level.substring(0, 4)}
                </span>
                <span className="text-purple-400 flex-shrink-0 w-20 truncate">[{log.source}]</span>
                <span className="text-slate-300">{log.message}</span>
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        </div>
      )}

      {/* Network Tab */}
      {activeTab === 'network' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {NETWORK_NODES.map(node => (
              <div key={node.id} className="bg-slate-900/60 border border-slate-700/30 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${nodeTypeColors[node.type]} flex items-center justify-center text-sm`}>
                      {node.type === 'core' ? '⚙️' : node.type === 'ai' ? '🤖' : node.type === 'chain' ? '⛓️' : node.type === 'api' ? '🔌' : '💾'}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{node.label}</div>
                      <div className="text-[10px] text-slate-400 capitalize">{node.type}</div>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] font-bold ${
                    node.status === 'online' ? 'text-emerald-400' : node.status === 'syncing' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      node.status === 'online' ? 'bg-emerald-400' : node.status === 'syncing' ? 'bg-yellow-400 animate-pulse' : 'bg-red-400'
                    }`} />
                    {node.status.toUpperCase()}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-slate-800/40 rounded-lg p-2">
                    <div className="text-sm font-black text-white">{node.tps.toLocaleString()}</div>
                    <div className="text-[9px] text-slate-500">TPS</div>
                  </div>
                  <div className="bg-slate-800/40 rounded-lg p-2">
                    <div className="text-sm font-black text-white">{node.connections}</div>
                    <div className="text-[9px] text-slate-500">Connections</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deploy Tab */}
      {activeTab === 'deploy' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Deployment pipeline */}
            <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-4">
              <h3 className="text-sm font-bold text-white mb-3">🚀 Deployment Pipeline</h3>
              <div className="space-y-3">
                {[
                  { step: 'Build', status: 'done', time: '24s', icon: '🔨' },
                  { step: 'Test', status: 'done', time: '8s', icon: '✅' },
                  { step: 'Deploy Cloudflare', status: 'done', time: '12s', icon: '☁️' },
                  { step: 'IPFS Pin', status: 'done', time: '3s', icon: '📌' },
                  { step: 'GitHub Push', status: 'done', time: '2s', icon: '🐙' },
                  { step: 'DWN Sync', status: 'running', time: '...', icon: '🕸️' },
                  { step: 'Alert Users', status: 'pending', time: '-', icon: '🔔' },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      step.status === 'done' ? 'bg-emerald-500/20 text-emerald-400' :
                      step.status === 'running' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-slate-700/50 text-slate-500'
                    }`}>
                      {step.status === 'done' ? '✓' : step.status === 'running' ? '⟳' : '○'}
                    </div>
                    <div className="flex-1 text-sm">
                      <span className="text-xs font-bold text-white">{step.step}</span>
                    </div>
                    <span className={`text-[10px] font-mono ${
                      step.status === 'done' ? 'text-emerald-400' : step.status === 'running' ? 'text-yellow-400 animate-pulse' : 'text-slate-500'
                    }`}>{step.time}</span>
                    <span className="text-sm">{step.icon}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Environment info */}
            <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-4">
              <h3 className="text-sm font-bold text-white mb-3">🌐 Environment Configuration</h3>
              <div className="space-y-2">
                {[
                  { key: 'Platform', value: 'Cloudflare Pages', status: '✅' },
                  { key: 'Framework', value: 'Hono v4 + React 19', status: '✅' },
                  { key: 'Build Dir', value: '/dist', status: '✅' },
                  { key: 'GROQ_API_KEY', value: 'gsk_yF6...', status: '✅' },
                  { key: 'ALCHEMY_KEY', value: 'TOHei2x...', status: '✅' },
                  { key: 'PINATA_JWT', value: 'eyJhbGc...', status: '✅' },
                  { key: 'SUPABASE_URL', value: '⚠️ Not configured', status: '⚠️' },
                  { key: 'Branch', value: 'main', status: '✅' },
                ].map(env => (
                  <div key={env.key} className="flex items-center justify-between bg-slate-800/40 rounded-lg px-3 py-1.5">
                    <span className="text-xs font-mono text-slate-300">{env.key}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-400">{env.value}</span>
                      <span className="text-xs">{env.status}</span>
                    </div>
                  </div>
                ))}
              </div>
              <a
                href="https://gani-hypha-web3.pages.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block text-center bg-indigo-500 hover:bg-indigo-600 text-white text-xs py-2 rounded-lg font-bold transition-all"
              >
                🚀 View Production → gani-hypha-web3.pages.dev
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="space-y-3">
          {[
            { level: 'warning', title: 'DWN Sync Incomplete', desc: 'Node 3 sync at 78.4%. Consider adding more storage.', time: '5m ago', action: 'Resolve' },
            { level: 'info', title: 'PREMALTA Pool Ready', desc: 'PREMALTA/USDC pool on Uniswap Base is ready for liquidity.', time: '1h ago', action: 'Add Liquidity' },
            { level: 'info', title: 'Supabase Not Connected', desc: 'Production database not configured. Using fallback data.', time: '2h ago', action: 'Configure' },
            { level: 'success', title: 'Deployment Successful', desc: 'GANI HYPHA v5.0 deployed to gani-hypha-web3.pages.dev', time: '3h ago', action: 'View' },
            { level: 'success', title: 'GitHub Sync Complete', desc: 'All changes pushed to Estes786/Agnt-Mrket-place-Web-3-Web-4-5', time: '3h ago', action: 'View' },
          ].map((alert, i) => (
            <div key={i} className={`flex items-start gap-3 rounded-xl p-4 border ${
              alert.level === 'warning' ? 'bg-yellow-500/5 border-yellow-500/20' :
              alert.level === 'success' ? 'bg-emerald-500/5 border-emerald-500/20' :
              'bg-blue-500/5 border-blue-500/20'
            }`}>
              <span className="text-xl flex-shrink-0">
                {alert.level === 'warning' ? '⚠️' : alert.level === 'success' ? '✅' : 'ℹ️'}
              </span>
              <div className="flex-1">
                <div className="text-sm font-bold text-white">{alert.title}</div>
                <div className="text-xs text-slate-400 mt-0.5">{alert.desc}</div>
                <div className="text-[10px] text-slate-500 mt-1">{alert.time}</div>
              </div>
              <button className={`text-xs font-bold px-3 py-1 rounded-lg transition-all ${
                alert.level === 'warning' ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' :
                alert.level === 'success' ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' :
                'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
              }`}>
                {alert.action}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MasterControl;
