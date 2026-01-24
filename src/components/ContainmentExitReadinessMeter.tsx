import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Info, TrendingUp, TrendingDown, Activity, Clock, Shield, X, RefreshCw } from 'lucide-react';

interface ExitReadinessData {
  exitScore: number;
  status: 'Unsafe' | 'Partial Exit Possible' | 'Safe Exit Recommended';
  expectedDays: string;
  breakdown: {
    spread: 'increasing' | 'stable' | 'decreasing';
    imageHealth: 'high' | 'moderate' | 'low';
    routes: 'safe' | 'caution' | 'unsafe';
    confidence: 'high' | 'moderate' | 'low';
  };
  recommendation: string;
  factors: {
    spreadReduction: number;
    reportConfidence: number;
    imageHealthScore: number;
    routeSafetyIndex: number;
    containmentDuration: number;
  };
  diseaseSpecific?: {
    disease: string;
    severity: string;
    recoveryTime: number;
    spreadRate: number;
    daysSinceContainment: number;
  };
}

interface ContainmentExitReadinessMeterProps {
  containmentData?: any;
  onExitReadinessUpdate?: (data: ExitReadinessData) => void;
}

const ContainmentExitReadinessMeter: React.FC<ContainmentExitReadinessMeterProps> = ({
  containmentData,
  onExitReadinessUpdate
}) => {
  const [readinessData, setReadinessData] = useState<ExitReadinessData | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Simulate backend calculation with problem-specific logic
  const calculateExitReadiness = async (data: any): Promise<ExitReadinessData> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Problem-specific calculation logic based on disease type and severity
    const getDiseaseSpecificFactors = (disease: string, severity: string) => {
      const diseaseProfiles: Record<string, any> = {
        'Late Blight (Potato)': {
          spreadRate: severity === 'Critical' ? 0.15 : severity === 'High' ? 0.10 : 0.05,
          recoveryTime: severity === 'Critical' ? 21 : severity === 'High' ? 14 : 10,
          imageDetectionAccuracy: 0.85,
          routeImpact: 0.7,
          containmentDuration: severity === 'Critical' ? 0.6 : 0.8
        },
        'Powdery Mildew (Grape)': {
          spreadRate: severity === 'Critical' ? 0.12 : severity === 'High' ? 0.08 : 0.04,
          recoveryTime: severity === 'Critical' ? 18 : severity === 'High' ? 12 : 8,
          imageDetectionAccuracy: 0.90,
          routeImpact: 0.5,
          containmentDuration: severity === 'Critical' ? 0.7 : 0.9
        },
        'Bacterial Wilt (Tomato)': {
          spreadRate: severity === 'Critical' ? 0.20 : severity === 'High' ? 0.15 : 0.08,
          recoveryTime: severity === 'Critical' ? 28 : severity === 'High' ? 21 : 14,
          imageDetectionAccuracy: 0.75,
          routeImpact: 0.8,
          containmentDuration: severity === 'Critical' ? 0.5 : 0.7
        },
        'Yellow Rust (Wheat)': {
          spreadRate: severity === 'Critical' ? 0.18 : severity === 'High' ? 0.12 : 0.06,
          recoveryTime: severity === 'Critical' ? 25 : severity === 'High' ? 18 : 12,
          imageDetectionAccuracy: 0.88,
          routeImpact: 0.6,
          containmentDuration: severity === 'Critical' ? 0.6 : 0.8
        },
        'Stem Rot (Paddy)': {
          spreadRate: severity === 'Critical' ? 0.14 : severity === 'High' ? 0.09 : 0.05,
          recoveryTime: severity === 'Critical' ? 20 : severity === 'High' ? 15 : 10,
          imageDetectionAccuracy: 0.82,
          routeImpact: 0.7,
          containmentDuration: severity === 'Critical' ? 0.7 : 0.9
        }
      };

      return diseaseProfiles[disease] || {
        spreadRate: 0.08,
        recoveryTime: 14,
        imageDetectionAccuracy: 0.80,
        routeImpact: 0.6,
        containmentDuration: 0.8
      };
    };

    const profile = getDiseaseSpecificFactors(data?.diseaseType || 'Late Blight (Potato)', data?.severity || 'Medium');
    
    // Calculate case-specific factors
    const daysSinceContainment = Math.floor(Math.random() * 14) + 1;
    const newCases24h = Math.floor(Math.random() * 10);
    const newCases7d = Math.floor(Math.random() * 50) + 10;
    
    // Problem-specific calculations
    const mockFactors = {
      spreadReduction: Math.max(0, Math.min(100, 
        ((newCases7d / 7 - newCases24h) / (newCases7d / 7)) * 100 * (1 - profile.spreadRate)
      )),
      reportConfidence: Math.min(100, 
        (data?.confidence || 75) * profile.imageDetectionAccuracy + Math.random() * 10
      ),
      imageHealthScore: Math.min(100, 
        (100 - profile.spreadRate * 100) + Math.random() * 20
      ),
      routeSafetyIndex: Math.min(100, 
        (100 - profile.routeImpact * 100) + Math.random() * 15
      ),
      containmentDuration: Math.min(100, 
        (daysSinceContainment / profile.recoveryTime) * 100 * profile.containmentDuration
      )
    };

    // Calculate weighted exit score
    const exitScore = 
      (mockFactors.spreadReduction * 0.30) +
      (mockFactors.reportConfidence * 0.25) +
      (mockFactors.imageHealthScore * 0.20) +
      (mockFactors.routeSafetyIndex * 0.15) +
      (mockFactors.containmentDuration * 0.10);

    // Determine status with disease-specific thresholds
    let status: 'Unsafe' | 'Partial Exit Possible' | 'Safe Exit Recommended';
    let expectedDays: string;
    let recommendation: string;

    // Disease-specific threshold adjustments
    const criticalDiseases = ['Bacterial Wilt (Tomato)', 'Late Blight (Potato)'];
    const isCriticalDisease = criticalDiseases.includes(data?.diseaseType || '');
    const thresholdMultiplier = isCriticalDisease ? 0.8 : 1.0;

    if (exitScore < (40 * thresholdMultiplier)) {
      status = 'Unsafe';
      expectedDays = `${Math.ceil(profile.recoveryTime * 1.5)}+`;
      recommendation = `Maintain strict containment for ${data?.diseaseType}. High transmission risk detected. Reassess after 72 hours.`;
    } else if (exitScore < (70 * thresholdMultiplier)) {
      status = 'Partial Exit Possible';
      expectedDays = `${Math.ceil(profile.recoveryTime * 0.6)}-${Math.ceil(profile.recoveryTime * 0.8)}`;
      recommendation = `Allow partial reopening of outer buffer zones for ${data?.diseaseType}. Maintain core containment for ${Math.ceil(profile.recoveryTime * 0.3)} more days.`;
    } else {
      status = 'Safe Exit Recommended';
      expectedDays = `${Math.ceil(profile.recoveryTime * 0.2)}-${Math.ceil(profile.recoveryTime * 0.4)}`;
      recommendation = `Safe to gradually lift containment restrictions for ${data?.diseaseType}. Monitor for ${Math.ceil(profile.recoveryTime * 0.2)} days post-exit.`;
    }

    // Determine breakdown with disease-specific logic
    const breakdown = {
      spread: exitScore > (70 * thresholdMultiplier) ? 'decreasing' : 
              exitScore > (40 * thresholdMultiplier) ? 'stable' : 'increasing',
      imageHealth: mockFactors.imageHealthScore > 80 ? 'high' : 
                  mockFactors.imageHealthScore > 60 ? 'moderate' : 'low',
      routes: mockFactors.routeSafetyIndex > 80 ? 'safe' : 
              mockFactors.routeSafetyIndex > 60 ? 'caution' : 'unsafe',
      confidence: mockFactors.reportConfidence > 80 ? 'high' : 
                 mockFactors.reportConfidence > 60 ? 'moderate' : 'low'
    };

    return {
      exitScore: Math.round(exitScore),
      status,
      expectedDays,
      breakdown,
      recommendation,
      factors: mockFactors,
      diseaseSpecific: {
        disease: data?.diseaseType || 'Unknown',
        severity: data?.severity || 'Medium',
        recoveryTime: profile.recoveryTime,
        spreadRate: profile.spreadRate,
        daysSinceContainment
      }
    };
  };

  useEffect(() => {
    const updateReadiness = async () => {
      setIsCalculating(true);
      try {
        const data = await calculateExitReadiness(containmentData);
        setReadinessData(data);
        onExitReadinessUpdate?.(data);
      } catch (error) {
        console.error('Error calculating exit readiness:', error);
      } finally {
        setIsCalculating(false);
      }
    };

    updateReadiness();
  }, [containmentData]);

  const getScoreColor = (score: number) => {
    if (score < 40) return 'red';
    if (score < 70) return 'yellow';
    return 'green';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Unsafe':
        return <X className="w-5 h-5 text-red-600" />;
      case 'Partial Exit Possible':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'Safe Exit Recommended':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  const getFactorStatus = (factor: string, value: number) => {
    if (value >= 80) return { icon: '✅', color: 'text-green-600', text: 'Good' };
    if (value >= 60) return { icon: '⚠️', color: 'text-yellow-600', text: 'Moderate' };
    return { icon: '❌', color: 'text-red-600', text: 'Poor' };
  };

  if (isCalculating) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-3" />
          <span className="text-gray-700">Calculating containment exit readiness...</span>
        </div>
      </div>
    );
  }

  if (!readinessData) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center py-8 text-gray-500">
          Unable to calculate exit readiness at this time.
        </div>
      </div>
    );
  }

  const scoreColor = getScoreColor(readinessData.exitScore);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Containment Exit Readiness Meter</h3>
            <p className="text-sm text-gray-600">
              {readinessData.diseaseSpecific?.disease} - {readinessData.diseaseSpecific?.severity} Severity
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowTooltip(!showTooltip)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="View calculation details"
        >
          <Info className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Disease-Specific Information */}
      {readinessData.diseaseSpecific && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <h4 className="text-sm font-semibold text-blue-900">Problem-Specific Analysis</h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-gray-600">Recovery Time:</span>
              <span className="ml-1 font-medium text-blue-800">{readinessData.diseaseSpecific.recoveryTime} days</span>
            </div>
            <div>
              <span className="text-gray-600">Spread Rate:</span>
              <span className="ml-1 font-medium text-blue-800">{(readinessData.diseaseSpecific.spreadRate * 100).toFixed(1)}%</span>
            </div>
            <div>
              <span className="text-gray-600">Days Contained:</span>
              <span className="ml-1 font-medium text-blue-800">{readinessData.diseaseSpecific.daysSinceContainment}</span>
            </div>
            <div>
              <span className="text-gray-600">Risk Level:</span>
              <span className="ml-1 font-medium text-blue-800">
                {readinessData.diseaseSpecific.severity === 'Critical' ? 'High' : 
                 readinessData.diseaseSpecific.severity === 'High' ? 'Moderate' : 'Low'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Score Display */}
      <div className="text-center mb-8">
        <div className="mb-4">
          <div className={`text-6xl font-bold mb-2 ${
            scoreColor === 'green' ? 'text-green-600' : 
            scoreColor === 'yellow' ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {readinessData.exitScore}%
          </div>
          <div className="text-lg text-gray-600 mb-2">Containment Exit Readiness</div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
          <div 
            className={`h-4 rounded-full transition-all duration-1000 ease-out ${
              scoreColor === 'green' ? 'bg-green-500' : 
              scoreColor === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${readinessData.exitScore}%` }}
          />
        </div>

        {/* Status */}
        <div className="flex items-center justify-center gap-2 mb-2">
          {getStatusIcon(readinessData.status)}
          <span className={`text-lg font-semibold ${
            scoreColor === 'green' ? 'text-green-700' : 
            scoreColor === 'yellow' ? 'text-yellow-700' : 'text-red-700'
          }`}>
            {readinessData.status}
          </span>
        </div>

        <div className="text-sm text-gray-600">
          Expected Safe Exit: <span className="font-semibold">{readinessData.expectedDays} Days</span>
        </div>
      </div>

      {/* Explainable Breakdown */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">📊 Exit Readiness Breakdown</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-700">Disease Spread Trend</span>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${
                readinessData.breakdown.spread === 'decreasing' ? 'text-green-600' :
                readinessData.breakdown.spread === 'stable' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {readinessData.breakdown.spread === 'decreasing' ? '✅ Decreasing' :
                 readinessData.breakdown.spread === 'stable' ? '⚠️ Stable' : '❌ Increasing'}
              </span>
              <span className="text-xs text-gray-500">({Math.round(readinessData.factors.spreadReduction)}%)</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-700">New Case Frequency</span>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${
                readinessData.breakdown.confidence === 'high' ? 'text-green-600' :
                readinessData.breakdown.confidence === 'moderate' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {readinessData.breakdown.confidence === 'high' ? '✅ Low' :
                 readinessData.breakdown.confidence === 'moderate' ? '⚠️ Moderate' : '❌ High'}
              </span>
              <span className="text-xs text-gray-500">({Math.round(readinessData.factors.reportConfidence)}%)</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-700">Image Infection Level</span>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${
                readinessData.breakdown.imageHealth === 'high' ? 'text-green-600' :
                readinessData.breakdown.imageHealth === 'moderate' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {readinessData.breakdown.imageHealth === 'high' ? '✅ Low' :
                 readinessData.breakdown.imageHealth === 'moderate' ? '⚠️ Moderate' : '❌ High'}
              </span>
              <span className="text-xs text-gray-500">({Math.round(readinessData.factors.imageHealthScore)}%)</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-700">Supply Routes Safety</span>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${
                readinessData.breakdown.routes === 'safe' ? 'text-green-600' :
                readinessData.breakdown.routes === 'caution' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {readinessData.breakdown.routes === 'safe' ? '✅ Stable' :
                 readinessData.breakdown.routes === 'caution' ? '⚠️ Caution' : '❌ Unsafe'}
              </span>
              <span className="text-xs text-gray-500">({Math.round(readinessData.factors.routeSafetyIndex)}%)</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-700">Time Since Lock</span>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">6 Days</span>
              <span className="text-xs text-gray-500">({Math.round(readinessData.factors.containmentDuration)}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Government Recommendation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mb-1">Official Recommendation</h4>
            <p className="text-sm text-blue-800">{readinessData.recommendation}</p>
            <p className="text-xs text-blue-700 mt-2">
              Final authority remains with Department of Agriculture. Exit subject to district-level approval.
            </p>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute z-50 bg-gray-900 text-white p-3 rounded-lg text-sm max-w-xs">
          <div className="font-semibold mb-2">Exit Score Calculation:</div>
          <div className="space-y-1 text-xs">
            <div>• Spread Reduction (30%)</div>
            <div>• Report Confidence (25%)</div>
            <div>• Image Health Score (20%)</div>
            <div>• Route Safety Index (15%)</div>
            <div>• Containment Duration (10%)</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContainmentExitReadinessMeter;
