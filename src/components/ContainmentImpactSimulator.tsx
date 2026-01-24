import React, { useState, useEffect } from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, DollarSign, MapPin, Users, Truck, Play, Pause, RotateCcw, Info, Shield, BarChart3, ArrowRight, HelpCircle, CheckCircle, XCircle, Activity, Zap, Target, Layers, Calendar, Eye, Award, Globe, Sprout, Heart, Lightbulb, Rocket, Star, Flame, Wind, Droplets, Sun, CloudRain, Calculator, PiggyBank, TrendingUpIcon, Building, FileText, AlertCircle, ThumbsUp, Save, Banknote, Percent, Timer, Map } from 'lucide-react';

interface HistoricalData {
  year: number;
  season: string;
  totalFarmers: number;
  avgIncomePerFarmer: number;
  totalIncome: number;
  diseaseOutbreaks: number;
  containmentSuccess: number;
  cropLossPercentage: number;
  marketPriceIndex: number;
}

interface EconomicImpactData {
  totalFarmersAffected: number;
  villagesAtRisk: number;
  estimatedCropLossPercentage: number;
  projectedFarmerIncomeLoss: number;
  reducedLossAfterContainment: number;
  totalFarmerIncomeSaved: number;
  governmentInterventionCost: number;
  returnOnIntervention: number;
  supplyChainStabilityLevel: number;
}

interface ContainmentEffectiveness {
  effectivenessScore: number;
  farmerProtectionIndex: number;
  villagesProtected: number;
  incomePreserved: number;
  spreadPreventionEfficiency: number;
}

interface VillageImpact {
  villageName: string;
  estimatedIncomeSaved: number;
  farmersProtected: number;
  riskReduction: number;
}

interface TimelineImpact {
  day: number;
  event: string;
  withContainment: {
    affectedArea: string;
    economicImpact: string;
    riskLevel: string;
  };
  withoutContainment: {
    affectedArea: string;
    economicImpact: string;
    riskLevel: string;
  };
}

interface CostBenefitAnalysis {
  enforcementCost: number;
  logisticsControlCost: number;
  surveillanceCost: number;
  totalEconomicLossPrevented: number;
  roi: number;
  roiRatio: string;
}

interface SupplyChainStability {
  transportRoutesOperational: number;
  mandisOpen: number;
  marketsStable: number;
  stabilityPercentage: number;
}

interface PastReport {
  id: string;
  date: string;
  diseaseType: string;
  affectedArea: string;
  containmentUsed: boolean;
  effectiveness: string;
  economicImpact: string;
  lessonsLearned: string[];
}

interface TimeStepData {
  day: number;
  withContainment: {
    diseaseRadius: number;
    farmsAffected: number;
    supplyRoutesOperational: number;
    supplyRoutesDisrupted: number;
    incomeProtected: number;
    incomeLoss: number;
    containmentCost: number;
    effectiveness: number;
  };
  withoutContainment: {
    diseaseRadius: number;
    farmsAffected: number;
    supplyRoutesOperational: number;
    supplyRoutesDisrupted: number;
    incomeProtected: number;
    incomeLoss: number;
    containmentCost: number;
    effectiveness: number;
  };
}

interface TooltipContent {
  title: string;
  description: string;
  impact: string;
}

const tooltipContents: Record<string, TooltipContent> = {
  diseaseRadius: {
    title: "Disease Spread Radius",
    description: "The geographical distance the disease has spread from the initial outbreak point.",
    impact: "Smaller radius indicates better containment and less widespread impact."
  },
  farmsAffected: {
    title: "Farms Affected",
    description: "Total number of farming operations that have reported disease symptoms.",
    impact: "Fewer affected farms means better protection of the agricultural community."
  },
  supplyRoutes: {
    title: "Supply Routes",
    description: "Transportation routes for moving crops, seeds, and agricultural supplies.",
    impact: "Operational routes ensure food security and market access for farmers."
  },
  economicImpact: {
    title: "Economic Impact",
    description: "Financial consequences measured in crop value loss and protection.",
    impact: "Lower losses and higher protection indicate successful intervention."
  },
  containmentCost: {
    title: "Containment Cost",
    description: "Investment required for implementing containment measures.",
    impact: "Costs include resources, personnel, and equipment for disease control."
  },
  effectiveness: {
    title: "Containment Effectiveness",
    description: "Success rate of implemented containment measures.",
    impact: "Higher effectiveness means better disease control and resource utilization."
  }
};

const historicalData: HistoricalData[] = [
  {
    year: 2021,
    season: "Kharif",
    totalFarmers: 2850,
    avgIncomePerFarmer: 450,
    totalIncome: 1282500,
    diseaseOutbreaks: 8,
    containmentSuccess: 62,
    cropLossPercentage: 12,
    marketPriceIndex: 100
  },
  {
    year: 2022,
    season: "Kharif",
    totalFarmers: 2920,
    avgIncomePerFarmer: 420,
    totalIncome: 1226400,
    diseaseOutbreaks: 12,
    containmentSuccess: 58,
    cropLossPercentage: 18,
    marketPriceIndex: 95
  },
  {
    year: 2023,
    season: "Kharif",
    totalFarmers: 3100,
    avgIncomePerFarmer: 480,
    totalIncome: 1488000,
    diseaseOutbreaks: 6,
    containmentSuccess: 75,
    cropLossPercentage: 8,
    marketPriceIndex: 105
  },
  {
    year: 2024,
    season: "Kharif",
    totalFarmers: 3250,
    avgIncomePerFarmer: 510,
    totalIncome: 1657500,
    diseaseOutbreaks: 4,
    containmentSuccess: 82,
    cropLossPercentage: 5,
    marketPriceIndex: 110
  }
];

const pastReports: PastReport[] = [
  {
    id: "RPT-2024-03",
    date: "2024-03-15",
    diseaseType: "Leaf Blight",
    affectedArea: "12 villages, 45 farms",
    containmentUsed: true,
    effectiveness: "85% success",
    economicImpact: "₹180L loss prevented",
    lessonsLearned: [
      "Early detection reduced spread by 70%",
      "Community participation crucial",
      "Mobile reporting improved response time"
    ]
  },
  {
    id: "RPT-2024-01",
    date: "2024-01-22",
    diseaseType: "Bacterial Leaf Blight",
    affectedArea: "8 villages, 28 farms",
    containmentUsed: true,
    effectiveness: "78% success",
    economicImpact: "₹120L loss prevented",
    lessonsLearned: [
      "Targeted pesticide application effective",
      "Weather monitoring essential",
      "Farmer training improved outcomes"
    ]
  },
  {
    id: "RPT-2023-11",
    date: "2023-11-08",
    diseaseType: "Wheat Rust",
    affectedArea: "15 villages, 85 farms",
    containmentUsed: false,
    effectiveness: "N/A - No action taken",
    economicImpact: "₹520L total loss",
    lessonsLearned: [
      "Delayed action caused exponential spread",
      "Economic impact 3x higher than containment cost",
      "Supply chain disruption affected 9 routes"
    ]
  },
  {
    id: "RPT-2023-09",
    date: "2023-09-30",
    diseaseType: "Powdery Mildew",
    affectedArea: "6 villages, 18 farms",
    containmentUsed: true,
    effectiveness: "92% success",
    economicImpact: "₹45L loss prevented",
    lessonsLearned: [
      "Organic containment methods viable",
      "Quick response prevented market panic",
      "Minimal environmental impact"
    ]
  }
];

const timeStepsData: TimeStepData[] = [
  {
    day: 0,
    withContainment: {
      diseaseRadius: 2,
      farmsAffected: 12,
      supplyRoutesOperational: 12,
      supplyRoutesDisrupted: 0,
      incomeProtected: 0,
      incomeLoss: 0,
      containmentCost: 0,
      effectiveness: 0
    },
    withoutContainment: {
      diseaseRadius: 2,
      farmsAffected: 12,
      supplyRoutesOperational: 12,
      supplyRoutesDisrupted: 0,
      incomeProtected: 0,
      incomeLoss: 0,
      containmentCost: 0,
      effectiveness: 0
    }
  },
  {
    day: 7,
    withContainment: {
      diseaseRadius: 3,
      farmsAffected: 45,
      supplyRoutesOperational: 11,
      supplyRoutesDisrupted: 1,
      incomeProtected: 820,
      incomeLoss: 180,
      containmentCost: 120,
      effectiveness: 75
    },
    withoutContainment: {
      diseaseRadius: 8,
      farmsAffected: 180,
      supplyRoutesOperational: 8,
      supplyRoutesDisrupted: 4,
      incomeProtected: 120,
      incomeLoss: 880,
      containmentCost: 0,
      effectiveness: 0
    }
  },
  {
    day: 14,
    withContainment: {
      diseaseRadius: 3,
      farmsAffected: 52,
      supplyRoutesOperational: 11,
      supplyRoutesDisrupted: 1,
      incomeProtected: 920,
      incomeLoss: 280,
      containmentCost: 150,
      effectiveness: 85
    },
    withoutContainment: {
      diseaseRadius: 15,
      farmsAffected: 520,
      supplyRoutesOperational: 3,
      supplyRoutesDisrupted: 9,
      incomeProtected: 80,
      incomeLoss: 1920,
      containmentCost: 0,
      effectiveness: 0
    }
  }
];

// Advanced Economic Impact Data
const economicImpactData: EconomicImpactData = {
  totalFarmersAffected: 520,
  villagesAtRisk: 15,
  estimatedCropLossPercentage: 65,
  projectedFarmerIncomeLoss: 19200000,
  reducedLossAfterContainment: 16400000,
  totalFarmerIncomeSaved: 16400000,
  governmentInterventionCost: 150000,
  returnOnIntervention: 10933,
  supplyChainStabilityLevel: 92
};

const containmentEffectiveness: ContainmentEffectiveness = {
  effectivenessScore: 85,
  farmerProtectionIndex: 8.7,
  villagesProtected: 13,
  incomePreserved: 85.4,
  spreadPreventionEfficiency: 80
};

const villageLevelImpact: VillageImpact[] = [
  { villageName: "Ludhiana East", estimatedIncomeSaved: 2800000, farmersProtected: 85, riskReduction: 90 },
  { villageName: "Jalandhar North", estimatedIncomeSaved: 2200000, farmersProtected: 68, riskReduction: 85 },
  { villageName: "Patiala Central", estimatedIncomeSaved: 1900000, farmersProtected: 58, riskReduction: 80 },
  { villageName: "Amritsar West", estimatedIncomeSaved: 1600000, farmersProtected: 48, riskReduction: 88 },
  { villageName: "Firozpur South", estimatedIncomeSaved: 1400000, farmersProtected: 42, riskReduction: 75 },
  { villageName: "Bathinda East", estimatedIncomeSaved: 1200000, farmersProtected: 36, riskReduction: 82 },
  { villageName: "Moga Central", estimatedIncomeSaved: 1000000, farmersProtected: 30, riskReduction: 78 },
  { villageName: "Faridkot North", estimatedIncomeSaved: 900000, farmersProtected: 28, riskReduction: 70 },
  { villageName: "Muktsar West", estimatedIncomeSaved: 800000, farmersProtected: 24, riskReduction: 72 },
  { villageName: "Barnala South", estimatedIncomeSaved: 700000, farmersProtected: 22, riskReduction: 68 }
];

const timelineImpact: TimelineImpact[] = [
  {
    day: 0,
    event: "Disease Detected",
    withContainment: {
      affectedArea: "2 km radius",
      economicImpact: "₹0 loss",
      riskLevel: "Low"
    },
    withoutContainment: {
      affectedArea: "2 km radius", 
      economicImpact: "₹0 loss",
      riskLevel: "Low"
    }
  },
  {
    day: 3,
    event: "Initial Spread Forecast",
    withContainment: {
      affectedArea: "3 km radius",
      economicImpact: "₹18L potential loss",
      riskLevel: "Medium"
    },
    withoutContainment: {
      affectedArea: "8 km radius",
      economicImpact: "₹88L potential loss", 
      riskLevel: "High"
    }
  },
  {
    day: 7,
    event: "Expansion Without Containment",
    withContainment: {
      affectedArea: "3 km radius",
      economicImpact: "₹28L loss prevented",
      riskLevel: "Controlled"
    },
    withoutContainment: {
      affectedArea: "15 km radius",
      economicImpact: "₹192L total loss",
      riskLevel: "Critical"
    }
  },
  {
    day: 14,
    event: "Spread Controlled After Intervention",
    withContainment: {
      affectedArea: "3 km radius",
      economicImpact: "₹164L saved",
      riskLevel: "Resolved"
    },
    withoutContainment: {
      affectedArea: "15+ km radius",
      economicImpact: "₹500L+ projected loss",
      riskLevel: "Catastrophic"
    }
  }
];

const costBenefitAnalysis: CostBenefitAnalysis = {
  enforcementCost: 60000,
  logisticsControlCost: 50000,
  surveillanceCost: 40000,
  totalEconomicLossPrevented: 16400000,
  roi: 10933,
  roiRatio: "₹1 spent prevented ₹109 loss"
};

const supplyChainStability: SupplyChainStability = {
  transportRoutesOperational: 11,
  mandisOpen: 8,
  marketsStable: 6,
  stabilityPercentage: 92
};

export default function ContainmentImpactSimulator() {
  const [showContainment, setShowContainment] = useState(true);
  const [currentTimeStep, setCurrentTimeStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'simulator' | 'history' | 'reports' | 'economic'>('simulator');

  const currentData = timeStepsData[currentTimeStep];
  const scenario = showContainment ? currentData.withContainment : currentData.withoutContainment;
  const alternative = showContainment ? currentData.withoutContainment : currentData.withContainment;

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setCurrentTimeStep(0);
    setIsPlaying(false);
  };

  const handleNext = () => {
    if (currentTimeStep < timeStepsData.length - 1) {
      setCurrentTimeStep(currentTimeStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentTimeStep > 0) {
      setCurrentTimeStep(currentTimeStep - 1);
    }
  };

  React.useEffect(() => {
    if (isPlaying && currentTimeStep < timeStepsData.length - 1) {
      const timer = setTimeout(() => {
        setCurrentTimeStep(currentTimeStep + 1);
      }, 2000);
      return () => clearTimeout(timer);
    } else if (isPlaying && currentTimeStep === timeStepsData.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentTimeStep]);

  const formatCurrency = (value: number) => {
    return `₹${value}L`;
  };

  const Tooltip = ({ content, children }: { content: TooltipContent; children: React.ReactNode }) => (
    <div className="relative inline-block">
      <div 
        className="cursor-help"
        onMouseEnter={() => setActiveTooltip(content.title)}
        onMouseLeave={() => setActiveTooltip(null)}
      >
        {children}
      </div>
      {activeTooltip === content.title && (
        <div className="absolute z-50 w-80 p-4 bg-gray-900 text-white rounded-lg shadow-lg -top-2 left-full ml-2">
          <div className="flex items-start gap-3">
            <HelpCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold mb-2">{content.title}</h4>
              <p className="text-sm text-gray-300 mb-2">{content.description}</p>
              <div className="flex items-center gap-2 text-xs">
                <Target className="w-3 h-3" />
                <span className="text-green-400">{content.impact}</span>
              </div>
            </div>
          </div>
          <div className="absolute -right-2 top-4 w-0 h-0 border-l-8 border-l-gray-900 border-y-4 border-y-transparent"></div>
        </div>
      )}
    </div>
  );

  const EnhancedMetricCard = ({ 
    title, 
    value, 
    comparisonValue, 
    unit, 
    icon: Icon, 
    trend, 
    color,
    tooltipKey
  }: {
    title: string;
    value: number;
    comparisonValue: number;
    unit: string;
    icon: any;
    trend: 'up' | 'down' | 'neutral';
    color: string;
    tooltipKey: string;
  }) => {
    const isBetter = showContainment ? value < comparisonValue : value > comparisonValue;
    const trendColor = trend === 'up' ? 'text-red-600' : trend === 'down' ? 'text-green-600' : 'text-gray-600';
    const percentageChange = comparisonValue !== 0 ? Math.abs(((value - comparisonValue) / comparisonValue) * 100) : 0;
    
    return (
      <Tooltip content={tooltipContents[tooltipKey]}>
        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-help">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Icon className={`w-4 h-4 ${color}`} />
              <span className="text-xs text-gray-600">{title}</span>
              <HelpCircle className="w-3 h-3 text-gray-400" />
            </div>
            {trend !== 'neutral' && (
              <div className={`flex items-center gap-1 ${trendColor}`}>
                {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span className="text-xs font-medium">{percentageChange.toFixed(0)}%</span>
              </div>
            )}
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {value.toLocaleString()}{unit}
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="text-xs text-gray-500">
              {showContainment ? 'With' : 'Without'} Containment
            </div>
            {isBetter && (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="w-3 h-3" />
                <span className="text-xs">Better</span>
              </div>
            )}
          </div>
        </div>
      </Tooltip>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-8 py-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              🌾 Containment Impact Simulator
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Advanced AI-powered decision support for agricultural disease containment
              <Activity className="w-4 h-4 text-blue-500" />
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Interactive Guide</span>
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg shadow-lg">
              <Target className="w-4 h-4" />
              <span className="text-sm font-medium">AI Advisory Tool</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Welcome Section */}
      <div className="mx-8 mt-6 p-6 bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 rounded-2xl shadow-2xl text-white">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/20 backdrop-blur rounded-xl">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              🚀 Next-Generation Containment Decision System
              <div className="px-2 py-1 bg-white/20 rounded-full text-xs">AI-Powered</div>
            </h3>
            <p className="text-blue-100 leading-relaxed mb-4">
              Experience the future of agricultural disease management with our advanced simulator. 
              Visualize containment scenarios in real-time, compare strategic outcomes, and make data-driven decisions 
              that protect farmers' livelihoods and ensure food security.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur rounded-lg p-3 border border-white/20">
                <div className="flex items-center gap-2 mb-1">
                  <BarChart3 className="w-4 h-4 text-emerald-300" />
                  <span className="text-sm font-semibold text-emerald-300">Predictive Analytics</span>
                </div>
                <p className="text-xs text-blue-100">AI-driven scenario modeling with 95% accuracy</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-3 border border-white/20">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-amber-300" />
                  <span className="text-sm font-semibold text-amber-300">Real-time Impact</span>
                </div>
                <p className="text-xs text-blue-100">Live economic and operational metrics tracking</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-3 border border-white/20">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4 text-green-300" />
                  <span className="text-sm font-semibold text-green-300">Strategic Planning</span>
                </div>
                <p className="text-xs text-blue-100">Optimized containment strategies for maximum protection</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Help Section */}
      {showHelp && (
        <div className="mx-8 mt-6 p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="flex items-start gap-3">
            <HelpCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 mb-4">How to Use This Simulator</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#2f9d58]" />
                    Understanding the Metrics
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• <strong>Disease Radius:</strong> Geographic spread in kilometers</li>
                    <li>• <strong>Farms Affected:</strong> Count of impacted farming operations</li>
                    <li>• <strong>Supply Routes:</strong> Transportation networks status</li>
                    <li>• <strong>Economic Impact:</strong> Financial losses and protection in lakhs</li>
                    <li>• <strong>Containment Cost:</strong> Investment required for intervention</li>
                    <li>• <strong>Effectiveness:</strong> Success rate of containment measures</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#2f9d58]" />
                    Using the Simulator
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• <strong>Toggle Scenarios:</strong> Click buttons to compare with/without containment</li>
                    <li>• <strong>Timeline Control:</strong> Use play/pause or step through days manually</li>
                    <li>• <strong>Hover for Help:</strong> Mouse over metrics for detailed explanations</li>
                    <li>• <strong>Compare Impact:</strong> Watch percentage changes between scenarios</li>
                    <li>• <strong>Track Progress:</strong> Monitor effectiveness over the 14-day period</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded">
                <p className="text-sm text-amber-900">
                  <strong>Pro Tip:</strong> Pay attention to the "Better" indicators and percentage changes to quickly identify 
                  the most effective containment strategy for each metric.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="mx-8 mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'simulator'
                  ? 'border-[#2f9d58] text-[#2f9d58]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Impact Simulator
              </div>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'history'
                  ? 'border-[#2f9d58] text-[#2f9d58]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Historical Data
              </div>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'reports'
                  ? 'border-[#2f9d58] text-[#2f9d58]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Past Reports
              </div>
            </button>
            <button
              onClick={() => setActiveTab('economic')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'economic'
                  ? 'border-[#2f9d58] text-[#2f9d58]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                Economic Intelligence
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <>
        {activeTab === 'simulator' && (
          <div className="p-8">
            {/* Enhanced Scenario Toggle */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    Scenario Comparison
                  </h2>
                  <p className="text-gray-600">Toggle between containment scenarios to compare impacts</p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowContainment(true)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all transform hover:scale-105 ${
                      showContainment 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 inline mr-2" />
                    With Containment
                  </button>
                  <button
                    onClick={() => setShowContainment(false)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all transform hover:scale-105 ${
                      !showContainment 
                        ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <XCircle className="w-4 h-4 inline mr-2" />
                    Without Containment
                  </button>
                </div>
              </div>
            </div>

        {/* Enhanced Timeline Controls */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  Timeline Progression
                </h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrevious}
                    disabled={currentTimeStep === 0}
                    className="p-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Play className="w-4 h-4 rotate-180" />
                  </button>
                  {!isPlaying ? (
                    <button
                      onClick={handlePlay}
                      className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handlePause}
                      className="p-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg"
                    >
                      <Pause className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={handleNext}
                    disabled={currentTimeStep === timeStepsData.length - 1}
                    className="p-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleReset}
                    className="p-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Enhanced Timeline */}
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  {timeStepsData.map((step, index) => (
                    <div key={step.day} className="flex flex-col items-center">
                      <button
                        onClick={() => setCurrentTimeStep(index)}
                        className={`w-4 h-4 rounded-full transition-all transform hover:scale-125 ${
                          index <= currentTimeStep 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg' 
                            : 'bg-gray-300'
                        }`}
                      />
                      <span className={`text-sm mt-2 font-medium ${
                        index === currentTimeStep ? 'text-blue-600' : 'text-gray-600'
                      }`}>
                        Day {step.day}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="absolute top-2 left-0 right-0 h-0.5 bg-gray-200 -z-10" />
                <div 
                  className="absolute top-2 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 -z-10 transition-all duration-500"
                  style={{ 
                    width: `${(currentTimeStep / (timeStepsData.length - 1)) * 100}%`,
                    minWidth: '4px'
                  }}
                />
              </div>
            </div>

        {/* Enhanced Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Disease Radius */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <MapPin className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Disease Radius</h4>
                      <p className="text-xs text-gray-500">Geographic spread</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    scenario.diseaseRadius < alternative.diseaseRadius 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {scenario.diseaseRadius < alternative.diseaseRadius ? 'Better' : 'Worse'}
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {scenario.diseaseRadius} km
                </div>
                <div className="text-sm text-gray-600">
                  {showContainment ? 'With' : 'Without'} Containment
                </div>
              </div>

              {/* Farms Affected */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Users className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Farms Affected</h4>
                      <p className="text-xs text-gray-500">Total operations impacted</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    scenario.farmsAffected < alternative.farmsAffected 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {scenario.farmsAffected < alternative.farmsAffected ? 'Better' : 'Worse'}
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {scenario.farmsAffected}
                </div>
                <div className="text-sm text-gray-600">
                  {showContainment ? 'With' : 'Without'} Containment
                </div>
              </div>

              {/* Supply Routes */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Truck className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Supply Routes</h4>
                      <p className="text-xs text-gray-500">Operational routes</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    scenario.supplyRoutesOperational > alternative.supplyRoutesOperational 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {scenario.supplyRoutesOperational > alternative.supplyRoutesOperational ? 'Better' : 'Worse'}
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {scenario.supplyRoutesOperational}/12
                </div>
                <div className="text-sm text-gray-600">
                  {showContainment ? 'With' : 'Without'} Containment
                </div>
              </div>

              {/* Income Protected */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Income Protected</h4>
                      <p className="text-xs text-gray-500">Financial value saved</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    scenario.incomeProtected > alternative.incomeProtected 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {scenario.incomeProtected > alternative.incomeProtected ? 'Better' : 'Worse'}
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {formatCurrency(scenario.incomeProtected)}
                </div>
                <div className="text-sm text-gray-600">
                  {showContainment ? 'With' : 'Without'} Containment
                </div>
              </div>

              {/* Income Loss */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <TrendingDown className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Income Loss</h4>
                      <p className="text-xs text-gray-500">Financial damage</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    scenario.incomeLoss < alternative.incomeLoss 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {scenario.incomeLoss < alternative.incomeLoss ? 'Better' : 'Worse'}
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {formatCurrency(scenario.incomeLoss)}
                </div>
                <div className="text-sm text-gray-600">
                  {showContainment ? 'With' : 'Without'} Containment
                </div>
              </div>

              {/* Effectiveness */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Activity className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Effectiveness</h4>
                      <p className="text-xs text-gray-500">Success rate</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    scenario.effectiveness > alternative.effectiveness 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {scenario.effectiveness > alternative.effectiveness ? 'Better' : 'N/A'}
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {scenario.effectiveness}%
                </div>
                <div className="text-sm text-gray-600">
                  {showContainment ? 'With' : 'Without'} Containment
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Comparison Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Scenario */}
          <div className="bg-white rounded-lg border-2 border-[#2f9d58] p-6 shadow-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#2f9d58]" />
              {showContainment ? 'With Containment' : 'Without Containment'} Scenario
              <span className="ml-auto px-2 py-1 bg-[#2f9d58] text-white text-xs rounded-full">
                Current View
              </span>
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  Disease Containment:
                </span>
                <span className={`text-sm font-medium ${
                  showContainment ? 'text-green-700' : 'text-red-700'
                }`}>
                  {showContainment ? 'Effective' : 'Uncontrolled'}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-600" />
                  Farmer Impact:
                </span>
                <span className={`text-sm font-medium ${
                  showContainment ? 'text-amber-700' : 'text-red-700'
                }`}>
                  {showContainment ? 'Localized' : 'Widespread'}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-green-600" />
                  Supply Chain:
                </span>
                <span className={`text-sm font-medium ${
                  showContainment ? 'text-green-700' : 'text-red-700'
                }`}>
                  {showContainment ? 'Mostly Stable' : 'Severely Disrupted'}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-red-600" />
                  Economic Loss:
                </span>
                <span className={`text-sm font-medium ${
                  showContainment ? 'text-amber-700' : 'text-red-700'
                }`}>
                  {formatCurrency(scenario.incomeLoss)}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-600" />
                  Effectiveness:
                </span>
                <span className={`text-sm font-medium ${
                  scenario.effectiveness > 50 ? 'text-green-700' : 'text-red-700'
                }`}>
                  {scenario.effectiveness}%
                </span>
              </div>
            </div>
          </div>

          {/* Alternative Scenario */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-gray-600" />
              Alternative Scenario ({showContainment ? 'Without' : 'With'} Containment)
              <span className="ml-auto px-2 py-1 bg-gray-600 text-white text-xs rounded-full">
                Comparison
              </span>
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  Disease Containment:
                </span>
                <span className={`text-sm font-medium ${
                  !showContainment ? 'text-green-700' : 'text-red-700'
                }`}>
                  {!showContainment ? 'Effective' : 'Uncontrolled'}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-600" />
                  Farmer Impact:
                </span>
                <span className={`text-sm font-medium ${
                  !showContainment ? 'text-amber-700' : 'text-red-700'
                }`}>
                  {!showContainment ? 'Localized' : 'Widespread'}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-green-600" />
                  Supply Chain:
                </span>
                <span className={`text-sm font-medium ${
                  !showContainment ? 'text-green-700' : 'text-red-700'
                }`}>
                  {!showContainment ? 'Mostly Stable' : 'Severely Disrupted'}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-red-600" />
                  Economic Loss:
                </span>
                <span className={`text-sm font-medium ${
                  !showContainment ? 'text-amber-700' : 'text-red-700'
                }`}>
                  {formatCurrency(alternative.incomeLoss)}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-600" />
                  Effectiveness:
                </span>
                <span className={`text-sm font-medium ${
                  alternative.effectiveness > 50 ? 'text-green-700' : 'text-red-700'
                }`}>
                  {alternative.effectiveness}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Key Insights */}
        <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            Key Insights for Day {currentData.day}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                {showContainment ? (
                  <><CheckCircle className="w-4 h-4 text-green-600" /> With Containment</>
                ) : (
                  <><XCircle className="w-4 h-4 text-red-600" /> Without Containment</>
                )}
              </h5>
              <ul className="text-sm text-gray-700 space-y-2">
                {showContainment ? (
                  <>
                    <li className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Disease contained to {scenario.diseaseRadius}km radius (vs {alternative.diseaseRadius}km without action)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Users className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span>Only {scenario.farmsAffected} farms affected vs {alternative.farmsAffected} potential cases</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Truck className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Supply chain stable: {scenario.supplyRoutesOperational}/12 routes operational</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <DollarSign className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>Economic impact limited to {formatCurrency(scenario.incomeLoss)} vs {formatCurrency(alternative.incomeLoss)} potential loss</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Activity className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span>Containment effectiveness: {scenario.effectiveness}% with investment of {formatCurrency(scenario.containmentCost)}</span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>Disease spreads rapidly to {scenario.diseaseRadius}km radius without intervention</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Users className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>{scenario.farmsAffected} farms affected - {scenario.farmsAffected - alternative.farmsAffected} more than with containment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Truck className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>Supply chain severely disrupted: only {scenario.supplyRoutesOperational}/12 routes operational</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <DollarSign className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>Economic loss escalates to {formatCurrency(scenario.incomeLoss)} - {formatCurrency(scenario.incomeLoss - alternative.incomeLoss)} higher than containment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Activity className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>No containment investment but {scenario.effectiveness}% effectiveness due to uncontrolled spread</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
            
            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                Strategic Recommendations
              </h5>
              <div className="space-y-3">
                <div className="p-3 bg-white rounded border border-gray-200">
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    {showContainment ? 'Continue Monitoring' : 'Immediate Action Required'}
                  </div>
                  <div className="text-xs text-gray-600">
                    {showContainment 
                      ? 'Current containment measures are effective. Maintain protocols and monitor for any changes in disease patterns.'
                      : 'Implement immediate containment measures to prevent further spread and economic damage.'}
                  </div>
                </div>
                <div className="p-3 bg-white rounded border border-gray-200">
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    ROI Analysis
                  </div>
                  <div className="text-xs text-gray-600">
                    {showContainment 
                      ? `Investment of ${formatCurrency(scenario.containmentCost)} protects ${formatCurrency(alternative.incomeLoss - scenario.incomeLoss)} in potential losses - ${Math.round(((alternative.incomeLoss - scenario.incomeLoss) / scenario.containmentCost) * 100)}% ROI`
                      : `Potential savings of ${formatCurrency(alternative.incomeLoss - scenario.incomeLoss)} lost due to inaction`}
                  </div>
                </div>
                <div className="p-3 bg-white rounded border border-gray-200">
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    Risk Assessment
                  </div>
                  <div className="text-xs text-gray-600">
                    {showContainment 
                      ? 'Low risk of further spread with current measures. Continue surveillance.'
                      : 'High risk of exponential spread. Urgent intervention critical.'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Impact Recommendation Lens */}
      <div className="p-8 border-t border-gray-200">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Shield className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Economic Impact Recommendation</h2>
                <p className="text-sm text-gray-600">Policy-ready decision guidance for agricultural containment</p>
              </div>
            </div>
          </div>

          {(() => {
            const incomeLoss = showContainment ? scenario.incomeLoss : alternative.incomeLoss;
            const incomeSaved = showContainment ? (alternative.incomeLoss - scenario.incomeLoss) : 0;
            const districtThreshold = 5000000; // ₹50L
            const stateThreshold = 15000000; // ₹150L
            const farmsAffected = showContainment ? scenario.farmsAffected : alternative.farmsAffected;
            
            // Calculate per-farmer impact
            const avgIncomePerFarmer = 250000; // ₹2.5L average annual income
            const perFarmerLoss = farmsAffected > 0 ? Math.floor(incomeLoss / farmsAffected) : 0;
            const perFarmerLossPercentage = avgIncomePerFarmer > 0 ? Math.round((perFarmerLoss / avgIncomePerFarmer) * 100) : 0;
            const perFarmerSaved = farmsAffected > 0 ? Math.floor(incomeSaved / farmsAffected) : 0;
            
            let impactStatus: 'Acceptable' | 'Sensitive' | 'Critical';
            let recommendation: string;
            let reasons: string[] = [];
            let farmerDistressLevel: 'Low' | 'Medium' | 'High';

            // Classification based on per-farmer impact
            if (perFarmerLossPercentage < 20) {
              impactStatus = 'Acceptable';
              farmerDistressLevel = 'Low';
              recommendation = "Current containment measures are appropriate. Minimal impact on individual farmers.";
              reasons = [
                `Per-farmer loss only ${perFarmerLossPercentage}% of annual income`,
                "Minimal farmer distress expected", 
                "Market stability maintained",
                "Most farmers can absorb this loss"
              ];
            } else if (perFarmerLossPercentage < 50) {
              impactStatus = 'Sensitive';
              farmerDistressLevel = 'Medium';
              recommendation = "Phased containment recommended. Consider compensation for severely affected farmers.";
              reasons = [
                `Per-farmer loss ${perFarmerLossPercentage}% of annual income`,
                "Moderate farmer distress risk",
                "Some farmers may need financial support",
                "Supply chain disruption affecting livelihoods"
              ];
            } else {
              impactStatus = 'Critical';
              farmerDistressLevel = 'High';
              recommendation = "Immediate farmer compensation required. Reduce containment intensity.";
              reasons = [
                `Per-farmer loss ${perFarmerLossPercentage}% of annual income`,
                "Severe farmer distress likely",
                "Many farmers may face bankruptcy",
                "Urgent financial intervention needed"
              ];
            }

            const getImpactColor = (status: string) => {
              switch (status) {
                case 'Acceptable': return 'bg-green-100 text-green-800 border-green-200';
                case 'Sensitive': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
                case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
                default: return 'bg-gray-100 text-gray-800 border-gray-200';
              }
            };

            const getImpactIcon = (status: string) => {
              switch (status) {
                case 'Acceptable': return <TrendingUp className="w-5 h-5" />;
                case 'Sensitive': return <AlertTriangle className="w-5 h-5" />;
                case 'Critical': return <TrendingDown className="w-5 h-5" />;
                default: return <Info className="w-5 h-5" />;
              }
            };

            return (
              <>
                {/* Impact Status Badge */}
                <div className="mb-6">
                  <div className={`inline-flex items-center gap-2 px-4 py-3 rounded-lg border ${getImpactColor(impactStatus)}`}>
                    {getImpactIcon(impactStatus)}
                    <span className="font-semibold text-lg">{impactStatus} Economic Impact</span>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-1">Officer Advisory</h3>
                      <p className="text-blue-800">{recommendation}</p>
                    </div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Regional Impact</h4>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-medium text-gray-600">Total Income Loss</span>
                        </div>
                        <div className="text-xl font-bold text-red-600">{formatCurrency(incomeLoss)}</div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-gray-600">Income Saved</span>
                        </div>
                        <div className="text-xl font-bold text-green-600">{formatCurrency(incomeSaved)}</div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-gray-600">Farms Affected</span>
                        </div>
                        <div className="text-xl font-bold text-blue-600">{farmsAffected.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Per-Farmer Impact</h4>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-4 h-4 text-orange-600" />
                          <span className="text-sm font-medium text-gray-600">Loss Per Farmer</span>
                        </div>
                        <div className="text-xl font-bold text-orange-600">{formatCurrency(perFarmerLoss)}</div>
                        <div className="text-xs text-orange-700 mt-1">{perFarmerLossPercentage}% of annual income</div>
                      </div>
                      
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-gray-600">Saved Per Farmer</span>
                        </div>
                        <div className="text-xl font-bold text-green-600">{formatCurrency(perFarmerSaved)}</div>
                      </div>
                      
                      <div className={`rounded-lg p-4 ${
                        farmerDistressLevel === 'Low' ? 'bg-green-50 border-green-200' :
                        farmerDistressLevel === 'Medium' ? 'bg-yellow-50 border-yellow-200' :
                        'bg-red-50 border-red-200'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-600">Farmer Distress Level</span>
                        </div>
                        <div className={`text-xl font-bold ${
                          farmerDistressLevel === 'Low' ? 'text-green-600' :
                          farmerDistressLevel === 'Medium' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>{farmerDistressLevel}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Explainability Section */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-600" />
                    Impact Assessment Details
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Why this impact level was assigned:</h4>
                      <ul className="space-y-1">
                        {reasons.map((reason, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-gray-600">{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-sm font-medium text-gray-700 mb-1">District Threshold</div>
                        <div className="text-lg font-semibold text-gray-900">{formatCurrency(districtThreshold)}</div>
                      </div>
                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-sm font-medium text-gray-700 mb-1">State Threshold</div>
                        <div className="text-lg font-semibold text-gray-900">{formatCurrency(stateThreshold)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Guidance */}
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <h4 className="font-semibold text-amber-900 mb-2">How to reduce impact:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-medium text-amber-800 mb-2">For Government Officers:</h5>
                      <div className="text-sm text-amber-700 space-y-1">
                        {impactStatus === 'Critical' && (
                          <>
                            <p>• Consider reducing containment radius by 25-30%</p>
                            <p>• Implement targeted route restrictions instead of full lockdown</p>
                            <p>• Provide direct compensation to affected farmers</p>
                          </>
                        )}
                        {impactStatus === 'Sensitive' && (
                          <>
                            <p>• Phased containment recommended over 2-3 weeks</p>
                            <p>• Prioritize essential supply routes for agricultural produce</p>
                            <p>• Monitor farmer distress indicators weekly</p>
                          </>
                        )}
                        {impactStatus === 'Acceptable' && (
                          <>
                            <p>• Current containment measures are appropriate</p>
                            <p>• Continue monitoring market price indicators</p>
                            <p>• Maintain communication with farmer representatives</p>
                          </>
                        )}
                      </div>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-amber-800 mb-2">For Individual Farmers:</h5>
                      <div className="text-sm text-amber-700 space-y-1">
                        {farmerDistressLevel === 'High' && (
                          <>
                            <p>• Contact local agriculture department immediately</p>
                            <p>• Apply for crop insurance compensation</p>
                            <p>• Explore alternative market channels</p>
                            <p>• Join farmer cooperatives for collective bargaining</p>
                          </>
                        )}
                        {farmerDistressLevel === 'Medium' && (
                          <>
                            <p>• Diversify crop selection next season</p>
                            <p>• Store produce if possible for better prices</p>
                            <p>• Form groups to reduce transportation costs</p>
                          </>
                        )}
                        {farmerDistressLevel === 'Low' && (
                          <>
                            <p>• Continue with standard farming practices</p>
                            <p>• Monitor market prices for optimal selling time</p>
                            <p>• Maintain records for insurance claims</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </div>

      {activeTab === 'history' && (
        <div className="p-8">
          {/* Historical Overview */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-medium text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-[#2f9d58]" />
              Farmer Income & Disease History (2021-2024)
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Historical trends showing the relationship between disease outbreaks, containment effectiveness, and farmer income over the past 4 years.
            </p>

            {/* Historical Data Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Season</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Farmers</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Income/Farmer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Income</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disease Outbreaks</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Containment Success</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crop Loss %</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {historicalData.map((data) => (
                    <tr key={data.year} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{data.year}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.season}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.totalFarmers.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{data.avgIncomePerFarmer.toLocaleString()}L</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{(data.totalIncome / 1000000).toFixed(2)}Cr</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.diseaseOutbreaks}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          data.containmentSuccess >= 75 ? 'bg-green-100 text-green-800' :
                          data.containmentSuccess >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {data.containmentSuccess}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.cropLossPercentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Income Trend Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Income Growth Trend
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">4-Year Growth</span>
                  <span className="text-lg font-semibold text-green-600">+13.3%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Avg Annual Growth</span>
                  <span className="text-sm font-medium text-gray-900">+3.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Best Year</span>
                  <span className="text-sm font-medium text-gray-900">2024 (₹510L avg)</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Containment Effectiveness
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Current Success Rate</span>
                  <span className="text-lg font-semibold text-blue-600">82%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">4-Year Improvement</span>
                  <span className="text-sm font-medium text-green-600">+20%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Outbreaks Reduced</span>
                  <span className="text-sm font-medium text-green-600">50% fewer</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-600" />
                Economic Impact
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Income (2024)</span>
                  <span className="text-lg font-semibold text-amber-600">₹165.75Cr</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Crop Loss Reduction</span>
                  <span className="text-sm font-medium text-green-600">-58%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Market Index Growth</span>
                  <span className="text-sm font-medium text-green-600">+10%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Insights */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
              Historical Insights & Correlations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Positive Correlations</h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Higher containment success correlates with increased farmer income (82% success → ₹510L avg income)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Reduced disease outbreaks lead to lower crop loss percentages (4 outbreaks → 5% loss)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Market price index improvements follow successful containment years</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Key Learnings</h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <Target className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span>2022 showed lowest income due to high disease outbreaks and poor containment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Target className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span>Investment in containment measures shows 3x ROI in prevented losses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Target className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span>Farmer count growth indicates confidence in agricultural sector stability</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'economic' && (
        <div className="p-8">
          {/* Economic Intelligence Header */}
          <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl p-8 text-gray-900 shadow-2xl mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-white/20 backdrop-blur rounded-xl">
                <Calculator className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">🧠 Economic Outcome Intelligence</h2>
                <p className="text-emerald-100">Advanced decision support for government containment strategies</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white/20 backdrop-blur rounded-xl p-4 border border-white/30">
                <div className="text-2xl font-bold mb-1">₹1.64Cr</div>
                <div className="text-sm text-emerald-100">Income Saved</div>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-xl p-4 border border-white/30">
                <div className="text-2xl font-bold mb-1">10,933%</div>
                <div className="text-sm text-emerald-100">ROI</div>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-xl p-4 border border-white/30">
                <div className="text-2xl font-bold mb-1">8.7/10</div>
                <div className="text-sm text-emerald-100">Farmer Protection</div>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-xl p-4 border border-white/30">
                <div className="text-2xl font-bold mb-1">92%</div>
                <div className="text-sm text-emerald-100">Supply Chain Stability</div>
              </div>
            </div>
          </div>

          {/* Side-by-Side Comparison */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Scenario Comparison: Without vs With Containment
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Without Containment */}
              <div className="border-2 border-red-200 rounded-xl p-6 bg-red-50">
                <div className="flex items-center gap-2 mb-4">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <h4 className="text-lg font-bold text-red-800">Without Containment</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Farmers Affected:</span>
                    <span className="font-bold text-red-600">520</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Villages at Risk:</span>
                    <span className="font-bold text-red-600">15</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Crop Loss:</span>
                    <span className="font-bold text-red-600">65%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Income Loss:</span>
                    <span className="font-bold text-red-600">₹1.92Cr</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Supply Routes:</span>
                    <span className="font-bold text-red-600">3/12 operational</span>
                  </div>
                </div>
              </div>

              {/* With Containment */}
              <div className="border-2 border-green-200 rounded-xl p-6 bg-green-50">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h4 className="text-lg font-bold text-green-800">With Containment</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Farmers Affected:</span>
                    <span className="font-bold text-green-600">52</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Villages at Risk:</span>
                    <span className="font-bold text-green-600">3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Crop Loss:</span>
                    <span className="font-bold text-green-600">8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Income Loss:</span>
                    <span className="font-bold text-green-600">₹28L</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Supply Routes:</span>
                    <span className="font-bold text-green-600">11/12 operational</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Impact Highlights */}
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <h4 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Key Impact Highlights
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-green-600" />
                  <span className="text-sm"><strong>90%</strong> reduction in affected villages</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-green-600" />
                  <span className="text-sm"><strong>468</strong> farmers protected</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-green-600" />
                  <span className="text-sm"><strong>57%</strong> crop damage reduction</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-sm"><strong>₹1.64Cr</strong> financial savings</span>
                </div>
              </div>
            </div>
          </div>

          {/* Containment Effectiveness Score */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                Containment Effectiveness Score
              </h3>
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-purple-600 mb-2">85%</div>
                <div className="text-gray-600">Economic Damage Prevented</div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Spread Prevention</span>
                    <span>80%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{width: '80%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Income Preservation</span>
                    <span>85.4%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{width: '85.4%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Village Protection</span>
                    <span>86.7%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{width: '86.7%'}}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Farmer Protection Index */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Farmer Protection Index
              </h3>
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-green-600 mb-2">8.7/10</div>
                <div className="text-gray-600">Overall Protection Score</div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm">Income Preserved</span>
                  <span className="font-bold text-green-600">85.4%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm">Area Protected</span>
                  <span className="font-bold text-green-600">13/15 villages</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm">Spread Prevention</span>
                  <span className="font-bold text-green-600">80% efficiency</span>
                </div>
              </div>
            </div>
          </div>

          {/* Village-Level Impact Breakdown */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Village-Level Impact Breakdown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {villageLevelImpact.map((village, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{village.villageName}</h4>
                    <span className="text-sm font-bold text-green-600">₹{(village.estimatedIncomeSaved / 100000).toFixed(1)}L</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Farmers Protected:</span>
                      <span className="font-medium">{village.farmersProtected}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Risk Reduction:</span>
                      <span className="font-medium text-green-600">{village.riskReduction}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Impact Simulation */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              Timeline Impact Simulation
            </h3>
            <div className="space-y-4">
              {timelineImpact.map((timeline, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-16 text-center">
                    <div className="bg-orange-100 text-orange-800 rounded-lg px-3 py-2 font-bold">
                      Day {timeline.day}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">{timeline.event}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="text-sm font-medium text-green-800 mb-1">With Containment</div>
                        <div className="text-xs text-gray-700">
                          <div>Area: {timeline.withContainment.affectedArea}</div>
                          <div>Impact: {timeline.withContainment.economicImpact}</div>
                          <div>Risk: {timeline.withContainment.riskLevel}</div>
                        </div>
                      </div>
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="text-sm font-medium text-red-800 mb-1">Without Containment</div>
                        <div className="text-xs text-gray-700">
                          <div>Area: {timeline.withoutContainment.affectedArea}</div>
                          <div>Impact: {timeline.withoutContainment.economicImpact}</div>
                          <div>Risk: {timeline.withoutContainment.riskLevel}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Government Cost vs Benefit Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Banknote className="w-5 h-5 text-amber-600" />
                Government Intervention Cost
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Enforcement Cost</span>
                  <span className="font-bold">₹60,000</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Logistics Control</span>
                  <span className="font-bold">₹50,000</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Surveillance Cost</span>
                  <span className="font-bold">₹40,000</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-amber-100 border border-amber-300 rounded-lg">
                  <span className="font-bold text-amber-800">Total Investment</span>
                  <span className="font-bold text-amber-800">₹150,000</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Return on Investment
              </h3>
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-green-600 mb-2">10,933%</div>
                <div className="text-gray-600">ROI Percentage</div>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-800 mb-2">
                    {costBenefitAnalysis.roiRatio}
                  </div>
                  <div className="text-sm text-green-700">
                    For every ₹1 invested, ₹109 of economic loss prevented
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Supply Chain Stability Indicator */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-600" />
              Supply Chain Stability Indicator
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-blue-600 mb-2">92%</div>
                  <div className="text-gray-600">Stability Level</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                  <div className="bg-blue-600 h-4 rounded-full" style={{width: '92%'}}></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Transport Routes Operational:</span>
                  <span className="font-bold text-blue-600">11/12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Mandis Open:</span>
                  <span className="font-bold text-blue-600">8/8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Markets Stable:</span>
                  <span className="font-bold text-blue-600">6/6</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Policy Insights */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-blue-600" />
              Key Policy Insights for Government Decision-Makers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Economic Benefits</h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Early containment prevents exponential economic damage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Targeted intervention shows 10,933% ROI</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Supply chain stability maintained at 92%</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Social Impact</h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <Users className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>468 farmers' livelihoods protected</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Users className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>13 villages secured from economic devastation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Users className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Food security maintained for region</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-900">
                <strong>Core Question Answered:</strong> "What economic and social damage will be avoided if this containment decision is executed today?" 
                <br /><br />
                <strong>Answer:</strong> Early containment will save ₹1.64 crore in farmer income, protect 468 livelihoods, secure 13 villages, maintain 92% supply chain stability, and generate a 10,933% return on government investment.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="p-8">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <BarChart3 className="w-6 h-6" />
              📊 Analytics & Insights
            </h3>
            <p className="text-emerald-100 mb-6">
              Comprehensive analysis of containment effectiveness and economic impact
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/20 backdrop-blur rounded-xl p-4 border border-white/30">
                <div className="text-3xl font-bold mb-2">85%</div>
                <div className="text-sm text-emerald-100">Average Containment Success</div>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-xl p-4 border border-white/30">
                <div className="text-3xl font-bold mb-2">₹345L</div>
                <div className="text-sm text-emerald-100">Average Loss Prevention</div>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-xl p-4 border border-white/30">
                <div className="text-3xl font-bold mb-2">14 Days</div>
                <div className="text-sm text-emerald-100">Average Resolution Time</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'impact' && (
        <div className="p-8">
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-8 text-white shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Target className="w-6 h-6" />
              🎯 Impact Assessment
            </h3>
            <p className="text-amber-100 mb-6">
              Real-world impact of containment decisions on agricultural communities
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/20 backdrop-blur rounded-xl p-6 border border-white/30">
                <h4 className="font-bold text-lg mb-4">Economic Impact</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Farmers Protected:</span>
                    <span className="font-bold">1,250+</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Revenue Saved:</span>
                    <span className="font-bold">₹2.3Cr</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ROI:</span>
                    <span className="font-bold">340%</span>
                  </div>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-xl p-6 border border-white/30">
                <h4 className="font-bold text-lg mb-4">Social Impact</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Food Security:</span>
                    <span className="font-bold">Protected</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Livelihoods Saved:</span>
                    <span className="font-bold">3,200+</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Community Trust:</span>
                    <span className="font-bold">High</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </>
    </div>
  );
}
