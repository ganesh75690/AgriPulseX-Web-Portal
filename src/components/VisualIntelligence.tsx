import React from 'react';
import { Eye, TrendingUp, Info, MapPin } from 'lucide-react';
import TemporalRiskTrend from './visuals/TemporalRiskTrend';
import ContainmentImpact from './visuals/ContainmentImpact';
import EconomicImpact from './visuals/EconomicImpact';
import ConfidenceTrust from './visuals/ConfidenceTrust';

export default function VisualIntelligence() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/20 to-gray-50">
      {/* Modern Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Eye className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl text-gray-900">Visual Intelligence Dashboard</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Advanced risk visualizations for informed decision-making and policy justification
                </p>
              </div>
            </div>
            <div className="px-4 py-2 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="text-xs text-purple-700">System Status</div>
              <div className="text-sm text-purple-900 mt-0.5 flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                All Visuals Active
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        {/* System Notice */}
        <div className="bg-white border-l-4 border-purple-500 shadow-sm rounded-lg p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Eye className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-gray-900 mb-1">Officer Decision Support Framework</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                These visualizations are designed to support officer judgement and thinking, not automate decisions. 
                Each visual component helps answer critical questions: <strong>Where is the risk? How serious is it? 
                What happens if we act vs don't act? How confident are we?</strong> All visualizations provide decision 
                support signals that require human verification, local knowledge, and officer approval before implementation.
              </p>
            </div>
          </div>
        </div>

        {/* Regional Risk Heat Map */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-sm text-red-900 mb-2">India Regional Risk Map</h3>
              <p className="text-xs text-red-800 mb-4 leading-relaxed">
                Interactive heatmap showing disease risk levels across all Indian states with detailed state-wise analysis
              </p>
            </div>
          </div>
        </div>
        
        {/* Direct Regional Heatmap */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">India Regional Disease Risk Heatmap</h3>
            
            {/* Interactive Heatmap */}
            <div className="relative h-96 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-gray-200 overflow-hidden">
              {/* Map Title */}
              <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-lg shadow-md z-20 border border-gray-200">
                <span className="text-sm font-semibold text-gray-700">Disease Risk Heatmap</span>
              </div>
              
              {/* SVG India Heatmap */}
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <svg 
                  viewBox="0 0 600 700" 
                  className="w-full h-full max-w-3xl"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* India Outline - Simplified Shape */}
                  <g id="india-outline" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="2">
                    <path d="M300 100 L400 100 L450 150 L480 200 L500 250 L490 300 L450 350 L400 400 L350 450 L300 500 L250 450 L200 400 L150 350 L120 300 L110 250 L130 200 L150 150 L200 100 L250 80 Z" />
                  </g>
                  
                  {/* Risk Heatmap Circles */}
                  <g id="heatmap-overlays">
                    {/* High Risk States - Red */}
                    <circle cx="350" cy="200" r="35" fill="url(#redGradient)" fillOpacity="0.8" stroke="#dc2626" strokeWidth="2">
                      <title>Maharashtra: High Risk - 567 active cases</title>
                      <animate attributeName="r" values="35;38;35" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="280" cy="180" r="32" fill="url(#redGradient)" fillOpacity="0.8" stroke="#dc2626" strokeWidth="2">
                      <title>Uttar Pradesh: High Risk - 423 active cases</title>
                      <animate attributeName="r" values="32;35;32" dur="2.5s" repeatCount="indefinite" />
                    </circle>
                    
                    {/* Medium Risk States - Orange */}
                    <circle cx="380" cy="380" r="25" fill="url(#orangeGradient)" fillOpacity="0.8" stroke="#d97706" strokeWidth="2">
                      <title>Andhra Pradesh: Medium Risk - 234 active cases</title>
                    </circle>
                    <circle cx="320" cy="420" r="23" fill="url(#orangeGradient)" fillOpacity="0.8" stroke="#d97706" strokeWidth="2">
                      <title>Tamil Nadu: Medium Risk - 198 active cases</title>
                    </circle>
                    <circle cx="420" cy="250" r="20" fill="url(#orangeGradient)" fillOpacity="0.8" stroke="#d97706" strokeWidth="2">
                      <title>West Bengal: Medium Risk - 156 active cases</title>
                    </circle>
                    
                    {/* Low Risk States - Green */}
                    <circle cx="200" cy="150" r="18" fill="url(#greenGradient)" fillOpacity="0.8" stroke="#059669" strokeWidth="2">
                      <title>Punjab: Low Risk - 45 active cases</title>
                    </circle>
                    <circle cx="340" cy="450" r="16" fill="url(#greenGradient)" fillOpacity="0.8" stroke="#059669" strokeWidth="2">
                      <title>Karnataka: Low Risk - 89 active cases</title>
                    </circle>
                  </g>
                  
                  {/* State Labels */}
                  <g id="state-labels" fill="#374151" fontSize="12" fontWeight="bold" textAnchor="middle">
                    <text x="350" y="205">MH</text>
                    <text x="280" y="185">UP</text>
                    <text x="380" y="385">AP</text>
                    <text x="320" y="425">TN</text>
                    <text x="420" y="255">WB</text>
                    <text x="200" y="155">PB</text>
                    <text x="340" y="455">KA</text>
                  </g>
                  
                  {/* Gradients for heatmap effect */}
                  <defs>
                    <radialGradient id="redGradient">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#dc2626" stopOpacity="0.3" />
                    </radialGradient>
                    <radialGradient id="orangeGradient">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#d97706" stopOpacity="0.3" />
                    </radialGradient>
                    <radialGradient id="greenGradient">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#059669" stopOpacity="0.3" />
                    </radialGradient>
                  </defs>
                </svg>
              </div>

              {/* Legend */}
              <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 z-20">
                <h4 className="text-sm font-bold mb-3 text-gray-800">Risk Levels</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full shadow-sm"></div>
                    <span className="text-sm font-medium text-gray-700">High Risk</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-orange-500 rounded-full shadow-sm"></div>
                    <span className="text-sm font-medium text-gray-700">Medium Risk</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm"></div>
                    <span className="text-sm font-medium text-gray-700">Low Risk</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Temporal Risk Trend */}
        <TemporalRiskTrend />

        {/* Containment Impact - Before vs After */}
        <ContainmentImpact />

        {/* Two Column Layout */}
        <div className="grid grid-cols-3 gap-6">
          {/* Economic Impact */}
          <div className="col-span-2">
            <EconomicImpact />
          </div>

          {/* Confidence & Trust */}
          <ConfidenceTrust />
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm text-blue-900 mb-2">Need Supply Chain Analysis?</h3>
                <p className="text-xs text-blue-800 mb-4 leading-relaxed">
                  View detailed agricultural logistics network, route status, and containment impact on trade flows
                </p>
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition-colors shadow-sm"
                  onClick={() => window.location.href = '#supply-chain'}
                >
                  Open Supply Chain Monitor
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Info className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-sm text-amber-900 mb-2">Need Image Detection Support?</h3>
                <p className="text-xs text-amber-800 mb-4 leading-relaxed">
                  Upload field images for AI-assisted analysis. This is an optional tool that provides supporting signals only
                </p>
                <button 
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg text-xs hover:bg-amber-700 transition-colors shadow-sm"
                  onClick={() => window.location.href = '#image-detection'}
                >
                  Open Image Detection
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Officer Accountability Footer */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 shadow-sm rounded-xl overflow-hidden">
          <div className="bg-amber-100 px-6 py-3 border-b border-amber-300">
            <h3 className="text-sm text-amber-900">Officer Responsibility & Accountability</h3>
          </div>
          <div className="p-6">
            <p className="text-sm text-amber-900 leading-relaxed">
              All visualizations provide <strong>decision support signals only</strong>. Officers must verify critical data 
              through field visits, apply local knowledge and contextual understanding, and exercise independent judgment 
              before approving any containment action. Visualizations enhance understanding but do not replace human 
              oversight, accountability, and the responsibility to balance disease control with farmer welfare and 
              economic stability. Every decision is logged and auditable.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
