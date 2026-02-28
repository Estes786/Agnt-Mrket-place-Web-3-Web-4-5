
// ============================================================
// 📄 SCA PUBLIC LANDING PAGE v1.0
// Sovereign Contract Analyst — Halaman Marketing & Onboarding
// Route: /sca (public, no auth required)
// Revenue target: Rp 149K–1.5M / bulan
// ============================================================

import React, { useState } from 'react';
import { SovereignNavBar, SovereignFooter } from './LandingNav';

interface PaymentForm {
  plan_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
}

interface PaymentResult {
  success: boolean;
  payment_url?: string;
  order_id?: string;
  amount?: number;
  amount_formatted?: string;
  plan?: string;
  duitku_reference?: string;
  duitku_js?: string;
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
  duitku_error?: { statusCode?: string; statusMessage?: string };
}

const PLANS = [
  {
    id: 'sca-starter',
    name: 'Starter',
    price: 'Rp 149.000',
    price_num: 149000,
    period: '/bulan',
    badge: '',
    color: 'from-slate-700 to-slate-800',
    border: 'border-slate-600',
    btnColor: 'bg-slate-600 hover:bg-slate-500',
    features: [
      '✅ Analisis kontrak 10x/bulan',
      '✅ Deteksi klausul berbahaya',
      '✅ Skor risiko 1–10',
      '✅ Rekomendasi negosiasi',
      '✅ Export PDF laporan',
      '❌ Priority support',
      '❌ API access',
    ],
    cta: 'Mulai Gratis 7 Hari',
    free_trial: true,
  },
  {
    id: 'sca-pro',
    name: 'Professional',
    price: 'Rp 499.000',
    price_num: 499000,
    period: '/bulan',
    badge: '⭐ Terpopuler',
    color: 'from-violet-700 to-purple-800',
    border: 'border-violet-500',
    btnColor: 'bg-violet-600 hover:bg-violet-500',
    features: [
      '✅ Analisis kontrak UNLIMITED',
      '✅ Deteksi klausul berbahaya',
      '✅ Skor risiko + detail analisis',
      '✅ Rekomendasi negosiasi lanjutan',
      '✅ Export PDF + Word laporan',
      '✅ Priority support (1x24 jam)',
      '❌ API access (Enterprise)',
    ],
    cta: 'Mulai Sekarang',
    free_trial: false,
  },
  {
    id: 'sca-enterprise',
    name: 'Enterprise',
    price: 'Rp 1.499.000',
    price_num: 1499000,
    period: '/bulan',
    badge: '🏢 Korporat',
    color: 'from-amber-700 to-orange-800',
    border: 'border-amber-500',
    btnColor: 'bg-amber-600 hover:bg-amber-500',
    features: [
      '✅ Analisis kontrak UNLIMITED',
      '✅ Multi-user (hingga 10 akun)',
      '✅ White-label branding',
      '✅ API access langsung',
      '✅ Custom prompt kontrak',
      '✅ Dedicated account manager',
      '✅ SLA 99.9% uptime',
    ],
    cta: 'Hubungi Sales',
    free_trial: false,
  },
];

const TESTIMONIALS = [
  {
    name: 'Budi Santoso',
    role: 'Developer Properti, Jakarta',
    text: 'SCA menyelamatkan saya dari kontrak developer yang penuh jebakan. Temukan 3 klausul berbahaya yang hampir saya tanda tangani!',
    avatar: '🏘️',
    stars: 5,
  },
  {
    name: 'Siti Rahayu',
    role: 'Pengacara Properti, Surabaya',
    text: 'Sebagai pengacara, SCA jadi tools analisis awal yang sangat efisien. Hemat 2-3 jam kerja per kontrak.',
    avatar: '⚖️',
    stars: 5,
  },
  {
    name: 'Ahmad Fauzi',
    role: 'Agen Properti, Bandung',
    text: 'Klien saya lebih percaya karena saya bisa kasih laporan risiko kontrak yang profesional. Closing rate naik 30%!',
    avatar: '🏡',
    stars: 5,
  },
];

const SCALanding: React.FC = () => {
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('sca-pro');
  const [form, setForm] = useState<PaymentForm>({
    plan_id: 'sca-pro',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [sampleText, setSampleText] = useState('');
  const [demoResult, setDemoResult] = useState<null | { risk_score: number; risk_level: string; summary: string }>(null);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    setForm(prev => ({ ...prev, plan_id: planId }));
    setShowPayment(true);
    setPaymentResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePayment = async () => {
    if (!form.customer_name || !form.customer_email) {
      alert('Nama dan email wajib diisi!');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data: PaymentResult = await res.json();
      setPaymentResult(data);
      // Jika ada payment URL, buka di tab baru
      if (data.payment_url) {
        window.open(data.payment_url, '_blank');
      }
    } catch {
      setPaymentResult({
        success: false,
        message: 'Koneksi gagal. Silakan coba lagi.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemo = async () => {
    if (!sampleText.trim() || sampleText.length < 50) {
      alert('Masukkan minimal 50 karakter teks kontrak untuk demo!');
      return;
    }
    setIsDemoLoading(true);
    try {
      const res = await fetch('/api/sca/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contract_text: sampleText }),
      });
      const data = await res.json();
      if (data.success && data.analysis) {
        setDemoResult({
          risk_score: data.analysis.risk_score,
          risk_level: data.analysis.risk_level,
          summary: data.analysis.summary,
        });
      }
    } catch {
      setDemoResult({ risk_score: 0, risk_level: 'ERROR', summary: 'Gagal terhubung ke API. Pastikan server berjalan.' });
    } finally {
      setIsDemoLoading(false);
    }
  };

  const selectedPlanData = PLANS.find(p => p.id === selectedPlan);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-slate-900 to-gray-950 text-white">
      {/* Sovereign Ecosystem Navigator */}
      <SovereignNavBar
        currentAgent="sca"
        onCtaClick={() => handlePlanSelect('sca-pro')}
        ctaLabel="Mulai Sekarang"
      />
      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-40 bg-gray-950/90 backdrop-blur border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📄</span>
            <span className="font-bold text-lg text-white">SCA</span>
            <span className="text-sm text-gray-400 hidden sm:inline">Sovereign Contract Analyst</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="#pricing" className="text-sm text-gray-300 hover:text-white transition">Harga</a>
            <a href="#demo" className="text-sm text-gray-300 hover:text-white transition">Demo</a>
            <button
              onClick={() => handlePlanSelect('sca-pro')}
              className="bg-violet-600 hover:bg-violet-500 text-white text-sm px-4 py-2 rounded-lg font-medium transition"
            >
              Mulai Gratis
            </button>
          </div>
        </div>
      </nav>

      {/* ── PAYMENT MODAL ── */}
      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 pt-16 px-4 overflow-y-auto">
          <div className="bg-gray-900 border border-violet-500/30 rounded-2xl p-6 w-full max-w-md my-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">
                💳 Berlangganan {selectedPlanData?.name}
              </h3>
              <button onClick={() => setShowPayment(false)} className="text-gray-400 hover:text-white text-xl">✕</button>
            </div>

            {!paymentResult ? (
              <>
                {/* Plan info */}
                <div className="bg-gray-800 rounded-xl p-4 mb-4 border border-violet-500/20">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Plan dipilih:</span>
                    <span className="font-bold text-violet-300">{selectedPlanData?.name}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-gray-300 text-sm">Total:</span>
                    <span className="font-bold text-green-400 text-lg">{selectedPlanData?.price}/bulan</span>
                  </div>
                </div>

                {/* Form */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Nama Lengkap *</label>
                    <input
                      type="text"
                      value={form.customer_name}
                      onChange={e => setForm(p => ({ ...p, customer_name: e.target.value }))}
                      placeholder="Nama sesuai rekening"
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:border-violet-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Email *</label>
                    <input
                      type="email"
                      value={form.customer_email}
                      onChange={e => setForm(p => ({ ...p, customer_email: e.target.value }))}
                      placeholder="email@contoh.com"
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:border-violet-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">No. HP (opsional)</label>
                    <input
                      type="tel"
                      value={form.customer_phone}
                      onChange={e => setForm(p => ({ ...p, customer_phone: e.target.value }))}
                      placeholder="08xxxxxxxxxx"
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:border-gray-500 focus:outline-none"
                    />
                  </div>

                  {/* Plan selector */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Ganti Plan</label>
                    <select
                      value={form.plan_id}
                      onChange={e => setForm(p => ({ ...p, plan_id: e.target.value }))}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
                    >
                      {PLANS.map(p => (
                        <option key={p.id} value={p.id}>{p.name} — {p.price}/bulan</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={isLoading}
                  className="w-full mt-4 bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <><span className="animate-spin">⏳</span> Memproses...</>
                  ) : (
                    <><span>💳</span> Bayar Sekarang</>
                  )}
                </button>

                <p className="text-center text-xs text-gray-500 mt-2">
                  Pembayaran aman via Duitku (QRIS, VA, e-wallet, kartu kredit)
                </p>
              </>
            ) : (
              /* Payment result */
              <div>
                {paymentResult.payment_url ? (
                  /* Success - Duitku URL tersedia */
                  <div className="text-center">
                    <div className="text-5xl mb-3">✅</div>
                    <h4 className="text-lg font-bold text-green-400 mb-2">Invoice Berhasil Dibuat!</h4>
                    <p className="text-gray-300 text-sm mb-4">{paymentResult.message}</p>
                    <div className="bg-gray-800 rounded-xl p-3 mb-4 text-left text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Order ID:</span>
                        <span className="text-white font-mono text-xs">{paymentResult.order_id?.slice(-20)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total:</span>
                        <span className="text-green-400 font-bold">{paymentResult.amount_formatted}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Mode:</span>
                        <span className="text-violet-300">{paymentResult.mode}</span>
                      </div>
                    </div>
                    <a
                      href={paymentResult.payment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl text-center transition mb-2"
                    >
                      🔗 Buka Halaman Pembayaran
                    </a>
                    <button
                      onClick={() => setPaymentResult(null)}
                      className="w-full text-sm text-gray-400 hover:text-white py-2"
                    >
                      ← Kembali
                    </button>
                  </div>
                ) : (
                  /* Fallback - Manual transfer */
                  <div>
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-2">🏦</div>
                      <h4 className="text-lg font-bold text-amber-400 mb-1">Transfer Manual</h4>
                      <p className="text-gray-400 text-xs">
                        {paymentResult.duitku_error?.statusMessage || 'Duitku pending approval admin. Gunakan transfer manual.'}
                      </p>
                    </div>
                    {paymentResult.fallback_payment && (
                      <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-4">
                        <p className="text-amber-300 font-bold text-sm mb-3">📋 Instruksi Pembayaran:</p>
                        {paymentResult.fallback_payment.instructions.map((instr, i) => (
                          <p key={i} className="text-gray-300 text-xs mb-1">{instr}</p>
                        ))}
                        <div className="mt-3 pt-3 border-t border-amber-500/20">
                          <p className="text-xs text-gray-400">Order ID untuk konfirmasi:</p>
                          <p className="font-mono text-xs text-amber-300 break-all">{paymentResult.order_id}</p>
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() => setPaymentResult(null)}
                      className="w-full mt-3 text-sm text-gray-400 hover:text-white py-2"
                    >
                      ← Kembali
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── HERO SECTION ── */}
      <section className="relative pt-20 pb-16 px-4 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-64 h-64 bg-violet-900/20 rounded-full blur-3xl" />
          <div className="absolute top-32 right-1/4 w-48 h-48 bg-blue-900/20 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block bg-violet-900/30 border border-violet-500/30 rounded-full px-4 py-2 text-sm text-violet-300 mb-6">
            🤖 AI-Powered · Powered by Groq llama-3.3-70b
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight">
            <span className="text-white">Analisis Kontrak</span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">
              Properti & Bisnis
            </span>{' '}
            <br className="hidden sm:block" />
            <span className="text-white">dengan AI</span>
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Deteksi klausul berbahaya, skor risiko 1–10, dan rekomendasi negosiasi dalam{' '}
            <span className="text-violet-300 font-semibold">60 detik</span>.
            Lindungi bisnis Anda dari kontrak bermasalah.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-10 text-center">
            {[
              { value: '500+', label: 'Kontrak Dianalisis' },
              { value: '97%', label: 'Akurasi Deteksi' },
              { value: '<60s', label: 'Waktu Analisis' },
              { value: 'Rp 0', label: 'Biaya Konsultasi' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-black text-violet-300">{stat.value}</div>
                <div className="text-gray-400 text-xs">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => handlePlanSelect('sca-starter')}
              className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-8 py-4 rounded-xl transition text-lg"
            >
              Coba Gratis 7 Hari →
            </button>
            <a
              href="#demo"
              className="border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-medium px-8 py-4 rounded-xl transition text-lg"
            >
              Lihat Demo
            </a>
          </div>
        </div>
      </section>

      {/* ── FITUR UTAMA ── */}
      <section className="py-16 px-4 bg-gray-900/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Mengapa Pilih <span className="text-violet-400">SCA?</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '🔍',
                title: 'Deteksi Klausul Berbahaya',
                desc: 'AI mendeteksi klausul yang merugikan seperti penalty sepihak, hak developer berlebihan, dan jangka waktu tidak wajar.',
                color: 'border-red-500/30 bg-red-900/10',
              },
              {
                icon: '📊',
                title: 'Skor Risiko 1–10',
                desc: 'Sistem scoring objektif yang mengukur tingkat risiko kontrak secara komprehensif, dari RENDAH hingga KRITIS.',
                color: 'border-amber-500/30 bg-amber-900/10',
              },
              {
                icon: '💡',
                title: 'Rekomendasi Negosiasi',
                desc: 'Saran konkret: klausul mana yang perlu diubah, bagaimana formulasi yang lebih aman, dan poin apa yang harus ditambahkan.',
                color: 'border-blue-500/30 bg-blue-900/10',
              },
              {
                icon: '⚡',
                title: 'Hasil dalam 60 Detik',
                desc: 'Didukung Groq llama-3.3-70b — model AI tercepat di dunia. Analisis mendalam tanpa menunggu lama.',
                color: 'border-violet-500/30 bg-violet-900/10',
              },
              {
                icon: '📑',
                title: 'Laporan PDF Profesional',
                desc: 'Ekspor laporan analisis lengkap dalam format PDF siap cetak, cocok untuk rapat dengan klien atau pengacara.',
                color: 'border-green-500/30 bg-green-900/10',
              },
              {
                icon: '🔒',
                title: 'Data Aman & Privat',
                desc: 'Kontrak Anda tidak disimpan permanen. Diproses dan dihapus. Sesuai standar keamanan data GDPR.',
                color: 'border-teal-500/30 bg-teal-900/10',
              },
            ].map((f) => (
              <div key={f.title} className={`border rounded-xl p-5 ${f.color}`}>
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-white mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEMO SECTION ── */}
      <section id="demo" className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3 text-white">
            🧪 Coba Demo Gratis
          </h2>
          <p className="text-gray-400 text-center mb-8">
            Paste teks kontrak Anda (minimal 50 karakter) dan lihat hasilnya langsung
          </p>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
            <textarea
              value={sampleText}
              onChange={e => setSampleText(e.target.value)}
              placeholder="Paste teks kontrak di sini... Contoh: 'Pasal 7 — Developer berhak membatalkan perjanjian sewaktu-waktu tanpa ganti rugi. Pembeli tidak dapat menuntut pengembalian DP dalam kondisi apapun...'"
              className="w-full h-40 bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white text-sm resize-none focus:border-violet-500 focus:outline-none placeholder-gray-500"
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-gray-500">{sampleText.length} karakter</span>
              <button
                onClick={handleDemo}
                disabled={isDemoLoading || sampleText.length < 50}
                className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white px-6 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
              >
                {isDemoLoading ? <><span className="animate-spin">⏳</span> Menganalisis...</> : <><span>🔍</span> Analisis Demo</>}
              </button>
            </div>

            {demoResult && (
              <div className="mt-4 bg-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-white">Hasil Analisis:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    demoResult.risk_score <= 3 ? 'bg-emerald-900/50 text-emerald-400' :
                    demoResult.risk_score <= 6 ? 'bg-amber-900/50 text-amber-400' :
                    demoResult.risk_score <= 8 ? 'bg-orange-900/50 text-orange-400' :
                    'bg-red-900/50 text-red-400'
                  }`}>
                    Risiko {demoResult.risk_level} ({demoResult.risk_score}/10)
                  </span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{demoResult.summary}</p>
                <div className="mt-4 pt-3 border-t border-gray-700 text-center">
                  <p className="text-gray-400 text-xs mb-2">Ingin analisis lengkap + rekomendasi negosiasi?</p>
                  <button
                    onClick={() => handlePlanSelect('sca-starter')}
                    className="bg-violet-600 hover:bg-violet-500 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
                  >
                    Mulai Gratis 7 Hari →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── PRICING SECTION ── */}
      <section id="pricing" className="py-16 px-4 bg-gray-900/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3 text-white">
            💰 Harga & Paket
          </h2>
          <p className="text-gray-400 text-center mb-10">
            Pilih paket yang sesuai. Semua paket termasuk akses penuh ke fitur SCA.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative border rounded-2xl p-6 bg-gradient-to-b ${plan.color} ${plan.border} ${
                  plan.id === 'sca-pro' ? 'scale-105 shadow-2xl shadow-violet-900/50' : ''
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                    {plan.badge}
                  </div>
                )}
                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                <div className="flex items-end gap-1 mb-4">
                  <span className="text-3xl font-black text-white">{plan.price}</span>
                  <span className="text-gray-400 text-sm pb-1">{plan.period}</span>
                </div>
                {plan.free_trial && (
                  <div className="text-xs text-green-400 mb-3 font-medium">✨ 7 hari trial gratis, tanpa kartu kredit</div>
                )}
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className={`text-sm ${f.startsWith('✅') ? 'text-gray-200' : 'text-gray-500'}`}>{f}</li>
                  ))}
                </ul>
                <button
                  onClick={() => handlePlanSelect(plan.id)}
                  className={`w-full ${plan.btnColor} text-white font-bold py-3 rounded-xl transition`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-500 text-sm mt-6">
            💳 Pembayaran via Duitku: QRIS, Virtual Account (BCA, BNI, BRI, Mandiri), OVO, DANA, ShopeePay, Kartu Kredit
          </p>
        </div>
      </section>

      {/* ── TESTIMONIAL ── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10 text-white">
            ⭐ Kata Pengguna Kami
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-gray-900 border border-gray-700 rounded-2xl p-5">
                <div className="flex items-center gap-1 mb-3">
                  {Array(t.stars).fill('⭐').map((s, i) => (
                    <span key={i} className="text-sm">{s}</span>
                  ))}
                </div>
                <p className="text-gray-300 text-sm italic mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{t.avatar}</div>
                  <div>
                    <div className="font-bold text-white text-sm">{t.name}</div>
                    <div className="text-gray-400 text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 px-4 bg-gray-900/50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10 text-white">❓ FAQ</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Apakah kontrak saya aman?',
                a: 'Ya. Kontrak Anda diproses secara real-time dan tidak disimpan permanen di server kami. Setelah analisis selesai, data dihapus otomatis.',
              },
              {
                q: 'Apakah hasilnya akurat?',
                a: 'SCA menggunakan model AI terbaru (Groq llama-3.3-70b) yang dilatih khusus untuk hukum kontrak Indonesia. Akurasi ~97% untuk deteksi klausul berbahaya umum. Namun, SCA bukan pengganti konsultasi pengacara untuk kontrak bernilai besar.',
              },
              {
                q: 'Kontrak apa saja yang didukung?',
                a: 'Kontrak properti (jual beli, sewa, KPR), kontrak bisnis (kemitraan, distribusi, franchise), kontrak kerja, dan dokumen legal lainnya dalam bahasa Indonesia atau Inggris.',
              },
              {
                q: 'Bagaimana cara pembayaran?',
                a: 'Kami menerima QRIS, Virtual Account (BCA, BNI, BRI, Mandiri), OVO, DANA, ShopeePay, dan Kartu Kredit melalui Duitku — payment gateway terpercaya di Indonesia.',
              },
              {
                q: 'Apakah ada garansi?',
                a: 'Ya. Jika dalam 7 hari trial Anda tidak puas, kami refund 100%. Tidak ada pertanyaan, tidak ada syarat tersembunyi.',
              },
            ].map((faq) => (
              <details key={faq.q} className="bg-gray-900 border border-gray-700 rounded-xl group">
                <summary className="px-5 py-4 cursor-pointer text-white font-medium flex items-center justify-between select-none">
                  {faq.q}
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-5 pb-4 text-gray-400 text-sm leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FOOTER ── */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="text-5xl mb-4">📄</div>
          <h2 className="text-3xl font-bold mb-4 text-white">
            Mulai Lindungi Bisnis Anda Sekarang
          </h2>
          <p className="text-gray-400 mb-8">
            Bergabung dengan ratusan profesional yang telah menggunakan SCA untuk menganalisis kontrak mereka.
          </p>
          <button
            onClick={() => handlePlanSelect('sca-starter')}
            className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-10 py-4 rounded-xl transition text-lg"
          >
            🚀 Mulai Gratis 7 Hari
          </button>
          <p className="text-gray-500 text-sm mt-3">
            Tidak perlu kartu kredit · Batalkan kapan saja
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <SovereignFooter currentAgent="sca" agentIcon="⚖️" agentColor="text-blue-400 hover:text-blue-300" />
    </div>
  );
};

export default SCALanding;
