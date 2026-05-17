import { BarChart3, Leaf, ShieldCheck, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function DashboardOverview() {
  const { t } = useLanguage();

  return (
    <section className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[2rem] border border-emerald-100 bg-emerald-50 p-6 shadow-sm">
          <div className="inline-flex rounded-3xl bg-white p-3 text-emerald-700 shadow-sm">
            <Leaf className="h-6 w-6" />
          </div>
          <p className="mt-6 text-sm uppercase tracking-[0.28em] text-emerald-700">{t('dashboardOverview')}</p>
          <h3 className="mt-3 text-3xl font-semibold text-slate-900">1,280+</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{t('totalFarmers')}</p>
        </div>

        <div className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="inline-flex rounded-3xl bg-emerald-100 p-3 text-emerald-700 shadow-sm">
            <Sparkles className="h-6 w-6" />
          </div>
          <p className="mt-6 text-sm uppercase tracking-[0.28em] text-slate-500">{t('aiAdvisor')}</p>
          <h3 className="mt-3 text-3xl font-semibold text-slate-900">94%</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">Confidence in AI recommendations.</p>
        </div>

        <div className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="inline-flex rounded-3xl bg-emerald-100 p-3 text-emerald-700 shadow-sm">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <p className="mt-6 text-sm uppercase tracking-[0.28em] text-slate-500">{t('leafScanner')}</p>
          <h3 className="mt-3 text-3xl font-semibold text-slate-900">276</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{t('diagnosticsToday')}</p>
        </div>

        <div className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="inline-flex rounded-3xl bg-emerald-100 p-3 text-emerald-700 shadow-sm">
            <BarChart3 className="h-6 w-6" />
          </div>
          <p className="mt-6 text-sm uppercase tracking-[0.28em] text-slate-500">{t('marketPrices')}</p>
          <h3 className="mt-3 text-3xl font-semibold text-slate-900">32</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">Tracked commodities today.</p>
        </div>
      </div>

      <div className="rounded-[2rem] border border-emerald-100 bg-gradient-to-r from-white to-emerald-50 p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-emerald-700">{t('quickActions')}</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">{t('latestReports')}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Monitor your crop cycles, scan leaves, and get instant pricing updates with a modern farm dashboard experience.</p>
          </div>
          <button className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
            {t('viewReport')}
          </button>
        </div>
      </div>
    </section>
  );
}
