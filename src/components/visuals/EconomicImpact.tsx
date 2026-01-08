import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingDown, TrendingUp, Users, Info } from 'lucide-react';

export default function EconomicImpact() {
  const [fadeIn, setFadeIn] = useState(false);
  const [animateBar, setAnimateBar] = useState(false);

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 500);
    setTimeout(() => setAnimateBar(true), 800);
  }, []);

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
        </div>
      </div>

      <div className="p-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-3xl text-blue-900 mb-1">1,240</div>
            <div className="text-xs text-blue-700">Farms Within Containment</div>
            <div className="text-xs text-blue-600 mt-2">Direct impact area</div>
          </div>

          <div className="p-5 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border-2 border-amber-200 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <TrendingDown className="w-6 h-6 text-amber-600" />
            </div>
            <div className="text-3xl text-amber-900 mb-1">₹18,500</div>
            <div className="text-xs text-amber-700">Avg. Loss Per Farmer</div>
            <div className="text-xs text-amber-600 mt-2">During containment period</div>
          </div>

          <div className="p-5 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border-2 border-red-200 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
            <div className="text-3xl text-red-900 mb-1">₹2.29 Cr</div>
            <div className="text-xs text-red-700">Total Income at Risk</div>
            <div className="text-xs text-red-600 mt-2">Requires compensation</div>
          </div>

          <div className="p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border-2 border-green-200 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-3xl text-green-900 mb-1">₹14.2 Cr</div>
            <div className="text-xs text-green-700">Crop Value Protected</div>
            <div className="text-xs text-green-600 mt-2">Early intervention benefit</div>
          </div>
        </div>

        {/* Comparison Visualization */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Loss Comparison Bar */}
          <div className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-gray-200">
            <h3 className="text-sm text-gray-900 mb-4">Economic Loss Comparison - Decision Impact</h3>
            
            {/* Without Action */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-700">Loss Without Action</span>
                <span className="text-sm text-red-900">₹42.8 Crore</span>
              </div>
              <div className="h-10 bg-white rounded-lg overflow-hidden border-2 border-red-200 shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-end px-4 transition-all duration-1000"
                  style={{ width: animateBar ? '100%' : '0%' }}
                >
                  <span className="text-sm text-white">100% Loss</span>
                </div>
              </div>
            </div>

            {/* With Action */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-700">Loss With Containment</span>
                <span className="text-sm text-green-900">₹14.2 Crore</span>
              </div>
              <div className="h-10 bg-white rounded-lg overflow-hidden border-2 border-green-200 shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-end px-4 transition-all duration-1000"
                  style={{ width: animateBar ? '33%' : '0%' }}
                >
                  <span className="text-sm text-white">33% Loss</span>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center p-3 bg-blue-100 rounded-lg border border-blue-300">
              <span className="text-sm text-blue-900">67% Economic Damage Prevented</span>
            </div>
          </div>

          {/* Farmer Impact Categories */}
          <div className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-gray-200">
            <h3 className="text-sm text-gray-900 mb-4">Farmer Impact Breakdown by Category</h3>
            
            <div className="space-y-3">
              <div className="p-4 bg-white rounded-lg border-2 border-red-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-700">Direct Impact (in zone)</span>
                  <span className="text-sm text-red-900">1,240 farmers</span>
                </div>
                <div className="h-2 bg-red-100 rounded-full overflow-hidden">
                  <div className="h-full bg-red-600 rounded-full" style={{ width: '26%' }}></div>
                </div>
                <div className="text-xs text-gray-600 mt-2">Require compensation & support programs</div>
              </div>

              <div className="p-4 bg-white rounded-lg border-2 border-green-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-700">Protected (adjacent areas)</span>
                  <span className="text-sm text-green-900">3,560 farmers</span>
                </div>
                <div className="h-2 bg-green-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-600 rounded-full" style={{ width: '74%' }}></div>
                </div>
                <div className="text-xs text-gray-600 mt-2">Avoided income loss through containment</div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-green-100 rounded-lg border border-green-300">
              <div className="text-xs text-green-700 mb-1">Net Protection Outcome</div>
              <div className="text-sm text-green-900">74% of at-risk farmers protected</div>
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
                <strong>Economic impact values are indicative estimates for decision support.</strong> While 1,240 farmers 
                face temporary income disruption, the recommended action protects 3,560 farmers from devastating losses. 
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
          </div>

          <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
            <h4 className="text-xs text-green-900 mb-2">Compensation Planning</h4>
            <ul className="space-y-1.5 text-xs text-green-800">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Direct income support: ₹2.29 Cr</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Avg. per farmer: ₹18,500</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Timeline: Within containment period</span>
              </li>
            </ul>
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
          </div>
        </div>
      </div>
    </div>
  );
}
