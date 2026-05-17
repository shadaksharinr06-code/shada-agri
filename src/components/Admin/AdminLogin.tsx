import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

interface AdminLoginProps {
  onAdminLogin: () => void;
}

export default function AdminLogin({ onAdminLogin }: AdminLoginProps) {
  const navigate = useNavigate();
  const { t, language, languageLabel, setLanguage } = useLanguage();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (name.trim() && password === 'admin123') {
      onAdminLogin();
      navigate('/admin/portal');
    } else {
      setError('Invalid credentials. Please use admin123.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-100 via-emerald-100 to-earth-50 px-6 py-8">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-[2rem] bg-white/95 p-8 shadow-soft sm:p-12">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-emerald-700">{t('secureAdminHeading')}</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">{t('adminPortal')}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{t('adminDescription')}</p>
          </div>
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 shadow-sm">
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value as typeof language)}
              className="bg-transparent text-sm outline-none"
            >
              {(['en', 'kn', 'hi'] as const).map((code) => (
                <option key={code} value={code}>
                  {languageLabel(code)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">{t('adminName')}</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={t('adminName')}
              className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">{t('adminPassword')}</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={t('adminPassword')}
              className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />
          </label>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <button className="w-full rounded-3xl bg-emerald-700 px-6 py-4 text-sm font-semibold text-white transition hover:bg-emerald-800">
            {t('loginAsAdmin')}
          </button>
        </form>
      </div>
    </div>
  );
}
