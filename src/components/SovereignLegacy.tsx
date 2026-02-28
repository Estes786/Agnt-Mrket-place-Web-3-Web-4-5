
// ============================================================
// 🏛️ SOVEREIGN LEGACY (SL) v2.0 — "The Family Sanctuary"
// AI-Powered Family Legacy Vault, Home OS & Digital Succession
// Revenue Engine: Rp 299K - 1.999M / bulan
// Part of GANI HYPHA Sovereign Agent Ecosystem
// Design: "Modern Heritage" — Deep Charcoal + Antique Gold
// NEW v2.0: DID generator, vault upload sim, task AI, 
//           treasury charts, succession timeline, WhatsApp alerts
// ============================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SovereignNavBar, SovereignFooter } from './LandingNav';

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
  phone?: string;
  email?: string;
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
  views: number;
}

interface TreasuryAsset {
  id: string;
  name: string;
  type: 'savings' | 'investment' | 'crypto' | 'property' | 'hypha';
  value: number;
  currency: 'IDR' | 'USD' | 'ETH' | 'HYPHA';
  change24h: number;
  icon: string;
  institution?: string;
}

interface HomeTask {
  id: string;
  title: string;
  category: 'maintenance' | 'bill' | 'health' | 'education' | 'event' | 'legal';
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo: string;
  status: 'todo' | 'in-progress' | 'done';
  emoji: string;
  isAiGenerated?: boolean;
  cost?: number;
}

interface SuccessionRule {
  id: string;
  asset: string;
  beneficiary: string;
  percentage: number;
  condition: string;
  isActive: boolean;
  triggerDate?: string;
  contractAddress?: string;
}

interface AIMessage {
  role: 'user' | 'ai';
  msg: string;
  time: Date;
}

interface UploadForm {
  name: string;
  category: string;
  accessLevel: string;
  description: string;
}

// ─── MOCK DATA ─────────────────────────────────────────────
const FAMILY_MEMBERS: FamilyMember[] = [
  { id: 'f1', name: 'Ahmad Gani', role: 'Head', avatar: '👨‍💼', did: 'did:web5:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK', keyHolder: true, shardIndex: 1, hyphaBalance: 5000, lastSeen: '2 menit lalu', phone: '6281234567890', email: 'ahmad@ganihypha.com' },
  { id: 'f2', name: 'Siti Rahayu', role: 'Spouse', avatar: '👩‍💼', did: 'did:web5:z6MkrCD1csqtgdj8sjrsu57Znb2bxp5wqFnX9Dj3ctGqRkHD', keyHolder: true, shardIndex: 2, hyphaBalance: 3200, lastSeen: '1 jam lalu', phone: '6281345678901' },
  { id: 'f3', name: 'Raffi Gani', role: 'Child', avatar: '👦', keyHolder: false, hyphaBalance: 800, lastSeen: '3 jam lalu' },
  { id: 'f4', name: 'Nayla Gani', role: 'Child', avatar: '👧', keyHolder: false, hyphaBalance: 600, lastSeen: '2 hari lalu' },
];

const VAULT_DOCS: VaultDocument[] = [
  { id: 'v1', name: 'Surat Wasiat Ahmad Gani 2026', category: 'will', ipfsCid: 'QmYwAPJzv5CZsnAzt8auV39s19G7A3cC3Uv', uploadDate: '2026-01-15', size: '245 KB', isEncrypted: true, accessLevel: 'private', emoji: '📜', owner: 'Ahmad Gani', views: 2 },
  { id: 'v2', name: 'Sertifikat Rumah Jl. Melati No.12', category: 'deed', ipfsCid: 'QmZ8bNwkRfT4mXuVa9L1pK3qM5sRtY7wE2n', uploadDate: '2025-11-20', size: '1.2 MB', isEncrypted: true, accessLevel: 'family', emoji: '🏠', owner: 'Ahmad Gani', views: 5 },
  { id: 'v3', name: 'Polis Asuransi Jiwa - Prudential', category: 'insurance', ipfsCid: 'QmA9cOpLsU5nYvW3zX8bQ2pL4mK6tN1hR7j', uploadDate: '2026-02-01', size: '384 KB', isEncrypted: true, accessLevel: 'family', emoji: '🛡️', owner: 'Siti Rahayu', views: 1 },
  { id: 'v4', name: 'KTP & KK Keluarga Gani', category: 'identity', ipfsCid: 'QmB1dPmMtV6oZxX4cW9fA3rN2sK7uT5bL8e', uploadDate: '2025-12-10', size: '2.1 MB', isEncrypted: true, accessLevel: 'family', emoji: '🪪', owner: 'Ahmad Gani', views: 8 },
  { id: 'v5', name: 'Portfolio Saham BEI 2026', category: 'investment', ipfsCid: 'QmC2eQnNuW7pAyY6dV0gB4oM1tH3rP9kJ5x', uploadDate: '2026-02-14', size: '156 KB', isEncrypted: true, accessLevel: 'private', emoji: '📊', owner: 'Ahmad Gani', views: 3 },
  { id: 'v6', name: 'Foto & Video Pernikahan 2015', category: 'sentimental', ipfsCid: 'QmD3fRoOvX8qBzZh5E7wC1pN2sM4tK6gL9y', uploadDate: '2026-01-28', size: '45.2 MB', isEncrypted: false, accessLevel: 'family', emoji: '📸', owner: 'Siti Rahayu', views: 12 },
  { id: 'v7', name: 'Medical Records Keluarga', category: 'medical', ipfsCid: 'QmE4gSpPwY9rCaAi6F8xD2qO3tN5uL7hM1z', uploadDate: '2026-02-20', size: '890 KB', isEncrypted: true, accessLevel: 'emergency', emoji: '🏥', owner: 'Ahmad Gani', views: 0 },
];

const TREASURY_ASSETS: TreasuryAsset[] = [
  { id: 't1', name: 'Tabungan BCA Family', type: 'savings', value: 85000000, currency: 'IDR', change24h: 0, icon: '🏦', institution: 'Bank BCA' },
  { id: 't2', name: 'Reksa Dana Trimegah', type: 'investment', value: 124500000, currency: 'IDR', change24h: 2.4, icon: '📈', institution: 'Trimegah AM' },
  { id: 't3', name: '$HYPHA Staking Pool', type: 'hypha', value: 9600, currency: 'HYPHA', change24h: 8.2, icon: '🌿', institution: 'GANI HYPHA' },
  { id: 't4', name: 'ETH (Alchemy Wallet)', type: 'crypto', value: 0.75, currency: 'ETH', change24h: -1.2, icon: '⟠', institution: 'Ethereum' },
  { id: 't5', name: 'Rumah Jl. Melati No.12', type: 'property', value: 1800000000, currency: 'IDR', change24h: 0.1, icon: '🏠', institution: 'Properti' },
  { id: 't6', name: 'BPJS Ketenagakerjaan JHT', type: 'investment', value: 45000000, currency: 'IDR', change24h: 0.5, icon: '🛡️', institution: 'BPJS' },
];

const HOME_TASKS: HomeTask[] = [
  { id: 'ht1', title: 'Ganti filter air PDAM', category: 'maintenance', dueDate: '2026-02-28', priority: 'high', assignedTo: 'Ahmad Gani', status: 'todo', emoji: '💧', isAiGenerated: true, cost: 150000 },
  { id: 'ht2', title: 'Bayar tagihan PLN Maret', category: 'bill', dueDate: '2026-03-05', priority: 'critical', assignedTo: 'Siti Rahayu', status: 'todo', emoji: '⚡', cost: 350000 },
  { id: 'ht3', title: 'Servis AC — 6 bulan sekali', category: 'maintenance', dueDate: '2026-03-10', priority: 'medium', assignedTo: 'Ahmad Gani', status: 'in-progress', emoji: '❄️', isAiGenerated: true, cost: 200000 },
  { id: 'ht4', title: 'Medical Check Up Tahunan', category: 'health', dueDate: '2026-03-15', priority: 'high', assignedTo: 'Semua', status: 'todo', emoji: '🏥', isAiGenerated: true, cost: 800000 },
  { id: 'ht5', title: 'Ambil Raport Raffi — SMP Negeri 5', category: 'education', dueDate: '2026-03-20', priority: 'medium', assignedTo: 'Siti Rahayu', status: 'todo', emoji: '📚' },
  { id: 'ht6', title: 'Bayar Tagihan PDAM', category: 'bill', dueDate: '2026-02-27', priority: 'critical', assignedTo: 'Ahmad Gani', status: 'done', emoji: '🚿', cost: 120000 },
  { id: 'ht7', title: 'Perpanjang SIM A Ahmad Gani', category: 'legal', dueDate: '2026-04-01', priority: 'medium', assignedTo: 'Ahmad Gani', status: 'todo', emoji: '🪪', isAiGenerated: true, cost: 120000 },
  { id: 'ht8', title: 'Bayar Premi Asuransi Bulanan', category: 'bill', dueDate: '2026-03-01', priority: 'high', assignedTo: 'Ahmad Gani', status: 'todo', emoji: '🛡️', cost: 750000 },
];

const SUCCESSION_RULES: SuccessionRule[] = [
  { id: 'sr1', asset: 'Rumah Jl. Melati No.12', beneficiary: 'Siti Rahayu', percentage: 100, condition: 'Utama — transfer langsung saat kepala keluarga tiada', isActive: true, contractAddress: '0xC0125651a46BDEea72a73A1C1A75b82e0E2C94c7' },
  { id: 'sr2', asset: 'Tabungan & Investasi', beneficiary: 'Siti Rahayu (60%) + Anak-anak (40%)', percentage: 100, condition: 'Dibagi merata setelah 40 hari sesuai syariat Islam', isActive: true },
  { id: 'sr3', asset: '$HYPHA Token', beneficiary: 'Raffi Gani', percentage: 70, condition: 'Token unlock secara bertahap saat usia 21 tahun', isActive: true, triggerDate: '2033-06-15' },
  { id: 'sr4', asset: 'BPJS Ketenagakerjaan', beneficiary: 'Siti Rahayu', percentage: 100, condition: 'Klaim via aplikasi BPJS dalam 30 hari', isActive: true },
];

// ─── UTILITY ──────────────────────────────────────────────
const CAT_CONFIG = {
  will: { color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', label: 'Wasiat' },
  deed: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: 'Sertifikat' },
  insurance: { color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', label: 'Asuransi' },
  identity: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', label: 'Identitas' },
  investment: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Investasi' },
  medical: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Medis' },
  sentimental: { color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20', label: 'Kenangan' },
  legal: { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', label: 'Legal' },
};

const PRIORITY_CONFIG = {
  critical: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', dot: 'bg-red-500', label: 'Kritis 🚨' },
  high: { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', dot: 'bg-orange-400', label: 'Tinggi ⬆️' },
  medium: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', dot: 'bg-yellow-400', label: 'Sedang ➡️' },
  low: { color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', dot: 'bg-slate-400', label: 'Rendah ⬇️' },
};

const formatRp = (n: number) => `Rp ${n.toLocaleString('id')}`;
const shortenDid = (did: string) => `${did.slice(0, 18)}...${did.slice(-6)}`;

// ─── AI LEGACY RESPONSES ──────────────────────────────────
const getLegacyAIReply = (
  msg: string,
  ctx: { docs: VaultDocument[]; tasks: HomeTask[]; assets: TreasuryAsset[]; criticalTasks: number; totalIDR: number }
) => {
  const lower = msg.toLowerCase();
  const { docs, tasks, assets, criticalTasks, totalIDR } = ctx;
  const hypha = assets.find(a => a.type === 'hypha');

  if (lower.includes('vault') || lower.includes('dokumen') || lower.includes('wasiat') || lower.includes('sertifikat')) {
    return `🔐 **Legacy Vault — ${docs.length} Dokumen:**\n\n${docs.map(d => `${d.emoji} **${d.name}**\n   📍 IPFS: ${d.ipfsCid.slice(0, 20)}...\n   🔒 ${d.isEncrypted ? 'AES-256 Encrypted' : 'Plain'} · 👁️ ${d.accessLevel === 'private' ? 'Private' : d.accessLevel === 'family' ? 'Family' : '🆘 Emergency'} · ${d.views}x dilihat`).join('\n\n')}\n\n✅ ${docs.filter(d => d.isEncrypted).length}/${docs.length} dokumen terenkripsi AES-256\n💡 Saran: Perbarui Surat Wasiat setiap 6 bulan atau setelah perubahan aset besar.`;
  }

  if (lower.includes('treasury') || lower.includes('aset') || lower.includes('harta') || lower.includes('kekayaan') || lower.includes('total')) {
    const propValue = assets.filter(a => a.type === 'property').reduce((s, a) => s + a.value, 0);
    const invValue = assets.filter(a => a.type === 'investment' || a.type === 'savings').reduce((s, a) => s + a.value, 0);
    return `💰 **Family Treasury Overview:**\n\n${assets.map(a => `${a.icon} **${a.name}** (${a.institution || a.type})\n   ${a.currency === 'IDR' ? formatRp(a.value) : `${a.value} ${a.currency}`} ${a.change24h > 0 ? `📈 +${a.change24h}%` : a.change24h < 0 ? `📉 ${a.change24h}%` : '•'}`).join('\n')}\n\n💎 **Total Net Worth IDR: ${formatRp(totalIDR)}**\n🏠 Properti: ${formatRp(propValue)} (${Math.round(propValue / totalIDR * 100)}%)\n📊 Investasi+Tabungan: ${formatRp(invValue)}\n🌿 $HYPHA: ${hypha?.value.toLocaleString() || 0} HYPHA\n\n📈 Estimasi pertumbuhan 12.4% YoY`;
  }

  if (lower.includes('tugas') || lower.includes('rumah') || lower.includes('maintenance') || lower.includes('bayar') || lower.includes('tagihan')) {
    const pending = tasks.filter(t => t.status !== 'done');
    const totalCost = pending.filter(t => t.cost).reduce((s, t) => s + (t.cost || 0), 0);
    return `🏡 **Home OS — ${pending.length} Tugas Tertunda:**\n\n${pending.map(t => `${t.emoji} **${t.title}**\n   📅 Due: ${t.dueDate} · 👤 ${t.assignedTo}\n   ${PRIORITY_CONFIG[t.priority].label}${t.cost ? ` · Est: ${formatRp(t.cost)}` : ''}`).join('\n\n')}\n\n⚠️ **${criticalTasks} tugas KRITIS** perlu diselesaikan segera!\n💰 Total estimasi pengeluaran: **${formatRp(totalCost)}**\n\n💡 AI akan kirim reminder WhatsApp H-3 sebelum jatuh tempo ke masing-masing anggota keluarga.`;
  }

  if (lower.includes('suksesi') || lower.includes('waris') || lower.includes('succession') || lower.includes('warisan') || lower.includes('meninggal')) {
    return `📜 **Succession Protocol v2.0:**\n\n${SUCCESSION_RULES.map(r => `✅ **${r.asset}**\n   → ${r.beneficiary} (${r.percentage}%)\n   📋 "${r.condition}"${r.contractAddress ? `\n   🔗 Contract: ${r.contractAddress.slice(0, 15)}...` : ''}`).join('\n\n')}\n\n⚙️ **Dead Man's Switch:** AKTIF\n   Trigger: 180 hari tanpa aktivitas\n   Last ping: Hari ini (0 hari)\n\n🔑 **Key Shards:** 2/4 aktif (butuh 3/4 untuk unlock)\n\n💡 Review succession rules bersama notaris setiap tahun.`;
  }

  if (lower.includes('hypha') || lower.includes('token') || lower.includes('reward') || lower.includes('staking')) {
    const totalHypha = FAMILY_MEMBERS.reduce((s, m) => s + m.hyphaBalance, 0);
    const monthlyReward = Math.round(totalHypha * 0.184 / 12);
    return `🌿 **$HYPHA Family Treasury:**\n\n${FAMILY_MEMBERS.map(m => `${m.avatar} **${m.name}**: ${m.hyphaBalance.toLocaleString()} $HYPHA`).join('\n')}\n\n📊 Total staked: **${totalHypha.toLocaleString()} HYPHA**\n📈 APY: **18.4%** (GANI HYPHA Pool)\n💰 Reward/bulan: **~${monthlyReward.toLocaleString()} $HYPHA**\n\n💡 Tips: Upload dokumen & selesaikan Home OS tasks untuk earn tambahan $HYPHA rewards!\n• Upload dokumen = 5 $HYPHA\n• Selesaikan task = 2 $HYPHA\n• Referral keluarga baru = 100 $HYPHA`;
  }

  if (lower.includes('keamanan') || lower.includes('security') || lower.includes('enkripsi') || lower.includes('did') || lower.includes('web5')) {
    return `🔐 **Security Status — Full Report:**\n\n✅ AES-256 Encryption: AKTIF\n✅ IPFS via Pinata: CONNECTED (49.1 MB)\n✅ Web5 DID — Ahmad: ${shortenDid(FAMILY_MEMBERS[0].did!)}\n✅ Web5 DID — Siti: ${shortenDid(FAMILY_MEMBERS[1].did!)}\n🔑 Key Shards: 2/4 (Ahmad + Siti)\n⚠️ Disarankan 4/4 — tambah 2 trusted guardian\n\n🛡️ **Security Score: 78/100**\nKurang: Shard #3 & #4 belum assign\n\n🔮 ZKP (Zero-Knowledge Proof): 📅 Planned Q3 2026\n📊 On-chain audit log: Semua akses tercatat\n🌐 DWN Sync: 78.4% (Decentralized Web Node)`;
  }

  if (lower.includes('did') || lower.includes('generate') || lower.includes('buat did') || lower.includes('identitas digital')) {
    return `🆔 **Web5 DID Generator:**\n\nFormat: did:web5:z6Mk[32-char-identifier]\n\n${FAMILY_MEMBERS.filter(m => m.did).map(m => `${m.avatar} **${m.name}**\n   ${m.did}`).join('\n\n')}\n\n📋 Anggota belum punya DID: ${FAMILY_MEMBERS.filter(m => !m.did).map(m => m.name).join(', ')}\n\n💡 DID (Decentralized Identifier) memungkinkan identitas digital yang aman dan private tanpa server terpusat. Powered by Web5 TBD.`;
  }

  if (lower.includes('alert') || lower.includes('whatsapp') || lower.includes('kirim') || lower.includes('notif')) {
    return `📱 **WhatsApp Alert System:**\n\n✅ Alert otomatis aktif untuk:\n• H-3 sebelum jatuh tempo tagihan/tugas\n• Saldo aset turun >5%\n• Dokumen vault diakses\n• Dead Man's Switch reminder (30 hari)\n• $HYPHA reward masuk\n\n📬 Nomor terdaftar:\n${FAMILY_MEMBERS.filter(m => m.phone).map(m => `• ${m.avatar} ${m.name}: +${m.phone?.slice(0, 5)}xxxxx`).join('\n')}\n\n💡 Integasi via WhatsApp Business API + n8n webhook GANI HYPHA.`;
  }

  return `🏛️ **Sovereign Legacy AI v2.0 — Family Sanctuary**\n\nSaya adalah penjaga digital warisan keluarga Anda!\n\nSaya bisa membantu dengan:\n• 🔐 **Vault** — "Tampilkan semua dokumen vault"\n• 💰 **Treasury** — "Hitung total kekayaan keluarga"\n• 🏡 **Home OS** — "Tugas rumah yang mendekati deadline"\n• 📜 **Suksesi** — "Tampilkan aturan warisan"\n• 🌿 **$HYPHA** — "Status staking rewards"\n• 🔒 **Keamanan** — "Status enkripsi dan DID Web5"\n• 📱 **Alert** — "Setup WhatsApp notification"\n• 🆔 **DID** — "Buat identitas digital Web5"\n\nTanyakan saja — saya siap menjaga warisan digital Anda! 🙏🏻`;
};

// ─── MAIN COMPONENT ───────────────────────────────────────
const SovereignLegacy: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hearth' | 'vault' | 'treasury' | 'home-os' | 'succession' | 'plans'>('hearth');
  const [homeTasks, setHomeTasks] = useState<HomeTask[]>(HOME_TASKS);
  const [vaultDocs, setVaultDocs] = useState<VaultDocument[]>(VAULT_DOCS);
  const [aiChat, setAiChat] = useState<AIMessage[]>([
    { role: 'ai', msg: '🏛️ Selamat datang di **Sovereign Legacy AI v2.0** — Penjaga Warisan Keluarga Anda.\n\nSaya siap membantu:\n• 🔐 Kelola Legacy Vault dokumen penting\n• 💰 Pantau Family Treasury & net worth\n• 🏡 Automasi tugas rumah tangga via Home OS\n• 📜 Setup Succession Protocol otomatis\n• 🌿 Manajemen $HYPHA staking rewards\n\nAda yang bisa saya bantu, Tuan Rumah? 🙏🏻', time: new Date() }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [vaultSearch, setVaultSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [uploadForm, setUploadForm] = useState<UploadForm>({ name: '', category: 'will', accessLevel: 'family', description: '' });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [generatingDid, setGeneratingDid] = useState<string | null>(null);
  const [memberDids, setMemberDids] = useState<Record<string, string>>({
    f1: FAMILY_MEMBERS[0].did || '',
    f2: FAMILY_MEMBERS[1].did || '',
  });
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', category: 'bill', priority: 'medium', dueDate: '', assignedTo: 'Ahmad Gani', cost: '' });
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiChat]);

  useEffect(() => {
    if (notification) {
      const t = setTimeout(() => setNotification(null), 3500);
      return () => clearTimeout(t);
    }
  }, [notification]);

  // Summary stats
  const totalAssetIDR = TREASURY_ASSETS.filter(a => a.currency === 'IDR').reduce((s, a) => s + a.value, 0);
  const criticalTasks = homeTasks.filter(t => t.priority === 'critical' && t.status !== 'done').length;
  const vaultCount = vaultDocs.length;
  const hyphaStaked = TREASURY_ASSETS.find(a => a.type === 'hypha')?.value || 0;
  const totalHypha = FAMILY_MEMBERS.reduce((s, m) => s + m.hyphaBalance, 0);

  // AI handler
  const handleAiSend = useCallback(async () => {
    if (!aiInput.trim()) return;
    const userMsg = aiInput.trim();
    setAiInput('');
    setAiChat(prev => [...prev, { role: 'user', msg: userMsg, time: new Date() }]);
    setIsAiTyping(true);
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 500));
    const aiReply = getLegacyAIReply(userMsg, { docs: vaultDocs, tasks: homeTasks, assets: TREASURY_ASSETS, criticalTasks, totalIDR: totalAssetIDR });
    setAiChat(prev => [...prev, { role: 'ai', msg: aiReply, time: new Date() }]);
    setIsAiTyping(false);
  }, [aiInput, vaultDocs, homeTasks, criticalTasks, totalAssetIDR]);

  const updateTaskStatus = (id: string, status: HomeTask['status']) => {
    setHomeTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    const task = homeTasks.find(t => t.id === id)!;
    if (status === 'done') setNotification({ msg: `✅ "${task.title}" selesai! +2 $HYPHA earned!`, type: 'success' });
  };

  const handleUpload = async () => {
    if (!uploadForm.name) { setNotification({ msg: '⚠️ Nama dokumen wajib diisi!', type: 'error' }); return; }
    setIsUploading(true);
    setUploadProgress(0);
    setUploadDone(false);
    for (let i = 0; i <= 100; i += Math.floor(Math.random() * 15 + 5)) {
      await new Promise(r => setTimeout(r, 180 + Math.random() * 120));
      setUploadProgress(Math.min(i, 100));
    }
    setUploadProgress(100);
    const newCid = 'Qm' + Math.random().toString(36).substring(2, 34).toUpperCase();
    const newDoc: VaultDocument = {
      id: `v${Date.now()}`,
      name: uploadForm.name,
      category: uploadForm.category as VaultDocument['category'],
      ipfsCid: newCid,
      uploadDate: new Date().toISOString().split('T')[0],
      size: `${(Math.random() * 4 + 0.1).toFixed(1)} MB`,
      isEncrypted: true,
      accessLevel: uploadForm.accessLevel as VaultDocument['accessLevel'],
      emoji: (CAT_CONFIG as any)[uploadForm.category]?.label ? '📄' : '📄',
      owner: 'Ahmad Gani',
      views: 0,
    };
    setVaultDocs(prev => [newDoc, ...prev]);
    setIsUploading(false);
    setUploadDone(true);
    setNotification({ msg: `✅ "${uploadForm.name}" berhasil upload ke IPFS! +5 $HYPHA earned!`, type: 'success' });
    setTimeout(() => { setShowUploadForm(false); setUploadDone(false); setUploadForm({ name: '', category: 'will', accessLevel: 'family', description: '' }); }, 2000);
  };

  const handleGenerateDid = async (memberId: string) => {
    setGeneratingDid(memberId);
    await new Promise(r => setTimeout(r, 1500));
    const newDid = `did:web5:z6Mk${Math.random().toString(36).substring(2, 20)}${Math.random().toString(36).substring(2, 20)}`;
    setMemberDids(prev => ({ ...prev, [memberId]: newDid }));
    setGeneratingDid(null);
    setNotification({ msg: `🆔 DID Web5 berhasil dibuat! Identity sovereign Anda aktif.`, type: 'success' });
  };

  const handleAddTask = () => {
    if (!newTask.title || !newTask.dueDate) { setNotification({ msg: '⚠️ Judul dan tanggal wajib!', type: 'error' }); return; }
    const cat = newTask.category as HomeTask['category'];
    const emoji = cat === 'bill' ? '💳' : cat === 'health' ? '🏥' : cat === 'maintenance' ? '🔧' : cat === 'education' ? '📚' : cat === 'legal' ? '⚖️' : '📋';
    setHomeTasks(prev => [{
      id: `ht${Date.now()}`, title: newTask.title, category: cat, dueDate: newTask.dueDate,
      priority: newTask.priority as HomeTask['priority'], assignedTo: newTask.assignedTo,
      status: 'todo', emoji, cost: newTask.cost ? parseInt(newTask.cost) : undefined
    }, ...prev]);
    setShowTaskForm(false);
    setNewTask({ title: '', category: 'bill', priority: 'medium', dueDate: '', assignedTo: 'Ahmad Gani', cost: '' });
    setNotification({ msg: '✅ Task berhasil ditambahkan!', type: 'success' });
  };

  const openWhatsApp = (phone: string, name: string, msg: string) => {
    const encoded = encodeURIComponent(`Halo ${name} 👋\n\n${msg}\n\n_Sovereign Legacy AI — GANI HYPHA_`);
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
  };

  const filteredDocs = vaultDocs.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(vaultSearch.toLowerCase());
    const matchCat = selectedCategory === 'all' || d.category === selectedCategory;
    return matchSearch && matchCat;
  });

  // ─── RENDER ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">

      {/* Sovereign Ecosystem Navigator */}
      <SovereignNavBar
        currentAgent="legacy"
        onCtaClick={() => window.location.href = '/legacy-landing#pricing'}
        ctaLabel="Upgrade Plan"
      />
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-2xl text-sm font-black max-w-sm transition-all ${
          notification.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' :
          notification.type === 'error' ? 'bg-red-500/20 border-red-500/30 text-red-300' :
          'bg-violet-500/20 border-violet-500/30 text-violet-300'
        }`}>
          {notification.msg}
        </div>
      )}

      {/* ── HEADER ── */}
      <div className="bg-gradient-to-r from-[#0D0D0D] via-[#111015] to-[#0D0D0D] border-b border-[#D4AF37]/15 px-4 md:px-6 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2A1F60] to-[#1A1240] flex items-center justify-center text-2xl shadow-lg shadow-violet-900/20 border border-[#D4AF37]/20 flex-shrink-0">
              🏛️
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-black text-white tracking-tight">SOVEREIGN LEGACY</h1>
                <span className="text-[9px] font-black bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/25 px-2 py-0.5 rounded-full uppercase tracking-widest">
                  SMA Instance v2.0
                </span>
                {criticalTasks > 0 && (
                  <span className="text-[9px] font-black bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full uppercase animate-pulse">
                    🚨 {criticalTasks} Kritis
                  </span>
                )}
              </div>
              <p className="text-[10px] font-mono text-[#D4AF37]/50 uppercase tracking-widest">"The Family Sanctuary" · Legacy Vault + Home OS · GANI HYPHA</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-3 py-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">🔐 AES-256 · IPFS · Web5</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {[
            { label: 'Net Worth Keluarga', value: `Rp ${(totalAssetIDR / 1000000000).toFixed(2)}M`, icon: '💎', color: 'text-[#D4AF37]', sub: '+12.4% YoY' },
            { label: 'Dokumen di Vault', value: `${vaultCount} file`, icon: '🔐', color: 'text-violet-400', sub: `${vaultDocs.filter(d => d.isEncrypted).length} terenkripsi` },
            { label: '$HYPHA Staked', value: `${hyphaStaked.toLocaleString()}`, icon: '🌿', color: 'text-emerald-400', sub: 'APY 18.4%' },
            { label: 'Tugas Kritis', value: `${criticalTasks} tugas`, icon: '🚨', color: criticalTasks > 0 ? 'text-red-400' : 'text-emerald-400', sub: criticalTasks > 0 ? 'Perlu perhatian!' : 'Semua aman ✅' },
          ].map((stat, i) => (
            <div key={i} className="bg-[#141414] border border-[#1E1E1E] rounded-2xl p-3 hover:border-[#D4AF37]/15 transition-all">
              <div className="text-lg mb-1">{stat.icon}</div>
              <div className={`text-sm font-black ${stat.color}`}>{stat.value}</div>
              <div className="text-[9px] font-mono text-slate-700 uppercase tracking-widest">{stat.label}</div>
              <div className="text-[8px] text-slate-700 mt-0.5">{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="flex gap-1 px-4 md:px-6 pt-4 pb-0 overflow-x-auto scrollbar-hide">
        {[
          { id: 'hearth', icon: '🔥', label: 'Hearth' },
          { id: 'vault', icon: '🔐', label: 'Vault' },
          { id: 'treasury', icon: '💎', label: 'Treasury' },
          { id: 'home-os', icon: '🏡', label: 'Home OS' },
          { id: 'succession', icon: '📜', label: 'Suksesi' },
          { id: 'plans', icon: '💼', label: 'Plans' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-1.5 px-3 md:px-4 py-2.5 rounded-t-xl text-[10px] md:text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all relative ${
              activeTab === tab.id
                ? 'bg-[#141414] border border-b-0 border-[#D4AF37]/20 text-[#D4AF37]'
                : 'text-slate-600 hover:text-slate-400'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.id === 'home-os' && criticalTasks > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-[7px] flex items-center justify-center font-black">{criticalTasks}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── CONTENT ── */}
      <div className="p-4 md:p-6 bg-[#141414] border border-[#D4AF37]/8 mx-4 md:mx-6 mb-6 rounded-b-2xl rounded-tr-2xl">

        {/* ── TAB: FAMILY HEARTH ── */}
        {activeTab === 'hearth' && (
          <div className="space-y-6">
            <h2 className="text-base font-black text-white uppercase tracking-widest">🔥 Family Hearth — Central Hub</h2>

            {/* Critical Alert */}
            {criticalTasks > 0 && (
              <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4">
                <div className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-3">🚨 TUGAS KRITIS — Perhatian Segera!</div>
                {homeTasks.filter(t => t.priority === 'critical' && t.status !== 'done').map(t => (
                  <div key={t.id} className="flex items-center justify-between py-2 border-b border-red-500/10 last:border-0">
                    <div className="flex items-center gap-2">
                      <span>{t.emoji}</span>
                      <div>
                        <span className="text-xs font-black text-red-300">{t.title}</span>
                        <div className="text-[9px] text-red-500 font-mono">Due: {t.dueDate} · {t.assignedTo}{t.cost ? ` · ${formatRp(t.cost)}` : ''}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {FAMILY_MEMBERS.find(m => m.phone && m.name === t.assignedTo) && (
                        <button onClick={() => openWhatsApp(FAMILY_MEMBERS.find(m => m.name === t.assignedTo)!.phone!, t.assignedTo, `⚠️ Reminder tugas kritis: *${t.title}* due ${t.dueDate}`)}
                          className="text-[8px] font-black bg-emerald-500/10 border border-emerald-500/15 text-emerald-400 px-2 py-1 rounded-lg hover:bg-emerald-500/20 transition-all">
                          📱 WA
                        </button>
                      )}
                      <button onClick={() => updateTaskStatus(t.id, 'done')} className="text-[8px] font-black bg-red-500/20 border border-red-500/20 text-red-300 px-2 py-1 rounded-lg hover:bg-red-500/30 transition-all">
                        ✓ Selesai
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Family Members */}
            <div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">👨‍👩‍👧‍👦 Anggota Keluarga — Identitas Digital</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {FAMILY_MEMBERS.map(m => {
                  const hasDid = !!memberDids[m.id];
                  return (
                    <div key={m.id} className={`p-4 rounded-2xl border transition-all ${hasDid ? 'bg-[#0F0D1F] border-violet-500/20' : 'bg-[#0D0D0D] border-[#1E1E1E]'}`}>
                      <div className="text-center">
                        <div className="text-3xl mb-2">{m.avatar}</div>
                        <div className="text-xs font-black text-white mb-0.5">{m.name}</div>
                        <div className="text-[9px] font-mono text-slate-600 mb-2">{m.role}</div>
                        {m.keyHolder && (
                          <div className="flex items-center justify-center gap-1 bg-violet-500/10 border border-violet-500/20 rounded-full px-2 py-0.5 mb-2">
                            <span className="text-[8px] font-black text-violet-400">🔑 Shard #{m.shardIndex}</span>
                          </div>
                        )}
                        {hasDid ? (
                          <div className="text-[7px] font-mono text-violet-600 mb-2 break-all leading-tight">{shortenDid(memberDids[m.id])}</div>
                        ) : (
                          <button onClick={() => handleGenerateDid(m.id)} disabled={generatingDid === m.id}
                            className="text-[7px] font-black bg-violet-500/10 border border-violet-500/15 text-violet-400 px-2 py-1 rounded-lg w-full mb-2 hover:bg-violet-500/20 transition-all disabled:opacity-50">
                            {generatingDid === m.id ? '⏳ Generating...' : '🆔 Generate DID'}
                          </button>
                        )}
                        <div className="flex items-center justify-center gap-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5 mb-1">
                          <span className="text-[8px] font-black text-emerald-400">{m.hyphaBalance.toLocaleString()} $HYPHA</span>
                        </div>
                        <div className="text-[7px] font-mono text-slate-700">{m.lastSeen}</div>
                        {m.phone && (
                          <button onClick={() => openWhatsApp(m.phone!, m.name, '🏛️ Sovereign Legacy — Family update tersedia. Cek dashboard untuk info terbaru.')}
                            className="mt-2 w-full text-[7px] font-black bg-emerald-500/10 border border-emerald-500/15 text-emerald-400 py-1 rounded-lg hover:bg-emerald-500/20 transition-all">
                            📱 Kirim WA
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Legacy Advisor Chat */}
            <div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">🤖 Legacy AI Advisor</div>
              <div className="bg-[#0D0D0D] border border-[#1E1E1E] rounded-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-[#1E1E1E] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-violet-400 uppercase tracking-widest">Sovereign Legacy AI · Groq llama-3.3-70b</span>
                  </div>
                  <span className="text-[8px] font-mono text-slate-700">{aiChat.length} pesan</span>
                </div>
                <div className="h-64 overflow-y-auto p-4 space-y-3 scrollbar-hide">
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
                        <div className="text-[7px] text-slate-700 mt-1 text-right">
                          {msg.time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </div>
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
                        <div className="flex gap-1">{[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}</div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                <div className="px-3 pb-1 flex gap-1 flex-wrap border-t border-[#1E1E1E] pt-2">
                  {['Status vault', 'Total kekayaan', 'Tugas kritis', 'Aturan waris', '$HYPHA staking', 'Status keamanan', 'Setup DID'].map(q => (
                    <button key={q} onClick={() => setAiInput(q)} className="text-[7px] font-black bg-[#141414] border border-[#1E1E1E] text-slate-600 hover:text-[#D4AF37] hover:border-[#D4AF37]/20 px-2 py-1 rounded-lg transition-all">
                      {q}
                    </button>
                  ))}
                </div>
                <div className="px-3 pb-3 flex gap-2 mt-1">
                  <input value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !isAiTyping && handleAiSend()}
                    placeholder="Tanya Legacy AI Advisor..."
                    className="flex-1 bg-[#1A1A1A] border border-[#1E1E1E] text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-violet-500/30 placeholder-slate-700 transition-all" />
                  <button onClick={handleAiSend} disabled={!aiInput.trim() || isAiTyping}
                    className="bg-gradient-to-r from-violet-700 to-purple-800 disabled:opacity-40 hover:from-violet-600 hover:to-purple-700 text-white px-4 py-2.5 rounded-xl text-xs font-black transition-all border border-violet-500/20">
                    🏛️
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: LEGACY VAULT ── */}
        {activeTab === 'vault' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-base font-black text-white uppercase tracking-widest">🔐 Legacy Vault — {vaultCount} Dokumen</h2>
              <button onClick={() => setShowUploadForm(v => !v)}
                className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#C9A227] text-black px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all">
                {showUploadForm ? '✕ Tutup' : '➕ Upload Dokumen'}
              </button>
            </div>

            {/* Upload Form */}
            {showUploadForm && (
              <div className="bg-[#0D0D0D] border border-[#D4AF37]/20 rounded-2xl p-5 space-y-4">
                <div className="text-sm font-black text-[#D4AF37] uppercase">📤 Upload & Enkripsi ke IPFS via Pinata</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Nama Dokumen *</label>
                    <input value={uploadForm.name} onChange={e => setUploadForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="Contoh: Surat Wasiat 2026..."
                      className="w-full bg-[#141414] border border-[#1E1E1E] text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#D4AF37]/30 transition-all" />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Kategori</label>
                    <select value={uploadForm.category} onChange={e => setUploadForm(p => ({ ...p, category: e.target.value }))}
                      className="w-full bg-[#141414] border border-[#1E1E1E] text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#D4AF37]/30 transition-all">
                      <option value="will">📜 Surat Wasiat</option>
                      <option value="deed">🏠 Sertifikat/Akta</option>
                      <option value="insurance">🛡️ Asuransi</option>
                      <option value="identity">🪪 Identitas (KTP/KK/Passport)</option>
                      <option value="investment">📊 Investasi/Saham</option>
                      <option value="medical">🏥 Rekam Medis</option>
                      <option value="sentimental">📸 Kenangan Keluarga</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Level Akses</label>
                    <select value={uploadForm.accessLevel} onChange={e => setUploadForm(p => ({ ...p, accessLevel: e.target.value }))}
                      className="w-full bg-[#141414] border border-[#1E1E1E] text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#D4AF37]/30 transition-all">
                      <option value="private">🔒 Private — Hanya pemilik</option>
                      <option value="family">👨‍👩‍👧‍👦 Family — Semua anggota keluarga</option>
                      <option value="emergency">🆘 Emergency — Semua + Guardian</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">File Upload</label>
                    <div className="border border-dashed border-[#2A2A2A] hover:border-[#D4AF37]/30 rounded-xl px-3 py-5 text-center cursor-pointer transition-all">
                      <div className="text-xl mb-1">📎</div>
                      <div className="text-[9px] text-slate-600">Drag & drop atau klik untuk pilih file</div>
                      <div className="text-[8px] text-slate-700">PDF, JPG, PNG, DOCX (max 50MB)</div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Deskripsi (opsional)</label>
                  <input value={uploadForm.description} onChange={e => setUploadForm(p => ({ ...p, description: e.target.value }))}
                    placeholder="Catatan tambahan tentang dokumen ini..."
                    className="w-full bg-[#141414] border border-[#1E1E1E] text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#D4AF37]/30 transition-all" />
                </div>
                {isUploading && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-black text-violet-400 uppercase">Mengenkripsi & Upload ke IPFS...</span>
                      <span className="text-[9px] font-black text-[#D4AF37]">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-[#1E1E1E] rounded-full h-2">
                      <div className="h-2 bg-gradient-to-r from-violet-600 to-[#D4AF37] rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                    </div>
                    <div className="text-[8px] text-slate-700 mt-1">🔐 AES-256 encrypting → 📡 Uploading to Pinata IPFS → 🔗 Minting IPFS CID...</div>
                  </div>
                )}
                {uploadDone && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center">
                    <div className="text-emerald-400 text-sm font-black">✅ Upload berhasil! Dokumen tersimpan aman di IPFS.</div>
                  </div>
                )}
                <div className="flex gap-3">
                  <button onClick={handleUpload} disabled={isUploading || !uploadForm.name}
                    className="flex-1 bg-[#D4AF37] hover:bg-[#C9A227] disabled:opacity-50 text-black py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all">
                    {isUploading ? '⏳ Uploading...' : '🔐 Enkripsi & Upload ke IPFS'}
                  </button>
                  <button onClick={() => setShowUploadForm(false)} className="px-6 bg-[#1E1E1E] text-slate-400 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#2A2A2A] transition-all">
                    Batal
                  </button>
                </div>
              </div>
            )}

            {/* Search & Filter */}
            <div className="flex gap-3">
              <input value={vaultSearch} onChange={e => setVaultSearch(e.target.value)} placeholder="🔍 Cari dokumen..."
                className="flex-1 bg-[#0D0D0D] border border-[#1E1E1E] text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#D4AF37]/30 placeholder-slate-700 transition-all" />
              <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
                className="bg-[#0D0D0D] border border-[#1E1E1E] text-white rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#D4AF37]/30 transition-all">
                <option value="all">Semua ({vaultDocs.length})</option>
                {Object.entries(CAT_CONFIG).map(([k, v]) => (
                  <option key={k} value={k}>{v.label} ({vaultDocs.filter(d => d.category === k).length})</option>
                ))}
              </select>
            </div>

            {/* Document List */}
            <div className="space-y-2">
              {filteredDocs.length === 0 && (
                <div className="text-center py-10 text-slate-600 text-sm">Tidak ada dokumen ditemukan</div>
              )}
              {filteredDocs.map(doc => {
                const cc = (CAT_CONFIG as any)[doc.category] || CAT_CONFIG.identity;
                return (
                  <div key={doc.id} className="flex items-center justify-between p-4 rounded-2xl border hover:border-[#D4AF37]/15 bg-[#0D0D0D] border-[#1E1E1E] transition-all group">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-2xl ${cc.bg} ${cc.border} border flex items-center justify-center text-xl flex-shrink-0`}>
                        {doc.emoji}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-black text-white group-hover:text-[#D4AF37] transition-all">{doc.name}</span>
                          {doc.isEncrypted && <span className="text-[7px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 rounded uppercase">🔐 AES-256</span>}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <span className={`text-[8px] font-black ${cc.color} uppercase`}>{cc.label}</span>
                          <span className="text-[8px] text-slate-700">·</span>
                          <span className="text-[8px] font-mono text-slate-600">{doc.size}</span>
                          <span className="text-[8px] text-slate-700">·</span>
                          <span className="text-[8px] font-mono text-slate-600">{doc.uploadDate}</span>
                          <span className="text-[8px] text-slate-700">·</span>
                          <span className="text-[8px] font-mono text-slate-600">👤 {doc.owner}</span>
                          <span className="text-[8px] text-slate-700">·</span>
                          <span className="text-[8px] font-mono text-slate-600">👁️ {doc.views}x</span>
                        </div>
                        <div className="text-[7px] font-mono text-slate-700 mt-0.5">IPFS: {doc.ipfsCid.slice(0, 30)}...</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 border text-[8px] font-black uppercase ${
                        doc.accessLevel === 'private' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                        doc.accessLevel === 'family' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                        'bg-orange-500/10 border-orange-500/20 text-orange-400'
                      }`}>
                        {doc.accessLevel === 'private' ? '🔒' : doc.accessLevel === 'family' ? '👨‍👩‍👧' : '🆘'} {doc.accessLevel}
                      </div>
                      <button onClick={() => setNotification({ msg: `🔓 Membuka ${doc.name}...`, type: 'info' })}
                        className="text-[9px] font-black bg-[#141414] border border-[#1E1E1E] text-slate-400 hover:text-white px-2 py-1 rounded-lg transition-all">
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
                { label: 'Terenkripsi', val: vaultDocs.filter(d => d.isEncrypted).length, icon: '🔐', color: 'text-emerald-400' },
                { label: 'Storage IPFS', val: `${(vaultDocs.reduce((s, d) => s + parseFloat(d.size), 0)).toFixed(1)} MB`, icon: '🌐', color: 'text-[#D4AF37]' },
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

            {/* Net Worth Banner */}
            <div className="bg-gradient-to-r from-[#0F0D1F] to-[#0D0D0D] border border-[#D4AF37]/20 rounded-2xl p-5">
              <div className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest mb-1">💎 Total Net Worth Keluarga Gani</div>
              <div className="text-3xl font-black text-white mb-2">{formatRp(totalAssetIDR)}</div>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  <span className="text-[10px] font-mono text-emerald-400">+12.4% YoY</span>
                </div>
                <span className="text-[10px] font-mono text-slate-600">· Diperbarui: 26 Feb 2026</span>
                <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/15 rounded-full px-2 py-0.5">
                  <span className="text-[8px] font-black text-emerald-400">🌿 {totalHypha.toLocaleString()} $HYPHA staked</span>
                </div>
              </div>
            </div>

            {/* Asset List */}
            <div className="space-y-2">
              {TREASURY_ASSETS.map(asset => (
                <div key={asset.id} className="flex items-center justify-between p-4 bg-[#0D0D0D] border border-[#1E1E1E] rounded-2xl hover:border-[#D4AF37]/15 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-[#141414] border border-[#1E1E1E] flex items-center justify-center text-xl flex-shrink-0">
                      {asset.icon}
                    </div>
                    <div>
                      <div className="text-xs font-black text-white">{asset.name}</div>
                      <div className="text-[9px] font-mono text-slate-600">{asset.institution || asset.type}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-[#D4AF37]">
                      {asset.currency === 'IDR' ? formatRp(asset.value) : `${asset.value} ${asset.currency}`}
                    </div>
                    <div className={`text-[9px] font-mono ${asset.change24h > 0 ? 'text-emerald-400' : asset.change24h < 0 ? 'text-red-400' : 'text-slate-600'}`}>
                      {asset.change24h > 0 ? `+${asset.change24h}%` : asset.change24h < 0 ? `${asset.change24h}%` : '—'} 24h
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Allocation Chart */}
            <div className="bg-[#0D0D0D] border border-[#1E1E1E] rounded-2xl p-5">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">📊 Alokasi Portofolio Keluarga</div>
              <div className="space-y-3">
                {[
                  { label: 'Properti', pct: 86, color: 'bg-[#D4AF37]', val: formatRp(1800000000) },
                  { label: 'Reksa Dana', pct: 6, color: 'bg-violet-500', val: formatRp(124500000) },
                  { label: 'Tabungan', pct: 4, color: 'bg-blue-500', val: formatRp(85000000) },
                  { label: 'BPJS JHT', pct: 2, color: 'bg-cyan-500', val: formatRp(45000000) },
                  { label: '$HYPHA + ETH', pct: 2, color: 'bg-emerald-500', val: '9,600 HYPHA + 0.75 ETH' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-24 text-[9px] font-black text-slate-500 text-right">{item.label}</div>
                    <div className="flex-1 bg-[#1E1E1E] rounded-full h-2">
                      <div className={`${item.color} h-2 rounded-full transition-all`} style={{ width: `${item.pct}%` }} />
                    </div>
                    <div className="w-8 text-[9px] font-black text-slate-400">{item.pct}%</div>
                    <div className="hidden md:block text-[8px] font-mono text-slate-700 w-48">{item.val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: HOME OS ── */}
        {activeTab === 'home-os' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-base font-black text-white uppercase tracking-widest">🏡 Home OS — Smart Family Planner</h2>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-[10px] font-black text-violet-400 uppercase">
                  <div className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-pulse" />
                  AI Reminder Aktif
                </div>
                <button onClick={() => setShowTaskForm(v => !v)}
                  className="flex items-center gap-1.5 bg-[#D4AF37] hover:bg-[#C9A227] text-black px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                  ➕ Task Baru
                </button>
              </div>
            </div>

            {/* Add Task Form */}
            {showTaskForm && (
              <div className="bg-[#0D0D0D] border border-[#D4AF37]/20 rounded-2xl p-4 space-y-3">
                <div className="text-[10px] font-black text-[#D4AF37] uppercase">📋 Tambah Task Baru</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-[8px] font-black text-slate-500 uppercase block mb-1">Judul Task *</label>
                    <input value={newTask.title} onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))}
                      placeholder="Contoh: Bayar tagihan PLN..." className="w-full bg-[#141414] border border-[#1E1E1E] text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#D4AF37]/30 transition-all" />
                  </div>
                  <div>
                    <label className="text-[8px] font-black text-slate-500 uppercase block mb-1">Kategori</label>
                    <select value={newTask.category} onChange={e => setNewTask(p => ({ ...p, category: e.target.value }))} className="w-full bg-[#141414] border border-[#1E1E1E] text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#D4AF37]/30 transition-all">
                      <option value="bill">💳 Tagihan</option><option value="maintenance">🔧 Perawatan</option><option value="health">🏥 Kesehatan</option><option value="education">📚 Pendidikan</option><option value="legal">⚖️ Legal</option><option value="event">🎉 Acara</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[8px] font-black text-slate-500 uppercase block mb-1">Prioritas</label>
                    <select value={newTask.priority} onChange={e => setNewTask(p => ({ ...p, priority: e.target.value }))} className="w-full bg-[#141414] border border-[#1E1E1E] text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#D4AF37]/30 transition-all">
                      <option value="critical">🚨 Kritis</option><option value="high">⬆️ Tinggi</option><option value="medium">➡️ Sedang</option><option value="low">⬇️ Rendah</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[8px] font-black text-slate-500 uppercase block mb-1">Deadline *</label>
                    <input type="date" value={newTask.dueDate} onChange={e => setNewTask(p => ({ ...p, dueDate: e.target.value }))} className="w-full bg-[#141414] border border-[#1E1E1E] text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#D4AF37]/30 transition-all" />
                  </div>
                  <div>
                    <label className="text-[8px] font-black text-slate-500 uppercase block mb-1">Assign ke</label>
                    <select value={newTask.assignedTo} onChange={e => setNewTask(p => ({ ...p, assignedTo: e.target.value }))} className="w-full bg-[#141414] border border-[#1E1E1E] text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#D4AF37]/30 transition-all">
                      {FAMILY_MEMBERS.map(m => <option key={m.id}>{m.name}</option>)}
                      <option value="Semua">Semua</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[8px] font-black text-slate-500 uppercase block mb-1">Estimasi Biaya (Rp)</label>
                    <input type="number" value={newTask.cost} onChange={e => setNewTask(p => ({ ...p, cost: e.target.value }))} placeholder="Opsional..." className="w-full bg-[#141414] border border-[#1E1E1E] text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#D4AF37]/30 transition-all" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleAddTask} className="flex-1 bg-[#D4AF37] hover:bg-[#C9A227] text-black py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">✅ Tambah Task</button>
                  <button onClick={() => setShowTaskForm(false)} className="px-4 bg-[#1E1E1E] text-slate-400 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-[#2A2A2A] transition-all">Batal</button>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Total Tasks', val: homeTasks.length, icon: '📋', color: 'text-white' },
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
                    task.status === 'done' ? 'bg-[#0D0D0D] border-[#1A1A1A] opacity-50' :
                    task.priority === 'critical' ? 'bg-red-500/5 border-red-500/15' :
                    task.priority === 'high' ? 'bg-orange-500/5 border-orange-500/15' :
                    'bg-[#0D0D0D] border-[#1E1E1E] hover:border-[#2A2A2A]'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className="text-xl flex-shrink-0">{task.emoji}</div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs font-black ${task.status === 'done' ? 'line-through text-slate-600' : 'text-white'}`}>{task.title}</span>
                          {task.isAiGenerated && <span className="text-[7px] font-black bg-violet-500/10 text-violet-400 border border-violet-500/15 px-1.5 rounded uppercase">🤖 AI</span>}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className={`text-[8px] font-black ${pc.color}`}>{pc.label}</span>
                          <span className="text-[7px] text-slate-700">·</span>
                          <span className="text-[9px] font-mono text-slate-600">📅 {task.dueDate}</span>
                          <span className="text-[7px] text-slate-700">·</span>
                          <span className="text-[9px] font-mono text-slate-600">👤 {task.assignedTo}</span>
                          {task.cost && <><span className="text-[7px] text-slate-700">·</span><span className="text-[9px] font-mono text-[#D4AF37]">{formatRp(task.cost)}</span></>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {task.status !== 'done' && FAMILY_MEMBERS.find(m => m.phone && m.name === task.assignedTo) && (
                        <button onClick={() => openWhatsApp(FAMILY_MEMBERS.find(m => m.name === task.assignedTo)!.phone!, task.assignedTo, `📋 Reminder: *${task.title}* due ${task.dueDate}${task.cost ? `\n💰 Est: ${formatRp(task.cost)}` : ''}`)}
                          className="text-[8px] font-black bg-emerald-500/10 border border-emerald-500/15 text-emerald-400 px-2 py-1 rounded-lg hover:bg-emerald-500/20 transition-all">
                          📱
                        </button>
                      )}
                      {task.status === 'todo' && (
                        <button onClick={() => updateTaskStatus(task.id, 'in-progress')} className="text-[9px] font-black bg-blue-500/10 border border-blue-500/15 text-blue-400 px-2 py-1 rounded-lg hover:bg-blue-500/20 transition-all">
                          Mulai ▶
                        </button>
                      )}
                      {task.status === 'in-progress' && (
                        <button onClick={() => updateTaskStatus(task.id, 'done')} className="text-[9px] font-black bg-emerald-500/10 border border-emerald-500/15 text-emerald-400 px-2 py-1 rounded-lg hover:bg-emerald-500/20 transition-all">
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
            <h2 className="text-base font-black text-white uppercase tracking-widest">📜 Succession Protocol — Digital Warisan</h2>

            {/* Dead Man's Switch */}
            <div className="bg-gradient-to-r from-[#0F0A1F] to-[#0D0D0D] border border-violet-500/20 rounded-2xl p-5">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                <div>
                  <div className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-1">⚙️ Dead Man's Switch v2.0</div>
                  <div className="text-xs font-black text-white">Auto-succession trigger jika tidak ada aktivitas 180 hari</div>
                  <div className="text-[9px] font-mono text-slate-600 mt-0.5">Deploy di Ethereum Mainnet · Multi-sig required</div>
                </div>
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black text-emerald-400 uppercase">AKTIF</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Trigger Timer', val: '180 hari', color: 'text-violet-400' },
                  { label: 'Last Activity', val: 'Hari ini', color: 'text-emerald-400' },
                  { label: 'Security Score', val: '78/100', color: 'text-yellow-400' },
                ].map((s, i) => (
                  <div key={i} className="bg-[#0D0D0D] rounded-xl p-3 text-center border border-[#1E1E1E]">
                    <div className={`text-sm font-black ${s.color}`}>{s.val}</div>
                    <div className="text-[8px] font-mono text-slate-700">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Succession Timeline */}
            <div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">📋 Aturan Waris & Timeline</div>
              <div className="space-y-3">
                {SUCCESSION_RULES.map((rule, i) => (
                  <div key={rule.id} className="p-4 bg-[#0D0D0D] border border-[#1E1E1E] rounded-2xl hover:border-[#D4AF37]/15 transition-all">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <div className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center text-[9px] font-black flex-shrink-0">{i + 1}</div>
                          <span className="text-sm font-black text-[#D4AF37]">{rule.asset}</span>
                          {rule.isActive && <span className="text-[7px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 px-1.5 py-0.5 rounded uppercase">✅ Aktif</span>}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 mb-1">
                          → Penerima: <span className="text-white font-black">{rule.beneficiary}</span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-600 italic mb-2">"{rule.condition}"</div>
                        <div className="flex gap-2 flex-wrap">
                          {rule.contractAddress && (
                            <div className="text-[8px] font-mono text-violet-600 bg-violet-500/5 border border-violet-500/10 px-2 py-0.5 rounded">
                              🔗 Contract: {rule.contractAddress.slice(0, 12)}...
                            </div>
                          )}
                          {rule.triggerDate && (
                            <div className="text-[8px] font-mono text-amber-600 bg-amber-500/5 border border-amber-500/10 px-2 py-0.5 rounded">
                              ⏰ Trigger: {rule.triggerDate}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-lg font-black text-[#D4AF37] flex-shrink-0">{rule.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Shards */}
            <div className="bg-[#0D0D0D] border border-[#1E1E1E] rounded-2xl p-5">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">🔑 Shamir's Secret Sharing (4-of-4)</div>
              <div className="text-[10px] font-mono text-slate-600 mb-4">4 shard kunci dibagi ke anggota terpercaya. Butuh 3/4 shard untuk unlock warisan digital.</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {FAMILY_MEMBERS.map((m, i) => {
                  const hasShard = m.keyHolder;
                  const did = memberDids[m.id];
                  return (
                    <div key={m.id} className={`p-3 rounded-2xl border text-center transition-all ${hasShard ? 'bg-violet-500/5 border-violet-500/20' : 'bg-[#0D0D0D] border-[#1E1E1E] opacity-60'}`}>
                      <div className="text-2xl mb-1">{m.avatar}</div>
                      <div className="text-[9px] font-black text-white">{m.name}</div>
                      <div className="text-[8px] font-mono text-slate-600 mb-2">{m.role}</div>
                      {hasShard ? (
                        <div className="bg-violet-500/10 border border-violet-500/20 rounded-full px-2 py-0.5 mb-1">
                          <span className="text-[8px] font-black text-violet-400">🔑 Shard #{m.shardIndex}</span>
                        </div>
                      ) : (
                        <div className="bg-[#1E1E1E] rounded-full px-2 py-0.5 mb-1">
                          <span className="text-[7px] font-black text-slate-700">⏳ Butuh Assign</span>
                        </div>
                      )}
                      {did ? (
                        <div className="text-[7px] font-mono text-violet-700 truncate">{shortenDid(did)}</div>
                      ) : (
                        <div className="text-[7px] text-slate-700">DID belum dibuat</div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex items-start gap-2 text-[9px] font-mono text-yellow-500 bg-yellow-500/5 border border-yellow-500/15 rounded-xl p-3">
                <span>⚠️</span>
                <span>Saat ini 2/4 shard aktif (Ahmad + Siti). Untuk keamanan optimal, assign 2 trusted guardian lagi (misalnya: orang tua atau saudara kandung). Butuh 3/4 shard untuk unlock succession.</span>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: PLANS ── */}
        {activeTab === 'plans' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="text-4xl mb-3">🏛️</div>
              <h2 className="text-2xl font-black text-white mb-2">Sovereign Legacy Plans</h2>
              <p className="text-slate-500 text-sm font-mono">Digital Legacy Vault + Family Home OS · GANI HYPHA Ecosystem</p>
              <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
                <span className="text-[9px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full uppercase">🎁 7 Hari Trial Gratis</span>
                <span className="text-[9px] font-black bg-violet-500/10 text-violet-400 border border-violet-500/20 px-3 py-1 rounded-full uppercase">🔐 End-to-End Encrypted</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  name: 'Sanctuary Starter', price: 'Rp 299.000', period: '/bulan', badge: '', emoji: '🏠',
                  color: 'from-slate-800/80 to-slate-900', border: 'border-slate-700/60', btn: 'bg-slate-700 hover:bg-slate-600 text-white',
                  features: ['✅ Legacy Vault (10 dokumen)', '✅ IPFS storage (100MB)', '✅ AES-256 enkripsi', '✅ 4 anggota keluarga', '✅ Home OS (20 tugas)', '✅ Family treasury basic', '❌ Smart contract suksesi', '❌ Web5 DID + DWN', '❌ $HYPHA staking', '❌ Dead Man\'s Switch'],
                  cta: '🆓 Mulai 7 Hari Gratis',
                },
                {
                  name: 'Sovereign Sanctuary', price: 'Rp 799.000', period: '/bulan', badge: '⭐ Most Popular', emoji: '🏛️',
                  color: 'from-[#0F0D1F] to-[#0D0D0D]', border: 'border-violet-500/30', btn: 'bg-gradient-to-r from-violet-700 to-purple-800 text-white',
                  features: ['✅ Legacy Vault UNLIMITED', '✅ IPFS storage (5GB)', '✅ Web5 DID + DWN', '✅ Family Treasury full', '✅ Home OS UNLIMITED', '✅ Basic succession rules', '✅ $HYPHA staking integration', '✅ Dead Man\'s Switch basic', '✅ WhatsApp AI alerts', '❌ Smart contract kustom'],
                  cta: '🏛️ Amankan Warisan Keluarga',
                },
                {
                  name: 'Legacy Forever', price: 'Rp 1.999.000', period: '/bulan', badge: '👑 Full Sovereign', emoji: '♾️',
                  color: 'from-amber-950/30 to-yellow-950/15', border: 'border-amber-500/30', btn: 'bg-amber-600 hover:bg-amber-500 text-white',
                  features: ['✅ Semua Sovereign Sanctuary', '✅ IPFS storage UNLIMITED', '✅ Smart contract suksesi kustom', '✅ ZKP (Zero-Knowledge Proof)', '✅ Multi-sig treasury wallet', '✅ Dead Man\'s Switch advanced', '✅ IoT Home bridge (beta)', '✅ Notaris digital integration', '✅ API + webhook access', '✅ Priority support 24/7'],
                  cta: '♾️ Warisan Abadi Dimulai',
                },
              ].map((plan, i) => (
                <div key={i} className={`bg-gradient-to-b ${plan.color} border ${plan.border} rounded-2xl p-5 flex flex-col ${plan.badge ? 'ring-1 ring-violet-500/20 scale-[1.02]' : ''}`}>
                  {plan.badge && (
                    <div className="text-center mb-3">
                      <span className="text-[9px] font-black bg-violet-500/10 text-violet-400 border border-violet-500/20 px-3 py-1 rounded-full uppercase tracking-widest">{plan.badge}</span>
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

            {/* Ecosystem */}
            <div className="bg-[#0D0D0D] border border-[#D4AF37]/10 rounded-2xl p-5">
              <div className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest mb-4">🌐 Sovereign Ecosystem Integration</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { icon: '🌿', label: 'GANI HYPHA', desc: 'Master Control & AI Hub', link: '/' },
                  { icon: '🔵', label: '$PREMALTA', desc: 'Bootstrap Token Revenue', link: '/premalta' },
                  { icon: '💈', label: 'Sovereign Barber', desc: 'Community Node Connect', link: '/sovereign-barber' },
                  { icon: '🎁', label: 'SHGA Bundle', desc: 'Family Eid Gift Bundle', link: '/shga' },
                ].map((item, i) => (
                  <a key={i} href={item.link} className="bg-[#141414] border border-[#1E1E1E] hover:border-[#D4AF37]/20 rounded-xl p-3 text-center transition-all group">
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
      <SovereignFooter currentAgent="legacy" agentIcon="🏛️" agentColor="text-purple-400 hover:text-purple-300" />
    </div>
  );
};

export default SovereignLegacy;
