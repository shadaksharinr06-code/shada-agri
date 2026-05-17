export type MarketRow = {
  id: string;
  crop: string;
  price: string;
  pesticides: string;
  pesticidePrice: string;
  stock: string;
};

export const marketData: MarketRow[] = [
  {
    id: 'm-1',
    crop: 'Tomato',
    price: '₹2,600/qtl',
    pesticides: 'Azoxystrobin, Chlorothalonil',
    pesticidePrice: '₹520/l',
    stock: 'Available'
  },
  {
    id: 'm-2',
    crop: 'Rice',
    price: '₹1,820/qtl',
    pesticides: 'Tricyclazole, Neem Oil',
    pesticidePrice: '₹300/l',
    stock: 'Limited'
  },
  {
    id: 'm-3',
    crop: 'Sugarcane',
    price: '₹3,050/qtl',
    pesticides: 'Imidacloprid, Metarhizium',
    pesticidePrice: '₹460/l',
    stock: 'Available'
  },
  {
    id: 'm-4',
    crop: 'Ragi',
    price: '₹2,150/qtl',
    pesticides: 'Carbendazim, Neem Oil',
    pesticidePrice: '₹280/l',
    stock: 'Out of stock'
  },
  {
    id: 'm-5',
    crop: 'Okra',
    price: '₹2,330/qtl',
    pesticides: 'Lambda-cyhalothrin, Pheromone',
    pesticidePrice: '₹420/l',
    stock: 'Available'
  }
];
