
// ============================================================
// 🌙 SOVEREIGN IFTAR & CATERING AGENT (SICA) v1.0
// AI-Powered Catering Management for Ramadan & Beyond
// Revenue Engine: Rp 299K - 2.499M / bulan
// Part of GANI HYPHA Sovereign Agent Ecosystem
// ============================================================

import React, { useState, useEffect } from 'react';

interface Order {
  id: string;
  customer: string;
  phone: string;
  event_type: string;
  pax: number;
  menu_package: string;
  delivery_date: string;
  delivery_address: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cooking' | 'delivered' | 'cancelled';
  notes?: string;
  created_at: string;
}

interface MenuPackage {
  id: string;
  name: string;
  description: string;
  price_per_pax: number;
  min_pax: number;
  items: string[];
  category: 'iftar' | 'sahur' | 'event' | 'hamper';
  is_bestseller?: boolean;
  is_seasonal?: boolean;
}

interface AIRecommendation {
  menu_suggestions: Array<{ name: string; reason: string; predicted_demand: string }>;
  pricing_tips: string[];
  operational_tips: string[];
  marketing_message: string;
}

const MOCK_MENUS: MenuPackage[] = [
  {
    id: 'm1',
    name: 'Paket Iftar Hemat',
    description: 'Nasi + Lauk 2 item + Sayur + Es Buah + Kurma',
    price_per_pax: 35000,
    min_pax: 20,
    items: ['Nasi Putih', 'Ayam Bakar', 'Tempe Orek', 'Sayur Asem', 'Es Buah', 'Kurma (3 biji)'],
    category: 'iftar',
    is_bestseller: true,
  },
  {
    id: 'm2',
    name: 'Paket Iftar Premium',
    description: 'Nasi + Lauk 3 item + 2 Sayur + Dessert + Minuman',
    price_per_pax: 65000,
    min_pax: 30,
    items: ['Nasi Uduk', 'Rendang Sapi', 'Ayam Goreng', 'Cumi Balado', 'Lalapan', 'Es Teler', 'Kurma + Kolak'],
    category: 'iftar',
    is_seasonal: true,
  },
  {
    id: 'm3',
    name: 'Paket Bukber Corporate',
    description: 'Menu lengkap untuk acara Buka Bersama kantor',
    price_per_pax: 95000,
    min_pax: 50,
    items: ['Nasi Box Premium', 'Sate Ayam 5 tusuk', 'Rendang', 'Sup Ayam', 'Kerupuk', 'Es Kopyor', 'Gorengan', 'Kurma Premium'],
    category: 'event',
    is_bestseller: true,
  },
  {
    id: 'm4',
    name: 'Paket Sahur Sehat',
    description: 'Menu bergizi untuk sahur dengan protein tinggi',
    price_per_pax: 28000,
    min_pax: 15,
    items: ['Nasi Merah', 'Telur Dadar', 'Tempe Goreng', 'Sayur Bayam', 'Buah Pisang', 'Susu'],
    category: 'sahur',
  },
  {
    id: 'm5',
    name: 'Hamper Lebaran Basic',
    description: 'Hamper kemasan cantik isi 8 produk pilihan',
    price_per_pax: 150000,
    min_pax: 5,
    items: ['Kurma Medjool', 'Kue Nastar', 'Kue Putri Salju', 'Sirup Marjan', 'Biskuit Premium', 'Kacang Mede', 'Minyak Goreng 1L', 'Gula Pasir 1kg'],
    category: 'hamper',
    is_seasonal: true,
  },
];

const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-001',
    customer: 'PT. Maju Bersama',
    phone: '08123456789',
    event_type: 'Bukber Corporate',
    pax: 120,
    menu_package: 'Paket Bukber Corporate',
    delivery_date: '2026-03-15',
    delivery_address: 'Jl. Sudirman No. 45, Jakarta Selatan',
    total_price: 11400000,
    status: 'confirmed',
    notes: 'Mohon sediakan area makan yang cukup',
    created_at: '2026-03-10T08:00:00Z',
  },
  {
    id: 'ord-002',
    customer: 'Keluarga Budi Santoso',
    phone: '08234567890',
    event_type: 'Bukber Keluarga',
    pax: 45,
    menu_package: 'Paket Iftar Premium',
    delivery_date: '2026-03-18',
    delivery_address: 'Jl. Melati No. 12, Depok',
    total_price: 2925000,
    status: 'cooking',
    created_at: '2026-03-12T14:00:00Z',
  },
  {
    id: 'ord-003',
    customer: 'Masjid Al-Ikhlas',
    phone: '08345678901',
    event_type: 'Iftar Masjid',
    pax: 200,
    menu_package: 'Paket Iftar Hemat',
    delivery_date: '2026-03-20',
    delivery_address: 'Jl. Raya Bogor KM 25',
    total_price: 7000000,
    status: 'pending',
    created_at: '2026-03-14T10:00:00Z',
  },
];

const statusConfig = {
  pending: { label: 'Menunggu', color: 'text-amber-400 bg-amber-900/20 border-amber-500/30' },
  confirmed: { label: 'Dikonfirmasi', color: 'text-blue-400 bg-blue-900/20 border-blue-500/30' },
  cooking: { label: 'Dimasak', color: 'text-orange-400 bg-orange-900/20 border-orange-500/30' },
  delivered: { label: 'Terkirim', color: 'text-emerald-400 bg-emerald-900/20 border-emerald-500/30' },
  cancelled: { label: 'Dibatalkan', color: 'text-red-400 bg-red-900/20 border-red-500/30' },
};

// ============================================================
// Payment Modal Component (Duitku)
// ============================================================
interface PaymentModalProps {
  plan: { id: string; name: string; price: string; amount: number };
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ plan, onClose }) => {
  const [step, setStep] = useState<'form' | 'processing' | 'result'>('form');
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState('');

  const handlePay = async () => {
    if (!form.name || !form.email) { setError('Nama & email wajib diisi!'); return; }
    setError('');
    setStep('processing');
    try {
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan_id: plan.id, customer_name: form.name, customer_email: form.email, customer_phone: form.phone, payment_method: 'VC' })
      });
      const data = await res.json() as Record<string, unknown>;
      setResult(data);
      setStep('result');
    } catch {
      setError('Gagal membuat order. Coba lagi.');
      setStep('form');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md">
        <div className="p-5 border-b border-slate-700 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-white text-lg">💳 Berlangganan SICA</h3>
            <p className="text-emerald-400 text-sm font-semibold">{plan.name} — {plan.price}/bulan</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl">×</button>
        </div>
        <div className="p-5">
          {step === 'form' && (
            <div className="space-y-4">
              <p className="text-slate-400 text-sm">Isi data untuk memulai berlangganan. Pembayaran aman via <span className="text-emerald-400 font-semibold">Duitku</span> (QRIS, VA, GoPay, OVO, dll).</p>
              {error && <div className="text-red-400 text-sm bg-red-900/20 border border-red-500/30 rounded-lg p-3">{error}</div>}
              <input className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500"
                placeholder="Nama Lengkap *" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
              <input className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500"
                placeholder="Email *" type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
              <input className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500"
                placeholder="No. HP (WhatsApp)" type="tel" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} />
              <div className="bg-slate-800/50 rounded-xl p-3 text-sm text-slate-400 flex justify-between">
                <span>Total pembayaran</span>
                <span className="text-white font-bold">Rp {plan.amount.toLocaleString('id-ID')}</span>
              </div>
              <button onClick={handlePay} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition">
                💳 Bayar Sekarang — Rp {plan.amount.toLocaleString('id-ID')}
              </button>
              <p className="text-center text-slate-500 text-xs">🔒 Pembayaran aman via Duitku · QRIS · Virtual Account · GoPay · OVO</p>
            </div>
          )}
          {step === 'processing' && (
            <div className="text-center py-8">
              <div className="animate-spin text-4xl mb-4">⚙️</div>
              <p className="text-white font-bold">Memproses pembayaran...</p>
              <p className="text-slate-400 text-sm mt-2">Sedang membuat order di Duitku</p>
            </div>
          )}
          {step === 'result' && result && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-5xl mb-3">{(result as Record<string, unknown>).payment_url ? '🎉' : '📋'}</div>
                <h4 className="text-white font-bold text-lg">{(result as Record<string, unknown>).payment_url ? 'Order Berhasil Dibuat!' : 'Order Diterima!'}</h4>
                <p className="text-slate-400 text-sm mt-1">Order ID: <span className="text-emerald-400 font-mono text-xs">{result.order_id as string}</span></p>
              </div>
              {(result as Record<string, unknown>).payment_url ? (
                <a href={result.payment_url as string} target="_blank" rel="noopener noreferrer"
                   className="block w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-center transition">
                  💳 Lanjut ke Halaman Pembayaran
                </a>
              ) : (
                <div className="bg-slate-800 rounded-xl p-4 space-y-2">
                  <p className="text-emerald-400 font-bold text-sm">📋 Instruksi Pembayaran Manual:</p>
                  {(result.payment_instructions as string[] || []).map((instr: string, i: number) => (
                    <p key={i} className="text-slate-300 text-sm">• {instr}</p>
                  ))}
                </div>
              )}
              <button onClick={onClose} className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-xl text-sm transition">
                Tutup
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SICA: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'menu' | 'ai' | 'pricing'>('dashboard');
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [menus] = useState<MenuPackage[]>(MOCK_MENUS);
  const [aiRec, setAiRec] = useState<AIRecommendation | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [daysToLebaran, setDaysToLebaran] = useState(32);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [paymentModal, setPaymentModal] = useState<{ id: string; name: string; price: string; amount: number } | null>(null);

  // New order form state
  const [newOrder, setNewOrder] = useState({
    customer: '',
    phone: '',
    event_type: '',
    pax: 50,
    menu_package: '',
    delivery_date: '',
    delivery_address: '',
    notes: '',
  });

  useEffect(() => {
    fetch('/api/shga/lebaran/countdown')
      .then(r => r.json())
      .then((d: any) => d.days_remaining && setDaysToLebaran(d.days_remaining))
      .catch(() => {});
  }, []);

  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total_price, 0);

  const totalPax = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.pax, 0);

  const getAIRecommendation = async () => {
    setIsLoadingAI(true);
    setAiRec(null);
    try {
      const res = await fetch('/api/sica/ai/menu-recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: 'Buka Bersama Ramadan',
          pax: 100,
          budget_per_pax: 65000,
          preferences: 'Halal, beragam, dessert tersedia',
          context: `Ramadan 2026, H-${daysToLebaran} menuju Lebaran`,
        }),
      });
      const data = await res.json() as any;
      if (data.recommendations || data.menu_suggestions) {
        setAiRec({
          menu_suggestions: data.menu_suggestions || data.recommendations?.slice(0, 3).map((r: string) => ({
            name: r.split(':')[0] || r,
            reason: r.split(':')[1] || 'Populer di musim Ramadan',
            predicted_demand: 'Tinggi',
          })),
          pricing_tips: data.pricing_tips || ['Tawarkan early bird discount 10%', 'Bundle paket sahur + iftar'],
          operational_tips: data.operational_tips || ['Siapkan bahan baku 2 hari sebelum acara', 'Konfirmasi jumlah pax H-3'],
          marketing_message: data.marketing_message || `🌙 Ramadan Special! Paket Iftar terlezat untuk ${daysToLebaran} hari menuju Lebaran`,
        });
      } else {
        // Fallback response
        setAiRec({
          menu_suggestions: [
            { name: 'Nasi Box Rendang Special', reason: 'Rendang selalu jadi favorit untuk acara besar', predicted_demand: 'Sangat Tinggi' },
            { name: 'Paket Sate Kambing Muda', reason: 'Premium tapi worth it untuk corporate event', predicted_demand: 'Tinggi' },
            { name: 'Paket Ikan Bakar Bumbu Bali', reason: 'Tren menu seafood meningkat Ramadan ini', predicted_demand: 'Sedang-Tinggi' },
          ],
          pricing_tips: ['Early bird -15% untuk order H-7+', 'Free delivery untuk order 100+ pax', 'Bundle Sahur+Iftar hemat 20%'],
          operational_tips: ['Order bahan baku H-3 untuk freshness', 'Konfirmasi pax final H-1 jam 12.00', 'Sediakan 5% ekstra porsi sebagai buffer'],
          marketing_message: `🌙 Ramadan Berkah! Pesan sekarang & dapatkan harga spesial. H-${daysToLebaran} menuju Lebaran!`,
        });
      }
    } catch {
      setAiRec({
        menu_suggestions: [
          { name: 'Nasi Box Rendang Special', reason: 'Menu klasik yang selalu diminati', predicted_demand: 'Sangat Tinggi' },
          { name: 'Paket Iftar Premium All-in', reason: 'Value for money terbaik', predicted_demand: 'Tinggi' },
        ],
        pricing_tips: ['Tawarkan early bird -10%', 'Bundle paket menarik'],
        operational_tips: ['Konfirmasi pax H-3', 'Stok bahan H-2'],
        marketing_message: `🌙 Ramadan Special! H-${daysToLebaran} menuju Lebaran — Pesan Sekarang!`,
      });
    } finally {
      setIsLoadingAI(false);
    }
  };

  const submitOrder = () => {
    if (!newOrder.customer || !newOrder.menu_package || !newOrder.delivery_date) return;
    const selectedMenu = menus.find(m => m.id === newOrder.menu_package);
    const price = selectedMenu ? selectedMenu.price_per_pax * newOrder.pax : 0;
    const order: Order = {
      id: `ord-${Date.now()}`,
      ...newOrder,
      total_price: price,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    setOrders(prev => [order, ...prev]);
    setShowOrderForm(false);
    setNewOrder({ customer: '', phone: '', event_type: '', pax: 50, menu_package: '', delivery_date: '', delivery_address: '', notes: '' });
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(o => o.status === selectedStatus);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border-b border-slate-800 px-4 md:px-6 py-5">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-xl">
              🌙
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-white">Sovereign Iftar & Catering Agent</h1>
              <p className="text-xs text-emerald-300 font-mono">SICA v1.0 · GANI HYPHA · Powered by Groq AI</p>
            </div>
            <div className="ml-auto flex gap-2">
              <span className="text-xs font-mono text-amber-400 bg-amber-900/20 border border-amber-500/30 rounded-lg px-2 py-1">
                🌙 H-{daysToLebaran} Lebaran
              </span>
              <span className="hidden md:inline text-xs font-mono text-emerald-400 bg-emerald-900/20 border border-emerald-500/30 rounded-lg px-2 py-1">
                ✅ Peak Season Active
              </span>
            </div>
          </div>
          <p className="text-slate-400 text-sm mt-1 hidden md:block">
            Kelola order katering Ramadan Anda dengan AI — dari booking hingga delivery, otomatis & sovereign.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-800 bg-slate-900/50 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
            {[
              { id: 'dashboard', icon: '📊', label: 'Dashboard' },
              { id: 'orders', icon: '📋', label: 'Orders' },
              { id: 'menu', icon: '🍽️', label: 'Menu' },
              { id: 'ai', icon: '🤖', label: 'AI Advisor' },
              { id: 'pricing', icon: '💰', label: 'Pricing' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
        {/* === DASHBOARD TAB === */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Revenue', value: `Rp ${(totalRevenue / 1000000).toFixed(1)}M`, icon: '💰', color: 'text-emerald-400', sub: 'Ramadan 2026' },
                { label: 'Total Orders', value: orders.filter(o => o.status !== 'cancelled').length, icon: '📋', color: 'text-blue-400', sub: 'Active orders' },
                { label: 'Total Pax', value: `${totalPax.toLocaleString()}`, icon: '👥', color: 'text-purple-400', sub: 'Porsi dipesan' },
                { label: 'Hari ke-Lebaran', value: `H-${daysToLebaran}`, icon: '🌙', color: 'text-amber-400', sub: '30 Maret 2026' },
              ].map((stat, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-xs">{stat.label}</span>
                    <span className="text-lg">{stat.icon}</span>
                  </div>
                  <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                  <div className="text-slate-500 text-xs mt-1">{stat.sub}</div>
                </div>
              ))}
            </div>

            {/* Order Status Summary */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Object.entries(statusConfig).map(([key, cfg]) => (
                <div key={key} className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
                  <div className={`text-lg font-black ${cfg.color.split(' ')[0]}`}>
                    {orders.filter(o => o.status === key).length}
                  </div>
                  <div className="text-slate-400 text-xs mt-1">{cfg.label}</div>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white">Order Terbaru</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-emerald-400 text-sm hover:text-emerald-300"
                >
                  Lihat Semua →
                </button>
              </div>
              <div className="space-y-3">
                {orders.slice(0, 3).map(order => (
                  <div key={order.id} className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white text-sm truncate">{order.customer}</div>
                      <div className="text-slate-400 text-xs">{order.pax} pax · {order.menu_package} · {order.delivery_date}</div>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${statusConfig[order.status].color}`}>
                        {statusConfig[order.status].label}
                      </span>
                      <span className="text-emerald-400 text-xs font-mono hidden md:block">
                        Rp {(order.total_price / 1000).toFixed(0)}K
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick AI Tip */}
            <div className="bg-gradient-to-r from-emerald-900/20 to-teal-900/20 border border-emerald-500/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🤖</span>
                <div className="flex-1">
                  <div className="font-bold text-emerald-400 mb-1">AI Insight Hari Ini</div>
                  <p className="text-slate-300 text-sm">
                    H-{daysToLebaran} menuju Lebaran — Ini adalah <strong>peak season Ramadan!</strong> Segera tambahkan kapasitas produksi 
                    dan promosikan paket early bird. Demand diprediksi naik <strong>40-60%</strong> dalam 2 minggu ke depan.
                  </p>
                  <button
                    onClick={() => { setActiveTab('ai'); getAIRecommendation(); }}
                    className="mt-2 text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded-lg transition"
                  >
                    🤖 Dapatkan Rekomendasi Lengkap
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* === ORDERS TAB === */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <h2 className="text-xl font-bold text-white flex-1">Manajemen Order</h2>
              <div className="flex gap-2 flex-wrap">
                {/* Status Filter */}
                <select
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-1.5"
                >
                  <option value="all">Semua Status</option>
                  {Object.entries(statusConfig).map(([key, cfg]) => (
                    <option key={key} value={key}>{cfg.label}</option>
                  ))}
                </select>
                <button
                  onClick={() => setShowOrderForm(true)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm px-4 py-1.5 rounded-lg font-medium transition flex items-center gap-1"
                >
                  <span>+</span> Order Baru
                </button>
              </div>
            </div>

            {/* Order Form Modal */}
            {showOrderForm && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">📋 Order Baru</h3>
                    <button onClick={() => setShowOrderForm(false)} className="text-slate-400 hover:text-white">✕</button>
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-400 mb-1 block">Nama Customer *</label>
                        <input
                          value={newOrder.customer}
                          onChange={e => setNewOrder(p => ({ ...p, customer: e.target.value }))}
                          placeholder="PT. Maju Jaya..."
                          className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 placeholder-slate-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 mb-1 block">No. HP *</label>
                        <input
                          value={newOrder.phone}
                          onChange={e => setNewOrder(p => ({ ...p, phone: e.target.value }))}
                          placeholder="0812..."
                          className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 placeholder-slate-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-400 mb-1 block">Jenis Event</label>
                        <input
                          value={newOrder.event_type}
                          onChange={e => setNewOrder(p => ({ ...p, event_type: e.target.value }))}
                          placeholder="Bukber, Wedding..."
                          className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 placeholder-slate-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 mb-1 block">Jumlah Pax *</label>
                        <input
                          type="number"
                          value={newOrder.pax}
                          onChange={e => setNewOrder(p => ({ ...p, pax: Number(e.target.value) }))}
                          className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Pilih Menu *</label>
                      <select
                        value={newOrder.menu_package}
                        onChange={e => setNewOrder(p => ({ ...p, menu_package: e.target.value }))}
                        className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2"
                      >
                        <option value="">-- Pilih Paket Menu --</option>
                        {menus.map(m => (
                          <option key={m.id} value={m.id}>
                            {m.name} — Rp {m.price_per_pax.toLocaleString()}/pax (min {m.min_pax} pax)
                          </option>
                        ))}
                      </select>
                    </div>
                    {newOrder.menu_package && (
                      <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-3 text-sm">
                        <span className="text-emerald-400 font-mono">
                          💰 Estimasi: Rp {((menus.find(m => m.id === newOrder.menu_package)?.price_per_pax || 0) * newOrder.pax).toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Tanggal Delivery *</label>
                      <input
                        type="date"
                        value={newOrder.delivery_date}
                        onChange={e => setNewOrder(p => ({ ...p, delivery_date: e.target.value }))}
                        className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Alamat Delivery</label>
                      <input
                        value={newOrder.delivery_address}
                        onChange={e => setNewOrder(p => ({ ...p, delivery_address: e.target.value }))}
                        placeholder="Jl. Merpati No. 15..."
                        className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 placeholder-slate-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Catatan</label>
                      <textarea
                        value={newOrder.notes}
                        onChange={e => setNewOrder(p => ({ ...p, notes: e.target.value }))}
                        placeholder="Pantang tertentu, request khusus..."
                        rows={2}
                        className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 placeholder-slate-500 resize-none"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => setShowOrderForm(false)}
                        className="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-sm py-2 rounded-lg transition"
                      >
                        Batal
                      </button>
                      <button
                        onClick={submitOrder}
                        disabled={!newOrder.customer || !newOrder.menu_package || !newOrder.delivery_date}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm py-2 rounded-lg font-bold transition"
                      >
                        ✅ Simpan Order
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Orders List */}
            <div className="space-y-3">
              {filteredOrders.length === 0 && (
                <div className="text-center text-slate-500 py-10">
                  Belum ada order dengan status ini.
                </div>
              )}
              {filteredOrders.map(order => (
                <div key={order.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <div className="flex flex-col md:flex-row md:items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white">{order.customer}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${statusConfig[order.status].color}`}>
                          {statusConfig[order.status].label}
                        </span>
                      </div>
                      <div className="text-slate-400 text-sm space-y-0.5">
                        <div>📅 {order.delivery_date} · 👥 {order.pax} pax · 🍽️ {order.menu_package}</div>
                        <div>📍 {order.delivery_address || 'Alamat belum diisi'}</div>
                        {order.notes && <div>📝 {order.notes}</div>}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 min-w-[120px]">
                      <div className="text-emerald-400 font-mono font-bold">
                        Rp {(order.total_price / 1000000).toFixed(2)}M
                      </div>
                      <select
                        value={order.status}
                        onChange={e => updateOrderStatus(order.id, e.target.value as Order['status'])}
                        className="bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-2 py-1"
                      >
                        {Object.entries(statusConfig).map(([key, cfg]) => (
                          <option key={key} value={key}>{cfg.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === MENU TAB === */}
        {activeTab === 'menu' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">📋 Katalog Menu</h2>
              <span className="text-slate-400 text-sm">{menus.length} paket tersedia</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {menus.map(menu => (
                <div key={menu.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-emerald-500/30 transition">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{menu.name}</span>
                        {menu.is_bestseller && (
                          <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded-full">🔥 Bestseller</span>
                        )}
                        {menu.is_seasonal && (
                          <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded-full">🌙 Seasonal</span>
                        )}
                      </div>
                      <div className="text-slate-400 text-sm mt-0.5">{menu.description}</div>
                    </div>
                    <div className="text-right ml-2">
                      <div className="text-emerald-400 font-mono font-bold">
                        Rp {menu.price_per_pax.toLocaleString()}
                      </div>
                      <div className="text-slate-500 text-xs">per pax</div>
                    </div>
                  </div>
                  <div className="text-slate-500 text-xs mb-3">Min. {menu.min_pax} pax</div>
                  <div className="flex flex-wrap gap-1.5">
                    {menu.items.map((item, i) => (
                      <span key={i} className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                        {item}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => { setActiveTab('orders'); setShowOrderForm(true); setNewOrder(p => ({ ...p, menu_package: menu.id })); }}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs py-1.5 rounded-lg font-medium transition"
                    >
                      + Order Sekarang
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === AI ADVISOR TAB === */}
        {activeTab === 'ai' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">🤖 AI Menu Advisor</h2>
                <p className="text-slate-400 text-sm">Powered by Groq llama-3.3-70b</p>
              </div>
              <button
                onClick={getAIRecommendation}
                disabled={isLoadingAI}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white px-4 py-2 rounded-xl font-bold text-sm transition flex items-center gap-2"
              >
                {isLoadingAI ? (
                  <><span className="animate-spin">⏳</span> Menganalisis...</>
                ) : (
                  <><span>✨</span> Generate Rekomendasi</>
                )}
              </button>
            </div>

            {/* Context Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <h3 className="font-semibold text-slate-300 mb-3">📊 Konteks Saat Ini</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Musim', value: 'Ramadan 2026', icon: '🌙' },
                  { label: 'Hari ke-Lebaran', value: `H-${daysToLebaran}`, icon: '📅' },
                  { label: 'Total Order', value: orders.length, icon: '📋' },
                  { label: 'Revenue', value: `Rp ${(totalRevenue / 1000000).toFixed(1)}M`, icon: '💰' },
                ].map((item, i) => (
                  <div key={i} className="bg-slate-800/50 rounded-lg p-3">
                    <div className="text-lg mb-1">{item.icon}</div>
                    <div className="text-white font-bold text-sm">{item.value}</div>
                    <div className="text-slate-500 text-xs">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Results */}
            {!aiRec && !isLoadingAI && (
              <div className="text-center py-12 text-slate-500">
                <div className="text-4xl mb-3">🤖</div>
                <p>Klik "Generate Rekomendasi" untuk mendapatkan saran AI berdasarkan kondisi bisnis Anda saat ini.</p>
              </div>
            )}

            {isLoadingAI && (
              <div className="text-center py-12">
                <div className="text-4xl mb-3 animate-bounce">🤖</div>
                <p className="text-emerald-400">Groq AI sedang menganalisis data bisnis Anda...</p>
                <div className="flex justify-center mt-3 gap-1">
                  {[0, 1, 2].map(i => (
                    <div key={i} className={`w-2 h-2 bg-emerald-500 rounded-full animate-bounce`} style={{ animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
              </div>
            )}

            {aiRec && (
              <div className="space-y-4">
                {/* Marketing Message */}
                <div className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-500/40 rounded-xl p-4">
                  <div className="text-xs text-emerald-400 font-mono mb-2">📣 PESAN MARKETING AI</div>
                  <p className="text-white font-medium text-lg">{aiRec.marketing_message}</p>
                </div>

                {/* Menu Suggestions */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <h3 className="font-bold text-white mb-3">🍽️ Rekomendasi Menu</h3>
                  <div className="space-y-3">
                    {aiRec.menu_suggestions.map((sug, i) => (
                      <div key={i} className="flex items-start gap-3 bg-slate-800/50 rounded-lg p-3">
                        <span className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <div className="flex-1">
                          <div className="font-semibold text-white">{sug.name}</div>
                          <div className="text-slate-400 text-sm mt-0.5">{sug.reason}</div>
                          <div className="mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${
                              sug.predicted_demand === 'Sangat Tinggi' ? 'text-red-400 bg-red-900/20 border-red-500/30' :
                              sug.predicted_demand === 'Tinggi' ? 'text-orange-400 bg-orange-900/20 border-orange-500/30' :
                              'text-amber-400 bg-amber-900/20 border-amber-500/30'
                            }`}>
                              📈 Demand: {sug.predicted_demand}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tips Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <h3 className="font-bold text-blue-400 mb-3">💰 Tips Pricing</h3>
                    <ul className="space-y-2">
                      {aiRec.pricing_tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                          <span className="text-blue-400 mt-0.5">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <h3 className="font-bold text-amber-400 mb-3">⚙️ Tips Operasional</h3>
                    <ul className="space-y-2">
                      {aiRec.operational_tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                          <span className="text-amber-400 mt-0.5">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* === PRICING TAB === */}
        {activeTab === 'pricing' && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-white">💰 Paket SICA</h2>
              <p className="text-slate-400 text-sm">Pilih paket yang sesuai dengan skala bisnis katering Anda</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  id: 'sica-starter',
                  name: 'STARTER',
                  price: 'Rp 99K',
                  amount: 99000,
                  period: '/bulan',
                  color: 'border-slate-600',
                  badge: '',
                  features: [
                    '✅ AI Order Management (50 orders/bln)',
                    '✅ Menu Builder digital',
                    '✅ Template WhatsApp order',
                    '✅ Basic invoice generator',
                    '✅ Stock alert sederhana',
                    '📊 1 user, 1 outlet',
                  ],
                  limit: 'Max 50 orders/bulan',
                  cta: 'Mulai Gratis 7 Hari',
                  ctaType: 'pay',
                },
                {
                  id: 'sica-pro',
                  name: 'PROFESIONAL',
                  price: 'Rp 299K',
                  amount: 299000,
                  period: '/bulan',
                  color: 'border-emerald-500',
                  badge: '🔥 Paling Populer',
                  features: [
                    '✅ Semua fitur Starter +',
                    '✅ AI Menu Recommendation',
                    '✅ Multi-outlet (up to 3)',
                    '✅ Customer database + repeat order',
                    '✅ Revenue analytics dashboard',
                    '✅ Driver tracking basic',
                    '📊 3 user, 3 outlet, 1000 orders/bln',
                  ],
                  limit: 'Max 1.000 orders/bulan',
                  cta: 'Mulai Sekarang',
                  ctaType: 'pay',
                },
                {
                  id: 'sica-enterprise',
                  name: 'ENTERPRISE',
                  price: 'Rp 799K',
                  amount: 799000,
                  period: '/bulan',
                  color: 'border-purple-500',
                  badge: '💎 For Large Scale',
                  features: [
                    '✅ Semua fitur Pro +',
                    '✅ AI Demand Forecasting',
                    '✅ Auto procurement (PO ke supplier)',
                    '✅ Multi-kitchen coordination',
                    '✅ Staff management + shift AI',
                    '✅ Full API access',
                    '✅ Custom white-label + branding',
                    '📊 Unlimited semua',
                  ],
                  limit: 'Unlimited + Dedicated Support',
                  cta: 'Hubungi Sales',
                  ctaType: 'contact',
                },
              ].map((plan, i) => (
                <div key={i} className={`bg-slate-900 border-2 ${plan.color} rounded-xl p-5 relative`}>
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap font-medium">
                      {plan.badge}
                    </div>
                  )}
                  <div className="mb-4">
                    <div className="font-black text-white text-lg">{plan.name}</div>
                    <div className="flex items-end gap-1 mt-1">
                      <span className="text-3xl font-black text-emerald-400">{plan.price}</span>
                      <span className="text-slate-400 text-sm mb-1">{plan.period}</span>
                    </div>
                    <div className="text-slate-500 text-xs mt-1">{plan.limit}</div>
                  </div>
                  <ul className="space-y-2 mb-5">
                    {plan.features.map((f, fi) => (
                      <li key={fi} className="text-sm text-slate-300">{f}</li>
                    ))}
                  </ul>
                  {plan.ctaType === 'pay' ? (
                    <button
                      onClick={() => setPaymentModal({ id: plan.id, name: `SICA ${plan.name}`, price: plan.price, amount: plan.amount })}
                      className={`w-full py-2 rounded-xl font-bold text-sm transition ${
                        i === 1 ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'
                      }`}>
                      💳 {plan.cta}
                    </button>
                  ) : (
                    <a href="https://wa.me/6281234567890?text=Halo, saya tertarik dengan SICA Enterprise"
                       target="_blank" rel="noopener noreferrer"
                       className="block w-full py-2 rounded-xl font-bold text-sm bg-purple-800 hover:bg-purple-700 text-white text-center transition">
                      📱 Hubungi Sales
                    </a>
                  )}
                </div>
              ))}
            </div>

            {/* Payment Badge */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex items-center gap-3">
              <div className="text-3xl">🔒</div>
              <div>
                <p className="text-white font-bold text-sm">Pembayaran Aman via Duitku</p>
                <p className="text-slate-400 text-xs">QRIS · BCA · BNI · BRI · Mandiri · GoPay · OVO · ShopeePay · Dana · Kartu Kredit</p>
              </div>
            </div>

            {/* Revenue Projection */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <h3 className="font-bold text-white mb-3">📈 Proyeksi Revenue SICA</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { period: 'Month 1', value: 'Rp 3,1Jt', detail: '5 Starter + 2 Pro', color: 'text-slate-400' },
                  { period: 'Month 3', value: 'Rp 16Jt', detail: '15S + 8P + 2E', color: 'text-blue-400' },
                  { period: 'Month 6', value: 'Rp 41Jt', detail: '40S + 20P + 5E', color: 'text-emerald-400' },
                  { period: 'Month 12', value: 'Rp 107Jt', detail: '100S + 50P + 15E', color: 'text-purple-400' },
                ].map((proj, i) => (
                  <div key={i} className="bg-slate-800/50 rounded-lg p-3 text-center">
                    <div className="text-slate-500 text-xs mb-1">{proj.period}</div>
                    <div className={`text-xl font-black ${proj.color}`}>{proj.value}</div>
                    <div className="text-slate-500 text-xs mt-1">{proj.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      {paymentModal && <PaymentModal plan={paymentModal} onClose={() => setPaymentModal(null)} />}
    </div>
  );
};

export default SICA;
