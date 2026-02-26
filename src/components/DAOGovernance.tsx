import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { DAO_CONFIG, HYPHA_TOKENOMICS } from '../constants';
import { DAOProposal, UserStats } from '../types';

interface DAOGovernanceProps {
  userStats: UserStats;
  onStake: (amount: number) => void;
  onUnstake: (amount: number) => void;
  onVote?: (proposalId: string, support: boolean) => void;
}

const SAMPLE_PROPOSALS: DAOProposal[] = [
  {
    id: 'PROP-001',
    title: 'Increase Staking APY to 22%',
    description: 'Proposal to increase base staking APY from 18.5% to 22% for the next epoch to incentivize long-term holders and reduce circulating supply pressure.',
    proposer: '0x742d...f44e',
    status: 'Active',
    votesFor: 4_820_000,
    votesAgainst: 1_230_000,
    quorum: 10_000_000,
    deadline: '2026-02-28',
    category: 'Tokenomics',
    implementation: 'Update StakingVault.setAPY(2200) via multi-sig timelock'
  },
  {
    id: 'PROP-002',
    title: 'Integrate Arbitrum Bridge for HYPHA',
    description: 'Deploy HYPHA bridging infrastructure to Arbitrum via LayerZero protocol, enabling cross-chain liquidity and reducing Ethereum gas costs for users.',
    proposer: '0xa1b2...c3d4',
    status: 'Passed',
    votesFor: 12_400_000,
    votesAgainst: 890_000,
    quorum: 10_000_000,
    deadline: '2026-02-15',
    category: 'Protocol',
    implementation: 'Deploy LayerZero OFT on Arbitrum One'
  },
  {
    id: 'PROP-003',
    title: 'Treasury Diversification — Allocate 5% to ETH',
    description: 'Diversify DAO treasury by converting 5% of HYPHA reserves to ETH, reducing single-asset exposure and providing yield through ETH staking with Lido.',
    proposer: '0xDEAD...BEEF',
    status: 'Active',
    votesFor: 2_100_000,
    votesAgainst: 3_500_000,
    quorum: 10_000_000,
    deadline: '2026-03-05',
    category: 'Treasury'
  },
  {
    id: 'PROP-004',
    title: 'Launch HYPHA Grants Program v2',
    description: 'Allocate 5M HYPHA from treasury for developer grants to build integrations, tools, and ecosystem applications on the HYPHA platform.',
    proposer: '0x9f8e...7d6c',
    status: 'Pending',
    votesFor: 0,
    votesAgainst: 0,
    quorum: 10_000_000,
    deadline: '2026-03-15',
    category: 'Governance'
  },
  {
    id: 'PROP-005',
    title: 'Partnership with Chainlink for Oracle Data',
    description: 'Formalize partnership with Chainlink to use Price Feeds and VRF in HYPHA agent ecosystems, including a mutual marketing campaign.',
    proposer: '0x5a4b...3c2d',
    status: 'Executed',
    votesFor: 18_200_000,
    votesAgainst: 420_000,
    quorum: 10_000_000,
    deadline: '2026-02-01',
    category: 'Partnership',
    implementation: 'Chainlink integration deployed on mainnet'
  }
];

const DAOGovernance: React.FC<DAOGovernanceProps> = ({ userStats, onStake, onUnstake, onVote }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'proposals' | 'staking' | 'treasury'>('overview');
  const [stakeAmount, setStakeAmount] = useState('100');
  const [unstakeAmount, setUnstakeAmount] = useState('100');
  const [votingOnProposal, setVotingOnProposal] = useState<string | null>(null);
  const [epochCountdown, setEpochCountdown] = useState({ h: 14, m: 22, s: 5 });
  const [userVotes, setUserVotes] = useState<Record<string, boolean>>({});
  const [createProposalOpen, setCreateProposalOpen] = useState(false);

  const treasuryData = useMemo(() => [
    { name: 'HYPHA', value: DAO_CONFIG.treasury.hyphaBalance / 1_000_000, color: '#10b981' },
    { name: 'ETH', value: DAO_CONFIG.treasury.ethBalance * 3200 / 1_000, color: '#6366f1' },
    { name: 'USDC', value: DAO_CONFIG.treasury.usdcBalance / 1_000, color: '#06b6d4' }
  ], []);

  const votingHistory = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      epoch: `E${i + 1}`,
      participation: Math.floor(Math.random() * 30 + 15),
      proposals: Math.floor(Math.random() * 5 + 2)
    }));
  }, []);

  const handleVote = (proposalId: string, support: boolean) => {
    setUserVotes(prev => ({ ...prev, [proposalId]: support }));
    setVotingOnProposal(null);
    if (onVote) onVote(proposalId, support);
  };

  const projectedAPY = HYPHA_TOKENOMICS.stakingAPY;
  const dailyYield = userStats.stakedAmount * projectedAPY / 100 / 365;
  const monthlyYield = dailyYield * 30;
  const annualYield = userStats.stakedAmount * projectedAPY / 100;

  const statusColor: Record<string, string> = {
    Active: 'text-green-400 bg-green-500/20',
    Passed: 'text-blue-400 bg-blue-500/20',
    Failed: 'text-red-400 bg-red-500/20',
    Pending: 'text-yellow-400 bg-yellow-500/20',
    Executed: 'text-purple-400 bg-purple-500/20'
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-600 rounded-xl flex items-center justify-center text-xl">🏛️</div>
          <div>
            <h1 className="text-2xl font-black text-white">HYPHA DAO</h1>
            <p className="text-gray-400 text-sm">Sovereign Governance · {DAO_CONFIG.votingToken} Powered</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl px-4 py-2 text-center">
            <p className="text-purple-400 font-bold">{userStats.governancePower.toLocaleString()}</p>
            <p className="text-gray-500 text-xs">vHYPHA Power</p>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-2 text-center">
            <p className="text-green-400 font-bold">{projectedAPY}%</p>
            <p className="text-gray-500 text-xs">Current APY</p>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl px-4 py-2 text-center">
            <p className="text-orange-400 font-bold">{epochCountdown.h}:{String(epochCountdown.m).padStart(2,'0')}:{String(epochCountdown.s).padStart(2,'0')}</p>
            <p className="text-gray-500 text-xs">Next Epoch</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {([
          { id: 'overview', label: '📊 Overview' },
          { id: 'proposals', label: '📋 Proposals' },
          { id: 'staking', label: '🔒 Staking Vault' },
          { id: 'treasury', label: '💰 Treasury' }
        ] as const).map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${activeTab === t.id ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* DAO Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Proposals', value: SAMPLE_PROPOSALS.length.toString(), icon: '📋', color: 'blue' },
              { label: 'Active Voters', value: '8,420', icon: '🗳️', color: 'purple' },
              { label: 'Quorum %', value: `${DAO_CONFIG.quorumPercent}%`, icon: '⚖️', color: 'cyan' },
              { label: 'Passing Threshold', value: `${DAO_CONFIG.passingThreshold}%`, icon: '✅', color: 'green' }
            ].map((s, i) => (
              <div key={i} className={`bg-${s.color}-500/10 border border-${s.color}-500/20 rounded-xl p-4`}>
                <p className="text-2xl mb-1">{s.icon}</p>
                <p className={`text-${s.color}-400 text-lg font-black`}>{s.value}</p>
                <p className="text-gray-500 text-xs">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Voting History Chart */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
            <h3 className="text-white font-bold mb-4">📈 Governance Participation History</h3>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={votingHistory}>
                <defs>
                  <linearGradient id="voteGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937"/>
                <XAxis dataKey="epoch" tick={{ fill: '#6b7280', fontSize: 10 }}/>
                <YAxis tick={{ fill: '#6b7280', fontSize: 10 }}/>
                <Tooltip/>
                <Area type="monotone" dataKey="participation" stroke="#a855f7" fill="url(#voteGrad)" name="Participation %"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Your Governance Power */}
          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/20 rounded-xl p-4">
            <h3 className="text-purple-400 font-bold mb-4">🗳️ Your Governance Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-gray-400 text-xs">HYPHA Staked</p>
                <p className="text-white text-xl font-black">{userStats.stakedAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">vHYPHA (1:1.2)</p>
                <p className="text-purple-400 text-xl font-black">{userStats.governancePower.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Proposals Voted</p>
                <p className="text-cyan-400 text-xl font-black">{Object.keys(userVotes).length}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Reputation Score</p>
                <p className="text-green-400 text-xl font-black">{userStats.reputationScore}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Proposals */}
      {activeTab === 'proposals' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-bold">Active Proposals</h3>
            <button
              onClick={() => setCreateProposalOpen(!createProposalOpen)}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-400 text-white text-sm font-bold rounded-lg transition-all">
              + New Proposal
            </button>
          </div>

          {createProposalOpen && (
            <div className="bg-gray-900 border border-purple-500/30 rounded-xl p-4">
              <h4 className="text-purple-400 font-bold mb-3">Create Proposal</h4>
              <div className="space-y-3">
                <input className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg p-2 text-sm focus:border-purple-500 outline-none" placeholder="Proposal Title"/>
                <textarea className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg p-2 text-sm focus:border-purple-500 outline-none h-20 resize-none" placeholder="Description"/>
                <p className="text-yellow-400 text-xs">⚠️ Requires {(DAO_CONFIG.proposalThreshold / 1000).toFixed(0)}K vHYPHA to submit. Your power: {userStats.governancePower} vHYPHA</p>
                <button className="px-4 py-2 bg-purple-500 hover:bg-purple-400 text-white text-sm font-bold rounded-lg">
                  Submit Proposal
                </button>
              </div>
            </div>
          )}

          {SAMPLE_PROPOSALS.map((p) => (
            <div key={p.id} className="bg-gray-900 border border-gray-700 rounded-xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColor[p.status]}`}>{p.status}</span>
                    <span className="px-2 py-0.5 bg-gray-700 text-gray-400 text-xs rounded-full">{p.category}</span>
                    <span className="text-gray-500 text-xs">{p.id}</span>
                  </div>
                  <h4 className="text-white font-bold">{p.title}</h4>
                  <p className="text-gray-400 text-xs mt-1">{p.description.substring(0, 120)}...</p>
                </div>
              </div>

              {/* Vote bars */}
              <div className="space-y-1 mb-3">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>For: {(p.votesFor / 1_000_000).toFixed(1)}M</span>
                  <span>Against: {(p.votesAgainst / 1_000_000).toFixed(1)}M</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full flex">
                  <div
                    className="h-full bg-green-500 rounded-l-full transition-all"
                    style={{ width: `${p.votesFor + p.votesAgainst > 0 ? (p.votesFor / (p.votesFor + p.votesAgainst)) * 100 : 0}%` }}
                  />
                  <div className="h-full bg-red-500 rounded-r-full flex-1"/>
                </div>
                <p className="text-gray-500 text-xs">
                  Quorum: {((p.votesFor + p.votesAgainst) / p.quorum * 100).toFixed(1)}% · Deadline: {p.deadline}
                </p>
              </div>

              {/* Vote buttons */}
              {p.status === 'Active' && !userVotes[p.id] && (
                <div className="flex gap-2">
                  <button onClick={() => handleVote(p.id, true)}
                    className="flex-1 py-2 bg-green-500/20 hover:bg-green-500/40 text-green-400 text-sm font-bold rounded-lg transition-all border border-green-500/30">
                    ✅ Vote For
                  </button>
                  <button onClick={() => handleVote(p.id, false)}
                    className="flex-1 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 text-sm font-bold rounded-lg transition-all border border-red-500/30">
                    ❌ Vote Against
                  </button>
                </div>
              )}
              {userVotes[p.id] !== undefined && (
                <div className={`py-2 rounded-lg text-center text-sm font-bold ${userVotes[p.id] ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  ✓ You voted {userVotes[p.id] ? 'FOR' : 'AGAINST'} with {userStats.governancePower} vHYPHA
                </div>
              )}
              {p.implementation && p.status === 'Executed' && (
                <div className="mt-2 p-2 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <p className="text-purple-400 text-xs">⚡ Executed: {p.implementation}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Staking Vault */}
      {activeTab === 'staking' && (
        <div className="space-y-4">
          {/* APY Info */}
          <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/20 rounded-xl p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-green-400 text-3xl font-black">{projectedAPY}%</p>
                <p className="text-gray-400 text-xs">Current APY</p>
              </div>
              <div>
                <p className="text-white text-xl font-bold">{userStats.stakedAmount.toLocaleString()}</p>
                <p className="text-gray-400 text-xs">Staked HYPHA</p>
              </div>
              <div>
                <p className="text-cyan-400 text-xl font-bold">{dailyYield.toFixed(2)}</p>
                <p className="text-gray-400 text-xs">Daily Yield</p>
              </div>
              <div>
                <p className="text-purple-400 text-xl font-bold">{annualYield.toFixed(0)}</p>
                <p className="text-gray-400 text-xs">Annual Yield</p>
              </div>
            </div>
          </div>

          {/* Stake */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-900 border border-green-500/20 rounded-xl p-4">
              <h3 className="text-green-400 font-bold mb-3">🔒 Stake HYPHA</h3>
              <div className="bg-gray-800 rounded-lg p-3 mb-3">
                <p className="text-gray-400 text-xs mb-1">Available Balance</p>
                <p className="text-white text-xl font-bold">{userStats.hyphaBalance.toLocaleString()} HYPHA</p>
              </div>
              <input
                type="number"
                value={stakeAmount}
                onChange={e => setStakeAmount(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg p-3 mb-3 focus:border-green-500 outline-none"
                placeholder="Amount to stake"
              />
              <div className="flex gap-2 mb-3">
                {[100, 500, 1000, 'MAX'].map(a => (
                  <button key={a} onClick={() => setStakeAmount(a === 'MAX' ? userStats.hyphaBalance.toString() : a.toString())}
                    className="flex-1 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded-lg">
                    {a}
                  </button>
                ))}
              </div>
              <button
                onClick={() => onStake(parseInt(stakeAmount) || 100)}
                disabled={!userStats.isWalletConnected || parseInt(stakeAmount) > userStats.hyphaBalance}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-bold rounded-xl transition-all disabled:opacity-40">
                🔒 Stake {stakeAmount} HYPHA
              </button>
              {parseInt(stakeAmount) > 0 && (
                <p className="text-green-400 text-xs mt-2 text-center">
                  ≈ +{(parseInt(stakeAmount) * projectedAPY / 100 / 365).toFixed(4)} HYPHA/day
                </p>
              )}
            </div>

            <div className="bg-gray-900 border border-orange-500/20 rounded-xl p-4">
              <h3 className="text-orange-400 font-bold mb-3">🔓 Unstake HYPHA</h3>
              <div className="bg-gray-800 rounded-lg p-3 mb-3">
                <p className="text-gray-400 text-xs mb-1">Currently Staked</p>
                <p className="text-white text-xl font-bold">{userStats.stakedAmount.toLocaleString()} HYPHA</p>
              </div>
              <input
                type="number"
                value={unstakeAmount}
                onChange={e => setUnstakeAmount(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg p-3 mb-3 focus:border-orange-500 outline-none"
                placeholder="Amount to unstake"
              />
              <div className="flex gap-2 mb-3">
                {[100, 500, 1000, 'MAX'].map(a => (
                  <button key={a} onClick={() => setUnstakeAmount(a === 'MAX' ? userStats.stakedAmount.toString() : a.toString())}
                    className="flex-1 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded-lg">
                    {a}
                  </button>
                ))}
              </div>
              <button
                onClick={() => onUnstake(parseInt(unstakeAmount) || 100)}
                disabled={parseInt(unstakeAmount) > userStats.stakedAmount}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-bold rounded-xl transition-all disabled:opacity-40">
                🔓 Unstake {unstakeAmount} HYPHA
              </button>
              <p className="text-orange-400 text-xs mt-2 text-center">⚠️ 7-day unstaking cooldown applies</p>
            </div>
          </div>

          {/* Yield Projection */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
            <h3 className="text-white font-bold mb-3">📊 Yield Projection</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-gray-800 rounded-xl p-3">
                <p className="text-gray-400 text-xs">Daily</p>
                <p className="text-green-400 text-lg font-bold">+{dailyYield.toFixed(4)}</p>
                <p className="text-gray-500 text-xs">HYPHA</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-3">
                <p className="text-gray-400 text-xs">Monthly</p>
                <p className="text-green-400 text-lg font-bold">+{monthlyYield.toFixed(2)}</p>
                <p className="text-gray-500 text-xs">HYPHA</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-3">
                <p className="text-gray-400 text-xs">Annual</p>
                <p className="text-green-400 text-lg font-bold">+{annualYield.toFixed(0)}</p>
                <p className="text-gray-500 text-xs">HYPHA</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Treasury */}
      {activeTab === 'treasury' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-500/20 rounded-xl p-4">
            <h3 className="text-yellow-400 font-bold mb-2">💰 DAO Treasury</h3>
            <p className="text-3xl font-black text-white">${(DAO_CONFIG.treasury.totalValueUSD / 1_000_000).toFixed(2)}M</p>
            <p className="text-gray-400 text-sm">Total Value Locked in Treasury</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-900 border border-green-500/20 rounded-xl p-4 text-center">
              <p className="text-2xl mb-1">🌿</p>
              <p className="text-green-400 text-lg font-bold">{(DAO_CONFIG.treasury.hyphaBalance / 1_000_000).toFixed(1)}M</p>
              <p className="text-gray-400 text-xs">HYPHA</p>
            </div>
            <div className="bg-gray-900 border border-indigo-500/20 rounded-xl p-4 text-center">
              <p className="text-2xl mb-1">⟠</p>
              <p className="text-indigo-400 text-lg font-bold">{DAO_CONFIG.treasury.ethBalance}</p>
              <p className="text-gray-400 text-xs">ETH</p>
            </div>
            <div className="bg-gray-900 border border-cyan-500/20 rounded-xl p-4 text-center">
              <p className="text-2xl mb-1">💵</p>
              <p className="text-cyan-400 text-lg font-bold">{(DAO_CONFIG.treasury.usdcBalance / 1_000).toFixed(0)}K</p>
              <p className="text-gray-400 text-xs">USDC</p>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
            <h3 className="text-white font-bold mb-3">Recent Treasury Transactions</h3>
            <div className="space-y-2">
              {[
                { type: '⬆️ Received', desc: 'Protocol fees Q4 2025', amount: '+420,000 HYPHA', time: '2 days ago', color: 'text-green-400' },
                { type: '⬇️ Grants', desc: 'Developer Grant Program v1', amount: '-1,000,000 HYPHA', time: '5 days ago', color: 'text-red-400' },
                { type: '⬆️ Staking', desc: 'Lido stETH rewards', amount: '+2.4 ETH', time: '7 days ago', color: 'text-green-400' },
                { type: '⬇️ Executed', desc: 'PROP-002 Arbitrum Bridge deployment', amount: '-50,000 USDC', time: '12 days ago', color: 'text-orange-400' }
              ].map((tx, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                  <div>
                    <p className="text-white text-sm">{tx.type} {tx.desc}</p>
                    <p className="text-gray-500 text-xs">{tx.time}</p>
                  </div>
                  <p className={`font-bold text-sm ${tx.color}`}>{tx.amount}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DAOGovernance;
