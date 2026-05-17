import { Activity, BarChart3, Cpu, Leaf, ShoppingCart, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const navItems = [
  { key: 'dashboardOverview', to: '/dashboard', icon: BarChart3 },
  { key: 'aiAdvisor', to: '/dashboard/advisor', icon: Sparkles },
  { key: 'leafScanner', to: '/dashboard/leaf-scan', icon: Leaf },
  { key: 'marketPrices', to: '/dashboard/prices', icon: ShoppingCart },
  { key: 'soilHealth', to: '/dashboard/soil-health', icon: Cpu }
];

export default function Sidebar() {
  const location = useLocation();
  const { t } = useLanguage();

  return (
    <aside className="hidden w-72 flex-col rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-soft lg:flex">
      <div className="mb-10">
        <div className="flex items-center gap-3 rounded-3xl bg-emerald-600 px-4 py-3 text-white shadow-lg shadow-emerald-200/40">
          <Activity size={22} />
          <div>
            <p className="text-xs uppercase tracking-[0.24em] opacity-80">Smart Agri</p>
            <p className="text-sm font-semibold">{t('welcomeBack')}</p>
          </div>
        </div>
      </div>
      <nav className="space-y-3">
        {navItems.map((item) => {
          const active = location.pathname === item.to || (item.to === '/dashboard' && location.pathname === '/dashboard');
          const Icon = item.icon;

          return (
            <Link
              key={item.key}
              to={item.to}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                active
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200/30'
                  : 'text-slate-700 hover:bg-emerald-100 hover:text-emerald-900'
              }`}
            >
              <Icon className="h-5 w-5" />
              {t(item.key)}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-3xl bg-emerald-50 p-5 text-sm text-slate-700 shadow-inner">
        <p className="text-xs uppercase tracking-[0.24em] text-emerald-600">{t('cropPairing')}</p>
        <p className="mt-3 leading-6">Use AI crop pairing to keep rotations healthy and supply chains strong.</p>
      </div>
    </aside>
  );
}
