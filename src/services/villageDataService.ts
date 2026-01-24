export interface VillageData {
  id: string;
  name: string;
  district: string;
  state: string;
  centerLat: number;
  centerLng: number;
  radius: number; // meters
  population?: number;
  area?: number; // sq km
  mainCrops?: string[];
}

// Comprehensive village dataset for Maharashtra (sample data)
// In production, this would come from a government database
export const VILLAGE_DATASET: VillageData[] = [
  // Yavatmal District
  {
    id: 'MH_YAV_RAJAPUR_001',
    name: 'Rajapur',
    district: 'Yavatmal',
    state: 'Maharashtra',
    centerLat: 20.3891,
    centerLng: 78.1307,
    radius: 1500,
    population: 3500,
    area: 12.5,
    mainCrops: ['Cotton', 'Soybean', 'Jowar', 'Tur']
  },
  {
    id: 'MH_YAV_DARWHA_001',
    name: 'Darwha',
    district: 'Yavatmal',
    state: 'Maharashtra',
    centerLat: 20.4167,
    centerLng: 78.2167,
    radius: 2000,
    population: 8500,
    area: 18.2,
    mainCrops: ['Cotton', 'Pulses', 'Oilseeds']
  },
  {
    id: 'MH_YAV_PUSAD_001',
    name: 'Pusad',
    district: 'Yavatmal',
    state: 'Maharashtra',
    centerLat: 19.9167,
    centerLng: 77.5833,
    radius: 2500,
    population: 15000,
    area: 25.8,
    mainCrops: ['Cotton', 'Soybean', 'Wheat', 'Gram']
  },
  {
    id: 'MH_YAV_WANI_001',
    name: 'Wani',
    district: 'Yavatmal',
    state: 'Maharashtra',
    centerLat: 20.0667,
    centerLng: 78.9500,
    radius: 2200,
    population: 12000,
    area: 22.1,
    mainCrops: ['Coal Mining', 'Cotton', 'Pulses']
  },

  // Chandrapur District
  {
    id: 'MH_CHAN_CHANDRAPUR_001',
    name: 'Chandrapur',
    district: 'Chandrapur',
    state: 'Maharashtra',
    centerLat: 19.9615,
    centerLng: 79.2961,
    radius: 3000,
    population: 320000,
    area: 45.2,
    mainCrops: ['Rice', 'Pulses', 'Oilseeds']
  },
  {
    id: 'MH_CHAN_BALLARPUR_001',
    name: 'Ballarpur',
    district: 'Chandrapur',
    state: 'Maharashtra',
    centerLat: 19.8500,
    centerLng: 79.3500,
    radius: 1800,
    population: 18000,
    area: 15.6,
    mainCrops: ['Coal Mining', 'Rice', 'Cotton']
  },
  {
    id: 'MH_CHAN_BRAHMAPURI_001',
    name: 'Brahmapuri',
    district: 'Chandrapur',
    state: 'Maharashtra',
    centerLat: 20.3833,
    centerLng: 79.7833,
    radius: 1600,
    population: 14000,
    area: 14.2,
    mainCrops: ['Rice', 'Pulses', 'Oilseeds']
  },
  {
    id: 'MH_CHAN_WARORA_001',
    name: 'Warora',
    district: 'Chandrapur',
    state: 'Maharashtra',
    centerLat: 20.2333,
    centerLng: 78.8833,
    radius: 1700,
    population: 16000,
    area: 13.8,
    mainCrops: ['Coal Mining', 'Cotton', 'Soybean']
  },

  // Wardha District
  {
    id: 'MH_WARD_WARDHA_001',
    name: 'Wardha',
    district: 'Wardha',
    state: 'Maharashtra',
    centerLat: 20.7453,
    centerLng: 78.6022,
    radius: 2000,
    population: 120000,
    area: 28.5,
    mainCrops: ['Cotton', 'Soybean', 'Jowar', 'Wheat']
  },
  {
    id: 'MH_WARD_HINGANGHAT_001',
    name: 'Hinganghat',
    district: 'Wardha',
    state: 'Maharashtra',
    centerLat: 20.5667,
    centerLng: 78.8333,
    radius: 1500,
    population: 92000,
    area: 20.2,
    mainCrops: ['Cotton', 'Oranges', 'Soybean']
  },
  {
    id: 'MH_WARD_DEOLI_001',
    name: 'Deoli',
    district: 'Wardha',
    state: 'Maharashtra',
    centerLat: 20.6833,
    centerLng: 78.4833,
    radius: 1200,
    population: 15000,
    area: 12.8,
    mainCrops: ['Cotton', 'Pulses', 'Oilseeds']
  },
  {
    id: 'MH_WARD_SINDHI_001',
    name: 'Sindhi (M)',
    district: 'Wardha',
    state: 'Maharashtra',
    centerLat: 20.8167,
    centerLng: 78.7500,
    radius: 1000,
    population: 8500,
    area: 8.5,
    mainCrops: ['Cotton', 'Soybean', 'Jowar']
  },

  // Amravati District
  {
    id: 'MH_AMAR_AMRAVATI_001',
    name: 'Amravati',
    district: 'Amravati',
    state: 'Maharashtra',
    centerLat: 21.1463,
    centerLng: 77.7798,
    radius: 3500,
    population: 647000,
    area: 52.3,
    mainCrops: ['Cotton', 'Soybean', 'Pulses', 'Oranges']
  },
  {
    id: 'MH_AMAR_ACHALPUR_001',
    name: 'Achalpur',
    district: 'Amravati',
    state: 'Maharashtra',
    centerLat: 21.2500,
    centerLng: 77.5000,
    radius: 1400,
    population: 120000,
    area: 18.6,
    mainCrops: ['Cotton', 'Pulses', 'Oilseeds']
  },
  {
    id: 'MH_AMAR_DARYAPUR_001',
    name: 'Daryapur',
    district: 'Amravati',
    state: 'Maharashtra',
    centerLat: 21.1667,
    centerLng: 77.3167,
    radius: 1300,
    population: 34000,
    area: 11.2,
    mainCrops: ['Cotton', 'Soybean', 'Jowar']
  },
  {
    id: 'MH_AMAR_MORSHI_001',
    name: 'Morshi',
    district: 'Amravati',
    state: 'Maharashtra',
    centerLat: 21.3333,
    centerLng: 78.3833,
    radius: 1200,
    population: 35000,
    area: 10.8,
    mainCrops: ['Oranges', 'Cotton', 'Soybean']
  },

  // Nagpur District
  {
    id: 'MH_NAG_NAGPUR_001',
    name: 'Nagpur',
    district: 'Nagpur',
    state: 'Maharashtra',
    centerLat: 21.1458,
    centerLng: 79.0882,
    radius: 4000,
    population: 2400000,
    area: 65.3,
    mainCrops: ['Oranges', 'Cotton', 'Soybean']
  },
  {
    id: 'MH_NAG_KAMTHI_001',
    name: 'Kamthi',
    district: 'Nagpur',
    state: 'Maharashtra',
    centerLat: 21.2833,
    centerLng: 79.2000,
    radius: 1500,
    population: 85000,
    area: 15.2,
    mainCrops: ['Rice', 'Oranges', 'Vegetables']
  },
  {
    id: 'MH_NAG_RAMTEK_001',
    name: 'Ramtek',
    district: 'Nagpur',
    state: 'Maharashtra',
    centerLat: 21.4000,
    centerLng: 79.3333,
    radius: 1300,
    population: 25000,
    area: 12.5,
    mainCrops: ['Rice', 'Pulses', 'Oilseeds']
  },
  {
    id: 'MH_NAG_BHANDARA_001',
    name: 'Bhandara',
    district: 'Bhandara',
    state: 'Maharashtra',
    centerLat: 21.1833,
    centerLng: 79.6500,
    radius: 1600,
    population: 90000,
    area: 16.8,
    mainCrops: ['Rice', 'Pulses', 'Fisheries']
  },

  // Akola District
  {
    id: 'MH_AKOLA_AKOLA_001',
    name: 'Akola',
    district: 'Akola',
    state: 'Maharashtra',
    centerLat: 20.7000,
    centerLng: 77.0167,
    radius: 2500,
    population: 425000,
    area: 35.2,
    mainCrops: ['Cotton', 'Pulses', 'Oilseeds', 'Soybean']
  },
  {
    id: 'MH_AKOLA_SHEGAON_001',
    name: 'Shegaon',
    district: 'Akola',
    state: 'Maharashtra',
    centerLat: 20.7833,
    centerLng: 76.6833,
    radius: 1200,
    population: 65000,
    area: 13.5,
    mainCrops: ['Cotton', 'Pulses', 'Wheat']
  },
  {
    id: 'MH_AKOLA_WASHIM_001',
    name: 'Washim',
    district: 'Washim',
    state: 'Maharashtra',
    centerLat: 20.1167,
    centerLng: 77.1333,
    radius: 1400,
    population: 75000,
    area: 14.8,
    mainCrops: ['Cotton', 'Pulses', 'Oilseeds']
  },
  {
    id: 'MH_AKOLA_MANGRULPIR_001',
    name: 'Mangrulpir',
    district: 'Akola',
    state: 'Maharashtra',
    centerLat: 20.3167,
    centerLng: 76.9833,
    radius: 1000,
    population: 25000,
    area: 9.2,
    mainCrops: ['Cotton', 'Soybean', 'Pulses']
  }
];

export class VillageDataService {
  /**
   * Get village by name, district, and state
   */
  static getVillage(name: string, district: string, state: string): VillageData | null {
    return VILLAGE_DATASET.find(
      village => village.name.toLowerCase() === name.toLowerCase() &&
                 village.district.toLowerCase() === district.toLowerCase() &&
                 village.state.toLowerCase() === state.toLowerCase()
    ) || null;
  }

  /**
   * Get villages by district
   */
  static getVillagesByDistrict(district: string): VillageData[] {
    return VILLAGE_DATASET.filter(
      village => village.district.toLowerCase() === district.toLowerCase()
    );
  }

  /**
   * Get villages by state
   */
  static getVillagesByState(state: string): VillageData[] {
    return VILLAGE_DATASET.filter(
      village => village.state.toLowerCase() === state.toLowerCase()
    );
  }

  /**
   * Search villages by name (partial match)
   */
  static searchVillages(query: string): VillageData[] {
    const lowerQuery = query.toLowerCase();
    return VILLAGE_DATASET.filter(
      village => village.name.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get all districts in a state
   */
  static getDistrictsByState(state: string): string[] {
    const districts = new Set<string>();
    VILLAGE_DATASET
      .filter(village => village.state.toLowerCase() === state.toLowerCase())
      .forEach(village => districts.add(village.district));
    return Array.from(districts).sort();
  }

  /**
   * Get all states
   */
  static getAllStates(): string[] {
    const states = new Set<string>();
    VILLAGE_DATASET.forEach(village => states.add(village.state));
    return Array.from(states).sort();
  }

  /**
   * Find nearest village to given coordinates
   */
  static findNearestVillage(lat: number, lng: number): VillageData | null {
    if (VILLAGE_DATASET.length === 0) return null;

    let nearestVillage = VILLAGE_DATASET[0];
    let minDistance = this.calculateDistance(
      lat, lng, 
      nearestVillage.centerLat, nearestVillage.centerLng
    );

    for (const village of VILLAGE_DATASET.slice(1)) {
      const distance = this.calculateDistance(
        lat, lng, 
        village.centerLat, village.centerLng
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestVillage = village;
      }
    }

    return nearestVillage;
  }

  /**
   * Calculate distance between two GPS coordinates using Haversine formula
   */
  static calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in meters
  }

  /**
   * Check if coordinates are within village boundary
   */
  static isWithinVillageBoundary(
    lat: number, 
    lng: number, 
    village: VillageData
  ): boolean {
    const distance = this.calculateDistance(
      lat, lng, 
      village.centerLat, village.centerLng
    );
    return distance <= village.radius;
  }

  /**
   * Get village statistics
   */
  static getStatistics(): {
    totalVillages: number;
    totalStates: number;
    totalDistricts: number;
    avgPopulation: number;
    avgArea: number;
  } {
    const states = new Set<string>();
    const districts = new Set<string>();
    let totalPopulation = 0;
    let totalArea = 0;
    let villagesWithPopulation = 0;
    let villagesWithArea = 0;

    VILLAGE_DATASET.forEach(village => {
      states.add(village.state);
      districts.add(village.district);
      if (village.population) {
        totalPopulation += village.population;
        villagesWithPopulation++;
      }
      if (village.area) {
        totalArea += village.area;
        villagesWithArea++;
      }
    });

    return {
      totalVillages: VILLAGE_DATASET.length,
      totalStates: states.size,
      totalDistricts: districts.size,
      avgPopulation: villagesWithPopulation > 0 ? Math.round(totalPopulation / villagesWithPopulation) : 0,
      avgArea: villagesWithArea > 0 ? Math.round(totalArea / villagesWithArea * 10) / 10 : 0
    };
  }

  /**
   * Get villages by main crop
   */
  static getVillagesByCrop(crop: string): VillageData[] {
    return VILLAGE_DATASET.filter(
      village => village.mainCrops && 
                 village.mainCrops.some(c => c.toLowerCase() === crop.toLowerCase())
    );
  }

  /**
   * Validate village data
   */
  static validateVillage(village: VillageData): boolean {
    return !!(
      village.id &&
      village.name &&
      village.district &&
      village.state &&
      village.centerLat &&
      village.centerLng &&
      village.radius &&
      village.centerLat >= -90 && village.centerLat <= 90 &&
      village.centerLng >= -180 && village.centerLng <= 180 &&
      village.radius > 0
    );
  }
}
