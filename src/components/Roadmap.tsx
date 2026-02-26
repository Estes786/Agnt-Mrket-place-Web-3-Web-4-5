
import React from 'react';

const Roadmap: React.FC = () => {
  const steps = [
    { id: '01', title: 'Web3 Foundation (NOW)', desc: 'Establish DID identity, connect wallet, deploy smart contracts. Supabase RLS for data sovereignty. Stack: Cloudflare + Groq + Supabase.', icon: '🔗', status: 'Active', progress: 100 },
    { id: '02', title: 'Deploy AI Agent Pods', desc: 'Select industry blueprints from Marketplace. Each pod is a Groq-powered autonomous agent with LangChain orchestration.', icon: '📦', status: 'Ready', progress: 100 },
    { id: '03', title: 'Activate Web4 Economy', desc: 'Enable Sovereign Protocol. Agents begin autonomous yield farming, DeFi execution, and A2A service trading via CrewAI crews.', icon: '⚡', status: 'Ready', progress: 85 },
    { id: '04', title: 'Harvest Autonomous Yield', desc: 'Monitor the Quantum Ledger as Groq-powered agents generate HYPHA through industrial optimization and DeFi strategies.', icon: '💰', status: 'Scaling', progress: 60 },
    { id: '05', title: 'Scale to Global Web5 Mesh', desc: 'Interconnect pods into recursive DID+DWN mycelium network. Full sovereignty with Decentralized Web Nodes (DWN).', icon: '🌍', status: 'Pending', progress: 25 }
  ];

  const webEvolution = [
    { v: '1.0', label: 'Read', desc: 'Static Blueprints', color: 'slate', done: true },
    { v: '2.0', label: 'Write', desc: 'Marketplace UI', color: 'blue', done: true },
    { v: '3.0', label: 'Own', desc: 'DID + Wallet + HYPHA', color: 'emerald', done: true, current: false },
    { v: '4.0', label: 'Execute', desc: 'Groq + CrewAI + LangChain', color: 'indigo', done: false, current: true },
    { v: '5.0', label: 'Sovereign', desc: 'DWN + Mesh + ZK Proofs', color: 'purple', done: false }
  ];

  const techStack = [
    { category: 'Infrastructure', items: ['Cloudflare Pages', 'Cloudflare Workers', 'Cloudflare R2', 'Cloudflare KV'], color: 'text-orange-400', icon: '☁️' },
    { category: 'AI/LLM', items: ['Groq (llama-3.3-70b)', 'LangChain Orchestration', 'CrewAI Multi-Agent', 'LangSmith Monitoring'], color: 'text-purple-400', icon: '🤖' },
    { category: 'Database', items: ['Supabase PostgreSQL', 'Supabase RLS', 'Supabase Realtime', 'Supabase Vector'], color: 'text-emerald-400', icon: '🗄️' },
    { category: 'Web3', items: ['W3C DID Protocol', 'IPFS/Arweave Storage', 'Ethereum/Polygon', 'Chainlink Oracles'], color: 'text-indigo-400', icon: '🔗' }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-indigo-500/20">
          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
          Web3 → Web4 → Web5 Path
        </div>
        <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic">Sovereign Wealth Journey</h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
          Gyss! 😌 Follow the Hypha Roadmap from Web3 foundation (DID + Smart Contracts) to Web4 (Groq AI Agents + CrewAI) and beyond to Web5 (Full Digital Sovereignty).
        </p>
      </div>

      {/* Roadmap Steps */}
      <div className="relative space-y-8">
        <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500 via-slate-800 to-transparent hidden md:block"></div>
        {steps.map((step, index) => (
          <div key={step.id} className="relative flex flex-col md:flex-row gap-6 group">
            <div className={`flex-shrink-0 w-16 h-16 rounded-2xl border-2 flex items-center justify-center text-2xl z-10 shadow-2xl group-hover:scale-110 transition-all ${
              step.status === 'Active' ? 'bg-emerald-600 border-emerald-400' :
              step.status === 'Ready' ? 'bg-indigo-600 border-indigo-400' :
              step.status === 'Scaling' ? 'bg-amber-600 border-amber-400' :
              'bg-slate-900 border-slate-700'
            }`}>{step.icon}</div>
            <div className="flex-1 glass p-8 rounded-[2.5rem] border border-slate-800/60 group-hover:border-indigo-500/30 transition-all shadow-xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[9px] font-mono text-indigo-500 font-black uppercase tracking-widest block">Phase {step.id}</span>
                  <h3 className="text-xl font-bold text-white tracking-tight mt-1">{step.title}</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                  step.status === 'Active' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                  step.status === 'Ready' ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' :
                  step.status === 'Scaling' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse' :
                  'bg-slate-800/40 border-slate-700/60 text-slate-500'
                }`}>{step.status}</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              <div className="mt-6 flex items-center gap-4">
                <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 transition-all duration-1000 rounded-full" style={{ width: `${step.progress}%` }}></div>
                </div>
                <span className="text-[9px] font-mono text-slate-600">{step.progress}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Web Evolution */}
      <div className="space-y-8">
        <div className="text-center">
          <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">The Web Evolution</h3>
          <p className="text-slate-500 text-xs font-mono mt-2 uppercase tracking-widest">From Static Data to Sovereign Wealth</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {webEvolution.map(web => (
            <div key={web.v} className={`glass p-6 rounded-3xl border text-center space-y-3 transition-all ${
              web.current ? 'border-indigo-500/60 shadow-[0_0_30px_rgba(99,102,241,0.2)]' : 'border-slate-800/60 hover:border-slate-700'
            }`}>
              {web.current && <div className="text-[8px] font-black text-indigo-400 uppercase tracking-widest animate-pulse">← CURRENT</div>}
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Web {web.v}</span>
              <h4 className="text-lg font-black text-white uppercase italic tracking-tighter">{web.label}</h4>
              <p className="text-[9px] text-slate-500 font-bold uppercase">{web.desc}</p>
              <div className={`w-full h-1 rounded-full overflow-hidden ${web.done ? 'bg-indigo-500' : 'bg-slate-800'}`}>
                <div className={`h-full ${web.done ? 'bg-indigo-500' : ''}`} style={{ width: web.done ? '100%' : '0%' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div>
        <div className="text-center mb-8">
          <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Our Tech Stack</h3>
          <p className="text-slate-500 text-xs font-mono mt-2 uppercase tracking-widest">Production-Ready Web3→Web4 Infrastructure</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {techStack.map(stack => (
            <div key={stack.category} className="glass p-8 rounded-[2.5rem] border border-slate-800/60 hover:border-slate-700 transition-all">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">{stack.icon}</span>
                <h4 className={`text-sm font-black uppercase tracking-widest ${stack.color}`}>{stack.category}</h4>
              </div>
              <div className="space-y-2">
                {stack.items.map(item => (
                  <div key={item} className="flex items-center gap-3 p-3 bg-slate-900/40 rounded-xl border border-slate-800/40">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-slate-300 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="glass p-12 rounded-[3rem] border border-indigo-500/20 bg-indigo-500/5 text-center space-y-6">
        <div className="text-5xl">🚀</div>
        <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Begin Your Web4 Empire</h3>
        <p className="text-slate-400 max-w-xl mx-auto text-sm">
          Gyss! Deploy your first Sovereign Pod today. Stack: <span className="text-orange-400">Cloudflare</span> + <span className="text-purple-400">Groq</span> + <span className="text-emerald-400">Supabase</span> + <span className="text-yellow-400">LangChain</span> + <span className="text-indigo-400">CrewAI</span>
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={() => window.location.href = '/'} className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-2xl shadow-indigo-600/20 active:scale-95">
            Go to Marketplace
          </button>
          <button onClick={() => window.location.href = '/web3'} className="px-10 py-4 bg-slate-900 hover:bg-slate-800 text-slate-400 rounded-2xl font-black uppercase tracking-widest transition-all border border-slate-800 active:scale-95">
            Setup Web3 Layer
          </button>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
