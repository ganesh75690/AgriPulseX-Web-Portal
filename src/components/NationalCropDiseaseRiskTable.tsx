import { useState, useMemo } from 'react';
import { 
  AlertTriangle, 
  Shield, 
  Eye, 
  Info,
  ChevronUp,
  MapPin,
  Activity,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import RegionDetailModal from './RegionDetailModal';

interface RiskData {
  id: string;
  priorityRank: number;
  regionName: string;
  regionType: 'State' | 'District' | 'Village';
  riskStatus: 'Critical' | 'Elevated' | 'Monitoring';
  detectedDisease: string;
  spreadPotential: 'High' | 'Medium' | 'Low';
  recommendedAction: 'Immediate Containment' | 'Enhanced Monitoring' | 'Regular Surveillance';
  confidence: number;
  lastUpdated: string;
  affectedArea: string;
  economicImpact: string;
}

interface NationalCropDiseaseRiskTableProps {
  onRegionClick?: (region: RiskData) => void;
}

export default function NationalCropDiseaseRiskTable({ onRegionClick }: NationalCropDiseaseRiskTableProps) {
  const [viewMode, setViewMode] = useState<'State' | 'District' | 'Village'>('District');
  const [sortBy, setSortBy] = useState<'priority' | 'risk' | 'confidence'>('priority');
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<RiskData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data - in production, this would come from API
  const mockData: RiskData[] = [
    {
      id: '1',
      priorityRank: 1,
      regionName: 'Punjab - Amritsar District',
      regionType: 'District',
      riskStatus: 'Critical',
      detectedDisease: 'Late Blight (Potato)',
      spreadPotential: 'High',
      recommendedAction: 'Immediate Containment',
      confidence: 94,
      lastUpdated: '2 hours ago',
      affectedArea: '12,450 hectares',
      economicImpact: '₹45.2 Cr estimated loss'
    },
    {
      id: '2',
      priorityRank: 2,
      regionName: 'Maharashtra - Nashik District',
      regionType: 'District',
      riskStatus: 'Critical',
      detectedDisease: 'Powdery Mildew (Grape)',
      spreadPotential: 'High',
      recommendedAction: 'Immediate Containment',
      confidence: 89,
      lastUpdated: '4 hours ago',
      affectedArea: '8,320 hectares',
      economicImpact: '₹32.8 Cr estimated loss'
    },
    {
      id: '3',
      priorityRank: 3,
      regionName: 'Uttar Pradesh - Meerut District',
      regionType: 'District',
      riskStatus: 'Elevated',
      detectedDisease: 'Yellow Rust (Wheat)',
      spreadPotential: 'Medium',
      recommendedAction: 'Enhanced Monitoring',
      confidence: 87,
      lastUpdated: '6 hours ago',
      affectedArea: '15,670 hectares',
      economicImpact: '₹28.5 Cr potential loss'
    },
    {
      id: '4',
      priorityRank: 4,
      regionName: 'Karnataka - Bangalore Rural District',
      regionType: 'District',
      riskStatus: 'Elevated',
      detectedDisease: 'Bacterial Wilt (Tomato)',
      spreadPotential: 'Medium',
      recommendedAction: 'Enhanced Monitoring',
      confidence: 82,
      lastUpdated: '8 hours ago',
      affectedArea: '6,890 hectares',
      economicImpact: '₹18.3 Cr potential loss'
    },
    {
      id: '5',
      priorityRank: 5,
      regionName: 'West Bengal - Murshidabad District',
      regionType: 'District',
      riskStatus: 'Monitoring',
      detectedDisease: 'Leaf Spot (Rice)',
      spreadPotential: 'Low',
      recommendedAction: 'Regular Surveillance',
      confidence: 76,
      lastUpdated: '12 hours ago',
      affectedArea: '4,230 hectares',
      economicImpact: '₹8.7 Cr potential loss'
    },
    {
      id: '6',
      priorityRank: 6,
      regionName: 'Gujarat - Rajkot District',
      regionType: 'District',
      riskStatus: 'Monitoring',
      detectedDisease: 'Cotton Bollworm',
      spreadPotential: 'Low',
      recommendedAction: 'Regular Surveillance',
      confidence: 71,
      lastUpdated: '1 day ago',
      affectedArea: '9,450 hectares',
      economicImpact: '₹12.4 Cr potential loss'
    }
  ];

  const filteredData = useMemo(() => {
    return mockData.filter(item => {
      if (viewMode === 'State') return item.regionType === 'State';
      if (viewMode === 'District') return item.regionType === 'District';
      if (viewMode === 'Village') return item.regionType === 'Village';
      return true;
    });
  }, [viewMode]);

  const sortedData = useMemo(() => {
    const sorted = [...filteredData];
    switch (sortBy) {
      case 'priority':
        return sorted.sort((a, b) => a.priorityRank - b.priorityRank);
      case 'risk':
        const riskOrder = { 'Critical': 3, 'Elevated': 2, 'Monitoring': 1 };
        return sorted.sort((a, b) => riskOrder[b.riskStatus] - riskOrder[a.riskStatus]);
      case 'confidence':
        return sorted.sort((a, b) => b.confidence - a.confidence);
      default:
        return sorted;
    }
  }, [filteredData, sortBy]);

  const getRiskBadge = (status: string) => {
    switch (status) {
      case 'Critical':
        return {
          className: 'bg-red-100 text-red-800 border-2 border-red-300',
          icon: AlertTriangle,
          label: 'Critical Risk'
        };
      case 'Elevated':
        return {
          className: 'bg-amber-100 text-amber-800 border-2 border-amber-300',
          icon: AlertCircle,
          label: 'Elevated Risk'
        };
      case 'Monitoring':
        return {
          className: 'bg-blue-100 text-blue-800 border-2 border-blue-300',
          icon: Activity,
          label: 'Under Monitoring'
        };
      default:
        return {
          className: 'bg-gray-100 text-gray-800 border-2 border-gray-300',
          icon: Info,
          label: 'Normal'
        };
    }
  };

  const getSpreadBadge = (potential: string) => {
    switch (potential) {
      case 'High':
        return 'bg-red-50 text-red-700 border border-red-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'Low':
        return 'bg-green-50 text-green-700 border border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'Immediate Containment':
        return 'bg-red-50 text-red-800 border-2 border-red-300 font-semibold';
      case 'Enhanced Monitoring':
        return 'bg-amber-50 text-amber-800 border-2 border-amber-300 font-medium';
      case 'Regular Surveillance':
        return 'bg-blue-50 text-blue-800 border-2 border-blue-300';
      default:
        return 'bg-gray-50 text-gray-800 border-2 border-gray-300';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-700 bg-green-50 border-green-200';
    if (confidence >= 80) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-red-700 bg-red-50 border-red-200';
  };

  const handleViewDetails = (region: RiskData) => {
    setSelectedRegion(region);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRegion(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-gray-50">
      {/* Government Header */}
      <div className="bg-white border-b-4 border-blue-800 shadow-lg">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl flex items-center justify-center shadow-xl">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">National Crop Disease Risk Priority Table</h1>
                <p className="text-sm text-gray-700 mt-2 font-medium">
                  Ministry of Agriculture & Farmers Welfare • Department of Agriculture & Farmers Welfare
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Real-time disease monitoring and containment prioritization system for agricultural officers
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="px-4 py-3 bg-green-50 border-2 border-green-300 rounded-lg">
                <div className="text-xs text-green-700 font-semibold">System Status</div>
                <div className="text-sm text-green-900 mt-1 flex items-center gap-2 font-medium">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  Operational
                </div>
              </div>
              <div className="px-4 py-3 bg-blue-50 border-2 border-blue-300 rounded-lg">
                <div className="text-xs text-blue-700 font-semibold">Last Updated</div>
                <div className="text-sm text-blue-900 mt-1 font-medium">Live</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-white border-b-2 border-gray-200 shadow-sm">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* View Toggle */}
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1 border-2 border-gray-200">
                {(['State', 'District', 'Village'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      viewMode === mode
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {mode} View
                  </button>
                ))}
              </div>

              {/* Sort Options */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'priority' | 'risk' | 'confidence')}
                  className="px-3 py-2 border-2 border-gray-300 rounded-lg text-sm bg-white focus:border-blue-500 focus:outline-none"
                  aria-label="Sort table by"
                >
                  <option value="priority">Priority Rank</option>
                  <option value="risk">Risk Severity</option>
                  <option value="confidence">AI Confidence</option>
                </select>
              </div>
            </div>

            {/* Statistics */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{sortedData.filter(d => d.riskStatus === 'Critical').length}</div>
                <div className="text-xs text-gray-600">Critical</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">{sortedData.filter(d => d.riskStatus === 'Elevated').length}</div>
                <div className="text-xs text-gray-600">Elevated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{sortedData.filter(d => d.riskStatus === 'Monitoring').length}</div>
                <div className="text-xs text-gray-600">Monitoring</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="p-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-xl border-2 border-gray-300 shadow-lg overflow-hidden">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-200 px-6 py-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-700" />
              Regional Risk Prioritization
            </h2>
            <p className="text-sm text-gray-700 mt-1">
              Click on any region to view detailed analysis and containment recommendations
            </p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Priority Rank
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Region Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Risk Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Detected Disease
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Spread Potential
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Recommended Action
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                    AI Confidence
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedData.map((item) => {
                  const riskBadge = getRiskBadge(item.riskStatus);
                  const RiskIcon = riskBadge.icon;
                  const isTopPriority = item.priorityRank <= 3;

                  return (
                    <tr
                      key={item.id}
                      onClick={() => onRegionClick?.(item)}
                      className={`cursor-pointer transition-all duration-200 ${
                        hoveredRow === item.id ? 'bg-blue-50 shadow-lg scale-[1.01]' : 'hover:bg-gray-50'
                      } ${isTopPriority ? 'border-l-4 border-red-500' : ''}`}
                      onMouseEnter={() => setHoveredRow(item.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            isTopPriority 
                              ? 'bg-red-600 text-white shadow-lg' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {item.priorityRank}
                          </div>
                          {isTopPriority && (
                            <div className="ml-2">
                              <ChevronUp className="w-4 h-4 text-red-600" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-900">{item.regionName}</div>
                        <div className="text-xs text-gray-600">{item.regionType}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold ${riskBadge.className}`}>
                          <RiskIcon className="w-3 h-3" />
                          {riskBadge.label}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 font-medium">{item.detectedDisease}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getSpreadBadge(item.spreadPotential)}`}>
                          {item.spreadPotential}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-2 rounded-lg text-xs font-medium ${getActionBadge(item.recommendedAction)}`}>
                          {item.recommendedAction}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border text-xs font-medium ${getConfidenceColor(item.confidence)}`}>
                          <span>{item.confidence}%</span>
                          {item.confidence >= 90 && <CheckCircle className="w-3 h-3" />}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => handleViewDetails(item)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
                          aria-label={`View details for ${item.regionName}`}
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer with Summary */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 border-t-2 border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                <span className="font-semibold">Total Regions:</span> {sortedData.length} | 
                <span className="font-semibold ml-2">Require Immediate Action:</span> {sortedData.filter(d => d.riskStatus === 'Critical').length}
              </div>
              <div className="text-xs text-gray-600">
                Data updated in real-time from field monitoring stations • AI-assisted risk assessment
              </div>
            </div>
          </div>
        </div>

        {/* Explainable AI Section */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 rounded-xl shadow-md p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Info className="w-6 h-6 text-blue-700" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-blue-900 mb-2">AI Risk Assessment Methodology</h3>
              <div className="text-sm text-blue-900 space-y-2">
                <p>
                  <strong>Priority Ranking:</strong> Regions are ranked based on disease severity, spread potential, economic impact, and confidence level. 
                  Top 3 regions are automatically highlighted for immediate attention.
                </p>
                <p>
                  <strong>Risk Classification:</strong> Critical regions require immediate containment action within 24 hours. 
                  Elevated regions need enhanced monitoring and preparedness. Monitoring regions require regular surveillance.
                </p>
                <p>
                  <strong>Confidence Indicators:</strong> AI confidence scores (≥90% high, 80-89% medium, &lt;80% low) indicate 
                  reliability of detection based on image quality, weather conditions, and historical accuracy.
                </p>
              </div>
              <div className="flex gap-4 mt-4 text-xs">
                <div className="flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1.5 rounded-full">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span>Live Satellite Data</span>
                </div>
                <div className="flex items-center gap-1.5 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Field Sensor Network</span>
                </div>
                <div className="flex items-center gap-1.5 bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  <span>Machine Learning Models</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Region Detail Modal */}
      <RegionDetailModal
        region={selectedRegion}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
