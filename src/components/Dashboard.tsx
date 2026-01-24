import React, { useEffect, useState } from 'react';
import { AlertTriangle, Activity, MapPin, ArrowRight, CheckCircle, AlertCircle, Eye, Network, Camera, Zap, FileText } from 'lucide-react';
import ActionReadinessIndicator, { ARIInputs } from './ActionReadinessIndicator';

interface DashboardProps {
  onNavigateToContainment: () => void;
  onNavigateToVisual: () => void;
  onNavigateToSupplyChain: () => void;
  onNavigateToImageDetection: () => void;
  onNavigateToEnhancedImageDetection: () => void;
  onNavigateToEnhancedAnalysis: () => void;
  onNavigateToRiskTable: () => void;
  onNavigateToFieldReportsInbox: () => void;
}

export default function Dashboard({ onNavigateToContainment, onNavigateToVisual, onNavigateToSupplyChain, onNavigateToImageDetection, onNavigateToEnhancedImageDetection, onNavigateToEnhancedAnalysis, onNavigateToRiskTable, onNavigateToFieldReportsInbox }: DashboardProps) {
  const [countersVisible, setCountersVisible] = useState(false);
  const [ariInputs] = useState<ARIInputs>({
    diseaseSeverityScore: 0.75,
    fieldReportConfidenceScore: 0.87,
    independentReportsCount: 3,
    imageQualityScore: 0.82,
    villageClusteringStrength: 0.65
  });

  useEffect(() => {
    setTimeout(() => setCountersVisible(true), 300);
  }, []);

  const [monitoring, setMonitoring] = useState(0);
  const [active, setActive] = useState(0);
  const [resolved, setResolved] = useState(0);
  const [normal, setNormal] = useState(0);

  useEffect(() => {
    if (countersVisible) {
      const duration = 1500;
      const steps = 60;
      const interval = duration / steps;

      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        setMonitoring(Math.floor(23 * progress));
        setActive(Math.floor(8 * progress));
        setResolved(Math.floor(142 * progress));
        setNormal(Math.floor(567 * progress));

        if (step >= steps) clearInterval(timer);
      }, interval);

      return () => clearInterval(timer);
    }
  }, [countersVisible]);

  const metrics = [
    { label: 'Regions Under Monitoring', value: monitoring, icon: MapPin, color: 'from-amber-500 to-amber-600', textColor: 'text-amber-600' },
    { label: 'Active Containment Advisories', value: active, icon: AlertCircle, color: 'from-red-500 to-red-600', textColor: 'text-red-600' },
    { label: 'Resolved Cases (30 Days)', value: resolved, icon: CheckCircle, color: 'from-green-500 to-green-600', textColor: 'text-green-600' },
    { label: 'Normal Status Regions', value: normal, icon: Activity, color: 'from-blue-500 to-blue-600', textColor: 'text-blue-600' }
  ];

  const activeAdvisories = [
    { region: 'Punjab - Amritsar', disease: 'Late Blight', severity: 'High', since: '2 days ago', status: 'active', confidence: 87 },
    { region: 'Maharashtra - Nashik', disease: 'Powdery Mildew', severity: 'Medium', since: '5 days ago', status: 'active', confidence: 72 },
    { region: 'Karnataka - Bangalore Rural', disease: 'Bacterial Wilt', severity: 'Medium', since: '3 days ago', status: 'active', confidence: 78 },
    { region: 'Uttar Pradesh - Meerut', disease: 'Yellow Rust', severity: 'High', since: '1 day ago', status: 'active', confidence: 91 }
  ];

  const supplyChainStatus = [
    { route: 'North → Delhi NCR', status: 'Operational', impact: 'None', color: 'green', volume: '2,450 tonnes/day' },
    { route: 'West → Mumbai Metro', status: 'Minor Delays', impact: '2-3 hours', color: 'amber', volume: '1,890 tonnes/day' },
    { route: 'South → Chennai Hub', status: 'Operational', impact: 'None', color: 'green', volume: '1,750 tonnes/day' },
    { route: 'East → Kolkata Market', status: 'Operational', impact: 'None', color: 'green', volume: '1,320 tonnes/day' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-gray-50">
      {/* Modern Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl text-gray-900">Dashboard Overview</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Real-time crop risk situation awareness across India
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-xs text-green-700">System Health</div>
                <div className="text-sm text-green-900 mt-0.5 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  All Systems Active
                </div>
              </div>
              <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-xs text-blue-700">Last Sync</div>
                <div className="text-sm text-blue-900 mt-0.5">Just now</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        {/* Metrics Grid - Modern Cards */}
        <div className="grid grid-cols-4 gap-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div
                key={index}
                className={`bg-white rounded-xl border-2 border-gray-200 shadow-sm overflow-hidden transition-all hover:shadow-xl cursor-pointer hover:scale-[1.03] group ${countersVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-4xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{metric.value}</div>
                  <div className="text-xs text-gray-600">{metric.label}</div>
                  <div className="mt-3 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Click for details →
                  </div>
                </div>
                <div className={`h-1 bg-gradient-to-r ${metric.color}`}></div>
              </div>
            );
          })}
        </div>

        {/* Officer Personal Statistics */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border-2 border-purple-200 shadow-sm">
          <div className="px-6 py-4 border-b-2 border-purple-200">
            <h2 className="text-gray-900 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-purple-600" />
              Your Performance Statistics
            </h2>
            <p className="text-xs text-purple-700 mt-1">Your contribution to agricultural disease management</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-900 mb-1">89</div>
                <div className="text-xs text-gray-600">Reports Solved</div>
                <div className="text-xs text-green-600 mt-1">+12% this month</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-900 mb-1">156</div>
                <div className="text-xs text-gray-600">Cases Reviewed</div>
                <div className="text-xs text-green-600 mt-1">+8% this month</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-900 mb-1">94.2%</div>
                <div className="text-xs text-gray-600">Accuracy Rate</div>
                <div className="text-xs text-green-600 mt-1">+3.1% this month</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-900 mb-1">4.8/5</div>
                <div className="text-xs text-gray-600">Farmer Rating</div>
                <div className="text-xs text-green-600 mt-1">+0.3 this month</div>
              </div>
            </div>
            
            {/* Performance Trend */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="text-xs text-gray-600 mb-2">Response Time</div>
                <div className="text-lg font-semibold text-gray-900">2.3 hrs</div>
                <div className="text-xs text-green-600">↓ 15% faster</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="text-xs text-gray-600 mb-2">Daily Average</div>
                <div className="text-lg font-semibold text-gray-900">5.2 cases</div>
                <div className="text-xs text-green-600">↑ 0.8 cases</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="text-xs text-gray-600 mb-2">Success Rate</div>
                <div className="text-lg font-semibold text-gray-900">98.7%</div>
                <div className="text-xs text-green-600">↑ 1.2%</div>
              </div>
            </div>

            {/* Recent Achievement */}
            <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-amber-900">🏆 Outstanding Performance</div>
                  <div className="text-xs text-amber-700">You've resolved 89 cases this month with 94.2% accuracy!</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-2 gap-6">
          {/* Active Advisories */}
          <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 border-b-2 border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-gray-900 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    Active Containment Advisories
                  </h2>
                  <p className="text-xs text-red-700 mt-1">Require officer review and decision</p>
                </div>
                <div className="flex items-center gap-3">
                  <ActionReadinessIndicator 
                    inputs={ariInputs}
                    compact={true}
                  />
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {activeAdvisories.map((advisory, index) => (
                  <div
                    key={index}
                    onClick={() => onNavigateToContainment()}
                    className="p-4 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all cursor-pointer hover:scale-[1.02] group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-sm text-gray-900 mb-1 group-hover:text-blue-800 transition-colors">{advisory.region}</div>
                        <div className="text-xs text-gray-600">{advisory.disease}</div>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full ${
                        advisory.severity === 'High' 
                          ? 'bg-red-100 text-red-700 border border-red-300' 
                          : 'bg-amber-100 text-amber-700 border border-amber-300'
                      }`}>
                        {advisory.severity}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">Active since {advisory.since}</div>
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-blue-600">Confidence: {advisory.confidence}%</div>
                        <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={onNavigateToContainment}
                className="w-full mt-4 flex items-center justify-center gap-2 text-white bg-gradient-to-r from-blue-600 to-blue-700 text-sm py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg hover:scale-[1.02]"
              >
                <span>View Containment Control Room</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Supply Chain Status */}
          <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b-2 border-blue-200">
              <h2 className="text-gray-900 flex items-center gap-2">
                <Network className="w-5 h-5 text-blue-600" />
                Supply-Chain Operational Health
              </h2>
              <p className="text-xs text-blue-700 mt-1">Real-time logistics flow monitoring</p>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {supplyChainStatus.map((route, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-sm text-gray-900">{route.route}</div>
                      <span className={`text-xs px-3 py-1 rounded-full ${
                        route.color === 'green' ? 'bg-green-100 text-green-700 border border-green-300' :
                        'bg-amber-100 text-amber-700 border border-amber-300'
                      }`}>
                        {route.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-600">Impact: {route.impact}</div>
                      <div className="text-xs text-gray-600">{route.volume}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl">
                <p className="text-xs text-blue-900 leading-relaxed">
                  <strong>Real-time Integration:</strong> Supply-chain monitoring integrates disease risk with economic 
                  flow analysis to minimize market disruption while ensuring safety protocols.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Regional Risk Overview */}
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm">
          <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-200">
            <h2 className="text-gray-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-purple-600" />
              Regional Risk Overview
            </h2>
            <p className="text-xs text-gray-600 mt-1">Current risk status across major agricultural zones</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-5 gap-4">
              {[
                { zone: 'North', status: 'Elevated', color: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-300 text-amber-900' },
                { zone: 'South', status: 'Normal', color: 'bg-gradient-to-br from-green-50 to-green-100 border-green-300 text-green-900' },
                { zone: 'East', status: 'Normal', color: 'bg-gradient-to-br from-green-50 to-green-100 border-green-300 text-green-900' },
                { zone: 'West', status: 'Monitoring', color: 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300 text-yellow-900' },
                { zone: 'Central', status: 'Normal', color: 'bg-gradient-to-br from-green-50 to-green-100 border-green-300 text-green-900' }
              ].map((zone, index) => (
                <div 
                  key={index} 
                  className={`p-6 rounded-xl border-2 ${zone.color} text-center shadow-sm hover:shadow-md transition-all cursor-pointer hover:scale-[1.05] group`}
                >
                  <div className="text-sm mb-2 font-semibold group-hover:scale-110 transition-transform">{zone.zone}</div>
                  <div className="text-xs">{zone.status}</div>
                  <div className="mt-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    Click for details →
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Access Tools */}
        <div className="grid grid-cols-6 gap-6">
          <div 
            onClick={onNavigateToFieldReportsInbox}
            className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all cursor-pointer hover:scale-105 hover:from-orange-100 hover:to-orange-200 group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm text-orange-900 mb-1 font-semibold group-hover:text-orange-800">Field Reports Inbox</h3>
                <p className="text-xs text-orange-800">Review submitted reports</p>
                <div className="mt-2 text-xs text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  3 new reports pending
                </div>
              </div>
            </div>
          </div>

          <div 
            onClick={onNavigateToVisual}
            className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all cursor-pointer hover:scale-105 hover:from-purple-100 hover:to-purple-200 group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm text-purple-900 mb-1 font-semibold group-hover:text-purple-800">Visual Intelligence</h3>
                <p className="text-xs text-purple-800">Advanced risk visualizations</p>
                <div className="mt-2 text-xs text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Interactive maps & heatmaps
                </div>
              </div>
            </div>
          </div>

          <div 
            onClick={onNavigateToSupplyChain}
            className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-2 border-indigo-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all cursor-pointer hover:scale-105 hover:from-indigo-100 hover:to-indigo-200 group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all">
                <Network className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm text-indigo-900 mb-1 font-semibold group-hover:text-indigo-800">Supply Chain Monitor</h3>
                <p className="text-xs text-indigo-800">Logistics network tracking</p>
                <div className="mt-2 text-xs text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Real-time supply flow analysis
                </div>
              </div>
            </div>
          </div>

          <div 
            onClick={onNavigateToImageDetection}
            className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all cursor-pointer hover:scale-105 hover:from-blue-100 hover:to-blue-200 group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm text-blue-900 mb-1 font-semibold group-hover:text-blue-800">Image Detection</h3>
                <p className="text-xs text-blue-800">AI-assisted field analysis</p>
                <div className="mt-2 text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Individual farmer analysis
                </div>
              </div>
            </div>
          </div>

          <div 
            onClick={onNavigateToEnhancedAnalysis}
            className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all cursor-pointer hover:scale-105 hover:from-green-100 hover:to-green-200 group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm text-green-900 mb-1 font-semibold group-hover:text-green-800">Enhanced Analysis</h3>
                <p className="text-xs text-green-800">Village-level intelligence</p>
                <div className="mt-2 text-xs text-green-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Multi-farmer coordination
                </div>
              </div>
            </div>
          </div>

          <div 
            onClick={onNavigateToRiskTable}
            className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all cursor-pointer hover:scale-105 hover:from-red-100 hover:to-red-200 group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm text-red-900 mb-1 font-semibold group-hover:text-red-800">Risk Priority Table</h3>
                <p className="text-xs text-red-800">National disease ranking</p>
                <div className="mt-2 text-xs text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Government priority system
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Advisory */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all group">
          <div className="p-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm text-blue-900 mb-1 font-semibold group-hover:text-blue-800">System Advisory: Real-Time Intelligence</h3>
                <p className="text-xs text-blue-900 leading-relaxed mb-3">
                  All metrics are updated in real-time from field monitoring stations and supply-chain integration points. 
                  Containment recommendations are AI-assisted but require officer approval. For detailed decision support 
                  and risk analysis, navigate to the Containment Control Room or Visual Intelligence sections.
                </p>
                <div className="flex gap-3 text-xs">
                  <div className="flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1.5 rounded-full">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Live Data</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>AI Enhanced</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    <span>Gov Approved</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
