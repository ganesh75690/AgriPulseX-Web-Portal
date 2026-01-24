import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, TrendingUp, MapPin, Warehouse, Truck, BarChart3, Activity, Info, ArrowRight, AlertCircle } from 'lucide-react';

interface SupplyChainData {
  alternateRoutes: number;
  mandiAccess: number; // distance in km
  storageCapacity: number; // percentage
  perishabilityFactor: number; // 1-5 scale
  routeDependency: number; // percentage
}

interface ShockIndexResult {
  score: number;
  classification: 'high' | 'moderate' | 'low';
  resilience: string;
  recommendation: string;
  factors: {
    alternateRoutes: { value: number; weight: number; contribution: number };
    mandiAccess: { value: number; weight: number; contribution: number };
    storageCapacity: { value: number; weight: number; contribution: number };
    perishability: { value: number; weight: number; contribution: number };
    routeDependency: { value: number; weight: number; contribution: number };
  };
}

export default function SupplyChainShockIndex() {
  const [fadeIn, setFadeIn] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('ludhiana');
  const [isCalculating, setIsCalculating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [shockData, setShockData] = useState<SupplyChainData>({
    alternateRoutes: 2,
    mandiAccess: 12,
    storageCapacity: 65,
    perishabilityFactor: 3,
    routeDependency: 75
  });
  const [indexResult, setIndexResult] = useState<ShockIndexResult | null>(null);

  const regions = [
    { id: 'amritsar', name: 'Amritsar District' },
    { id: 'jalandhar', name: 'Jalandhar District' },
    { id: 'ludhiana', name: 'Ludhiana District' },
    { id: 'patiala', name: 'Patiala District' },
    { id: 'bathinda', name: 'Bathinda District' },
    { id: 'firozpur', name: 'Firozpur District' }
  ];

  const regionData: Record<string, SupplyChainData> = {
    amritsar: {
      alternateRoutes: 2,
      mandiAccess: 12,
      storageCapacity: 65,
      perishabilityFactor: 3,
      routeDependency: 75
    },
    jalandhar: {
      alternateRoutes: 1,
      mandiAccess: 18,
      storageCapacity: 45,
      perishabilityFactor: 4,
      routeDependency: 85
    },
    ludhiana: {
      alternateRoutes: 3,
      mandiAccess: 8,
      storageCapacity: 80,
      perishabilityFactor: 2,
      routeDependency: 60
    },
    patiala: {
      alternateRoutes: 2,
      mandiAccess: 15,
      storageCapacity: 70,
      perishabilityFactor: 3,
      routeDependency: 70
    },
    bathinda: {
      alternateRoutes: 1,
      mandiAccess: 25,
      storageCapacity: 35,
      perishabilityFactor: 4,
      routeDependency: 90
    },
    firozpur: {
      alternateRoutes: 2,
      mandiAccess: 20,
      storageCapacity: 55,
      perishabilityFactor: 3,
      routeDependency: 80
    }
  };

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 200);
    // Simulate real-time updates
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const data = regionData[selectedRegion];
    setShockData(data);
    setIsCalculating(true);
    // Simulate calculation delay for demo effect
    setTimeout(() => {
      calculateShockIndex(data);
      setIsCalculating(false);
    }, 800);
  }, [selectedRegion]);

  const calculateShockIndex = (data: SupplyChainData) => {
    // Normalize values to 0-100 scale
    const normalizedAltRoutes = Math.min((data.alternateRoutes / 4) * 100, 100);
    const normalizedMandiAccess = Math.max(0, 100 - (data.mandiAccess / 50) * 100);
    const normalizedStorage = data.storageCapacity;
    const normalizedPerishability = Math.max(0, 100 - (data.perishabilityFactor / 5) * 100);
    const normalizedDependency = Math.max(0, 100 - data.routeDependency);

    // Calculate weighted score
    const score = Math.round(
      (normalizedAltRoutes * 0.20) +
      (normalizedMandiAccess * 0.25) +
      (normalizedStorage * 0.20) +
      (normalizedPerishability * 0.15) +
      (normalizedDependency * 0.20)
    );

    const classification = score >= 70 ? 'high' : score >= 40 ? 'moderate' : 'low';
    const resilience = score >= 70 ? 'High Resilience' : score >= 40 ? 'Moderate Resilience' : 'Low Resilience';

    const recommendation = score >= 70 
      ? "Supply chain demonstrates strong resilience. Full containment measures can be safely implemented with minimal market disruption."
      : score >= 40
      ? "Supply chain has moderate resilience. Prefer selective route restrictions over complete containment to maintain market flow."
      : "Supply chain shows limited resilience. Full containment may cause significant market disruption and farmer income loss. Consider targeted interventions only.";

    const result: ShockIndexResult = {
      score,
      classification,
      resilience,
      recommendation,
      factors: {
        alternateRoutes: { value: data.alternateRoutes, weight: 20, contribution: Math.round(normalizedAltRoutes * 0.20) },
        mandiAccess: { value: data.mandiAccess, weight: 25, contribution: Math.round(normalizedMandiAccess * 0.25) },
        storageCapacity: { value: data.storageCapacity, weight: 20, contribution: Math.round(normalizedStorage * 0.20) },
        perishability: { value: data.perishabilityFactor, weight: 15, contribution: Math.round(normalizedPerishability * 0.15) },
        routeDependency: { value: data.routeDependency, weight: 20, contribution: Math.round(normalizedDependency * 0.20) }
      }
    };

    setIndexResult(result);
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 70) return 'bg-green-50 border-green-200';
    if (score >= 40) return 'bg-amber-50 border-amber-200';
    return 'bg-red-50 border-red-200';
  };

  const getResilienceIcon = (classification: string) => {
    if (classification === 'high') return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (classification === 'moderate') return <AlertTriangle className="w-5 h-5 text-amber-600" />;
    return <AlertCircle className="w-5 h-5 text-red-600" />;
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-50 transition-opacity duration-700 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl text-gray-900">Supply-Chain Shock Absorption Index</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Resilience assessment for agricultural supply chain during disease containment
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label htmlFor="region-select" className="sr-only">Select Region</label>
              <select
                id="region-select"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
              >
                {regions.map(region => (
                  <option key={region.id} value={region.id}>{region.name}</option>
                ))}
              </select>
              <div className="text-xs text-gray-500">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        {/* Summary Statistics */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <MapPin className="w-4 h-4 text-blue-600" />
              </div>
              <h4 className="text-sm font-medium text-gray-900">Regions Monitored</h4>
            </div>
            <div className="text-2xl font-bold text-gray-900">{regions.length}</div>
            <div className="text-xs text-gray-500">Districts covered</div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <h4 className="text-sm font-medium text-gray-900">High Resilience</h4>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {Object.values(regionData).filter(d => 
                (Math.min((d.alternateRoutes / 4) * 100, 100) * 0.20 +
                Math.max(0, 100 - (d.mandiAccess / 50) * 100) * 0.25 +
                d.storageCapacity * 0.20 +
                Math.max(0, 100 - (d.perishabilityFactor / 5) * 100) * 0.15 +
                Math.max(0, 100 - d.routeDependency) * 0.20) >= 70
              ).length}
            </div>
            <div className="text-xs text-gray-500">Score ≥ 70</div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              </div>
              <h4 className="text-sm font-medium text-gray-900">Moderate Resilience</h4>
            </div>
            <div className="text-2xl font-bold text-amber-600">
              {Object.values(regionData).filter(d => {
                const score = (Math.min((d.alternateRoutes / 4) * 100, 100) * 0.20 +
                Math.max(0, 100 - (d.mandiAccess / 50) * 100) * 0.25 +
                d.storageCapacity * 0.20 +
                Math.max(0, 100 - (d.perishabilityFactor / 5) * 100) * 0.15 +
                Math.max(0, 100 - d.routeDependency) * 0.20);
                return score >= 40 && score < 70;
              }).length}
            </div>
            <div className="text-xs text-gray-500">Score 40-69</div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-red-600" />
              </div>
              <h4 className="text-sm font-medium text-gray-900">Low Resilience</h4>
            </div>
            <div className="text-2xl font-bold text-red-600">
              {Object.values(regionData).filter(d => 
                (Math.min((d.alternateRoutes / 4) * 100, 100) * 0.20 +
                Math.max(0, 100 - (d.mandiAccess / 50) * 100) * 0.25 +
                d.storageCapacity * 0.20 +
                Math.max(0, 100 - (d.perishabilityFactor / 5) * 100) * 0.15 +
                Math.max(0, 100 - d.routeDependency) * 0.20) < 40
              ).length}
            </div>
            <div className="text-xs text-gray-500">Score &lt; 40</div>
          </div>
        </div>

        {/* Policy Guidance */}
        <div className="bg-gradient-to-r from-slate-50 to-gray-50 border-l-4 border-slate-500 rounded-lg p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <h3 className="text-sm text-slate-900 mb-1 font-semibold">Policy Assessment Framework</h3>
              <p className="text-xs text-slate-800 leading-relaxed">
                SCSAI evaluates supply chain resilience to determine safe containment levels. <strong>Higher scores indicate 
                greater capacity to absorb transport restrictions without disrupting food security or farmer income.</strong> This index 
                serves as a validation layer before implementing disease control measures.
              </p>
            </div>
          </div>
        </div>

        {/* Shock Index Display */}
        {isCalculating ? (
          <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm overflow-hidden">
            <div className="p-12">
              <div className="flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mb-4"></div>
                <p className="text-gray-600 font-medium">Calculating Shock Absorption Index...</p>
                <p className="text-sm text-gray-500 mt-2">Analyzing supply chain resilience factors</p>
              </div>
            </div>
          </div>
        ) : indexResult && (
          <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-white px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg text-gray-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-slate-600" />
                Regional Shock Absorption Assessment
              </h2>
            </div>
            
            <div className="p-8">
              {/* Main Score Display */}
              <div className={`rounded-xl p-8 border-2 ${getScoreBgColor(indexResult.score)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-6xl font-bold mb-2">
                        <span className={getScoreColor(indexResult.score)}>{indexResult.score}</span>
                        <span className="text-3xl text-gray-400">/100</span>
                      </div>
                      <div className={`text-lg font-semibold ${getScoreColor(indexResult.score)}`}>
                        {indexResult.resilience}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getResilienceIcon(indexResult.classification)}
                      <div>
                        <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          indexResult.classification === 'high' ? 'bg-green-100 text-green-700' :
                          indexResult.classification === 'moderate' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {indexResult.classification === 'high' ? '🟢 HIGH RESILIENCE' :
                           indexResult.classification === 'moderate' ? '🟡 MODERATE RESILIENCE' :
                           '🔴 LOW RESILIENCE'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendation Panel */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-blue-900 mb-2">Policy Recommendation</h4>
                      <p className="text-sm text-blue-800 leading-relaxed">{indexResult.recommendation}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Factor Breakdown */}
        {indexResult && (
          <div className="grid grid-cols-2 gap-6">
            {/* Input Factors */}
            <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm">
              <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg text-gray-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-gray-600" />
                  Supply Chain Indicators
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Truck className="w-4 h-4 text-gray-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Alternate Routes</div>
                      <div className="text-xs text-gray-600">Available transport corridors</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900">{shockData.alternateRoutes}</div>
                    <div className="text-xs text-gray-600">Weight: {indexResult.factors.alternateRoutes.weight}%</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Mandi Access</div>
                      <div className="text-xs text-gray-600">Distance to nearest market</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900">{shockData.mandiAccess} km</div>
                    <div className="text-xs text-gray-600">Weight: {indexResult.factors.mandiAccess.weight}%</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Warehouse className="w-4 h-4 text-gray-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Storage Capacity</div>
                      <div className="text-xs text-gray-600">Cold storage availability</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900">{shockData.storageCapacity}%</div>
                    <div className="text-xs text-gray-600">Weight: {indexResult.factors.storageCapacity.weight}%</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Activity className="w-4 h-4 text-gray-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Perishability Factor</div>
                      <div className="text-xs text-gray-600">Crop spoilage risk (1-5 scale)</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900">{shockData.perishabilityFactor}/5</div>
                    <div className="text-xs text-gray-600">Weight: {indexResult.factors.perishability.weight}%</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-4 h-4 text-gray-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Route Dependency</div>
                      <div className="text-xs text-gray-600">Reliance on single corridor</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900">{shockData.routeDependency}%</div>
                    <div className="text-xs text-gray-600">Weight: {indexResult.factors.routeDependency.weight}%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Score Contribution */}
            <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm">
              <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg text-gray-900 flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 text-gray-600" />
                  Score Contribution Analysis
                </h3>
              </div>
              <div className="p-6 space-y-3">
                {indexResult && Object.entries(indexResult.factors).map(([key, factor]: [string, any]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        factor.contribution >= 15 ? 'bg-green-500' :
                        factor.contribution >= 10 ? 'bg-amber-500' :
                        'bg-red-500'
                      }`}></div>
                      <span className="text-sm text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-medium text-gray-900 w-12 text-right">
                        {factor.contribution}
                      </div>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            factor.contribution >= 15 ? 'bg-green-500' :
                            factor.contribution >= 10 ? 'bg-amber-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${factor.contribution}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Policy Decision Framework */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl shadow-sm">
          <div className="bg-amber-100 px-6 py-3 border-b border-amber-300">
            <h3 className="text-sm text-amber-900 font-semibold">Containment Decision Framework</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/70 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <h4 className="text-sm font-semibold text-green-900">High Resilience (70-100)</h4>
                </div>
                <p className="text-xs text-green-800 leading-relaxed">
                  Supply chain can tolerate strong containment measures. Full restriction recommended with minimal economic impact.
                </p>
              </div>
              
              <div className="bg-white/70 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  </div>
                  <h4 className="text-sm font-semibold text-amber-900">Moderate Resilience (40-69)</h4>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Prefer selective route monitoring and partial restrictions to maintain market flow while controlling disease spread.
                </p>
              </div>
              
              <div className="bg-white/70 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  </div>
                  <h4 className="text-sm font-semibold text-red-900">Low Resilience (0-39)</h4>
                </div>
                <p className="text-xs text-red-800 leading-relaxed">
                  Avoid strict containment. High risk of food shortages and farmer income collapse. Consider targeted interventions only.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
