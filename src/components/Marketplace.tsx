
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Blueprint, DeployedEcosystem } from '../types';
import { aiService, Trend } from '../services/aiService';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie, AreaChart, Area, CartesianGrid, Legend } from 'recharts';

interface MarketplaceProps {
  blueprints: Blueprint[];
  credits: number;
  onDeploy: (blueprint: Blueprint) => void;
  onUpdateBlueprint: (blueprint: Blueprint) => void;
  deployingIds?: string[];
  deployedEcosystems?: DeployedEcosystem[];
}

// Industry Token Data sesuai konsep: setiap industri punya token sendiri
const INDUSTRY_TOKENS: Record<string, {
  symbol: string;
  name: string;
  icon: string;
  network: string;
  saasModel: string;
  paymentModel: string;
  monthlyUsers?: number;
  estimatedRevenue: string;
  color: string;
}> = {
  'Property': {
    symbol: '$PROPRT',
    name: 'Property Token',
    icon: '🏠',
    network: 'Ethereum',
    saasModel: 'SaaS × AI × Web3',
    paymentModel: 'Pay per lead + % rental commission',
    monthlyUsers: 0,
    estimatedRevenue: '$500-$5,000/mo passive',
    color: '#10b981'
  },
  'Personal Services': {
    symbol: '$BARBER',
    name: 'Barber Token',
    icon: '✂️',
    network: 'Polygon',
    saasModel: 'SaaS × AI × Loyalty',
    paymentModel: 'USDC per booking + tips split',
    monthlyUsers: 0,
    estimatedRevenue: '$200-$2,000/mo additional',
    color: '#f59e0b'
  },
  'Lifestyle': {
    symbol: '$LEGACY',
    name: 'Legacy Token',
    icon: '👑',
    network: 'Arbitrum',
    saasModel: 'SaaS × AI × Family DAO',
    paymentModel: 'Monthly sub + family governance',
    monthlyUsers: 0,
    estimatedRevenue: '$150-$1,500/mo',
    color: '#8b5cf6'
  },
  'Content Creation': {
    symbol: '$MEDIA',
    name: 'Media Token',
    icon: '🎬',
    network: 'Base',
    saasModel: 'SaaS × AI × Creator Economy',
    paymentModel: 'Revenue share 70/20/10',
    monthlyUsers: 0,
    estimatedRevenue: '$300-$8,000/mo',
    color: '#ec4899'
  },
  'Logistics & Trade': {
    symbol: '$SUPPLY',
    name: 'Supply Token',
    icon: '🚢',
    network: 'Ethereum',
    saasModel: 'SaaS × AI × Trade Finance',
    paymentModel: 'Per-shipment fee + DeFi yield',
    monthlyUsers: 0,
    estimatedRevenue: '$2,000-$50,000/mo',
    color: '#3b82f6'
  },
  'Fintech': {
    symbol: '$YIELD',
    name: 'Yield Token',
    icon: '📈',
    network: 'Arbitrum',
    saasModel: 'SaaS × AI × DeFi',
    paymentModel: '2% mgmt + 20% performance fee',
    monthlyUsers: 0,
    estimatedRevenue: '8-25% APY automated',
    color: '#06b6d4'
  },
  'Legal & Governance': {
    symbol: '$LEGAL',
    name: 'Legal Token',
    icon: '⚖️',
    network: 'Ethereum',
    saasModel: 'SaaS × AI × Compliance',
    paymentModel: 'Monthly retainer + per-audit fee',
    monthlyUsers: 0,
    estimatedRevenue: '$1,000-$30,000/mo',
    color: '#a78bfa'
  },
  'DeFi': {
    symbol: '$NEXUS',
    name: 'DeFi Nexus Token',
    icon: '🔗',
    network: 'Ethereum + L2',
    saasModel: 'SaaS × AI × Full DeFi Stack',
    paymentModel: '0.3% swap fee + yield share',
    monthlyUsers: 0,
    estimatedRevenue: '$500-$20,000/mo yield',
    color: '#22d3ee'
  },
  'DAO & Governance': {
    symbol: '$vHYPHA',
    name: 'Governance Token',
    icon: '🏛️',
    network: 'Ethereum',
    saasModel: 'SaaS × AI × DAO',
    paymentModel: 'Protocol fees + treasury yield',
    monthlyUsers: 0,
    estimatedRevenue: 'Proportional to TVL',
    color: '#6366f1'
  }
};

// Launch FREE page content per industry
const LAUNCH_FREE_CONTENT: Record<string, {
  title: string;
  description: string;
  steps: string[];
  monitorMessage: string;
}> = {
  'Property': {
    title: 'Real Estate Pod Launched! 🏠',
    description: 'Your autonomous property management agent is now running. It will analyze market trends, manage listings, and generate reports automatically.',
    steps: ['Property Analyst Agent initialized', 'Lease Manager Agent active', 'Maintenance Coordinator online', 'Financial Reporter streaming'],
    monitorMessage: 'Monitor your property metrics and passive income stream in Dashboard'
  },
  'Personal Services': {
    title: 'Barber Dynasty Running! ✂️',
    description: 'Your Barber AI pod is live! Customers can now book automatically via WhatsApp/SMS. The loyalty system is tracking repeat clients.',
    steps: ['Appointment Orchestrator active', 'Loyalty Manager tracking', 'Revenue Optimizer online', 'Social Media Agent posting'],
    monitorMessage: 'Watch your booking rate and customer satisfaction grow automatically'
  },
  'Lifestyle': {
    title: 'Family Legacy Activated! 👨‍👩‍👧‍👦',
    description: 'Your private family coordination hub is secured with Supabase RLS. All family data is isolated and encrypted.',
    steps: ['Family DAO initialized', 'Memory Roots secured (RLS)', 'Event Conflict Resolver active', 'Family DWN Node syncing'],
    monitorMessage: 'Your family\'s digital legacy is now being preserved automatically'
  },
  'Content Creation': {
    title: 'Media Empire Online! 🎬',
    description: 'Your content empire is now autonomous. AI is analyzing trends, scheduling posts, and monetizing your content across platforms.',
    steps: ['Content Strategy Agent active', 'Monetization Agent calculating', 'Community Manager online', 'IPFS archiving content'],
    monitorMessage: 'Track your content revenue and audience growth metrics'
  },
  'default': {
    title: 'Pod Successfully Launched! 🚀',
    description: 'Your autonomous AI agent pod is now live and generating value. The system is self-managing and will operate 24/7.',
    steps: ['Orchestrator initialized', 'All agents active', 'Blockchain connection confirmed', 'Revenue stream activated'],
    monitorMessage: 'Monitor your pod performance and income in the Dashboard'
  }
};

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#ef4444'];

type ViewMode = 'market' | 'insights' | 'tokenomics';
type UnlockPhase = 'locked' | 'unlocking' | 'unlocked' | 'syncing' | 'launched';

const Marketplace: React.FC<MarketplaceProps> = ({
  blueprints, credits, onDeploy, onUpdateBlueprint,
  deployingIds = [], deployedEcosystems = []
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [activeTier, setActiveTier] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [trends, setTrends] = useState<Trend[]>([]);
  const [isLoadingTrends, setIsLoadingTrends] = useState(false);
  const [isLoadingBlueprints, setIsLoadingBlueprints] = useState(true);
  const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('market');
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showCopyToast, setShowCopyToast] = useState<string>('');
  
  // Unlock flow state
  const [unlockPhase, setUnlockPhase] = useState<UnlockPhase>('locked');
  const [unlockingBlueprint, setUnlockingBlueprint] = useState<Blueprint | null>(null);
  const [showLaunchPage, setShowLaunchPage] = useState<Blueprint | null>(null);
  const [unlockedBlueprintIds, setUnlockedBlueprintIds] = useState<string[]>([]);
  const [syncProgress, setSyncProgress] = useState(0);
  const [launchLogs, setLaunchLogs] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoadingBlueprints(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchTrends = async () => {
      setIsLoadingTrends(true);
      try {
        const result = await aiService.getMarketTrends(
          activeTab === 'All' || activeTab === 'Featured' ? 'Web3 AI Agents' : activeTab
        );
        setTrends(result.trends);
      } catch (e) { console.error(e); }
      finally { setIsLoadingTrends(false); }
    };
    fetchTrends();
  }, [activeTab]);

  const categories = ['All', 'Featured', 'Property', 'Personal Services', 'Lifestyle', 'Content Creation', 'DeFi', 'Fintech', 'DAO & Governance'];
  const tiers = ['All', 'Free', 'Pro', 'Enterprise'];

  const popularityData = useMemo(() => blueprints.map(bp => ({
    name: bp.name.split(' ')[0],
    deployments: bp.deploymentCount
  })).sort((a, b) => b.deployments - a.deployments), [blueprints]);

  const tokenDistribution = [
    { name: 'Ecosystem Yield', value: 40 },
    { name: 'Staking Rewards', value: 25 },
    { name: 'Dev Fund', value: 15 },
    { name: 'Public Liquidity', value: 10 },
    { name: 'DAO Treasury', value: 10 }
  ];

  const stakingAPY = [
    { month: 'Jan', apy: 12.5 }, { month: 'Feb', apy: 14.2 }, { month: 'Mar', apy: 13.8 },
    { month: 'Apr', apy: 15.5 }, { month: 'May', apy: 18.2 }, { month: 'Jun', apy: 17.8 },
    { month: 'Jul', apy: 18.5 }, { month: 'Aug', apy: 19.2 }, { month: 'Sep', apy: 20.1 }
  ];

  const filteredBlueprints = useMemo(() => {
    return blueprints.filter(bp => {
      const matchTab = activeTab === 'All' || (activeTab === 'Featured' ? bp.isFeatured : bp.industry === activeTab);
      const matchTier = activeTier === 'All' || bp.tier === activeTier;
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || bp.name.toLowerCase().includes(q) || bp.description.toLowerCase().includes(q) || bp.industry.toLowerCase().includes(q);
      return matchTab && matchTier && matchSearch;
    });
  }, [blueprints, activeTab, activeTier, searchQuery]);

  const handleShare = async (e: React.MouseEvent, blueprint: Blueprint) => {
    e.stopPropagation();
    const url = `${window.location.origin}/?bp=${blueprint.id}`;
    try { await navigator.clipboard.writeText(url); } catch {}
    setShowCopyToast('Blueprint link copied!');
    setTimeout(() => setShowCopyToast(''), 3000);
  };

  // ============================================================
  // UNLOCK FLOW — Blueprint Unlock → Marketplace → Launch FREE
  // ============================================================
  const handleUnlockBlueprint = (e: React.MouseEvent, blueprint: Blueprint) => {
    e.stopPropagation();
    setUnlockingBlueprint(blueprint);
    setUnlockPhase('unlocking');
    setSyncProgress(0);

    // Simulate unlock sequence
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      setSyncProgress(Math.min(progress, 100));
      if (progress >= 100) {
        clearInterval(interval);
        setUnlockPhase('unlocked');
        setUnlockedBlueprintIds(prev => [...prev, blueprint.id]);
      }
    }, 150);
  };

  const handleSyncToMarket = (blueprint: Blueprint) => {
    setUnlockPhase('syncing');
    setSyncProgress(0);
    const logs: string[] = [];
    const addLog = (msg: string) => {
      logs.push(msg);
      setLaunchLogs([...logs]);
    };

    let progress = 0;
    const syncLogs = [
      `[GANI] Initializing ${blueprint.name} on HYPHA Marketplace...`,
      `[WEB3] DID identity minting: did:ethr:mainnet:0x${Math.random().toString(16).substring(2, 10)}`,
      `[ALCHEMY] Block sync #${Math.floor(Math.random() * 100000 + 19000000)} confirmed`,
      `[GROQ] llama-3.3-70b connecting... ${Math.floor(Math.random() * 200 + 50)}ms`,
      `[SUPABASE] Blueprint registered in marketplace DB`,
      `[IPFS] Pinata pinning metadata... CID: Qm${Math.random().toString(36).substring(2, 16)}`,
      `[TOKEN] ${INDUSTRY_TOKENS[blueprint.industry]?.symbol || '$TOKEN'} tokenomics initialized`,
      `[CLOUDFLARE] Edge deployment to 200+ PoPs worldwide`,
      `[SUCCESS] ✅ Blueprint live on HYPHA Marketplace!`
    ];

    let logIdx = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 12 + 5;
      setSyncProgress(Math.min(progress, 100));
      if (logIdx < syncLogs.length) {
        addLog(syncLogs[logIdx]);
        logIdx++;
      }
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setUnlockPhase('launched');
        }, 500);
      }
    }, 300);
  };

  const handleLaunchFree = (blueprint: Blueprint) => {
    setUnlockingBlueprint(null);
    setUnlockPhase('locked');
    setShowLaunchPage(blueprint);
    onDeploy(blueprint);
  };

  const handleCloseLaunchPage = () => {
    setShowLaunchPage(null);
    navigate('/dashboard');
  };

  const industryToken = unlockingBlueprint ? INDUSTRY_TOKENS[unlockingBlueprint.industry] : null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Toast notifications */}
      {showCopyToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-emerald-600 text-white px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest shadow-2xl animate-in fade-in duration-300 flex items-center gap-3">
          🔗 {showCopyToast}
        </div>
      )}

      {/* ============================================================ */}
      {/* UNLOCK MODAL — Blueprint Unlock Flow                         */}
      {/* ============================================================ */}
      {unlockingBlueprint && unlockPhase !== 'locked' && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="w-full max-w-lg">
            
            {/* PHASE: UNLOCKING */}
            {unlockPhase === 'unlocking' && (
              <div className="bg-slate-900 border border-indigo-500/30 rounded-[2rem] p-10 text-center space-y-6 shadow-2xl shadow-indigo-500/10">
                <div className="relative w-24 h-24 mx-auto">
                  <div className="w-24 h-24 rounded-[1.5rem] bg-slate-800 border-2 border-indigo-500/40 flex items-center justify-center text-5xl animate-pulse">
                    {unlockingBlueprint.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center animate-spin">
                    🔓
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white mb-2">Unlocking Blueprint...</h3>
                  <p className="text-slate-400 text-sm">{unlockingBlueprint.name}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-500 font-mono">
                    <span>Decrypting Web3 specs...</span>
                    <span>{Math.floor(syncProgress)}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-600 to-violet-500 rounded-full transition-all duration-300"
                      style={{ width: `${syncProgress}%` }}
                    ></div>
                  </div>
                  <div className="text-[9px] text-slate-600 font-mono animate-pulse">
                    Verifying DID credentials... IPFS metadata loading...
                  </div>
                </div>
              </div>
            )}

            {/* PHASE: UNLOCKED — Show Blueprint Details + Industry Token */}
            {unlockPhase === 'unlocked' && industryToken && (
              <div className="bg-slate-900 border border-emerald-500/30 rounded-[2rem] overflow-hidden shadow-2xl shadow-emerald-500/10 animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="bg-gradient-to-br from-indigo-950/60 via-slate-900 to-emerald-950/20 p-8 border-b border-slate-800/40">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full uppercase tracking-widest">
                      🔓 Blueprint Unlocked!
                    </span>
                    <button onClick={() => { setUnlockingBlueprint(null); setUnlockPhase('locked'); }}
                      className="text-slate-600 hover:text-white transition-colors text-lg">✕</button>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="w-20 h-20 rounded-[1.5rem] bg-slate-800 border border-slate-700 flex items-center justify-center text-4xl shadow-inner">
                      {unlockingBlueprint.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white">{unlockingBlueprint.name}</h3>
                      <p className="text-slate-500 text-xs">{unlockingBlueprint.industry} • {unlockingBlueprint.infrastructure}</p>
                      <div className="flex gap-2 mt-2">
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-lg uppercase ${unlockingBlueprint.tier === 'Enterprise' ? 'bg-amber-500/10 text-amber-500' : unlockingBlueprint.tier === 'Pro' ? 'bg-purple-500/10 text-purple-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                          {unlockingBlueprint.tier}
                        </span>
                        <span className="text-[8px] font-black px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 uppercase">
                          {unlockingBlueprint.web4Features?.aiOrchestrator || 'Groq'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Industry Token Section */}
                <div className="p-6 border-b border-slate-800/40">
                  <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-3">Industry Token (SaaS × AI × Web3)</div>
                  <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: industryToken.color + '20', border: `1px solid ${industryToken.color}40` }}>
                          {industryToken.icon}
                        </div>
                        <div>
                          <div className="text-white font-black text-base" style={{ color: industryToken.color }}>{industryToken.symbol}</div>
                          <div className="text-slate-500 text-[9px]">{industryToken.name} • {industryToken.network}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[8px] font-black text-slate-600 uppercase mb-1">Revenue Model</div>
                        <div className="text-[9px] text-emerald-400 font-bold">{industryToken.estimatedRevenue}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-900 rounded-xl p-3">
                        <div className="text-[8px] font-black text-slate-600 uppercase mb-1">Model</div>
                        <div className="text-[10px] text-indigo-400 font-bold">{industryToken.saasModel}</div>
                      </div>
                      <div className="bg-slate-900 rounded-xl p-3">
                        <div className="text-[8px] font-black text-slate-600 uppercase mb-1">Payment</div>
                        <div className="text-[10px] text-amber-400 font-bold">{industryToken.paymentModel}</div>
                      </div>
                    </div>
                    <div className="mt-3 text-[9px] text-slate-500 text-center">
                      💡 Setiap industri punya token sendiri → likuiditas → passive income
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="p-6 border-b border-slate-800/40">
                  <p className="text-slate-400 text-xs leading-relaxed">{unlockingBlueprint.description}</p>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {unlockingBlueprint.features?.slice(0, 4).map(f => (
                      <div key={f} className="flex items-center gap-2 text-[9px] text-slate-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></div>
                        {f}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="p-6 space-y-3">
                  <button
                    onClick={() => handleSyncToMarket(unlockingBlueprint)}
                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-2xl shadow-indigo-600/20 flex items-center justify-center gap-3"
                  >
                    <span>🔄</span>
                    <span>Sync to Marketplace</span>
                  </button>
                  {unlockingBlueprint.tier === 'Free' && (
                    <button
                      onClick={() => handleLaunchFree(unlockingBlueprint)}
                      className="w-full py-3.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 hover:text-emerald-300 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2"
                    >
                      🚀 Launch FREE — Monitor Only
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* PHASE: SYNCING — Show sync progress */}
            {unlockPhase === 'syncing' && (
              <div className="bg-slate-900 border border-indigo-500/30 rounded-[2rem] p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="text-center">
                  <div className="text-4xl mb-3 animate-spin">🔄</div>
                  <h3 className="text-xl font-black text-white">Syncing to Marketplace...</h3>
                  <p className="text-slate-400 text-xs mt-1">{unlockingBlueprint?.name}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-500">Blockchain sync progress</span>
                    <span className="text-indigo-400">{Math.floor(syncProgress)}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-600 via-violet-500 to-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${syncProgress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Logs terminal */}
                <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 font-mono text-[9px] space-y-1 max-h-40 overflow-y-auto">
                  {launchLogs.map((log, i) => (
                    <div key={i} className={`${log.includes('SUCCESS') ? 'text-emerald-400' : log.includes('ERROR') ? 'text-red-400' : 'text-slate-500'}`}>
                      {log}
                    </div>
                  ))}
                  {launchLogs.length > 0 && <div className="text-indigo-400 animate-pulse">█</div>}
                </div>
              </div>
            )}

            {/* PHASE: LAUNCHED — Marketplace synced! Now show Launch FREE */}
            {unlockPhase === 'launched' && unlockingBlueprint && (
              <div className="bg-slate-900 border border-emerald-500/40 rounded-[2rem] overflow-hidden shadow-2xl shadow-emerald-500/10 animate-in zoom-in-95 duration-300">
                <div className="p-8 text-center border-b border-slate-800/40 bg-gradient-to-br from-emerald-950/30 to-transparent">
                  <div className="text-5xl mb-4 animate-bounce">✅</div>
                  <h3 className="text-2xl font-black text-white mb-2">Live on Marketplace!</h3>
                  <p className="text-slate-400 text-sm">{unlockingBlueprint.name} is now visible to all HYPHA users</p>
                </div>

                <div className="p-6 space-y-4">
                  {/* Marketplace preview */}
                  <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{unlockingBlueprint.icon}</span>
                        <div>
                          <div className="text-white text-sm font-bold">{unlockingBlueprint.name}</div>
                          <div className="text-slate-500 text-[9px]">HYPHA Marketplace • {unlockingBlueprint.deploymentCount.toLocaleString()} deployed</div>
                        </div>
                      </div>
                      <span className="text-[8px] font-black px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">LIVE ●</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-slate-900 rounded-xl p-2">
                        <div className="text-xs font-black text-indigo-400">{INDUSTRY_TOKENS[unlockingBlueprint.industry]?.symbol || '$TOKEN'}</div>
                        <div className="text-[8px] text-slate-600">Industry Token</div>
                      </div>
                      <div className="bg-slate-900 rounded-xl p-2">
                        <div className="text-xs font-black text-emerald-400">{unlockingBlueprint.web4Features?.autonomyLevel}%</div>
                        <div className="text-[8px] text-slate-600">Autonomy</div>
                      </div>
                      <div className="bg-slate-900 rounded-xl p-2">
                        <div className="text-xs font-black text-amber-400">{unlockingBlueprint.tier}</div>
                        <div className="text-[8px] text-slate-600">Tier</div>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <button
                    onClick={() => handleLaunchFree(unlockingBlueprint)}
                    className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-2xl shadow-emerald-600/20 flex items-center justify-center gap-3"
                  >
                    🚀 <span>Launch {unlockingBlueprint.tier === 'Free' ? 'FREE' : unlockingBlueprint.price}</span> <span className="text-xs opacity-70">→</span>
                  </button>
                  <button
                    onClick={() => { setUnlockingBlueprint(null); setUnlockPhase('locked'); }}
                    className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-2xl font-black uppercase tracking-widest text-xs transition-all"
                  >
                    Back to Marketplace
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* LAUNCH PAGE — After clicking Launch FREE                     */}
      {/* ============================================================ */}
      {showLaunchPage && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-slate-950/98 backdrop-blur-2xl animate-in fade-in duration-500">
          <div className="w-full max-w-xl">
            {(() => {
              const content = LAUNCH_FREE_CONTENT[showLaunchPage.industry] || LAUNCH_FREE_CONTENT['default'];
              const token = INDUSTRY_TOKENS[showLaunchPage.industry];
              return (
                <div className="bg-slate-900 border border-emerald-500/30 rounded-[2rem] overflow-hidden shadow-2xl shadow-emerald-500/10 animate-in zoom-in-95 duration-500">
                  {/* Header */}
                  <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-indigo-950/20 p-10 text-center border-b border-slate-800/40">
                    <div className="text-6xl mb-4 animate-bounce">{showLaunchPage.icon}</div>
                    <h2 className="text-2xl font-black text-white mb-2">{content.title}</h2>
                    <p className="text-slate-400 text-sm leading-relaxed max-w-md mx-auto">{content.description}</p>
                  </div>

                  {/* Live status */}
                  <div className="p-6 border-b border-slate-800/40">
                    <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-3">Live Agent Status</div>
                    <div className="space-y-2">
                      {content.steps.map((step, i) => (
                        <div key={i} className="flex items-center gap-3 bg-slate-950 rounded-xl p-3 border border-slate-800/40">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                          <span className="text-xs text-slate-300 font-mono">{step}</span>
                          <span className="ml-auto text-[8px] font-black text-emerald-400">ACTIVE</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Industry Token info */}
                  {token && (
                    <div className="p-6 border-b border-slate-800/40">
                      <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: token.color + '20', border: `1px solid ${token.color}40` }}>
                            {token.icon}
                          </div>
                          <div>
                            <div className="font-black" style={{ color: token.color }}>{token.symbol}</div>
                            <div className="text-slate-500 text-[9px]">Industry Token • {token.network}</div>
                          </div>
                          <div className="ml-auto text-right">
                            <div className="text-emerald-400 text-xs font-black">{token.estimatedRevenue}</div>
                            <div className="text-slate-600 text-[8px]">Est. passive income</div>
                          </div>
                        </div>
                        <div className="text-[9px] text-slate-500">
                          💰 Revenue model: <span className="text-indigo-400">{token.paymentModel}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action */}
                  <div className="p-6 space-y-3">
                    <div className="bg-slate-950/60 rounded-2xl p-4 border border-indigo-500/20 text-center">
                      <div className="text-slate-400 text-xs">{content.monitorMessage}</div>
                    </div>
                    <button
                      onClick={handleCloseLaunchPage}
                      className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-2xl shadow-indigo-600/20 flex items-center justify-center gap-3"
                    >
                      📊 <span>Go to Dashboard — Monitor Pod</span>
                    </button>
                    <button
                      onClick={() => setShowLaunchPage(null)}
                      className="w-full py-3 bg-slate-800/60 text-slate-500 rounded-2xl text-xs font-bold transition-all hover:bg-slate-800"
                    >
                      Stay on Marketplace
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SOVEREIGN AGENT MARKETPLACE — Quick Access Landing Pages     */}
      {/* ============================================================ */}
      <div className="rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-950/30 via-slate-950 to-indigo-950/20 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/30 rounded-full text-[9px] font-black text-violet-400 uppercase tracking-widest mb-2">
              <span>👑</span> SOVEREIGN AGENT MARKETPLACE
            </div>
            <h2 className="text-lg font-black text-white">Pilih Agent untuk Bisnis Anda</h2>
            <p className="text-[10px] text-slate-500">Platform AI Agent siap pakai untuk bisnis Indonesia. Otomatisasi operasional, tingkatkan revenue.</p>
          </div>
          <button
            onClick={() => navigate('/store')}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all"
          >
            🛍️ Buka Store →
          </button>
        </div>

        {/* Ramadan/Lebaran Banner */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌙</span>
            <div>
              <div className="text-xs font-black text-amber-400">Ramadan &amp; Lebaran Special — H-32 LEBARAN!</div>
              <div className="text-[9px] text-amber-300/70">Muslim peak order SHGA &amp; SICA! Deadline order hamper: <span className="font-bold">25 hari lagi.</span></div>
            </div>
          </div>
          <button onClick={() => navigate('/shga-landing')} className="shrink-0 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-white rounded-xl text-[10px] font-bold transition-all">
            Lihat SHGA →
          </button>
        </div>

        {/* Agent Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { id: 'shga', icon: '🎁', name: 'SHGA', sub: 'AI untuk bisnis hamper & gift Lebaran', color: 'amber', landing: '/shga-landing', badge: '🔥 H-32!', status: 'live' },
            { id: 'sica', icon: '🌙', name: 'SICA', sub: 'AI untuk katering Ramadan & event', color: 'indigo', landing: '/sica-landing', badge: '🌙 Ramadan!', status: 'live' },
            { id: 'sca', icon: '⚖️', name: 'SCA', sub: 'AI analisis kontrak & dokumen legal', color: 'emerald', landing: '/sca-landing', badge: '⚡ AI-Powered', status: 'live' },
            { id: 'sma', icon: '👑', name: 'SMA', sub: 'Meta-platform semua Sovereign Agents', color: 'violet', landing: '/sma-landing', badge: '🚀 NEW!', status: 'live' },
            { id: 'sb', icon: '✂️', name: 'SB', sub: '"The Community Node" — AI Barbershop', color: 'yellow', landing: '/bde-landing', badge: '🆕 NEW', status: 'live' },
            { id: 'sl', icon: '🏛️', name: 'SL', sub: '"The Family Sanctuary" — Digital Legacy', color: 'purple', landing: '/legacy-landing', badge: '🆕 NEW', status: 'live' },
          ].map(agent => {
            const colorMap: Record<string, string> = {
              amber: 'border-amber-500/30 hover:border-amber-500/60 text-amber-400',
              indigo: 'border-indigo-500/30 hover:border-indigo-500/60 text-indigo-400',
              emerald: 'border-emerald-500/30 hover:border-emerald-500/60 text-emerald-400',
              violet: 'border-violet-500/30 hover:border-violet-500/60 text-violet-400',
              yellow: 'border-yellow-500/30 hover:border-yellow-500/60 text-yellow-400',
              purple: 'border-purple-500/30 hover:border-purple-500/60 text-purple-400',
            };
            return (
              <button
                key={agent.id}
                onClick={() => navigate(agent.landing)}
                className={`relative p-3 rounded-2xl border bg-slate-900/80 transition-all hover:scale-[1.03] active:scale-95 text-left ${colorMap[agent.color]}`}
              >
                <div className="absolute -top-2 left-2">
                  <span className="text-[8px] font-black bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded-full text-slate-300">{agent.badge}</span>
                </div>
                <div className="mt-2">
                  <div className="text-2xl mb-1">{agent.icon}</div>
                  <div className="text-xs font-black text-white">{agent.name}</div>
                  <div className="text-[8px] text-slate-500 mt-0.5 line-clamp-2">{agent.sub}</div>
                  <div className="mt-2 text-[8px] font-bold text-emerald-400 flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div> Live
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex gap-2 flex-wrap">
          <button onClick={() => navigate('/store')} className="flex-1 sm:flex-none py-2.5 px-5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all">
            🛍️ Buka Sovereign Store → Checkout via Duitku
          </button>
          <button onClick={() => navigate('/sma-landing')} className="flex-1 sm:flex-none py-2.5 px-5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 transition-all">
            👑 Lihat SMA Bundle (Hemat 60%)
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MAIN MARKETPLACE CONTENT                                     */}
      {/* ============================================================ */}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-6 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
              Hypha Web4 Hub <span className="text-indigo-400 font-mono text-xs">v3.0-STABLE</span>
            </h3>
            <p className="text-[8px] text-slate-600 font-mono uppercase tracking-widest">Cloudflare + Groq + Supabase + LangChain + CrewAI</p>
          </div>
        </div>
        <div className="flex bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/60">
          {(['market', 'insights', 'tokenomics'] as const).map(mode => (
            <button key={mode} onClick={() => setViewMode(mode)}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === mode ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >{mode}</button>
          ))}
        </div>
      </div>

      {viewMode === 'market' ? (
        <>
          {/* Trend Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {isLoadingTrends
              ? Array(3).fill(0).map((_, i) => <div key={i} className="h-28 bg-slate-900/50 border border-slate-800 rounded-2xl animate-pulse"></div>)
              : trends.map((trend, i) => (
                <div key={i} className="glass rounded-2xl p-4 border border-indigo-500/10 hover:border-indigo-400/30 transition-all group">
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h4 className="text-sm font-bold text-white flex-1 truncate">{trend.title}</h4>
                    <span className="text-[8px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20 shrink-0">{trend.growth}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-2 mb-3">{trend.description}</p>
                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 transition-all duration-700" style={{ width: `${trend.impact}%` }}></div>
                  </div>
                </div>
              ))
            }
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total Pods', value: blueprints.reduce((a, b) => a + b.deploymentCount, 0).toLocaleString(), icon: '🧬', color: 'text-indigo-400' },
              { label: 'Industry Tokens', value: Object.keys(INDUSTRY_TOKENS).length.toString(), icon: '🪙', color: 'text-amber-400' },
              { label: 'Active Users', value: `${(blueprints.reduce((a, b) => a + b.deploymentCount, 0) * 0.3).toFixed(0)}+`, icon: '👥', color: 'text-emerald-400' },
              { label: 'Monthly Revenue', value: '$115K', icon: '💰', color: 'text-violet-400' }
            ].map((stat, i) => (
              <div key={i} className="glass p-4 rounded-2xl border border-slate-800/60 flex items-center gap-3">
                <span className="text-xl">{stat.icon}</span>
                <div>
                  <div className={`text-lg font-black ${stat.color}`}>{stat.value}</div>
                  <div className="text-[8px] text-slate-600 uppercase font-bold tracking-wider">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="space-y-3">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveTab(cat)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeTab === cat ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'}`}
                >{cat}</button>
              ))}
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center bg-slate-900/40 p-4 rounded-[2rem] border border-slate-800/60">
              <div className="relative w-full md:w-64">
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search pods, industry, token..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-4 text-[11px] text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                />
                <span className="absolute left-3 top-3 text-slate-600 text-xs">🔍</span>
              </div>
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800/60">
                {tiers.map(t => (
                  <button key={t} onClick={() => setActiveTier(t)}
                    className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all ${activeTier === t ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20' : 'text-slate-600 hover:text-slate-300'}`}
                  >{t}</button>
                ))}
              </div>
              {compareList.length > 0 && (
                <div className="ml-auto flex items-center gap-3 animate-in fade-in">
                  <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">{compareList.length} Comparing</span>
                  <button onClick={() => setCompareList([])} className="text-[9px] text-slate-600 hover:text-red-400 transition-colors">Reset</button>
                </div>
              )}
            </div>
          </div>

          {/* Blueprint Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingBlueprints
              ? Array(6).fill(0).map((_, i) => <div key={i} className="h-96 glass rounded-[2.5rem] border border-slate-800 animate-pulse"></div>)
              : filteredBlueprints.map(blueprint => {
                const isProvisioning = deployingIds.includes(blueprint.id);
                const deployedPod = deployedEcosystems.find(de => de.blueprintId === blueprint.id);
                const isComparing = compareList.includes(blueprint.id);
                const isUnlocked = unlockedBlueprintIds.includes(blueprint.id) || blueprint.tier === 'Free';
                const token = INDUSTRY_TOKENS[blueprint.industry];

                return (
                  <div
                    key={blueprint.id}
                    onClick={() => setSelectedBlueprint(blueprint)}
                    className={`glass rounded-[2.5rem] p-7 flex flex-col group transition-all cursor-pointer relative overflow-hidden border blueprint-card ${
                      isProvisioning ? 'border-indigo-500/80 animate-pulse' :
                      blueprint.isFeatured ? 'border-indigo-500/40 shadow-2xl shadow-indigo-600/5' :
                      'border-slate-800/60 hover:border-slate-700'
                    }`}
                  >
                    {/* Action buttons */}
                    <div className="absolute top-4 right-4 flex gap-1.5">
                      <button onClick={e => { e.stopPropagation(); setCompareList(prev => prev.includes(blueprint.id) ? prev.filter(i => i !== blueprint.id) : [...prev, blueprint.id]); }}
                        className={`w-7 h-7 rounded-xl border flex items-center justify-center text-xs transition-all ${isComparing ? 'bg-indigo-600 border-indigo-400' : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'}`}
                      >⚖️</button>
                      <button onClick={e => handleShare(e, blueprint)}
                        className="w-7 h-7 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-center text-xs hover:border-slate-700 transition-all"
                      >📤</button>
                    </div>

                    {/* Icon + Tier */}
                    <div className="flex items-start gap-4 mb-5">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                          {blueprint.icon}
                        </div>
                        {isUnlocked && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center text-[8px] border-2 border-slate-900">✓</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-1.5 mb-1">
                          <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase ${blueprint.tier === 'Enterprise' ? 'bg-amber-500/10 text-amber-500' : blueprint.tier === 'Pro' ? 'bg-purple-500/10 text-purple-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                            {blueprint.tier}
                          </span>
                          {blueprint.web3Integration?.deFiEnabled && (
                            <span className="px-2 py-0.5 rounded-lg text-[8px] font-black uppercase bg-emerald-500/10 text-emerald-400">DeFi</span>
                          )}
                          {token && (
                            <span className="px-2 py-0.5 rounded-lg text-[8px] font-black uppercase" style={{ backgroundColor: token.color + '15', color: token.color }}>
                              {token.symbol}
                            </span>
                          )}
                        </div>
                        <span className="text-[8px] font-mono text-slate-600 uppercase">{blueprint.infrastructure}</span>
                      </div>
                    </div>

                    {/* Name */}
                    <h4 className="text-lg font-bold text-white mb-1.5 group-hover:text-indigo-400 transition-colors flex items-center gap-2 flex-wrap">
                      {blueprint.name}
                      {isUnlocked && <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 font-black uppercase">🔓 Unlocked</span>}
                      {deployedPod && <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>}
                    </h4>
                    <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2 mb-4">{blueprint.description}</p>

                    {/* Industry Token Badge */}
                    {token && (
                      <div className="mb-4 bg-slate-950/60 rounded-xl p-3 border border-slate-800/40">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{token.icon}</span>
                            <div>
                              <div className="text-[9px] font-black" style={{ color: token.color }}>{token.symbol}</div>
                              <div className="text-[7px] text-slate-600">{token.saasModel}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-[8px] text-emerald-400 font-bold">{token.estimatedRevenue.split('/')[0]}</div>
                            <div className="text-[7px] text-slate-600">revenue</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* AI Stack */}
                    {blueprint.web4Features && (
                      <div className="quick-specs flex flex-wrap gap-1.5 mb-4">
                        <span className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded-lg text-[8px] font-black text-purple-400 uppercase">
                          {blueprint.web4Features.aiOrchestrator}
                        </span>
                        <span className="px-2 py-0.5 bg-orange-500/10 border border-orange-500/20 rounded-lg text-[8px] font-black text-orange-400 uppercase">
                          CF Workers
                        </span>
                        {blueprint.web4Features.crossChainEnabled && (
                          <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-[8px] font-black text-blue-400 uppercase">Cross-Chain</span>
                        )}
                      </div>
                    )}

                    {/* Autonomy Bar */}
                    {blueprint.web4Features && (
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[8px] text-slate-600 uppercase font-black tracking-widest">Autonomy</span>
                          <span className="text-[8px] font-mono text-indigo-400">{blueprint.web4Features.autonomyLevel}%</span>
                        </div>
                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500" style={{ width: `${blueprint.web4Features.autonomyLevel}%` }}></div>
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="mt-auto pt-4 border-t border-slate-900/60 flex items-center justify-between">
                      <div>
                        <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest block mb-0.5">Deployed</span>
                        <span className="text-xs font-mono font-bold text-white">{blueprint.deploymentCount.toLocaleString()}x</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {deployedPod ? (
                          <button onClick={e => { e.stopPropagation(); navigate(`/dashboard?podId=${deployedPod.id}`); }}
                            className="px-5 py-2.5 bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                          >Monitor →</button>
                        ) : (
                          <>
                            <button onClick={e => { e.stopPropagation(); navigate('/architect', { state: { initialPrompt: `Base: ${blueprint.name} | Industry: ${blueprint.industry}` } }); }}
                              className="p-2.5 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 text-xs transition-all"
                            >🏗️</button>
                            
                            {/* UNLOCK → LAUNCH FLOW */}
                            {isUnlocked ? (
                              <button
                                onClick={e => { 
                                  e.stopPropagation();
                                  if (blueprint.tier === 'Free') {
                                    handleLaunchFree(blueprint);
                                  } else {
                                    onDeploy(blueprint);
                                  }
                                }}
                                disabled={isProvisioning}
                                className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center gap-1.5 ${
                                  blueprint.tier === 'Free' 
                                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                                } ${isProvisioning ? 'opacity-50 cursor-wait' : ''}`}
                              >
                                {isProvisioning ? (
                                  <><span className="animate-spin">🔄</span> Syncing...</>
                                ) : blueprint.tier === 'Free' ? (
                                  <>🚀 Launch FREE</>
                                ) : (
                                  <>Launch <span className="bg-white/20 px-1 py-0.5 rounded text-[8px] font-mono">{blueprint.tier === 'Enterprise' ? '500H' : '150H'}</span></>
                                )}
                              </button>
                            ) : (
                              <button
                                onClick={e => handleUnlockBlueprint(e, blueprint)}
                                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-indigo-500/50 text-slate-300 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-1.5"
                              >
                                🔒 Unlock
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            }
          </div>
        </>
      ) : viewMode === 'insights' ? (
        <div className="space-y-8 animate-in zoom-in-95 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {[
              { label: 'Total Deployments', value: blueprints.reduce((a, b) => a + b.deploymentCount, 0).toLocaleString(), icon: '🧬', color: 'text-indigo-400' },
              { label: 'Groq API Calls', value: '847K/day', icon: '⚡', color: 'text-purple-400' },
              { label: 'Supabase RPS', value: '12.4K', icon: '🗄️', color: 'text-emerald-400' },
              { label: 'Active CrewAI', value: '234 crews', icon: '🤖', color: 'text-amber-400' }
            ].map((stat, i) => (
              <div key={i} className="glass p-6 rounded-3xl border border-slate-800/60">
                <span className="text-2xl block mb-3">{stat.icon}</span>
                <p className={`text-2xl font-black ${stat.color} mb-1`}>{stat.value}</p>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass p-8 rounded-[2.5rem] border border-slate-800/60 h-80 flex flex-col">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Pod Popularity</h4>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={popularityData} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} width={70} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }} />
                    <Bar dataKey="deployments" radius={[0, 8, 8, 0]}>
                      {popularityData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="glass p-8 rounded-[2.5rem] border border-slate-800/60 h-80 flex flex-col">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">AI Orchestrator Distribution</h4>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={[
                      { name: 'Groq', value: 45 }, { name: 'CrewAI', value: 30 },
                      { name: 'LangChain', value: 20 }, { name: 'CF-AI', value: 5 }
                    ]} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={5} dataKey="value">
                      {[0,1,2,3].map(i => <Cell key={i} fill={COLORS[i]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 800 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Industry Token Map */}
          <div className="glass p-8 rounded-[2.5rem] border border-slate-800/60">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Industry Token Ecosystem (SaaS × AI × Web3)</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(INDUSTRY_TOKENS).map(([industry, token]) => (
                <div key={industry} className="bg-slate-950 rounded-2xl p-4 border border-slate-800 hover:border-slate-700 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: token.color + '20', border: `1px solid ${token.color}40` }}>
                      {token.icon}
                    </div>
                    <div>
                      <div className="text-sm font-black" style={{ color: token.color }}>{token.symbol}</div>
                      <div className="text-[8px] text-slate-600">{token.network}</div>
                    </div>
                  </div>
                  <div className="text-[9px] text-slate-400 font-medium mb-1">{industry}</div>
                  <div className="text-[8px] text-emerald-400 font-bold">{token.estimatedRevenue}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in zoom-in-95 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Total HYPHA Supply', value: '1,000,000,000', icon: '💎', color: 'text-indigo-400' },
              { label: 'Circulating Supply', value: '342,000,000', icon: '🌊', color: 'text-emerald-400' },
              { label: 'Staking APY', value: '18.5%', icon: '🔒', color: 'text-amber-400' }
            ].map((s, i) => (
              <div key={i} className="glass p-8 rounded-[2.5rem] border border-slate-800/60">
                <span className="text-3xl block mb-4">{s.icon}</span>
                <p className={`text-2xl font-black ${s.color} mb-1`}>{s.value}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Dual Token: HYPHA + PREMALTA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass p-6 rounded-[2rem] border border-indigo-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-2xl">🌿</div>
                <div>
                  <div className="text-white font-black">$HYPHA</div>
                  <div className="text-slate-500 text-xs">Platform Governance Token • Ethereum + Arbitrum</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-emerald-400 font-black">$0.20</div>
                  <div className="text-[8px] text-emerald-500">+8.34% 24h</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950 rounded-xl p-3"><span className="text-slate-500 block text-[8px] mb-1">Market Cap</span><span className="text-white font-bold">$68.4M</span></div>
                <div className="bg-slate-950 rounded-xl p-3"><span className="text-slate-500 block text-[8px] mb-1">Holders</span><span className="text-white font-bold">24,891</span></div>
                <div className="bg-slate-950 rounded-xl p-3"><span className="text-slate-500 block text-[8px] mb-1">Staking APY</span><span className="text-indigo-400 font-bold">18.5%</span></div>
                <div className="bg-slate-950 rounded-xl p-3"><span className="text-slate-500 block text-[8px] mb-1">Volume 24h</span><span className="text-white font-bold">$4.2M</span></div>
              </div>
            </div>

            <div className="glass p-6 rounded-[2rem] border border-violet-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-2xl">🦋</div>
                <div>
                  <div className="text-white font-black">$PREMALTA</div>
                  <div className="text-slate-500 text-xs">Creator Economy Token • Base Network</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-amber-400 font-black">$0.01</div>
                  <div className="text-[8px] text-amber-500">Target post-DEX</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950 rounded-xl p-3"><span className="text-slate-500 block text-[8px] mb-1">Contract</span><span className="text-violet-400 font-mono text-[9px] font-bold">0xC012...C94c7</span></div>
                <div className="bg-slate-950 rounded-xl p-3"><span className="text-slate-500 block text-[8px] mb-1">Network</span><span className="text-white font-bold">Base (Coinbase L2)</span></div>
                <div className="bg-slate-950 rounded-xl p-3"><span className="text-slate-500 block text-[8px] mb-1">Staking APY</span><span className="text-violet-400 font-bold">15%</span></div>
                <div className="bg-slate-950 rounded-xl p-3"><span className="text-slate-500 block text-[8px] mb-1">Status</span><span className="text-amber-400 font-bold">Pre-Liquidity</span></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass p-8 rounded-[2.5rem] border border-slate-800/60 h-96 flex flex-col">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">HYPHA Allocation</h4>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={tokenDistribution} cx="50%" cy="50%" innerRadius={70} outerRadius={120} paddingAngle={4} dataKey="value">
                      {tokenDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '16px', fontSize: '10px' }} />
                    <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 800 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="glass p-8 rounded-[2.5rem] border border-slate-800/60 h-96 flex flex-col">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Staking APY History</h4>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stakingAPY}>
                    <defs>
                      <linearGradient id="colorApy" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.2} />
                    <XAxis dataKey="month" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} unit="%" />
                    <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '16px', fontSize: '10px' }} />
                    <Area type="monotone" dataKey="apy" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorApy)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blueprint Detail Modal */}
      {selectedBlueprint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300 overflow-y-auto">
          <div className="glass w-full max-w-2xl rounded-[2.5rem] my-8 overflow-hidden border border-slate-800/60 shadow-3xl flex flex-col">
            <div className="p-10 border-b border-slate-800/40 relative bg-gradient-to-br from-indigo-950/20 to-transparent">
              <button onClick={() => setSelectedBlueprint(null)} className="absolute top-8 right-8 text-slate-600 hover:text-white text-xl transition-colors">✕</button>
              <div className="flex items-center gap-8">
                <div className="w-24 h-24 rounded-[1.5rem] bg-slate-900 border border-slate-800 flex items-center justify-center text-5xl shadow-2xl">
                  {selectedBlueprint.icon}
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white tracking-tight mb-2">{selectedBlueprint.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[9px] font-black bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded-xl border border-indigo-500/20 uppercase">{selectedBlueprint.industry}</span>
                    {selectedBlueprint.web4Features && (
                      <span className="text-[9px] font-black bg-purple-500/10 text-purple-400 px-2.5 py-1 rounded-xl border border-purple-500/20 uppercase">{selectedBlueprint.web4Features.aiOrchestrator}</span>
                    )}
                    {selectedBlueprint.web3Integration?.blockchain && (
                      <span className="text-[9px] font-black bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-xl border border-blue-500/20 uppercase">{selectedBlueprint.web3Integration.blockchain}</span>
                    )}
                    {(() => {
                      const token = INDUSTRY_TOKENS[selectedBlueprint.industry];
                      return token ? (
                        <span className="text-[9px] font-black px-2.5 py-1 rounded-xl border uppercase" style={{ backgroundColor: token.color + '15', color: token.color, borderColor: token.color + '40' }}>
                          {token.symbol}
                        </span>
                      ) : null;
                    })()}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-10 space-y-8 overflow-y-auto flex-1 custom-scrollbar max-h-96">
              <p className="text-slate-400 leading-relaxed text-sm">{selectedBlueprint.description}</p>
              
              {/* Industry Token detail */}
              {(() => {
                const token = INDUSTRY_TOKENS[selectedBlueprint.industry];
                return token ? (
                  <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800">
                    <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-3">Industry Token Economics</div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: token.color + '20', border: `1px solid ${token.color}40` }}>
                        {token.icon}
                      </div>
                      <div>
                        <div className="font-black text-base" style={{ color: token.color }}>{token.symbol} — {token.name}</div>
                        <div className="text-slate-500 text-[9px]">{token.network} • {token.saasModel}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-900 rounded-xl p-3">
                        <div className="text-[8px] text-slate-600 uppercase mb-1">Payment Model</div>
                        <div className="text-[9px] text-amber-400 font-bold">{token.paymentModel}</div>
                      </div>
                      <div className="bg-slate-900 rounded-xl p-3">
                        <div className="text-[8px] text-slate-600 uppercase mb-1">Est. Revenue</div>
                        <div className="text-[9px] text-emerald-400 font-bold">{token.estimatedRevenue}</div>
                      </div>
                    </div>
                  </div>
                ) : null;
              })()}

              {selectedBlueprint.features && (
                <div className="grid grid-cols-2 gap-3">
                  {selectedBlueprint.features.map(f => (
                    <div key={f} className="bg-slate-900/40 p-3 rounded-2xl border border-slate-800/40 flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0"></div>
                      <span className="text-xs text-slate-300 font-medium">{f}</span>
                    </div>
                  ))}
                </div>
              )}
              {selectedBlueprint.cognitiveSpecs && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800/40">
                    <span className="text-[8px] font-black text-slate-600 uppercase block mb-1">Reasoning</span>
                    <span className="text-lg font-bold text-indigo-400">{selectedBlueprint.cognitiveSpecs.reasoningDepth}%</span>
                  </div>
                  <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800/40">
                    <span className="text-[8px] font-black text-slate-600 uppercase block mb-1">Sovereignty</span>
                    <span className="text-lg font-bold text-purple-400">{selectedBlueprint.cognitiveSpecs.sovereigntyLevel}%</span>
                  </div>
                  <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800/40">
                    <span className="text-[8px] font-black text-slate-600 uppercase block mb-1">Memory</span>
                    <span className="text-xs font-bold text-amber-400">{selectedBlueprint.cognitiveSpecs.memoryPersistence}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="p-8 border-t border-slate-800/60 bg-slate-950/40 flex gap-4">
              <button onClick={() => setSelectedBlueprint(null)} className="flex-1 py-4 bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800 rounded-2xl font-black uppercase tracking-widest transition-all">Close</button>
              <button onClick={() => { 
                setSelectedBlueprint(null);
                const isAlreadyUnlocked = unlockedBlueprintIds.includes(selectedBlueprint.id) || selectedBlueprint.tier === 'Free';
                if (isAlreadyUnlocked) {
                  if (selectedBlueprint.tier === 'Free') {
                    handleLaunchFree(selectedBlueprint);
                  } else {
                    onDeploy(selectedBlueprint);
                  }
                } else {
                  // Trigger unlock flow
                  setUnlockingBlueprint(selectedBlueprint);
                  setUnlockPhase('unlocking');
                  setSyncProgress(0);
                  let progress = 0;
                  const interval = setInterval(() => {
                    progress += Math.random() * 15 + 5;
                    setSyncProgress(Math.min(progress, 100));
                    if (progress >= 100) {
                      clearInterval(interval);
                      setUnlockPhase('unlocked');
                      setUnlockedBlueprintIds(prev => [...prev, selectedBlueprint.id]);
                    }
                  }, 150);
                }
              }}
                className="flex-[2] py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-2xl shadow-indigo-600/20 flex items-center justify-center gap-2"
              >
                {(unlockedBlueprintIds.includes(selectedBlueprint.id) || selectedBlueprint.tier === 'Free')
                  ? selectedBlueprint.tier === 'Free' 
                    ? '🚀 Launch FREE' 
                    : `Launch Pod (${selectedBlueprint.tier === 'Enterprise' ? '500' : '150'}H)`
                  : '🔒 Unlock Blueprint'
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
