import React, { useState, useEffect } from 'react';
import { Search, Camera, AlertTriangle, User, Users, ArrowRight, Loader2, FileImage, MapPin } from 'lucide-react';

type AssessmentScopeType = 'single-farmer' | 'village-cluster';

interface DetectionResult {
  disease: string;
  confidence: number;
  severity: string;
  explanation: string;
  heatmap: string;
}

interface ContainmentDecision {
  action: string;
  level: number;
  measures: string[];
  timeline: string;
  authority_level: string;
  explanation: string;
}

interface QuickSummary {
  status: string;
  urgency: string;
  next_steps: string[];
  report_ready: boolean;
}

interface AnalysisResult {
  analysis_id: string;
  timestamp: string;
  farmer_id: string;
  region: string;
  image_analysis: DetectionResult;
  containment_decision: ContainmentDecision;
  quick_summary: QuickSummary;
}

// Demo data
const demoFarmers = [
  { id: 'FARM001', name: 'Rajesh Kumar', village: 'Rampur', phone: '+91-98765-43210', crop: 'Wheat', acres: '12.5' },
  { id: 'FARM002', name: 'Sunita Devi', village: 'Biharipur', phone: '+91-98765-76543', crop: 'Rice', acres: '8.3' },
  { id: 'FARM003', name: 'Mahesh Patel', village: 'Kheda', phone: '+91-98765-23456', crop: 'Cotton', acres: '15.7' },
  { id: 'FARM004', name: 'Priya Sharma', village: 'Madhavpur', phone: '+91-98765-56789', crop: 'Sugarcane', acres: '10.2' },
  { id: 'FARM005', name: 'Ravi Verma', village: 'Shivpuri', phone: '+91-98765-89012', crop: 'Pulses', acres: '6.8' },
  { id: 'FARM006', name: 'Geeta Devi', village: 'Dhanpuri', phone: '+91-98765-90123', crop: 'Vegetables', acres: '4.5' },
  { id: 'FARM007', name: 'Vikram Singh', village: 'Keshavpur', phone: '+91-98765-01234', crop: 'Wheat', acres: '18.9' },
  { id: 'FARM008', name: 'Anjali Patel', village: 'Nandigram', phone: '+91-98765-12345', crop: 'Rice', acres: '9.4' },
  { id: 'FARM009', name: 'Amit Kumar', village: 'Chandpur', phone: '+91-98765-23456', crop: 'Maize', acres: '11.1' },
  { id: 'FARM010', name: 'Lakshmi Devi', village: 'Gokulnagar', phone: '+91-98765-34567', crop: 'Millets', acres: '7.2' }
];

const demoVillages = [
  { id: 'VIL001', name: 'Rampur', district: 'Bareilly', farmers: 2890, area: '45.2 km²', mainCrop: 'Wheat' },
  { id: 'VIL002', name: 'Biharipur', district: 'Vaishali', farmers: 1950, area: '32.1 km²', mainCrop: 'Rice' },
  { id: 'VIL003', name: 'Kheda', district: 'Kheda', farmers: 1420, area: '28.5 km²', mainCrop: 'Cotton' },
  { id: 'VIL004', name: 'Madhavpur', district: 'Maharajganj', farmers: 2100, area: '38.7 km²', mainCrop: 'Sugarcane' },
  { id: 'VIL005', name: 'Shivpuri', district: 'Shivpuri', farmers: 3450, area: '52.3 km²', mainCrop: 'Pulses' },
  { id: 'VIL006', name: 'Dhanpuri', district: 'Dhanbad', farmers: 1120, area: '24.6 km²', mainCrop: 'Vegetables' },
  { id: 'VIL007', name: 'Keshavpur', district: 'Mainpuri', farmers: 3120, area: '48.9 km²', mainCrop: 'Wheat' },
  { id: 'VIL008', name: 'Nandigram', district: 'East Medinipur', farmers: 1890, area: '35.4 km²', mainCrop: 'Rice' },
  { id: 'VIL009', name: 'Chandpur', district: 'Bulandshahr', farmers: 2560, area: '42.8 km²', mainCrop: 'Maize' },
  { id: 'VIL010', name: 'Gokulnagar', district: 'Raichur', farmers: 1680, area: '31.2 km²', mainCrop: 'Millets' }
];

const EnhancedAnalysis: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'scope-selection' | 'search' | 'analysis' | 'results'>('scope-selection');
  const [assessmentScope, setAssessmentScope] = useState<AssessmentScopeType>('single-farmer');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<any>(null);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);

  // Initialize search results when component loads or scope changes
  useEffect(() => {
    if (currentStep === 'search') {
      if (assessmentScope === 'single-farmer') {
        setSearchResults(demoFarmers.slice(0, 5)); // Show first 5 farmers
      } else {
        setSearchResults(demoVillages.slice(0, 5)); // Show first 5 villages
      }
      setShowSearchResults(true);
    }
  }, [currentStep, assessmentScope]);

  const handleSearch = (value: string) => {
    console.log('=== SEARCH DEBUG ===');
    console.log('Input value:', value);
    console.log('Assessment scope:', assessmentScope);
    setSearchTerm(value);
    
    // Always show results - either filtered or all demo data
    let results = [];
    if (assessmentScope === 'single-farmer') {
      if (value.length > 0) {
        results = demoFarmers.filter(farmer => 
          farmer.id.toLowerCase().includes(value.toLowerCase()) ||
          farmer.name.toLowerCase().includes(value.toLowerCase()) ||
          farmer.crop.toLowerCase().includes(value.toLowerCase()) ||
          farmer.village.toLowerCase().includes(value.toLowerCase())
        );
      } else {
        results = demoFarmers.slice(0, 5); // Show first 5 farmers when empty
      }
    } else {
      if (value.length > 0) {
        results = demoVillages.filter(village => 
          village.id.toLowerCase().includes(value.toLowerCase()) ||
          village.name.toLowerCase().includes(value.toLowerCase()) ||
          village.district.toLowerCase().includes(value.toLowerCase()) ||
          village.mainCrop.toLowerCase().includes(value.toLowerCase())
        );
      } else {
        results = demoVillages.slice(0, 5); // Show first 5 villages when empty
      }
    }
    
    console.log('Search results found:', results);
    console.log('Results length:', results.length);
    
    setSearchResults(results);
    setShowSearchResults(true);
    
    console.log('After setSearchResults and setShowSearchResults');
    console.log('showSearchResults:', true);
    console.log('searchResults.length:', results.length);
    
    // Auto-select first result and upload image immediately when typing
    if (results.length > 0 && !selectedEntity) {
      console.log('Auto-selecting first result:', results[0]);
      handleEntitySelect(results[0]);
    }
    
    console.log('=== END SEARCH DEBUG ===');
  };

  const handleEntitySelect = (entity: any) => {
    setSelectedEntity(entity);
    // Don't clear search term so user can see what they typed
    // setSearchTerm('');
    // Keep search results visible
    // setShowSearchResults(false);
    
    // Automatically simulate image upload with the selected entity
    simulateImageUpload(entity);
  };

  const simulateImageUpload = (entity: any) => {
    // Create a demo image preview with crop-specific information
    const cropName = entity?.crop || entity?.mainCrop || 'Crop';
    const demoImageUrl = `data:image/svg+xml;base64,${btoa(`
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#f4f4f4"/>
        <text x="200" y="120" font-family="Arial" font-size="18" fill="#666" text-anchor="middle">${cropName} Field Image</text>
        <text x="200" y="150" font-family="Arial" font-size="14" fill="#999" text-anchor="middle">Location: ${entity?.name || 'Unknown'}</text>
        <text x="200" y="180" font-family="Arial" font-size="12" fill="#ff6600" text-anchor="middle">Leaf Blight Detected</text>
        <circle cx="100" cy="100" r="20" fill="#ffd700" opacity="0.7"/>
        <circle cx="300" cy="100" r="15" fill="#ffd700" opacity="0.5"/>
        <circle cx="200" cy="200" r="25" fill="#ffd700" opacity="0.6"/>
        <rect x="50" y="220" width="300" height="60" fill="#e8f5e8" stroke="#4caf50" stroke-width="2" rx="5"/>
        <text x="200" y="245" font-family="Arial" font-size="12" fill="#2e7d32" text-anchor="middle">AI Analysis Complete</text>
        <text x="200" y="265" font-family="Arial" font-size="10" fill="#2e7d32" text-anchor="middle">Confidence: ${Math.floor(Math.random() * 20) + 80}%</text>
      </svg>
    `)}`;
    setPreview(demoImageUrl);
    
    // Simulate file selection
    fetch(demoImageUrl)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], `${entity?.id || 'demo'}-crop-image.jpg`, { type: 'image/jpeg' });
        setImage(file);
      });
  };

  const generateDemoResult = (): AnalysisResult => {
    const diseases = ['Leaf Blight', 'Bacterial Leaf Blight', 'Wheat Rust', 'Healthy', 'Powdery Mildew'];
    const severities = ['Low', 'Medium', 'High', 'Critical'];
    const actions = ['Monitor', 'Partial Containment', 'Full Containment', 'Immediate Action'];
    const demoImageUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y0ZjRmNCIvPgogIDx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkRlbW8gQ3JvcCBJbWFnZTwvdGV4dD4KICA8dGV4dCB4PSIyMDAiIHk9IjE4MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5MZWFmIEJsaWdodCBEZXRlY3RlZDwvdGV4dD4KICA8Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjIwIiBmaWxsPSIjZmZkNzAwIiBvcGFjaXR5PSIwLjciLz4KICA8Y2lyY2xlIGN4PSIzMDAiIGN5PSIxMDAiIHI9IjE1IiBmaWxsPSIjZmZkNzAwIiBvcGFjaXR5PSIwLjUiLz4KICA8Y2lyY2xlIGN4PSIyMDAiIGN5PSIyMDAiIHI9IjI1IiBmaWxsPSIjZmZkNzAwIiBvcGFjaXR5PSIwLjYiLz4KPC9zdmc+';
    
    const selectedDisease = diseases[Math.floor(Math.random() * diseases.length)];
    const selectedSeverity = severities[Math.floor(Math.random() * severities.length)];
    
    return {
      analysis_id: `ANA-${Date.now()}`,
      timestamp: new Date().toISOString(),
      farmer_id: selectedEntity?.id || 'UNKNOWN',
      region: selectedEntity?.village || selectedEntity?.name || 'Unknown Region',
      image_analysis: {
        disease: selectedDisease,
        confidence: Math.floor(Math.random() * 30) + 70, // 70-99%
        severity: selectedSeverity,
        explanation: `AI analysis indicates ${selectedDisease} with ${selectedSeverity.toLowerCase()} severity. Affected area shows characteristic symptoms including leaf discoloration and spots.`,
        heatmap: demoImageUrl
      },
      containment_decision: {
        action: actions[Math.floor(Math.random() * actions.length)],
        level: Math.floor(Math.random() * 5) + 1,
        measures: [
          'Monitor crop health daily',
          'Implement targeted pesticide application',
          'Quarantine affected area',
          'Report to agricultural officer'
        ],
        timeline: selectedSeverity === 'Critical' ? 'Immediate' : selectedSeverity === 'High' ? '24-48 hours' : '3-7 days',
        authority_level: selectedSeverity === 'Critical' ? 'District Officer' : 'Village Officer',
        explanation: `Based on disease severity and affected area, ${actions[0].toLowerCase()} measures are recommended.`
      },
      quick_summary: {
        status: selectedDisease === 'Healthy' ? 'No Disease Detected' : 'Disease Detected',
        urgency: selectedSeverity === 'Critical' ? 'Critical' : selectedSeverity === 'High' ? 'High' : selectedSeverity === 'Medium' ? 'Medium' : 'Low',
        next_steps: [
          'Review detailed analysis',
          'Implement containment measures',
          'Monitor crop progress',
          'Follow up in 7 days'
        ],
        report_ready: true
      }
    };
  };

  const startAnalysis = () => {
    if (!selectedEntity || !image) {
      setError('Please select an entity and ensure image is uploaded');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setCurrentStep('analysis');

    // Simulate analysis process
    setTimeout(() => {
      const demoResult = generateDemoResult();
      setResult(demoResult);
      setIsAnalyzing(false);
      setCurrentStep('results');
    }, 3000);
  };

  const resetAnalysis = () => {
    setCurrentStep('scope-selection');
    setAssessmentScope('single-farmer');
    setSearchTerm('');
    setSearchResults([]);
    setSelectedEntity(null);
    setImage(null);
    setPreview('');
    setResult(null);
    setError('');
    setIsAnalyzing(false);
    setShowSearchResults(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-8 py-6 shadow-lg rounded-t-lg mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Enhanced Crop Disease Analysis</h1>
              <p className="text-sm text-gray-600">AI-powered disease detection with automatic image processing</p>
            </div>
          </div>
        </div>

        {/* Step 1: Scope Selection */}
        {currentStep === 'scope-selection' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Choose Your Assessment Scope</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => {
                  setAssessmentScope('single-farmer');
                  setCurrentStep('search');
                }}
                className={`p-6 rounded-lg border-2 transition-all ${
                  assessmentScope === 'single-farmer'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <User className="w-8 h-8 text-blue-600 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Single Farmer Analysis</h3>
                <p className="text-sm text-gray-600">Analyze crop disease for individual farmer</p>
              </button>

              <button
                onClick={() => {
                  setAssessmentScope('village-cluster');
                  setCurrentStep('search');
                }}
                className={`p-6 rounded-lg border-2 transition-all ${
                  assessmentScope === 'village-cluster'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Users className="w-8 h-8 text-green-600 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Village Cluster Analysis</h3>
                <p className="text-sm text-gray-600">Analyze disease patterns across village</p>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Search */}
        {currentStep === 'search' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {assessmentScope === 'single-farmer' ? 'Search Farmer' : 'Search Village'}
              </h2>
              <button
                onClick={() => setCurrentStep('scope-selection')}
                className="text-gray-500 hover:text-gray-700"
              >
                Back
              </button>
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={assessmentScope === 'single-farmer' ? 'Enter Farmer ID or Name...' : 'Enter Village ID or Name...'}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              {/* Search Results Dropdown */}
              {(() => {
                console.log('=== RENDER DEBUG ===');
                console.log('showSearchResults:', showSearchResults);
                console.log('searchResults.length:', searchResults.length);
                console.log('Should render dropdown:', showSearchResults && searchResults.length > 0);
                return null;
              })()}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  {searchResults.map((entity) => (
                    <button
                      key={entity.id}
                      onClick={() => handleEntitySelect(entity)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          {assessmentScope === 'single-farmer' ? (
                            <User className="w-5 h-5 text-blue-500 mt-0.5" />
                          ) : (
                            <MapPin className="w-5 h-5 text-green-500 mt-0.5" />
                          )}
                          <div className="text-left">
                            <div className="font-semibold text-gray-900">{entity.name}</div>
                            <div className="text-sm text-gray-600">
                              ID: {entity.id} • {assessmentScope === 'single-farmer' ? entity.village : entity.district}
                            </div>
                            <div className="text-xs text-gray-500">
                              {assessmentScope === 'single-farmer' ? 
                                `${entity.crop} • ${entity.acres} acres • ${entity.phone}` : 
                                `${entity.farmers} farmers • ${entity.area} • Main: ${entity.mainCrop}`
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Entity & Auto-uploaded Image */}
            {selectedEntity && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">Selected Entity</h3>
                  <div className="text-sm text-blue-800">
                    <div><strong>Name:</strong> {selectedEntity.name}</div>
                    <div><strong>ID:</strong> {selectedEntity.id}</div>
                    <div><strong>Location:</strong> {selectedEntity.village || selectedEntity.district}</div>
                    {assessmentScope === 'single-farmer' ? (
                      <>
                        <div><strong>Crop:</strong> {selectedEntity.crop}</div>
                        <div><strong>Land Area:</strong> {selectedEntity.acres} acres</div>
                        <div><strong>Phone:</strong> {selectedEntity.phone}</div>
                      </>
                    ) : (
                      <>
                        <div><strong>Total Farmers:</strong> {selectedEntity.farmers}</div>
                        <div><strong>Area:</strong> {selectedEntity.area}</div>
                        <div><strong>Main Crop:</strong> {selectedEntity.mainCrop}</div>
                      </>
                    )}
                  </div>
                </div>

                {preview && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                      <FileImage className="w-4 h-4" />
                      Image Auto-uploaded
                    </h3>
                    <div className="text-sm text-green-800 mb-3">
                      Demo crop image automatically loaded for analysis
                    </div>
                    <img src={preview} alt="Crop preview" className="w-full max-w-md rounded-lg border border-gray-200" />
                  </div>
                )}

                <button
                  onClick={startAnalysis}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  Start Analysis
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Analysis */}
        {currentStep === 'analysis' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Analyzing Crop Image</h2>
              <p className="text-gray-600">AI is detecting disease patterns and generating recommendations...</p>
            </div>
          </div>
        )}

        {/* Step 4: Results */}
        {currentStep === 'results' && result && (
          <div className="space-y-6">
            {/* Quick Summary */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg ${
                  result.quick_summary.status === 'No Disease Detected' ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <div className={`text-sm font-medium ${
                    result.quick_summary.status === 'No Disease Detected' ? 'text-green-900' : 'text-red-900'
                  }`}>
                    Status
                  </div>
                  <div className={`text-lg font-bold ${
                    result.quick_summary.status === 'No Disease Detected' ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {result.quick_summary.status}
                  </div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-yellow-900">Urgency</div>
                  <div className="text-lg font-bold text-yellow-700">{result.quick_summary.urgency}</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-blue-900">Confidence</div>
                  <div className="text-lg font-bold text-blue-700">{result.image_analysis.confidence}%</div>
                </div>
              </div>
            </div>

            {/* Detailed Analysis */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Image Analysis</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Disease:</span>
                      <span className="font-medium">{result.image_analysis.disease}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Severity:</span>
                      <span className="font-medium">{result.image_analysis.severity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Confidence:</span>
                      <span className="font-medium">{result.image_analysis.confidence}%</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-700">{result.image_analysis.explanation}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Containment Decision</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Action:</span>
                      <span className="font-medium">{result.containment_decision.action}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Authority:</span>
                      <span className="font-medium">{result.containment_decision.authority_level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Timeline:</span>
                      <span className="font-medium">{result.containment_decision.timeline}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-700">{result.containment_decision.explanation}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={resetAnalysis}
                className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                New Analysis
              </button>
              <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <ArrowRight className="w-5 h-5" />
                Generate Report
              </button>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedAnalysis;
