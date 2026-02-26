
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { aiService } from '../services/aiService';
import { AgentRole, Blueprint, CognitiveSpecs } from '../types';

interface ArchitectModeProps {
  onSaveBlueprint: (blueprint: Blueprint) => void;
}

const ArchitectMode: React.FC<ArchitectModeProps> = ({ onSaveBlueprint }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [isArchitecting, setIsArchitecting] = useState(false);
  const [thinkingProcess, setThinkingProcess] = useState<string[]>([]);
  const [depthPercent, setDepthPercent] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [blueprintName, setBlueprintName] = useState('');
  const [blueprintIndustry, setBlueprintIndustry] = useState('Property');
  const [blueprintIcon, setBlueprintIcon] = useState('🤖');
  const [selectedRoles, setSelectedRoles] = useState<AgentRole[]>([]);
  const [blueprintTier, setBlueprintTier] = useState<'Free' | 'Pro' | 'Enterprise'>('Free');
  const [reasoningDepth, setReasoningDepth] = useState(70);
  const [sovereigntyLevel, setSovereigntyLevel] = useState(95);
  const [economicAutonomy, setEconomicAutonomy] = useState(true);
  const [selectedAI, setSelectedAI] = useState<'Groq' | 'LangChain' | 'CrewAI' | 'Multi-Agent'>('Groq');

  useEffect(() => {
    if (location.state?.initialPrompt) setPrompt(location.state.initialPrompt);
  }, [location.state]);

  useEffect(() => {
    if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [thinkingProcess]);

  const handleArchitect = async () => {
    if (!prompt.trim()) return;
    setIsArchitecting(true);
    setResult('');
    setShowSaveForm(false);
    setDepthPercent(0);

    const steps = [
      `INIT_ARCH_SESSION_v2.0 [WEB4_CORE]`,
      `AUTHENTICATING_USER_DID_IDENTITY...`,
      `CONNECTING_GROQ_API [llama-3.3-70b]...`,
      `SUPABASE_SCHEMA_MAPPING...`,
      `LANGCHAIN_WORKFLOW_BLUEPRINT...`,
      `CREWAI_AGENT_SPAWNING...`,
      `CLOUDFLARE_WORKERS_SPEC...`,
      `WEB3_SMART_CONTRACT_ANALYSIS...`,
      `PERFORMING_SECURITY_AUDIT...`,
      `VALIDATING_SOVEREIGN_COMPLIANCE...`,
      `DEEP_REASONING_ENGINE_ACTIVE [GROQ]...`,
      `SYNTHESIZING_AUTONOMOUS_BLUEPRINT...`,
      `OPTIMIZING_WEB4_ARCHITECTURE...`,
      `LOCKED_FOR_CLOUDFLARE_DEPLOYMENT`
    ];

    setThinkingProcess([]);
    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, Math.random() * 400 + 200));
      setThinkingProcess(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${steps[i]}`]);
      setDepthPercent(Math.round(((i + 1) / steps.length) * 100));
    }

    try {
      const response = await aiService.architectEcosystem(prompt);
      setResult(response);
    } catch (e) {
      setResult('Failed to architect. Groq Mycelium link interrupted. Gyss! Check API key.');
    } finally {
      setIsArchitecting(false);
    }
  };

  const handleSave = () => {
    if (!blueprintName.trim() || selectedRoles.length === 0) return;
    const newBlueprint: Blueprint = {
      id: `web4-${Date.now()}`,
      name: blueprintName,
      industry: blueprintIndustry,
      description: result.substring(0, 400) + '...',
      features: [
        ...selectedRoles.map(r => `${r.replace(/^The\s+/, '')} Optimization`),
        'Groq AI Inference Layer',
        'Supabase RLS Data Vault',
        'LangChain Workflow Engine',
        'Cloudflare Edge Deployment'
      ].slice(0, 6),
      icon: blueprintIcon,
      roles: selectedRoles,
      price: blueprintTier === 'Free' ? '$0/mo' : blueprintTier === 'Pro' ? '$19/mo' : '$99/mo',
      tier: blueprintTier,
      infrastructure: 'Hybrid Nexus',
      reviews: [],
      deploymentCount: 0,
      cognitiveSpecs: {
        reasoningDepth,
        memoryPersistence: 'Recursive',
        thinkingBudget: blueprintTier === 'Enterprise' ? 24576 : 8192,
        sovereigntyLevel,
        economicAutonomy
      },
      didHash: `did:hypha:${Math.random().toString(36).substring(2, 15)}`,
      web4Features: {
        aiOrchestrator: selectedAI,
        autonomyLevel: sovereigntyLevel,
        crossChainEnabled: blueprintTier === 'Enterprise',
        decentralizedStorage: true,
        realTimeAdaptation: true
      }
    };
    onSaveBlueprint(newBlueprint);
    setShowSaveForm(false);
    alert(`Web4 Blueprint "${blueprintName}" synchronized! Gyss! 😌🙏🏻`);
    navigate('/');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="text-center space-y-4 mb-10">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-indigo-500/20">
          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
          Web4 Architect Engine v2.0
        </div>
        <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Web4 Architect 2.0</h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm">
          Synthesize <span className="text-indigo-400 font-mono">Autonomous Web4 Entities</span> with Groq AI, Supabase, LangChain, CrewAI on Cloudflare edge.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Panel */}
        <div className="space-y-6">
          <div className="glass rounded-[2.5rem] p-8 space-y-6 border border-slate-800 shadow-3xl">
            {/* AI Engine Selector */}
            <div>
              <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest block mb-3">AI Orchestrator Engine</label>
              <div className="grid grid-cols-4 gap-2">
                {(['Groq', 'LangChain', 'CrewAI', 'Multi-Agent'] as const).map(ai => (
                  <button key={ai} onClick={() => setSelectedAI(ai)}
                    className={`py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all border ${
                      selectedAI === ai ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'
                    }`}
                  >{ai}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest block mb-3">Neural Requirement Specification</label>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Describe your Web4 system... e.g., A multi-agent DeFi platform with Groq AI advisor, Supabase yield tracking, LangChain portfolio management, and CrewAI research crew."
                className="w-full h-44 bg-slate-900 border border-slate-800 rounded-3xl p-5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none shadow-inner text-sm"
              />
            </div>

            {/* Cognitive Tuning */}
            <div className="grid grid-cols-2 gap-4 p-5 bg-slate-950/40 rounded-2xl border border-slate-800/60">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Reasoning Depth</label>
                  <span className="text-[8px] font-mono text-indigo-400">{reasoningDepth}%</span>
                </div>
                <input type="range" min="1" max="100" value={reasoningDepth} onChange={e => setReasoningDepth(+e.target.value)}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Sovereignty</label>
                  <span className="text-[8px] font-mono text-purple-400">{sovereigntyLevel}%</span>
                </div>
                <input type="range" min="1" max="100" value={sovereigntyLevel} onChange={e => setSovereigntyLevel(+e.target.value)}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>
            </div>

            {/* Economic Autonomy Toggle */}
            <div className="flex items-center justify-between p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/20">
              <div>
                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest block">Economic Autonomy</span>
                <span className="text-[8px] text-slate-600">Enable DeFi + yield generation</span>
              </div>
              <button onClick={() => setEconomicAutonomy(!economicAutonomy)}
                className={`w-12 h-6 rounded-full transition-all relative ${economicAutonomy ? 'bg-emerald-600' : 'bg-slate-800'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${economicAutonomy ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>

            <button onClick={handleArchitect} disabled={isArchitecting || !prompt}
              className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[1.5rem] font-black text-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-2xl shadow-indigo-600/20 active:scale-95"
            >
              {isArchitecting ? (
                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Generating via Groq...</>
              ) : (
                <><span>⚡</span>Unlock Web4 Architecture</>
              )}
            </button>

            {isArchitecting && (
              <div className="space-y-3 animate-in slide-in-from-top-4">
                <div className="flex justify-between items-center">
                  <p className="text-[9px] text-indigo-400 uppercase font-black tracking-widest">Groq Processing Thread</p>
                  <span className="text-[9px] font-mono text-indigo-300">{depthPercent}%</span>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${depthPercent}%` }}></div>
                </div>
                <div ref={terminalRef} className="bg-[#020617] rounded-2xl p-5 h-40 overflow-y-auto scrollbar-hide font-mono text-[9px] text-indigo-400/80 border border-slate-800/60">
                  {thinkingProcess.map((step, i) => (
                    <div key={i} className="flex items-start gap-2 mb-1.5">
                      <span className="text-slate-800 shrink-0">did@hypha:~$</span>
                      {step}
                    </div>
                  ))}
                  <div className="animate-pulse inline-block w-2 h-3 bg-indigo-500/50 align-middle ml-1"></div>
                </div>
              </div>
            )}
          </div>

          {result && !showSaveForm && (
            <div className="glass rounded-[2rem] p-8 border border-indigo-500/30 animate-in zoom-in-95 duration-500 text-center space-y-4">
              <div className="text-4xl">⚛️</div>
              <h4 className="text-xl font-black text-white uppercase">Blueprint Verified!</h4>
              <p className="text-slate-400 text-sm">Web4 architecture meets autonomy standards. Sync to Marketplace?</p>
              <button onClick={() => setShowSaveForm(true)}
                className="w-full py-4 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
              >Sync to Marketplace</button>
            </div>
          )}

          {showSaveForm && (
            <div className="glass rounded-[2.5rem] p-8 space-y-6 border border-emerald-500/30 animate-in slide-in-from-left-4 duration-500 max-h-[500px] overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-center">
                <h4 className="text-xl font-black text-white uppercase">Entity Metadata</h4>
                <button onClick={() => setShowSaveForm(false)} className="text-slate-500 hover:text-white text-xl">✕</button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[8px] text-slate-500 uppercase font-bold tracking-widest block mb-1.5">Name</label>
                  <input type="text" value={blueprintName} onChange={e => setBlueprintName(e.target.value)} placeholder="Nexus_Admin_v1"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[8px] text-slate-500 uppercase font-bold tracking-widest block mb-1.5">Icon</label>
                  <input type="text" value={blueprintIcon} onChange={e => setBlueprintIcon(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white text-center focus:ring-1 focus:ring-indigo-500 outline-none text-2xl"
                  />
                </div>
              </div>
              <div>
                <label className="text-[8px] text-slate-500 uppercase font-bold tracking-widest block mb-1.5">Industry</label>
                <select value={blueprintIndustry} onChange={e => setBlueprintIndustry(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                >
                  {['Property', 'Personal Services', 'Lifestyle', 'Content Creation', 'Fintech', 'DeFi', 'Legal & Governance', 'Logistics & Trade'].map(ind => (
                    <option key={ind}>{ind}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[8px] text-slate-500 uppercase font-bold tracking-widest block mb-2">Agent Roles</label>
                <div className="flex flex-wrap gap-2">
                  {Object.values(AgentRole).map(role => {
                    const label = role.replace(/^The\s+/, '');
                    const isSelected = selectedRoles.includes(role);
                    return (
                      <button key={role} onClick={() => setSelectedRoles(prev => prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role])}
                        className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase transition-all border ${isSelected ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'}`}
                      >{label}</button>
                    );
                  })}
                </div>
              </div>
              <button onClick={handleSave} disabled={!blueprintName || selectedRoles.length === 0}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-lg transition-all shadow-2xl disabled:opacity-50 active:scale-95"
              >Sync to Web4 Marketplace ↗</button>
            </div>
          )}
        </div>

        {/* Output Panel */}
        <div className="glass rounded-[2.5rem] p-10 bg-slate-900/20 relative overflow-hidden flex flex-col min-h-[600px] border border-slate-800 shadow-inner">
          <div className="absolute top-0 right-0 p-6">
            <span className="text-[8px] font-mono text-indigo-400 bg-indigo-950/40 px-3 py-1.5 rounded-xl border border-indigo-500/20 uppercase tracking-widest font-black">
              Architecture_Output::v2.0
            </span>
          </div>
          <div className="flex-1 mt-10 overflow-y-auto pr-2 custom-scrollbar">
            {result ? (
              <div className="whitespace-pre-wrap font-mono text-[11px] text-slate-300 leading-relaxed p-6 bg-black/40 rounded-[1.5rem] border border-slate-800/60 shadow-inner">
                {result}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-30 mt-12">
                <div className="text-7xl mb-6 grayscale animate-pulse">⚛️</div>
                <p className="font-mono text-xs uppercase tracking-widest font-black mb-3">Awaiting_Neural_Signal...</p>
                <p className="text-[9px] max-w-xs leading-relaxed uppercase tracking-widest">
                  Initiate Web4 architectural synthesis via Groq + LangChain + CrewAI engine.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchitectMode;
