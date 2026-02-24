/**
 * Predefined lookup values for DigiLync
 * Supports standardized data, auto-selection, clustering & analytics
 */

/** Predefined crops (dropdown) + "Other" for custom entry */
export const CROPS = [
  'Maize',
  'Rice',
  'Cassava',
  'Cocoa',
  'Coffee',
  'Cotton',
  'Groundnut',
  'Sorghum',
  'Millet',
  'Yam',
  'Plantain',
  'Banana',
  'Tomato',
  'Onion',
  'Potato',
  'Beans',
  'Soybean',
  'Palm Oil',
  'Rubber',
  'Other',
];

/** Farmer service needs (multi-select) */
export const FARMER_SERVICE_NEEDS = [
  'Plowing',
  'Harrowing',
  'Planting',
  'Spraying',
  'Harvesting',
  'Threshing',
  'Transport',
  'Labour',
  'Irrigation',
  'Other',
];

/** Administrative levels - sample for Cameroon (can be expanded) */
export const COUNTRIES = ['Cameroon', 'Nigeria', 'Other'];

export const REGIONS_CAMEROON = [
  'Adamawa',
  'Centre',
  'East',
  'Far North',
  'Littoral',
  'North',
  'North-West',
  'South',
  'South-West',
  'West',
];

/** Generic regions for other countries - placeholder */
export const REGIONS_GENERIC = ['Region 1', 'Region 2', 'Region 3'];

/** Sample divisions (Cameroon - Littoral) - expand per region as needed */
export const DIVISIONS_SAMPLE = ['Moungo', 'Nkam', 'Sanaga-Maritime', 'Wouri'];

/** Sample districts - expand as needed */
export const DISTRICTS_SAMPLE = ['Douala I', 'Douala II', 'Douala III', 'Douala IV', 'Douala V', 'Edéa', 'Nkongsamba'];

/** Farm produce types for booking (aligned with crops) */
export const FARM_PRODUCE_TYPES = [...CROPS.filter((c) => c !== 'Other'), 'Other'];
