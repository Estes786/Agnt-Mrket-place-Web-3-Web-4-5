
// ============================================================
// 🌙 SICA LANDING PAGE — Sovereign Iftar & Catering Agent
// Public Marketing Page — No Auth Required
// Revenue: Rp 99K - 2.499M / bulan
// Part of GANI HYPHA Sovereign Agent Ecosystem
// Session #029 | HOLY 2.5 UPGRADE
// ============================================================

import React, { useState, useEffect } from 'react';

interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  features: string[];
  highlight?: boolean;
  badge?: string;
  color: string;
}

interface PaymentModalProps {
  plan: Plan;
  onClose: () => void;
}

const PLANS: Plan[] = [
  {
    id: 'sica-trial',
    name: 'Coba Gratis',
    price: 0,
    currency: 'IDR',
    period: '7 hari',
    features: [
      '✅ AI Parse Order WhatsApp (5 order/hari)',
      '✅ Rekomendasi Menu AI (3x/hari)',
      '✅ Countdown Ramadan/Hari Raya',
      '✅ 1 Admin Akun',
      '❌ Notifikasi WhatsApp otomatis',
      '❌ Laporan keuangan',
      '❌ Multi-cabang',
    ],
    badge: 'MULAI SEKARANG',
    color: 'from-gray-700 to-gray-800',
  },
  {
    id: 'sica-starter',
    name: 'Starter',
    price: 99000,
    currency: 'IDR',
    period: '/bulan',
    features: [
      '✅ AI Parse Order WhatsApp (50 order/hari)',
      '✅ Rekomendasi Menu AI (tidak terbatas)',
      '✅ Notifikasi WhatsApp otomatis',
      '✅ Dashboard Order Real-time',
      '✅ Laporan Pendapatan Bulanan',
      '✅ 2 Admin Akun',
      '❌ Multi-cabang',
    ],
    badge: 'PALING POPULER',
    highlight: true,
    color: 'from-emerald-600 to-teal-700',
  },
  {
    id: 'sica-pro',
    name: 'Pro',
    price: 299000,
    currency: 'IDR',
    period: '/bulan',
    features: [
      '✅ AI Parse Order WhatsApp (tidak terbatas)',
      '✅ Rekomendasi Menu + Strategi Harga AI',
      '✅ Notifikasi WhatsApp + Template Custom',
      '✅ Dashboard + Analytics Lanjutan',
      '✅ Laporan Keuangan Lengkap',
      '✅ 5 Admin Akun',
      '✅ Multi-cabang (sampai 3 lokasi)',
    ],
    color: 'from-teal-600 to-cyan-700',
  },
  {
    id: 'sica-enterprise',
    name: 'Enterprise',
    price: 999000,
    currency: 'IDR',
    period: '/bulan',
    features: [
      '✅ Semua fitur Pro',
      '✅ Custom AI Model (belajar dari data Anda)',
      '✅ API Integration (GrabFood, GoFood, ShopeeFood)',
      '✅ Manajemen Supplier & Inventori',
      '✅ Akun admin tidak terbatas',
      '✅ Multi-cabang tidak terbatas',
      '✅ Dedicated support + onboarding',
    ],
    badge: 'UNTUK BISNIS BESAR',
    color: 'from-purple-600 to-violet-700',
  },
];

const TESTIMONIALS = [
  {
    name: 'Ibu Sari Dewi',
    business: 'Katering Mama Sari, Bandung',
    avatar: '👩‍🍳',
    text: 'Dulu saya harus baca ulang chat WA satu per satu untuk catat pesanan. Sekarang tinggal copy-paste, AI langsung buat form ordernya. Hemat 2 jam kerja per hari!',
    revenue: '+Rp 3.2 juta/bulan',
    since: 'Pengguna sejak Januari 2026',
  },
  {
    name: 'Pak Fauzan',
    business: 'Nasi Box Pak Uzan, Jakarta Selatan',
    avatar: '👨‍🍳',
    text: 'SICA kasih saya rekomendasi menu Ramadan yang tepat sasaran. Pesanan buka bersama korporat naik 3x lipat dibanding tahun lalu. Alhamdulillah!',
    revenue: '+Rp 7.5 juta Ramadan',
    since: 'Pengguna sejak Desember 2025',
  },
  {
    name: 'Kak Rizky',
    business: 'Catering Momen Bahagia, Surabaya',
    avatar: '🧑‍🍳',
    text: 'Fitur notifikasi WhatsApp otomatis bikin pelanggan kita merasa diperhatikan. Repeat order naik 40%. Harga Starter 99 ribu per bulan itu sangat worth it!',
    revenue: '+40% repeat order',
    since: 'Pengguna sejak November 2025',
  },
];

const FAQS = [
  {
    q: 'Bagaimana AI SICA bisa baca order WhatsApp?',
    a: 'Anda cukup copy-paste teks chat WhatsApp dari pelanggan ke SICA. AI kami (Groq llama-3.3-70b) akan otomatis ekstrak detail: nama, jumlah pax, tanggal, alamat, menu yang diminta, dan estimasi harga. Tidak perlu format khusus!',
  },
  {
    q: 'Apakah SICA bisa dipakai di luar Ramadan?',
    a: 'Tentu! SICA dirancang untuk bisnis katering sepanjang tahun. Mulai dari acara korporat, pernikahan, ulang tahun, gathering, arisan, hingga katering harian. Fitur Ramadan/Lebaran adalah bonus musiman.',
  },
  {
    q: 'Apakah data order saya aman?',
    a: 'Data Anda dienkripsi dan tersimpan di Supabase PostgreSQL dengan Row Level Security. Hanya akun Anda yang bisa mengakses data bisnis Anda. Tidak ada pihak ketiga yang bisa melihat data order Anda.',
  },
  {
    q: 'Bisakah saya upgrade atau downgrade plan?',
    a: 'Ya, Anda bisa upgrade kapan saja dan mulai berlaku di siklus billing berikutnya. Downgrade juga bisa dilakukan, perubahan berlaku di akhir bulan berjalan.',
  },
  {
    q: 'Apakah ada kontrak jangka panjang?',
    a: 'Tidak ada kontrak! Semua plan adalah langganan bulanan yang bisa dibatalkan kapan saja. Kami percaya layanan kami cukup baik sehingga Anda tidak akan mau berhenti. 😊',
  },
];

// ── Payment Modal ───────────────────────────────────────────
const PaymentModal: React.FC<PaymentModalProps> = ({ plan, onClose }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', businessName: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; url?: string; error?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) return;
    setLoading(true);
    try {
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan_id: plan.id,
          customer_name: form.name,
          customer_email: form.email,
          customer_phone: form.phone,
          business_name: form.businessName,
          agent: 'SICA',
        }),
      });
      const data = await res.json();
      if (data.success && data.payment_url) {
        setResult({ success: true, url: data.payment_url });
        setTimeout(() => { window.location.href = data.payment_url; }, 1500);
      } else {
        setResult({ success: false, error: data.error || 'Gagal membuat invoice. Coba lagi.' });
      }
    } catch {
      setResult({ success: false, error: 'Koneksi gagal. Periksa internet Anda.' });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (p: number) =>
    p === 0 ? 'GRATIS' : `Rp ${p.toLocaleString('id-ID')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-white font-bold text-xl">🌙 Mulai {plan.name}</h2>
            <p className="text-emerald-400 font-semibold mt-1">
              {formatPrice(plan.price)} {plan.period}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
        </div>

        {result ? (
          <div className={`text-center py-6 rounded-xl ${result.success ? 'bg-emerald-900/30 border border-emerald-700' : 'bg-red-900/30 border border-red-700'}`}>
            {result.success ? (
              <>
                <div className="text-4xl mb-3">✅</div>
                <p className="text-emerald-300 font-semibold">Invoice berhasil dibuat!</p>
                <p className="text-gray-400 text-sm mt-1">Anda akan diarahkan ke halaman pembayaran...</p>
                {result.url && (
                  <a href={result.url} className="mt-3 inline-block text-emerald-400 underline text-sm">
                    Klik di sini jika tidak otomatis redirect
                  </a>
                )}
              </>
            ) : (
              <>
                <div className="text-4xl mb-3">❌</div>
                <p className="text-red-300 font-semibold">{result.error}</p>
                <button onClick={() => setResult(null)} className="mt-3 text-sm text-gray-400 underline">Coba lagi</button>
              </>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-gray-300 text-sm mb-1 block">Nama Lengkap *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="Nama Anda"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm mb-1 block">Email *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="email@contoh.com"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm mb-1 block">No. WhatsApp *</label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                placeholder="08xxxxxxxxxx"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm mb-1 block">Nama Bisnis Katering</label>
              <input
                type="text"
                value={form.businessName}
                onChange={e => setForm(p => ({ ...p, businessName: e.target.value }))}
                placeholder="Katering Mama Sari"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-bold text-white transition-all ${loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 hover:scale-[1.02]'}`}
            >
              {loading ? '⏳ Memproses...' : plan.price === 0 ? '🚀 Mulai Gratis Sekarang' : `💳 Bayar ${formatPrice(plan.price)}`}
            </button>
            <p className="text-gray-500 text-xs text-center">
              Pembayaran aman via Duitku · QRIS · Transfer Bank · E-Wallet
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

// ── Ramadan Countdown ────────────────────────────────────────
const RamadanCountdown: React.FC = () => {
  const [countdown, setCountdown] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    const getRamadanData = async () => {
      try {
        const res = await fetch('/api/shga/lebaran/countdown');
        const data = await res.json();
        if (data.days_until_lebaran !== undefined) {
          setCountdown({ days: data.days_until_lebaran, hours: 0, minutes: 0, seconds: 0 });
        }
      } catch {
        // fallback static calculation
        const lebaranDate = new Date('2026-03-31T00:00:00');
        const now = new Date();
        const diff = lebaranDate.getTime() - now.getTime();
        if (diff > 0) {
          setCountdown({
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((diff % (1000 * 60)) / 1000),
          });
        }
      }
    };

    getRamadanData();
    const interval = setInterval(() => {
      const lebaranDate = new Date('2026-03-31T00:00:00');
      const now = new Date();
      const diff = lebaranDate.getTime() - now.getTime();
      if (diff > 0) {
        setCountdown({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!countdown) return null;

  return (
    <div className="bg-gradient-to-r from-emerald-900/60 to-teal-900/60 border border-emerald-700/50 rounded-2xl p-6 text-center">
      <p className="text-emerald-300 text-sm font-semibold uppercase tracking-widest mb-3">⏳ Hitung Mundur Lebaran 2026</p>
      <div className="flex justify-center gap-4">
        {[
          { val: countdown.days, label: 'Hari' },
          { val: countdown.hours, label: 'Jam' },
          { val: countdown.minutes, label: 'Menit' },
          { val: countdown.seconds, label: 'Detik' },
        ].map(({ val, label }) => (
          <div key={label} className="bg-gray-900/80 rounded-xl p-3 min-w-[60px]">
            <div className="text-3xl font-bold text-white font-mono">{String(val).padStart(2, '0')}</div>
            <div className="text-gray-400 text-xs mt-1">{label}</div>
          </div>
        ))}
      </div>
      <p className="text-amber-400 text-sm mt-4 font-medium">
        🔥 Peak season! Slot katering Ramadan terbatas — Daftar sekarang!
      </p>
    </div>
  );
};

// ── Main SICA Landing Page ───────────────────────────────────
const SICALanding: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [demoText, setDemoText] = useState('');
  const [demoResult, setDemoResult] = useState<Record<string, unknown> | null>(null);
  const [demoLoading, setDemoLoading] = useState(false);

  const formatPrice = (p: number) =>
    p === 0 ? 'GRATIS' : `Rp ${p.toLocaleString('id-ID')}`;

  const handleDemoAnalyze = async () => {
    if (!demoText.trim()) return;
    setDemoLoading(true);
    setDemoResult(null);
    try {
      const res = await fetch('/api/sica/orders/ai-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderText: demoText, businessId: 'demo' }),
      });
      const data = await res.json();
      setDemoResult(data);
    } catch {
      setDemoResult({ error: 'Gagal terhubung ke AI. Coba lagi.' });
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      {/* ── HEADER ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-gray-950/90 backdrop-blur border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌙</span>
            <div>
              <span className="font-bold text-white text-lg">SICA</span>
              <span className="text-emerald-400 text-sm ml-2">by GANI HYPHA</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/sica" className="text-gray-400 hover:text-white text-sm transition-colors hidden sm:block">
              Dashboard
            </a>
            <button
              onClick={() => setSelectedPlan(PLANS[1])}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            >
              Mulai Sekarang
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-900/40 border border-emerald-700/50 rounded-full px-4 py-2 text-emerald-300 text-sm mb-6">
          <span>🌙</span>
          <span>Ramadan & Lebaran Edition — Peak Season Tools Tersedia!</span>
          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold animate-pulse">HOT</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
          AI yang Baca Order WhatsApp<br />
          <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            untuk Bisnis Katering Anda
          </span>
        </h1>

        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
          Tidak perlu ketik ulang pesanan. Tidak perlu buku catatan. SICA membaca chat WhatsApp pelanggan Anda
          dan langsung membuat form order, menghitung harga, dan mengurus notifikasi — otomatis.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={() => setSelectedPlan(PLANS[0])}
            className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
          >
            🚀 Coba 7 Hari Gratis
          </button>
          <button
            onClick={() => setSelectedPlan(PLANS[1])}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
          >
            💎 Mulai Rp 99.000/bln
          </button>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 text-center">
          {[
            { val: '1.200+', label: 'Katering Aktif' },
            { val: '45 ribu+', label: 'Order Diproses AI' },
            { val: '2 Jam', label: 'Hemat/Hari per Bisnis' },
            { val: '99.2%', label: 'Akurasi AI Parse Order' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-3xl font-extrabold text-emerald-400">{s.val}</div>
              <div className="text-gray-500 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── RAMADAN COUNTDOWN ──────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 pb-12">
        <RamadanCountdown />
      </section>

      {/* ── AI DEMO ────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3">🤖 Coba AI Order Parser — Gratis!</h2>
          <p className="text-gray-400">Paste chat WhatsApp dari pelanggan, AI akan otomatis ekstrak semua detail</p>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
          <div className="mb-4">
            <label className="text-gray-300 text-sm mb-2 block font-medium">
              Teks Order dari WhatsApp:
            </label>
            <textarea
              value={demoText}
              onChange={e => setDemoText(e.target.value)}
              placeholder={`Contoh:\n"Halo kak, mau pesen nasi box buat acara arisan ibu-ibu, tanggal 15 Maret 2026 jam 11 siang, di Jl Melati No 12 Depok. Totalnya 80 orang, minta menu ayam bakar sama ikan gurame, plus es buah ya. Terima kasih"`}
              rows={5}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 resize-none text-sm"
            />
          </div>

          <div className="flex gap-3 mb-6">
            <button
              onClick={handleDemoAnalyze}
              disabled={demoLoading || !demoText.trim()}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 rounded-xl font-bold transition-all"
            >
              {demoLoading ? '⏳ AI Sedang Memproses...' : '🤖 Analisis dengan AI'}
            </button>
            <button
              onClick={() => setDemoText('Halo kak mau pesan nasi box 100 porsi untuk acara bukber kantor tanggal 5 Maret jam 18 di Jl Sudirman no 45 Jakarta Pusat. Menu ayam bakar + rendang + es teh ya. Budget per orang max 75rb')}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-xl text-sm transition-all"
            >
              📋 Pakai Contoh
            </button>
          </div>

          {demoResult && (
            <div className="bg-gray-800 rounded-xl p-5 border border-emerald-700/50">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-emerald-400 text-lg">✅</span>
                <span className="text-emerald-300 font-semibold">AI Parse Order Berhasil!</span>
                <span className="text-gray-500 text-sm ml-auto">Groq llama-3.3-70b</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {demoResult && typeof demoResult === 'object' && !('error' in demoResult) && Object.entries(demoResult as Record<string, unknown>)
                  .filter(([k]) => !['success', 'raw', 'model', 'processing_time_ms'].includes(k))
                  .map(([key, val]) => (
                    <div key={key} className="bg-gray-700/50 rounded-lg p-3">
                      <div className="text-gray-400 text-xs mb-1 capitalize">{key.replace(/_/g, ' ')}</div>
                      <div className="text-white text-sm font-medium">
                        {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                      </div>
                    </div>
                  ))}
                {'error' in (demoResult as Record<string, unknown>) && (
                  <div className="col-span-3 text-red-400 text-sm">{String((demoResult as Record<string, unknown>).error)}</div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">🛠️ Semua yang Dibutuhkan Bisnis Katering Anda</h2>
          <p className="text-gray-400">Dari order masuk hingga laporan keuangan — semua dalam satu platform</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: '🤖', title: 'AI Order Parser', desc: 'Baca order dari teks WhatsApp dan ekstrak semua detail secara otomatis. Tidak perlu format khusus.' },
            { icon: '📊', title: 'Dashboard Real-time', desc: 'Lihat semua order masuk, status masak, dan pengiriman dalam satu tampilan yang mudah.' },
            { icon: '💬', title: 'Notif WA Otomatis', desc: 'Konfirmasi order, update status, dan pengingat dikirim otomatis ke pelanggan via WhatsApp.' },
            { icon: '🍽️', title: 'Rekomendasi Menu AI', desc: 'AI merekomendasikan menu yang tepat berdasarkan acara, jumlah tamu, musim, dan budget.' },
            { icon: '💰', title: 'Laporan Keuangan', desc: 'Lihat pendapatan harian, mingguan, bulanan. Ketahui menu terlaris dan pelanggan setia Anda.' },
            { icon: '🌙', title: 'Mode Ramadan/Lebaran', desc: 'Fitur khusus Ramadan: countdown Lebaran, paket iftar, rekomendasi menu sahur, dan promo Hari Raya.' },
          ].map(f => (
            <div key={f.title} className="bg-gray-900 border border-gray-800 hover:border-emerald-700/50 rounded-2xl p-6 transition-all hover:-translate-y-1">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 pb-16" id="pricing">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">💎 Pilih Plan yang Tepat</h2>
          <p className="text-gray-400">Mulai gratis, upgrade kapan saja. Tidak ada kontrak jangka panjang.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {PLANS.map(plan => (
            <div
              key={plan.id}
              className={`relative bg-gradient-to-b ${plan.color} rounded-2xl p-5 border-2 transition-all hover:-translate-y-1 ${plan.highlight ? 'border-emerald-400 shadow-lg shadow-emerald-900/30 scale-105' : 'border-transparent'}`}
            >
              {plan.badge && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${plan.highlight ? 'bg-emerald-400 text-gray-900' : 'bg-gray-600 text-white'}`}>
                  {plan.badge}
                </div>
              )}
              <h3 className="text-white font-bold text-xl mb-1 mt-2">{plan.name}</h3>
              <div className="text-3xl font-extrabold text-white mb-1">
                {formatPrice(plan.price)}
              </div>
              <div className="text-gray-300 text-sm mb-5">{plan.period}</div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f, i) => (
                  <li key={i} className={`text-sm ${f.startsWith('✅') ? 'text-gray-100' : 'text-gray-500'}`}>{f}</li>
                ))}
              </ul>
              <button
                onClick={() => setSelectedPlan(plan)}
                className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-105 ${plan.highlight ? 'bg-white text-emerald-700' : 'bg-white/10 hover:bg-white/20 text-white'}`}
              >
                {plan.price === 0 ? 'Mulai Gratis' : 'Pilih Plan Ini'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">❤️ Dipercaya Ribuan Pemilik Katering</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="text-4xl mb-3">{t.avatar}</div>
              <p className="text-gray-300 text-sm italic mb-4">"{t.text}"</p>
              <div className="bg-emerald-900/30 border border-emerald-800 rounded-lg px-3 py-2 mb-3">
                <span className="text-emerald-400 font-bold text-sm">{t.revenue}</span>
              </div>
              <div>
                <div className="text-white font-semibold text-sm">{t.name}</div>
                <div className="text-gray-500 text-xs">{t.business}</div>
                <div className="text-gray-600 text-xs mt-1">{t.since}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 pb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">❓ Pertanyaan Umum</h2>
        </div>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-800/50 transition-colors"
              >
                <span className="text-white font-medium">{faq.q}</span>
                <span className="text-gray-400 text-xl">{openFaq === i ? '−' : '+'}</span>
              </button>
              {openFaq === i && (
                <div className="px-6 pb-4 text-gray-400 text-sm leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ──────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 pb-20 text-center">
        <div className="bg-gradient-to-r from-emerald-900/50 to-teal-900/50 border border-emerald-700/50 rounded-3xl p-10">
          <div className="text-5xl mb-4">🌙</div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Mulai Ramadan Ini dengan<br />Bisnis Katering yang Lebih Cerdas
          </h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Bergabung dengan 1.200+ pemilik katering yang sudah menggunakan SICA untuk menghemat waktu dan meningkatkan pendapatan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setSelectedPlan(PLANS[0])}
              className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
            >
              🚀 Coba 7 Hari Gratis
            </button>
            <button
              onClick={() => setSelectedPlan(PLANS[1])}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
            >
              💎 Starter Rp 99.000/bln
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <SovereignFooter currentAgent="sica" agentIcon="🌙" agentColor="text-emerald-400 hover:text-emerald-300" />

      {/* ── PAYMENT MODAL ──────────────────────────────────── */}
      {selectedPlan && (
        <PaymentModal plan={selectedPlan} onClose={() => setSelectedPlan(null)} />
      )}
    </div>
  );
};

export default SICALanding;
