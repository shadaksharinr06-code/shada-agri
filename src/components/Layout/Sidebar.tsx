import { Activity, BarChart3, CloudSun, Cpu, Leaf, ShoppingCart, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const navItems = [
  { key: 'dashboardOverview', to: '/dashboard', icon: BarChart3 },
  { key: 'aiAdvisor', to: '/dashboard/advisor', icon: Sparkles },
  { key: 'leafScanner', to: '/dashboard/leaf-scan', icon: Leaf },
  { key: 'marketPrices', to: '/dashboard/prices', icon: ShoppingCart },
  { key: 'soilHealth', to: '/dashboard/soil-health', icon: Cpu },
  { key: 'weatherForecastNav', to: '/dashboard/weather', icon: CloudSun },
];

export default function Sidebar() {
  const location = useLocation();
  const { t } = useLanguage();

  return (
    <aside className="hidden w-72 flex-col rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-soft lg:flex sticky top-6 self-start">
      <div className="mb-8">
        <div className="flex items-center gap-3 rounded-3xl bg-gradient-to-r from-emerald-600 to-forest-600 px-4 py-3 text-white shadow-lg shadow-emerald-200/40">
          <Activity size={22} />
          <div>
            <p className="text-xs uppercase tracking-[0.24em] opacity-80">Smart Agri</p>
            <p className="text-sm font-semibold">{t('welcomeBack')}</p>
          </div>
        </div>
      </div>
      <nav className="space-y-2">
        {navItems.slice(0, 5).map(({ key, to, icon: Icon }) => {
          const active = location.pathname === to || (key === 'dashboardOverview' && location.pathname === '/dashboard');
          return (
            <Link key={key} to={to}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${active ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200/30' : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-900'}`}>
              <Icon className="h-5 w-5" />{t(key)}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-3xl bg-gradient-to-b from-emerald-50 to-emerald-100/50 p-5 text-sm text-slate-700 shadow-inner">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">{t('cropPairing')}</p>
        <p className="mt-2 leading-6 text-slate-600">Use AI crop pairing to keep rotations healthy and supply chains strong.</p>
      </div>
    </aside>
  );
}
