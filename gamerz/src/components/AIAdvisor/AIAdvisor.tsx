import { useEffect, useMemo, useRef, useState } from 'react';
import { Mic, MicOff, Send, Volume2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { callGemini } from '../../services/gemini';

type Message = { id: string; sender: 'user' | 'assistant'; text: string };

const TOPICS = [
  { key: 'topicWeather', prompt: 'Give me weather-based farming advice for today.' },
  { key: 'topicWater', prompt: 'What is the best watering schedule for my crops today?' },
  { key: 'topicPest', prompt: 'What organic pest control methods do you recommend?' },
  { key: 'topicNutrient', prompt: 'How do I identify and treat nutrient deficiency in my crops?' },
];

export default function AIAdvisor() {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    { id: 'm-0', sender: 'assistant', text: 'Hello! Ask me about soil, crop health, watering schedules, pesticides, or weather. You can type or use your voice 🎙️' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const langCode = useMemo(() => ({ kn: 'kn-IN', hi: 'hi-IN', ta: 'ta-IN', en: 'en-IN' }[language] ?? 'en-IN'), [language]);

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR();
    r.lang = langCode;
    r.interimResults = false;
    r.onresult = (e: any) => { setInput(e.results[0][0].transcript); setListening(false); };
    r.onend = () => setListening(false);
    recognitionRef.current = r;
  }, [langCode]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = langCode;
    window.speechSynthesis.speak(u);
  };

  const handleSend = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput('');
    setMessages(prev => [...prev, { id: crypto.randomUUID(), sender: 'user', text: msg }]);
    setLoading(true);
    const reply = await callGemini(msg, language);
    const assistantMsg = { id: crypto.randomUUID(), sender: 'assistant' as const, text: reply };
    setMessages(prev => [...prev, assistantMsg]);
    setLoading(false);
    speak(reply);
  };

  const handleListen = () => {
    if (!recognitionRef.current) return;
    setListening(true);
    recognitionRef.current.lang = langCode;
    recognitionRef.current.start();
  };

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-emerald-700">{t('aiAdvisor')}</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-900">{t('liveAdvice')}</h2>
          </div>
          <div className="flex gap-2">
            <button onClick={handleListen} disabled={listening}
              className={`inline-flex items-center gap-2 rounded-3xl px-4 py-2 text-sm font-semibold transition ${listening ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-emerald-700 text-white hover:bg-emerald-800'}`}>
              {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              {listening ? 'Listening…' : t('voiceInput')}
            </button>
          </div>
        </div>

        {/* Topic pills */}
        <div className="mb-4 flex flex-wrap gap-2">
          {TOPICS.map(({ key, prompt }) => (
            <button key={key} onClick={() => handleSend(prompt)}
              className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-medium text-emerald-800 transition hover:bg-emerald-100">
              {t(key)}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="max-h-[380px] space-y-3 overflow-y-auto rounded-[1.75rem] border border-slate-100 bg-slate-50 p-4">
          {messages.map(m => (
            <div key={m.id} className={`group flex gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`relative max-w-[85%] rounded-3xl px-5 py-3 text-sm leading-6 shadow-sm ${m.sender === 'assistant' ? 'bg-white text-slate-800 border border-slate-100' : 'bg-emerald-600 text-white'}`}>
                {m.text}
                {m.sender === 'assistant' && (
                  <button onClick={() => speak(m.text)} className="absolute -right-2 -top-2 hidden rounded-full bg-white p-1 shadow-md group-hover:flex">
                    <Volume2 className="h-3 w-3 text-emerald-600" />
                  </button>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-2 justify-start">
              <div className="rounded-3xl border border-slate-100 bg-white px-5 py-3 shadow-sm">
                <span className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400 [animation-delay:0ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400 [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400 [animation-delay:300ms]" />
                </span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="mt-4 flex gap-3 rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={t('typeMessage')}
            className="flex-1 rounded-2xl bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200" />
          <button onClick={() => handleSend()} disabled={!input.trim() || loading}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-40">
            <Send className="h-4 w-4" /> {t('sendMessage')}
          </button>
        </div>
      </div>
    </section>
  );
}
