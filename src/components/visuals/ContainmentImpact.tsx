import React, { useState, useEffect } from 'react';
import { TrendingDown, AlertTriangle, CheckCircle, Users, MapPin, DollarSign } from 'lucide-react';

export default function ContainmentImpact() {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 300);
  }, []);

  const noActionData = {
    spreadRadius: '18 km',
    affectedArea: '1,017 sq km',
    affectedVillages: '42 villages',
    farmerCount: '4,800 farmers',
    cropLoss: '₹42.8 crore',
    supplyDisruption: 'Severe (8-10 routes)',
    timeframe: '7-10 days'
  };

  const withActionData = {
    spreadRadius: '5 km (contained)',
    affectedArea: '78.5 sq km',
    affectedVillages: '8 villages',
    farmerCount: '1,240 farmers',
    cropLoss: '₹14.2 crore',
    supplyDisruption: 'Minimal (2 routes)',
    timeframe: '14 days with review'
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 transition-opacity duration-700 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-gray-900 flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-[#2f9d58]" />
          Containment Impact Analysis: Before vs After
        </h2>
        <p className="text-xs text-gray-600 mt-1">
          Side-by-side comparison to understand the value of recommended containment action
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-6">
          {/* If No Action Taken */}
          <div className="border-2 border-red-200 rounded-lg overflow-hidden">
            <div className="bg-red-50 px-4 py-3 border-b border-red-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="text-red-900">If No Action Taken</h3>
              </div>
              <p className="text-xs text-red-700 mt-1">Projected scenario without intervention</p>
            </div>

            <div className="p-6 space-y-4">
              {/* Visual Representation */}
              <div className="relative h-48 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200 overflow-hidden">
                {/* Spreading circles animation */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-32 h-32 bg-red-500 rounded-full opacity-30 animate-pulse"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-red-600 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-red-700 rounded-full opacity-50"></div>
                </div>
                <div className="absolute bottom-2 right-2 px-3 py-1.5 bg-white/90 rounded shadow text-xs text-red-900">
                  Uncontrolled Spread
                </div>
              </div>

              {/* Impact Metrics */}
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-600">Spread Radius</div>
                    <div className="text-sm text-red-900">{noActionData.spreadRadius}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-600">Affected Area</div>
                    <div className="text-sm text-red-900">{noActionData.affectedArea}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-600">Farmers Affected</div>
                    <div className="text-sm text-red-900">{noActionData.farmerCount}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <DollarSign className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-600">Estimated Crop Loss</div>
                    <div className="text-sm text-red-900">{noActionData.cropLoss}</div>
                  </div>
                </div>

                <div className="p-3 bg-red-100 rounded border border-red-200">
                  <div className="text-xs text-red-700">Supply-Chain Impact</div>
                  <div className="text-sm text-red-900 mt-0.5">{noActionData.supplyDisruption}</div>
                </div>
              </div>
            </div>
          </div>

          {/* With Recommended Containment */}
          <div className="border-2 border-green-200 rounded-lg overflow-hidden">
            <div className="bg-green-50 px-4 py-3 border-b border-green-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="text-green-900">With Recommended Containment</h3>
              </div>
              <p className="text-xs text-green-700 mt-1">AI-recommended targeted intervention</p>
            </div>

            <div className="p-6 space-y-4">
              {/* Visual Representation */}
              <div className="relative h-48 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 overflow-hidden">
                {/* Contained circle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-20 h-20 border-4 border-green-600 border-dashed rounded-full opacity-60"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-green-600 rounded-full opacity-40"></div>
                </div>
                <div className="absolute top-3 left-3 px-3 py-1.5 bg-white/90 rounded shadow text-xs text-green-900">
                  5 km Containment Zone
                </div>
                <div className="absolute bottom-2 right-2 px-3 py-1.5 bg-white/90 rounded shadow text-xs text-green-900">
                  Controlled & Monitored
                </div>
              </div>

              {/* Impact Metrics */}
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-600">Spread Radius</div>
                    <div className="text-sm text-green-900">{withActionData.spreadRadius}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-600">Affected Area</div>
                    <div className="text-sm text-green-900">{withActionData.affectedArea}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-600">Farmers Affected</div>
                    <div className="text-sm text-green-900">{withActionData.farmerCount}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <DollarSign className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-600">Estimated Crop Loss</div>
                    <div className="text-sm text-green-900">{withActionData.cropLoss}</div>
                  </div>
                </div>

                <div className="p-3 bg-green-100 rounded border border-green-200">
                  <div className="text-xs text-green-700">Supply-Chain Impact</div>
                  <div className="text-sm text-green-900 mt-0.5">{withActionData.supplyDisruption}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Impact Summary */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-center">
            <div className="text-xs text-blue-700 mb-1">Farmers Protected</div>
            <div className="text-2xl text-blue-900">3,560</div>
            <div className="text-xs text-blue-600 mt-1">74% reduction</div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-center">
            <div className="text-xs text-blue-700 mb-1">Crop Value Saved</div>
            <div className="text-2xl text-blue-900">₹28.6 Cr</div>
            <div className="text-xs text-blue-600 mt-1">67% protected</div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-center">
            <div className="text-xs text-blue-700 mb-1">Area Contained</div>
            <div className="text-2xl text-blue-900">92%</div>
            <div className="text-xs text-blue-600 mt-1">spread prevented</div>
          </div>
        </div>

        {/* Decision Clarity Message */}
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded">
          <p className="text-xs text-amber-900">
            <strong>Decision Clarity:</strong> This comparison demonstrates that targeted containment protects more farmers 
            and reduces economic damage by 67% compared to delayed or no action. Early intervention minimizes both human 
            and economic costs while maintaining supply-chain stability.
          </p>
        </div>
      </div>
    </div>
  );
}

