
// ============================================================
// GANI HYPHA - MASTER WEB3 CONSTANTS v3.0
// Full Tokenomics, DApps, DeFi Protocols
// ============================================================

import { Blueprint, AgentRole, HYPHATokenomics, DeFiProtocol, DAppProject, Web3Provider } from './types';

export const BLUEPRINTS: Blueprint[] = [
  {
    id: 'real-estate-legacy',
    name: 'Real Estate Legacy Pod',
    industry: 'Property',
    description: 'Autonomous management of property listings, client inquiries, and legal document verification via Mycelium Layer. Features DID-verified ownership and Supabase-backed property vault.',
    features: [
      'Integrated Lead Qualification & Contact Automation',
      'Automated Lead Qualification Engine',
      'Initial Client Contact Orchestrator',
      'Mycelium Document Verification',
      'RLS-Protected Property Vault (Supabase)',
      'Groq-Powered Contract Analysis',
      'On-Chain Property DID Registry'
    ],
    icon: '🏠',
    roles: [AgentRole.ORCHESTRATOR, AgentRole.ANALYST, AgentRole.CUSTOMER_SERVICE, AgentRole.GATEKEEPER],
    price: '$0/mo',
    tier: 'Free',
    infrastructure: 'Edge Worker',
    isFeatured: true,
    deploymentCount: 1242,
    reviews: [
      { id: 'r1', userName: 'DevAgent_01', rating: 5, comment: 'Flawless orchestration of RLS policies.', date: '2025-05-20' },
      { id: 'r2', userName: 'PropManager', rating: 4, comment: 'Great automation, would love more custom role hooks.', date: '2025-05-18' }
    ],
    cognitiveSpecs: {
      reasoningDepth: 65,
      memoryPersistence: 'Linear',
      thinkingBudget: 8192,
      sovereigntyLevel: 45,
      economicAutonomy: false
    },
    web3Integration: {
      blockchain: 'Ethereum',
      walletRequired: false,
      tokenStandard: 'ERC-721',
      deFiEnabled: false,
      zkProofEnabled: true
    },
    web4Features: {
      aiOrchestrator: 'Groq',
      autonomyLevel: 55,
      crossChainEnabled: false,
      decentralizedStorage: true,
      realTimeAdaptation: true
    }
  },
  {
    id: 'barber-dynasty',
    name: 'Barber Dynasty Engine',
    industry: 'Personal Services',
    description: 'Expert hair styling advice, automated booking orchestration, and inventory management using the YKK Zipper strategy. Powered by Groq LLM for instant style recommendations.',
    features: [
      'StyleGen Visual Consultant (Groq Vision)',
      'A2A Appointment Zipper',
      'Inventory Level Prediction',
      'Customer Loyalty Mycelium',
      'WhatsApp/Telegram Integration',
      'LangChain Memory for Client Profiles'
    ],
    icon: '✂️',
    roles: [AgentRole.BARBER, AgentRole.CUSTOMER_SERVICE, AgentRole.INNOVATOR, AgentRole.ARCHIVIST],
    price: '$0/mo',
    tier: 'Free',
    infrastructure: 'Edge Worker',
    deploymentCount: 843,
    reviews: [
      { id: 'r3', userName: 'StyleGenie', rating: 5, comment: 'The YKK Zipper strategy really works invisibly.', date: '2025-05-21' }
    ],
    cognitiveSpecs: {
      reasoningDepth: 55,
      memoryPersistence: 'Volatile',
      thinkingBudget: 4096,
      sovereigntyLevel: 30,
      economicAutonomy: false
    },
    web3Integration: {
      blockchain: 'Polygon',
      walletRequired: false,
      deFiEnabled: false,
      zkProofEnabled: false
    },
    web4Features: {
      aiOrchestrator: 'Groq',
      autonomyLevel: 40,
      crossChainEnabled: false,
      decentralizedStorage: false,
      realTimeAdaptation: true
    }
  },
  {
    id: 'family-nexus',
    name: 'The Big Family Legacy',
    industry: 'Lifestyle',
    description: 'Private coordination for family events, reminders, and warm conversational support with isolated memory roots. Supabase Row Level Security protects each family\'s private data.',
    features: [
      'Isolated Memory Roots (Supabase RLS)',
      'Sentimental Archivist Node',
      'Event Conflict Resolver',
      'Secure Family Tunnel',
      'CrewAI Multi-Agent Family Board',
      'Encrypted Family DWN Node'
    ],
    icon: '👨‍👩‍👧‍👦',
    roles: [AgentRole.KELUARGA, AgentRole.TEMAN, AgentRole.ARCHIVIST, AgentRole.ORCHESTRATOR],
    price: '$19/mo',
    tier: 'Pro',
    infrastructure: 'Cloud Pod',
    deploymentCount: 312,
    reviews: [
      { id: 'r4', userName: 'FamilyFirst', rating: 5, comment: 'GANI handles reminders like a human sibling.', date: '2025-05-15' }
    ],
    cognitiveSpecs: {
      reasoningDepth: 75,
      memoryPersistence: 'Recursive',
      thinkingBudget: 12288,
      sovereigntyLevel: 60,
      economicAutonomy: false
    },
    web3Integration: {
      blockchain: 'Cloudflare',
      walletRequired: false,
      deFiEnabled: false,
      zkProofEnabled: true
    },
    web4Features: {
      aiOrchestrator: 'CrewAI',
      autonomyLevel: 65,
      crossChainEnabled: false,
      decentralizedStorage: true,
      realTimeAdaptation: true
    }
  },
  {
    id: 'media-empire',
    name: 'Media Empire Nexus',
    industry: 'Content Creation',
    description: 'AI-driven content scheduling, trend analysis, and engagement automation across IG/TG/Threads. LangChain orchestrates multi-platform campaigns with real-time Groq inference.',
    features: [
      'Multi-Channel Engagement Hub',
      'Trend Grounding Engine (Groq + Web3)',
      'Automated Asset Synthesizer',
      'Performance Analytics Roots',
      'LangChain Campaign Orchestrator',
      'IPFS Content Archiving (Pinata)',
      'NFT Content Monetization Layer'
    ],
    icon: '📸',
    roles: [AgentRole.INNOVATOR, AgentRole.ANALYST, AgentRole.ORCHESTRATOR, AgentRole.ARCHIVIST],
    price: '$49/mo',
    tier: 'Enterprise',
    infrastructure: 'Hybrid Nexus',
    isFeatured: true,
    deploymentCount: 156,
    reviews: [
      { id: 'r5', userName: 'CreatorFlow', rating: 3, comment: 'A bit pricey but the trend analysis is top notch.', date: '2025-05-22' }
    ],
    cognitiveSpecs: {
      reasoningDepth: 85,
      memoryPersistence: 'Recursive',
      thinkingBudget: 24576,
      sovereigntyLevel: 80,
      economicAutonomy: true
    },
    web3Integration: {
      blockchain: 'Ethereum',
      walletRequired: true,
      tokenStandard: 'ERC-721',
      deFiEnabled: true,
      zkProofEnabled: true
    },
    web4Features: {
      aiOrchestrator: 'LangChain',
      autonomyLevel: 82,
      crossChainEnabled: true,
      decentralizedStorage: true,
      realTimeAdaptation: true
    }
  },
  {
    id: 'supply-chain-sovereign',
    name: 'Autonomous Supply Chain Sovereign',
    industry: 'Logistics & Trade',
    description: 'High-level sovereign entity managing global supply chains with autonomous spot-market trading. Integrates Chainlink oracles, Supabase real-time, and CrewAI multi-agent coordination.',
    features: [
      'Autonomous Freight Spot-Trading',
      'Recursive Inventory Optimization',
      'DID-Verified Carrier Onboarding',
      'Quantum-Secured Trade Ledger',
      'Zero-Knowledge Compliance Audits',
      'Chainlink Oracle Integration',
      'CrewAI Logistics Crew',
      'Cross-Chain Bridge Protocol'
    ],
    icon: '🚢',
    roles: [AgentRole.ORCHESTRATOR, AgentRole.ANALYST, AgentRole.GATEKEEPER, AgentRole.INNOVATOR],
    price: '$499/mo',
    tier: 'Enterprise',
    infrastructure: 'Hybrid Nexus',
    isFeatured: true,
    deploymentCount: 42,
    reviews: [],
    cognitiveSpecs: {
      reasoningDepth: 95,
      memoryPersistence: 'Recursive',
      thinkingBudget: 32768,
      sovereigntyLevel: 98,
      economicAutonomy: true
    },
    web3Integration: {
      blockchain: 'Ethereum',
      walletRequired: true,
      tokenStandard: 'ERC-20',
      deFiEnabled: true,
      zkProofEnabled: true,
      crossChainBridge: ['Arbitrum', 'Optimism', 'Base']
    },
    web4Features: {
      aiOrchestrator: 'CrewAI',
      autonomyLevel: 96,
      crossChainEnabled: true,
      decentralizedStorage: true,
      realTimeAdaptation: true
    }
  },
  {
    id: 'fintech-yield-master',
    name: 'Sovereign Yield Orchestrator',
    industry: 'Fintech',
    description: 'Enterprise-grade financial agent for autonomous yield farming, risk-adjusted asset allocation, and real-time liquidity management. Groq-powered risk analysis with LangSmith monitoring.',
    features: [
      'Multi-Protocol Yield Harvesting',
      'Real-time Risk-Adjusted Rebalancing',
      'Autonomous Liquidity Provisioning',
      'Sovereign Wealth Management Core',
      'AI-Driven Arbitrage Execution (Groq)',
      'LangSmith Workflow Monitoring',
      'Uniswap V4 Integration',
      'Supabase Financial Ledger'
    ],
    icon: '📈',
    roles: [AgentRole.ANALYST, AgentRole.ORCHESTRATOR, AgentRole.ARCHIVIST, AgentRole.INNOVATOR, AgentRole.TOKENOMIST],
    price: '$199/mo',
    tier: 'Pro',
    infrastructure: 'Cloud Pod',
    isFeatured: true,
    deploymentCount: 128,
    reviews: [],
    cognitiveSpecs: {
      reasoningDepth: 88,
      memoryPersistence: 'Linear',
      thinkingBudget: 16384,
      sovereigntyLevel: 92,
      economicAutonomy: true
    },
    web3Integration: {
      blockchain: 'Ethereum',
      walletRequired: true,
      tokenStandard: 'ERC-20',
      deFiEnabled: true,
      zkProofEnabled: true
    },
    web4Features: {
      aiOrchestrator: 'LangChain',
      autonomyLevel: 90,
      crossChainEnabled: true,
      decentralizedStorage: false,
      realTimeAdaptation: true
    }
  },
  {
    id: 'legal-compliance-vault',
    name: 'Sovereign Legal Compliance Pod',
    industry: 'Legal & Governance',
    description: 'Autonomous legal entity monitoring global regulatory changes, performing self-audits, and managing DID-linked contract execution. CrewAI legal crew with Groq fast inference.',
    features: [
      'Real-time Regulatory Grounding',
      'Autonomous Contract Synthesis',
      'DID-Linked Governance Framework',
      'Immutable Compliance Archiving (IPFS)',
      'Self-Directed Legal Risk Analysis',
      'CrewAI Legal Research Crew',
      'ZK Proof Verification System'
    ],
    icon: '⚖️',
    roles: [AgentRole.GATEKEEPER, AgentRole.ARCHIVIST, AgentRole.ORCHESTRATOR, AgentRole.ANALYST, AgentRole.DAO_GOVERNOR],
    price: '$299/mo',
    tier: 'Enterprise',
    infrastructure: 'Hybrid Nexus',
    deploymentCount: 85,
    reviews: [],
    cognitiveSpecs: {
      reasoningDepth: 92,
      memoryPersistence: 'Recursive',
      thinkingBudget: 24576,
      sovereigntyLevel: 95,
      economicAutonomy: false
    },
    web3Integration: {
      blockchain: 'Ethereum',
      walletRequired: true,
      deFiEnabled: false,
      zkProofEnabled: true
    },
    web4Features: {
      aiOrchestrator: 'CrewAI',
      autonomyLevel: 93,
      crossChainEnabled: false,
      decentralizedStorage: true,
      realTimeAdaptation: true
    }
  },
  {
    id: 'web3-defi-nexus',
    name: 'Web3 DeFi Nexus',
    industry: 'DeFi',
    description: 'Pure Web3 DeFi automation: yield farming, liquidity provision, DEX aggregation, and MEV protection. Integrates with top protocols via smart contract automation and Cloudflare Workers.',
    features: [
      'Multi-DEX Aggregation (Uniswap/Curve/Balancer)',
      'Automated Market Maker (AMM) Strategies',
      'MEV Protection Layer',
      'Flash Loan Arbitrage Engine',
      'Smart Contract Risk Scanner',
      'Groq AI DeFi Advisor',
      'LangChain DeFi Research Agent',
      'Real-time Gas Optimizer (Infura)'
    ],
    icon: '🔗',
    roles: [AgentRole.ANALYST, AgentRole.ORCHESTRATOR, AgentRole.INNOVATOR, AgentRole.GATEKEEPER, AgentRole.DEFI_WIZARD],
    price: '$0/mo',
    tier: 'Free',
    infrastructure: 'Edge Worker',
    isFeatured: true,
    deploymentCount: 567,
    reviews: [
      { id: 'r6', userName: 'DeFi_Whale', rating: 5, comment: 'Best DeFi automation pod on the market!', date: '2026-01-15' },
      { id: 'r7', userName: 'YieldFarmer99', rating: 4, comment: 'MEV protection saved me thousands.', date: '2026-01-20' }
    ],
    cognitiveSpecs: {
      reasoningDepth: 78,
      memoryPersistence: 'Linear',
      thinkingBudget: 16384,
      sovereigntyLevel: 85,
      economicAutonomy: true
    },
    web3Integration: {
      blockchain: 'Ethereum',
      walletRequired: true,
      tokenStandard: 'ERC-20',
      deFiEnabled: true,
      zkProofEnabled: true,
      crossChainBridge: ['Arbitrum', 'Base', 'Optimism', 'Polygon']
    },
    web4Features: {
      aiOrchestrator: 'Groq',
      autonomyLevel: 80,
      crossChainEnabled: true,
      decentralizedStorage: false,
      realTimeAdaptation: true
    }
  },
  {
    id: 'hypha-dao-sovereign',
    name: 'HYPHA DAO Sovereign',
    industry: 'DAO & Governance',
    description: 'Full DAO governance system with on-chain voting, treasury management, and tokenomics control. vHYPHA-powered quadratic voting, proposal lifecycle automation, and multi-sig treasury.',
    features: [
      'vHYPHA Quadratic Voting Engine',
      'On-Chain Proposal Lifecycle Automation',
      'Multi-Sig Treasury Management',
      'Tokenomics Parameter Controller',
      'Staking Vault with Dynamic APY',
      'Snapshot Integration for Off-Chain Voting',
      'Delegated Governance Power',
      'DAO Analytics Dashboard'
    ],
    icon: '🏛️',
    roles: [AgentRole.DAO_GOVERNOR, AgentRole.ORCHESTRATOR, AgentRole.GATEKEEPER, AgentRole.TOKENOMIST],
    price: '$299/mo',
    tier: 'Enterprise',
    infrastructure: 'Hybrid Nexus',
    isFeatured: true,
    deploymentCount: 38,
    reviews: [
      { id: 'r8', userName: 'DAOmaster', rating: 5, comment: 'Best DAO toolkit I have used. Gyss!', date: '2026-02-01' }
    ],
    cognitiveSpecs: {
      reasoningDepth: 90,
      memoryPersistence: 'Recursive',
      thinkingBudget: 32768,
      sovereigntyLevel: 100,
      economicAutonomy: true
    },
    web3Integration: {
      blockchain: 'Ethereum',
      walletRequired: true,
      tokenStandard: 'HYPHA',
      deFiEnabled: true,
      zkProofEnabled: true
    },
    web4Features: {
      aiOrchestrator: 'Multi-Agent',
      autonomyLevel: 100,
      crossChainEnabled: true,
      decentralizedStorage: true,
      realTimeAdaptation: true
    }
  }
];

// ============================================================
// HYPHA TOKENOMICS ENGINE
// ============================================================
export const HYPHA_TOKENOMICS: HYPHATokenomics = {
  totalSupply: 1_000_000_000,
  circulatingSupply: 342_000_000,
  marketCap: 68_400_000,
  price: 0.2,
  priceChange24h: 8.34,
  volume24h: 4_200_000,
  holders: 24_891,
  stakingAPY: 18.5,
  burnRate: 0.5,
  mintRate: 2.0,
  distribution: [
    { category: 'Community & Ecosystem', percentage: 35, amount: 350_000_000, vestingMonths: 48, cliffMonths: 6, color: '#6366f1' },
    { category: 'Team & Advisors', percentage: 20, amount: 200_000_000, vestingMonths: 36, cliffMonths: 12, color: '#8b5cf6' },
    { category: 'Treasury & DAO', percentage: 20, amount: 200_000_000, vestingMonths: 60, cliffMonths: 0, color: '#06b6d4' },
    { category: 'Public Sale', percentage: 15, amount: 150_000_000, vestingMonths: 12, cliffMonths: 3, color: '#10b981' },
    { category: 'Private Sale / Seed', percentage: 7, amount: 70_000_000, vestingMonths: 24, cliffMonths: 6, color: '#f59e0b' },
    { category: 'Liquidity Provision', percentage: 3, amount: 30_000_000, vestingMonths: 0, cliffMonths: 0, color: '#ef4444' }
  ],
  vestingSchedule: [
    { category: 'Team', totalTokens: 200_000_000, released: 0, locked: 200_000_000, nextUnlock: '2026-08-01', unlockAmount: 5_555_556 },
    { category: 'Community', totalTokens: 350_000_000, released: 43_750_000, locked: 306_250_000, nextUnlock: '2026-03-01', unlockAmount: 7_291_667 },
    { category: 'Treasury', totalTokens: 200_000_000, released: 100_000_000, locked: 100_000_000, nextUnlock: '2026-03-01', unlockAmount: 3_333_333 },
    { category: 'Seed Round', totalTokens: 70_000_000, released: 17_500_000, locked: 52_500_000, nextUnlock: '2026-03-01', unlockAmount: 2_916_667 }
  ],
  emissions: [
    { epoch: 1, year: 2024, emissionRate: 5.0, totalEmitted: 50_000_000, inflationRate: 5.0 },
    { epoch: 2, year: 2025, emissionRate: 3.5, totalEmitted: 85_000_000, inflationRate: 3.5 },
    { epoch: 3, year: 2026, emissionRate: 2.0, totalEmitted: 105_000_000, inflationRate: 2.0 },
    { epoch: 4, year: 2027, emissionRate: 1.0, totalEmitted: 115_000_000, inflationRate: 1.0 },
    { epoch: 5, year: 2028, emissionRate: 0.5, totalEmitted: 120_000_000, inflationRate: 0.5 }
  ]
};

// ============================================================
// DEFI PROTOCOLS REGISTRY
// ============================================================
export const DEFI_PROTOCOLS: DeFiProtocol[] = [
  {
    id: 'uniswap-v4',
    name: 'Uniswap V4',
    type: 'DEX',
    chain: 'Ethereum',
    tvl: 4_200_000_000,
    apy: 8.5,
    risk: 'Low',
    contractAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    logo: '🦄',
    isIntegrated: true
  },
  {
    id: 'curve-finance',
    name: 'Curve Finance',
    type: 'DEX',
    chain: 'Ethereum',
    tvl: 2_100_000_000,
    apy: 6.2,
    risk: 'Low',
    contractAddress: '0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7',
    logo: '〰️',
    isIntegrated: true
  },
  {
    id: 'aave-v3',
    name: 'Aave V3',
    type: 'Lending',
    chain: 'Ethereum',
    tvl: 8_500_000_000,
    apy: 4.8,
    risk: 'Low',
    contractAddress: '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2',
    logo: '👻',
    isIntegrated: true
  },
  {
    id: 'lido-staking',
    name: 'Lido Finance',
    type: 'Liquid Staking',
    chain: 'Ethereum',
    tvl: 15_000_000_000,
    apy: 4.2,
    risk: 'Low',
    contractAddress: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
    logo: '🪴',
    isIntegrated: true
  },
  {
    id: 'convex-finance',
    name: 'Convex Finance',
    type: 'Yield',
    chain: 'Ethereum',
    tvl: 900_000_000,
    apy: 12.4,
    risk: 'Medium',
    logo: '🔷',
    isIntegrated: false
  },
  {
    id: 'radiant-capital',
    name: 'Radiant Capital',
    type: 'Lending',
    chain: 'Arbitrum',
    tvl: 420_000_000,
    apy: 9.8,
    risk: 'Medium',
    logo: '⚡',
    isIntegrated: true
  },
  {
    id: 'gmx-perps',
    name: 'GMX Perpetuals',
    type: 'Perps',
    chain: 'Arbitrum',
    tvl: 650_000_000,
    apy: 15.2,
    risk: 'High',
    logo: '🏦',
    isIntegrated: false
  },
  {
    id: 'hypha-pool',
    name: 'HYPHA Staking Pool',
    type: 'Staking',
    chain: 'Ethereum',
    tvl: 24_000_000,
    apy: 18.5,
    risk: 'Medium',
    contractAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    logo: '🌿',
    isIntegrated: true
  }
];

// ============================================================
// DAPPS REGISTRY
// ============================================================
export const DAPPS: DAppProject[] = [
  {
    id: 'uniswap',
    name: 'Uniswap',
    category: 'DEX',
    description: 'Leading AMM DEX on Ethereum, pioneering concentrated liquidity with V3/V4',
    chain: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Base'],
    users: 4_200_000,
    tvl: 4_200_000_000,
    token: 'UNI',
    status: 'Live',
    rating: 9.8,
    integrationLevel: 'Full',
    logo: '🦄'
  },
  {
    id: 'opensea',
    name: 'OpenSea',
    category: 'NFT',
    description: 'World\'s largest NFT marketplace for digital collectibles and art',
    chain: ['Ethereum', 'Polygon', 'Solana'],
    users: 2_100_000,
    tvl: 0,
    token: 'N/A',
    status: 'Live',
    rating: 8.2,
    integrationLevel: 'Partial',
    logo: '🌊'
  },
  {
    id: 'aave',
    name: 'Aave',
    category: 'Infrastructure',
    description: 'Decentralized lending protocol with flash loans and aTokens',
    chain: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism'],
    users: 890_000,
    tvl: 8_500_000_000,
    token: 'AAVE',
    status: 'Live',
    rating: 9.5,
    integrationLevel: 'Full',
    logo: '👻'
  },
  {
    id: 'compound',
    name: 'Compound V3',
    category: 'Infrastructure',
    description: 'Algorithmic money market protocol for lending and borrowing',
    chain: ['Ethereum', 'Base', 'Arbitrum'],
    users: 420_000,
    tvl: 3_100_000_000,
    token: 'COMP',
    status: 'Live',
    rating: 8.8,
    integrationLevel: 'Planned',
    logo: '🏛️'
  },
  {
    id: 'snapshot',
    name: 'Snapshot',
    category: 'DAO',
    description: 'Decentralized governance platform for off-chain voting with on-chain signatures',
    chain: ['Ethereum', 'Polygon'],
    users: 1_500_000,
    token: 'N/A',
    status: 'Live',
    rating: 9.0,
    integrationLevel: 'Full',
    logo: '📸'
  },
  {
    id: 'chainlink',
    name: 'Chainlink',
    category: 'Infrastructure',
    description: 'Decentralized oracle network providing real-world data to smart contracts',
    chain: ['Ethereum', 'Polygon', 'BNB', 'Arbitrum'],
    users: 3_000_000,
    tvl: 0,
    token: 'LINK',
    status: 'Live',
    rating: 9.9,
    integrationLevel: 'Full',
    logo: '🔗'
  },
  {
    id: 'thegraph',
    name: 'The Graph',
    category: 'Infrastructure',
    description: 'Decentralized indexing protocol for querying blockchain data via GraphQL',
    chain: ['Ethereum', 'Arbitrum', 'Polygon'],
    users: 180_000,
    token: 'GRT',
    status: 'Live',
    rating: 9.3,
    integrationLevel: 'Full',
    logo: '📊'
  },
  {
    id: 'ipfs-pinata',
    name: 'IPFS + Pinata',
    category: 'Infrastructure',
    description: 'Decentralized file storage system with Pinata pinning service for persistence',
    chain: ['All'],
    users: 500_000,
    status: 'Live',
    rating: 8.9,
    integrationLevel: 'Full',
    logo: '📌'
  }
];

// ============================================================
// WEB3 PROVIDERS REGISTRY
// ============================================================
export const WEB3_PROVIDERS: Web3Provider[] = [
  {
    name: 'Alchemy',
    rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/TOHei2xGaHxbHUneplEnx-biKQBtdOAq',
    chain: 'Ethereum Mainnet',
    isActive: true,
    latency: 45
  },
  {
    name: 'Infura',
    rpcUrl: 'https://mainnet.infura.io/v3/db90dda7224646728278a7996456f4fc',
    chain: 'Ethereum Mainnet',
    isActive: true,
    latency: 62
  },
  {
    name: 'Ankr',
    rpcUrl: 'https://rpc.ankr.com/eth/a57665476c766860859628cb6a86b81985847674397716c9fdac8b3ce0fb1b19',
    chain: 'Ethereum Mainnet',
    isActive: true,
    latency: 38
  },
  {
    name: 'Chainstack',
    rpcUrl: 'https://nd-xxx.chainstack.com',
    chain: 'Ethereum Mainnet',
    isActive: false,
    latency: 55
  }
];

// ============================================================
// DAO GOVERNANCE CONFIG
// ============================================================
export const DAO_CONFIG = {
  name: 'HYPHA DAO',
  token: 'vHYPHA',
  votingToken: 'vHYPHA',
  quorumPercent: 10,
  passingThreshold: 51,
  votingPeriodDays: 7,
  timelockHours: 48,
  proposalThreshold: 100000,
  contractAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  treasury: {
    address: '0xDAOTreasury...',
    hyphaBalance: 28_500_000,
    ethBalance: 142.8,
    usdcBalance: 1_850_000,
    totalValueUSD: 9_320_000
  }
};

export const PHILOSOPHY = {
  vision: "Optimization of Life through Integrated Intelligence",
  principles: ["Integritas", "Amanah", "Skalabilitas", "Service"],
  motto: "Akar Dalam, Cabang Tinggi",
  strategy: "The YKK Zipper (Hidden Champion)"
};

export const WEB3_STACK = {
  blockchain: ["Ethereum", "Solana", "Polygon", "Arbitrum", "Base", "Cloudflare Workers"],
  storage: ["IPFS (Pinata)", "Supabase", "Cloudflare R2", "Arweave", "The Graph"],
  identity: ["DID (W3C)", "ENS", "Web3Auth", "Privy", "Web5 DWN"],
  oracles: ["Chainlink", "The Graph", "Pyth Network"],
  ai: ["Groq (llama-3.3-70b)", "Cloudflare AI", "LangChain", "CrewAI"],
  monitoring: ["LangSmith", "Cloudflare Analytics", "Alchemy Webhooks"],
  rpc: ["Alchemy", "Infura", "Ankr", "Chainstack"],
  protocol: ["Web3", "Web4 Autonomous Agents", "Web5 DWN/DID", "EIP-4337 (Account Abstraction)"]
};

export const GROQ_MODELS = [
  { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B', contextWindow: 128000, speed: 'Ultra-Fast' as const },
  { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B Instant', contextWindow: 128000, speed: 'Ultra-Fast' as const },
  { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', contextWindow: 32768, speed: 'Fast' as const },
  { id: 'gemma2-9b-it', name: 'Gemma2 9B', contextWindow: 8192, speed: 'Fast' as const }
];

// ============================================================
// CHAIN CONFIGURATION
// ============================================================
export const CHAINS = {
  ethereum: {
    id: 1,
    name: 'Ethereum Mainnet',
    symbol: 'ETH',
    rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/',
    explorer: 'https://etherscan.io',
    color: '#627EEA',
    logo: '⟠'
  },
  polygon: {
    id: 137,
    name: 'Polygon PoS',
    symbol: 'MATIC',
    rpcUrl: 'https://polygon-mainnet.g.alchemy.com/v2/',
    explorer: 'https://polygonscan.com',
    color: '#8247E5',
    logo: '⬡'
  },
  arbitrum: {
    id: 42161,
    name: 'Arbitrum One',
    symbol: 'ETH',
    rpcUrl: 'https://arb-mainnet.g.alchemy.com/v2/',
    explorer: 'https://arbiscan.io',
    color: '#12AAFF',
    logo: '🔵'
  },
  base: {
    id: 8453,
    name: 'Base',
    symbol: 'ETH',
    rpcUrl: 'https://base-mainnet.g.alchemy.com/v2/',
    explorer: 'https://basescan.org',
    color: '#0052FF',
    logo: '🔷'
  }
};

// The Graph API endpoint
export const THE_GRAPH_CONFIG = {
  apiKey: 'server_4bd29f3eac7a006b8c74060b3b69f223',
  uniswapSubgraph: 'https://gateway.thegraph.com/api/server_4bd29f3eac7a006b8c74060b3b69f223/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV',
  aaveSubgraph: 'https://gateway.thegraph.com/api/server_4bd29f3eac7a006b8c74060b3b69f223/subgraphs/id/JCNWRypm7FYwV8fx166MhnZSgBpbrNgFB5rACxLH1RtS'
};

// Pinata IPFS Config
export const PINATA_CONFIG = {
  apiKey: import.meta.env.VITE_PINATA_API_KEY || '',
  gateway: 'https://gateway.pinata.cloud/ipfs/'
};

// Web3Auth Config
export const WEB3AUTH_CONFIG = {
  clientId: 'BOZCV1IcmP48NVzBWqRX-HIt3JSjI8dekj-6Ygj9zercthRb0wX_fTESDc2Knbf1z-I_5PlIXPHrqAM58KD7q0M',
  network: 'mainnet' as const,
  jwksEndpoint: 'https://api-auth.web3auth.io/.well-known/jwks.json'
};

// ============================================================
// PREMALTA TOKEN — Creator Economy (Base Network)
// Contract: 0xC0125651a46BDEea72a73A1C1A75b82e0E2C94c7
// ============================================================
export const PREMALTA_TOKEN = {
  name: 'PREMALTA',
  symbol: '$PREMALTA',
  contractAddress: '0xC0125651a46BDEea72a73A1C1A75b82e0E2C94c7',
  network: 'Base',
  chainId: 8453,
  decimals: 18,
  platform: 'Paragraph.com',
  platformUrl: 'https://paragraph.com/dashboard/@elmatador0197@gmail.com-ae71',
  totalSupply: 1_000_000_000,
  status: 'deployed', // deployed but no liquidity yet
  
  // Token Distribution
  distribution: [
    { category: 'DEX Liquidity Pool (Locked)', percentage: 50, amount: 500_000_000, color: '#3b82f6' },
    { category: 'Community Airdrops & Rewards', percentage: 20, amount: 200_000_000, color: '#10b981' },
    { category: 'Creator Reserve (Elmatador)', percentage: 15, amount: 150_000_000, color: '#f59e0b' },
    { category: 'DAO Treasury', percentage: 10, amount: 100_000_000, color: '#8b5cf6' },
    { category: 'Strategic Marketing', percentage: 5, amount: 50_000_000, color: '#ef4444' },
  ],
  
  // Liquidity Strategy
  liquidityStrategy: {
    targetInitial: 500,  // USD
    targetGrowth: 10000, // USD
    targetMature: 1_000_000, // USD
    pair: 'PREMALTA/USDC',
    dex: 'Uniswap V3',
    chain: 'Base',
    lockPlatform: 'Uncx.network',
    lockDuration: '6 months',
    initialPrice: 0.01, // USD per token
    priceTarget6m: 0.10,
    priceTarget12m: 1.00,
  },
  
  // Staking System
  staking: {
    apy: 15,
    lockPeriods: [
      { duration: 0, apy: 8, label: 'Flexible' },
      { duration: 30, apy: 12, label: '1 Month' },
      { duration: 90, apy: 15, label: '3 Months' },
      { duration: 180, apy: 20, label: '6 Months' },
      { duration: 365, apy: 25, label: '1 Year' },
    ]
  },
  
  // Whale Protection
  whaleProtection: {
    enabled: true,
    maxSellPercent: 0.5, // max 0.5% of supply in 24h
    penaltyTax: 5,       // % penalty for whale sells
    burnFromPenalty: 50, // % of penalty that gets burned
    lockRequirement: 100_000, // min PREMALTA to be considered whale
  },
  
  // BaseScan
  basescanUrl: 'https://basescan.org/address/0xC0125651a46BDEea72a73A1C1A75b82e0E2C94c7',
};

// Whale Checkmate Analytics
export const WHALE_ANALYTICS = {
  title: 'Whale Checkmate Dashboard',
  description: 'Track large holder activity and market impact',
  
  whaleThresholds: [
    { tier: 'Shrimp 🦐', min: 0, max: 1000, color: '#6b7280' },
    { tier: 'Fish 🐠', min: 1000, max: 10000, color: '#3b82f6' },
    { tier: 'Dolphin 🐬', min: 10000, max: 100000, color: '#8b5cf6' },
    { tier: 'Shark 🦈', min: 100000, max: 1000000, color: '#f59e0b' },
    { tier: 'Whale 🐳', min: 1000000, max: 10000000, color: '#ef4444' },
    { tier: 'Humpback 🦕', min: 10000000, max: Infinity, color: '#10b981' },
  ],
  
  // Mock whale data (would be from The Graph API in production)
  topHolders: [
    { address: '0x742d...3a5f', tier: 'Whale 🐳', balance: 8_500_000, percentage: 0.85, staked: 6_000_000, lastActivity: '2h ago', trustScore: 92 },
    { address: '0x9bc1...7e2c', tier: 'Shark 🦈', balance: 4_200_000, percentage: 0.42, staked: 4_200_000, lastActivity: '6h ago', trustScore: 98 },
    { address: '0x3f8a...1d9b', tier: 'Shark 🦈', balance: 2_800_000, percentage: 0.28, staked: 1_400_000, lastActivity: '1d ago', trustScore: 75 },
    { address: '0x5c2e...8b4a', tier: 'Dolphin 🐬', balance: 850_000, percentage: 0.085, staked: 850_000, lastActivity: '3h ago', trustScore: 100 },
    { address: '0x1a7d...6c3f', tier: 'Dolphin 🐬', balance: 620_000, percentage: 0.062, staked: 310_000, lastActivity: '12h ago', trustScore: 83 },
  ],
  
  marketHealthScore: 87, // 0-100
  stakingRatio: 34.2, // % of supply staked
  averageHoldTime: 127, // days
};

// DeFi Ecosystem - PREMALTA specific
export const PREMALTA_DEFI = {
  pools: [
    {
      id: 'premalta-usdc-v3',
      name: 'PREMALTA/USDC',
      dex: 'Uniswap V3',
      chain: 'Base',
      status: 'pending', // Not yet created
      tvl: 0,
      targetTvl: 500,
      apy: 0,
      fee: 0.3,
      token0: 'PREMALTA',
      token1: 'USDC',
    },
    {
      id: 'premalta-eth-v3',
      name: 'PREMALTA/ETH',
      dex: 'Uniswap V3',
      chain: 'Base',
      status: 'planned',
      tvl: 0,
      targetTvl: 5000,
      apy: 0,
      fee: 1.0,
      token0: 'PREMALTA',
      token1: 'ETH',
    },
    {
      id: 'premalta-hypha',
      name: 'PREMALTA/HYPHA',
      dex: 'GANI DEX',
      chain: 'Base → Arbitrum',
      status: 'planned',
      tvl: 0,
      targetTvl: 50000,
      apy: 0,
      fee: 0.5,
      token0: 'PREMALTA',
      token1: 'HYPHA',
    }
  ],
  
  roadmap: [
    { phase: 1, title: 'DEX Launch', action: 'Add $500 liquidity on Uniswap V3 (Base)', status: 'next', week: 'Week 1-2' },
    { phase: 2, title: 'Lock LP', action: 'Lock liquidity tokens on Uncx.network (6 months)', status: 'next', week: 'Week 2' },
    { phase: 3, title: 'Verify Contract', action: 'Verify on BaseScan + submit logo to TrustWallet', status: 'next', week: 'Week 2-3' },
    { phase: 4, title: 'Staking Launch', action: 'Deploy staking contract on Base', status: 'planned', week: 'Month 1' },
    { phase: 5, title: 'Community Growth', action: 'Reach 100 holders, launch governance', status: 'planned', week: 'Month 2-3' },
    { phase: 6, title: 'HYPHA Integration', action: 'PREMALTA/HYPHA bridge and DEX pair', status: 'planned', week: 'Month 4-6' },
  ]
};
