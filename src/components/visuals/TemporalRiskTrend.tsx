import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, ArrowRight, AlertTriangle, Info } from 'lucide-react';

export default function TemporalRiskTrend() {
  const [fadeIn, setFadeIn] = useState(false);
  const [animateChart, setAnimateChart] = useState(false);

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 200);
    setTimeout(() => setAnimateChart(true), 600);
  }, []);

  const trendData = [
    { day: 'Yesterday', value: 45, label: 'Moderate', color: 'bg-amber-500', height: '45%' },
    { day: 'Today', value: 72, label: 'High', color: 'bg-red-500', height: '72%' },
    { day: 'Projected', value: 85, label: 'Critical', color: 'bg-red-600', height: '85%' }
  ];

  const directionIndicator = {
    yesterdayToToday: 'up',
    todayToProjected: 'up'
  };

  return (
    <div className={`bg-white shadow-sm rounded-lg border border-gray-200 transition-opacity duration-700 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#2f9d58]" />
              Temporal Risk Trend Analysis
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              Understanding if the situation is worsening, stabilizing, or improving
            </p>
          </div>
          <div className="px-3 py-1.5 bg-red-100 text-red-700 rounded text-xs flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Risk Increasing</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Trend Visualization */}
          {trendData.map((item, index) => (
            <div key={index} className="text-center">
              <div className="mb-3">
                <div className="text-sm text-gray-700 mb-1">{item.day}</div>
                <div className={`text-2xl ${
                  item.label === 'Critical' ? 'text-red-900' :
                  item.label === 'High' ? 'text-red-700' :
                  'text-amber-700'
                }`}>
                  {item.value}%
                </div>
                <div className="text-xs text-gray-600">{item.label} Risk</div>
              </div>

              {/* Bar Chart */}
              <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden">
                <div 
                  className={`absolute bottom-0 left-0 right-0 ${item.color} transition-all duration-1000 rounded-t-lg`}
                  style={{ 
                    height: animateChart ? item.height : '0%',
                    transitionDelay: `${index * 200}ms`
                  }}
                >
                  <div className="absolute top-2 inset-x-0 text-center">
                    <span className="text-white text-sm">{item.value}%</span>
                  </div>
                </div>

                {/* Baseline markers */}
                <div className="absolute bottom-1/4 left-0 right-0 border-t border-dashed border-gray-300"></div>
                <div className="absolute bottom-2/4 left-0 right-0 border-t border-dashed border-gray-300"></div>
                <div className="absolute bottom-3/4 left-0 right-0 border-t border-dashed border-gray-300"></div>
              </div>

              {/* Direction Arrow */}
              {index < trendData.length - 1 && (
                <div className="absolute top-24 -right-4 z-10">
                  <div className="w-8 h-8 bg-white border-2 border-red-500 rounded-full flex items-center justify-center shadow-lg">
                    <TrendingUp className="w-4 h-4 text-red-600" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Trend Analysis */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Change Analysis */}
          <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm text-red-900">24-Hour Change</h3>
              <div className="flex items-center gap-1 text-red-700">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">+27%</span>
              </div>
            </div>
            <p className="text-xs text-red-800">
              Risk level increased significantly from moderate to high in past 24 hours
            </p>
          </div>

          {/* Projection */}
          <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm text-amber-900">48-Hour Projection</h3>
              <div className="flex items-center gap-1 text-amber-700">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">Critical</span>
              </div>
            </div>
            <p className="text-xs text-amber-800">
              Without intervention, risk projected to reach critical threshold within 48 hours
            </p>
          </div>
        </div>

        {/* Trend Drivers */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
          <h3 className="text-sm text-blue-900 mb-3">Risk Increase Drivers</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-white rounded border border-blue-200">
              <div className="text-xs text-gray-600 mb-1">Weather Conditions</div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-red-600" />
                <span className="text-sm text-gray-900">High Humidity (82%)</span>
              </div>
            </div>
            <div className="p-3 bg-white rounded border border-blue-200">
              <div className="text-xs text-gray-600 mb-1">Disease Reports</div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-red-600" />
                <span className="text-sm text-gray-900">+12 New Cases</span>
              </div>
            </div>
            <div className="p-3 bg-white rounded border border-blue-200">
              <div className="text-xs text-gray-600 mb-1">Spread Pattern</div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-red-600" />
                <span className="text-sm text-gray-900">Rapid (3 villages)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Officer Guidance */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm text-blue-900 mb-1">Officer Guidance: Understanding Risk Direction</h4>
              <p className="text-xs text-blue-900 leading-relaxed">
                <strong>Trend shows direction of risk change, not exact prediction.</strong> The upward trend indicates 
                the situation is worsening and requires urgent attention. This helps officers decide on action urgency 
                and avoid delayed responses. Projections are indicative and based on current conditions - early 
                intervention can alter the trajectory significantly.
              </p>
            </div>
          </div>
        </div>

        {/* Action Recommendation */}
        <div className="mt-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm text-red-900 mb-1">Urgency Assessment: Immediate Action Recommended</h4>
              <p className="text-xs text-red-800 mb-3">
                Based on the accelerating risk trend, containment action should be initiated within the next 24 hours 
                to prevent progression to critical levels. Delayed response may result in significantly larger 
                containment zones and economic impact.
              </p>
              <div className="flex gap-2">
                <div className="px-3 py-1.5 bg-white rounded text-xs text-red-900 border border-red-300">
                  Priority: High
                </div>
                <div className="px-3 py-1.5 bg-white rounded text-xs text-red-900 border border-red-300">
                  Timeline: 24 hours
                </div>
                <div className="px-3 py-1.5 bg-white rounded text-xs text-red-900 border border-red-300">
                  Risk: Escalating
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

