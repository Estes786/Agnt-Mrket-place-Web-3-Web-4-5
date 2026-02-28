import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SovereignNavBar } from './LandingNav';

// ============================================================
// SOVEREIGN STORE — GANI HYPHA Agent Marketplace
// Tempat khusus untuk produk standalone: SICA, SHGA, SCA, SMA
// Philosophy: "Akar Dalam, Cabang Tinggi" — Gyss! 🙏🏻
// ============================================================

interface Agent {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  icon: string;
  color: string;
  bgGradient: string;
  route: string;
  landingRoute?: string;
  status: 'live' | 'coming_soon' | 'beta';
  category: string;
  plans: Plan[];
  features: string[];
  usedBy: string;
  stats: { label: string; value: string }[];
  badge?: string;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  highlighted?: boolean;
}

interface PaymentModalProps {
  agent: Agent;
  plan: Plan;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ agent, plan, onClose }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);

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
          payment_method: ''
        })
      });
      const data = await res.json() as Record<string, unknown>;
      setResult(data);
    } catch (err) {
      setResult({ success: false, error: 'Koneksi gagal. Coba lagi.' });
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className={`p-5 rounded-t-2xl bg-gradient-to-r ${agent.bgGradient}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{agent.icon}</span>
              <div>
                <h3 className="font-bold text-white text-lg">💳 Berlangganan {agent.shortName}</h3>
                <p className="text-white/70 text-sm">{plan.name} — Rp {plan.price.toLocaleString('id-ID')}/{plan.period}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white/60 hover:text-white text-2xl">✕</button>
          </div>
        </div>

        <div className="p-5">
          {!result ? (
            <>
              <p className="text-slate-400 text-sm mb-4">
                Isi data untuk memulai berlangganan. Pembayaran aman via{' '}
                <span className="text-amber-400 font-semibold">Duitku</span>{' '}
                (QRIS, VA, GoPay, OVO, dll).
              </p>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
                  placeholder="Nama Lengkap *"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                />
                <input
                  type="email"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
                  placeholder="Email *"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                />
                <input
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
                  placeholder="No. WhatsApp (opsional)"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                />
                <button
                  type="submit"
                  disabled={loading || !form.name || !form.email}
                  className={`w-full py-3 rounded-xl font-bold text-white text-sm transition-all ${
                    loading ? 'bg-slate-600 cursor-not-allowed' : `bg-gradient-to-r ${agent.bgGradient} hover:opacity-90 active:scale-95`
                  }`}
                >
                  {loading ? '⏳ Memproses...' : `🚀 Bayar Rp ${plan.price.toLocaleString('id-ID')}`}
                </button>
                <p className="text-center text-slate-500 text-xs">🔒 Pembayaran aman via Duitku · QRIS · Virtual Account · GoPay · OVO</p>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="text-5xl mb-3">{result.payment_url ? '🎉' : result.success ? '📋' : '⚠️'}</div>
              <h4 className="text-white font-bold text-lg mb-2">
                {result.payment_url ? 'Order Berhasil Dibuat!' : result.success ? 'Order Diterima!' : 'Catatan'}
              </h4>
              {result.payment_url ? (
                <a
                  href={result.payment_url as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-block mt-3 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r ${agent.bgGradient} hover:opacity-90`}
                >
                  → Lanjut ke Halaman Pembayaran
                </a>
              ) : (
                <div className="mt-3 p-3 bg-slate-800 rounded-xl text-left">
                  {((result.fallback_payment as Record<string, unknown>)?.instructions as string[] || []).map((instr: string, i: number) => (
                    <p key={i} className="text-slate-400 text-sm">{instr}</p>
                  ))}
                  {result.error && <p className="text-red-400 text-sm">{result.error as string}</p>}
                </div>
              )}
              <button onClick={onClose} className="mt-4 text-slate-400 hover:text-white text-sm underline">Tutup</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────
// DATA AGENTS
// ──────────────────────────────────────────────────────────────
const AGENTS: Agent[] = [
  {
    id: 'shga',
    name: 'Sovereign Hamper & Gift Agent',
    shortName: 'SHGA',
    tagline: 'AI untuk bisnis hamper & gift Lebaran',
    description: 'Platform AI Agent untuk bisnis hamper, parcel, dan gift di Indonesia. Kelola order massal, katalog produk, dan pengiriman otomatis.',
    icon: '🎁',
    color: 'amber',
    bgGradient: 'from-amber-600 to-orange-600',
    route: '/shga',
    landingRoute: '/shga-landing',
    status: 'live',
    category: 'Retail & Gift',
    badge: '🔥 H-32 Lebaran!',
    usedBy: 'Bisnis hamper, toko oleh-oleh, UMKM',
    features: ['AI Gift Recommendations', 'Manajemen order massal', 'Tracking pengiriman', 'Lebaran countdown dashboard', 'Catalog digital', 'WhatsApp integration'],
    stats: [
      { label: 'Potensi Market', value: 'Rp 12T/tahun' },
      { label: 'H- Lebaran', value: '~32 hari' },
      { label: 'Revenue Est.', value: 'Rp 4M+/bln' }
    ],
    plans: [
      { id: 'shga-starter', name: 'SHGA Starter', price: 99000, period: 'bulan', features: ['Katalog 20 produk', 'Order tracking basic', 'Dashboard sederhana'] },
      { id: 'shga-pro', name: 'SHGA Professional', price: 299000, period: 'bulan', highlighted: true, features: ['Produk unlimited', 'AI gift recommendations', 'Bulk order management', 'Laporan keuangan'] },
      { id: 'shga-lebaran', name: 'SHGA Lebaran Special', price: 499000, period: 'musim', features: ['Semua fitur Pro', 'Custom hamper', 'Integrasi pengiriman', 'Priority support Lebaran'] }
    ]
  },
  {
    id: 'sica',
    name: 'Sovereign Iftar & Catering Agent',
    shortName: 'SICA',
    tagline: 'AI untuk katering Ramadan & event',
    description: 'Platform AI Agent untuk bisnis katering, restoran dengan paket Iftar, dan event organizer. Otomatisasi dari order hingga delivery.',
    icon: '🌙',
    color: 'indigo',
    bgGradient: 'from-indigo-600 to-purple-600',
    route: '/sica',
    landingRoute: '/sica-landing',
    status: 'live',
    category: 'F&B & Catering',
    badge: '🌙 Ramadan Special',
    usedBy: 'Katering Ramadan, restoran, event organizer',
    features: ['AI parse order WA', 'Menu recommendation AI', 'Manajemen pax & event', 'Invoice otomatis', 'Laporan harian', 'Multi-cabang support'],
    stats: [
      { label: 'Target Market', value: '500+ pax/hari' },
      { label: 'Automasi', value: '80% manual work' },
      { label: 'Revenue Est.', value: 'Rp 3M+/bln' }
    ],
    plans: [
      { id: 'sica-starter', name: 'SICA Starter', price: 99000, period: 'bulan', features: ['50 order/bulan', 'AI order parsing', 'Dashboard dasar'] },
      { id: 'sica-pro', name: 'SICA Professional', price: 299000, period: 'bulan', highlighted: true, features: ['Order unlimited', 'AI menu recommendations', 'Laporan keuangan', 'WhatsApp integration'] },
      { id: 'sica-enterprise', name: 'SICA Enterprise', price: 799000, period: 'bulan', features: ['Multi-cabang', 'WhatsApp Bot', 'API access', 'Custom dashboard'] }
    ]
  },
  {
    id: 'sca',
    name: 'Sovereign Contract Analyst',
    shortName: 'SCA',
    tagline: 'AI analis kontrak & dokumen legal',
    description: 'Platform AI Agent untuk analisis kontrak hukum. Deteksi pasal berbahaya, risk scoring, dan rekomendasi amandemen otomatis.',
    icon: '⚖️',
    color: 'emerald',
    bgGradient: 'from-emerald-600 to-teal-600',
    route: '/sca/app',
    landingRoute: '/sca-landing',
    status: 'live',
    category: 'Legal & Compliance',
    badge: '⚡ AI-Powered',
    usedBy: 'Freelancer, UKM, corporate legal team',
    features: ['Analisis kontrak AI', 'Risk score 1-10', 'Deteksi pasal berbahaya', 'Rekomendasi amandemen', 'Multi-format (PDF/TXT)', 'Bahasa Indonesia'],
    stats: [
      { label: 'Akurasi AI', value: '94%+' },
      { label: 'Waktu Analisis', value: '< 30 detik' },
      { label: 'Revenue Goal', value: '$500 USDC' }
    ],
    plans: [
      { id: 'sca-starter', name: 'SCA Starter', price: 149000, period: 'bulan', features: ['10 analisis/bulan', 'Risk scoring', 'PDF output'] },
      { id: 'sca-pro', name: 'SCA Professional', price: 499000, period: 'bulan', highlighted: true, features: ['Unlimited analisis', 'Priority AI', 'API access', 'History 90 hari'] },
      { id: 'sca-enterprise', name: 'SCA Enterprise', price: 1499000, period: 'bulan', features: ['Multi-user', 'White-label', 'Custom AI training', 'SLA 24/7'] }
    ]
  },
  {
    id: 'sma',
    name: 'Sovereign Multi-Industry Agent',
    shortName: 'SMA',
    tagline: 'Meta-platform semua Sovereign Agents',
    description: 'Platform induk tempat semua Sovereign Agents hidup. Gabungkan SICA + SHGA + SCA + agent baru sesuai kebutuhan bisnis Anda.',
    icon: '👑',
    color: 'violet',
    bgGradient: 'from-violet-600 to-purple-700',
    route: '/sma-landing',
    landingRoute: '/sma-landing',
    status: 'live',
    category: 'Multi-Industry Platform',
    badge: '🚀 NEW!',
    usedBy: 'Enterprise, multi-bisnis owners',
    features: ['Bundle semua agents', 'Custom agent kombinasi', 'Unified dashboard', 'Cross-agent analytics', 'White-label option', 'B2B reseller program'],
    stats: [
      { label: 'Agents Bundled', value: '6 agents' },
      { label: 'Industries', value: '10+ vertikal' },
      { label: 'Hemat', value: 'Hingga 60%' }
    ],
    plans: [
      { id: 'sma-starter', name: 'SMA Starter Bundle', price: 299000, period: 'bulan', features: ['2 agents pilihan', 'Unified dashboard', 'Basic analytics'] },
      { id: 'sma-pro', name: 'SMA Pro Bundle', price: 799000, period: 'bulan', highlighted: true, features: ['3 agents pilihan', 'Full analytics', 'API access', 'Priority support'] },
      { id: 'sma-enterprise', name: 'SMA Enterprise', price: 1999000, period: 'bulan', features: ['Semua agents', 'White-label', 'Custom agents', 'Dedicated support'] }
    ]
  },
  {
    id: 'sovereign-barber',
    name: 'Sovereign Barber Agent',
    shortName: 'SB',
    tagline: '"The Community Node" — AI Barbershop Management',
    description: 'Ubah barbershop Anda menjadi "Community Node" digital. AI-powered booking, Style Vault untuk klien, inventori otomatis, dan $HYPHA loyalty rewards. Solusi lengkap untuk barbershop modern.',
    icon: '💈',
    color: 'amber',
    bgGradient: 'from-amber-700 to-yellow-800',
    route: '/sovereign-barber',
    landingRoute: '/bde-landing',
    status: 'live',
    category: 'Barbershop Management',
    badge: '🔥 NEW',
    usedBy: 'Barbershop owners, grooming studios',
    features: ['AI Style Advisor (Groq)', 'Style Vault per klien (IPFS)', 'Smart Booking & Queue', 'Inventori auto-restock', '$HYPHA Loyalty Rewards', 'NFT Loyalty Badges', 'WhatsApp Integration', 'Revenue Analytics'],
    stats: [
      { label: 'Avg Revenue Boost', value: '+40%' },
      { label: 'Time Saved', value: '3 jam/hari' },
      { label: 'Klien Retention', value: '+65%' }
    ],
    plans: [
      { id: 'sb-starter', name: 'Starter Chair', price: 299000, period: 'bulan', features: ['50 booking/bulan', 'Style Vault 5 klien', 'AI Style Advisor 20x', 'Inventori tracking'] },
      { id: 'sb-pro', name: 'Sovereign Node', price: 799000, period: 'bulan', highlighted: true, features: ['Booking UNLIMITED', 'Style Vault UNLIMITED', 'AI Unlimited', '$HYPHA rewards', 'WhatsApp auto-reply'] },
      { id: 'sb-empire', name: 'Dynasty Empire', price: 1999000, period: 'bulan', features: ['Multi-barber & multi-cabang', 'Custom NFT badges', 'GANI Store integration', 'Analytics BI dashboard'] }
    ]
  },
  {
    id: 'sovereign-legacy',
    name: 'Sovereign Legacy Agent',
    shortName: 'SL',
    tagline: '"The Family Sanctuary" — Digital Legacy Vault + Home OS',
    description: 'Amankan warisan keluarga Anda secara digital. Legacy Vault terenkripsi AES-256 di IPFS, Web5 DID untuk identitas sovereign, Family Treasury dashboard, Home OS AI, dan Succession Protocol otomatis.',
    icon: '🏛️',
    color: 'violet',
    bgGradient: 'from-violet-800 to-purple-900',
    route: '/sovereign-legacy',
    landingRoute: '/legacy-landing',
    status: 'live',
    category: 'Family Legacy & Home OS',
    badge: '🔥 NEW',
    usedBy: 'Keluarga, kepala rumah tangga, profesional',
    features: ['Legacy Vault (IPFS + AES-256)', 'Web5 DID + DWN Identity', 'Family Treasury Dashboard', 'Home OS AI Planner', 'Succession Protocol', 'Dead Man\'s Switch', '$HYPHA Family Staking', 'Multi-sig Wallet'],
    stats: [
      { label: 'Dokumen Aman', value: '100%' },
      { label: 'Keamanan Data', value: 'Web5 Grade' },
      { label: 'Succession Speed', value: 'Otomatis' }
    ],
    plans: [
      { id: 'sl-starter', name: 'Sanctuary Starter', price: 299000, period: 'bulan', features: ['10 dokumen vault', 'IPFS 100MB', 'AES-256 enkripsi', 'Home OS 20 tugas'] },
      { id: 'sl-pro', name: 'Sovereign Sanctuary', price: 799000, period: 'bulan', highlighted: true, features: ['Vault UNLIMITED', 'Web5 DID + DWN', 'Family Treasury', 'Succession rules', '$HYPHA staking'] },
      { id: 'sl-forever', name: 'Legacy Forever', price: 1999000, period: 'bulan', features: ['IPFS UNLIMITED', 'Smart contract suksesi', 'ZKP Security', 'Multi-sig wallet', 'IoT Home bridge'] }
    ]
  }
];

// ──────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────
const SovereignStore: React.FC = () => {
  const navigate = useNavigate();
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [paymentModal, setPaymentModal] = useState<{ agent: Agent; plan: Plan } | null>(null);
  const [lebaranCountdown, setLebaranCountdown] = useState<Record<string, unknown> | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Fetch lebaran countdown
  useEffect(() => {
    fetch('/api/shga/lebaran/countdown')
      .then(r => r.json())
      .then((d: Record<string, unknown>) => setLebaranCountdown(d))
      .catch(() => {});
  }, []);

  const filteredAgents = activeFilter === 'all'
    ? AGENTS
    : AGENTS.filter(a => a.status === activeFilter || a.category.toLowerCase().includes(activeFilter.toLowerCase()));

  const colorMap: Record<string, string> = {
    amber: 'border-amber-500/40 hover:border-amber-400/60',
    indigo: 'border-indigo-500/40 hover:border-indigo-400/60',
    emerald: 'border-emerald-500/40 hover:border-emerald-400/60',
    violet: 'border-violet-500/40 hover:border-violet-400/60',
  };

  const badgeColor: Record<string, string> = {
    amber: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    indigo: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    emerald: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    violet: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* ✅ Standalone NavBar — untuk akses langsung dari landing pages */}
      <SovereignNavBar currentAgent="sca" ctaLabel="🛍️ Semua Agent" />

      <div className="p-4 md:p-6 space-y-6">
      {/* ── HEADER ── */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-violet-500/10 border border-violet-500/30 rounded-full text-violet-300 text-sm font-medium mb-2">
          <span>👑</span> SOVEREIGN AGENT MARKETPLACE
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Pilih Agent untuk Bisnis Anda
        </h1>
        <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
          Platform AI Agent siap pakai untuk bisnis Indonesia. Otomatisasi operasional, tingkatkan revenue, dan kelola lebih efisien.
        </p>
      </div>

      {/* ── LEBARAN BANNER ── */}
      {lebaranCountdown && (lebaranCountdown.is_peak_season as boolean) && (
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-900/40 to-orange-900/40 border border-amber-500/30 rounded-2xl p-4 md:p-5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="text-4xl">🌙</div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-amber-300 font-bold text-lg">Ramadan & Lebaran Special</h2>
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-bold">
                  H-{(lebaranCountdown.days_to_lebaran as number) || '32'} LEBARAN!
                </span>
              </div>
              <p className="text-amber-200/70 text-sm">
                Musim peak order SHGA & SICA! Deadline order hamper: <strong className="text-amber-300">{(lebaranCountdown.order_deadline_days as number) || '25'} hari lagi</strong>. Daftar sekarang sebelum terlambat.
              </p>
            </div>
            <button
              onClick={() => { setSelectedAgent(AGENTS.find(a => a.id === 'shga') || null) }}
              className="flex-shrink-0 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white rounded-xl text-sm font-bold transition-colors"
            >
              Lihat SHGA →
            </button>
          </div>
        </div>
      )}

      {/* ── QUICK NAV BUTTONS ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {AGENTS.map(agent => (
          <button
            key={agent.id}
            onClick={() => agent.landingRoute ? navigate(agent.landingRoute) : (agent.status !== 'coming_soon' ? navigate(agent.route) : setSelectedAgent(agent))}
            className={`relative p-4 rounded-2xl border bg-slate-900/80 transition-all hover:scale-[1.02] active:scale-95 ${colorMap[agent.color]}`}
          >
            {agent.badge && (
              <span className={`absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-xs font-bold border ${badgeColor[agent.color]} whitespace-nowrap`}>
                {agent.badge}
              </span>
            )}
            <div className="text-3xl mb-2 mt-1">{agent.icon}</div>
            <div className="font-bold text-white text-sm">{agent.shortName}</div>
            <div className="text-slate-400 text-xs mt-1 leading-tight">{agent.tagline}</div>
            {agent.status === 'live' && (
              <div className="mt-2 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-xs">Live</span>
              </div>
            )}
            {agent.status === 'coming_soon' && (
              <div className="mt-2 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                <span className="text-yellow-400 text-xs">Coming Soon</span>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* ── AGENT CARDS ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-bold text-lg">Semua Sovereign Agents</h2>
          <div className="flex gap-2">
            {['all', 'live', 'coming_soon'].map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  activeFilter === f ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {f === 'all' ? 'Semua' : f === 'live' ? '🟢 Live' : '🟡 Coming Soon'}
              </button>
            ))}
          </div>
        </div>

        {filteredAgents.map(agent => (
          <div
            key={agent.id}
            className={`border rounded-2xl overflow-hidden bg-slate-900/60 transition-all ${colorMap[agent.color]} ${agent.status === 'coming_soon' ? 'opacity-80' : ''}`}
          >
            {/* Card Header */}
            <div className={`p-4 md:p-5 bg-gradient-to-r ${agent.bgGradient}/20`}>
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${agent.bgGradient} flex items-center justify-center text-3xl flex-shrink-0`}>
                    {agent.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-white font-bold text-lg">{agent.shortName}</h3>
                      {agent.badge && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${badgeColor[agent.color]}`}>
                          {agent.badge}
                        </span>
                      )}
                      {agent.status === 'live' && (
                        <span className="flex items-center gap-1 text-green-400 text-xs">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                          Live
                        </span>
                      )}
                    </div>
                    <p className="text-slate-300 text-sm">{agent.name}</p>
                    <p className="text-slate-400 text-xs mt-1">{agent.tagline}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-3 md:flex-shrink-0">
                  {agent.stats.map((stat, i) => (
                    <div key={i} className="text-center">
                      <div className="text-white font-bold text-sm">{stat.value}</div>
                      <div className="text-slate-400 text-xs">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-slate-300 text-sm mt-3">{agent.description}</p>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mt-3">
                {agent.features.slice(0, 4).map((f, i) => (
                  <span key={i} className="px-2 py-1 bg-slate-800/60 text-slate-300 text-xs rounded-lg border border-slate-700/50">
                    ✓ {f}
                  </span>
                ))}
                {agent.features.length > 4 && (
                  <span className="px-2 py-1 bg-slate-800/60 text-slate-400 text-xs rounded-lg border border-slate-700/50">
                    +{agent.features.length - 4} lagi
                  </span>
                )}
              </div>
            </div>

            {/* Pricing */}
            <div className="p-4 md:p-5 border-t border-slate-700/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {agent.plans.map(plan => (
                  <div
                    key={plan.id}
                    className={`p-4 rounded-xl border transition-all ${
                      plan.highlighted
                        ? `bg-gradient-to-b ${agent.bgGradient}/10 border-${agent.color}-500/50`
                        : 'bg-slate-800/50 border-slate-700/50'
                    }`}
                  >
                    {plan.highlighted && (
                      <div className={`text-xs font-bold text-center mb-2 text-${agent.color}-300`}>
                        ⭐ PALING POPULER
                      </div>
                    )}
                    <div className="font-bold text-white text-sm">{plan.name}</div>
                    <div className="flex items-baseline gap-1 mt-1 mb-3">
                      <span className={`text-xl font-black ${plan.highlighted ? `text-${agent.color}-300` : 'text-white'}`}>
                        Rp {plan.price.toLocaleString('id-ID')}
                      </span>
                      <span className="text-slate-400 text-xs">/{plan.period}</span>
                    </div>
                    <ul className="space-y-1 mb-3">
                      {plan.features.map((f, i) => (
                        <li key={i} className="text-slate-400 text-xs flex items-start gap-1.5">
                          <span className="text-green-400 flex-shrink-0">✓</span> {f}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => {
                        if (agent.status === 'coming_soon') {
                          setSelectedAgent(agent);
                        } else {
                          setPaymentModal({ agent, plan });
                        }
                      }}
                      className={`w-full py-2 rounded-lg text-sm font-bold transition-all ${
                        agent.status === 'coming_soon'
                          ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                          : plan.highlighted
                          ? `bg-gradient-to-r ${agent.bgGradient} text-white hover:opacity-90 active:scale-95`
                          : 'bg-slate-700 text-white hover:bg-slate-600 active:scale-95'
                      }`}
                    >
                      {agent.status === 'coming_soon' ? '🔔 Notify Me' : plan.highlighted ? '🚀 Mulai Sekarang' : 'Pilih Plan'}
                    </button>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              {agent.status !== 'coming_soon' && (
                <div className="flex flex-col sm:flex-row gap-2 mt-4 pt-4 border-t border-slate-700/50">
                  {agent.landingRoute && (
                    <button
                      onClick={() => navigate(agent.landingRoute!)}
                      className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r ${agent.bgGradient} text-white hover:opacity-90 transition-all active:scale-95`}
                    >
                      🚀 Lihat Halaman {agent.shortName} →
                    </button>
                  )}
                  <button
                    onClick={() => navigate(agent.route)}
                    className="flex-1 py-2.5 px-4 rounded-xl font-bold text-sm bg-slate-700 text-white hover:bg-slate-600 transition-all active:scale-95 border border-slate-600"
                  >
                    {agent.icon} Buka Dashboard
                  </button>
                  <button
                    onClick={() => setSelectedAgent(agent)}
                    className="py-2.5 px-4 rounded-xl font-bold text-sm bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-all"
                  >
                    ℹ️ Detail
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── DETAIL MODAL ── */}
      {selectedAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedAgent(null)}>
          <div
            className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className={`p-5 rounded-t-2xl bg-gradient-to-r ${selectedAgent.bgGradient}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{selectedAgent.icon}</span>
                  <div>
                    <h3 className="font-bold text-white text-xl">{selectedAgent.shortName}</h3>
                    <p className="text-white/70 text-sm">{selectedAgent.name}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedAgent(null)} className="text-white/60 hover:text-white text-2xl">✕</button>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-slate-300 text-sm">{selectedAgent.description}</p>
              <div>
                <h4 className="text-white font-bold text-sm mb-2">✨ Semua Fitur:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedAgent.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-slate-400 text-xs">
                      <span className="text-green-400">✓</span> {f}
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {selectedAgent.stats.map((stat, i) => (
                  <div key={i} className="bg-slate-800 rounded-xl p-3 text-center">
                    <div className="text-white font-bold text-sm">{stat.value}</div>
                    <div className="text-slate-400 text-xs">{stat.label}</div>
                  </div>
                ))}
              </div>
              {selectedAgent.status !== 'coming_soon' ? (
                <div className="space-y-2">
                  {selectedAgent.landingRoute && (
                    <button
                      onClick={() => { setSelectedAgent(null); navigate(selectedAgent.landingRoute!); }}
                      className={`w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r ${selectedAgent.bgGradient} hover:opacity-90`}
                    >
                      🚀 Lihat Halaman {selectedAgent.shortName} →
                    </button>
                  )}
                  <button
                    onClick={() => { setSelectedAgent(null); navigate(selectedAgent.route); }}
                    className="w-full py-3 rounded-xl font-bold text-slate-200 bg-slate-700 hover:bg-slate-600 border border-slate-600"
                  >
                    {selectedAgent.icon} Buka {selectedAgent.shortName} Dashboard →
                  </button>
                </div>
              ) : (
                <div className="text-center py-3 bg-slate-800/50 rounded-xl">
                  <p className="text-slate-300 text-sm font-bold">🚀 Coming Soon!</p>
                  <p className="text-slate-400 text-xs mt-1">Target: Q2 2026. Daftar waitlist via email: elmatador0197@gmail.com</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── PAYMENT MODAL ── */}
      {paymentModal && (
        <PaymentModal
          agent={paymentModal.agent}
          plan={paymentModal.plan}
          onClose={() => setPaymentModal(null)}
        />
      )}
      </div>{/* end p-4 space-y-6 */}
    </div>
  );
};

export default SovereignStore;
