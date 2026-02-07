
import { CROP_DATASET } from './seasonalData';

/**
 * Detects the current agricultural season based on month only.
 * June–September → Kharif (Monsoon)
 * October–February → Rabi (Winter)
 * March–May → Zaid (Summer)
 */
export const detectSeason = (month) => {
  if (month >= 5 && month <= 8) {
    return { 
      key: 'kharif', 
      label: 'Kharif', 
      phase: 'Monsoon Phase',
      color: 'green'
    };
  }
  if (month >= 9 || month <= 1) {
    return { 
      key: 'rabi', 
      label: 'Rabi', 
      phase: 'Winter Phase',
      color: 'blue'
    };
  }
  return { 
    key: 'zaid', 
    label: 'Zaid', 
    phase: 'Summer Phase',
    color: 'yellow'
  };
};

/**
 * 100% Rule-based Recommendation Engine
 * Categorizes crops based on season match and regional compatibility.
 */
export const getRecommendations = (seasonKey, region) => {
  const recommended = [];
  const risky = [];
  const notSuitable = [];

  CROP_DATASET.forEach(crop => {
    const isSeasonFit = crop.seasons.includes(seasonKey);
    const isRegionFit = crop.regions.includes(region);
    
    const cropInfo = {
      ...crop,
      // Demand logic: In-season → High, Partial → Medium, Unsuitable → Low
      marketDemand: isSeasonFit ? 'High' : (crop.seasons.length > 1 ? 'Medium' : 'Low'),
      // Risk logic: Match both → Low, Season match but no region → Medium, else High
      riskLevel: (isSeasonFit && isRegionFit) ? 'Low' : (isSeasonFit ? 'Medium' : 'High')
    };

    if (isSeasonFit && isRegionFit) {
      recommended.push({ ...cropInfo, category: 'recommended', reason: 'Perfect climate and regional match.' });
    } else if (isSeasonFit) {
      risky.push({ ...cropInfo, category: 'risky', reason: 'Suitable season but requires regional adaptation.' });
    } else {
      notSuitable.push({ ...cropInfo, category: 'notSuitable', reason: `Not suitable for ${seasonKey} phase.` });
    }
  });

  return { recommended, risky, notSuitable };
};

/**
 * Rule-based Action Engine
 */
export const getActionableSteps = (crop, currentMonth) => {
  const monthIdx = currentMonth;
  if (crop.stages.sowing.months.includes(monthIdx)) {
    return { stage: 'Sowing', steps: crop.stages.sowing.tasks };
  }
  if (crop.stages.growth.months.includes(monthIdx)) {
    return { stage: 'Growth', steps: crop.stages.growth.tasks };
  }
  if (crop.stages.harvest.months.includes(monthIdx)) {
    return { stage: 'Harvest', steps: crop.stages.harvest.tasks };
  }
  return { 
    stage: 'General Care', 
    steps: [
      'Monitor soil moisture levels',
      'Check for local pest reports',
      'Visit local market for price trends'
    ] 
  };
};
