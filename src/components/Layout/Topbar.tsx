import { LogOut, User2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import type { LanguageCode } from '../../context/LanguageContext';

const LANGS: LanguageCode[] = ['en', 'kn', 'hi', 'ta'];

export default function Topbar({ onLogout, user }: { onLogout: () => void; user?: { name: string; phone: string } }) {
  const { language, setLanguage, t, languageLabel } = useLanguage();

  return (
    <div className="mb-4 flex flex-col gap-4 rounded-3xl border border-emerald-100 bg-white/90 p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-emerald-600">{t('settings')}</p>
        <h1 className="mt-1 text-xl font-semibold text-slate-900">{t('dashboardOverview')}</h1>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-900 shadow-sm">
          <label className="sr-only">Language</label>
          <select value={language} onChange={e => setLanguage(e.target.value as LanguageCode)} className="bg-transparent text-sm font-medium outline-none">
            {LANGS.map(code => <option key={code} value={code}>{languageLabel(code)}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2 shadow-sm">
          <User2 className="h-4 w-4 text-emerald-600" />
          <div>
            <p className="text-xs text-slate-400">{t('welcomeBack')}</p>
            <p className="text-sm font-semibold text-slate-900">{user?.name ?? 'Farmer'}</p>
          </div>
        </div>
        <button onClick={onLogout}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition">
          <LogOut size={16} /> {t('logout')}
        </button>
      </div>
    </div>
  );
}
