import { useMemo, useState } from 'react';
import { Plus, RefreshCcw, ServerCog } from 'lucide-react';
import { marketData, type MarketRow } from '../../data/marketData';
import { useLanguage } from '../../context/LanguageContext';

interface AdminPortalProps {
  onLogout: () => void;
}

const initialActivities = [
  { id: 'a1', when: '2 min ago', description: 'Ravi submitted a leaf scan for Tomato.' },
  { id: 'a2', when: '12 min ago', description: 'Priya updated market price for Rice.' },
  { id: 'a3', when: '35 min ago', description: 'Leaf scan queued for analysis.' }
];

export default function AdminPortal({ onLogout }: AdminPortalProps) {
  const { t, language, languageLabel, setLanguage } = useLanguage();
  const [rows, setRows] = useState<MarketRow[]>(marketData);
  const [crop, setCrop] = useState('');
  const [price, setPrice] = useState('');
  const [pesticides, setPesticides] = useState('');
  const [pesticidePrice, setPesticidePrice] = useState('');
  const [stock, setStock] = useState('Available');
  const [editId, setEditId] = useState<string | null>(null);

  const metrics = useMemo(
    () => ({
      totalFarmers: 1280,
      diagnosticsToday: 276,
      activeAlerts: 6
    }),
    []
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!crop || !price || !pesticides || !pesticidePrice) return;

    const entry: MarketRow = {
      id: editId ?? `m-${crypto.randomUUID()}`,
      crop,
      price,
      priceRaw: parseFloat(price.replace(/[^0-9.]/g, '')) || 0,
      pesticides,
      pesticidePrice,
      stock: stock as MarketRow['stock'],
      trend: 'stable',
      lastUpdated: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    };

    setRows((current) => {
      if (editId) {
        return current.map((row) => (row.id === editId ? entry : row));
      }
      return [...current, entry];
    });

    setCrop('');
    setPrice('');
    setPesticides('');
    setPesticidePrice('');
    setStock('Available');
    setEditId(null);
  };

  const handleEdit = (row: MarketRow) => {
    setCrop(row.crop);
    setPrice(row.price);
    setPesticides(row.pesticides);
    setPesticidePrice(row.pesticidePrice);
    setStock(row.stock);
    setEditId(row.id);
  };

  const handleDelete = (id: string) => {
    setRows((current) => current.filter((row) => row.id !== id));
  };

  return (
    <div className="min-h-screen bg-forest-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px] space-y-6">
        <div className="flex flex-col gap-4 rounded-[2rem] border border-emerald-100 bg-white/90 p-6 shadow-soft sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-emerald-700">{t('adminPortal')}</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">{t('secureAdminHeading')}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{t('adminDescription')}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-3xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 shadow-sm">
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value as typeof language)}
                className="bg-transparent text-sm outline-none"
              >
                {(['en', 'kn', 'hi', 'ta'] as const).map((code) => (
                  <option key={code} value={code}>
                    {languageLabel(code)}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              {t('logout')}
            </button>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.28em] text-emerald-700">{t('totalFarmers')}</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">{metrics.totalFarmers}</p>
              </div>
              <div className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-700">{t('diagnosticsToday')}</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">{metrics.diagnosticsToday}</p>
              </div>
              <div className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.28em] text-emerald-700">{t('activeAlerts')}</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">{metrics.activeAlerts}</p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-sm">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-emerald-700">{t('formTitle')}</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">{editId ? t('updateEntry') : t('addEntry')}</h2>
                </div>
                <div className="inline-flex items-center gap-2 rounded-3xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900 shadow-sm">
                  <ServerCog className="h-4 w-4" /> {editId ? t('updateEntry') : t('addEntry')}
                </div>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    value={crop}
                    onChange={(event) => setCrop(event.target.value)}
                    placeholder={t('cropName')}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  />
                  <input
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                    placeholder={t('commodityPrice')}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    value={pesticides}
                    onChange={(event) => setPesticides(event.target.value)}
                    placeholder={t('entryPesticides')}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  />
                  <input
                    value={pesticidePrice}
                    onChange={(event) => setPesticidePrice(event.target.value)}
                    placeholder={t('pesticidePrice')}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
                <div>
                  <label className="sr-only">{t('stockAvailability')}</label>
                  <select
                    value={stock}
                    onChange={(event) => setStock(event.target.value)}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="Available">Available</option>
                    <option value="Limited">Limited</option>
                    <option value="Out of stock">Out of stock</option>
                  </select>
                </div>
                <button className="inline-flex items-center gap-3 rounded-3xl bg-emerald-700 px-6 py-4 text-sm font-semibold text-white transition hover:bg-emerald-800">
                  <Plus className="h-4 w-4" /> {t('formButton')}
                </button>
              </form>
            </div>

            <div className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">{t('activityStream')}</h2>
              <div className="mt-6 space-y-4">
                {initialActivities.map((item) => (
                  <div key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <span>{item.when}</span>
                      <span className="font-semibold text-slate-700">{t('recentUploads')}</span>
                    </div>
                    <p className="mt-3 text-sm text-slate-700">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-emerald-100 bg-emerald-50 p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-3xl bg-white p-3 text-emerald-700 shadow-sm">
                  <RefreshCcw className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-emerald-700">{t('secureAdminHeading')}</p>
                  <p className="mt-2 text-slate-700">Track current market rows and manage updates for farmers in real time.</p>
                </div>
              </div>
              <div className="rounded-[1.75rem] bg-white p-5 shadow-sm">
                <h3 className="text-base font-semibold text-slate-900">{t('recentUploads')}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">Keep the feed active with new market updates and leaf scan results.</p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">{t('marketPrices')}</h2>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">{rows.length} rows</span>
              </div>
              <div className="space-y-4">
                {rows.map((row) => (
                  <div key={row.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{row.crop}</p>
                        <p className="mt-2 text-sm text-slate-600">{row.price} • {row.pesticides}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(row)}
                          className="rounded-2xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
                        >
                          {t('editRow')}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(row.id)}
                          className="rounded-2xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
                        >
                          {t('deleteRow')}
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                      <span>{row.pesticidePrice}</span>
                      <span>{row.stock}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
