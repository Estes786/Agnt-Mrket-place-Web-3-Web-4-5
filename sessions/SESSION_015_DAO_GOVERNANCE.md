# 📋 SESSION #015 — DAO GOVERNANCE (SNAPSHOT.ORG)
## GANI HYPHA — Gasless Off-Chain Voting
### Status: ⏳ PENDING

---

## 🎯 TUJUAN

Setup Snapshot.org untuk DAO governance yang real tapi GASLESS (off-chain, free!).

---

## KENAPA SNAPSHOT.ORG?

```
✅ GASLESS — user tidak perlu bayar gas untuk vote
✅ Off-chain — tidak butuh smart contract (hemat biaya)
✅ Trustless — signatures via MetaMask (tetap crypto-native)
✅ Free — tidak ada biaya untuk project owner
✅ Widely used — Uniswap, Compound, Aave pakai ini
✅ Built-in UI — snapshot.org punya UI bagus
```

---

## TODO LIST

### STEP 1: Setup Snapshot Space

1. Buka: https://snapshot.org
2. Connect wallet MetaMask (pakai wallet yang deploy $PREMALTA)
3. Create new space: "gani-hypha" atau "hypha-dao"
4. Configure:
   - Name: GANI HYPHA DAO
   - About: Web3→Web4→Web5 AI Agent Marketplace Governance
   - Avatar: Upload logo
   - Network: Base (8453)
   - Voting token: $PREMALTA (0xC0125651a46BDEea72a73A1C1A75b82e0E2C94c7)
   - Admins: [your wallet address]

### STEP 2: Create First Proposal

```
Title: "GHP-001: Add Initial Liquidity to $PREMALTA"
Body: 
Proposal ini untuk menambahkan initial liquidity ke pool 
$PREMALTA/USDC di Uniswap V3 Base dengan:
- Amount: $300 USDC + 300,000 PREMALTA  
- Initial Price: $0.001 per PREMALTA
- LP Lock: 6 bulan via Unicrypt

Voting Period: 7 hari
Quorum: 100,000 PREMALTA
```

### STEP 3: Integrate Snapshot API ke GANI HYPHA

```typescript
// Backend: GET /api/dao/snapshot/proposals
app.get('/api/dao/snapshot/proposals', async (c) => {
  const spaceId = 'gani-hypha.eth' // Replace with your space ID
  
  const query = `{
    proposals(
      first: 10,
      skip: 0,
      where: { space_in: ["${spaceId}"] }
      orderBy: "created"
      orderDirection: desc
    ) {
      id
      title
      body
      choices
      start
      end
      snapshot
      state
      author
      scores
      scores_total
      votes
    }
  }`
  
  const response = await fetch('https://hub.snapshot.org/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  })
  
  const data = await response.json() as any
  return c.json({ proposals: data.data?.proposals || [] })
})
```

### STEP 4: Update DAOGovernance.tsx

Replace mock proposals dengan real Snapshot data:
```typescript
useEffect(() => {
  fetch('/api/dao/snapshot/proposals')
    .then(r => r.json())
    .then(data => {
      if (data.proposals) {
        setProposals(data.proposals)
      }
    })
    .catch(e => console.warn('Snapshot fetch failed:', e))
}, [])
```

### STEP 5: Voting Button

Link ke Snapshot untuk voting:
```typescript
const handleVote = (proposalId: string) => {
  window.open(
    `https://snapshot.org/#/gani-hypha.eth/proposal/${proposalId}`,
    '_blank'
  )
}
```

---

## 📊 SUCCESS CRITERIA

```
✅ Snapshot space created (gani-hypha.eth or similar)
✅ First proposal GHP-001 created
✅ DAOGovernance.tsx shows real proposals from Snapshot API
✅ Vote button links ke Snapshot
✅ Proposal counts/votes show in real-time
```

---

*Session #015 | GANI HYPHA | Planned*
