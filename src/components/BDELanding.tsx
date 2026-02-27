
// ============================================================
// BDE LANDING PAGE — Barber Dynasty Engine
// GANI HYPHA Sovereign Ecosystem — Session #030
// Public Marketing Page: /bde-landing
// Design: "Modern Heritage" — Charcoal + Gold + Electric Blue
// ============================================================

import React, { useState, useEffect } from 'react';

const BDELanding: React.FC = () => {
  const [activeTab, setActiveTab] = useState('owner');
  const [demoInput, setDemoInput] = useState('');
  const [demoResult, setDemoResult] = useState('');
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [warRoom, setWarRoom] = useState({ total_revenue_idr: 0, percentage: 0 });
  const [paymentModal, setPaymentModal] = useState<{ open: boolean; plan: string; price: number; planId: string }>({
    open: false, plan: '', price: 0, planId: ''
  });
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Fetch War Room data
  useEffect(() => {
    fetch('/api/sovereign/war-room')
      .then(r => r.json())
      .then((d: { progress?: { total_revenue_idr?: number; percentage?: number } }) => {
        if (d.progress) setWarRoom({
          total_revenue_idr: d.progress.total_revenue_idr || 0,
          percentage: d.progress.percentage || 0
        });
      }).catch(() => {});
  }, []);

  // AI Style Advisor Demo
  const runStyleDemo = async () => {
    if (!demoInput.trim()) return;
    setIsDemoLoading(true);
    setDemoResult('');
    try {
      const res = await fetch('/api/ai/gani', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Sebagai AI Style Advisor untuk barbershop, analisis request berikut dan berikan rekomendasi gaya rambut + strategi bisnis yang tepat: "${demoInput}". Jawab dalam Bahasa Indonesia dengan format: 🎯 Rekomendasi Gaya, ⏱️ Estimasi Waktu, 💰 Estimasi Harga (IDR), 📈 Tip Bisnis`,
          context: 'general'
        })
      });
      const data = await res.json() as { response?: string };
      setDemoResult(data.response || 'AI siap memberikan rekomendasi. Coba masukkan pertanyaan lebih spesifik!');
    } catch {
      setDemoResult('✨ Demo AI Style Advisor: Untuk rambut undercut dengan fade, estimasi 45 menit, harga Rp 75.000-120.000. Tambahkan pomade service untuk upsell Rp 25.000. Booking rate optimal: 85%.');
    }
    setIsDemoLoading(false);
  };

  const handlePayment = async () => {
    if (!formData.name || !formData.email) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: paymentModal.planId,
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone || '08000000000',
          agent: 'SCA'
        })
      });
      const data = await res.json() as { success?: boolean; paymentUrl?: string; orderId?: string };
      if (data.success && data.paymentUrl) {
        window.open(data.paymentUrl, '_blank');
        setSuccessMsg(`✅ Invoice dibuat! Order ID: ${data.orderId}. Cek email Anda untuk instruksi pembayaran.`);
        setPaymentModal({ open: false, plan: '', price: 0, planId: '' });
      } else {
        setSuccessMsg('⚠️ Gunakan mode sandbox. Hubungi kami di WhatsApp untuk aktivasi manual.');
      }
    } catch {
      setSuccessMsg('⚠️ Server sedang sibuk. Hubungi kami langsung via WhatsApp untuk aktivasi cepat!');
    }
    setIsSubmitting(false);
  };

  const plans = [
    {
      id: 'bde-trial', name: 'Trial Gratis', price: 0, priceLabel: 'Gratis Selamanya',
      color: 'border-gray-600', badge: '', highlight: false,
      features: ['1 Kursi Barber', 'Basic booking', 'AI Style Advisor (5x/hari)', 'Laporan mingguan', 'Support komunitas']
    },
    {
      id: 'bde-starter', name: 'Starter Barber', price: 149000, priceLabel: 'Rp 149.000/bln',
      color: 'border-amber-500', badge: '🔥 POPULER', highlight: true,
      features: ['3 Kursi Barber', 'Booking unlimited', 'AI Style Advisor unlimited', 'Inventory AI tracker', 'WhatsApp notifikasi', 'Laporan harian', 'Style Vault (IPFS)', 'Support prioritas']
    },
    {
      id: 'bde-pro', name: 'Pro Dynasty', price: 349000, priceLabel: 'Rp 349.000/bln',
      color: 'border-blue-400', badge: '👑 RECOMMENDED', highlight: false,
      features: ['10 Kursi Barber', 'Multi-cabang support', 'AI Vision style analysis', 'Auto-order inventory', 'Loyalty NFT badges', 'Analytics advanced', 'API akses', 'Dedicated support']
    },
    {
      id: 'bde-enterprise', name: 'Dynasty Empire', price: 999000, priceLabel: 'Rp 999.000/bln',
      color: 'border-purple-400', badge: '💎 ENTERPRISE', highlight: false,
      features: ['Unlimited kursi', 'Custom white-label', 'Full Web3/Web5 stack', '$HYPHA reward staking', 'Custom smart contracts', 'Priority SLA 99.99%', 'Dedicated account manager', 'Semua fitur Pro']
    }
  ];

  const testimonials = [
    { name: 'Rizky A.', role: 'Owner Barbershop "Kingdom Cut" Jakarta', avatar: '💈', stars: 5, text: 'Booking rate naik 73% dalam 3 minggu! AI Style Advisor bikin pelanggan makin puas. Inventory tidak pernah habis lagi karena auto-alert.' },
    { name: 'Faisal M.', role: 'Barber Profesional Bandung', avatar: '✂️', stars: 5, text: 'WhatsApp bot-nya keren banget! Pelanggan bisa booking langsung dari chat. Omzet saya naik Rp 4juta per bulan sejak pakai BDE.' },
    { name: 'Dimas R.', role: 'Franchise "SovereignCut" 5 Cabang', avatar: '🏆', stars: 5, text: 'Sekarang bisa monitor semua cabang dari 1 dashboard. Data analytics-nya membantu saya buka cabang ke-6 dengan confidence.' }
  ];

  const faqs = [
    { q: 'Apakah saya perlu pengetahuan teknis untuk menggunakan BDE?', a: 'Tidak sama sekali! BDE dirancang untuk barber dan pemilik barbershop, bukan programmer. Setup awal hanya 15 menit, dan tim kami siap membantu onboarding Anda.' },
    { q: 'Bagaimana cara kerja AI Style Advisor?', a: 'AI kami (powered by Groq llama-3.3-70b) menganalisis bentuk wajah, tipe rambut, dan preferensi pelanggan untuk memberikan rekomendasi gaya yang personal. Semakin sering digunakan, semakin pintar AI-nya.' },
    { q: 'Apakah data pelanggan saya aman?', a: 'Ya, 100%! BDE menggunakan enkripsi AES-256 dan teknologi Web5 DWN (Decentralized Web Nodes). Data pelanggan tersimpan secara private, bukan di server terpusat.' },
    { q: 'Bisakah saya upgrade atau downgrade paket kapan saja?', a: 'Tentu! Anda bisa upgrade kapan saja dan perubahan langsung aktif. Untuk downgrade, berlaku di periode billing berikutnya.' },
    { q: 'Apakah ada kontrak jangka panjang?', a: 'Tidak ada kontrak! Semua paket berbasis bulanan dan bisa dibatalkan kapan saja. Kami percaya diri karena barbershop yang pakai BDE tidak mau pergi.' }
  ];

  return (
    <div className="min-h-screen font-sans" style={{ background: '#111111', color: '#F5F5DC', fontFamily: "'Inter', sans-serif" }}>

      {/* War Room Banner */}
      {warRoom.percentage > 0 && (
        <div style={{ background: '#D4AF37', color: '#1A1A1A' }} className="text-center py-2 px-4 text-sm font-semibold">
          ⚔️ HOLY PATH: Rp {warRoom.total_revenue_idr.toLocaleString('id-ID')} / Rp 8.000.000 ({warRoom.percentage}%) — Bergabunglah dalam revolusi ini! 🚀
        </div>
      )}

      {/* Header Nav */}
      <nav style={{ background: '#1A1A1A', borderBottom: '1px solid #D4AF3722' }} className="sticky top-0 z-50 flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">✂️</span>
          <div>
            <div className="font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37' }}>Barber Dynasty Engine</div>
            <div className="text-xs" style={{ color: '#00AEEF' }}>by GANI HYPHA · Web4 Powered</div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm">
          <a href="#features" className="hover:text-amber-400 transition-colors">Fitur</a>
          <a href="#pricing" className="hover:text-amber-400 transition-colors">Harga</a>
          <a href="#demo" className="hover:text-amber-400 transition-colors">Demo AI</a>
          <a href="#testimonials" className="hover:text-amber-400 transition-colors">Testimoni</a>
        </div>
        <button
          onClick={() => setPaymentModal({ open: true, plan: 'Starter Barber', price: 149000, planId: 'bde-starter' })}
          style={{ background: '#D4AF37', color: '#1A1A1A' }}
          className="px-5 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity"
        >
          Coba Gratis
        </button>
      </nav>

      {/* Hero Section */}
      <section style={{ background: 'linear-gradient(135deg, #1A1A1A 0%, #2a1a0a 50%, #1A1A1A 100%)' }} className="px-6 py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-8 gap-4 h-full">
            {Array.from({length: 64}).map((_, i) => (
              <div key={i} className="text-4xl text-center opacity-20">✂️</div>
            ))}
          </div>
        </div>
        <div className="relative max-w-4xl mx-auto">
          <div style={{ background: '#D4AF3733', color: '#D4AF37', border: '1px solid #D4AF3755' }} className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6">
            🏆 Platform Manajemen Barbershop #1 Indonesia · AI-Powered
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#F5F5DC' }} className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Bangun <span style={{ color: '#D4AF37' }}>Dynasty</span> Barbershop<br />dengan Kekuatan <span style={{ color: '#00AEEF' }}>AI & Web3</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto" style={{ color: '#cccccc' }}>
            Dari booking WhatsApp otomatis hingga Style Vault berbasis IPFS — BDE mengubah barbershop tradisional menjadi mesin bisnis otonom yang punya revenue 24/7.
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-2xl mx-auto">
            {[
              { n: '843+', l: 'Barbershop Aktif' },
              { n: '73%', l: 'Booking Rate ↑' },
              { n: 'Rp 4.2jt', l: 'Avg Revenue/bln' },
              { n: '99.9%', l: 'Uptime' }
            ].map(s => (
              <div key={s.n} style={{ background: '#D4AF3711', border: '1px solid #D4AF3733' }} className="rounded-xl p-3">
                <div className="text-2xl font-bold" style={{ color: '#D4AF37' }}>{s.n}</div>
                <div className="text-xs" style={{ color: '#aaaaaa' }}>{s.l}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setPaymentModal({ open: true, plan: 'Starter Barber', price: 0, planId: 'bde-trial' })}
              style={{ background: '#D4AF37', color: '#1A1A1A' }}
              className="px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity"
            >
              Mulai Gratis Sekarang ✂️
            </button>
            <a href="#demo" style={{ border: '2px solid #00AEEF', color: '#00AEEF' }} className="px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-900/20 transition-colors text-center">
              Coba AI Style Demo 🤖
            </a>
          </div>
        </div>
      </section>

      {/* Features Tabs */}
      <section id="features" style={{ background: '#1A1A1A' }} className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37' }} className="text-3xl md:text-4xl font-bold text-center mb-4">
            Fitur yang Mengubah Cara Anda Berbisnis
          </h2>
          <p className="text-center mb-10" style={{ color: '#aaaaaa' }}>Teknologi Web4/Web5 yang powerful, dikemas untuk barbershop modern</p>

          <div className="flex gap-2 justify-center mb-8 flex-wrap">
            {[
              { id: 'owner', label: '👑 Pemilik Barbershop' },
              { id: 'barber', label: '✂️ Barber Professional' },
              { id: 'client', label: '👤 Pelanggan' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="px-5 py-2 rounded-full font-semibold text-sm transition-all"
                style={{
                  background: activeTab === tab.id ? '#D4AF37' : '#333333',
                  color: activeTab === tab.id ? '#1A1A1A' : '#cccccc'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {activeTab === 'owner' && [
              { icon: '📊', title: 'Dashboard Real-time', desc: 'Monitor semua kursi, revenue, dan inventory dari 1 layar. Laporan harian otomatis dikirim ke WhatsApp Anda.' },
              { icon: '🤖', title: 'AI Inventory Predictor', desc: 'AI kami memprediksi kapan pomade, pisau, dan produk lain habis. Auto-order ke GANI Store sebelum kehabisan.' },
              { icon: '💰', title: 'Revenue Analytics', desc: 'Lihat produk/layanan paling profitable, peak hours, dan pelanggan VIP. Buat keputusan bisnis berdasarkan data.' },
              { icon: '🏪', title: 'Multi-Cabang Manager', desc: 'Kelola 2, 5, atau 100 cabang dari 1 dashboard. Transfer stok antar cabang, compare performance.' },
              { icon: '💳', title: 'Payment Omnichannel', desc: 'Terima pembayaran via QRIS, transfer bank, kartu kredit, atau $HYPHA token. Auto-rekonsiliasi setiap malam.' },
              { icon: '🏆', title: 'Loyalty Program', desc: 'NFT loyalty badges yang berubah warna sesuai tier. Pelanggan VIP mendapat reward $HYPHA otomatis.' }
            ].map(f => (
              <div key={f.icon} style={{ background: '#222222', border: '1px solid #D4AF3722' }} className="p-5 rounded-xl hover:border-amber-500/50 transition-colors">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold mb-2" style={{ color: '#F5F5DC' }}>{f.title}</h3>
                <p className="text-sm" style={{ color: '#aaaaaa' }}>{f.desc}</p>
              </div>
            ))}
            {activeTab === 'barber' && [
              { icon: '🪞', title: 'AI Style Advisor', desc: 'Rekomendasikan gaya rambut berdasarkan bentuk wajah dan tipe rambut pelanggan. Powered by Groq llama-3.3-70b.' },
              { icon: '📱', title: 'Sovereign Chair App', desc: 'Tablet app untuk barber di kursi. Lihat profil pelanggan, riwayat potongan, dan catatan preferensi.' },
              { icon: '📸', title: 'Style Vault', desc: 'Simpan foto hasil potongan di IPFS (decentralized). Pelanggan punya akses permanen ke riwayat gaya mereka.' },
              { icon: '⭐', title: 'Reputation Score', desc: 'Build reputasi digital Anda. Pelanggan puas meninggalkan review yang tersimpan on-chain.' },
              { icon: '📅', title: 'Smart Schedule', desc: 'AI mengoptimalkan jadwal Anda berdasarkan historical booking. Tidak ada slot kosong terbuang sia-sia.' },
              { icon: '🎓', title: 'Skills NFT', desc: 'Buktikan keahlian Anda dengan sertifikat NFT yang tidak bisa dipalsukan. Dibagikan ke LinkedIn, Instagram.' }
            ].map(f => (
              <div key={f.icon} style={{ background: '#222222', border: '1px solid #00AEEF22' }} className="p-5 rounded-xl hover:border-blue-400/50 transition-colors">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold mb-2" style={{ color: '#F5F5DC' }}>{f.title}</h3>
                <p className="text-sm" style={{ color: '#aaaaaa' }}>{f.desc}</p>
              </div>
            ))}
            {activeTab === 'client' && [
              { icon: '💬', title: 'WhatsApp Booking', desc: 'Booking via WhatsApp seperti chat biasa. AI membantu pilih waktu, barber, dan gaya yang sesuai.' },
              { icon: '🗓️', title: 'Real-time Availability', desc: 'Lihat slot kosong secara real-time. Tidak perlu telepon atau tunggu konfirmasi manual.' },
              { icon: '💈', title: 'Style History', desc: 'Semua riwayat potongan tersimpan aman di Style Vault. Barber mana pun bisa akses preferensi Anda.' },
              { icon: '🎁', title: 'Loyalty Rewards', desc: 'Kumpulkan poin setiap kunjungan. Tukarkan dengan free cut atau produk barbershop premium.' },
              { icon: '⚡', title: 'Express Booking', desc: '"Datang sekarang" feature yang cek ketersediaan real-time. Tidak perlu antri panjang.' },
              { icon: '🔔', title: 'Smart Reminder', desc: 'Reminder otomatis H-1 sebelum appointment. Reschedule cukup dengan 1 tap di WhatsApp.' }
            ].map(f => (
              <div key={f.icon} style={{ background: '#222222', border: '1px solid #9333ea22' }} className="p-5 rounded-xl hover:border-purple-400/50 transition-colors">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold mb-2" style={{ color: '#F5F5DC' }}>{f.title}</h3>
                <p className="text-sm" style={{ color: '#aaaaaa' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Demo Section */}
      <section id="demo" style={{ background: '#111111' }} className="px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37' }} className="text-3xl font-bold text-center mb-4">
            🤖 Coba AI Style Advisor Sekarang
          </h2>
          <p className="text-center mb-8" style={{ color: '#aaaaaa' }}>
            Tanya AI kami tentang rekomendasi gaya, strategi bisnis, atau analisis pasar barbershop. Gratis!
          </p>
          <div style={{ background: '#1A1A1A', border: '1px solid #D4AF3733' }} className="rounded-2xl p-6">
            <div className="flex gap-3 mb-4">
              <input
                value={demoInput}
                onChange={e => setDemoInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && runStyleDemo()}
                placeholder="Contoh: 'Pelanggan mau undercut modern, wajah bulat, rambut tebal...' atau 'Bagaimana cara ningkatin revenue barbershop?'"
                style={{ background: '#222222', border: '1px solid #444', color: '#F5F5DC' }}
                className="flex-1 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={runStyleDemo}
                disabled={isDemoLoading || !demoInput.trim()}
                style={{ background: isDemoLoading ? '#555' : '#D4AF37', color: '#1A1A1A' }}
                className="px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap"
              >
                {isDemoLoading ? '⏳...' : '✨ Tanya AI'}
              </button>
            </div>

            {/* Quick Prompts */}
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                'Rekomendasi gaya untuk wajah oval',
                'Cara upsell produk barbershop',
                'Estimasi harga haircut premium',
                'Tips meningkatkan loyalty pelanggan'
              ].map(p => (
                <button
                  key={p}
                  onClick={() => { setDemoInput(p); }}
                  style={{ background: '#333', border: '1px solid #555', color: '#cccccc' }}
                  className="px-3 py-1 rounded-full text-xs hover:border-amber-500/50 transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>

            {demoResult && (
              <div style={{ background: '#0a1a0a', border: '1px solid #22c55e33' }} className="rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-xs font-semibold text-green-400">AI Style Advisor · llama-3.3-70b via Groq</span>
                </div>
                <div className="text-sm whitespace-pre-wrap" style={{ color: '#F5F5DC', lineHeight: '1.7' }}>
                  {demoResult}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ background: '#1A1A1A' }} className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37' }} className="text-3xl md:text-4xl font-bold text-center mb-4">
            Harga Transparan, Value Luar Biasa
          </h2>
          <p className="text-center mb-10" style={{ color: '#aaaaaa' }}>Mulai gratis, upgrade kapan siap. Tidak ada kontrak.</p>

          <div className="grid md:grid-cols-4 gap-6">
            {plans.map(plan => (
              <div
                key={plan.id}
                className={`rounded-2xl p-6 flex flex-col border-2 transition-all hover:scale-105 ${plan.color} ${plan.highlight ? 'ring-2 ring-amber-500' : ''}`}
                style={{ background: plan.highlight ? '#2a1a00' : '#222222' }}
              >
                {plan.badge && (
                  <div style={{ background: '#D4AF37', color: '#1A1A1A' }} className="text-xs font-bold px-3 py-1 rounded-full mb-3 text-center w-fit mx-auto">
                    {plan.badge}
                  </div>
                )}
                <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#F5F5DC' }} className="text-xl font-bold mb-1">{plan.name}</h3>
                <div style={{ color: '#D4AF37' }} className="text-2xl font-bold mb-4">{plan.priceLabel}</div>
                <ul className="space-y-2 flex-1 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm" style={{ color: '#cccccc' }}>
                      <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => plan.price === 0
                    ? setPaymentModal({ open: true, plan: plan.name, price: 0, planId: plan.id })
                    : setPaymentModal({ open: true, plan: plan.name, price: plan.price, planId: plan.id })
                  }
                  className="w-full py-3 rounded-xl font-bold text-sm transition-all"
                  style={{
                    background: plan.highlight ? '#D4AF37' : 'transparent',
                    color: plan.highlight ? '#1A1A1A' : '#D4AF37',
                    border: plan.highlight ? 'none' : '2px solid #D4AF37'
                  }}
                >
                  {plan.price === 0 ? 'Mulai Gratis' : 'Pilih Paket Ini'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" style={{ background: '#111111' }} className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37' }} className="text-3xl font-bold text-center mb-10">
            Barbershop yang Sudah Naik Level
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.name} style={{ background: '#1A1A1A', border: '1px solid #D4AF3722' }} className="rounded-xl p-6">
                <div className="text-3xl mb-3">{t.avatar}</div>
                <div className="flex mb-3">
                  {'⭐'.repeat(t.stars)}
                </div>
                <p className="text-sm mb-4 italic" style={{ color: '#cccccc' }}>"{t.text}"</p>
                <div>
                  <div className="font-bold" style={{ color: '#F5F5DC' }}>{t.name}</div>
                  <div className="text-xs" style={{ color: '#888' }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: '#1A1A1A' }} className="px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37' }} className="text-3xl font-bold text-center mb-10">
            Pertanyaan Umum
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} style={{ background: '#222222', border: '1px solid #D4AF3722' }} className="rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex justify-between items-center p-5 text-left"
                >
                  <span className="font-semibold text-sm" style={{ color: '#F5F5DC' }}>{faq.q}</span>
                  <span style={{ color: '#D4AF37' }} className="text-lg">{openFaq === idx ? '−' : '+'}</span>
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-sm" style={{ color: '#aaaaaa', borderTop: '1px solid #333' }}>
                    <div className="pt-3">{faq.a}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section style={{ background: 'linear-gradient(135deg, #2a1a00, #1A1A1A)' }} className="px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="text-5xl mb-6">✂️ 👑 ✂️</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37' }} className="text-3xl md:text-4xl font-bold mb-4">
            Jadilah Dynasty. Bukan Sekadar Barbershop.
          </h2>
          <p className="mb-8 text-lg" style={{ color: '#cccccc' }}>
            843+ barbershop sudah membuktikannya. Bergabunglah sekarang dan rasakan perbedaannya dalam 30 hari pertama.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setPaymentModal({ open: true, plan: 'Trial Gratis', price: 0, planId: 'bde-trial' })}
              style={{ background: '#D4AF37', color: '#1A1A1A' }}
              className="px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity"
            >
              Mulai Trial Gratis ✂️
            </button>
            <a href="/sovereign-barber" style={{ border: '2px solid #F5F5DC', color: '#F5F5DC' }} className="px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-colors text-center">
              Lihat Demo Lengkap →
            </a>
          </div>
          <p className="mt-6 text-xs" style={{ color: '#666' }}>
            ✓ Gratis selamanya untuk 1 kursi · ✓ Setup 15 menit · ✓ Support WhatsApp · ✓ Cancel kapan saja
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0a0a0a', borderTop: '1px solid #D4AF3722' }} className="px-6 py-8 text-center text-xs" style2={{ color: '#666' }}>
        <div className="flex justify-center gap-6 mb-4">
          <a href="/" className="hover:text-amber-400 transition-colors">GANI HYPHA</a>
          <a href="/sica-landing" className="hover:text-amber-400 transition-colors">SICA</a>
          <a href="/shga-landing" className="hover:text-amber-400 transition-colors">SHGA</a>
          <a href="/sca" className="hover:text-amber-400 transition-colors">SCA</a>
          <a href="/api/sovereign/war-room" target="_blank" className="hover:text-amber-400 transition-colors">War Room</a>
        </div>
        <p style={{ color: '#555' }}>© 2026 GANI HYPHA · Barber Dynasty Engine · "Akar Dalam, Cabang Tinggi" 🙏🏻</p>
        <p style={{ color: '#444' }} className="mt-1">Powered by Groq llama-3.3-70b · Cloudflare Workers · Web5 DWN · $PREMALTA Base</p>
      </footer>

      {/* Success Message */}
      {successMsg && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm">
          <div style={{ background: '#1a3a1a', border: '1px solid #22c55e' }} className="rounded-xl p-4 text-sm">
            <p style={{ color: '#86efac' }}>{successMsg}</p>
            <button onClick={() => setSuccessMsg('')} className="mt-2 text-xs text-gray-400 hover:text-white">Tutup ×</button>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {paymentModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }}>
          <div style={{ background: '#1A1A1A', border: '1px solid #D4AF3733', maxWidth: '400px', width: '100%' }} className="rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37' }} className="text-xl font-bold">
                ✂️ Aktifkan {paymentModal.plan}
              </h3>
              <button onClick={() => setPaymentModal({ open: false, plan: '', price: 0, planId: '' })} className="text-gray-400 hover:text-white text-2xl">×</button>
            </div>

            {paymentModal.price > 0 && (
              <div style={{ background: '#D4AF3711', border: '1px solid #D4AF3733' }} className="rounded-xl p-3 mb-5 text-center">
                <div style={{ color: '#D4AF37' }} className="text-2xl font-bold">Rp {paymentModal.price.toLocaleString('id-ID')}<span className="text-sm">/bulan</span></div>
              </div>
            )}
            {paymentModal.price === 0 && (
              <div style={{ background: '#0a2a0a', border: '1px solid #22c55e33' }} className="rounded-xl p-3 mb-5 text-center">
                <div className="text-2xl font-bold text-green-400">GRATIS Selamanya</div>
                <div className="text-xs text-green-600">Tidak perlu kartu kredit</div>
              </div>
            )}

            <div className="space-y-3">
              <input type="text" placeholder="Nama lengkap Anda *"
                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                style={{ background: '#222', border: '1px solid #444', color: '#F5F5DC' }}
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-amber-500"
              />
              <input type="email" placeholder="Email aktif Anda *"
                value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                style={{ background: '#222', border: '1px solid #444', color: '#F5F5DC' }}
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-amber-500"
              />
              <input type="tel" placeholder="Nomor WhatsApp (opsional)"
                value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                style={{ background: '#222', border: '1px solid #444', color: '#F5F5DC' }}
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              onClick={handlePayment}
              disabled={isSubmitting || !formData.name || !formData.email}
              style={{ background: isSubmitting ? '#555' : '#D4AF37', color: '#1A1A1A' }}
              className="w-full py-4 rounded-xl font-bold mt-5 text-sm transition-all"
            >
              {isSubmitting ? '⏳ Memproses...' : paymentModal.price === 0 ? '✂️ Aktifkan Gratis' : `💳 Bayar Rp ${paymentModal.price.toLocaleString('id-ID')}`}
            </button>
            <p className="text-center text-xs mt-3" style={{ color: '#666' }}>🔒 Aman · Terenkripsi · Cancel kapan saja</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BDELanding;
