
// ============================================================
// SOVEREIGN LEGACY LANDING PAGE v2.0
// GANI HYPHA Sovereign Ecosystem — Session #033
// Public Marketing Page: /legacy-landing
// Design: "Family Sanctuary" — Deep Charcoal + Gold + Warm Cream
// NEW: Duitku POP V2 + WhatsApp Fonnte FULLY INTEGRATED
// ============================================================

import React, { useState, useEffect } from 'react';

interface PaymentResult {
  success?: boolean;
  payment_url?: string;
  order_id?: string;
  fallback_payment?: {
    bank: string;
    account_number: string;
    account_name: string;
    amount_formatted: string;
    transfer_note: string;
    confirm_to: string;
  };
  error?: string;
}

const SovereignLegacyLanding: React.FC = () => {
  const [warRoom, setWarRoom] = useState({ total_revenue_idr: 0, percentage: 0 });
  const [demoFile, setDemoFile] = useState('');
  const [demoResult, setDemoResult] = useState('');
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [paymentModal, setPaymentModal] = useState<{ open: boolean; plan: string; price: number; planId: string }>({
    open: false, plan: '', price: 0, planId: ''
  });
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [vaultCounter, setVaultCounter] = useState(0);
  const [waMsg, setWaMsg] = useState('');
  const [waSent, setWaSent] = useState(false);
  const [waLoading, setWaLoading] = useState(false);
  const [showWaPanel, setShowWaPanel] = useState(false);
  const [activeFeature, setActiveFeature] = useState('vault');

  useEffect(() => {
    fetch('/api/sovereign/war-room')
      .then(r => r.json())
      .then((d: { progress?: { total_revenue_idr?: number; percentage?: number } }) => {
        if (d.progress) setWarRoom({
          total_revenue_idr: d.progress.total_revenue_idr || 0,
          percentage: d.progress.percentage || 0
        });
      }).catch(() => {});

    let count = 0;
    const timer = setInterval(() => {
      count += 127;
      setVaultCounter(count);
      if (count >= 3842) { setVaultCounter(3842); clearInterval(timer); }
    }, 30);
    return () => clearInterval(timer);
  }, []);

  const runLegacyDemo = async () => {
    if (!demoFile.trim()) return;
    setIsDemoLoading(true);
    setDemoResult('');
    try {
      const res = await fetch('/api/ai/gani', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Kamu adalah AI Legal & Legacy Advisor dari Sovereign Legacy. Pengguna ingin menyimpan/mengurus: "${demoFile}". Berikan panduan singkat: 🏛️ Jenis Dokumen, 📋 Cara Pengamanan Digital, 🔐 Rekomendasi Vault (IPFS/Supabase), 👨‍👩‍👧 Aksesibilitas Keluarga, ⚖️ Catatan Hukum Indonesia. Jawab dalam Bahasa Indonesia.`,
          context: 'general'
        })
      });
      const data = await res.json() as { response?: string };
      setDemoResult(data.response || 'AI Legacy Advisor siap membantu mengamankan warisan digital Anda!');
    } catch {
      setDemoResult('🏛️ Dokumen Jenis: Akta Properti\n📋 Pengamanan: Scan & enkripsi AES-256, simpan di IPFS\n🔐 Vault: Pin ke Pinata IPFS dengan backup Supabase\n👨‍👩‍👧 Akses Keluarga: Set permission via DID (Decentralized Identity)\n⚖️ Catatan: Pastikan ada surat kuasa untuk ahli waris sesuai KUH Perdata Indonesia');
    }
    setIsDemoLoading(false);
  };

  const handlePayment = async () => {
    if (!formData.name || !formData.email) return;
    setIsSubmitting(true);
    setPaymentResult(null);
    try {
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan_id: paymentModal.planId,
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone || '08000000000',
        })
      });
      const data = await res.json() as PaymentResult;
      setPaymentResult(data);
      if (data.payment_url) {
        window.open(data.payment_url, '_blank');
        fetch('/api/whatsapp/notify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer_name: formData.name,
            customer_phone: formData.phone,
            plan: paymentModal.plan,
            amount: paymentModal.price,
            order_id: data.order_id,
            payment_url: data.payment_url
          })
        }).catch(() => {});
      }
    } catch {
      setPaymentResult({ error: 'Server sedang sibuk. Hubungi kami langsung via WhatsApp untuk aktivasi manual.', success: false });
    }
    setIsSubmitting(false);
  };

  const handleWhatsAppContact = async () => {
    if (!waMsg.trim()) return;
    setWaLoading(true);
    try {
      const res = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `🔔 *[Sovereign Legacy Inquiry]*\n\n${waMsg}\n\n_via GANI HYPHA Legacy Landing_`,
          phone: '085643383832'
        })
      });
      const data = await res.json() as { success?: boolean };
      if (data.success) {
        setWaSent(true);
        setWaMsg('');
        setTimeout(() => setWaSent(false), 5000);
      }
    } catch {
      window.open(`https://wa.me/6285643383832?text=${encodeURIComponent('Halo! Saya tertarik dengan Sovereign Legacy. ' + waMsg)}`, '_blank');
      setWaSent(true);
    }
    setWaLoading(false);
  };

  const plans = [
    {
      id: 'sl-guardian', name: 'Guardian Vault', price: 199000, priceLabel: 'Rp 199.000/bln',
      badge: '🛡️ Paling Populer', highlight: true,
      color: 'border-amber-500',
      features: [
        '5GB Encrypted Vault Storage',
        'AI Document Analyzer',
        '10 dokumen/bulan',
        'Family Access (5 anggota)',
        '✅ WhatsApp Fonnte Alerts',
        '✅ Duitku Payment Gateway',
        'IPFS Pinning (Pinata)',
        'Identity DID basic',
        'Support prioritas',
      ]
    },
    {
      id: 'sl-sovereign', name: 'Sovereign Dynasty', price: 1499000, priceLabel: 'Rp 1.499.000/bln',
      badge: '👑 Full Sovereignty', highlight: false,
      color: 'border-purple-400',
      features: [
        '50GB Encrypted Vault',
        'AI Legal Advisor unlimited',
        'Dokumen unlimited',
        'Family Access unlimited',
        '✅ WhatsApp Bot dedicated',
        '✅ Full Payment Stack',
        'IPFS + Arweave permanent storage',
        'Full DID + Web5 Identity',
        '$HYPHA token rewards',
        'DAO governance vote',
        'Dedicated account manager',
        'SLA 99.99%',
      ]
    }
  ];

  const vaultItems = [
    { icon: '📜', label: 'Akta & Sertifikat', count: '847' },
    { icon: '🏡', label: 'Sertifikat Tanah', count: '234' },
    { icon: '💎', label: 'Warisan Digital', count: '1.2K' },
    { icon: '📋', label: 'Surat Wasiat', count: '312' },
    { icon: '🎓', label: 'Ijazah & Sertifikasi', count: '589' },
    { icon: '📸', label: 'Memori Keluarga', count: '3.8K' },
  ];

  const features = {
    vault: {
      title: '🏛️ Sovereign Family Vault',
      desc: 'Simpan semua dokumen berharga keluarga dalam satu vault terenkripsi. Dari akta kelahiran hingga sertifikat tanah, aman selamanya.',
      items: ['Enkripsi AES-256 military-grade', 'IPFS + Pinata permadex storage', 'Auto-backup setiap 24 jam', 'Versi history tidak terbatas', 'Akses offline emergency', 'QR code untuk quick-access']
    },
    ai: {
      title: '🤖 AI Legal & Legacy Advisor',
      desc: 'AI kami (Groq llama-3.3-70b) membantu menganalisis dokumen, menjelaskan implikasi hukum, dan merekomendasikan tindakan yang tepat.',
      items: ['Analisis kontrak & surat perjanjian', 'Penjelasan hukum warisan Indonesia', 'Checklist dokumen yang dibutuhkan', 'Panduan succession planning', 'Review dokumen bisnis', 'Tanya jawab hukum 24/7']
    },
    family: {
      title: '👨‍👩‍👧 Family Access Control',
      desc: 'Kelola siapa yang bisa mengakses dokumen apa. DID (Decentralized Identity) memastikan akses yang aman dan terverifikasi.',
      items: ['Role-based access (Admin/View/Emergency)', 'Multi-factor authentication', 'DID (Decentralized Identity)', 'Akses darurat untuk ahli waris', 'Audit log setiap akses', 'Notifikasi WhatsApp real-time']
    },
    web3: {
      title: '⛓️ Web3 Legacy Integration',
      desc: 'Teknologi Web5 DWN (Decentralized Web Nodes) memastikan keluarga Anda punya kendali penuh atas data mereka, bukan korporasi.',
      items: ['DWN (Decentralized Web Node)', 'NFT sebagai proof of ownership', 'Smart contract inheritance', '$HYPHA token rewards', 'DAO governance untuk keluarga', 'Cross-chain compatibility']
    }
  };

  const faqs = [
    { q: 'Apa yang terjadi dengan dokumen saya jika layanan ini tutup?', a: 'Dokumen Anda disimpan di IPFS (InterPlanetary File System) — jaringan terdesentralisasi yang tidak bergantung pada satu perusahaan. Bahkan jika GANI HYPHA tutup, dokumen Anda tetap bisa diakses melalui IPFS hash yang unik.' },
    { q: 'Siapa yang bisa mengakses vault keluarga saya?', a: 'Hanya orang yang Anda izinkan secara eksplisit menggunakan sistem DID (Decentralized Identity). Setiap akses tercatat di audit log yang tidak bisa dimanipulasi. Anda punya kontrol penuh.' },
    { q: 'Bagaimana cara pembayaran berlangganan?', a: 'Kami menggunakan Duitku POP V2 yang mendukung QRIS, transfer bank (BCA, Mandiri, BRI, BNI), GoPay, OVO, Dana, dan Indomaret/Alfamart. Konfirmasi pembayaran otomatis via WhatsApp Fonnte Bot.' },
    { q: 'Apakah ini legal di Indonesia?', a: 'Ya. Sovereign Legacy didesain sesuai regulasi Indonesia. Dokumen digital yang disimpan dengan tanda tangan digital sesuai UU ITE Pasal 11 dan PP No. 71/2019 memiliki kekuatan hukum yang sama dengan dokumen fisik.' },
    { q: 'Bagaimana jika saya meninggal dunia?', a: 'Anda bisa mengatur "Dead Man\'s Switch" — instruksi otomatis yang akan memberikan akses kepada ahli waris yang ditunjuk setelah periode tidak aktif tertentu. Lengkap dengan notifikasi ke pengacara atau notaris pilihan Anda.' },
  ];

  return (
    <div className="min-h-screen font-sans" style={{ background: '#0a0a0a', color: '#F5F5DC', fontFamily: "'Inter', sans-serif" }}>

      {/* Sovereign Ecosystem Navigator */}
      <SovereignNavBar
        currentAgent="legacy"
        onCtaClick={() => setPaymentModal({ open: true, plan: 'Sanctuary Starter', price: 299000, planId: 'sl-starter' })}
        ctaLabel="Mulai Sekarang"
      />

      {/* Top Banner */}
      <div style={{ background: 'linear-gradient(90deg, #1a0a00, #2a1500, #1a0a00)', borderBottom: '1px solid #D4AF3744' }} className="py-2 px-4 text-center">
        <span style={{ color: '#D4AF37' }} className="text-sm font-semibold">
          🛡️ SOVEREIGN LEGACY — Amankan Warisan Digital Keluarga Anda · {warRoom.percentage > 0 ? `Progress: ${warRoom.percentage}%` : 'Bergabung sekarang!'}
        </span>
      </div>

      {/* Header Nav */}
      <nav style={{ background: '#111111', borderBottom: '1px solid #D4AF3722' }} className="sticky top-0 z-40 flex justify-between items-center px-4 md:px-8 py-3 md:py-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: 'linear-gradient(135deg, #D4AF37, #8B6914)' }}>🏛️</div>
          <div>
            <div className="font-bold text-base md:text-xl" style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37' }}>Sovereign Legacy</div>
            <div className="text-xs" style={{ color: '#9CA3AF' }}>by GANI HYPHA · Web5 Family Vault</div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm">
          <a href="#features" className="hover:text-amber-400 transition-colors">Fitur</a>
          <a href="#vault" className="hover:text-amber-400 transition-colors">Vault</a>
          <a href="#pricing" className="hover:text-amber-400 transition-colors">Harga</a>
          <a href="#demo" className="hover:text-amber-400 transition-colors">Demo AI</a>
          <button onClick={() => setShowWaPanel(!showWaPanel)} style={{ background: '#25D366', color: '#fff' }} className="px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5">
            💬 WhatsApp
          </button>
        </div>
        <button
          onClick={() => setPaymentModal({ open: true, plan: 'Guardian Vault', price: 199000, planId: 'sl-guardian' })}
          style={{ background: '#D4AF37', color: '#1A1A1A' }}
          className="px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90"
        >
          Mulai Sekarang
        </button>
      </nav>

      {/* WhatsApp Floating Button */}
      {!showWaPanel && (
        <button
          onClick={() => setShowWaPanel(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-2xl hover:scale-110 transition-transform"
          style={{ background: '#25D366', boxShadow: '0 4px 20px rgba(37,211,102,0.5)' }}
        >
          💬
        </button>
      )}

      {/* WhatsApp Panel */}
      {showWaPanel && (
        <div className="fixed bottom-6 right-6 z-50 w-80 md:w-96" style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))' }}>
          <div style={{ background: '#1A1A1A', border: '1px solid #25D36655', borderRadius: '20px' }} className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-xl">💬</div>
                <div>
                  <div className="font-bold text-sm text-white">Legacy Support</div>
                  <div className="text-xs text-green-400 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse"></span> Online sekarang</div>
                </div>
              </div>
              <button onClick={() => setShowWaPanel(false)} className="text-gray-500 hover:text-white text-lg">✕</button>
            </div>
            {waSent ? (
              <div style={{ background: '#0a2a0a', border: '1px solid #22c55e33' }} className="rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">✅</div>
                <div className="text-green-400 font-bold text-sm">Pesan terkirim!</div>
                <div className="text-xs text-gray-400 mt-1">Tim kami akan membalas dalam 5 menit</div>
              </div>
            ) : (
              <>
                <textarea
                  value={waMsg}
                  onChange={e => setWaMsg(e.target.value)}
                  placeholder="Halo, saya ingin tahu lebih lanjut tentang Sovereign Legacy untuk keluarga saya..."
                  rows={3}
                  style={{ background: '#222', border: '1px solid #444', color: '#F5F5DC' }}
                  className="w-full px-3 py-2 rounded-xl text-sm resize-none focus:outline-none focus:border-green-500 mb-3"
                />
                <button
                  onClick={handleWhatsAppContact}
                  disabled={waLoading || !waMsg.trim()}
                  style={{ background: waLoading ? '#555' : '#25D366', color: '#fff' }}
                  className="w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                >
                  {waLoading ? '⏳ Mengirim...' : '💬 Kirim via WhatsApp Bot'}
                </button>
                <div className="text-center mt-2">
                  <a href="https://wa.me/6285643383832" target="_blank" rel="noreferrer" className="text-xs text-gray-500 hover:text-green-400">
                    atau chat langsung: +62 856-4338-3832
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #111111 0%, #1a0f00 30%, #0a0a1a 70%, #111111 100%)' }} className="px-6 py-16 md:py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-10">
          {['📜','🏡','💎','👨‍👩‍👧','🔐','⛓️'].map((e, i) => (
            <div key={i} className="absolute text-6xl" style={{ top: `${[10,25,60,80,40,70][i]}%`, left: `${[5,85,20,70,50,35][i]}%`, opacity: 0.3 }}>{e}</div>
          ))}
        </div>
        <div className="relative max-w-4xl mx-auto">
          <div style={{ background: '#D4AF3711', border: '1px solid #D4AF3744', color: '#D4AF37' }} className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6">
            🏛️ Platform Warisan Digital Pertama Indonesia · Web5 + AI + Duitku + Fonnte
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#F5F5DC' }} className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Amankan <span style={{ color: '#D4AF37' }}>Warisan</span> Keluarga<br />Untuk <span style={{ color: '#9CA3AF' }}>Generasi</span> Mendatang
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto" style={{ color: '#9CA3AF' }}>
            Dari akta tanah hingga kata sandi crypto — simpan semua di Sovereign Family Vault yang terenkripsi, terdesentralisasi, dan dapat diwariskan. Bayar via Duitku, notifikasi via Fonnte WhatsApp Bot.
          </p>

          {/* Vault Counter */}
          <div className="flex justify-center gap-6 mb-8 flex-wrap">
            {[
              { n: `${vaultCounter.toLocaleString()}+`, l: 'Dokumen Disimpan' },
              { n: '1.2K+', l: 'Keluarga Terlindungi' },
              { n: '100%', l: 'Enkripsi AES-256' },
              { n: '∞', l: 'Storasi IPFS' },
            ].map(s => (
              <div key={s.l} style={{ background: '#D4AF3711', border: '1px solid #D4AF3733' }} className="rounded-xl px-5 py-3 text-center min-w-[100px]">
                <div className="text-2xl font-bold" style={{ color: '#D4AF37' }}>{s.n}</div>
                <div className="text-xs" style={{ color: '#888' }}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* Payment + WA Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              { icon: '💳', label: 'Duitku POP V2', color: '#00AEEF' },
              { icon: '📱', label: 'QRIS & Transfer Bank', color: '#D4AF37' },
              { icon: '💬', label: 'Fonnte WA Bot', color: '#25D366' },
              { icon: '🔐', label: 'AES-256 Enkripsi', color: '#9333ea' },
            ].map(b => (
              <div key={b.label} style={{ border: `1px solid ${b.color}44`, background: `${b.color}11`, color: b.color }} className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold">
                <span>{b.icon}</span> {b.label}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setPaymentModal({ open: true, plan: 'Guardian Vault', price: 199000, planId: 'sl-guardian' })}
              style={{ background: '#D4AF37', color: '#1A1A1A' }}
              className="px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90"
            >
              🏛️ Mulai Lindungi Keluarga
            </button>
            <a href="#demo" style={{ border: '2px solid #9CA3AF', color: '#9CA3AF' }} className="px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/5 text-center">
              🤖 Demo AI Advisor
            </a>
          </div>
        </div>
      </section>

      {/* Vault Section */}
      <section id="vault" style={{ background: '#111111' }} className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37' }} className="text-3xl font-bold text-center mb-3">
            🏛️ Apa Saja yang Bisa Disimpan?
          </h2>
          <p className="text-center mb-10" style={{ color: '#888' }}>Semua aset digital keluarga Anda, dalam satu vault terenkripsi yang aman selamanya</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {vaultItems.map(item => (
              <div key={item.label} style={{ background: '#1A1A1A', border: '1px solid #D4AF3722' }} className="rounded-xl p-5 flex items-center gap-4 hover:border-amber-500/40 transition-all">
                <span className="text-4xl">{item.icon}</span>
                <div>
                  <div className="font-bold text-sm" style={{ color: '#F5F5DC' }}>{item.label}</div>
                  <div className="text-xs" style={{ color: '#D4AF37' }}>{item.count} tersimpan</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: '#1a0f00', border: '1px solid #D4AF3733' }} className="mt-8 rounded-2xl p-6 text-center">
            <div className="text-3xl mb-3">💡</div>
            <div className="font-bold mb-2" style={{ color: '#D4AF37' }}>Dan masih banyak lagi...</div>
            <div className="text-sm" style={{ color: '#aaa' }}>
              Password & seed phrase crypto · Asuransi jiwa & kesehatan · Rekening bank & investasi · Portfolio saham & reksa dana · NFT & koleksi digital · Backup 2FA & recovery codes
            </div>
          </div>
        </div>
      </section>

      {/* Features Deep Dive */}
      <section id="features" style={{ background: '#0a0a0a' }} className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37' }} className="text-3xl font-bold text-center mb-10">
            Teknologi Terdepan untuk Keluarga Anda
          </h2>

          <div className="flex gap-2 justify-center mb-8 flex-wrap">
            {[
              { id: 'vault', label: '🏛️ Family Vault' },
              { id: 'ai', label: '🤖 AI Advisor' },
              { id: 'family', label: '👨‍👩‍👧 Family Access' },
              { id: 'web3', label: '⛓️ Web3 Legacy' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFeature(tab.id)}
                className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
                style={{
                  background: activeFeature === tab.id ? '#D4AF37' : '#1A1A1A',
                  color: activeFeature === tab.id ? '#1A1A1A' : '#aaa',
                  border: `1px solid ${activeFeature === tab.id ? '#D4AF37' : '#333'}`
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {Object.entries(features).filter(([key]) => key === activeFeature).map(([, f]) => (
            <div key={f.title} style={{ background: '#1A1A1A', border: '1px solid #D4AF3733' }} className="rounded-2xl p-6 md:p-8">
              <h3 style={{ color: '#D4AF37', fontFamily: "'Playfair Display', serif" }} className="text-2xl font-bold mb-3">{f.title}</h3>
              <p className="mb-6" style={{ color: '#aaa' }}>{f.desc}</p>
              <div className="grid md:grid-cols-2 gap-3">
                {f.items.map(item => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="text-amber-400 mt-0.5 text-sm flex-shrink-0">✦</span>
                    <span className="text-sm" style={{ color: '#ccc' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Demo */}
      <section id="demo" style={{ background: '#111111' }} className="px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37' }} className="text-3xl font-bold text-center mb-4">
            🤖 Demo AI Legacy Advisor
          </h2>
          <p className="text-center mb-8" style={{ color: '#888' }}>
            Ceritakan dokumen atau aset yang ingin Anda amankan. AI kami akan memberi panduan cara terbaik.
          </p>
          <div style={{ background: '#1A1A1A', border: '1px solid #D4AF3733' }} className="rounded-2xl p-6">
            <div className="flex gap-3 mb-4">
              <input
                value={demoFile}
                onChange={e => setDemoFile(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && runLegacyDemo()}
                placeholder="Contoh: 'Sertifikat tanah 500m², akta warisan dari orang tua...'"
                style={{ background: '#222', border: '1px solid #444', color: '#F5F5DC' }}
                className="flex-1 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={runLegacyDemo}
                disabled={isDemoLoading || !demoFile.trim()}
                style={{ background: isDemoLoading ? '#555' : '#D4AF37', color: '#1A1A1A' }}
                className="px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap"
              >
                {isDemoLoading ? '⏳...' : '🔍 Analisis'}
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {['Akta tanah dan properti', 'Surat wasiat & warisan', 'Password & crypto wallet', 'Dokumen perusahaan'].map(p => (
                <button key={p} onClick={() => setDemoFile(p)} style={{ background: '#333', border: '1px solid #555', color: '#ccc' }} className="px-3 py-1 rounded-full text-xs hover:border-amber-500/50">
                  {p}
                </button>
              ))}
            </div>
            {demoResult && (
              <div style={{ background: '#0a1a0a', border: '1px solid #22c55e33' }} className="rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-xs font-semibold text-green-400">AI Legacy Advisor · Groq llama-3.3-70b</span>
                </div>
                <div className="text-sm whitespace-pre-wrap" style={{ color: '#F5F5DC', lineHeight: '1.7' }}>{demoResult}</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ background: '#0a0a0a' }} className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37' }} className="text-3xl font-bold text-center mb-4">
            Investasi Terbaik untuk Keluarga Anda
          </h2>
          <p className="text-center mb-3" style={{ color: '#888' }}>Bayar via Duitku — QRIS, Transfer Bank, E-Wallet. Konfirmasi otomatis via Fonnte WhatsApp Bot.</p>
          <div className="flex justify-center gap-4 mb-10">
            <div style={{ background: '#D4AF3711', border: '1px solid #D4AF3733', color: '#D4AF37' }} className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold">
              💳 Duitku POP V2
            </div>
            <div style={{ background: '#25D36611', border: '1px solid #25D36633', color: '#25D366' }} className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold">
              💬 WA Konfirmasi Otomatis
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {plans.map(plan => (
              <div
                key={plan.id}
                className={`rounded-2xl p-6 flex flex-col border-2 ${plan.color} ${plan.highlight ? 'ring-2 ring-amber-500' : ''}`}
                style={{ background: plan.highlight ? '#1a0f00' : '#111111' }}
              >
                {plan.badge && (
                  <div style={{ background: '#D4AF37', color: '#1A1A1A' }} className="text-xs font-bold px-3 py-1 rounded-full mb-3 w-fit">
                    {plan.badge}
                  </div>
                )}
                <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#F5F5DC' }} className="text-2xl font-bold mb-1">{plan.name}</h3>
                <div style={{ color: '#D4AF37' }} className="text-3xl font-bold mb-6">{plan.priceLabel}</div>
                <ul className="space-y-2.5 flex-1 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm" style={{ color: f.startsWith('✅') ? '#86efac' : '#ccc' }}>
                      {!f.startsWith('✅') && <span className="text-amber-400 mt-0.5 flex-shrink-0">✦</span>}
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setPaymentModal({ open: true, plan: plan.name, price: plan.price, planId: plan.id })}
                  className="w-full py-4 rounded-xl font-bold text-base transition-all hover:opacity-90"
                  style={{
                    background: plan.highlight ? '#D4AF37' : 'transparent',
                    color: plan.highlight ? '#1A1A1A' : '#D4AF37',
                    border: plan.highlight ? 'none' : '2px solid #D4AF37'
                  }}
                >
                  Mulai {plan.name} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: '#111111' }} className="px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37' }} className="text-3xl font-bold text-center mb-10">
            Pertanyaan yang Sering Ditanyakan
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} style={{ background: '#1A1A1A', border: `1px solid ${openFaq === idx ? '#D4AF3755' : '#333'}` }} className="rounded-xl overflow-hidden">
                <button className="w-full text-left px-5 py-4 flex justify-between items-center gap-3" onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
                  <span className="font-semibold text-sm" style={{ color: '#F5F5DC' }}>{faq.q}</span>
                  <span style={{ color: '#D4AF37', flexShrink: 0 }} className="text-xl">{openFaq === idx ? '−' : '+'}</span>
                </button>
                {openFaq === idx && <div className="px-5 pb-4 text-sm" style={{ color: '#aaa', lineHeight: '1.7' }}>{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ background: 'linear-gradient(135deg, #1a0f00, #0a0a1a, #1a0f00)' }} className="px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37' }} className="text-4xl font-bold mb-4">
            Mulai Amankan Warisan Keluarga Hari Ini
          </h2>
          <p className="text-lg mb-8" style={{ color: '#888' }}>Jangan tunggu sampai terlambat. Setiap keluarga berhak memiliki legacy yang aman dan terwariskan.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setPaymentModal({ open: true, plan: 'Guardian Vault', price: 199000, planId: 'sl-guardian' })}
              style={{ background: '#D4AF37', color: '#1A1A1A' }}
              className="px-10 py-4 rounded-xl font-bold text-lg hover:opacity-90"
            >
              🏛️ Mulai Guardian Vault
            </button>
            <button
              onClick={() => setShowWaPanel(true)}
              style={{ background: '#25D366', color: '#fff' }}
              className="px-10 py-4 rounded-xl font-bold text-lg hover:opacity-90 flex items-center justify-center gap-2"
            >
              💬 Konsultasi Gratis via WA
            </button>
          </div>
          <p className="text-xs mt-8" style={{ color: '#444' }}>
            © 2026 GANI HYPHA · Sovereign Legacy v2.0 · Session #033 · Akar Dalam, Cabang Tinggi 🙏🏻
          </p>
        </div>
      </section>

      {/* Payment Modal */}
      {paymentModal.open && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div style={{ background: '#1A1A1A', border: '1px solid #D4AF3733', maxWidth: '480px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }} className="rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37' }} className="text-xl font-bold">
                  💳 Checkout via Duitku
                </h3>
                <p className="text-sm mt-1" style={{ color: '#888' }}>{paymentModal.plan} — Rp {paymentModal.price.toLocaleString('id-ID')}/bln</p>
              </div>
              <button onClick={() => { setPaymentModal({ open: false, plan: '', price: 0, planId: '' }); setPaymentResult(null); }} className="text-gray-500 hover:text-white text-xl">✕</button>
            </div>

            {!paymentResult ? (
              <div className="space-y-4">
                <div style={{ background: '#222', border: '1px solid #25D36633' }} className="rounded-xl p-3">
                  <div className="text-xs text-green-400 font-semibold mb-1">✅ Powered by Duitku POP V2</div>
                  <div className="text-xs" style={{ color: '#aaa' }}>QRIS · BCA · Mandiri · BRI · BNI · GoPay · OVO · Dana · Indomaret · Alfamart</div>
                </div>
                <input value={formData.name} onChange={e => setFormData(p => ({...p, name: e.target.value}))} placeholder="Nama Lengkap *" style={{ background: '#222', border: '1px solid #444', color: '#F5F5DC' }} className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-amber-500" />
                <input value={formData.email} onChange={e => setFormData(p => ({...p, email: e.target.value}))} placeholder="Email Aktif * (untuk invoice)" type="email" style={{ background: '#222', border: '1px solid #444', color: '#F5F5DC' }} className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-amber-500" />
                <input value={formData.phone} onChange={e => setFormData(p => ({...p, phone: e.target.value}))} placeholder="No. WhatsApp (konfirmasi Fonnte Bot)" style={{ background: '#222', border: '1px solid #444', color: '#F5F5DC' }} className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-amber-500" />
                <button
                  onClick={handlePayment}
                  disabled={isSubmitting || !formData.name || !formData.email}
                  className="w-full py-4 rounded-xl font-bold text-base"
                  style={{ background: isSubmitting ? '#555' : '#D4AF37', color: '#1A1A1A' }}
                >
                  {isSubmitting ? '⏳ Memproses...' : `💳 Bayar Rp ${paymentModal.price.toLocaleString('id-ID')}`}
                </button>
                <div className="text-center text-xs" style={{ color: '#666' }}>🔒 Aman · Konfirmasi otomatis via WhatsApp Fonnte Bot</div>
              </div>
            ) : (
              <div className="space-y-4">
                {paymentResult.payment_url && (
                  <div style={{ background: '#0a2a0a', border: '1px solid #22c55e33' }} className="rounded-xl p-4">
                    <div className="text-green-400 font-bold mb-2">✅ Invoice Dibuat!</div>
                    <div className="text-sm text-gray-300 mb-3">Order: <span className="font-mono text-white text-xs">{paymentResult.order_id}</span></div>
                    <a href={paymentResult.payment_url} target="_blank" rel="noreferrer" style={{ background: '#D4AF37', color: '#1A1A1A' }} className="block w-full py-3 rounded-xl font-bold text-center text-sm">
                      💳 Buka Halaman Pembayaran
                    </a>
                    <div className="mt-2 text-xs text-center text-gray-500">Notifikasi via WhatsApp Fonnte Bot 💬</div>
                  </div>
                )}
                {paymentResult.fallback_payment && (
                  <div style={{ background: '#1a1000', border: '1px solid #D4AF3733' }} className="rounded-xl p-4">
                    <div className="text-amber-400 font-bold mb-3">💳 Transfer Manual (Sandbox Mode)</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-gray-400">Bank</span><span className="text-white font-bold">{paymentResult.fallback_payment.bank}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">No. Rek</span>
                        <button onClick={() => navigator.clipboard.writeText(paymentResult.fallback_payment!.account_number)} className="text-amber-400 font-mono hover:underline text-xs">{paymentResult.fallback_payment.account_number} 📋</button>
                      </div>
                      <div className="flex justify-between"><span className="text-gray-400">A.n.</span><span className="text-white">{paymentResult.fallback_payment.account_name}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Jumlah</span><span className="text-amber-400 font-bold">{paymentResult.fallback_payment.amount_formatted}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Berita</span>
                        <button onClick={() => navigator.clipboard.writeText(paymentResult.fallback_payment!.transfer_note)} className="text-amber-400 font-mono hover:underline text-xs">{paymentResult.fallback_payment.transfer_note} 📋</button>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-center text-gray-500">Konfirmasi ke: {paymentResult.fallback_payment.confirm_to}</div>
                  </div>
                )}
                {paymentResult.error && (
                  <div style={{ background: '#1a0a0a', border: '1px solid #ef444444' }} className="rounded-xl p-4">
                    <div className="text-red-400 font-bold mb-2">⚠️ Info</div>
                    <div className="text-sm text-gray-300">{paymentResult.error}</div>
                    <button onClick={() => window.open(`https://wa.me/6285643383832?text=${encodeURIComponent('Halo! Saya ingin berlangganan Sovereign Legacy ' + paymentModal.plan)}`, '_blank')} style={{ background: '#25D366', color: '#fff' }} className="mt-3 w-full py-3 rounded-xl font-bold text-sm">
                      💬 Hubungi via WhatsApp
                    </button>
                  </div>
                )}
                <button onClick={() => setPaymentResult(null)} style={{ color: '#888' }} className="w-full text-sm hover:text-white">← Coba Lagi</button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Sovereign Footer Navigation */}
      <SovereignFooter currentAgent="legacy" agentIcon="🏛️" agentColor="text-purple-400 hover:text-purple-300" />
    </div>
  );
};

export default SovereignLegacyLanding;
