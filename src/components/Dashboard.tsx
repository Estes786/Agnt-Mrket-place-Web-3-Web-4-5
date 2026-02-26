
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DeployedEcosystem, Blueprint, UserStats } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, CartesianGrid } from 'recharts';
import { aiService } from '../services/aiService';

interface DashboardProps {
  ecosystems: DeployedEcosystem[];
  blueprints: Blueprint[];
  userStats?: UserStats;
  onClaimYield?: (amount: number) => void;
  onStake?: (amount: number) => void;
  onUnstake?: (amount: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ ecosystems, blueprints, userStats, onClaimYield, onStake, onUnstake }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedId, setSelectedId] = useState<string | null>(ecosystems[0]?.id || null);
  const [activeTab, setActiveTab] = useState<string>('Telemetry');
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Record<string, { role: 'user' | 'assistant'; content: string }[]>>({});
  const [isTyping, setIsTyping] = useState(false);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  useEffect(() => {
    const podId = searchParams.get('podId');
    if (podId && ecosystems.some(e => e.id === podId)) setSelectedId(podId);
  }, [searchParams, ecosystems]);

  useEffect(() => {
    if (consoleEndRef.current) consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, activeTab]);

  const selected = ecosystems.find(e => e.id === selectedId);
  const selectedBlueprint = blueprints.find(b => b.id === selected?.blueprintId);

  const monitoringData = useMemo(() =>
    Array.from({ length: 24 }).map((_, i) => ({
      hour: `${i}:00`,
      compute: +(10 + Math.random() * 15).toFixed(1),
      a2a: Math.floor(500 + Math.random() * 1000),
      groq: Math.floor(20 + Math.random() * 80)
    })), [selectedId]);

  const nodeHeatmap = useMemo(() =>
    Array.from({ length: 48 }).map((_, i) => ({
      id: i, load: Math.random() * 100, active: Math.random() > 0.1
    })), [selectedId]);

  const handleConsoleSend = async (textOverride?: string) => {
    const text = textOverride || chatInput;
    if (!text.trim() || !selected || !selectedBlueprint || isTyping) return;
    const userMsg = { role: 'user' as const, content: text };
    setChatHistory(prev => ({ ...prev, [selected.id]: [...(prev[selected.id] || []), userMsg] }));
    setChatInput('');
    setIsTyping(true);
    try {
      const history = chatHistory[selected.id] || [];
      const response = await aiService.talkToPod(selectedBlueprint, text, history);
      setChatHistory(prev => ({ ...prev, [selected.id]: [...(prev[selected.id] || []), { role: 'assistant' as const, content: response }] }));
    } catch (e) { console.error(e); }
    finally { setIsTyping(false); }
  };

  const tabs = ['Telemetry', 'Neural Mesh', 'Monitoring', 'Web3 Layer', 'Governance', 'Console'];

  if (ecosystems.length === 0 && activeTab !== 'Governance') {
    return (
      <div className="max-w-5xl mx-auto py-12 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping"></span>
            System Node: IDLE
          </div>
          <h2 className="text-5xl font-bold text-white tracking-tighter">Command Center v2</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
            Web4 Orchestration Layer awaiting deployment. Powered by Groq + Supabase + LangChain + CrewAI on Cloudflare edge.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { title: 'Marketplace Hub', desc: 'Browse pre-configured Web3/Web4 agent pods with Groq AI integration.', icon: '🏪', path: '/' },
            { title: 'Architect Engine', desc: 'Design custom autonomous ecosystems with full Web3 foundation.', icon: '🏗️', path: '/architect' }
          ].map(step => (
            <div key={step.path} onClick={() => navigate(step.path)}
              className="glass rounded-[2.5rem] p-12 border border-slate-800/60 hover:border-indigo-500/40 transition-all cursor-pointer group shadow-2xl relative overflow-hidden"
            >
              <div className="text-6xl mb-8 group-hover:scale-110 transition-transform">{step.icon}</div>
              <h3 className="text-3xl font-bold text-white mb-4">{step.title}</h3>
              <p className="text-slate-400 text-sm mb-8">{step.desc}</p>
              <div className="text-indigo-400 font-black text-xs uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                Initiate Protocol →
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
      {/* Left Panel: Pod List */}
      <div className="lg:col-span-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar pb-8 pr-1">
        <div className="flex items-center justify-between px-2">
          <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Active Pods</h5>
          <span className="bg-indigo-500/10 text-indigo-400 text-[9px] font-bold px-2 py-0.5 rounded border border-indigo-500/20">{ecosystems.length}</span>
        </div>

        <div className="space-y-2">
          {ecosystems.length === 0 ? (
            <div className="p-6 bg-slate-900/40 border border-slate-800/60 rounded-[2rem] text-center">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3">No Pods</p>
              <button onClick={() => navigate('/')} className="w-full py-2.5 bg-indigo-600/10 border border-indigo-500/30 text-indigo-400 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">
                Deploy Pod
              </button>
            </div>
          ) : ecosystems.map(eco => (
            <button key={eco.id} onClick={() => { setSelectedId(eco.id); navigate(`/dashboard?podId=${eco.id}`, { replace: true }); }}
              className={`w-full text-left p-5 rounded-[2rem] transition-all border group ${
                selectedId === eco.id ? 'bg-indigo-600/10 border-indigo-500 shadow-xl' : 'bg-slate-900/40 border-slate-800/60 hover:bg-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-bold text-white text-sm leading-tight">{eco.name}</h4>
                  <p className="text-[8px] font-mono text-slate-600 uppercase mt-0.5">ID: {eco.id}</p>
                </div>
                <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-lg border ${
                  eco.status === 'Active' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-amber-500/10 border-amber-500/30 text-amber-500 animate-pulse'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${eco.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                  <span className="text-[7px] font-black uppercase">{eco.status}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[7px] text-slate-600 uppercase font-black">Health</span>
                  <span className="block text-xs font-mono font-bold text-indigo-400">{eco.metrics.nodeHealth}%</span>
                </div>
                <div>
                  <span className="text-[7px] text-slate-600 uppercase font-black">Income</span>
                  <span className="block text-xs font-mono font-bold text-emerald-400">+{eco.metrics.autonomousIncome.toFixed(2)}H</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Stack Status */}
        <div className="bg-slate-950/60 p-5 rounded-3xl border border-slate-900/60 mt-auto">
          <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-3">Stack Status</p>
          <div className="space-y-2">
            {[
              { label: 'Groq API', status: 'LIVE', color: 'text-purple-400' },
              { label: 'Supabase', status: 'CONN', color: 'text-emerald-400' },
              { label: 'CF Workers', status: '~48ms', color: 'text-orange-400' },
              { label: 'LangChain', status: 'READY', color: 'text-yellow-400' }
            ].map(s => (
              <div key={s.label} className="flex justify-between items-center font-mono text-[9px]">
                <span className="text-slate-700">{s.label}</span>
                <span className={s.color}>{s.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel: Main Content */}
      <div className="lg:col-span-3 flex flex-col gap-4 h-full min-h-0">
        {(selected || activeTab === 'Governance') ? (
          <div className="glass rounded-[3rem] border border-slate-800/60 overflow-hidden flex flex-col flex-1 shadow-3xl">
            {/* Tab Header */}
            <div className="p-8 border-b border-slate-800/40 bg-gradient-to-b from-indigo-950/10 to-transparent">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
                <div>
                  <h3 className="text-3xl font-bold text-white tracking-tighter">
                    {activeTab === 'Governance' ? 'Sovereign DAO' : selected?.name}
                  </h3>
                  <p className="text-indigo-400 font-mono text-[9px] uppercase tracking-widest mt-1">
                    {activeTab === 'Governance' ? 'Decentralized Autonomous Organization' : 'Hypha Orchestration Protocol v2.0'}
                  </p>
                </div>
                <div className="flex bg-slate-900/60 p-1 rounded-[1.5rem] border border-slate-800/60 overflow-x-auto scrollbar-hide">
                  {tabs.map(tab => {
                    const isDisabled = !selected && tab !== 'Governance';
                    return (
                      <button key={tab} onClick={() => !isDisabled && setActiveTab(tab)}
                        disabled={isDisabled}
                        className={`px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                          activeTab === tab ? 'bg-slate-800 text-white shadow-xl border border-slate-700/50' :
                          isDisabled ? 'opacity-30 cursor-not-allowed' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'
                        }`}
                      >{tab}</button>
                    );
                  })}
                </div>
              </div>

              {selected && activeTab !== 'Governance' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Compute', value: selected.metrics.computeUsage || '12ms', color: 'text-emerald-400' },
                    { label: 'A2A Throughput', value: selected.metrics.a2aActivity || '1.4k/h', color: 'text-white' },
                    { label: 'Groq Calls/h', value: `${selected.metrics.groqCallsPerHour || 0}`, color: 'text-purple-400' },
                    { label: 'CF Sync', value: '100%', color: 'text-indigo-400' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-slate-900/40 p-5 rounded-[1.5rem] border border-slate-800/40 hover:border-slate-700/60 transition-all">
                      <p className="text-[7px] text-slate-600 uppercase font-black tracking-widest mb-2">{stat.label}</p>
                      <p className={`text-xl font-bold tracking-tight ${stat.color}`}>{stat.value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tab Content */}
            <div className="flex-1 p-8 bg-black/5 flex flex-col min-h-0 overflow-hidden">
              {activeTab === 'Telemetry' && selected && (
                <div className="bg-[#020617]/80 rounded-[2rem] p-6 font-mono text-[11px] overflow-y-auto space-y-3 border border-slate-800/60 flex-1 custom-scrollbar shadow-inner">
                  {selected.logs.map((log, i) => (
                    <div key={i} className="flex gap-4 group hover:bg-slate-900/40 transition-colors py-1 px-2 rounded-lg">
                      <span className="text-slate-700 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                      <span className="text-indigo-500/60 shrink-0 font-bold">POD_ORCH:</span>
                      <span className="text-slate-300">{log}</span>
                    </div>
                  ))}
                  <div className="flex gap-4 py-1 px-2">
                    <span className="text-slate-800">[{new Date().toLocaleTimeString()}]</span>
                    <span className="text-indigo-500/40 animate-pulse">GROQ_LISTENER:</span>
                    <span className="text-indigo-400/60 animate-pulse italic">_ Awaiting Groq inference events...</span>
                  </div>
                </div>
              )}

              {activeTab === 'Web3 Layer' && selected && (
                <div className="flex flex-col gap-6 animate-in slide-in-from-right-4 duration-500 overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="glass p-6 rounded-[1.5rem] border border-emerald-500/20 bg-emerald-500/5">
                      <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest block mb-2">DWN Sync Status</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-white">{selected.metrics.dwnSyncStatus}%</span>
                        <span className="text-xs font-mono text-emerald-400">SYNCED</span>
                      </div>
                      <div className="w-full h-1 bg-slate-800 rounded-full mt-3 overflow-hidden">
                        <div className="h-full bg-emerald-500 animate-pulse" style={{ width: `${selected.metrics.dwnSyncStatus}%` }}></div>
                      </div>
                    </div>
                    <div className="glass p-6 rounded-[1.5rem] border border-indigo-500/20 bg-indigo-500/5">
                      <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest block mb-2">Sovereign DID</span>
                      <div className="text-[9px] font-mono text-slate-300 break-all bg-black/40 p-2 rounded-xl border border-slate-800">
                        {selected.didHash || 'did:hypha:pending'}
                      </div>
                      {selected.blockchainTxHash && (
                        <div className="mt-2">
                          <span className="text-[7px] font-black text-slate-600 uppercase">TX HASH:</span>
                          <span className="text-[8px] font-mono text-emerald-500 ml-1 truncate block">{selected.blockchainTxHash}</span>
                        </div>
                      )}
                    </div>
                    <div className="glass p-6 rounded-[1.5rem] border border-purple-500/20 bg-purple-500/5">
                      <span className="text-[8px] font-black text-purple-500 uppercase tracking-widest block mb-2">Verifiable Credentials</span>
                      <div className="text-4xl font-black text-white mb-2">{selected.metrics.verifiableCredentials}</div>
                      <button className="w-full py-1.5 bg-purple-600/20 border border-purple-500/30 text-purple-400 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all">Manage VCs</button>
                    </div>
                  </div>

                  {/* Web3 Stack Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-950/40 rounded-[1.5rem] border border-slate-800/60 p-6">
                      <h6 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">AI Inference Engine</h6>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-slate-900/40 rounded-xl">
                          <span className="text-[9px] font-black text-purple-400 uppercase">Groq (llama-3.3-70b)</span>
                          <span className="text-[9px] font-mono text-emerald-400">{Math.floor(Math.random() * 200 + 100)}ms</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-900/40 rounded-xl">
                          <span className="text-[9px] font-black text-orange-400 uppercase">Cloudflare AI Workers</span>
                          <span className="text-[9px] font-mono text-emerald-400">STANDBY</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-900/40 rounded-xl">
                          <span className="text-[9px] font-black text-yellow-400 uppercase">LangChain Workflows</span>
                          <span className="text-[9px] font-mono text-white">{selected.metrics.langchainWorkflows || 0} active</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-900/40 rounded-xl">
                          <span className="text-[9px] font-black text-emerald-400 uppercase">Supabase DB</span>
                          <span className="text-[9px] font-mono text-emerald-400">{selected.metrics.supabaseConnected ? 'CONNECTED' : 'OFFLINE'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-950/40 rounded-[1.5rem] border border-slate-800/60 p-6">
                      <h6 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">DID Document (W3C)</h6>
                      <div className="font-mono text-[9px] text-indigo-300 bg-black/40 p-4 rounded-xl border border-slate-800 overflow-auto custom-scrollbar max-h-40">
                        {`{
  "@context": "https://www.w3.org/ns/did/v1",
  "id": "${selected.didHash}",
  "verificationMethod": [{
    "id": "#key-1",
    "type": "Ed25519VerificationKey2020",
    "controller": "${selected.didHash}"
  }],
  "service": [{
    "id": "#groq",
    "type": "GroqAIService",
    "serviceEndpoint": "https://api.groq.com"
  }, {
    "id": "#dwn",
    "type": "DecentralizedWebNode"
  }]
}`}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Governance' && (
                <div className="flex flex-col gap-6 animate-in slide-in-from-left-4 duration-500 overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Staking Vault */}
                    <div className="glass p-6 rounded-[1.5rem] border border-indigo-500/20 bg-indigo-500/5">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest">Staking Vault</span>
                        <span className="text-[8px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">APY: 18.5%</span>
                      </div>
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-3xl font-black text-white">{userStats?.stakedAmount?.toLocaleString() || 0}</span>
                        <span className="text-xs font-mono text-indigo-400">HYPHA</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => onStake?.(100)}
                          className="py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[8px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg"
                        >Stake 100</button>
                        <button onClick={() => onUnstake?.(100)}
                          disabled={!userStats?.stakedAmount || userStats.stakedAmount < 100}
                          className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
                        >Unstake</button>
                      </div>
                      <p className="text-[7px] text-slate-600 mt-3 text-center uppercase tracking-widest">Epoch ends in 14h 22m</p>
                    </div>

                    {/* Governance Power */}
                    <div className="glass p-6 rounded-[1.5rem] border border-purple-500/20 bg-purple-500/5">
                      <span className="text-[8px] font-black text-purple-500 uppercase tracking-widest block mb-2">Governance Power</span>
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-3xl font-black text-white">{userStats?.governancePower?.toFixed(0) || 0}</span>
                        <span className="text-xs font-mono text-purple-400">vHYPHA</span>
                      </div>
                      <p className="text-[9px] text-slate-500">Rank: <span className="text-purple-400 font-bold">Sovereign Tier</span></p>
                      <div className="mt-4 p-3 bg-slate-900/40 rounded-xl border border-slate-800">
                        <span className="text-[7px] font-black text-slate-600 uppercase block mb-1">Daily Yield</span>
                        <span className="text-sm font-bold text-emerald-400">+{((userStats?.stakedAmount || 0) * 0.185 / 365).toFixed(2)} HYPHA</span>
                      </div>
                    </div>

                    {/* Active Proposals */}
                    <div className="glass p-6 rounded-[1.5rem] border border-slate-800">
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-3">Active Proposals</span>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                        <span className="text-lg font-bold text-white">3 Pending</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 py-2 bg-slate-800 border border-slate-700 text-white rounded-xl text-[8px] font-black uppercase hover:bg-slate-700 transition-all">View DAO</button>
                        <button className="flex-1 py-2 bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 rounded-xl text-[8px] font-black uppercase hover:bg-indigo-600 hover:text-white transition-all">Create</button>
                      </div>
                    </div>
                  </div>

                  {/* Proposals + Yield Chart */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-slate-950/40 rounded-[2rem] border border-slate-800/60 p-6 overflow-hidden">
                      <h6 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">DAO Proposals</h6>
                      <div className="space-y-3 overflow-y-auto custom-scrollbar max-h-64">
                        {[
                          { id: 'HIP-12', title: 'Increase Autonomous Yield Cap', status: 'Voting', votes: '84%', type: 'Economic', time: '2d left' },
                          { id: 'HIP-13', title: 'Deploy Groq Inference Layer v2', status: 'Passed', votes: '92%', type: 'Infrastructure', time: 'Ended' },
                          { id: 'HIP-14', title: 'Reduce A2A Transaction Fees', status: 'Draft', votes: '0%', type: 'Protocol', time: 'Draft' },
                          { id: 'HIP-15', title: 'Integrate Supabase Vector DB', status: 'Voting', votes: '67%', type: 'Resources', time: '5d left' }
                        ].map(p => (
                          <div key={p.id} className="p-4 bg-slate-900/40 border border-slate-800/60 rounded-2xl hover:border-indigo-500/30 transition-all">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[8px] font-mono text-indigo-500 font-black uppercase">{p.id}</span>
                                  <span className="text-[7px] text-slate-600">• {p.time}</span>
                                </div>
                                <h5 className="text-xs font-bold text-white mt-0.5">{p.title}</h5>
                              </div>
                              <span className={`px-2 py-0.5 rounded-lg text-[7px] font-black uppercase ${
                                p.status === 'Voting' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                                p.status === 'Passed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                'bg-slate-800 text-slate-500'
                              }`}>{p.status}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2 flex-1">
                                <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                                  <div className="h-full bg-indigo-500" style={{ width: p.votes }}></div>
                                </div>
                                <span className="text-[8px] font-bold text-slate-400">{p.votes}</span>
                              </div>
                              <button className="text-[8px] font-black text-indigo-400 hover:text-white transition-colors uppercase tracking-widest">Vote ↗</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-950/40 rounded-[2rem] border border-slate-800/60 p-6">
                      <h6 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Yield Projection</h6>
                      <div className="grid grid-cols-3 gap-3 mb-6">
                        {[
                          { label: 'Daily', value: `+${((userStats?.stakedAmount || 0) * 0.185 / 365).toFixed(2)}` },
                          { label: 'Monthly', value: `+${((userStats?.stakedAmount || 0) * 0.185 / 12).toFixed(2)}` },
                          { label: 'Annual', value: `+${((userStats?.stakedAmount || 0) * 0.185).toFixed(2)}` }
                        ].map(y => (
                          <div key={y.label} className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                            <span className="text-[7px] font-black text-slate-600 uppercase block mb-1">{y.label}</span>
                            <p className="text-sm font-bold text-emerald-400">{y.value}</p>
                          </div>
                        ))}
                      </div>
                      <div className="h-40">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={[
                            { day: 'Mon', yield: 120 }, { day: 'Tue', yield: 150 }, { day: 'Wed', yield: 180 },
                            { day: 'Thu', yield: 220 }, { day: 'Fri', yield: 280 }, { day: 'Sat', yield: 350 }, { day: 'Sun', yield: 420 }
                          ]}>
                            <defs>
                              <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.2} />
                            <XAxis dataKey="day" stroke="#475569" fontSize={9} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }} />
                            <Area type="monotone" dataKey="yield" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#yieldGrad)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Neural Mesh' && selected && selectedBlueprint && (
                <div className="flex-1 flex items-center justify-center relative bg-slate-950/40 rounded-[2rem] border border-slate-800/60 overflow-hidden" style={{ minHeight: '400px' }}>
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#4f46e5" strokeWidth="0.5" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                  <div className="relative z-10 w-full max-w-2xl h-full flex items-center justify-center" style={{ height: '400px' }}>
                    <div className="absolute w-24 h-24 bg-indigo-600 rounded-3xl flex flex-col items-center justify-center border-4 border-indigo-400 shadow-[0_0_50px_rgba(79,70,229,0.5)]">
                      <span className="text-2xl">🌀</span>
                      <span className="text-[7px] font-black text-white mt-1 uppercase">GROQ</span>
                    </div>
                    {selectedBlueprint.roles.map((role, idx) => {
                      const total = selectedBlueprint.roles.length;
                      const angle = (idx / total) * 2 * Math.PI;
                      const x = Math.cos(angle) * 150;
                      const y = Math.sin(angle) * 150;
                      return (
                        <React.Fragment key={role}>
                          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                            <line x1="50%" y1="50%" x2={`calc(50% + ${x}px)`} y2={`calc(50% + ${y}px)`}
                              stroke="rgba(79,70,229,0.4)" strokeWidth="2" strokeDasharray="5,5" />
                          </svg>
                          <div style={{ transform: `translate(${x}px, ${y}px)` }}
                            className="absolute w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center justify-center shadow-xl hover:border-indigo-500/50 group transition-all">
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="text-lg opacity-60 group-hover:opacity-100">🤖</span>
                            <span className="text-[7px] font-black text-slate-500 text-center px-1 leading-tight mt-1">
                              {role.replace(/^The\s+/, '')}
                            </span>
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'Monitoring' && selected && (
                <div className="flex-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                    <div className="bg-slate-900/20 rounded-[2rem] border border-slate-800/40 p-8 flex flex-col gap-6 min-h-72">
                      <div className="flex items-center justify-between">
                        <h6 className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Real-time Telemetry (24h)</h6>
                        <div className="flex gap-3">
                          {[{ color: 'bg-indigo-500', label: 'Compute' }, { color: 'bg-purple-500', label: 'Groq' }, { color: 'bg-amber-500', label: 'A2A' }].map(l => (
                            <div key={l.label} className="flex items-center gap-1.5">
                              <div className={`w-1.5 h-1.5 ${l.color} rounded-full`}></div>
                              <span className="text-[8px] font-bold text-slate-500 uppercase">{l.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex-1 min-h-40">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={monitoringData}>
                            <defs>
                              <linearGradient id="colorCompute" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} /><stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                              </linearGradient>
                              <linearGradient id="colorGroq" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} /><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.3} />
                            <XAxis dataKey="hour" stroke="#475569" fontSize={9} tickLine={false} axisLine={false} interval={3} dy={10} />
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }} />
                            <Area type="monotone" dataKey="compute" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorCompute)" dot={false} />
                            <Area type="monotone" dataKey="groq" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorGroq)" dot={false} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="bg-slate-900/20 rounded-[2rem] border border-slate-800/40 p-8 flex flex-col gap-6 min-h-72">
                      <h6 className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Distributed Node Heatmap</h6>
                      <div className="grid grid-cols-8 gap-1.5 flex-1">
                        {nodeHeatmap.map(node => (
                          <div key={node.id} className={`rounded-md transition-all duration-500 relative cursor-help group ${node.active ? 'bg-indigo-500/20' : 'bg-slate-800/40'}`} style={{ minHeight: '24px' }}>
                            <div className="w-full h-full rounded-md transition-all duration-700 absolute inset-0"
                              style={{ opacity: node.active ? node.load / 100 : 0.1, backgroundColor: node.load > 80 ? '#f43f5e' : node.load > 50 ? '#f59e0b' : '#6366f1' }}
                            ></div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center text-[7px] font-mono text-slate-600">
                        <span>LOW</span>
                        <div className="flex-1 mx-3 h-0.5 bg-gradient-to-r from-indigo-500 via-amber-500 to-rose-500 rounded-full"></div>
                        <span>MAX</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Console' && selected && selectedBlueprint && (
                <div className="flex flex-col h-full bg-slate-950/40 rounded-[2rem] border border-slate-800/60 overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar min-h-0 max-h-80">
                    <div className="flex justify-start">
                      <div className="bg-indigo-600/10 border border-indigo-500/20 p-4 rounded-2xl rounded-bl-none text-xs text-indigo-300 max-w-[85%] leading-relaxed">
                        <span className="text-[7px] font-black uppercase tracking-widest text-indigo-400/60 block mb-1">GROQ ENGINE:</span>
                        Pod {selected.id} synchronized. Groq llama-3.3-70b ready. Supabase connected. LangChain workflows active. How shall we optimize?
                      </div>
                    </div>
                    {(chatHistory[selected.id] || []).map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-4 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                          msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-900/80 text-slate-300 rounded-bl-none border border-slate-800'
                        }`}>
                          {msg.role !== 'user' && <span className="text-[7px] font-black uppercase tracking-widest text-indigo-400/40 block mb-1">GROQ:</span>}
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-slate-900/60 p-4 rounded-2xl rounded-bl-none border border-slate-800/60 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce"></span>
                          <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                          <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                          <span className="text-[8px] font-mono text-purple-400/60 ml-2">Groq processing...</span>
                        </div>
                      </div>
                    )}
                    <div ref={consoleEndRef} />
                  </div>

                  <div className="p-5 bg-slate-950/80 border-t border-slate-800/60 space-y-3 backdrop-blur-md">
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                      {['Get current status', 'Optimize performance', 'Check Groq usage', 'Supabase query'].map(cmd => (
                        <button key={cmd} onClick={() => handleConsoleSend(cmd)} disabled={isTyping}
                          className="whitespace-nowrap px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-[8px] font-black text-slate-400 uppercase tracking-widest hover:border-indigo-500 hover:text-indigo-400 transition-all disabled:opacity-50"
                        >{cmd}</button>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600">⚡</span>
                        <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleConsoleSend()}
                          placeholder="Command pod via Groq AI..."
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-9 pr-4 text-xs text-white focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                        />
                      </div>
                      <button onClick={() => handleConsoleSend()} disabled={isTyping}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[9px] font-black transition-all disabled:opacity-50 uppercase tracking-widest shadow-lg active:scale-95"
                      >EXEC ↗</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full glass rounded-[3rem] flex flex-col items-center justify-center text-slate-700 border border-slate-900/40 uppercase font-mono tracking-widest text-xs" style={{ minHeight: '400px' }}>
            <div className="w-20 h-20 mb-8 border-4 border-slate-900 border-t-indigo-500 rounded-full animate-spin"></div>
            Awaiting_Pod_Selection...
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
