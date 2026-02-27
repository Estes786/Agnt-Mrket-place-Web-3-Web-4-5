
// ============================================================
// 🎁 SHGA LANDING PAGE — Sovereign Hamper & Gift Agent
// Public Marketing Page — No Auth Required
// Revenue: Rp 199K - 2.499M / musim
// Lebaran Special Edition — Peak Season 2026
// Part of GANI HYPHA Sovereign Agent Ecosystem
// Session #029 | HOLY 2.5 UPGRADE
// ============================================================

import React, { useState, useEffect } from 'react';

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  highlight?: boolean;
  badge?: string;
  color: string;
}

const PLANS: Plan[] = [
  {
    id: 'shga-trial',
    name: 'Gratis Coba',
    price: 0,
    period: '7 hari',
    features: [
      '✅ Katalog produk (5 produk)',
      '✅ AI Gift Recommendation (3x/hari)',
      '✅ Countdown Lebaran real-time',
      '❌ Order management',
      '❌ Custom packaging digital',
      '❌ WhatsApp notifikasi',
    ],
    badge: 'TANPA KARTU KREDIT',
    color: 'from-gray-700 to-gray-800',
  },
  {
    id: 'shga-lebaran',
    name: 'Lebaran Edition',
    price: 299000,
    period: '/musim (3 bulan)',
    features: [
      '✅ Katalog produk unlimited',
      '✅ AI Gift Recommendation unlimited',
      '✅ Order management lengkap',
      '✅ Custom label digital Lebaran',
      '✅ WhatsApp notifikasi otomatis',
      '✅ Laporan penjualan musiman',
      '❌ API e-commerce integration',
    ],
    badge: '🎊 TERLARIS LEBARAN',
    highlight: true,
    color: 'from-amber-700 to-orange-800',
  },
  {
    id: 'shga-pro',
    name: 'Pro Sepanjang Tahun',
    price: 499000,
    period: '/bulan',
    features: [
      '✅ Semua fitur Lebaran Edition',
      '✅ Multi-event: Natal, Tahun Baru, Valentine',
      '✅ Custom packaging digital premium',
      '✅ Analytics & insight tren hadiah',
      '✅ Priority support',
      '✅ 3 Akun Admin',
      '✅ API Tokopedia/Shopee (beta)',
    ],
    color: 'from-amber-600 to-yellow-700',
  },
  {
    id: 'shga-enterprise',
    name: 'Enterprise',
    price: 1499000,
    period: '/bulan',
    features: [
      '✅ Semua fitur Pro',
      '✅ White-label solution',
      '✅ Custom AI untuk brand Anda',
      '✅ B2B Corporate Gift Management',
      '✅ Integration ERP/POS',
      '✅ Dedicated Account Manager',
      '✅ SLA 99.9% uptime guarantee',
    ],
    badge: 'UNTUK DISTRIBUTOR',
    color: 'from-purple-700 to-violet-800',
  },
];

const HAMPER_SHOWCASE = [
  {
    name: 'Hamper Lebaran Premium Nusantara',
    price: 'Rp 450.000',
    items: ['Kurma Madu Madinah 500g', 'Sirup Marjan Cocopandan', 'Kue Lebaran Assorted', 'Minyak Goreng 1L', 'Gula Pasir 500g'],
    badge: 'TERLARIS',
    icon: '🎁',
  },
  {
    name: 'Hamper Korporat Silver',
    price: 'Rp 750.000',
    items: ['Cokelat Silverqueen Premium', 'Kopi Arabika Specialty', 'Teh Herbal Premium', 'Biskuit Imported', 'Minyak Zaitun Extra Virgin'],
    badge: 'CORPORATE FAVORITE',
    icon: '👔',
  },
  {
    name: 'Hamper Anak Spesial Lebaran',
    price: 'Rp 280.000',
    items: ['Permen & Cokelat Assorted', 'Biskuit Karakter', 'Juice Box 3 rasa', 'Mainan Edukatif', 'Amplop Lebaran Set'],
    badge: 'ANAK SUKA!',
    icon: '🧒',
  },
  {
    name: 'Hamper Sembako Berkah',
    price: 'Rp 185.000',
    items: ['Beras 5 Kg', 'Minyak 2L', 'Gula 1 Kg', 'Sirup 1 Botol', 'Teh & Kopi Sachet'],
    badge: 'PALING TERJANGKAU',
    icon: '🌾',
  },
];

const TESTIMONIALS = [
  {
    name: 'Bu Dewi Kusuma',
    role: 'Owner Toko Hamper & Parcel, Solo',
    avatar: '👩‍💼',
    text: 'SHGA membantu saya handle ratusan order Lebaran tanpa pusing. AI-nya kasih rekomendasi paket yang pas buat setiap budget pelanggan. Omzet Lebaran tahun ini naik 2x lipat!',
    metric: '+Rp 45 juta Lebaran 2025',
  },
  {
    name: 'Pak Hendra Wijaya',
    role: 'HR Manager, PT Maju Bersama Jakarta',
    avatar: '👨‍💼',
    text: 'Kami pakai SHGA Enterprise untuk distribusi 500 hamper karyawan. Prosesnya sangat mudah — tinggal input daftar nama, AI langsung atur semua packaging dan notifikasi otomatis.',
    metric: '500 hamper korporat/tahun',
  },
  {
    name: 'Mbak Sella',
    role: 'Reseller Hamper Online, Yogyakarta',
    avatar: '👩',
    text: 'Fitur AI Recommendation-nya luar biasa. Customer tinggal kasih budget dan preferensi, langsung dapat 3 pilihan paket lengkap dengan harga dan isi. Closing rate saya naik 60%!',
    metric: '+60% closing rate',
  },
];

interface PaymentModalProps {
  plan: Plan;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ plan, onClose }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', businessName: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; url?: string; error?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          agent: 'SHGA',
        }),
      });
      const data = await res.json();
      if (data.success && data.payment_url) {
        setResult({ success: true, url: data.payment_url });
        setTimeout(() => { window.location.href = data.payment_url; }, 1500);
      } else {
        setResult({ success: false, error: data.error || 'Gagal membuat invoice.' });
      }
    } catch {
      setResult({ success: false, error: 'Koneksi gagal. Coba lagi.' });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (p: number) => p === 0 ? 'GRATIS' : `Rp ${p.toLocaleString('id-ID')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 border border-amber-700/50 rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-white font-bold text-xl">🎁 Mulai {plan.name}</h2>
            <p className="text-amber-400 font-semibold mt-1">{formatPrice(plan.price)} {plan.period}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>

        {result ? (
          <div className={`text-center py-6 rounded-xl ${result.success ? 'bg-amber-900/30 border border-amber-700' : 'bg-red-900/30 border border-red-700'}`}>
            {result.success ? (
              <>
                <div className="text-4xl mb-3">✅</div>
                <p className="text-amber-300 font-semibold">Invoice berhasil dibuat!</p>
                <p className="text-gray-400 text-sm mt-1">Anda akan diarahkan ke halaman pembayaran...</p>
                {result.url && <a href={result.url} className="mt-3 inline-block text-amber-400 underline text-sm">Klik di sini jika tidak redirect</a>}
              </>
            ) : (
              <>
                <div className="text-4xl mb-3">❌</div>
                <p className="text-red-300">{result.error}</p>
                <button onClick={() => setResult(null)} className="mt-3 text-sm text-gray-400 underline">Coba lagi</button>
              </>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Nama Lengkap *', field: 'name', type: 'text', placeholder: 'Nama Anda', required: true },
              { label: 'Email *', field: 'email', type: 'email', placeholder: 'email@contoh.com', required: true },
              { label: 'No. WhatsApp *', field: 'phone', type: 'tel', placeholder: '08xxxxxxxxxx', required: true },
              { label: 'Nama Bisnis', field: 'businessName', type: 'text', placeholder: 'Hamper Bu Dewi', required: false },
            ].map(({ label, field, type, placeholder, required }) => (
              <div key={field}>
                <label className="text-gray-300 text-sm mb-1 block">{label}</label>
                <input
                  type={type}
                  required={required}
                  value={form[field as keyof typeof form]}
                  onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            ))}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:opacity-50 transition-all"
            >
              {loading ? '⏳ Memproses...' : plan.price === 0 ? '🎁 Mulai Gratis' : `💳 Bayar ${formatPrice(plan.price)}`}
            </button>
            <p className="text-gray-500 text-xs text-center">Aman via QRIS · Transfer Bank · E-Wallet</p>
          </form>
        )}
      </div>
    </div>
  );
};

// ── Lebaran Countdown ──────────────────────────────────────
const LebaranCountdown: React.FC = () => {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const lebaranDate = new Date('2026-03-31T00:00:00+07:00');
    const update = () => {
      const diff = lebaranDate.getTime() - Date.now();
      if (diff > 0) {
        setTime({
          days: Math.floor(diff / 86400000),
          hours: Math.floor((diff % 86400000) / 3600000),
          minutes: Math.floor((diff % 3600000) / 60000),
          seconds: Math.floor((diff % 60000) / 1000),
        });
      }
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="bg-gradient-to-r from-amber-900/50 to-orange-900/50 border border-amber-600/50 rounded-2xl p-8 text-center">
      <div className="text-4xl mb-3">🌙✨🌙</div>
      <h3 className="text-amber-300 font-bold text-xl mb-1">Marhaban Ya Ramadan!</h3>
      <p className="text-gray-400 text-sm mb-6">Idul Fitri 1447 H · 31 Maret 2026</p>
      <div className="flex justify-center gap-3 md:gap-6">
        {[
          { val: time.days, label: 'Hari' },
          { val: time.hours, label: 'Jam' },
          { val: time.minutes, label: 'Menit' },
          { val: time.seconds, label: 'Detik' },
        ].map(({ val, label }) => (
          <div key={label} className="bg-gray-900/80 border border-amber-700/30 rounded-xl p-4 min-w-[72px]">
            <div className="text-4xl font-extrabold text-amber-300 font-mono tabular-nums">
              {String(val).padStart(2, '0')}
            </div>
            <div className="text-gray-400 text-xs mt-2 uppercase tracking-widest">{label}</div>
          </div>
        ))}
      </div>
      <div className="mt-6 bg-red-900/30 border border-red-700/50 rounded-xl px-4 py-3 inline-block">
        <p className="text-red-300 font-semibold text-sm">
          ⚠️ Deadline pesan hamper: <strong>25 Maret 2026</strong> (H-6 Lebaran)
        </p>
      </div>
    </div>
  );
};

// ── AI Gift Demo ───────────────────────────────────────────
const AIGiftDemo: React.FC = () => {
  const [budget, setBudget] = useState('');
  const [occasion, setOccasion] = useState('lebaran');
  const [recipient, setRecipient] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);

  const handleDemo = async () => {
    if (!budget) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/shga/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budget: parseInt(budget), occasion, recipient_type: recipient || 'umum' }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ error: 'Koneksi gagal. Coba lagi.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 border border-amber-700/50 rounded-2xl p-6">
      <div className="mb-5">
        <h3 className="text-white font-bold text-lg mb-1">🤖 Coba AI Gift Advisor — Gratis!</h3>
        <p className="text-gray-400 text-sm">Masukkan budget dan AI akan rekomendasikan 3 paket hamper terbaik</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="text-gray-300 text-sm mb-1 block">Budget (Rp)</label>
          <input
            type="number"
            value={budget}
            onChange={e => setBudget(e.target.value)}
            placeholder="Contoh: 300000"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
          />
        </div>
        <div>
          <label className="text-gray-300 text-sm mb-1 block">Acara</label>
          <select
            value={occasion}
            onChange={e => setOccasion(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
          >
            <option value="lebaran">Lebaran / Idul Fitri</option>
            <option value="natal">Natal / Tahun Baru</option>
            <option value="ulang_tahun">Ulang Tahun</option>
            <option value="pernikahan">Pernikahan</option>
            <option value="korporat">Hamper Korporat</option>
            <option value="wisuda">Wisuda</option>
          </select>
        </div>
        <div>
          <label className="text-gray-300 text-sm mb-1 block">Penerima</label>
          <input
            type="text"
            value={recipient}
            onChange={e => setRecipient(e.target.value)}
            placeholder="Orang tua, atasan, karyawan..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      <button
        onClick={handleDemo}
        disabled={loading || !budget}
        className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all mb-4"
      >
        {loading ? '⏳ AI Sedang Merekomendasikan...' : '🎁 Dapatkan Rekomendasi AI'}
      </button>

      {result && !('error' in result) && (
        <div className="space-y-3">
          {((result.recommendations as Array<Record<string, unknown>>) || []).map((rec, i) => (
            <div key={i} className="bg-gray-800 rounded-xl p-4 border border-amber-700/30">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-amber-300 font-bold">{String(rec.name || `Paket ${i + 1}`)}</h4>
                <span className="bg-amber-900/50 text-amber-300 text-xs px-2 py-1 rounded-full font-mono">
                  {rec.price_range ? String(rec.price_range) : ''}
                </span>
              </div>
              {rec.items && Array.isArray(rec.items) && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {(rec.items as string[]).map((item: string, j: number) => (
                    <span key={j} className="bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded-full">{item}</span>
                  ))}
                </div>
              )}
              {rec.reason && <p className="text-gray-400 text-xs italic">{String(rec.reason)}</p>}
            </div>
          ))}
          {result.cultural_tips && (
            <div className="bg-emerald-900/20 border border-emerald-800 rounded-xl p-4">
              <p className="text-emerald-300 text-sm font-semibold mb-1">💡 Tips Budaya:</p>
              <p className="text-gray-400 text-sm">{String(result.cultural_tips)}</p>
            </div>
          )}
        </div>
      )}
      {'error' in (result || {}) && (
        <p className="text-red-400 text-sm">{String((result as Record<string, unknown>).error)}</p>
      )}
    </div>
  );
};

// ── Main SHGA Landing ──────────────────────────────────────
const SHGALanding: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const formatPrice = (p: number) => p === 0 ? 'GRATIS' : `Rp ${p.toLocaleString('id-ID')}`;

  const faqs = [
    {
      q: 'Apakah SHGA bisa buat katalog hamper digital?',
      a: 'Ya! Anda bisa upload produk ke katalog digital SHGA. Pelanggan bisa lihat, pilih, dan order langsung dari link katalog yang Anda bagikan via WhatsApp atau media sosial.',
    },
    {
      q: 'Bagaimana AI merekomendasikan paket hamper?',
      a: 'AI SHGA mempertimbangkan budget, acara (Lebaran, Natal, dll), profil penerima (orang tua, atasan, karyawan), dan tren pasar untuk menghasilkan 3 rekomendasi paket terbaik dengan breakdown isi dan harga.',
    },
    {
      q: 'Apakah SHGA hanya untuk Lebaran?',
      a: 'Tidak! SHGA dirancang untuk semua momen pemberian hadiah: Lebaran, Natal, Tahun Baru, Hari Ibu, Valentine, ulang tahun, pernikahan, wisuda, dan hamper korporat sepanjang tahun. Lebaran hanyalah salah satu dari banyak fitur.',
    },
    {
      q: 'Berapa maksimum produk di katalog?',
      a: 'Plan Gratis: 5 produk. Lebaran Edition: unlimited. Pro & Enterprise: unlimited dengan fitur manajemen inventori lengkap.',
    },
    {
      q: 'Bisakah saya integrasi dengan Tokopedia/Shopee?',
      a: 'Fitur API integration dengan Tokopedia dan Shopee sedang dalam beta testing di Plan Pro. Akan tersedia penuh di Q2 2026. Enterprise sudah bisa request akses early.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      {/* ── HEADER ───────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-gray-950/90 backdrop-blur border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎁</span>
            <div>
              <span className="font-bold text-white text-lg">SHGA</span>
              <span className="text-amber-400 text-sm ml-2">by GANI HYPHA</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/shga" className="text-gray-400 hover:text-white text-sm hidden sm:block">Dashboard</a>
            <button
              onClick={() => setSelectedPlan(PLANS[1])}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            >
              Mulai Sekarang
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-900/40 border border-amber-700/50 rounded-full px-4 py-2 text-amber-300 text-sm mb-6">
          <span>🎊</span>
          <span>Lebaran 2026 Edition — Fitur Spesial Ramadan Aktif!</span>
          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold animate-pulse">NEW</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
          Platform Hamper & Hadiah<br />
          <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
            Berbasis Kecerdasan Buatan
          </span>
        </h1>

        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
          Kelola bisnis hamper Anda dari A sampai Z. AI merekomendasikan paket terbaik, 
          otomatis kirim notifikasi, dan buat laporan penjualan — semua dalam satu platform.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={() => setSelectedPlan(PLANS[0])}
            className="bg-white text-gray-900 hover:bg-amber-50 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
          >
            🎁 Coba Gratis 7 Hari
          </button>
          <button
            onClick={() => setSelectedPlan(PLANS[1])}
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
          >
            ✨ Lebaran Edition Rp 299.000
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-8 text-center">
          {[
            { val: '800+', label: 'Penjual Hamper Aktif' },
            { val: '25 ribu+', label: 'Hamper Terjual via SHGA' },
            { val: 'Rp 2.8M', label: 'Rata-rata Revenue/Lebaran' },
            { val: '3 Opsi', label: 'Rekomendasi AI per Request' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-3xl font-extrabold text-amber-400">{s.val}</div>
              <div className="text-gray-500 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── LEBARAN COUNTDOWN ────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 pb-12">
        <LebaranCountdown />
      </section>

      {/* ── AI DEMO ──────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3">🤖 AI Gift Advisor — Coba Sekarang!</h2>
          <p className="text-gray-400">Masukkan budget dan dapatkan 3 rekomendasi paket hamper dari AI</p>
        </div>
        <AIGiftDemo />
      </section>

      {/* ── HAMPER SHOWCASE ──────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">🛍️ Contoh Katalog Hamper</h2>
          <p className="text-gray-400">Buat katalog digital seperti ini untuk bisnis hamper Anda</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {HAMPER_SHOWCASE.map(h => (
            <div key={h.name} className="bg-gray-900 border border-gray-800 hover:border-amber-700/50 rounded-2xl p-5 transition-all hover:-translate-y-1">
              <div className="text-4xl mb-3 text-center">{h.icon}</div>
              <div className="bg-amber-900/30 text-amber-300 text-xs font-bold px-2 py-1 rounded-full text-center mb-3 w-fit mx-auto">
                {h.badge}
              </div>
              <h3 className="text-white font-semibold text-sm mb-1 text-center">{h.name}</h3>
              <p className="text-amber-400 font-bold text-center mb-3">{h.price}</p>
              <ul className="space-y-1">
                {h.items.map((item, i) => (
                  <li key={i} className="text-gray-400 text-xs flex items-center gap-1">
                    <span className="text-amber-500">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">💳 Harga yang Terjangkau</h2>
          <p className="text-gray-400">Mulai gratis, bayar hanya saat Anda siap. Tidak ada kontrak jangka panjang.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {PLANS.map(plan => (
            <div
              key={plan.id}
              className={`relative bg-gradient-to-b ${plan.color} rounded-2xl p-5 border-2 transition-all hover:-translate-y-1 ${plan.highlight ? 'border-amber-400 shadow-lg shadow-amber-900/30 scale-105' : 'border-transparent'}`}
            >
              {plan.badge && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${plan.highlight ? 'bg-amber-400 text-gray-900' : 'bg-gray-600 text-white'}`}>
                  {plan.badge}
                </div>
              )}
              <h3 className="text-white font-bold text-lg mt-2 mb-1">{plan.name}</h3>
              <div className="text-2xl font-extrabold text-white mb-1">{formatPrice(plan.price)}</div>
              <div className="text-gray-300 text-sm mb-5">{plan.period}</div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f, i) => (
                  <li key={i} className={`text-xs ${f.startsWith('✅') ? 'text-gray-100' : 'text-gray-500'}`}>{f}</li>
                ))}
              </ul>
              <button
                onClick={() => setSelectedPlan(plan)}
                className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-105 ${plan.highlight ? 'bg-white text-amber-700' : 'bg-white/10 hover:bg-white/20 text-white'}`}
              >
                {plan.price === 0 ? 'Mulai Gratis' : 'Pilih Plan'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">⭐ Cerita Sukses Pengguna SHGA</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="text-4xl mb-3">{t.avatar}</div>
              <p className="text-gray-300 text-sm italic mb-4">"{t.text}"</p>
              <div className="bg-amber-900/30 border border-amber-800 rounded-lg px-3 py-2 mb-3">
                <span className="text-amber-400 font-bold text-sm">{t.metric}</span>
              </div>
              <div className="text-white font-semibold text-sm">{t.name}</div>
              <div className="text-gray-500 text-xs">{t.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 pb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">❓ FAQ</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-800/50 transition-colors"
              >
                <span className="text-white font-medium text-sm">{faq.q}</span>
                <span className="text-gray-400 text-xl ml-4 shrink-0">{openFaq === i ? '−' : '+'}</span>
              </button>
              {openFaq === i && (
                <div className="px-6 pb-4 text-gray-400 text-sm leading-relaxed">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 pb-20 text-center">
        <div className="bg-gradient-to-r from-amber-900/50 to-orange-900/50 border border-amber-700/50 rounded-3xl p-10">
          <div className="text-5xl mb-4">🎊</div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Jadikan Lebaran 2026<br />Musim Panen Bisnis Hamper Anda!
          </h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Bergabung dengan 800+ penjual hamper yang sudah menggunakan SHGA. Mulai hari ini, 
            sebelum peak season berakhir.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setSelectedPlan(PLANS[0])}
              className="bg-white text-gray-900 hover:bg-amber-50 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
            >
              🎁 Coba Gratis Dulu
            </button>
            <button
              onClick={() => setSelectedPlan(PLANS[1])}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
            >
              ✨ Lebaran Edition Rp 299.000
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="border-t border-gray-800 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-gray-500 text-sm">
          <div className="flex items-center gap-2">
            <span>🎁</span>
            <span>SHGA — Part of <a href="https://gani-hypha-web3.pages.dev" className="text-amber-400 hover:text-amber-300">GANI HYPHA</a> Sovereign Ecosystem</span>
          </div>
          <div className="flex gap-6">
            <a href="/sca" className="hover:text-white transition-colors">SCA</a>
            <a href="/sica" className="hover:text-white transition-colors">SICA</a>
            <a href="/" className="hover:text-white transition-colors">Platform</a>
          </div>
          <div>Akar Dalam, Cabang Tinggi 🙏🏻</div>
        </div>
      </footer>

      {selectedPlan && <PaymentModal plan={selectedPlan} onClose={() => setSelectedPlan(null)} />}
    </div>
  );
};

export default SHGALanding;
