
/**
 * Localized Crop Dataset
 * Built for 100% offline, rule-based operation.
 */
export const CROP_DATASET = [
  {
    id: 'rice',
    name: 'Rice (Paddy)',
    seasons: ['kharif'],
    waterRequirement: 'High',
    baseRisk: 'Low',
    marketDemand: 'High',
    avgPrice: 2150,
    icon: 'rice',
    oneLine: 'Ideal for water-rich monsoon conditions.',
    regions: ['Western Maharashtra', 'Coastal Regions', 'Punjab'],
    why: {
      season: 'Monsoon rainfall perfectly meets high water needs.',
      market: 'Staple demand peaks during harvest festivals.',
      risk: 'Predictable growth cycle reduces uncertainty.'
    },
    stages: {
      sowing: { months: [5, 6], tasks: ['Nursery preparation', 'Seed treatment', 'Soil puddling'] },
      growth: { months: [6, 7, 8], tasks: ['Transplanting', 'Water level management', 'First urea dose'] },
      harvest: { months: [9, 10], tasks: ['Field drainage', 'Golden grain harvest', 'Threshing'] }
    }
  },
  {
    id: 'wheat',
    name: 'Wheat',
    seasons: ['rabi'],
    waterRequirement: 'Medium',
    baseRisk: 'Low',
    marketDemand: 'High',
    avgPrice: 2275,
    icon: 'wheat',
    oneLine: 'Primary winter cereal; thrives in cool weather.',
    regions: ['Northern India', 'Central Maharashtra', 'Madhya Pradesh'],
    why: {
      season: 'Cool winter temperature is critical for grain filling.',
      market: 'Steady national demand ensures price stability.',
      risk: 'Lower pest pressure in dry winter air.'
    },
    stages: {
      sowing: { months: [10, 11], tasks: ['Deep plowing', 'Basal fertilizer application', 'Drill sowing'] },
      growth: { months: [12, 1], tasks: ['CRI stage irrigation', 'Top dressing urea', 'Weed management'] },
      harvest: { months: [2, 3], tasks: ['Late morning harvest', 'Moisture check', 'Storage prep'] }
    }
  },
  {
    id: 'soybean',
    name: 'Soybean',
    seasons: ['kharif'],
    waterRequirement: 'Medium',
    baseRisk: 'Medium',
    marketDemand: 'High',
    avgPrice: 4500,
    icon: 'soybean',
    oneLine: 'Profitable oilseed but sensitive to late rains.',
    regions: ['Vidarbha', 'Madhya Pradesh', 'Rajasthan'],
    why: {
      season: 'Suits moderate monsoon rainfall with good drainage.',
      market: 'Global oil demand keeps local prices high.',
      risk: 'Yield sensitive to erratic rainfall at pod stage.'
    },
    stages: {
      sowing: { months: [5, 6], tasks: ['Rhizobium treatment', 'Spacing management'] },
      growth: { months: [7, 8], tasks: ['Hoeing for aeration', 'Pest monitoring'] },
      harvest: { months: [9], tasks: ['Shattering prevention', 'Yellow leaf harvest'] }
    }
  },
  {
    id: 'maize',
    name: 'Maize (Corn)',
    seasons: ['kharif', 'zaid'],
    waterRequirement: 'Medium',
    baseRisk: 'Medium',
    marketDemand: 'Medium',
    avgPrice: 1950,
    icon: 'maize',
    oneLine: 'Versatile crop for poultry feed and industry.',
    regions: ['Deccan Plateau', 'Bihar', 'Karnataka'],
    why: {
      season: 'Highly adaptable to varying sun and water levels.',
      market: 'Steady demand from processing industries.',
      risk: 'Requires careful moisture management in summer.'
    },
    stages: {
      sowing: { months: [5, 6, 2], tasks: ['Ridge and furrow sowing', 'Seed treatment'] },
      growth: { months: [7, 8, 3, 4], tasks: ['Earthing up', 'Silking stage irrigation'] },
      harvest: { months: [9, 10, 5], tasks: ['Cobs drying', 'Machine harvesting'] }
    }
  },
  {
    id: 'moong',
    name: 'Moong Dal',
    seasons: ['zaid', 'kharif'],
    waterRequirement: 'Low',
    baseRisk: 'Low',
    marketDemand: 'High',
    avgPrice: 7200,
    icon: 'soybean',
    oneLine: 'Short duration crop; nitrogen-fixing for soil.',
    regions: ['Rajasthan', 'Gujarat', 'Maharashtra'],
    why: {
      season: 'Survives on residual moisture or limited summer water.',
      market: 'High pulse demand maintains premium prices.',
      risk: 'Low water need makes it a safe summer bet.'
    },
    stages: {
      sowing: { months: [2, 3], tasks: ['Line sowing', 'Early fertilizer dose'] },
      growth: { months: [3, 4], tasks: ['Pest scouting', 'Light irrigation'] },
      harvest: { months: [5], tasks: ['Pod picking', 'Grading and drying'] }
    }
  }
];

export const REGIONS = [
  'Western Maharashtra',
  'Central Maharashtra',
  'Vidarbha',
  'North India Plains',
  'Coastal Karnataka',
  'Gujarat Saurashtra'
];
