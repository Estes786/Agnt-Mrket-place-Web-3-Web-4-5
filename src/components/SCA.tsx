
// ============================================================
// GANI HYPHA — Sovereign Contract Analyst (SCA) v1.0
// AI-Powered Contract Analysis for Real Estate Professionals
// Revenue Engine: Rp 149K - 1.5M / bulan
// ============================================================

import React, { useState, useRef } from 'react';

interface ContractAnalysis {
  summary: string;
  risk_score: number;
  risk_level: 'RENDAH' | 'SEDANG' | 'TINGGI' | 'KRITIS';
  dangerous_clauses: Array<{
    clause: string;
    risk: string;
    recommendation: string;
  }>;
  missing_clauses: string[];
  action_items: string[];
  overall_recommendation: string;
  analysis_time_ms?: number;
}

const SCA: React.FC = () => {
  const [tab, setTab] = useState<'analyze' | 'pricing' | 'history'>('analyze');
  const [contractText, setContractText] = useState('');
  const [fileName, setFileName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ContractAnalysis | null>(null);
  const [error, setError] = useState('');
  const [freeUsed, setFreeUsed] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const riskColor = {
    RENDAH: 'text-emerald-400 bg-emerald-900/20 border-emerald-500/30',
    SEDANG: 'text-amber-400 bg-amber-900/20 border-amber-500/30',
    TINGGI: 'text-orange-400 bg-orange-900/20 border-orange-500/30',
    KRITIS: 'text-red-400 bg-red-900/20 border-red-500/30',
  };

  const riskScoreColor = (score: number) => {
    if (score <= 3) return 'text-emerald-400';
    if (score <= 6) return 'text-amber-400';
    if (score <= 8) return 'text-orange-400';
    return 'text-red-400';
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setContractText(ev.target?.result as string);
      setAnalysis(null);
      setError('');
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setContractText(ev.target?.result as string);
      setAnalysis(null);
      setError('');
    };
    reader.readAsText(file);
  };

  const analyzeContract = async () => {
    if (!contractText.trim()) {
      setError('⚠️ Paste kontrak atau upload file terlebih dahulu!');
      return;
    }
    if (freeUsed >= 1) {
      setError('🔒 Anda sudah menggunakan 1 analisis gratis. Upgrade ke paket berbayar untuk lebih banyak analisis!');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setAnalysis(null);
    const startTime = Date.now();

    try {
      const response = await fetch('/api/sca/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contract_text: contractText.slice(0, 8000), // limit to 8K chars
          document_name: fileName || 'kontrak-properti.txt',
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Gagal menganalisis kontrak');
      
      data.analysis_time_ms = Date.now() - startTime;
      setAnalysis(data);
      setFreeUsed(prev => prev + 1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan';
      setError(`❌ ${msg}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const sampleContract = `PERJANJIAN JUAL BELI TANAH DAN BANGUNAN

Pada hari ini, Senin, tanggal 10 Februari 2026, bertempat di Jakarta Selatan, telah dibuat dan ditandatangani perjanjian jual beli antara:

Pihak I (Penjual): Budi Santoso, KTP No. 317...
Pihak II (Pembeli): Ani Rahayu, KTP No. 327...

Pasal 1 - OBJEK PERJANJIAN
Penjual dengan ini menjual kepada Pembeli sebidang tanah beserta bangunan yang berdiri di atasnya, terletak di Jl. Merpati No. 15, Jakarta Selatan. 

Pasal 2 - HARGA DAN CARA PEMBAYARAN
Harga jual beli tanah dan bangunan tersebut disepakati sebesar Rp 850.000.000 (Delapan ratus lima puluh juta rupiah). Pembayaran dilakukan secara tunai penuh pada saat penandatanganan perjanjian ini.

Pasal 3 - PENYERAHAN
Penyerahan fisik objek dilakukan dalam waktu 90 hari setelah penandatanganan.

Pasal 4 - BIAYA
Semua biaya yang timbul termasuk BPHTB, PPh dan biaya notaris menjadi tanggungan Pembeli sepenuhnya.

Pasal 5 - SENGKETA
Apabila terjadi perselisihan, para pihak sepakat untuk menyelesaikan secara musyawarah. Jika tidak tercapai kesepakatan, diselesaikan melalui Pengadilan Negeri Jakarta Selatan.`;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border-b border-slate-800 px-6 py-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-xl">
              ⚖️
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Sovereign Contract Analyst</h1>
              <p className="text-xs text-indigo-300 font-mono">GANI HYPHA · AI Legal Analysis · Powered by Groq</p>
            </div>
            <div className="ml-auto text-right">
              <div className="text-xs font-mono text-emerald-400 bg-emerald-900/20 border border-emerald-500/30 rounded-lg px-3 py-1">
                ⚡ &lt;30 detik analisis
              </div>
            </div>
          </div>
          <p className="text-slate-400 text-sm mt-2">
            AI kami membaca ribuan klausul kontrak properti, mendeteksi risiko hukum yang sering terlewat manusia — 
            lebih cepat dari lawyer, lebih murah dari notaris.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-800 px-6">
        <div className="max-w-5xl mx-auto flex gap-6">
          {[
            { id: 'analyze', label: '🔍 Analisis Kontrak', },
            { id: 'pricing', label: '💰 Harga & Paket', },
            { id: 'history', label: '📋 Riwayat', },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as typeof tab)}
              className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === t.id
                  ? 'border-indigo-500 text-white'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* ANALYZE TAB */}
        {tab === 'analyze' && (
          <div className="space-y-6">
            {/* Usage counter */}
            <div className="flex items-center gap-3 text-sm">
              <div className={`px-3 py-1 rounded-full border font-mono text-xs ${
                freeUsed === 0 
                  ? 'bg-emerald-900/20 border-emerald-500/30 text-emerald-400'
                  : 'bg-red-900/20 border-red-500/30 text-red-400'
              }`}>
                {freeUsed === 0 ? '✅ 1 analisis gratis tersedia' : '🔒 Kuota gratis terpakai'}
              </div>
              {freeUsed >= 1 && (
                <button
                  onClick={() => setTab('pricing')}
                  className="text-indigo-400 hover:text-indigo-300 underline text-xs"
                >
                  Upgrade untuk lebih banyak analisis →
                </button>
              )}
            </div>

            {/* Upload Area */}
            <div
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              className="border-2 border-dashed border-slate-700 hover:border-indigo-500/50 rounded-2xl p-8 text-center transition-colors cursor-pointer"
              onClick={() => fileRef.current?.click()}
            >
              <input
                ref={fileRef}
                type="file"
                accept=".txt,.pdf,.docx,.doc"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="text-4xl mb-3">📄</div>
              <p className="text-white font-medium mb-1">
                {fileName ? `✅ ${fileName}` : 'Upload file kontrak'}
              </p>
              <p className="text-slate-500 text-sm">
                Drag & drop atau klik — Mendukung .TXT, .PDF, .DOCX
              </p>
            </div>

            {/* OR divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-slate-600 text-xs">atau paste teks kontrak</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            {/* Text Input */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm text-slate-400">Teks Kontrak</label>
                <button
                  onClick={() => { setContractText(sampleContract); setFileName('contoh-kontrak.txt'); setAnalysis(null); }}
                  className="text-xs text-indigo-400 hover:text-indigo-300"
                >
                  📋 Gunakan contoh kontrak
                </button>
              </div>
              <textarea
                value={contractText}
                onChange={e => { setContractText(e.target.value); setAnalysis(null); }}
                rows={8}
                placeholder="Paste isi kontrak di sini..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm text-slate-300 placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/20 resize-none font-mono"
              />
              <div className="flex justify-between text-xs text-slate-600 mt-1">
                <span>{contractText.length} karakter</span>
                <span>Maks: 8,000 karakter per analisis</span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Analyze Button */}
            <button
              onClick={analyzeContract}
              disabled={isAnalyzing || !contractText.trim() || freeUsed >= 1}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex items-center justify-center gap-3 text-lg"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Menganalisis...
                </>
              ) : (
                <>⚖️ Analisis Kontrak Sekarang</>
              )}
            </button>

            {/* Results */}
            {analysis && (
              <div className="space-y-4 mt-6">
                {/* Risk Score Header */}
                <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-white text-lg">Hasil Analisis</h3>
                    <div className="flex items-center gap-3">
                      {analysis.analysis_time_ms && (
                        <span className="text-xs text-slate-500 font-mono">
                          ⚡ {analysis.analysis_time_ms}ms
                        </span>
                      )}
                      <div className={`px-3 py-1 rounded-full border text-sm font-bold ${riskColor[analysis.risk_level]}`}>
                        {analysis.risk_level}
                      </div>
                    </div>
                  </div>

                  {/* Risk Score Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Skor Risiko</span>
                      <span className={`font-mono font-bold text-base ${riskScoreColor(analysis.risk_score)}`}>
                        {analysis.risk_score}/10
                      </span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${
                          analysis.risk_score <= 3 ? 'bg-emerald-500' :
                          analysis.risk_score <= 6 ? 'bg-amber-500' :
                          analysis.risk_score <= 8 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${analysis.risk_score * 10}%` }}
                      />
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="text-slate-300 text-sm leading-relaxed bg-slate-800/50 rounded-xl p-3">
                    📝 {analysis.summary}
                  </p>
                </div>

                {/* Dangerous Clauses */}
                {analysis.dangerous_clauses.length > 0 && (
                  <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                    <h4 className="font-bold text-red-400 mb-4 flex items-center gap-2">
                      ⚠️ Klausul Berbahaya Ditemukan ({analysis.dangerous_clauses.length})
                    </h4>
                    <div className="space-y-4">
                      {analysis.dangerous_clauses.map((item, i) => (
                        <div key={i} className="bg-red-900/10 border border-red-500/20 rounded-xl p-4">
                          <p className="text-sm text-slate-300 mb-2 font-mono bg-slate-900 rounded p-2">
                            "{item.clause}"
                          </p>
                          <p className="text-red-400 text-sm mb-1">🚨 Risiko: {item.risk}</p>
                          <p className="text-emerald-400 text-sm">💡 Rekomendasi: {item.recommendation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Clauses */}
                {analysis.missing_clauses.length > 0 && (
                  <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                    <h4 className="font-bold text-amber-400 mb-3 flex items-center gap-2">
                      📋 Klausul yang Hilang ({analysis.missing_clauses.length})
                    </h4>
                    <ul className="space-y-2">
                      {analysis.missing_clauses.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                          <span className="text-amber-500 mt-0.5">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Items */}
                {analysis.action_items.length > 0 && (
                  <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                    <h4 className="font-bold text-indigo-400 mb-3">🎯 Langkah yang Disarankan</h4>
                    <ul className="space-y-2">
                      {analysis.action_items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                          <span className="text-indigo-400 font-bold mt-0.5">{i + 1}.</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Overall Recommendation */}
                <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 rounded-2xl p-6">
                  <h4 className="font-bold text-white mb-2">🏛️ Rekomendasi Akhir</h4>
                  <p className="text-slate-300 text-sm leading-relaxed">{analysis.overall_recommendation}</p>
                </div>

                {/* CTA to upgrade */}
                <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-2xl p-6 text-center">
                  <p className="text-white font-bold mb-2">Butuh lebih banyak analisis?</p>
                  <p className="text-slate-400 text-sm mb-4">
                    Paket Profesional: Rp 499.000/bulan untuk 15 analisis
                  </p>
                  <button
                    onClick={() => setTab('pricing')}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2 rounded-xl font-medium text-sm hover:opacity-90 transition-opacity"
                  >
                    Lihat Semua Paket →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PRICING TAB */}
        {tab === 'pricing' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Paket Layanan SCA</h2>
            <p className="text-slate-400">Pilih paket yang sesuai dengan kebutuhan analisis kontrak Anda</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: 'Basic Analyst',
                  price: 'Rp 149.000',
                  usd: '~$9',
                  period: '/bulan',
                  icon: '🔍',
                  analyses: 3,
                  features: [
                    'Analisis risiko dasar',
                    'Deteksi 5 klausul berbahaya',
                    'Rekomendasi tindakan',
                    'Bahasa Indonesia',
                    'Support via email',
                  ],
                  cta: 'Mulai Basic',
                  highlight: false,
                  badge: null,
                },
                {
                  name: 'Profesional',
                  price: 'Rp 499.000',
                  usd: '~$30',
                  period: '/bulan',
                  icon: '⚖️',
                  analyses: 15,
                  features: [
                    'Semua fitur Basic',
                    'Analisis kepatuhan hukum',
                    'Cek regulasi ATR/BPN',
                    'Priority processing',
                    'Download laporan PDF',
                    'Support via WhatsApp',
                  ],
                  cta: 'Mulai Profesional',
                  highlight: true,
                  badge: 'POPULER',
                },
                {
                  name: 'Biro / Enterprise',
                  price: 'Rp 1.499.000',
                  usd: '~$90',
                  period: '/bulan',
                  icon: '🏢',
                  analyses: 50,
                  features: [
                    'Semua fitur Profesional',
                    'API access',
                    'Custom integrasi',
                    'Dedicated account manager',
                    'Training tim',
                    'SLA 99.9%',
                  ],
                  cta: 'Hubungi Kami',
                  highlight: false,
                  badge: 'ENTERPRISE',
                },
              ].map((plan, i) => (
                <div
                  key={i}
                  className={`rounded-2xl p-6 border ${
                    plan.highlight
                      ? 'border-indigo-500 bg-gradient-to-br from-indigo-900/30 to-purple-900/20'
                      : 'border-slate-800 bg-slate-900'
                  } relative`}
                >
                  {plan.badge && (
                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold ${
                      plan.highlight
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-700 text-slate-300'
                    }`}>
                      {plan.badge}
                    </div>
                  )}

                  <div className="text-3xl mb-3">{plan.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                  <div className="mb-1">
                    <span className="text-2xl font-black text-white">{plan.price}</span>
                    <span className="text-slate-500 text-sm">{plan.period}</span>
                  </div>
                  <p className="text-xs text-slate-600 mb-4">{plan.usd}/month</p>

                  <div className="bg-slate-800/50 rounded-xl p-3 mb-4 text-center">
                    <span className="text-2xl font-black text-indigo-400">{plan.analyses}</span>
                    <span className="text-slate-400 text-sm"> analisis/bulan</span>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-slate-300">
                        <span className="text-emerald-400">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-3 rounded-xl font-medium text-sm transition-opacity ${
                      plan.highlight
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-6">
              <h3 className="font-bold text-white mb-2">💬 Cara Berlangganan</h3>
              <p className="text-slate-400 text-sm mb-4">
                Untuk memulai, hubungi kami melalui:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { icon: '📱', label: 'WhatsApp', value: 'Hubungi via WA', color: 'text-emerald-400' },
                  { icon: '📧', label: 'Email', value: 'elmatador0197@gmail.com', color: 'text-blue-400' },
                  { icon: '🐦', label: 'Twitter/X', value: '@GaniHypha', color: 'text-sky-400' },
                ].map((c, i) => (
                  <div key={i} className="bg-slate-800 rounded-xl p-4">
                    <div className="text-2xl mb-1">{c.icon}</div>
                    <div className="text-xs text-slate-500">{c.label}</div>
                    <div className={`text-sm font-medium ${c.color}`}>{c.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* HISTORY TAB */}
        {tab === 'history' && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-white mb-2">Riwayat Analisis</h3>
            <p className="text-slate-500 text-sm mb-6">
              Login untuk melihat riwayat analisis kontrak Anda
            </p>
            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity">
              🔗 Connect Wallet / Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SCA;
