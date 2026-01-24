import React from 'react';
import { User, Users, MapPin, TrendingUp, ArrowRight } from 'lucide-react';

type AssessmentScopeType = 'single-farmer' | 'village-cluster';

interface AssessmentScopeProps {
  onScopeSelect: (scope: AssessmentScopeType) => void;
}

export default function AssessmentScope({ onScopeSelect }: AssessmentScopeProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {/* Single Farmer Option */}
      <div 
        className="bg-white border-2 border-blue-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-blue-400 hover:scale-105 group"
        onClick={() => onScopeSelect('single-farmer')}
      >
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
            <User className="w-6 h-6 text-white" />
          </div>
          <h3 className="ml-3 text-xl font-bold text-gray-800">Single Farmer Analysis</h3>
        </div>
        
        <p className="text-gray-600 mb-4">
          Individual field-level disease detection and containment recommendations for specific farmers.
        </p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-700">
            <MapPin className="w-4 h-4 mr-2 text-blue-500" />
            <span>Precise location targeting</span>
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <TrendingUp className="w-4 h-4 mr-2 text-blue-500" />
            <span>Detailed individual impact analysis</span>
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <User className="w-4 h-4 mr-2 text-blue-500" />
            <span>Personalized recommendations</span>
          </div>
        </div>
        
        <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
          <span>Select This Scope</span>
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* Village Cluster Option */}
      <div 
        className="bg-white border-2 border-purple-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-purple-400 hover:scale-105 group"
        onClick={() => onScopeSelect('village-cluster')}
      >
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h3 className="ml-3 text-xl font-bold text-gray-800">Village Cluster Analysis</h3>
        </div>
        
        <p className="text-gray-600 mb-4">
          Multi-farmer aggregation for coordinated response and regional disease surveillance.
        </p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-700">
            <MapPin className="w-4 h-4 mr-2 text-purple-500" />
            <span>Regional risk assessment</span>
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <TrendingUp className="w-4 h-4 mr-2 text-purple-500" />
            <span>Aggregated impact analysis</span>
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <Users className="w-4 h-4 mr-2 text-purple-500" />
            <span>Coordinated containment strategies</span>
          </div>
        </div>
        
        <div className="flex items-center text-purple-600 font-semibold group-hover:text-purple-700 transition-colors">
          <span>Select This Scope</span>
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
}
