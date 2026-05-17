import { BarChart3, CloudSun, Leaf, ShieldCheck, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import WeatherWidget from '../Weather/WeatherWidget';

export default function DashboardOverview() {
  const { t } = useLanguage();

  return (
    <section className="space-y-8">
      {/* Weather widget at top */}
      <WeatherWidget />

      {/* Stat cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { icon: Leaf, label: t('dashboardOverview'), stat: '1,280+', desc: t('totalFarmers'), bg: 'bg-emerald-50', iconBg: 'bg-white', iconColor: 'text-emerald-700' },
          { icon: Sparkles, label: t('aiAdvisor'), stat: '94%', desc: 'AI recommendation accuracy', bg: 'bg-white', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-700' },
          { icon: ShieldCheck, label: t('leafScanner'), stat: '276', desc: t('diagnosticsToday'), bg: 'bg-white', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-700' },
          { icon: BarChart3, label: t('marketPrices'), stat: '10', desc: 'Tracked commodities', bg: 'bg-white', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-700' },
        ].map(({ icon: Icon, label, stat, desc, bg, iconBg, iconColor }) => (
          <div key={label} className={`rounded-[2rem] border border-emerald-100 ${bg} p-6 shadow-sm hover:shadow-md transition`}>
            <div className={`inline-flex rounded-3xl ${iconBg} p-3 ${iconColor} shadow-sm`}><Icon className="h-6 w-6" /></div>
            <p className="mt-5 text-xs uppercase tracking-[0.28em] text-slate-500">{label}</p>
            <h3 className="mt-2 text-3xl font-bold text-slate-900">{stat}</h3>
            <p className="mt-1 text-sm text-slate-500">{desc}</p>
          </div>
        ))}
      </div>

      {/* Banner */}
      <div className="rounded-[2rem] border border-emerald-100 bg-gradient-to-r from-emerald-900 to-forest-800 p-8 text-white shadow-sm overflow-hidden relative">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #34d399 0%, transparent 60%)' }} />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-3xl bg-white/10 p-4"><CloudSun className="h-8 w-8 text-emerald-300" /></div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-emerald-300">{t('quickActions')}</p>
              <h2 className="mt-2 text-2xl font-semibold">{t('latestReports')}</h2>
              <p className="mt-1 text-sm text-white/70 max-w-lg">Monitor crop cycles, scan leaves for diseases, and track live market pricing — all in one place.</p>
            </div>
          </div>
          <button className="shrink-0 inline-flex items-center justify-center rounded-3xl bg-white px-6 py-3 text-sm font-semibold text-forest-900 hover:bg-emerald-50 transition">
            {t('viewReport')}
          </button>
        </div>
      </div>
    </section>
  );
}
