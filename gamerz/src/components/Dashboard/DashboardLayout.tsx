import { Route, Routes } from 'react-router-dom';
import Sidebar from '../Layout/Sidebar';
import Topbar from '../Layout/Topbar';
import DashboardOverview from './DashboardOverview';
import AIAdvisor from '../AIAdvisor/AIAdvisor';
import LeafScan from '../LeafScan/LeafScan';
import MarketPrices from '../MarketPrices/MarketPrices';
import SoilHealth from '../SoilHealth/SoilHealth';
import WeatherForecast from '../Weather/WeatherForecast';

interface Props {
  onLogout: () => void;
  user: { name: string; phone: string };
}

export default function DashboardLayout({ onLogout, user }: Props) {
  return (
    <div className="min-h-screen bg-forest-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1500px] gap-6 lg:grid-cols-[280px_auto]">
        <Sidebar />
        <main className="space-y-6 min-w-0">
          <Topbar onLogout={onLogout} user={user} />
          <div className="space-y-6 rounded-[2rem] bg-white/90 p-6 shadow-soft sm:p-8">
            <Routes>
              <Route index element={<DashboardOverview />} />
              <Route path="advisor" element={<AIAdvisor />} />
              <Route path="leaf-scan" element={<LeafScan />} />
              <Route path="prices" element={<MarketPrices />} />
              <Route path="soil-health" element={<SoilHealth />} />
              <Route path="weather" element={<WeatherForecast />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}
