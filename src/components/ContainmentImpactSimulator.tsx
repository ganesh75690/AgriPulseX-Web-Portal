import React, { useState } from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, DollarSign, MapPin, Users, Truck, Play, Pause, RotateCcw, Info, Shield, Clock, BarChart3, ArrowRight } from 'lucide-react';

interface TimeStepData {
  day: number;
  withContainment: {
    diseaseRadius: number;
    farmsAffected: number;
    supplyRoutesOperational: number;
    supplyRoutesDisrupted: number;
    incomeProtected: number;
    incomeLoss: number;
  };
  withoutContainment: {
    diseaseRadius: number;
    farmsAffected: number;
    supplyRoutesOperational: number;
    supplyRoutesDisrupted: number;
    incomeProtected: number;
    incomeLoss: number;
  };
}

const timeStepsData: TimeStepData[] = [
  {
    day: 0,
    withContainment: {
      diseaseRadius: 2,
      farmsAffected: 12,
      supplyRoutesOperational: 12,
      supplyRoutesDisrupted: 0,
      incomeProtected: 0,
      incomeLoss: 0
    },
    withoutContainment: {
      diseaseRadius: 2,
      farmsAffected: 12,
      supplyRoutesOperational: 12,
      supplyRoutesDisrupted: 0,
      incomeProtected: 0,
      incomeLoss: 0
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
      incomeLoss: 180
    },
    withoutContainment: {
      diseaseRadius: 8,
      farmsAffected: 180,
      supplyRoutesOperational: 8,
      supplyRoutesDisrupted: 4,
      incomeProtected: 120,
      incomeLoss: 880
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
      incomeLoss: 280
    },
    withoutContainment: {
      diseaseRadius: 15,
      farmsAffected: 520,
      supplyRoutesOperational: 3,
      supplyRoutesDisrupted: 9,
      incomeProtected: 80,
      incomeLoss: 1920
    }
  }
];

export default function ContainmentImpactSimulator() {
  const [showContainment, setShowContainment] = useState(true);
  const [currentTimeStep, setCurrentTimeStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentData = timeStepsData[currentTimeStep];
  const scenario = showContainment ? currentData.withContainment : currentData.withoutContainment;
  const comparison = showContainment ? currentData.withContainment : currentData.withoutContainment;
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

  const MetricCard = ({ 
    title, 
    value, 
    comparisonValue, 
    unit, 
    icon: Icon, 
    trend, 
    color 
  }: {
    title: string;
    value: number;
    comparisonValue: number;
    unit: string;
    icon: any;
    trend: 'up' | 'down' | 'neutral';
    color: string;
  }) => {
    const isBetter = showContainment ? value < comparisonValue : value > comparisonValue;
    const trendColor = trend === 'up' ? 'text-red-600' : trend === 'down' ? 'text-green-600' : 'text-gray-600';
    
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Icon className={`w-4 h-4 ${color}`} />
            <span className="text-xs text-gray-600">{title}</span>
          </div>
          {trend !== 'neutral' && (
            <div className={`flex items-center gap-1 ${trendColor}`}>
              {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span className="text-xs">{Math.abs(((value - comparisonValue) / comparisonValue) * 100).toFixed(0)}%</span>
            </div>
          )}
        </div>
        <div className="text-lg font-semibold text-gray-900">
          {value.toLocaleString()}{unit}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {showContainment ? 'With' : 'Without'} Containment
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl text-gray-900 mb-1 flex items-center gap-3">
              <Shield className="w-6 h-6 text-[#2f9d58]" />
              Containment Impact Simulator
            </h1>
            <p className="text-sm text-gray-600">
              Advisory tool for visualizing containment decision consequences (Illustrative Only)
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-lg">
            <Info className="w-4 h-4 text-amber-600" />
            <span className="text-xs text-amber-700">Optional Module</span>
          </div>
        </div>
      </div>

      {/* Advisory Notice */}
      <div className="mx-8 mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-900 mb-1">Advisory Notice</h3>
            <p className="text-sm text-blue-800 leading-relaxed">
              This simulator provides illustrative scenarios to support policy justification, public communication, 
              and internal reporting. It demonstrates potential consequences and is not a predictive tool. 
              Actual outcomes may vary based on field conditions, compliance rates, and environmental factors.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        {/* Scenario Toggle */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-1">Scenario Comparison</h2>
              <p className="text-sm text-gray-600">Toggle between containment scenarios to compare impacts</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowContainment(true)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showContainment 
                    ? 'bg-[#2f9d58] text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                With Containment
              </button>
              <button
                onClick={() => setShowContainment(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !showContainment 
                    ? 'bg-[#2f9d58] text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Without Containment
              </button>
            </div>
          </div>
        </div>

        {/* Timeline Controls */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Timeline Progression</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevious}
                disabled={currentTimeStep === 0}
                className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous time step"
              >
                <Play className="w-4 h-4 rotate-180" />
              </button>
              {!isPlaying ? (
                <button
                  onClick={handlePlay}
                  className="p-2 rounded-lg bg-[#2f9d58] text-white hover:bg-[#237a3f]"
                  aria-label="Play timeline"
                >
                  <Play className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handlePause}
                  className="p-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700"
                  aria-label="Pause timeline"
                >
                  <Pause className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={currentTimeStep === timeStepsData.length - 1}
                className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next time step"
              >
                <Play className="w-4 h-4" />
              </button>
              <button
                onClick={handleReset}
                className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                aria-label="Reset timeline"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              {timeStepsData.map((step, index) => (
                <div key={step.day} className="flex flex-col items-center">
                  <button
                    onClick={() => setCurrentTimeStep(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index <= currentTimeStep 
                        ? 'bg-[#2f9d58]' 
                        : 'bg-gray-300'
                    }`}
                    aria-label={`Go to Day ${step.day}`}
                  />
                  <span className={`text-xs mt-2 ${
                    index === currentTimeStep ? 'text-gray-900 font-medium' : 'text-gray-600'
                  }`}>
                    Day {step.day}
                  </span>
                </div>
              ))}
            </div>
            <div className="absolute top-1.5 left-0 right-0 h-0.5 bg-gray-300 -z-10" />
            <div 
              className="absolute top-1.5 left-0 h-0.5 bg-[#2f9d58] -z-10 transition-all duration-500"
              style={{ width: `${(currentTimeStep / (timeStepsData.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <MetricCard
            title="Disease Spread Radius"
            value={scenario.diseaseRadius}
            comparisonValue={alternative.diseaseRadius}
            unit=" km"
            icon={MapPin}
            trend={scenario.diseaseRadius > alternative.diseaseRadius ? 'up' : 'down'}
            color="text-red-600"
          />
          <MetricCard
            title="Farms Affected"
            value={scenario.farmsAffected}
            comparisonValue={alternative.farmsAffected}
            unit=""
            icon={Users}
            trend={scenario.farmsAffected > alternative.farmsAffected ? 'up' : 'down'}
            color="text-amber-600"
          />
          <MetricCard
            title="Supply Routes Operational"
            value={scenario.supplyRoutesOperational}
            comparisonValue={alternative.supplyRoutesOperational}
            unit=""
            icon={Truck}
            trend={scenario.supplyRoutesOperational > alternative.supplyRoutesOperational ? 'up' : 'down'}
            color="text-green-600"
          />
          <MetricCard
            title="Supply Routes Disrupted"
            value={scenario.supplyRoutesDisrupted}
            comparisonValue={alternative.supplyRoutesDisrupted}
            unit=""
            icon={AlertTriangle}
            trend={scenario.supplyRoutesDisrupted > alternative.supplyRoutesDisrupted ? 'up' : 'down'}
            color="text-red-600"
          />
          <MetricCard
            title="Income Protected"
            value={scenario.incomeProtected}
            comparisonValue={alternative.incomeProtected}
            unit="L"
            icon={TrendingUp}
            trend={scenario.incomeProtected > alternative.incomeProtected ? 'up' : 'down'}
            color="text-green-600"
          />
          <MetricCard
            title="Income Loss"
            value={scenario.incomeLoss}
            comparisonValue={alternative.incomeLoss}
            unit="L"
            icon={TrendingDown}
            trend={scenario.incomeLoss > alternative.incomeLoss ? 'up' : 'down'}
            color="text-red-600"
          />
        </div>

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Scenario */}
          <div className="bg-white rounded-lg border-2 border-[#2f9d58] p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#2f9d58]" />
              {showContainment ? 'With Containment' : 'Without Containment'} Scenario
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Disease Containment:</span>
                <span className={`text-sm font-medium ${
                  showContainment ? 'text-green-700' : 'text-red-700'
                }`}>
                  {showContainment ? 'Effective' : 'Uncontrolled'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Farmer Impact:</span>
                <span className={`text-sm font-medium ${
                  showContainment ? 'text-amber-700' : 'text-red-700'
                }`}>
                  {showContainment ? 'Localized' : 'Widespread'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Supply Chain:</span>
                <span className={`text-sm font-medium ${
                  showContainment ? 'text-green-700' : 'text-red-700'
                }`}>
                  {showContainment ? 'Mostly Stable' : 'Severely Disrupted'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Economic Loss:</span>
                <span className={`text-sm font-medium ${
                  showContainment ? 'text-amber-700' : 'text-red-700'
                }`}>
                  {formatCurrency(scenario.incomeLoss)}
                </span>
              </div>
            </div>
          </div>

          {/* Alternative Scenario */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-gray-600" />
              Alternative Scenario ({showContainment ? 'Without' : 'With'} Containment)
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Disease Containment:</span>
                <span className={`text-sm font-medium ${
                  !showContainment ? 'text-green-700' : 'text-red-700'
                }`}>
                  {!showContainment ? 'Effective' : 'Uncontrolled'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Farmer Impact:</span>
                <span className={`text-sm font-medium ${
                  !showContainment ? 'text-amber-700' : 'text-red-700'
                }`}>
                  {!showContainment ? 'Localized' : 'Widespread'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Supply Chain:</span>
                <span className={`text-sm font-medium ${
                  !showContainment ? 'text-green-700' : 'text-red-700'
                }`}>
                  {!showContainment ? 'Mostly Stable' : 'Severely Disrupted'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Economic Loss:</span>
                <span className={`text-sm font-medium ${
                  !showContainment ? 'text-amber-700' : 'text-red-700'
                }`}>
                  {formatCurrency(alternative.incomeLoss)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-600" />
            Key Insights for Day {currentData.day}
          </h4>
          <ul className="text-sm text-gray-700 space-y-1">
            {showContainment ? (
              <>
                <li>• Containment measures have limited disease spread to {scenario.diseaseRadius}km radius</li>
                <li>• Only {scenario.farmsAffected} farms affected compared to {alternative.farmsAffected} without intervention</li>
                <li>• Supply chain disruption minimized with {scenario.supplyRoutesOperational} of 12 routes operational</li>
                <li>• Economic impact contained to {formatCurrency(scenario.incomeLoss)} vs {formatCurrency(alternative.incomeLoss)} potential loss</li>
              </>
            ) : (
              <>
                <li>• Disease spreads rapidly to {scenario.diseaseRadius}km radius without intervention</li>
                <li>• {scenario.farmsAffected} farms affected - {scenario.farmsAffected - alternative.farmsAffected} more than with containment</li>
                <li>• Supply chain severely disrupted with only {scenario.supplyRoutesOperational} of 12 routes operational</li>
                <li>• Economic loss escalates to {formatCurrency(scenario.incomeLoss)} - {formatCurrency(scenario.incomeLoss - alternative.incomeLoss)} higher than containment scenario</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
