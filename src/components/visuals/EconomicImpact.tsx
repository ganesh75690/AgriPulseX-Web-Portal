import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingDown, Users, Info, AlertCircle, CheckCircle2, Shield } from 'lucide-react';

type Scenario = 'current' | 'severe' | 'moderate';

interface ScenarioData {
  farmsAffected: number;
  avgLossPerFarmer: number;
  totalIncomeAtRisk: number;
  cropValueProtected: number;
  lossWithoutAction: number;
  lossWithAction: number;
  directImpact: number;
  protectedFarmers: number;
  containmentLevel: number;
}

interface Scenarios {
  [key: string]: ScenarioData;
}

export default function EconomicImpact() {
  const [fadeIn, setFadeIn] = useState(false);
  const [animateBar, setAnimateBar] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState('current');
  const [animateNumbers, setAnimateNumbers] = useState(false);

  // Dynamic economic data based on scenario
  const scenarios: Scenarios = {
    current: {
      farmsAffected: 1200,
      avgLossPerFarmer: 29167,
      totalIncomeAtRisk: 350000000,
      cropValueProtected: 770000000,
      lossWithoutAction: 1120000000,
      lossWithAction: 350000000,
      directImpact: 1200,
      protectedFarmers: 3600,
      containmentLevel: 69
    },
    severe: {
      farmsAffected: 2100,
      avgLossPerFarmer: 28500,
      totalIncomeAtRisk: 598500000,
      cropValueProtected: 234000000,
      lossWithoutAction: 897500000,
      lossWithAction: 234000000,
      directImpact: 2100,
      protectedFarmers: 4200,
      containmentLevel: 74
    },
    moderate: {
      farmsAffected: 680,
      avgLossPerFarmer: 12000,
      totalIncomeAtRisk: 81600000,
      cropValueProtected: 89000000,
      lossWithoutAction: 170800000,
      lossWithAction: 89000000,
      directImpact: 680,
      protectedFarmers: 2040,
      containmentLevel: 48
    }
  };

  // Supply route disruption data
  const supplyRoutes = {
    current: { withAction: 4, withoutAction: 15 },
    severe: { withAction: 8, withoutAction: 25 },
    moderate: { withAction: 2, withoutAction: 8 }
  };

  const data = scenarios[selectedScenario as Scenario];
  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)} Lakh`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const formatNumber = (num: number) => num.toLocaleString('en-IN');

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 500);
    setTimeout(() => setAnimateBar(true), 800);
    setTimeout(() => setAnimateNumbers(true), 1000);
  }, [selectedScenario]);

  return (
    <div className={`bg-white shadow-sm rounded-lg border border-gray-200 transition-opacity duration-700 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-gray-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#2f9d58]" />
              Farmer & Economic Impact Analysis - Policy-Focused View
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              Answering: "How many farmers will be affected and how badly?"
            </p>
          </div>
          
          {/* Scenario Selector */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-600">Scenario:</label>
            <select
              value={selectedScenario}
              onChange={(e) => setSelectedScenario(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#2f9d58] bg-white"
              title="Select outbreak scenario for economic impact analysis"
              aria-label="Select outbreak scenario for economic impact analysis"
            >
              <option value="moderate">Moderate Outbreak</option>
              <option value="current">Current Situation</option>
              <option value="severe">Severe Outbreak</option>
            </select>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* With Containment */}
          <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border-2 border-green-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-green-900">With Containment</h3>
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-gray-700">Farms affected</span>
                </div>
                <span className="text-lg font-semibold text-green-900">{formatNumber(data.farmsAffected)}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-gray-700">Estimated income loss</span>
                </div>
                <span className="text-lg font-semibold text-green-900">{formatCurrency(data.lossWithAction)}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-gray-700">Supply routes disrupted</span>
                </div>
                <span className="text-lg font-semibold text-green-900">{supplyRoutes[selectedScenario as Scenario].withAction}</span>
              </div>
            </div>
          </div>

          {/* Without Action */}
          <div className="p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border-2 border-red-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-red-900">Without Action</h3>
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-red-600" />
                  <span className="text-xs text-gray-700">Farms affected</span>
                </div>
                <span className="text-lg font-semibold text-red-900">{formatNumber(data.directImpact + data.protectedFarmers)}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-red-600" />
                  <span className="text-xs text-gray-700">Estimated income loss</span>
                </div>
                <span className="text-lg font-semibold text-red-900">{formatCurrency(data.lossWithoutAction)}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  <span className="text-xs text-gray-700">Supply routes disrupted</span>
                </div>
                <span className="text-lg font-semibold text-red-900">{supplyRoutes[selectedScenario as Scenario].withoutAction}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Impact Prevented Summary */}
        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 shadow-sm mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900">Impact Prevented</h3>
                <p className="text-sm text-blue-700">Through timely containment action</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className={`text-3xl font-bold text-blue-900 transition-all duration-500 ${animateNumbers ? 'scale-100' : 'scale-95'}`}>
                {formatCurrency(data.lossWithoutAction - data.lossWithAction)}
              </div>
              <div className="text-sm text-blue-700">
                {Math.round(((data.lossWithoutAction - data.lossWithAction) / data.lossWithoutAction) * 100)}% of potential losses
              </div>
            </div>
          </div>
          
          {/* Visual Progress Bar */}
          <div className="mt-4">
            <div className="h-4 bg-white rounded-full overflow-hidden border border-blue-200">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-3"
                style={{ width: animateBar ? `${Math.round(((data.lossWithoutAction - data.lossWithAction) / data.lossWithoutAction) * 100)}%` : '0%' }}
              >
                <span className="text-xs text-white font-medium">
                  {Math.round(((data.lossWithoutAction - data.lossWithAction) / data.lossWithoutAction) * 100)}% Saved
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Officer Guidance */}
        <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg mb-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm text-blue-900 mb-1">Officer Guidance: Economic Impact Interpretation</h4>
              <p className="text-xs text-blue-900 leading-relaxed">
                <strong>Economic impact values are indicative estimates for decision support.</strong> While {formatNumber(data.farmsAffected)} farmers 
                face temporary income disruption, the recommended action protects {formatNumber(data.protectedFarmers)} farmers from devastating losses. 
                This analysis helps officers balance disease control with livelihood protection. Compensation mechanisms 
                should be activated immediately for affected farmers to maintain rural economic stability.
              </p>
            </div>
          </div>
        </div>

        {/* Policy Action Points */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-amber-50 rounded-lg border-2 border-amber-200">
            <h4 className="text-xs text-amber-900 mb-2">Officer Action Enabled</h4>
            <ul className="space-y-1.5 text-xs text-amber-800">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Balance health vs livelihood concerns</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Justify economic trade-offs clearly</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Communicate impact to stakeholders</span>
              </li>
            </ul>
            <div className="mt-3 p-2 bg-amber-100 rounded border border-amber-300">
              <div className="text-xs text-amber-900 font-medium">
                Current scenario: {selectedScenario === 'severe' ? 'High priority action' : selectedScenario === 'moderate' ? 'Standard protocol' : 'Enhanced monitoring'}
              </div>
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
            <h4 className="text-xs text-green-900 mb-2">Compensation Planning</h4>
            <ul className="space-y-1.5 text-xs text-green-800">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Direct income support: {formatCurrency(data.totalIncomeAtRisk)}</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Avg. per farmer: {formatCurrency(data.avgLossPerFarmer)}</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Timeline: Within containment period</span>
              </li>
            </ul>
            <div className="mt-3 p-2 bg-green-100 rounded border border-green-300">
              <div className="text-xs text-green-900 font-medium">
                Total beneficiaries: {formatNumber(data.directImpact + data.protectedFarmers)} farmers
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            <h4 className="text-xs text-blue-900 mb-2">Welfare Measures</h4>
            <ul className="space-y-1.5 text-xs text-blue-800">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Subsidized inputs for next season</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Alternative livelihood support</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Credit facility restructuring</span>
              </li>
            </ul>
            <div className="mt-3 p-2 bg-blue-100 rounded border border-blue-300">
              <div className="text-xs text-blue-900 font-medium">
                Containment level: {data.containmentLevel}% effectiveness
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
