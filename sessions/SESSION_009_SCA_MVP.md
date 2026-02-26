# 📋 SESSION #009 — SCA MVP BUILD
## GANI HYPHA — Sovereign Contract Analyst (Revenue Engine)
### Status: 🎯 READY TO START | Priority: P0 CRITICAL

---

## 🎯 TUJUAN SESSION INI

**BUILD SCA MVP yang bisa generate revenue pertama!**

```
INPUT:  User upload kontrak PDF/TXT/DOCX
OUTPUT: AI analysis dengan risk score, dangerous clauses, recommendations
PRICE:  Rp 149K-1,499K/bulan
TECH:   Groq llama-3.3-70b (sudah ada key-nya)
```

---

## ⚡ SETUP CEPAT (COPY-PASTE)

```bash
# 1. Clone & setup
cd /home/user
git clone https://github.com/Estes786/Agnt-Mrket-place-Web-3-Web-4-5.git webapp
cd /home/user/webapp

# 2. Install
npm install

# 3. Buat .dev.vars (copy dari sessions/CREDENTIALS.md)
# Key yang paling penting untuk session ini:
# GROQ_API_KEY=[GROQ_API_KEY - lihat .dev.vars]
# VITE_GROQ_API_KEY=[GROQ_API_KEY - lihat .dev.vars]

# 4. Build & start
npm run build
pm2 start ecosystem.config.cjs

# 5. Verify
curl http://localhost:3000/api/health
```

---

## 📋 TODO LIST SESSION #009

### STEP 1: Test Groq API (30 menit)
- [ ] Test Groq API dengan curl:
```bash
curl -X POST "https://api.groq.com/openai/v1/chat/completions" \
  -H "Authorization: Bearer [GROQ_API_KEY - lihat .dev.vars]" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama-3.3-70b-versatile",
    "messages": [{"role": "user", "content": "Say hello in Indonesian"}],
    "max_tokens": 100
  }'
```
- [ ] Verify response valid
- [ ] Test `/api/ai/chat` endpoint di backend

### STEP 2: Enhance Backend SCA Route (2-3 jam)
- [ ] Add `POST /api/sca/analyze` ke `src/index.tsx`
- [ ] Add `GET /api/sca/history` 
- [ ] Add `POST /api/sca/save` (save analysis ke Supabase jika table ada)

**Groq Prompt untuk SCA:**
```typescript
const SCA_SYSTEM_PROMPT = `Kamu adalah AI Analis Kontrak Hukum Indonesia yang ahli dalam:
- Hukum properti Indonesia (UUPA, KUH Perdata, Peraturan ATR/BPN)
- Kontrak bisnis (perjanjian kerja sama, MOU, LOI)
- Kontrak ketenagakerjaan (PKB, perjanjian kerja)
- Kontrak kredit dan pembiayaan

Analisis kontrak yang diberikan dan berikan output dalam format JSON berikut:
{
  "summary": "Ringkasan 3-4 kalimat tentang kontrak ini dalam Bahasa Indonesia",
  "contract_type": "Jenis kontrak (properti/bisnis/kerja/kredit/lainnya)",
  "risk_score": 7,
  "risk_level": "TINGGI",
  "parties": ["Pihak 1", "Pihak 2"],
  "key_dates": ["tanggal mulai", "tanggal berakhir"],
  "financial_terms": "Nilai dan ketentuan finansial",
  "dangerous_clauses": [
    {
      "clause_title": "Nama klausul",
      "content_excerpt": "Kutipan klausul",
      "risk": "Penjelasan risiko",
      "recommendation": "Saran perbaikan"
    }
  ],
  "missing_clauses": ["Klausul penting yang tidak ada"],
  "positive_aspects": ["Aspek positif kontrak"],
  "action_items": ["Tindakan yang harus diambil"],
  "overall_recommendation": "Rekomendasi keseluruhan",
  "legal_disclaimer": "Ini adalah analisis AI, bukan pengganti konsultasi hukum profesional"
}`
```

### STEP 3: Enhance SCA Component Frontend (2-3 jam)
- [ ] Update `src/components/SCA.tsx` yang sudah ada
- [ ] Add file upload UI (drag-drop untuk PDF/TXT/DOCX)
- [ ] Add text paste area (untuk contract text langsung)
- [ ] Add analysis result display dengan:
  - Risk score badge (RENDAH/SEDANG/TINGGI/KRITIS)
  - Dangerous clauses list
  - Recommendations
  - Download report button (text)
- [ ] Add loading state (Groq takes 2-5 seconds)

### STEP 4: Connect Frontend → Backend (1 jam)
- [ ] Update SCA.tsx untuk call `/api/sca/analyze`
- [ ] Handle loading state
- [ ] Handle error state
- [ ] Display results properly

### STEP 5: Test End-to-End (30 menit)
- [ ] Test dengan sample contract text
- [ ] Verify analysis results masuk akal
- [ ] Test error handling

### STEP 6: Build & Deploy (30 menit)
- [ ] `npm run build` — must pass
- [ ] Deploy ke CF Pages
- [ ] Test di live URL

---

## 📁 FILES TO MODIFY

```
src/index.tsx           → Add SCA API routes (~50 lines)
src/components/SCA.tsx  → Enhance dengan real functionality
```

---

## 🔑 CRITICAL API ENDPOINT

```typescript
// src/index.tsx — ADD THIS ROUTE:

app.post('/api/sca/analyze', async (c) => {
  const groqKey = c.env.GROQ_API_KEY || c.env.VITE_GROQ_API_KEY
  if (!groqKey) {
    return c.json({ error: 'Groq API key not configured' }, 500)
  }

  const { contractText, contractType } = await c.req.json()
  
  if (!contractText || contractText.length < 50) {
    return c.json({ error: 'Contract text too short (min 50 chars)' }, 400)
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${groqKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SCA_SYSTEM_PROMPT },
        { role: 'user', content: `Analisis kontrak berikut:\n\n${contractText.substring(0, 8000)}` }
      ],
      response_format: { type: 'json_object' },
      max_tokens: 2000,
      temperature: 0.1
    })
  })

  if (!response.ok) {
    const err = await response.text()
    return c.json({ error: `Groq error: ${err}` }, 500)
  }

  const data = await response.json() as any
  const analysis = JSON.parse(data.choices[0].message.content)
  
  return c.json({
    success: true,
    analysis,
    tokens_used: data.usage?.total_tokens,
    model: 'llama-3.3-70b-versatile'
  })
})
```

---

## 💡 SCA PRICING TO IMPLEMENT

```
Tier BASIC (Gratis Terbatas):
- 3 analisis/bulan
- Basis kontrak saja
- Tidak ada save history

Tier PROFESIONAL (Rp 499K/bulan = ~$30):
- 15 analisis/bulan
- Full analysis + recommendations
- Save history di Supabase

Tier BIRO (Rp 1,499K/bulan = ~$90):
- 50 analisis/bulan
- Semua fitur + export PDF
- Priority support

[CATATAN: Payment integration akan di SESSION_012]
[Untuk MVP session ini: FREE tier dulu untuk testing]
```

---

## 📊 SUCCESS CRITERIA SESSION #009

```
✅ Groq API berfungsi (live test berhasil)
✅ /api/sca/analyze endpoint return valid JSON analysis
✅ SCA.tsx UI bisa:
   - Input contract text
   - Call backend
   - Display risk score
   - Show dangerous clauses
✅ Build berhasil (npm run build)
✅ Test dengan 1 sample kontrak real
✅ Push ke GitHub
```

---

## 🔗 HANDOFF KE SESSION_010

Setelah SESSION_009 selesai, informasikan ke SESSION_010:
- Status Groq API (working/error)
- SCA component status
- Any TypeScript errors yang muncul
- Sample contract yang sudah ditest

---

*Session #009 | GANI HYPHA | Planned: After Session #008*
*Priority: P0 — REVENUE CRITICAL*
