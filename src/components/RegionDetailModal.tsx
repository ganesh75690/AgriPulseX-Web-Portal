import { X, MapPin, AlertTriangle, TrendingUp, Calendar, Shield, Thermometer, Wind, Droplets, Sun, Users } from 'lucide-react';

interface RegionDetailModalProps {
  region: {
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
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function RegionDetailModal({ region, isOpen, onClose }: RegionDetailModalProps) {
  if (!isOpen || !region) return null;

  const getRiskColor = (status: string) => {
    switch (status) {
      case 'Critical': return 'text-red-700 bg-red-50 border-red-200';
      case 'Elevated': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Monitoring': return 'text-blue-700 bg-blue-50 border-blue-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getSpreadColor = (potential: string) => {
    switch (potential) {
      case 'High': return 'text-red-700 bg-red-50 border-red-200';
      case 'Medium': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Low': return 'text-green-700 bg-green-50 border-green-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-700 bg-green-50 border-green-200';
    if (confidence >= 80) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-red-700 bg-red-50 border-red-200';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[60vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-3 rounded-t-xl relative">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">{region.regionName}</h2>
              <p className="text-blue-100 text-xs">{region.regionType} • Priority: #{region.priorityRank}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 bg-red-600 hover:bg-red-700 rounded-lg flex items-center justify-center transition-colors"
            aria-label="Close modal"
            title="Close modal"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-2 space-y-2">
          {/* Risk Status Overview */}
          <div className="grid grid-cols-3 gap-1">
            <div className={`p-1 rounded border ${getRiskColor(region.riskStatus)}`}>
              <div className="flex items-center gap-1 mb-1">
                <AlertTriangle className="w-2 h-2" />
                <span className="font-semibold text-xs">Risk</span>
              </div>
              <div className="text-xs font-bold">{region.riskStatus}</div>
            </div>
            
            <div className={`p-1 rounded border ${getSpreadColor(region.spreadPotential)}`}>
              <div className="flex items-center gap-1 mb-1">
                <TrendingUp className="w-2 h-2" />
                <span className="font-semibold text-xs">Spread</span>
              </div>
              <div className="text-xs font-bold">{region.spreadPotential}</div>
            </div>
            
            <div className={`p-1 rounded border ${getConfidenceColor(region.confidence)}`}>
              <div className="flex items-center gap-1 mb-1">
                <Shield className="w-2 h-2" />
                <span className="font-semibold text-xs">AI</span>
              </div>
              <div className="text-xs font-bold">{region.confidence}%</div>
            </div>
          </div>

          {/* Disease Information */}
          <div className="bg-gray-50 rounded p-2 border border-gray-200">
            <h3 className="text-sm font-bold text-gray-900 mb-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-red-600" />
              Disease Analysis
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className="font-semibold text-gray-700">Disease:</div>
                <div className="text-gray-900">{region.detectedDisease}</div>
              </div>
              <div>
                <div className="font-semibold text-gray-700">Action:</div>
                <div className="text-gray-900">{region.recommendedAction}</div>
              </div>
              <div>
                <div className="font-semibold text-gray-700">Area:</div>
                <div className="text-gray-900">{region.affectedArea}</div>
              </div>
              <div>
                <div className="font-semibold text-gray-700">Impact:</div>
                <div className="text-gray-900">{region.economicImpact}</div>
              </div>
            </div>
          </div>

          {/* Environmental Conditions */}
          <div className="bg-blue-50 rounded p-2 border border-blue-200">
            <h3 className="text-sm font-bold text-gray-900 mb-1 flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-blue-600" />
              Environmental
            </h3>
            <div className="grid grid-cols-4 gap-1 text-xs">
              <div className="text-center p-1 bg-white rounded border border-blue-200">
                <Thermometer className="w-3 h-3 text-blue-600 mx-auto mb-1" />
                <div className="font-semibold">Temp</div>
                <div>28-32°C</div>
              </div>
              <div className="text-center p-1 bg-white rounded border border-blue-200">
                <Droplets className="w-3 h-3 text-blue-600 mx-auto mb-1" />
                <div className="font-semibold">Humidity</div>
                <div>75-85%</div>
              </div>
              <div className="text-center p-1 bg-white rounded border border-blue-200">
                <Wind className="w-3 h-3 text-blue-600 mx-auto mb-1" />
                <div className="font-semibold">Wind</div>
                <div>5-10 km/h</div>
              </div>
              <div className="text-center p-1 bg-white rounded border border-blue-200">
                <Sun className="w-3 h-3 text-blue-600 mx-auto mb-1" />
                <div className="font-semibold">Rain</div>
                <div>45mm/7d</div>
              </div>
            </div>
          </div>

          {/* Containment Strategy */}
          <div className="bg-amber-50 rounded p-2 border border-amber-200">
            <h3 className="text-sm font-bold text-gray-900 mb-1 flex items-center gap-1">
              <Shield className="w-3 h-3 text-amber-600" />
              Strategy
            </h3>
            <div className="space-y-1 text-xs">
              <div className="flex items-start gap-1">
                <div className="w-4 h-4 bg-amber-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                <div>
                  <div className="font-semibold">Isolation</div>
                  <div className="text-gray-600">Quarantine farms within 5km radius</div>
                </div>
              </div>
              <div className="flex items-start gap-1">
                <div className="w-4 h-4 bg-amber-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                <div>
                  <div className="font-semibold">Treatment</div>
                  <div className="text-gray-600">Apply approved fungicides/pesticides</div>
                </div>
              </div>
              <div className="flex items-start gap-1">
                <div className="w-4 h-4 bg-amber-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                <div>
                  <div className="font-semibold">Awareness</div>
                  <div className="text-gray-600">Conduct farmer training sessions</div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-green-50 rounded p-2 border border-green-200">
            <h3 className="text-sm font-bold text-gray-900 mb-1 flex items-center gap-1">
              <Users className="w-3 h-3 text-green-600" />
              Contact
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className="font-semibold">Officer:</div>
                <div>Dr. Ramesh Kumar</div>
                <div>+91-98765-43210</div>
                <div>ramesh.kumar@agri.gov.in</div>
              </div>
              <div>
                <div className="font-semibold">Emergency:</div>
                <div>24/7: 1800-123-4567</div>
                <div>Response: 2-4 hours</div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-purple-50 rounded p-2 border border-purple-200">
            <h3 className="text-sm font-bold text-gray-900 mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-purple-600" />
              Timeline
            </h3>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <div>
                  <div className="font-semibold">Detection</div>
                  <div className="text-gray-600">AI identified • {region.lastUpdated}</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <div>
                  <div className="font-semibold">Verification</div>
                  <div className="text-gray-600">Officers confirmed • In progress</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <div>
                  <div className="font-semibold">Action</div>
                  <div className="text-gray-600">Containment measures • Pending</div>
                </div>
              </div>
            </div>
          </div>

          {/* Last Updated */}
          <div className="text-center text-xs text-gray-500 pt-2 border-t">
            <div className="flex items-center justify-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Updated: {region.lastUpdated}</span>
            </div>
            <div className="text-xs">Data: Satellite • Sensors • Reports</div>
          </div>
        </div>
      </div>
    </div>
  );
}
