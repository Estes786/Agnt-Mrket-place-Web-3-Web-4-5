
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { BLUEPRINTS } from './constants';
import { DeployedEcosystem, Blueprint, UserStats } from './types';

// Helper: redirect ke home (harus setelah semua import)
const RedirectToHome: React.FC = () => <Navigate to="/" replace />;

// ✅ LAZY LOAD: Semua komponen besar dimuat on-demand untuk bundle kecil
// Marketplace (1317 baris) dan Dashboard (621 baris) → lazy agar main chunk <200KB
const Marketplace = lazy(() => import('./components/Marketplace'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const Sidebar = lazy(() => import('./components/Sidebar'));
const Header = lazy(() => import('./components/Header'));
const BottomNav = lazy(() => import('./components/BottomNav'));

// ⚡ LAZY LOAD: Heavy components loaded on demand
const ArchitectMode = lazy(() => import('./components/ArchitectMode'));
const MediaLab = lazy(() => import('./components/MediaLab'));
const Roadmap = lazy(() => import('./components/Roadmap'));
const GaniAssistant = lazy(() => import('./components/GaniAssistant'));
const Web3Panel = lazy(() => import('./components/Web3Panel'));
const Tokenomics = lazy(() => import('./components/Tokenomics'));
const DAppsHub = lazy(() => import('./components/DAppsHub'));
const DAOGovernance = lazy(() => import('./components/DAOGovernance'));
const Web3Identity = lazy(() => import('./components/Web3Identity'));
const PremaltaDashboard = lazy(() => import('./components/PremaltaDashboard'));
const StrategyCenter = lazy(() => import('./components/StrategyCenter'));
const AIWeb5Roadmap = lazy(() => import('./components/AIWeb5Roadmap'));
const RevenueHub = lazy(() => import('./components/RevenueHub'));
const TokenLaunchPad = lazy(() => import('./components/TokenLaunchPad'));
const AutonomousEconomy = lazy(() => import('./components/AutonomousEconomy'));
const Web5Command = lazy(() => import('./components/Web5Command'));
const MasterControl = lazy(() => import('./components/MasterControl'));
const SupabaseDashboard = lazy(() => import('./components/SupabaseDashboard'));
const BuildInPublic = lazy(() => import('./components/BuildInPublic'));
const SCA = lazy(() => import('./components/SCA'));
const SICA = lazy(() => import('./components/SICA'));
const SHGA = lazy(() => import('./components/SHGA'));
const SCALanding = lazy(() => import('./components/SCALanding'));
const SICALanding = lazy(() => import('./components/SICALanding'));
const SHGALanding = lazy(() => import('./components/SHGALanding'));
const SovereignStore = lazy(() => import('./components/SovereignStore'));
const SovereignBarber = lazy(() => import('./components/SovereignBarber'));
const SovereignLegacy = lazy(() => import('./components/SovereignLegacy'));
const BDELanding = lazy(() => import('./components/BDELanding'));
const SovereignLegacyLanding = lazy(() => import('./components/SovereignLegacyLanding'));
const HOLYYBDLanding = lazy(() => import('./components/HOLYYBDLanding'));
const PaymentResultPage = lazy(() => import('./components/PaymentResultPage'));
const SMALanding = lazy(() => import('./components/SMALanding'));
const MetaMaskModal = lazy(() => import('./components/MetaMaskModal'));
// WalletData type import only
import type { WalletData } from './components/MetaMaskModal';

// Loading fallback component
const LoadingSpinner: React.FC<{ name?: string }> = ({ name }) => (
  <div className="flex items-center justify-center h-64 text-gray-500">
    <div className="text-center">
      <div className="animate-spin text-4xl mb-3">⚙️</div>
      <p className="text-sm">Loading {name || 'module'}...</p>
      <p className="text-xs text-gray-600 mt-1">Gyss! 🙏🏻</p>
    </div>
  </div>
);

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Public routes yang tidak butuh app layout (sidebar, header, dll)
  // CRITICAL: semua landing pages dan sovereign pages harus masuk sini agar tidak load full app
  const isPublicPage = location.pathname.startsWith('/payment') || 
    location.pathname === '/sca-landing' ||
    location.pathname === '/sca' ||
    location.pathname === '/sica-landing' ||
    location.pathname === '/shga-landing' ||
    location.pathname === '/bde-landing' ||
    location.pathname === '/legacy-landing' ||
    location.pathname === '/sma-landing' ||
    location.pathname === '/holyybd' ||
    location.pathname === '/sovereign-barber' ||
    location.pathname === '/sovereign-legacy' ||
    location.pathname === '/i' ||
    // ✅ FIX: Store juga perlu bisa diakses sebagai public page standalone
    // (user navigate dari landing page via NavLink → pushState)
    location.pathname === '/store';

  // ✅ FIX: Preload landing page chunks on idle untuk eliminasi blank screen
  // Ini memastikan semua landing pages sudah di-cache saat user pertama kali navigate
  React.useEffect(() => {
    const preloadTimer = setTimeout(() => {
      // Preload semua landing pages secara background
      import('./components/BDELanding');
      import('./components/SCALanding');
      import('./components/SICALanding');
      import('./components/SHGALanding');
      import('./components/SovereignLegacyLanding');
      import('./components/SMALanding');
      import('./components/SovereignStore');
    }, 1500); // Preload setelah 1.5s idle
    return () => clearTimeout(preloadTimer);
  }, []);
  
  // ✅ ENHANCED: Loading fallback ultra-fast — muncul <100ms, tidak blank
  const PublicLoadingFallback = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white gap-3" style={{ animation: 'fadeIn 0.1s ease' }}>
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-xl"
        style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', animation: 'pulse 1s ease-in-out infinite' }}
      >
        🌿
      </div>
      <div className="text-base font-black text-white tracking-wider">GANI HYPHA</div>
      <div className="flex gap-1.5 mt-1">
        {[0,1,2].map(i => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-violet-500"
            style={{ animation: `bounce 0.8s ease-in-out ${i * 0.12}s infinite` }}
          />
        ))}
      </div>
      <p className="text-xs text-slate-500 mt-1">Memuat halaman...</p>
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes pulse { 0%,100% { transform: scale(1) } 50% { transform: scale(1.05) } }
        @keyframes bounce { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-4px) } }
      `}</style>
    </div>
  );

  // Jika ini public page, render tanpa app layout
  if (isPublicPage) {
    return (
      <Suspense fallback={<PublicLoadingFallback />}>
        <Routes>
          <Route path="/sca" element={<SCALanding />} />
          <Route path="/sca-landing" element={<SCALanding />} />
          <Route path="/sica-landing" element={<SICALanding />} />
          <Route path="/shga-landing" element={<SHGALanding />} />
          <Route path="/bde-landing" element={<BDELanding />} />
          <Route path="/legacy-landing" element={<SovereignLegacyLanding />} />
          <Route path="/holyybd" element={<HOLYYBDLanding />} />
          <Route path="/sma-landing" element={<SMALanding />} />
          <Route path="/sovereign-barber" element={<SovereignBarber />} />
          <Route path="/sovereign-legacy" element={<SovereignLegacy />} />
          <Route path="/i" element={<SCALanding />} />
          <Route path="/store" element={<SovereignStore />} />
          <Route path="/payment/success" element={<PaymentResultPage />} />
          <Route path="/payment/failed" element={<PaymentResultPage />} />
          <Route path="/payment/pending" element={<PaymentResultPage />} />
          <Route path="/payment/*" element={<PaymentResultPage />} />
          {/* Fallback: redirect ke home jika tidak cocok */}
          <Route path="*" element={<RedirectToHome />} />
        </Routes>
      </Suspense>
    );
  }

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

  // Session #034: Real MetaMask Modal state
  const [isMetaMaskModalOpen, setIsMetaMaskModalOpen] = useState(false);

  const handleConnectWallet = () => {
    if (userStats.isWalletConnected) {
      // Already connected - show disconnect option
      handleDisconnectWallet();
      return;
    }
    // Open real MetaMask modal
    setIsMetaMaskModalOpen(true);
  };

  const handleWalletConnected = (walletData: WalletData) => {
    const networkName = walletData.network;
    setUserStats(prev => ({
      ...prev,
      isWalletConnected: true,
      walletAddress: walletData.address,
      governancePower: walletData.isVerified ? 120 : 50,
      web3Wallet: {
        address: walletData.address,
        network: networkName,
        balance: walletData.balanceEth,
        nftCount: 0,
        isVerified: walletData.isVerified,
        ensName: undefined
      },
      didDocument: `did:ethr:${walletData.networkId}:${walletData.address}`
    }));
    setIsMetaMaskModalOpen(false);
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
      <Suspense fallback={<div className="w-16 bg-slate-900" />}>
        <Sidebar
          deployedCount={deployedEcosystems.length}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />
      </Suspense>

      <div className="flex-1 flex flex-col h-screen relative overflow-hidden">
        <Suspense fallback={<div className="h-14 bg-slate-900/80 border-b border-slate-800" />}>
          <Header
            credits={userStats.hyphaBalance}
            activePodsCount={deployedEcosystems.length}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            isWalletConnected={userStats.isWalletConnected}
            walletAddress={userStats.walletAddress}
            onConnectWallet={handleConnectWallet}
            reputationScore={userStats.reputationScore}
          />
        </Suspense>

        <main className="flex-1 overflow-y-auto scrollbar-hide pb-24 lg:pb-8 custom-scrollbar">
          <Suspense fallback={<LoadingSpinner name="page" />}>
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
            <Route path="/sca/app" element={<SCA />} />
            <Route path="/sca" element={<SCA />} />
            <Route path="/sica" element={<SICA />} />
            <Route path="/sica/app" element={<SICA />} />
            <Route path="/shga" element={<SHGA />} />
            <Route path="/shga/app" element={<SHGA />} />
            <Route path="/store" element={<SovereignStore />} />
            <Route path="/sovereign-barber" element={<SovereignBarber />} />
            <Route path="/sovereign-legacy" element={<SovereignLegacy />} />
          </Routes>
          </Suspense>
        </main>

        <Suspense fallback={null}>
          <BottomNav activePodsCount={deployedEcosystems.length} />
        </Suspense>
        <Suspense fallback={null}>
          <GaniAssistant isOpen={isGaniOpen} setIsOpen={setIsGaniOpen} />
        </Suspense>

        {/* Session #034: Real MetaMask Modal */}
        <Suspense fallback={null}>
          <MetaMaskModal
            isOpen={isMetaMaskModalOpen}
            onClose={() => setIsMetaMaskModalOpen(false)}
            onConnect={handleWalletConnected}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default App;
