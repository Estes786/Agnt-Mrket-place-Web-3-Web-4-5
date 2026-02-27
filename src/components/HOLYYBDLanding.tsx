
// ============================================================
// 📜 HOLYYBD — HOLY PUBLIC DOCUMENTATION v1.0
// The Sovereign Infinity Manifesto — Public Build Log
// Route: /holyybd (public, no auth required)
// Philosophy: "Akar Dalam, Cabang Tinggi" — 1099% Growth Path
// Integrated: Duitku POP v2 + WhatsApp Fonnte Bot
// Version: SESSION_032 — Master Legacy Handoff
// ============================================================

import React, { useState, useEffect, useRef } from 'react';

// ── Types ──────────────────────────────────────────────────
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
  error?: string;
}

interface WaMessage {
  message: string;
  phone: string;
  sent: boolean;
  loading: boolean;
}

// ── HOLY Plans ─────────────────────────────────────────────
const HOLY_PLANS = [
  {
    id: 'holy-seed',
    name: 'HOLY SEED',
    subtitle: 'Tanam Benih Kedaulatanmu',
    price: 'Rp 99.000',
    price_num: 99000,
    period: '/bulan',
    badge: '🌱 Foundation',
    emoji: '🌿',
    color: 'from-emerald-700 to-teal-800',
    border: 'border-emerald-500',
    btnColor: 'bg-emerald-600 hover:bg-emerald-500',
    glow: 'shadow-emerald-500/20',
    growth: '+500%',
    features: [
      '✅ Akses 1 Sovereign Agent (pilih SCA/SICA/SHGA)',
      '✅ 10 AI analisis/bulan',
      '✅ WhatsApp report mingguan',
      '✅ HOLY.PUBLIC dokumentasi access',
      '✅ Komunitas Sovereign Discord',
      '❌ Multi-agent bundle',
      '❌ Legacy vault access',
    ],
    cta: 'Mulai Perjalanan',
    free_trial: true,
  },
  {
    id: 'holy-rise',
    name: 'HOLY RISE',
    subtitle: 'Bangkit Menuju 1000%',
    price: 'Rp 299.000',
    price_num: 299000,
    period: '/bulan',
    badge: '🔥 Most Popular',
    emoji: '⚡',
    color: 'from-violet-700 to-purple-800',
    border: 'border-violet-400',
    btnColor: 'bg-violet-600 hover:bg-violet-500',
    glow: 'shadow-violet-500/30',
    growth: '+1000%',
    features: [
      '✅ 3 Sovereign Agents (SCA + SICA + SHGA)',
      '✅ 50 AI analisis/bulan',
      '✅ WhatsApp bot otomatis (Fonnte)',
      '✅ HOLY.PUBLIC full dokumentasi',
      '✅ BDE Style Advisor access',
      '✅ Revenue tracking dashboard',
      '✅ Priority support 24/7',
    ],
    cta: 'Mulai Sekarang',
    free_trial: false,
    highlight: true,
  },
  {
    id: 'holy-sovereign',
    name: 'HOLY SOVEREIGN',
    subtitle: 'Kedaulatan Penuh 2000%',
    price: 'Rp 999.000',
    price_num: 999000,
    period: '/bulan',
    badge: '👑 SOVEREIGN',
    emoji: '💎',
    color: 'from-amber-600 to-orange-700',
    border: 'border-amber-400',
    btnColor: 'bg-amber-600 hover:bg-amber-500',
    glow: 'shadow-amber-500/30',
    growth: '+2000%',
    features: [
      '✅ SEMUA 6 Sovereign Agents',
      '✅ UNLIMITED AI analisis',
      '✅ WhatsApp bot full automation',
      '✅ Sovereign Legacy Vault access',
      '✅ $PREMALTA token rewards',
      '✅ HYPHA DAO governance voting',
      '✅ DWN Web5 storage 10GB',
      '✅ 1-on-1 strategy consultation',
    ],
    cta: 'Capai Kedaulatan',
    free_trial: false,
  },
];

// ── Growth Metrics ──────────────────────────────────────────
const GROWTH_METRICS = [
  { label: 'Revenue Growth Target', value: '+1099%', icon: '📈', color: 'text-emerald-400', desc: 'Dari Rp 0 → Rp 11M/bulan dalam 6 bulan' },
  { label: 'User Acquisition', value: '+500%', icon: '👥', color: 'text-violet-400', desc: 'Target 500 pengguna aktif Q2 2026' },
  { label: 'Agent ROI', value: '+1000%', icon: '🤖', color: 'text-blue-400', desc: 'AI agents dengan 10x return per investasi' },
  { label: 'Token Appreciation', value: '+2000%', icon: '💰', color: 'text-amber-400', desc: '$PREMALTA & $HYPHA long-term target' },
];

// ── Milestones ─────────────────────────────────────────────
const MILESTONES = [
  { phase: 'SESSION 008', title: 'Foundation Layer', status: 'done', emoji: '✅', desc: 'GANI HYPHA platform launched, Hono API v5.0 deployed' },
  { phase: 'SESSION 021-022', title: 'SICA & SHGA PRDs', status: 'done', emoji: '✅', desc: 'AI catering + hamper agents fully designed & coded' },
  { phase: 'SESSION 026', title: 'SCA + BDE Live', status: 'done', emoji: '✅', desc: '6 agents deployed, 6 landing pages live, v5.2.0' },
  { phase: 'SESSION 030', title: 'Sovereign Expansion', status: 'done', emoji: '✅', desc: 'Legacy vault, BDE, 21 payment plans, Supabase 12 tables' },
  { phase: 'SESSION 031', title: 'DB Fully Operational', status: 'done', emoji: '✅', desc: '12 Supabase tables live, .dev.vars configured, CF secrets set' },
  { phase: 'SESSION 032', title: 'HOLYYBD Public Launch', status: 'active', emoji: '🔥', desc: 'This session — HOLY.PUBLIC docs + Duitku POP V2 + WhatsApp bot' },
  { phase: 'SESSION 033', title: 'Revenue Engine ON', status: 'pending', emoji: '⏳', desc: 'First paying customers, Duitku production, $500 USDC target' },
  { phase: 'SESSION 034+', title: 'PREMALTA Liquidity', status: 'pending', emoji: '⏳', desc: '$300 USDC Uniswap V3, $HYPHA mainnet, DAO governance' },
];

// ── Agent Cards ─────────────────────────────────────────────
const SOVEREIGN_AGENTS = [
  {
    id: 'sca', name: 'Sovereign Contract Analyst', short: 'SCA', emoji: '⚖️',
    color: 'from-blue-700 to-cyan-800', border: 'border-blue-500',
    url: '/sca-landing', revenue: 'Rp 149K–1.5M/bulan',
    desc: 'AI analisis kontrak — deteksi klausul berbahaya, skor risiko 1-10, rekomendasi negosiasi',
    stats: { users: '30K+', market: 'Lawyers & Notaries', potential: '$1M ARR' },
  },
  {
    id: 'sica', name: 'Sovereign Intelligent Catering', short: 'SICA', emoji: '🍽️',
    color: 'from-orange-700 to-red-800', border: 'border-orange-500',
    url: '/sica-landing', revenue: 'Rp 199K–1.5M/bulan',
    desc: 'AI untuk bisnis katering — parse order WhatsApp otomatis, manajemen menu, invoice',
    stats: { users: '50K+', market: 'Catering Businesses', potential: '$2M ARR' },
  },
  {
    id: 'shga', name: 'Sovereign Hamper Gift Agent', short: 'SHGA', emoji: '🎁',
    color: 'from-pink-700 to-rose-800', border: 'border-pink-500',
    url: '/shga-landing', revenue: 'Rp 149K–1.5M/bulan',
    desc: 'AI rekomendasi hamper — personal gift advisor, countdown Lebaran, prediksi tren',
    stats: { users: '100K+', market: 'UMKM Hampers', potential: '$3M ARR' },
  },
  {
    id: 'bde', name: 'Barber Dynasty Engine', short: 'BDE', emoji: '✂️',
    color: 'from-slate-600 to-gray-800', border: 'border-slate-500',
    url: '/bde-landing', revenue: 'Rp 149K–1.5M/bulan',
    desc: 'AI style advisor untuk barbershop — StyleGen vision, booking otomatis, loyalty token',
    stats: { users: '20K+', market: 'Barbershops', potential: '$500K ARR' },
  },
  {
    id: 'sl', name: 'Sovereign Legacy', short: 'SL', emoji: '🏛️',
    color: 'from-indigo-700 to-violet-800', border: 'border-indigo-500',
    url: '/legacy-landing', revenue: 'Rp 199K–1.5M/bulan',
    desc: 'Warisan digital terenkripsi — family vault, dead-man\'s switch, Web5 DWN storage',
    stats: { users: '5K+', market: 'Legacy Planning', potential: '$2M ARR' },
  },
  {
    id: 'sma', name: 'Sovereign Meta Agent', short: 'SMA', emoji: '🌐',
    color: 'from-purple-700 to-fuchsia-800', border: 'border-purple-500',
    url: '/', revenue: 'Custom bundle',
    desc: 'Central hub — semua agent dalam satu platform, multi-industry AI orchestrator',
    stats: { users: '∞', market: 'All Industries', potential: '$10M ARR' },
  },
];

// ── Main Component ──────────────────────────────────────────
const HOLYYBDLanding: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [form, setForm] = useState<PaymentForm>({ plan_id: '', customer_name: '', customer_email: '', customer_phone: '' });
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [waMsg, setWaMsg] = useState<WaMessage>({ message: '', phone: '085643383832', sent: false, loading: false });
  const [activeTab, setActiveTab] = useState<'docs' | 'agents' | 'roadmap' | 'metrics' | 'wa'>('docs');
  const [copySuccess, setCopySuccess] = useState<string>('');
  const topRef = useRef<HTMLDivElement>(null);
  const payRef = useRef<HTMLDivElement>(null);

  // Countdown to Lebaran
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const lebaranDate = new Date('2026-03-30T00:00:00');
    const update = () => {
      const now = new Date();
      const diff = lebaranDate.getTime() - now.getTime();
      if (diff > 0) {
        setCountdown({
          days: Math.floor(diff / 86400000),
          hours: Math.floor((diff % 86400000) / 3600000),
          minutes: Math.floor((diff % 3600000) / 60000),
          seconds: Math.floor((diff % 60000) / 1000),
        });
      }
    };
    update();
    const iv = setInterval(update, 1000);
    return () => clearInterval(iv);
  }, []);

  // Revenue counter animation
  const [revenueAnim, setRevenueAnim] = useState(0);
  useEffect(() => {
    const target = 8000000;
    let current = 0;
    const step = target / 100;
    const iv = setInterval(() => {
      current = Math.min(current + step * 3, target);
      setRevenueAnim(Math.floor(current));
      if (current >= target) clearInterval(iv);
    }, 30);
    return () => clearInterval(iv);
  }, []);

  const handlePlanSelect = (planId: string) => {
    const plan = HOLY_PLANS.find(p => p.id === planId);
    if (!plan) return;
    setSelectedPlan(planId);
    setForm(f => ({ ...f, plan_id: planId }));
    setPaymentResult(null);
    setShowModal(true);
    setTimeout(() => payRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handlePayment = async () => {
    if (!form.customer_name || !form.customer_email || !form.customer_phone) {
      alert('Lengkapi semua data terlebih dahulu!');
      return;
    }
    setLoading(true);
    setPaymentResult(null);
    try {
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan_id: form.plan_id,
          customer_name: form.customer_name,
          customer_email: form.customer_email,
          customer_phone: form.customer_phone,
        }),
      });
      const data = await res.json() as PaymentResult;
      setPaymentResult(data);

      // Duitku POP V2 JS popup
      if (data.success && data.duitku_js) {
        const script = document.createElement('script');
        script.src = data.duitku_js;
        script.onload = () => {
          // @ts-ignore - Duitku global
          if (window.DuitkuPOP) {
            // @ts-ignore
            window.DuitkuPOP.showPopup(
              data.payment_url || '',
              () => { alert('✅ Pembayaran berhasil! Cek email Anda.'); setShowModal(false); },
              () => { alert('❌ Pembayaran dibatalkan.'); }
            );
          } else if (data.payment_url) {
            window.open(data.payment_url, '_blank');
          }
        };
        document.head.appendChild(script);
      } else if (data.success && data.payment_url) {
        window.open(data.payment_url, '_blank');
      }

      // Kirim notif WhatsApp via Fonnte setelah payment created
      if (data.success && form.customer_phone) {
        sendWhatsApp(
          form.customer_phone,
          `🔥 *SOVEREIGN AGENT ACTIVATED!*\n\nHalo ${form.customer_name}! 🙏🏻\n\nPembayaran paket *${HOLY_PLANS.find(p => p.id === form.plan_id)?.name}* sedang diproses.\n\n📦 Order ID: ${data.order_id}\n💰 Amount: ${data.amount_formatted}\n\nSelesaikan pembayaran di link berikut:\n${data.payment_url || 'Cek email Anda'}\n\n_Akar Dalam, Cabang Tinggi! Gyss!_ 🙏🏻\n\nGANI HYPHA — gani-hypha-web3.pages.dev`,
          true
        );
      }
    } catch (err) {
      setPaymentResult({ success: false, error: 'Koneksi gagal. Coba lagi atau hubungi WhatsApp admin.' });
    }
    setLoading(false);
  };

  // WhatsApp via Fonnte
  const sendWhatsApp = async (phone: string, message: string, silent = false) => {
    setWaMsg(prev => ({ ...prev, loading: true, sent: false }));
    try {
      const res = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, message }),
      });
      const data = await res.json() as { success: boolean; message?: string };
      if (!silent) setWaMsg(prev => ({ ...prev, sent: data.success, loading: false }));
      return data.success;
    } catch {
      if (!silent) setWaMsg(prev => ({ ...prev, loading: false }));
      return false;
    }
  };

  const handleWaSend = () => {
    if (!waMsg.message) return;
    sendWhatsApp(waMsg.phone, waMsg.message);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(label);
    setTimeout(() => setCopySuccess(''), 2000);
  };

  const formatIDR = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans" ref={topRef}>
      {/* ── HERO ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 pt-12 pb-16 px-4">
        {/* Background decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-600/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-violet-900/50 border border-violet-500/50 rounded-full px-4 py-1.5 text-sm font-medium text-violet-300 mb-6">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            SESSION_032 · HOLYYBD LIVE · Build in Public
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight">
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
              HOLY
            </span>
            <span className="text-white">YBD</span>
          </h1>
          <p className="text-xl md:text-2xl font-bold text-gray-300 mb-2">
            The Sovereign Infinity Manifesto
          </p>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto mb-8">
            Dokumentasi publik perjalanan membangun ekonomi otonom berbasis AI + Web3 + Web5.
            Dari <span className="text-emerald-400 font-bold">Rp 0</span> menuju{' '}
            <span className="text-amber-400 font-bold">+1099%</span> growth.
            <br />
            <em className="text-violet-300">Akar Dalam, Cabang Tinggi. Gyss! 🙏🏻</em>
          </p>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto mb-8">
            {GROWTH_METRICS.map(m => (
              <div key={m.label} className="bg-gray-900/80 border border-gray-700/50 rounded-xl p-3 text-center hover:border-violet-500/50 transition-all">
                <div className="text-2xl mb-1">{m.icon}</div>
                <div className={`text-2xl font-black ${m.color}`}>{m.value}</div>
                <div className="text-xs text-gray-400 leading-tight mt-1">{m.label}</div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <button
              onClick={() => { setActiveTab('docs'); topRef.current?.scrollIntoView({ behavior: 'smooth' }); }}
              className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105 shadow-lg shadow-violet-500/25"
            >
              📜 Baca Dokumentasi
            </button>
            <button
              onClick={() => handlePlanSelect('holy-rise')}
              className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105 shadow-lg shadow-amber-500/25"
            >
              ⚡ Daftar HOLY RISE
            </button>
            <a
              href={`https://wa.me/6285643383832?text=${encodeURIComponent('Halo! Saya tertarik dengan HOLYYBD Sovereign Agent. Bisa info lebih lanjut? 🙏🏻')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105 shadow-lg shadow-emerald-500/25 flex items-center gap-2"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp Admin
            </a>
          </div>

          {/* Lebaran Countdown */}
          <div className="bg-gradient-to-r from-emerald-900/50 to-teal-900/50 border border-emerald-500/30 rounded-2xl p-4 max-w-xl mx-auto">
            <p className="text-sm text-emerald-300 font-semibold mb-3">🌙 Lebaran Countdown — Peak Season SHGA!</p>
            <div className="grid grid-cols-4 gap-2">
              {[{ label: 'Hari', val: countdown.days }, { label: 'Jam', val: countdown.hours }, { label: 'Menit', val: countdown.minutes }, { label: 'Detik', val: countdown.seconds }].map(c => (
                <div key={c.label} className="text-center">
                  <div className="text-3xl font-black text-white">{String(c.val).padStart(2, '0')}</div>
                  <div className="text-xs text-emerald-400">{c.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── REVENUE WAR ROOM BANNER ── */}
      <div className="bg-gradient-to-r from-amber-900/30 via-orange-900/30 to-red-900/30 border-y border-amber-500/20 py-4 px-4">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider">⚔️ WAR ROOM — Revenue Mission</p>
            <p className="text-2xl font-black text-white">Target: <span className="text-amber-400">$500 USDC</span> <span className="text-gray-400 text-base font-normal">= {formatIDR(8000000)}</span></p>
            <p className="text-sm text-gray-400">Untuk: PREMALTA/USDC Liquidity Pool di Uniswap V3 Base</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Progress</p>
            <div className="w-48 h-3 bg-gray-800 rounded-full mt-1 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" style={{ width: '2%' }} />
            </div>
            <p className="text-xs text-gray-500 mt-1">~{formatIDR(revenueAnim)} / {formatIDR(8000000)}</p>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="sticky top-0 z-40 bg-gray-950/95 border-b border-gray-800 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto flex overflow-x-auto">
          {[
            { id: 'docs', label: '📜 HOLY.PUBLIC', emoji: '' },
            { id: 'agents', label: '🤖 Agents', emoji: '' },
            { id: 'roadmap', label: '🗺️ Roadmap', emoji: '' },
            { id: 'metrics', label: '📊 Metrics', emoji: '' },
            { id: 'wa', label: '💬 WhatsApp', emoji: '' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-shrink-0 px-5 py-4 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-violet-500 text-violet-300'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── TAB CONTENT ── */}
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* ── DOCS TAB ── */}
        {activeTab === 'docs' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-black mb-2">📜 HOLY.PUBLIC Documentation</h2>
              <p className="text-gray-400">Manifesto publik Sovereign Ecosystem — dibuat dengan transparansi penuh sebagai strategi kepercayaan.</p>
            </div>

            {/* What is HOLYYBD */}
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-violet-300 mb-4">🌟 Apa itu HOLYYBD?</h3>
              <div className="prose prose-invert max-w-none space-y-3 text-gray-300 text-sm leading-relaxed">
                <p>
                  <strong className="text-white">HOLYYBD</strong> adalah dokumentasi publik (<em>HOLY.PUBLIC</em>) dari proyek
                  GANI HYPHA — sebuah platform ekonomi otonom yang membangun jembatan antara{' '}
                  <span className="text-blue-400">Web2</span> →{' '}
                  <span className="text-violet-400">Web3</span> →{' '}
                  <span className="text-amber-400">Web5</span>.
                </p>
                <p>
                  Nama <strong className="text-white">HOLY</strong> mengacu pada komitmen suci (holy commitment) terhadap
                  transparansi, pertumbuhan, dan membangun sesuatu yang benar-benar bermakna.{' '}
                  <strong className="text-white">YBD</strong> = <em>"Yakin Bisa Dan"</em> — filosofi bahwa setiap mimpi
                  bisa diwujudkan dengan kerja keras, teknologi, dan kepercayaan.
                </p>
                <p>
                  Dokumentasi ini bersifat <span className="text-emerald-400 font-bold">100% publik</span> — siapapun
                  bisa membaca, memverifikasi, dan bahkan bergabung dalam perjalanan ini.
                </p>
              </div>
            </div>

            {/* Core Philosophy */}
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { emoji: '🌿', title: 'Akar Dalam', desc: 'Fondasi kuat: 12 tabel Supabase, 40+ API endpoints, TypeScript full-stack, Cloudflare edge 247 PoPs', color: 'border-emerald-600' },
                { emoji: '🌳', title: 'Cabang Tinggi', desc: 'Ekspansi besar: 6 Sovereign Agents, 21 paket harga, 6 landing pages, target $10M ARR jangka panjang', color: 'border-violet-600' },
                { emoji: '🙏🏻', title: 'Gyss!', desc: 'Spirit kolaborasi dan doa — semua dibangun dengan niat baik, untuk komunitas, dan keberkahan', color: 'border-amber-600' },
              ].map(p => (
                <div key={p.title} className={`bg-gray-900 border ${p.color} rounded-xl p-5`}>
                  <div className="text-3xl mb-3">{p.emoji}</div>
                  <h4 className="font-bold text-white mb-2">{p.title}</h4>
                  <p className="text-sm text-gray-400">{p.desc}</p>
                </div>
              ))}
            </div>

            {/* Tech Stack */}
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-blue-300 mb-4">⚙️ Tech Stack — GANI HYPHA v5.3.0</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { layer: 'Frontend', tech: 'React 19 + TypeScript + Tailwind 4', icon: '⚛️' },
                  { layer: 'Backend', tech: 'Hono v4 + Cloudflare Workers', icon: '⚡' },
                  { layer: 'AI Engine', tech: 'Groq llama-3.3-70b (free tier)', icon: '🤖' },
                  { layer: 'Database', tech: 'Supabase PostgreSQL (12 tables)', icon: '🗄️' },
                  { layer: 'Payments', tech: 'Duitku POP v2 + IDR gateway', icon: '💳' },
                  { layer: 'Messaging', tech: 'WhatsApp via Fonnte API', icon: '💬' },
                  { layer: 'Web3', tech: 'Base L2 + $PREMALTA ERC-20', icon: '🔗' },
                  { layer: 'Storage', tech: 'Pinata IPFS + Cloudflare R2', icon: '📦' },
                  { layer: 'Edge', tech: 'Cloudflare Pages 247 PoPs global', icon: '🌍' },
                ].map(s => (
                  <div key={s.layer} className="bg-gray-800/50 rounded-lg p-3">
                    <div className="text-lg mb-1">{s.icon}</div>
                    <div className="text-xs font-bold text-gray-300">{s.layer}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{s.tech}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue Strategy */}
            <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-600/40 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-amber-300 mb-4">💰 Revenue Strategy — The $500 Holy Path</h3>
              <div className="space-y-3">
                {[
                  { step: '1', title: 'Week 1-2: First Revenue', desc: 'Target 5 trial sign-up × Rp 99K = Rp 495K. Launch WhatsApp campaign ke grup katering & barbershop.', target: 'Rp 495K', color: 'text-emerald-400' },
                  { step: '2', title: 'Week 3-4: Duitku Production', desc: 'Approval Duitku selesai, payment live. Target 15 paying users × avg Rp 250K = Rp 3.75M.', target: 'Rp 3.75M', color: 'text-blue-400' },
                  { step: '3', title: 'Month 2: Scale', desc: '50 users aktif, SICA peak Lebaran, SHGA hamper season. Target total Rp 8M = $500 USDC.', target: 'Rp 8M', color: 'text-violet-400' },
                  { step: '4', title: 'Month 3+: Web3 Launch', desc: '$PREMALTA liquidity pool live di Uniswap V3 Base. $HYPHA token mainnet deployment.', target: '$10M ARR', color: 'text-amber-400' },
                ].map(s => (
                  <div key={s.step} className="flex gap-4 items-start">
                    <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0">
                      {s.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h4 className="font-bold text-white text-sm">{s.title}</h4>
                        <span className={`text-sm font-black ${s.color}`}>{s.target}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Credentials Quick Ref (Sanitized) */}
            <div className="bg-gray-900 border border-red-900/50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-red-300 mb-2">🔐 System Integration Overview</h3>
              <p className="text-xs text-gray-500 mb-4">Credential keys disimpan aman di Cloudflare Secrets — tidak diexpose di frontend.</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { service: 'Groq AI', status: '✅ Active', detail: 'llama-3.3-70b-versatile' },
                  { service: 'Supabase', status: '✅ Active', detail: '12 tables operational' },
                  { service: 'Cloudflare', status: '✅ Active', detail: 'Pages + Workers deployed' },
                  { service: 'Duitku POP v2', status: '⏳ Sandbox', detail: 'Menunggu production approval' },
                  { service: 'Fonnte WhatsApp', status: '✅ Active', detail: '085643383832 connected' },
                  { service: 'Alchemy Web3', status: '✅ Active', detail: 'Base + ETH + Polygon' },
                  { service: '$PREMALTA', status: '⚠️ No liquidity', detail: '0xC012...94c7 on Base' },
                  { service: 'GitHub', status: '✅ Active', detail: 'Estes786 main branch' },
                  { service: 'Pinata IPFS', status: '✅ Active', detail: 'NFT + DWN storage' },
                ].map(s => (
                  <div key={s.service} className="bg-gray-800/50 rounded-lg p-3">
                    <div className="text-xs font-bold text-white">{s.service}</div>
                    <div className="text-xs mt-0.5">{s.status}</div>
                    <div className="text-xs text-gray-500">{s.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── AGENTS TAB ── */}
        {activeTab === 'agents' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-black mb-2">🤖 6 Sovereign Agents</h2>
              <p className="text-gray-400">Setiap agent adalah bisnis SaaS lengkap — AI backend, landing page, payment gateway, WhatsApp bot.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {SOVEREIGN_AGENTS.map(agent => (
                <div key={agent.id} className={`bg-gradient-to-br ${agent.color} border ${agent.border} rounded-2xl p-5 hover:scale-[1.01] transition-all`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-3xl">{agent.emoji}</span>
                      <div className="mt-1">
                        <span className="text-xs bg-black/30 text-white px-2 py-0.5 rounded-full font-mono">{agent.short}</span>
                      </div>
                    </div>
                    <span className="text-xs bg-black/30 text-emerald-300 px-2 py-1 rounded-lg font-semibold">{agent.revenue}</span>
                  </div>
                  <h3 className="font-bold text-white mb-1">{agent.name}</h3>
                  <p className="text-sm text-gray-300 mb-3">{agent.desc}</p>
                  <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                    <div className="bg-black/20 rounded-lg p-2 text-center">
                      <div className="font-bold text-white">{agent.stats.users}</div>
                      <div className="text-gray-400">Market Size</div>
                    </div>
                    <div className="bg-black/20 rounded-lg p-2 text-center col-span-2">
                      <div className="font-bold text-amber-300">{agent.stats.potential}</div>
                      <div className="text-gray-400">{agent.stats.market}</div>
                    </div>
                  </div>
                  <a href={agent.url} className="block text-center bg-black/30 hover:bg-black/50 text-white text-sm py-2 rounded-lg transition-all font-semibold">
                    Buka Landing Page →
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ROADMAP TAB ── */}
        {activeTab === 'roadmap' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-black mb-2">🗺️ Session Roadmap</h2>
              <p className="text-gray-400">Setiap "session" adalah sprint development. Semua transparan dan terdokumentasi.</p>
            </div>
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-700" />
              <div className="space-y-4">
                {MILESTONES.map((m, i) => (
                  <div key={i} className={`relative flex gap-4 pl-14 ${m.status === 'pending' ? 'opacity-60' : ''}`}>
                    <div className={`absolute left-4 w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs
                      ${m.status === 'done' ? 'bg-emerald-600 border-emerald-400' : m.status === 'active' ? 'bg-violet-600 border-violet-400 animate-pulse' : 'bg-gray-800 border-gray-600'}`}>
                      {m.status === 'done' ? '✓' : m.status === 'active' ? '●' : '○'}
                    </div>
                    <div className={`flex-1 bg-gray-900 border rounded-xl p-4
                      ${m.status === 'active' ? 'border-violet-500' : m.status === 'done' ? 'border-emerald-800' : 'border-gray-800'}`}>
                      <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                        <span className="text-xs font-mono text-gray-500">{m.phase}</span>
                        <span className="text-lg">{m.emoji}</span>
                      </div>
                      <h4 className="font-bold text-white">{m.title}</h4>
                      <p className="text-sm text-gray-400 mt-1">{m.desc}</p>
                      {m.status === 'active' && (
                        <div className="mt-2 inline-flex items-center gap-1.5 bg-violet-900/50 text-violet-300 text-xs px-3 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" />
                          SESI INI — LIVE NOW
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── METRICS TAB ── */}
        {activeTab === 'metrics' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-black mb-2">📊 Growth Metrics Deep Dive</h2>
              <p className="text-gray-400">Angka-angka nyata, target transparan, methodology diexplain.</p>
            </div>

            {/* Growth Cards */}
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  metric: '+1099%', title: 'Total Revenue Growth',
                  current: 'Rp 0', target: 'Rp 11M/bulan',
                  timeline: '6 bulan', methodology: 'Rp 0 → trial users → paying users → scale. 6 bulan: 5 users → 30 users → 100 users → 300 users. Avg ARPU Rp 370K/bulan = Rp 11.1M.',
                  color: 'from-emerald-900/40 to-teal-900/40', border: 'border-emerald-600',
                },
                {
                  metric: '+500%', title: 'User Acquisition',
                  current: '0 users', target: '500 MAU',
                  timeline: 'Q2 2026', methodology: 'WhatsApp viral: 1 user → share ke 5 teman. 6 agent × 5 akuisisi/hari = 30/hari × 30 hari × 3 bulan = 2700. Konservatif 500 MAU.',
                  color: 'from-violet-900/40 to-purple-900/40', border: 'border-violet-600',
                },
                {
                  metric: '+1000%', title: 'AI Agent ROI',
                  current: 'Rp 0 return', target: '10x per agent',
                  timeline: 'Per subscriber', methodology: 'Cost per agent: ~$5/bulan infrastruktur. Revenue per agent: Rp 149K-1.5M. ROI minimum: 30x. Diklaim 1000% = 10x = konservatif.',
                  color: 'from-blue-900/40 to-cyan-900/40', border: 'border-blue-600',
                },
                {
                  metric: '+2000%', title: '$PREMALTA Appreciation',
                  current: '$0 liquidity', target: '$300K market cap',
                  timeline: '2027 target', methodology: 'Initial liquidity $300 USDC. Target 1000 holders × avg $300 bag = $300K mcap. 1000x dari initial = 2000% growth dalam 18 bulan.',
                  color: 'from-amber-900/40 to-orange-900/40', border: 'border-amber-600',
                },
              ].map(m => (
                <div key={m.metric} className={`bg-gradient-to-br ${m.color} border ${m.border} rounded-2xl p-5`}>
                  <div className="text-4xl font-black text-white mb-1">{m.metric}</div>
                  <h4 className="font-bold text-white mb-3">{m.title}</h4>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-black/20 rounded-lg p-2 text-xs">
                      <div className="text-gray-400">Current</div>
                      <div className="font-bold text-red-400">{m.current}</div>
                    </div>
                    <div className="bg-black/20 rounded-lg p-2 text-xs">
                      <div className="text-gray-400">Target</div>
                      <div className="font-bold text-emerald-400">{m.target}</div>
                    </div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-3 text-xs">
                    <div className="text-gray-400 mb-1">⏱️ Timeline: {m.timeline}</div>
                    <div className="text-gray-300 leading-relaxed">{m.methodology}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Risk Register */}
            <div className="bg-gray-900 border border-red-800/50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-red-300 mb-4">⚠️ Honest Risk Register</h3>
              <div className="space-y-3">
                {[
                  { risk: 'Duitku production approval delay', probability: 'Medium', impact: 'High', mitigation: 'Fallback manual transfer BCA sudah ada. Target approval 1-3 hari kerja.', color: 'text-orange-400' },
                  { risk: '$PREMALTA zero liquidity', probability: 'High (current)', impact: 'High', mitigation: 'Token exist di Base. Butuh $300 USDC untuk launch. Revenue dari SaaS akan fund ini.', color: 'text-red-400' },
                  { risk: 'Groq API rate limit', probability: 'Low', impact: 'Medium', mitigation: 'Free tier: 6000 req/menit. Cukup untuk 100+ users. Premium tersedia jika perlu.', color: 'text-yellow-400' },
                  { risk: 'Low user acquisition', probability: 'Medium', impact: 'High', mitigation: 'WhatsApp marketing ke 10 grup/hari. LinkedIn post. Referral program 20% komisi.', color: 'text-orange-400' },
                  { risk: 'Supabase cost scaling', probability: 'Low', impact: 'Low', mitigation: 'Free tier: 500MB DB, 2GB bandwidth. Cukup untuk 1000 users. Pro plan $25/bulan jika perlu.', color: 'text-blue-400' },
                ].map(r => (
                  <div key={r.risk} className="bg-gray-800/50 rounded-xl p-4">
                    <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                      <h5 className="font-semibold text-white text-sm">{r.risk}</h5>
                      <div className="flex gap-2 text-xs">
                        <span className={`${r.color} font-semibold`}>P: {r.probability}</span>
                        <span className="text-gray-400">|</span>
                        <span className={`${r.color} font-semibold`}>I: {r.impact}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">🛡️ {r.mitigation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── WHATSAPP TAB ── */}
        {activeTab === 'wa' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-black mb-2">💬 WhatsApp Bot Integration</h2>
              <p className="text-gray-400">Fonnte API — otomatisasi pesan WhatsApp untuk notifikasi, marketing, dan customer service.</p>
            </div>

            {/* Bot Info */}
            <div className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-500/40 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-2xl">💬</div>
                <div>
                  <h3 className="font-bold text-white">SOVEREIGN WA BOT</h3>
                  <p className="text-sm text-emerald-300">Powered by Fonnte API</p>
                </div>
                <div className="ml-auto flex items-center gap-2 text-sm text-emerald-300">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  Active
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-black/20 rounded-lg p-3">
                  <div className="text-gray-400 text-xs mb-1">Nomor Bot</div>
                  <div className="font-mono text-white">+62 856-4338-3832</div>
                </div>
                <div className="bg-black/20 rounded-lg p-3">
                  <div className="text-gray-400 text-xs mb-1">Provider</div>
                  <div className="font-semibold text-white">Fonnte.com</div>
                </div>
              </div>
            </div>

            {/* Test WA Form */}
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">🧪 Test WhatsApp Bot</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Nomor Tujuan (format: 628xxx)</label>
                  <input
                    type="text"
                    value={waMsg.phone}
                    onChange={e => setWaMsg(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="628xxxxxxxxxx"
                    className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Pesan</label>
                  <textarea
                    value={waMsg.message}
                    onChange={e => setWaMsg(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Ketik pesan test WhatsApp..."
                    rows={4}
                    className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>
                <button
                  onClick={handleWaSend}
                  disabled={waMsg.loading || !waMsg.message}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                >
                  {waMsg.loading ? (
                    <><span className="animate-spin">⏳</span> Mengirim...</>
                  ) : waMsg.sent ? (
                    <><span>✅</span> Terkirim!</>
                  ) : (
                    <><svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Kirim WhatsApp</>
                  )}
                </button>
              </div>
            </div>

            {/* WA Templates */}
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">📝 Template Pesan Marketing</h3>
              <div className="space-y-3">
                {[
                  {
                    label: 'Promo SICA — Katering', emoji: '🍽️',
                    text: `🍽️ *SOVEREIGN CATERING AI*\n\nHalo Kak! Lagi kelola bisnis katering?\n\nAI kami bisa:\n✅ Parse order WhatsApp otomatis\n✅ Generate invoice dalam detik\n✅ Manajemen menu pintar\n✅ Prediksi bahan baku\n\n💰 Mulai dari Rp 199.000/bulan\n🎯 7 hari gratis trial!\n\nhttps://gani-hypha-web3.pages.dev/sica-landing\n\n_Gyss! 🙏🏻_`,
                  },
                  {
                    label: 'Promo SHGA — Hamper Lebaran', emoji: '🎁',
                    text: `🎁 *SOVEREIGN HAMPER AI — Lebaran Special!*\n\nKurang ${countdown.days} hari lagi Lebaran! 🌙\n\nAI rekomendasi hamper kami:\n✅ Personalized gift suggestion\n✅ Budget optimizer\n✅ Bulk order management\n✅ Auto WhatsApp konfirmasi\n\n💰 Mulai dari Rp 149.000/bulan\n\nhttps://gani-hypha-web3.pages.dev/shga-landing\n\n_Akar Dalam, Cabang Tinggi! 🙏🏻_`,
                  },
                  {
                    label: 'Promo HOLYYBD — General', emoji: '🔥',
                    text: `🔥 *GANI HYPHA SOVEREIGN AGENTS*\n\nPlatform AI + Web3 untuk UMKM Indonesia!\n\n6 Agent AI siap membantu bisnis Anda:\n⚖️ SCA — Analisis kontrak\n🍽️ SICA — Katering AI\n🎁 SHGA — Hamper AI\n✂️ BDE — Barbershop AI\n🏛️ Legacy — Warisan digital\n🌐 SMA — All-in-one platform\n\n💰 Paket mulai Rp 99.000/bulan\n\nhttps://gani-hypha-web3.pages.dev/holyybd\n\n_Gyss! 🙏🏻_`,
                  },
                ].map(t => (
                  <div key={t.label} className="bg-gray-800/50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-white">{t.emoji} {t.label}</span>
                      <button
                        onClick={() => { setWaMsg(prev => ({ ...prev, message: t.text })); setActiveTab('wa'); }}
                        className="text-xs bg-violet-700 hover:bg-violet-600 text-white px-3 py-1 rounded-lg transition-all"
                      >
                        Gunakan
                      </button>
                    </div>
                    <pre className="text-xs text-gray-400 whitespace-pre-wrap font-sans line-clamp-3 overflow-hidden">{t.text.substring(0, 120)}...</pre>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── PRICING SECTION (always visible below tabs) ── */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black mb-2">💎 HOLY Plans — Pilih Kedaulatanmu</h2>
            <p className="text-gray-400">Semua paket sudah termasuk akses HOLY.PUBLIC dokumentasi + WhatsApp bot notification</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 mb-8">
            {HOLY_PLANS.map(plan => (
              <div
                key={plan.id}
                className={`relative bg-gradient-to-br ${plan.color} border ${plan.border} rounded-2xl p-6 flex flex-col
                  ${plan.highlight ? `shadow-2xl ${plan.glow} scale-[1.02]` : 'hover:scale-[1.01]'} transition-all cursor-pointer`}
                onClick={() => handlePlanSelect(plan.id)}
              >
                {plan.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r ${plan.highlight ? 'from-violet-600 to-purple-600' : plan.id === 'holy-sovereign' ? 'from-amber-600 to-orange-600' : 'from-emerald-600 to-teal-600'} text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap`}>
                    {plan.badge}
                  </div>
                )}

                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{plan.emoji}</div>
                  <div className="text-2xl font-black text-white">{plan.name}</div>
                  <div className="text-sm text-gray-300 mb-3">{plan.subtitle}</div>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-black text-white">{plan.price}</span>
                    <span className="text-gray-400 text-sm">{plan.period}</span>
                  </div>
                  <div className={`inline-block mt-2 text-sm font-black bg-black/30 px-3 py-1 rounded-full`}>
                    📈 {plan.growth}
                  </div>
                </div>

                <ul className="space-y-2 mb-5 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className={`text-sm ${f.startsWith('❌') ? 'text-gray-500' : 'text-gray-200'}`}>{f}</li>
                  ))}
                </ul>

                <button className={`w-full ${plan.btnColor} text-white py-3 rounded-xl font-bold text-sm transition-all`}>
                  {plan.cta}
                  {plan.free_trial && <span className="ml-2 text-xs bg-black/20 px-2 py-0.5 rounded-full">7 hari gratis</span>}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PAYMENT MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" ref={payRef}>
            <div className="sticky top-0 bg-gray-900 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-white">
                {HOLY_PLANS.find(p => p.id === selectedPlan)?.emoji}{' '}
                {HOLY_PLANS.find(p => p.id === selectedPlan)?.name}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white text-xl">✕</button>
            </div>

            <div className="p-6 space-y-4">
              {/* Plan Summary */}
              <div className="bg-gray-800/50 rounded-xl p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Paket</span>
                  <span className="font-bold text-white">{HOLY_PLANS.find(p => p.id === selectedPlan)?.name}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-400">Harga</span>
                  <span className="font-black text-amber-400">{HOLY_PLANS.find(p => p.id === selectedPlan)?.price}/bulan</span>
                </div>
              </div>

              {/* Form */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Nama Lengkap *</label>
                  <input
                    type="text"
                    value={form.customer_name}
                    onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))}
                    placeholder="Masukkan nama lengkap"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Email *</label>
                  <input
                    type="email"
                    value={form.customer_email}
                    onChange={e => setForm(f => ({ ...f, customer_email: e.target.value }))}
                    placeholder="email@contoh.com"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">No. WhatsApp * (format: 628xxx)</label>
                  <input
                    type="tel"
                    value={form.customer_phone}
                    onChange={e => setForm(f => ({ ...f, customer_phone: e.target.value }))}
                    placeholder="62812xxxxxxxx"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Konfirmasi order akan dikirim via WhatsApp</p>
                </div>
              </div>

              {/* Payment Result */}
              {paymentResult && (
                <div className={`rounded-xl p-4 border ${paymentResult.success ? 'bg-emerald-900/30 border-emerald-600' : 'bg-red-900/30 border-red-600'}`}>
                  {paymentResult.success ? (
                    <div>
                      <p className="text-emerald-300 font-bold text-sm mb-2">✅ Pembayaran dibuat!</p>
                      <p className="text-xs text-gray-400">Order ID: <span className="text-white font-mono">{paymentResult.order_id}</span></p>
                      <p className="text-xs text-gray-400">Amount: <span className="text-amber-400 font-bold">{paymentResult.amount_formatted}</span></p>
                      {paymentResult.payment_url && (
                        <a href={paymentResult.payment_url} target="_blank" rel="noopener noreferrer"
                          className="mt-3 block text-center bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg text-sm font-bold transition-all">
                          Bayar Sekarang →
                        </a>
                      )}
                      {paymentResult.fallback_payment && (
                        <div className="mt-3 bg-black/20 rounded-lg p-3 text-xs space-y-1">
                          <p className="font-bold text-white">Transfer Manual:</p>
                          <p className="text-gray-300">Bank: {paymentResult.fallback_payment.bank}</p>
                          <p className="text-gray-300">No. Rekening: <span className="font-mono">{paymentResult.fallback_payment.account_number}</span></p>
                          <p className="text-gray-300">A/N: {paymentResult.fallback_payment.account_name}</p>
                          <p className="text-amber-300 font-bold">Jumlah: {paymentResult.fallback_payment.amount_formatted}</p>
                          <p className="text-gray-300">Berita: {paymentResult.fallback_payment.transfer_note}</p>
                          <p className="text-emerald-300">Konfirmasi ke: {paymentResult.fallback_payment.confirm_to}</p>
                          <button onClick={() => copyToClipboard(paymentResult.fallback_payment!.account_number, 'rekening')}
                            className="mt-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg text-xs transition-all">
                            {copySuccess === 'rekening' ? '✅ Copied!' : '📋 Copy No. Rekening'}
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="text-red-300 font-bold text-sm">❌ Gagal: {paymentResult.error || paymentResult.message}</p>
                      <a href={`https://wa.me/6285643383832?text=${encodeURIComponent(`Halo! Saya mau daftar paket ${HOLY_PLANS.find(p => p.id === selectedPlan)?.name} tapi ada kendala pembayaran. Bisa bantu? 🙏🏻`)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="mt-2 block text-center bg-emerald-700 hover:bg-emerald-600 text-white py-2 rounded-lg text-sm font-semibold transition-all">
                        Hubungi Admin WA →
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Pay Button */}
              {!paymentResult?.success && (
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:opacity-50 text-white py-4 rounded-xl font-black text-base transition-all shadow-lg shadow-violet-500/25 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><span className="animate-spin text-xl">⏳</span> Memproses...</>
                  ) : (
                    <>💳 Bayar dengan Duitku POP V2</>
                  )}
                </button>
              )}

              {/* Payment methods */}
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2">Metode pembayaran tersedia</p>
                <div className="flex flex-wrap justify-center gap-2 text-xs">
                  {['QRIS', 'BCA VA', 'Mandiri VA', 'BNI VA', 'BRI VA', 'DANA', 'OVO', 'ShopeePay', 'Indomaret'].map(m => (
                    <span key={m} className="bg-gray-800 text-gray-400 px-2 py-1 rounded">{m}</span>
                  ))}
                </div>
              </div>

              {/* WhatsApp fallback */}
              <a
                href={`https://wa.me/6285643383832?text=${encodeURIComponent(`Halo! Saya mau daftar *${HOLY_PLANS.find(p => p.id === selectedPlan)?.name}* (${HOLY_PLANS.find(p => p.id === selectedPlan)?.price}/bulan). Bisa bantu? 🙏🏻`)}`}
                target="_blank" rel="noopener noreferrer"
                className="block text-center text-sm text-gray-400 hover:text-emerald-400 transition-colors"
              >
                💬 Atau chat WhatsApp admin
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <footer className="bg-gray-950 border-t border-gray-800 py-10 px-4 mt-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div>
              <h4 className="font-black text-white text-lg mb-3">GANI HYPHA</h4>
              <p className="text-sm text-gray-400 leading-relaxed">Sovereign Autonomous Economy Engine. Building Web2 → Web3 → Web5 bridge untuk UMKM Indonesia.</p>
              <p className="text-sm text-violet-300 mt-2 font-semibold italic">Akar Dalam, Cabang Tinggi. Gyss! 🙏🏻</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">Landing Pages</h4>
              <ul className="space-y-1.5 text-sm">
                {SOVEREIGN_AGENTS.map(a => (
                  <li key={a.id}><a href={a.url} className="text-gray-400 hover:text-violet-300 transition-colors">{a.emoji} {a.short} — {a.name.split(' ').slice(0, 2).join(' ')}</a></li>
                ))}
                <li><a href="/holyybd" className="text-violet-300 hover:text-violet-200 transition-colors font-semibold">📜 HOLYYBD — Dokumentasi Publik</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">Kontak & Social</h4>
              <div className="space-y-2 text-sm">
                <a href="https://wa.me/6285643383832" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition-colors">
                  <span>💬</span> WhatsApp: 085643383832
                </a>
                <a href="https://github.com/Estes786/Agnt-Mrket-place-Web-3-Web-4-5" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                  <span>📦</span> GitHub Repository
                </a>
                <a href="https://gani-hypha-web3.pages.dev" className="flex items-center gap-2 text-gray-400 hover:text-violet-300 transition-colors">
                  <span>🌐</span> gani-hypha-web3.pages.dev
                </a>
                <a href="https://basescan.org/address/0xC0125651a46BDEea72a73A1C1A75b82e0E2C94c7" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors">
                  <span>🔗</span> $PREMALTA on Base
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-500">
            <p>© 2026 GANI HYPHA. SESSION_032 — HOLYYBD v1.0</p>
            <p>Built with ❤️ + Hono v4 + React 19 + Cloudflare Workers</p>
            <p>🔒 Payments via Duitku POP v2 | 💬 WA via Fonnte</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HOLYYBDLanding;
