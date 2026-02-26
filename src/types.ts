
// ============================================================
// GANI HYPHA - MASTER WEB3 TYPES v3.0
// Full Tokenomics + DApps + Multi-Chain Architecture
// ============================================================

export enum AgentRole {
  ORCHESTRATOR = 'The Orchestrator',
  BARBER = 'The Barber',
  TEMAN = 'The Teman',
  KELUARGA = 'The Keluarga',
  CUSTOMER_SERVICE = 'The Customer Service',
  ANALYST = 'The Analyst',
  ARCHIVIST = 'The Archivist',
  GATEKEEPER = 'The Gatekeeper',
  INNOVATOR = 'The Innovator',
  TOKENOMIST = 'The Tokenomist',
  DEFI_WIZARD = 'The DeFi Wizard',
  DAO_GOVERNOR = 'The DAO Governor'
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CognitiveSpecs {
  reasoningDepth: number;
  memoryPersistence: 'Volatile' | 'Linear' | 'Recursive' | 'Quantum';
  thinkingBudget: number;
  sovereigntyLevel: number;
  economicAutonomy: boolean;
}

export interface Web3Integration {
  blockchain: 'Ethereum' | 'Solana' | 'Polygon' | 'Cloudflare' | 'Arbitrum' | 'Optimism' | 'Base';
  smartContract?: string;
  walletRequired: boolean;
  tokenStandard?: 'ERC-20' | 'ERC-721' | 'ERC-1155' | 'SPL' | 'HYPHA';
  deFiEnabled: boolean;
  zkProofEnabled: boolean;
  crossChainBridge?: string[];
}

export interface Web4Features {
  aiOrchestrator: 'Groq' | 'Cloudflare-AI' | 'LangChain' | 'CrewAI' | 'Multi-Agent';
  autonomyLevel: number;
  crossChainEnabled: boolean;
  decentralizedStorage: boolean;
  realTimeAdaptation: boolean;
}

export interface TokenDistribution {
  category: string;
  percentage: number;
  amount: number;
  vestingMonths: number;
  cliffMonths: number;
  color: string;
}

export interface HYPHATokenomics {
  totalSupply: number;
  circulatingSupply: number;
  marketCap: number;
  price: number;
  priceChange24h: number;
  volume24h: number;
  holders: number;
  stakingAPY: number;
  burnRate: number;
  mintRate: number;
  distribution: TokenDistribution[];
  vestingSchedule: VestingSchedule[];
  emissions: EmissionSchedule[];
}

export interface VestingSchedule {
  category: string;
  totalTokens: number;
  released: number;
  locked: number;
  nextUnlock: string;
  unlockAmount: number;
}

export interface EmissionSchedule {
  epoch: number;
  year: number;
  emissionRate: number;
  totalEmitted: number;
  inflationRate: number;
}

export interface DeFiProtocol {
  id: string;
  name: string;
  type: 'DEX' | 'Lending' | 'Yield' | 'Bridge' | 'Staking' | 'Liquid Staking' | 'Perps';
  chain: string;
  tvl: number;
  apy: number;
  risk: 'Low' | 'Medium' | 'High' | 'Very High';
  contractAddress?: string;
  logo: string;
  isIntegrated: boolean;
  userPosition?: {
    deposited: number;
    earned: number;
    shares: number;
  };
}

export interface DAppProject {
  id: string;
  name: string;
  category: 'DEX' | 'NFT' | 'Gaming' | 'Social' | 'Infrastructure' | 'DAO' | 'Insurance' | 'Derivatives';
  description: string;
  chain: string[];
  users: number;
  tvl?: number;
  token?: string;
  status: 'Live' | 'Beta' | 'Development' | 'Deprecated';
  rating: number;
  integrationLevel: 'Full' | 'Partial' | 'Planned';
  logo: string;
}

export interface SmartContractCall {
  contractAddress: string;
  functionName: string;
  params: Record<string, any>;
  estimatedGas: number;
  chain: string;
  status: 'Pending' | 'Confirmed' | 'Failed' | 'Simulating';
  txHash?: string;
  result?: any;
}

export interface TokenSwap {
  fromToken: string;
  toToken: string;
  fromAmount: number;
  toAmount: number;
  slippage: number;
  route: string[];
  estimatedGas: number;
  priceImpact: number;
  dex: string;
  deadline: number;
}

export interface LiquidityPosition {
  id: string;
  protocol: string;
  token0: string;
  token1: string;
  amount0: number;
  amount1: number;
  lpTokens: number;
  valueUSD: number;
  feesEarned: number;
  apy: number;
  range?: { min: number; max: number }; // Uniswap V3/V4
}

export interface YieldStrategy {
  id: string;
  name: string;
  protocol: string;
  asset: string;
  currentAPY: number;
  optimalAPY: number;
  risk: string;
  autoCompound: boolean;
  totalDeposited: number;
  earnings: number;
  steps: string[];
}

export interface DAOProposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  status: 'Active' | 'Passed' | 'Failed' | 'Pending' | 'Executed';
  votesFor: number;
  votesAgainst: number;
  quorum: number;
  deadline: string;
  category: 'Treasury' | 'Protocol' | 'Tokenomics' | 'Governance' | 'Partnership';
  implementation?: string;
}

export interface GovernancePower {
  address: string;
  vHYPHA: number;
  delegatedTo?: string;
  delegatedFrom: string[];
  proposalsCreated: number;
  votescast: number;
  reputationScore: number;
}

export interface NFTCollection {
  id: string;
  name: string;
  symbol: string;
  chain: string;
  contractAddress: string;
  totalSupply: number;
  owners: number;
  floorPrice: number;
  volume24h: number;
  royaltyPercent: number;
  utility: string[];
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
}

export interface ChainMetrics {
  chain: string;
  blockNumber: number;
  gasPrice: number;
  tps: number;
  tvl: number;
  activeAddresses: number;
  bridgeVolume: number;
}

export interface Web3Wallet {
  address: string;
  network: 'Ethereum' | 'Solana' | 'Polygon' | 'Arbitrum' | 'Base';
  balance: number;
  nftCount: number;
  isVerified: boolean;
  ensName?: string;
  web3AuthProvider?: string;
}

export interface Blueprint {
  id: string;
  name: string;
  industry: string;
  description: string;
  features?: string[];
  icon: string;
  roles: AgentRole[];
  price: string;
  tier: 'Free' | 'Pro' | 'Enterprise';
  infrastructure: 'Edge Worker' | 'Cloud Pod' | 'Hybrid Nexus';
  reviews: Review[];
  isFeatured?: boolean;
  deploymentCount: number;
  cognitiveSpecs?: CognitiveSpecs;
  didHash?: string;
  web3Integration?: Web3Integration;
  web4Features?: Web4Features;
}

export interface DeployedEcosystem {
  id: string;
  blueprintId: string;
  name: string;
  status: 'Active' | 'Hibernating' | 'Syncing' | 'Sovereign';
  deployedAt: string;
  logs: string[];
  metrics: {
    computeUsage: string;
    a2aActivity: string;
    stateSize: string;
    nodeHealth: number;
    autonomousIncome: number;
    yieldRate: number;
    dwnSyncStatus: number;
    verifiableCredentials: number;
    groqCallsPerHour?: number;
    supabaseConnected?: boolean;
    langchainWorkflows?: number;
  };
  didHash?: string;
  blockchainTxHash?: string;
}

export interface Transaction {
  id: string;
  type: 'yield' | 'subscription' | 'trade' | 'reinvest' | 'stake' | 'unstake' | 'bridge' | 'swap' | 'liquidity' | 'governance' | 'claim';
  amount: number;
  currency: 'HYPHA' | 'USD' | 'ETH' | 'SOL' | 'USDC' | 'USDT' | 'MATIC';
  timestamp: Date;
  description: string;
  txHash?: string;
  networkFee?: number;
  chain?: string;
  status?: 'Pending' | 'Confirmed' | 'Failed';
  explorerUrl?: string;
}

export interface UserStats {
  hyphaBalance: number;
  usdBalance: number;
  ethBalance: number;
  totalYield: number;
  activeNodes: number;
  transactions: Transaction[];
  isWalletConnected: boolean;
  walletAddress?: string;
  stakedAmount: number;
  governancePower: number;
  web3Wallet?: Web3Wallet;
  didDocument?: string;
  reputationScore: number;
  epochRewards: number;
  liquidityPositions: LiquidityPosition[];
  yieldStrategies: YieldStrategy[];
  nftHoldings: number;
  web3AuthConnected: boolean;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  model?: string;
  processingTime?: number;
}

export interface GroqModel {
  id: string;
  name: string;
  contextWindow: number;
  speed: 'Ultra-Fast' | 'Fast' | 'Standard';
}

export interface AgentTask {
  id: string;
  type: 'research' | 'analysis' | 'execution' | 'monitoring' | 'trading' | 'governance';
  description: string;
  status: 'Pending' | 'Running' | 'Completed' | 'Failed';
  assignedAgent: string;
  result?: string;
  startedAt?: Date;
  completedAt?: Date;
  chainContext?: string;
}

export interface CrewAIWorkflow {
  id: string;
  name: string;
  agents: string[];
  tasks: AgentTask[];
  status: 'Idle' | 'Running' | 'Completed';
  totalTokensUsed: number;
}

export interface SupabaseTable {
  name: string;
  rowCount: number;
  sizeKB: number;
  lastUpdated: string;
}

export interface Web3Provider {
  name: 'Alchemy' | 'Infura' | 'Ankr' | 'Chainstack' | 'Public';
  rpcUrl: string;
  chain: string;
  isActive: boolean;
  latency?: number;
  blockNumber?: number;
}

export interface IPFSFile {
  cid: string;
  name: string;
  size: number;
  uploadedAt: string;
  pinned: boolean;
  gateway: string;
}

export interface GraphQuery {
  protocol: string;
  subgraphUrl: string;
  lastBlock: number;
  entities: string[];
  queryTime: number;
}

declare global {
  interface Window {
    ethereum?: any;
    solana?: any;
  }
}
