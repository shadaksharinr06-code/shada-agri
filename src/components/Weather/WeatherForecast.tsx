import { useEffect, useRef, useState } from 'react';
import {
  Cloud, CloudRain, Droplets, MapPin, RefreshCw,
  Sun, Thermometer, Wind, Zap, Eye, ArrowUp, ArrowDown,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getFullForecast, DayForecast, HourlyPoint, WeatherData, getWateringAdvice } from '../../services/weather';

/* ── Weather icon helper ─────────────────────────────── */
function WIcon({ c, size = 5 }: { c: WeatherData['condition']; size?: number }) {
  const cls = `h-${size} w-${size}`;
  if (c === 'sunny') return <Sun className={`${cls} text-amber-400`} />;
  if (c === 'rainy') return <CloudRain className={`${cls} text-blue-400`} />;
  if (c === 'stormy') return <Zap className={`${cls} text-violet-500`} />;
  if (c === 'cloudy') return <Cloud className={`${cls} text-slate-400`} />;
  if (c === 'foggy') return <Eye className={`${cls} text-slate-300`} />;
  return <Cloud className={`${cls} text-slate-300`} />;
}

function rainColor(pct: number) {
  if (pct >= 70) return 'bg-blue-500';
  if (pct >= 40) return 'bg-blue-300';
  return 'bg-slate-200';
}

/* ── Kannada / multilingual labels ───────────────────── */
function useLabels(t: (k: string) => string) {
  return {
    title: t('weatherForecast') || '7-Day Weather Forecast',
    location: t('locationBengaluru') || 'Bengaluru, Karnataka',
    today: t('todayLabel') || 'Today',
    hourly: t('hourlyForecast') || "Today's Hourly Forecast",
    weekly: t('weeklyForecast') || '7-Day Outlook',
    farmTip: t('farmingTip') || 'Farming Tip',
    rain: t('rainChance') || 'Rain',
    wind: t('windSpeed') || 'Wind',
    uv: t('uvIndex') || 'UV',
    feelsLike: t('feelsLike') || 'Feels Like',
    humidity: t('humidity') || 'Humidity',
    watering: t('wateringSchedule') || 'Watering Advice',
    refresh: t('refreshWeather') || 'Refresh',
  };
}

/* ── Main Component ──────────────────────────────────── */
export default function WeatherForecast() {
  const { t, language } = useLanguage();
  const L = useLabels(t);
  const [data, setData] = useState<{ current: WeatherData; daily: DayForecast[]; hourly: HourlyPoint[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<DayForecast | null>(null);
  const hourlyRef = useRef<HTMLDivElement>(null);

  const load = () => {
    setLoading(true);
    getFullForecast().then(d => { setData(d); setSelected(d.daily[0]); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  if (loading) return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
        <p className="text-sm text-slate-500">Fetching live weather data…</p>
      </div>
    </div>
  );
  if (!data) return null;

  const { current, daily, hourly } = data;
  const wateringAdvice = getWateringAdvice(current, language);

  return (
    <section className="space-y-6">

      {/* ── Hero: Current conditions ── */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-sky-900 via-indigo-900 to-emerald-900 p-8 text-white shadow-xl">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, #60a5fa 0%, transparent 55%), radial-gradient(circle at 20% 80%, #34d399 0%, transparent 45%)' }} />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sky-300 text-sm mb-3">
              <MapPin className="h-4 w-4" />{L.location}
              <button onClick={load} className="ml-3 flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs hover:bg-white/20 transition">
                <RefreshCw className="h-3 w-3" />{L.refresh}
              </button>
            </div>
            <div className="flex items-end gap-4">
              <div className="rounded-3xl bg-white/10 p-5 backdrop-blur-sm">
                <WIcon c={current.condition} size={12} />
              </div>
              <div>
                <p className="text-8xl font-thin leading-none">{current.temperature}°</p>
                <p className="mt-2 text-sky-200 text-lg">{current.conditionText}</p>
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 sm:w-56">
            {[
              { icon: <Thermometer className="h-4 w-4 text-orange-300" />, label: L.feelsLike, val: `${current.feelsLike}°C` },
              { icon: <Droplets className="h-4 w-4 text-blue-300" />, label: L.humidity, val: `${current.humidity}%` },
              { icon: <Wind className="h-4 w-4 text-slate-300" />, label: L.wind, val: `${current.windSpeed} km/h` },
              { icon: <Sun className="h-4 w-4 text-amber-300" />, label: L.uv, val: String(current.uvIndex) },
            ].map(({ icon, label, val }) => (
              <div key={label} className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
                <div className="flex items-center gap-1.5">{icon}<span className="text-xs text-white/70">{label}</span></div>
                <p className="mt-1 text-lg font-semibold">{val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Watering advice bar */}
        <div className="relative mt-6 rounded-2xl bg-white/10 px-5 py-3 text-sm backdrop-blur-sm">
          <span className="font-semibold text-emerald-300 mr-2">{L.watering}:</span>
          {wateringAdvice}
        </div>
      </div>

      {/* ── Hourly forecast (today) ── */}
      <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">{L.hourly}</p>
        <div ref={hourlyRef} className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {hourly.map((h, i) => (
            <div key={i} className={`flex shrink-0 flex-col items-center gap-2 rounded-2xl border px-4 py-3 transition ${i === new Date().getHours() ? 'border-emerald-300 bg-emerald-50' : 'border-slate-100 bg-slate-50'}`}>
              <p className="text-xs text-slate-400">{h.hour}</p>
              <WIcon c={h.condition} size={5} />
              <p className="text-sm font-semibold text-slate-900">{h.temperature}°</p>
              <div className="flex items-center gap-0.5">
                <Droplets className="h-3 w-3 text-blue-400" />
                <p className="text-xs text-blue-500">{h.rainProbability}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 7-Day forecast cards ── */}
      <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">{L.weekly}</p>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-7">
          {daily.map((day) => (
            <button key={day.date} onClick={() => setSelected(day)}
              className={`group flex flex-col gap-3 rounded-2xl border p-4 text-left transition hover:shadow-md ${selected?.date === day.date ? 'border-emerald-400 bg-emerald-50 shadow-sm' : 'border-slate-100 bg-slate-50 hover:border-emerald-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">{day.dayName}</p>
                  <p className="text-xs text-slate-400">{day.dateLabel}</p>
                </div>
                <WIcon c={day.condition} size={6} />
              </div>
              <div className="flex items-center gap-1.5">
                <ArrowUp className="h-3 w-3 text-rose-400" />
                <span className="text-sm font-semibold text-slate-900">{day.tempMax}°</span>
                <ArrowDown className="h-3 w-3 text-blue-400 ml-1" />
                <span className="text-xs text-slate-500">{day.tempMin}°</span>
              </div>
              {/* Rain probability bar */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1"><CloudRain className="h-3 w-3 text-blue-400" /><span className="text-xs text-slate-500">{day.rainProbability}%</span></div>
                  <span className="text-xs text-slate-400">{day.rainMm > 0 ? `${day.rainMm}mm` : 'Dry'}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-200">
                  <div className={`h-1.5 rounded-full transition-all ${rainColor(day.rainProbability)}`} style={{ width: `${day.rainProbability}%` }} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Selected day detail ── */}
      {selected && (
        <div className="rounded-[2rem] border border-emerald-100 bg-gradient-to-r from-emerald-50 to-sky-50 p-6 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">{selected.dayName} · {selected.dateLabel}</p>
              <div className="mt-3 flex items-center gap-3">
                <WIcon c={selected.condition} size={10} />
                <div>
                  <p className="text-3xl font-bold text-slate-900">{selected.tempMax}° <span className="text-lg font-normal text-slate-400">/ {selected.tempMin}°</span></p>
                  <p className="text-slate-500">{selected.conditionText}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:w-64">
              {[
                { label: L.rain, val: `${selected.rainProbability}%`, icon: <CloudRain className="h-4 w-4 text-blue-500" /> },
                { label: 'Rainfall', val: `${selected.rainMm} mm`, icon: <Droplets className="h-4 w-4 text-sky-500" /> },
                { label: L.wind, val: `${selected.windSpeed} km/h`, icon: <Wind className="h-4 w-4 text-slate-400" /> },
                { label: L.uv, val: String(selected.uvIndex), icon: <Sun className="h-4 w-4 text-amber-400" /> },
              ].map(({ label, val, icon }) => (
                <div key={label} className="rounded-2xl bg-white border border-slate-100 px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-1.5">{icon}<span className="text-xs text-slate-500">{label}</span></div>
                  <p className="mt-1 text-lg font-semibold text-slate-900">{val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Farm advice for selected day */}
          <div className="mt-5 flex items-start gap-3 rounded-2xl bg-white border border-emerald-100 px-5 py-4 shadow-sm">
            <div className="mt-0.5 rounded-xl bg-emerald-100 p-2 text-emerald-700">🌾</div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">{L.farmTip}</p>
              <p className="mt-1 text-sm leading-6 text-slate-700">{selected.farmAdvice}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
