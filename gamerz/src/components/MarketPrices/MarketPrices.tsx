import { useMemo, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUp, Clock, Search } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { marketData } from '../../data/marketData';

const TREND_ICON = { up: ArrowUp, down: ArrowDown, stable: ArrowRight };
const TREND_STYLE = { up: 'text-emerald-600 bg-emerald-50', down: 'text-rose-600 bg-rose-50', stable: 'text-slate-500 bg-slate-100' };
const STOCK_STYLE: Record<string, string> = {
  Available: 'bg-emerald-100 text-emerald-700',
  Limited: 'bg-amber-100 text-amber-700',
  'Out of stock': 'bg-rose-100 text-rose-700',
};

export default function MarketPrices() {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () => marketData.filter(r => `${r.crop} ${r.pesticides} ${r.stock}`.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-emerald-700">{t('marketPrices')}</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-900">Local Market Tracker</h2>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
              <Clock className="h-3 w-3" /> {t('lastUpdated')}: {marketData[0]?.lastUpdated}
            </div>
          </div>
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder={t('searchPlaceholder')}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
          </div>
        </div>

        <div className="overflow-x-auto rounded-[1.75rem] border border-slate-100 bg-slate-50">
          <table className="min-w-full border-collapse text-sm text-left">
            <thead className="bg-white border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-4">{t('cropName')}</th>
                <th className="px-5 py-4">{t('currentMarketPrice')}</th>
                <th className="px-5 py-4">{t('pricesTrend')}</th>
                <th className="px-5 py-4 hidden md:table-cell">{t('companionPesticides')}</th>
                <th className="px-5 py-4 hidden md:table-cell">{t('pesticidePrice')}</th>
                <th className="px-5 py-4">{t('stockAvailability')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-slate-400">{t('noResults')}</td></tr>
              ) : filtered.map(row => {
                const Icon = TREND_ICON[row.trend];
                return (
                  <tr key={row.id} className="border-t border-slate-100 hover:bg-white transition">
                    <td className="px-5 py-4 font-semibold text-slate-900">{row.crop}</td>
                    <td className="px-5 py-4 text-slate-700 font-medium">{row.price}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${TREND_STYLE[row.trend]}`}>
                        <Icon className="h-3 w-3" />{row.trend}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600 hidden md:table-cell">{row.pesticides}</td>
                    <td className="px-5 py-4 text-slate-600 hidden md:table-cell">{row.pesticidePrice}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STOCK_STYLE[row.stock]}`}>{row.stock}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
