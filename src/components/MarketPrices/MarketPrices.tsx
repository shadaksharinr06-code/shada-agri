import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { marketData } from '../../data/marketData';

export default function MarketPrices() {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () =>
      marketData.filter((row) => {
        const value = `${row.crop} ${row.pesticides} ${row.stock}`.toLowerCase();
        return value.includes(query.toLowerCase());
      }),
    [query]
  );

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-emerald-700">{t('marketPrices')}</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">{t('searchPlaceholder')}</h2>
          </div>
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 py-4 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-[1.75rem] border border-slate-200 bg-slate-50">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="bg-white text-slate-700">
              <tr>
                <th className="px-6 py-4">{t('cropName')}</th>
                <th className="px-6 py-4">{t('currentMarketPrice')}</th>
                <th className="px-6 py-4">{t('companionPesticides')}</th>
                <th className="px-6 py-4">{t('pesticidePrice')}</th>
                <th className="px-6 py-4">{t('stockAvailability')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-500">
                    {t('noResults')}
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <tr key={row.id} className="border-t border-slate-200 hover:bg-emerald-50/60">
                    <td className="px-6 py-5 font-semibold text-slate-900">{row.crop}</td>
                    <td className="px-6 py-5 text-slate-700">{row.price}</td>
                    <td className="px-6 py-5 text-slate-700">{row.pesticides}</td>
                    <td className="px-6 py-5 text-slate-700">{row.pesticidePrice}</td>
                    <td className="px-6 py-5 text-slate-700">{row.stock}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
