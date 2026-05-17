import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Lock, Smartphone, User } from 'lucide-react';

interface AuthPageProps {
  onLogin: (user: { name: string; phone: string }) => void;
}

export default function AuthPage({ onLogin }: AuthPageProps) {
  const navigate = useNavigate();
  const { language, languageLabel, setLanguage, t } = useLanguage();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!phone || !password || (isRegister && !name)) {
      return;
    }
    onLogin({ name: name || 'Farmer', phone });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-100 via-emerald-100 to-earth-50 px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col overflow-hidden rounded-[2rem] bg-white/90 shadow-soft backdrop-blur-xl lg:flex-row">
        <div className="relative hidden basis-1/2 items-end justify-end overflow-hidden rounded-t-[2rem] bg-[radial-gradient(circle_at_top_left,_rgba(45,129,76,0.2),_transparent_45%),linear-gradient(180deg,_#ecf8ef_0%,_#d2f0d9_100%)] p-10 text-slate-900 lg:flex">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80')] bg-cover bg-center opacity-90" />
          <div className="absolute inset-0 bg-forest-900/40" />
          <div className="relative z-10 max-w-md rounded-[2rem] border border-white/40 bg-white/80 p-8 shadow-xl">
            <p className="text-xs uppercase tracking-[0.32em] text-emerald-700">Smart Agriculture</p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight text-forest-900">{t('landingTitle')}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-700">{t('landingSubtitle')}</p>
            <div className="mt-8 space-y-4 rounded-3xl bg-emerald-50 p-5 text-sm text-slate-700 shadow-sm">
              <p className="font-semibold text-emerald-900">Premium access for farmers</p>
              <p>Track crop prices, analyze leaf health, and optimize soil nutrition from one dashboard.</p>
            </div>
          </div>
        </div>

        <div className="flex basis-full flex-col gap-6 p-8 sm:p-10 lg:basis-1/2">
          <div className="flex items-center justify-between rounded-3xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-900 shadow-sm">
            <div>
              <p className="font-semibold">{t('languageToUse') || 'Language'}</p>
              <p className="text-xs text-slate-600">{languageLabel(language)}</p>
            </div>
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value as typeof language)}
              className="rounded-2xl border border-emerald-200 bg-white px-3 py-2 text-sm outline-none"
            >
              {(['en', 'kn', 'hi', 'ta'] as const).map((code) => (
                <option key={code} value={code}>
                  {languageLabel(code)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <p className="text-3xl font-semibold text-slate-900">{isRegister ? t('registerTitle') : t('loginTitle')}</p>
            <p className="max-w-xl text-sm leading-6 text-slate-600">{t('authDescription')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
            {isRegister && (
              <label className="block">
                <span className="mb-2 inline-block text-sm font-medium text-slate-700">{t('name')}</span>
                <div className="relative">
                  <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-600" />
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder={t('name')}
                    className="w-full rounded-3xl border border-slate-200 bg-white/95 py-4 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                  />
                </div>
              </label>
            )}
            <label className="block">
              <span className="mb-2 inline-block text-sm font-medium text-slate-700">{t('phoneNumber')}</span>
              <div className="relative">
                <Smartphone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-600" />
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder={t('phoneNumber')}
                  className="w-full rounded-3xl border border-slate-200 bg-white/95 py-4 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                />
              </div>
            </label>
            <label className="block">
              <span className="mb-2 inline-block text-sm font-medium text-slate-700">{t('password')}</span>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-600" />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={t('password')}
                  className="w-full rounded-3xl border border-slate-200 bg-white/95 py-4 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                />
              </div>
            </label>

            <button
              type="submit"
              className="w-full rounded-3xl bg-emerald-700 px-6 py-4 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              {isRegister ? t('registerButton') : t('loginButton')}
            </button>

            <div className="flex items-center justify-between gap-4 text-sm text-slate-600">
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="font-medium text-emerald-700 hover:underline"
              >
                {isRegister ? t('switchToLogin') : t('switchToRegister')}
              </button>
              <Link to="/admin" className="text-sm font-semibold text-slate-900 hover:text-emerald-700">
                {t('adminLogin')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
