
// ============================================================
// 🏠 SOVEREIGN LEGACY (SL) v1.0 — "The Family Sanctuary"
// AI-Powered Family Legacy Vault, Home OS & Digital Succession
// Revenue Engine: Rp 299K - 1.999M / bulan
// Part of GANI HYPHA Sovereign Agent Ecosystem
// Design: "Modern Heritage" — Deep Charcoal + Antique Gold
// ============================================================

import React, { useState, useEffect, useRef } from 'react';

// ─── TYPES ────────────────────────────────────────────────
interface FamilyMember {
  id: string;
  name: string;
  role: 'Head' | 'Spouse' | 'Child' | 'Parent' | 'Guardian';
  avatar: string;
  did?: string;
  keyHolder: boolean;
  shardIndex?: number;
  hyphaBalance: number;
  lastSeen: string;
}

interface VaultDocument {
  id: string;
  name: string;
  category: 'will' | 'deed' | 'insurance' | 'identity' | 'investment' | 'medical' | 'sentimental';
  ipfsCid: string;
  uploadDate: string;
  size: string;
  isEncrypted: boolean;
  accessLevel: 'private' | 'family' | 'emergency';
  emoji: string;
  owner: string;
}

interface TreasuryAsset {
  id: string;
  name: string;
  type: 'savings' | 'investment' | 'crypto' | 'property' | 'hypha';
  value: number;
  currency: 'IDR' | 'USD' | 'ETH' | 'HYPHA';
  change24h: number;
  icon: string;
}

interface HomeTask {
  id: string;
  title: string;
  category: 'maintenance' | 'bill' | 'health' | 'education' | 'event';
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo: string;
  status: 'todo' | 'in-progress' | 'done';
  emoji: string;
  isAiGenerated?: boolean;
}

interface SuccessionRule {
  id: string;
  asset: string;
  beneficiary: string;
  percentage: number;
  condition: string;
  isActive: boolean;
}

interface AIMessage {
  role: 'user' | 'ai';
  msg: string;
}

// ─── MOCK DATA ─────────────────────────────────────────────
const FAMILY_MEMBERS: FamilyMember[] = [
  { id: 'f1', name: 'Ahmad Gani', role: 'Head', avatar: '👨‍💼', did: 'did:web5:0xA1B2C3...', keyHolder: true, shardIndex: 1, hyphaBalance: 5000, lastSeen: '2 menit lalu' },
  { id: 'f2', name: 'Siti Rahayu', role: 'Spouse', avatar: '👩‍💼', did: 'did:web5:0xD4E5F6...', keyHolder: true, shardIndex: 2, hyphaBalance: 3200, lastSeen: '1 jam lalu' },
  { id: 'f3', name: 'Raffi Gani', role: 'Child', avatar: '👦', keyHolder: false, hyphaBalance: 800, lastSeen: '3 jam lalu' },
  { id: 'f4', name: 'Nayla Gani', role: 'Child', avatar: '👧', keyHolder: false, hyphaBalance: 600, lastSeen: '2 hari lalu' },
];

const VAULT_DOCS: VaultDocument[] = [
  { id: 'v1', name: 'Surat Wasiat Ahmad Gani 2026', category: 'will', ipfsCid: 'QmYwAPJzv5CZsnAzt8auV39s19G...', uploadDate: '2026-01-15', size: '245 KB', isEncrypted: true, accessLevel: 'private', emoji: '📜', owner: 'Ahmad Gani' },
  { id: 'v2', name: 'Sertifikat Rumah Jl. Melati No.12', category: 'deed', ipfsCid: 'QmZ8bNwkRfT4mXuV...', uploadDate: '2025-11-20', size: '1.2 MB', isEncrypted: true, accessLevel: 'family', emoji: '🏠', owner: 'Ahmad Gani' },
  { id: 'v3', name: 'Polis Asuransi Jiwa - Prudential', category: 'insurance', ipfsCid: 'QmA9cOpLsU5nYvW...', uploadDate: '2026-02-01', size: '384 KB', isEncrypted: true, accessLevel: 'family', emoji: '🛡️', owner: 'Siti Rahayu' },
  { id: 'v4', name: 'KTP & KK Keluarga', category: 'identity', ipfsCid: 'QmB1dPmMtV6oZxX...', uploadDate: '2025-12-10', size: '2.1 MB', isEncrypted: true, accessLevel: 'family', emoji: '🪪', owner: 'Ahmad Gani' },
  { id: 'v5', name: 'Portfolio Saham BEI 2026', category: 'investment', ipfsCid: 'QmC2eQnNuW7pAyY...', uploadDate: '2026-02-14', size: '156 KB', isEncrypted: true, accessLevel: 'private', emoji: '📊', owner: 'Ahmad Gani' },
  { id: 'v6', name: 'Foto Pernikahan & Kenangan', category: 'sentimental', ipfsCid: 'QmD3fRoOvX8qBzZ...', uploadDate: '2026-01-28', size: '45.2 MB', isEncrypted: false, accessLevel: 'family', emoji: '📸', owner: 'Siti Rahayu' },
];

const TREASURY_ASSETS: TreasuryAsset[] = [
  { id: 't1', name: 'Tabungan BCA Family', type: 'savings', value: 85000000, currency: 'IDR', change24h: 0, icon: '🏦' },
  { id: 't2', name: 'Reksa Dana Trimegah', type: 'investment', value: 124500000, currency: 'IDR', change24h: 2.4, icon: '📈' },
  { id: 't3', name: '$HYPHA Staking Pool', type: 'hypha', value: 9600, currency: 'HYPHA', change24h: 8.2, icon: '🌿' },
  { id: 't4', name: 'ETH (Alchemy Wallet)', type: 'crypto', value: 0.75, currency: 'ETH', change24h: -1.2, icon: '⟠' },
  { id: 't5', name: 'Rumah Jl. Melati No.12', type: 'property', value: 1800000000, currency: 'IDR', change24h: 0.1, icon: '🏠' },
];

const HOME_TASKS: HomeTask[] = [
  { id: 'ht1', title: 'Ganti filter air PDAM', category: 'maintenance', dueDate: '2026-02-28', priority: 'high', assignedTo: 'Ahmad Gani', status: 'todo', emoji: '💧', isAiGenerated: true },
  { id: 'ht2', title: 'Bayar tagihan PLN Maret', category: 'bill', dueDate: '2026-03-05', priority: 'critical', assignedTo: 'Siti Rahayu', status: 'todo', emoji: '⚡' },
  { id: 'ht3', title: 'Servis AC — 6 bulan', category: 'maintenance', dueDate: '2026-03-10', priority: 'medium', assignedTo: 'Ahmad Gani', status: 'in-progress', emoji: '❄️', isAiGenerated: true },
  { id: 'ht4', title: 'Medical Check Up Tahunan', category: 'health', dueDate: '2026-03-15', priority: 'high', assignedTo: 'Semua', status: 'todo', emoji: '🏥', isAiGenerated: true },
  { id: 'ht5', title: 'Rapot Raffi — Ambil Sekolah', category: 'education', dueDate: '2026-03-20', priority: 'medium', assignedTo: 'Siti Rahayu', status: 'todo', emoji: '📚' },
  { id: 'ht6', title: 'Bayar Tagihan PDAM', category: 'bill', dueDate: '2026-02-27', priority: 'critical', assignedTo: 'Ahmad Gani', status: 'done', emoji: '🚿' },
];

const SUCCESSION_RULES: SuccessionRule[] = [
  { id: 'sr1', asset: 'Rumah Jl. Melati No.12', beneficiary: 'Siti Rahayu', percentage: 100, condition: 'Utama (saat kepala keluarga tiada)', isActive: true },
  { id: 'sr2', asset: 'Tabungan & Investasi', beneficiary: 'Siti Rahayu (60%) + Anak-anak (40%)', percentage: 100, condition: 'Dibagi setelah 40 hari', isActive: true },
  { id: 'sr3', asset: '$HYPHA Token', beneficiary: 'Raffi Gani', percentage: 70, condition: 'Unlock saat usia 21 tahun', isActive: true },
];

// ─── UTILITY ──────────────────────────────────────────────
const CAT_CONFIG = {
  will: { color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  deed: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  insurance: { color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
  identity: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  investment: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  medical: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  sentimental: { color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
};

const PRIORITY_CONFIG = {
  critical: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', dot: 'bg-red-500', label: 'Kritis' },
  high: { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', dot: 'bg-orange-400', label: 'Tinggi' },
  medium: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', dot: 'bg-yellow-400', label: 'Sedang' },
  low: { color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', dot: 'bg-slate-400', label: 'Rendah' },
};

// ─── MAIN COMPONENT ───────────────────────────────────────
const SovereignLegacy: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hearth' | 'vault' | 'treasury' | 'home-os' | 'succession' | 'plans'>('hearth');
  const [homeTasks, setHomeTasks] = useState<HomeTask[]>(HOME_TASKS);
  const [aiChat, setAiChat] = useState<AIMessage[]>([
    { role: 'ai', msg: '🏠 Selamat datang di Sovereign Legacy AI — Penjaga Warisan Keluarga Anda.\n\nSaya siap membantu:\n• 🔐 Kelola Vault dokumen penting\n• 💰 Pantau Treasury keluarga\n• 🏡 Automasi tugas rumah tangga\n• 📜 Setup protokol suksesi\n\nAda yang bisa saya bantu, Tuan Rumah?' }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [vaultSearch, setVaultSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiChat]);

  // Summary stats
  const totalAssetIDR = TREASURY_ASSETS.filter(a => a.currency === 'IDR').reduce((s, a) => s + a.value, 0);
  const criticalTasks = homeTasks.filter(t => t.priority === 'critical' && t.status !== 'done').length;
  const vaultCount = VAULT_DOCS.length;
  const hyphaStaked = TREASURY_ASSETS.find(a => a.type === 'hypha')?.value || 0;

  // AI Legacy Advisor handler
  const handleAiSend = async () => {
    if (!aiInput.trim()) return;
    const userMsg = aiInput.trim();
    setAiInput('');
    setAiChat(prev => [...prev, { role: 'user', msg: userMsg }]);
    setIsAiTyping(true);

    await new Promise(r => setTimeout(r, 1300));

    const lower = userMsg.toLowerCase();
    let aiReply = '';

    if (lower.includes('vault') || lower.includes('dokumen') || lower.includes('wasiat') || lower.includes('surat')) {
      aiReply = `🔐 **Status Legacy Vault:**\n\n${VAULT_DOCS.map(d => `${d.emoji} **${d.name}**\n   CID: ${d.ipfsCid.slice(0, 20)}...\n   Access: ${d.accessLevel === 'private' ? '🔒 Private' : d.accessLevel === 'family' ? '👨‍👩‍👧‍👦 Family' : '🆘 Emergency'}`).join('\n\n')}\n\n✅ Semua ${VAULT_DOCS.length} dokumen terenkripsi AES-256 + tersimpan di IPFS via Pinata.\n\n💡 Saran: Perbarui Surat Wasiat setiap 6 bulan atau setelah perubahan aset besar.`;
    } else if (lower.includes('treasury') || lower.includes('aset') || lower.includes('harta') || lower.includes('kekayaan')) {
      aiReply = `💰 **Family Treasury Overview:**\n\n${TREASURY_ASSETS.map(a => `${a.icon} **${a.name}**: ${a.currency === 'IDR' ? `Rp ${a.value.toLocaleString('id')}` : `${a.value} ${a.currency}`} ${a.change24h > 0 ? `📈 +${a.change24h}%` : a.change24h < 0 ? `📉 ${a.change24h}%` : ''}`).join('\n')}\n\n💎 Total Aset IDR: **Rp ${totalAssetIDR.toLocaleString('id')}**\n🌿 $HYPHA Staked: **${hyphaStaked.toLocaleString()} HYPHA**\n\n💡 Estimasi net worth keluarga tumbuh 12.4% YoY berdasarkan tren saat ini.`;
    } else if (lower.includes('tugas') || lower.includes('rumah') || lower.includes('maintenance') || lower.includes('bayar')) {
      const pending = homeTasks.filter(t => t.status !== 'done');
      aiReply = `🏡 **Home OS — Tugas Tertunda:**\n\n${pending.map(t => `${t.emoji} **${t.title}**\n   Due: ${t.dueDate} · Assign: ${t.assignedTo} · [${PRIORITY_CONFIG[t.priority].label}]`).join('\n\n')}\n\n⚠️ ${criticalTasks} tugas KRITIS perlu diselesaikan segera!\n\n💡 AI akan kirim reminder WhatsApp ke masing-masing anggota keluarga pada H-3 jatuh tempo.`;
    } else if (lower.includes('suksesi') || lower.includes('waris') || lower.includes('succession') || lower.includes('warisan')) {
      aiReply = `📜 **Succession Protocol Status:**\n\n${SUCCESSION_RULES.map(r => `✅ **${r.asset}**\n   → ${r.beneficiary}\n   📋 Kondisi: "${r.condition}"`).join('\n\n')}\n\n🔐 **Dead Man's Switch:**\nAktif — Akan trigger otomatis jika tidak ada aktivitas selama **180 hari**.\nSmart contract di deploy di Ethereum Mainnet.\n\n💡 Saran: Review dan update succession rules setiap tahun bersama notaris.`;
    } else if (lower.includes('hypha') || lower.includes('token') || lower.includes('reward') || lower.includes('staking')) {
      aiReply = `🌿 **$HYPHA Family Staking:**\n\nTotal staked: **${hyphaStaked.toLocaleString()} HYPHA**\n\nDistribusi per anggota:\n${FAMILY_MEMBERS.map(m => `${m.avatar} ${m.name}: ${m.hyphaBalance.toLocaleString()} HYPHA`).join('\n')}\n\nAPY Staking: **18.4%** (via GANI HYPHA Pool)\nEstimasi reward/bulan: **~${Math.round(hyphaStaked * 0.184 / 12).toLocaleString()} HYPHA**\n\n💡 Aktivitas keluarga (bayar tagihan, upload dokumen, dll) dapat earn tambahan $HYPHA rewards!`;
    } else if (lower.includes('keamanan') || lower.includes('security') || lower.includes('enkripsi') || lower.includes('did')) {
      aiReply = `🔐 **Security Status — Sovereign Legacy:**\n\n✅ AES-256 Encryption: AKTIF\n✅ IPFS via Pinata: CONNECTED\n✅ Web5 DID (Ahmad): did:web5:0xA1B2C3...\n✅ Web5 DID (Siti): did:web5:0xD4E5F6...\n🔑 Key Shards: 2/4 tersimpan (Ahmad + Siti)\n⚠️ Disarankan 4/4 shards (tambah 2 trusted guardians)\n\n🛡️ ZKP (Zero-Knowledge Proof): Dalam pengembangan\n📊 Audit Log: Semua akses tercatat on-chain`;
    } else {
      aiReply = `🏠 **Sovereign Legacy AI — Family Sanctuary**\n\nSaya bisa membantu dengan:\n• 🔐 **Vault** — "Tampilkan semua dokumen wasiat"\n• 💰 **Treasury** — "Hitung total aset keluarga"\n• 🏡 **Home OS** — "Tugas rumah yang mendekati deadline"\n• 📜 **Suksesi** — "Setup aturan waris untuk anak-anak"\n• 🌿 **$HYPHA** — "Cek reward staking bulan ini"\n• 🔐 **Keamanan** — "Status enkripsi dan DID"\n\nTanyakan saja — saya adalah penjaga digital warisan keluarga Anda. 🙏🏻`;
    }

    setAiChat(prev => [...prev, { role: 'ai', msg: aiReply }]);
    setIsAiTyping(false);
  };

  const updateTaskStatus = (id: string, status: HomeTask['status']) => {
    setHomeTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  const filteredDocs = VAULT_DOCS.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(vaultSearch.toLowerCase());
    const matchCat = selectedCategory === 'all' || d.category === selectedCategory;
    return matchSearch && matchCat;
  });

  // ─── RENDER ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* ── HEADER ── */}
      <div className="bg-gradient-to-r from-[#0D0D0D] via-[#111015] to-[#0D0D0D] border-b border-[#D4AF37]/15 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2A1F60] to-[#1A1240] flex items-center justify-center text-2xl shadow-lg shadow-violet-900/20 border border-[#D4AF37]/20">
              🏛️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white tracking-tight">SOVEREIGN LEGACY</h1>
                <span className="text-[9px] font-black bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/25 px-2 py-0.5 rounded-full uppercase tracking-widest">
                  SMA Instance
                </span>
              </div>
              <p className="text-[10px] font-mono text-[#D4AF37]/50 uppercase tracking-widest">"The Family Sanctuary" · Digital Legacy Vault + Home OS · GANI HYPHA</p>
            </div>
          </div>
          {/* Security Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-3 py-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">🔐 AES-256 · IPFS · Web5</span>
            </div>
            {criticalTasks > 0 && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                <span className="text-[9px] font-black text-red-400 uppercase tracking-widest">⚠️ {criticalTasks} Tugas Kritis</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-3 mt-4">
          {[
            { label: 'Total Aset Keluarga', value: `Rp ${(totalAssetIDR / 1000000000).toFixed(2)}M`, icon: '💎', color: 'text-[#D4AF37]' },
            { label: 'Dokumen di Vault', value: `${vaultCount} files`, icon: '🔐', color: 'text-violet-400' },
            { label: '$HYPHA Staked', value: `${hyphaStaked.toLocaleString()}`, icon: '🌿', color: 'text-emerald-400' },
            { label: 'Anggota Keluarga', value: `${FAMILY_MEMBERS.length} orang`, icon: '👨‍👩‍👧‍👦', color: 'text-[#00AEEF]' },
          ].map((stat, i) => (
            <div key={i} className="bg-[#141414] border border-[#1E1E1E] rounded-2xl p-3">
              <div className="text-lg mb-1">{stat.icon}</div>
              <div className={`text-sm font-black ${stat.color}`}>{stat.value}</div>
              <div className="text-[9px] font-mono text-slate-700 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="flex gap-1 px-6 pt-4 pb-0 overflow-x-auto scrollbar-hide">
        {[
          { id: 'hearth', icon: '🔥', label: 'Family Hearth' },
          { id: 'vault', icon: '🔐', label: 'Legacy Vault' },
          { id: 'treasury', icon: '💎', label: 'Treasury' },
          { id: 'home-os', icon: '🏡', label: 'Home OS' },
          { id: 'succession', icon: '📜', label: 'Suksesi' },
          { id: 'plans', icon: '💼', label: 'Plans' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-[#141414] border border-b-0 border-[#D4AF37]/20 text-[#D4AF37]'
                : 'text-slate-600 hover:text-slate-400'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── CONTENT ── */}
      <div className="p-6 bg-[#141414] border border-[#D4AF37]/8 mx-6 mb-6 rounded-b-2xl rounded-tr-2xl">

        {/* ── TAB: FAMILY HEARTH (Main Hub) ── */}
        {activeTab === 'hearth' && (
          <div className="space-y-6">
            <h2 className="text-base font-black text-white uppercase tracking-widest">🔥 Family Hearth — Central Hub</h2>

            {/* Family Members Grid */}
            <div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">👨‍👩‍👧‍👦 Anggota Keluarga</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {FAMILY_MEMBERS.map(m => (
                  <div key={m.id} className={`p-4 rounded-2xl border transition-all ${
                    m.keyHolder ? 'bg-[#0F0D1F] border-violet-500/20' : 'bg-[#0D0D0D] border-[#1E1E1E]'
                  }`}>
                    <div className="text-center">
                      <div className="text-3xl mb-2">{m.avatar}</div>
                      <div className="text-xs font-black text-white mb-0.5">{m.name}</div>
                      <div className="text-[9px] font-mono text-slate-600 mb-2">{m.role}</div>
                      {m.keyHolder && (
                        <div className="flex items-center justify-center gap-1 bg-violet-500/10 border border-violet-500/20 rounded-full px-2 py-0.5 mb-2">
                          <span className="text-[8px] font-black text-violet-400 uppercase">🔑 Key Holder #{m.shardIndex}</span>
                        </div>
                      )}
                      {m.did && (
                        <div className="text-[7px] font-mono text-slate-700 mb-2 truncate">{m.did}</div>
                      )}
                      <div className="flex items-center justify-center gap-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5">
                        <span className="text-[8px] font-black text-emerald-400">{m.hyphaBalance.toLocaleString()} $HYPHA</span>
                      </div>
                      <div className="text-[7px] font-mono text-slate-700 mt-1">{m.lastSeen}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Legacy Advisor Chat */}
            <div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">🤖 Legacy AI Advisor</div>
              <div className="bg-[#0D0D0D] border border-[#1E1E1E] rounded-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-[#1E1E1E] flex items-center gap-2">
                  <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black text-violet-400 uppercase tracking-widest">Sovereign Legacy AI · Groq llama-3.3-70b</span>
                </div>
                <div className="h-56 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                  {aiChat.map((msg, i) => (
                    <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {msg.role === 'ai' && (
                        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#2A1F60] to-[#1A1240] flex items-center justify-center text-sm flex-shrink-0 border border-[#D4AF37]/20">🏛️</div>
                      )}
                      <div className={`max-w-sm rounded-2xl px-4 py-3 text-[11px] leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-violet-500/10 text-white border border-violet-500/20'
                          : 'bg-[#141414] text-slate-300 border border-[#1E1E1E]'
                      }`}>
                        {msg.msg}
                      </div>
                      {msg.role === 'user' && (
                        <div className="w-7 h-7 rounded-xl bg-[#1E1E1E] flex items-center justify-center text-sm flex-shrink-0">👤</div>
                      )}
                    </div>
                  ))}
                  {isAiTyping && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#2A1F60] to-[#1A1240] flex items-center justify-center text-sm border border-[#D4AF37]/20">🏛️</div>
                      <div className="bg-[#141414] border border-[#1E1E1E] rounded-2xl px-4 py-3">
                        <div className="flex gap-1">
                          {[0, 1, 2].map(i => <div key={i} className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                <div className="px-3 pb-1 flex gap-1 flex-wrap">
                  {['Status vault', 'Cek treasury', 'Tugas rumah', 'Aturan suksesi', '$HYPHA rewards'].map(q => (
                    <button key={q} onClick={() => setAiInput(q)} className="text-[8px] font-black bg-[#141414] border border-[#1E1E1E] text-slate-600 hover:text-slate-400 px-2 py-1 rounded-lg transition-all">
                      {q}
                    </button>
                  ))}
                </div>
                <div className="px-3 pb-3 flex gap-2 mt-1">
                  <input
                    value={aiInput}
                    onChange={e => setAiInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAiSend()}
                    placeholder="Tanya Legacy AI Advisor..."
                    className="flex-1 bg-[#1A1A1A] border border-[#1E1E1E] text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-violet-500/30 placeholder-slate-700"
                  />
                  <button
                    onClick={handleAiSend}
                    disabled={!aiInput.trim() || isAiTyping}
                    className="bg-gradient-to-r from-violet-700 to-purple-800 disabled:opacity-40 hover:from-violet-600 hover:to-purple-700 text-white px-4 py-2.5 rounded-xl text-xs font-black transition-all border border-violet-500/20"
                  >
                    🏛️
                  </button>
                </div>
              </div>
            </div>

            {/* Critical Tasks Alert */}
            {criticalTasks > 0 && (
              <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4">
                <div className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-3">⚠️ TUGAS KRITIS — Segera Diselesaikan!</div>
                <div className="space-y-2">
                  {homeTasks.filter(t => t.priority === 'critical' && t.status !== 'done').map(t => (
                    <div key={t.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>{t.emoji}</span>
                        <span className="text-xs font-black text-red-300">{t.title}</span>
                        <span className="text-[9px] font-mono text-red-500">Due: {t.dueDate}</span>
                      </div>
                      <button onClick={() => updateTaskStatus(t.id, 'done')} className="text-[9px] font-black bg-red-500/20 border border-red-500/20 text-red-300 px-2 py-1 rounded-lg">
                        Selesai ✓
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: LEGACY VAULT ── */}
        {activeTab === 'vault' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-white uppercase tracking-widest">🔐 Legacy Vault — Dokumen Terenkripsi</h2>
              <button
                onClick={() => setShowUploadForm(!showUploadForm)}
                className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#C9A227] text-black px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all"
              >
                ➕ Upload Dokumen
              </button>
            </div>

            {/* Upload Form */}
            {showUploadForm && (
              <div className="bg-[#0D0D0D] border border-[#D4AF37]/20 rounded-2xl p-5 space-y-4">
                <div className="text-sm font-black text-[#D4AF37] uppercase">📤 Upload ke IPFS via Pinata (Encrypted)</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Nama Dokumen</label>
                    <input placeholder="Nama file..." className="w-full bg-[#141414] border border-[#1E1E1E] text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#D4AF37]/30" />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Kategori</label>
                    <select className="w-full bg-[#141414] border border-[#1E1E1E] text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#D4AF37]/30">
                      <option value="will">📜 Surat Wasiat</option>
                      <option value="deed">🏠 Sertifikat/Akta</option>
                      <option value="insurance">🛡️ Asuransi</option>
                      <option value="identity">🪪 Identitas</option>
                      <option value="investment">📊 Investasi</option>
                      <option value="medical">🏥 Medis</option>
                      <option value="sentimental">📸 Kenangan</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Level Akses</label>
                    <select className="w-full bg-[#141414] border border-[#1E1E1E] text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#D4AF37]/30">
                      <option value="private">🔒 Private (hanya saya)</option>
                      <option value="family">👨‍👩‍👧‍👦 Family (semua anggota)</option>
                      <option value="emergency">🆘 Emergency (semua + guardian)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">File</label>
                    <div className="border border-dashed border-[#2A2A2A] hover:border-[#D4AF37]/30 rounded-xl px-3 py-4 text-center cursor-pointer transition-all">
                      <div className="text-[10px] text-slate-600">📎 Drag & drop atau klik untuk upload</div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="flex-1 bg-[#D4AF37] hover:bg-[#C9A227] text-black py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest">
                    🔐 Enkripsi & Upload ke IPFS
                  </button>
                  <button onClick={() => setShowUploadForm(false)} className="px-6 bg-[#1E1E1E] text-slate-400 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest">
                    Batal
                  </button>
                </div>
              </div>
            )}

            {/* Search & Filter */}
            <div className="flex gap-3">
              <input
                value={vaultSearch}
                onChange={e => setVaultSearch(e.target.value)}
                placeholder="Cari dokumen..."
                className="flex-1 bg-[#0D0D0D] border border-[#1E1E1E] text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#D4AF37]/30 placeholder-slate-700"
              />
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="bg-[#0D0D0D] border border-[#1E1E1E] text-white rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#D4AF37]/30"
              >
                <option value="all">Semua Kategori</option>
                <option value="will">📜 Wasiat</option>
                <option value="deed">🏠 Sertifikat</option>
                <option value="insurance">🛡️ Asuransi</option>
                <option value="identity">🪪 Identitas</option>
                <option value="investment">📊 Investasi</option>
                <option value="sentimental">📸 Kenangan</option>
              </select>
            </div>

            {/* Document List */}
            <div className="space-y-2">
              {filteredDocs.map(doc => {
                const cc = CAT_CONFIG[doc.category];
                return (
                  <div key={doc.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all hover:border-[#D4AF37]/15 bg-[#0D0D0D] border-[#1E1E1E]`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-2xl ${cc.bg} ${cc.border} border flex items-center justify-center text-xl`}>
                        {doc.emoji}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-white">{doc.name}</span>
                          {doc.isEncrypted && <span className="text-[7px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 rounded uppercase">🔐 AES-256</span>}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-[8px] font-black ${cc.color} uppercase`}>{doc.category}</span>
                          <span className="text-[8px] font-mono text-slate-600">·</span>
                          <span className="text-[8px] font-mono text-slate-600">{doc.size}</span>
                          <span className="text-[8px] font-mono text-slate-600">·</span>
                          <span className="text-[8px] font-mono text-slate-600">{doc.uploadDate}</span>
                          <span className="text-[8px] font-mono text-slate-600">·</span>
                          <span className="text-[8px] font-mono text-slate-600">{doc.owner}</span>
                        </div>
                        <div className="text-[7px] font-mono text-slate-700 mt-0.5">IPFS: {doc.ipfsCid.slice(0, 35)}...</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center gap-1 ${
                        doc.accessLevel === 'private' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                        doc.accessLevel === 'family' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                        'bg-orange-500/10 border-orange-500/20 text-orange-400'
                      } rounded-full px-2 py-0.5 border text-[8px] font-black uppercase`}>
                        {doc.accessLevel === 'private' ? '🔒 Private' : doc.accessLevel === 'family' ? '👨‍👩‍👧 Family' : '🆘 Emergency'}
                      </div>
                      <button className="text-[9px] font-black bg-[#141414] border border-[#1E1E1E] text-slate-400 hover:text-white px-2 py-1 rounded-lg transition-all">
                        Buka 🔓
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* IPFS Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Total Dokumen', val: vaultCount, icon: '📄', color: 'text-violet-400' },
                { label: 'Terenkripsi', val: VAULT_DOCS.filter(d => d.isEncrypted).length, icon: '🔐', color: 'text-emerald-400' },
                { label: 'Storage IPFS', val: '49.1 MB', icon: '🌐', color: 'text-[#D4AF37]' },
              ].map((s, i) => (
                <div key={i} className="bg-[#0D0D0D] border border-[#1E1E1E] rounded-2xl p-3 text-center">
                  <div className="text-xl mb-1">{s.icon}</div>
                  <div className={`text-base font-black ${s.color}`}>{s.val}</div>
                  <div className="text-[9px] font-mono text-slate-700">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB: TREASURY ── */}
        {activeTab === 'treasury' && (
          <div className="space-y-6">
            <h2 className="text-base font-black text-white uppercase tracking-widest">💎 Family Treasury Dashboard</h2>

            {/* Total Net Worth Banner */}
            <div className="bg-gradient-to-r from-[#0F0D1F] to-[#0D0D0D] border border-[#D4AF37]/20 rounded-2xl p-5">
              <div className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest mb-1">💎 Total Net Worth Keluarga</div>
              <div className="text-3xl font-black text-white mb-1">Rp {totalAssetIDR.toLocaleString('id')}</div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                <span className="text-[10px] font-mono text-emerald-400">+12.4% YoY</span>
                <span className="text-[10px] font-mono text-slate-600">· Diperbarui: 26 Feb 2026</span>
              </div>
            </div>

            {/* Asset Grid */}
            <div className="space-y-3">
              {TREASURY_ASSETS.map(asset => (
                <div key={asset.id} className="flex items-center justify-between p-4 bg-[#0D0D0D] border border-[#1E1E1E] rounded-2xl hover:border-[#D4AF37]/15 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-[#141414] border border-[#1E1E1E] flex items-center justify-center text-xl">
                      {asset.icon}
                    </div>
                    <div>
                      <div className="text-xs font-black text-white">{asset.name}</div>
                      <div className="text-[9px] font-mono text-slate-600 capitalize">{asset.type}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-[#D4AF37]">
                      {asset.currency === 'IDR' ? `Rp ${asset.value.toLocaleString('id')}` : `${asset.value} ${asset.currency}`}
                    </div>
                    <div className={`text-[9px] font-mono ${asset.change24h > 0 ? 'text-emerald-400' : asset.change24h < 0 ? 'text-red-400' : 'text-slate-600'}`}>
                      {asset.change24h > 0 ? `+${asset.change24h}%` : asset.change24h < 0 ? `${asset.change24h}%` : 'Stabil'} 24h
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Allocation Chart (Visual) */}
            <div className="bg-[#0D0D0D] border border-[#1E1E1E] rounded-2xl p-5">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">📊 Alokasi Aset</div>
              <div className="space-y-3">
                {[
                  { label: 'Properti', pct: 86, color: 'bg-[#D4AF37]' },
                  { label: 'Reksa Dana', pct: 6, color: 'bg-violet-500' },
                  { label: 'Tabungan', pct: 4, color: 'bg-blue-500' },
                  { label: '$HYPHA + Crypto', pct: 4, color: 'bg-emerald-500' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-20 text-[9px] font-black text-slate-500 text-right">{item.label}</div>
                    <div className="flex-1 bg-[#1E1E1E] rounded-full h-2">
                      <div className={`${item.color} h-2 rounded-full transition-all`} style={{ width: `${item.pct}%` }} />
                    </div>
                    <div className="w-8 text-[9px] font-black text-slate-400">{item.pct}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: HOME OS ── */}
        {activeTab === 'home-os' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-white uppercase tracking-widest">🏡 Home OS — Smart Family Planner</h2>
              <div className="flex items-center gap-2 text-[10px] font-black text-violet-400 uppercase">
                <div className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-pulse" />
                AI Auto-Reminder Aktif
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Total Tugas', val: homeTasks.length, icon: '📋', color: 'text-white' },
                { label: 'Kritis', val: homeTasks.filter(t => t.priority === 'critical' && t.status !== 'done').length, icon: '🚨', color: 'text-red-400' },
                { label: 'In Progress', val: homeTasks.filter(t => t.status === 'in-progress').length, icon: '⚡', color: 'text-yellow-400' },
                { label: 'Selesai', val: homeTasks.filter(t => t.status === 'done').length, icon: '✅', color: 'text-emerald-400' },
              ].map((s, i) => (
                <div key={i} className="bg-[#0D0D0D] border border-[#1E1E1E] rounded-2xl p-3 text-center">
                  <div className="text-xl mb-1">{s.icon}</div>
                  <div className={`text-xl font-black ${s.color}`}>{s.val}</div>
                  <div className="text-[9px] font-mono text-slate-700">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Task List */}
            <div className="space-y-2">
              {homeTasks.map(task => {
                const pc = PRIORITY_CONFIG[task.priority];
                return (
                  <div key={task.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    task.status === 'done' ? 'bg-[#0D0D0D] border-[#1A1A1A] opacity-60' :
                    task.priority === 'critical' ? 'bg-red-500/5 border-red-500/15' :
                    'bg-[#0D0D0D] border-[#1E1E1E] hover:border-[#2A2A2A]'
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{task.emoji}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-black ${task.status === 'done' ? 'line-through text-slate-600' : 'text-white'}`}>{task.title}</span>
                          {task.isAiGenerated && (
                            <span className="text-[7px] font-black bg-violet-500/10 text-violet-400 border border-violet-500/15 px-1.5 rounded uppercase">AI Generated</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-[9px] font-black capitalize ${pc.color}`}>{pc.label}</span>
                          <span className="text-[8px] text-slate-700">·</span>
                          <span className="text-[9px] font-mono text-slate-600">Due: {task.dueDate}</span>
                          <span className="text-[8px] text-slate-700">·</span>
                          <span className="text-[9px] font-mono text-slate-600">{task.assignedTo}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center gap-1.5 ${pc.bg} rounded-full px-2 py-0.5 border ${pc.border}`}>
                        <div className={`w-1 h-1 rounded-full ${pc.dot} ${task.status !== 'done' ? 'animate-pulse' : ''}`} />
                        <span className={`text-[8px] font-black uppercase tracking-widest ${pc.color}`}>
                          {task.status === 'todo' ? 'To Do' : task.status === 'in-progress' ? 'In Progress' : 'Selesai'}
                        </span>
                      </div>
                      {task.status === 'todo' && (
                        <button onClick={() => updateTaskStatus(task.id, 'in-progress')} className="text-[9px] font-black bg-blue-500/10 border border-blue-500/15 text-blue-400 px-2 py-1 rounded-lg">
                          Mulai
                        </button>
                      )}
                      {task.status === 'in-progress' && (
                        <button onClick={() => updateTaskStatus(task.id, 'done')} className="text-[9px] font-black bg-emerald-500/10 border border-emerald-500/15 text-emerald-400 px-2 py-1 rounded-lg">
                          Selesai ✓
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TAB: SUCCESSION ── */}
        {activeTab === 'succession' && (
          <div className="space-y-6">
            <h2 className="text-base font-black text-white uppercase tracking-widest">📜 Succession Protocol — Warisan Digital</h2>

            {/* Dead Man's Switch Status */}
            <div className="bg-gradient-to-r from-[#0F0A1F] to-[#0D0D0D] border border-violet-500/20 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-1">⚙️ Dead Man's Switch</div>
                  <div className="text-xs font-black text-white">Auto-succession trigger jika tidak ada aktivitas 180 hari</div>
                </div>
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black text-emerald-400 uppercase">AKTIF</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Trigger Timer', val: '180 hari', color: 'text-violet-400' },
                  { label: 'Last Activity', val: '0 hari lalu', color: 'text-emerald-400' },
                  { label: 'Status', val: 'Aman', color: 'text-emerald-400' },
                ].map((s, i) => (
                  <div key={i} className="bg-[#0D0D0D] rounded-xl p-3 text-center border border-[#1E1E1E]">
                    <div className={`text-sm font-black ${s.color}`}>{s.val}</div>
                    <div className="text-[8px] font-mono text-slate-700">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Succession Rules */}
            <div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">📋 Aturan Warisan</div>
              <div className="space-y-3">
                {SUCCESSION_RULES.map(rule => (
                  <div key={rule.id} className="p-4 bg-[#0D0D0D] border border-[#1E1E1E] rounded-2xl hover:border-[#D4AF37]/15 transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-black text-[#D4AF37]">{rule.asset}</span>
                          {rule.isActive && (
                            <span className="text-[7px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 px-1.5 py-0.5 rounded uppercase">✅ Aktif</span>
                          )}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 mb-1">
                          → Penerima: <span className="text-white font-black">{rule.beneficiary}</span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-600 italic">"{rule.condition}"</div>
                      </div>
                      <div className="text-sm font-black text-[#D4AF37] ml-4">{rule.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Shard Status */}
            <div className="bg-[#0D0D0D] border border-[#1E1E1E] rounded-2xl p-5">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">🔑 Kunci Shard (Shamir's Secret Sharing)</div>
              <div className="text-[10px] font-mono text-slate-600 mb-4">4 shard dibagi ke anggota terpercaya. Butuh 3/4 untuk unlock warisan.</div>
              <div className="grid grid-cols-4 gap-3">
                {FAMILY_MEMBERS.map((m, i) => (
                  <div key={m.id} className={`p-3 rounded-2xl border text-center ${m.keyHolder ? 'bg-violet-500/5 border-violet-500/20' : 'bg-[#0D0D0D] border-[#1E1E1E] opacity-50'}`}>
                    <div className="text-2xl mb-1">{m.avatar}</div>
                    <div className="text-[9px] font-black text-white">{m.name}</div>
                    <div className="text-[8px] font-mono text-slate-600 mb-2">{m.role}</div>
                    {m.keyHolder ? (
                      <div className="bg-violet-500/10 border border-violet-500/20 rounded-full px-2 py-0.5">
                        <span className="text-[8px] font-black text-violet-400">🔑 Shard #{m.shardIndex}</span>
                      </div>
                    ) : (
                      <div className="bg-[#1E1E1E] rounded-full px-2 py-0.5">
                        <span className="text-[8px] font-black text-slate-700">Belum Assign</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2 text-[9px] font-mono text-yellow-500">
                <span>⚠️</span>
                <span>2/4 shard aktif. Disarankan 4/4 untuk keamanan optimal. Tambah guardian terpercaya.</span>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: PLANS ── */}
        {activeTab === 'plans' && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="text-3xl mb-2">🏛️</div>
              <h2 className="text-2xl font-black text-white mb-2">Sovereign Legacy Plans</h2>
              <p className="text-slate-500 text-sm font-mono">Digital Legacy Vault + Family Home OS · GANI HYPHA SMA Ecosystem</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  name: 'Sanctuary Starter',
                  price: 'Rp 299.000',
                  period: '/bulan',
                  badge: '',
                  emoji: '🏠',
                  color: 'from-slate-800 to-slate-900',
                  border: 'border-slate-700',
                  btn: 'bg-slate-700 hover:bg-slate-600',
                  features: [
                    '✅ Legacy Vault (10 dokumen)',
                    '✅ IPFS storage (100MB)',
                    '✅ AES-256 enkripsi',
                    '✅ 4 anggota keluarga',
                    '✅ Home OS (20 tugas)',
                    '❌ Smart contract suksesi',
                    '❌ Web5 DID + DWN',
                    '❌ $HYPHA staking integration',
                  ],
                  cta: 'Mulai Gratis 7 Hari',
                },
                {
                  name: 'Sovereign Sanctuary',
                  price: 'Rp 799.000',
                  period: '/bulan',
                  badge: '⭐ Most Popular',
                  emoji: '🏛️',
                  color: 'from-[#0F0D1F] to-[#0D0D0D]',
                  border: 'border-violet-500/30',
                  btn: 'bg-gradient-to-r from-violet-700 to-purple-800 hover:from-violet-600 hover:to-purple-700 border border-violet-500/20',
                  features: [
                    '✅ Legacy Vault UNLIMITED',
                    '✅ IPFS storage (5GB)',
                    '✅ Web5 DID + DWN',
                    '✅ Family Treasury dashboard',
                    '✅ Home OS UNLIMITED tugas',
                    '✅ Basic succession rules',
                    '✅ $HYPHA staking integration',
                    '❌ Smart contract kustom',
                  ],
                  cta: '🏛️ Amankan Warisan Keluarga',
                },
                {
                  name: 'Legacy Forever',
                  price: 'Rp 1.999.000',
                  period: '/bulan',
                  badge: '👑 Full Sovereign',
                  emoji: '♾️',
                  color: 'from-amber-950/20 to-yellow-950/10',
                  border: 'border-amber-500/20',
                  btn: 'bg-amber-600 hover:bg-amber-500',
                  features: [
                    '✅ Semua Sovereign Sanctuary',
                    '✅ IPFS storage UNLIMITED',
                    '✅ Smart contract suksesi kustom',
                    '✅ ZKP (Zero-Knowledge Proof)',
                    '✅ Multi-sig treasury wallet',
                    '✅ Dead Man\'s Switch advanced',
                    '✅ IoT Home bridge (beta)',
                    '✅ Notaris digital integration',
                  ],
                  cta: '♾️ Warisan Abadi Dimulai',
                },
              ].map((plan, i) => (
                <div key={i} className={`bg-gradient-to-b ${plan.color} border ${plan.border} rounded-2xl p-5 flex flex-col ${plan.badge ? 'ring-1 ring-violet-500/20' : ''}`}>
                  {plan.badge && (
                    <div className="text-center mb-3">
                      <span className="text-[9px] font-black bg-violet-500/10 text-violet-400 border border-violet-500/20 px-3 py-1 rounded-full uppercase tracking-widest">{plan.badge}</span>
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
                  <button className={`w-full py-3 rounded-xl text-[11px] font-black uppercase tracking-widest ${plan.btn} transition-all text-white`}>
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>

            {/* Integration Info */}
            <div className="bg-[#0D0D0D] border border-[#D4AF37]/10 rounded-2xl p-5">
              <div className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest mb-3">🌐 Ekosistem Integration</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { icon: '🌿', label: 'GANI HYPHA', desc: 'Master Control & AI Hub' },
                  { icon: '🔵', label: '$PREMALTA', desc: 'Bootstrap Token Revenue' },
                  { icon: '💈', label: 'Sovereign Barber', desc: 'Community Node Connect' },
                  { icon: '🎁', label: 'SHGA Bundle', desc: 'Family Eid Gift Bundle' },
                ].map((item, i) => (
                  <div key={i} className="bg-[#141414] border border-[#1E1E1E] rounded-xl p-3 text-center">
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

export default SovereignLegacy;
