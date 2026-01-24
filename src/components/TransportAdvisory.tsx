import { useState, useEffect } from 'react';
import { Truck, AlertTriangle, CheckCircle, Route, MapPin, Clock, Phone, Navigation, Info, X, MessageCircle, FileText, TrendingUp, Users, Package, Bell, RefreshCw, AlertCircle } from 'lucide-react';

interface TransportAdvisoryProps {
  employeeVillages: string[];
}

export default function TransportAdvisory({ employeeVillages }: TransportAdvisoryProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<number | null>(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Simulate real-time updates
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      setLastRefresh(new Date());
      // In real app, this would fetch fresh data
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Mock data based on employee's assigned villages
  const advisories = [
    {
      id: 1,
      from: employeeVillages[0] || 'Village A',
      to: 'Mandi Amritsar',
      status: 'restricted' as const,
      reason: 'Disease cluster detected within 2km radius',
      impact: 'High - 45 farmers affected',
      alternative: 'Use Mandi Ludhiana (18km extra)',
      estimatedDelay: '+2 hours 30 mins',
      lastUpdated: '30 mins ago',
      transportContacts: {
        coordinator: {
          name: 'Rajesh Kumar',
          phone: '+91-98765-43210',
          designation: 'Transport Coordinator',
          department: 'Agricultural Marketing Board'
        },
        drivers: [
          { name: 'Satpal Singh', phone: '+91-87654-32109', vehicle: 'Truck PB-45-6789', capacity: '12 tonnes' },
          { name: 'Gurmeet Singh', phone: '+91-76543-21098', vehicle: 'Truck PB-44-5678', capacity: '10 tonnes' }
        ],
        alternativeContacts: [
          { name: 'Ludhiana Mandi Office', phone: '+91-98765-12345', type: 'Alternative Mandi' },
          { name: 'District Transport Authority', phone: '+91-98765-67890', type: 'Emergency Contact' }
        ]
      },
      routeDetails: {
        distance: '12 km',
        normalTravelTime: '25 mins',
        currentTravelTime: '2 hours 55 mins',
        affectedVillages: ['Village A', 'Village B', 'Village C'],
        checkpoints: ['Village A Checkpoint', 'Highway 44 Crossing', 'Mandi Entry Point']
      }
    },
    {
      id: 2,
      from: employeeVillages[1] || 'Village B',
      to: 'Mandi Jalandhar',
      status: 'monitor' as const,
      reason: 'Monitoring due to nearby reports',
      impact: 'Medium - 12 farmers affected',
      alternative: 'Current route acceptable',
      estimatedDelay: '+15 mins',
      lastUpdated: '1 hour ago',
      transportContacts: {
        coordinator: {
          name: 'Amanpreet Kaur',
          phone: '+91-91234-56789',
          designation: 'Regional Transport Manager',
          department: 'Agricultural Supply Chain'
        },
        drivers: [
          { name: 'Balwinder Singh', phone: '+91-90123-45678', vehicle: 'Truck PB-33-4455', capacity: '8 tonnes' },
          { name: 'Hardeep Singh', phone: '+91-89012-34567', vehicle: 'Truck PB-22-3344', capacity: '15 tonnes' }
        ],
        alternativeContacts: [
          { name: 'Jalandhar Mandi Control', phone: '+91-87654-98765', type: 'Mandi Office' },
          { name: 'Regional Helpline', phone: '+91-76543-21098', type: '24/7 Support' }
        ]
      },
      routeDetails: {
        distance: '18 km',
        normalTravelTime: '35 mins',
        currentTravelTime: '50 mins',
        affectedVillages: ['Village B', 'Village D'],
        checkpoints: ['Village B Exit', 'NH-71 Junction', 'Mandi Gate 2']
      }
    },
    {
      id: 3,
      from: employeeVillages[2] || 'Village C',
      to: 'Cold Storage Unit',
      status: 'operational' as const,
      reason: 'No disease risk detected',
      impact: 'Low - Normal operations',
      alternative: 'Current route optimal',
      estimatedDelay: 'No delay',
      lastUpdated: '2 hours ago',
      transportContacts: {
        coordinator: {
          name: 'Manjit Singh',
          phone: '+91-87654-32109',
          designation: 'Cold Chain Manager',
          department: 'Food Processing Corporation'
        },
        drivers: [
          { name: 'Kuldeep Singh', phone: '+91-76543-10987', vehicle: 'Refrigerated Truck PB-66-7788', capacity: '6 tonnes' },
          { name: 'Jaspreet Singh', phone: '+91-65432-10987', vehicle: 'Refrigerated Truck PB-55-6677', capacity: '8 tonnes' }
        ],
        alternativeContacts: [
          { name: 'Cold Storage Control Room', phone: '+91-54321-09876', type: 'Storage Facility' },
          { name: 'Quality Control Team', phone: '+91-43210-98765', type: 'Quality Assurance' }
        ]
      },
      routeDetails: {
        distance: '25 km',
        normalTravelTime: '45 mins',
        currentTravelTime: '45 mins',
        affectedVillages: ['Village C', 'Village E'],
        checkpoints: ['Village C Collection Point', 'Highway 1', 'Storage Facility Entry']
      }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'restricted': return 'bg-red-50 border-red-200 text-red-900';
      case 'monitor': return 'bg-amber-50 border-amber-200 text-amber-900';
      case 'operational': return 'bg-green-50 border-green-200 text-green-900';
      default: return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'restricted': return <X className="w-4 h-4 text-red-600" />;
      case 'monitor': return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'operational': return <CheckCircle className="w-4 h-4 text-green-600" />;
      default: return <Info className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'restricted': return 'bg-red-100 text-red-700 border border-red-300';
      case 'monitor': return 'bg-amber-100 text-amber-700 border border-amber-300';
      case 'operational': return 'bg-green-100 text-green-700 border border-green-300';
      default: return 'bg-gray-100 text-gray-700 border border-gray-300';
    }
  };

  const restrictedCount = advisories.filter(a => a.status === 'restricted').length;
  const monitorCount = advisories.filter(a => a.status === 'monitor').length;
  const operationalCount = advisories.filter(a => a.status === 'operational').length;

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Truck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Transport Advisory</h2>
              <p className="text-xs text-gray-600">Real-time route status for your assigned areas</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`text-xs px-2 py-1 rounded-lg transition-colors ${
                autoRefresh ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}
              title={autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
            >
              <RefreshCw className={`w-3 h-3 inline mr-1 ${autoRefresh ? 'animate-spin' : ''}`} />
              Auto
            </button>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors"
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Status Overview */}
      <div className="p-6">
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-red-600">{restrictedCount}</div>
            <div className="text-xs text-red-700">Restricted</div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-orange-600">{advisories.filter(a => a.status === 'monitor').length}</div>
            <div className="text-xs text-orange-700">Monitor</div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-amber-600">{monitorCount}</div>
            <div className="text-xs text-amber-700">Caution</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{operationalCount}</div>
            <div className="text-xs text-green-700">Operational</div>
          </div>
        </div>

        {/* Impact Summary */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-6">
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-600" />
              <span><strong>{advisories.reduce((sum, a) => sum + parseInt(a.impact.match(/(\d+)\s+farmers/)?.[1] || '0'), 0)}</strong> farmers affected</span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-gray-600" />
              <span><strong>{advisories.reduce((sum, a) => sum + parseInt(a.impact.match(/(\d+)\s+tonnes/)?.[1] || '0'), 0)}</strong> tonnes impacted</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-600" />
              <span>Updated {lastRefresh.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Route Cards */}
        <div className="space-y-3">
          {advisories.map((advisory) => (
            <div
              key={advisory.id}
              className={`border-2 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${
                getStatusColor(advisory.status)
              }`}
              onClick={() => setSelectedRoute(selectedRoute === advisory.id ? null : advisory.id)}
            >
              {/* Route Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getStatusIcon(advisory.status)}
                  <div>
                    <div className="font-semibold text-sm flex items-center gap-2">
                      <Route className="w-3 h-3" />
                      {advisory.from} → {advisory.to}
                    </div>
                    <div className="text-xs opacity-75 mt-1">
                      Updated {advisory.lastUpdated}
                    </div>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(advisory.status)}`}>
                  {advisory.status.toUpperCase()}
                </span>
              </div>

              {/* Quick Info */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{advisory.estimatedDelay}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{advisory.impact}</span>
                  </div>
                </div>
                <Navigation className="w-4 h-4 opacity-50" />
              </div>

              {/* Expanded Details */}
              {selectedRoute === advisory.id && (
                <div className="mt-4 pt-4 border-t border-current/20 space-y-3">
                  {/* Route Information */}
                  <div className="bg-white/50 rounded-lg p-3">
                    <div className="text-xs font-semibold mb-2">🛣️ Route Details</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="font-medium">Distance:</span> {advisory.routeDetails.distance}
                      </div>
                      <div>
                        <span className="font-medium">Normal Time:</span> {advisory.routeDetails.normalTravelTime}
                      </div>
                      <div>
                        <span className="font-medium">Current Time:</span> {advisory.routeDetails.currentTravelTime}
                      </div>
                      <div>
                        <span className="font-medium">Checkpoints:</span> {advisory.routeDetails.checkpoints.length}
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="font-medium text-xs">Affected Villages:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {advisory.routeDetails.affectedVillages.map((village, idx) => (
                          <span key={idx} className="text-xs bg-current/20 px-2 py-1 rounded">
                            {village}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Transport Coordinator */}
                  <div className="bg-white/50 rounded-lg p-2">
                    <div className="text-xs font-semibold mb-1">👨‍💼 Coordinator</div>
                    <div className="text-xs">
                      <div><strong>{advisory.transportContacts.coordinator.name}</strong></div>
                      <div className="flex items-center gap-1 mt-1">
                        <Phone className="w-3 h-3" />
                        <span>{advisory.transportContacts.coordinator.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Available Driver - Only One */}
                  <div className="bg-white/50 rounded-lg p-2">
                    <div className="text-xs font-semibold mb-1">🚛 Driver</div>
                    <div className="text-xs">
                      <div><strong>{advisory.transportContacts.drivers[0].name}</strong></div>
                      <div className="flex items-center gap-1 mt-1">
                        <Phone className="w-3 h-3" />
                        <span>{advisory.transportContacts.drivers[0].phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact - Only One */}
                  <div className="bg-white/50 rounded-lg p-2">
                    <div className="text-xs font-semibold mb-1">📞 Emergency</div>
                    <div className="text-xs">
                      <div><strong>{advisory.transportContacts.alternativeContacts[0].name}</strong></div>
                      <div className="flex items-center gap-1 mt-1">
                        <Phone className="w-3 h-3" />
                        <span>{advisory.transportContacts.alternativeContacts[0].phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Reason and Alternative */}
                  <div className="bg-white/50 rounded-lg p-3">
                    <div className="text-xs font-semibold mb-1">📋 Reason:</div>
                    <div className="text-xs">{advisory.reason}</div>
                  </div>
                  
                  <div className="bg-white/50 rounded-lg p-3">
                    <div className="text-xs font-semibold mb-1">🔄 Alternative:</div>
                    <div className="text-xs">{advisory.alternative}</div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button className="bg-white/70 border border-current/30 rounded-lg py-2 px-3 text-xs font-medium hover:bg-white transition-colors" title="Call Coordinator" aria-label="Call Coordinator">
                      <Phone className="w-3 h-3 inline mr-1" />
                      Call Coordinator
                    </button>
                    <button className="bg-white/70 border border-current/30 rounded-lg py-2 px-3 text-xs font-medium hover:bg-white transition-colors" title="View Map" aria-label="View Map">
                      <Navigation className="w-3 h-3 inline mr-1" />
                      View Map
                    </button>
                    <button className="bg-white/70 border border-current/30 rounded-lg py-2 px-3 text-xs font-medium hover:bg-white transition-colors" title="Send Alert" aria-label="Send Alert">
                      <MessageCircle className="w-3 h-3 inline mr-1" />
                      Send Alert
                    </button>
                    <button className="bg-white/70 border border-current/30 rounded-lg py-2 px-3 text-xs font-medium hover:bg-white transition-colors" title="Route Report" aria-label="Route Report">
                      <FileText className="w-3 h-3 inline mr-1" />
                      Route Report
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-900">Field Guidance</span>
          </div>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Inform farmers about route restrictions before harvest</li>
            <li>• Guide transporters to alternative mandi routes</li>
            <li>• Report any new disease clusters immediately</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
