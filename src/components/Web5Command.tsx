// ============================================================
// GANI HYPHA — Web5 Command Center v5.0
// Decentralized Web Nodes · DID · Data Sovereignty
// Self-sovereign identity + autonomous data management
// ============================================================

import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';

interface DWNNode {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'syncing' | 'offline';
  storage: number;
  storageMax: number;
  latency: number;
  protocols: string[];
  uptime: number;
}

interface DIDRecord {
  did: string;
  method: string;
  network: string;
  created: string;
  status: 'verified' | 'pending' | 'revoked';
  credentials: number;
}

interface ProtocolDef {
  name: string;
  uri: string;
  description: string;
  status: 'active' | 'beta' | 'draft';
  dataTypes: string[];
}

const DWN_NODES: DWNNode[] = [
  { id: 'node-1', name: 'GANI Primary Node', location: 'Cloudflare Edge · Indonesia', status: 'online', storage: 45.6, storageMax: 100, latency: 12, protocols: ['HYPHA/1.0', 'Commerce/1.0', 'Identity/2.0'], uptime: 99.97 },
  { id: 'node-2', name: 'Replica Node Alpha', location: 'Cloudflare Edge · Singapore', status: 'online', storage: 23.4, storageMax: 100, latency: 18, protocols: ['HYPHA/1.0', 'Media/1.0'], uptime: 99.89 },
  { id: 'node-3', name: 'Backup Node Beta', location: 'IPFS Network', status: 'syncing', storage: 12.8, storageMax: 50, latency: 45, protocols: ['Identity/2.0'], uptime: 98.40 },
];

const DID_RECORDS: DIDRecord[] = [
  { did: 'did:ethr:mainnet:0x742d35Cc6634C0532925a3b8', method: 'ethr', network: 'Ethereum', created: '2024-11-15', status: 'verified', credentials: 12 },
  { did: 'did:web:gani.hypha.id', method: 'web', network: 'Web2/Web3', created: '2024-12-01', status: 'verified', credentials: 8 },
  { did: 'did:ion:EiBD5M8qFu1yNNv2p1', method: 'ion', network: 'Bitcoin ION', created: '2025-01-10', status: 'pending', credentials: 3 },
];

const WEB5_PROTOCOLS: ProtocolDef[] = [
  { name: 'HYPHA Commerce', uri: 'https://hypha.id/protocols/commerce/1.0', description: 'Decentralized commerce protocol for AI agent pod purchases', status: 'active', dataTypes: ['Invoice', 'Order', 'Payment', 'Subscription'] },
  { name: 'Agent Identity', uri: 'https://hypha.id/protocols/identity/2.0', description: 'Self-sovereign identity for AI agents and human users', status: 'active', dataTypes: ['Profile', 'Credential', 'Reputation', 'DID'] },
  { name: 'Media Archive', uri: 'https://hypha.id/protocols/media/1.0', description: 'Decentralized media storage and content addressing', status: 'beta', dataTypes: ['Video', 'Image', 'Audio', 'Document'] },
  { name: 'DAO Governance', uri: 'https://hypha.id/protocols/dao/1.0', description: 'On-chain governance proposals and voting records', status: 'active', dataTypes: ['Proposal', 'Vote', 'Treasury', 'Epoch'] },
  { name: 'DeFi Signals', uri: 'https://hypha.id/protocols/defi/1.0', description: 'Decentralized trading signals and yield strategies', status: 'beta', dataTypes: ['Signal', 'Position', 'Strategy', 'Alert'] },
];

const Web5Command: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'nodes' | 'identity' | 'protocols' | 'data' | 'sovereignty'>('nodes');
  const [syncProgress, setSyncProgress] = useState(78.4);
  const [dataPoints, setDataPoints] = useState<{ time: string; write: number; read: number; sync: number }[]>([]);
  const [selectedNode, setSelectedNode] = useState<DWNNode | null>(null);

  useEffect(() => {
    // Generate DWN activity data
    const points = Array.from({ length: 20 }, (_, i) => ({
      time: `T-${20 - i}m`,
      write: Math.floor(Math.random() * 500 + 100),
      read: Math.floor(Math.random() * 1200 + 400),
      sync: Math.floor(Math.random() * 300 + 50),
    }));
    setDataPoints(points);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        const next = prev + (Math.random() * 0.5 - 0.1);
        return Math.min(100, Math.max(70, next));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const sovereigntyData = [
    { subject: 'Data Control', A: 95 },
    { subject: 'Identity', A: 88 },
    { subject: 'Compute', A: 72 },
    { subject: 'Storage', A: 84 },
    { subject: 'Privacy', A: 91 },
    { subject: 'Portability', A: 79 },
  ];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 flex items-center justify-center text-lg shadow-lg shadow-teal-500/30">
            🕸️
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
              Web5 Command Center
              <span className="ml-2 text-xs font-bold text-teal-400 bg-teal-400/10 px-2 py-0.5 rounded-full">SOVEREIGN</span>
            </h1>
            <p className="text-xs text-slate-400">Decentralized Web Nodes · Self-Sovereign Identity · Data Sovereignty</p>
          </div>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {[
            { label: 'Active DWN Nodes', value: `${DWN_NODES.filter(n => n.status === 'online').length}/${DWN_NODES.length}`, icon: '🕸️', color: 'teal' },
            { label: 'DID Identities', value: DID_RECORDS.length.toString(), icon: '🪪', color: 'blue' },
            { label: 'Global Sync', value: `${syncProgress.toFixed(1)}%`, icon: '🔄', color: 'cyan' },
            { label: 'Protocols Active', value: `${WEB5_PROTOCOLS.filter(p => p.status === 'active').length}/${WEB5_PROTOCOLS.length}`, icon: '⚡', color: 'purple' },
          ].map(stat => (
            <div key={stat.label} className={`bg-${stat.color}-500/5 border border-${stat.color}-500/20 rounded-xl p-3`}>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-sm">{stat.icon}</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest">{stat.label}</span>
              </div>
              <div className={`text-xl font-black text-${stat.color}-400`}>{stat.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 overflow-x-auto scrollbar-hide">
        {(['nodes', 'identity', 'protocols', 'data', 'sovereignty'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
              activeTab === tab ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30' : 'bg-slate-800/50 text-slate-400 hover:text-white'
            }`}
          >
            {tab === 'nodes' && '🕸️ '}
            {tab === 'identity' && '🪪 '}
            {tab === 'protocols' && '⚡ '}
            {tab === 'data' && '📦 '}
            {tab === 'sovereignty' && '👑 '}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Nodes Tab */}
      {activeTab === 'nodes' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DWN_NODES.map(node => (
              <div
                key={node.id}
                onClick={() => setSelectedNode(selectedNode?.id === node.id ? null : node)}
                className={`cursor-pointer bg-slate-900/60 border rounded-2xl p-4 transition-all ${
                  selectedNode?.id === node.id ? 'border-teal-500/50 shadow-lg shadow-teal-500/10' : 'border-slate-700/30 hover:border-slate-600/50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                      node.status === 'online' ? 'bg-emerald-400' :
                      node.status === 'syncing' ? 'bg-yellow-400' : 'bg-red-400'
                    }`} />
                    <span className="text-sm font-black text-white">{node.name}</span>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    node.status === 'online' ? 'bg-emerald-500/20 text-emerald-400' :
                    node.status === 'syncing' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {node.status}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mb-3">📍 {node.location}</div>

                {/* Storage */}
                <div className="mb-2">
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-slate-400">Storage</span>
                    <span className="text-teal-400 font-bold">{node.storage}GB / {node.storageMax}GB</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-400" style={{ width: `${(node.storage / node.storageMax) * 100}%` }} />
                  </div>
                </div>

                <div className="flex gap-3 text-[10px]">
                  <span className="text-slate-400">Latency: <strong className="text-white">{node.latency}ms</strong></span>
                  <span className="text-slate-400">Uptime: <strong className="text-emerald-400">{node.uptime}%</strong></span>
                </div>

                <div className="mt-2 flex flex-wrap gap-1">
                  {node.protocols.map(p => (
                    <span key={p} className="text-[9px] bg-teal-500/10 text-teal-400 px-1.5 py-0.5 rounded-md font-mono">{p}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* DWN Activity Chart */}
          <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-4">
            <h3 className="text-sm font-bold text-white mb-3">📡 DWN Activity · Last 20 Minutes</h3>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dataPoints}>
                  <defs>
                    {[['write', '#14b8a6'], ['read', '#6366f1'], ['sync', '#8b5cf6']].map(([key, color]) => (
                      <linearGradient key={key} id={`dwnGrad-${key}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" tick={{ fill: '#475569', fontSize: 9 }} />
                  <YAxis tick={{ fill: '#475569', fontSize: 9 }} />
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="write" stroke="#14b8a6" fill="url(#dwnGrad-write)" strokeWidth={1.5} name="Write ops/s" />
                  <Area type="monotone" dataKey="read" stroke="#6366f1" fill="url(#dwnGrad-read)" strokeWidth={1.5} name="Read ops/s" />
                  <Area type="monotone" dataKey="sync" stroke="#8b5cf6" fill="url(#dwnGrad-sync)" strokeWidth={1.5} name="Sync ops/s" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Identity Tab */}
      {activeTab === 'identity' && (
        <div className="space-y-4">
          <div className="space-y-3">
            {DID_RECORDS.map(did => (
              <div key={did.did} className="bg-slate-900/60 border border-slate-700/30 rounded-2xl p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm">🪪</span>
                      <code className="text-xs font-mono text-teal-300 truncate">{did.did}</code>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mt-2">
                      <div>
                        <div className="text-[9px] text-slate-500 uppercase">Method</div>
                        <div className="text-xs font-bold text-white">did:{did.method}</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-slate-500 uppercase">Network</div>
                        <div className="text-xs font-bold text-white">{did.network}</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-slate-500 uppercase">Credentials</div>
                        <div className="text-xs font-bold text-blue-400">{did.credentials} VCs</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      did.status === 'verified' ? 'bg-emerald-500/20 text-emerald-400' :
                      did.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {did.status}
                    </span>
                    <div className="text-[10px] text-slate-500">{did.created}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Create DID */}
          <div className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-500/20 rounded-2xl p-4">
            <h3 className="text-sm font-bold text-white mb-3">➕ Create New DID Identity</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { method: 'did:ethr', network: 'Ethereum/Base', icon: '⟠' },
                { method: 'did:web', network: 'HYPHA Domain', icon: '🌐' },
                { method: 'did:ion', network: 'Bitcoin Layer 2', icon: '₿' },
              ].map(opt => (
                <button key={opt.method} className="bg-slate-800/50 hover:bg-teal-500/10 border border-slate-700/50 hover:border-teal-500/30 rounded-xl p-3 text-center transition-all">
                  <div className="text-xl mb-1">{opt.icon}</div>
                  <div className="text-xs font-bold text-white">{opt.method}</div>
                  <div className="text-[9px] text-slate-400">{opt.network}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Protocols Tab */}
      {activeTab === 'protocols' && (
        <div className="space-y-3">
          {WEB5_PROTOCOLS.map(proto => (
            <div key={proto.name} className="bg-slate-900/60 border border-slate-700/30 hover:border-teal-500/20 rounded-2xl p-4 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">⚡</span>
                    <h3 className="text-sm font-black text-white">{proto.name}</h3>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      proto.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                      proto.status === 'beta' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-slate-500/20 text-slate-400'
                    }`}>
                      {proto.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-2">{proto.description}</p>
                  <code className="text-[10px] font-mono text-teal-400/70">{proto.uri}</code>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {proto.dataTypes.map(dt => (
                      <span key={dt} className="text-[9px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">{dt}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Data Tab */}
      {activeTab === 'data' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Total Data Stored', value: '81.8 GB', sub: 'Across 3 DWN nodes', icon: '💾', color: 'teal' },
              { title: 'Records Indexed', value: '284,751', sub: 'DWN protocol records', icon: '📦', color: 'blue' },
              { title: 'Data Sovereignty', value: '100%', sub: 'User-controlled', icon: '👑', color: 'purple' },
            ].map(card => (
              <div key={card.title} className={`bg-${card.color}-500/5 border border-${card.color}-500/20 rounded-2xl p-4`}>
                <div className="text-2xl mb-2">{card.icon}</div>
                <div className={`text-2xl font-black text-${card.color}-400`}>{card.value}</div>
                <div className="text-xs text-slate-400 mt-1">{card.title}</div>
                <div className="text-[10px] text-slate-500">{card.sub}</div>
              </div>
            ))}
          </div>

          {/* Data types breakdown */}
          <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-4">
            <h3 className="text-sm font-bold text-white mb-3">📦 Data Records by Protocol</h3>
            <div className="space-y-2">
              {[
                { protocol: 'HYPHA Commerce', records: 45230, size: '12.4 GB', icon: '💼' },
                { protocol: 'Agent Identity', records: 18920, size: '2.1 GB', icon: '🪪' },
                { protocol: 'Media Archive', records: 12450, size: '48.7 GB', icon: '🎬' },
                { protocol: 'DAO Governance', records: 8901, size: '0.8 GB', icon: '🏛️' },
                { protocol: 'DeFi Signals', records: 199250, size: '17.8 GB', icon: '📈' },
              ].map(d => (
                <div key={d.protocol} className="flex items-center gap-3 bg-slate-800/30 rounded-lg p-3">
                  <span className="text-base">{d.icon}</span>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-white">{d.protocol}</div>
                    <div className="text-[10px] text-slate-400">{d.records.toLocaleString()} records</div>
                  </div>
                  <div className="text-xs font-mono text-teal-400 font-bold">{d.size}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sovereignty Tab */}
      {activeTab === 'sovereignty' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Radar chart */}
            <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-4">
              <h3 className="text-sm font-bold text-white mb-3">👑 Sovereignty Radar</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={sovereigntyData}>
                    <PolarGrid stroke="#1e293b" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                    <Radar name="GANI HYPHA" dataKey="A" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.2} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Principles */}
            <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-4">
              <h3 className="text-sm font-bold text-white mb-3">🌿 Web5 Sovereignty Principles</h3>
              <div className="space-y-3">
                {[
                  { principle: 'Self-Sovereign Identity', score: 95, desc: 'Users own their DIDs, no central authority' },
                  { principle: 'Decentralized Storage', score: 84, desc: 'Data in DWN nodes, not corporate servers' },
                  { principle: 'Open Protocols', score: 91, desc: 'Public, permissionless protocol definitions' },
                  { principle: 'Economic Autonomy', score: 88, desc: 'AI agents earn independently via smart contracts' },
                  { principle: 'Privacy Preservation', score: 79, desc: 'ZK proofs + selective disclosure' },
                ].map(p => (
                  <div key={p.principle}>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-white font-bold">{p.principle}</span>
                      <span className="text-teal-400 font-bold">{p.score}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-0.5">
                      <div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-400" style={{ width: `${p.score}%` }} />
                    </div>
                    <div className="text-[9px] text-slate-500">{p.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Web5 vs Web2/3 comparison */}
          <div className="bg-gradient-to-r from-teal-500/10 to-blue-500/10 border border-teal-500/20 rounded-2xl p-4">
            <h3 className="text-sm font-bold text-white mb-3">🌐 Web Evolution Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-[10px] text-slate-400 uppercase">
                    <th className="text-left pb-2">Feature</th>
                    <th className="text-center pb-2">Web2</th>
                    <th className="text-center pb-2">Web3</th>
                    <th className="text-center pb-2">Web4</th>
                    <th className="text-center pb-2 text-teal-400">Web5</th>
                  </tr>
                </thead>
                <tbody className="space-y-1">
                  {[
                    ['Identity', 'Platform', 'Wallet', 'AI Agent', 'DID'],
                    ['Data', 'Company', 'On-chain', 'AI DB', 'DWN'],
                    ['Auth', 'Password', 'Private Key', 'Biometric', 'Self-sovereign'],
                    ['Economy', 'Fiat', 'Tokens', 'AI yields', 'Autonomous'],
                    ['Governance', 'Corporate', 'DAO vote', 'AI-assisted', 'Self-executing'],
                  ].map(([feature, w2, w3, w4, w5]) => (
                    <tr key={feature} className="border-t border-slate-800/50">
                      <td className="py-2 font-bold text-slate-300">{feature}</td>
                      <td className="py-2 text-center text-red-400">{w2}</td>
                      <td className="py-2 text-center text-yellow-400">{w3}</td>
                      <td className="py-2 text-center text-blue-400">{w4}</td>
                      <td className="py-2 text-center text-teal-400 font-bold">{w5}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Web5Command;
