import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, ScatterChart, Scatter, ZAxis } from 'recharts';
import { DEFI_PROTOCOLS, DAPPS, WEB3_PROVIDERS, CHAINS } from '../constants';
import { DeFiProtocol, DAppProject } from '../types';

interface DAppsHubProps {
  hyphaBalance?: number;
  ethBalance?: number;
  onSwap?: (from: string, to: string, amount: number) => void;
  onAddLiquidity?: (protocol: string, amount: number) => void;
}

const DAppsHub: React.FC<DAppsHubProps> = ({
  hyphaBalance = 2500,
  ethBalance = 0.42,
  onSwap,
  onAddLiquidity
}) => {
  const [activeView, setActiveView] = useState<'defi' | 'dapps' | 'swap' | 'providers' | 'graph'>('defi');
  const [selectedProtocol, setSelectedProtocol] = useState<DeFiProtocol | null>(null);
  const [swapFrom, setSwapFrom] = useState('ETH');
  const [swapTo, setSwapTo] = useState('HYPHA');
  const [swapAmount, setSwapAmount] = useState('0.1');
  const [dexRoute, setDexRoute] = useState('Uniswap V4');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterIntegration, setFilterIntegration] = useState<string>('All');
  const [graphQuery, setGraphQuery] = useState('');
  const [graphResult, setGraphResult] = useState<string | null>(null);

  const tvlData = useMemo(() => DEFI_PROTOCOLS.map(p => ({
    name: p.name.split(' ')[0],
    tvl: p.tvl / 1_000_000_000,
    apy: p.apy
  })), []);

  const tokens = ['ETH', 'HYPHA', 'USDC', 'USDT', 'WBTC', 'MATIC', 'ARB', 'OP'];

  const handleSimulateSwap = async () => {
    setIsSimulating(true);
    setSimulationResult(null);
    await new Promise(r => setTimeout(r, 1500));
    const price = swapFrom === 'HYPHA' ? 0.2 : swapFrom === 'ETH' ? 3200 : 1;
    const toPrice = swapTo === 'HYPHA' ? 0.2 : swapTo === 'ETH' ? 3200 : 1;
    const fromVal = parseFloat(swapAmount) * price;
    const toVal = fromVal / toPrice;
    const priceImpact = parseFloat(swapAmount) * price > 100000 ? 2.1 : 0.07;
    setSimulationResult({
      fromAmount: swapAmount,
      fromToken: swapFrom,
      toAmount: toVal.toFixed(6),
      toToken: swapTo,
      priceImpact,
      minReceived: (toVal * 0.995).toFixed(6),
      gasEstimate: '0.0042 ETH ($13.44)',
      route: [swapFrom, 'USDC', swapTo],
      dex: dexRoute,
      alchemySimulated: true
    });
    setIsSimulating(false);
  };

  const handleGraphQuery = async () => {
    setGraphResult('Loading from The Graph...');
    await new Promise(r => setTimeout(r, 1200));
    const sampleResult = {
      data: {
        pools: [
          { id: '0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8', token0: { symbol: 'USDC' }, token1: { symbol: 'ETH' }, volumeUSD: '4521890.23', feesUSD: '13565.67', txCount: '18420' },
          { id: '0x4e68Ccd3E89f51C3074ca5072bbAC773960dFa36', token0: { symbol: 'ETH' }, token1: { symbol: 'USDT' }, volumeUSD: '3210455.11', feesUSD: '9631.37', txCount: '12801' }
        ]
      }
    };
    setGraphResult(JSON.stringify(sampleResult, null, 2));
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-blue-500/30 rounded-lg p-3 text-xs">
          <p className="text-blue-300 font-bold">{label}</p>
          {payload.map((p: any, i: number) => (
            <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
          ))}
        </div>
      );
    }
    return null;
  };

  const dappCategories = ['All', 'DEX', 'NFT', 'Gaming', 'Infrastructure', 'DAO', 'Social'];
  const filteredDapps = DAPPS.filter(d =>
    (filterCategory === 'All' || d.category === filterCategory) &&
    (filterIntegration === 'All' || d.integrationLevel === filterIntegration)
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-xl flex items-center justify-center text-xl">🔗</div>
          <div>
            <h1 className="text-2xl font-black text-white">DApps & DeFi Hub</h1>
            <p className="text-gray-400 text-sm">Powered by Alchemy · Infura · Ankr · The Graph</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg px-3 py-1 text-xs text-blue-300">
            ETH: {ethBalance.toFixed(4)}
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-1 text-xs text-green-300">
            HYPHA: {hyphaBalance.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { id: 'defi', label: '💰 DeFi Protocols' },
          { id: 'dapps', label: '🌐 DApps Registry' },
          { id: 'swap', label: '🔄 Token Swap' },
          { id: 'providers', label: '⚡ RPC Providers' },
          { id: 'graph', label: '📊 The Graph' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveView(t.id as any)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${activeView === t.id ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* DeFi Protocols View */}
      {activeView === 'defi' && (
        <div className="space-y-6">
          {/* TVL Bar Chart */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
            <h3 className="text-white font-bold mb-3">Total Value Locked (TVL) by Protocol</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={tvlData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937"/>
                <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 10 }} tickFormatter={v => `$${v}B`}/>
                <YAxis dataKey="name" type="category" tick={{ fill: '#9ca3af', fontSize: 11 }} width={80}/>
                <Tooltip content={<CustomTooltip />} formatter={(v: any) => [`$${v}B`, 'TVL']}/>
                <Bar dataKey="tvl" fill="#3b82f6" radius={[0,4,4,0]} name="TVL $B"/>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Protocol Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DEFI_PROTOCOLS.map((p, i) => (
              <div
                key={i}
                onClick={() => setSelectedProtocol(selectedProtocol?.id === p.id ? null : p)}
                className={`bg-gray-900 border rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.02] ${selectedProtocol?.id === p.id ? 'border-blue-500' : 'border-gray-700 hover:border-blue-500/50'}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{p.logo}</span>
                    <div>
                      <p className="text-white font-bold text-sm">{p.name}</p>
                      <p className="text-gray-400 text-xs">{p.type} · {p.chain}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    p.risk === 'Low' ? 'bg-green-500/20 text-green-400' :
                    p.risk === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>{p.risk}</div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-blue-400 font-bold text-sm">${(p.tvl / 1_000_000_000).toFixed(1)}B</p>
                    <p className="text-gray-500 text-xs">TVL</p>
                  </div>
                  <div>
                    <p className="text-green-400 font-bold text-sm">{p.apy}%</p>
                    <p className="text-gray-500 text-xs">APY</p>
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${p.isIntegrated ? 'text-cyan-400' : 'text-gray-500'}`}>
                      {p.isIntegrated ? '✅ Live' : '⏳ Soon'}
                    </p>
                    <p className="text-gray-500 text-xs">Status</p>
                  </div>
                </div>
                {selectedProtocol?.id === p.id && p.contractAddress && (
                  <div className="mt-3 p-2 bg-gray-800 rounded-lg">
                    <p className="text-gray-400 text-xs">Contract</p>
                    <p className="text-cyan-400 text-xs font-mono break-all">{p.contractAddress}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DApps Registry */}
      {activeView === 'dapps' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <div>
              <p className="text-gray-500 text-xs mb-1">Category</p>
              <div className="flex gap-1 flex-wrap">
                {dappCategories.map(c => (
                  <button key={c} onClick={() => setFilterCategory(c)}
                    className={`px-3 py-1 text-xs rounded-full transition-all ${filterCategory === c ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">Integration</p>
              <div className="flex gap-1">
                {['All', 'Full', 'Partial', 'Planned'].map(c => (
                  <button key={c} onClick={() => setFilterIntegration(c)}
                    className={`px-3 py-1 text-xs rounded-full transition-all ${filterIntegration === c ? 'bg-cyan-500 text-black' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* DApps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDapps.map((d, i) => (
              <div key={i} className="bg-gray-900 border border-gray-700 rounded-xl p-4 hover:border-blue-500/50 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{d.logo}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-white font-bold">{d.name}</p>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          d.status === 'Live' ? 'bg-green-500/20 text-green-400' :
                          d.status === 'Beta' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>{d.status}</span>
                      </div>
                      <p className="text-gray-400 text-xs">{d.category}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 text-xs rounded-lg font-semibold ${
                    d.integrationLevel === 'Full' ? 'bg-green-500/20 text-green-400' :
                    d.integrationLevel === 'Partial' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>{d.integrationLevel}</div>
                </div>
                <p className="text-gray-400 text-xs mb-3">{d.description}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {d.chain.map(c => (
                    <span key={c} className="px-2 py-0.5 bg-gray-800 text-gray-300 text-xs rounded-full">{c}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>👥 {(d.users / 1000).toFixed(0)}K users</span>
                  {d.tvl && <span>💰 TVL: ${(d.tvl / 1_000_000_000).toFixed(1)}B</span>}
                  <span>⭐ {d.rating}/10</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Token Swap */}
      {activeView === 'swap' && (
        <div className="max-w-lg mx-auto space-y-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
            <h3 className="text-white font-bold text-lg mb-4">🔄 Swap Tokens</h3>

            {/* From */}
            <div className="bg-gray-800 rounded-xl p-4 mb-2">
              <p className="text-gray-400 text-xs mb-2">From</p>
              <div className="flex items-center gap-3">
                <select value={swapFrom} onChange={e => setSwapFrom(e.target.value)}
                  className="bg-gray-700 text-white rounded-lg px-3 py-2 text-sm font-bold border border-gray-600 focus:border-blue-500 outline-none">
                  {tokens.map(t => <option key={t}>{t}</option>)}
                </select>
                <input type="number" value={swapAmount} onChange={e => setSwapAmount(e.target.value)}
                  className="flex-1 bg-transparent text-white text-xl font-bold outline-none text-right"
                  placeholder="0.0"/>
              </div>
              <p className="text-gray-500 text-xs text-right mt-1">
                Balance: {swapFrom === 'ETH' ? ethBalance.toFixed(4) : swapFrom === 'HYPHA' ? hyphaBalance.toLocaleString() : '0.0'}
              </p>
            </div>

            {/* Swap Icon */}
            <div className="flex justify-center my-2">
              <button onClick={() => { const tmp = swapFrom; setSwapFrom(swapTo); setSwapTo(tmp); }}
                className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all">
                ⇅
              </button>
            </div>

            {/* To */}
            <div className="bg-gray-800 rounded-xl p-4 mb-4">
              <p className="text-gray-400 text-xs mb-2">To</p>
              <div className="flex items-center gap-3">
                <select value={swapTo} onChange={e => setSwapTo(e.target.value)}
                  className="bg-gray-700 text-white rounded-lg px-3 py-2 text-sm font-bold border border-gray-600 focus:border-blue-500 outline-none">
                  {tokens.map(t => <option key={t}>{t}</option>)}
                </select>
                <p className="flex-1 text-white text-xl font-bold text-right">
                  {simulationResult ? simulationResult.toAmount : '---'}
                </p>
              </div>
            </div>

            {/* DEX Selection */}
            <div className="mb-4">
              <p className="text-gray-400 text-xs mb-2">Route via</p>
              <div className="flex flex-wrap gap-2">
                {['Uniswap V4', 'Curve', 'Balancer', '1inch Aggregator'].map(dex => (
                  <button key={dex} onClick={() => setDexRoute(dex)}
                    className={`px-3 py-1.5 text-xs rounded-lg transition-all ${dexRoute === dex ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-400 hover:text-white'}`}>
                    {dex}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulation Result */}
            {simulationResult && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 mb-4 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Price Impact</span>
                  <span className={simulationResult.priceImpact > 1 ? 'text-red-400' : 'text-green-400'}>
                    {simulationResult.priceImpact}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Min Received</span>
                  <span className="text-white">{simulationResult.minReceived} {swapTo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Gas Estimate</span>
                  <span className="text-yellow-400">{simulationResult.gasEstimate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Route</span>
                  <span className="text-cyan-400">{simulationResult.route.join(' → ')}</span>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-green-400">Simulated via Alchemy SDK</span>
                </div>
              </div>
            )}

            <button
              onClick={handleSimulateSwap}
              disabled={isSimulating}
              className="w-full py-3 rounded-xl font-bold text-sm transition-all bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white disabled:opacity-50"
            >
              {isSimulating ? '⚡ Simulating via Alchemy...' : '🔄 Simulate Swap'}
            </button>
            <p className="text-gray-500 text-xs text-center mt-2">
              * Demo mode. Real execution requires connected wallet.
            </p>
          </div>
        </div>
      )}

      {/* RPC Providers */}
      {activeView === 'providers' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {WEB3_PROVIDERS.map((p, i) => (
              <div key={i} className={`bg-gray-900 border rounded-xl p-4 ${p.isActive ? 'border-green-500/30' : 'border-gray-700'}`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-bold text-lg">{p.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${p.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {p.isActive ? '● Active' : '○ Standby'}
                  </span>
                </div>
                <p className="text-gray-400 text-xs mb-2">{p.chain}</p>
                <div className="bg-gray-800 rounded-lg p-2 mb-3">
                  <p className="text-cyan-400 text-xs font-mono break-all">{p.rpcUrl.substring(0, 50)}...</p>
                </div>
                {p.latency && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs">Latency</span>
                    <span className={`text-sm font-bold ${p.latency < 50 ? 'text-green-400' : p.latency < 80 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {p.latency}ms
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Chain Overview */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
            <h3 className="text-white font-bold mb-4">🔗 Supported Chains</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.values(CHAINS).map((c, i) => (
                <div key={i} className="bg-gray-800 rounded-xl p-3 text-center">
                  <p className="text-2xl mb-1">{c.logo}</p>
                  <p className="text-white text-sm font-bold">{c.name.split(' ')[0]}</p>
                  <p className="text-gray-400 text-xs">Chain ID: {c.id}</p>
                  <p style={{ color: c.color }} className="text-xs">{c.symbol}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* The Graph */}
      {activeView === 'graph' && (
        <div className="space-y-4">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-400 text-xl">📊</span>
              <h3 className="text-blue-400 font-bold">The Graph Protocol</h3>
            </div>
            <p className="text-gray-400 text-sm">Query blockchain data from Uniswap, Aave, and more via GraphQL subgraphs. API Key: server_4bd29...</p>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
            <h3 className="text-white font-bold mb-3">GraphQL Query Builder</h3>
            <div className="mb-3">
              <p className="text-gray-400 text-xs mb-2">Select Protocol Subgraph</p>
              <div className="flex gap-2">
                {['Uniswap V3', 'Aave V3', 'Compound V3', 'Curve Finance'].map(sub => (
                  <button key={sub}
                    className="px-3 py-1.5 bg-gray-800 text-gray-400 text-xs rounded-lg hover:bg-gray-700 hover:text-white transition-all">
                    {sub}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={graphQuery || `{\n  pools(first: 5, orderBy: volumeUSD, orderDirection: desc) {\n    id\n    token0 { symbol }\n    token1 { symbol }\n    volumeUSD\n    feesUSD\n    txCount\n  }\n}`}
              onChange={e => setGraphQuery(e.target.value)}
              className="w-full bg-gray-800 text-green-400 text-xs font-mono p-3 rounded-xl border border-gray-600 focus:border-blue-500 outline-none h-36 resize-none"
            />
            <button onClick={handleGraphQuery}
              className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white text-sm font-bold rounded-lg transition-all">
              ▶ Execute Query
            </button>
          </div>

          {graphResult && (
            <div className="bg-gray-900 border border-green-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-green-400">✓</span>
                <h3 className="text-green-400 font-bold text-sm">Query Result</h3>
              </div>
              <pre className="text-green-300 text-xs font-mono overflow-x-auto bg-gray-800 p-3 rounded-lg">
                {graphResult}
              </pre>
            </div>
          )}

          <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
            <h3 className="text-white font-bold mb-3">Active Subgraphs</h3>
            <div className="space-y-2">
              {[
                { name: 'Uniswap V3', entities: '1.2M', queries: '892K/day', latency: '45ms', status: 'Synced' },
                { name: 'Aave V3', entities: '450K', queries: '312K/day', latency: '52ms', status: 'Synced' },
                { name: 'Compound V3', entities: '220K', queries: '145K/day', latency: '61ms', status: 'Synced' },
              ].map((sg, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                  <div>
                    <p className="text-white text-sm font-medium">{sg.name}</p>
                    <p className="text-gray-500 text-xs">{sg.entities} entities · {sg.queries}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 text-xs">{sg.status}</p>
                    <p className="text-gray-500 text-xs">{sg.latency}</p>
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

export default DAppsHub;
