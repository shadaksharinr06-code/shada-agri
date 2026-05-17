import { useMemo, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { recommendCrops } from '../../data/cropRecommendations';

export default function SoilHealth() {
  const { t } = useLanguage();
  const [ph, setPh] = useState(6.8);
  const [n, setN] = useState(55);
  const [p, setP] = useState(32);
  const [k, setK] = useState(30);
  const [recommendations, setRecommendations] = useState([]);

  const zone = useMemo(() => {
    if (ph < 6.2) return 'acidic';
    if (ph <= 7.0) return 'idealZone';
    return 'alkaline';
  }, [ph]);

  const badgeClass = useMemo(() => {
    if (zone === 'acidic') return 'bg-rose-100 text-rose-700';
    if (zone === 'idealZone') return 'bg-emerald-100 text-emerald-700';
    return 'bg-sky-100 text-sky-700';
  }, [zone]);

  return (
    <section className="space-y-8">
      <div className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-emerald-700">{t('soilHealth')}</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">{t('optimalZone')}</h2>
          </div>
          <span className={`inline-flex items-center rounded-3xl px-4 py-2 text-sm font-semibold ${badgeClass}`}>
            {t(zone)}
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6 rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
            <div>
              <p className="text-sm font-semibold text-slate-700">{t('pH')}</p>
              <div className="mt-3 flex items-center gap-4">
                <input
                  type="range"
                  min={0}
                  max={14}
                  step={0.1}
                  value={ph}
                  onChange={(event) => setPh(Number(event.target.value))}
                  className="w-full accent-emerald-600"
                />
                <span className="w-16 rounded-3xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm">{ph.toFixed(1)}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">{t('nitrogen')}</p>
              <input
                type="range"
                min={0}
                max={120}
                value={n}
                onChange={(event) => setN(Number(event.target.value))}
                className="w-full accent-emerald-600"
              />
              <p className="mt-2 text-sm text-slate-600">{n} mg/kg</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">{t('phosphorus')}</p>
              <input
                type="range"
                min={0}
                max={90}
                value={p}
                onChange={(event) => setP(Number(event.target.value))}
                className="w-full accent-emerald-600"
              />
              <p className="mt-2 text-sm text-slate-600">{p} mg/kg</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">{t('potassium')}</p>
              <input
                type="range"
                min={0}
                max={120}
                value={k}
                onChange={(event) => setK(Number(event.target.value))}
                className="w-full accent-emerald-600"
              />
              <p className="mt-2 text-sm text-slate-600">{k} mg/kg</p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-emerald-100 bg-emerald-50 p-8 shadow-sm">
            <div className="mb-6 space-y-3">
              <p className="text-sm uppercase tracking-[0.28em] text-emerald-700">{t('recommendCrops')}</p>
              <h3 className="text-2xl font-semibold text-slate-900">{t('recommendedCrops')}</h3>
              <p className="text-sm leading-6 text-slate-700">Adjust the sliders and click to generate nutrient-based crop recommendations for your field.</p>
            </div>
            <button
              type="button"
              onClick={() => setRecommendations(recommendCrops(ph, n, p, k))}
              className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-6 py-4 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              {t('recommendCrops')}
            </button>
            <div className="mt-8 space-y-4">
              {recommendations.length === 0 ? (
                <div className="rounded-3xl bg-white p-5 text-sm text-slate-600 shadow-sm">
                  Enter field values and generate crop suggestions to see adaptive guidance.
                </div>
              ) : (
                <div className="space-y-4">
                  {recommendations.map((item) => (
                    <div key={item.name} className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
                      <h4 className="text-lg font-semibold text-slate-900">{item.name}</h4>
                      <p className="mt-2 text-sm text-slate-700">{item.description}</p>
                      <p className="mt-3 text-sm text-slate-600">{item.tips}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
