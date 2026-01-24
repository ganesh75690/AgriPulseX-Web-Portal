import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Info, Users, Camera, MapPin } from 'lucide-react';

export interface ARIInputs {
  diseaseSeverityScore: number; // 0-1
  fieldReportConfidenceScore: number; // 0-1
  independentReportsCount: number; // number of reports from same village
  imageQualityScore: number; // 0-1
  villageClusteringStrength: number; // 0-1 (single farmer vs multiple farmers)
}

export interface ARIResult {
  level: 'HIGH' | 'MEDIUM' | 'LOW';
  score: number; // 0-100
  explanation: string;
  factors: {
    diseaseSeverity: { value: number; weight: number; contribution: number };
    reportConfidence: { value: number; weight: number; contribution: number };
    reportCount: { value: number; weight: number; contribution: number };
    imageQuality: { value: number; weight: number; contribution: number };
    clustering: { value: number; weight: number; contribution: number };
  };
  recommendation: string;
  governanceNotes: string;
  timestamp: string;
}

interface ActionReadinessIndicatorProps {
  inputs: ARIInputs;
  onResultChange?: (result: ARIResult) => void;
  showDetails?: boolean;
  compact?: boolean;
}

export default function ActionReadinessIndicator({ 
  inputs, 
  onResultChange, 
  showDetails = true, 
  compact = false 
}: ActionReadinessIndicatorProps) {
  const [result, setResult] = useState<ARIResult | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  // Calculate ARI using explainable rule-based logic
  const calculateARI = (data: ARIInputs): ARIResult => {
    // Weight assignment for explainable scoring
    const weights = {
      diseaseSeverity: 0.30, // 30% - Most critical factor
      reportConfidence: 0.25, // 25% - Data reliability
      reportCount: 0.20, // 20% - Independent verification
      imageQuality: 0.15, // 15% - Visual evidence quality
      clustering: 0.10 // 10% - Geographic clustering
    };

    // Calculate weighted contributions
    const factors = {
      diseaseSeverity: {
        value: data.diseaseSeverityScore,
        weight: weights.diseaseSeverity,
        contribution: data.diseaseSeverityScore * weights.diseaseSeverity * 100
      },
      reportConfidence: {
        value: data.fieldReportConfidenceScore,
        weight: weights.reportConfidence,
        contribution: data.fieldReportConfidenceScore * weights.reportConfidence * 100
      },
      reportCount: {
        value: Math.min(data.independentReportsCount / 3, 1), // Normalize to 0-1 (3+ reports = max)
        weight: weights.reportCount,
        contribution: Math.min(data.independentReportsCount / 3, 1) * weights.reportCount * 100
      },
      imageQuality: {
        value: data.imageQualityScore,
        weight: weights.imageQuality,
        contribution: data.imageQualityScore * weights.imageQuality * 100
      },
      clustering: {
        value: data.villageClusteringStrength,
        weight: weights.clustering,
        contribution: data.villageClusteringStrength * weights.clustering * 100
      }
    };

    // Calculate total score (0-100)
    const totalScore = Object.values(factors).reduce((sum, factor) => sum + factor.contribution, 0);

    // Determine readiness level using explainable rules
    let level: 'HIGH' | 'MEDIUM' | 'LOW';
    let explanation: string;
    let recommendation: string;
    let governanceNotes: string;

    // Rule-based decision logic (explainable to officers)
    if (data.diseaseSeverityScore >= 0.7 && 
        data.fieldReportConfidenceScore >= 0.7 && 
        data.independentReportsCount >= 2 && 
        data.villageClusteringStrength >= 0.6) {
      level = 'HIGH';
      explanation = `Strong evidence base: High severity disease (${(data.diseaseSeverityScore * 100).toFixed(0)}%) confirmed by multiple reliable reports (${data.independentReportsCount} independent reports) with clustering detected. Action readiness is optimal.`;
      recommendation = 'Immediate containment action recommended. All decision criteria met.';
      governanceNotes = 'Decision supported by multi-source verification and high confidence indicators. Audit trail complete.';
    } else if (data.diseaseSeverityScore >= 0.4 && 
               data.independentReportsCount >= 2 && 
               data.fieldReportConfidenceScore >= 0.5) {
      level = 'MEDIUM';
      explanation = `Moderate evidence base: Disease severity (${(data.diseaseSeverityScore * 100).toFixed(0)}%) with multiple reports (${data.independentReportsCount}) but some confidence gaps remain. Suitable for monitoring while gathering additional data.`;
      recommendation = 'Continue monitoring and seek additional confirmation. Consider preparatory measures.';
      governanceNotes = 'Decision requires additional verification. Current evidence sufficient for enhanced monitoring but not immediate action.';
    } else {
      level = 'LOW';
      explanation = `Insufficient evidence base: Limited severity indication (${(data.diseaseSeverityScore * 100).toFixed(0)}%) with inadequate report verification (${data.independentReportsCount} reports). Action not recommended at this time.`;
      recommendation = 'No action recommended. Continue standard monitoring and data collection.';
      governanceNotes = 'Insufficient evidence for containment decision. Risk of premature action outweighs potential benefits.';
    }

    return {
      level,
      score: Math.round(totalScore),
      explanation,
      factors,
      recommendation,
      governanceNotes,
      timestamp: new Date().toISOString()
    };
  };

  useEffect(() => {
    const ariResult = calculateARI(inputs);
    setResult(ariResult);
    if (onResultChange) {
      onResultChange(ariResult);
    }
  }, [
    inputs.diseaseSeverityScore,
    inputs.fieldReportConfidenceScore,
    inputs.independentReportsCount,
    inputs.imageQualityScore,
    inputs.villageClusteringStrength
  ]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'HIGH': return { bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-800', icon: '🟢' };
      case 'MEDIUM': return { bg: 'bg-amber-100', border: 'border-amber-300', text: 'text-amber-800', icon: '🟡' };
      case 'LOW': return { bg: 'bg-red-100', border: 'border-red-300', text: 'text-red-800', icon: '🔴' };
      default: return { bg: 'bg-gray-100', border: 'border-gray-300', text: 'text-gray-800', icon: '⚪' };
    }
  };

  if (!result) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
        <div className="animate-pulse">
          <div className="w-4 h-4 bg-gray-300 rounded-full mx-auto mb-2"></div>
          <div className="text-sm text-gray-500">Calculating readiness...</div>
        </div>
      </div>
    );
  }

  const colors = getLevelColor(result.level);

  if (compact) {
    return (
      <div className="relative">
        <div 
          className={`${colors.bg} ${colors.border} border rounded-lg p-3 cursor-pointer hover:shadow-md transition-all`}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{colors.icon}</span>
            <div className="flex-1">
              <div className={`text-sm font-semibold ${colors.text}`}>
                {result.level} Readiness
              </div>
              <div className="text-xs text-gray-600">
                Score: {result.score}/100
              </div>
            </div>
            <Info className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        {showTooltip && (
          <div className="absolute z-50 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 mt-2">
            <div className="text-sm">
              <div className="font-semibold mb-2">{result.level} Readiness - {result.score}/100</div>
              <div className="text-xs text-gray-600 mb-2">{result.explanation}</div>
              <div className="text-xs font-medium text-gray-700">{result.recommendation}</div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`${colors.bg} ${colors.border} border rounded-lg p-6`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{colors.icon}</span>
          <div>
            <h3 className={`text-lg font-semibold ${colors.text}`}>
              Action Readiness Indicator (ARI)
            </h3>
            <p className="text-sm text-gray-600">
              Evidence-based decision readiness assessment
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${colors.text}`}>
            {result.score}
          </div>
          <div className="text-xs text-gray-600">Score (0-100)</div>
        </div>
      </div>

      {/* Readiness Level */}
      <div className={`${colors.bg} ${colors.border} border rounded-lg p-4 mb-4`}>
        <div className="flex items-center justify-between">
          <div className={`text-lg font-bold ${colors.text}`}>
            {result.level} READINESS
          </div>
          <div className={`text-sm ${colors.text}`}>
            {result.level === 'HIGH' ? '✅ Immediate action can be taken' :
             result.level === 'MEDIUM' ? '⏳ Continue monitoring, wait for confirmation' :
             '❌ Insufficient data, no action recommended'}
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Why this readiness level?</h4>
        <p className="text-sm text-gray-700 leading-relaxed">{result.explanation}</p>
      </div>

      {/* Recommendation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">Officer Recommendation</h4>
        <p className="text-sm text-blue-800">{result.recommendation}</p>
      </div>

      {/* Governance Notes */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Governance & Accountability</h4>
        <p className="text-sm text-gray-700">{result.governanceNotes}</p>
        <div className="text-xs text-gray-500 mt-2">
          Assessment timestamp: {new Date(result.timestamp).toLocaleString('en-IN')}
        </div>
      </div>

      {showDetails && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Scoring Breakdown (Explainable Logic)</h4>
          <div className="space-y-2">
            {Object.entries(result.factors).map(([key, factor]) => {
              const labels = {
                diseaseSeverity: 'Disease Severity',
                reportConfidence: 'Report Confidence',
                reportCount: 'Independent Reports',
                imageQuality: 'Image Quality',
                clustering: 'Village Clustering'
              };

              const icons = {
                diseaseSeverity: AlertTriangle,
                reportConfidence: CheckCircle,
                reportCount: Users,
                imageQuality: Camera,
                clustering: MapPin
              };

              const Icon = icons[key as keyof typeof icons];

              return (
                <div key={key} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-gray-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{labels[key as keyof typeof labels]}</div>
                      <div className="text-xs text-gray-600">
                        Value: {(factor.value * 100).toFixed(0)}% | Weight: {(factor.weight * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      +{factor.contribution.toFixed(1)} points
                    </div>
                    <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${factor.contribution}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
