import React from 'react';
import { User, Users, AlertTriangle, CheckCircle, TrendingUp, ArrowRight } from 'lucide-react';

interface ComparativeData {
  individual_impact: {
    risk_level: string;
    affected_area: string;
    recommended_action: string;
    policy_trigger: boolean;
  };
  community_impact: {
    risk_level: string;
    affected_area: string;
    recommended_action: string;
    policy_trigger: boolean;
  };
}

interface ComparativeViewProps {
  comparativeData: ComparativeData;
  assessmentScope: 'single-farmer' | 'village-cluster';
}

const ComparativeView: React.FC<ComparativeViewProps> = ({ comparativeData, assessmentScope }) => {
  const getRiskLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-700 border-red-300';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'low': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const metrics = [
    {
      label: 'Risk Level',
      individual: comparativeData.individual_impact.risk_level,
      community: comparativeData.community_impact.risk_level,
      icon: AlertTriangle
    },
    {
      label: 'Affected Area',
      individual: comparativeData.individual_impact.affected_area,
      community: comparativeData.community_impact.affected_area,
      icon: TrendingUp
    },
    {
      label: 'Recommended Action',
      individual: comparativeData.individual_impact.recommended_action,
      community: comparativeData.community_impact.recommended_action,
      icon: CheckCircle
    },
    {
      label: 'Policy Trigger',
      individual: comparativeData.individual_impact.policy_trigger ? 'Yes' : 'No',
      community: comparativeData.community_impact.policy_trigger ? 'Yes' : 'No',
      icon: ArrowRight
    }
  ];

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b-2 border-indigo-200">
        <h3 className="text-gray-900 flex items-center gap-2">
          <ArrowRight className="w-5 h-5 text-indigo-600" />
          Individual vs Community Impact Comparison
        </h3>
        <p className="text-xs text-indigo-700 mt-1">
          Comparative analysis of individual farmer impact versus village-level consequences
        </p>
      </div>
      
      <div className="p-6">
        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 text-gray-900 font-semibold">Metric</th>
                <th className="text-center py-3 px-4 text-gray-900 font-semibold">
                  <div className="flex items-center justify-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    Individual Farmer
                  </div>
                </th>
                <th className="text-center py-3 px-4 text-gray-900 font-semibold">
                  <div className="flex items-center justify-center gap-2">
                    <Users className="w-4 h-4 text-purple-600" />
                    Village Community
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-gray-600" />
                        <span className="font-medium text-gray-900">{metric.label}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      {metric.label === 'Risk Level' ? (
                        <span className={`px-3 py-1 rounded-full text-sm ${getRiskLevelColor(metric.individual)}`}>
                          {metric.individual}
                        </span>
                      ) : metric.label === 'Policy Trigger' ? (
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          metric.individual === 'Yes' 
                            ? 'bg-red-100 text-red-700 border border-red-300' 
                            : 'bg-green-100 text-green-700 border border-green-300'
                        }`}>
                          {metric.individual}
                        </span>
                      ) : (
                        <span className="text-gray-900">{metric.individual}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {metric.label === 'Risk Level' ? (
                        <span className={`px-3 py-1 rounded-full text-sm ${getRiskLevelColor(metric.community)}`}>
                          {metric.community}
                        </span>
                      ) : metric.label === 'Policy Trigger' ? (
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          metric.community === 'Yes' 
                            ? 'bg-red-100 text-red-700 border border-red-300' 
                            : 'bg-green-100 text-green-700 border border-green-300'
                        }`}>
                          {metric.community}
                        </span>
                      ) : (
                        <span className="text-gray-900">{metric.community}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Key Insights */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl">
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Key Insights
          </h4>
          <div className="space-y-2 text-sm text-blue-900">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
              <p>
                <strong>Scale Effect:</strong> Village-level analysis reveals broader community impact that may not be visible from individual assessments alone.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
              <p>
                <strong>Policy Implications:</strong> {comparativeData.community_impact.policy_trigger ? 
                  'Community-level triggers require coordinated government intervention and resource allocation.' :
                  'Current situation can be managed at individual farmer level without broader policy intervention.'
                }
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
              <p>
                <strong>Resource Optimization:</strong> Comparative analysis enables efficient allocation of agricultural extension resources and containment measures.
              </p>
            </div>
          </div>
        </div>

        {/* Government Advisory */}
        <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-xl">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-green-900 mb-1">Ministry of Agriculture & Farmers Welfare</h4>
              <p className="text-sm text-green-900 leading-relaxed">
                This comparative analysis supports decentralized agricultural governance by providing both 
                individual farmer advisories and village-level coordination insights. AI assists officers in 
                decision-making; final authority remains with human agricultural officers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparativeView;
