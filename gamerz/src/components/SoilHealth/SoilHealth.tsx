import { useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { callGeminiCrops } from '../../services/gemini';

function NutrientBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div>
      <div className="flex justify-between text-xs text-slate-600 mb-1">
        <span className="font-medium">{label}</span>
        <span>{value} mg/kg</span>
      </div>
      <div className="h-2.5 rounded-full bg-slate-100">
        <div className={`h-2.5 rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function SoilHealth() {
  const { t, language } = useLanguage();
  const [ph, setPh] = useState(6.8);
  const [n, setN] = useState(55);
  const [p, setP] = useState(32);
  const [k, setK] = useState(30);
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);

  const zone = useMemo(() => ph < 6.2 ? 'acidic' : ph <= 7.0 ? 'idealZone' : 'alkaline', [ph]);
  const badgeClass = useMemo(() =>
    ({ acidic: 'bg-rose-100 text-rose-700', idealZone: 'bg-emerald-100 text-emerald-700', alkaline: 'bg-sky-100 text-sky-700' })[zone], [zone]);

  const phGradient = () => {
    if (ph < 6.2) return 'from-rose-400 to-rose-500';
    if (ph <= 7.0) return 'from-emerald-400 to-emerald-500';
    return 'from-sky-400 to-sky-500';
  };

  const handleRecommend = async () => {
    setLoading(true);
    const text = await callGeminiCrops(ph, n, p, k, language);
    setAdvice(text);
    setLoading(false);
  };

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-emerald-700">{t('soilHealth')}</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-900">{t('optimalZone')}</h2>
          </div>
          <span className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ${badgeClass}`}>{t(zone)}</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Sliders */}
          <div className="space-y-6 rounded-[2rem] border border-slate-100 bg-slate-50 p-6">
            {/* pH */}
            <div>
              <div className="flex justify-between mb-2">
                <p className="text-sm font-semibold text-slate-700">{t('pH')}</p>
                <span className={`rounded-full px-3 py-0.5 text-sm font-bold bg-gradient-to-r ${phGradient()} text-white`}>{ph.toFixed(1)}</span>
              </div>
              <input type="range" min={0} max={14} step={0.1} value={ph} onChange={e => setPh(Number(e.target.value))} className="w-full accent-emerald-600" />
              <div className="flex justify-between text-xs text-slate-400 mt-1"><span>0 Acidic</span><span>7 Neutral</span><span>14 Alkaline</span></div>
            </div>
            {/* NPK bars */}
            <NutrientBar label={t('nitrogen')} value={n} max={120} color="bg-emerald-500" />
            <input type="range" min={0} max={120} value={n} onChange={e => setN(Number(e.target.value))} className="w-full accent-emerald-600" />
            <NutrientBar label={t('phosphorus')} value={p} max={90} color="bg-amber-400" />
            <input type="range" min={0} max={90} value={p} onChange={e => setP(Number(e.target.value))} className="w-full accent-amber-500" />
            <NutrientBar label={t('potassium')} value={k} max={120} color="bg-sky-500" />
            <input type="range" min={0} max={120} value={k} onChange={e => setK(Number(e.target.value))} className="w-full accent-sky-600" />
          </div>

          {/* Recommendations */}
          <div className="rounded-[2rem] border border-emerald-100 bg-gradient-to-b from-emerald-50 to-white p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-emerald-700 mb-1">{t('recommendCrops')}</p>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">{t('recommendedCrops')}</h3>
            <p className="text-sm text-slate-600 mb-5">Adjust sliders and click to get AI-powered crop recommendations for your soil conditions.</p>
            <button onClick={handleRecommend} disabled={loading}
              className="inline-flex items-center gap-2 rounded-3xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition disabled:opacity-60">
              <Sparkles className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Analyzing…' : t('recommendCrops')}
            </button>
            <div className="mt-6">
              {advice ? (
                <div className="whitespace-pre-wrap rounded-2xl bg-white border border-slate-100 p-5 text-sm leading-7 text-slate-700 shadow-sm">{advice}</div>
              ) : (
                <div className="rounded-2xl bg-white border border-slate-100 p-5 text-sm text-slate-400">
                  Set your soil values and click "Recommend" to get AI-generated crop suggestions.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
