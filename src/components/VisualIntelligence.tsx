import React from 'react';
import { Eye, TrendingUp, Info } from 'lucide-react';
import TemporalRiskTrend from './visuals/TemporalRiskTrend';
import ContainmentImpact from './visuals/ContainmentImpact';
import EconomicImpact from './visuals/EconomicImpact';
import ConfidenceTrust from './visuals/ConfidenceTrust';

export default function VisualIntelligence() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/20 to-gray-50">
      {/* Modern Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Eye className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl text-gray-900">Visual Intelligence Dashboard</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Advanced risk visualizations for informed decision-making and policy justification
                </p>
              </div>
            </div>
            <div className="px-4 py-2 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="text-xs text-purple-700">System Status</div>
              <div className="text-sm text-purple-900 mt-0.5 flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                All Visuals Active
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        {/* Enhanced System Notice with More Knowledge */}
        <div className="bg-white border-l-4 border-purple-500 shadow-sm rounded-lg p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Eye className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-gray-900 mb-2">🧠 Agricultural Disease Intelligence Framework</h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                These visualizations provide <strong>comprehensive agricultural disease surveillance</strong> and 
                <strong> decision support</strong> for crop health management. Each component addresses critical aspects:
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span><strong>Risk Assessment:</strong> Multi-layered disease threat analysis</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span><strong>Economic Impact:</strong> Financial risk quantification</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span><strong>Containment Strategy:</strong> Action effectiveness modeling</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span><strong>Confidence Metrics:</strong> Data reliability scoring</span>
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mt-3">
                <strong>Human oversight required:</strong> All AI-generated insights require field verification, 
                local agricultural knowledge, and officer judgment before implementation.
              </p>
            </div>
          </div>
        </div>

        {/* Agricultural Knowledge Base Section */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
          <h3 className="text-lg text-green-900 mb-4 flex items-center gap-2">
            <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">📚</span>
            </div>
            Crop Disease Knowledge Base
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <h4 className="text-sm font-semibold text-green-800 mb-2">🌾 Common Diseases</h4>
              <ul className="text-xs text-green-700 space-y-1">
                <li>• Leaf Blight (Wheat, Rice)</li>
                <li>• Bacterial Leaf Blight</li>
                <li>• Wheat Rust (Stem, Leaf, Stripe)</li>
                <li>• Powdery Mildew</li>
                <li>• Fusarium Wilt</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <h4 className="text-sm font-semibold text-green-800 mb-2">🔍 Detection Methods</h4>
              <ul className="text-xs text-green-700 space-y-1">
                <li>• AI Image Analysis (87% accuracy)</li>
                <li>• Field Officer Reports</li>
                <li>• Satellite Imagery</li>
                <li>• Weather Pattern Analysis</li>
                <li>• Historical Outbreak Data</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <h4 className="text-sm font-semibold text-green-800 mb-2">⚡ Rapid Response</h4>
              <ul className="text-xs text-green-700 space-y-1">
                <li>• 24-hour containment window</li>
                <li>• Fungicide application protocols</li>
                <li>• Quarantine zones (2-5km radius)</li>
                <li>• Farmer notification system</li>
                <li>• Supply chain coordination</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Regional Risk Intelligence */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
          <h3 className="text-lg text-blue-900 mb-4 flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">🗺️</span>
            </div>
            Regional Risk Intelligence
          </h3>
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <div className="text-xs text-blue-600 font-semibold mb-1">Punjab Region</div>
              <div className="text-xs text-blue-800">
                <div>🌾 Wheat: High Risk</div>
                <div>🌾 Rice: Medium Risk</div>
                <div>🌾 Cotton: Low Risk</div>
                <div className="text-blue-600 mt-1">Active: 23 alerts</div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <div className="text-xs text-blue-600 font-semibold mb-1">Haryana Region</div>
              <div className="text-xs text-blue-800">
                <div>🌾 Wheat: Medium Risk</div>
                <div>🌾 Rice: Low Risk</div>
                <div>🌾 Pulses: Medium Risk</div>
                <div className="text-blue-600 mt-1">Active: 15 alerts</div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <div className="text-xs text-blue-600 font-semibold mb-1">Uttar Pradesh</div>
              <div className="text-xs text-blue-800">
                <div>🌾 Rice: High Risk</div>
                <div>🌾 Wheat: Medium Risk</div>
                <div>🌾 Sugarcane: Low Risk</div>
                <div className="text-blue-600 mt-1">Active: 31 alerts</div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <div className="text-xs text-blue-600 font-semibold mb-1">Madhya Pradesh</div>
              <div className="text-xs text-blue-800">
                <div>🌾 Wheat: Low Risk</div>
                <div>🌾 Pulses: Medium Risk</div>
                <div>🌾 Oilseeds: Low Risk</div>
                <div className="text-blue-600 mt-1">Active: 12 alerts</div>
              </div>
            </div>
          </div>
        </div>

                
        {/* Temporal Risk Trend */}
        <TemporalRiskTrend />

        {/* Containment Impact - Before vs After */}
        <ContainmentImpact />

        {/* Two Column Layout */}
        <div className="grid grid-cols-3 gap-6">
          {/* Economic Impact */}
          <div className="col-span-2">
            <EconomicImpact />
          </div>

          {/* Confidence & Trust */}
          <ConfidenceTrust />
        </div>

        {/* Enhanced Quick Access Cards with More Information */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm text-blue-900 mb-2">Supply Chain Intelligence</h3>
                <p className="text-xs text-blue-800 mb-3 leading-relaxed">
                  Real-time agricultural logistics monitoring, route optimization, and containment impact analysis on trade flows
                </p>
                <div className="text-xs text-blue-700 mb-3">
                  <div>📊 Active Routes: 147</div>
                  <div>⚠️ Affected Routes: 23</div>
                  <div>🚚 Fleet Status: Operational</div>
                </div>
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition-colors shadow-sm"
                  onClick={() => window.location.href = '#supply-chain'}
                >
                  Open Supply Chain Monitor
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Info className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-sm text-amber-900 mb-2">AI Detection Lab</h3>
                <p className="text-xs text-amber-800 mb-3 leading-relaxed">
                  Advanced image analysis with disease detection confidence scoring and treatment recommendations
                </p>
                <div className="text-xs text-amber-700 mb-3">
                  <div>🤖 Model Accuracy: 87%</div>
                  <div>📸 Images Processed: 1,247</div>
                  <div>⚡ Avg Processing: 2.3s</div>
                </div>
                <button 
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg text-xs hover:bg-amber-700 transition-colors shadow-sm"
                  onClick={() => window.location.href = '#image-detection'}
                >
                  Open Image Detection
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-sm text-green-900 mb-2">Field Evidence Hub</h3>
                <p className="text-xs text-green-800 mb-3 leading-relaxed">
                  Comprehensive field data collection, evidence documentation, and verification workflows
                </p>
                <div className="text-xs text-green-700 mb-3">
                  <div>📋 Reports Today: 47</div>
                  <div>✅ Verified: 32</div>
                  <div>🔄 Pending Review: 15</div>
                </div>
                <button 
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700 transition-colors shadow-sm"
                  onClick={() => window.location.href = '#field-evidence'}
                >
                  View Field Evidence
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Analytics Dashboard */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6">
          <h3 className="text-lg text-purple-900 mb-4 flex items-center gap-2">
            <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">📊</span>
            </div>
            Advanced Analytics & Insights
          </h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <div className="text-xs text-purple-600 font-semibold mb-2">🎯 Prediction Accuracy</div>
              <div className="text-2xl text-purple-900 font-bold">87.3%</div>
              <div className="text-xs text-purple-700 mt-1">↑ 2.1% from last month</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <div className="text-xs text-purple-600 font-semibold mb-2">🌾 Crops Monitored</div>
              <div className="text-2xl text-purple-900 font-bold">12</div>
              <div className="text-xs text-purple-700 mt-1">Major crop varieties</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <div className="text-xs text-purple-600 font-semibold mb-2">📍 Coverage Area</div>
              <div className="text-2xl text-purple-900 font-bold">4.2M</div>
              <div className="text-xs text-purple-700 mt-1">Hectares under surveillance</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <div className="text-xs text-purple-600 font-semibold mb-2">⚡ Response Time</div>
              <div className="text-2xl text-purple-900 font-bold">4.8h</div>
              <div className="text-xs text-purple-700 mt-1">Average containment time</div>
            </div>
          </div>
        </div>

        {/* Knowledge Base & Best Practices */}
        <div className="bg-gradient-to-r from-cyan-50 to-teal-50 border-2 border-cyan-200 rounded-xl p-6">
          <h3 className="text-lg text-cyan-900 mb-4 flex items-center gap-2">
            <div className="w-6 h-6 bg-cyan-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">🎓</span>
            </div>
            Agricultural Best Practices & Protocols
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-5 border border-cyan-200">
              <h4 className="text-sm font-semibold text-cyan-800 mb-3">🛡️ Disease Prevention</h4>
              <ul className="text-xs text-cyan-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500">•</span>
                  <span><strong>Crop Rotation:</strong> Rotate crops every 2-3 years to break disease cycles</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500">•</span>
                  <span><strong>Seed Treatment:</strong> Use certified disease-free seeds with fungicide treatment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500">•</span>
                  <span><strong>Field Sanitation:</strong> Remove and destroy infected plant debris</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500">•</span>
                  <span><strong>Water Management:</strong> Proper drainage to prevent waterlogged conditions</span>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-5 border border-cyan-200">
              <h4 className="text-sm font-semibold text-cyan-800 mb-3">🚨 Early Warning Signs</h4>
              <ul className="text-xs text-cyan-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500">•</span>
                  <span><strong>Leaf Spots:</strong> Small brown/yellow spots on leaves</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500">•</span>
                  <span><strong>Wilting:</strong> Sudden plant wilting despite adequate water</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500">•</span>
                  <span><strong>Stunted Growth:</strong> Plants smaller than normal for age</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500">•</span>
                  <span><strong>Abnormal Coloring:</strong> Yellowing, reddening, or purpling of leaves</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Educational Resources & Learning Hub */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-6">
          <h3 className="text-lg text-purple-900 mb-4 flex items-center gap-2">
            <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">🎓</span>
            </div>
            Educational Resources & Learning Hub
          </h3>
          <div className="space-y-4">
            {/* Video Resources Section */}
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <h4 className="text-sm font-semibold text-purple-800 mb-3 flex items-center">
                <span className="text-red-600 mr-2">▶</span> Video Learning Resources
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <a href="https://www.youtube.com/watch?v=IqV5U_1C9H8" target="_blank" rel="noopener noreferrer" className="block p-3 bg-purple-50 rounded-lg border border-purple-100 hover:bg-purple-100 transition-colors">
                    <div className="text-xs font-medium text-purple-900">WHO: Managing Pandemic Fatigue</div>
                    <div className="text-xs text-purple-600 mt-1">Community engagement strategies</div>
                    <div className="text-xs text-gray-500 mt-1">Duration: 12:45</div>
                  </a>
                  <a href="https://www.youtube.com/watch?v=K2mO8wF2V6c" target="_blank" rel="noopener noreferrer" className="block p-3 bg-purple-50 rounded-lg border border-purple-100 hover:bg-purple-100 transition-colors">
                    <div className="text-xs font-medium text-purple-900">Public Health Compliance</div>
                    <div className="text-xs text-purple-600 mt-1">Understanding community behavior</div>
                    <div className="text-xs text-gray-500 mt-1">Duration: 8:30</div>
                  </a>
                </div>
                <div className="space-y-2">
                  <a href="https://www.youtube.com/watch?v=R7nH9Y5T4I8" target="_blank" rel="noopener noreferrer" className="block p-3 bg-purple-50 rounded-lg border border-purple-100 hover:bg-purple-100 transition-colors">
                    <div className="text-xs font-medium text-purple-900">Community Health Crises</div>
                    <div className="text-xs text-purple-600 mt-1">Engagement during outbreaks</div>
                    <div className="text-xs text-gray-500 mt-1">Duration: 15:20</div>
                  </a>
                  <a href="https://www.youtube.com/watch?v=T9nL8Y3X2K4" target="_blank" rel="noopener noreferrer" className="block p-3 bg-purple-50 rounded-lg border border-purple-100 hover:bg-purple-100 transition-colors">
                    <div className="text-xs font-medium text-purple-900">Agricultural Containment</div>
                    <div className="text-xs text-purple-600 mt-1">Disease control strategies</div>
                    <div className="text-xs text-gray-500 mt-1">Duration: 10:15</div>
                  </a>
                </div>
              </div>
            </div>

            {/* Research Papers & Guidelines */}
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <h4 className="text-sm font-semibold text-purple-800 mb-3 flex items-center">
                <span className="text-blue-600 mr-2">📄</span> Research Papers & Official Guidelines
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <a href="https://www.who.int/publications/i/item/WHO-2019-nCoV-PolicyBrief-Community_Engagement-2020.1" target="_blank" rel="noopener noreferrer" className="block p-3 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors">
                    <div className="text-xs font-medium text-blue-900">WHO Guidelines</div>
                    <div className="text-xs text-blue-600 mt-1">Community Engagement</div>
                    <div className="text-xs text-gray-500 mt-1">2020</div>
                  </a>
                  <a href="https://www.cdc.gov/coronavirus/2019-ncov/community/health-equity/communication.html" target="_blank" rel="noopener noreferrer" className="block p-3 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors">
                    <div className="text-xs font-medium text-blue-900">CDC Protocols</div>
                    <div className="text-xs text-blue-600 mt-1">Health Communication</div>
                    <div className="text-xs text-gray-500 mt-1">2021</div>
                  </a>
                </div>
                <div className="space-y-2">
                  <a href="https://www.icmr.gov.in/guidelines.html" target="_blank" rel="noopener noreferrer" className="block p-3 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors">
                    <div className="text-xs font-medium text-blue-900">ICMR Guidelines</div>
                    <div className="text-xs text-blue-600 mt-1">Disease Containment</div>
                    <div className="text-xs text-gray-500 mt-1">Latest</div>
                  </a>
                  <a href="https://www.fao.org/emergencies/emergency-types/plant-pests/en/" target="_blank" rel="noopener noreferrer" className="block p-3 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors">
                    <div className="text-xs font-medium text-blue-900">FAO Resources</div>
                    <div className="text-xs text-blue-600 mt-1">Plant Health</div>
                    <div className="text-xs text-gray-500 mt-1">Global</div>
                  </a>
                </div>
                <div className="space-y-2">
                  <a href="https://www.icar.org.in/" target="_blank" rel="noopener noreferrer" className="block p-3 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors">
                    <div className="text-xs font-medium text-blue-900">ICAR Research</div>
                    <div className="text-xs text-blue-600 mt-1">Agricultural Science</div>
                    <div className="text-xs text-gray-500 mt-1">India</div>
                  </a>
                  <a href="https://www.nhm.gov.in/" target="_blank" rel="noopener noreferrer" className="block p-3 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors">
                    <div className="text-xs font-medium text-blue-900">NHM Portal</div>
                    <div className="text-xs text-blue-600 mt-1">Health Mission</div>
                    <div className="text-xs text-gray-500 mt-1">India</div>
                  </a>
                </div>
              </div>
            </div>

            {/* Online Training & Certification */}
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <h4 className="text-sm font-semibold text-purple-800 mb-3 flex items-center">
                <span className="text-green-600 mr-2">🌐</span> Online Training & Certification
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <a href="https://www.coursera.org/learn/public-health-crisis-management" target="_blank" rel="noopener noreferrer" className="block p-3 bg-green-50 rounded-lg border border-green-100 hover:bg-green-100 transition-colors">
                    <div className="text-xs font-medium text-green-900">Public Health Crisis</div>
                    <div className="text-xs text-green-600 mt-1">Crisis Management</div>
                    <div className="text-xs text-gray-500 mt-1">Coursera - Free</div>
                  </a>
                  <a href="https://www.edx.org/learn/public-health" target="_blank" rel="noopener noreferrer" className="block p-3 bg-green-50 rounded-lg border border-green-100 hover:bg-green-100 transition-colors">
                    <div className="text-xs font-medium text-green-900">edX Courses</div>
                    <div className="text-xs text-green-600 mt-1">Public Health</div>
                    <div className="text-xs text-gray-500 mt-1">Multiple</div>
                  </a>
                </div>
                <div className="space-y-2">
                  <a href="https://www.swayam.gov.in/nd1_noc20_cs31/preview" target="_blank" rel="noopener noreferrer" className="block p-3 bg-green-50 rounded-lg border border-green-100 hover:bg-green-100 transition-colors">
                    <div className="text-xs font-medium text-green-900">SWAYAM Training</div>
                    <div className="text-xs text-green-600 mt-1">Health Worker</div>
                    <div className="text-xs text-gray-500 mt-1">Gov of India</div>
                  </a>
                  <a href="https://diksha.gov.in/" target="_blank" rel="noopener noreferrer" className="block p-3 bg-green-50 rounded-lg border border-green-100 hover:bg-green-100 transition-colors">
                    <div className="text-xs font-medium text-green-900">DIKSHA Platform</div>
                    <div className="text-xs text-green-600 mt-1">Digital Learning</div>
                    <div className="text-xs text-gray-500 mt-1">India</div>
                  </a>
                </div>
                <div className="space-y-2">
                  <a href="https://www.unicef.org/india/what-we-do/health" target="_blank" rel="noopener noreferrer" className="block p-3 bg-green-50 rounded-lg border border-green-100 hover:bg-green-100 transition-colors">
                    <div className="text-xs font-medium text-green-900">UNICEF Training</div>
                    <div className="text-xs text-green-600 mt-1">Rural Health</div>
                    <div className="text-xs text-gray-500 mt-1">UNICEF India</div>
                  </a>
                  <a href="https://www.who.int/teams/health-workforce" target="_blank" rel="noopener noreferrer" className="block p-3 bg-green-50 rounded-lg border border-green-100 hover:bg-green-100 transition-colors">
                    <div className="text-xs font-medium text-green-900">WHO Academy</div>
                    <div className="text-xs text-green-600 mt-1">Health Workforce</div>
                    <div className="text-xs text-gray-500 mt-1">Global</div>
                  </a>
                </div>
              </div>
            </div>

            {/* Mobile Apps & Digital Tools */}
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <h4 className="text-sm font-semibold text-purple-800 mb-3 flex items-center">
                <span className="text-orange-600 mr-2">📱</span> Mobile Apps & Digital Tools
              </h4>
              <div className="grid grid-cols-4 gap-3">
                <a href="https://play.google.com/store/apps/details?id=in.gov.aarogyasetu&hl=en_IN" target="_blank" rel="noopener noreferrer" className="block p-3 bg-orange-50 rounded-lg border border-orange-100 hover:bg-orange-100 transition-colors">
                  <div className="text-xs font-medium text-orange-900">Aarogya Setu</div>
                  <div className="text-xs text-orange-600 mt-1">Contact Tracing</div>
                  <div className="text-xs text-gray-500 mt-1">Gov of India</div>
                </a>
                <a href="https://play.google.com/store/apps/details?id=com.mohfw.fw" target="_blank" rel="noopener noreferrer" className="block p-3 bg-orange-50 rounded-lg border border-orange-100 hover:bg-orange-100 transition-colors">
                  <div className="text-xs font-medium text-orange-900">Health Ministry</div>
                  <div className="text-xs text-orange-600 mt-1">Official App</div>
                  <div className="text-xs text-gray-500 mt-1">MOHFW</div>
                </a>
                <a href="https://www.kisan.gov.in/" target="_blank" rel="noopener noreferrer" className="block p-3 bg-orange-50 rounded-lg border border-orange-100 hover:bg-orange-100 transition-colors">
                  <div className="text-xs font-medium text-orange-900">Kisan Suvidha</div>
                  <div className="text-xs text-orange-600 mt-1">Farmer Support</div>
                  <div className="text-xs text-gray-500 mt-1">Agriculture</div>
                </a>
                <a href="https://mkisan.gov.in/" target="_blank" rel="noopener noreferrer" className="block p-3 bg-orange-50 rounded-lg border border-orange-100 hover:bg-orange-100 transition-colors">
                  <div className="text-xs font-medium text-orange-900">mKisan Portal</div>
                  <div className="text-xs text-orange-600 mt-1">SMS Service</div>
                  <div className="text-xs text-gray-500 mt-1">Farmers</div>
                </a>
              </div>
            </div>

            {/* Helpline & Support Numbers */}
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <h4 className="text-sm font-semibold text-purple-800 mb-3 flex items-center">
                <span className="text-red-600 mr-2">📞</span> Helpline & Support Numbers
              </h4>
              <div className="grid grid-cols-4 gap-3">
                <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                  <div className="text-xs font-medium text-red-900">National Health</div>
                  <div className="text-lg font-bold text-red-600">108</div>
                  <div className="text-xs text-red-600">Emergency</div>
                </div>
                <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                  <div className="text-xs font-medium text-red-900">COVID-19</div>
                  <div className="text-lg font-bold text-red-600">1075</div>
                  <div className="text-xs text-red-600">Helpline</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                  <div className="text-xs font-medium text-green-900">Agriculture</div>
                  <div className="text-lg font-bold text-green-600">1800-180-1551</div>
                  <div className="text-xs text-green-600">Support</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="text-xs font-medium text-blue-900">Mental Health</div>
                  <div className="text-lg font-bold text-blue-600">080-46110007</div>
                  <div className="text-xs text-blue-600">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Officer Accountability Footer */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 shadow-sm rounded-xl overflow-hidden">
          <div className="bg-amber-100 px-6 py-3 border-b border-amber-300">
            <h3 className="text-sm text-amber-900">Officer Responsibility & Accountability</h3>
          </div>
          <div className="p-6">
            <p className="text-sm text-amber-900 leading-relaxed">
              All visualizations provide <strong>decision support signals only</strong>. Officers must verify critical data 
              through field visits, apply local knowledge and contextual understanding, and exercise independent judgment 
              before approving any containment action. Visualizations enhance understanding but do not replace human 
              oversight, accountability, and the responsibility to balance disease control with farmer welfare and 
              economic stability. Every decision is logged and auditable.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
