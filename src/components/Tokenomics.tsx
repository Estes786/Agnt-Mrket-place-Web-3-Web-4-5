import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { HYPHA_TOKENOMICS, PHILOSOPHY } from '../constants';

interface TokenomicsProps {
  hyphaBalance?: number;
  stakedAmount?: number;
  governancePower?: number;
}

const Tokenomics: React.FC<TokenomicsProps> = ({ hyphaBalance = 2500, stakedAmount = 0, governancePower = 0 }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'distribution' | 'vesting' | 'emissions' | 'utility'>('overview');
  const [selectedSlice, setSelectedSlice] = useState<number | null>(null);

  const t = HYPHA_TOKENOMICS;

  const priceHistory = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      day: `D-${30 - i}`,
      price: 0.12 + Math.random() * 0.12 + (i / 30) * 0.08,
      volume: Math.floor(Math.random() * 5_000_000 + 2_000_000)
    }));
  }, []);

  const stakingData = useMemo(() => [
    { month: 'Sep', staked: 45_000_000, rewards: 830_000 },
    { month: 'Oct', staked: 82_000_000, rewards: 1_517_000 },
    { month: 'Nov', staked: 156_000_000, rewards: 2_886_000 },
    { month: 'Dec', staked: 210_000_000, rewards: 3_885_000 },
    { month: 'Jan', staked: 289_000_000, rewards: 5_347_000 },
    { month: 'Feb', staked: 342_000_000, rewards: 6_327_000 }
  ], []);

  const utilityMetrics = [
    { name: 'Governance Voting', value: 35, desc: 'vHYPHA for DAO proposals', icon: '🏛️' },
    { name: 'Agent Deployment', value: 28, desc: 'Stake to deploy Agent Pods', icon: '🤖' },
    { name: 'Protocol Revenue', value: 20, desc: 'Fee distribution to stakers', icon: '💰' },
    { name: 'Liquidity Mining', value: 12, desc: 'LP rewards in HYPHA', icon: '🌊' },
    { name: 'Burn Mechanism', value: 5, desc: '0.5% of txn burned quarterly', icon: '🔥' }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-purple-500/30 rounded-lg p-3 text-xs">
          <p className="text-purple-300 font-bold">{label}</p>
          {payload.map((p: any, i: number) => (
            <p key={i} style={{ color: p.color }}>{p.name}: {typeof p.value === 'number' && p.value > 1000 ? (p.value / 1_000_000).toFixed(2) + 'M' : p.value?.toFixed ? p.value.toFixed(4) : p.value}</p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center text-xl">🌿</div>
            <div>
              <h1 className="text-2xl font-black text-white">HYPHA Tokenomics</h1>
              <p className="text-gray-400 text-sm">{PHILOSOPHY.vision}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-2 text-center">
            <p className="text-green-400 text-xl font-black">${t.price.toFixed(3)}</p>
            <p className="text-gray-400 text-xs">Price</p>
          </div>
          <div className={`border rounded-xl px-4 py-2 text-center ${t.priceChange24h >= 0 ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
            <p className={`text-xl font-black ${t.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {t.priceChange24h >= 0 ? '+' : ''}{t.priceChange24h.toFixed(2)}%
            </p>
            <p className="text-gray-400 text-xs">24h Change</p>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl px-4 py-2 text-center">
            <p className="text-purple-400 text-xl font-black">${(t.marketCap / 1_000_000).toFixed(1)}M</p>
            <p className="text-gray-400 text-xs">Market Cap</p>
          </div>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Supply', value: (t.totalSupply / 1_000_000_000).toFixed(1) + 'B', icon: '🪙', color: 'indigo' },
          { label: 'Circulating', value: (t.circulatingSupply / 1_000_000).toFixed(0) + 'M', icon: '🔄', color: 'cyan' },
          { label: 'Staking APY', value: t.stakingAPY + '%', icon: '📈', color: 'green' },
          { label: 'Holders', value: t.holders.toLocaleString(), icon: '👥', color: 'purple' }
        ].map((stat, i) => (
          <div key={i} className={`bg-${stat.color}-500/10 border border-${stat.color}-500/20 rounded-xl p-4`}>
            <div className="text-2xl mb-1">{stat.icon}</div>
            <p className={`text-${stat.color}-400 text-lg font-black`}>{stat.value}</p>
            <p className="text-gray-500 text-xs">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {(['overview', 'distribution', 'vesting', 'emissions', 'utility'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${activeTab === tab ? 'bg-green-500 text-black' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Price Chart */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <span>📊</span> HYPHA/USD Price (30D)
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={priceHistory}>
                <defs>
                  <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937"/>
                <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 10 }}/>
                <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} domain={['auto', 'auto']}/>
                <Tooltip content={<CustomTooltip />}/>
                <Area type="monotone" dataKey="price" stroke="#10b981" fill="url(#priceGrad)" strokeWidth={2} name="Price $"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Staking Metrics */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <span>🔒</span> Staking Growth & Rewards
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stakingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937"/>
                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 10 }}/>
                <YAxis tick={{ fill: '#6b7280', fontSize: 10 }}/>
                <Tooltip content={<CustomTooltip />}/>
                <Bar dataKey="staked" fill="#6366f1" name="Staked HYPHA" radius={[4,4,0,0]}/>
                <Bar dataKey="rewards" fill="#10b981" name="Rewards Paid" radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Personal Position */}
          {(hyphaBalance > 0 || stakedAmount > 0) && (
            <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/20 rounded-xl p-4">
              <h3 className="text-green-400 font-bold mb-4">💼 Your HYPHA Position</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-400 text-xs">Wallet Balance</p>
                  <p className="text-white text-lg font-bold">{hyphaBalance.toLocaleString()}</p>
                  <p className="text-green-400 text-xs">≈ ${(hyphaBalance * t.price).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Staked</p>
                  <p className="text-purple-400 text-lg font-bold">{stakedAmount.toLocaleString()}</p>
                  <p className="text-purple-300 text-xs">APY: {t.stakingAPY}%</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">vHYPHA Power</p>
                  <p className="text-cyan-400 text-lg font-bold">{governancePower.toLocaleString()}</p>
                  <p className="text-cyan-300 text-xs">Governance Weight</p>
                </div>
              </div>
              <div className="mt-3 p-3 bg-black/20 rounded-lg">
                <p className="text-gray-400 text-xs">Projected Annual Yield</p>
                <p className="text-green-400 text-xl font-black">+{(stakedAmount * t.stakingAPY / 100).toFixed(2)} HYPHA</p>
                <p className="text-gray-500 text-xs">≈ ${(stakedAmount * t.stakingAPY / 100 * t.price).toFixed(2)} USD/year</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Distribution Tab */}
      {activeTab === 'distribution' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
              <h3 className="text-white font-bold mb-4">Token Allocation</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={t.distribution}
                    dataKey="percentage"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={50}
                    onMouseEnter={(_, i) => setSelectedSlice(i)}
                    onMouseLeave={() => setSelectedSlice(null)}
                  >
                    {t.distribution.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={entry.color}
                        opacity={selectedSlice === null || selectedSlice === i ? 1 : 0.4}
                        stroke={selectedSlice === i ? '#fff' : 'none'}
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: any) => [`${v}%`, 'Allocation']}/>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Distribution List */}
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
              <h3 className="text-white font-bold mb-4">Allocation Breakdown</h3>
              <div className="space-y-3">
                {t.distribution.map((d, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${selectedSlice === i ? 'bg-gray-700' : 'hover:bg-gray-800'}`}
                    onMouseEnter={() => setSelectedSlice(i)}
                    onMouseLeave={() => setSelectedSlice(null)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}/>
                        <span className="text-white text-sm font-medium">{d.category}</span>
                      </div>
                      <span className="text-white font-bold">{d.percentage}%</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>{(d.amount / 1_000_000).toFixed(0)}M HYPHA</span>
                      <span>Vesting: {d.vestingMonths}mo | Cliff: {d.cliffMonths}mo</span>
                    </div>
                    <div className="mt-1 h-1 bg-gray-700 rounded-full">
                      <div className="h-full rounded-full" style={{ width: `${d.percentage}%`, backgroundColor: d.color }}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vesting Tab */}
      {activeTab === 'vesting' && (
        <div className="space-y-4">
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-4">
            <p className="text-yellow-400 text-sm font-semibold">⚠️ Vesting Schedule — All locked tokens are subject to cliff periods. Unlocks happen linearly after cliff.</p>
          </div>
          {t.vestingSchedule.map((v, i) => (
            <div key={i} className="bg-gray-900 border border-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-bold">{v.category}</h3>
                <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full">
                  Next: {v.nextUnlock}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div>
                  <p className="text-gray-400 text-xs">Total</p>
                  <p className="text-white font-bold">{(v.totalTokens / 1_000_000).toFixed(0)}M</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Released</p>
                  <p className="text-green-400 font-bold">{(v.released / 1_000_000).toFixed(1)}M</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Locked</p>
                  <p className="text-orange-400 font-bold">{(v.locked / 1_000_000).toFixed(0)}M</p>
                </div>
              </div>
              <div className="h-2 bg-gray-700 rounded-full">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all"
                  style={{ width: `${(v.released / v.totalTokens) * 100}%` }}
                />
              </div>
              <p className="text-gray-500 text-xs mt-1">{((v.released / v.totalTokens) * 100).toFixed(1)}% released</p>
              <p className="text-cyan-400 text-xs mt-1">Next unlock: {(v.unlockAmount / 1_000_000).toFixed(2)}M HYPHA on {v.nextUnlock}</p>
            </div>
          ))}
        </div>
      )}

      {/* Emissions Tab */}
      {activeTab === 'emissions' && (
        <div className="space-y-6">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
            <h3 className="text-white font-bold mb-4">📉 Emission & Inflation Schedule</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={t.emissions}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937"/>
                <XAxis dataKey="year" tick={{ fill: '#6b7280', fontSize: 10 }}/>
                <YAxis tick={{ fill: '#6b7280', fontSize: 10 }}/>
                <Tooltip content={<CustomTooltip />}/>
                <Legend/>
                <Line type="monotone" dataKey="emissionRate" stroke="#f59e0b" strokeWidth={2} name="Emission Rate %"/>
                <Line type="monotone" dataKey="inflationRate" stroke="#ef4444" strokeWidth={2} name="Inflation Rate %"/>
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {t.emissions.map((e, i) => (
              <div key={i} className="bg-gray-900 border border-gray-700 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-white font-bold">Epoch {e.epoch} — {e.year}</p>
                  <p className="text-gray-400 text-sm">Total Emitted: {(e.totalEmitted / 1_000_000).toFixed(0)}M HYPHA</p>
                </div>
                <div className="text-right">
                  <p className="text-orange-400 font-bold">{e.emissionRate}% Emission</p>
                  <p className="text-red-400 text-sm">{e.inflationRate}% Inflation</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Utility Tab */}
      {activeTab === 'utility' && (
        <div className="space-y-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 mb-4">
            <h3 className="text-white font-bold mb-4">🔧 HYPHA Token Utility Map</h3>
            <div className="space-y-4">
              {utilityMetrics.map((u, i) => (
                <div key={i} className="p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{u.icon}</span>
                      <span className="text-white font-medium">{u.name}</span>
                    </div>
                    <span className="text-purple-400 font-bold">{u.value}%</span>
                  </div>
                  <p className="text-gray-400 text-xs mb-2">{u.desc}</p>
                  <div className="h-1.5 bg-gray-700 rounded-full">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: `${u.value}%` }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tokenomics Philosophy */}
          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/20 rounded-xl p-4">
            <h3 className="text-purple-400 font-bold mb-3">🎯 Token Design Philosophy</h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-300">• <span className="text-green-400 font-semibold">Deflationary Pressure:</span> 0.5% of all protocol fees burned quarterly</p>
              <p className="text-gray-300">• <span className="text-blue-400 font-semibold">Utility-First:</span> Required for all agent deployments and governance</p>
              <p className="text-gray-300">• <span className="text-purple-400 font-semibold">vHYPHA:</span> Vote-escrowed token for quadratic governance power</p>
              <p className="text-gray-300">• <span className="text-orange-400 font-semibold">Epoch Rewards:</span> Stakers earn protocol revenue share every 14 days</p>
              <p className="text-gray-300">• <span className="text-cyan-400 font-semibold">Cross-Chain:</span> HYPHA bridges to Arbitrum, Base, Polygon via LayerZero</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tokenomics;
