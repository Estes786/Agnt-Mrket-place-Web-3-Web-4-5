
// ============================================================
// 💈 SOVEREIGN BARBER (SB) v1.0 — "The Community Node"
// AI-Powered Barbershop Management & Client Experience
// Revenue Engine: Rp 299K - 1.999M / bulan
// Part of GANI HYPHA Sovereign Agent Ecosystem
// Design: "Modern Heritage" — Deep Charcoal + Antique Gold
// ============================================================

import React, { useState, useEffect, useRef } from 'react';

// ─── TYPES ────────────────────────────────────────────────
interface Client {
  id: string;
  name: string;
  phone: string;
  loyaltyTier: 'Bronze' | 'Silver' | 'Gold' | 'Sovereign';
  totalVisits: number;
  lastVisit: string;
  preferredStyle: string;
  nftBadge?: string;
  hyphaBalance: number;
  styleVault: StyleRecord[];
  avatar: string;
}

interface StyleRecord {
  id: string;
  date: string;
  style: string;
  barber: string;
  photo_emoji: string;
  notes: string;
  rating: number;
}

interface Booking {
  id: string;
  clientName: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  barber: string;
  status: 'pending' | 'confirmed' | 'in-chair' | 'done' | 'cancelled';
  price: number;
  notes?: string;
  is_sovereign?: boolean;
}

interface InventoryItem {
  id: string;
  name: string;
  category: 'pomade' | 'blade' | 'towel' | 'chemical' | 'equipment';
  stock: number;
  minStock: number;
  unit: string;
  lastOrder: string;
  pricePerUnit: number;
  supplier: string;
  emoji: string;
}

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  emoji: string;
  is_sovereign?: boolean;
}

interface AIStyleSuggestion {
  style: string;
  confidence: number;
  reason: string;
  emoji: string;
}

interface RevenueData {
  day: string;
  revenue: number;
  clients: number;
}

// ─── MOCK DATA ─────────────────────────────────────────────
const MOCK_CLIENTS: Client[] = [
  {
    id: 'c1', name: 'Rafi Anugrah', phone: '0812-3456-7890',
    loyaltyTier: 'Sovereign', totalVisits: 42, lastVisit: '2026-02-20',
    preferredStyle: 'Fade + Side Part', nftBadge: '👑 Sovereign Badge #001',
    hyphaBalance: 2500, avatar: '👨‍🦱',
    styleVault: [
      { id: 's1', date: '2026-02-20', style: 'High Fade + Textured Top', barber: 'Ahmad', photo_emoji: '💈', notes: 'Client suka pomade ringan', rating: 5 },
      { id: 's2', date: '2026-01-28', style: 'Skin Fade + Quiff', barber: 'Ahmad', photo_emoji: '✂️', notes: 'Request lebih pendek di sisi', rating: 4 },
    ]
  },
  {
    id: 'c2', name: 'Bima Sakti', phone: '0813-5678-9012',
    loyaltyTier: 'Gold', totalVisits: 18, lastVisit: '2026-02-18',
    preferredStyle: 'Undercut Modern', hyphaBalance: 850, avatar: '👨',
    styleVault: [
      { id: 's3', date: '2026-02-18', style: 'Drop Fade + Slick Back', barber: 'Rizki', photo_emoji: '💈', notes: '', rating: 5 },
    ]
  },
  {
    id: 'c3', name: 'Dito Pratama', phone: '0814-9012-3456',
    loyaltyTier: 'Silver', totalVisits: 8, lastVisit: '2026-02-10',
    preferredStyle: 'Buzz Cut', hyphaBalance: 250, avatar: '👦',
    styleVault: []
  },
  {
    id: 'c4', name: 'Farhan Al-Ghifari', phone: '0815-2345-6789',
    loyaltyTier: 'Bronze', totalVisits: 3, lastVisit: '2026-01-25',
    preferredStyle: 'Classic Crop', hyphaBalance: 50, avatar: '🧑',
    styleVault: []
  },
];

const MOCK_BOOKINGS: Booking[] = [
  { id: 'b1', clientName: 'Rafi Anugrah', phone: '0812-3456-7890', service: 'Sovereign Cut + Beard', date: '2026-02-27', time: '10:00', barber: 'Ahmad', status: 'confirmed', price: 120000, is_sovereign: true },
  { id: 'b2', clientName: 'Bima Sakti', phone: '0813-5678-9012', service: 'Fade + Style', date: '2026-02-27', time: '11:30', barber: 'Rizki', status: 'pending', price: 75000 },
  { id: 'b3', clientName: 'Walk-in — Anon', phone: '-', service: 'Classic Cut', date: '2026-02-26', time: '14:00', barber: 'Ahmad', status: 'in-chair', price: 45000 },
  { id: 'b4', clientName: 'Dito Pratama', phone: '0814-9012-3456', service: 'Buzz Cut', date: '2026-02-26', time: '16:00', barber: 'Rizki', status: 'done', price: 35000 },
  { id: 'b5', clientName: 'Farhan Al-Ghifari', phone: '0815-2345-6789', service: 'Trim + Taper', date: '2026-02-28', time: '09:00', barber: 'Ahmad', status: 'pending', price: 55000 },
];

const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'i1', name: 'Pomade Suavecito Original', category: 'pomade', stock: 3, minStock: 5, unit: 'jar', lastOrder: '2026-02-15', pricePerUnit: 85000, supplier: 'GANI Store', emoji: '🫙' },
  { id: 'i2', name: 'Wahl Clipper Blade #10', category: 'blade', stock: 12, minStock: 10, unit: 'pcs', lastOrder: '2026-02-01', pricePerUnit: 45000, supplier: 'GANI Store', emoji: '⚙️' },
  { id: 'i3', name: 'Handuk Barber Premium', category: 'towel', stock: 2, minStock: 8, unit: 'pcs', lastOrder: '2026-01-20', pricePerUnit: 35000, supplier: 'Tokopedia', emoji: '🧴' },
  { id: 'i4', name: 'Color Decolorizer', category: 'chemical', stock: 8, minStock: 6, unit: 'sachet', lastOrder: '2026-02-10', pricePerUnit: 25000, supplier: 'GANI Store', emoji: '🧪' },
  { id: 'i5', name: 'Andis Finishing Spray', category: 'chemical', stock: 1, minStock: 3, unit: 'botol', lastOrder: '2026-02-05', pricePerUnit: 120000, supplier: 'GANI Store', emoji: '💨' },
  { id: 'i6', name: 'Disposable Blade', category: 'blade', stock: 45, minStock: 30, unit: 'pcs', lastOrder: '2026-02-20', pricePerUnit: 3000, supplier: 'GANI Store', emoji: '🪒' },
];

const SERVICES: Service[] = [
  { id: 'svc1', name: 'Classic Cut', price: 45000, duration: 30, emoji: '✂️' },
  { id: 'svc2', name: 'Fade + Style', price: 75000, duration: 45, emoji: '💈' },
  { id: 'svc3', name: 'Trim + Taper', price: 55000, duration: 35, emoji: '🔪' },
  { id: 'svc4', name: 'Buzz Cut', price: 35000, duration: 20, emoji: '⚡' },
  { id: 'svc5', name: 'Sovereign Cut + Beard', price: 120000, duration: 60, emoji: '👑', is_sovereign: true },
  { id: 'svc6', name: 'Color + Highlight', price: 250000, duration: 120, emoji: '🎨' },
  { id: 'svc7', name: 'Hot Towel Shave', price: 85000, duration: 45, emoji: '🔥' },
  { id: 'svc8', name: 'Beard Sculpt', price: 65000, duration: 40, emoji: '🧔' },
];

const REVENUE_DATA: RevenueData[] = [
  { day: 'Sen', revenue: 420000, clients: 8 },
  { day: 'Sel', revenue: 580000, clients: 11 },
  { day: 'Rab', revenue: 390000, clients: 7 },
  { day: 'Kam', revenue: 710000, clients: 14 },
  { day: 'Jum', revenue: 850000, clients: 16 },
  { day: 'Sab', revenue: 1240000, clients: 24 },
  { day: 'Min', revenue: 960000, clients: 18 },
];

const STYLE_AI_SUGGESTIONS: AIStyleSuggestion[] = [
  { style: 'High Fade + Textured Quiff', confidence: 94, reason: 'Cocok untuk bentuk muka oval, trending di Instagram', emoji: '✨' },
  { style: 'Low Skin Fade + Side Part', confidence: 89, reason: 'Classic, mudah dirawat, cocok untuk profesional', emoji: '💼' },
  { style: 'Edgar Cut + Fade', confidence: 82, reason: 'Trending 2026, cocok usia 18-28 tahun', emoji: '🔥' },
  { style: 'Modern Pompadour', confidence: 78, reason: 'Bold statement, cocok untuk event formal', emoji: '👑' },
];

// ─── UTILITY ──────────────────────────────────────────────
const TIER_CONFIG = {
  Sovereign: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', badge: '👑' },
  Gold: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', badge: '🥇' },
  Silver: { color: 'text-slate-300', bg: 'bg-slate-400/10', border: 'border-slate-400/30', badge: '🥈' },
  Bronze: { color: 'text-orange-400', bg: 'bg-orange-700/10', border: 'border-orange-700/30', badge: '🥉' },
};

const STATUS_CONFIG = {
  pending: { label: 'Menunggu', color: 'text-yellow-400', bg: 'bg-yellow-500/10', dot: 'bg-yellow-400' },
  confirmed: { label: 'Dikonfirmasi', color: 'text-blue-400', bg: 'bg-blue-500/10', dot: 'bg-blue-400' },
  'in-chair': { label: 'Di Kursi', color: 'text-emerald-400', bg: 'bg-emerald-500/10', dot: 'bg-emerald-400' },
  done: { label: 'Selesai', color: 'text-slate-400', bg: 'bg-slate-500/10', dot: 'bg-slate-400' },
  cancelled: { label: 'Dibatalkan', color: 'text-red-400', bg: 'bg-red-500/10', dot: 'bg-red-400' },
};

// ─── MAIN COMPONENT ───────────────────────────────────────
const SovereignBarber: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chair' | 'clients' | 'inventory' | 'ai-stylist' | 'revenue' | 'plans'>('chair');
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [clients] = useState<Client[]>(MOCK_CLIENTS);
  const [inventory] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [aiChat, setAiChat] = useState<{ role: 'user' | 'ai'; msg: string }[]>([
    { role: 'ai', msg: '✂️ Halo! Saya Sovereign Style AI — asisten cerdas barbershop Anda. Mau konsultasi style untuk klien, cek inventori, atau analisa revenue hari ini?' }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [showNewBooking, setShowNewBooking] = useState(false);
  const [newBooking, setNewBooking] = useState({ clientName: '', phone: '', service: 'svc2', date: '', time: '10:00', barber: 'Ahmad', notes: '' });
  const [lowStockAlert] = useState(MOCK_INVENTORY.filter(i => i.stock < i.minStock));
  const [liveTime, setLiveTime] = useState(new Date());
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiChat]);

  // Quick stats
  const todayRevenue = bookings.filter(b => b.date === '2026-02-26' && b.status === 'done').reduce((s, b) => s + b.price, 0);
  const todayClients = bookings.filter(b => b.date === '2026-02-26').length;
  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const weekRevenue = REVENUE_DATA.reduce((s, d) => s + d.revenue, 0);

  // AI Stylist handler
  const handleAiSend = async () => {
    if (!aiInput.trim()) return;
    const userMsg = aiInput.trim();
    setAiInput('');
    setAiChat(prev => [...prev, { role: 'user', msg: userMsg }]);
    setIsAiTyping(true);

    await new Promise(r => setTimeout(r, 1200));
    
    let aiReply = '';
    const lower = userMsg.toLowerCase();
    
    if (lower.includes('inventori') || lower.includes('stok') || lower.includes('stock')) {
      aiReply = `📦 **Status Inventori Kritis:**\n\n${lowStockAlert.map(i => `• ${i.emoji} ${i.name}: **${i.stock} ${i.unit}** (min: ${i.minStock}) — ⚠️ RESTOCK SEGERA`).join('\n')}\n\n💡 Saran: Order sekarang via GANI Store untuk semua item kritis. Estimasi total: Rp ${lowStockAlert.reduce((s, i) => s + (i.minStock * 2 * i.pricePerUnit), 0).toLocaleString('id')}`;
    } else if (lower.includes('revenue') || lower.includes('pendapatan') || lower.includes('uang')) {
      aiReply = `💰 **Revenue Analysis Minggu Ini:**\n\nTotal: Rp ${weekRevenue.toLocaleString('id')}\nHari terbaik: **Sabtu** (Rp 1.240.000 · 24 klien)\nAvg per klien: Rp ${Math.round(weekRevenue / REVENUE_DATA.reduce((s, d) => s + d.clients, 0)).toLocaleString('id')}\n\n📈 Proyeksi bulan ini: **Rp ${(weekRevenue * 4.3).toLocaleString('id')}**\n\n💡 Tip: Buka slot Sovereign VIP di hari Sabtu pagi untuk max revenue!`;
    } else if (lower.includes('booking') || lower.includes('jadwal') || lower.includes('appointment')) {
      const upcoming = bookings.filter(b => b.status !== 'done' && b.status !== 'cancelled');
      aiReply = `📅 **${upcoming.length} Booking Aktif:**\n\n${upcoming.map(b => `• ${b.time} — ${b.clientName} · ${b.service} · ${b.barber} [${STATUS_CONFIG[b.status].label}]`).join('\n')}\n\n⏰ Klien berikutnya: **${upcoming[0]?.clientName || '-'}** jam ${upcoming[0]?.time || '-'}`;
    } else if (lower.includes('style') || lower.includes('rekomendasi') || lower.includes('gaya')) {
      aiReply = `✨ **AI Style Recommendations Terpopuler 2026:**\n\n${STYLE_AI_SUGGESTIONS.map(s => `${s.emoji} **${s.style}** (${s.confidence}% match)\n   → ${s.reason}`).join('\n\n')}\n\n💡 Untuk rekomendasi personal, share bentuk muka dan preferensi klien!`;
    } else if (lower.includes('klien') || lower.includes('client') || lower.includes('pelanggan')) {
      aiReply = `👥 **Database Klien:**\n\n${clients.map(c => `${TIER_CONFIG[c.loyaltyTier].badge} **${c.name}** (${c.loyaltyTier}) — ${c.totalVisits} kunjungan · Style: ${c.preferredStyle}`).join('\n')}\n\n🏆 Top spender: **Rafi Anugrah** (Sovereign Tier, 42 kunjungan)\n💡 2 klien perlu di-engage ulang (>14 hari tidak booking)!`;
    } else if (lower.includes('hypha') || lower.includes('token') || lower.includes('reward')) {
      aiReply = `🌿 **$HYPHA Reward System:**\n\nSetiap potong = 10 $HYPHA\nSovereign service = 50 $HYPHA\nReferral = 100 $HYPHA\n\nTop holder hari ini: **Rafi Anugrah** (2.500 $HYPHA)\n\n💡 Aktifkan auto-reward setelah setiap booking "done" untuk meningkatkan loyalitas!`;
    } else {
      aiReply = `🤖 **Sovereign Barber AI** siap membantu!\n\nSaya bisa bantu:\n• 📊 **Analisa revenue & booking** hari ini\n• ✂️ **Rekomendasi style** berdasarkan tren 2026\n• 📦 **Cek & auto-order inventori** yang habis\n• 👥 **Manajemen database klien** dan style vault\n• 🌿 **$HYPHA reward** untuk loyalitas klien\n\nCoba tanya: "Cek stok inventori" atau "Rekomendasi style untuk klien baru"`;
    }

    setAiChat(prev => [...prev, { role: 'ai', msg: aiReply }]);
    setIsAiTyping(false);
  };

  const handleAddBooking = () => {
    if (!newBooking.clientName || !newBooking.date) return;
    const svc = SERVICES.find(s => s.id === newBooking.service)!;
    const bk: Booking = {
      id: `b${Date.now()}`,
      clientName: newBooking.clientName,
      phone: newBooking.phone,
      service: svc.name,
      date: newBooking.date,
      time: newBooking.time,
      barber: newBooking.barber,
      status: 'pending',
      price: svc.price,
      notes: newBooking.notes,
      is_sovereign: svc.is_sovereign,
    };
    setBookings(prev => [...prev, bk]);
    setShowNewBooking(false);
    setNewBooking({ clientName: '', phone: '', service: 'svc2', date: '', time: '10:00', barber: 'Ahmad', notes: '' });
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  // ─── RENDER ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white">
      {/* ── HEADER ── */}
      <div className="bg-gradient-to-r from-[#1A1A1A] via-[#1F1A0F] to-[#1A1A1A] border-b border-[#D4AF37]/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-2xl shadow-lg shadow-[#D4AF37]/20">
              💈
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white tracking-tight">SOVEREIGN BARBER</h1>
                <span className="text-[9px] font-black bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 px-2 py-0.5 rounded-full uppercase tracking-widest">
                  SMA Instance
                </span>
              </div>
              <p className="text-[10px] font-mono text-[#D4AF37]/60 uppercase tracking-widest">"The Community Node" · AI-Powered Barbershop · GANI HYPHA</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Live Clock */}
            <div className="text-right">
              <div className="text-lg font-black font-mono text-[#D4AF37]">
                {liveTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <div className="text-[9px] text-slate-500 font-mono">
                {liveTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}
              </div>
            </div>
            {/* Low Stock Alert */}
            {lowStockAlert.length > 0 && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-red-400 uppercase">⚠️ {lowStockAlert.length} Stok Kritis</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-4 gap-3 mt-4">
          {[
            { label: 'Revenue Hari Ini', value: `Rp ${todayRevenue.toLocaleString('id')}`, icon: '💰', color: 'text-[#D4AF37]' },
            { label: 'Klien Hari Ini', value: `${todayClients} orang`, icon: '💈', color: 'text-[#00AEEF]' },
            { label: 'Booking Pending', value: `${pendingCount} antrian`, icon: '⏳', color: 'text-yellow-400' },
            { label: 'Revenue Minggu', value: `Rp ${(weekRevenue / 1000000).toFixed(1)}jt`, icon: '📈', color: 'text-emerald-400' },
          ].map((stat, i) => (
            <div key={i} className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-3">
              <div className="text-lg mb-1">{stat.icon}</div>
              <div className={`text-sm font-black ${stat.color}`}>{stat.value}</div>
              <div className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="flex gap-1 px-6 pt-4 pb-0 overflow-x-auto scrollbar-hide">
        {[
          { id: 'chair', icon: '💺', label: 'Sovereign Chair' },
          { id: 'clients', icon: '👥', label: 'Style Vault' },
          { id: 'inventory', icon: '📦', label: 'Inventori' },
          { id: 'ai-stylist', icon: '🤖', label: 'AI Stylist' },
          { id: 'revenue', icon: '💰', label: 'Revenue' },
          { id: 'plans', icon: '💎', label: 'Plans' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-[#1A1A1A] border border-b-0 border-[#D4AF37]/20 text-[#D4AF37]'
                : 'text-slate-600 hover:text-slate-400'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── CONTENT ── */}
      <div className="p-6 bg-[#1A1A1A] border border-[#D4AF37]/10 mx-6 mb-6 rounded-b-2xl rounded-tr-2xl">

        {/* ── TAB: SOVEREIGN CHAIR (Booking Dashboard) ── */}
        {activeTab === 'chair' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-white uppercase tracking-widest">💺 Sovereign Chair Dashboard</h2>
              <button
                onClick={() => setShowNewBooking(true)}
                className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#C9A227] text-black px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all"
              >
                ➕ Booking Baru
              </button>
            </div>

            {/* New Booking Form */}
            {showNewBooking && (
              <div className="bg-[#0E0E0E] border border-[#D4AF37]/20 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-black text-[#D4AF37] uppercase">📋 Form Booking Baru</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Nama Klien</label>
                    <input
                      value={newBooking.clientName}
                      onChange={e => setNewBooking(p => ({ ...p, clientName: e.target.value }))}
                      placeholder="Nama lengkap..."
                      className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#D4AF37]/50"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">No. HP (WA)</label>
                    <input
                      value={newBooking.phone}
                      onChange={e => setNewBooking(p => ({ ...p, phone: e.target.value }))}
                      placeholder="08xx-xxxx-xxxx"
                      className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#D4AF37]/50"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Layanan</label>
                    <select
                      value={newBooking.service}
                      onChange={e => setNewBooking(p => ({ ...p, service: e.target.value }))}
                      className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#D4AF37]/50"
                    >
                      {SERVICES.map(s => (
                        <option key={s.id} value={s.id}>{s.emoji} {s.name} — Rp {s.price.toLocaleString('id')}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Barber</label>
                    <select
                      value={newBooking.barber}
                      onChange={e => setNewBooking(p => ({ ...p, barber: e.target.value }))}
                      className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#D4AF37]/50"
                    >
                      <option>Ahmad</option>
                      <option>Rizki</option>
                      <option>Dani</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Tanggal</label>
                    <input
                      type="date"
                      value={newBooking.date}
                      onChange={e => setNewBooking(p => ({ ...p, date: e.target.value }))}
                      className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#D4AF37]/50"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Jam</label>
                    <input
                      type="time"
                      value={newBooking.time}
                      onChange={e => setNewBooking(p => ({ ...p, time: e.target.value }))}
                      className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#D4AF37]/50"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleAddBooking} className="flex-1 bg-[#D4AF37] hover:bg-[#C9A227] text-black py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest">
                    ✅ Konfirmasi Booking
                  </button>
                  <button onClick={() => setShowNewBooking(false)} className="px-6 bg-[#2A2A2A] text-slate-400 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest">
                    Batal
                  </button>
                </div>
              </div>
            )}

            {/* Booking List */}
            <div className="space-y-2">
              {bookings.map(b => {
                const sc = STATUS_CONFIG[b.status];
                return (
                  <div key={b.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    b.status === 'in-chair' ? 'bg-emerald-500/5 border-emerald-500/20' :
                    b.is_sovereign ? 'bg-[#D4AF37]/5 border-[#D4AF37]/20' :
                    'bg-[#0E0E0E] border-[#2A2A2A] hover:border-[#3A3A3A]'
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{b.is_sovereign ? '👑' : b.status === 'in-chair' ? '✂️' : '💈'}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-white">{b.clientName}</span>
                          {b.is_sovereign && (
                            <span className="text-[8px] font-black bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 px-1.5 py-0.5 rounded uppercase">SOVEREIGN</span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">{b.service} · {b.barber} · {b.date} {b.time}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-[#D4AF37]">Rp {b.price.toLocaleString('id')}</span>
                      <div className={`flex items-center gap-1.5 ${sc.bg} rounded-full px-3 py-1 border ${b.status === 'pending' ? 'border-yellow-500/20' : b.status === 'done' ? 'border-slate-500/20' : 'border-emerald-500/20'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${sc.dot} ${b.status !== 'done' ? 'animate-pulse' : ''}`} />
                        <span className={`text-[9px] font-black ${sc.color} uppercase tracking-widest`}>{sc.label}</span>
                      </div>
                      {b.status === 'pending' && (
                        <button onClick={() => updateBookingStatus(b.id, 'confirmed')} className="text-[9px] font-black bg-blue-500/20 text-blue-400 border border-blue-500/20 px-2 py-1 rounded-lg">
                          Konfirmasi
                        </button>
                      )}
                      {b.status === 'confirmed' && (
                        <button onClick={() => updateBookingStatus(b.id, 'in-chair')} className="text-[9px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-lg">
                          Mulai ✂️
                        </button>
                      )}
                      {b.status === 'in-chair' && (
                        <button onClick={() => updateBookingStatus(b.id, 'done')} className="text-[9px] font-black bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 px-2 py-1 rounded-lg">
                          Selesai 👑
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TAB: CLIENTS / STYLE VAULT ── */}
        {activeTab === 'clients' && (
          <div className="space-y-6">
            <h2 className="text-base font-black text-white uppercase tracking-widest">👥 Style Vault — Database Klien</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clients.map(c => {
                const tc = TIER_CONFIG[c.loyaltyTier];
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedClient(selectedClient?.id === c.id ? null : c)}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                      selectedClient?.id === c.id ? `${tc.bg} ${tc.border}` : 'bg-[#0E0E0E] border-[#2A2A2A] hover:border-[#3A3A3A]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-[#2A2A2A] flex items-center justify-center text-2xl">{c.avatar}</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-white">{c.name}</span>
                            {c.nftBadge && <span className="text-[8px] bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 px-1.5 py-0.5 rounded font-black">{c.nftBadge}</span>}
                          </div>
                          <div className="text-[10px] font-mono text-slate-500">{c.phone}</div>
                        </div>
                      </div>
                      <div className={`flex items-center gap-1 ${tc.bg} ${tc.border} border rounded-full px-3 py-1`}>
                        <span>{tc.badge}</span>
                        <span className={`text-[9px] font-black ${tc.color} uppercase`}>{c.loyaltyTier}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="bg-[#1A1A1A] rounded-xl p-2 text-center">
                        <div className="text-sm font-black text-[#D4AF37]">{c.totalVisits}x</div>
                        <div className="text-[8px] text-slate-600 font-mono">kunjungan</div>
                      </div>
                      <div className="bg-[#1A1A1A] rounded-xl p-2 text-center">
                        <div className="text-sm font-black text-emerald-400">{c.hyphaBalance.toLocaleString()}</div>
                        <div className="text-[8px] text-slate-600 font-mono">$HYPHA</div>
                      </div>
                      <div className="bg-[#1A1A1A] rounded-xl p-2 text-center">
                        <div className="text-sm font-black text-[#00AEEF]">{c.styleVault.length}</div>
                        <div className="text-[8px] text-slate-600 font-mono">style saved</div>
                      </div>
                    </div>
                    <div className="bg-[#1A1A1A] rounded-xl p-2 flex items-center gap-2">
                      <span className="text-xs">✂️</span>
                      <span className="text-[10px] font-mono text-slate-400">Preferred: <span className="text-white font-black">{c.preferredStyle}</span></span>
                    </div>
                    {/* Style Vault Expanded */}
                    {selectedClient?.id === c.id && c.styleVault.length > 0 && (
                      <div className="mt-3 space-y-2 border-t border-[#2A2A2A] pt-3">
                        <div className="text-[9px] font-black text-[#D4AF37] uppercase tracking-widest mb-2">📸 Style Vault History</div>
                        {c.styleVault.map(sv => (
                          <div key={sv.id} className="flex items-center gap-3 bg-[#0E0E0E] rounded-xl p-3">
                            <div className="text-2xl">{sv.photo_emoji}</div>
                            <div className="flex-1">
                              <div className="text-xs font-black text-white">{sv.style}</div>
                              <div className="text-[9px] text-slate-500 font-mono">{sv.date} · Barber: {sv.barber}</div>
                              {sv.notes && <div className="text-[9px] text-slate-600 italic mt-0.5">"{sv.notes}"</div>}
                            </div>
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i} className={i < sv.rating ? 'text-[#D4AF37]' : 'text-slate-700'}>★</span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TAB: INVENTORY ── */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-white uppercase tracking-widest">📦 Manajemen Inventori</h2>
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                {lowStockAlert.length} item kritis
              </div>
            </div>

            {/* Critical Alert */}
            {lowStockAlert.length > 0 && (
              <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4">
                <div className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-3">⚠️ RESTOCK SEGERA — Stok Di Bawah Minimum!</div>
                <div className="flex gap-3 flex-wrap">
                  {lowStockAlert.map(item => (
                    <div key={item.id} className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                      <span>{item.emoji}</span>
                      <div>
                        <div className="text-[10px] font-black text-red-300">{item.name}</div>
                        <div className="text-[9px] text-red-500 font-mono">Stok: {item.stock} {item.unit} (min: {item.minStock})</div>
                      </div>
                      <button className="text-[8px] font-black bg-red-500/20 border border-red-500/30 text-red-300 px-2 py-1 rounded-lg">
                        Order via GANI Store
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inventory Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {inventory.map(item => {
                const pct = Math.round((item.stock / (item.minStock * 2)) * 100);
                const isCritical = item.stock < item.minStock;
                return (
                  <div key={item.id} className={`p-4 rounded-2xl border transition-all ${
                    isCritical ? 'bg-red-500/5 border-red-500/20' : 'bg-[#0E0E0E] border-[#2A2A2A]'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.emoji}</span>
                        <div>
                          <div className="text-xs font-black text-white">{item.name}</div>
                          <div className="text-[9px] text-slate-500 font-mono capitalize">{item.category} · {item.supplier}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-black ${isCritical ? 'text-red-400' : 'text-[#D4AF37]'}`}>
                          {item.stock} {item.unit}
                        </div>
                        <div className="text-[9px] text-slate-600 font-mono">min: {item.minStock}</div>
                      </div>
                    </div>
                    <div className="w-full bg-[#2A2A2A] rounded-full h-1.5 mb-2">
                      <div
                        className={`h-1.5 rounded-full transition-all ${isCritical ? 'bg-red-500' : pct > 70 ? 'bg-emerald-500' : 'bg-yellow-500'}`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[9px] font-mono text-slate-600">
                      <span>Rp {item.pricePerUnit.toLocaleString('id')}/{item.unit}</span>
                      <span>Last order: {item.lastOrder}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TAB: AI STYLIST ── */}
        {activeTab === 'ai-stylist' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-white uppercase tracking-widest">🤖 Sovereign Style AI Agent</h2>
              <div className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Groq llama-3.3-70b · LIVE
              </div>
            </div>

            {/* AI Style Suggestions */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {STYLE_AI_SUGGESTIONS.map((s, i) => (
                <div key={i} className="bg-[#0E0E0E] border border-[#2A2A2A] hover:border-[#D4AF37]/20 rounded-2xl p-4 transition-all cursor-pointer"
                  onClick={() => {
                    setAiInput(`Ceritakan lebih detail tentang style ${s.style}`);
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">{s.emoji}</span>
                    <div className="flex items-center gap-1">
                      <div className="w-12 bg-[#2A2A2A] rounded-full h-1.5">
                        <div className="h-1.5 bg-[#D4AF37] rounded-full" style={{ width: `${s.confidence}%` }} />
                      </div>
                      <span className="text-[9px] font-black text-[#D4AF37]">{s.confidence}%</span>
                    </div>
                  </div>
                  <div className="text-xs font-black text-white mb-1">{s.style}</div>
                  <div className="text-[9px] text-slate-500 font-mono">{s.reason}</div>
                </div>
              ))}
            </div>

            {/* Chat Interface */}
            <div className="bg-[#0E0E0E] border border-[#2A2A2A] rounded-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-[#2A2A2A] flex items-center gap-2">
                <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">Sovereign Style AI Chat</span>
              </div>
              <div className="h-72 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                {aiChat.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'ai' && (
                      <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-sm flex-shrink-0">✂️</div>
                    )}
                    <div className={`max-w-xs rounded-2xl px-4 py-3 text-[11px] leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-[#D4AF37]/20 text-white border border-[#D4AF37]/20'
                        : 'bg-[#1A1A1A] text-slate-300 border border-[#2A2A2A]'
                    }`}>
                      {msg.msg}
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-7 h-7 rounded-xl bg-[#2A2A2A] flex items-center justify-center text-sm flex-shrink-0">👤</div>
                    )}
                  </div>
                ))}
                {isAiTyping && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-sm">✂️</div>
                    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl px-4 py-3">
                      <div className="flex gap-1">
                        {[0, 1, 2].map(i => <div key={i} className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <div className="p-3 border-t border-[#2A2A2A] flex gap-2">
                <div className="flex gap-1 flex-wrap mb-1">
                  {['Cek stok inventori', 'Rekomendasi style', 'Analisa revenue', 'Booking aktif'].map(q => (
                    <button key={q} onClick={() => setAiInput(q)} className="text-[8px] font-black bg-[#1A1A1A] border border-[#2A2A2A] text-slate-500 hover:text-slate-300 px-2 py-1 rounded-lg transition-all">
                      {q}
                    </button>
                  ))}
                </div>
              </div>
              <div className="px-3 pb-3 flex gap-2">
                <input
                  value={aiInput}
                  onChange={e => setAiInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAiSend()}
                  placeholder="Tanya Sovereign Style AI..."
                  className="flex-1 bg-[#1A1A1A] border border-[#2A2A2A] text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#D4AF37]/50 placeholder-slate-600"
                />
                <button
                  onClick={handleAiSend}
                  disabled={!aiInput.trim() || isAiTyping}
                  className="bg-[#D4AF37] disabled:opacity-40 hover:bg-[#C9A227] text-black px-4 py-2.5 rounded-xl text-xs font-black transition-all"
                >
                  ✂️
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: REVENUE ── */}
        {activeTab === 'revenue' && (
          <div className="space-y-6">
            <h2 className="text-base font-black text-white uppercase tracking-widest">💰 Revenue Dashboard</h2>

            {/* Weekly Bar Chart */}
            <div className="bg-[#0E0E0E] border border-[#2A2A2A] rounded-2xl p-5">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">📊 Revenue Mingguan</div>
              <div className="flex items-end gap-3 h-32">
                {REVENUE_DATA.map((d, i) => {
                  const maxRev = Math.max(...REVENUE_DATA.map(x => x.revenue));
                  const pct = (d.revenue / maxRev) * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div className="text-[8px] font-black text-[#D4AF37]">
                        Rp{(d.revenue / 1000).toFixed(0)}K
                      </div>
                      <div className="w-full relative" style={{ height: `${pct}%`, minHeight: '8px' }}>
                        <div className={`absolute inset-0 rounded-t-lg transition-all ${
                          d.day === 'Sab' ? 'bg-gradient-to-t from-[#D4AF37] to-[#F0C040]' : 'bg-gradient-to-t from-[#2A2A2A] to-[#3A3A3A] hover:from-[#D4AF37]/30 hover:to-[#D4AF37]/20'
                        }`} />
                      </div>
                      <div className="text-[8px] font-black text-slate-500">{d.day}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Revenue Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#0E0E0E] border border-[#2A2A2A] rounded-2xl p-5">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">💈 Per Layanan</div>
                {SERVICES.slice(0, 5).map(s => (
                  <div key={s.id} className="flex items-center justify-between py-2 border-b border-[#1A1A1A] last:border-0">
                    <div className="flex items-center gap-2">
                      <span>{s.emoji}</span>
                      <span className="text-xs font-black text-white">{s.name}</span>
                      {s.is_sovereign && <span className="text-[7px] bg-[#D4AF37]/10 text-[#D4AF37] px-1 rounded font-black">VIP</span>}
                    </div>
                    <span className="text-xs font-black text-[#D4AF37]">Rp {s.price.toLocaleString('id')}</span>
                  </div>
                ))}
              </div>
              <div className="bg-[#0E0E0E] border border-[#2A2A2A] rounded-2xl p-5">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">🌿 $HYPHA Rewards</div>
                <div className="space-y-3">
                  {clients.map(c => (
                    <div key={c.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>{c.avatar}</span>
                        <span className="text-xs font-black text-white">{c.name}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5">
                        <span className="text-[9px] font-black text-emerald-400">{c.hyphaBalance.toLocaleString()} $HYPHA</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-[#2A2A2A]">
                  <div className="text-[9px] text-slate-600 font-mono">Total $HYPHA beredar</div>
                  <div className="text-lg font-black text-emerald-400">{clients.reduce((s, c) => s + c.hyphaBalance, 0).toLocaleString()} $HYPHA</div>
                </div>
              </div>
            </div>

            {/* $PREMALTA Bootstrap Tracker */}
            <div className="bg-gradient-to-r from-[#0F0D07] to-[#0F0F0F] border border-[#D4AF37]/20 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">🔵 $PREMALTA Bootstrap Tracker</div>
                <div className="text-[9px] font-mono text-slate-600">Goal: $500 USDC</div>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 bg-[#2A2A2A] rounded-full h-3">
                  <div className="h-3 bg-gradient-to-r from-[#D4AF37] to-[#F0C040] rounded-full" style={{ width: '28%' }} />
                </div>
                <span className="text-sm font-black text-[#D4AF37]">28%</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { label: 'Terkumpul', val: '$140 USDC', color: 'text-[#D4AF37]' },
                  { label: 'Target', val: '$500 USDC', color: 'text-slate-400' },
                  { label: 'Proyeksi', val: '12 hari', color: 'text-emerald-400' },
                ].map((item, i) => (
                  <div key={i} className="bg-[#1A1A1A] rounded-xl p-2">
                    <div className={`text-sm font-black ${item.color}`}>{item.val}</div>
                    <div className="text-[8px] text-slate-600 font-mono">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: PLANS ── */}
        {activeTab === 'plans' && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="text-3xl mb-2">💈</div>
              <h2 className="text-2xl font-black text-white mb-2">Sovereign Barber Plans</h2>
              <p className="text-slate-500 text-sm font-mono">AI-Powered Barbershop Management · Part of GANI HYPHA SMA Ecosystem</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  name: 'Starter Chair',
                  price: 'Rp 299.000',
                  period: '/bulan',
                  badge: '',
                  emoji: '✂️',
                  color: 'from-slate-800 to-slate-900',
                  border: 'border-slate-700',
                  btn: 'bg-slate-700 hover:bg-slate-600',
                  features: [
                    '✅ Booking management (50/bulan)',
                    '✅ Style Vault (5 klien)',
                    '✅ Inventori tracking',
                    '✅ AI Style Advisor (20 query)',
                    '✅ WhatsApp notifikasi',
                    '❌ $HYPHA reward system',
                    '❌ NFT loyalty badges',
                    '❌ Multi-barber dashboard',
                  ],
                  cta: 'Mulai Gratis 7 Hari',
                },
                {
                  name: 'Sovereign Node',
                  price: 'Rp 799.000',
                  period: '/bulan',
                  badge: '⭐ Most Popular',
                  emoji: '💈',
                  color: 'from-[#1F1A0F] to-[#1A1A1A]',
                  border: 'border-[#D4AF37]/40',
                  btn: 'bg-[#D4AF37] hover:bg-[#C9A227] text-black',
                  features: [
                    '✅ Booking UNLIMITED',
                    '✅ Style Vault UNLIMITED klien',
                    '✅ AI Inventori auto-order',
                    '✅ AI Style Advisor UNLIMITED',
                    '✅ WhatsApp + auto-reply',
                    '✅ $HYPHA reward system',
                    '✅ Basic NFT loyalty badges',
                    '❌ Custom brand + domain',
                  ],
                  cta: '💈 Langganan Sekarang',
                },
                {
                  name: 'Dynasty Empire',
                  price: 'Rp 1.999.000',
                  period: '/bulan',
                  badge: '👑 Full Sovereign',
                  emoji: '👑',
                  color: 'from-amber-950/30 to-yellow-950/20',
                  border: 'border-amber-500/30',
                  btn: 'bg-amber-600 hover:bg-amber-500',
                  features: [
                    '✅ Semua fitur Sovereign Node',
                    '✅ Multi-barber & multi-branch',
                    '✅ Custom brand + domain',
                    '✅ NFT badges kustom (Polygon)',
                    '✅ $HYPHA staking integration',
                    '✅ GANI Store supply chain',
                    '✅ Analytics & BI dashboard',
                    '✅ Priority support 24/7',
                  ],
                  cta: '👑 Gabung Dynasty',
                },
              ].map((plan, i) => (
                <div key={i} className={`bg-gradient-to-b ${plan.color} border ${plan.border} rounded-2xl p-5 flex flex-col ${plan.badge ? 'ring-1 ring-[#D4AF37]/20' : ''}`}>
                  {plan.badge && (
                    <div className="text-center mb-3">
                      <span className="text-[9px] font-black bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 px-3 py-1 rounded-full uppercase tracking-widest">{plan.badge}</span>
                    </div>
                  )}
                  <div className="text-center mb-4">
                    <div className="text-3xl mb-2">{plan.emoji}</div>
                    <div className="text-base font-black text-white mb-1">{plan.name}</div>
                    <div>
                      <span className="text-2xl font-black text-[#D4AF37]">{plan.price}</span>
                      <span className="text-xs text-slate-500 font-mono">{plan.period}</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2 mb-5">
                    {plan.features.map((f, fi) => (
                      <div key={fi} className={`text-[11px] font-mono ${f.startsWith('✅') ? 'text-slate-300' : 'text-slate-600'}`}>{f}</div>
                    ))}
                  </div>
                  <button className={`w-full py-3 rounded-xl text-[11px] font-black uppercase tracking-widest ${plan.btn} transition-all`}>
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>

            {/* Integration Info */}
            <div className="bg-[#0E0E0E] border border-[#D4AF37]/10 rounded-2xl p-5">
              <div className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest mb-3">🌐 Ekosistem Integration</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { icon: '🌿', label: 'GANI HYPHA', desc: 'Marketplace & AI Agent Hub' },
                  { icon: '🔵', label: '$PREMALTA', desc: 'Token Bootstrap Revenue' },
                  { icon: '🛍️', label: 'Sovereign Store', desc: 'Supply Chain Automation' },
                  { icon: '🌙', label: 'SICA + SHGA', desc: 'Bundle Ramadan/Eid Events' },
                ].map((item, i) => (
                  <div key={i} className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-3 text-center">
                    <div className="text-xl mb-1">{item.icon}</div>
                    <div className="text-[10px] font-black text-white">{item.label}</div>
                    <div className="text-[8px] text-slate-600 font-mono">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SovereignBarber;
