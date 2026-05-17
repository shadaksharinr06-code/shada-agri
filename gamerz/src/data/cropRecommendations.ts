export type CropRecommendation = {
  name: string;
  description: string;
  tips: string;
};

export const cropProfiles: CropRecommendation[] = [
  {
    name: 'Ragi',
    description: 'Heat resilient grain with deep root structure.',
    tips: 'Best in slightly acidic soil with stable moisture and low input fertilizer.'
  },
  {
    name: 'Paddy',
    description: 'Monsoon-friendly cereal that thrives in flooded fields.',
    tips: 'Maintain water levels and use zinc-enriched nutrients for strong yield.'
  },
  {
    name: 'Sugarcane',
    description: 'Long-duration cash crop for humid, alkaline soils.',
    tips: 'Ensure even irrigation and apply potash-rich fertilizer during tillering.'
  },
  {
    name: 'Tomato',
    description: 'High-value vegetable suited for balanced soil and warm climate.',
    tips: 'Use drip irrigation and rotate with legumes to maintain soil health.'
  },
  {
    name: 'Okra',
    description: 'Drought tolerant vegetable for late-summer planting.',
    tips: 'Mulch the soil and maintain moderate nitrogen for tender pods.'
  }
];

export function recommendCrops(ph: number, n: number, p: number, k: number): CropRecommendation[] {
  if (ph < 6.2 && n > 60 && p > 30) {
    return cropProfiles.filter((item) => ['Ragi', 'Tomato', 'Okra'].includes(item.name));
  }

  if (ph >= 6.2 && ph <= 7.0 && n >= 40 && p >= 20 && k >= 20) {
    return cropProfiles.filter((item) => ['Paddy', 'Tomato', 'Okra'].includes(item.name));
  }

  return cropProfiles.filter((item) => ['Sugarcane', 'Ragi', 'Paddy'].includes(item.name));
}
