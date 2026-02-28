// ============================================================
// SMA LANDING PAGE — Sovereign Multi-Industry Agent
// GANI HYPHA Sovereign Ecosystem — Session #035
// Public Marketing Page: /sma-landing
// Design: "Emerald Sovereign" — Dark + Teal + Gold
// Duitku POP V2 + Sandbox Mode FULLY INTEGRATED
// ============================================================

import React, { useState } from 'react';

interface PaymentResult {
  success?: boolean;
  payment_url?: string;
  order_id?: string;
  amount?: number;
  amount_formatted?: string;
  plan?: string;
  mode?: string;
  message?: string;
  error?: string;
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
}

const SMALanding: React.FC = () => {
  const [paymentModal, setPaymentModal] = useState<{ open: boolean; plan: string; price: number; planId: string }>({
    open: false, plan: '', price: 0, planId: ''
  });
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const PLANS = [
    {
      id: 'sma-trial',
      name: 'SMA Trial',
      price: 0,
      period: '',
      badge: '🆓 GRATIS',
      badgeColor: 'bg-gray-700 text-gray-300',
      features: [
        'Akses 2 Agent (pilihan)',
        'Unified Dashboard (read-only)',
        'AI Query 10x/hari',
        'Cross-agent analytics dasar',
        'Tidak perlu kartu kredit',
      ],
      cta: 'Mulai Gratis 7 Hari',
      highlight: false,
    },
    {
      id: 'sma-starter',
      name: 'SMA Starter Bundle',
      price: 499000,
      period: '/bulan',
      badge: '⭐ BUNDEL HEMAT',
      badgeColor: 'bg-teal-900/60 text-teal-300',
      features: [
        'Bundle 2 agent pilihan (SCA+SICA / SHGA+BDE)',
        'Unified Dashboard lengkap',
        'AI unlimited untuk kedua agent',
        'Cross-agent analytics',
        'WhatsApp notifikasi 100x/bln',
        'Priority support email',
      ],
      cta: 'Pilih Paket Ini',
      highlight: false,
    },
    {
      id: 'sma-pro',
      name: 'SMA Professional',
      price: 999000,
      period: '/bulan',
      badge: '👑 PALING POPULER',
      badgeColor: 'bg-emerald-900/60 text-emerald-300',
      features: [
        'SEMUA agent (SCA + SICA + SHGA + BDE + Legacy)',
        'Unified Dashboard + custom widget',
        'Priority AI — respons 3x lebih cepat',
        'Cross-agent analytics advanced',
        'API access semua endpoint',
        'WhatsApp bot unlimited',
        'Custom kombinasi agent',
        'SLA 24h response',
      ],
      cta: '🚀 Mulai Sekarang',
      highlight: true,
    },
    {
      id: 'sma-enterprise',
      name: 'SMA Enterprise',
      price: 2999000,
      period: '/bulan',
      badge: '♾️ FULL SOVEREIGN',
      badgeColor: 'bg-yellow-900/60 text-yellow-300',
      features: [
        'Full Sovereign Ecosystem — semua fitur unlocked',
        'White-label + branding custom',
        'Custom AI training untuk bisnis Anda',
        'Dedicated Account Manager',
        'SLA 2h response + hotline 24/7',
        '$HYPHA Governance Rights',
        'Integrasi ERP/CRM kustom',
        'On-site training & onboarding',
      ],
      cta: 'Hubungi Sales',
      highlight: false,
    },
  ];

  const AGENTS = [
    { icon: '⚖️', name: 'SCA', full: 'Sovereign Contract Analyst', color: 'from-violet-600 to-purple-700', desc: 'Analisis & review kontrak hukum AI-powered. 94%+ akurasi, < 30 detik.' },
    { icon: '🌙', name: 'SICA', full: 'Sovereign Iftar & Catering Agent', color: 'from-amber-500 to-orange-600', desc: 'Manajemen katering & event otomatis. 500+ pax/hari tanpa kerja manual.' },
    { icon: '🎁', name: 'SHGA', full: 'Sovereign Hamper & Gift Agent', color: 'from-rose-500 to-pink-600', desc: 'Hamper & gift management dengan AI recommendation. Custom + corporate.' },
    { icon: '✂️', name: 'BDE', full: 'Barber Dynasty Engine', color: 'from-blue-600 to-cyan-600', desc: 'Booking + inventory + loyalty untuk barbershop. Dari 1 kursi hingga franchise.' },
    { icon: '🏛️', name: 'Legacy', full: 'Sovereign Legacy Vault', color: 'from-yellow-500 to-amber-600', desc: 'Digital legacy & family wealth management. Web5 DWN + smart inheritance.' },
    { icon: '👑', name: 'SMA', full: 'Sovereign Multi-Industry Agent', color: 'from-emerald-500 to-teal-600', desc: 'Meta-platform yang menyatukan semua agent dalam satu ekosistem terintegrasi.' },
  ];

  const FAQS = [
    { q: 'Apa itu SMA?', a: 'SMA (Sovereign Multi-Industry Agent) adalah meta-platform yang mengintegrasikan semua GANI HYPHA agents dalam satu dashboard terpadu. Anda bisa mengelola bisnis lintas industri dari satu tempat.' },
    { q: 'Apakah saya perlu beli agent terpisah?', a: 'Tidak! Dengan SMA, Anda mendapatkan akses ke semua agent dalam satu paket. Jauh lebih hemat dibanding membeli agent satu per satu.' },
    { q: 'Bagaimana cross-agent analytics bekerja?', a: 'SMA mengagregasi data dari semua agent Anda dan menampilkan insight lintas bisnis — misalnya korelasi antara event katering dan penjualan hamper, atau tren booking barber dengan revenue.' },
    { q: 'Apakah bisa pilih agent yang diinginkan?', a: 'Ya! Di paket Starter Anda bisa pilih 2 agent. Di Pro Anda dapat semua agent. Di Enterprise semua plus white-label dan custom training.' },
    { q: 'Metode pembayaran apa yang tersedia?', a: 'Kami mendukung QRIS, Virtual Account (BCA/BNI/BRI/Mandiri), OVO, DANA, ShopeePay, LinkAja, dan kartu kredit via Duitku payment gateway terpercaya Indonesia.' },
    { q: 'Apakah ada kontrak jangka panjang?', a: 'Tidak ada kontrak! Semua plan adalah langganan bulanan. Cancel kapan saja tanpa penalti.' },
  ];

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
          agent: 'SMA',
        })
      });
      const data = await res.json() as PaymentResult;
      setPaymentResult(data);
      if (data.payment_url) {
        window.open(data.payment_url, '_blank');
      }
    } catch {
      setPaymentResult({ success: false, error: 'Koneksi gagal. Periksa internet Anda.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openPayment = (planId: string, name: string, price: number) => {
    // Jika Enterprise, langsung ke WhatsApp
    if (planId === 'sma-enterprise') {
      window.open('https://wa.me/6285643383832?text=Halo%20Admin%2C%20saya%20tertarik%20dengan%20SMA%20Enterprise%20GANI%20HYPHA.%20Boleh%20info%20lebih%20lanjut%3F', '_blank');
      return;
    }
    setPaymentModal({ open: true, plan: name, price, planId });
    setFormData({ name: '', email: '', phone: '' });
    setPaymentResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      {/* === HERO === */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-emerald-950/30 to-gray-950">
        {/* Glow BG */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-600/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-0 w-64 h-64 bg-teal-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-6">
          {/* Navbar */}
          <nav className="flex items-center justify-between mb-12">
            <a href="/" className="flex items-center gap-2 text-white font-bold text-lg">
              <span className="text-2xl">🌿</span>
              <span>GANI HYPHA</span>
            </a>
            <div className="flex items-center gap-3">
              <a href="/sca-landing" className="text-xs text-gray-400 hover:text-white transition-colors hidden sm:block">SCA</a>
              <a href="/sica-landing" className="text-xs text-gray-400 hover:text-white transition-colors hidden sm:block">SICA</a>
              <a href="/shga-landing" className="text-xs text-gray-400 hover:text-white transition-colors hidden sm:block">SHGA</a>
              <a href="/bde-landing" className="text-xs text-gray-400 hover:text-white transition-colors hidden sm:block">BDE</a>
              <button
                onClick={() => openPayment('sma-pro', 'SMA Professional', 999000)}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Mulai Sekarang
              </button>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2 bg-emerald-900/30 border border-emerald-700/40 rounded-full px-4 py-1.5 text-emerald-300 text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              4+ Agents · 10+ Verticals · Beta Launch Q2 2026
            </div>

            <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Sovereign Multi-
              </span>
              <br />
              <span className="text-white">Industry Agent</span>
            </h1>

            <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-4">
              Meta-platform tempat semua Sovereign Agents hidup. Gabungkan SICA + SHGA + SCA + agent baru sesuai kebutuhan bisnis Anda.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-8 text-sm">
              {['Bundle semua agents', 'Custom agent kombinasi', 'Unified dashboard', 'Cross-agent analytics'].map(f => (
                <span key={f} className="flex items-center gap-1.5 bg-gray-800/60 rounded-full px-3 py-1 text-gray-300">
                  <span className="text-emerald-400">✓</span> {f}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => openPayment('sma-pro', 'SMA Professional', 999000)}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-emerald-900/30"
              >
                🚀 Mulai SMA Sekarang — Rp 999.000/bln
              </button>
              <button
                onClick={() => openPayment('sma-trial', 'SMA Trial', 0)}
                className="border border-gray-700 text-gray-300 px-8 py-4 rounded-xl font-semibold text-lg hover:border-gray-500 hover:text-white transition-all"
              >
                🆓 Coba Gratis 7 Hari
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* === AGENTS ECOSYSTEM === */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">🌐 Ekosistem Agent Terpadu</h2>
          <p className="text-gray-400">Semua agent GANI HYPHA dalam satu platform terintegrasi</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {AGENTS.map(agent => (
            <div
              key={agent.name}
              className={`relative bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition-all group ${agent.name === 'SMA' ? 'ring-2 ring-emerald-500/30' : ''}`}
            >
              {agent.name === 'SMA' && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  YOU ARE HERE
                </div>
              )}
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${agent.color} flex items-center justify-center text-lg mb-3`}>
                {agent.icon}
              </div>
              <div className="font-bold text-white text-sm">{agent.name}</div>
              <div className="text-gray-500 text-xs mb-2">{agent.full}</div>
              <div className="text-gray-400 text-xs leading-relaxed">{agent.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* === PRICING === */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">💎 Sovereign Plans</h2>
          <p className="text-gray-400">Bundle semua agent — lebih hemat dari beli satu per satu</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLANS.map(plan => (
            <div
              key={plan.id}
              className={`relative flex flex-col bg-gray-900 rounded-2xl border transition-all ${
                plan.highlight
                  ? 'border-emerald-500/50 shadow-lg shadow-emerald-900/20 scale-[1.02]'
                  : 'border-gray-800 hover:border-gray-600'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                  ⭐ PALING POPULER
                </div>
              )}

              <div className="p-5 flex-1">
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${plan.badgeColor} mb-3 inline-block`}>
                  {plan.badge}
                </span>
                <h3 className="text-white font-bold text-lg mb-1">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-black text-white">
                    {plan.price === 0 ? 'GRATIS' : `Rp ${(plan.price / 1000).toFixed(0)}rb`}
                  </span>
                  {plan.period && <span className="text-gray-500 text-sm">{plan.period}</span>}
                </div>

                <ul className="space-y-2">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={() => openPayment(plan.id, plan.name, plan.price)}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                    plan.highlight
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:opacity-90'
                      : plan.id === 'sma-enterprise'
                      ? 'border border-yellow-600/50 text-yellow-400 hover:bg-yellow-900/20'
                      : 'border border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* === FAQ === */}
      <section className="py-16 px-4 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">❓ FAQ</h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors"
              >
                <span className="text-white font-medium text-sm">{faq.q}</span>
                <span className="text-gray-500 text-lg">{openFaq === i ? '−' : '+'}</span>
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 text-gray-400 text-sm leading-relaxed border-t border-gray-800/50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* === CTA BOTTOM === */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto bg-gradient-to-br from-emerald-900/30 to-teal-900/20 border border-emerald-700/30 rounded-2xl p-10 text-center">
          <h2 className="text-3xl font-bold mb-3">🌿 Mulai Sovereign Journey Anda</h2>
          <p className="text-gray-400 mb-6">Satu platform. Semua industri. AI-powered. Web3-ready.</p>
          <button
            onClick={() => openPayment('sma-pro', 'SMA Professional', 999000)}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-10 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity shadow-xl"
          >
            🚀 Mulai SMA Sekarang
          </button>
          <p className="text-gray-600 text-xs mt-4">"Akar Dalam, Cabang Tinggi" — Gyss! 🙏🏻</p>
        </div>
      </section>

      {/* === PAYMENT MODAL === */}
      {paymentModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-white font-bold text-xl">
                  {paymentModal.price === 0 ? '🆓 Daftar Trial Gratis' : `💳 Checkout via Duitku`}
                </h2>
                <p className="text-sm mt-1 text-gray-400">
                  {paymentModal.plan}{paymentModal.price > 0 ? ` — Rp ${paymentModal.price.toLocaleString('id-ID')}/bln` : ' — Gratis 7 Hari'}
                </p>
              </div>
              <button onClick={() => setPaymentModal(p => ({ ...p, open: false }))} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
            </div>

            {!paymentResult ? (
              <form onSubmit={e => { e.preventDefault(); handlePayment(); }} className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Nama Lengkap *</label>
                  <input
                    type="text" required placeholder="Nama Anda"
                    value={formData.name}
                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Email *</label>
                  <input
                    type="email" required placeholder="email@anda.com"
                    value={formData.email}
                    onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">WhatsApp (opsional)</label>
                  <input
                    type="tel" placeholder="08xxxxxxxxxx"
                    value={formData.phone}
                    onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {paymentModal.price > 0 && (
                  <div className="bg-gray-800/60 rounded-lg p-3 text-xs text-gray-400">
                    💳 Mendukung: QRIS · VA BCA/BNI/BRI/Mandiri · OVO · DANA · ShopeePay · Kartu Kredit
                  </div>
                )}

                <button
                  type="submit" disabled={isSubmitting}
                  className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? '⏳ Memproses...' : paymentModal.price === 0 ? '🆓 Aktifkan Trial Gratis' : `💳 Bayar Rp ${paymentModal.price.toLocaleString('id-ID')}`}
                </button>
              </form>
            ) : (
              <div className="text-center">
                {paymentResult.payment_url ? (
                  <div className="space-y-3">
                    <div className="text-4xl">✅</div>
                    <p className="text-emerald-300 font-semibold">Invoice berhasil dibuat!</p>
                    <div className="bg-gray-800 rounded-lg p-3 text-xs text-gray-400 space-y-1">
                      <div>Order: <span className="text-white font-mono">{paymentResult.order_id?.slice(-20)}</span></div>
                      <div>Jumlah: <span className="text-emerald-400 font-bold">{paymentResult.amount_formatted}</span></div>
                      {paymentResult.mode && (
                        <div>Mode: <span className={`font-medium ${paymentResult.mode === 'production' ? 'text-green-400' : 'text-amber-400'}`}>
                          {paymentResult.mode === 'production' ? '🟢 Production' : '🟡 Sandbox (Test)'}
                        </span></div>
                      )}
                    </div>
                    <a
                      href={paymentResult.payment_url}
                      className="block w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90"
                    >
                      💳 Lanjutkan ke Halaman Pembayaran
                    </a>
                  </div>
                ) : paymentResult.fallback_payment ? (
                  <div className="space-y-3 text-left">
                    <div className="text-center">
                      <div className="text-3xl mb-1">🏦</div>
                      <p className="text-amber-300 font-semibold text-sm">Pembayaran via Transfer Manual</p>
                      <p className="text-gray-500 text-xs mt-1">Duitku sandbox sedang dalam proses approval</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 text-xs space-y-1.5">
                      {paymentResult.fallback_payment.instructions.map((instr, i) => (
                        <p key={i} className="text-gray-300">{instr}</p>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 text-center">Order ID: <span className="font-mono text-gray-400">{paymentResult.order_id?.slice(-20)}</span></p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-4xl">⚠️</div>
                    <p className="text-red-400 text-sm">{paymentResult.error || 'Terjadi kesalahan. Coba lagi.'}</p>
                    <button
                      onClick={() => setPaymentResult(null)}
                      className="w-full py-2 rounded-xl text-gray-400 border border-gray-700 text-sm hover:text-white"
                    >
                      Coba Lagi
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SMALanding;
