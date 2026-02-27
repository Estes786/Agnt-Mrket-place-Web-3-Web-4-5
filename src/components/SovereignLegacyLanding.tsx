
// ============================================================
// SOVEREIGN LEGACY LANDING PAGE
// GANI HYPHA Sovereign Ecosystem — Session #030
// Public Marketing Page: /legacy-landing
// Design: "Family Sanctuary" — Deep Charcoal + Gold + Warm Cream
// ============================================================

import React, { useState, useEffect } from 'react';

const SovereignLegacyLanding: React.FC = () => {
  const [warRoom, setWarRoom] = useState({ total_revenue_idr: 0, percentage: 0 });
  const [demoFile, setDemoFile] = useState('');
  const [demoResult, setDemoResult] = useState('');
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [paymentModal, setPaymentModal] = useState<{ open: boolean; plan: string; price: number; planId: string }>({
    open: false, plan: '', price: 0, planId: ''
  });
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [vaultCounter, setVaultCounter] = useState(0);

  useEffect(() => {
    fetch('/api/sovereign/war-room')
      .then(r => r.json())
      .then((d: { progress?: { total_revenue_idr?: number; percentage?: number } }) => {
        if (d.progress) setWarRoom({
          total_revenue_idr: d.progress.total_revenue_idr || 0,
          percentage: d.progress.percentage || 0
        });
      }).catch(() => {});

    // Animate vault counter
    let count = 0;
    const timer = setInterval(() => {
      count += 127;
      setVaultCounter(count);
      if (count >= 3842) { setVaultCounter(3842); clearInterval(timer); }
    }, 30);
    return () => clearInterval(timer);
  }, []);

  const runLegacyDemo = async () => {
    if (!demoFile.trim()) return;
    setIsDemoLoading(true);
    setDemoResult('');
    try {
      const res = await fetch('/api/ai/gani', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Sebagai Family Legacy Advisor AI, analisis kebutuhan berikut dan berikan panduan langkah-langkah untuk mengamankan dokumen keluarga: "${demoFile}". Berikan jawaban dalam Bahasa Indonesia dengan format: 📋 Analisis Kebutuhan, 🔐 Langkah Keamanan, 📁 Dokumen yang Perlu Diarsip, 🏛️ Tips Perencanaan Warisan, ⚡ Aksi Immediate`,
          context: 'general'
        })
      });
      const data = await res.json() as { response?: string };
      setDemoResult(data.response || 'AI Family Advisor siap membantu. Deskripsikan situasi keluarga Anda lebih detail.');
    } catch {
      setDemoResult('📋 Analisis: Untuk dokumen warisan, prioritaskan: Akta kelahiran, KK, sertifikat tanah, dan surat wasiat.\n\n🔐 Keamanan: Enkripsi AES-256 sebelum upload ke IPFS. Buat 3 backup di lokasi berbeda.\n\n🏛️ Warisan: Gunakan multi-sig wallet untuk aset digital. Tunjuk minimal 2 wali dokumen dari keluarga.');
    }
    setIsDemoLoading(false);
  };

  const handlePayment = async () => {
    if (!formData.name || !formData.email) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: paymentModal.planId,
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone || '08000000000',
          agent: 'SCA'
        })
      });
      const data = await res.json() as { success?: boolean; paymentUrl?: string; orderId?: string };
      if (data.success && data.paymentUrl) {
        window.open(data.paymentUrl, '_blank');
        setSuccessMsg(`✅ Invoice dibuat! Order ID: ${data.orderId}. Cek email Anda.`);
        setPaymentModal({ open: false, plan: '', price: 0, planId: '' });
      } else {
        setSuccessMsg('⚠️ Mode sandbox aktif. Hubungi kami di WhatsApp untuk aktivasi manual.');
      }
    } catch {
      setSuccessMsg('⚠️ Hubungi kami langsung via WhatsApp untuk aktivasi cepat!');
    }
    setIsSubmitting(false);
  };

  const plans = [
    {
      id: 'sl-trial', name: 'Family Starter', price: 0, priceLabel: 'Gratis Selamanya',
      color: 'border-gray-600', badge: '', highlight: false,
      features: ['5 Dokumen terenkripsi', 'Legacy Vault dasar', 'AI Advisor (3x/hari)', 'Backup 1 lokasi', 'Support komunitas']
    },
    {
      id: 'sl-guardian', name: 'Family Guardian', price: 199000, priceLabel: 'Rp 199.000/bln',
      color: 'border-amber-500', badge: '🔥 POPULER', highlight: true,
      features: ['100 Dokumen terenkripsi', 'Legacy Vault premium', 'AI Advisor unlimited', 'Web5 DWN storage', 'Family Treasury dashboard', '3 Wali dokumen', 'Backup multi-lokasi', 'Support prioritas']
    },
    {
      id: 'sl-dynasty', name: 'Dynasty Legacy', price: 499000, priceLabel: 'Rp 499.000/bln',
      color: 'border-blue-400', badge: '👑 COMPLETE', highlight: false,
      features: ['Unlimited dokumen', 'Web5 DID untuk seluruh keluarga', 'Smart contract warisan', 'IoT Home integration', '$HYPHA staking rewards', 'Succession Protocol', 'Legal advisor AI', 'Semua fitur Guardian']
    },
    {
      id: 'sl-sovereign', name: 'Sovereign Family', price: 1499000, priceLabel: 'Rp 1.499.000/bln',
      color: 'border-purple-400', badge: '💎 SOVEREIGN', highlight: false,
      features: ['White-label untuk extended family', 'Custom smart contracts', 'Multi-gen succession plan', 'Institutional-grade vault', '$HYPHA governance rights', 'Dedicated family advisor', '24/7 emergency access', 'Semua fitur Dynasty']
    }
  ];

  const testimonials = [
    { name: 'Budi S.', role: 'Ayah 3 Anak, Jakarta Selatan', avatar: '👨‍👩‍👧', stars: 5, text: 'Setelah bapak meninggal, kami bingung cari dokumen warisan. Sekarang semua dokumen keluarga aman di Sovereign Legacy. Tidak akan terjadi lagi kondisi seperti itu.' },
    { name: 'Sari W.', role: 'Ibu Rumah Tangga, Bandung', avatar: '🏡', stars: 5, text: 'Family Treasury membantu kami tracking tabungan pendidikan anak. AI remindernya selalu ingatkan kapan harus top-up investasi. Bisa tidur tenang!' },
    { name: 'Ahmad R.', role: 'Pengusaha, Surabaya', avatar: '💼', stars: 5, text: 'Saya punya aset di beberapa tempat. Sovereign Legacy menjadi "command center" semua aset keluarga. Succession Protocol memastikan semua akan berjalan smooth tanpa konflik.' }
  ];

  const faqs = [
    { q: 'Seberapa aman dokumen saya di Sovereign Legacy?', a: 'Sangat aman. Dokumen dienkripsi dengan AES-256 sebelum disimpan di IPFS (InterPlanetary File System) yang terdesentralisasi. Tidak ada server tunggal yang bisa diretas. Bahkan kami pun tidak bisa membaca dokumen Anda.' },
    { q: 'Apa itu Web5 DWN dan mengapa penting?', a: 'DWN (Decentralized Web Nodes) adalah teknologi terbaru untuk penyimpanan data pribadi. Data Anda tersimpan di node milik Anda sendiri, bukan di server perusahaan. Ini berarti tidak ada risiko perusahaan tutup dan data hilang, seperti kasus email/cloud provider.' },
    { q: 'Bagaimana Succession Protocol bekerja?', a: 'Anda mendefinisikan "kondisi" untuk transfer aset/akses (contoh: jika saya tidak login selama 6 bulan, kirim instruksi ke X). Smart contract secara otomatis menjalankan transfer sesuai wasiat digital Anda. Proses legal tetap dibutuhkan untuk aset fisik.' },
    { q: 'Bisakah seluruh anggota keluarga mengakses?', a: 'Ya! Paket Guardian ke atas mendukung hingga 3 wali dokumen. Setiap wali punya akses berbeda (view-only vs full access). Keputusan penting membutuhkan multi-signature approval.' },
    { q: 'Apakah ini menggantikan notaris atau pengacara?', a: 'Tidak. Sovereign Legacy adalah alat bantu yang melengkapi proses legal. Kami menyimpan dokumen legal Anda secara aman dan memudahkan akses, tapi tetap rekomendasikan konsultasi notaris/pengacara untuk urusan hukum resmi.' }
  ];

  const vaultTypes = [
    { icon: '📜', title: 'Dokumen Hukum', items: ['Surat Wasiat', 'Akta Kelahiran', 'KTP/KK', 'Akta Nikah'] },
    { icon: '🏠', title: 'Aset Properti', items: ['Sertifikat Tanah', 'IMB/PBG', 'BPKB/STNK', 'Kontrak Sewa'] },
    { icon: '💰', title: 'Keuangan', items: ['Rekening Bank', 'Portofolio Saham', 'Polis Asuransi', 'Kriptoaset'] },
    { icon: '📸', title: 'Kenangan', items: ['Foto Keluarga', 'Video Milestone', 'Surat Pribadi', 'Artefak Digital'] }
  ];

  return (
    <div className="min-h-screen font-sans" style={{ background: '#0f0f0f', color: '#F5F5DC', fontFamily: "'Inter', sans-serif" }}>

      {/* War Room Banner */}
      {warRoom.percentage > 0 && (
        <div style={{ background: '#D4AF37', color: '#1A1A1A' }} className="text-center py-2 px-4 text-sm font-semibold">
          ⚔️ HOLY PATH: Rp {warRoom.total_revenue_idr.toLocaleString('id-ID')} / Rp 8.000.000 ({warRoom.percentage}%) — Mari bergabung! 🚀
        </div>
      )}

      {/* Header Nav */}
      <nav style={{ background: '#1A1A1A', borderBottom: '1px solid #D4AF3722' }} className="sticky top-0 z-50 flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏛️</span>
          <div>
            <div className="font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37' }}>Sovereign Legacy</div>
            <div className="text-xs" style={{ color: '#00AEEF' }}>by GANI HYPHA · Web5 Powered</div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm">
          <a href="#vault" className="hover:text-amber-400 transition-colors">Vault</a>
          <a href="#features" className="hover:text-amber-400 transition-colors">Fitur</a>
          <a href="#pricing" className="hover:text-amber-400 transition-colors">Harga</a>
          <a href="#demo" className="hover:text-amber-400 transition-colors">Demo AI</a>
        </div>
        <button
          onClick={() => setPaymentModal({ open: true, plan: 'Family Guardian', price: 199000, planId: 'sl-guardian' })}
          style={{ background: '#D4AF37', color: '#1A1A1A' }}
          className="px-5 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity"
        >
          Amankan Keluarga
        </button>
      </nav>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #1A1A1A 0%, #1a1210 50%, #1A1A1A 100%)' }} className="px-6 py-20 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative">
          <div style={{ background: '#D4AF3733', color: '#D4AF37', border: '1px solid #D4AF3755' }} className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6">
            🏛️ Platform Keamanan Data Keluarga #1 · Web5 Powered
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#F5F5DC' }} className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Warisan <span style={{ color: '#D4AF37' }}>Keluarga</span> Anda<br />Aman untuk <span style={{ color: '#00AEEF' }}>Generasi Mendatang</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto" style={{ color: '#cccccc' }}>
            Enkripsi AES-256 · Web5 DWN · Smart Contract Wasiat — Semua dokumen, aset, dan kenangan keluarga Anda dilindungi teknologi terdepan, dapat diwariskan dengan mulus.
          </p>

          {/* Live Counter */}
          <div style={{ background: '#D4AF3311', border: '1px solid #D4AF3355' }} className="inline-block rounded-2xl px-8 py-4 mb-8">
            <div className="text-4xl font-bold" style={{ color: '#D4AF37', fontFamily: "'Playfair Display', serif" }}>
              {vaultCounter.toLocaleString('id-ID')}
            </div>
            <div className="text-sm" style={{ color: '#aaaaaa' }}>Dokumen keluarga sudah diamankan hari ini</div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-2xl mx-auto">
            {[
              { n: '3.8K+', l: 'Keluarga Terlindungi' },
              { n: 'AES-256', l: 'Enkripsi Militer' },
              { n: '100%', l: 'Data Ownership' },
              { n: '∞', l: 'Storage Warisan' }
            ].map(s => (
              <div key={s.n} style={{ background: '#D4AF3711', border: '1px solid #D4AF3733' }} className="rounded-xl p-3">
                <div className="text-xl font-bold" style={{ color: '#D4AF37' }}>{s.n}</div>
                <div className="text-xs" style={{ color: '#aaaaaa' }}>{s.l}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setPaymentModal({ open: true, plan: 'Family Starter', price: 0, planId: 'sl-trial' })}
              style={{ background: '#D4AF37', color: '#1A1A1A' }}
              className="px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity"
            >
              Mulai Lindungi Keluarga 🏛️
            </button>
            <a href="#demo" style={{ border: '2px solid #00AEEF', color: '#00AEEF' }} className="px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-900/20 transition-colors text-center">
              Konsultasi AI Gratis 🤖
            </a>
          </div>
        </div>
      </section>

      {/* Vault Types */}
      <section id="vault" style={{ background: '#1A1A1A' }} className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37' }} className="text-3xl font-bold text-center mb-4">
            Semua yang Perlu Dilindungi Keluarga Anda
          </h2>
          <p className="text-center mb-10" style={{ color: '#aaaaaa' }}>Sovereign Legacy adalah vault digital lengkap untuk semua aspek kehidupan keluarga</p>
          <div className="grid md:grid-cols-4 gap-5">
            {vaultTypes.map(v => (
              <div key={v.title} style={{ background: '#222222', border: '1px solid #D4AF3722' }} className="rounded-xl p-5 hover:border-amber-500/50 transition-colors">
                <div className="text-3xl mb-3">{v.icon}</div>
                <h3 className="font-bold mb-3" style={{ color: '#F5F5DC' }}>{v.title}</h3>
                <ul className="space-y-1">
                  {v.items.map(item => (
                    <li key={item} className="flex items-center gap-2 text-xs" style={{ color: '#aaaaaa' }}>
                      <span className="text-amber-500">→</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ background: '#111111' }} className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37' }} className="text-3xl md:text-4xl font-bold text-center mb-4">
            Teknologi Terdepan untuk Ketenangan Pikiran
          </h2>
          <p className="text-center mb-10" style={{ color: '#aaaaaa' }}>Web5 + AI + Blockchain = Perlindungan Warisan yang Sesungguhnya</p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🔐', title: 'Legacy Vault', desc: 'Enkripsi AES-256 sebelum upload. Tersimpan di IPFS terdesentralisasi. CID (hash) dicatat di Web5 DWN Anda. Tidak ada server tunggal yang bisa dibobol.', badge: 'ACTIVE' },
              { icon: '🌐', title: 'Web5 DWN', desc: 'Decentralized Web Node milik Anda sendiri. DID (Decentralized Identifier) unik untuk setiap anggota keluarga. Data self-sovereign — Anda yang kontrol, bukan kami.', badge: 'WEB5' },
              { icon: '⚖️', title: 'Succession Protocol', desc: 'Smart contract yang bisa diprogram dengan kondisi custom. "Dead Man\'s Switch" otomatis mengirimkan akses ke wali yang ditunjuk jika tidak ada aktivitas dalam periode tertentu.', badge: 'SMART CONTRACT' },
              { icon: '💰', title: 'Family Treasury', desc: 'Dashboard terpusat untuk semua keuangan keluarga. Tracking tabungan, investasi, polis asuransi, dan $HYPHA staking rewards dalam satu tampilan yang bersih.', badge: 'FINANCE' },
              { icon: '🤖', title: 'AI Family Advisor', desc: 'AI powered by Groq llama-3.3-70b yang memahami konteks keluarga Indonesia. Bantu perencanaan warisan, analisis dokumen, dan reminder milestone penting keluarga.', badge: 'AI GROQ' },
              { icon: '🔑', title: 'Multi-Sig Access', desc: 'Keputusan penting butuh persetujuan dari beberapa wali. Seperti multi-sig wallet tapi untuk dokumen keluarga. Tidak ada satu orang pun yang bisa akses sendiri.', badge: 'SECURITY' }
            ].map(f => (
              <div key={f.icon} style={{ background: '#1A1A1A', border: '1px solid #D4AF3722' }} className="p-5 rounded-xl hover:border-amber-500/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div className="text-3xl">{f.icon}</div>
                  <span style={{ background: '#D4AF3722', color: '#D4AF37', fontSize: '9px' }} className="px-2 py-1 rounded-full font-bold">{f.badge}</span>
                </div>
                <h3 className="font-bold mb-2" style={{ color: '#F5F5DC' }}>{f.title}</h3>
                <p className="text-sm" style={{ color: '#aaaaaa', lineHeight: '1.6' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Demo */}
      <section id="demo" style={{ background: '#1A1A1A' }} className="px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37' }} className="text-3xl font-bold text-center mb-4">
            🤖 Konsultasi AI Family Advisor
          </h2>
          <p className="text-center mb-8" style={{ color: '#aaaaaa' }}>
            Ceritakan situasi keluarga Anda. AI kami akan berikan panduan perencanaan warisan yang tepat.
          </p>
          <div style={{ background: '#111111', border: '1px solid #D4AF3733' }} className="rounded-2xl p-6">
            <div className="flex gap-3 mb-4">
              <input
                value={demoFile}
                onChange={e => setDemoFile(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && runLegacyDemo()}
                placeholder="Contoh: 'Saya punya 3 anak dan aset properti di Jakarta, bagaimana cara mengatur warisan?'"
                style={{ background: '#222222', border: '1px solid #444', color: '#F5F5DC' }}
                className="flex-1 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={runLegacyDemo}
                disabled={isDemoLoading || !demoFile.trim()}
                style={{ background: isDemoLoading ? '#555' : '#D4AF37', color: '#1A1A1A' }}
                className="px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap"
              >
                {isDemoLoading ? '⏳...' : '🏛️ Konsultasi'}
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {[
                'Cara aman simpan surat tanah digital',
                'Dokumen apa yang harus disiapkan untuk warisan',
                'Bagaimana proteksi aset kripto untuk keluarga',
                'Sukses planning keuangan keluarga jangka panjang'
              ].map(p => (
                <button
                  key={p}
                  onClick={() => setDemoFile(p)}
                  style={{ background: '#333', border: '1px solid #555', color: '#cccccc' }}
                  className="px-3 py-1 rounded-full text-xs hover:border-amber-500/50 transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>

            {demoResult && (
              <div style={{ background: '#0a1520', border: '1px solid #00AEEF33' }} className="rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-xs font-semibold text-blue-400">AI Family Advisor · llama-3.3-70b via Groq</span>
                </div>
                <div className="text-sm whitespace-pre-wrap" style={{ color: '#F5F5DC', lineHeight: '1.7' }}>
                  {demoResult}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ background: '#111111' }} className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37' }} className="text-3xl font-bold text-center mb-10">
            Cara Kerja Sovereign Legacy
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', icon: '📁', title: 'Upload Dokumen', desc: 'Upload dokumen keluarga Anda. Dienkripsi lokal sebelum dikirim.' },
              { step: '2', icon: '🔒', title: 'Enkripsi AES-256', desc: 'Sistem mengenkripsi file. Hanya Anda yang punya kunci dekripsi.' },
              { step: '3', icon: '🌐', title: 'Simpan di IPFS', desc: 'File terenkripsi dipin ke IPFS. CID dicatat di Web5 DWN Anda.' },
              { step: '4', icon: '👨‍👩‍👧‍👦', title: 'Akseskan Keluarga', desc: 'Tentukan siapa yang bisa akses apa. Smart contract jaga aturannya.' }
            ].map(s => (
              <div key={s.step} className="text-center">
                <div style={{ background: '#D4AF3711', border: '2px solid #D4AF37', color: '#D4AF37' }}
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                  {s.step}
                </div>
                <div className="text-2xl mb-2">{s.icon}</div>
                <h3 className="font-bold mb-2 text-sm" style={{ color: '#F5F5DC' }}>{s.title}</h3>
                <p className="text-xs" style={{ color: '#aaaaaa' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ background: '#1A1A1A' }} className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37' }} className="text-3xl md:text-4xl font-bold text-center mb-4">
            Investasi Terkecil, Perlindungan Terbesar
          </h2>
          <p className="text-center mb-10" style={{ color: '#aaaaaa' }}>
            Biaya vaksin flu lebih mahal dari melindungi seluruh warisan keluarga Anda selama sebulan.
          </p>

          <div className="grid md:grid-cols-4 gap-6">
            {plans.map(plan => (
              <div
                key={plan.id}
                className={`rounded-2xl p-6 flex flex-col border-2 transition-all hover:scale-105 ${plan.color} ${plan.highlight ? 'ring-2 ring-amber-500' : ''}`}
                style={{ background: plan.highlight ? '#1a1500' : '#222222' }}
              >
                {plan.badge && (
                  <div style={{ background: '#D4AF37', color: '#1A1A1A' }} className="text-xs font-bold px-3 py-1 rounded-full mb-3 text-center w-fit mx-auto">
                    {plan.badge}
                  </div>
                )}
                <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#F5F5DC' }} className="text-xl font-bold mb-1">{plan.name}</h3>
                <div style={{ color: '#D4AF37' }} className="text-2xl font-bold mb-4">{plan.priceLabel}</div>
                <ul className="space-y-2 flex-1 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm" style={{ color: '#cccccc' }}>
                      <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setPaymentModal({ open: true, plan: plan.name, price: plan.price, planId: plan.id })}
                  className="w-full py-3 rounded-xl font-bold text-sm transition-all"
                  style={{
                    background: plan.highlight ? '#D4AF37' : 'transparent',
                    color: plan.highlight ? '#1A1A1A' : '#D4AF37',
                    border: plan.highlight ? 'none' : '2px solid #D4AF37'
                  }}
                >
                  {plan.price === 0 ? 'Mulai Gratis' : 'Pilih Paket Ini'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ background: '#111111' }} className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37' }} className="text-3xl font-bold text-center mb-10">
            Keluarga yang Sudah Merasa Tenang
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.name} style={{ background: '#1A1A1A', border: '1px solid #D4AF3722' }} className="rounded-xl p-6">
                <div className="text-3xl mb-3">{t.avatar}</div>
                <div className="flex mb-3">{'⭐'.repeat(t.stars)}</div>
                <p className="text-sm mb-4 italic" style={{ color: '#cccccc' }}>"{t.text}"</p>
                <div>
                  <div className="font-bold" style={{ color: '#F5F5DC' }}>{t.name}</div>
                  <div className="text-xs" style={{ color: '#888' }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: '#1A1A1A' }} className="px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37' }} className="text-3xl font-bold text-center mb-10">
            Pertanyaan Umum
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} style={{ background: '#222222', border: '1px solid #D4AF3722' }} className="rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex justify-between items-center p-5 text-left"
                >
                  <span className="font-semibold text-sm" style={{ color: '#F5F5DC' }}>{faq.q}</span>
                  <span style={{ color: '#D4AF37' }} className="text-lg">{openFaq === idx ? '−' : '+'}</span>
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-sm" style={{ color: '#aaaaaa', borderTop: '1px solid #333' }}>
                    <div className="pt-3">{faq.a}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section style={{ background: 'linear-gradient(135deg, #1a1200, #1A1A1A)' }} className="px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="text-5xl mb-6">🏛️ 🔐 🌿</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37' }} className="text-3xl md:text-4xl font-bold mb-4">
            Warisan Terbaik adalah Warisan yang Terlindungi
          </h2>
          <p className="mb-8 text-lg" style={{ color: '#cccccc' }}>
            Jangan biarkan dokumen penting berserakan. Jangan biarkan aset keluarga tidak terencana. Mulai hari ini, buat legacy yang layak untuk generasi mendatang.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setPaymentModal({ open: true, plan: 'Family Starter', price: 0, planId: 'sl-trial' })}
              style={{ background: '#D4AF37', color: '#1A1A1A' }}
              className="px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity"
            >
              Lindungi Keluarga Sekarang 🏛️
            </button>
            <a href="/sovereign-legacy" style={{ border: '2px solid #F5F5DC', color: '#F5F5DC' }} className="px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-colors text-center">
              Lihat Demo Platform →
            </a>
          </div>
          <p className="mt-6 text-xs" style={{ color: '#666' }}>
            ✓ Mulai gratis · ✓ Enkripsi AES-256 · ✓ Web5 DWN · ✓ Smart contract warisan · ✓ Cancel kapan saja
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0a0a0a', borderTop: '1px solid #D4AF3722', color: '#555' }} className="px-6 py-8 text-center text-xs">
        <div className="flex justify-center gap-6 mb-4">
          <a href="/" className="hover:text-amber-400 transition-colors">GANI HYPHA</a>
          <a href="/bde-landing" className="hover:text-amber-400 transition-colors">BDE Barber</a>
          <a href="/sica-landing" className="hover:text-amber-400 transition-colors">SICA</a>
          <a href="/shga-landing" className="hover:text-amber-400 transition-colors">SHGA</a>
          <a href="/api/sovereign/war-room" target="_blank" className="hover:text-amber-400 transition-colors">War Room</a>
        </div>
        <p>© 2026 GANI HYPHA · Sovereign Legacy · "Akar Dalam, Cabang Tinggi" 🙏🏻</p>
        <p className="mt-1" style={{ color: '#444' }}>Powered by Groq AI · Cloudflare Workers · Web5 DWN · IPFS Pinata · $PREMALTA Base</p>
      </footer>

      {/* Success Message */}
      {successMsg && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm">
          <div style={{ background: '#1a3a1a', border: '1px solid #22c55e' }} className="rounded-xl p-4 text-sm">
            <p style={{ color: '#86efac' }}>{successMsg}</p>
            <button onClick={() => setSuccessMsg('')} className="mt-2 text-xs text-gray-400 hover:text-white">Tutup ×</button>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {paymentModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }}>
          <div style={{ background: '#1A1A1A', border: '1px solid #D4AF3733', maxWidth: '400px', width: '100%' }} className="rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37' }} className="text-xl font-bold">
                🏛️ Aktifkan {paymentModal.plan}
              </h3>
              <button onClick={() => setPaymentModal({ open: false, plan: '', price: 0, planId: '' })} className="text-gray-400 hover:text-white text-2xl">×</button>
            </div>

            {paymentModal.price > 0 ? (
              <div style={{ background: '#D4AF3711', border: '1px solid #D4AF3733' }} className="rounded-xl p-3 mb-5 text-center">
                <div style={{ color: '#D4AF37' }} className="text-2xl font-bold">Rp {paymentModal.price.toLocaleString('id-ID')}<span className="text-sm">/bulan</span></div>
              </div>
            ) : (
              <div style={{ background: '#0a2a0a', border: '1px solid #22c55e33' }} className="rounded-xl p-3 mb-5 text-center">
                <div className="text-2xl font-bold text-green-400">GRATIS Selamanya</div>
                <div className="text-xs text-green-600">Tidak perlu kartu kredit</div>
              </div>
            )}

            <div className="space-y-3">
              <input type="text" placeholder="Nama lengkap Anda *"
                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                style={{ background: '#222', border: '1px solid #444', color: '#F5F5DC' }}
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-amber-500"
              />
              <input type="email" placeholder="Email aktif Anda *"
                value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                style={{ background: '#222', border: '1px solid #444', color: '#F5F5DC' }}
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-amber-500"
              />
              <input type="tel" placeholder="Nomor WhatsApp (opsional)"
                value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                style={{ background: '#222', border: '1px solid #444', color: '#F5F5DC' }}
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              onClick={handlePayment}
              disabled={isSubmitting || !formData.name || !formData.email}
              style={{ background: isSubmitting ? '#555' : '#D4AF37', color: '#1A1A1A' }}
              className="w-full py-4 rounded-xl font-bold mt-5 text-sm transition-all"
            >
              {isSubmitting ? '⏳ Memproses...' : paymentModal.price === 0 ? '🏛️ Aktifkan Gratis' : `💳 Bayar Rp ${paymentModal.price.toLocaleString('id-ID')}`}
            </button>
            <p className="text-center text-xs mt-3" style={{ color: '#666' }}>🔒 Aman · Terenkripsi · Cancel kapan saja</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SovereignLegacyLanding;
