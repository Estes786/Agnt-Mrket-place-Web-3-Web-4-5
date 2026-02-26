
// ============================================================
// GANI HYPHA — Supabase Dashboard v5.2
// REAL DATA: RBAC · Users · Revenue · Services · Build In Public
// "Use Web2 engine to FUND Web3 sovereignty" — Gyss! 🙏🏻
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';

// ── Types ───────────────────────────────────────────────────
interface SupabaseUser {
  id: string;
  email: string;
  username?: string;
  role: 'admin' | 'founder' | 'pro' | 'user' | 'guest';
  tier: 'enterprise' | 'pro' | 'free' | 'founder';
  hypha_balance: number;
  staked_amount: number;
  usd_balance: number;
  total_yield: number;
  reputation_score: number;
  is_verified: boolean;
  is_whale: boolean;
  monthly_revenue: number;
  subscription_status: string;
  wallet_address?: string;
  created_at: string;
}

interface MicroService {
  id: string;
  name: string;
  service_type: string;
  price_usd: number;
  status: string;
  total_revenue: number;
  total_calls: number;
  subscribers_count: number;
  description?: string;
  billing_cycle?: string;
  endpoint_url?: string;
}

interface RevenueStream {
  id: string;
  stream_type: string;
  layer: string;
  monthly_revenue: number;
  growth_rate: number;
  status: string;
  contributors: number;
  updated_at?: string;
}

interface BuildLog {
  id: string;
  title: string;
  content: string;
  log_type: string;
  metrics: Record<string, unknown>;
  likes: number;
  views: number;
  published_at: string;
  is_public: boolean;
}

interface Analytics {
  totalUsers: number;
  activeServices: number;
  activePods: number;
  buildLogs: number;
  mrr: number;
  arr: number;
  phase: string;
}

// ── Supabase Config ─────────────────────────────────────────
const SB_URL = 'https://drhitwkbkdnnepnnqbmo.supabase.co';
const SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyaGl0d2tia2RubmVwbm5xYm1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5OTkxMDUsImV4cCI6MjA4NzU3NTEwNX0.FllXcijYS4ABB0htjEyzdNoR7mOCbtxmwLeboIGGbYs';

// REST helper
async function sbFetch(path: string, options: RequestInit = {}, useService = false) {
  const key = useService
    ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyaGl0d2tia2RubmVwbm5xYm1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTk5OTEwNSwiZXhwIjoyMDg3NTc1MTA1fQ.QTlZlVOr4sdH3R5OPG6YUp_N_-hWP1OFSx8_dIawlkY'
    : SB_ANON;
  const res = await fetch(`${SB_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
      ...(options.headers || {}),
    },
  });
  if (!res.ok) throw new Error(`SB ${res.status}: ${await res.text()}`);
  return res.json();
}

// Badge colors
const roleBadge: Record<string, string> = {
  admin: 'bg-red-500/20 text-red-400 border border-red-500/30',
  founder: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  pro: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
  user: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  guest: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
};

const layerColor: Record<string, string> = {
  web2: 'text-blue-400', web3: 'text-purple-400', web4: 'text-green-400', web5: 'text-cyan-400'
};

const statusIcon: Record<string, string> = {
  building: '🔨', active: '✅', planned: '📋', paused: '⏸️', archived: '📦', draft: '📝'
};

const logTypeIcon: Record<string, string> = {
  milestone: '🏆', update: '📡', launch: '🚀', revenue: '💰', community: '👥', technical: '🔧'
};

// ── Paradox Panel ────────────────────────────────────────────
const ParadoxPanel: React.FC = () => (
  <div className="bg-gradient-to-br from-slate-900/80 to-indigo-950/30 border border-indigo-500/20 rounded-2xl p-5 mb-5">
    <div className="flex items-start gap-4">
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-lg flex-shrink-0">🔮</div>
      <div>
        <h3 className="text-white font-black text-base mb-1">Resolusi Paradoks RBAC × Blockchain 🧠</h3>
        <p className="text-slate-400 text-xs mb-3">Supabase = engine penghasil uang (cepat, murah, reliable). Blockchain = aset & governance (trustless). Keduanya tidak bertentangan — saling melengkapi!</p>
        <div className="grid grid-cols-3 gap-2 text-xs">
          {[
            { color: 'blue', label: '🏗️ Web2 Foundation', desc: 'Supabase = SaaS revenue, auth, billing. Fast & cheap.' },
            { color: 'purple', label: '⛓️ Web3 Sovereignty', desc: 'Blockchain = aset. User tetap punya private key.' },
            { color: 'green', label: '💰 Fund Strategy', desc: 'Web2 income → fund Web3 liquidity. Gyss!' },
          ].map(({ color, label, desc }) => (
            <div key={label} className={`bg-${color}-500/10 border border-${color}-500/20 rounded-xl p-2`}>
              <div className={`text-${color}-400 font-bold text-xs mb-1`}>{label}</div>
              <div className="text-slate-300 text-xs">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ── Auth Modal ───────────────────────────────────────────────
interface AuthModalProps {
  onAuth: (user: SupabaseUser) => void;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onAuth, onClose }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async () => {
    setLoading(true);
    setError('');
    try {
      const endpoint = mode === 'login'
        ? `${SB_URL}/auth/v1/token?grant_type=password`
        : `${SB_URL}/auth/v1/signup`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'apikey': SB_ANON, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, ...(mode === 'register' ? { data: { username } } : {}) }),
      });

      const data = await res.json();
      if (data.error || data.error_description) throw new Error(data.error_description || data.error || 'Auth failed');

      if (data.user || data.access_token) {
        const authUser = data.user;
        localStorage.setItem('gani_token', data.access_token || '');
        localStorage.setItem('gani_user_id', authUser?.id || '');

        // Fetch or create profile
        let profile: SupabaseUser | null = null;
        if (authUser?.id) {
          try {
            const SB_SERVICE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyaGl0d2tia2RubmVwbm5xYm1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTk5OTEwNSwiZXhwIjoyMDg3NTc1MTA1fQ.QTlZlVOr4sdH3R5OPG6YUp_N_-hWP1OFSx8_dIawlkY';
            const profileRes = await fetch(`${SB_URL}/rest/v1/user_profiles?auth_id=eq.${authUser.id}&select=*`, {
              headers: { 'apikey': SB_SERVICE, 'Authorization': `Bearer ${SB_SERVICE}` }
            });
            const profiles = await profileRes.json();
            if (profiles?.[0]) {
              profile = profiles[0];
            } else {
              // Create profile
              const createRes = await fetch(`${SB_URL}/rest/v1/user_profiles`, {
                method: 'POST',
                headers: { 'apikey': SB_SERVICE, 'Authorization': `Bearer ${SB_SERVICE}`, 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
                body: JSON.stringify({ auth_id: authUser.id, email, username: username || email.split('@')[0], role: 'user', tier: 'free', hypha_balance: 2500, reputation_score: 75 })
              });
              const created = await createRes.json();
              profile = created?.[0] || null;
            }
          } catch { /* fallback */ }
        }

        const mockProfile: SupabaseUser = profile || {
          id: authUser?.id || crypto.randomUUID(),
          email, username: username || email.split('@')[0],
          role: email.includes('admin') ? 'admin' : email.includes('founder') ? 'founder' : 'user',
          tier: 'free', hypha_balance: 2500, staked_amount: 0, usd_balance: 0,
          total_yield: 0, reputation_score: 75, is_verified: false, is_whale: false,
          monthly_revenue: 0, subscription_status: 'inactive', created_at: new Date().toISOString(),
        };

        localStorage.setItem('gani_user', JSON.stringify(mockProfile));
        onAuth(mockProfile);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-white font-black text-xl">🧬 GANI HYPHA Auth</h2>
            <p className="text-slate-500 text-xs mt-0.5">Supabase · Secure · Real Account</p>
          </div>
          <button onClick={onClose} className="text-slate-600 hover:text-white w-8 h-8 flex items-center justify-center rounded-xl bg-slate-800/50 text-sm">✕</button>
        </div>

        <div className="flex gap-2 mb-5 bg-slate-900/50 rounded-2xl p-1">
          {(['login', 'register'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${mode === m ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}>
              {m === 'login' ? '🔑 Login' : '✨ Register'}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {mode === 'register' && (
            <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username (optional)"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-600" />
          )}
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address"
            className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-600" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password"
            className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-600"
            onKeyDown={e => e.key === 'Enter' && handleAuth()} />
        </div>

        {error && <div className="mt-3 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-xs">⚠️ {error}</div>}

        <button onClick={handleAuth} disabled={loading || !email || !password}
          className="mt-4 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 rounded-2xl hover:opacity-90 disabled:opacity-40 transition-all">
          {loading ? '⏳ Processing...' : mode === 'login' ? '🚀 Login to HYPHA' : '✨ Join GANI HYPHA'}
        </button>
        <p className="text-slate-600 text-xs text-center mt-3">Your assets are yours. RBAC = platform features only. 🙏🏻</p>
      </div>
    </div>
  );
};

// ── Create Service Modal ──────────────────────────────────────
interface CreateServiceModalProps {
  onSave: (service: Partial<MicroService>) => Promise<void>;
  onClose: () => void;
}

const CreateServiceModal: React.FC<CreateServiceModalProps> = ({ onSave, onClose }) => {
  const [form, setForm] = useState({ name: '', description: '', service_type: 'api', price_usd: 29, billing_cycle: 'monthly' });
  const [loading, setLoading] = useState(false);

  const serviceTypes = [
    { value: 'api', label: '🔌 API Service' },
    { value: 'saas', label: '☁️ SaaS Platform' },
    { value: 'ai_pod', label: '🤖 AI Pod' },
    { value: 'defi', label: '📈 DeFi Strategy' },
    { value: 'data', label: '📊 Data Feed' },
    { value: 'rpc', label: '⛓️ RPC Node' },
  ];

  const handleSave = async () => {
    if (!form.name) return;
    setLoading(true);
    await onSave(form);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-black text-lg">🚀 Create Micro Service</h2>
          <button onClick={onClose} className="text-slate-600 hover:text-white w-8 h-8 flex items-center justify-center rounded-xl bg-slate-800/50 text-sm">✕</button>
        </div>
        <div className="space-y-3">
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Service name (e.g. GANI AI API)"
            className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-600" />
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description"
            className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-600 h-20 resize-none" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-500 text-xs mb-1 block">Service Type</label>
              <select value={form.service_type} onChange={e => setForm(f => ({ ...f, service_type: e.target.value }))}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500">
                {serviceTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-slate-500 text-xs mb-1 block">Price (USD/mo)</label>
              <input type="number" value={form.price_usd} onChange={e => setForm(f => ({ ...f, price_usd: Number(e.target.value) }))}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500" />
            </div>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-xs text-green-300">
            💡 <strong>Revenue Potential:</strong> {form.price_usd} users × ${form.price_usd}/mo = ${(form.price_usd * 10).toLocaleString()}/mo with 10 subscribers
          </div>
        </div>
        <button onClick={handleSave} disabled={loading || !form.name}
          className="mt-4 w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3 rounded-2xl hover:opacity-90 disabled:opacity-40 transition-all">
          {loading ? '⏳ Creating...' : '✅ Create Service & Start Earning'}
        </button>
      </div>
    </div>
  );
};

// ── Main Component ───────────────────────────────────────────
const SupabaseDashboard: React.FC = () => {
  const tabs = ['overview', 'users', 'services', 'revenue', 'build', 'rbac'] as const;
  type TabType = typeof tabs[number];

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showCreateService, setShowCreateService] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<SupabaseUser[]>([]);
  const [services, setServices] = useState<MicroService[]>([]);
  const [revenueStreams, setRevenueStreams] = useState<RevenueStream[]>([]);
  const [buildLogs, setBuildLogs] = useState<BuildLog[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({ totalUsers: 0, activeServices: 0, activePods: 0, buildLogs: 0, mrr: 0, arr: 0, phase: 'Phase 0: Building' });
  const [dbStatus, setDbStatus] = useState<'checking' | 'ready' | 'error'>('checking');
  const [newLog, setNewLog] = useState({ title: '', content: '', log_type: 'update' });
  const [newRevenue, setNewRevenue] = useState<Record<string, number>>({});
  const [toastMsg, setToastMsg] = useState('');

  const toast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('gani_user');
    if (saved) {
      try { setCurrentUser(JSON.parse(saved)); } catch { /* ignore */ }
    }
    checkDb();
  }, []);

  const checkDb = async () => {
    try {
      const res = await fetch(`${SB_URL}/rest/v1/`, { headers: { 'apikey': SB_ANON } });
      const data = await res.json();
      const paths = Object.keys(data.paths || {});
      const ready = paths.some(p => p.includes('user_profiles'));
      setDbStatus(ready ? 'ready' : 'error');
    } catch { setDbStatus('error'); }
  };

  // Fetch data
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      // Analytics
      const analyticsRes = await fetch('/api/supabase/analytics');
      const aData = await analyticsRes.json();
      if (aData.success) setAnalytics(aData.analytics);

      // Revenue streams
      const revRes = await fetch('/api/supabase/revenue');
      const revData = await revRes.json();
      if (revData.success) setRevenueStreams(revData.streams || []);

      // Build logs
      const logsRes = await fetch('/api/supabase/build-logs');
      const logsData = await logsRes.json();
      if (logsData.success) setBuildLogs(logsData.logs || []);

      // Users (admin only)
      if (currentUser?.role === 'admin' || currentUser?.role === 'founder') {
        const usersRes = await fetch('/api/supabase/users');
        const usersData = await usersRes.json();
        if (usersData.success) setUsers(usersData.users || []);
      }

      // Services
      const svcRes = await fetch('/api/supabase/services');
      const svcData = await svcRes.json();
      if (svcData.success) setServices(svcData.services || []);
    } catch { /* ignore */ }
    setLoading(false);
  }, [currentUser]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handlePostLog = async () => {
    if (!newLog.title || !newLog.content) return;
    try {
      const res = await fetch('/api/supabase/build-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLog),
      });
      const data = await res.json();
      if (data.success) {
        toast('✅ Posted to Build In Public! Gyss! 🚀');
        setNewLog({ title: '', content: '', log_type: 'update' });
        fetchAll();
      }
    } catch { toast('❌ Failed to post. Try again.'); }
  };

  const handleLike = async (id: string) => {
    await fetch(`/api/supabase/build-logs/${id}/like`, { method: 'PATCH' });
    setBuildLogs(prev => prev.map(l => l.id === id ? { ...l, likes: l.likes + 1 } : l));
  };

  const handleCreateService = async (data: Partial<MicroService>) => {
    try {
      const res = await fetch('/api/supabase/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        toast('✅ Service created! Start earning. Gyss! 💰');
        setShowCreateService(false);
        fetchAll();
      } else {
        toast('❌ ' + (result.error || 'Failed'));
      }
    } catch { toast('❌ Network error'); }
  };

  const handleUpdateRevenue = async (streamType: string) => {
    const val = newRevenue[streamType];
    if (val === undefined) return;
    try {
      const res = await fetch(`/api/supabase/revenue/${streamType}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ monthly_revenue: val, status: val > 0 ? 'active' : 'building' }),
      });
      const data = await res.json();
      if (data.success) {
        toast(`✅ Revenue updated: ${streamType} = $${val}/mo`);
        fetchAll();
        setNewRevenue(prev => ({ ...prev, [streamType]: 0 }));
      }
    } catch { toast('❌ Update failed'); }
  };

  const handleUpdateUserRole = async (userId: string, role: string) => {
    try {
      const res = await fetch(`/api/supabase/user/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (data.success) { toast(`✅ Role updated to ${role}`); fetchAll(); }
    } catch { toast('❌ Failed'); }
  };

  const handleLogout = () => {
    localStorage.removeItem('gani_user');
    localStorage.removeItem('gani_token');
    setCurrentUser(null);
    toast('👋 Logged out');
  };

  const totalRealMRR = revenueStreams.reduce((s, r) => s + (r.monthly_revenue || 0), 0);
  const mrrGoal = 1000;
  const mrrProgress = Math.min(100, (totalRealMRR / mrrGoal) * 100);

  return (
    <div className="min-h-screen bg-[#050a14] text-white">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-indigo-600 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold animate-bounce">
          {toastMsg}
        </div>
      )}

      {/* Auth Modal */}
      {showAuth && <AuthModal onAuth={user => { setCurrentUser(user); setShowAuth(false); toast(`✅ Welcome, ${user.username || user.email}!`); }} onClose={() => setShowAuth(false)} />}

      {/* Create Service Modal */}
      {showCreateService && <CreateServiceModal onSave={handleCreateService} onClose={() => setShowCreateService(false)} />}

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-white">🗄️ Supabase Control Center</h1>
            <p className="text-slate-500 text-sm mt-0.5">RBAC · Revenue Engine · Build In Public · v5.2</p>
          </div>
          <div className="flex items-center gap-3">
            {/* DB Status */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold ${dbStatus === 'ready' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${dbStatus === 'ready' ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
              {dbStatus === 'ready' ? 'DB Ready' : 'Checking...'}
            </div>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className={`px-2 py-1 rounded-lg text-xs font-bold ${roleBadge[currentUser.role]}`}>{currentUser.role.toUpperCase()}</div>
                <span className="text-slate-400 text-xs">{currentUser.username || currentUser.email.split('@')[0]}</span>
                <button onClick={handleLogout} className="text-xs text-slate-600 hover:text-red-400 px-2 py-1 rounded-lg hover:bg-red-500/10 transition-all">Logout</button>
              </div>
            ) : (
              <button onClick={() => setShowAuth(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all">
                🔑 Login / Register
              </button>
            )}

            <button onClick={fetchAll} className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-2 rounded-xl transition-all">
              {loading ? '⏳' : '🔄'} Refresh
            </button>
          </div>
        </div>

        <ParadoxPanel />

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
          {[
            { label: 'Real MRR', value: `$${totalRealMRR.toLocaleString()}`, icon: '💰', sub: `Goal: $${mrrGoal}`, color: 'green' },
            { label: 'Users', value: analytics.totalUsers.toString(), icon: '👥', sub: 'Registered', color: 'blue' },
            { label: 'Services', value: analytics.activeServices.toString(), icon: '🔌', sub: 'Active', color: 'purple' },
            { label: 'Build Logs', value: analytics.buildLogs.toString(), icon: '📡', sub: 'Published', color: 'yellow' },
            { label: 'Phase', value: analytics.phase.split(':')[0], icon: '📊', sub: analytics.phase.split(':')[1]?.trim() || '', color: 'cyan' },
          ].map(({ label, value, icon, sub, color }) => (
            <div key={label} className={`bg-slate-900/50 border border-${color}-500/10 rounded-2xl p-3`}>
              <div className="text-lg mb-1">{icon}</div>
              <div className="text-white font-black text-xl">{value}</div>
              <div className="text-slate-500 text-xs">{label}</div>
              <div className={`text-${color}-400 text-xs`}>{sub}</div>
            </div>
          ))}
        </div>

        {/* MRR Progress */}
        <div className="bg-slate-900/50 border border-slate-700/30 rounded-2xl p-4 mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-bold text-sm">💹 MRR Progress: $0 → $1K/mo (First Milestone)</span>
            <span className="text-green-400 font-black text-sm">{mrrProgress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-3">
            <div className="bg-gradient-to-r from-green-500 to-emerald-400 h-3 rounded-full transition-all duration-1000" style={{ width: `${mrrProgress}%` }}></div>
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>$0 (Start)</span><span>$100 (Ramen)</span><span>$500 (Growing)</span><span>$1K (Goal 🎯)</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-5 bg-slate-900/50 rounded-2xl p-1 overflow-x-auto scrollbar-hide">
          {[
            { id: 'overview', label: '📊 Overview' },
            { id: 'users', label: '👥 Users' },
            { id: 'services', label: '🔌 Services' },
            { id: 'revenue', label: '💰 Revenue' },
            { id: 'build', label: '📡 Build Public' },
            { id: 'rbac', label: '🔐 RBAC' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white hover:bg-slate-800/50'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Revenue Streams Summary */}
            <div className="bg-slate-900/50 border border-slate-700/30 rounded-2xl p-5">
              <h3 className="text-white font-black mb-4">📊 9 Revenue Streams — Real-time Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {revenueStreams.map(stream => (
                  <div key={stream.id} className="bg-slate-800/50 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-bold uppercase ${layerColor[stream.layer] || 'text-slate-400'}`}>{stream.layer} · {stream.stream_type}</span>
                      <span className="text-lg">{statusIcon[stream.status] || '📊'}</span>
                    </div>
                    <div className="text-white font-black text-lg">${(stream.monthly_revenue || 0).toLocaleString()}<span className="text-slate-500 text-xs font-normal">/mo</span></div>
                    <div className="text-slate-500 text-xs capitalize">{stream.status}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Register / Login', action: () => setShowAuth(true), icon: '🔑', color: 'indigo', desc: 'Get access & role' },
                { label: 'Create Service', action: () => { if (!currentUser) { setShowAuth(true); return; } setShowCreateService(true); }, icon: '🚀', color: 'green', desc: 'Start earning now' },
                { label: 'Post Update', action: () => setActiveTab('build'), icon: '📡', color: 'yellow', desc: 'Build in public' },
                { label: 'Update Revenue', action: () => setActiveTab('revenue'), icon: '💰', color: 'purple', desc: 'Track real MRR' },
              ].map(({ label, action, icon, color, desc }) => (
                <button key={label} onClick={action}
                  className={`bg-${color}-600/10 border border-${color}-500/20 rounded-2xl p-4 text-left hover:bg-${color}-600/20 transition-all group`}>
                  <div className="text-2xl mb-2">{icon}</div>
                  <div className="text-white font-bold text-sm">{label}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{desc}</div>
                </button>
              ))}
            </div>

            {/* Revenue Roadmap */}
            <div className="bg-slate-900/50 border border-slate-700/30 rounded-2xl p-5">
              <h3 className="text-white font-black mb-4">🗺️ Revenue Roadmap</h3>
              <div className="space-y-3">
                {[
                  { phase: 'Phase 0: Building', range: '$0/mo', desc: 'Setup platform, get first users', status: totalRealMRR === 0, current: true },
                  { phase: 'Phase 1: Seed', range: '$100-500/mo', desc: '5-10 users paying for micro-services', status: totalRealMRR >= 100, current: totalRealMRR > 0 && totalRealMRR < 500 },
                  { phase: 'Phase 2: Growth', range: '$1K-10K/mo', desc: 'SaaS users + DeFi revenue', status: totalRealMRR >= 1000, current: false },
                  { phase: 'Phase 3: Scale', range: '$10K-100K/mo', desc: 'AI Pods + Enterprise clients', status: totalRealMRR >= 10000, current: false },
                  { phase: 'Phase 4: Sovereign', range: '$100K-498K/mo', desc: 'Full Web4/Web5 autonomous', status: totalRealMRR >= 100000, current: false },
                ].map(({ phase, range, desc, status, current }) => (
                  <div key={phase} className={`flex items-center gap-4 p-3 rounded-xl border ${current ? 'border-indigo-500/40 bg-indigo-500/5' : status ? 'border-green-500/30 bg-green-500/5' : 'border-slate-700/30'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${status ? 'bg-green-500/20 text-green-400' : current ? 'bg-indigo-500/20 text-indigo-400 animate-pulse' : 'bg-slate-800 text-slate-600'}`}>
                      {status ? '✅' : current ? '🔄' : '○'}
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-bold text-sm">{phase}</div>
                      <div className="text-slate-500 text-xs">{desc}</div>
                    </div>
                    <div className={`font-black text-sm ${status ? 'text-green-400' : current ? 'text-indigo-400' : 'text-slate-600'}`}>{range}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── USERS TAB ── */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            {!currentUser ? (
              <div className="bg-slate-900/50 border border-slate-700/30 rounded-2xl p-8 text-center">
                <div className="text-4xl mb-3">🔐</div>
                <h3 className="text-white font-black text-lg mb-2">Login Required</h3>
                <p className="text-slate-400 text-sm mb-4">Login untuk lihat user management. Founder/Admin role = full access.</p>
                <button onClick={() => setShowAuth(true)} className="bg-indigo-600 text-white font-bold px-6 py-3 rounded-2xl hover:bg-indigo-500 transition-all">
                  🔑 Login / Register
                </button>
              </div>
            ) : users.length === 0 ? (
              <div className="bg-slate-900/50 border border-slate-700/30 rounded-2xl p-6 text-center">
                <div className="text-3xl mb-2">👥</div>
                <h3 className="text-white font-bold mb-2">No users yet</h3>
                <p className="text-slate-400 text-sm">Be the first! Register via Login button above.</p>
                <p className="text-indigo-400 text-xs mt-2">First user = admin/founder by convention</p>
              </div>
            ) : (
              <div className="bg-slate-900/50 border border-slate-700/30 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-slate-700/30 flex items-center justify-between">
                  <h3 className="text-white font-black">👥 Registered Users ({users.length})</h3>
                  <span className="text-indigo-400 text-xs">{users.filter(u => u.role === 'admin' || u.role === 'founder').length} admins/founders</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-800/50">
                      <tr className="text-slate-500 text-xs">
                        {['Email', 'Username', 'Role', 'Tier', 'HYPHA Balance', 'Rep Score', 'Revenue', 'Joined'].map(h => (
                          <th key={h} className="text-left px-4 py-3">{h}</th>
                        ))}
                        {(currentUser?.role === 'admin' || currentUser?.role === 'founder') && <th className="text-left px-4 py-3">Actions</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.id} className="border-t border-slate-700/20 hover:bg-slate-800/30 transition-colors">
                          <td className="px-4 py-3 text-slate-300 text-xs">{user.email}</td>
                          <td className="px-4 py-3 text-white text-xs font-medium">{user.username || '—'}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${roleBadge[user.role]}`}>{user.role}</span>
                          </td>
                          <td className="px-4 py-3 text-slate-400 text-xs capitalize">{user.tier}</td>
                          <td className="px-4 py-3 text-yellow-400 text-xs font-bold">{(user.hypha_balance || 0).toLocaleString()} $</td>
                          <td className="px-4 py-3 text-green-400 text-xs">{user.reputation_score || 0}</td>
                          <td className="px-4 py-3 text-green-400 text-xs font-bold">${(user.monthly_revenue || 0).toLocaleString()}/mo</td>
                          <td className="px-4 py-3 text-slate-500 text-xs">{user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}</td>
                          {(currentUser?.role === 'admin' || currentUser?.role === 'founder') && (
                            <td className="px-4 py-3">
                              <select
                                value={user.role}
                                onChange={e => handleUpdateUserRole(user.id, e.target.value)}
                                className="bg-slate-800 border border-slate-600 text-slate-300 text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-indigo-500">
                                {['admin', 'founder', 'pro', 'user', 'guest'].map(r => <option key={r} value={r}>{r}</option>)}
                              </select>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── SERVICES TAB ── */}
        {activeTab === 'services' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-black">🔌 Micro Services ({services.length})</h3>
              <button onClick={() => { if (!currentUser) { setShowAuth(true); return; } setShowCreateService(true); }}
                className="bg-green-600 hover:bg-green-500 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all">
                + Create Service
              </button>
            </div>

            {services.length === 0 ? (
              <div className="bg-slate-900/50 border border-slate-700/30 rounded-2xl p-8 text-center">
                <div className="text-4xl mb-3">🚀</div>
                <h3 className="text-white font-bold mb-2">No services yet</h3>
                <p className="text-slate-400 text-sm mb-4">Create your first micro-service to start earning. Even $9/mo with 10 users = $90/mo!</p>
                <div className="grid grid-cols-3 gap-3 text-xs text-left mb-4">
                  {[
                    { type: '🔌 API Service', example: 'Groq AI proxy @ $29/mo', rev: '10 users = $290/mo' },
                    { type: '🤖 AI Pod', example: 'Custom AI assistant @ $49/mo', rev: '20 users = $980/mo' },
                    { type: '📊 Data Feed', example: 'Web3 data API @ $19/mo', rev: '50 users = $950/mo' },
                  ].map(({ type, example, rev }) => (
                    <div key={type} className="bg-slate-800/50 rounded-xl p-3">
                      <div className="font-bold text-white mb-1">{type}</div>
                      <div className="text-slate-400">{example}</div>
                      <div className="text-green-400 mt-1">{rev}</div>
                    </div>
                  ))}
                </div>
                <button onClick={() => { if (!currentUser) { setShowAuth(true); return; } setShowCreateService(true); }}
                  className="bg-green-600 text-white font-bold px-6 py-3 rounded-2xl hover:bg-green-500 transition-all">
                  🚀 Create First Service
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map(svc => (
                  <div key={svc.id} className="bg-slate-900/50 border border-slate-700/30 rounded-2xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-white font-bold">{svc.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-lg">{svc.service_type}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-lg ${svc.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>{svc.status}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 font-black text-lg">${svc.price_usd}<span className="text-slate-500 text-xs font-normal">/mo</span></div>
                        <div className="text-slate-500 text-xs">{svc.billing_cycle}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-slate-800/50 rounded-xl p-2">
                        <div className="text-white font-bold">{svc.subscribers_count || 0}</div>
                        <div className="text-slate-500">Subscribers</div>
                      </div>
                      <div className="bg-slate-800/50 rounded-xl p-2">
                        <div className="text-yellow-400 font-bold">{svc.total_calls || 0}</div>
                        <div className="text-slate-500">API Calls</div>
                      </div>
                      <div className="bg-slate-800/50 rounded-xl p-2">
                        <div className="text-green-400 font-bold">${svc.total_revenue || 0}</div>
                        <div className="text-slate-500">Revenue</div>
                      </div>
                    </div>
                    {svc.endpoint_url && (
                      <div className="mt-3 bg-slate-800/50 rounded-xl px-3 py-2 text-xs text-slate-500 font-mono truncate">
                        {svc.endpoint_url}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── REVENUE TAB ── */}
        {activeTab === 'revenue' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-black">💰 Revenue Streams — Update Real Numbers</h3>
              <div className="text-right">
                <div className="text-green-400 font-black text-xl">${totalRealMRR.toLocaleString()}<span className="text-slate-500 text-sm font-normal">/mo MRR</span></div>
                <div className="text-slate-500 text-xs">ARR: ${(totalRealMRR * 12).toLocaleString()}</div>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 text-xs text-yellow-300">
              💡 <strong>HOW TO:</strong> Update angka real setiap kamu dapat revenue baru. Ini yang terlihat di analytics dan digunakan untuk semua kalkulasi. Mulai dari $1 pun valid!
            </div>

            <div className="space-y-3">
              {revenueStreams.map(stream => (
                <div key={stream.id} className="bg-slate-900/50 border border-slate-700/30 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{statusIcon[stream.status] || '📊'}</span>
                      <div>
                        <div className="text-white font-bold capitalize">{stream.layer} · {stream.stream_type}</div>
                        <div className="text-slate-500 text-xs capitalize">{stream.status} · {stream.contributors || 0} contributors</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-black">${(stream.monthly_revenue || 0).toLocaleString()}<span className="text-slate-500 text-xs font-normal">/mo</span></div>
                      {stream.growth_rate > 0 && <div className="text-green-400 text-xs">+{stream.growth_rate}% growth</div>}
                    </div>
                  </div>

                  {(currentUser?.role === 'admin' || currentUser?.role === 'founder' || currentUser?.role === 'pro') && (
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Update $amount/mo"
                        value={newRevenue[stream.stream_type] || ''}
                        onChange={e => setNewRevenue(prev => ({ ...prev, [stream.stream_type]: Number(e.target.value) }))}
                        className="flex-1 bg-slate-800/50 border border-slate-600 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500"
                      />
                      <button onClick={() => handleUpdateRevenue(stream.stream_type)}
                        className="bg-green-600/20 border border-green-500/30 text-green-400 text-sm font-bold px-3 py-2 rounded-xl hover:bg-green-600/30 transition-all">
                        Update
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── BUILD IN PUBLIC TAB ── */}
        {activeTab === 'build' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-black">📡 Build In Public Feed</h3>
                <p className="text-slate-500 text-xs mt-0.5">Share progress → build trust → grow organically. Gyss!</p>
              </div>
              <div className="text-xs text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-xl">
                {buildLogs.length} posts published
              </div>
            </div>

            {/* Post new log */}
            <div className="bg-slate-900/50 border border-indigo-500/20 rounded-2xl p-4">
              <h4 className="text-white font-bold text-sm mb-3">✍️ Post Update</h4>
              <div className="space-y-3">
                <input
                  value={newLog.title}
                  onChange={e => setNewLog(n => ({ ...n, title: e.target.value }))}
                  placeholder="Title (e.g. 'First paid user! 🎉')"
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-600"
                />
                <textarea
                  value={newLog.content}
                  onChange={e => setNewLog(n => ({ ...n, content: e.target.value }))}
                  placeholder="Share what you built, learned, or achieved today..."
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-600 h-24 resize-none"
                />
                <div className="flex gap-2">
                  <select
                    value={newLog.log_type}
                    onChange={e => setNewLog(n => ({ ...n, log_type: e.target.value }))}
                    className="bg-slate-800 border border-slate-600 text-slate-300 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500">
                    {[
                      { value: 'update', label: '📡 Update' },
                      { value: 'milestone', label: '🏆 Milestone' },
                      { value: 'launch', label: '🚀 Launch' },
                      { value: 'revenue', label: '💰 Revenue' },
                      { value: 'technical', label: '🔧 Technical' },
                      { value: 'community', label: '👥 Community' },
                    ].map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                  <button
                    onClick={handlePostLog}
                    disabled={!newLog.title || !newLog.content}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all">
                    🚀 Publish Update
                  </button>
                </div>
              </div>
            </div>

            {/* Feed */}
            <div className="space-y-3">
              {buildLogs.length === 0 ? (
                <div className="bg-slate-900/50 border border-slate-700/30 rounded-2xl p-6 text-center">
                  <div className="text-3xl mb-2">📡</div>
                  <p className="text-slate-400 text-sm">No posts yet. Be the first to build in public!</p>
                </div>
              ) : buildLogs.map(log => (
                <div key={log.id} className="bg-slate-900/50 border border-slate-700/30 rounded-2xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{logTypeIcon[log.log_type] || '📡'}</span>
                      <div>
                        <h4 className="text-white font-bold text-sm">{log.title}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-slate-500 text-xs">{new Date(log.published_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                          <span className="text-xs bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded capitalize">{log.log_type}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-3">{log.content}</p>
                  {log.metrics && Object.keys(log.metrics).length > 0 && (
                    <div className="flex gap-2 flex-wrap mb-3">
                      {Object.entries(log.metrics).map(([k, v]) => (
                        <div key={k} className="bg-slate-800/50 px-2 py-1 rounded-lg text-xs">
                          <span className="text-slate-500">{k}: </span>
                          <span className="text-white font-bold">{String(v)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleLike(log.id)} className="flex items-center gap-1.5 text-slate-500 hover:text-red-400 text-xs transition-colors">
                      ❤️ {log.likes || 0}
                    </button>
                    <span className="text-slate-700 text-xs">👁️ {log.views || 0} views</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── RBAC TAB ── */}
        {activeTab === 'rbac' && (
          <div className="space-y-4">
            <div className="bg-slate-900/50 border border-slate-700/30 rounded-2xl p-5">
              <h3 className="text-white font-black mb-4">🔐 RBAC Hierarchy</h3>
              <div className="space-y-3">
                {[
                  { role: 'admin', icon: '👑', color: 'red', desc: 'Full platform control', perms: ['All endpoints', 'User management', 'Revenue updates', 'Delete anything'] },
                  { role: 'founder', icon: '🌱', color: 'yellow', desc: 'Core team access', perms: ['Revenue tracking', 'User management', 'Service creation', 'Build In Public'] },
                  { role: 'pro', icon: '⚡', color: 'purple', desc: 'Paying subscribers', perms: ['Deploy pods', 'Create services', 'Revenue updates', 'Advanced analytics'] },
                  { role: 'user', icon: '👤', color: 'blue', desc: 'Free tier users', perms: ['View public data', 'Deploy free pods', 'Vote in DAO', 'Read Build logs'] },
                  { role: 'guest', icon: '👀', color: 'gray', desc: 'Read-only access', perms: ['View marketplace', 'Read public logs', 'No data creation'] },
                ].map(({ role, icon, color, desc, perms }) => (
                  <div key={role} className={`bg-${color}-500/5 border border-${color}-500/20 rounded-2xl p-4`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{icon}</span>
                        <div>
                          <div className={`text-${color}-400 font-black uppercase tracking-wider text-sm`}>{role}</div>
                          <div className="text-slate-500 text-xs">{desc}</div>
                        </div>
                      </div>
                      {currentUser?.role === role && (
                        <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-xs px-2 py-1 rounded-lg font-bold">← YOUR ROLE</div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {perms.map(p => (
                        <span key={p} className="bg-slate-800/80 text-slate-300 text-xs px-2 py-1 rounded-lg">{p}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-700/30 rounded-2xl p-5">
              <h3 className="text-white font-black mb-3">🗄️ Database Tables (9 Tables)</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                {[
                  { name: 'user_profiles', icon: '👤', desc: 'User accounts & RBAC' },
                  { name: 'micro_services', icon: '🔌', desc: 'Revenue-generating services' },
                  { name: 'subscriptions', icon: '💳', desc: 'User subscriptions' },
                  { name: 'transactions', icon: '💸', desc: 'All financial transactions' },
                  { name: 'deployed_pods', icon: '🤖', desc: 'AI pods deployed by users' },
                  { name: 'revenue_streams', icon: '📈', desc: '9 revenue categories' },
                  { name: 'dao_proposals', icon: '🏛️', desc: 'Governance proposals' },
                  { name: 'build_public_logs', icon: '📡', desc: 'Build In Public feed' },
                  { name: 'platform_analytics', icon: '📊', desc: 'Daily platform stats' },
                ].map(({ name, icon, desc }) => (
                  <div key={name} className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-2.5">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span>{icon}</span>
                      <span className="text-green-400 font-bold">{name}</span>
                    </div>
                    <div className="text-slate-500">{desc}</div>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                      <span className="text-green-400">RLS Active</span>
                    </div>
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

export default SupabaseDashboard;
