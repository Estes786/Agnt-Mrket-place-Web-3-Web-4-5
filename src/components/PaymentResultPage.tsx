import React, { useState, useEffect } from 'react';

interface PaymentStatus {
  status: 'loading' | 'success' | 'pending' | 'failed' | 'error';
  orderId: string;
  planId: string;
  amount?: number;
  message?: string;
  reference?: string;
  duitku_env?: string;
}

const PaymentResultPage: React.FC = () => {
  const [state, setState] = useState<PaymentStatus>({
    status: 'loading',
    orderId: '',
    planId: '',
  });
  const [countdown, setCountdown] = useState(10);
  const [autoRedirect, setAutoRedirect] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('order') || '';
    const planId = params.get('plan') || '';
    const resultCode = params.get('resultCode') || ''; // dari Duitku redirect

    setState(prev => ({ ...prev, orderId, planId }));

    if (!orderId) {
      setState({ status: 'error', orderId: '', planId, message: 'Order ID tidak ditemukan.' });
      return;
    }

    // Jika Duitku sudah kirim resultCode via returnUrl
    if (resultCode === '00') {
      setState({ status: 'success', orderId, planId, message: 'Pembayaran berhasil dikonfirmasi!' });
      return;
    }
    if (resultCode === '01') {
      setState({ status: 'failed', orderId, planId, message: 'Pembayaran gagal atau dibatalkan.' });
      return;
    }

    // Cek status ke API kita
    checkPaymentStatus(orderId, planId);
  }, []);

  const checkPaymentStatus = async (orderId: string, planId: string) => {
    try {
      const res = await fetch(`/api/payment/check/${encodeURIComponent(orderId)}`);
      const data = await res.json() as {
        success: boolean;
        status: string;
        amount?: number;
        reference?: string;
        mode?: string;
        status_message?: string;
      };

      if (!data.success) {
        // Jika check gagal, kemungkinan masih pending
        setState({
          status: 'pending',
          orderId,
          planId,
          message: 'Pembayaran sedang diverifikasi. Biasanya 1–5 menit.',
          duitku_env: data.mode,
        });
        return;
      }

      const statusMap: Record<string, 'success' | 'pending' | 'failed'> = {
        paid: 'success',
        '00': 'success',
        SUCCESS: 'success',
        pending: 'pending',
        '01': 'pending',
        PENDING: 'pending',
        failed: 'failed',
        '02': 'failed',
        FAILED: 'failed',
      };

      const mapped = statusMap[data.status] || 'pending';
      setState({
        status: mapped,
        orderId,
        planId,
        amount: data.amount,
        reference: data.reference,
        duitku_env: data.mode,
        message: mapped === 'success'
          ? '✅ Pembayaran berhasil! Akun Anda sedang diaktifkan.'
          : mapped === 'pending'
          ? '⏳ Pembayaran sedang diproses. Cek email untuk konfirmasi.'
          : '❌ Pembayaran gagal. Silakan coba lagi.',
      });
    } catch {
      setState(s => ({
        ...s,
        status: 'pending',
        message: '⏳ Sedang memverifikasi pembayaran Anda...',
      }));
    }
  };

  // Auto-redirect countdown untuk success
  useEffect(() => {
    if (state.status === 'success' && autoRedirect) {
      const timer = setInterval(() => {
        setCountdown(c => {
          if (c <= 1) {
            clearInterval(timer);
            window.location.href = '/';
            return 0;
          }
          return c - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [state.status, autoRedirect]);

  const planLabels: Record<string, string> = {
    'sca-starter': 'SCA Starter', 'sca-pro': 'SCA Professional', 'sca-enterprise': 'SCA Enterprise',
    'sica-starter': 'SICA Starter', 'sica-pro': 'SICA Professional', 'sica-enterprise': 'SICA Enterprise',
    'shga-lebaran': 'SHGA Lebaran Edition', 'shga-pro': 'SHGA Pro', 'shga-enterprise': 'SHGA Enterprise',
    'bde-starter': 'BDE Starter Barber', 'bde-pro': 'BDE Pro Dynasty', 'bde-enterprise': 'BDE Dynasty Empire',
    'sl-guardian': 'SL Family Guardian', 'sl-dynasty': 'SL Dynasty Legacy', 'sl-sovereign': 'SL Sovereign Family',
    'sma-starter': 'SMA Starter Bundle', 'sma-pro': 'SMA Professional', 'sma-enterprise': 'SMA Enterprise',
  };

  const agentColor: Record<string, string> = {
    sca: 'from-violet-600 to-purple-700',
    sica: 'from-amber-500 to-orange-600',
    shga: 'from-rose-500 to-pink-600',
    bde: 'from-blue-600 to-cyan-600',
    sl: 'from-yellow-500 to-amber-600',
    sma: 'from-emerald-500 to-teal-600',
  };
  const agentPrefix = state.planId?.split('-')[0] || 'sca';
  const gradient = agentColor[agentPrefix] || 'from-violet-600 to-purple-700';

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 font-sans">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-900/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 text-white font-bold text-xl">
            <span className="text-2xl">🌿</span>
            <span>GANI HYPHA</span>
          </div>
          <p className="text-gray-500 text-xs mt-1">Sovereign AI Ecosystem</p>
        </div>

        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          {/* Top gradient bar */}
          <div className={`h-1.5 w-full bg-gradient-to-r ${gradient}`} />

          <div className="p-8 text-center">
            {/* Status Icon */}
            {state.status === 'loading' && (
              <div className="text-5xl mb-4 animate-spin">⚙️</div>
            )}
            {state.status === 'success' && (
              <div className="relative inline-block mb-4">
                <div className="text-6xl">✅</div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping" />
              </div>
            )}
            {state.status === 'pending' && (
              <div className="text-5xl mb-4 animate-pulse">⏳</div>
            )}
            {state.status === 'failed' && (
              <div className="text-5xl mb-4">❌</div>
            )}
            {state.status === 'error' && (
              <div className="text-5xl mb-4">⚠️</div>
            )}

            {/* Title */}
            <h1 className="text-white font-bold text-2xl mb-2">
              {state.status === 'loading' && 'Memeriksa Pembayaran...'}
              {state.status === 'success' && 'Pembayaran Berhasil! 🎉'}
              {state.status === 'pending' && 'Menunggu Konfirmasi'}
              {state.status === 'failed' && 'Pembayaran Gagal'}
              {state.status === 'error' && 'Terjadi Kesalahan'}
            </h1>

            {/* Message */}
            <p className="text-gray-400 text-sm mb-6">
              {state.message || 'Sedang memverifikasi pembayaran Anda...'}
            </p>

            {/* Order Details */}
            {state.orderId && (
              <div className="bg-gray-800/60 rounded-xl p-4 mb-6 text-left space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Order ID</span>
                  <span className="text-white font-mono text-xs break-all text-right max-w-[180px]">
                    {state.orderId.slice(-24)}
                  </span>
                </div>
                {state.planId && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Paket</span>
                    <span className="text-white font-medium">
                      {planLabels[state.planId] || state.planId}
                    </span>
                  </div>
                )}
                {state.amount && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Jumlah</span>
                    <span className="text-green-400 font-bold">
                      Rp {state.amount.toLocaleString('id-ID')}
                    </span>
                  </div>
                )}
                {state.reference && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Referensi</span>
                    <span className="text-gray-300 font-mono text-xs">{state.reference}</span>
                  </div>
                )}
                {state.duitku_env && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Mode</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      state.duitku_env === 'production'
                        ? 'bg-green-900/40 text-green-400'
                        : 'bg-amber-900/40 text-amber-400'
                    }`}>
                      {state.duitku_env === 'production' ? '🟢 Production' : '🟡 Sandbox'}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Success actions */}
            {state.status === 'success' && (
              <div className="space-y-3">
                <div className="bg-green-900/20 border border-green-800/40 rounded-xl p-3 text-sm text-green-400">
                  📧 Email konfirmasi dan link akses telah dikirim ke email Anda.
                </div>
                {autoRedirect && (
                  <p className="text-gray-600 text-xs">
                    Redirect ke dashboard dalam <span className="text-white font-bold">{countdown}s</span>
                    {' '}·{' '}
                    <button onClick={() => setAutoRedirect(false)} className="text-gray-400 underline">
                      batal
                    </button>
                  </p>
                )}
                <a
                  href="/"
                  className={`block w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r ${gradient} hover:opacity-90 transition-opacity`}
                >
                  🏠 Ke Dashboard
                </a>
                <button
                  onClick={() => checkPaymentStatus(state.orderId, state.planId)}
                  className="block w-full py-2 rounded-xl text-gray-400 text-sm hover:text-white border border-gray-800 hover:border-gray-600 transition-all"
                >
                  🔄 Refresh Status
                </button>
              </div>
            )}

            {/* Pending actions */}
            {state.status === 'pending' && (
              <div className="space-y-3">
                <div className="bg-amber-900/20 border border-amber-800/40 rounded-xl p-3 text-sm text-amber-400">
                  ⏳ Duitku sedang memproses pembayaran Anda. Biasanya selesai dalam 1–5 menit.
                </div>
                <button
                  onClick={() => {
                    setState(s => ({ ...s, status: 'loading' }));
                    checkPaymentStatus(state.orderId, state.planId);
                  }}
                  className="w-full py-3 rounded-xl font-semibold text-white bg-amber-700 hover:bg-amber-600 transition-colors"
                >
                  🔄 Cek Status Sekarang
                </button>
                <a
                  href="/"
                  className="block w-full py-2 rounded-xl text-gray-400 text-sm hover:text-white border border-gray-800 hover:border-gray-600 transition-all text-center"
                >
                  Kembali ke Dashboard
                </a>
              </div>
            )}

            {/* Failed actions */}
            {(state.status === 'failed' || state.status === 'error') && (
              <div className="space-y-3">
                <div className="bg-red-900/20 border border-red-800/40 rounded-xl p-3 text-sm text-red-400">
                  💬 Butuh bantuan? Hubungi kami via WhatsApp atau email.
                </div>
                <a
                  href="/"
                  className={`block w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r ${gradient} hover:opacity-90 transition-opacity`}
                >
                  🔄 Coba Lagi
                </a>
                <a
                  href="https://wa.me/6285643383832?text=Halo%20Admin%20GANI%20HYPHA%2C%20saya%20ada%20masalah%20pembayaran%20order%20ID%3A%20"
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full py-2 rounded-xl text-green-400 text-sm border border-green-800/40 hover:bg-green-900/20 transition-all text-center"
                >
                  💬 Hubungi via WhatsApp
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-700 text-xs mt-4">
          Powered by Duitku PG · "Akar Dalam, Cabang Tinggi" 🙏🏻
        </p>
      </div>
    </div>
  );
};

export default PaymentResultPage;
