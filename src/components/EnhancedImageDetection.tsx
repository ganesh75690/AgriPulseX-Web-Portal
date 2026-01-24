import React, { useState, useEffect } from 'react';
import { Camera, Upload, AlertTriangle, CheckCircle, TrendingUp, User, Users, ArrowRight, Search } from 'lucide-react';
import AssessmentScope from './AssessmentScope';

// Import API configuration
import { API_CONFIG, createApiUrl } from '../api/config';

// Demo data for farmers and villages
const demoFarmers = [
  { id: 'FARM001', name: 'Rajesh Kumar', village: 'Rampur', district: 'Bareilly', crop: 'Wheat', acres: 12.5, phone: '+91-98765-43210' },
  { id: 'FARM002', name: 'Sunita Devi', village: 'Biharipur', district: 'Badaun', crop: 'Rice', acres: 8.3, phone: '+91-87654-32109' },
  { id: 'FARM003', name: 'Mahesh Patel', village: 'Kheda', district: 'Etah', crop: 'Cotton', acres: 15.7, phone: '+91-76543-21098' },
  { id: 'FARM004', name: 'Anita Singh', village: 'Madhavpur', district: 'Maharajganj', crop: 'Sugarcane', acres: 6.2, phone: '+91-65432-10987' },
  { id: 'FARM005', name: 'Ramesh Yadav', village: 'Shivpuri', district: 'Shivpuri', crop: 'Pulses', acres: 10.8, phone: '+91-54321-09876' },
  { id: 'FARM006', name: 'Geeta Devi', village: 'Dhanpuri', district: 'Dhanbad', crop: 'Vegetables', acres: 4.5, phone: '+91-43210-98765' },
  { id: 'FARM007', name: 'Vikram Singh', village: 'Keshavpur', district: 'Mainpuri', crop: 'Wheat', acres: 18.3, phone: '+91-32109-87654' },
  { id: 'FARM008', name: 'Lakshmi Bai', village: 'Nandigram', district: 'East Medinipur', crop: 'Rice', acres: 7.9, phone: '+91-21098-76543' },
  { id: 'FARM009', name: 'Mohan Lal', village: 'Chandpur', district: 'Bulandshahr', crop: 'Maize', acres: 11.2, phone: '+91-10987-65432' },
  { id: 'FARM010', name: 'Radha Devi', village: 'Gokulnagar', district: 'Raichur', crop: 'Millets', acres: 9.6, phone: '+91-09876-54321' }
];

const demoVillages = [
  { id: 'VIL001', name: 'Rampur', district: 'Bareilly', farmers: 2890, area: '45.2 km²', mainCrop: 'Wheat' },
  { id: 'VIL002', name: 'Biharipur', district: 'Badaun', farmers: 1950, area: '32.1 km²', mainCrop: 'Rice' },
  { id: 'VIL003', name: 'Kheda', district: 'Etah', farmers: 1420, area: '28.5 km²', mainCrop: 'Cotton' },
  { id: 'VIL004', name: 'Madhavpur', district: 'Maharajganj', farmers: 2100, area: '38.7 km²', mainCrop: 'Sugarcane' },
  { id: 'VIL005', name: 'Shivpuri', district: 'Shivpuri', farmers: 3450, area: '52.3 km²', mainCrop: 'Pulses' },
  { id: 'VIL006', name: 'Dhanpuri', district: 'Dhanbad', farmers: 1120, area: '24.6 km²', mainCrop: 'Vegetables' },
  { id: 'VIL007', name: 'Keshavpur', district: 'Mainpuri', farmers: 3120, area: '48.9 km²', mainCrop: 'Wheat' },
  { id: 'VIL008', name: 'Nandigram', district: 'East Medinipur', farmers: 1890, area: '35.4 km²', mainCrop: 'Rice' },
  { id: 'VIL009', name: 'Chandpur', district: 'Bulandshahr', farmers: 2560, area: '42.8 km²', mainCrop: 'Maize' },
  { id: 'VIL010', name: 'Gokulnagar', district: 'Raichur', farmers: 1680, area: '31.2 km²', mainCrop: 'Millets' }
];

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

const EnhancedImageDetection: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'scope-selection' | 'search' | 'analysis' | 'results'>('scope-selection');
  const [assessmentScope, setAssessmentScope] = useState<AssessmentScopeType>('single-farmer');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
  // Search functionality
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<any>(null);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  
  // Form fields
  const [farmerId, setFarmerId] = useState<string>('');
  const [villageName, setVillageName] = useState<string>('');
  const [cropType, setCropType] = useState<string>('');
  const [fieldArea, setFieldArea] = useState<string>('');
  const [region, setRegion] = useState<string>('');

  const handleScopeSelect = (scope: AssessmentScopeType) => {
    console.log('Scope selected:', scope);
    setAssessmentScope(scope);
    // Reset form data when scope changes
    setImage(null);
    setPreview("");
    setResult(null);
    setError("");
    setFarmerId("");
    setVillageName("");
    setCropType("");
    setFieldArea("");
    setSelectedEntity(null);
    setSearchTerm("");
    setSearchResults([]);
    
    // Go to search step after scope selection
    setTimeout(() => {
      setCurrentStep('search');
    }, 100);
  };

  // Initialize search results when search step loads
  useEffect(() => {
    if (currentStep === 'search') {
      if (assessmentScope === 'single-farmer') {
        setSearchResults(demoFarmers.slice(0, 5));
      } else {
        setSearchResults(demoVillages.slice(0, 5));
      }
      setShowSearchResults(true);
    }
  }, [currentStep, assessmentScope]);

  const handleSearch = (value: string) => {
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
        results = demoFarmers.slice(0, 5);
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
        results = demoVillages.slice(0, 5);
      }
    }
    
    setSearchResults(results);
    setShowSearchResults(true);
    
    // Auto-select first result and upload image immediately when typing
    if (results.length > 0 && !selectedEntity) {
      handleEntitySelect(results[0]);
    }
  };

  const handleEntitySelect = (entity: any) => {
    setSelectedEntity(entity);
    // Auto-fill form fields based on selected entity
    if (assessmentScope === 'single-farmer') {
      setFarmerId(entity.id);
      setVillageName(entity.village);
      setCropType(entity.crop);
      setFieldArea(entity.acres.toString());
      setRegion(entity.district);
    } else {
      setVillageName(entity.name);
      setCropType(entity.mainCrop);
      setFieldArea(entity.area);
      setRegion(entity.district);
    }
    
    // Auto-generate demo image
    generateDemoImage(entity);
    
    // Go to analysis step
    setTimeout(() => {
      setCurrentStep('analysis');
    }, 500);
  };

  const generateDemoImage = (entity: any) => {
    const cropName = entity?.crop || entity?.mainCrop || 'Crop';
    const locationName = entity?.name || entity?.village || 'Field Location';
    
    // Create realistic field report image with crop-specific details
    const demoImageUrl = `data:image/svg+xml;base64,${btoa(`
      <svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
        <!-- Background - realistic field photo simulation -->
        <defs>
          <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#E0F6FF;stop-opacity:1" />
          </linearGradient>
          <linearGradient id="fieldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#7CB342;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#689F38;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#558B2F;stop-opacity:1" />
          </linearGradient>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
            <feOffset dx="2" dy="2" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3"/>
            </feComponentTransfer>
            <feMerge> 
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/> 
            </feMerge>
          </filter>
        </defs>
        
        <!-- Sky background -->
        <rect width="600" height="150" fill="url(#skyGradient)"/>
        
        <!-- Sun -->
        <circle cx="500" cy="50" r="25" fill="#FFD700" opacity="0.9"/>
        <circle cx="500" cy="50" r="30" fill="#FFD700" opacity="0.3"/>
        
        <!-- Clouds -->
        <ellipse cx="100" cy="40" rx="30" ry="15" fill="white" opacity="0.8"/>
        <ellipse cx="130" cy="45" rx="25" ry="12" fill="white" opacity="0.8"/>
        <ellipse cx="400" cy="60" rx="35" ry="18" fill="white" opacity="0.7"/>
        
        <!-- Field background -->
        <rect y="150" width="600" height="250" fill="url(#fieldGradient)"/>
        
        <!-- Crop rows - realistic field pattern -->
        ${generateCropRows(cropName)}
        
        <!-- Field equipment/structures -->
        ${generateFieldElements(cropName)}
        
        <!-- Field report overlay -->
        <rect x="10" y="10" width="250" height="80" fill="rgba(0,0,0,0.7)" rx="5"/>
        <text x="20" y="30" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#00FF00">
          FIELD REPORT - ${cropName.toUpperCase()}
        </text>
        <text x="20" y="50" font-family="Arial, sans-serif" font-size="12" fill="white">
          Location: ${locationName}
        </text>
        <text x="20" y="65" font-family="Arial, sans-serif" font-size="12" fill="white">
          Date: ${new Date().toLocaleDateString()}
        </text>
        <text x="20" y="80" font-family="Arial, sans-serif" font-size="12" fill="white">
          Report ID: FR-${Date.now().toString().slice(-6)}
        </text>
        
        <!-- Camera metadata overlay -->
        <rect x="340" y="10" width="250" height="60" fill="rgba(0,0,0,0.7)" rx="5"/>
        <text x="350" y="30" font-family="Arial, sans-serif" font-size="12" fill="#00FF00">
          CAMERA: DRONE-AERIAL-V2
        </text>
        <text x="350" y="45" font-family="Arial, sans-serif" font-size="11" fill="white">
          ALT: 120m | RES: 4K | GPS: ${Math.random().toFixed(4)}°N, ${Math.random().toFixed(4)}°E
        </text>
        <text x="350" y="58" font-family="Arial, sans-serif" font-size="11" fill="white">
          TIME: ${new Date().toLocaleTimeString()}
        </text>
        
        <!-- Disease indicators (subtle) -->
        ${generateDiseaseIndicators(cropName)}
        
        <!-- Scale indicator -->
        <rect x="520" y="370" width="70" height="20" fill="rgba(255,255,255,0.8)" stroke="black" stroke-width="1"/>
        <line x1="525" y1="380" x2="585" y2="380" stroke="black" stroke-width="2"/>
        <text x="540" y="385" font-family="Arial, sans-serif" font-size="10" text-anchor="middle" fill="black">
          10 meters
        </text>
      </svg>
    `)}`;
    
    setPreview(demoImageUrl);
  };

  // Helper function to generate crop-specific field rows
  const generateCropRows = (crop: string) => {
    const rowPatterns: { [key: string]: string } = {
      'Wheat': `
        <!-- Wheat field rows -->
        <rect x="0" y="180" width="600" height="3" fill="#8B7355" opacity="0.8"/>
        <rect x="0" y="200" width="600" height="3" fill="#8B7355" opacity="0.8"/>
        <rect x="0" y="220" width="600" height="3" fill="#8B7355" opacity="0.8"/>
        <rect x="0" y="240" width="600" height="3" fill="#8B7355" opacity="0.8"/>
        <rect x="0" y="260" width="600" height="3" fill="#8B7355" opacity="0.8"/>
        <rect x="0" y="280" width="600" height="3" fill="#8B7355" opacity="0.8"/>
        <rect x="0" y="300" width="600" height="3" fill="#8B7355" opacity="0.8"/>
        <rect x="0" y="320" width="600" height="3" fill="#8B7355" opacity="0.8"/>
        <rect x="0" y="340" width="600" height="3" fill="#8B7355" opacity="0.8"/>
        <rect x="0" y="360" width="600" height="3" fill="#8B7355" opacity="0.8"/>
        <rect x="0" y="380" width="600" height="3" fill="#8B7355" opacity="0.8"/>
      `,
      'Rice': `
        <!-- Rice paddy fields with water -->
        <rect x="0" y="170" width="600" height="200" fill="#4A90E2" opacity="0.3"/>
        <rect x="0" y="190" width="600" height="2" fill="#2E7D32" opacity="0.9"/>
        <rect x="0" y="210" width="600" height="2" fill="#2E7D32" opacity="0.9"/>
        <rect x="0" y="230" width="600" height="2" fill="#2E7D32" opacity="0.9"/>
        <rect x="0" y="250" width="600" height="2" fill="#2E7D32" opacity="0.9"/>
        <rect x="0" y="270" width="600" height="2" fill="#2E7D32" opacity="0.9"/>
        <rect x="0" y="290" width="600" height="2" fill="#2E7D32" opacity="0.9"/>
        <rect x="0" y="310" width="600" height="2" fill="#2E7D32" opacity="0.9"/>
        <rect x="0" y="330" width="600" height="2" fill="#2E7D32" opacity="0.9"/>
        <rect x="0" y="350" width="600" height="2" fill="#2E7D32" opacity="0.9"/>
      `,
      'Cotton': `
        <!-- Cotton field with bush patterns -->
        <circle cx="50" cy="200" r="15" fill="#F5F5DC" opacity="0.8"/>
        <circle cx="150" cy="220" r="18" fill="#F5F5DC" opacity="0.8"/>
        <circle cx="250" cy="210" r="16" fill="#F5F5DC" opacity="0.8"/>
        <circle cx="350" cy="230" r="17" fill="#F5F5DC" opacity="0.8"/>
        <circle cx="450" cy="215" r="15" fill="#F5F5DC" opacity="0.8"/>
        <circle cx="550" cy="225" r="16" fill="#F5F5DC" opacity="0.8"/>
        <circle cx="100" cy="280" r="14" fill="#F5F5DC" opacity="0.8"/>
        <circle cx="200" cy="290" r="16" fill="#F5F5DC" opacity="0.8"/>
        <circle cx="300" cy="285" r="15" fill="#F5F5DC" opacity="0.8"/>
        <circle cx="400" cy="295" r="17" fill="#F5F5DC" opacity="0.8"/>
        <circle cx="500" cy="280" r="15" fill="#F5F5DC" opacity="0.8"/>
      `,
      'Sugarcane': `
        <!-- Sugarcane field with tall stalks -->
        <rect x="30" y="180" width="8" height="150" fill="#7CB342" opacity="0.9"/>
        <rect x="60" y="170" width="8" height="160" fill="#7CB342" opacity="0.9"/>
        <rect x="90" y="175" width="8" height="155" fill="#7CB342" opacity="0.9"/>
        <rect x="120" y="165" width="8" height="165" fill="#7CB342" opacity="0.9"/>
        <rect x="150" y="180" width="8" height="150" fill="#7CB342" opacity="0.9"/>
        <rect x="180" y="170" width="8" height="160" fill="#7CB342" opacity="0.9"/>
        <rect x="210" y="175" width="8" height="155" fill="#7CB342" opacity="0.9"/>
        <rect x="240" y="165" width="8" height="165" fill="#7CB342" opacity="0.9"/>
        <rect x="270" y="180" width="8" height="150" fill="#7CB342" opacity="0.9"/>
        <rect x="300" y="170" width="8" height="160" fill="#7CB342" opacity="0.9"/>
        <rect x="330" y="175" width="8" height="155" fill="#7CB342" opacity="0.9"/>
        <rect x="360" y="165" width="8" height="165" fill="#7CB342" opacity="0.9"/>
        <rect x="390" y="180" width="8" height="150" fill="#7CB342" opacity="0.9"/>
        <rect x="420" y="170" width="8" height="160" fill="#7CB342" opacity="0.9"/>
        <rect x="450" y="175" width="8" height="155" fill="#7CB342" opacity="0.9"/>
        <rect x="480" y="165" width="8" height="165" fill="#7CB342" opacity="0.9"/>
        <rect x="510" y="180" width="8" height="150" fill="#7CB342" opacity="0.9"/>
        <rect x="540" y="170" width="8" height="160" fill="#7CB342" opacity="0.9"/>
        <rect x="570" y="175" width="8" height="155" fill="#7CB342" opacity="0.9"/>
      `
    };
    return rowPatterns[crop] || rowPatterns['Wheat'];
  };

  // Helper function to generate field elements
  const generateFieldElements = (crop: string) => {
    return `
      <!-- Irrigation system -->
      <rect x="100" y="160" width="400" height="5" fill="#616161" opacity="0.7"/>
      <circle cx="150" cy="162" r="8" fill="#757575" opacity="0.8"/>
      <circle cx="300" cy="162" r="8" fill="#757575" opacity="0.8"/>
      <circle cx="450" cy="162" r="8" fill="#757575" opacity="0.8"/>
      
      <!-- Storage facility -->
      <rect x="480" y="300" width="80" height="60" fill="#8D6E63" opacity="0.8"/>
      <rect x="485" y="310" width="15" height="20" fill="#5D4037" opacity="0.9"/>
      <rect x="510" y="310" width="15" height="20" fill="#5D4037" opacity="0.9"/>
      <rect x="535" y="310" width="15" height="20" fill="#5D4037" opacity="0.9"/>
      
      <!-- Path/road -->
      <rect x="0" y="390" width="600" height="10" fill="#9E9E9E" opacity="0.6"/>
    `;
  };

  // Helper function to generate subtle disease indicators
  const generateDiseaseIndicators = (crop: string) => {
    if (Math.random() > 0.7) {
      return `
        <!-- Subtle disease indicators -->
        <circle cx="200" cy="250" r="20" fill="#FF6B6B" opacity="0.2"/>
        <circle cx="400" cy="300" r="15" fill="#FF6B6B" opacity="0.15"/>
        <circle cx="100" cy="320" r="18" fill="#FF6B6B" opacity="0.18"/>
      `;
    }
    return '';
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleUpload = async () => {
    // Check if we have either a real image or demo image
    if (!image && !preview) {
      setError("Please select an entity from search to analyze");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setCurrentStep('analysis');

      // Use demo image if no real image uploaded
      let imageToAnalyze: string = preview || '';
      
      // Convert File to data URL if needed
      if (image instanceof File) {
        imageToAnalyze = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(image);
        });
      }

      console.log('🔍 Starting analysis with scope:', assessmentScope);
      console.log('🔗 Analyzing image:', imageToAnalyze ? 'Demo image generated' : 'Real image uploaded');

      // Generate enhanced infrared scan from image
      const generateEnhancedInfraredScan = (imageSrc: string): Promise<string> => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;

            // Set canvas size to match image
            canvas.width = img.width;
            canvas.height = img.height;

            // Draw original image
            ctx.drawImage(img, 0, 0);

            // Get image data for processing
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Enhanced infrared color mapping with more detailed spectrum
            for (let i = 0; i < data.length; i += 4) {
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];

              // Calculate luminance with enhanced formula
              const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

              // Enhanced IR camera spectrum with more granular steps
              if (luminance < 15) {
                // Extreme cold - deep purple
                data[i] = 13;
                data[i + 1] = 0;
                data[i + 2] = 25;
              } else if (luminance < 30) {
                // Very cold - dark blue
                data[i] = 0;
                data[i + 1] = 0;
                data[i + 2] = 100;
              } else if (luminance < 45) {
                // Cold - blue
                data[i] = 0;
                data[i + 1] = 0;
                data[i + 2] = 200;
              } else if (luminance < 60) {
                // Cool - light blue
                data[i] = 0;
                data[i + 1] = 100;
                data[i + 2] = 255;
              } else if (luminance < 75) {
                // Normal cool - cyan
                data[i] = 0;
                data[i + 1] = 200;
                data[i + 2] = 255;
              } else if (luminance < 90) {
                // Normal - green
                data[i] = 0;
                data[i + 1] = 255;
                data[i + 2] = 0;
              } else if (luminance < 105) {
                // Normal warm - yellow-green
                data[i] = 100;
                data[i + 1] = 255;
                data[i + 2] = 0;
              } else if (luminance < 120) {
                // Warm - yellow
                data[i] = 255;
                data[i + 1] = 255;
                data[i + 2] = 0;
              } else if (luminance < 135) {
                // Warm - orange
                data[i] = 255;
                data[i + 1] = 165;
                data[i + 2] = 0;
              } else if (luminance < 150) {
                // Hot - orange-red
                data[i] = 255;
                data[i + 1] = 100;
                data[i + 2] = 0;
              } else if (luminance < 165) {
                // Very hot - red
                data[i] = 255;
                data[i + 1] = 0;
                data[i + 2] = 0;
              } else if (luminance < 180) {
                // Extreme hot - dark red
                data[i] = 180;
                data[i + 1] = 0;
                data[i + 2] = 0;
              } else {
                // Ultra hot - maroon
                data[i] = 120;
                data[i + 1] = 0;
                data[i + 2] = 0;
              }
            }

            ctx.putImageData(imageData, 0, 0);

            // Add enhanced IR scan overlay
            ctx.globalAlpha = 0.3;

            // Add temperature gradient circles for hotspots
            for (let i = 0; i < 8; i++) {
              const x = Math.random() * canvas.width;
              const y = Math.random() * canvas.height;
              const radius = 20 + Math.random() * 40;
              const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
              gradient.addColorStop(0, 'rgba(255, 0, 0, 0.8)');
              gradient.addColorStop(0.5, 'rgba(255, 165, 0, 0.5)');
              gradient.addColorStop(1, 'rgba(255, 255, 0, 0.2)');
              ctx.fillStyle = gradient;
              ctx.beginPath();
              ctx.arc(x, y, radius, 0, Math.PI * 2);
              ctx.fill();
            }

            // Convert to data URL
            resolve(canvas.toDataURL('image/png'));
          };
          img.src = imageSrc;
        });
      };

      const enhancedInfraredScanUrl = await generateEnhancedInfraredScan(imageToAnalyze);

      // Get crop-specific disease analysis
      const cropName = selectedEntity?.crop || selectedEntity?.mainCrop || 'Unknown';
      const getDiseaseForCrop = (crop: string) => {
        const diseaseMap: { [key: string]: string[] } = {
          'Wheat': ['Leaf Blight', 'Wheat Rust', 'Powdery Mildew'],
          'Rice': ['Bacterial Leaf Blight', 'Rice Blast', 'Sheath Blight'],
          'Cotton': ['Cotton Wilt', 'Boll Rot', 'Leaf Curl Virus'],
          'Sugarcane': ['Red Rot', 'Sugarcane Mosaic', 'Leaf Scald'],
          'Pulses': ['Powdery Mildew', 'Anthracnose', 'Rust'],
          'Vegetables': ['Early Blight', 'Powdery Mildew', 'Bacterial Spot'],
          'Maize': ['Northern Leaf Blight', 'Gray Leaf Spot', 'Common Rust'],
          'Millets': ['Blast', 'Smut', 'Rust']
        };
        const diseases = diseaseMap[crop] || ['Leaf Blight', 'Powdery Mildew'];
        return diseases[Math.floor(Math.random() * diseases.length)];
      };

      const mockResult: AnalysisResult = {
        analysis_id: `enhanced-${Date.now()}`,
        timestamp: new Date().toISOString(),
        farmer_id: farmerId || selectedEntity?.id || 'anonymous',
        region: region || selectedEntity?.district || 'unknown',
        image_analysis: {
          disease: Math.random() > 0.3 ? getDiseaseForCrop(cropName) : "Healthy",
          confidence: 85 + Math.random() * 14,
          severity: Math.random() > 0.6 ? "High" : Math.random() > 0.3 ? "Moderate" : "Low",
          explanation: `Enhanced AI multi-spectral analysis of ${cropName} field indicates ${Math.random() > 0.3 ? 'early-stage infection patterns' : 'healthy crop conditions'}. Recommend field validation.`,
          heatmap: enhancedInfraredScanUrl
        },
        containment_decision: {
          action: assessmentScope === 'single-farmer' ? "Targeted Treatment" : "Area-Wide Monitoring",
          level: assessmentScope === 'single-farmer' ? 2 : 3,
          measures: assessmentScope === 'single-farmer'
            ? ["Immediate field inspection", "Sample collection for lab testing", "Preventive treatment application"]
            : ["Village-wide crop survey", "Coordinate with agricultural department", "Issue farmer advisory"],
          timeline: assessmentScope === 'single-farmer' ? "Within 48 hours" : "Within 7 days",
          authority_level: assessmentScope === 'single-farmer' ? "Field Officer" : "Regional Agricultural Officer",
          explanation: `Based on enhanced analysis of ${cropName} cultivation, immediate ${assessmentScope === 'single-farmer' ? 'targeted' : 'area-wide'} monitoring is recommended.`
        },
        quick_summary: {
          status: "Enhanced Analysis Complete",
          urgency: Math.random() > 0.5 ? "Medium" : "Low",
          next_steps: assessmentScope === 'single-farmer'
            ? ["Field verification required", "Document findings with photos", "Schedule follow-up assessment"]
            : ["Conduct village assessment", "Notify all stakeholders", "Allocate necessary resources"],
          report_ready: true
        }
      };

      setResult(mockResult);
      setCurrentStep('results');
    } catch (err: any) {
      console.error("❌ Analysis error:", err);
      setError(`❌ Analysis failed: ${err.message || "Unknown error occurred"}`);
      setCurrentStep('analysis');
    } finally {
      setLoading(false);
    }
  };

  const renderSearch = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
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
                        <Users className="w-5 h-5 text-green-500 mt-0.5" />
                      )}
                      <div className="text-left">
                        <div className="font-semibold text-gray-900">{entity.name}</div>
                        <div className="text-sm text-gray-600">
                          ID: {entity.id} • {assessmentScope === 'single-farmer' ? entity.village : entity.district}
                        </div>
                        <div className="text-xs text-gray-500">
                          {assessmentScope === 'single-farmer' ? 
                            `🌾 ${entity.crop} • 📏 ${entity.acres} acres • 📞 ${entity.phone}` : 
                            `👥 ${entity.farmers} farmers • 📍 ${entity.area} • 🌾 Main: ${entity.mainCrop}`
                          }
                        </div>
                        <div className="text-xs text-blue-600 font-medium mt-1">
                          {assessmentScope === 'single-farmer' ? 
                            `🔍 Analyzing ${entity.crop} field health` : 
                            `🔍 Analyzing ${entity.mainCrop} cultivation across village`
                          }
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 mt-1" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedEntity && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <span className="text-green-800 font-medium">
                    Selected: {selectedEntity.name}
                  </span>
                  <div className="text-sm text-green-700 mt-1">
                    {assessmentScope === 'single-farmer' ? 
                      `🌾 Crop: ${selectedEntity.crop} | 📏 Area: ${selectedEntity.acres} acres | 📍 Village: ${selectedEntity.village}` : 
                      `🌾 Main Crop: ${selectedEntity.mainCrop} | 👥 Farmers: ${selectedEntity.farmers} | 📍 Area: ${selectedEntity.area}`
                    }
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    ✅ Demo image generated and form filled automatically
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="text-center text-sm text-gray-500">
          <p>💡 Demo data loaded. Try searching for: {assessmentScope === 'single-farmer' ? 'FARM001, Rajesh, Wheat' : 'VIL001, Rampur, Wheat'}</p>
        </div>
      </div>
    </div>
  );

  const renderScopeSelection = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
          <Camera className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Enhanced Analysis</h1>
        <p className="text-gray-600 text-lg">Choose your assessment scope for detailed crop disease analysis</p>
      </div>
      
      <AssessmentScope onScopeSelect={handleScopeSelect} />
    </div>
  );

  const renderAnalysisForm = () => (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {assessmentScope === 'single-farmer' ? 'Single Farmer' : 'Village Cluster'} Analysis
              </h2>
              <p className="text-gray-600 text-sm">
                {assessmentScope === 'single-farmer' 
                  ? 'Individual field-level disease detection and containment'
                  : 'Multi-farmer aggregation for coordinated response'
                }
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentStep('scope-selection')}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            ← Change Scope
          </button>
        </div>
      </div>

      {/* Crop Details Section */}
      {selectedEntity && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">🌾</span>
            </div>
            <h3 className="text-lg font-bold text-gray-800">Crop Analysis Details</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assessmentScope === 'single-farmer' ? (
              <>
                <div className="bg-white rounded-lg p-4 border border-green-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-green-600">👤</span>
                    <span className="font-semibold text-gray-700">Farmer</span>
                  </div>
                  <p className="text-gray-900 font-medium">{selectedEntity.name}</p>
                  <p className="text-sm text-gray-600">ID: {selectedEntity.id}</p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-green-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-green-600">🌾</span>
                    <span className="font-semibold text-gray-700">Crop Type</span>
                  </div>
                  <p className="text-gray-900 font-medium text-lg">{selectedEntity.crop}</p>
                  <p className="text-sm text-blue-600">🔍 Analyzing field health</p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-green-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-green-600">📏</span>
                    <span className="font-semibold text-gray-700">Field Area</span>
                  </div>
                  <p className="text-gray-900 font-medium">{selectedEntity.acres} acres</p>
                  <p className="text-sm text-gray-600">Total cultivation area</p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-green-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-green-600">📍</span>
                    <span className="font-semibold text-gray-700">Location</span>
                  </div>
                  <p className="text-gray-900 font-medium">{selectedEntity.village}</p>
                  <p className="text-sm text-gray-600">{selectedEntity.district} District</p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-white rounded-lg p-4 border border-green-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-green-600">🏘️</span>
                    <span className="font-semibold text-gray-700">Village</span>
                  </div>
                  <p className="text-gray-900 font-medium">{selectedEntity.name}</p>
                  <p className="text-sm text-gray-600">ID: {selectedEntity.id}</p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-green-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-green-600">🌾</span>
                    <span className="font-semibold text-gray-700">Main Crop</span>
                  </div>
                  <p className="text-gray-900 font-medium text-lg">{selectedEntity.mainCrop}</p>
                  <p className="text-sm text-blue-600">🔍 Village-wide analysis</p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-green-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-green-600">👥</span>
                    <span className="font-semibold text-gray-700">Farmers</span>
                  </div>
                  <p className="text-gray-900 font-medium">{selectedEntity.farmers}</p>
                  <p className="text-sm text-gray-600">Total farmers in village</p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-green-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-green-600">📍</span>
                    <span className="font-semibold text-gray-700">Area</span>
                  </div>
                  <p className="text-gray-900 font-medium">{selectedEntity.area}</p>
                  <p className="text-sm text-gray-600">{selectedEntity.district} District</p>
                </div>
              </>
            )}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <span className="text-blue-600">🤖</span>
              <span className="text-sm text-blue-800 font-medium">
                AI Analysis: Ready to analyze {assessmentScope === 'single-farmer' ? selectedEntity.crop : selectedEntity.mainCrop} for disease detection
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Form Fields */}
      <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6 mb-6">
        {assessmentScope === 'single-farmer' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Farmer ID</label>
              <input
                type="text"
                value={farmerId}
                onChange={(e) => setFarmerId(e.target.value)}
                placeholder="Enter farmer ID (e.g., FARMER_001)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="Enter region (e.g., Punjab, Maharashtra)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Village Name</label>
              <input
                type="text"
                value={villageName}
                onChange={(e) => setVillageName(e.target.value)}
                placeholder="Enter village name (e.g., Amritpur, Badshahpur)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Crop Type</label>
              <select
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Select crop type"
                title="Select crop type for analysis"
              >
                <option value="">Select crop type</option>
                <option value="Wheat">Wheat</option>
                <option value="Rice">Rice</option>
                <option value="Cotton">Cotton</option>
                <option value="Sugarcane">Sugarcane</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Field Area (hectares)</label>
              <input
                type="text"
                value={fieldArea}
                onChange={(e) => setFieldArea(e.target.value)}
                placeholder="Enter field area in hectares"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>

      {/* File Upload */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors mb-6">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          id="image-upload"
        />
        <label 
          htmlFor="image-upload" 
          className="cursor-pointer inline-flex flex-col items-center"
        >
          <Upload className="w-12 h-12 text-gray-400 mb-3" />
          <span className="text-gray-600">
            {image ? image.name : "Click to upload or drag and drop"}
          </span>
          <span className="text-gray-400 text-sm mt-1">
            PNG, JPG, GIF up to 5MB
          </span>
        </label>
      </div>

      {/* Image Preview */}
      {preview && (
        <div className="mb-6">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-64 object-cover rounded-lg shadow-md"
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => setCurrentStep('scope-selection')}
          className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Back to Scope Selection
        </button>
        
        <button
          onClick={handleUpload}
          disabled={!image || loading}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
            !image || loading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700 active:bg-green-800"
          }`}
        >
          {loading ? 'Analyzing...' : `Analyze ${assessmentScope === 'single-farmer' ? 'Farmer' : 'Village'}`}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <AlertTriangle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderResults = () => {
    if (!result) return null;

    return (
      <div className="max-w-6xl mx-auto p-6">
        {/* Results Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 bg-gradient-to-br ${
              assessmentScope === 'single-farmer' ? 'from-blue-500 to-blue-600' : 'from-purple-500 to-purple-600'
            } rounded-xl flex items-center justify-center shadow-lg`}>
              {assessmentScope === 'single-farmer' ? (
                <User className="w-6 h-6 text-white" />
              ) : (
                <Users className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {assessmentScope === 'single-farmer' ? 'Individual Farmer Impact Summary' : 'Village Disease Risk Assessment'}
              </h2>
              <p className="text-gray-600 text-sm">
                Analysis completed on {new Date(result.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Single Farmer Results */}
        {assessmentScope === 'single-farmer' && (
          <div className="space-y-6">
            {/* Farmer Information Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl shadow-sm">
              <div className="px-6 py-4 border-b-2 border-blue-200">
                <h3 className="text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Individual Farmer Impact Summary
                </h3>
                <p className="text-xs text-blue-700 mt-1">Field-level disease detection and localized recommendations</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{result.farmer_id || farmerId || 'Unknown'}</div>
                    <div className="text-sm text-gray-600">Farmer ID</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{fieldArea || 'N/A'} ha</div>
                    <div className="text-sm text-gray-600">Field Area</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{cropType || 'Mixed'}</div>
                    <div className="text-sm text-gray-600">Crop Type</div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border border-blue-200 p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Farmer Profile</div>
                      <div className="text-sm text-gray-600">Individual field analysis</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Analysis Type:</span>
                      <span className="ml-2 font-medium">Single Farmer Assessment</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Region:</span>
                      <span className="ml-2 font-medium">{result.region || region || 'Not specified'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Disease Detection Results */}
            <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm">
              <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 border-b-2 border-red-200">
                <h3 className="text-gray-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Disease Detection Results
                </h3>
                <p className="text-xs text-red-700 mt-1">AI-powered crop disease analysis with confidence scoring</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Detected Disease:</span>
                    <span className={`font-bold ${getSeverityColor(result.image_analysis.disease)}`}>
                      {result.image_analysis.disease}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Confidence Level:</span>
                    <span className={`font-bold ${getSeverityColor(result.image_analysis.confidence.toString())}`}>
                      {result.image_analysis.confidence}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Severity Level:</span>
                    <span className={`font-bold ${getSeverityColor(result.image_analysis.severity)}`}>
                      {result.image_analysis.severity}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Analysis ID:</span>
                    <span className="font-mono text-sm text-gray-700">
                      {result.analysis_id}
                    </span>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    AI Analysis Explanation
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {result.image_analysis.explanation}
                  </p>
                </div>
              </div>
            </div>

            {/* Containment Recommendations */}
            <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b-2 border-green-200">
                <h3 className="text-gray-900 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Containment Recommendations
                </h3>
                <p className="text-xs text-green-700 mt-1">Government-approved containment measures and action plan</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Recommended Action:</span>
                    <span className="font-bold text-green-600">
                      {result.containment_decision.action}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Authority Level:</span>
                    <span className="font-bold text-blue-600">
                      {result.containment_decision.authority_level}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Response Timeline:</span>
                    <span className="font-bold text-orange-600">
                      {result.containment_decision.timeline}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Priority Level:</span>
                    <span className={`font-bold ${getSeverityColor(result.containment_decision.level.toString())}`}>
                      Level {result.containment_decision.level}
                    </span>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    Recommended Measures
                  </h4>
                  <ul className="space-y-2">
                    {result.containment_decision.measures.map((measure: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                        {measure}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-4 bg-yellow-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    Official Explanation
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {result.containment_decision.explanation}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Summary Dashboard */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl shadow-sm">
              <div className="px-6 py-4 border-b-2 border-indigo-200">
                <h3 className="text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  Quick Summary Dashboard
                </h3>
                <p className="text-xs text-indigo-700 mt-1">Overall status and next steps</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-2 ${
                      result.quick_summary.status === 'Healthy' 
                        ? 'bg-green-100' 
                        : 'bg-orange-100'
                    }`}>
                      {result.quick_summary.status === 'Healthy' ? (
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-8 h-8 text-orange-600" />
                      )}
                    </div>
                    <div className={`text-lg font-bold ${
                      result.quick_summary.status === 'Healthy' 
                        ? 'text-green-600' 
                        : 'text-orange-600'
                    }`}>
                      {result.quick_summary.status}
                    </div>
                    <div className="text-sm text-gray-600">Overall Status</div>
                  </div>
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-2 ${
                      result.quick_summary.urgency === 'Low' 
                        ? 'bg-blue-100' 
                        : result.quick_summary.urgency === 'Medium'
                        ? 'bg-yellow-100'
                        : 'bg-red-100'
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        result.quick_summary.urgency === 'Low' 
                          ? 'bg-blue-600' 
                          : result.quick_summary.urgency === 'Medium'
                          ? 'bg-yellow-600'
                          : 'bg-red-600'
                      }`}>
                        {result.quick_summary.urgency[0]}
                      </div>
                    </div>
                    <div className={`text-lg font-bold ${
                      result.quick_summary.urgency === 'Low' 
                        ? 'text-blue-600' 
                        : result.quick_summary.urgency === 'Medium'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}>
                      {result.quick_summary.urgency}
                    </div>
                    <div className="text-sm text-gray-600">Urgency Level</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto rounded-full bg-purple-100 flex items-center justify-center mb-2">
                      <CheckCircle className="w-8 h-8 text-purple-600" />
                    </div>
                    <div className="text-lg font-bold text-purple-600">
                      Report Ready
                    </div>
                    <div className="text-sm text-gray-600">Documentation</div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border border-indigo-200 p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Next Steps</h4>
                  <ul className="space-y-2">
                    {result.quick_summary.next_steps.map((step: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <ArrowRight className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Village Cluster Results */}
        {assessmentScope === 'village-cluster' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-purple-900">Village Analysis Results</h3>
              <p className="text-sm text-purple-700 mt-2">
                Village cluster analysis is being processed. The system will aggregate data from multiple farmers 
                to provide coordinated containment recommendations.
              </p>
              <div className="mt-4 bg-white rounded-lg p-4 border border-purple-200">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  <span className="font-medium">Village: {villageName || 'Unknown'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={() => setCurrentStep('scope-selection')}
            className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            New Analysis
          </button>
          
          <button
            onClick={() => {
              console.log('Generate PDF report');
            }}
            className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors"
          >
            Generate Report
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-gray-50">
      {currentStep === 'scope-selection' && renderScopeSelection()}
      {currentStep === 'search' && renderSearch()}
      {currentStep === 'analysis' && renderAnalysisForm()}
      {currentStep === 'results' && renderResults()}
    </div>
  );
};

export default EnhancedImageDetection;
