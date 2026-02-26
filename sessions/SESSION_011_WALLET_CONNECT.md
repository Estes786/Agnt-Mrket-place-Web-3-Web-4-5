# 📋 SESSION #011 — REAL WALLET CONNECT
## GANI HYPHA — ethers.js Integration (No More Fake Wallets!)
### Status: ⏳ PENDING | Prerequisite: SESSION_010 DONE

---

## 🎯 TUJUAN SESSION INI

Replace fake wallet generation dengan real MetaMask connection menggunakan ethers.js.

---

## ⚡ SETUP CEPAT

```bash
cd /home/user && git clone https://github.com/Estes786/Agnt-Mrket-place-Web-3-Web-4-5.git webapp
cd /home/user/webapp && npm install
# Copy .dev.vars dari sessions/CREDENTIALS.md
npm run build && pm2 start ecosystem.config.cjs
```

---

## 📋 TODO LIST SESSION #011

### STEP 1: Install ethers.js
```bash
cd /home/user/webapp
npm install ethers
```

### STEP 2: Update App.tsx — handleConnectWallet()

**TEMUKAN kode ini di App.tsx:**
```typescript
// CURRENT FAKE CODE (cari ini):
const entropy = Math.random().toString(16).substring(2);
const fakeAddress = `0x${entropy.substring(0, 4)}...${entropy.substring(4, 8)}`;
```

**REPLACE DENGAN:**
```typescript
// REAL MetaMask Connection
const handleConnectWallet = async () => {
  try {
    if (typeof window.ethereum === 'undefined') {
      alert('MetaMask tidak terdeteksi! Install MetaMask dulu di browser kamu: https://metamask.io')
      return
    }
    
    // Import ethers dynamically (untuk Cloudflare Workers compatibility)
    const { BrowserProvider, formatEther } = await import('ethers')
    
    const provider = new BrowserProvider(window.ethereum)
    const accounts = await provider.send('eth_requestAccounts', [])
    
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found')
    }
    
    const signer = await provider.getSigner()
    const address = await signer.getAddress()
    const balanceBigInt = await provider.getBalance(address)
    const balanceETH = parseFloat(formatEther(balanceBigInt)).toFixed(4)
    
    // Cek network
    const network = await provider.getNetwork()
    const chainId = network.chainId.toString()
    
    setWalletAddress(address)
    setWalletBalance(balanceETH)
    setIsConnected(true)
    
    console.log(`✅ Wallet connected: ${address}`)
    console.log(`💰 Balance: ${balanceETH} ETH`)
    console.log(`⛓️ Chain ID: ${chainId}`)
    
    // Optional: Save to Supabase
    try {
      await fetch('/api/auth/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address })
      })
    } catch (e) {
      console.warn('Profile save failed (Supabase may not be ready):', e)
    }
    
  } catch (error: any) {
    console.error('Wallet connect error:', error)
    if (error.code === 4001) {
      alert('Koneksi ditolak user')
    } else {
      alert(`Error: ${error.message}`)
    }
  }
}
```

### STEP 3: Add TypeScript Types (window.ethereum)

Di `src/types.ts`, tambahkan:
```typescript
// Add this to existing types.ts:
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>
      on: (event: string, handler: (...args: any[]) => void) => void
      removeListener: (event: string, handler: (...args: any[]) => void) => void
      selectedAddress?: string
      chainId?: string
    }
  }
}
```

### STEP 4: Auto-reconnect on Page Load

Di App.tsx, tambahkan useEffect:
```typescript
// Auto-reconnect jika MetaMask sudah pernah connect sebelumnya
useEffect(() => {
  const checkExistingConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const { BrowserProvider, formatEther } = await import('ethers')
        const provider = new BrowserProvider(window.ethereum)
        const accounts = await provider.listAccounts()
        
        if (accounts.length > 0) {
          const address = accounts[0].address
          const balanceBigInt = await provider.getBalance(address)
          const balanceETH = parseFloat(formatEther(balanceBigInt)).toFixed(4)
          
          setWalletAddress(address)
          setWalletBalance(balanceETH)
          setIsConnected(true)
        }
      } catch (e) {
        console.warn('Auto-reconnect failed:', e)
      }
    }
  }
  
  checkExistingConnection()
}, [])
```

### STEP 5: Listen for Account Changes
```typescript
useEffect(() => {
  if (typeof window.ethereum === 'undefined') return
  
  const handleAccountsChanged = async (accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected
      setIsConnected(false)
      setWalletAddress('')
      setWalletBalance('0')
    } else {
      // User switched account
      setWalletAddress(accounts[0])
    }
  }
  
  window.ethereum.on('accountsChanged', handleAccountsChanged)
  
  return () => {
    window.ethereum?.removeListener('accountsChanged', handleAccountsChanged)
  }
}, [])
```

### STEP 6: Display Real ETH Balance

Di Header.tsx, update untuk menampilkan real balance.

### STEP 7: Test
```bash
npm run build
# Open browser, connect MetaMask
# Verify real address shows (not random)
# Verify real ETH balance shows
```

---

## ⚠️ PENTING: CLOUDFLARE WORKERS COMPATIBILITY

Karena deploy ke Cloudflare, `ethers.js` **HANYA berjalan di browser (client-side)**.
- Import `ethers` secara dynamic: `await import('ethers')` 
- Atau gunakan `if (typeof window !== 'undefined')` guard
- **JANGAN import ethers di `src/index.tsx` (server-side)!**

---

## 📊 SUCCESS CRITERIA

```
✅ MetaMask popup muncul saat klik "Connect Wallet"
✅ Alamat wallet real (bukan 0x${Math.random()...})
✅ ETH balance real (dari blockchain)
✅ Auto-reconnect saat refresh halaman
✅ Handle MetaMask not installed gracefully
✅ Build sukses tanpa TS errors
```

---

*Session #011 | GANI HYPHA | Planned*
*Priority: P1 — HIGH (Real Web3)*
