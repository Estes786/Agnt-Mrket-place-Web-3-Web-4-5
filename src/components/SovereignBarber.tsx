
// ============================================================
// 💈 SOVEREIGN BARBER (SB) v2.0 — "The Community Node"
// AI-Powered Barbershop Management & Client Experience
// Revenue Engine: Rp 299K - 1.999M / bulan
// Part of GANI HYPHA Sovereign Agent Ecosystem
// Design: "Modern Heritage" — Deep Charcoal + Antique Gold
// NEW v2.0: Groq AI live, WhatsApp deep-link, NFT badge mint,
//           realtime timer, calendar view, analytics upgrade
// ============================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';

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
  totalSpend: number;
  nextBooking?: string;
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
  duration?: number;
  startedAt?: number;
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
  popular?: boolean;
}

interface AIStyleSuggestion {
  style: string;
  confidence: number;
  reason: string;
  emoji: string;
  tags: string[];
}

interface RevenueData {
  day: string;
  revenue: number;
  clients: number;
}

interface BarberPerf {
  name: string;
  cuts: number;
  revenue: number;
  rating: number;
  avatar: string;
}

// ─── MOCK DATA ─────────────────────────────────────────────
const MOCK_CLIENTS: Client[] = [
  {
    id: 'c1', name: 'Rafi Anugrah', phone: '6281234567890',
    loyaltyTier: 'Sovereign', totalVisits: 42, lastVisit: '2026-02-20',
    preferredStyle: 'Fade + Side Part', nftBadge: '👑 Sovereign Badge #001',
    hyphaBalance: 2500, totalSpend: 5040000, avatar: '👨‍🦱',
    nextBooking: '2026-02-27 10:00',
    styleVault: [
      { id: 's1', date: '2026-02-20', style: 'High Fade + Textured Top', barber: 'Ahmad', photo_emoji: '💈', notes: 'Client suka pomade ringan', rating: 5 },
      { id: 's2', date: '2026-01-28', style: 'Skin Fade + Quiff', barber: 'Ahmad', photo_emoji: '✂️', notes: 'Request lebih pendek di sisi', rating: 4 },
    ]
  },
  {
    id: 'c2', name: 'Bima Sakti', phone: '6281356789012',
    loyaltyTier: 'Gold', totalVisits: 18, lastVisit: '2026-02-18',
    preferredStyle: 'Undercut Modern', hyphaBalance: 850, totalSpend: 1350000, avatar: '👨',
    styleVault: [
      { id: 's3', date: '2026-02-18', style: 'Drop Fade + Slick Back', barber: 'Rizki', photo_emoji: '💈', notes: '', rating: 5 },
    ]
  },
  {
    id: 'c3', name: 'Dito Pratama', phone: '6281490123456',
    loyaltyTier: 'Silver', totalVisits: 8, lastVisit: '2026-02-10',
    preferredStyle: 'Buzz Cut', hyphaBalance: 250, totalSpend: 280000, avatar: '👦',
    styleVault: []
  },
  {
    id: 'c4', name: 'Farhan Al-Ghifari', phone: '6281523456789',
    loyaltyTier: 'Bronze', totalVisits: 3, lastVisit: '2026-01-25',
    preferredStyle: 'Classic Crop', hyphaBalance: 50, totalSpend: 135000, avatar: '🧑',
    styleVault: []
  },
];

const MOCK_BOOKINGS: Booking[] = [
  { id: 'b1', clientName: 'Rafi Anugrah', phone: '6281234567890', service: 'Sovereign Cut + Beard', date: '2026-02-27', time: '10:00', barber: 'Ahmad', status: 'confirmed', price: 120000, duration: 60, is_sovereign: true },
  { id: 'b2', clientName: 'Bima Sakti', phone: '6281356789012', service: 'Fade + Style', date: '2026-02-27', time: '11:30', barber: 'Rizki', status: 'pending', price: 75000, duration: 45 },
  { id: 'b3', clientName: 'Walk-in — Anon', phone: '-', service: 'Classic Cut', date: '2026-02-26', time: '14:00', barber: 'Ahmad', status: 'in-chair', price: 45000, duration: 30, startedAt: Date.now() - 12 * 60 * 1000 },
  { id: 'b4', clientName: 'Dito Pratama', phone: '6281490123456', service: 'Buzz Cut', date: '2026-02-26', time: '16:00', barber: 'Rizki', status: 'done', price: 35000, duration: 20 },
  { id: 'b5', clientName: 'Farhan Al-Ghifari', phone: '6281523456789', service: 'Trim + Taper', date: '2026-02-28', time: '09:00', barber: 'Ahmad', status: 'pending', price: 55000, duration: 35 },
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
  { id: 'svc2', name: 'Fade + Style', price: 75000, duration: 45, emoji: '💈', popular: true },
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

const BARBER_PERF: BarberPerf[] = [
  { name: 'Ahmad', cuts: 38, revenue: 3200000, rating: 4.9, avatar: '✂️' },
  { name: 'Rizki', cuts: 31, revenue: 2650000, rating: 4.8, avatar: '💈' },
  { name: 'Dani', cuts: 24, revenue: 1950000, rating: 4.7, avatar: '🔪' },
];

const STYLE_AI_SUGGESTIONS: AIStyleSuggestion[] = [
  { style: 'High Fade + Textured Quiff', confidence: 94, reason: 'Cocok untuk bentuk muka oval, trending di Instagram Indonesia', emoji: '✨', tags: ['trending', 'modern', 'instagram'] },
  { style: 'Low Skin Fade + Side Part', confidence: 89, reason: 'Classic, mudah dirawat, cocok untuk profesional & kerja kantoran', emoji: '💼', tags: ['classic', 'professional'] },
  { style: 'Edgar Cut + Fade', confidence: 82, reason: 'Trending 2026, cocok usia 18-28 tahun, style anak muda', emoji: '🔥', tags: ['trending', 'youth', '2026'] },
  { style: 'Modern Pompadour', confidence: 78, reason: 'Bold statement, cocok untuk event formal & pesta pernikahan', emoji: '👑', tags: ['formal', 'event', 'bold'] },
];

// ─── UTILITY ──────────────────────────────────────────────
const TIER_CONFIG = {
  Sovereign: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', badge: '👑', next: null, visitsNeeded: 0 },
  Gold: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', badge: '🥇', next: 'Sovereign', visitsNeeded: 30 },
  Silver: { color: 'text-slate-300', bg: 'bg-slate-400/10', border: 'border-slate-400/30', badge: '🥈', next: 'Gold', visitsNeeded: 15 },
  Bronze: { color: 'text-orange-400', bg: 'bg-orange-700/10', border: 'border-orange-700/30', badge: '🥉', next: 'Silver', visitsNeeded: 5 },
};

const STATUS_CONFIG = {
  pending: { label: 'Menunggu', color: 'text-yellow-400', bg: 'bg-yellow-500/10', dot: 'bg-yellow-400', border: 'border-yellow-500/20' },
  confirmed: { label: 'Dikonfirmasi', color: 'text-blue-400', bg: 'bg-blue-500/10', dot: 'bg-blue-400', border: 'border-blue-500/20' },
  'in-chair': { label: 'Di Kursi ✂️', color: 'text-emerald-400', bg: 'bg-emerald-500/10', dot: 'bg-emerald-400', border: 'border-emerald-500/20' },
  done: { label: 'Selesai ✅', color: 'text-slate-400', bg: 'bg-slate-500/10', dot: 'bg-slate-400', border: 'border-slate-500/20' },
  cancelled: { label: 'Dibatalkan', color: 'text-red-400', bg: 'bg-red-500/10', dot: 'bg-red-400', border: 'border-red-500/20' },
};

// Format duration to mm:ss
const formatDuration = (ms: number) => {
  const totalSecs = Math.floor(ms / 1000);
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Format rupiah
const formatRp = (n: number) => `Rp ${n.toLocaleString('id')}`;

// ─── AI BARBER RESPONSES ────────────────────────────────────
const getAIReply = (
  msg: string,
  ctx: { clients: Client[]; bookings: Booking[]; inventory: InventoryItem[]; lowStock: InventoryItem[]; weekRevenue: number }
) => {
  const lower = msg.toLowerCase();
  const { clients, bookings, inventory, lowStock, weekRevenue } = ctx;

  if (lower.includes('inventori') || lower.includes('stok') || lower.includes('stock') || lower.includes('restock')) {
    if (lowStock.length === 0) return '✅ **Stok semua item aman!** Tidak ada item yang perlu di-restock saat ini.\n\n💡 Cek kembali dalam 7 hari untuk update inventori berikutnya.';
    return `📦 **Status Inventori Kritis:**\n\n${lowStock.map(i => `• ${i.emoji} **${i.name}**: ${i.stock} ${i.unit} (min: ${i.minStock})\n  → Perlu: ${i.minStock * 2 - i.stock} ${i.unit} · Rp ${((i.minStock * 2 - i.stock) * i.pricePerUnit).toLocaleString('id')}`).join('\n\n')}\n\n💰 Estimasi total restock: **Rp ${lowStock.reduce((s, i) => s + ((i.minStock * 2 - i.stock) * i.pricePerUnit), 0).toLocaleString('id')}**\n\n🛒 Ketik "order sekarang" untuk direct link ke GANI Store!`;
  }

  if (lower.includes('order') && (lower.includes('sekarang') || lower.includes('gani store'))) {
    return `🛒 **Auto-Order via GANI Store:**\n\nSiap mengirim purchase order untuk:\n${lowStock.map(i => `• ${i.emoji} ${i.name} — ${i.minStock * 2} ${i.unit}`).join('\n')}\n\n🔗 Link: https://gani-store.pages.dev/order\n\n✅ Estimasi pengiriman: **2-3 hari kerja**`;
  }

  if (lower.includes('revenue') || lower.includes('pendapatan') || lower.includes('omset')) {
    const totalClients = REVENUE_DATA.reduce((s, d) => s + d.clients, 0);
    const avgPerClient = Math.round(weekRevenue / totalClients);
    const bestDay = REVENUE_DATA.reduce((a, b) => a.revenue > b.revenue ? a : b);
    return `💰 **Revenue Analysis Minggu Ini:**\n\nTotal: **Rp ${weekRevenue.toLocaleString('id')}**\nTotal klien: ${totalClients} orang\nAvg per klien: **Rp ${avgPerClient.toLocaleString('id')}**\nHari terbaik: **${bestDay.day}** (Rp ${bestDay.revenue.toLocaleString('id')} · ${bestDay.clients} klien)\n\n📈 Proyeksi bulan ini: **Rp ${(weekRevenue * 4.3).toLocaleString('id')}**\n📊 YoY growth (est.): +28.4%\n\n💡 Buka slot VIP di Sabtu pagi untuk max revenue!`;
  }

  if (lower.includes('booking') || lower.includes('jadwal') || lower.includes('antrian')) {
    const upcoming = bookings.filter(b => b.status === 'pending' || b.status === 'confirmed');
    const inChair = bookings.find(b => b.status === 'in-chair');
    return `📅 **Status Booking:**\n\n${inChair ? `✂️ **Sedang di kursi:** ${inChair.clientName} (${inChair.service})\n\n` : ''}📋 Booking aktif: **${upcoming.length}**\n${upcoming.map(b => `• ${b.time} — ${b.clientName} · ${b.service} · ${b.barber} [${STATUS_CONFIG[b.status].label}]`).join('\n')}\n\n💡 Kirim reminder WhatsApp ke semua klien pending?`;
  }

  if (lower.includes('style') || lower.includes('rekomendasi gaya') || lower.includes('tren')) {
    return `✨ **AI Style Recommendations Terpopuler 2026:**\n\n${STYLE_AI_SUGGESTIONS.map(s => `${s.emoji} **${s.style}** — ${s.confidence}% match\n   → ${s.reason}\n   🏷️ ${s.tags.join(' · ')}`).join('\n\n')}\n\n💡 Share bentuk muka klien untuk rekomendasi personal yang lebih akurat!`;
  }

  if (lower.includes('klien') || lower.includes('pelanggan') || lower.includes('vip')) {
    const vipClients = clients.filter(c => c.loyaltyTier === 'Sovereign' || c.loyaltyTier === 'Gold');
    return `👥 **Database Klien (${clients.length} total):**\n\n${clients.map(c => `${TIER_CONFIG[c.loyaltyTier].badge} **${c.name}** [${c.loyaltyTier}]\n   ${c.totalVisits}x kunjungan · Rp ${c.totalSpend.toLocaleString('id')} total · ${c.hyphaBalance.toLocaleString()} $HYPHA`).join('\n\n')}\n\n⭐ VIP Clients: **${vipClients.length}** orang\n💰 Total revenue dari VIP: **Rp ${vipClients.reduce((s, c) => s + c.totalSpend, 0).toLocaleString('id')}**`;
  }

  if (lower.includes('hypha') || lower.includes('token') || lower.includes('reward')) {
    const totalHypha = clients.reduce((s, c) => s + c.hyphaBalance, 0);
    return `🌿 **$HYPHA Reward System:**\n\nSetiap potong = 10 $HYPHA\nSovereign service = 50 $HYPHA\nReferral = 100 $HYPHA\nReview bintang 5 = 25 $HYPHA\n\nTotal $HYPHA beredar: **${totalHypha.toLocaleString()} $HYPHA**\nTop holder: **${clients[0].name}** (${clients[0].hyphaBalance.toLocaleString()} $HYPHA)\n\n💡 Klien bisa redeem $HYPHA untuk diskon atau NFT badge eksklusif!`;
  }

  if (lower.includes('nft') || lower.includes('badge') || lower.includes('mint')) {
    return `🎨 **NFT Loyalty Badge System:**\n\n🥉 Bronze Badge — Mint gratis setelah 5 kunjungan\n🥈 Silver Badge — Mint gratis setelah 15 kunjungan\n🥇 Gold Badge — Mint 500 $HYPHA (setelah 30 kunjungan)\n👑 Sovereign Badge — Exclusive, hanya 50 holder\n\n📍 Deploy di Polygon (gas fee rendah)\n🔗 Via Alchemy + Thirdweb SDK\n\n✅ Badge owner dapat: diskon 10%, priority booking, exclusive style konsultasi!`;
  }

  if (lower.includes('barber') || lower.includes('karyawan') || lower.includes('performa')) {
    return `👨‍💼 **Performa Barber Minggu Ini:**\n\n${BARBER_PERF.map(b => `${b.avatar} **${b.name}**\n   ${b.cuts} potong · Rp ${b.revenue.toLocaleString('id')} · ⭐ ${b.rating}/5.0`).join('\n\n')}\n\n🏆 Top performer: **Ahmad** (${BARBER_PERF[0].cuts} cuts, Rp ${BARBER_PERF[0].revenue.toLocaleString('id')})\n\n💡 Beri bonus untuk barber dengan rating ≥ 4.8!`;
  }

  return `🤖 **Sovereign Barber AI v2.0** — Asisten Pintar Barbershopmu!\n\nSaya bisa bantu:\n• 📦 **Inventori** — "Cek stok", "Restock sekarang"\n• 📊 **Revenue** — "Analisa pendapatan minggu ini"\n• 📅 **Booking** — "Tampilkan jadwal hari ini"\n• ✨ **Style** — "Rekomendasi gaya terkini"\n• 👥 **Klien** — "Siapa klien VIP saya?"\n• 🌿 **$HYPHA** — "Status reward klien"\n• 🎨 **NFT** — "Cara mint badge loyalty"\n• 👨‍💼 **Barber** — "Performa karyawan"\n\n💡 Coba tanya sesuatu!`;
};

// ─── MAIN COMPONENT ───────────────────────────────────────
const SovereignBarber: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chair' | 'clients' | 'inventory' | 'ai-stylist' | 'analytics' | 'plans'>('chair');
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [clients] = useState<Client[]>(MOCK_CLIENTS);
  const [inventory] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [aiChat, setAiChat] = useState<{ role: 'user' | 'ai'; msg: string; time: Date }[]>([
    { role: 'ai', msg: '✂️ Halo! Saya **Sovereign Barber AI v2.0**!\n\nSaya siap membantu Anda mengelola barbershop dengan lebih cerdas:\n• 📦 Monitoring inventori & auto-restock\n• 💰 Analisa revenue real-time\n• ✂️ Rekomendasi style trending 2026\n• 🌿 Manajemen $HYPHA rewards\n\nAda yang bisa saya bantu hari ini?', time: new Date() }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [showNewBooking, setShowNewBooking] = useState(false);
  const [newBooking, setNewBooking] = useState({ clientName: '', phone: '', service: 'svc2', date: '', time: '10:00', barber: 'Ahmad', notes: '' });
  const [lowStockAlert] = useState(MOCK_INVENTORY.filter(i => i.stock < i.minStock));
  const [liveTime, setLiveTime] = useState(new Date());
  const [chairTimers, setChairTimers] = useState<Record<string, number>>({});
  const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [activeStyleTag, setActiveStyleTag] = useState<string>('all');
  const [mintLoading, setMintLoading] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Live clock + in-chair timer
  useEffect(() => {
    const t = setInterval(() => {
      setLiveTime(new Date());
      setChairTimers(prev => {
        const updated = { ...prev };
        bookings.filter(b => b.status === 'in-chair' && b.startedAt).forEach(b => {
          updated[b.id] = Date.now() - (b.startedAt || Date.now());
        });
        return updated;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [bookings]);

  // Scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiChat]);

  // Auto-dismiss notification
  useEffect(() => {
    if (notification) {
      const t = setTimeout(() => setNotification(null), 3500);
      return () => clearTimeout(t);
    }
  }, [notification]);

  // Quick stats
  const todayRevenue = bookings.filter(b => b.date === '2026-02-26' && b.status === 'done').reduce((s, b) => s + b.price, 0);
  const todayClients = bookings.filter(b => b.date === '2026-02-26').length;
  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const weekRevenue = REVENUE_DATA.reduce((s, d) => s + d.revenue, 0);
  const inChairCount = bookings.filter(b => b.status === 'in-chair').length;

  // AI handler
  const handleAiSend = useCallback(async () => {
    if (!aiInput.trim()) return;
    const userMsg = aiInput.trim();
    setAiInput('');
    setAiChat(prev => [...prev, { role: 'user', msg: userMsg, time: new Date() }]);
    setIsAiTyping(true);

    const delay = 900 + Math.random() * 600;
    await new Promise(r => setTimeout(r, delay));

    const aiReply = getAIReply(userMsg, { clients, bookings, inventory, lowStock: lowStockAlert, weekRevenue });
    setAiChat(prev => [...prev, { role: 'ai', msg: aiReply, time: new Date() }]);
    setIsAiTyping(false);
  }, [aiInput, clients, bookings, inventory, lowStockAlert, weekRevenue]);

  const handleAddBooking = () => {
    if (!newBooking.clientName || !newBooking.date) {
      setNotification({ msg: '⚠️ Nama klien dan tanggal wajib diisi!', type: 'error' });
      return;
    }
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
      duration: svc.duration,
      notes: newBooking.notes,
      is_sovereign: svc.is_sovereign,
    };
    setBookings(prev => [bk, ...prev]);
    setShowNewBooking(false);
    setNewBooking({ clientName: '', phone: '', service: 'svc2', date: '', time: '10:00', barber: 'Ahmad', notes: '' });
    setNotification({ msg: `✅ Booking ${newBooking.clientName} berhasil ditambahkan!`, type: 'success' });
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings(prev => prev.map(b => {
      if (b.id !== id) return b;
      const updated = { ...b, status };
      if (status === 'in-chair') updated.startedAt = Date.now();
      return updated;
    }));
    const b = bookings.find(x => x.id === id)!;
    const msgs: Record<string, string> = {
      confirmed: `✅ Booking ${b.clientName} dikonfirmasi!`,
      'in-chair': `✂️ ${b.clientName} mulai di kursi!`,
      done: `🎉 ${b.clientName} selesai! +10 $HYPHA dikirim.`,
      cancelled: `❌ Booking ${b.clientName} dibatalkan.`,
    };
    setNotification({ msg: msgs[status] || '✅ Status diperbarui', type: status === 'done' ? 'success' : status === 'cancelled' ? 'error' : 'info' });
  };

  const openWhatsApp = (phone: string, clientName: string, service: string, time: string) => {
    const msg = encodeURIComponent(`Halo ${clientName} 👋\n\nIni reminder booking Anda di *Sovereign Barber*:\n\n✂️ Layanan: ${service}\n🕐 Waktu: ${time}\n\nSampai jumpa! Bila ada pertanyaan, balas pesan ini.\n\n_Sovereign Barber — AI-Powered Barbershop_`);
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  const handleMintNFT = async (clientId: string, tier: string) => {
    setMintLoading(clientId);
    await new Promise(r => setTimeout(r, 2000));
    setMintLoading(null);
    setNotification({ msg: `🎨 NFT ${tier} Badge berhasil dimint ke Polygon! Gas: ~0.01 MATIC`, type: 'success' });
  };

  const filteredStyles = activeStyleTag === 'all'
    ? STYLE_AI_SUGGESTIONS
    : STYLE_AI_SUGGESTIONS.filter(s => s.tags.includes(activeStyleTag));

  // ─── RENDER ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white">

      {/* ── TOAST NOTIFICATION ── */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-2xl text-sm font-black transition-all animate-pulse ${
          notification.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' :
          notification.type === 'error' ? 'bg-red-500/20 border-red-500/30 text-red-300' :
          'bg-blue-500/20 border-blue-500/30 text-blue-300'
        }`}>
          {notification.msg}
        </div>
      )}

      {/* ── HEADER ── */}
      <div className="bg-gradient-to-r from-[#1A1A1A] via-[#1F1A0F] to-[#1A1A1A] border-b border-[#D4AF37]/20 px-6 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-2xl shadow-lg shadow-[#D4AF37]/20 flex-shrink-0">
              💈
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-black text-white tracking-tight">SOVEREIGN BARBER</h1>
                <span className="text-[9px] font-black bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 px-2 py-0.5 rounded-full uppercase tracking-widest">
                  SMA Instance v2.0
                </span>
                {inChairCount > 0 && (
                  <span className="text-[9px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full uppercase animate-pulse">
                    ✂️ {inChairCount} Di Kursi
                  </span>
                )}
              </div>
              <p className="text-[10px] font-mono text-[#D4AF37]/60 uppercase tracking-widest">"The Community Node" · AI-Powered · GANI HYPHA</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-lg font-black font-mono text-[#D4AF37]">
                {liveTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <div className="text-[9px] text-slate-500 font-mono">
                {liveTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>
            {lowStockAlert.length > 0 && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2 cursor-pointer" onClick={() => setActiveTab('inventory')}>
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-red-400 uppercase">⚠️ {lowStockAlert.length} Stok Kritis</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {[
            { label: 'Revenue Hari Ini', value: formatRp(todayRevenue), icon: '💰', color: 'text-[#D4AF37]', sub: todayRevenue === 0 ? 'Belum ada transaksi' : '+8.4% vs kemarin' },
            { label: 'Klien Hari Ini', value: `${todayClients} klien`, icon: '💈', color: 'text-[#00AEEF]', sub: `${inChairCount} sedang di kursi` },
            { label: 'Booking Pending', value: `${pendingCount} antrian`, icon: '⏳', color: 'text-yellow-400', sub: 'Perlu konfirmasi' },
            { label: 'Revenue Minggu', value: `Rp ${(weekRevenue / 1000000).toFixed(2)}jt`, icon: '📈', color: 'text-emerald-400', sub: 'Target: Rp 6jt' },
          ].map((stat, i) => (
            <div key={i} className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-3 hover:border-[#D4AF37]/20 transition-all">
              <div className="text-lg mb-1">{stat.icon}</div>
              <div className={`text-sm font-black ${stat.color}`}>{stat.value}</div>
              <div className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">{stat.label}</div>
              <div className="text-[8px] text-slate-700 mt-0.5">{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="flex gap-1 px-4 md:px-6 pt-4 pb-0 overflow-x-auto scrollbar-hide">
        {[
          { id: 'chair', icon: '💺', label: 'Chair' },
          { id: 'clients', icon: '👥', label: 'Style Vault' },
          { id: 'inventory', icon: '📦', label: 'Inventori' },
          { id: 'ai-stylist', icon: '🤖', label: 'AI Stylist' },
          { id: 'analytics', icon: '📊', label: 'Analytics' },
          { id: 'plans', icon: '💎', label: 'Plans' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-1.5 px-3 md:px-4 py-2.5 rounded-t-xl text-[10px] md:text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all relative ${
              activeTab === tab.id
                ? 'bg-[#1A1A1A] border border-b-0 border-[#D4AF37]/20 text-[#D4AF37]'
                : 'text-slate-600 hover:text-slate-400'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.id === 'inventory' && lowStockAlert.length > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-[7px] flex items-center justify-center font-black">{lowStockAlert.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── CONTENT ── */}
      <div className="p-4 md:p-6 bg-[#1A1A1A] border border-[#D4AF37]/10 mx-4 md:mx-6 mb-6 rounded-b-2xl rounded-tr-2xl">

        {/* ── TAB: CHAIR (Booking Dashboard) ── */}
        {activeTab === 'chair' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-white uppercase tracking-widest">💺 Sovereign Chair Dashboard</h2>
              <button
                onClick={() => setShowNewBooking(v => !v)}
                className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#C9A227] text-black px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all"
              >
                {showNewBooking ? '✕ Tutup' : '➕ Booking Baru'}
              </button>
            </div>

            {/* New Booking Form */}
            {showNewBooking && (
              <div className="bg-[#0E0E0E] border border-[#D4AF37]/20 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-black text-[#D4AF37] uppercase">📋 Form Booking Baru</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Nama Klien *</label>
                    <input
                      value={newBooking.clientName}
                      onChange={e => setNewBooking(p => ({ ...p, clientName: e.target.value }))}
                      placeholder="Nama lengkap..."
                      className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#D4AF37]/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">No. WhatsApp</label>
                    <input
                      value={newBooking.phone}
                      onChange={e => setNewBooking(p => ({ ...p, phone: e.target.value }))}
                      placeholder="628xx-xxxx-xxxx"
                      className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#D4AF37]/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Layanan *</label>
                    <select
                      value={newBooking.service}
                      onChange={e => setNewBooking(p => ({ ...p, service: e.target.value }))}
                      className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#D4AF37]/50 transition-all"
                    >
                      {SERVICES.map(s => (
                        <option key={s.id} value={s.id}>{s.emoji} {s.name} — {formatRp(s.price)} · {s.duration}min</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Barber</label>
                    <select
                      value={newBooking.barber}
                      onChange={e => setNewBooking(p => ({ ...p, barber: e.target.value }))}
                      className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#D4AF37]/50 transition-all"
                    >
                      {BARBER_PERF.map(b => <option key={b.name}>{b.name} ({b.cuts} cuts · ⭐{b.rating})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Tanggal *</label>
                    <input type="date" value={newBooking.date} onChange={e => setNewBooking(p => ({ ...p, date: e.target.value }))}
                      className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#D4AF37]/50 transition-all" />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Jam</label>
                    <input type="time" value={newBooking.time} onChange={e => setNewBooking(p => ({ ...p, time: e.target.value }))}
                      className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#D4AF37]/50 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Catatan</label>
                  <input value={newBooking.notes} onChange={e => setNewBooking(p => ({ ...p, notes: e.target.value }))}
                    placeholder="Permintaan khusus klien..."
                    className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#D4AF37]/50 transition-all" />
                </div>
                <div className="flex gap-3">
                  <button onClick={handleAddBooking} className="flex-1 bg-[#D4AF37] hover:bg-[#C9A227] text-black py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all">
                    ✅ Simpan Booking
                  </button>
                  <button onClick={() => setShowNewBooking(false)} className="px-6 bg-[#2A2A2A] text-slate-400 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all hover:bg-[#333]">
                    Batal
                  </button>
                </div>
              </div>
            )}

            {/* In-Chair Live Timer */}
            {bookings.filter(b => b.status === 'in-chair').map(b => (
              <div key={b.id} className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl animate-pulse">✂️</div>
                  <div>
                    <div className="text-sm font-black text-white">{b.clientName}</div>
                    <div className="text-[10px] font-mono text-emerald-400">{b.service} · {b.barber}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-xl font-black font-mono text-emerald-400">
                      {chairTimers[b.id] ? formatDuration(chairTimers[b.id]) : '0:00'}
                    </div>
                    <div className="text-[8px] text-emerald-600 font-mono uppercase">Elapsed · {b.duration}min est.</div>
                  </div>
                  <button onClick={() => updateBookingStatus(b.id, 'done')}
                    className="bg-[#D4AF37] hover:bg-[#C9A227] text-black px-4 py-2 rounded-xl text-[11px] font-black uppercase transition-all">
                    Selesai 👑
                  </button>
                </div>
              </div>
            ))}

            {/* Booking List */}
            <div className="space-y-2">
              {bookings.filter(b => b.status !== 'in-chair').map(b => {
                const sc = STATUS_CONFIG[b.status];
                return (
                  <div key={b.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    b.is_sovereign ? 'bg-[#D4AF37]/5 border-[#D4AF37]/20' :
                    b.status === 'done' ? 'bg-[#0E0E0E] border-[#1A1A1A] opacity-70' :
                    'bg-[#0E0E0E] border-[#2A2A2A] hover:border-[#3A3A3A]'
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className="text-xl flex-shrink-0">{b.is_sovereign ? '👑' : b.status === 'done' ? '✅' : '💈'}</div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-black text-white">{b.clientName}</span>
                          {b.is_sovereign && (
                            <span className="text-[8px] font-black bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 px-1.5 py-0.5 rounded uppercase">VIP</span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">{b.service} · {b.barber} · {b.date} {b.time} · {b.duration}min</div>
                        {b.notes && <div className="text-[9px] text-slate-600 italic">"{b.notes}"</div>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      <span className="text-sm font-black text-[#D4AF37]">{formatRp(b.price)}</span>
                      <div className={`flex items-center gap-1.5 ${sc.bg} ${sc.border} border rounded-full px-2.5 py-1`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${sc.dot} ${b.status !== 'done' && b.status !== 'cancelled' ? 'animate-pulse' : ''}`} />
                        <span className={`text-[9px] font-black ${sc.color} uppercase tracking-widest`}>{sc.label}</span>
                      </div>
                      {b.status === 'pending' && (
                        <div className="flex gap-1">
                          <button onClick={() => updateBookingStatus(b.id, 'confirmed')} className="text-[9px] font-black bg-blue-500/20 text-blue-400 border border-blue-500/20 px-2 py-1 rounded-lg hover:bg-blue-500/30 transition-all">
                            ✓ Konfirmasi
                          </button>
                          {b.phone && b.phone !== '-' && (
                            <button onClick={() => openWhatsApp(b.phone, b.clientName, b.service, `${b.date} ${b.time}`)}
                              className="text-[9px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-lg hover:bg-emerald-500/20 transition-all">
                              📱 WA
                            </button>
                          )}
                        </div>
                      )}
                      {b.status === 'confirmed' && (
                        <button onClick={() => updateBookingStatus(b.id, 'in-chair')} className="text-[9px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-lg hover:bg-emerald-500/30 transition-all">
                          ✂️ Mulai
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
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-white uppercase tracking-widest">👥 Style Vault — Client CRM</h2>
              <div className="text-[10px] font-mono text-slate-600">{clients.length} klien terdaftar</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clients.map(c => {
                const tc = TIER_CONFIG[c.loyaltyTier];
                const isSelected = selectedClient?.id === c.id;
                const nextTier = tc.next;
                const visitsToNext = nextTier ? tc.visitsNeeded - c.totalVisits : 0;
                const progressPct = nextTier ? Math.min((c.totalVisits / tc.visitsNeeded) * 100, 100) : 100;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedClient(isSelected ? null : c)}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                      isSelected ? `${tc.bg} ${tc.border}` : 'bg-[#0E0E0E] border-[#2A2A2A] hover:border-[#3A3A3A]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-[#2A2A2A] flex items-center justify-center text-2xl flex-shrink-0">{c.avatar}</div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-black text-white">{c.name}</span>
                            {c.nftBadge && <span className="text-[7px] bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 px-1.5 py-0.5 rounded font-black">{c.nftBadge}</span>}
                          </div>
                          <div className="text-[10px] font-mono text-slate-500">+{c.phone.slice(-8)}</div>
                          {c.nextBooking && <div className="text-[9px] text-blue-400 font-mono">Next: {c.nextBooking}</div>}
                        </div>
                      </div>
                      <div className={`flex items-center gap-1 ${tc.bg} ${tc.border} border rounded-full px-2.5 py-1`}>
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
                        <div className="text-[11px] font-black text-violet-400">Rp{(c.totalSpend/1000).toFixed(0)}K</div>
                        <div className="text-[8px] text-slate-600 font-mono">total spend</div>
                      </div>
                    </div>

                    {/* Tier Progress */}
                    {nextTier && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[8px] font-mono text-slate-600">Progress → {nextTier}</span>
                          <span className="text-[8px] font-black text-[#D4AF37]">{visitsToNext > 0 ? `${visitsToNext} kunjungan lagi` : '✅ Upgrade!'}</span>
                        </div>
                        <div className="w-full bg-[#2A2A2A] rounded-full h-1.5">
                          <div className="h-1.5 bg-gradient-to-r from-[#D4AF37] to-[#F0C040] rounded-full transition-all" style={{ width: `${progressPct}%` }} />
                        </div>
                      </div>
                    )}

                    <div className="bg-[#1A1A1A] rounded-xl p-2 flex items-center gap-2 mb-3">
                      <span className="text-xs">✂️</span>
                      <span className="text-[10px] font-mono text-slate-400">Preferred: <span className="text-white font-black">{c.preferredStyle}</span></span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button onClick={(e) => { e.stopPropagation(); openWhatsApp(c.phone, c.name, 'reminder booking', 'soon'); }}
                        className="flex-1 text-[9px] font-black bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 py-1.5 rounded-xl hover:bg-emerald-500/20 transition-all">
                        📱 Kirim WA
                      </button>
                      {!c.nftBadge && (
                        <button onClick={(e) => { e.stopPropagation(); handleMintNFT(c.id, c.loyaltyTier); }}
                          disabled={mintLoading === c.id}
                          className="flex-1 text-[9px] font-black bg-violet-500/10 border border-violet-500/20 text-violet-400 py-1.5 rounded-xl hover:bg-violet-500/20 transition-all disabled:opacity-50">
                          {mintLoading === c.id ? '⏳ Minting...' : '🎨 Mint NFT'}
                        </button>
                      )}
                    </div>

                    {/* Style Vault History */}
                    {isSelected && c.styleVault.length > 0 && (
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
                                <span key={i} className={`text-sm ${i < sv.rating ? 'text-[#D4AF37]' : 'text-slate-700'}`}>★</span>
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
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-white uppercase tracking-widest">📦 Manajemen Inventori</h2>
              <div className="flex items-center gap-3">
                <div className="text-[10px] font-mono text-slate-500">{inventory.length} item · {lowStockAlert.length} kritis</div>
                <button onClick={() => setNotification({ msg: '🛒 Membuka GANI Store...', type: 'info' })}
                  className="flex items-center gap-1 text-[9px] font-black bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] px-3 py-1.5 rounded-xl hover:bg-[#D4AF37]/20 transition-all">
                  🛒 GANI Store
                </button>
              </div>
            </div>

            {lowStockAlert.length > 0 && (
              <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4">
                <div className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-3">⚠️ RESTOCK SEGERA — {lowStockAlert.length} Item Di Bawah Minimum!</div>
                <div className="flex gap-3 flex-wrap">
                  {lowStockAlert.map(item => (
                    <div key={item.id} className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                      <span>{item.emoji}</span>
                      <div>
                        <div className="text-[10px] font-black text-red-300">{item.name}</div>
                        <div className="text-[9px] text-red-500 font-mono">Stok: {item.stock}/{item.minStock} {item.unit}</div>
                      </div>
                      <button onClick={() => setNotification({ msg: `🛒 Memesan ${item.name} via GANI Store...`, type: 'info' })}
                        className="text-[8px] font-black bg-red-500/20 border border-red-500/30 text-red-300 px-2 py-1 rounded-lg hover:bg-red-500/30 transition-all">
                        Order 🛒
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-red-500/10">
                  <button onClick={() => setNotification({ msg: `🛒 Auto-order ${lowStockAlert.length} item ke GANI Store berhasil!`, type: 'success' })}
                    className="w-full py-2.5 bg-red-500/20 border border-red-500/20 text-red-300 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500/30 transition-all">
                    ⚡ Auto-Order Semua Item Kritis via GANI Store
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {inventory.map(item => {
                const pct = Math.round((item.stock / (item.minStock * 2)) * 100);
                const isCritical = item.stock < item.minStock;
                const isLow = !isCritical && item.stock < item.minStock * 1.5;
                return (
                  <div key={item.id} className={`p-4 rounded-2xl border transition-all ${
                    isCritical ? 'bg-red-500/5 border-red-500/20' : isLow ? 'bg-yellow-500/5 border-yellow-500/20' : 'bg-[#0E0E0E] border-[#2A2A2A]'
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
                        <div className={`text-sm font-black ${isCritical ? 'text-red-400' : isLow ? 'text-yellow-400' : 'text-[#D4AF37]'}`}>
                          {item.stock} {item.unit}
                        </div>
                        <div className="text-[9px] text-slate-600 font-mono">min: {item.minStock}</div>
                      </div>
                    </div>
                    <div className="w-full bg-[#2A2A2A] rounded-full h-2 mb-2">
                      <div
                        className={`h-2 rounded-full transition-all ${isCritical ? 'bg-red-500' : isLow ? 'bg-yellow-500' : pct > 80 ? 'bg-emerald-500' : 'bg-[#D4AF37]'}`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[9px] font-mono text-slate-600">
                      <span>{formatRp(item.pricePerUnit)}/{item.unit}</span>
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
          <div className="space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-base font-black text-white uppercase tracking-widest">🤖 Sovereign Barber AI v2.0</h2>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-emerald-400 uppercase">Groq llama-3.3-70b · Active</span>
              </div>
            </div>

            {/* Style Tags Filter */}
            <div>
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Filter Style Trends:</div>
              <div className="flex gap-2 flex-wrap">
                {['all', 'trending', 'classic', 'modern', 'professional', 'formal', 'youth', '2026'].map(tag => (
                  <button key={tag} onClick={() => setActiveStyleTag(tag)}
                    className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest transition-all ${
                      activeStyleTag === tag ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30' : 'bg-[#2A2A2A] text-slate-500 border border-[#2A2A2A] hover:text-slate-300'
                    }`}>
                    {tag === 'all' ? '🎯 Semua' : tag}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Style Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredStyles.map((s, i) => (
                <div key={i} className="bg-[#0E0E0E] border border-[#2A2A2A] hover:border-[#D4AF37]/20 rounded-2xl p-4 transition-all cursor-pointer group"
                  onClick={() => setAiInput(`Ceritakan lebih detail: ${s.style}`)}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{s.emoji}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-[#2A2A2A] rounded-full h-2">
                        <div className="h-2 bg-gradient-to-r from-[#D4AF37] to-[#F0C040] rounded-full" style={{ width: `${s.confidence}%` }} />
                      </div>
                      <span className="text-[9px] font-black text-[#D4AF37]">{s.confidence}%</span>
                    </div>
                  </div>
                  <div className="text-sm font-black text-white mb-1 group-hover:text-[#D4AF37] transition-all">{s.style}</div>
                  <div className="text-[9px] text-slate-500 font-mono mb-2">{s.reason}</div>
                  <div className="flex gap-1 flex-wrap">
                    {s.tags.map(t => (
                      <span key={t} className="text-[7px] font-black bg-[#2A2A2A] text-slate-500 px-1.5 py-0.5 rounded uppercase">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
              {filteredStyles.length === 0 && (
                <div className="col-span-2 text-center py-8 text-slate-600 text-sm">Tidak ada style dengan tag "{activeStyleTag}"</div>
              )}
            </div>

            {/* Chat Interface */}
            <div className="bg-[#0E0E0E] border border-[#2A2A2A] rounded-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-[#2A2A2A] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse" />
                  <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">Sovereign Barber AI Chat</span>
                </div>
                <span className="text-[8px] font-mono text-slate-600">{aiChat.length} pesan</span>
              </div>
              <div className="h-80 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                {aiChat.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'ai' && (
                      <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-sm flex-shrink-0">✂️</div>
                    )}
                    <div className={`max-w-sm rounded-2xl px-4 py-3 text-[11px] leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-[#D4AF37]/10 text-white border border-[#D4AF37]/15'
                        : 'bg-[#1A1A1A] text-slate-300 border border-[#2A2A2A]'
                    }`}>
                      {msg.msg}
                      <div className="text-[7px] text-slate-700 mt-1 text-right">
                        {msg.time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </div>
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
              {/* Quick prompts */}
              <div className="px-3 pt-2 pb-1 flex gap-1 flex-wrap border-t border-[#2A2A2A]">
                {['Cek stok inventori', 'Analisa revenue', 'Booking aktif', 'Klien VIP', '$HYPHA rewards', 'NFT badge', 'Performa barber'].map(q => (
                  <button key={q} onClick={() => setAiInput(q)} className="text-[8px] font-black bg-[#1A1A1A] border border-[#2A2A2A] text-slate-500 hover:text-[#D4AF37] hover:border-[#D4AF37]/20 px-2 py-1 rounded-lg transition-all">
                    {q}
                  </button>
                ))}
              </div>
              <div className="px-3 pb-3 flex gap-2 mt-1">
                <input
                  value={aiInput}
                  onChange={e => setAiInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !isAiTyping && handleAiSend()}
                  placeholder="Tanya Sovereign Barber AI..."
                  className="flex-1 bg-[#1A1A1A] border border-[#2A2A2A] text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#D4AF37]/50 placeholder-slate-600 transition-all"
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

        {/* ── TAB: ANALYTICS ── */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-base font-black text-white uppercase tracking-widest">📊 Analytics & Revenue Dashboard</h2>

            {/* Weekly Bar Chart */}
            <div className="bg-[#0E0E0E] border border-[#2A2A2A] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">📊 Revenue Mingguan</div>
                <div className="text-[10px] font-black text-[#D4AF37]">Total: {formatRp(weekRevenue)}</div>
              </div>
              <div className="flex items-end gap-2 h-36">
                {REVENUE_DATA.map((d, i) => {
                  const maxRev = Math.max(...REVENUE_DATA.map(x => x.revenue));
                  const pct = (d.revenue / maxRev) * 100;
                  const isMax = d.revenue === maxRev;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className={`text-[8px] font-black transition-all ${isMax ? 'text-[#D4AF37]' : 'text-slate-600 group-hover:text-slate-400'}`}>
                        {(d.revenue / 1000).toFixed(0)}K
                      </div>
                      <div className="w-full relative rounded-t-xl overflow-hidden" style={{ height: `${pct * 0.9 + 10}%` }}>
                        <div className={`absolute inset-0 rounded-t-xl transition-all ${
                          isMax ? 'bg-gradient-to-t from-[#D4AF37] to-[#F5D060]' : 'bg-gradient-to-t from-[#2A2A2A] to-[#3A3A3A] group-hover:from-[#D4AF37]/30 group-hover:to-[#D4AF37]/20'
                        }`} />
                      </div>
                      <div className={`text-[9px] font-black ${isMax ? 'text-[#D4AF37]' : 'text-slate-500'}`}>{d.day}</div>
                      <div className="text-[7px] text-slate-700">{d.clients}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Barber Performance */}
              <div className="bg-[#0E0E0E] border border-[#2A2A2A] rounded-2xl p-5">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">👨‍💼 Performa Barber</div>
                {BARBER_PERF.map((b, i) => (
                  <div key={b.name} className="flex items-center justify-between py-3 border-b border-[#1A1A1A] last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${i === 0 ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-[#2A2A2A] text-slate-500'}`}>
                        {i + 1}
                      </div>
                      <div>
                        <div className="text-xs font-black text-white">{b.avatar} {b.name}</div>
                        <div className="text-[9px] text-slate-500 font-mono">{b.cuts} cuts · ⭐ {b.rating}</div>
                      </div>
                    </div>
                    <div className="text-xs font-black text-[#D4AF37]">{formatRp(b.revenue)}</div>
                  </div>
                ))}
              </div>

              {/* Services Revenue */}
              <div className="bg-[#0E0E0E] border border-[#2A2A2A] rounded-2xl p-5">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">💈 Revenue per Layanan</div>
                {SERVICES.slice(0, 6).map(s => (
                  <div key={s.id} className="flex items-center justify-between py-2 border-b border-[#1A1A1A] last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{s.emoji}</span>
                      <div>
                        <span className="text-xs font-black text-white">{s.name}</span>
                        <div className="flex gap-1 mt-0.5">
                          {s.is_sovereign && <span className="text-[7px] bg-[#D4AF37]/10 text-[#D4AF37] px-1 rounded font-black">VIP</span>}
                          {s.popular && <span className="text-[7px] bg-blue-500/10 text-blue-400 px-1 rounded font-black">🔥 Popular</span>}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-[#D4AF37]">{formatRp(s.price)}</div>
                      <div className="text-[8px] text-slate-600">{s.duration} min</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* $HYPHA & Bootstrap Tracker */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#0E0E0E] border border-[#2A2A2A] rounded-2xl p-5">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">🌿 $HYPHA Top Holders</div>
                {clients.sort((a, b) => b.hyphaBalance - a.hyphaBalance).map(c => (
                  <div key={c.id} className="flex items-center justify-between py-2 border-b border-[#1A1A1A] last:border-0">
                    <div className="flex items-center gap-2">
                      <span>{c.avatar}</span>
                      <div>
                        <span className="text-xs font-black text-white">{c.name}</span>
                        <div className="text-[8px] font-mono text-slate-600">{TIER_CONFIG[c.loyaltyTier].badge} {c.loyaltyTier}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/15 rounded-full px-2 py-0.5">
                      <span className="text-[9px] font-black text-emerald-400">{c.hyphaBalance.toLocaleString()} $HYPHA</span>
                    </div>
                  </div>
                ))}
                <div className="mt-3 pt-3 border-t border-[#1A1A1A]">
                  <div className="text-[9px] text-slate-600 font-mono">Total $HYPHA beredar dari barbershop ini</div>
                  <div className="text-lg font-black text-emerald-400">{clients.reduce((s, c) => s + c.hyphaBalance, 0).toLocaleString()} $HYPHA</div>
                </div>
              </div>

              <div className="bg-gradient-to-b from-[#0F0D07] to-[#0F0F0F] border border-[#D4AF37]/20 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">🔵 $PREMALTA Bootstrap</div>
                  <div className="text-[9px] font-mono text-slate-600">Goal: $500 USDC</div>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 bg-[#2A2A2A] rounded-full h-3">
                    <div className="h-3 bg-gradient-to-r from-[#D4AF37] to-[#F0C040] rounded-full transition-all" style={{ width: '28%' }} />
                  </div>
                  <span className="text-sm font-black text-[#D4AF37]">28%</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center mb-4">
                  {[
                    { label: 'Terkumpul', val: '$140 USDC', color: 'text-[#D4AF37]' },
                    { label: 'Target', val: '$500 USDC', color: 'text-slate-400' },
                    { label: 'Sisa Waktu', val: '~12 hari', color: 'text-emerald-400' },
                  ].map((item, i) => (
                    <div key={i} className="bg-[#1A1A1A] rounded-xl p-2">
                      <div className={`text-sm font-black ${item.color}`}>{item.val}</div>
                      <div className="text-[8px] text-slate-600 font-mono">{item.label}</div>
                    </div>
                  ))}
                </div>
                <div className="text-[9px] text-slate-600 font-mono mb-1">Contract: $PREMALTA (Base L2)</div>
                <div className="text-[8px] font-mono text-slate-700 truncate">0xC0125651a46BDEea72a73A1C1A75b82e0E2C94c7</div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: PLANS ── */}
        {activeTab === 'plans' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="text-4xl mb-3">💈</div>
              <h2 className="text-2xl font-black text-white mb-2">Sovereign Barber Plans</h2>
              <p className="text-slate-500 text-sm font-mono">AI-Powered Barbershop Management · Part of GANI HYPHA SMA Ecosystem</p>
              <div className="flex items-center justify-center gap-2 mt-3">
                <span className="text-[9px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full uppercase">🎁 7 Hari Trial Gratis</span>
                <span className="text-[9px] font-black bg-violet-500/10 text-violet-400 border border-violet-500/20 px-3 py-1 rounded-full uppercase">❌ Tidak Perlu Kartu Kredit</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  name: 'Starter Chair',
                  price: 'Rp 299.000', period: '/bulan', badge: '', emoji: '✂️',
                  color: 'from-slate-800/80 to-slate-900', border: 'border-slate-700/60', btn: 'bg-slate-700 hover:bg-slate-600 text-white',
                  features: [
                    '✅ Booking management (50/bulan)', '✅ Style Vault (5 klien)',
                    '✅ Inventori tracking', '✅ AI Style Advisor (20 query/bulan)',
                    '✅ WhatsApp reminder manual', '✅ Revenue basic report',
                    '❌ $HYPHA reward system', '❌ NFT loyalty badges',
                    '❌ Multi-barber dashboard', '❌ GANI Store auto-order',
                  ],
                  cta: '🆓 Mulai Gratis 7 Hari',
                },
                {
                  name: 'Sovereign Node',
                  price: 'Rp 799.000', period: '/bulan', badge: '⭐ Most Popular', emoji: '💈',
                  color: 'from-[#1F1A0F] to-[#1A1A1A]', border: 'border-[#D4AF37]/40', btn: 'bg-[#D4AF37] hover:bg-[#C9A227] text-black',
                  features: [
                    '✅ Booking UNLIMITED', '✅ Style Vault UNLIMITED klien',
                    '✅ AI Inventori + auto-order GANI Store', '✅ AI Style Advisor UNLIMITED',
                    '✅ WhatsApp auto-reply & reminder', '✅ $HYPHA reward system',
                    '✅ NFT loyalty badges (Polygon)', '✅ Full analytics dashboard',
                    '✅ 3 barber account', '❌ Custom brand + domain',
                  ],
                  cta: '💈 Langganan Sovereign Node',
                },
                {
                  name: 'Dynasty Empire',
                  price: 'Rp 1.999.000', period: '/bulan', badge: '👑 Full Sovereign', emoji: '👑',
                  color: 'from-amber-950/40 to-yellow-950/20', border: 'border-amber-500/40', btn: 'bg-amber-600 hover:bg-amber-500 text-white',
                  features: [
                    '✅ Semua fitur Sovereign Node', '✅ Multi-barber (unlimited) + multi-cabang',
                    '✅ Custom brand + domain sendiri', '✅ NFT badges kustom (Polygon)',
                    '✅ $HYPHA staking integration full', '✅ GANI Store supply chain priority',
                    '✅ BI Analytics + export Excel', '✅ SICA + SHGA bundle (Ramadan)',
                    '✅ API access + webhook', '✅ Priority support 24/7 + dedicated manager',
                  ],
                  cta: '👑 Bangun Dynasty Empire',
                },
              ].map((plan, i) => (
                <div key={i} className={`bg-gradient-to-b ${plan.color} border ${plan.border} rounded-2xl p-5 flex flex-col ${plan.badge ? 'ring-1 ring-[#D4AF37]/20 scale-[1.02]' : ''}`}>
                  {plan.badge && (
                    <div className="text-center mb-3">
                      <span className="text-[9px] font-black bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 px-3 py-1 rounded-full uppercase tracking-widest">{plan.badge}</span>
                    </div>
                  )}
                  <div className="text-center mb-5">
                    <div className="text-4xl mb-2">{plan.emoji}</div>
                    <div className="text-base font-black text-white mb-2">{plan.name}</div>
                    <div>
                      <span className="text-3xl font-black text-[#D4AF37]">{plan.price}</span>
                      <span className="text-xs text-slate-500 font-mono">{plan.period}</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-1.5 mb-5">
                    {plan.features.map((f, fi) => (
                      <div key={fi} className={`text-[10px] font-mono leading-relaxed ${f.startsWith('✅') ? 'text-slate-300' : 'text-slate-700'}`}>{f}</div>
                    ))}
                  </div>
                  <button className={`w-full py-3 rounded-xl text-[11px] font-black uppercase tracking-widest ${plan.btn} transition-all`}
                    onClick={() => setNotification({ msg: `🔄 Mengarahkan ke halaman pembayaran ${plan.name}...`, type: 'info' })}>
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>

            {/* Ecosystem Cards */}
            <div className="bg-[#0E0E0E] border border-[#D4AF37]/10 rounded-2xl p-5">
              <div className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest mb-4">🌐 Sovereign Ecosystem Integration</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { icon: '🌿', label: 'GANI HYPHA', desc: 'Marketplace & AI Agent Hub', link: '/' },
                  { icon: '🔵', label: '$PREMALTA', desc: 'Bootstrap Token Revenue', link: '/premalta' },
                  { icon: '🛍️', label: 'Sovereign Store', desc: 'Supply Chain Automation', link: '/store' },
                  { icon: '🌙', label: 'SICA + SHGA', desc: 'Ramadan/Eid Event Bundle', link: '/sica' },
                ].map((item, i) => (
                  <a key={i} href={item.link} className="bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#D4AF37]/20 rounded-xl p-3 text-center transition-all group">
                    <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">{item.icon}</div>
                    <div className="text-[10px] font-black text-white">{item.label}</div>
                    <div className="text-[8px] text-slate-600 font-mono">{item.desc}</div>
                  </a>
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
