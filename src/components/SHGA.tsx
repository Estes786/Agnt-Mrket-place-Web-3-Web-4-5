
// ============================================================
// 🎁 SOVEREIGN HAMPER & GIFT AGENT (SHGA) v1.0
// AI-Powered Hamper & Gift Management for Lebaran & Beyond
// Revenue Engine: Rp 299K - 2.499M / bulan
// Part of GANI HYPHA Sovereign Agent Ecosystem
// ============================================================

import React, { useState, useEffect } from 'react';

interface HamperProduct {
  id: string;
  name: string;
  description: string;
  base_price: number;
  category: 'basic' | 'premium' | 'corporate' | 'custom';
  items: string[];
  image_emoji: string;
  is_bestseller?: boolean;
  is_seasonal?: boolean;
  stock: number;
  sold: number;
  min_order: number;
}

interface HamperOrder {
  id: string;
  customer: string;
  phone: string;
  product_id: string;
  product_name: string;
  quantity: number;
  recipient_name: string;
  delivery_address: string;
  delivery_date: string;
  customization?: string;
  total_price: number;
  status: 'pending' | 'packing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'unpaid' | 'dp_paid' | 'paid';
  created_at: string;
}

interface AIHamperRec {
  trending_items: Array<{ name: string; reason: string; margin: string }>;
  pricing_strategy: string[];
  packaging_tips: string[];
  marketing_copy: string;
  sales_forecast: string;
}

const HAMPER_PRODUCTS: HamperProduct[] = [
  {
    id: 'h1',
    name: 'Hamper Lebaran Basic',
    description: 'Hamper kemasan eksklusif, cocok untuk keluarga dan sahabat',
    base_price: 175000,
    category: 'basic',
    items: ['Kurma Medjool 250gr', 'Kue Nastar Keju 250gr', 'Kue Putri Salju 250gr', 'Sirup Marjan Melon', 'Biskuit Roma 2 pack', 'Kacang Mede Goreng 200gr'],
    image_emoji: '🧺',
    is_bestseller: true,
    is_seasonal: true,
    stock: 150,
    sold: 47,
    min_order: 5,
  },
  {
    id: 'h2',
    name: 'Hamper Premium Lebaran',
    description: 'Pilihan premium dengan produk impor dan kemasan mewah',
    base_price: 450000,
    category: 'premium',
    items: ['Kurma Ajwa Saudi 500gr', 'Coklat Godiva Assorted', 'Kue Kering Premium Set', 'Madu Murni 300ml', 'Teh Premium 2 kotak', 'Minyak Zaitun Extra Virgin', 'Hand Cream Set', 'Parfum Mini'],
    image_emoji: '🎁',
    is_seasonal: true,
    stock: 80,
    sold: 32,
    min_order: 3,
  },
  {
    id: 'h3',
    name: 'Hamper Corporate 100+',
    description: 'Solusi hamper untuk kebutuhan korporat dengan logo custom',
    base_price: 250000,
    category: 'corporate',
    items: ['Kurma Premium 200gr', 'Sembako lengkap', 'Kue Kering 3 jenis', 'Sirup Premium', 'Custom Branding Box', 'Kartu ucapan custom', 'Pita & aksesoris'],
    image_emoji: '🏢',
    is_bestseller: true,
    stock: 500,
    sold: 189,
    min_order: 50,
  },
  {
    id: 'h4',
    name: 'Hamper Sembako Berkah',
    description: 'Hamper sembako berkualitas untuk berbagi kepada yang membutuhkan',
    base_price: 120000,
    category: 'basic',
    items: ['Beras Premium 2kg', 'Minyak Goreng 1L', 'Gula Pasir 1kg', 'Teh Celup 1 kotak', 'Mi Instan 5 bungkus', 'Sabun Mandi 3 pcs', 'Kecap Manis 600ml'],
    image_emoji: '🌾',
    is_seasonal: true,
    stock: 300,
    sold: 120,
    min_order: 10,
  },
  {
    id: 'h5',
    name: 'Hamper Custom Premium',
    description: 'Buat hamper sesuai keinginan Anda, item pilihan, kemasan custom',
    base_price: 350000,
    category: 'custom',
    items: ['Item pilihan sendiri', 'Kemasan box mewah custom', 'Pita & dekorasi eksklusif', 'Kartu ucapan personal', 'Gift wrapping premium'],
    image_emoji: '✨',
    stock: 999,
    sold: 28,
    min_order: 1,
  },
  {
    id: 'h6',
    name: 'Hamper Wellness Set',
    description: 'Hamper kesehatan dan kecantikan, cocok untuk semua usia',
    base_price: 380000,
    category: 'premium',
    items: ['Madu Hutan Murni 250ml', 'Teh Herbal Premium Set', 'Vitamin C 1000mg', 'Masker Wajah Premium 5pcs', 'Sabun Herbal', 'Essential Oil Mini', 'Buku catatan cantik'],
    image_emoji: '🌿',
    stock: 60,
    sold: 18,
    min_order: 2,
  },
];

const MOCK_HAMPER_ORDERS: HamperOrder[] = [
  {
    id: 'hord-001',
    customer: 'PT. Bank Nusantara',
    phone: '08123456789',
    product_id: 'h3',
    product_name: 'Hamper Corporate 100+',
    quantity: 250,
    recipient_name: 'Seluruh Karyawan',
    delivery_address: 'Jl. Gatot Subroto No. 1, Jakarta',
    delivery_date: '2026-03-25',
    customization: 'Logo Bank Nusantara di box, kartu ucapan custom',
    total_price: 62500000,
    status: 'packing',
    payment_status: 'dp_paid',
    created_at: '2026-03-05T10:00:00Z',
  },
  {
    id: 'hord-002',
    customer: 'Ibu Sari Dewi',
    phone: '08234567890',
    product_id: 'h2',
    product_name: 'Hamper Premium Lebaran',
    quantity: 15,
    recipient_name: 'Keluarga & Kolega',
    delivery_address: 'Jl. Kemang Raya No. 88, Jakarta Selatan',
    delivery_date: '2026-03-28',
    total_price: 6750000,
    status: 'pending',
    payment_status: 'paid',
    created_at: '2026-03-10T14:00:00Z',
  },
  {
    id: 'hord-003',
    customer: 'CV. Berkah Mandiri',
    phone: '08345678901',
    product_id: 'h4',
    product_name: 'Hamper Sembako Berkah',
    quantity: 80,
    recipient_name: 'Karyawan & Mitra',
    delivery_address: 'Jl. Raya Ciputat No. 25, Tangerang',
    delivery_date: '2026-03-22',
    total_price: 9600000,
    status: 'shipped',
    payment_status: 'paid',
    created_at: '2026-03-08T09:00:00Z',
  },
];

const orderStatusConfig = {
  pending: { label: 'Menunggu', color: 'text-amber-400 bg-amber-900/20 border-amber-500/30' },
  packing: { label: 'Packing', color: 'text-blue-400 bg-blue-900/20 border-blue-500/30' },
  shipped: { label: 'Dikirim', color: 'text-purple-400 bg-purple-900/20 border-purple-500/30' },
  delivered: { label: 'Terkirim', color: 'text-emerald-400 bg-emerald-900/20 border-emerald-500/30' },
  cancelled: { label: 'Dibatalkan', color: 'text-red-400 bg-red-900/20 border-red-500/30' },
};

const paymentStatusConfig = {
  unpaid: { label: 'Belum Bayar', color: 'text-red-400' },
  dp_paid: { label: 'DP Lunas', color: 'text-amber-400' },
  paid: { label: '✅ Lunas', color: 'text-emerald-400' },
};

const SHGA: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'catalog' | 'orders' | 'ai' | 'pricing'>('dashboard');
  const [orders, setOrders] = useState<HamperOrder[]>(MOCK_HAMPER_ORDERS);
  const [aiRec, setAiRec] = useState<AIHamperRec | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [daysToLebaran, setDaysToLebaran] = useState(32);
  const [filterStatus, setFilterStatus] = useState('all');

  const [newOrder, setNewOrder] = useState({
    customer: '', phone: '', product_id: '', quantity: 10,
    recipient_name: '', delivery_address: '', delivery_date: '', customization: '',
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

  const totalItems = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.quantity, 0);

  const getAIRecommendation = async () => {
    setIsLoadingAI(true);
    setAiRec(null);
    try {
      const res = await fetch('/api/shga/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          season: 'Ramadan/Lebaran 2026',
          days_to_lebaran: daysToLebaran,
          current_inventory: HAMPER_PRODUCTS.map(p => ({ name: p.name, stock: p.stock, sold: p.sold })),
          budget_range: '150K - 500K',
        }),
      });
      const data = await res.json() as any;
      if (data.recommendations || data.trending_items) {
        setAiRec({
          trending_items: data.trending_items || data.recommendations?.slice(0, 3).map((r: string) => ({
            name: r, reason: 'Tren musim Lebaran', margin: '35-45%',
          })),
          pricing_strategy: data.pricing_strategy || ['Bundle 3 hamper dapat diskon 15%'],
          packaging_tips: data.packaging_tips || ['Gunakan box premium dengan handle tali'],
          marketing_copy: data.marketing_copy || `🎁 Hamper Lebaran Terbaik! H-${daysToLebaran} — Pesan Sekarang!`,
          sales_forecast: data.sales_forecast || 'Demand diprediksi naik 200-300% di H-14 Lebaran',
        });
      } else {
        // Fallback
        setAiRec({
          trending_items: [
            { name: 'Hamper Kurma + Kue Kering Premium', reason: 'Kombinasi klasik yang selalu laku keras', margin: '40-50%' },
            { name: 'Hamper Sembako + Kebutuhan Pokok', reason: 'Nilai sosial tinggi, banyak dibeli oleh korporat', margin: '25-35%' },
            { name: 'Hamper Wellness & Kecantikan', reason: 'Tren baru: hamper self-care untuk Lebaran', margin: '45-55%' },
          ],
          pricing_strategy: [
            `Early bird H-${daysToLebaran}: diskon 15% untuk order 20+ pcs`,
            'Corporate package: free ongkir untuk order 50+ pcs',
            'Flash sale 24 jam: diskon 20% untuk stock tertentu',
          ],
          packaging_tips: [
            'Gunakan box kraft premium dengan handle tali suede',
            'Tambahkan kartu ucapan personal dengan nama penerima',
            'Sediakan opsi gift wrap tambahan (+Rp 15K)',
          ],
          marketing_copy: `🎁 Hamper Lebaran Premium! Hanya H-${daysToLebaran} lagi! Order sekarang & dapatkan early bird -15%. Pengiriman ke seluruh Indonesia! ✨`,
          sales_forecast: `Demand diprediksi naik 250-350% di H-14 Lebaran. Segera siapkan stok! Target: 500+ hamper terjual sebelum Lebaran.`,
        });
      }
    } catch {
      setAiRec({
        trending_items: [
          { name: 'Hamper Premium Bundle', reason: 'Terlaris di Ramadan', margin: '40%' },
        ],
        pricing_strategy: ['Early bird discount untuk order awal'],
        packaging_tips: ['Box premium dengan branding custom'],
        marketing_copy: `🎁 H-${daysToLebaran} Lebaran — Pesan Hamper Terbaik Sekarang!`,
        sales_forecast: 'Demand tinggi menjelang Lebaran',
      });
    } finally {
      setIsLoadingAI(false);
    }
  };

  const submitOrder = () => {
    if (!newOrder.customer || !newOrder.product_id) return;
    const product = HAMPER_PRODUCTS.find(p => p.id === newOrder.product_id);
    const price = product ? product.base_price * newOrder.quantity : 0;
    const order: HamperOrder = {
      id: `hord-${Date.now()}`,
      ...newOrder,
      product_name: product?.name || '',
      total_price: price,
      status: 'pending',
      payment_status: 'unpaid',
      created_at: new Date().toISOString(),
    };
    setOrders(prev => [order, ...prev]);
    setShowOrderForm(false);
    setNewOrder({ customer: '', phone: '', product_id: '', quantity: 10, recipient_name: '', delivery_address: '', delivery_date: '', customization: '' });
  };

  const updateStatus = (id: string, status: HamperOrder['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const filteredOrders = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900/40 to-orange-900/40 border-b border-slate-800 px-4 md:px-6 py-5">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-xl">
              🎁
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-white">Sovereign Hamper & Gift Agent</h1>
              <p className="text-xs text-amber-300 font-mono">SHGA v1.0 · GANI HYPHA · AI-Powered Gifting</p>
            </div>
            <div className="ml-auto flex gap-2">
              <span className="text-xs font-mono text-amber-400 bg-amber-900/20 border border-amber-500/30 rounded-lg px-2 py-1">
                🎁 H-{daysToLebaran} Lebaran
              </span>
              <span className="hidden md:inline text-xs font-mono text-orange-400 bg-orange-900/20 border border-orange-500/30 rounded-lg px-2 py-1">
                🔥 Peak Season
              </span>
            </div>
          </div>
          <p className="text-slate-400 text-sm mt-1 hidden md:block">
            Kelola bisnis hamper & gift Anda dengan AI — dari katalog, order, hingga delivery tracking, semua sovereign.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-800 bg-slate-900/50 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
            {[
              { id: 'dashboard', icon: '📊', label: 'Dashboard' },
              { id: 'catalog', icon: '🧺', label: 'Katalog' },
              { id: 'orders', icon: '📋', label: 'Orders' },
              { id: 'ai', icon: '🤖', label: 'AI Advisor' },
              { id: 'pricing', icon: '💰', label: 'Pricing' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-amber-600 text-white'
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
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Revenue', value: `Rp ${(totalRevenue / 1000000).toFixed(0)}M`, icon: '💰', color: 'text-amber-400' },
                { label: 'Total Orders', value: orders.filter(o => o.status !== 'cancelled').length, icon: '📋', color: 'text-blue-400' },
                { label: 'Total Hamper', value: totalItems.toLocaleString(), icon: '🎁', color: 'text-purple-400' },
                { label: 'H-Lebaran', value: `H-${daysToLebaran}`, icon: '🌙', color: 'text-orange-400' },
              ].map((stat, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-xs">{stat.label}</span>
                    <span className="text-lg">{stat.icon}</span>
                  </div>
                  <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Bestsellers */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <h3 className="font-bold text-white mb-3">🔥 Produk Terlaris</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {HAMPER_PRODUCTS.filter(p => p.is_bestseller || p.sold > 20).slice(0, 3).map(product => (
                  <div key={product.id} className="flex items-center gap-3 bg-slate-800/50 rounded-lg p-3">
                    <span className="text-3xl">{product.image_emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white text-sm truncate">{product.name}</div>
                      <div className="text-amber-400 text-xs">Rp {product.base_price.toLocaleString()}</div>
                      <div className="w-full bg-slate-700 rounded-full h-1.5 mt-1">
                        <div
                          className="bg-amber-500 h-1.5 rounded-full"
                          style={{ width: `${Math.min(100, (product.sold / product.stock) * 100)}%` }}
                        />
                      </div>
                      <div className="text-slate-500 text-xs mt-0.5">{product.sold}/{product.stock} terjual</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-white">Order Terbaru</h3>
                <button onClick={() => setActiveTab('orders')} className="text-amber-400 text-sm">Lihat Semua →</button>
              </div>
              <div className="space-y-2">
                {orders.slice(0, 3).map(order => (
                  <div key={order.id} className="flex items-center gap-3 bg-slate-800/50 rounded-lg p-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white text-sm truncate">{order.customer}</div>
                      <div className="text-slate-400 text-xs">{order.quantity} pcs · {order.product_name} · {order.delivery_date}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${orderStatusConfig[order.status].color}`}>
                        {orderStatusConfig[order.status].label}
                      </span>
                      <span className="text-amber-400 font-mono text-xs hidden md:block">
                        Rp {(order.total_price / 1000000).toFixed(1)}M
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Alert */}
            <div className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 border border-amber-500/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🤖</span>
                <div>
                  <div className="font-bold text-amber-400 mb-1">AI Market Alert</div>
                  <p className="text-slate-300 text-sm">
                    H-{daysToLebaran} menuju Lebaran — <strong>Ini waktunya agresif!</strong> 
                    Data historis menunjukkan demand hamper naik <strong>250-350%</strong> di 2 minggu terakhir. 
                    Tambah stok sekarang sebelum kehabisan!
                  </p>
                  <button
                    onClick={() => { setActiveTab('ai'); getAIRecommendation(); }}
                    className="mt-2 text-xs bg-amber-600 hover:bg-amber-500 text-white px-3 py-1 rounded-lg"
                  >
                    🤖 Lihat Strategi AI Lengkap
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* === CATALOG TAB === */}
        {activeTab === 'catalog' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">🧺 Katalog Hamper</h2>
              <span className="text-slate-400 text-sm">{HAMPER_PRODUCTS.length} produk</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {HAMPER_PRODUCTS.map(product => (
                <div key={product.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-amber-500/30 transition">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-4xl">{product.image_emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-white text-sm">{product.name}</span>
                        {product.is_bestseller && (
                          <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded-full">🔥</span>
                        )}
                        {product.is_seasonal && (
                          <span className="text-xs bg-orange-500/20 text-orange-400 border border-orange-500/30 px-1.5 py-0.5 rounded-full">🌙</span>
                        )}
                      </div>
                      <div className="text-slate-400 text-xs mt-0.5">{product.description}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {product.items.slice(0, 4).map((item, i) => (
                      <span key={i} className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">{item}</span>
                    ))}
                    {product.items.length > 4 && (
                      <span className="text-xs bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full">+{product.items.length - 4} lagi</span>
                    )}
                  </div>
                  {/* Stock bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Stok</span>
                      <span>{product.stock - product.sold} tersisa / {product.sold} terjual</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5">
                      <div
                        className="bg-amber-500 h-1.5 rounded-full"
                        style={{ width: `${Math.min(100, (product.sold / product.stock) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-amber-400 font-mono font-bold">Rp {product.base_price.toLocaleString()}</div>
                      <div className="text-slate-500 text-xs">Min. order {product.min_order} pcs</div>
                    </div>
                    <button
                      onClick={() => {
                        setNewOrder(p => ({ ...p, product_id: product.id }));
                        setActiveTab('orders');
                        setShowOrderForm(true);
                      }}
                      className="bg-amber-600 hover:bg-amber-500 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition"
                    >
                      + Order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === ORDERS TAB === */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <h2 className="text-xl font-bold text-white flex-1">📋 Manajemen Order</h2>
              <div className="flex gap-2 flex-wrap">
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-1.5"
                >
                  <option value="all">Semua Status</option>
                  {Object.entries(orderStatusConfig).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
                <button
                  onClick={() => setShowOrderForm(true)}
                  className="bg-amber-600 hover:bg-amber-500 text-white text-sm px-4 py-1.5 rounded-lg font-medium transition"
                >
                  + Order Baru
                </button>
              </div>
            </div>

            {/* Order Form Modal */}
            {showOrderForm && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">🎁 Order Hamper Baru</h3>
                    <button onClick={() => setShowOrderForm(false)} className="text-slate-400 hover:text-white text-xl">✕</button>
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-400 mb-1 block">Customer *</label>
                        <input value={newOrder.customer} onChange={e => setNewOrder(p => ({ ...p, customer: e.target.value }))}
                          placeholder="Nama / Perusahaan" className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2" />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 mb-1 block">No. HP *</label>
                        <input value={newOrder.phone} onChange={e => setNewOrder(p => ({ ...p, phone: e.target.value }))}
                          placeholder="0812..." className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Pilih Produk *</label>
                      <select value={newOrder.product_id} onChange={e => setNewOrder(p => ({ ...p, product_id: e.target.value }))}
                        className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2">
                        <option value="">-- Pilih Hamper --</option>
                        {HAMPER_PRODUCTS.map(p => (
                          <option key={p.id} value={p.id}>{p.image_emoji} {p.name} — Rp {p.base_price.toLocaleString()}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-400 mb-1 block">Qty (pcs) *</label>
                        <input type="number" value={newOrder.quantity} onChange={e => setNewOrder(p => ({ ...p, quantity: Number(e.target.value) }))}
                          className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2" />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 mb-1 block">Tanggal Kirim *</label>
                        <input type="date" value={newOrder.delivery_date} onChange={e => setNewOrder(p => ({ ...p, delivery_date: e.target.value }))}
                          className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2" />
                      </div>
                    </div>
                    {newOrder.product_id && (
                      <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-3 text-sm">
                        <span className="text-amber-400 font-mono">
                          💰 Total: Rp {((HAMPER_PRODUCTS.find(p => p.id === newOrder.product_id)?.base_price || 0) * newOrder.quantity).toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Alamat Pengiriman</label>
                      <input value={newOrder.delivery_address} onChange={e => setNewOrder(p => ({ ...p, delivery_address: e.target.value }))}
                        placeholder="Jl. ..." className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Nama Penerima</label>
                      <input value={newOrder.recipient_name} onChange={e => setNewOrder(p => ({ ...p, recipient_name: e.target.value }))}
                        placeholder="Nama penerima hamper..." className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Custom Branding / Catatan</label>
                      <textarea value={newOrder.customization} onChange={e => setNewOrder(p => ({ ...p, customization: e.target.value }))}
                        placeholder="Logo custom, kartu ucapan, warna box..." rows={2}
                        className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 resize-none" />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button onClick={() => setShowOrderForm(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-sm py-2 rounded-lg">Batal</button>
                      <button onClick={submitOrder} disabled={!newOrder.customer || !newOrder.product_id}
                        className="flex-1 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-sm py-2 rounded-lg font-bold">
                        ✅ Simpan Order
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Orders List */}
            <div className="space-y-3">
              {filteredOrders.map(order => (
                <div key={order.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <div className="flex flex-col md:flex-row md:items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-bold text-white">{order.customer}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${orderStatusConfig[order.status].color}`}>
                          {orderStatusConfig[order.status].label}
                        </span>
                        <span className={`text-xs font-medium ${paymentStatusConfig[order.payment_status].color}`}>
                          {paymentStatusConfig[order.payment_status].label}
                        </span>
                      </div>
                      <div className="text-slate-400 text-sm space-y-0.5">
                        <div>🎁 {order.quantity} pcs {order.product_name}</div>
                        <div>📅 Kirim: {order.delivery_date} · 📍 {order.delivery_address || '-'}</div>
                        {order.customization && <div>✏️ Custom: {order.customization}</div>}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 min-w-[130px]">
                      <div className="text-amber-400 font-mono font-bold">
                        Rp {(order.total_price / 1000000).toFixed(2)}M
                      </div>
                      <select value={order.status} onChange={e => updateStatus(order.id, e.target.value as HamperOrder['status'])}
                        className="bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-2 py-1">
                        {Object.entries(orderStatusConfig).map(([k, v]) => (
                          <option key={k} value={k}>{v.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              {filteredOrders.length === 0 && (
                <div className="text-center text-slate-500 py-10">Belum ada order.</div>
              )}
            </div>
          </div>
        )}

        {/* === AI ADVISOR TAB === */}
        {activeTab === 'ai' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">🤖 AI Hamper Advisor</h2>
                <p className="text-slate-400 text-sm">Strategi penjualan hamper bertenaga Groq AI</p>
              </div>
              <button onClick={getAIRecommendation} disabled={isLoadingAI}
                className="bg-amber-600 hover:bg-amber-500 disabled:opacity-60 text-white px-4 py-2 rounded-xl font-bold text-sm transition flex items-center gap-2">
                {isLoadingAI ? <><span className="animate-spin">⏳</span> Menganalisis...</> : <><span>✨</span> Analisis Pasar</>}
              </button>
            </div>

            {!aiRec && !isLoadingAI && (
              <div className="text-center py-12 text-slate-500">
                <div className="text-4xl mb-3">🤖</div>
                <p>Klik "Analisis Pasar" untuk mendapatkan strategi AI untuk bisnis hamper Anda.</p>
              </div>
            )}
            {isLoadingAI && (
              <div className="text-center py-12">
                <div className="text-4xl mb-3 animate-bounce">🤖</div>
                <p className="text-amber-400">AI sedang menganalisis tren pasar hamper...</p>
              </div>
            )}
            {aiRec && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-500/40 rounded-xl p-4">
                  <div className="text-xs text-amber-400 font-mono mb-2">📣 CAMPAIGN MARKETING</div>
                  <p className="text-white font-medium text-lg">{aiRec.marketing_copy}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <h3 className="font-bold text-white mb-3">📈 Prediksi Pasar</h3>
                  <p className="text-amber-300 text-sm">{aiRec.sales_forecast}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <h3 className="font-bold text-white mb-3">🔥 Tren Item Terkini</h3>
                  <div className="space-y-3">
                    {aiRec.trending_items.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 bg-slate-800/50 rounded-lg p-3">
                        <span className="w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{i+1}</span>
                        <div className="flex-1">
                          <div className="font-semibold text-white text-sm">{item.name}</div>
                          <div className="text-slate-400 text-xs mt-0.5">{item.reason}</div>
                          <div className="mt-1">
                            <span className="text-xs text-emerald-400 bg-emerald-900/20 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                              💰 Margin: {item.margin}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <h3 className="font-bold text-blue-400 mb-3">💰 Strategi Pricing</h3>
                    <ul className="space-y-2">
                      {aiRec.pricing_strategy.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                          <span className="text-blue-400">•</span>{tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <h3 className="font-bold text-purple-400 mb-3">📦 Tips Packaging</h3>
                    <ul className="space-y-2">
                      {aiRec.packaging_tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                          <span className="text-purple-400">•</span>{tip}
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
              <h2 className="text-xl font-bold text-white">💰 Paket SHGA</h2>
              <p className="text-slate-400 text-sm">Platform manajemen hamper & gifting sovereign untuk bisnis Anda</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  name: 'STARTER', price: 'Rp 299K', period: '/bulan',
                  color: 'border-slate-600', badge: '',
                  features: ['✅ Katalog produk digital (20 item)', '✅ Order management basic', '✅ Invoice generator', '✅ WhatsApp notification template', '✅ Stock tracking sederhana', '📊 1 user, 50 orders/bulan'],
                  cta: 'Mulai Gratis 7 Hari',
                },
                {
                  name: 'BISNIS', price: 'Rp 799K', period: '/bulan',
                  color: 'border-amber-500', badge: '🔥 Best Value',
                  features: ['✅ Semua Starter +', '✅ AI Recommendation Engine', '✅ Custom branding & packaging', '✅ Customer CRM + repeat order', '✅ Revenue analytics', '✅ Multi-outlet (3)', '📊 3 user, 500 orders/bulan'],
                  cta: 'Mulai Sekarang',
                },
                {
                  name: 'ENTERPRISE', price: 'Rp 2,499K', period: '/bulan',
                  color: 'border-purple-500', badge: '💎 Korporat',
                  features: ['✅ Semua Bisnis +', '✅ AI Demand Forecasting', '✅ Bulk order automation', '✅ Supplier management', '✅ Custom white-label', '✅ API access penuh', '📊 Unlimited semua'],
                  cta: 'Hubungi Sales',
                },
              ].map((plan, i) => (
                <div key={i} className={`bg-slate-900 border-2 ${plan.color} rounded-xl p-5 relative`}>
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap font-medium">
                      {plan.badge}
                    </div>
                  )}
                  <div className="mb-4">
                    <div className="font-black text-white text-lg">{plan.name}</div>
                    <div className="flex items-end gap-1 mt-1">
                      <span className="text-3xl font-black text-amber-400">{plan.price}</span>
                      <span className="text-slate-400 text-sm mb-1">{plan.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-5">
                    {plan.features.map((f, fi) => (<li key={fi} className="text-sm text-slate-300">{f}</li>))}
                  </ul>
                  <button className={`w-full py-2 rounded-xl font-bold text-sm transition ${
                    i === 1 ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'
                  }`}>{plan.cta}</button>
                </div>
              ))}
            </div>

            {/* Revenue Projection */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <h3 className="font-bold text-white mb-3">📈 Proyeksi Revenue SHGA (Market: Rp 12 Triliun/tahun)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { period: 'Month 1', value: 'Rp 3Jt', detail: '5S + 2B', color: 'text-slate-400' },
                  { period: 'Month 3', value: 'Rp 18Jt', detail: '12S + 8B + 3E', color: 'text-blue-400' },
                  { period: 'Month 6', value: 'Rp 45Jt', detail: '30S + 20B + 8E', color: 'text-amber-400' },
                  { period: 'Month 12', value: 'Rp 120Jt', detail: '70S + 45B + 20E', color: 'text-purple-400' },
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
    </div>
  );
};

export default SHGA;
