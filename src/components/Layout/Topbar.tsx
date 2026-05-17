import { ChevronDown, LogOut, User2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import type { LanguageCode } from '../../context/LanguageContext';

export default function Topbar({ onLogout }: { onLogout: () => void }) {
  const { language, setLanguage, t, languageLabel } = useLanguage();

  return (
    <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-emerald-100 bg-white/90 p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-emerald-600">{t('settings')}</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">{t('dashboardOverview')}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{t('liveAdvice')}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-900 shadow-sm">
          <label className="sr-only">Language</label>
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value as LanguageCode)}
            className="w-full bg-transparent text-sm font-medium outline-none"
          >
            {(['en', 'kn', 'hi'] as LanguageCode[]).map((code) => (
              <option key={code} value={code}>
                {languageLabel(code)}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <LogOut size={18} /> {t('logout')}
        </button>

        <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm">
          <User2 className="h-5 w-5 text-emerald-600" />
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{t('welcomeBack')}</p>
            <p className="font-semibold text-slate-900">Smart Farmer</p>
          </div>
        </div>
      </div>
    </div>
  );
}
