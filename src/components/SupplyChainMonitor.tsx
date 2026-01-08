import React, { useState, useEffect } from 'react';
import { Network, CheckCircle, XCircle, AlertCircle, TrendingUp, Info, MapPin, Truck, Store, Warehouse, Eye, X, Clock, Package, AlertTriangle, Activity, Users, Thermometer, Calendar } from 'lucide-react';

export default function SupplyChainMonitor() {
  const [fadeIn, setFadeIn] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<number | null>(null);
  const [showRouteDialog, setShowRouteDialog] = useState(false);
  const [selectedRouteDetails, setSelectedRouteDetails] = useState<any>(null);
  const [showNetworkDialog, setShowNetworkDialog] = useState(false);
  const [selectedNetworkNode, setSelectedNetworkNode] = useState<any>(null);

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 200);
  }, []);

  const handleViewRouteDetails = (route: any) => {
    setSelectedRouteDetails(route);
    setShowRouteDialog(true);
  };

  const closeRouteDialog = () => {
    setShowRouteDialog(false);
    setSelectedRouteDetails(null);
  };

  const handleNetworkNodeClick = (nodeType: string, nodeData: any) => {
    const enhancedNodeData = {
      ...nodeData,
      routes: nodeType === 'farm' ? getFarmRoutes(nodeData.id) :
                nodeType === 'mandi' ? getMandiRoutes(nodeData.id) :
                nodeType === 'hub' ? getHubRoutes() : [],
      lastInspection: nodeType === 'farm' ? '2 hours ago' :
                      nodeType === 'mandi' ? '1 hour ago' :
                      '30 minutes ago',
      nextInspection: nodeType === 'farm' ? 'Tomorrow 6:00 AM' :
                        nodeType === 'mandi' ? 'Today 8:00 PM' :
                        'Tomorrow 9:00 AM',
      staff: nodeType === 'farm' ? '12 workers, 3 supervisors' :
            nodeType === 'mandi' ? '45 workers, 8 supervisors, 2 quality inspectors' :
            '120 workers, 15 supervisors, 5 managers',
      temperature: nodeType === 'mandi' ? '4°C (Refrigerated)' : 'Ambient',
      storage: nodeType === 'mandi' ? '85% utilized' : 'N/A',
      equipment: nodeType === 'farm' ? '4 tractors, 2 harvesters, 1 irrigation system' :
                nodeType === 'mandi' ? '12 cold storage units, 6 loading docks, 2 quality labs' :
                '24 loading bays, 8 processing lines, 4 quality control stations'
    };
    setSelectedNetworkNode({ type: nodeType, ...enhancedNodeData });
    setShowNetworkDialog(true);
  };

  const getFarmRoutes = (farmId: string) => {
    const routeMap: any = {
      'A': [
        { to: 'Mandi Amritsar', status: 'operational', volume: '145 tonnes/day', distance: '12 km' },
        { to: 'Mandi Jalandhar', status: 'restricted', volume: '0 tonnes/day', distance: '18 km' }
      ],
      'B': [
        { to: 'Mandi Jalandhar', status: 'restricted', volume: '0 tonnes/day', distance: '18 km' },
        { to: 'Mandi Ludhiana', status: 'monitoring', volume: '45 tonnes/day', distance: '25 km' }
      ],
      'C': [
        { to: 'Mandi Ludhiana', status: 'operational', volume: '95 tonnes/day', distance: '25 km' }
      ]
    };
    return routeMap[farmId] || [];
  };

  const getMandiRoutes = (mandiId: string) => {
    const routeMap: any = {
      '1': [
        { from: 'Farm Zone A', status: 'operational', volume: '145 tonnes/day', distance: '12 km' },
        { from: 'Farm Zone B', status: 'restricted', volume: '0 tonnes/day', distance: '15 km' }
      ],
      '2': [
        { from: 'Farm Zone B', status: 'restricted', volume: '0 tonnes/day', distance: '18 km' },
        { from: 'Farm Zone C', status: 'monitoring', volume: '45 tonnes/day', distance: '20 km' }
      ],
      '3': [
        { from: 'Farm Zone C', status: 'operational', volume: '95 tonnes/day', distance: '25 km' }
      ]
    };
    return routeMap[mandiId] || [];
  };

  const getHubRoutes = () => {
    return [
      { from: 'Mandi Amritsar', status: 'operational', volume: '280 tonnes/day', distance: '45 km' },
      { from: 'Mandi Jalandhar', status: 'restricted', volume: '0 tonnes/day', distance: '50 km' },
      { from: 'Mandi Ludhiana', status: 'operational', volume: '195 tonnes/day', distance: '35 km' }
    ];
  };

  const closeNetworkDialog = () => {
    setShowNetworkDialog(false);
    setSelectedNetworkNode(null);
  };

  const routes = [
    { 
      id: 1, 
      from: 'Farm Zone A', 
      to: 'Mandi Amritsar', 
      status: 'operational', 
      reason: 'Operational under monitoring',
      volume: '145 tonnes/day',
      color: 'green'
    },
    { 
      id: 2, 
      from: 'Farm Zone B', 
      to: 'Mandi Jalandhar', 
      status: 'restricted', 
      reason: 'Within containment buffer zone',
      volume: '0 tonnes/day',
      color: 'red'
    },
    { 
      id: 3, 
      from: 'Mandi Amritsar', 
      to: 'Central Market Hub', 
      status: 'operational', 
      reason: 'Normal operations',
      volume: '280 tonnes/day',
      color: 'green'
    },
    { 
      id: 4, 
      from: 'Mandi Jalandhar', 
      to: 'Central Market Hub', 
      status: 'restricted', 
      reason: 'Temporarily restricted for safety',
      volume: '0 tonnes/day',
      color: 'red'
    },
    { 
      id: 5, 
      from: 'Farm Zone C', 
      to: 'Mandi Ludhiana', 
      status: 'monitoring', 
      reason: 'Enhanced screening protocols',
      volume: '95 tonnes/day',
      color: 'amber'
    },
    { 
      id: 6, 
      from: 'Mandi Ludhiana', 
      to: 'Central Market Hub', 
      status: 'operational', 
      reason: 'Normal operations with checks',
      volume: '195 tonnes/day',
      color: 'green'
    },
  ];

  const stats = [
    { label: 'Total Routes', value: '24', status: 'Active', color: 'blue' },
    { label: 'Operational', value: '18', status: '75%', color: 'green' },
    { label: 'Restricted', value: '4', status: '17%', color: 'red' },
    { label: 'Monitoring', value: '2', status: '8%', color: 'amber' },
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-gray-50 transition-opacity duration-700 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      {/* Modern Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Network className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl text-gray-900">Supply Chain Monitor</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Real-time agricultural logistics tracking and containment impact assessment
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-xs text-green-700">Network Status</div>
                <div className="text-sm text-green-900 mt-0.5 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  75% Operational
                </div>
              </div>
              <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-xs text-blue-700">Last Updated</div>
                <div className="text-sm text-blue-900 mt-0.5">2 mins ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        {/* Officer Guidance */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm text-blue-900 mb-1">Officer Question: "Will this containment unnecessarily stop trade?"</h3>
              <p className="text-xs text-blue-900 leading-relaxed">
                This monitor shows how disease containment affects agricultural logistics. <strong>Only high-risk logistics 
                routes are restricted</strong> to maintain economic continuity. Green routes remain fully operational, red 
                routes are temporarily restricted for safety, and alternate routes ensure market connectivity.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className={`p-5 bg-white rounded-xl border-2 ${
                stat.color === 'blue' ? 'border-blue-200' :
                stat.color === 'green' ? 'border-green-200' :
                stat.color === 'red' ? 'border-red-200' :
                'border-amber-200'
              } shadow-sm`}
            >
              <div className="text-xs text-gray-600 mb-2">{stat.label}</div>
              <div className={`text-3xl mb-1 ${
                stat.color === 'blue' ? 'text-blue-900' :
                stat.color === 'green' ? 'text-green-900' :
                stat.color === 'red' ? 'text-red-900' :
                'text-amber-900'
              }`}>
                {stat.value}
              </div>
              <div className={`text-xs ${
                stat.color === 'blue' ? 'text-blue-700' :
                stat.color === 'green' ? 'text-green-700' :
                stat.color === 'red' ? 'text-red-700' :
                'text-amber-700'
              }`}>
                {stat.status}
              </div>
            </div>
          ))}
        </div>

        {/* Network Diagram */}
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-200">
            <h2 className="text-gray-900 flex items-center gap-2">
              <Network className="w-5 h-5 text-indigo-600" />
              Agricultural Logistics Network Visualization
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              Conceptual diagram showing farms, mandis, and market connectivity
            </p>
          </div>

          <div className="p-8">
            {/* Network Diagram */}
            <div className="relative h-96 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-gray-200 p-8 shadow-inner">
              {/* Farm Zones Layer */}
              <div className="absolute left-12 top-1/2 -translate-y-1/2 space-y-6">
                <div className="group">
                  <div 
                    onClick={() => handleNetworkNodeClick('farm', { id: 'A', name: 'Farm Zone A', status: 'operational', capacity: '145 tonnes/day', crops: 'Wheat, Rice' })}
                    className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white text-xs shadow-xl hover:scale-105 transition-transform cursor-pointer"
                  >
                    <div className="text-center">
                      <Store className="w-6 h-6 mx-auto mb-1" />
                      <div>Farm A</div>
                    </div>
                  </div>
                </div>
                <div className="group">
                  <div 
                    onClick={() => handleNetworkNodeClick('farm', { id: 'B', name: 'Farm Zone B', status: 'restricted', capacity: '0 tonnes/day', crops: 'Potato, Vegetables' })}
                    className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white text-xs shadow-xl hover:scale-105 transition-transform cursor-pointer"
                  >
                    <div className="text-center">
                      <Store className="w-6 h-6 mx-auto mb-1" />
                      <div>Farm B</div>
                    </div>
                  </div>
                </div>
                <div className="group">
                  <div 
                    onClick={() => handleNetworkNodeClick('farm', { id: 'C', name: 'Farm Zone C', status: 'monitoring', capacity: '95 tonnes/day', crops: 'Cotton, Pulses' })}
                    className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center text-white text-xs shadow-xl hover:scale-105 transition-transform cursor-pointer"
                  >
                    <div className="text-center">
                      <Store className="w-6 h-6 mx-auto mb-1" />
                      <div>Farm C</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mandis Layer */}
              <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 space-y-8">
                <div className="group">
                  <div 
                    onClick={() => handleNetworkNodeClick('mandi', { id: '1', name: 'Mandi Amritsar', status: 'operational', capacity: '280 tonnes/day', connectedFarms: 'Farm Zone A', currentLoad: '65%' })}
                    className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-xs shadow-xl hover:scale-105 transition-transform cursor-pointer"
                  >
                    <div className="text-center">
                      <Warehouse className="w-7 h-7 mx-auto mb-1" />
                      <div>Mandi 1</div>
                    </div>
                  </div>
                </div>
                <div className="group">
                  <div 
                    onClick={() => handleNetworkNodeClick('mandi', { id: '2', name: 'Mandi Jalandhar', status: 'restricted', capacity: '0 tonnes/day', connectedFarms: 'Farm Zone B', currentLoad: '0%' })}
                    className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-xs shadow-xl hover:scale-105 transition-transform cursor-pointer"
                  >
                    <div className="text-center">
                      <Warehouse className="w-7 h-7 mx-auto mb-1" />
                      <div>Mandi 2</div>
                    </div>
                  </div>
                </div>
                <div className="group">
                  <div 
                    onClick={() => handleNetworkNodeClick('mandi', { id: '3', name: 'Mandi Ludhiana', status: 'operational', capacity: '195 tonnes/day', connectedFarms: 'Farm Zone C', currentLoad: '49%' })}
                    className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-xs shadow-xl hover:scale-105 transition-transform cursor-pointer"
                  >
                    <div className="text-center">
                      <Warehouse className="w-7 h-7 mx-auto mb-1" />
                      <div>Mandi 3</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Market Hub */}
              <div className="absolute right-12 top-1/2 -translate-y-1/2">
                <div 
                  onClick={() => handleNetworkNodeClick('hub', { id: 'central', name: 'Central Market Hub', status: 'operational', capacity: '620 tonnes/day', connectedMandis: 'Mandi Amritsar, Mandi Jalandhar, Mandi Ludhiana', currentLoad: '42%' })}
                  className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xs shadow-2xl hover:scale-105 transition-transform cursor-pointer"
                >
                  <div className="text-center">
                    <Truck className="w-8 h-8 mx-auto mb-1" />
                    <div>Market</div>
                    <div>Hub</div>
                  </div>
                </div>
              </div>

              {/* Routes/Connections */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {/* Farm A to Mandi 1 - Green (Operational) */}
                <line x1="18%" y1="32%" x2="45%" y2="28%" stroke="#16a34a" strokeWidth="4" />
                {/* Farm B to Mandi 2 - Red (Restricted) */}
                <line x1="18%" y1="50%" x2="45%" y2="50%" stroke="#dc2626" strokeWidth="4" strokeDasharray="12,6" />
                {/* Farm C to Mandi 3 - Amber (Monitoring) */}
                <line x1="18%" y1="68%" x2="45%" y2="72%" stroke="#d97706" strokeWidth="4" />
                {/* Mandi 1 to Hub - Green */}
                <line x1="55%" y1="28%" x2="82%" y2="50%" stroke="#16a34a" strokeWidth="4" />
                {/* Mandi 2 to Hub - Red */}
                <line x1="55%" y1="50%" x2="82%" y2="50%" stroke="#dc2626" strokeWidth="4" strokeDasharray="12,6" />
                {/* Mandi 3 to Hub - Green */}
                <line x1="55%" y1="72%" x2="82%" y2="50%" stroke="#16a34a" strokeWidth="4" />
              </svg>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white/98 rounded-xl shadow-xl border-2 border-gray-300 p-4">
                <div className="text-xs text-gray-900 mb-3">Route Status Legend</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-1 bg-green-600 rounded"></div>
                    <span className="text-xs text-gray-900">Operational</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-1 bg-red-600 rounded" style={{ backgroundImage: 'repeating-linear-gradient(to right, #dc2626 0, #dc2626 6px, transparent 6px, transparent 12px)' }}></div>
                    <span className="text-xs text-gray-900">Restricted</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-1 bg-amber-600 rounded"></div>
                    <span className="text-xs text-gray-900">Monitoring</span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="absolute top-4 right-4 space-y-2">
                <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-xs border border-green-300 shadow-sm">
                  18 routes operational
                </div>
                <div className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-xs border border-red-300 shadow-sm">
                  4 routes restricted
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Route Details Table */}
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-200">
            <h3 className="text-gray-900">Detailed Route Status</h3>
            <p className="text-xs text-gray-600 mt-1">All active logistics routes with current operational status</p>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {routes.map((route) => (
                <div
                  key={route.id}
                  className={`p-5 rounded-xl border-2 ${
                    route.status === 'operational' 
                      ? 'bg-green-50 border-green-300' 
                      : route.status === 'restricted'
                      ? 'bg-red-50 border-red-300'
                      : 'bg-amber-50 border-amber-300'
                  } cursor-pointer hover:shadow-md transition-all`}
                  onClick={() => setSelectedRoute(route.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {route.status === 'operational' && <CheckCircle className="w-5 h-5 text-green-600" />}
                      {route.status === 'restricted' && <XCircle className="w-5 h-5 text-red-600" />}
                      {route.status === 'monitoring' && <AlertCircle className="w-5 h-5 text-amber-600" />}
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm text-gray-900">{route.from}</span>
                          <span className="text-gray-400">→</span>
                          <span className="text-sm text-gray-900">{route.to}</span>
                        </div>
                        <div className={`text-xs ${
                          route.status === 'operational' ? 'text-green-700' :
                          route.status === 'restricted' ? 'text-red-700' :
                          'text-amber-700'
                        }`}>
                          {route.reason}
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleViewRouteDetails(route)}
                      className="flex items-center gap-2 px-3 py-2 bg-[#2f9d58] text-white rounded-lg text-xs hover:bg-[#237a3f] transition-colors shadow-sm"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Officer Action Section */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-amber-100 px-6 py-3 border-b border-amber-300">
            <h3 className="text-sm text-amber-900">Officer Action Enabled</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg border border-amber-200">
                <h4 className="text-sm text-amber-900 mb-2">Allow Essential Movement</h4>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Operational routes ensure food security and farmer income while maintaining safety protocols
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-amber-200">
                <h4 className="text-sm text-amber-900 mb-2">Prevent Economic Over-reach</h4>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Only high-risk corridors are restricted, avoiding unnecessary trade disruption
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-amber-200">
                <h4 className="text-sm text-amber-900 mb-2">Maintain Market Connectivity</h4>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Alternate routes activated automatically to ensure continuous supply chain flow
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Route Details Dialog */}
      {showRouteDialog && selectedRouteDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white shadow-2xl max-w-2xl w-full max-h-[40vh] overflow-y-auto">
            {/* Dialog Header */}
            <div className="bg-gradient-to-r from-[#2f9d58] to-[#237a3f] text-white px-4 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 flex items-center justify-center ${
                    selectedRouteDetails.status === 'operational' ? 'bg-green-100' :
                    selectedRouteDetails.status === 'restricted' ? 'bg-red-100' :
                    'bg-amber-100'
                  }`}>
                    {selectedRouteDetails.status === 'operational' && <CheckCircle className="w-4 h-4 text-green-600" />}
                    {selectedRouteDetails.status === 'restricted' && <XCircle className="w-4 h-4 text-red-600" />}
                    {selectedRouteDetails.status === 'monitoring' && <AlertCircle className="w-4 h-4 text-amber-600" />}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold">Route Details</h3>
                    <p className="text-sm text-white/80">
                      {selectedRouteDetails.from} → {selectedRouteDetails.to}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeRouteDialog}
                  className="w-8 h-8 bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                  aria-label="Close route details dialog"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Dialog Content */}
            <div className="p-4 space-y-4">
              {/* Route Information */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-gray-600" />
                    <h4 className="text-sm font-semibold text-gray-900">Origin</h4>
                  </div>
                  <p className="text-base text-gray-900">{selectedRouteDetails.from}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Store className="w-4 h-4 text-gray-600" />
                    <h4 className="text-sm font-semibold text-gray-900">Destination</h4>
                  </div>
                  <p className="text-base text-gray-900">{selectedRouteDetails.to}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-gray-600" />
                    <h4 className="text-sm font-semibold text-gray-900">Current Status</h4>
                  </div>
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
                    selectedRouteDetails.status === 'operational' ? 'bg-green-100 text-green-700' :
                    selectedRouteDetails.status === 'restricted' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {selectedRouteDetails.status === 'operational' && <CheckCircle className="w-4 h-4" />}
                    {selectedRouteDetails.status === 'restricted' && <XCircle className="w-4 h-4" />}
                    {selectedRouteDetails.status === 'monitoring' && <AlertCircle className="w-4 h-4" />}
                    {selectedRouteDetails.status === 'operational' ? 'Operational' :
                     selectedRouteDetails.status === 'restricted' ? 'Restricted' :
                     'Monitoring'}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-4 h-4 text-gray-600" />
                    <h4 className="text-sm font-semibold text-gray-900">Volume</h4>
                  </div>
                  <p className="text-base text-gray-900">{selectedRouteDetails.volume}</p>
                </div>
              </div>

              {/* Status Reason */}
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-blue-600" />
                  <h4 className="text-sm font-semibold text-blue-900">Status Reason</h4>
                </div>
                <p className="text-sm text-blue-900 leading-relaxed">{selectedRouteDetails.reason}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={closeRouteDialog}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium"
                >
                  Close
                </button>
                <button
                  onClick={closeRouteDialog}
                  className="flex-1 px-4 py-2 bg-[#2f9d58] text-white hover:bg-[#237a3f] transition-colors font-medium"
                >
                  Acknowledge
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Network Node Details Dialog */}
      {showNetworkDialog && selectedNetworkNode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white shadow-2xl max-w-2xl w-full max-h-[50vh] overflow-y-auto">
            {/* Dialog Header */}
            <div className={`bg-gradient-to-r text-white px-6 py-4 border-b border-gray-200 ${
              selectedNetworkNode.type === 'farm' ? 'from-green-500 to-green-600' :
              selectedNetworkNode.type === 'mandi' ? 'from-blue-500 to-blue-600' :
              'from-purple-500 to-purple-600'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 flex items-center justify-center ${
                    selectedNetworkNode.type === 'farm' ? 'bg-green-100' :
                    selectedNetworkNode.type === 'mandi' ? 'bg-blue-100' :
                    'bg-purple-100'
                  }`}>
                    {selectedNetworkNode.type === 'farm' && <Store className="w-6 h-6 text-green-600" />}
                    {selectedNetworkNode.type === 'mandi' && <Warehouse className="w-6 h-6 text-blue-600" />}
                    {selectedNetworkNode.type === 'hub' && <Truck className="w-6 h-6 text-purple-600" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {selectedNetworkNode.type === 'farm' ? 'Farm Zone Details' :
                       selectedNetworkNode.type === 'mandi' ? 'Mandi Details' :
                       'Market Hub Details'}
                    </h3>
                    <p className="text-sm text-white/80">{selectedNetworkNode.name}</p>
                  </div>
                </div>
                <button
                  onClick={closeNetworkDialog}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                  aria-label="Close network details dialog"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Dialog Content */}
            <div className="p-4 overflow-y-auto max-h-[calc(50vh-80px)]">
              {/* Node Information */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-gray-600" />
                    <h4 className="text-sm font-semibold text-gray-900">Node ID</h4>
                  </div>
                  <p className="text-lg text-gray-900">{selectedNetworkNode.id}</p>
                </div>
                
                <div className="bg-gray-50 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-gray-600" />
                    <h4 className="text-sm font-semibold text-gray-900">Status</h4>
                  </div>
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
                    selectedNetworkNode.status === 'operational' ? 'bg-green-100 text-green-700' :
                    selectedNetworkNode.status === 'restricted' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {selectedNetworkNode.status === 'operational' && <CheckCircle className="w-4 h-4" />}
                    {selectedNetworkNode.status === 'restricted' && <XCircle className="w-4 h-4" />}
                    {selectedNetworkNode.status === 'monitoring' && <AlertCircle className="w-4 h-4" />}
                    {selectedNetworkNode.status === 'operational' ? 'Operational' :
                     selectedNetworkNode.status === 'restricted' ? 'Restricted' :
                     'Monitoring'}
                  </div>
                </div>

                <div className="bg-gray-50 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-4 h-4 text-gray-600" />
                    <h4 className="text-sm font-semibold text-gray-900">Capacity</h4>
                  </div>
                  <p className="text-lg text-gray-900">{selectedNetworkNode.capacity}</p>
                </div>
              </div>

              {/* Routes Information */}
              {selectedNetworkNode.routes && selectedNetworkNode.routes.length > 0 && (
                <div className="bg-blue-50 p-3 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Network className="w-4 h-4 text-blue-600" />
                    <h4 className="text-sm font-semibold text-blue-900">Connected Routes</h4>
                  </div>
                  <div className="space-y-2">
                    {selectedNetworkNode.routes.map((route: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-white border border-blue-200">
                        <div className="flex items-center gap-2">
                          {route.status === 'operational' && <CheckCircle className="w-4 h-4 text-green-600" />}
                          {route.status === 'restricted' && <XCircle className="w-4 h-4 text-red-600" />}
                          {route.status === 'monitoring' && <AlertCircle className="w-4 h-4 text-amber-600" />}
                          <div>
                            <div className="text-sm text-gray-900">
                              {selectedNetworkNode.type === 'hub' ? `${route.from} → Hub` : 
                               selectedNetworkNode.type === 'mandi' ? `Farm → ${selectedNetworkNode.name}` :
                               `${selectedNetworkNode.name} → ${route.to}`}
                            </div>
                            <div className="text-xs text-gray-600">
                              {route.distance} • {route.volume}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`px-2 py-1 text-xs font-medium ${
                            route.status === 'operational' ? 'bg-green-100 text-green-700' :
                            route.status === 'restricted' ? 'bg-red-100 text-red-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {route.status === 'operational' ? 'Active' :
                             route.status === 'restricted' ? 'Restricted' :
                             'Monitoring'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Details */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-gray-600" />
                    <h4 className="text-sm font-semibold text-gray-900">Staff On Duty</h4>
                  </div>
                  <p className="text-sm text-gray-900">{selectedNetworkNode.staff}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Thermometer className="w-4 h-4 text-gray-600" />
                    <h4 className="text-sm font-semibold text-gray-900">Temperature</h4>
                  </div>
                  <p className="text-sm text-gray-900">{selectedNetworkNode.temperature}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <h4 className="text-sm font-semibold text-gray-900">Next Inspection</h4>
                  </div>
                  <p className="text-sm text-gray-900">{selectedNetworkNode.nextInspection}</p>
                </div>
              </div>

              {/* Type-Specific Details */}
              {selectedNetworkNode.type === 'farm' && (
                <div className="bg-green-50 p-3 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Store className="w-4 h-4 text-green-600" />
                    <h4 className="text-sm font-semibold text-green-900">Farm Information</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-green-700 mb-1">Primary Crops</p>
                      <p className="text-sm text-green-900">{selectedNetworkNode.crops}</p>
                    </div>
                    <div>
                      <p className="text-xs text-green-700 mb-1">Farm Size</p>
                      <p className="text-sm text-green-900">250 hectares</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedNetworkNode.type === 'mandi' && (
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Warehouse className="w-4 h-4 text-blue-600" />
                    <h4 className="text-sm font-semibold text-blue-900">Mandi Information</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-blue-700 mb-1">Connected Farms</p>
                      <p className="text-sm text-blue-900">{selectedNetworkNode.connectedFarms}</p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-700 mb-1">Current Load</p>
                      <p className="text-sm text-blue-900">{selectedNetworkNode.currentLoad}</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedNetworkNode.type === 'hub' && (
                <div className="bg-purple-50 p-3 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="w-4 h-4 text-purple-600" />
                    <h4 className="text-sm font-semibold text-purple-900">Hub Information</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-purple-700 mb-1">Connected Mandis</p>
                      <p className="text-sm text-purple-900">{selectedNetworkNode.connectedMandis}</p>
                    </div>
                    <div>
                      <p className="text-xs text-purple-700 mb-1">Total Throughput</p>
                      <p className="text-sm text-purple-900">{selectedNetworkNode.capacity}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                <button
                  onClick={closeNetworkDialog}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium text-sm"
                >
                  Close
                </button>
                <button
                  onClick={closeNetworkDialog}
                  className="flex-1 px-4 py-2 bg-[#2f9d58] text-white hover:bg-[#237a3f] transition-colors font-medium text-sm"
                >
                  Acknowledge
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
