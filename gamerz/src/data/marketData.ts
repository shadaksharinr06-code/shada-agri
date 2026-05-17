export type MarketRow = {
  id: string; crop: string; price: string; pesticides: string;
  pesticidePrice: string; stock: 'Available' | 'Limited' | 'Out of stock';
  trend: 'up' | 'down' | 'stable'; priceRaw: number; lastUpdated: string;
};

const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

export const marketData: MarketRow[] = [
  { id: 'm-1', crop: 'Tomato', price: '₹2,600/qtl', priceRaw: 2600, pesticides: 'Azoxystrobin, Chlorothalonil', pesticidePrice: '₹520/l', stock: 'Available', trend: 'up', lastUpdated: today },
  { id: 'm-2', crop: 'Rice', price: '₹1,820/qtl', priceRaw: 1820, pesticides: 'Tricyclazole, Neem Oil', pesticidePrice: '₹300/l', stock: 'Limited', trend: 'stable', lastUpdated: today },
  { id: 'm-3', crop: 'Sugarcane', price: '₹3,050/qtl', priceRaw: 3050, pesticides: 'Imidacloprid, Metarhizium', pesticidePrice: '₹460/l', stock: 'Available', trend: 'up', lastUpdated: today },
  { id: 'm-4', crop: 'Ragi (Finger Millet)', price: '₹2,150/qtl', priceRaw: 2150, pesticides: 'Carbendazim, Neem Oil', pesticidePrice: '₹280/l', stock: 'Out of stock', trend: 'down', lastUpdated: today },
  { id: 'm-5', crop: 'Okra (Bhindi)', price: '₹2,330/qtl', priceRaw: 2330, pesticides: 'Lambda-cyhalothrin, Pheromone', pesticidePrice: '₹420/l', stock: 'Available', trend: 'stable', lastUpdated: today },
  { id: 'm-6', crop: 'Banana', price: '₹1,480/qtl', priceRaw: 1480, pesticides: 'Mancozeb, Propiconazole', pesticidePrice: '₹390/l', stock: 'Available', trend: 'up', lastUpdated: today },
  { id: 'm-7', crop: 'Groundnut', price: '₹5,200/qtl', priceRaw: 5200, pesticides: 'Chlorpyrifos, Endosulfan', pesticidePrice: '₹550/l', stock: 'Limited', trend: 'up', lastUpdated: today },
  { id: 'm-8', crop: 'Maize', price: '₹1,960/qtl', priceRaw: 1960, pesticides: 'Atrazine, Nicosulfuron', pesticidePrice: '₹240/l', stock: 'Available', trend: 'down', lastUpdated: today },
  { id: 'm-9', crop: 'Sunflower', price: '₹4,100/qtl', priceRaw: 4100, pesticides: 'Trifluralin, Oxyflurofen', pesticidePrice: '₹310/l', stock: 'Available', trend: 'stable', lastUpdated: today },
  { id: 'm-10', crop: 'Cotton', price: '₹6,800/qtl', priceRaw: 6800, pesticides: 'Spinosad, Emamectin', pesticidePrice: '₹680/l', stock: 'Limited', trend: 'up', lastUpdated: today },
];
