# 📋 SESSION #013 — GROQ FULL INTEGRATION + STREAMING
## GANI HYPHA — AI Features Working 100%
### Status: ⏳ PENDING

---

## 🎯 TUJUAN SESSION INI

- Test semua Groq API endpoints
- Implement streaming untuk GANI Assistant
- Fix LangChain integration (kalau feasible)
- Add rate limiting

---

## TODO LIST

### STEP 1: Test semua AI endpoints
```bash
# Test GANI Assistant chat
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Jelaskan tentang GANI HYPHA ecosystem"}'

# Test Blueprint Generator
curl -X POST http://localhost:3000/api/ai/architect \
  -H "Content-Type: application/json" \
  -d '{"requirements": "Saya butuh AI agent untuk real estate management"}'

# Test Contract Analyzer  
curl -X POST http://localhost:3000/api/ai/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "Surat Perjanjian Jual Beli: Pihak A menjual kepada Pihak B..."}'
```

### STEP 2: Implement Groq Streaming

Di GaniAssistant.tsx, update untuk support streaming response:
```typescript
// Stream from backend
const response = await fetch('/api/ai/chat/stream', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: userInput })
})

const reader = response.body?.getReader()
const decoder = new TextDecoder()
let assistantMessage = ''

while (true) {
  const { done, value } = await reader!.read()
  if (done) break
  
  const chunk = decoder.decode(value)
  const lines = chunk.split('\n').filter(line => line.startsWith('data: '))
  
  for (const line of lines) {
    const data = line.substring(6)
    if (data === '[DONE]') break
    try {
      const parsed = JSON.parse(data)
      const delta = parsed.choices[0]?.delta?.content || ''
      assistantMessage += delta
      setCurrentResponse(assistantMessage)
    } catch (e) {}
  }
}
```

### STEP 3: Backend Streaming Route
```typescript
// src/index.tsx
app.post('/api/ai/chat/stream', async (c) => {
  const { message } = await c.req.json()
  const groqKey = c.env.GROQ_API_KEY
  
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${groqKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'Kamu adalah GANI Assistant, AI assistant untuk platform GANI HYPHA Web3/Web4/Web5 ecosystem. Respond dalam Bahasa Indonesia.' },
        { role: 'user', content: message }
      ],
      stream: true,
      max_tokens: 1000
    })
  })
  
  return new Response(response.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no'
    }
  })
})
```

### STEP 4: Rate Limiting
```typescript
// Simple in-memory rate limiter (per IP)
const rateLimiter = new Map<string, { count: number; resetAt: number }>()

app.use('/api/ai/*', async (c, next) => {
  const ip = c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || 'unknown'
  const now = Date.now()
  const limit = rateLimiter.get(ip)
  
  if (limit && now < limit.resetAt && limit.count >= 20) {
    return c.json({ error: 'Rate limit exceeded. Try again in a minute.' }, 429)
  }
  
  if (!limit || now > limit.resetAt) {
    rateLimiter.set(ip, { count: 1, resetAt: now + 60000 })
  } else {
    limit.count++
  }
  
  return next()
})
```

### STEP 5: LangChain Integration (Optional)
- Evaluate if LangChain worth implementing now
- If yes: simple chain untuk multi-step analysis
- If no: stick with direct Groq calls

---

## 📊 SUCCESS CRITERIA

```
✅ /api/ai/chat returns valid Groq response
✅ /api/ai/architect generates blueprint JSON
✅ /api/sca/analyze returns risk analysis
✅ Streaming works in GANI Assistant UI
✅ Rate limiting prevents API abuse
```

---

*Session #013 | GANI HYPHA | Planned*
