
import React, { useState } from 'react';

const MediaLab: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeMode, setActiveMode] = useState<'image' | 'content' | 'video'>('image');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsGenerating(false);
  };

  const samples = [
    { type: 'Image', prompt: 'Futuristic DeFi dashboard Web4', status: 'Generated', time: '2.1s', engine: 'Groq Vision' },
    { type: 'Content', prompt: 'Web3 DID explainer thread', status: 'Generated', time: '1.4s', engine: 'Groq llama-70b' },
    { type: 'Video', prompt: 'Autonomous agent deployment', status: 'Queued', time: '-', engine: 'CF AI Workers' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-purple-500/10 text-purple-400 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-purple-500/20">
          <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></span>
          Groq AI Powered Media Lab
        </div>
        <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Media Lab v2</h2>
        <p className="text-slate-400 max-w-xl mx-auto text-sm">Generate AI-powered content, images, and videos using Groq + Cloudflare AI Workers for your Web4 empire.</p>
      </div>

      {/* Mode Selector */}
      <div className="flex justify-center">
        <div className="flex bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/60">
          {(['image', 'content', 'video'] as const).map(mode => (
            <button key={mode} onClick={() => setActiveMode(mode)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeMode === mode ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >{mode === 'image' ? '🖼️' : mode === 'content' ? '📝' : '🎬'} {mode}</button>
          ))}
        </div>
      </div>

      {/* Generation Panel */}
      <div className="glass rounded-[2.5rem] p-10 border border-slate-800 shadow-3xl space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest block mb-2">
              {activeMode === 'image' ? 'Image Generation Prompt' : activeMode === 'content' ? 'Content Generation Brief' : 'Video Scene Description'}
            </label>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder={
                activeMode === 'image' ? 'A futuristic Web4 control center with glowing Groq AI nodes...' :
                activeMode === 'content' ? 'Write a Twitter thread about Web3 → Web4 migration benefits...' :
                'An autonomous agent deploying across Cloudflare edge nodes globally...'
              }
              className="w-full h-28 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {activeMode === 'image' && [
            { label: 'Aspect', options: ['16:9', '1:1', '9:16'] },
            { label: 'Style', options: ['Cinematic', 'Neon', 'Abstract'] },
            { label: 'Quality', options: ['1K', '2K', '4K'] }
          ].map(config => (
            <div key={config.label}>
              <label className="text-[8px] font-black text-slate-600 uppercase block mb-1.5">{config.label}</label>
              <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none">
                {config.options.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
          {activeMode === 'content' && [
            { label: 'Platform', options: ['Twitter/X', 'LinkedIn', 'Blog'] },
            { label: 'Tone', options: ['Professional', 'Casual', 'Technical'] },
            { label: 'Length', options: ['Short', 'Medium', 'Long'] }
          ].map(config => (
            <div key={config.label}>
              <label className="text-[8px] font-black text-slate-600 uppercase block mb-1.5">{config.label}</label>
              <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none">
                {config.options.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>

        {/* AI Engine Badge */}
        <div className="flex items-center gap-2 p-3 bg-slate-900/40 rounded-xl border border-slate-800/60">
          <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">AI Engine:</span>
          <span className="text-[9px] font-black text-purple-400 uppercase">Groq llama-3.3-70b</span>
          <span className="text-slate-700">•</span>
          <span className="text-[9px] font-black text-orange-400 uppercase">Cloudflare Workers</span>
          <span className="text-slate-700">•</span>
          <span className="text-[9px] font-mono text-emerald-400">~800ms inference</span>
        </div>

        <button onClick={handleGenerate} disabled={isGenerating || !prompt}
          className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-2xl shadow-indigo-600/20 active:scale-95"
        >
          {isGenerating ? (
            <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Groq Processing...</>
          ) : (
            <><span>⚡</span>Generate with Groq AI</>
          )}
        </button>
      </div>

      {/* Sample History */}
      <div>
        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Recent Generations</h4>
        <div className="space-y-3">
          {samples.map((s, i) => (
            <div key={i} className="flex items-center justify-between p-5 glass rounded-2xl border border-slate-800/60 hover:border-slate-700 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-lg">
                  {s.type === 'Image' ? '🖼️' : s.type === 'Content' ? '📝' : '🎬'}
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{s.prompt}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[8px] font-mono text-purple-400 uppercase">{s.engine}</span>
                    <span className="text-slate-700">•</span>
                    <span className="text-[8px] font-mono text-slate-600">{s.time}</span>
                  </div>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase ${
                s.status === 'Generated' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>{s.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MediaLab;
