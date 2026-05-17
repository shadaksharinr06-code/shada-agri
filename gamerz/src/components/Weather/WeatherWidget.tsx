import { useEffect, useState } from 'react';
import { Cloud, CloudRain, Droplets, Sun, Thermometer, Wind, Zap } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getWeather, getWateringAdvice, WeatherData } from '../../services/weather';

function WeatherIcon({ condition, size = 32 }: { condition: WeatherData['condition']; size?: number }) {
  const cls = `h-${size === 32 ? 8 : 6} w-${size === 32 ? 8 : 6}`;
  if (condition === 'sunny') return <Sun className={`${cls} text-amber-400`} />;
  if (condition === 'rainy') return <CloudRain className={`${cls} text-blue-400`} />;
  if (condition === 'stormy') return <Zap className={`${cls} text-violet-400`} />;
  if (condition === 'cloudy') return <Cloud className={`${cls} text-slate-400`} />;
  return <Cloud className={`${cls} text-slate-300`} />;
}

function conditionBg(c: WeatherData['condition']) {
  if (c === 'sunny') return 'from-amber-400/20 to-orange-300/10';
  if (c === 'rainy' || c === 'stormy') return 'from-blue-400/20 to-indigo-300/10';
  return 'from-slate-300/20 to-slate-200/10';
}

export default function WeatherWidget() {
  const { t, language } = useLanguage();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getWeather().then(w => { setWeather(w); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 animate-pulse">
          <div className="h-16 w-16 rounded-3xl bg-slate-100" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-slate-100 rounded-full w-1/3" />
            <div className="h-8 bg-slate-100 rounded-full w-1/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  const watering = getWateringAdvice(weather, language);

  return (
    <div className={`rounded-[2rem] border border-emerald-100 bg-gradient-to-r ${conditionBg(weather.condition)} bg-white p-6 shadow-sm`}>
      <p className="text-xs uppercase tracking-[0.28em] text-emerald-700 mb-4">{t('weather')} · Bengaluru</p>

      <div className="flex flex-wrap items-center gap-6">
        {/* Main temp */}
        <div className="flex items-center gap-4">
          <div className="rounded-3xl bg-white/80 p-4 shadow-sm">
            <WeatherIcon condition={weather.condition} size={32} />
          </div>
          <div>
            <p className="text-5xl font-bold text-slate-900">{weather.temperature}°C</p>
            <p className="text-sm text-slate-500 mt-1">{weather.conditionText} · {t('feelsLike')} {weather.feelsLike}°C</p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 flex-1">
          <Stat icon={<Droplets className="h-4 w-4 text-blue-500" />} label={t('humidity')} value={`${weather.humidity}%`} />
          <Stat icon={<Wind className="h-4 w-4 text-slate-500" />} label={t('windSpeed')} value={`${weather.windSpeed} km/h`} />
          <Stat icon={<CloudRain className="h-4 w-4 text-indigo-500" />} label={t('rainChance')} value={`${weather.rainProbability}%`} highlight={weather.rainProbability > 60} />
          <Stat icon={<Thermometer className="h-4 w-4 text-orange-500" />} label={t('uvIndex')} value={`${weather.uvIndex}`} />
        </div>
      </div>

      {/* Watering advice */}
      <div className="mt-5 rounded-2xl bg-white/70 border border-emerald-100 px-5 py-3 text-sm text-slate-700 shadow-sm backdrop-blur">
        <span className="font-semibold text-emerald-700 mr-2">{t('wateringSchedule')}:</span>
        {watering}
      </div>
    </div>
  );
}

function Stat({ icon, label, value, highlight = false }: { icon: React.ReactNode; label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex items-center gap-2 rounded-2xl px-3 py-2 ${highlight ? 'bg-blue-50 border border-blue-100' : 'bg-white/60 border border-white/80'} shadow-sm`}>
      {icon}
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className={`text-sm font-semibold ${highlight ? 'text-blue-700' : 'text-slate-900'}`}>{value}</p>
      </div>
    </div>
  );
}
