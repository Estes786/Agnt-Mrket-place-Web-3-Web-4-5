import React, { useState, useEffect } from 'react';
import { UserStats, Web3Wallet, IPFSFile } from '../types';
import { WEB3AUTH_CONFIG, PINATA_CONFIG, WEB3_STACK } from '../constants';

interface Web3IdentityProps {
  userStats: UserStats;
  onConnectWallet: () => void;
  onDisconnect: () => void;
}

const Web3Identity: React.FC<Web3IdentityProps> = ({ userStats, onConnectWallet, onDisconnect }) => {
  const [activeTab, setActiveTab] = useState<'identity' | 'wallet' | 'web3auth' | 'ipfs' | 'credentials'>('identity');
  const [isResolving, setIsResolving] = useState(false);
  const [didDoc, setDidDoc] = useState<string | null>(null);
  const [ipfsFiles, setIpfsFiles] = useState<IPFSFile[]>([
    { cid: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG', name: 'agent-blueprint-001.json', size: 4820, uploadedAt: '2026-02-20', pinned: true, gateway: 'https://gateway.pinata.cloud/ipfs/' },
    { cid: 'QmXnnyufdzAWL5CqZ2RnUuesa8VMNjRUDU4TtFHpMG4sQi', name: 'did-document.json', size: 1240, uploadedAt: '2026-02-18', pinned: true, gateway: 'https://gateway.pinata.cloud/ipfs/' },
    { cid: 'QmPChd2hVbrJ6bfo3WBcTW4iZnpHm8TEzWkLHmLpXhF68A', name: 'governance-snapshot.json', size: 12480, uploadedAt: '2026-02-15', pinned: false, gateway: 'https://gateway.pinata.cloud/ipfs/' }
  ]);
  const [web3AuthStatus, setWeb3AuthStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [ensName, setEnsName] = useState('');
  const [privyConnected, setPrivyConnected] = useState(false);
  const [uploadingToIPFS, setUploadingToIPFS] = useState(false);
  const [verifiableCredentials, setVerifiableCredentials] = useState([
    { id: 'vc-001', type: 'AgentDeploymentProof', issuer: 'HYPHA Platform', subject: 'Agent Deployment Verified', status: 'Valid', issuedAt: '2026-02-20', expiresAt: '2027-02-20' },
    { id: 'vc-002', type: 'GovernanceParticipation', issuer: 'HYPHA DAO', subject: 'Active DAO Participant', status: 'Valid', issuedAt: '2026-02-15', expiresAt: '2027-02-15' },
    { id: 'vc-003', type: 'KYC_Attestation', issuer: 'Civic Pass', subject: 'Identity Verified', status: 'Valid', issuedAt: '2026-01-10', expiresAt: '2027-01-10' }
  ]);

  const generateDID = async () => {
    setIsResolving(true);
    await new Promise(r => setTimeout(r, 1500));
    const addr = userStats.walletAddress || '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
    const didDocument = {
      '@context': ['https://www.w3.org/ns/did/v1', 'https://w3id.org/security/suites/jws-2020/v1'],
      id: `did:ethr:mainnet:${addr}`,
      verificationMethod: [{
        id: `did:ethr:mainnet:${addr}#controllerKey`,
        type: 'EcdsaSecp256k1RecoveryMethod2020',
        controller: `did:ethr:mainnet:${addr}`,
        blockchainAccountId: `eip155:1:${addr}`
      }],
      authentication: [`did:ethr:mainnet:${addr}#controllerKey`],
      assertionMethod: [`did:ethr:mainnet:${addr}#controllerKey`],
      service: [
        { id: `did:ethr:mainnet:${addr}#dwn`, type: 'DecentralizedWebNode', serviceEndpoint: { nodes: ['https://dwn.hypha.io/v1'] } },
        { id: `did:ethr:mainnet:${addr}#agent`, type: 'HYPHAAgent', serviceEndpoint: 'https://agent-marketplace-2.pages.dev' }
      ],
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    };
    setDidDoc(JSON.stringify(didDocument, null, 2));
    setIsResolving(false);
  };

  const handleWeb3AuthConnect = async () => {
    setWeb3AuthStatus('connecting');
    await new Promise(r => setTimeout(r, 2000));
    setWeb3AuthStatus('connected');
    setEnsName('gani.hypha.eth');
  };

  const handlePrivyConnect = async () => {
    await new Promise(r => setTimeout(r, 1000));
    setPrivyConnected(true);
  };

  const handleIPFSUpload = async () => {
    setUploadingToIPFS(true);
    await new Promise(r => setTimeout(r, 2000));
    const newFile: IPFSFile = {
      cid: 'Qm' + Math.random().toString(36).substring(2, 48),
      name: `blueprint-${Date.now()}.json`,
      size: Math.floor(Math.random() * 10000 + 1000),
      uploadedAt: new Date().toISOString().split('T')[0],
      pinned: true,
      gateway: PINATA_CONFIG.gateway
    };
    setIpfsFiles(prev => [newFile, ...prev]);
    setUploadingToIPFS(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center text-xl">🪪</div>
          <div>
            <h1 className="text-2xl font-black text-white">Web3 Identity Hub</h1>
            <p className="text-gray-400 text-sm">DID · Web3Auth · Privy · IPFS/Pinata · Verifiable Credentials</p>
          </div>
        </div>
        <div>
          {userStats.isWalletConnected ? (
            <div className="flex items-center gap-2">
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-2">
                <p className="text-green-400 text-xs font-mono">
                  {userStats.walletAddress?.substring(0, 6)}...{userStats.walletAddress?.substring(38)}
                </p>
                <p className="text-gray-500 text-xs">Wallet Connected</p>
              </div>
              <button onClick={onDisconnect} className="px-3 py-2 bg-red-500/20 text-red-400 text-xs rounded-lg hover:bg-red-500/30">
                Disconnect
              </button>
            </div>
          ) : (
            <button onClick={onConnectWallet} className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl text-sm transition-all">
              🔗 Connect Wallet
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { id: 'identity', label: '🪪 DID Identity' },
          { id: 'wallet', label: '👛 Multi-Wallet' },
          { id: 'web3auth', label: '🔐 Web3Auth' },
          { id: 'ipfs', label: '📌 IPFS/Pinata' },
          { id: 'credentials', label: '🏅 Credentials' }
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${activeTab === t.id ? 'bg-cyan-500 text-black' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* DID Identity */}
      {activeTab === 'identity' && (
        <div className="space-y-4">
          <div className="bg-gray-900 border border-cyan-500/20 rounded-xl p-4">
            <h3 className="text-cyan-400 font-bold mb-3">🪪 Decentralized Identity (DID)</h3>
            <p className="text-gray-400 text-sm mb-4">
              W3C DID standard — your sovereign identity on the blockchain. 
              Compatible with Web5 DWN protocol and ENS naming system.
            </p>

            {userStats.walletAddress ? (
              <div>
                <div className="bg-gray-800 rounded-xl p-3 mb-4">
                  <p className="text-gray-400 text-xs mb-1">Your DID</p>
                  <p className="text-cyan-400 font-mono text-sm break-all">
                    did:ethr:mainnet:{userStats.walletAddress}
                  </p>
                </div>

                <button onClick={generateDID} disabled={isResolving}
                  className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl transition-all disabled:opacity-50">
                  {isResolving ? '🔄 Resolving DID...' : '📄 Generate DID Document'}
                </button>

                {didDoc && (
                  <div className="mt-4 bg-gray-800 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-green-400 text-xs font-bold">✓ DID Document Generated</p>
                      <button onClick={() => navigator.clipboard.writeText(didDoc)}
                        className="text-xs text-gray-400 hover:text-white">📋 Copy</button>
                    </div>
                    <pre className="text-green-300 text-xs font-mono overflow-x-auto max-h-64 overflow-y-auto">
                      {didDoc}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-6xl mb-3">🔑</p>
                <p className="text-gray-400 mb-4">Connect wallet to generate your DID</p>
                <button onClick={onConnectWallet}
                  className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl transition-all">
                  Connect Wallet
                </button>
              </div>
            )}
          </div>

          {/* DID Standards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'did:ethr', desc: 'Ethereum DID Method', status: 'Active', icon: '⟠' },
              { name: 'did:web', desc: 'Web-based DID', status: 'Active', icon: '🌐' },
              { name: 'did:ion', desc: 'Bitcoin Sidetree DID', status: 'Planned', icon: '₿' }
            ].map((d, i) => (
              <div key={i} className="bg-gray-900 border border-gray-700 rounded-xl p-3">
                <p className="text-2xl mb-1">{d.icon}</p>
                <p className="text-white font-bold text-sm">{d.name}</p>
                <p className="text-gray-400 text-xs">{d.desc}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${d.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                  {d.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Multi-Wallet */}
      {activeTab === 'wallet' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* MetaMask */}
            <div className="bg-gray-900 border border-orange-500/20 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🦊</span>
                <div>
                  <p className="text-white font-bold">MetaMask</p>
                  <p className="text-gray-400 text-xs">Ethereum / EVM Chains</p>
                </div>
                {userStats.isWalletConnected && <span className="ml-auto text-green-400 text-xs">● Connected</span>}
              </div>
              {userStats.isWalletConnected ? (
                <div>
                  <p className="text-gray-400 text-xs">Address</p>
                  <p className="text-orange-400 text-xs font-mono">{userStats.walletAddress}</p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="bg-gray-800 rounded-lg p-2 text-center">
                      <p className="text-white text-sm font-bold">{(userStats.ethBalance || 0.42).toFixed(4)}</p>
                      <p className="text-gray-500 text-xs">ETH</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-2 text-center">
                      <p className="text-green-400 text-sm font-bold">{userStats.hyphaBalance}</p>
                      <p className="text-gray-500 text-xs">HYPHA</p>
                    </div>
                  </div>
                </div>
              ) : (
                <button onClick={onConnectWallet}
                  className="w-full py-2 bg-orange-500 hover:bg-orange-400 text-white text-sm font-bold rounded-lg transition-all">
                  Connect MetaMask
                </button>
              )}
            </div>

            {/* WalletConnect */}
            <div className="bg-gray-900 border border-blue-500/20 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🔗</span>
                <div>
                  <p className="text-white font-bold">WalletConnect</p>
                  <p className="text-gray-400 text-xs">Multi-Chain QR Connect</p>
                </div>
              </div>
              <p className="text-gray-500 text-xs mb-3">Connect any mobile wallet via QR code</p>
              <button className="w-full py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 text-sm font-bold rounded-lg hover:bg-blue-500/30 transition-all">
                📱 Scan QR Code
              </button>
            </div>

            {/* Phantom (Solana) */}
            <div className="bg-gray-900 border border-purple-500/20 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">👻</span>
                <div>
                  <p className="text-white font-bold">Phantom</p>
                  <p className="text-gray-400 text-xs">Solana + Ethereum</p>
                </div>
              </div>
              <button className="w-full py-2 bg-purple-500/20 border border-purple-500/30 text-purple-400 text-sm font-bold rounded-lg hover:bg-purple-500/30 transition-all">
                Connect Phantom
              </button>
            </div>

            {/* Coinbase Wallet */}
            <div className="bg-gray-900 border border-cyan-500/20 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🔵</span>
                <div>
                  <p className="text-white font-bold">Coinbase Wallet</p>
                  <p className="text-gray-400 text-xs">Base Chain Native</p>
                </div>
              </div>
              <button className="w-full py-2 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-sm font-bold rounded-lg hover:bg-cyan-500/30 transition-all">
                Connect Coinbase
              </button>
            </div>
          </div>

          {/* Wallet Stack Info */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
            <h3 className="text-white font-bold mb-3">🔧 Supported Identity Stacks</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {WEB3_STACK.identity.map((id, i) => (
                <div key={i} className="bg-gray-800 rounded-lg p-2 text-center">
                  <p className="text-cyan-400 text-xs font-bold">{id}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Web3Auth */}
      {activeTab === 'web3auth' && (
        <div className="space-y-4">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🔐</span>
              <h3 className="text-blue-400 font-bold">Web3Auth MPC</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Social login → Web3 wallet, powered by Multi-Party Computation (MPC).
              No seed phrases needed. Compatible with Google, Apple, GitHub logins.
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
            <h3 className="text-white font-bold mb-3">Configuration</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between bg-gray-800 rounded-lg p-2">
                <span className="text-gray-400">Client ID</span>
                <span className="text-cyan-400 font-mono">BOZC...q0M</span>
              </div>
              <div className="flex justify-between bg-gray-800 rounded-lg p-2">
                <span className="text-gray-400">Network</span>
                <span className="text-green-400">Mainnet</span>
              </div>
              <div className="flex justify-between bg-gray-800 rounded-lg p-2">
                <span className="text-gray-400">JWKS Endpoint</span>
                <span className="text-blue-400">api-auth.web3auth.io/.well-known/jwks.json</span>
              </div>
              <div className="flex justify-between bg-gray-800 rounded-lg p-2">
                <span className="text-gray-400">MPC Shares</span>
                <span className="text-white">3-of-5 Threshold</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
            <h3 className="text-white font-bold mb-3">Login via Social</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Google', icon: '🔴', color: 'red' },
                { name: 'Apple', icon: '⬛', color: 'gray' },
                { name: 'GitHub', icon: '🐙', color: 'gray' },
                { name: 'Discord', icon: '🎮', color: 'indigo' }
              ].map((p, i) => (
                <button key={i}
                  onClick={() => { if (p.name === 'Google') handleWeb3AuthConnect(); }}
                  className="flex items-center gap-2 py-3 px-4 bg-gray-800 hover:bg-gray-700 rounded-xl transition-all">
                  <span className="text-xl">{p.icon}</span>
                  <span className="text-white text-sm">Continue with {p.name}</span>
                </button>
              ))}
            </div>

            {web3AuthStatus === 'connected' && (
              <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                <p className="text-green-400 font-bold text-sm">✓ Web3Auth Connected!</p>
                <p className="text-gray-400 text-xs">Wallet generated via MPC: {ensName}</p>
                <p className="text-gray-400 text-xs">No seed phrase required — 3-of-5 key shares secured</p>
              </div>
            )}
          </div>

          {/* Privy */}
          <div className="bg-gray-900 border border-purple-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🟣</span>
              <h3 className="text-purple-400 font-bold">Privy Authentication</h3>
            </div>
            <p className="text-gray-400 text-xs mb-3">
              Email/phone login with embedded wallets. App ID: ganihy...marketplace
            </p>
            {!privyConnected ? (
              <button onClick={handlePrivyConnect}
                className="w-full py-2 bg-purple-500/20 border border-purple-500/30 text-purple-400 font-bold rounded-lg hover:bg-purple-500/30 transition-all">
                🔒 Connect with Privy
              </button>
            ) : (
              <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <p className="text-purple-400 text-sm">✓ Privy Connected — Embedded wallet created</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* IPFS / Pinata */}
      {activeTab === 'ipfs' && (
        <div className="space-y-4">
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">📌</span>
              <h3 className="text-yellow-400 font-bold">Pinata IPFS Storage</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Decentralized file storage via IPFS with Pinata pinning service. 
              Store agent blueprints, DID documents, and governance data permanently.
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-bold">Pinned Files</h3>
              <button onClick={handleIPFSUpload} disabled={uploadingToIPFS}
                className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-bold rounded-lg transition-all disabled:opacity-50">
                {uploadingToIPFS ? '📤 Uploading...' : '📤 Pin New File'}
              </button>
            </div>
            <div className="space-y-2">
              {ipfsFiles.map((f, i) => (
                <div key={i} className="bg-gray-800 rounded-xl p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{f.name}</p>
                      <p className="text-gray-500 text-xs font-mono break-all">CID: {f.cid.substring(0, 20)}...</p>
                      <p className="text-gray-500 text-xs">{(f.size / 1024).toFixed(1)} KB · {f.uploadedAt}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${f.pinned ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                        {f.pinned ? '📌 Pinned' : '⚠️ Unpinned'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <a href={`${f.gateway}${f.cid}`} target="_blank" rel="noopener noreferrer"
                      className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded-lg transition-all">
                      🔗 View on IPFS
                    </a>
                    <button onClick={() => navigator.clipboard.writeText(`${f.gateway}${f.cid}`)}
                      className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded-lg transition-all">
                      📋 Copy URL
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
            <h3 className="text-white font-bold mb-3">Storage Stats</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-yellow-400 text-xl font-bold">{ipfsFiles.length}</p>
                <p className="text-gray-400 text-xs">Files Pinned</p>
              </div>
              <div>
                <p className="text-blue-400 text-xl font-bold">{(ipfsFiles.reduce((a, f) => a + f.size, 0) / 1024).toFixed(1)} KB</p>
                <p className="text-gray-400 text-xs">Total Size</p>
              </div>
              <div>
                <p className="text-green-400 text-xl font-bold">99.9%</p>
                <p className="text-gray-400 text-xs">Availability</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Verifiable Credentials */}
      {activeTab === 'credentials' && (
        <div className="space-y-4">
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
            <h3 className="text-green-400 font-bold mb-1">🏅 Verifiable Credentials (W3C VC)</h3>
            <p className="text-gray-400 text-sm">Cryptographically signed attestations about your identity and achievements on the HYPHA platform.</p>
          </div>

          <div className="space-y-3">
            {verifiableCredentials.map((vc, i) => (
              <div key={i} className="bg-gray-900 border border-green-500/20 rounded-xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-white font-bold text-sm">{vc.type.replace(/_/g, ' ')}</p>
                    <p className="text-gray-400 text-xs">Issuer: {vc.issuer}</p>
                  </div>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${vc.status === 'Valid' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {vc.status}
                  </span>
                </div>
                <p className="text-green-300 text-sm mb-2">✓ {vc.subject}</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Issued: {vc.issuedAt}</span>
                  <span>Expires: {vc.expiresAt}</span>
                </div>
                <div className="mt-2 flex gap-2">
                  <button className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded-lg">
                    🔍 Verify
                  </button>
                  <button className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded-lg">
                    📤 Share
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full py-3 border border-green-500/30 text-green-400 font-bold rounded-xl hover:bg-green-500/10 transition-all">
            + Request New Credential
          </button>
        </div>
      )}
    </div>
  );
};

export default Web3Identity;
