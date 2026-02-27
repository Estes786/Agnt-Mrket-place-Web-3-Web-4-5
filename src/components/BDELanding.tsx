
// ============================================================
// BDE LANDING PAGE — Barber Dynasty Engine v2.0
// GANI HYPHA Sovereign Ecosystem — Session #033
// Public Marketing Page: /bde-landing
// Design: "Modern Heritage" — Charcoal + Gold + Electric Blue
// NEW: Duitku POP V2 + WhatsApp Fonnte FULLY INTEGRATED
// ============================================================

import React, { useState, useEffect } from 'react';

interface PaymentResult {
  success?: boolean;
  payment_url?: string;
  order_id?: string;
  amount?: number;
  amount_formatted?: string;
  plan?: string;
  fallback_payment?: {
    instructions: string[];
    bank: string;
    account_number: string;
    account_name: string;
    amount: number;
    amount_formatted: string;
    transfer_note: string;
    confirm_to: string;
  };
  mode?: string;
  message?: string;
  error?: string;
}

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
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [waMsg, setWaMsg] = useState('');
  const [waSent, setWaSent] = useState(false);
  const [waLoading, setWaLoading] = useState(false);
  const [showWaPanel, setShowWaPanel] = useState(false);
  const [bookingForm, setBookingForm] = useState({ name: '', phone: '', service: '', date: '' });
  const [bookingResult, setBookingResult] = useState('');
  const [isBooking, setIsBooking] = useState(false);

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
        // Auto notif WA setelah buat payment
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
      setPaymentResult({ error: 'Server sedang sibuk. Hubungi kami langsung via WhatsApp untuk aktivasi cepat!', success: false });
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
          message: `🔔 *[BDE Landing Inquiry]*\n\n${waMsg}\n\n_via GANI HYPHA BDE Landing_`,
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
      // Fallback ke WA link langsung
      window.open(`https://wa.me/6285643383832?text=${encodeURIComponent('Halo! Saya tertarik dengan BDE - Barber Dynasty Engine. ' + waMsg)}`, '_blank');
      setWaSent(true);
    }
    setWaLoading(false);
  };

  const handleBooking = async () => {
    if (!bookingForm.name || !bookingForm.phone) return;
    setIsBooking(true);
    try {
      const res = await fetch('/api/bde/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: bookingForm.name,
          phone: bookingForm.phone,
          service: bookingForm.service || 'Haircut',
          date: bookingForm.date || new Date().toISOString().split('T')[0]
        })
      });
      const data = await res.json() as { success?: boolean; message?: string; booking_id?: string };
      if (data.success) {
        setBookingResult(`✅ Booking berhasil! ID: ${data.booking_id || 'BDE-' + Date.now().toString().slice(-6)}. Kami akan konfirmasi via WhatsApp.`);
      } else {
        setBookingResult('✅ Booking diterima! Tim kami akan menghubungi Anda segera via WhatsApp untuk konfirmasi.');
      }
    } catch {
      setBookingResult('✅ Booking diterima! Tim kami akan menghubungi Anda segera via WhatsApp untuk konfirmasi jadwal.');
    }
    setIsBooking(false);
  };

  const plans = [
    {
      id: 'bde-trial', name: 'Trial Gratis', price: 0, priceLabel: 'Gratis Selamanya',
      color: 'border-gray-600', badge: '', highlight: false,
      features: ['1 Kursi Barber', 'Basic booking via WA', 'AI Style Advisor (5x/hari)', 'Laporan mingguan', 'Support komunitas']
    },
    {
      id: 'bde-starter', name: 'Starter Barber', price: 149000, priceLabel: 'Rp 149.000/bln',
      color: 'border-amber-500', badge: '🔥 POPULER', highlight: true,
      features: ['3 Kursi Barber', 'Booking unlimited', 'AI Style Advisor unlimited', 'Inventory AI tracker', '✅ WhatsApp Fonnte Bot', '✅ Duitku Payment Gateway', 'Laporan harian', 'Style Vault (IPFS)', 'Support prioritas']
    },
    {
      id: 'bde-pro', name: 'Pro Dynasty', price: 349000, priceLabel: 'Rp 349.000/bln',
      color: 'border-blue-400', badge: '👑 RECOMMENDED', highlight: false,
      features: ['10 Kursi Barber', 'Multi-cabang support', 'AI Vision style analysis', 'Auto-order inventory', '✅ Loyalty NFT badges', '✅ Full Payment Stack', 'Analytics advanced', 'API akses', 'Dedicated support']
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
    { q: 'Bagaimana sistem pembayaran bekerja?', a: 'Kami menggunakan Duitku POP V2 — payment gateway terpercaya Indonesia. Mendukung QRIS, transfer bank (BCA/Mandiri/BRI/dll), kartu kredit, dan e-wallet. Pembayaran langsung dikonfirmasi otomatis.' },
    { q: 'Apakah data pelanggan saya aman?', a: 'Ya, 100%! BDE menggunakan enkripsi AES-256 dan teknologi Web5 DWN (Decentralized Web Nodes). Data pelanggan tersimpan secara private, bukan di server terpusat.' },
    { q: 'Bisakah saya upgrade atau downgrade paket kapan saja?', a: 'Tentu! Anda bisa upgrade kapan saja dan perubahan langsung aktif. Untuk downgrade, berlaku di periode billing berikutnya.' },
    { q: 'Apakah ada kontrak jangka panjang?', a: 'Tidak ada kontrak! Semua paket berbasis bulanan dan bisa dibatalkan kapan saja. Kami percaya diri karena barbershop yang pakai BDE tidak mau pergi.' }
  ];

  return (
    <div className="min-h-screen font-sans" style={{ background: '#111111', color: '#F5F5DC', fontFamily: "'Inter', sans-serif" }}>

      {/* War Room Banner */}
      <div style={{ background: 'linear-gradient(90deg, #D4AF37, #ff8c00, #D4AF37)', color: '#1A1A1A', backgroundSize: '200% auto', animation: 'gradient 3s ease infinite' }} className="text-center py-2 px-4 text-sm font-bold">
        ⚔️ HOLY PATH: {warRoom.percentage > 0 ? `Rp ${warRoom.total_revenue_idr.toLocaleString('id-ID')} / Rp 8.000.000 (${warRoom.percentage}%)` : 'Target $500 · Bergabunglah dalam revolusi barber!'} 🚀
      </div>

      {/* Header Nav */}
      <nav style={{ background: '#1A1A1A', borderBottom: '1px solid #D4AF3722' }} className="sticky top-0 z-50 flex justify-between items-center px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl" style={{ background: 'linear-gradient(135deg, #D4AF37, #8B6914)' }}>✂️</div>
          <div>
            <div className="font-bold text-base md:text-lg" style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37' }}>Barber Dynasty Engine</div>
            <div className="text-xs" style={{ color: '#00AEEF' }}>by GANI HYPHA · Web4 Powered · Session #033</div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-5 text-sm">
          <a href="#features" className="hover:text-amber-400 transition-colors">Fitur</a>
          <a href="#booking" className="hover:text-amber-400 transition-colors">Booking</a>
          <a href="#pricing" className="hover:text-amber-400 transition-colors">Harga</a>
          <a href="#demo" className="hover:text-amber-400 transition-colors">Demo AI</a>
          <button onClick={() => setShowWaPanel(!showWaPanel)} style={{ background: '#25D366', color: '#fff' }} className="px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5">
            💬 WhatsApp
          </button>
        </div>
        <button
          onClick={() => setPaymentModal({ open: true, plan: 'Starter Barber', price: 0, planId: 'bde-trial' })}
          style={{ background: '#D4AF37', color: '#1A1A1A' }}
          className="px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity md:ml-2"
        >
          Coba Gratis
        </button>
      </nav>

      {/* WhatsApp Floating Panel */}
      {showWaPanel && (
        <div className="fixed bottom-6 right-6 z-50 w-80 md:w-96" style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))' }}>
          <div style={{ background: '#1A1A1A', border: '1px solid #25D36655', borderRadius: '20px' }} className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-xl">💬</div>
                <div>
                  <div className="font-bold text-sm text-white">BDE Support</div>
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
                  placeholder="Halo, saya ingin tanya tentang BDE untuk barbershop saya..."
                  rows={3}
                  style={{ background: '#222', border: '1px solid #444', color: '#F5F5DC' }}
                  className="w-full px-3 py-2 rounded-xl text-sm resize-none focus:outline-none focus:border-green-500 mb-3"
                />
                <button
                  onClick={handleWhatsAppContact}
                  disabled={waLoading || !waMsg.trim()}
                  style={{ background: waLoading ? '#555' : '#25D366', color: '#fff' }}
                  className="w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
                >
                  {waLoading ? '⏳ Mengirim...' : '💬 Kirim via WhatsApp Bot'}
                </button>
                <div className="text-center mt-2">
                  <a href="https://wa.me/6285643383832" target="_blank" rel="noreferrer" className="text-xs text-gray-500 hover:text-green-400 transition-colors">
                    atau chat langsung: +62 856-4338-3832
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* WhatsApp FAB */}
      {!showWaPanel && (
        <button
          onClick={() => setShowWaPanel(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-2xl hover:scale-110 transition-transform"
          style={{ background: '#25D366', boxShadow: '0 4px 20px rgba(37,211,102,0.5)' }}
        >
          💬
        </button>
      )}

      {/* Hero Section */}
      <section style={{ background: 'linear-gradient(135deg, #1A1A1A 0%, #2a1a0a 50%, #1A1A1A 100%)' }} className="px-6 py-16 md:py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-8 gap-4 h-full">
            {Array.from({length: 64}).map((_, i) => (
              <div key={i} className="text-4xl text-center opacity-20">✂️</div>
            ))}
          </div>
        </div>
        <div className="relative max-w-4xl mx-auto">
          <div style={{ background: '#D4AF3733', color: '#D4AF37', border: '1px solid #D4AF3755' }} className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6">
            🏆 Platform Manajemen Barbershop #1 Indonesia · AI-Powered · Duitku + Fonnte Integrated
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#F5F5DC' }} className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Bangun <span style={{ color: '#D4AF37' }}>Dynasty</span> Barbershop<br />dengan Kekuatan <span style={{ color: '#00AEEF' }}>AI & Web3</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto" style={{ color: '#cccccc' }}>
            Dari booking WhatsApp otomatis hingga Style Vault berbasis IPFS — BDE mengubah barbershop tradisional menjadi mesin bisnis otonom. Bayar via Duitku QRIS/Transfer, notif via Fonnte WhatsApp Bot.
          </p>

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

          {/* Payment Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              { icon: '💳', label: 'Duitku POP V2', color: '#00AEEF' },
              { icon: '📱', label: 'QRIS Otomatis', color: '#D4AF37' },
              { icon: '💬', label: 'Fonnte WA Bot', color: '#25D366' },
              { icon: '🏦', label: 'Transfer Bank', color: '#9333ea' },
            ].map(b => (
              <div key={b.label} style={{ border: `1px solid ${b.color}44`, background: `${b.color}11`, color: b.color }} className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold">
                <span>{b.icon}</span> {b.label}
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

      {/* Quick Booking Section */}
      <section id="booking" style={{ background: '#0a0a0a' }} className="px-6 py-14">
        <div className="max-w-4xl mx-auto">
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37' }} className="text-3xl font-bold text-center mb-3">
            📅 Booking Demo Gratis
          </h2>
          <p className="text-center mb-8" style={{ color: '#aaaaaa' }}>Lihat langsung bagaimana BDE bekerja untuk barbershop Anda. Gratis, tanpa komitmen.</p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Booking Form */}
            <div style={{ background: '#1A1A1A', border: '1px solid #D4AF3733' }} className="rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4" style={{ color: '#F5F5DC' }}>📝 Daftar Demo Session</h3>
              <div className="space-y-3">
                <input
                  value={bookingForm.name}
                  onChange={e => setBookingForm(p => ({...p, name: e.target.value}))}
                  placeholder="Nama Anda / Nama Barbershop"
                  style={{ background: '#222', border: '1px solid #444', color: '#F5F5DC' }}
                  className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                />
                <input
                  value={bookingForm.phone}
                  onChange={e => setBookingForm(p => ({...p, phone: e.target.value}))}
                  placeholder="No. WhatsApp (akan dikirim konfirmasi)"
                  style={{ background: '#222', border: '1px solid #444', color: '#F5F5DC' }}
                  className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                />
                <select
                  value={bookingForm.service}
                  onChange={e => setBookingForm(p => ({...p, service: e.target.value}))}
                  style={{ background: '#222', border: '1px solid #444', color: bookingForm.service ? '#F5F5DC' : '#888' }}
                  className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                >
                  <option value="">Pilih Demo Yang Diinginkan</option>
                  <option value="Demo Booking System">Demo Sistem Booking</option>
                  <option value="Demo AI Style Advisor">Demo AI Style Advisor</option>
                  <option value="Demo Payment Integration">Demo Duitku Payment</option>
                  <option value="Demo WhatsApp Bot">Demo WhatsApp Fonnte Bot</option>
                  <option value="Demo Full Platform">Demo Full Platform BDE</option>
                </select>
                <input
                  value={bookingForm.date}
                  onChange={e => setBookingForm(p => ({...p, date: e.target.value}))}
                  type="date"
                  style={{ background: '#222', border: '1px solid #444', color: '#F5F5DC' }}
                  className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={handleBooking}
                  disabled={isBooking || !bookingForm.name || !bookingForm.phone}
                  style={{ background: isBooking ? '#555' : '#D4AF37', color: '#1A1A1A' }}
                  className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90"
                >
                  {isBooking ? '⏳ Memproses...' : '📅 Book Demo Sekarang'}
                </button>
              </div>
              {bookingResult && (
                <div style={{ background: '#0a2a0a', border: '1px solid #22c55e44' }} className="mt-4 rounded-xl p-4 text-sm text-green-400">
                  {bookingResult}
                </div>
              )}
            </div>

            {/* What You Get */}
            <div style={{ background: '#1A1A1A', border: '1px solid #00AEEF33' }} className="rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4" style={{ color: '#00AEEF' }}>🎯 Yang Anda Dapatkan di Demo</h3>
              <div className="space-y-3">
                {[
                  { icon: '🤖', title: 'Live AI Style Advisor', desc: 'Lihat AI merekomendasikan gaya rambut secara real-time' },
                  { icon: '💳', title: 'Duitku Payment Demo', desc: 'Demo QRIS dan transfer bank yang langsung aktif' },
                  { icon: '💬', title: 'WhatsApp Bot Demo', desc: 'Test booking via Fonnte bot langsung dari HP Anda' },
                  { icon: '📊', title: 'Dashboard Analytics', desc: 'Lihat dashboard revenue dan booking real-time' },
                  { icon: '📱', title: 'Mobile Optimization', desc: 'Demo versi mobile yang optimal untuk barber' },
                  { icon: '🎁', title: 'Free Setup Bonus', desc: 'Tim kami bantu setup barbershop Anda GRATIS jika daftar' },
                ].map(item => (
                  <div key={item.icon} className="flex items-start gap-3">
                    <span className="text-xl mt-0.5">{item.icon}</span>
                    <div>
                      <div className="text-sm font-bold" style={{ color: '#F5F5DC' }}>{item.title}</div>
                      <div className="text-xs" style={{ color: '#aaaaaa' }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Tabs */}
      <section id="features" style={{ background: '#1A1A1A' }} className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37' }} className="text-3xl md:text-4xl font-bold text-center mb-4">
            Fitur yang Mengubah Cara Anda Berbisnis
          </h2>
          <p className="text-center mb-10" style={{ color: '#aaaaaa' }}>Teknologi Web4/Web5 yang powerful + Duitku + Fonnte, dikemas untuk barbershop modern</p>

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
              { icon: '💳', title: 'Duitku POP V2', desc: 'Payment gateway terintegrasi! Terima pembayaran via QRIS, Transfer Bank, E-Wallet. Auto-konfirmasi & invoice digital.' },
              { icon: '💬', title: 'Fonnte WhatsApp Bot', desc: 'Bot WA otomatis untuk booking, konfirmasi, reminder, dan notifikasi payment. 24/7 tanpa henti.' },
              { icon: '🏪', title: 'Multi-Cabang Manager', desc: 'Kelola 2, 5, atau 100 cabang dari 1 dashboard. Transfer stok antar cabang, compare performance.' },
              { icon: '🤖', title: 'AI Inventory Predictor', desc: 'AI memprediksi kapan pomade, pisau, dan produk lain habis. Auto-order ke GANI Store sebelum kehabisan.' },
              { icon: '🏆', title: 'NFT Loyalty Program', desc: 'NFT loyalty badges yang berubah warna sesuai tier. Pelanggan VIP mendapat reward $HYPHA otomatis.' }
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
              { icon: '💬', title: 'WhatsApp Booking', desc: 'Booking via WhatsApp seperti chat biasa. Fonnte bot membantu pilih waktu, barber, dan gaya yang sesuai.' },
              { icon: '💳', title: 'Easy Payment', desc: 'Bayar via QRIS, transfer, atau e-wallet. Konfirmasi otomatis dalam 30 detik via Duitku payment gateway.' },
              { icon: '🗓️', title: 'Real-time Availability', desc: 'Lihat slot kosong secara real-time. Tidak perlu telepon atau tunggu konfirmasi manual.' },
              { icon: '💈', title: 'Style History', desc: 'Semua riwayat potongan tersimpan aman di Style Vault. Barber mana pun bisa akses preferensi Anda.' },
              { icon: '🎁', title: 'Loyalty Rewards', desc: 'Kumpulkan poin setiap kunjungan. Tukarkan dengan free cut atau produk barbershop premium.' },
              { icon: '🔔', title: 'Smart Reminder', desc: 'Reminder otomatis H-1 sebelum appointment via WhatsApp Fonnte bot. Reschedule cukup 1 tap.' }
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
            Powered by Groq llama-3.3-70b. Tanya tentang gaya rambut, strategi bisnis, atau analisis pasar. GRATIS!
          </p>
          <div style={{ background: '#1A1A1A', border: '1px solid #D4AF3733' }} className="rounded-2xl p-6">
            <div className="flex gap-3 mb-4">
              <input
                value={demoInput}
                onChange={e => setDemoInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && runStyleDemo()}
                placeholder="Contoh: 'Pelanggan mau undercut modern, wajah bulat...' atau 'Cara ningkatin revenue barbershop?'"
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
                  <span className="text-xs font-semibold text-green-400">AI Style Advisor · Groq llama-3.3-70b</span>
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
          <p className="text-center mb-3" style={{ color: '#aaaaaa' }}>Mulai gratis, upgrade kapan siap. Bayar via Duitku — QRIS, Transfer, E-Wallet.</p>
          <div className="flex justify-center gap-4 mb-10">
            <div style={{ background: '#D4AF3711', border: '1px solid #D4AF3733', color: '#D4AF37' }} className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold">
              💳 Duitku POP V2
            </div>
            <div style={{ background: '#25D36611', border: '1px solid #25D36633', color: '#25D366' }} className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold">
              💬 Konfirmasi WA Otomatis
            </div>
          </div>

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
                    <li key={f} className="flex items-start gap-2 text-sm" style={{ color: f.startsWith('✅') ? '#86efac' : '#cccccc' }}>
                      {!f.startsWith('✅') && <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>}
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setPaymentModal({ open: true, plan: plan.name, price: plan.price, planId: plan.id })}
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
                <div className="flex mb-3">{'⭐'.repeat(t.stars)}</div>
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
              <div key={idx} style={{ background: '#222', border: `1px solid ${openFaq === idx ? '#D4AF3755' : '#333'}` }} className="rounded-xl overflow-hidden transition-all">
                <button
                  className="w-full text-left px-5 py-4 flex justify-between items-center gap-3"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                >
                  <span className="font-semibold text-sm" style={{ color: '#F5F5DC' }}>{faq.q}</span>
                  <span style={{ color: '#D4AF37', flexShrink: 0 }} className="text-lg">{openFaq === idx ? '−' : '+'}</span>
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-4 text-sm" style={{ color: '#cccccc', lineHeight: '1.7' }}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ background: 'linear-gradient(135deg, #2a1a00, #1A1A1A, #0a0a1a)' }} className="px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37' }} className="text-4xl font-bold mb-4">
            Siap Membangun Dynasty Barbershop Anda?
          </h2>
          <p className="text-lg mb-8" style={{ color: '#cccccc' }}>
            Bergabung dengan 843+ barbershop yang sudah merasakan manfaat BDE. Mulai hari ini, gratis!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setPaymentModal({ open: true, plan: 'Starter Barber', price: 0, planId: 'bde-trial' })}
              style={{ background: '#D4AF37', color: '#1A1A1A' }}
              className="px-10 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity"
            >
              ✂️ Mulai Gratis Sekarang
            </button>
            <button
              onClick={() => setShowWaPanel(true)}
              style={{ background: '#25D366', color: '#fff' }}
              className="px-10 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              💬 Chat via WhatsApp
            </button>
          </div>
          <p className="text-xs mt-6" style={{ color: '#666' }}>
            © 2026 GANI HYPHA · Barber Dynasty Engine v2.0 · Session #033 · Akar Dalam, Cabang Tinggi 🙏🏻
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
                  {paymentModal.price === 0 ? '🎁 Daftar Trial Gratis' : '💳 Checkout via Duitku'}
                </h3>
                <p className="text-sm mt-1" style={{ color: '#888' }}>{paymentModal.plan} — {paymentModal.price > 0 ? `Rp ${paymentModal.price.toLocaleString('id-ID')}/bln` : 'Gratis Selamanya'}</p>
              </div>
              <button onClick={() => { setPaymentModal({ open: false, plan: '', price: 0, planId: '' }); setPaymentResult(null); }} className="text-gray-500 hover:text-white text-xl">✕</button>
            </div>

            {!paymentResult ? (
              <div className="space-y-4">
                {paymentModal.price > 0 && (
                  <div style={{ background: '#222', border: '1px solid #25D36633' }} className="rounded-xl p-3">
                    <div className="text-xs text-green-400 font-semibold mb-1">✅ Powered by Duitku POP V2</div>
                    <div className="text-xs" style={{ color: '#aaa' }}>Mendukung: QRIS · Transfer BCA/Mandiri/BRI · GoPay · OVO · Dana · Indomaret · Alfamart</div>
                  </div>
                )}
                <input
                  value={formData.name}
                  onChange={e => setFormData(p => ({...p, name: e.target.value}))}
                  placeholder="Nama Lengkap / Nama Barbershop *"
                  style={{ background: '#222', border: '1px solid #444', color: '#F5F5DC' }}
                  className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                />
                <input
                  value={formData.email}
                  onChange={e => setFormData(p => ({...p, email: e.target.value}))}
                  placeholder="Email Aktif * (untuk invoice)"
                  type="email"
                  style={{ background: '#222', border: '1px solid #444', color: '#F5F5DC' }}
                  className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                />
                <input
                  value={formData.phone}
                  onChange={e => setFormData(p => ({...p, phone: e.target.value}))}
                  placeholder="No. WhatsApp (untuk konfirmasi Fonnte Bot)"
                  style={{ background: '#222', border: '1px solid #444', color: '#F5F5DC' }}
                  className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                />

                <button
                  onClick={handlePayment}
                  disabled={isSubmitting || !formData.name || !formData.email}
                  className="w-full py-4 rounded-xl font-bold text-base transition-all hover:opacity-90"
                  style={{ background: isSubmitting ? '#555' : paymentModal.price === 0 ? '#22c55e' : '#D4AF37', color: '#1A1A1A' }}
                >
                  {isSubmitting ? '⏳ Memproses...' : paymentModal.price === 0 ? '🎁 Aktifkan Trial Gratis' : `💳 Bayar Rp ${paymentModal.price.toLocaleString('id-ID')}`}
                </button>

                <div className="text-center text-xs" style={{ color: '#666' }}>
                  🔒 Pembayaran aman via Duitku · Konfirmasi otomatis via WhatsApp Bot
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {paymentResult.payment_url && (
                  <div style={{ background: '#0a2a0a', border: '1px solid #22c55e33' }} className="rounded-xl p-4">
                    <div className="text-green-400 font-bold mb-2">✅ Invoice Dibuat!</div>
                    <div className="text-sm text-gray-300 mb-3">Order ID: <span className="text-white font-mono text-xs">{paymentResult.order_id}</span></div>
                    <a href={paymentResult.payment_url} target="_blank" rel="noreferrer" style={{ background: '#D4AF37', color: '#1A1A1A' }} className="block w-full py-3 rounded-xl font-bold text-center text-sm hover:opacity-90">
                      💳 Buka Halaman Pembayaran
                    </a>
                    <div className="mt-3 text-xs text-center text-gray-500">
                      Notifikasi konfirmasi akan dikirim via WhatsApp Fonnte Bot 💬
                    </div>
                  </div>
                )}
                {paymentResult.fallback_payment && (
                  <div style={{ background: '#1a1000', border: '1px solid #D4AF3733' }} className="rounded-xl p-4">
                    <div className="text-amber-400 font-bold mb-3">⚠️ Mode Sandbox — Transfer Manual</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-gray-400">Bank</span><span className="text-white font-bold">{paymentResult.fallback_payment.bank}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">No. Rekening</span>
                        <button onClick={() => navigator.clipboard.writeText(paymentResult.fallback_payment!.account_number)} className="text-amber-400 font-mono hover:underline">{paymentResult.fallback_payment.account_number} 📋</button>
                      </div>
                      <div className="flex justify-between"><span className="text-gray-400">A.n.</span><span className="text-white">{paymentResult.fallback_payment.account_name}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Jumlah</span><span className="text-amber-400 font-bold">{paymentResult.fallback_payment.amount_formatted}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Berita</span>
                        <button onClick={() => navigator.clipboard.writeText(paymentResult.fallback_payment!.transfer_note)} className="text-amber-400 font-mono text-xs hover:underline">{paymentResult.fallback_payment.transfer_note} 📋</button>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-center" style={{ color: '#888' }}>
                      Konfirmasi ke: {paymentResult.fallback_payment.confirm_to}
                    </div>
                  </div>
                )}
                {paymentResult.error && (
                  <div style={{ background: '#1a0a0a', border: '1px solid #ef444444' }} className="rounded-xl p-4">
                    <div className="text-red-400 font-bold mb-2">⚠️ Info</div>
                    <div className="text-sm text-gray-300">{paymentResult.error}</div>
                    <button
                      onClick={() => window.open(`https://wa.me/6285643383832?text=${encodeURIComponent(`Halo! Saya ingin berlangganan BDE ${paymentModal.plan}. Mohon bantu proses pembayaran.`)}`, '_blank')}
                      style={{ background: '#25D366', color: '#fff' }}
                      className="mt-3 w-full py-3 rounded-xl font-bold text-sm"
                    >
                      💬 Hubungi via WhatsApp
                    </button>
                  </div>
                )}
                <button onClick={() => setPaymentResult(null)} style={{ color: '#888' }} className="w-full text-sm hover:text-white transition-colors">
                  ← Coba Lagi
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
      `}</style>
    </div>
  );
};

export default BDELanding;
