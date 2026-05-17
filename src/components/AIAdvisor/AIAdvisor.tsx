import { useEffect, useMemo, useRef, useState } from 'react';
import { Mic, Send } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

type Message = {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
};

const defaultMessages: Message[] = [
  {
    id: 'm-1',
    sender: 'assistant',
    text: 'Hello! Ask me about soil, crop health, market prices, or leaf scans in your language.'
  }
];

export default function AIAdvisor() {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>(defaultMessages);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const languageCode = useMemo(() => {
    if (language === 'kn') return 'kn-IN';
    if (language === 'hi') return 'hi-IN';
    return 'en-IN';
  }, [language]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = languageCode;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.maxAlternatives = 1;

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setListening(false);
    };

    recognitionRef.current.onend = () => {
      setListening(false);
    };
  }, [languageCode]);

  const handleListen = () => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      return;
    }

    setListening(true);
    recognition.lang = languageCode;
    recognition.start();
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage: Message = { id: crypto.randomUUID(), sender: 'user', text: input.trim() };
    setMessages((current) => [...current, userMessage]);
    setInput('');

    const answer = {
      id: crypto.randomUUID(),
      sender: 'assistant',
      text: `Analyzing your request. Based on the information, maintain balanced nutrients and apply preventive treatments when needed.`
    };

    setTimeout(() => {
      setMessages((current) => [...current, answer]);
    }, 800);
  };

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-emerald-700">{t('aiAdvisor')}</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">{t('liveAdvice')}</h2>
          </div>
          <button
            type="button"
            onClick={handleListen}
            className="inline-flex items-center gap-2 rounded-3xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            <Mic className="h-4 w-4" />
            {t('voiceInput')}
          </button>
        </div>

        <div className="space-y-4">
          <div className="max-h-[420px] space-y-3 overflow-y-auto rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`rounded-3xl px-5 py-4 ${message.sender === 'assistant' ? 'bg-white text-slate-900' : 'ml-auto max-w-[80%] bg-emerald-600 text-white'}`}
              >
                <p className="text-sm leading-6">{message.text}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={t('typeMessage')}
              className="flex-1 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />
            <button
              type="button"
              onClick={handleSend}
              className="inline-flex items-center justify-center gap-2 rounded-3xl bg-slate-900 px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <Send className="h-4 w-4" /> {t('sendMessage')}
            </button>
          </div>
          {listening && <p className="text-sm text-emerald-700">Listening... speak now.</p>}
        </div>
      </div>
    </section>
  );
}
