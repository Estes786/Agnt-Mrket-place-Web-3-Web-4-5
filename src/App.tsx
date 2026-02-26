
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { BLUEPRINTS } from './constants';
import { DeployedEcosystem, Blueprint, UserStats } from './types';
import Marketplace from './components/Marketplace';
import Dashboard from './components/Dashboard';
import ArchitectMode from './components/ArchitectMode';
import MediaLab from './components/MediaLab';
import Roadmap from './components/Roadmap';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import GaniAssistant from './components/GaniAssistant';
import Web3Panel from './components/Web3Panel';
import Tokenomics from './components/Tokenomics';
import DAppsHub from './components/DAppsHub';
import DAOGovernance from './components/DAOGovernance';
import Web3Identity from './components/Web3Identity';
import PremaltaDashboard from './components/PremaltaDashboard';
import StrategyCenter from './components/StrategyCenter';
import AIWeb5Roadmap from './components/AIWeb5Roadmap';
import RevenueHub from './components/RevenueHub';
import TokenLaunchPad from './components/TokenLaunchPad';
import AutonomousEconomy from './components/AutonomousEconomy';
import Web5Command from './components/Web5Command';
import MasterControl from './components/MasterControl';
import SupabaseDashboard from './components/SupabaseDashboard';
import BuildInPublic from './components/BuildInPublic';
import SCA from './components/SCA';
import SICA from './components/SICA';
import SHGA from './components/SHGA';

const App: React.FC = () => {
  const navigate = useNavigate();
  const [blueprints, setBlueprints] = useState<Blueprint[]>(BLUEPRINTS);
  const [deployedEcosystems, setDeployedEcosystems] = useState<DeployedEcosystem[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    hyphaBalance: 2500,
    usdBalance: 1500,
    ethBalance: 0.42,
    totalYield: 0,
    activeNodes: 0,
    transactions: [],
    isWalletConnected: false,
    stakedAmount: 0,
    governancePower: 0,
    reputationScore: 98.4,
    epochRewards: 0,
    liquidityPositions: [],
    yieldStrategies: [],
    nftHoldings: 0,
    web3AuthConnected: false
  });
  const [isGaniOpen, setIsGaniOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [deployingIds, setDeployingIds] = useState<string[]>([]);

  // Autonomous income simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setDeployedEcosystems(prev => prev.map(eco => {
        if (eco.status === 'Active' || eco.status === 'Sovereign') {
          const incomeGain = (eco.metrics.yieldRate / 100) * (Math.random() * 10);
          if (incomeGain > 0) {
            return {
              ...eco,
              metrics: {
                ...eco.metrics,
                autonomousIncome: eco.metrics.autonomousIncome + incomeGain,
                groqCallsPerHour: (eco.metrics.groqCallsPerHour || 0) + Math.floor(Math.random() * 5),
                langchainWorkflows: (eco.metrics.langchainWorkflows || 0) + (Math.random() > 0.7 ? 1 : 0)
              }
            };
          }
        }
        return eco;
      }));

      // Simulate epoch rewards for stakers
      if (userStats.stakedAmount > 0) {
        setUserStats(prev => ({
          ...prev,
          epochRewards: prev.epochRewards + (prev.stakedAmount * 0.185 / 365 / 24 / 12) // every 5 seconds
        }));
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [userStats.stakedAmount]);

  const handleConnectWallet = () => {
    if (userStats.isWalletConnected) return;
    const entropy = Math.random().toString(16).substring(2);
    const fakeAddress = `0x${entropy.substring(0, 4)}...${entropy.substring(4, 8)}`;
    const fullAddress = `0x742d35Cc6634C0532925a3b844Bc${entropy.substring(0, 6)}`;
    setUserStats(prev => ({
      ...prev,
      isWalletConnected: true,
      walletAddress: fullAddress,
      governancePower: 120,
      web3Wallet: {
        address: fullAddress,
        network: 'Ethereum',
        balance: 1.24,
        nftCount: 3,
        isVerified: true,
        ensName: 'gani.hypha.eth'
      },
      didDocument: `did:ethr:mainnet:${fullAddress}`
    }));
    setIsGaniOpen(true);
  };

  const handleDisconnectWallet = () => {
    setUserStats(prev => ({
      ...prev,
      isWalletConnected: false,
      walletAddress: undefined,
      web3Wallet: undefined,
      didDocument: undefined
    }));
  };

  const handleClaimYield = (amount: number) => {
    setUserStats(prev => ({
      ...prev,
      hyphaBalance: prev.hyphaBalance + amount,
      totalYield: prev.totalYield + amount,
      transactions: [
        {
          id: `y-${Date.now()}`,
          type: 'yield',
          amount,
          currency: 'HYPHA',
          timestamp: new Date(),
          description: 'Autonomous Yield Harvest',
          txHash: `0x${Math.random().toString(16).substring(2, 12)}`,
          chain: 'Ethereum',
          status: 'Confirmed'
        },
        ...prev.transactions
      ]
    }));
  };

  const handlePurchase = (blueprint: Blueprint) => {
    const cost = blueprint.tier === 'Enterprise' ? 500 : blueprint.tier === 'Pro' ? 150 : 0;
    if (userStats.hyphaBalance < cost) {
      alert(`Insufficient HYPHA credits. Need ${cost} but have ${userStats.hyphaBalance}. Gyss!`);
      return;
    }
    setUserStats(prev => ({
      ...prev,
      hyphaBalance: prev.hyphaBalance - cost,
      activeNodes: prev.activeNodes + 1,
      transactions: [
        {
          id: `s-${Date.now()}`,
          type: 'subscription',
          amount: cost,
          currency: 'HYPHA',
          timestamp: new Date(),
          description: `Subscription: ${blueprint.name}`,
          chain: 'Cloudflare',
          status: 'Confirmed'
        },
        ...prev.transactions
      ]
    }));
    handleDeploy(blueprint);
  };

  const handleStake = (amount: number) => {
    if (userStats.hyphaBalance < amount) return;
    setUserStats(prev => ({
      ...prev,
      hyphaBalance: prev.hyphaBalance - amount,
      stakedAmount: prev.stakedAmount + amount,
      governancePower: Math.floor(prev.governancePower + (amount * 1.2)),
      epochRewards: prev.epochRewards + (amount * 0.185 / 365),
      transactions: [
        {
          id: `st-${Date.now()}`,
          type: 'stake',
          amount,
          currency: 'HYPHA',
          timestamp: new Date(),
          description: `Stake ${amount} HYPHA → vHYPHA`,
          txHash: `0x${Math.random().toString(16).substring(2, 12)}`,
          chain: 'Ethereum',
          status: 'Confirmed'
        },
        ...prev.transactions
      ]
    }));
  };

  const handleUnstake = (amount: number) => {
    if (userStats.stakedAmount < amount) return;
    setUserStats(prev => ({
      ...prev,
      hyphaBalance: prev.hyphaBalance + amount,
      stakedAmount: prev.stakedAmount - amount,
      governancePower: Math.max(0, Math.floor(prev.governancePower - (amount * 1.2))),
      transactions: [
        {
          id: `ust-${Date.now()}`,
          type: 'unstake',
          amount,
          currency: 'HYPHA',
          timestamp: new Date(),
          description: `Unstake ${amount} HYPHA`,
          txHash: `0x${Math.random().toString(16).substring(2, 12)}`,
          chain: 'Ethereum',
          status: 'Pending'
        },
        ...prev.transactions
      ]
    }));
  };

  const handleDeploy = (blueprint: Blueprint) => {
    setDeployingIds(prev => [...prev, blueprint.id]);
    setBlueprints(prev => prev.map(b =>
      b.id === blueprint.id ? { ...b, deploymentCount: b.deploymentCount + 1 } : b
    ));

    const txHash = `0x${Math.random().toString(16).substring(2, 20)}`;
    const newEcosystem: DeployedEcosystem = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      blueprintId: blueprint.id,
      name: blueprint.name,
      status: 'Syncing',
      deployedAt: new Date().toISOString(),
      logs: [
        `[INIT] HYPHA Master Engine v3.0 initializing... Gyss!`,
        `[WEB3] DID identity minted: did:ethr:mainnet:0x${Math.random().toString(16).substring(2, 10)}`,
        `[ALCHEMY] Connecting to Ethereum via Alchemy RPC... ✓ Block #${Math.floor(Math.random() * 100000 + 19000000)}`,
        `[GROQ] Connecting to llama-3.3-70b API... ${Math.floor(Math.random() * 200 + 100)}ms latency`,
        `[SUPABASE] Database connection established. RLS policies active. Gyss!`,
        `[LANGCHAIN] Workflow orchestrator initialized. Tracing via LangSmith.`,
        `[CREWAI] Multi-agent crew spawned: ${blueprint.roles.length} agents active`,
        `[IPFS] Pinata pinning blueprint to IPFS... CID: Qm${Math.random().toString(36).substring(2, 18)}`,
        `[THE_GRAPH] Indexing protocol data from subgraph...`,
        `[CF-WORKERS] Edge deployment to ${Math.floor(Math.random() * 200 + 100)} PoPs worldwide`,
        `[WEB4] Autonomous Protocol v4.0 activating...`,
        `[TOKENOMICS] Economic autonomy module ${blueprint.cognitiveSpecs?.economicAutonomy ? 'ENABLED' : 'standby'}`,
        `[TX] Deployment transaction: ${txHash.substring(0, 20)}...`
      ],
      metrics: {
        computeUsage: '0ms',
        a2aActivity: '0',
        stateSize: '0KB',
        nodeHealth: 0,
        autonomousIncome: 0,
        yieldRate: blueprint.tier === 'Enterprise' ? 12.5 : blueprint.tier === 'Pro' ? 4.2 : 0.5,
        dwnSyncStatus: 0,
        verifiableCredentials: Math.floor(Math.random() * 5 + 1),
        groqCallsPerHour: 0,
        supabaseConnected: true,
        langchainWorkflows: 0
      },
      didHash: `did:ethr:mainnet:0x${Math.random().toString(16).substring(2, 10)}`,
      blockchainTxHash: txHash
    };

    setDeployedEcosystems(prev => [...prev, newEcosystem]);
    setIsGaniOpen(true);

    setTimeout(() => {
      setDeployingIds(prev => prev.filter(id => id !== blueprint.id));
      setDeployedEcosystems(prev =>
        prev.map(e => e.id === newEcosystem.id ? {
          ...e,
          status: blueprint.cognitiveSpecs?.sovereigntyLevel && blueprint.cognitiveSpecs.sovereigntyLevel >= 95 ? 'Sovereign' : 'Active',
          logs: [...e.logs,
            `[SUCCESS] 🚀 Pod '${newEcosystem.name}' is now LIVE & AUTONOMOUS!`,
            `[METRICS] Node health: 100% | Groq latency: ${Math.floor(Math.random() * 200 + 50)}ms`,
            `[WEB3] DID verified on-chain | Sovereignty: ${blueprint.cognitiveSpecs?.sovereigntyLevel || 75}%`,
            `[YIELD] Income stream active: ${blueprint.tier === 'Enterprise' ? 12.5 : blueprint.tier === 'Pro' ? 4.2 : 0.5}% /hour`,
            `[GYSS] Akar Dalam, Cabang Tinggi! Autonomous operations confirmed.`
          ],
          metrics: {
            ...e.metrics,
            nodeHealth: 100,
            dwnSyncStatus: 98,
            computeUsage: `${Math.floor(Math.random() * 15 + 5)}ms`,
            a2aActivity: `${Math.floor(Math.random() * 500 + 200)}/h`,
            stateSize: `${Math.floor(Math.random() * 500 + 200)}KB`
          }
        } : e)
      );
      navigate(`/dashboard?podId=${newEcosystem.id}`);
    }, 3000);
  };

  const handleSaveBlueprint = (newBlueprint: Blueprint) => {
    setBlueprints(prev => [newBlueprint, ...prev]);
  };

  const handleUpdateBlueprint = (updatedBlueprint: Blueprint) => {
    setBlueprints(prev => prev.map(b => b.id === updatedBlueprint.id ? updatedBlueprint : b));
  };

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200 overflow-hidden selection:bg-indigo-500/30">
      <Sidebar
        deployedCount={deployedEcosystems.length}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex flex-col h-screen relative overflow-hidden">
        <Header
          credits={userStats.hyphaBalance}
          activePodsCount={deployedEcosystems.length}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isWalletConnected={userStats.isWalletConnected}
          walletAddress={userStats.walletAddress}
          onConnectWallet={handleConnectWallet}
          reputationScore={userStats.reputationScore}
        />

        <main className="flex-1 overflow-y-auto scrollbar-hide pb-24 lg:pb-8 custom-scrollbar">
          <Routes>
            <Route path="/" element={
              <Marketplace
                blueprints={blueprints}
                credits={userStats.hyphaBalance}
                onDeploy={handlePurchase}
                onUpdateBlueprint={handleUpdateBlueprint}
                deployingIds={deployingIds}
                deployedEcosystems={deployedEcosystems}
              />
            } />
            <Route path="/dashboard" element={
              <Dashboard
                ecosystems={deployedEcosystems}
                blueprints={blueprints}
                userStats={userStats}
                onClaimYield={handleClaimYield}
                onStake={handleStake}
                onUnstake={handleUnstake}
              />
            } />
            <Route path="/architect" element={<ArchitectMode onSaveBlueprint={handleSaveBlueprint} />} />
            <Route path="/media-lab" element={<MediaLab />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/web3" element={<Web3Panel userStats={userStats} onConnectWallet={handleConnectWallet} />} />
            <Route path="/tokenomics" element={
              <Tokenomics
                hyphaBalance={userStats.hyphaBalance}
                stakedAmount={userStats.stakedAmount}
                governancePower={userStats.governancePower}
              />
            } />
            <Route path="/dapps" element={
              <DAppsHub
                hyphaBalance={userStats.hyphaBalance}
                ethBalance={userStats.ethBalance}
              />
            } />
            <Route path="/dao" element={
              <DAOGovernance
                userStats={userStats}
                onStake={handleStake}
                onUnstake={handleUnstake}
              />
            } />
            <Route path="/identity" element={
              <Web3Identity
                userStats={userStats}
                onConnectWallet={handleConnectWallet}
                onDisconnect={handleDisconnectWallet}
              />
            } />
            <Route path="/premalta" element={<PremaltaDashboard />} />
            <Route path="/strategy" element={<StrategyCenter />} />
            <Route path="/ai-web5" element={
              <div className="p-4 md:p-6">
                <AIWeb5Roadmap />
              </div>
            } />
            <Route path="/revenue" element={<RevenueHub />} />
            <Route path="/tokens" element={<TokenLaunchPad />} />
            <Route path="/economy" element={<AutonomousEconomy />} />
            <Route path="/web5" element={<Web5Command />} />
            <Route path="/master" element={<MasterControl />} />
            <Route path="/supabase" element={<SupabaseDashboard />} />
            <Route path="/build" element={<BuildInPublic />} />
            <Route path="/sca" element={<SCA />} />
            <Route path="/sica" element={<SICA />} />
            <Route path="/shga" element={<SHGA />} />
          </Routes>
        </main>

        <BottomNav activePodsCount={deployedEcosystems.length} />
        <GaniAssistant isOpen={isGaniOpen} setIsOpen={setIsGaniOpen} />
      </div>
    </div>
  );
};

export default App;
