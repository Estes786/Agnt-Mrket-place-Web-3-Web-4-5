
// ============================================================
// GANI HYPHA — AI Sovereignty & Web5 Service v4.0
// Implements: DID resolution, ZK proofs, DWN, Agent Economy
// Research-backed implementation (Feb 2026)
// ============================================================

// ── TYPES ────────────────────────────────────────────────────

export interface DIDDocument {
  '@context': string[];
  id: string;
  verificationMethod: VerificationMethod[];
  authentication: string[];
  assertionMethod: string[];
  service?: ServiceEndpoint[];
  created: string;
  updated: string;
}

export interface VerificationMethod {
  id: string;
  type: string;
  controller: string;
  blockchainAccountId?: string;
  publicKeyJwk?: Record<string, string>;
}

export interface ServiceEndpoint {
  id: string;
  type: string;
  serviceEndpoint: string | Record<string, unknown>;
  description?: string;
}

export interface VerifiableCredential {
  '@context': string[];
  id: string;
  type: string[];
  issuer: { id: string; name: string };
  issuanceDate: string;
  expirationDate: string;
  credentialSubject: Record<string, unknown>;
  proof?: CredentialProof;
}

export interface CredentialProof {
  type: string;
  created: string;
  verificationMethod: string;
  proofPurpose: string;
  proofValue: string;
}

export interface AgentIdentity {
  agentDID: string;
  walletAddress: string;
  sessionKey: string;
  spendingLimit: string;
  expiresAt: number;
  capabilities: string[];
  proofOfWork?: string;
}

export interface ZKProof {
  proof: string;
  publicSignals: string[];
  verificationKey: string;
  circuitId: string;
  computedAt: string;
  gasEstimate: number;
}

export interface DWNMessage {
  recordId: string;
  descriptor: {
    method: 'RecordsWrite' | 'RecordsQuery' | 'RecordsRead' | 'RecordsDelete';
    schema: string;
    dataFormat: string;
    dateCreated: string;
  };
  attestation?: string;
  authorization?: string;
  data?: unknown;
}

export interface SovereigntyScore {
  dataScore: number;
  modelScore: number;
  computeScore: number;
  identityScore: number;
  revenueScore: number;
  governanceScore: number;
  totalScore: number;
  level: 'Web2' | 'Web2.5' | 'Web3' | 'Web4' | 'Web5';
  recommendations: string[];
}

// ── DID SERVICE ──────────────────────────────────────────────

export class DIDService {
  private static instance: DIDService;
  private didCache: Map<string, DIDDocument> = new Map();

  static getInstance(): DIDService {
    if (!DIDService.instance) DIDService.instance = new DIDService();
    return DIDService.instance;
  }

  /**
   * Generate a W3C-compliant DID document
   * Based on did:ethr method spec
   */
  generateDIDDocument(walletAddress: string, chainId: number = 1): DIDDocument {
    const network = chainId === 1 ? 'mainnet' : chainId === 8453 ? 'base' : 'sepolia';
    const did = `did:ethr:${network}:${walletAddress}`;
    
    const document: DIDDocument = {
      '@context': [
        'https://www.w3.org/ns/did/v1',
        'https://w3id.org/security/suites/jws-2020/v1',
        'https://w3id.org/security/suites/secp256k1-2019/v1'
      ],
      id: did,
      verificationMethod: [
        {
          id: `${did}#controllerKey`,
          type: 'EcdsaSecp256k1RecoveryMethod2020',
          controller: did,
          blockchainAccountId: `eip155:${chainId}:${walletAddress}`
        }
      ],
      authentication: [`${did}#controllerKey`],
      assertionMethod: [`${did}#controllerKey`],
      service: [
        {
          id: `${did}#dwn`,
          type: 'DecentralizedWebNode',
          serviceEndpoint: {
            nodes: [
              'https://dwn.gani-hypha.io/v1',
              'https://ceramic.gani-hypha.io/v1'
            ]
          },
          description: 'GANI HYPHA Decentralized Web Node'
        },
        {
          id: `${did}#agent`,
          type: 'HYPHAAgentEndpoint',
          serviceEndpoint: 'https://gani-hypha-web3.pages.dev/api/agent',
          description: 'HYPHA AI Agent Service'
        },
        {
          id: `${did}#marketplace`,
          type: 'AgentMarketplace',
          serviceEndpoint: 'https://gani-hypha-web3.pages.dev/marketplace',
          description: 'HYPHA Blueprint Marketplace'
        }
      ],
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    };

    this.didCache.set(walletAddress, document);
    return document;
  }

  /**
   * Resolve a DID to its document
   * Simulates resolution from Ethereum blockchain
   */
  async resolveDID(did: string): Promise<DIDDocument | null> {
    // Extract address from DID
    const parts = did.split(':');
    const address = parts[parts.length - 1];
    
    if (this.didCache.has(address)) {
      return this.didCache.get(address)!;
    }

    // In production: would query Ethereum DID Registry contract
    // Contract: 0xdCa7EF03e98e0DC2B855bE647C39ABe984fcF21B (mainnet)
    await this._simulateNetworkCall(300);
    
    // Return generated document as fallback
    return this.generateDIDDocument(address);
  }

  /**
   * Calculate HYPHA Sovereignty Score
   */
  calculateSovereigntyScore(params: {
    hasWallet: boolean;
    hasPublishedDID: boolean;
    hasVerifiedCreds: boolean;
    hasStaking: boolean;
    hasDAOVote: boolean;
    hasIPFSData: boolean;
    hasDWNNode: boolean;
    haszkProof: boolean;
  }): SovereigntyScore {
    const scores = {
      dataScore: ((params.hasIPFSData ? 40 : 0) + (params.hasDWNNode ? 60 : 0)),
      modelScore: 80, // Groq = sovereign-enough
      computeScore: 90, // Cloudflare Edge
      identityScore: ((params.hasWallet ? 30 : 0) + (params.hasPublishedDID ? 40 : 0) + (params.hasVerifiedCreds ? 30 : 0)),
      revenueScore: ((params.hasStaking ? 60 : 0) + (params.hasIPFSData ? 40 : 0)),
      governanceScore: ((params.hasStaking ? 50 : 0) + (params.hasDAOVote ? 50 : 0))
    };

    const totalScore = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / 6);

    let level: SovereigntyScore['level'];
    if (totalScore >= 90) level = 'Web5';
    else if (totalScore >= 70) level = 'Web4';
    else if (totalScore >= 50) level = 'Web3';
    else if (totalScore >= 30) level = 'Web2.5';
    else level = 'Web2';

    const recommendations: string[] = [];
    if (!params.hasWallet) recommendations.push('Connect your Web3 wallet');
    if (!params.hasPublishedDID) recommendations.push('Publish your DID to Ceramic Network');
    if (!params.hasVerifiedCreds) recommendations.push('Obtain Verifiable Credentials from HYPHA');
    if (!params.hasStaking) recommendations.push('Stake HYPHA to earn governance rights');
    if (!params.hasDAOVote) recommendations.push('Vote in DAO governance proposals');
    if (!params.hasDWNNode) recommendations.push('Setup your Decentralized Web Node');
    if (!params.haszkProof) recommendations.push('Generate ZK proof for privacy-preserving identity');

    return { ...scores, totalScore, level, recommendations };
  }

  private async _simulateNetworkCall(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ── ZK PROOF SERVICE (zkML) ──────────────────────────────────

export class ZKProofService {
  private static instance: ZKProofService;

  static getInstance(): ZKProofService {
    if (!ZKProofService.instance) ZKProofService.instance = new ZKProofService();
    return ZKProofService.instance;
  }

  /**
   * Generate ZK proof for agent decision
   * In production: uses EZKL to generate ZK-SNARK proof
   * Proves: "Agent executed within approved parameters"
   *         WITHOUT revealing the actual strategy/parameters
   */
  async generateAgentDecisionProof(params: {
    agentId: string;
    decision: string;
    inputHash: string;
    outputHash: string;
  }): Promise<ZKProof> {
    // Simulate EZKL proof generation (~2-5 seconds in production)
    await new Promise(resolve => setTimeout(resolve, 1500));

    const circuitId = `hypha-agent-v1-${params.agentId.slice(0, 8)}`;
    
    return {
      proof: this._generateMockProof(params.inputHash, params.outputHash),
      publicSignals: [
        params.inputHash.slice(0, 32),
        params.outputHash.slice(0, 32),
        Date.now().toString()
      ],
      verificationKey: `vk_${circuitId}`,
      circuitId,
      computedAt: new Date().toISOString(),
      gasEstimate: 220000 // ~$2 on mainnet, <$0.01 on Base
    };
  }

  /**
   * Generate ZK membership proof (Semaphore-style)
   * Proves: "User is a HYPHA holder" WITHOUT revealing wallet address
   */
  async generateMembershipProof(params: {
    walletAddress: string;
    groupId: string; // e.g., "HYPHA_STAKERS", "GOVERNANCE_PARTICIPANTS"
    signal: string; // What they're proving membership for
  }): Promise<ZKProof> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      proof: this._generateMockProof(params.walletAddress, params.signal),
      publicSignals: [params.groupId, params.signal],
      verificationKey: 'semaphore_vk_v3',
      circuitId: 'semaphore-v3',
      computedAt: new Date().toISOString(),
      gasEstimate: 180000
    };
  }

  /**
   * Verify a ZK proof (on-chain simulation)
   */
  async verifyProof(proof: ZKProof): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 500));
    // In production: calls verifier smart contract
    return proof.proof.length > 0 && proof.publicSignals.length > 0;
  }

  private _generateMockProof(input1: string, input2: string): string {
    // Simplified mock proof generation (in production: actual zk-SNARK)
    const hash = btoa(`${input1}:${input2}:${Date.now()}`).replace(/=/g, '');
    return `0x${Array.from(hash).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('').slice(0, 128)}`;
  }
}

// ── VERIFIABLE CREDENTIAL SERVICE ───────────────────────────

export class VCService {
  private static instance: VCService;
  private issuedVCs: Map<string, VerifiableCredential> = new Map();

  static getInstance(): VCService {
    if (!VCService.instance) VCService.instance = new VCService();
    return VCService.instance;
  }

  /**
   * Issue an Agent Deployment Proof VC
   * W3C VC Data Model 2.0 compliant
   */
  async issueAgentDeploymentVC(params: {
    subjectDID: string;
    agentId: string;
    blueprintName: string;
    deploymentTx: string;
  }): Promise<VerifiableCredential> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const vcId = `vc:hypha:agent-deployment:${params.agentId}`;
    const now = new Date();
    const expires = new Date(now);
    expires.setFullYear(expires.getFullYear() + 1);

    const vc: VerifiableCredential = {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://hypha.io/credentials/v1'
      ],
      id: vcId,
      type: ['VerifiableCredential', 'AgentDeploymentProof'],
      issuer: {
        id: 'did:web:gani-hypha-web3.pages.dev',
        name: 'GANI HYPHA Platform'
      },
      issuanceDate: now.toISOString(),
      expirationDate: expires.toISOString(),
      credentialSubject: {
        id: params.subjectDID,
        agentId: params.agentId,
        blueprintName: params.blueprintName,
        deploymentTransaction: params.deploymentTx,
        deployedAt: now.toISOString(),
        platform: 'GANI HYPHA v4.0',
        chain: 'Ethereum Sepolia'
      },
      proof: {
        type: 'EcdsaSecp256k1Signature2019',
        created: now.toISOString(),
        verificationMethod: 'did:web:gani-hypha-web3.pages.dev#key-1',
        proofPurpose: 'assertionMethod',
        proofValue: `z${btoa(vcId + now.toISOString()).replace(/=/g, '').slice(0, 80)}`
      }
    };

    this.issuedVCs.set(vcId, vc);
    return vc;
  }

  /**
   * Issue a Governance Participation VC
   */
  async issueGovernanceVC(params: {
    subjectDID: string;
    proposalId: string;
    voteChoice: 'FOR' | 'AGAINST' | 'ABSTAIN';
    hyphaBalance: string;
  }): Promise<VerifiableCredential> {
    await new Promise(resolve => setTimeout(resolve, 600));

    const vcId = `vc:hypha:governance:${params.proposalId}`;
    const now = new Date();
    const expires = new Date(now);
    expires.setFullYear(expires.getFullYear() + 2);

    return {
      '@context': ['https://www.w3.org/2018/credentials/v1', 'https://hypha.io/credentials/v1'],
      id: vcId,
      type: ['VerifiableCredential', 'GovernanceParticipationProof'],
      issuer: { id: 'did:web:gani-hypha-web3.pages.dev', name: 'GANI HYPHA DAO' },
      issuanceDate: now.toISOString(),
      expirationDate: expires.toISOString(),
      credentialSubject: {
        id: params.subjectDID,
        proposalId: params.proposalId,
        participated: true,
        hyphaBalance: params.hyphaBalance,
        role: 'DAO Participant'
      }
    };
  }

  /**
   * Verify a Verifiable Credential
   */
  async verifyVC(vc: VerifiableCredential): Promise<{
    valid: boolean;
    expired: boolean;
    issuerVerified: boolean;
    message: string;
  }> {
    await new Promise(resolve => setTimeout(resolve, 400));

    const now = new Date();
    const expires = new Date(vc.expirationDate);
    const expired = now > expires;
    const issuerVerified = vc.issuer.id.includes('gani-hypha') || vc.issuer.id.includes('hypha.io');

    return {
      valid: !expired && issuerVerified && !!vc.proof,
      expired,
      issuerVerified,
      message: expired ? 'Credential expired' : !issuerVerified ? 'Unrecognized issuer' : 'Credential valid ✅'
    };
  }
}

// ── AGENT ECONOMY SERVICE ────────────────────────────────────

export class AgentEconomyService {
  private static instance: AgentEconomyService;

  static getInstance(): AgentEconomyService {
    if (!AgentEconomyService.instance) AgentEconomyService.instance = new AgentEconomyService();
    return AgentEconomyService.instance;
  }

  /**
   * Create an EIP-7702 session key for an agent
   * Allows agent to act within defined scope
   */
  createSessionKey(params: {
    ownerAddress: string;
    agentAddress: string;
    spendingLimitHYPHA: string;
    allowedContracts: string[];
    expiryHours: number;
  }): AgentIdentity {
    const expiresAt = Date.now() + (params.expiryHours * 3600 * 1000);
    const sessionKey = `sk_${btoa(params.ownerAddress + Date.now()).replace(/=/g, '').slice(0, 32)}`;

    return {
      agentDID: `did:hypha:agent:${params.agentAddress}`,
      walletAddress: params.agentAddress,
      sessionKey,
      spendingLimit: params.spendingLimitHYPHA,
      expiresAt,
      capabilities: params.allowedContracts.map(c => `execute:${c}`),
      proofOfWork: this._generateNonce(params.ownerAddress)
    };
  }

  /**
   * Simulate x402 micropayment
   * Agent pays for API access using HYPHA stablecoins
   */
  async executeX402Payment(params: {
    agentId: string;
    serviceUrl: string;
    priceHYPHA: number;
    sessionKey: string;
  }): Promise<{
    success: boolean;
    txHash: string;
    gasUsed: number;
    serviceResponse: unknown;
  }> {
    await new Promise(resolve => setTimeout(resolve, 800));

    return {
      success: true,
      txHash: `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      gasUsed: 21000 + Math.floor(Math.random() * 50000),
      serviceResponse: { status: 'fulfilled', data: `Service response for ${params.serviceUrl}` }
    };
  }

  /**
   * Calculate agent revenue share
   * Based on platform's RevenueDistributor contract model
   */
  calculateRevenueShare(totalRevenue: number): {
    agentOwner: number;
    protocolTreasury: number;
    stakingPool: number;
    burnAmount: number;
    liquidityMining: number;
  } {
    return {
      agentOwner: totalRevenue * 0.70,      // 70% to agent owner
      protocolTreasury: totalRevenue * 0.15, // 15% to DAO treasury
      stakingPool: totalRevenue * 0.08,      // 8% to HYPHA stakers
      burnAmount: totalRevenue * 0.02,       // 2% burned (deflationary)
      liquidityMining: totalRevenue * 0.05   // 5% to LP providers
    };
  }

  private _generateNonce(seed: string): string {
    return btoa(seed + Date.now()).replace(/[^a-zA-Z0-9]/g, '').slice(0, 24);
  }
}

// ── DWN SERVICE (Decentralized Web Node) ─────────────────────

export class DWNService {
  private static instance: DWNService;
  private localStore: Map<string, DWNMessage> = new Map();

  static getInstance(): DWNService {
    if (!DWNService.instance) DWNService.instance = new DWNService();
    return DWNService.instance;
  }

  /**
   * Write a record to the user's DWN
   * In production: sends to Ceramic Network
   */
  async writeRecord(params: {
    ownerDID: string;
    schema: string;
    data: unknown;
    encrypted?: boolean;
  }): Promise<DWNMessage> {
    await new Promise(resolve => setTimeout(resolve, 600));

    const recordId = `rec_${btoa(params.ownerDID + Date.now()).replace(/=/g, '').slice(0, 20)}`;
    
    const message: DWNMessage = {
      recordId,
      descriptor: {
        method: 'RecordsWrite',
        schema: params.schema,
        dataFormat: 'application/json',
        dateCreated: new Date().toISOString()
      },
      data: params.encrypted ? `[ENCRYPTED]` : params.data
    };

    this.localStore.set(recordId, message);
    return message;
  }

  /**
   * Query records from DWN
   */
  async queryRecords(params: {
    ownerDID: string;
    schema?: string;
  }): Promise<DWNMessage[]> {
    await new Promise(resolve => setTimeout(resolve, 400));

    const records = Array.from(this.localStore.values());
    if (params.schema) {
      return records.filter(r => r.descriptor.schema === params.schema);
    }
    return records;
  }

  /**
   * Get DWN node status
   */
  async getNodeStatus(): Promise<{
    online: boolean;
    nodeUrl: string;
    storedRecords: number;
    diskUsage: string;
  }> {
    // Simulate check of GANI HYPHA DWN node
    return {
      online: false, // Not yet deployed
      nodeUrl: 'https://dwn.gani-hypha.io/v1',
      storedRecords: this.localStore.size,
      diskUsage: `${this.localStore.size * 2}KB (local cache)`
    };
  }
}

// ── WEB5 ORCHESTRATOR ────────────────────────────────────────

export class Web5Orchestrator {
  private static instance: Web5Orchestrator;

  readonly did: DIDService;
  readonly zk: ZKProofService;
  readonly vc: VCService;
  readonly agentEconomy: AgentEconomyService;
  readonly dwn: DWNService;

  private constructor() {
    this.did = DIDService.getInstance();
    this.zk = ZKProofService.getInstance();
    this.vc = VCService.getInstance();
    this.agentEconomy = AgentEconomyService.getInstance();
    this.dwn = DWNService.getInstance();
  }

  static getInstance(): Web5Orchestrator {
    if (!Web5Orchestrator.instance) Web5Orchestrator.instance = new Web5Orchestrator();
    return Web5Orchestrator.instance;
  }

  /**
   * Full onboarding: Generate DID + Issue welcome VC + Setup DWN profile
   */
  async onboardUser(walletAddress: string): Promise<{
    did: DIDDocument;
    welcomeVC: VerifiableCredential;
    sovereigntyScore: SovereigntyScore;
    dwnProfile: DWNMessage;
  }> {
    const [did, dwnProfile] = await Promise.all([
      Promise.resolve(this.did.generateDIDDocument(walletAddress)),
      this.dwn.writeRecord({
        ownerDID: `did:ethr:mainnet:${walletAddress}`,
        schema: 'https://hypha.io/schemas/user-profile',
        data: {
          walletAddress,
          createdAt: new Date().toISOString(),
          platform: 'GANI HYPHA v4.0'
        }
      })
    ]);

    const welcomeVC = await this.vc.issueAgentDeploymentVC({
      subjectDID: did.id,
      agentId: 'welcome-agent-001',
      blueprintName: 'HYPHA Platform Access',
      deploymentTx: '0x0000000000000000000000000000000000000000'
    });

    const sovereigntyScore = this.did.calculateSovereigntyScore({
      hasWallet: true,
      hasPublishedDID: false, // Will be true after Ceramic integration
      hasVerifiedCreds: true,
      hasStaking: false,
      hasDAOVote: false,
      hasIPFSData: false,
      hasDWNNode: false,
      haszkProof: false
    });

    return { did, welcomeVC, sovereigntyScore, dwnProfile };
  }

  /**
   * Deploy an agent with full Web5 setup
   */
  async deployAgentWithWeb5(params: {
    ownerDID: string;
    ownerAddress: string;
    blueprintId: string;
    blueprintName: string;
  }): Promise<{
    agentIdentity: AgentIdentity;
    deploymentVC: VerifiableCredential;
    zkProof: ZKProof;
    dwnRecord: DWNMessage;
  }> {
    const agentAddress = `0x${Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    
    const [agentIdentity, deploymentVC, zkProof, dwnRecord] = await Promise.all([
      Promise.resolve(this.agentEconomy.createSessionKey({
        ownerAddress: params.ownerAddress,
        agentAddress,
        spendingLimitHYPHA: '100',
        allowedContracts: ['HYPHAToken', 'HYPHAStaking'],
        expiryHours: 24
      })),
      this.vc.issueAgentDeploymentVC({
        subjectDID: params.ownerDID,
        agentId: params.blueprintId,
        blueprintName: params.blueprintName,
        deploymentTx: `0x${Date.now().toString(16).padStart(64, '0')}`
      }),
      this.zk.generateAgentDecisionProof({
        agentId: params.blueprintId,
        decision: `Deploy ${params.blueprintName}`,
        inputHash: btoa(params.blueprintId).slice(0, 32),
        outputHash: btoa(agentAddress).slice(0, 32)
      }),
      this.dwn.writeRecord({
        ownerDID: params.ownerDID,
        schema: 'https://hypha.io/schemas/agent-deployment',
        data: { blueprintId: params.blueprintId, agentAddress, deployedAt: new Date().toISOString() }
      })
    ]);

    return { agentIdentity, deploymentVC, zkProof, dwnRecord };
  }

  /**
   * Get platform Web5 readiness report
   */
  getPlatformReadiness(): Record<string, { ready: boolean; eta: string; priority: number }> {
    return {
      'DID Publication (Ceramic)': { ready: false, eta: 'Month 2', priority: 1 },
      'Verifiable Credentials (On-Chain)': { ready: false, eta: 'Month 2', priority: 2 },
      'Real Wallet Connection (wagmi)': { ready: false, eta: 'Week 1', priority: 1 },
      'EIP-7702 Session Keys': { ready: false, eta: 'Month 1', priority: 2 },
      'Agent NFTs (ERC-6551)': { ready: false, eta: 'Month 3', priority: 3 },
      'ZK Membership Proofs (Semaphore)': { ready: false, eta: 'Month 4', priority: 3 },
      'zkML Agent Verification': { ready: false, eta: 'Month 6', priority: 4 },
      'DWN Node Deployment': { ready: false, eta: 'Month 6', priority: 3 },
      'x402 M2M Payments': { ready: false, eta: 'Month 5', priority: 4 },
      'Cross-Chain Bridge (LayerZero)': { ready: false, eta: 'Month 8', priority: 5 }
    };
  }
}

// ── SINGLETON EXPORTS ────────────────────────────────────────

export const web5 = Web5Orchestrator.getInstance();
export const didService = DIDService.getInstance();
export const zkService = ZKProofService.getInstance();
export const vcService = VCService.getInstance();
export const agentEconomyService = AgentEconomyService.getInstance();
export const dwnService = DWNService.getInstance();

// ── UTILITY FUNCTIONS ────────────────────────────────────────

export function formatSovereigntyLevel(level: SovereigntyScore['level']): {
  label: string;
  color: string;
  icon: string;
  description: string;
} {
  const levels = {
    'Web2': { label: 'Web2 Centralized', color: '#6b7280', icon: '🏢', description: 'Platform controls your data and identity' },
    'Web2.5': { label: 'Web2.5 Hybrid', color: '#f59e0b', icon: '🔄', description: 'Some decentralization, but still dependent' },
    'Web3': { label: 'Web3 Tokenized', color: '#6366f1', icon: '⟠', description: 'Token ownership, partial sovereignty' },
    'Web4': { label: 'Web4 AI-Native', color: '#8b5cf6', icon: '🤖', description: 'AI-enhanced sovereignty with agent autonomy' },
    'Web5': { label: 'Web5 Fully Sovereign', color: '#10b981', icon: '🌐', description: 'Complete control: data, identity, compute, revenue' }
  };
  return levels[level];
}

export function estimateGasCost(operation: string): { wei: string; gwei: string; usd: string } {
  const estimates: Record<string, number> = {
    'DID_PUBLISH': 80000,
    'VC_ISSUANCE': 120000,
    'ZK_VERIFY': 220000,
    'AGENT_DEPLOY': 350000,
    'STAKE_HYPHA': 95000,
    'DAO_VOTE': 75000,
    'ERC20_TRANSFER': 65000,
    'SESSION_KEY_CREATE': 45000
  };

  const gasLimit = estimates[operation] || 100000;
  const gasPriceGwei = 15; // Current approximate
  const ethPrice = 3500; // Approximate ETH/USD

  const gasWei = BigInt(gasLimit) * BigInt(gasPriceGwei) * BigInt(1e9);
  const gasEth = Number(gasWei) / 1e18;
  const gasUsd = gasEth * ethPrice;

  return {
    wei: gasWei.toString(),
    gwei: `${(Number(gasWei) / 1e9).toFixed(2)} Gwei`,
    usd: `$${gasUsd.toFixed(4)}`
  };
}
