# 📋 SESSION #014 — $PREMALTA PRICE FEED
## GANI HYPHA — Real Token Price dari Uniswap/CoinGecko
### Status: ⏳ PENDING | Prerequisite: Liquidity pool created

---

## 🎯 TUJUAN SESSION INI

Show real $PREMALTA price, ETH price, dan gas price di UI.

---

## ⚡ SETUP CEPAT

```bash
cd /home/user && git clone https://github.com/Estes786/Agnt-Mrket-place-Web-3-Web-4-5.git webapp
cd /home/user/webapp && npm install && npm run build && pm2 start ecosystem.config.cjs
```

---

## 📋 TODO LIST

### STEP 1: ETH/USD Price (CoinGecko — Free, No Key!)
```typescript
// Backend route: GET /api/prices/eth
app.get('/api/prices/eth', async (c) => {
  const response = await fetch(
    'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd,idr',
    { headers: { 'Accept': 'application/json' } }
  )
  const data = await response.json() as any
  
  return c.json({
    eth_usd: data.ethereum?.usd,
    eth_idr: data.ethereum?.idr,
    timestamp: new Date().toISOString()
  })
})
```

### STEP 2: Gas Price (via Alchemy)
```typescript
// Backend route: GET /api/prices/gas
app.get('/api/prices/gas', async (c) => {
  const alchemyKey = c.env.ALCHEMY_API_KEY
  
  const response = await fetch(
    `https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_gasPrice',
        params: [],
        id: 1
      })
    }
  )
  
  const data = await response.json() as any
  const gasPriceWei = parseInt(data.result, 16)
  const gasPriceGwei = gasPriceWei / 1e9
  
  return c.json({
    gas_gwei: gasPriceGwei.toFixed(2),
    gas_wei: gasPriceWei
  })
})
```

### STEP 3: $PREMALTA Price (HANYA SETELAH ada Uniswap pool!)

**Cara A: CoinGecko (jika token sudah terdaftar)**
```typescript
app.get('/api/prices/premalta', async (c) => {
  // Hanya works setelah token ada di CoinGecko
  const contractAddress = '0xC0125651a46BDEea72a73A1C1A75b82e0E2C94c7'
  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/token_price/base?contract_addresses=${contractAddress}&vs_currencies=usd`
  )
  const data = await response.json() as any
  const price = data[contractAddress.toLowerCase()]?.usd
  
  return c.json({
    premalta_usd: price || 0,
    contract: contractAddress,
    network: 'base'
  })
})
```

**Cara B: Uniswap V3 Subgraph via The Graph**
```typescript
app.get('/api/prices/premalta/uniswap', async (c) => {
  const theGraphKey = c.env.THE_GRAPH_API_KEY
  
  // Uniswap V3 Base subgraph
  const query = `{
    token(id: "0xc0125651a46bdDEa72a73a1c1a75b82e0e2c94c7") {
      derivedETH
      volumeUSD
      totalValueLockedUSD
    }
  }`
  
  const response = await fetch(
    `https://gateway.thegraph.com/api/${theGraphKey}/subgraphs/id/[UNISWAP_V3_BASE_SUBGRAPH_ID]`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    }
  )
  
  const data = await response.json() as any
  return c.json({ 
    success: true, 
    data: data.data?.token 
  })
})
```

### STEP 4: Update PremaltaDashboard.tsx

Replace mock data dengan real price API calls:
```typescript
// In PremaltaDashboard.tsx useEffect:
useEffect(() => {
  const fetchPrices = async () => {
    try {
      const [ethRes, gasRes, premaltaRes] = await Promise.all([
        fetch('/api/prices/eth'),
        fetch('/api/prices/gas'),
        fetch('/api/prices/premalta')
      ])
      
      const eth = await ethRes.json()
      const gas = await gasRes.json()
      const premalta = await premaltaRes.json()
      
      setPrices({
        eth: eth.eth_usd,
        ethIdr: eth.eth_idr,
        gas: gas.gas_gwei,
        premalta: premalta.premalta_usd || 0
      })
    } catch (e) {
      console.warn('Price fetch failed:', e)
    }
  }
  
  fetchPrices()
  const interval = setInterval(fetchPrices, 30000) // refresh every 30s
  return () => clearInterval(interval)
}, [])
```

### STEP 5: Header.tsx — Live Gas + ETH Price

Di Header component, show live data:
- ETH Price: $X,XXX
- Gas: XX gwei
- Block: #XXXXXXXX

---

## ⚠️ CATATAN

$PREMALTA price feed hanya bisa setelah:
1. Ada Uniswap V3 pool (butuh $300 USDC)
2. Pool approved dan aktif

Untuk sementara: tampilkan ETH + Gas price dulu (bisa hari ini!)

---

## 📊 SUCCESS CRITERIA

```
✅ /api/prices/eth returns real ETH/USD price
✅ /api/prices/gas returns real gas price (gwei)
✅ Header shows live ETH price
✅ PremaltaDashboard shows real data (atau clear "coming soon" jika no pool yet)
```

---

*Session #014 | GANI HYPHA | Planned*
