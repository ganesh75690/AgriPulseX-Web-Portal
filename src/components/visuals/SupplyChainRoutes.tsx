import React, { useState, useEffect } from 'react';
import { Route, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function SupplyChainRoutes() {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 400);
  }, []);

  const routes = [
    { from: 'Farms A', to: 'Mandi 1', status: 'operational', label: 'Operational' },
    { from: 'Farms B', to: 'Mandi 2', status: 'restricted', label: 'Restricted for safety' },
    { from: 'Mandi 1', to: 'Market Hub', status: 'operational', label: 'Operational' },
    { from: 'Mandi 2', to: 'Market Hub', status: 'restricted', label: 'Temporarily restricted' },
    { from: 'Farms C', to: 'Mandi 3', status: 'monitoring', label: 'Under monitoring' },
    { from: 'Mandi 3', to: 'Market Hub', status: 'operational', label: 'Operational' },
  ];

  return (
    <div className={`bg-white rounded-lg border border-gray-200 transition-opacity duration-700 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-gray-900 flex items-center gap-2">
          <Route className="w-5 h-5 text-[#2f9d58]" />
          Supply-Chain Route Status
        </h2>
        <p className="text-xs text-gray-600 mt-1">
          Conceptual view of agricultural logistics and disease impact on routes
        </p>
      </div>

      <div className="p-6">
        {/* Network Diagram */}
        <div className="relative h-80 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg border border-gray-200 p-6">
          {/* Farms Layer */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-white text-xs shadow-lg">
                Farm A
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center text-white text-xs shadow-lg">
                Farm B
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center text-white text-xs shadow-lg">
                Farm C
              </div>
            </div>
          </div>

          {/* Mandis Layer */}
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs shadow-lg">
                Mandi 1
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs shadow-lg">
                Mandi 2
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs shadow-lg">
                Mandi 3
              </div>
            </div>
          </div>

          {/* Market Hub */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2">
            <div className="w-20 h-20 bg-purple-600 rounded-lg flex items-center justify-center text-white text-xs shadow-xl">
              Market<br/>Hub
            </div>
          </div>

          {/* Routes/Connections */}
          {/* Farm A to Mandi 1 - Green */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <line x1="15%" y1="35%" x2="45%" y2="30%" stroke="#16a34a" strokeWidth="3" strokeDasharray="none" />
            <line x1="15%" y1="50%" x2="45%" y2="55%" stroke="#dc2626" strokeWidth="3" strokeDasharray="8,4" />
            <line x1="15%" y1="65%" x2="45%" y2="75%" stroke="#d97706" strokeWidth="3" strokeDasharray="none" />
            <line x1="55%" y1="30%" x2="80%" y2="50%" stroke="#16a34a" strokeWidth="3" strokeDasharray="none" />
            <line x1="55%" y1="55%" x2="80%" y2="50%" stroke="#dc2626" strokeWidth="3" strokeDasharray="8,4" />
            <line x1="55%" y1="75%" x2="80%" y2="50%" stroke="#16a34a" strokeWidth="3" strokeDasharray="none" />
          </svg>

          {/* Legend */}
          <div className="absolute bottom-3 left-3 bg-white/95 rounded-lg shadow-lg border border-gray-200 p-3">
            <div className="text-xs text-gray-700 mb-2">Route Status</div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-0.5 bg-green-600"></div>
                <span className="text-xs text-gray-900">Operational</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-0.5 bg-red-600" style={{ backgroundImage: 'repeating-linear-gradient(to right, #dc2626 0, #dc2626 4px, transparent 4px, transparent 8px)' }}></div>
                <span className="text-xs text-gray-900">Restricted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-0.5 bg-amber-600"></div>
                <span className="text-xs text-gray-900">Monitoring</span>
              </div>
            </div>
          </div>

          {/* Status Labels */}
          <div className="absolute top-3 right-3 space-y-1">
            <div className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
              6 routes operational
            </div>
            <div className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
              2 routes restricted
            </div>
          </div>
        </div>

        {/* Route Details */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <div className="text-xs text-green-900">Farm A → Mandi 1 → Hub</div>
            </div>
            <div className="text-xs text-green-700">Status: Operational under monitoring</div>
          </div>

          <div className="p-3 bg-red-50 border border-red-200 rounded">
            <div className="flex items-center gap-2 mb-1">
              <XCircle className="w-4 h-4 text-red-600" />
              <div className="text-xs text-red-900">Farm B → Mandi 2 → Hub</div>
            </div>
            <div className="text-xs text-red-700">Status: Restricted for containment safety</div>
          </div>

          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <div className="text-xs text-green-900">Farm C → Mandi 3 → Hub</div>
            </div>
            <div className="text-xs text-green-700">Status: Operational with enhanced checks</div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <div className="text-xs text-amber-900">Alternate Routes</div>
            </div>
            <div className="text-xs text-amber-700">Available to bypass restricted zones</div>
          </div>
        </div>

        {/* Explanation */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-xs text-blue-900">
            <strong>Supply-Chain Intelligence:</strong> This diagram shows how disease containment affects agricultural 
            logistics. Green routes remain fully operational, red routes are temporarily restricted for safety, and 
            alternate routes ensure market connectivity. The system prioritizes minimal disruption while ensuring containment effectiveness.
          </p>
        </div>
      </div>
    </div>
  );
}

