import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, LineChart, Line } from 'recharts';
import { PREMALTA_TOKEN, PREMALTA_DEFI, WHALE_ANALYTICS } from '../constants';

const PremaltaDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tokenomics' | 'liquidity' | 'whale' | 'roadmap'>('overview');
  const [stakeAmount, setStakeAmount] = useState('');
  const [selectedLock, setSelectedLock] = useState(0);

  const pt = PREMALTA_TOKEN;
  const pd = PREMALTA_DEFI;
  const wa = WHALE_ANALYTICS;

  // Simulate price growth trajectory
  const priceTrajectory = useMemo(() => [
    { phase: 'Now', price: 0, status: 'No Liquidity' },
    { phase: 'Week 1', price: 0.01, status: 'DEX Launch' },
    { phase: 'Month 1', price: 0.025, status: 'Staking Live' },
    { phase: 'Month 3', price: 0.08, status: '100 Holders' },
    { phase: 'Month 6', price: 0.30, status: 'HYPHA Bridge' },
    { phase: 'Month 12', price: 1.20, status: 'CEX Target' },
    { phase: 'Month 24', price: 5.00, status: 'Ecosystem' },
  ], []);

  const growthMultipliers = priceTrajectory.map(p => ({
    ...p,
    multiplier: p.price === 0 ? 0 : p.price / 0.01
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-cyan-500/30 rounded-lg p-3 text-xs">
          <p className="text-cyan-300 font-bold">{label}</p>
          {payload.map((p: any, i: number) => (
            <p key={i} style={{ color: p.color }}>{p.name}: {typeof p.value === 'number' ? p.value.toFixed(4) : p.value}</p>
          ))}
        </div>
      );
    }
    return null;
  };

  const stakingReward = selectedLock > 0 ? (
    (parseFloat(stakeAmount) || 0) * (pt.staking.lockPeriods[selectedLock].apy / 100) * (pt.staking.lockPeriods[selectedLock].duration / 365)
  ) : 0;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center text-2xl font-black text-white">P</div>
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              $PREMALTA Token 
              <span className="text-xs px-2 py-1 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-full">Base Network</span>
            </h1>
            <p className="text-gray-400 text-sm">Creator Economy Token • Paragraph.com • 0xC012...94c7</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={pt.basescanUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 bg-blue-500/10 border border-blue-500/30 rounded-lg px-3 py-2 text-xs text-blue-300 hover:bg-blue-500/20 transition-all">
            🔍 BaseScan
          </a>
          <a href={pt.platformUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 bg-purple-500/10 border border-purple-500/30 rounded-lg px-3 py-2 text-xs text-purple-300 hover:bg-purple-500/20 transition-all">
            ✍️ Paragraph.com
          </a>
          <a href="https://app.uniswap.org/#/add/v3" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 bg-pink-500/10 border border-pink-500/30 rounded-lg px-3 py-2 text-xs text-pink-300 hover:bg-pink-500/20 transition-all">
            💧 Add Liquidity
          </a>
        </div>
      </div>

      {/* Status Banner */}
      <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-500/30 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="text-amber-400 font-bold">Token Deployed — Liquidity Required</p>
            <p className="text-amber-300/70 text-sm">$PREMALTA sudah live di Base network. Langkah selanjutnya: Add $500 liquidity di Uniswap V3 untuk mulai trading!</p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3 text-center">
          <div className="bg-black/20 rounded-lg p-2">
            <p className="text-green-400 font-bold text-lg">✅</p>
            <p className="text-gray-400 text-xs">Deployed</p>
          </div>
          <div className="bg-black/20 rounded-lg p-2">
            <p className="text-amber-400 font-bold text-lg">⏳</p>
            <p className="text-gray-400 text-xs">Liquidity</p>
          </div>
          <div className="bg-black/20 rounded-lg p-2">
            <p className="text-gray-500 font-bold text-lg">🔒</p>
            <p className="text-gray-400 text-xs">Trading</p>
          </div>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Supply', value: '1 Billion', icon: '🪙', color: 'blue', sub: '1,000,000,000 PREMALTA' },
          { label: 'Network', value: 'Base L2', icon: '⛓️', color: 'cyan', sub: 'Coinbase L2 (Low fees)' },
          { label: 'Target Price', value: '$0.01', icon: '💰', color: 'green', sub: 'Post-DEX listing' },
          { label: 'Staking APY', value: '15-25%', icon: '📈', color: 'purple', sub: 'Lock 3-12 months' },
        ].map((stat, i) => (
          <div key={i} className={`bg-${stat.color}-500/10 border border-${stat.color}-500/20 rounded-xl p-4`}>
            <div className="text-2xl mb-1">{stat.icon}</div>
            <p className={`text-${stat.color}-400 text-lg font-black`}>{stat.value}</p>
            <p className="text-gray-500 text-xs">{stat.label}</p>
            <p className="text-gray-600 text-xs mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { id: 'overview', label: '📊 Overview' },
          { id: 'tokenomics', label: '🪙 Tokenomics' },
          { id: 'liquidity', label: '💧 Liquidity' },
          { id: 'whale', label: '🐳 Whale Guard' },
          { id: 'roadmap', label: '🗺️ Roadmap' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === t.id ? 'bg-cyan-500 text-black' : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Price Trajectory */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <span>🚀</span> PREMALTA Price Growth Trajectory
              <span className="text-xs text-green-400 ml-2">(2000-10000% potential)</span>
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={priceTrajectory}>
                <defs>
                  <linearGradient id="priceGradPremalta" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937"/>
                <XAxis dataKey="phase" tick={{ fill: '#6b7280', fontSize: 10 }}/>
                <YAxis tick={{ fill: '#6b7280', fontSize: 10 }}/>
                <Tooltip content={<CustomTooltip />}/>
                <Area type="monotone" dataKey="price" stroke="#06b6d4" fill="url(#priceGradPremalta)" strokeWidth={2} name="Price $"/>
              </AreaChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-4 gap-2 mt-3">
              {growthMultipliers.filter(g => g.multiplier > 0).map((g, i) => (
                <div key={i} className="bg-gray-800 rounded-lg p-2 text-center">
                  <p className="text-cyan-400 font-bold text-sm">{g.multiplier}x</p>
                  <p className="text-gray-500 text-xs">{g.phase}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Staking Calculator */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
            <h3 className="text-white font-bold mb-4">🔐 Staking Calculator</h3>
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Amount to Stake (PREMALTA)</label>
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={e => setStakeAmount(e.target.value)}
                  placeholder="Enter amount..."
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Lock Period</label>
                <div className="grid grid-cols-5 gap-2">
                  {pt.staking.lockPeriods.map((lp, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedLock(i)}
                      className={`p-2 rounded-lg text-center transition-all ${
                        selectedLock === i ? 'bg-cyan-500 text-black' : 'bg-gray-800 text-gray-400 hover:text-white'
                      }`}
                    >
                      <p className="font-bold text-sm">{lp.apy}%</p>
                      <p className="text-xs">{lp.label}</p>
                    </button>
                  ))}
                </div>
              </div>
              {stakingReward > 0 && (
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
                  <p className="text-gray-400 text-sm">Projected Reward</p>
                  <p className="text-cyan-400 text-3xl font-black">+{stakingReward.toFixed(2)} PREMALTA</p>
                  <p className="text-gray-500 text-xs mt-1">
                    At ${pt.liquidityStrategy.priceTarget6m}/token = ${(stakingReward * pt.liquidityStrategy.priceTarget6m).toFixed(2)} USD (6m target)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Token Info */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
            <h3 className="text-white font-bold mb-4">📋 Token Info</h3>
            <div className="space-y-3">
              {[
                { label: 'Contract Address', value: pt.contractAddress, copy: true },
                { label: 'Network', value: `${pt.network} (Chain ID: ${pt.chainId})`, copy: false },
                { label: 'Standard', value: 'ERC-20', copy: false },
                { label: 'Decimals', value: '18', copy: false },
                { label: 'Platform', value: pt.platform, copy: false },
                { label: 'BaseScan', value: 'View Contract →', link: pt.basescanUrl },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400 text-sm">{item.label}</span>
                  {item.link ? (
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-cyan-400 text-sm hover:underline">{item.value}</a>
                  ) : (
                    <span className="text-white text-sm font-mono truncate max-w-[200px]">{item.value}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tokenomics Tab */}
      {activeTab === 'tokenomics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
              <h3 className="text-white font-bold mb-4">Token Distribution</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={pt.distribution} dataKey="percentage" nameKey="category" cx="50%" cy="50%" outerRadius={100} innerRadius={50}>
                    {pt.distribution.map((entry, i) => (
                      <Cell key={i} fill={entry.color}/>
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: any) => [`${v}%`, 'Allocation']}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
              <h3 className="text-white font-bold mb-4">Allocation Breakdown</h3>
              <div className="space-y-3">
                {pt.distribution.map((d, i) => (
                  <div key={i} className="p-3 bg-gray-800 rounded-lg">
                    <div className="flex justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}/>
                        <span className="text-white text-xs">{d.category}</span>
                      </div>
                      <span className="text-white font-bold text-sm">{d.percentage}%</span>
                    </div>
                    <p className="text-gray-500 text-xs">{(d.amount / 1_000_000).toFixed(0)}M PREMALTA</p>
                    <div className="mt-1 h-1 bg-gray-700 rounded-full">
                      <div className="h-full rounded-full" style={{ width: `${d.percentage}%`, backgroundColor: d.color }}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dual Token Synergy */}
          <div className="bg-gradient-to-br from-cyan-900/20 to-purple-900/20 border border-cyan-500/20 rounded-xl p-4">
            <h3 className="text-cyan-400 font-bold mb-4">🔄 PREMALTA ↔ HYPHA Dual Token Synergy</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-black/20 rounded-lg p-3">
                <p className="text-cyan-400 font-bold mb-2">PREMALTA → HYPHA</p>
                <p className="text-gray-300 text-sm">Convert PREMALTA earnings to HYPHA. Bonus: +5% if staked immediately.</p>
                <p className="text-cyan-300 text-xs mt-2">Fee: 0.3% (burned)</p>
              </div>
              <div className="bg-black/20 rounded-lg p-3">
                <p className="text-purple-400 font-bold mb-2">Cross-Staking</p>
                <p className="text-gray-300 text-sm">Hold both tokens for bonus +3% APY on both. "Ecosystem Loyalty" NFT badge.</p>
                <p className="text-purple-300 text-xs mt-2">Bonus: +3% APY</p>
              </div>
              <div className="bg-black/20 rounded-lg p-3">
                <p className="text-green-400 font-bold mb-2">HYPHA → PREMALTA</p>
                <p className="text-gray-300 text-sm">Pay with HYPHA to access PREMALTA content & exclusive features.</p>
                <p className="text-green-300 text-xs mt-2">Discount: 5-20%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Liquidity Tab */}
      {activeTab === 'liquidity' && (
        <div className="space-y-4">
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <h3 className="text-yellow-400 font-bold">⚠️ Kenapa Likuiditas Sangat Penting</h3>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="bg-black/20 rounded-lg p-3">
                <p className="text-red-400 font-bold">❌ Tanpa Likuiditas</p>
                <p className="text-gray-400 text-xs mt-1">Token hanya angka di wallet. Tidak bisa dijual-beli. Harga = $0 efektif.</p>
              </div>
              <div className="bg-black/20 rounded-lg p-3">
                <p className="text-amber-400 font-bold">⚡ Likuiditas $100-500</p>
                <p className="text-gray-400 text-xs mt-1">Pool aktif, bisa trading, tapi rentan pump & dump dari satu transaksi.</p>
              </div>
              <div className="bg-black/20 rounded-lg p-3">
                <p className="text-green-400 font-bold">✅ Likuiditas $5000+</p>
                <p className="text-gray-400 text-xs mt-1">Market stabil, menarik whale, susah dimanipulasi, credible project.</p>
              </div>
            </div>
          </div>

          {pd.pools.map((pool, i) => (
            <div key={i} className={`bg-gray-900 border rounded-xl p-4 ${
              pool.status === 'pending' ? 'border-amber-500/30' : 
              pool.status === 'planned' ? 'border-gray-600' : 'border-green-500/30'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-white font-bold">{pool.name}</h3>
                  <p className="text-gray-400 text-xs">{pool.dex} • {pool.chain} • Fee: {pool.fee}%</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full ${
                  pool.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                  pool.status === 'planned' ? 'bg-gray-700 text-gray-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {pool.status === 'pending' ? '⏳ Next Step' : pool.status === 'planned' ? '📅 Planned' : '✅ Live'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-gray-500 text-xs">Current TVL</p>
                  <p className="text-white font-bold">${pool.tvl.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Target TVL</p>
                  <p className="text-cyan-400 font-bold">${pool.targetTvl.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Progress</p>
                  <p className="text-gray-400 font-bold">{pool.tvl > 0 ? Math.round((pool.tvl/pool.targetTvl)*100) : 0}%</p>
                </div>
              </div>
              <div className="mt-2 h-2 bg-gray-700 rounded-full">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" 
                  style={{ width: `${pool.tvl > 0 ? Math.min((pool.tvl/pool.targetTvl)*100, 100) : 2}%` }}/>
              </div>
              {pool.status === 'pending' && (
                <a href="https://app.uniswap.org/#/add/v3" target="_blank" rel="noopener noreferrer"
                  className="mt-3 block w-full text-center bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-lg px-4 py-2 text-sm hover:bg-cyan-500/30 transition-all">
                  → Add Liquidity on Uniswap V3 (Base)
                </a>
              )}
            </div>
          ))}

          {/* Step by Step Guide */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
            <h3 className="text-white font-bold mb-4">📚 Cara Add Liquidity (Step by Step)</h3>
            <div className="space-y-3">
              {[
                { step: 1, title: 'Siapkan Wallet', desc: 'MetaMask/Coinbase Wallet → Switch ke Base Network', status: 'done' },
                { step: 2, title: 'Fund Wallet', desc: 'Min $50 USDC + $5 ETH untuk gas fee di Base', status: 'next' },
                { step: 3, title: 'Buka Uniswap V3', desc: 'app.uniswap.org → Connect wallet → Pool → New Position', status: 'next' },
                { step: 4, title: 'Add PREMALTA/USDC', desc: 'Token 0: PREMALTA (0xC012...) | Token 1: USDC | Fee: 0.3%', status: 'next' },
                { step: 5, title: 'Set Price Range', desc: 'Initial price: $0.01/PREMALTA. Set range $0.001 - $1.00', status: 'next' },
                { step: 6, title: 'Lock LP Tokens', desc: 'Uncx.network → Lock LP → 6 months minimum → Anti rug-pull', status: 'next' },
              ].map((s, i) => (
                <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${s.status === 'done' ? 'bg-green-900/20' : 'bg-gray-800'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    s.status === 'done' ? 'bg-green-500 text-black' : 'bg-gray-700 text-gray-400'
                  }`}>{s.status === 'done' ? '✓' : s.step}</div>
                  <div>
                    <p className={`font-semibold text-sm ${s.status === 'done' ? 'text-green-400' : 'text-white'}`}>{s.title}</p>
                    <p className="text-gray-400 text-xs">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Whale Guard Tab */}
      {activeTab === 'whale' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-500/20 rounded-xl p-4">
            <h3 className="text-blue-400 font-bold mb-2">🐳 Whale Checkmate System</h3>
            <p className="text-gray-400 text-sm">Sistem perlindungan untuk mencegah manipulasi harga oleh whale holders.</p>
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="bg-black/30 rounded-lg p-3 text-center">
                <p className="text-green-400 text-2xl font-black">{wa.marketHealthScore}</p>
                <p className="text-gray-500 text-xs">Market Health</p>
              </div>
              <div className="bg-black/30 rounded-lg p-3 text-center">
                <p className="text-cyan-400 text-2xl font-black">{wa.stakingRatio}%</p>
                <p className="text-gray-500 text-xs">Staking Ratio</p>
              </div>
              <div className="bg-black/30 rounded-lg p-3 text-center">
                <p className="text-purple-400 text-2xl font-black">{wa.averageHoldTime}d</p>
                <p className="text-gray-500 text-xs">Avg Hold Time</p>
              </div>
            </div>
          </div>

          {/* Whale Tiers */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
            <h3 className="text-white font-bold mb-4">🏆 Holder Tiers</h3>
            <div className="space-y-2">
              {wa.whaleThresholds.map((tier, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-gray-800 rounded-lg">
                  <span className="text-white text-sm">{tier.tier}</span>
                  <span className="text-gray-400 text-xs">
                    {tier.max === Infinity ? `>${(tier.min/1_000_000).toFixed(0)}M` : `${(tier.min/1000).toFixed(0)}K - ${(tier.max/1_000_000).toFixed(0)}M`}
                  </span>
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: tier.color }}/>
                </div>
              ))}
            </div>
          </div>

          {/* Top Holders */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
            <h3 className="text-white font-bold mb-4">📊 Top Holders (HYPHA)</h3>
            <div className="space-y-3">
              {wa.topHolders.map((h, i) => (
                <div key={i} className="p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{h.tier}</span>
                      <span className="text-gray-400 text-xs font-mono">{h.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        h.trustScore >= 90 ? 'bg-green-500/20 text-green-400' :
                        h.trustScore >= 70 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        Trust: {h.trustScore}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div>
                      <p className="text-gray-500">Balance</p>
                      <p className="text-white font-bold">{(h.balance/1_000_000).toFixed(1)}M</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Supply</p>
                      <p className="text-cyan-400 font-bold">{h.percentage}%</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Staked</p>
                      <p className="text-purple-400 font-bold">{(h.staked/1_000_000).toFixed(1)}M</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Activity</p>
                      <p className="text-green-400">{h.lastActivity}</p>
                    </div>
                  </div>
                  <div className="mt-2 h-1 bg-gray-700 rounded-full">
                    <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" style={{ width: `${(h.staked/h.balance)*100}%`}}/>
                  </div>
                  <p className="text-gray-600 text-xs mt-1">{Math.round((h.staked/h.balance)*100)}% staked</p>
                </div>
              ))}
            </div>
          </div>

          {/* Protection Mechanisms */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
            <h3 className="text-white font-bold mb-4">🛡️ Protection Mechanisms</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Staking Lockup', desc: '100K+ = 90 day minimum lock', icon: '🔐', active: true },
                { name: 'Vesting Release', desc: 'Max 10% release per month', icon: '📅', active: true },
                { name: 'LP Lock', desc: '50% LP locked 6 months', icon: '🔒', active: false },
                { name: 'Anti-Whale Tax', desc: '5% tax on >0.5% supply dump', icon: '🦈', active: false },
                { name: 'Arisan System', desc: 'Monthly community rewards', icon: '🤝', active: false },
                { name: 'DAO Override', desc: 'Emergency pause by DAO', icon: '🏛️', active: false },
              ].map((m, i) => (
                <div key={i} className={`p-3 rounded-lg border ${m.active ? 'bg-green-900/20 border-green-500/30' : 'bg-gray-800 border-gray-700'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span>{m.icon}</span>
                    <span className={`text-sm font-semibold ${m.active ? 'text-green-400' : 'text-gray-400'}`}>{m.name}</span>
                    <span className={`text-xs ml-auto ${m.active ? 'text-green-500' : 'text-gray-600'}`}>{m.active ? '✅' : '⏳'}</span>
                  </div>
                  <p className="text-gray-500 text-xs">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Roadmap Tab */}
      {activeTab === 'roadmap' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/20 rounded-xl p-4 mb-2">
            <h3 className="text-cyan-400 font-bold">🗺️ PREMALTA Listing Roadmap</h3>
            <p className="text-gray-400 text-sm mt-1">Path from deployed → listed → thriving ecosystem</p>
          </div>
          {pd.roadmap.map((r, i) => (
            <div key={i} className={`flex items-start gap-4 p-4 rounded-xl border ${
              r.status === 'next' ? 'bg-cyan-900/20 border-cyan-500/30' : 'bg-gray-900 border-gray-700'
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 ${
                r.status === 'next' ? 'bg-cyan-500 text-black' : 'bg-gray-700 text-gray-400'
              }`}>{r.phase}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className={`font-bold ${r.status === 'next' ? 'text-cyan-400' : 'text-white'}`}>{r.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    r.status === 'next' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-700 text-gray-500'
                  }`}>{r.week}</span>
                </div>
                <p className="text-gray-400 text-sm mt-1">{r.action}</p>
              </div>
            </div>
          ))}

          {/* Target Metrics */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
            <h3 className="text-white font-bold mb-4">🎯 Growth Targets</h3>
            <div className="space-y-3">
              {[
                { label: 'Initial Price Target', value: '$0.01', timeframe: 'Week 1', change: 'New baseline' },
                { label: '6-Month Price Target', value: '$0.10', timeframe: 'Month 6', change: '10x from start' },
                { label: '12-Month Price Target', value: '$1.00', timeframe: 'Month 12', change: '100x (10,000%)' },
                { label: 'Target Holders', value: '1,000+', timeframe: 'Month 3', change: 'Community milestone' },
                { label: 'Target TVL', value: '$50,000', timeframe: 'Month 6', change: 'Ecosystem funding' },
                { label: 'CEX Listing Target', value: 'Gate.io / MEXC', timeframe: '2027', change: 'With audit' },
              ].map((t, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div>
                    <p className="text-white text-sm font-semibold">{t.label}</p>
                    <p className="text-gray-500 text-xs">{t.timeframe}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-cyan-400 font-bold">{t.value}</p>
                    <p className="text-green-400 text-xs">{t.change}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PremaltaDashboard;
