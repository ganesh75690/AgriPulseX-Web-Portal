import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, AlertTriangle, Info } from 'lucide-react';

export default function ConfidenceTrust() {
  const [fadeIn, setFadeIn] = useState(false);
  const [currentConfidence] = useState(87); // Current scenario confidence

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 600);
  }, []);

  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 80) return { level: 'High', color: 'green', status: 'safe' };
    if (confidence >= 60) return { level: 'Medium', color: 'amber', status: 'caution' };
    return { level: 'Low', color: 'red', status: 'warning' };
  };

  const confidenceData = getConfidenceLevel(currentConfidence);

  return (
    <div className={`bg-white rounded-lg border border-gray-200 transition-opacity duration-700 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-gray-900 flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#2f9d58]" />
          Confidence & Trust
        </h2>
        <p className="text-xs text-gray-600 mt-1">
          Decision confidence level and safety thresholds
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Confidence Gauge */}
        <div className="text-center">
          <div className="inline-block relative">
            {/* Circular Progress */}
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke={confidenceData.color === 'green' ? '#16a34a' : confidenceData.color === 'amber' ? '#d97706' : '#dc2626'}
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(currentConfidence / 100) * 351.86} 351.86`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-3xl text-gray-900">{currentConfidence}%</div>
              <div className="text-xs text-gray-600">Confidence</div>
            </div>
          </div>
        </div>

        {/* Confidence Level Badge */}
        <div className={`p-4 rounded-lg border-2 ${
          confidenceData.color === 'green' 
            ? 'bg-green-50 border-green-200' 
            : confidenceData.color === 'amber'
            ? 'bg-amber-50 border-amber-200'
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-700">Confidence Level</span>
            {confidenceData.status === 'safe' && <CheckCircle className="w-5 h-5 text-green-600" />}
            {confidenceData.status === 'caution' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
            {confidenceData.status === 'warning' && <AlertTriangle className="w-5 h-5 text-red-600" />}
          </div>
          <div className={`text-2xl mb-1 ${
            confidenceData.color === 'green' 
              ? 'text-green-900' 
              : confidenceData.color === 'amber'
              ? 'text-amber-900'
              : 'text-red-900'
          }`}>
            {confidenceData.level}
          </div>
          <div className={`text-xs ${
            confidenceData.color === 'green' 
              ? 'text-green-700' 
              : confidenceData.color === 'amber'
              ? 'text-amber-700'
              : 'text-red-700'
          }`}>
            Data quality: Verified field inputs
          </div>
        </div>

        {/* Safety Threshold */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2 mb-2">
            <Shield className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm text-blue-900 mb-1">Safety Threshold Policy</h4>
              <p className="text-xs text-blue-800 leading-relaxed">
                Containment is recommended only when confidence exceeds the safety threshold of 75%. 
                Current confidence ({currentConfidence}%) {currentConfidence >= 75 ? 'meets' : 'does not meet'} this criterion.
              </p>
            </div>
          </div>
          
          {/* Threshold Bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>0%</span>
              <span className="text-blue-700">Threshold: 75%</span>
              <span>100%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full relative overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000"
                style={{ width: `${currentConfidence}%` }}
              ></div>
              <div className="absolute top-0 left-3/4 w-0.5 h-full bg-blue-900"></div>
            </div>
          </div>
        </div>

        {/* Confidence Components */}
        <div>
          <h4 className="text-sm text-gray-900 mb-3">Confidence Components</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded">
              <span className="text-gray-700">Field Data Quality</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-600" style={{ width: '92%' }}></div>
                </div>
                <span className="text-gray-900 w-8 text-right">92%</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded">
              <span className="text-gray-700">Weather Data</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-600" style={{ width: '88%' }}></div>
                </div>
                <span className="text-gray-900 w-8 text-right">88%</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded">
              <span className="text-gray-700">Historical Pattern</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-600" style={{ width: '85%' }}></div>
                </div>
                <span className="text-gray-900 w-8 text-right">85%</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded">
              <span className="text-gray-700">Image Evidence</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-600" style={{ width: '68%' }}></div>
                </div>
                <span className="text-gray-900 w-8 text-right">68%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decision Guidance */}
        {currentConfidence >= 75 ? (
          <div className="p-3 bg-green-50 border border-green-200 rounded flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-green-900">
                <strong>Recommendation Status:</strong> Confidence level supports proceeding with containment decision. 
                Officer review and approval required before implementation.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-amber-900">
                <strong>Caution:</strong> Confidence below safety threshold. Additional field verification recommended 
                before making containment decision. Collect more data to improve confidence.
              </p>
            </div>
          </div>
        )}

        {/* Trust Framework */}
        <div className="p-3 bg-gray-50 border border-gray-200 rounded">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs text-gray-900 mb-1">Trust Framework</h4>
              <p className="text-xs text-gray-700 leading-relaxed">
                This system prevents over-action when data quality is insufficient. High confidence requires 
                multiple verified data sources. Officers retain authority to override recommendations based on 
                ground knowledge and local context.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

