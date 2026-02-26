
import React, { useState, useEffect, useRef } from 'react';
import { Message } from '../types';
import { aiService } from '../services/aiService';

interface GaniAssistantProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const GaniAssistant: React.FC<GaniAssistantProps> = ({ isOpen, setIsOpen }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'assistant',
      content: 'Gyss! 😌 Saya GANI, Universal Concierge untuk Hypha Web4 Agent Marketplace v2. Stack aktif: Cloudflare Workers + Groq (llama-3.3-70b) + Supabase + LangChain + CrewAI. Siap membantu membangun digital empire dari Web3 menuju Web4! 🙏🏻',
      timestamp: new Date(),
      model: 'groq/llama-3.3-70b'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = async (textOverride?: string) => {
    const text = textOverride || input;
    if (!text.trim() || isTyping) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const startTime = Date.now();
    try {
      const response = await aiService.getGANIResponse([...messages, userMsg], 'dashboard');
      const processingTime = Date.now() - startTime;

      const assistantMsg: Message = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        model: 'groq/llama-3.3-70b',
        processingTime
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (e) {
      const errorMsg: Message = {
        id: `e-${Date.now()}`,
        role: 'assistant',
        content: 'Gyss! Koneksi ke Groq Engine terputus. Retry... 🙏🏻',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickQuestions = [
    'Jelaskan Web3 → Web4 stack ini',
    'Cara setup Supabase + Groq?',
    'Apa itu CrewAI + LangChain?',
    'Bagaimana Web3 DID bekerja?'
  ];

  return (
    <>
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-6 lg:bottom-6 z-30 w-14 h-14 bg-indigo-600 hover:bg-indigo-500 rounded-2xl shadow-2xl shadow-indigo-600/40 flex items-center justify-center text-2xl transition-all hover:scale-110 active:scale-95 pulse-btn"
        >
          🧬
        </button>
      )}

      {/* Assistant Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 lg:bottom-6 z-30 w-[380px] max-w-[calc(100vw-2rem)] bg-[#0a0f1e] border border-slate-800/60 rounded-[2rem] shadow-3xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-800/40 bg-gradient-to-r from-indigo-950/50 to-transparent">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-lg">🧬</div>
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0a0f1e]"></div>
              </div>
              <div>
                <div className="text-xs font-black text-white uppercase tracking-widest">GANI AI</div>
                <div className="text-[8px] font-mono text-indigo-400 uppercase tracking-widest">Groq llama-3.3-70b</div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-800 rounded-xl text-slate-500 hover:text-white transition-colors">✕</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar max-h-80">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-slate-900/80 text-slate-300 rounded-bl-none border border-slate-800/60'
                }`}>
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[7px] font-black text-indigo-400 uppercase tracking-widest">GANI</span>
                      {msg.processingTime && (
                        <span className="text-[7px] font-mono text-slate-700">{msg.processingTime}ms</span>
                      )}
                    </div>
                  )}
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-900/60 border border-slate-800/60 p-3 rounded-2xl rounded-bl-none flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="text-[8px] text-indigo-400/60 font-mono ml-1">Groq processing...</span>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Quick Questions */}
          <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
            {quickQuestions.map(q => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                disabled={isTyping}
                className="whitespace-nowrap text-[8px] font-black uppercase tracking-widest px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:border-indigo-500 hover:text-indigo-400 transition-all disabled:opacity-50"
              >
                {q.substring(0, 18)}...
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-800/40 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Tanya GANI... (powered by Groq)"
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
            />
            <button
              onClick={() => sendMessage()}
              disabled={isTyping || !input.trim()}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition-all disabled:opacity-50 active:scale-95"
            >
              ↗
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default GaniAssistant;
