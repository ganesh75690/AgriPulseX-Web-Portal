import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, MapPin, Info, X } from 'lucide-react';
import ActionReadinessIndicator, { ARIInputs, ARIResult } from './ActionReadinessIndicator';
import GovernanceAuditTrail from './GovernanceAuditTrail';
import ContainmentExitReadinessMeter from './ContainmentExitReadinessMeter';

// Simple PDF generation using canvas and print
const generatePDF = (content: string, filename: string) => {
  // Create a hidden iframe for printing
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = 'none';
  iframe.style.margin = '0';
  iframe.style.padding = '0';
  iframe.style.overflow = 'hidden';
  iframe.style.visibility = 'hidden';
  
  document.body.appendChild(iframe);
  
  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  
  if (iframeDoc) {
    // Write the HTML content to the iframe
    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Decision Report</title>
        <style>
          @page { margin: 1cm; size: A4; }
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            line-height: 1.4; 
            font-size: 12pt;
            color: #333;
          }
          .header { 
            text-align: center; 
            border-bottom: 3px solid #2f9d58; 
            padding-bottom: 20px; 
            margin-bottom: 30px; 
            page-break-after: avoid;
          }
          .section { 
            margin: 20px 0; 
            padding: 15px; 
            border: 1px solid #ddd; 
            border-radius: 5px;
            page-break-inside: avoid;
          }
          .section-title { 
            font-weight: bold; 
            color: #2f9d58; 
            font-size: 16pt; 
            margin-bottom: 10px;
            page-break-after: avoid;
          }
          .field { margin: 8px 0; }
          .label { font-weight: bold; color: #333; }
          .value { color: #666; }
          .risk-high { color: #dc2626; font-weight: bold; }
          .risk-medium { color: #f59e0b; font-weight: bold; }
          .risk-low { color: #16a34a; font-weight: bold; }
          .footer { 
            margin-top: 40px; 
            text-align: center; 
            color: #666; 
            font-size: 10pt; 
            border-top: 1px solid #ddd; 
            padding-top: 20px;
            page-break-inside: avoid;
          }
          h1 { font-size: 20pt; margin: 10px 0; }
          h2 { font-size: 16pt; margin: 8px 0; }
          @media print {
            body { margin: 0.5cm; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        ${content}
        <script>
          window.onload = function() {
            setTimeout(() => {
              window.print();
              setTimeout(() => {
                document.body.removeChild(window.frameElement);
              }, 100);
            }, 500);
          }
        </script>
      </body>
      </html>
    `);
    iframeDoc.close();
    
    // Show success message
    setTimeout(() => {
      alert('Print dialog opened! Choose "Save as PDF" to download the report.');
    }, 1000);
  }
};

interface DialogMessage {
  type: 'success' | 'warning' | 'info';
  title: string;
  message: string;
  details?: string;
}

interface ContainmentReportData {
  cropName: string;
  diseaseName: string;
  diseaseType: string;
  severity: string;
  modeOfSpread: string;
  location: string;
  villages: string[];
  containmentRadius: number;
  affectedFarms: number;
  season: string;
  confidence: number;
  selectedFarmerDetails?: string[];
  totalVillages?: number;
  selectedVillageCount?: number;
  fieldReports?: FieldReport[];
  pesticideRecommendations?: PesticideRecommendation[];
  cropRotationRecommendation?: CropRotationRecommendation;
}

interface FieldReport {
  id: string;
  farmerName: string;
  village: string;
  crop: string;
  disease: string;
  severity: string;
  reportDate: string;
  description: string;
  imageUrl?: string;
  confidence: number;
  landSize: string;
  farmerContact: string;
  coordinates?: string;
  symptoms: string[];
  recommendedAction: string;
}

interface VillageReport {
  id: string;
  villageName: string;
  region: string;
  totalFarms: number;
  affectedFarms: number;
  primaryCrop: string;
  disease: string;
  severity: string;
  reportDate: string;
  description: string;
  estimatedYieldLoss: string;
  confidence: number;
  coordinates: string;
  population: string;
  agriculturalOfficer: string;
  officerContact: string;
  symptoms: string[];
  recommendedAction: string;
}

interface PesticideRecommendation {
  name: string;
  type: 'organic' | 'chemical';
  purpose: string;
  uses: string;
  targetDisease: string[];
  targetCrop: string[];
  dosage: string;
  applicationMethod: string;
  preHarvestInterval: string;
  maxApplications: string;
  safetyPrecautions: string[];
  effectiveness: string;
  cost: string;
  availability: string;
}

interface CropRotationRecommendation {
  currentCrop: string;
  disease: string;
  recommendedCrops: {
    crop: string;
    reason: string;
    benefits: string[];
    plantingSeason: string;
    expectedYield: string;
  }[];
  cropsToAvoid: string[];
  soilRecovery: {
    method: string;
    duration: string;
    benefits: string[];
  }[];
  residueManagement: string;
}

interface TreatmentSchedule {
  phase: string;
  timeline: string;
  treatments: {
    name: string;
    type: 'organic' | 'chemical' | 'cultural';
    dosage: string;
    application: string;
    purpose: string;
  }[];
}

interface TreatmentAdvisory {
  category: 'organic' | 'chemical';
  name: string;
  purpose: string;
  quantity: string;
  interval: string;
  effectiveness: string;
}

export default function ContainmentControl() {
  const [selectedRegion, setSelectedRegion] = useState('Punjab - Amritsar');
  const [selectedDisease, setSelectedDisease] = useState('Late Blight (Potato)');
  const [severity, setSeverity] = useState('High');
  const [dataConfidence, setDataConfidence] = useState(87);
  const [showRecommendation, setShowRecommendation] = useState(true);
  const [dialogMessage, setDialogMessage] = useState<DialogMessage | null>(null);
  const [officerNotes, setOfficerNotes] = useState('');
  const [decisionResult, setDecisionResult] = useState<any>(null);
  const [decisionHistory, setDecisionHistory] = useState<any[]>([]);
  const [isDynamicMode, setIsDynamicMode] = useState(true);
  const [ariResult, setAriResult] = useState<ARIResult | null>(null);
  const [ariInputs, setAriInputs] = useState<ARIInputs>({
    diseaseSeverityScore: 0.75,
    fieldReportConfidenceScore: 0.87,
    independentReportsCount: 3,
    imageQualityScore: 0.82,
    villageClusteringStrength: 0.65
  });

  // Containment Report State
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState<ContainmentReportData | null>(null);
  
  // Village and Farmer Selection State
  const [selectedVillages, setSelectedVillages] = useState<string[]>([]);
  const [selectedFarmers, setSelectedFarmers] = useState<string[]>([]);
  
  // Field Reports State
  const [fieldReports, setFieldReports] = useState<FieldReport[]>([
    {
      id: 'FR-2026-001',
      farmerName: 'Rajesh Kumar',
      village: 'Amritsar Central',
      crop: 'Potato',
      disease: 'Late Blight',
      severity: 'High',
      reportDate: '2026-01-20',
      description: 'Severe leaf blight symptoms observed in potato crop. Yellowing and brown spots on leaves affecting 60% of the field.',
      imageUrl: '/field-images/late-blight-001.jpg',
      confidence: 92,
      landSize: '2.5 acres',
      farmerContact: '+91-98765-43210',
      coordinates: '31.6340° N, 74.8723° E',
      symptoms: ['Yellow spots on leaves', 'Brown lesions', 'Leaf curling', 'Stunted growth'],
      recommendedAction: 'Immediate fungicide application and quarantine'
    },
    {
      id: 'FR-2026-002',
      farmerName: 'Sunita Devi',
      village: 'Majitha',
      crop: 'Tomato',
      disease: 'Bacterial Wilt',
      severity: 'Medium',
      reportDate: '2026-01-21',
      description: 'Wilting symptoms observed in tomato plants during morning hours. Plants recover partially in evening.',
      imageUrl: '/field-images/bacterial-wilt-002.jpg',
      confidence: 85,
      landSize: '1.8 acres',
      farmerContact: '+91-98765-54321',
      coordinates: '31.6420° N, 74.8823° E',
      symptoms: ['Wilting during day', 'Yellowing of lower leaves', 'Stunted growth', 'Vascular discoloration'],
      recommendedAction: 'Remove affected plants and soil treatment'
    },
    {
      id: 'FR-2026-003',
      farmerName: 'Mohammed Ali',
      village: 'Ajnala',
      crop: 'Wheat',
      disease: 'Yellow Rust',
      severity: 'Low',
      reportDate: '2026-01-22',
      description: 'Small yellow rust pustules observed on lower leaves. Early stage infection detected.',
      imageUrl: '/field-images/yellow-rust-003.jpg',
      confidence: 78,
      landSize: '3.2 acres',
      farmerContact: '+91-98765-65432',
      coordinates: '31.6520° N, 74.8923° E',
      symptoms: ['Yellow pustules', 'Powdery spores', 'Lower leaf infection', 'Mild chlorosis'],
      recommendedAction: 'Monitor and apply preventive fungicide if spreading'
    },
    {
      id: 'FR-2026-004',
      farmerName: 'Gurpreet Singh',
      village: 'Tarn Taran',
      crop: 'Potato',
      disease: 'Late Blight',
      severity: 'Critical',
      reportDate: '2026-01-23',
      description: 'Widespread late blight infection affecting 80% of potato field. Rapid spread observed in neighboring farms.',
      imageUrl: '/field-images/late-blight-004.jpg',
      confidence: 95,
      landSize: '4.1 acres',
      farmerContact: '+91-98765-76543',
      coordinates: '31.4560° N, 74.9234° E',
      symptoms: ['Large brown lesions', 'White fungal growth', 'Rapid leaf death', 'Field-wide spread'],
      recommendedAction: 'Emergency containment and immediate fungicide application'
    },
    {
      id: 'FR-2026-005',
      farmerName: 'Lakshmi Narayan',
      village: 'Baba Bakala',
      crop: 'Tomato',
      disease: 'Bacterial Wilt',
      severity: 'High',
      reportDate: '2026-01-23',
      description: 'Severe bacterial wilt affecting entire tomato crop. Plants showing complete wilting and death.',
      imageUrl: '/field-images/bacterial-wilt-005.jpg',
      confidence: 88,
      landSize: '1.5 acres',
      farmerContact: '+91-98765-98765',
      coordinates: '31.5230° N, 74.9345° E',
      symptoms: ['Complete wilting', 'Stem discoloration', 'Root rot', 'Plant death'],
      recommendedAction: 'Complete crop removal and soil sterilization'
    }
  ]);

  // Selected specific report for action
  const [selectedReport, setSelectedReport] = useState<FieldReport | null>(null);

  // Village Reports Data
  const [villageReports] = useState<VillageReport[]>([
    {
      id: 'VR-2026-001',
      villageName: 'Amritsar Central',
      region: 'Punjab - Amritsar',
      totalFarms: 45,
      affectedFarms: 12,
      primaryCrop: 'Potato',
      disease: 'Late Blight',
      severity: 'High',
      reportDate: '2026-01-20',
      description: 'Widespread late blight infection affecting multiple potato farms in the central area. Rapid spread observed due to favorable weather conditions.',
      estimatedYieldLoss: '35%',
      confidence: 88,
      coordinates: '31.6340° N, 74.8723° E',
      population: '15,000',
      agriculturalOfficer: 'Dr. Rajesh Sharma',
      officerContact: '+91-98765-11111',
      symptoms: ['Yellow spots on leaves', 'Brown lesions', 'White fungal growth', 'Rapid spread'],
      recommendedAction: 'Immediate fungicide application and quarantine measures'
    },
    {
      id: 'VR-2026-002',
      villageName: 'Majitha',
      region: 'Punjab - Amritsar',
      totalFarms: 38,
      affectedFarms: 8,
      primaryCrop: 'Tomato',
      disease: 'Bacterial Wilt',
      severity: 'Medium',
      reportDate: '2026-01-21',
      description: 'Bacterial wilt detected in tomato farms. Contained to specific areas but monitoring required.',
      estimatedYieldLoss: '20%',
      confidence: 82,
      coordinates: '31.6420° N, 74.8823° E',
      population: '12,000',
      agriculturalOfficer: 'Ms. Sunita Devi',
      officerContact: '+91-98765-22222',
      symptoms: ['Wilting during day', 'Stem discoloration', 'Partial recovery', 'Vascular browning'],
      recommendedAction: 'Remove affected plants and soil treatment'
    },
    {
      id: 'VR-2026-003',
      villageName: 'Nashik Central',
      region: 'Maharashtra - Nashik',
      totalFarms: 52,
      affectedFarms: 15,
      primaryCrop: 'Grape',
      disease: 'Powdery Mildew',
      severity: 'Medium',
      reportDate: '2026-01-22',
      description: 'Powdery mildew affecting grape vineyards. Early detection allows for effective organic treatment.',
      estimatedYieldLoss: '15%',
      confidence: 79,
      coordinates: '19.9975° N, 73.7898° E',
      population: '18,000',
      agriculturalOfficer: 'Dr. Mohammed Ali',
      officerContact: '+91-98765-33333',
      symptoms: ['White powdery growth', 'Leaf curling', 'Reduced photosynthesis', 'Sunken spots on fruit'],
      recommendedAction: 'Organic fungicide application and canopy management'
    },
    {
      id: 'VR-2026-004',
      villageName: 'Bangalore Rural Central',
      region: 'Karnataka - Bangalore Rural',
      totalFarms: 41,
      affectedFarms: 18,
      primaryCrop: 'Wheat',
      disease: 'Yellow Rust',
      severity: 'Low',
      reportDate: '2026-01-23',
      description: 'Early stage yellow rust detected in wheat fields. Low severity allows for preventive measures.',
      estimatedYieldLoss: '8%',
      confidence: 75,
      coordinates: '12.9716° N, 77.5946° E',
      population: '22,000',
      agriculturalOfficer: 'Dr. Gurpreet Singh',
      officerContact: '+91-98765-44444',
      symptoms: ['Yellow pustules', 'Powdery spores', 'Lower leaf infection', 'Mild chlorosis'],
      recommendedAction: 'Monitor and apply preventive fungicide if spreading'
    },
    {
      id: 'VR-2026-005',
      villageName: 'Meerut Central',
      region: 'Uttar Pradesh - Meerut',
      totalFarms: 48,
      affectedFarms: 22,
      primaryCrop: 'Paddy',
      disease: 'Stem Rot',
      severity: 'Critical',
      reportDate: '2026-01-23',
      description: 'Critical stem rot infection in paddy fields. Immediate action required to prevent crop loss.',
      estimatedYieldLoss: '60%',
      confidence: 92,
      coordinates: '28.9845° N, 77.7064° E',
      population: '25,000',
      agriculturalOfficer: 'Dr. Lakshmi Narayan',
      officerContact: '+91-98765-55555',
      symptoms: ['Stem discoloration', 'Plant death', 'Water-soaked lesions', 'Foul odor'],
      recommendedAction: 'Emergency drainage and fungicide application'
    }
  ]);

  // Selected village report for action
  const [selectedVillageReport, setSelectedVillageReport] = useState<VillageReport | null>(null);

  // Auto-update decision parameters when field report is selected
  useEffect(() => {
    if (selectedReport) {
      // Update disease based on selected report
      const diseaseOption = `${selectedReport.disease} (${selectedReport.crop})`;
      setSelectedDisease(diseaseOption);
      setSeverity(selectedReport.severity);
      setDataConfidence(selectedReport.confidence);
      
      // Update region based on village mapping
      const villageToRegionMap: { [key: string]: string } = {
        'Amritsar Central': 'Punjab - Amritsar',
        'Majitha': 'Punjab - Amritsar', 
        'Ajnala': 'Punjab - Amritsar',
        'Tarn Taran': 'Punjab - Amritsar',
        'Baba Bakala': 'Punjab - Amritsar',
        'Nashik Central': 'Maharashtra - Nashik',
        'Sinnar': 'Maharashtra - Nashik',
        'Igatpuri': 'Maharashtra - Nashik',
        'Trimbakeshwar': 'Maharashtra - Nashik',
        'Dindori': 'Maharashtra - Nashik',
        'Bangalore Rural Central': 'Karnataka - Bangalore Rural',
        'Devanahalli': 'Karnataka - Bangalore Rural',
        'Hoskote': 'Karnataka - Bangalore Rural',
        'Nelamangala': 'Karnataka - Bangalore Rural',
        'Meerut Central': 'Uttar Pradesh - Meerut',
        'Modinagar': 'Uttar Pradesh - Meerut',
        'Hapur': 'Uttar Pradesh - Meerut',
        'Sardhana': 'Uttar Pradesh - Meerut',
        'Anand Central': 'Gujarat - Anand',
        'Vallabh Vidyanagar': 'Gujarat - Anand',
        'Petlad': 'Gujarat - Anand'
      };
      
      const detectedRegion = villageToRegionMap[selectedReport.village] || selectedRegion;
      setSelectedRegion(detectedRegion);
    }
  }, [selectedReport]);

  // Auto-update decision parameters when village report is selected
  useEffect(() => {
    if (selectedVillageReport) {
      // Update disease based on selected village report
      const diseaseOption = `${selectedVillageReport.disease} (${selectedVillageReport.primaryCrop})`;
      setSelectedDisease(diseaseOption);
      setSeverity(selectedVillageReport.severity);
      setDataConfidence(selectedVillageReport.confidence);
      setSelectedRegion(selectedVillageReport.region);
    }
  }, [selectedVillageReport]);

  // Auto-detection State
  const [autoDetectedRegion, setAutoDetectedRegion] = useState<string>('');
  const [autoDetectedVillages, setAutoDetectedVillages] = useState<string[]>([]);
  const [autoDetectedFarmers, setAutoDetectedFarmers] = useState<string[]>([]);
  const [autoDetectedDisease, setAutoDetectedDisease] = useState<string>('');
  const [autoDetectedSeverity, setAutoDetectedSeverity] = useState<string>('');
  const [autoDetectedCrop, setAutoDetectedCrop] = useState<string>('');

  // Auto-detection Functions
  const detectFromFieldReports = () => {
    // Get unique villages from field reports
    const villages = [...new Set(fieldReports.map(report => report.village))];
    const farmers = [...new Set(fieldReports.map(report => `${report.farmerName} - ${report.village}`))];
    
    // Detect most common disease and severity
    const diseaseCount: { [key: string]: number } = {};
    const severityCount: { [key: string]: number } = {};
    const cropCount: { [key: string]: number } = {};
    
    fieldReports.forEach(report => {
      diseaseCount[report.disease] = (diseaseCount[report.disease] || 0) + 1;
      severityCount[report.severity] = (severityCount[report.severity] || 0) + 1;
      cropCount[report.crop] = (cropCount[report.crop] || 0) + 1;
    });
    
    const mostCommonDisease = Object.keys(diseaseCount).reduce((a, b) => diseaseCount[a] > diseaseCount[b] ? a : b);
    const highestSeverity = Object.keys(severityCount).reduce((a, b) => {
      const severityOrder = { 'Critical': 3, 'High': 2, 'Medium': 1, 'Low': 0 };
      return severityOrder[a as keyof typeof severityOrder] > severityOrder[b as keyof typeof severityOrder] ? a : b;
    });
    const mostCommonCrop = Object.keys(cropCount).reduce((a, b) => cropCount[a] > cropCount[b] ? a : b);
    
    // Auto-detect region based on villages
    const regionMap: { [key: string]: string } = {
      'Amritsar Central': 'Punjab - Amritsar',
      'Majitha': 'Punjab - Amritsar',
      'Ajnala': 'Punjab - Amritsar',
      'Tarn Taran': 'Punjab - Amritsar',
      'Baba Bakala': 'Punjab - Amritsar',
      'Nashik Central': 'Maharashtra - Nashik',
      'Sinnar': 'Maharashtra - Nashik',
      'Igatpuri': 'Maharashtra - Nashik',
      'Trimbakeshwar': 'Maharashtra - Nashik',
      'Dindori': 'Maharashtra - Nashik',
      'Bangalore Rural Central': 'Karnataka - Bangalore Rural',
      'Devanahalli': 'Karnataka - Bangalore Rural',
      'Hoskote': 'Karnataka - Bangalore Rural',
      'Nelamangala': 'Karnataka - Bangalore Rural',
      'Dod Ballapur': 'Karnataka - Bangalore Rural'
    };
    
    const detectedRegion = villages.length > 0 ? regionMap[villages[0]] || 'Punjab - Amritsar' : '';
    
    // Set auto-detected values
    setAutoDetectedRegion(detectedRegion);
    setAutoDetectedVillages(villages);
    setAutoDetectedFarmers(farmers);
    setAutoDetectedDisease(mostCommonDisease);
    setAutoDetectedSeverity(highestSeverity);
    setAutoDetectedCrop(mostCommonCrop);
    
    // Auto-update form fields
    if (detectedRegion) setSelectedRegion(detectedRegion);
    if (mostCommonCrop && mostCommonDisease) {
      const diseaseMap: { [key: string]: string } = {
        'Late Blight': 'Late Blight (Potato)',
        'Bacterial Wilt': 'Bacterial Wilt (Tomato)',
        'Yellow Rust': 'Yellow Rust (Wheat)'
      };
      if (diseaseMap[mostCommonDisease]) {
        setSelectedDisease(diseaseMap[mostCommonDisease]);
      }
    }
    setSeverity(highestSeverity);
    
    // Calculate average confidence
    const avgConfidence = Math.round(fieldReports.reduce((sum, report) => sum + report.confidence, 0) / fieldReports.length);
    setDataConfidence(avgConfidence);
    
    // Auto-select villages and farmers
    setSelectedVillages(villages);
    setSelectedFarmers(farmers);
  };

  const applyAutoDetection = () => {
    detectFromFieldReports();
    setDialogMessage({
      type: 'success',
      title: '✅ Auto-Detection Applied',
      message: 'Parameters automatically detected from field reports',
      details: `Detected Region: ${autoDetectedRegion || 'N/A'}\nDetected Villages: ${autoDetectedVillages.length}\nDetected Farmers: ${autoDetectedFarmers.length}\nPrimary Disease: ${autoDetectedDisease}\nSeverity: ${autoDetectedSeverity}\nPrimary Crop: ${autoDetectedCrop}\n\nAll parameters have been automatically set based on the field reports.`
    });
  };

  // Helper functions for disease-specific data
  const getSymptomsForDisease = (disease: string): string[] => {
    const symptomsMap: { [key: string]: string[] } = {
      'Late Blight': ['Yellow spots on leaves', 'Brown lesions', 'White fungal growth', 'Leaf curling'],
      'Yellow Rust': ['Yellow pustules', 'Powdery spores', 'Lower leaf infection', 'Mild chlorosis'],
      'Bacterial Wilt': ['Wilting during day', 'Stem discoloration', 'Root rot', 'Plant death'],
      'Leaf Blight': ['Brown spots', 'Leaf yellowing', 'Necrotic lesions', 'Premature leaf drop'],
      'Powdery Mildew': ['White powdery growth', 'Leaf distortion', 'Reduced photosynthesis', 'Stunted growth']
    };
    return symptomsMap[disease] || ['General symptoms', 'Leaf damage', 'Growth reduction'];
  };

  const getRecommendedActionForSeverity = (severity: string, disease: string): string => {
    const actionMap: { [key: string]: { [key: string]: string } } = {
      'Critical': {
        'default': 'Emergency containment and immediate treatment application'
      },
      'High': {
        'default': 'Urgent containment and rapid response measures'
      },
      'Medium': {
        'default': 'Targeted treatment and enhanced monitoring'
      },
      'Low': {
        'default': 'Preventive measures and regular monitoring'
      }
    };
    return actionMap[severity]?.[disease] || actionMap[severity]?.default || 'Monitor and assess';
  };

  const getOrganicTreatmentsForDisease = (disease: string, crop: string) => {
    const baseTreatments = [
      {
        name: 'Trichoderma viride',
        purpose: 'Biocontrol agent against fungal pathogens',
        uses: 'Effective against Late Blight, Powdery Mildew, and other fungal diseases. Works by competing with pathogens and producing antifungal compounds.',
        quantity: '2.5 kg per acre',
        interval: '15 days',
        effectiveness: '75-85%',
        cost: '₹250 per kg'
      },
      {
        name: 'Pseudomonas fluorescens',
        purpose: 'Antagonistic bacteria for disease suppression',
        uses: 'Controls bacterial wilt and fungal diseases. Produces antibiotics that inhibit pathogen growth and induces plant resistance.',
        quantity: '5 kg per acre',
        interval: '10-12 days',
        effectiveness: '70-80%',
        cost: '₹300 per kg'
      },
      {
        name: 'Neem Oil Extract',
        purpose: 'Natural fungicide and pest repellent',
        uses: 'Broad-spectrum treatment for fungal diseases and pests. Acts as antifeedant, repellent, and growth disruptor for pathogens.',
        quantity: '2 liters per acre (5% solution)',
        interval: '7-10 days',
        effectiveness: '65-75%',
        cost: '₹150 per liter'
      },
      {
        name: 'Bacillus subtilis',
        purpose: 'Beneficial bacteria for disease control',
        uses: 'Prevents and treats various fungal and bacterial diseases. Forms protective barrier on plant surfaces and produces antimicrobial compounds.',
        quantity: '1 kg per acre',
        interval: '14 days',
        effectiveness: '80-90%',
        cost: '₹300 per kg'
      },
      {
        name: 'Copper Sulphate Solution',
        purpose: 'Traditional organic fungicide',
        uses: 'Controls fungal infections like blights and mildews. Acts as protectant and curative treatment for various plant diseases.',
        quantity: '500g per acre (Bordeaux mixture)',
        interval: '10-14 days',
        effectiveness: '70-85%',
        cost: '₹100 per kg'
      }
    ];

    if (disease.includes('Bacterial')) {
      return [baseTreatments[1]]; // Only Pseudomonas for bacterial
    }
    return baseTreatments; // Both for fungal
  };

  const getChemicalTreatmentsForDisease = (disease: string, crop: string) => {
    if (disease.includes('Bacterial')) {
      return [{
        name: 'Copper Oxychloride 50% WP',
        purpose: 'Broad-spectrum bactericide',
        uses: 'Effective against bacterial wilt, leaf spot, and blight diseases. Works by disrupting bacterial cell membranes and inhibiting enzyme activity. Provides both protective and curative action.',
        quantity: '600g per acre (3g/L water)',
        interval: '7-10 days',
        maxSprays: '2-3 sprays',
        effectiveness: '75-80%',
        cost: '₹220 per kg',
        applicationMethod: 'Foliar spray with thorough coverage',
        preHarvestInterval: '7 days',
        safetyPrecautions: ['Wear protective gloves and mask', 'Avoid inhalation', 'Wash contaminated clothing separately']
      }];
    }
    
    // Default fungal disease treatments
    return [{
      name: 'Mancozeb 75% WP',
      purpose: 'Broad-spectrum protectant fungicide',
      uses: 'Controls late blight, early blight, leaf spots, and rust diseases. Multi-site contact fungicide that prevents fungal spore germination and penetration. Excellent for protective spray programs.',
      quantity: '500g per acre (2g/L water)',
      interval: '10-12 days',
      maxSprays: '3-4 sprays',
      effectiveness: '85-90%',
      cost: '₹200 per kg',
      applicationMethod: 'Foliar spray covering all plant surfaces',
      preHarvestInterval: '15 days',
      safetyPrecautions: ['Wear full protective clothing', 'Avoid skin contact', 'Do not spray during windy conditions']
    },
    {
      name: 'Carbendazim 50% WP',
      purpose: 'Systemic fungicide for fungal diseases',
      uses: 'Effective against powdery mildew, leaf spots, and fruit rot diseases. Systemic action allows it to move within plant tissue providing both protective and curative control.',
      quantity: '200g per acre (1g/L water)',
      interval: '12-15 days',
      maxSprays: '2-3 sprays',
      effectiveness: '80-85%',
      cost: '₹180 per kg',
      applicationMethod: 'Foliar spray with adjuvant for better coverage',
      preHarvestInterval: '21 days',
      safetyPrecautions: ['Wear respirator during mixing', 'Avoid prolonged exposure', 'Store in locked container']
    }];
  };

  const downloadContainmentReportDirectly = () => {
    // Generate report based on selected disease and parameters
    const cropMap: { [key: string]: string } = {
      'Late Blight (Potato)': 'Potato',
      'Yellow Rust (Wheat)': 'Wheat',
      'Bacterial Wilt (Tomato)': 'Tomato'
    };
    
    const currentCrop = cropMap[selectedDisease] || 'Unknown Crop';
    const currentDisease = selectedDisease.split(' (')[0] || 'Unknown Disease';
    
    // Filter field reports based on selected parameters
    const relevantFieldReports = fieldReports.filter(report => 
      report.disease.toLowerCase().includes(currentDisease.toLowerCase()) ||
      report.crop.toLowerCase().includes(currentCrop.toLowerCase())
    );

    // Generate focused problem-specific field officer report
    const specificContent = `
      <div class="header">
        <h1>🧾 ${currentDisease.toUpperCase()} FIELD OFFICER CONTAINMENT REPORT</h1>
        <h2>Complete Action Plan for ${currentCrop} Disease Management</h2>
        <p><strong>Report ID:</strong> AGR-FO-${Date.now()}</p>
        <p><strong>Generated:</strong> ${new Date().toLocaleString('en-IN')}</p>
        <p><strong>Location:</strong> ${selectedRegion}</p>
        <p><strong>Priority Level:</strong> ${selectedSeverity === 'Critical' ? '🔴 URGENT' : selectedSeverity === 'High' ? '🟠 HIGH' : selectedSeverity === 'Medium' ? '🟡 MEDIUM' : '🟢 LOW'}</p>
        <p><strong>Action Timeline:</strong> ${selectedSeverity === 'Critical' ? 'Within 24 hours' : selectedSeverity === 'High' ? 'Within 48 hours' : 'Within 72 hours'}</p>
      </div>

      ${selectedReport ? `
      <div class="section">
        <h2>🎯 TARGETED FIELD REPORT DETAILS</h2>
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
          <h3>📋 PRIMARY FIELD REPORT FOR ACTION</h3>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
            <div>
              <p><strong>🆔 Report ID:</strong> ${selectedReport.id}</p>
              <p><strong>👤 Farmer Name:</strong> ${selectedReport.farmerName}</p>
              <p><strong>📍 Village:</strong> ${selectedReport.village}</p>
              <p><strong>📞 Contact:</strong> ${selectedReport.farmerContact}</p>
              <p><strong>📏 Land Size:</strong> ${selectedReport.landSize}</p>
              <p><strong>🌾 Crop:</strong> ${selectedReport.crop}</p>
            </div>
            <div>
              <p><strong>🦠 Disease:</strong> ${selectedReport.disease}</p>
              <p><strong>⚠️ Severity:</strong> <span style="background-color: ${selectedReport.severity === 'Critical' ? '#fee2e2' : selectedReport.severity === 'High' ? '#fed7aa' : selectedReport.severity === 'Medium' ? '#fef3c7' : '#dcfce7'}; padding: 2px 8px; border-radius: 4px; font-weight: bold;">${selectedReport.severity}</span></p>
              <p><strong>📊 Confidence:</strong> ${selectedReport.confidence}%</p>
              <p><strong>📅 Report Date:</strong> ${selectedReport.reportDate}</p>
              <p><strong>📍 Coordinates:</strong> ${selectedReport.coordinates}</p>
            </div>
          </div>
          
          <div style="margin-bottom: 15px;">
            <h4 style="color: #1e40af; margin-bottom: 8px;">📝 PROBLEM DESCRIPTION</h4>
            <p style="background-color: #f8fafc; padding: 10px; border-radius: 4px; border-left: 3px solid #3b82f6;">
              ${selectedReport.description}
            </p>
          </div>
          
          <div style="margin-bottom: 15px;">
            <h4 style="color: #1e40af; margin-bottom: 8px;">🔬 SYMPTOMS OBSERVED</h4>
            <div style="background-color: #fef3c7; padding: 10px; border-radius: 4px; border-left: 3px solid #f59e0b;">
              <ul style="margin: 0; padding-left: 20px;">
                ${selectedReport.symptoms.map(symptom => `<li>${symptom}</li>`).join('')}
              </ul>
            </div>
          </div>
          
          <div>
            <h4 style="color: #1e40af; margin-bottom: 8px;">💡 RECOMMENDED ACTION</h4>
            <p style="background-color: #dcfce7; padding: 10px; border-radius: 4px; border-left: 3px solid #16a34a; font-weight: bold;">
              ${selectedReport.recommendedAction}
            </p>
          </div>
        </div>
      </div>
      ` : ''}

      ${selectedVillageReport ? `
      <div class="section">
        <h2>🏘️ TARGETED VILLAGE REPORT DETAILS</h2>
        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #16a34a;">
          <h3>📋 PRIMARY VILLAGE REPORT FOR ACTION</h3>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
            <div>
              <p><strong>🆔 Report ID:</strong> ${selectedVillageReport.id}</p>
              <p><strong>🏘️ Village Name:</strong> ${selectedVillageReport.villageName}</p>
              <p><strong>👨‍🌾 Agricultural Officer:</strong> ${selectedVillageReport.agriculturalOfficer}</p>
              <p><strong>📞 Contact:</strong> ${selectedVillageReport.officerContact}</p>
              <p><strong>👥 Population:</strong> ${selectedVillageReport.population}</p>
              <p><strong>🌾 Primary Crop:</strong> ${selectedVillageReport.primaryCrop}</p>
            </div>
            <div>
              <p><strong>🦠 Disease:</strong> ${selectedVillageReport.disease}</p>
              <p><strong>⚠️ Severity:</strong> <span style="background-color: ${selectedVillageReport.severity === 'Critical' ? '#fee2e2' : selectedVillageReport.severity === 'High' ? '#fed7aa' : selectedVillageReport.severity === 'Medium' ? '#fef3c7' : '#dcfce7'}; padding: 2px 8px; border-radius: 4px; font-weight: bold;">${selectedVillageReport.severity}</span></p>
              <p><strong>📊 Confidence:</strong> ${selectedVillageReport.confidence}%</p>
              <p><strong>📅 Report Date:</strong> ${selectedVillageReport.reportDate}</p>
              <p><strong>📍 Coordinates:</strong> ${selectedVillageReport.coordinates}</p>
              <p><strong>📉 Yield Loss:</strong> ${selectedVillageReport.estimatedYieldLoss}</p>
            </div>
          </div>
          
          <div style="margin-bottom: 15px;">
            <h4 style="color: #16a34a; margin-bottom: 8px;">📊 VILLAGE IMPACT ASSESSMENT</h4>
            <p style="background-color: #f8fafc; padding: 10px; border-radius: 4px; border-left: 3px solid #16a34a;">
              <strong>Farm Impact:</strong> ${selectedVillageReport.affectedFarms} out of ${selectedVillageReport.totalFarms} farms affected (${Math.round((selectedVillageReport.affectedFarms/selectedVillageReport.totalFarms) * 100)}% of village farms)
            </p>
          </div>
          
          <div style="margin-bottom: 15px;">
            <h4 style="color: #16a34a; margin-bottom: 8px;">📝 VILLAGE DESCRIPTION</h4>
            <p style="background-color: #f8fafc; padding: 10px; border-radius: 4px; border-left: 3px solid #16a34a;">
              ${selectedVillageReport.description}
            </p>
          </div>
          
          <div>
            <h4 style="color: #16a34a; margin-bottom: 8px;">🔬 VILLAGE SYMPTOMS</h4>
            <div style="background-color: #fef3c7; padding: 10px; border-radius: 4px; border-left: 3px solid #f59e0b;">
              <ul style="margin: 0; padding-left: 20px;">
                ${selectedVillageReport.symptoms.map(symptom => `<li>${symptom}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
      </div>
      ` : ''}

      ${!selectedReport && !selectedVillageReport ? `
      <div class="section">
        <h2>⚠️ NO SPECIFIC PROBLEM SELECTED</h2>
        <div style="background-color: #fef3c7; padding: 15px; border-radius: 5px; border-left: 4px solid #f59e0b;">
          <p><strong>Warning:</strong> No specific field or village report has been selected for this containment action.</p>
          <p>Please select a specific field or village report from the control room to generate a targeted containment plan.</p>
        </div>
      </div>
      ` : ''}

      <div class="section">
        <h2>🌿 TREATMENT PLAN FOR THIS PROBLEM</h2>
        
        <h3>🟢 ORGANIC TREATMENTS (Primary Recommendation)</h3>
        ${getOrganicTreatmentsForDisease(currentDisease, currentCrop).map(treatment => `
          <div style="background-color: #f0fdf4; padding: 15px; border-radius: 5px; border-left: 4px solid #16a34a; margin: 10px 0;">
            <h4>${treatment.name}</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div>
                <p><strong>Purpose:</strong> ${treatment.purpose}</p>
                <p><strong>Uses:</strong> ${treatment.uses}</p>
                <p><strong>Quantity:</strong> ${treatment.quantity}</p>
                <p><strong>Application:</strong> ${treatment.interval}</p>
              </div>
              <div>
                <p><strong>Effectiveness:</strong> ${treatment.effectiveness}</p>
                <p><strong>Cost:</strong> ${treatment.cost}</p>
                <p><strong>🟢 Safety Level:</strong> Safe for immediate use</p>
              </div>
            </div>
          </div>
        `).join('')}

        <h3>🟡 CHEMICAL TREATMENTS (Emergency Use Only)</h3>
        ${getChemicalTreatmentsForDisease(currentDisease, currentCrop).map(treatment => `
          <div style="background-color: #fefce8; padding: 15px; border-radius: 5px; border-left: 4px solid #eab308; margin: 10px 0;">
            <h4>${treatment.name}</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div>
                <p><strong>Purpose:</strong> ${treatment.purpose}</p>
                <p><strong>Uses:</strong> ${treatment.uses}</p>
                <p><strong>Quantity:</strong> ${treatment.quantity}</p>
                <p><strong>Application:</strong> ${treatment.interval}</p>
                <p><strong>Method:</strong> ${treatment.applicationMethod}</p>
              </div>
              <div>
                <p><strong>Maximum Sprays:</strong> ${treatment.maxSprays}</p>
                <p><strong>Effectiveness:</strong> ${treatment.effectiveness}</p>
                <p><strong>Cost:</strong> ${treatment.cost}</p>
                <p><strong>Pre-Harvest Interval:</strong> ${treatment.preHarvestInterval}</p>
                <p><strong>🟡 Safety Level:</strong> Requires supervision</p>
              </div>
            </div>
            ${treatment.safetyPrecautions ? `
              <div style="margin-top: 10px; padding: 8px; background-color: #fef2f2; border-radius: 4px;">
                <strong>Safety Precautions:</strong>
                <ul style="margin: 5px 0; padding-left: 20px;">
                  ${treatment.safetyPrecautions.map(precaution => `<li>${precaution}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
            <p style="color: #dc2626; font-weight: bold; margin-top: 10px;">⚠️ WARNING: Use only under agricultural officer supervision</p>
          </div>
        `).join('')}
      </div>

      <div class="section">
        <h2>🛡️ SAFETY PRECAUTIONS FOR FIELD OFFICERS</h2>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 5px; border-left: 4px solid #6b7280;">
          <h3>🧤 PERSONAL PROTECTION</h3>
          <ul>
            <li>Wear gloves, mask, and protective clothing during field visits</li>
            <li>Use hand sanitizer after visiting each farm</li>
            <li>Disinfect footwear between farm visits</li>
            <li>Avoid handling infected ${currentCrop} plant material directly</li>
          </ul>

          <h3>⚠️ ${currentDisease} SPECIFIC SAFETY</h3>
          <ul>
            <li>Follow all ${currentDisease} specific safety guidelines</li>
            <li>Use appropriate PPE during ${currentDisease} treatment applications</li>
            <li>Ensure proper disposal of infected plant material</li>
            <li>Maintain treatment application records</li>
          </ul>
        </div>
      </div>

      <div class="section">
        <h2>📞 EMERGENCY CONTACTS</h2>
        <div style="background-color: #eff6ff; padding: 15px; border-radius: 5px; border-left: 4px solid #3b82f6;">
          <h3>🏢 OFFICIAL CONTACTS</h3>
          <p><strong>Regional Agriculture Office:</strong> +91-123-4567890</p>
          <p><strong>24x7 Emergency Helpline:</strong> 1800-123-4567</p>
          <p><strong>Plant Pathology Laboratory:</strong> +91-987-6543210</p>
          <p><strong>Pesticide Emergency:</strong> +91-555-6667777</p>
          
          <h3>📋 REPORTING REQUIREMENTS</h3>
          <ul>
            <li>Submit daily progress reports by 6:00 PM</li>
            <li>Immediate reporting of any ${currentDisease} spread</li>
            <li>Weekly comprehensive summary reports</li>
            <li>Final containment report after resolution</li>
          </ul>
        </div>
      </div>

      <div class="footer">
        <p><strong>📊 FIELD OFFICER REPORT SUMMARY:</strong></p>
        <p>• Target Problem: ${currentDisease} in ${currentCrop}</p>
        <p>• Severity: ${selectedSeverity} | Location: ${selectedRegion}</p>
        <p>• ${selectedReport ? `Farmer: ${selectedReport.farmerName}` : selectedVillageReport ? `Village: ${selectedVillageReport.villageName}` : 'Not selected'}</p>
        <p>• Action Timeline: ${selectedSeverity === 'Critical' ? '24 hours' : selectedSeverity === 'High' ? '48 hours' : '72 hours'}</p>
        <p>• Next Review: ${new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString('en-IN')}</p>
        <hr style="margin: 20px 0;">
        <p><em>This is an official field officer containment report for the specific selected problem. All actions must be documented and reported according to protocol.</em></p>
        <p><em>© 2026 AgriPulseX - Agricultural Decision Support System | Ministry of Agriculture & Farmers Welfare</em></p>
      </div>
    `;

    // Generate the problem-specific PDF
    generatePDF(specificContent, `${currentDisease.toLowerCase().replace(/\s+/g, '-')}-containment-report-${Date.now()}.pdf`);
    
    // Show enhanced success message
    setDialogMessage({
      type: 'success',
      title: `📄 ${currentDisease} Report Generated Successfully`,
      message: `Problem-specific containment report for ${currentDisease} has been generated.`,
      details: `📋 Report includes:\n• Targeted field report analysis\n• Organic and chemical treatment options\n• Safety precautions for field officers\n• Action timeline based on severity level\n\n💾 Save the report using "Save as PDF" in the print dialog.`
    });
  };

  const pesticideRecommendations: PesticideRecommendation[] = [
    // Organic Treatments
    {
      name: 'Trichoderma viride',
      type: 'organic',
      purpose: 'Biocontrol agent against fungal pathogens',
      uses: 'Effective against Late Blight, Powdery Mildew, and other fungal diseases. Works by competing with pathogens and producing antifungal compounds.',
      targetDisease: ['Late Blight', 'Early Blight', 'Root Rot'],
      targetCrop: ['Potato', 'Tomato', 'Chilli', 'Brinjal'],
      dosage: '2.5 kg per acre',
      applicationMethod: 'Soil drench + foliar spray',
      preHarvestInterval: '0 days',
      maxApplications: '3-4 applications',
      safetyPrecautions: ['Wear gloves during application', 'Avoid inhalation', 'Store in cool dry place'],
      effectiveness: '75-85%',
      cost: '₹250 per kg',
      availability: 'Available at all agricultural centers'
    },
    {
      name: 'Pseudomonas fluorescens',
      type: 'organic',
      purpose: 'Antagonistic bacteria for disease suppression',
      uses: 'Controls bacterial wilt and fungal diseases. Produces antibiotics that inhibit pathogen growth and induces plant resistance.',
      targetDisease: ['Bacterial Wilt', 'Leaf Spot', 'Blight'],
      targetCrop: ['Tomato', 'Brinjal', 'Cucumber', 'Watermelon'],
      dosage: '5 kg per acre',
      applicationMethod: 'Seed treatment + soil application',
      preHarvestInterval: '0 days',
      maxApplications: '2-3 applications',
      safetyPrecautions: ['Use protective mask', 'Avoid direct contact with eyes', 'Wash hands after use'],
      effectiveness: '70-80%',
      cost: '₹300 per kg',
      availability: 'Available at bio-control centers'
    },
    {
      name: 'Neem Oil Extract',
      type: 'organic',
      purpose: 'Natural fungicide and pest repellent',
      uses: 'Broad-spectrum treatment for fungal diseases and pests. Acts as antifeedant, repellent, and growth disruptor for pathogens.',
      targetDisease: ['Aphids', 'Mites', 'Powdery Mildew', 'Leaf Miner'],
      targetCrop: ['All crops'],
      dosage: '2 liters per acre (5% solution)',
      applicationMethod: 'Foliar spray',
      preHarvestInterval: '3 days',
      maxApplications: 'Weekly applications',
      safetyPrecautions: ['Spray during early morning', 'Avoid high temperature', 'Use protective clothing'],
      effectiveness: '65-75%',
      cost: '₹150 per liter',
      availability: 'Widely available'
    },
    // Chemical Treatments
    {
      name: 'Mancozeb 75% WP',
      type: 'chemical',
      purpose: 'Broad-spectrum protectant fungicide',
      uses: 'Protects crops from fungal infections by preventing spore germination and penetration. Effective against wide range of foliar diseases.',
      targetDisease: ['Late Blight', 'Early Blight', 'Leaf Spot', 'Rust'],
      targetCrop: ['Potato', 'Tomato', 'Grapes', 'Wheat'],
      dosage: '500g per acre (2g/L water)',
      applicationMethod: 'Foliar spray',
      preHarvestInterval: '15 days',
      maxApplications: '3-4 sprays',
      safetyPrecautions: ['Wear full protective gear', 'Avoid inhalation', 'Do not spray during windy conditions'],
      effectiveness: '85-90%',
      cost: '₹200 per kg',
      availability: 'Available at all pesticide shops'
    },
    {
      name: 'Carbendazim 50% WP',
      type: 'chemical',
      purpose: 'Systemic fungicide for fungal diseases',
      uses: 'Systemic action provides both protective and curative control. Absorbed by plant tissues and translocated to new growth.',
      targetDisease: ['Fusarium Wilt', 'Powdery Mildew', 'Leaf Spot'],
      targetCrop: ['Tomato', 'Chilli', 'Cucumber', 'Grapes'],
      dosage: '200g per acre (1g/L water)',
      applicationMethod: 'Foliar spray',
      preHarvestInterval: '20 days',
      maxApplications: '2-3 sprays',
      safetyPrecautions: ['Use respirator mask', 'Avoid skin contact', 'Follow label instructions strictly'],
      effectiveness: '80-85%',
      cost: '₹180 per kg',
      availability: 'Available at licensed dealers'
    },
    {
      name: 'Copper Oxychloride 50% WP',
      type: 'chemical',
      purpose: 'Broad-spectrum bactericide',
      uses: 'Controls bacterial and fungal diseases through copper ion action. Multi-site contact activity prevents resistance development.',
      targetDisease: ['Bacterial Blight', 'Leaf Spot', 'Downy Mildew'],
      targetCrop: ['Tomato', 'Chilli', 'Onion', 'Cabbage'],
      dosage: '600g per acre (3g/L water)',
      applicationMethod: 'Foliar spray',
      preHarvestInterval: '10 days',
      maxApplications: '4-5 sprays',
      safetyPrecautions: ['Wear chemical-resistant gloves', 'Avoid contamination of water sources'],
      effectiveness: '75-80%',
      cost: '₹220 per kg',
      availability: 'Available at agricultural centers'
    }
  ];

  const cropRotationRecommendations: CropRotationRecommendation[] = [
    {
      currentCrop: 'Potato',
      disease: 'Late Blight',
      recommendedCrops: [
        {
          crop: 'Maize',
          reason: 'Breaks disease cycle, improves soil structure',
          benefits: ['Disease break', 'Nitrogen fixation', 'Soil improvement'],
          plantingSeason: 'Kharif (June-July)',
          expectedYield: '15-20 quintals per acre'
        },
        {
          crop: 'Soybean',
          reason: 'Legume crop fixes nitrogen, reduces soil pathogens',
          benefits: ['Nitrogen fixation', 'Disease suppression', 'Economic returns'],
          plantingSeason: 'Kharif (June-July)',
          expectedYield: '8-12 quintals per acre'
        },
        {
          crop: 'Mustard',
          reason: 'Short duration crop, natural fungicide properties',
          benefits: ['Quick returns', 'Natural pest control', 'Oil extraction'],
          plantingSeason: 'Rabi (October-November)',
          expectedYield: '6-8 quintals per acre'
        }
      ],
      cropsToAvoid: ['Tomato', 'Brinjal', 'Chilli', 'Other Solanaceous crops'],
      soilRecovery: [
        {
          method: 'Solarization',
          duration: '6-8 weeks',
          benefits: ['Soil sterilization', 'Pathogen reduction', 'Weed control']
        },
        {
          method: 'Green Manuring',
          duration: '4-6 weeks',
          benefits: ['Organic matter addition', 'Soil structure improvement', 'Nutrient enrichment']
        }
      ],
      residueManagement: 'Deep burial of infected plant material or burning as per local regulations'
    },
    {
      currentCrop: 'Tomato',
      disease: 'Bacterial Wilt',
      recommendedCrops: [
        {
          crop: 'Okra',
          reason: 'Different family crop, resistant to bacterial wilt',
          benefits: ['Disease resistance', 'Good market price', 'Nutritional value'],
          plantingSeason: 'Kharif (June-July)',
          expectedYield: '8-12 quintals per acre'
        },
        {
          crop: 'Bottle Gourd',
          reason: 'Vine crop, reduces soil bacterial load',
          benefits: ['Soil health improvement', 'Quick returns', 'Multiple harvests'],
          plantingSeason: 'Kharif (June-July)',
          expectedYield: '15-20 quintals per acre'
        },
        {
          crop: 'Onion',
          reason: 'Natural antibacterial properties',
          benefits: ['Natural pest control', 'Good storage', 'High value'],
          plantingSeason: 'Rabi (October-November)',
          expectedYield: '12-15 quintals per acre'
        }
      ],
      cropsToAvoid: ['Brinjal', 'Chilli', 'Capsicum', 'Other Solanaceous crops'],
      soilRecovery: [
        {
          method: 'Biofumigation',
          duration: '3-4 weeks',
          benefits: ['Pathogen suppression', 'Soil enrichment', 'Organic matter']
        },
        {
          method: 'Soil Solarization',
          duration: '4-6 weeks',
          benefits: ['Heat treatment', 'Pathogen kill', 'Weed seed destruction']
        }
      ],
      residueManagement: 'Complete removal and burning of affected plant debris'
    },
    {
      currentCrop: 'Wheat',
      disease: 'Yellow Rust',
      recommendedCrops: [
        {
          crop: 'Chickpea',
          reason: 'Legume crop breaks rust cycle',
          benefits: ['Nitrogen fixation', 'Disease break', 'Protein rich'],
          plantingSeason: 'Rabi (October-November)',
          expectedYield: '6-8 quintals per acre'
        },
        {
          crop: 'Mustard',
          reason: 'Different family, natural fungicide properties',
          benefits: ['Natural disease control', 'Oil extraction', 'Quick returns'],
          plantingSeason: 'Rabi (October-November)',
          expectedYield: '6-8 quintals per acre'
        },
        {
          crop: 'Lentil',
          reason: 'Deep rooted crop, improves soil structure',
          benefits: ['Soil aeration', 'Nutrient cycling', 'High protein'],
          plantingSeason: 'Rabi (October-November)',
          expectedYield: '4-6 quintals per acre'
        }
      ],
      cropsToAvoid: ['Barley', 'Oats', 'Other Cereal crops'],
      soilRecovery: [
        {
          method: 'Deep Plowing',
          duration: '2-3 weeks',
          benefits: ['Residue burial', 'Soil aeration', 'Pathogen reduction']
        },
        {
          method: 'Balanced Fertilization',
          duration: 'Continuous',
          benefits: ['Soil health', 'Disease resistance', 'Yield improvement']
        }
      ],
      residueManagement: 'Incorporation of crop residues into soil or removal for animal feed'
    }
  ];

  // PERMANENT DYNAMIC SYSTEM - Core Architecture
  // This effect ensures the system is ALWAYS dynamic and can never be static
  useEffect(() => {
    if (!isDynamicMode) {
      console.error('Static mode detected - forcing dynamic mode');
      setIsDynamicMode(true);
      return;
    }

    const generateDynamicRecommendation = async () => {
      // Dynamic risk calculation based on multiple factors
      const baseRiskScore = severity === 'Critical' ? 0.95 : 
                           severity === 'High' ? 0.75 : 
                           severity === 'Medium' ? 0.45 : 0.25;
      
      // Regional risk modifiers
      const regionRiskMultiplier = selectedRegion.includes('Punjab') ? 1.1 :
                                  selectedRegion.includes('Maharashtra') ? 1.05 :
                                  selectedRegion.includes('Karnataka') ? 0.95 :
                                  selectedRegion.includes('Uttar Pradesh') ? 1.15 : 0.9;
      
      // Disease-specific risk factors
      const diseaseRiskMultiplier = selectedDisease.includes('Late Blight') ? 1.2 :
                                    selectedDisease.includes('Powdery Mildew') ? 0.9 :
                                    selectedDisease.includes('Bacterial Wilt') ? 1.1 :
                                    selectedDisease.includes('Yellow Rust') ? 0.85 :
                                    selectedDisease.includes('Stem Rot') ? 1.15 : 1.0;
      
      // Confidence adjustment
      const confidenceAdjustment = dataConfidence / 100;
      
      // Final calculated risk
      const finalRisk = Math.min(0.99, baseRiskScore * regionRiskMultiplier * diseaseRiskMultiplier * confidenceAdjustment);
      
      // Dynamic authority assignment based on risk level
      const getAuthority = (risk: number) => {
        if (risk >= 0.85) return 'State Agriculture Commissioner';
        if (risk >= 0.70) return 'Regional Agricultural Officer';
        if (risk >= 0.50) return 'District Agricultural Officer';
        return 'Field Agricultural Officer';
      };
      
      // Dynamic timeline based on risk and region
      const getTimeline = (risk: number, region: string) => {
        const baseTime = risk >= 0.85 ? '4 hours' : 
                        risk >= 0.70 ? '12 hours' :
                        risk >= 0.50 ? '48 hours' : '1 week';
        
        const regionModifier = region.includes('Uttar Pradesh') ? ' + 2h transport' :
                              region.includes('Karnataka') ? ' + 1h transport' : '';
        
        return `Within ${baseTime}${regionModifier}`;
      };
      
      // Generate comprehensive dynamic data
      const dynamicData = {
        action: severity === 'Critical' 
          ? 'EMERGENCY CONTAINMENT - Immediate quarantine required'
          : severity === 'High'
          ? 'URGENT CONTAINMENT - 24-hour response protocol'
          : severity === 'Medium'
          ? 'ENHANCED MONITORING - 72-hour surveillance'
          : 'ROUTINE MONITORING - Standard observation protocol',
        risk: finalRisk,
        confidence: dataConfidence,
        explanation: `Dynamic analysis for ${severity.toLowerCase()} severity ${selectedDisease} in ${selectedRegion}. Calculated risk: ${finalRisk.toFixed(3)} (base: ${baseRiskScore}, region: ${regionRiskMultiplier.toFixed(2)}, disease: ${diseaseRiskMultiplier.toFixed(2)}, confidence: ${confidenceAdjustment.toFixed(2)}). ${finalRisk >= 0.85 ? 'CRITICAL: Emergency response mandatory' : finalRisk >= 0.70 ? 'HIGH: Urgent intervention required' : finalRisk >= 0.50 ? 'MODERATE: Enhanced monitoring needed' : 'LOW: Standard procedures sufficient'}.`,
        recommendation: severity === 'Critical' 
          ? 'Immediate emergency containment. Quarantine affected area, deploy rapid response team, activate public alert system.'
          : severity === 'High'
          ? 'Urgent containment recommended. Establish quarantine zone, deploy response team, notify stakeholders.'
          : severity === 'Medium'
          ? 'Enhanced monitoring recommended. Increase surveillance frequency, prepare contingency measures, alert farmers.'
          : 'Routine monitoring sufficient. Continue regular observation and periodic assessment.',
        actionLevel: severity === 'Critical' ? 1 : severity === 'High' ? 2 : severity === 'Medium' ? 3 : 4,
        timeline: getTimeline(finalRisk, selectedRegion),
        measures: severity === 'Critical' 
          ? ['Emergency quarantine', 'Rapid response deployment', 'Public alert system', 'Buffer zone establishment', 'Transport restrictions']
          : severity === 'High'
          ? ['Area quarantine', 'Emergency spraying', 'Public notification', 'Buffer zone establishment', 'Sample collection']
          : severity === 'Medium'
          ? ['Targeted spraying', 'Increased surveillance', 'Farmer alerts', 'Sample collection', 'Progress monitoring']
          : ['Regular monitoring', 'Periodic inspection', 'Documentation', 'Preventive measures', 'Data collection'],
        authority: getAuthority(finalRisk),
        estimatedImpact: severity === 'Critical' 
          ? 'CRITICAL: Massive crop loss potential - Emergency intervention essential within hours'
          : severity === 'High'
          ? 'HIGH: Significant crop loss potential - Immediate action required'
          : severity === 'Medium'
          ? 'MODERATE: Manageable impact with timely intervention'
          : 'LOW: Minimal impact with standard agricultural practices',
        timestamp: new Date().toISOString(),
        region: selectedRegion,
        disease: selectedDisease,
        severity: severity,
        baseRiskScore: baseRiskScore,
        regionRiskMultiplier: regionRiskMultiplier,
        diseaseRiskMultiplier: diseaseRiskMultiplier,
        calculatedRisk: finalRisk,
        isDynamic: true,
        lastParameterChange: new Date().toISOString()
      };

      // Store response in state
      setDecisionResult(dynamicData);
      setShowRecommendation(true);
      
      // Log dynamic calculation for debugging
      console.log('Dynamic Containment Analysis:', {
        parameters: { selectedRegion, selectedDisease, severity, dataConfidence },
        calculation: {
          baseRiskScore,
          regionRiskMultiplier,
          diseaseRiskMultiplier,
          confidenceAdjustment,
          finalRisk
        },
        result: dynamicData
      });
    };

    // Auto-generate recommendation when parameters change
    generateDynamicRecommendation();
  }, [selectedRegion, selectedDisease, severity, dataConfidence, isDynamicMode]);

  // Safeguard: Ensure dynamic mode is always active
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDynamicMode) {
        console.warn('Dynamic mode disabled - re-enabling automatically');
        setIsDynamicMode(true);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isDynamicMode]);

  // Update ARI inputs based on containment parameters
  useEffect(() => {
    // Convert severity to score
    const severityScore = severity === 'Critical' ? 0.95 : 
                         severity === 'High' ? 0.75 : 
                         severity === 'Medium' ? 0.45 : 0.25;
    
    // Simulate independent reports based on region and disease
    const baseReports = selectedRegion.includes('Punjab') ? 3 :
                       selectedRegion.includes('Maharashtra') ? 2 :
                       selectedRegion.includes('Karnataka') ? 4 :
                       selectedRegion.includes('Uttar Pradesh') ? 5 : 2;
    
    // Adjust reports based on disease severity
    const reportMultiplier = selectedDisease.includes('Late Blight') ? 1.5 :
                            selectedDisease.includes('Bacterial Wilt') ? 1.3 :
                            selectedDisease.includes('Yellow Rust') ? 1.2 : 1.0;
    
    const independentReports = Math.round(baseReports * reportMultiplier);
    
    // Calculate clustering strength based on region and reports
    const clusteringStrength = independentReports >= 4 ? 0.8 :
                              independentReports >= 2 ? 0.6 : 0.3;
    
    // Image quality based on confidence
    const imageQuality = (dataConfidence / 100) * 0.9 + 0.1; // Scale to 0.1-1.0

    setAriInputs({
      diseaseSeverityScore: severityScore,
      fieldReportConfidenceScore: dataConfidence / 100,
      independentReportsCount: independentReports,
      imageQualityScore: imageQuality,
      villageClusteringStrength: clusteringStrength
    });
  }, [selectedRegion, selectedDisease, severity, dataConfidence]);

  const downloadPDF = () => {
    if (!decisionResult) return;
    
    const riskClass = decisionResult.risk >= 0.7 ? 'risk-high' : 
                     decisionResult.risk >= 0.4 ? 'risk-medium' : 'risk-low';
    
    const content = `
      <div class="header">
        <h1>🌾 AGRICULTURAL DISEASE CONTAINMENT DECISION REPORT</h1>
        <h2>AgriPulseX Decision System</h2>
        <p><strong>Generated:</strong> ${new Date().toLocaleString('en-IN')}</p>
        <p><strong>Report ID:</strong> AGR-DEC-${Date.now()}</p>
      </div>

      <div class="section">
        <div class="section-title">📍 REGIONAL INFORMATION</div>
        <div class="field">
          <span class="label">Region:</span> 
          <span class="value">${decisionResult.region || selectedRegion}</span>
        </div>
        <div class="field">
          <span class="label">Disease:</span> 
          <span class="value">${decisionResult.disease || selectedDisease}</span>
        </div>
        <div class="field">
          <span class="label">Severity Level:</span> 
          <span class="value">${decisionResult.severity || severity}</span>
        </div>
        <div class="field">
          <span class="label">Data Confidence:</span> 
          <span class="value">${decisionResult.confidence || dataConfidence}%</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">🤖 AI RECOMMENDATION</div>
        <div class="field">
          <span class="label">Recommended Action:</span> 
          <span class="value">${decisionResult.action}</span>
        </div>
        <div class="field">
          <span class="label">Risk Assessment Score:</span> 
          <span class="value ${riskClass}">${decisionResult.risk} (${(decisionResult.risk * 100).toFixed(1)}%)</span>
        </div>
        <div class="field">
          <span class="label">Confidence Level:</span> 
          <span class="value">${decisionResult.confidence}%</span>
        </div>
        <div class="field">
          <span class="label">Decision Status:</span> 
          <span class="value">${decisionResult.isDynamic ? 'Dynamic Analysis' : 'Static Analysis'}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">📋 DETAILED EXPLANATION</div>
        <div class="field">
          <span class="label">Analysis:</span>
        </div>
        <div class="value" style="margin-left: 20px; white-space: pre-wrap;">
          ${decisionResult.explanation}
        </div>
      </div>

      <div class="section">
        <div class="section-title">🎯 ACTION READINESS INDICATOR</div>
        ${ariResult ? `
          <div class="field">
            <span class="label">Readiness Level:</span> 
            <span class="value ${ariResult.level === 'HIGH' ? 'risk-high' : ariResult.level === 'MEDIUM' ? 'risk-medium' : 'risk-low'}">${ariResult.level}</span>
          </div>
          <div class="field">
            <span class="label">Overall Score:</span> 
            <span class="value">${ariResult.score.toFixed(1)}%</span>
          </div>
          <div class="field">
            <span class="label">Key Factors:</span>
          </div>
          <div class="value" style="margin-left: 20px;">
            • Disease Severity: ${(ariResult.factors.diseaseSeverity.value * 100).toFixed(1)}% (Weight: ${ariResult.factors.diseaseSeverity.weight * 100}%)<br>
            • Report Confidence: ${(ariResult.factors.reportConfidence.value * 100).toFixed(1)}% (Weight: ${ariResult.factors.reportConfidence.weight * 100}%)<br>
            • Report Count: ${ariResult.factors.reportCount.value} reports (Weight: ${ariResult.factors.reportCount.weight * 100}%)<br>
            • Image Quality: ${(ariResult.factors.imageQuality.value * 100).toFixed(1)}% (Weight: ${ariResult.factors.imageQuality.weight * 100}%)<br>
            • Village Clustering: ${(ariResult.factors.clustering.value * 100).toFixed(1)}% (Weight: ${ariResult.factors.clustering.weight * 100}%)
          </div>
          <div class="field">
            <span class="label">Recommendation:</span>
          </div>
          <div class="value" style="margin-left: 20px; font-style: italic;">
            ${ariResult.recommendation}
          </div>
        ` : '<div class="value">Action Readiness assessment not available</div>'}
      </div>

      <div class="section">
        <div class="section-title">👤 OFFICER NOTES</div>
        <div class="value" style="min-height: 60px; border: 1px dashed #ccc; padding: 10px; background-color: #f9f9f9;">
          ${officerNotes || '[No notes provided]'}
        </div>
      </div>

      <div class="section">
        <div class="section-title">📊 DECISION HISTORY</div>
        ${decisionHistory.length > 0 ? `
          <div class="value">
            ${decisionHistory.map((item, index) => `
              <div style="margin-bottom: 10px; padding: 8px; background-color: #f5f5f5; border-radius: 3px;">
                <strong>${index + 1}.</strong> ${item.action} - ${item.timestamp}<br>
                <small>${item.details}</small>
              </div>
            `).join('')}
          </div>
        ` : '<div class="value">No previous decisions recorded</div>'}
      </div>

      <div class="footer">
        <p><strong>🏢 AgriPulseX Agricultural Decision System</strong></p>
        <p>Ministry of Agriculture & Farmers Welfare | Government of India</p>
        <p>Report generated on ${new Date().toLocaleString('en-IN')} | Page 1 of 1</p>
        <p><em>This is an AI-assisted decision report. Final authority rests with designated agricultural officers.</em></p>
      </div>
    `;
    
    generatePDF(content, `decision-report-${Date.now()}.pdf`);
  };

  const handleGenerateRecommendation = async () => {
    // In dynamic mode, this function only records the current state
    if (!decisionResult || !decisionResult.isDynamic) {
      setDialogMessage({
        type: 'warning',
        title: 'Dynamic System Active',
        message: 'The containment system is permanently dynamic. Results are always live.',
        details: 'Current recommendations are already updating automatically as you change parameters.'
      });
      return;
    }
    
    // Add current dynamic recommendation to history
    setDecisionHistory(prev => {
      const newHistory = [{
        ...decisionResult,
        timestamp: new Date().toLocaleString('en-IN'),
        region: selectedRegion,
        disease: selectedDisease,
        severity: severity,
        recordedAt: new Date().toISOString(),
        dynamicSnapshot: true
      }, ...prev];
      return newHistory.slice(0, 5); // Keep last 5 recordings
    });
    
    // Show success message with dynamic calculation details
    setDialogMessage({
      type: 'success',
      title: 'Dynamic Recommendation Recorded',
      message: 'Current live containment recommendation has been recorded in decision history.',
      details: `DYNAMIC ANALYSIS RECORD:\n\nParameters: ${selectedRegion} - ${selectedDisease} (${severity} severity)\nCalculated Risk: ${decisionResult.calculatedRisk.toFixed(3)}\nRisk Factors: Base=${decisionResult.baseRiskScore}, Region=${decisionResult.regionRiskMultiplier.toFixed(2)}, Disease=${decisionResult.diseaseRiskMultiplier.toFixed(2)}, Confidence=${dataConfidence}%\nAuthority: ${decisionResult.authority}\nTimeline: ${decisionResult.timeline}\n\nTimestamp: ${new Date().toLocaleString('en-IN')}\n\nNote: This is a snapshot of the dynamic analysis. Live recommendations continue updating automatically.` 
    });
  };

  const handleApproveAndImplement = () => {
    if (!decisionResult) return;
    
    // Check ARI result before allowing approval
    if (ariResult?.level === 'LOW') {
      setDialogMessage({
        type: 'warning',
        title: 'Action Not Recommended',
        message: 'The Action Readiness Indicator indicates insufficient data for containment action.',
        details: `ARI Assessment: ${ariResult.level} Readiness (Score: ${ariResult.score}/100)\n\n${ariResult.explanation}\n\n${ariResult.governanceNotes}\n\nRecommendation: ${ariResult.recommendation}\n\nFor governance and accountability reasons, immediate action is not recommended. Please gather additional data or request field verification.` 
      });
      return;
    }
    
    // Get actual dependent farmers count based on selected region
    const dependentFarmers = selectedRegion.includes('Punjab') ? 12450 : 
                            selectedRegion.includes('Maharashtra') ? 15680 :
                            selectedRegion.includes('Karnataka') ? 18920 :
                            selectedRegion.includes('Uttar Pradesh') ? 22340 : 8340;
    
    // Generate dynamic values based on backend response
    const radius = decisionResult.risk >= 0.7 ? 5 : decisionResult.risk >= 0.4 ? 3 : 1;
    const compensationPerFarmer = decisionResult.risk >= 0.7 ? 25000 : decisionResult.risk >= 0.4 ? 18000 : 12000;
    const totalCompensation = (dependentFarmers * compensationPerFarmer) / 10000000; // Convert to crores
    const affectedFarmers = Math.round(dependentFarmers * decisionResult.risk);
    
    setDialogMessage({
      type: 'success',
      title: 'Containment Order Approved & Implemented',
      message: `Targeted containment zone has been successfully established for ${selectedRegion}.`,
      details: `• ${radius}km containment radius activated around outbreak epicenter\n• 14-day containment period with mandatory review\n• All transport permits suspended for affected area\n• Compensation package: ₹${totalCompensation.toFixed(2)} crore approved for ${affectedFarmers.toLocaleString()} farmers\n• Field teams deployed for monitoring and enforcement\n\nACTION READINESS ASSESSMENT:\n• ARI Level: ${ariResult?.level} Readiness (Score: ${ariResult?.score}/100)\n• Governance Status: ${ariResult?.governanceNotes}\n• Evidence Base: ${ariResult?.explanation}\n\nOrder ID: CNT-${Date.now()}\nApproved by: Dr. Rajesh Kumar Sharma (DAO-PB-2018-4523)\nTimestamp: ${new Date().toLocaleString('en-IN')}\n\nDecision verified by Action Readiness Indicator - Evidence-based governance complain confirmed.` 
    });
  };

  const handleRecommendForReview = () => {
    if (!decisionResult) return;
    
    // Dynamic review time based on risk
    const reviewHours = decisionResult.risk >= 0.7 ? '12-24' : '24-48';
    
    setDialogMessage({
      type: 'warning',
      title: 'Recommendation Escalated for Senior Review',
      message: `Containment recommendation has been forwarded to State Agriculture Commissioner for review.`,
      details: `• Review Level: State Agriculture Commissioner\n• Expected Response: ${reviewHours} hours\n• Review Criteria: Economic impact, regional supply stability, political considerations\n• Additional Data Requested: Crop insurance coverage, alternative market routes\n• Your Notes: "${officerNotes || 'No additional notes provided'}"\n\nReference: REV-${Date.now()}\nEscalated by: Dr. Rajesh Kumar Sharma (DAO-PB-2018-4523)\nTimestamp: ${new Date().toLocaleString('en-IN')}` 
    });
  };

  const handleRequestFieldVerification = () => {
    if (!decisionResult) return;
    
    // Get actual dependent farmers count based on selected region
    const dependentFarmers = selectedRegion.includes('Punjab') ? 12450 : 
                            selectedRegion.includes('Maharashtra') ? 15680 :
                            selectedRegion.includes('Karnataka') ? 18920 :
                            selectedRegion.includes('Uttar Pradesh') ? 22340 : 8340;
    
    // Dynamic team size and arrival time based on risk and farmer count
    const riskMultiplier = decisionResult.risk >= 0.7 ? 1.5 : decisionResult.risk >= 0.4 ? 1.2 : 1;
    const baseTeamSize = dependentFarmers > 15000 ? 6 : 4;
    const teamSize = Math.round(baseTeamSize * riskMultiplier);
    const pathologists = decisionResult.risk >= 0.7 ? 3 : 2;
    const arrivalHours = decisionResult.risk >= 0.7 ? '2-4' : '4-6';
    
    setDialogMessage({
      type: 'info',
      title: 'Field Verification Team Dispatched',
      message: `Agricultural extension team has been deployed to ${selectedRegion} for on-ground verification.`,
      details: `• Team Size: ${teamSize} agricultural officers + ${pathologists} plant pathologists\n• Departure: Within 2 hours from district headquarters\n• Estimated Arrival: ${arrivalHours} hours (depending on road conditions)\n• Verification Scope: Disease severity assessment, crop damage evaluation, containment feasibility\n• Expected Report: 48 hours after field visit\n• Team Lead: Dr. Priya Singh (Plant Pathology Specialist)\n\nRequest ID: FV-${Date.now()}\nRequested by: Dr. Rajesh Kumar Sharma (DAO-PB-2018-4523)\nTimestamp: ${new Date().toLocaleString('en-IN')}` 
    });
  };

  // Generate Comprehensive Containment Report (Direct Download)
  const generateContainmentReport = () => {

  // Generate PDF for Containment Report
  const generateContainmentReportPDF = (data: ContainmentReportData) => {
    const organicTreatments = getOrganicTreatmentsForDisease(data.diseaseName, data.cropName);
    const chemicalTreatments = getChemicalTreatmentsForDisease(data.diseaseName, data.cropName);

    const content = `
      <div class="header">
        <h1>🧾 GOVERNMENT-READY CONTAINMENT ADVISORY REPORT</h1>
        <h2>AgriPulseX Decision Intelligence System</h2>
        <p><strong>Generated:</strong> ${new Date().toLocaleString('en-IN')}</p>
        <p><strong>Report ID:</strong> AGR-CONT-${Date.now()}</p>
        <p><strong>Location:</strong> ${data.location}</p>
      </div>

      <div class="section">
        <h2>🧾 SECTION 1: OUTBREAK SUMMARY</h2>
        <ul>
          <li><strong>Crop affected:</strong> ${data.cropName}</li>
          <li><strong>Disease identified:</strong> ${data.diseaseName}</li>
          <li><strong>Type:</strong> ${data.diseaseType}</li>
          <li><strong>Severity level:</strong> ${data.severity}</li>
          <li><strong>Mode of spread:</strong> ${data.modeOfSpread}</li>
          <li><strong>Total villages in region:</strong> ${data.totalVillages || 0}</li>
          <li><strong>Villages under containment:</strong> ${data.selectedVillageCount || data.villages.length} (${data.villages.join(', ')})</li>
          <li><strong>Total farms affected:</strong> ${data.affectedFarms}</li>
          <li><strong>Selected farmers:</strong> ${data.selectedFarmerDetails?.length || 0}</li>
        </ul>
        ${data.selectedFarmerDetails && data.selectedFarmerDetails.length > 0 ? `
          <h4>👥 Selected Farmers Details:</h4>
          <ul>
            ${data.selectedFarmerDetails.map(farmer => `<li>• ${farmer}</li>`).join('')}
          </ul>
        ` : ''}
        ${data.fieldReports && data.fieldReports.length > 0 ? `
          <h4>📋 Field Reports from Farmers:</h4>
          ${data.fieldReports.map(report => `
            <div style="border-left: 4px solid #3b82f6; padding-left: 16px; margin: 8px 0;">
              <div><strong>${report.farmerName} - ${report.village}</strong> (${report.reportDate})</div>
              <div>${report.description}</div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px; color: #666;">
                <div><strong>Crop:</strong> ${report.crop} (${report.landSize})</div>
                <div><strong>Contact:</strong> ${report.farmerContact}</div>
                <div><strong>Confidence:</strong> ${report.confidence}%</div>
                <div><strong>Severity:</strong> ${report.severity}</div>
              </div>
              <div style="font-size: 12px; color: #666;"><strong>Symptoms:</strong> ${report.symptoms.join(', ')}</div>
              <div style="font-size: 12px; color: #3b82f6;"><strong>Recommended Action:</strong> ${report.recommendedAction}</div>
            </div>
          `).join('')}
        ` : ''}
      </div>

      <div class="section">
        <h2>🚫 SECTION 2: CONTAINMENT DIRECTIVE</h2>
        <ul>
          <li><strong>Recommended containment radius:</strong> ${data.containmentRadius} km</li>
          <li><strong>Buffer and monitoring zones:</strong> ${data.containmentRadius + 2} km buffer zone established</li>
          <li><strong>Movement restrictions:</strong> Strict control on agricultural produce and equipment movement</li>
          <li><strong>Market and mandi operation status:</strong> ${data.severity === 'Critical' ? 'Complete shutdown' : data.severity === 'High' ? 'Partial operation with screening' : 'Normal operation with monitoring'}</li>
          <li><strong>Supply-chain routes restricted:</strong> ${data.villages.length} main routes restricted</li>
          <li><strong>Routes allowed for continuity:</strong> 2 emergency routes for essential supplies</li>
        </ul>
      </div>

      <div class="section">
        <h2>📊 SECTION 3: RISK & IMPACT ASSESSMENT</h2>
        <ul>
          <li><strong>Probability of spread:</strong> ${data.confidence}% based on field reports</li>
          <li><strong>Estimated farms affected:</strong> ${data.affectedFarms} farms</li>
          <li><strong>Farmer income at risk:</strong> ₹${(data.affectedFarms * 25000).toLocaleString('en-IN')}</li>
          <li><strong>Income protected through targeted containment:</strong> ₹${(data.affectedFarms * 20000).toLocaleString('en-IN')}</li>
          <li><strong>Comparison:</strong> No-action vs AI-guided containment saves 80% of potential losses</li>
        </ul>
      </div>

      <div class="section">
        <h2>🌿 SECTION 4: INTEGRATED TREATMENT ADVISORY</h2>
        
        <h3>🟢 BIO / ORGANIC CONTROL (Primary Recommendation)</h3>
        ${organicTreatments.map(treatment => `
          <ul>
            <li><strong>${treatment.name}</strong></li>
            <li>Purpose: ${treatment.purpose}</li>
            <li>Quantity: ${treatment.quantity}</li>
            <li>Application interval: ${treatment.interval}</li>
            <li>Expected effectiveness: ${treatment.effectiveness}</li>
          </ul>
        `).join('')}

        <h3>🟡 CHEMICAL CONTROL (Only if severity increases)</h3>
        <p><strong>⚠ Must clearly state:</strong> "Chemical application only under supervision of agriculture officers."</p>
        ${chemicalTreatments.map(treatment => `
          <ul>
            <li><strong>${treatment.name}</strong></li>
            <li>Purpose: ${treatment.purpose}</li>
            <li>Uses: ${treatment.uses}</li>
            <li>Suggested dilution quantity: ${treatment.quantity}</li>
            <li>Application method: ${treatment.applicationMethod}</li>
            <li>Maximum number of sprays: ${treatment.maxSprays}</li>
            <li>Pre-harvest interval: ${treatment.preHarvestInterval}</li>
            <li>Expected effectiveness: ${treatment.effectiveness}</li>
            <li>Estimated cost: ${treatment.cost}</li>
            <li>Chemical rotation strategy to avoid resistance</li>
            ${treatment.safetyPrecautions ? `<li>Safety precautions: ${treatment.safetyPrecautions.join(', ')}</li>` : ''}
          </ul>
        `).join('')}
      </div>

      <div class="section">
        <h2>🌾 SECTION 5: CROP ROTATION & FIELD RECOVERY PLAN</h2>
        <ul>
          <li><strong>Crop rotation required:</strong> Yes, for ${data.severity === 'Critical' ? '3 years' : data.severity === 'High' ? '2 years' : '1 year'}</li>
          <li><strong>Recommended alternative crops:</strong> Pulses, oilseeds, or millets</li>
          <li><strong>Crops to avoid next season:</strong> Same family crops (${data.cropName} varieties)</li>
          <li><strong>Soil recovery measures:</strong> Green manuring, biofertilizers, organic amendments</li>
          <li><strong>Residue destruction guidance:</strong> Deep burial or burning as per local regulations</li>
          <li><strong>Organic soil improvement practices:</strong> Vermicompost, farmyard manure, biochar</li>
        </ul>
      </div>

      <div class="section">
        <h2>🧤 SECTION 6: FARMER SAFETY PRECAUTIONS</h2>
        <ul>
          <li><strong>Protective clothing guidance:</strong> Gloves, mask, goggles, and full-sleeve clothing</li>
          <li><strong>Safe spraying time:</strong> Early morning (6-8 AM) or late evening (5-7 PM)</li>
          <li><strong>Weather precautions:</strong> Avoid spraying during high winds or rain</li>
          <li><strong>Re-entry waiting period:</strong> 24-48 hours after chemical application</li>
          <li><strong>Pre-harvest interval concept:</strong> Wait specified days before harvest</li>
          <li><strong>Safe pesticide storage and disposal:</strong> Lockable storage, proper container disposal</li>
        </ul>
      </div>

      <div class="section">
        <h2>🗓️ SECTION 7: FOLLOW-UP & MONITORING</h2>
        <ul>
          <li><strong>Monitoring frequency:</strong> ${data.severity === 'Critical' ? 'Daily' : data.severity === 'High' ? 'Every 3 days' : 'Weekly'}</li>
          <li><strong>Re-inspection timeline:</strong> ${data.severity === 'Critical' ? '48 hours' : data.severity === 'High' ? '1 week' : '2 weeks'}</li>
          <li><strong>Image re-upload schedule:</strong> Every ${data.severity === 'Critical' ? '2 days' : data.severity === 'High' ? '5 days' : '10 days'}</li>
          <li><strong>Early warning symptoms checklist:</strong> Leaf spots, yellowing, wilting, stunted growth</li>
        </ul>
      </div>

      <div class="section">
        <h2>⚖️ SECTION 8: OFFICIAL ADVISORY NOTE</h2>
        <p><strong>Recommendations based on:</strong></p>
        <ul>
          <li>• ICAR guidelines</li>
          <li>• State Agriculture Department advisories</li>
          <li>• FAO safe farming practices</li>
        </ul>
        <p><strong>Disclaimer:</strong> This advisory is generated for decision support only. Final implementation must follow instructions issued by local agriculture authorities.</p>
      </div>
    `;

    generatePDF(content, `containment-report-${data.location.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.pdf`);
  };

  // Create report data and show the report
  const cropMap: { [key: string]: string } = {
    'Late Blight (Potato)': 'Potato',
    'Yellow Rust (Wheat)': 'Wheat',
    'Bacterial Wilt (Tomato)': 'Tomato',
    'Powdery Mildew (Grape)': 'Grape',
    'Stem Rot (Paddy)': 'Paddy'
  };
  
  const currentCrop = cropMap[selectedDisease] || 'Unknown Crop';
  
  const reportData: ContainmentReportData = {
    location: selectedRegion || 'Unknown Region',
    cropName: currentCrop,
    diseaseName: selectedDisease || 'Unknown Disease',
    diseaseType: 'Fungal', // Default type
    severity: severity,
    modeOfSpread: 'Airborne spores and contaminated equipment',
    villages: selectedVillages,
    containmentRadius: 5,
    affectedFarms: severity === 'Critical' ? 50 : severity === 'High' ? 30 : 15,
    season: 'Current Season',
    confidence: 85,
    selectedFarmerDetails: selectedReport ? [selectedReport.farmerName] : [],
    totalVillages: 10,
    selectedVillageCount: selectedVillages.length,
    fieldReports: selectedReport ? [selectedReport] : [],
    pesticideRecommendations: pesticideRecommendations,
    cropRotationRecommendation: {
      currentCrop: currentCrop,
      disease: selectedDisease || 'Unknown Disease',
      recommendedCrops: [
        {
          crop: 'Pulses',
          reason: 'Nitrogen fixation and disease break',
          plantingSeason: 'Kharif',
          expectedYield: 'Good',
          benefits: ['Soil improvement', 'Disease resistance']
        }
      ],
      cropsToAvoid: [currentCrop],
      soilRecovery: [{ method: 'Green manuring', duration: '3 months', benefits: ['Soil health', 'Nutrient retention'] }],
      residueManagement: 'Deep burial or burning as per local regulations'
    }
  };

  // Generate and download the PDF directly
  generateContainmentReportPDF(reportData);
  
  // Show success message
  setDialogMessage({
    type: 'success',
    title: '📄 Containment Report Generated & Downloaded',
    message: `Full containment report for ${selectedDisease} has been generated and download initiated.`,
    details: `📋 Report includes:\n• Complete outbreak analysis\n• Organic and chemical treatment options\n• Safety precautions for field officers\n• Crop rotation recommendations\n\n💾 The PDF download should start automatically. Use "Save as PDF" in the print dialog to save the file.`
  });
};

  const regions = [
    'Punjab - Amritsar',
    'Maharashtra - Nashik',
    'Karnataka - Bangalore Rural',
    'Uttar Pradesh - Meerut',
    'Gujarat - Anand'
  ];

  const diseases = [
    'Late Blight (Potato)',
    'Powdery Mildew (Grape)',
    'Bacterial Wilt (Tomato)',
    'Yellow Rust (Wheat)',
    'Stem Rot (Paddy)'
  ];

  // Demo disease images for visual reference
  const diseaseImages = {
    'Late Blight (Potato)': [
      {
        url: '/api/placeholder/400/300',
        title: 'Late Blight on Potato Leaves',
        description: 'Dark water-soaked lesions on leaves',
        severity: 'High'
      },
      {
        url: '/api/placeholder/400/300',
        title: 'Late Blight Stem Infection',
        description: 'Brown to black lesions on stems',
        severity: 'Critical'
      }
    ],
    'Powdery Mildew (Grape)': [
      {
        url: '/api/placeholder/400/300',
        title: 'Powdery Mildew on Grape Leaves',
        description: 'White powdery growth on leaf surface',
        severity: 'Medium'
      },
      {
        url: '/api/placeholder/400/300',
        title: 'Powdery Mildew on Grapes',
        description: 'White fungal growth on fruit',
        severity: 'High'
      }
    ],
    'Bacterial Wilt (Tomato)': [
      {
        url: '/api/placeholder/400/300',
        title: 'Bacterial Wilt Symptoms',
        description: 'Sudden wilting of upper leaves',
        severity: 'Critical'
      },
      {
        url: '/api/placeholder/400/300',
        title: 'Stem Discoloration',
        description: 'Brown discoloration inside stem',
        severity: 'High'
      }
    ],
    'Yellow Rust (Wheat)': [
      {
        url: '/api/placeholder/400/300',
        title: 'Yellow Rust Pustules',
        description: 'Orange-yellow pustules on leaves',
        severity: 'Medium'
      },
      {
        url: '/api/placeholder/400/300',
        title: 'Severe Rust Infection',
        description: 'Extensive rust coverage on wheat field',
        severity: 'High'
      }
    ],
    'Stem Rot (Paddy)': [
      {
        url: '/api/placeholder/400/300',
        title: 'Stem Rot in Rice',
        description: 'Lesions at the water line',
        severity: 'High'
      },
      {
        url: '/api/placeholder/400/300',
        title: 'Advanced Stem Rot',
        description: 'Plant death and lodging',
        severity: 'Critical'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl text-gray-900">Containment Decision Control Room</h1>
          </div>
          <p className="text-sm text-gray-600">AI-assisted containment planning with real-time parameter updates - Results update automatically as you change settings</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        <div className="grid grid-cols-4 gap-6">
          {/* Left Panel - Inputs */}
          <div className="col-span-1 space-y-6">
            {/* Input Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#2f9d58]" />
                Decision Parameters
                {(selectedReport || selectedVillageReport) && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    🔄 Auto-updated from {selectedReport ? selectedReport.id : selectedVillageReport?.id}
                  </span>
                )}
              </h2>

              <div className="space-y-4">
                {/* Region Selection */}
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Region Under Assessment</label>
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    aria-label="Region Under Assessment"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2f9d58] focus:ring-opacity-30"
                  >
                    {regions.map((region) => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>

                {/* Disease Selection */}
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Disease Type</label>
                  <select
                    value={selectedDisease}
                    onChange={(e) => setSelectedDisease(e.target.value)}
                    aria-label="Disease Type"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2f9d58] focus:ring-opacity-30"
                  >
                    {diseases.map((disease) => (
                      <option key={disease} value={disease}>{disease}</option>
                    ))}
                  </select>
                </div>

                {/* Severity */}
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Disease Severity</label>
                  <div className="flex gap-2">
                    {['Low', 'Medium', 'High', 'Critical'].map((level) => (
                      <button
                        key={level}
                        onClick={() => setSeverity(level)}
                        className={`flex-1 px-3 py-2 rounded text-sm transition-colors ${
                          severity === level
                            ? 'bg-[#2f9d58] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Data Confidence */}
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">
                    Data Confidence: {dataConfidence}%
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={dataConfidence}
                    onChange={(e) => setDataConfidence(Number(e.target.value))}
                    aria-label="Data Confidence Level"
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Field Data</span>
                    <span>Verified</span>
                  </div>
                </div>

                {/* Field Report Selection */}
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">📋 Select Field Report for Action</label>
                  <select
                    value={selectedReport?.id || ''}
                    onChange={(e) => {
                      const report = fieldReports.find(r => r.id === e.target.value);
                      setSelectedReport(report || null);
                      // Clear village report selection when field report is selected
                      if (report) {
                        setSelectedVillageReport(null);
                      }
                    }}
                    aria-label="Select Field Report for Action"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2f9d58] focus:ring-opacity-30"
                  >
                    <option value="">Choose a specific field report...</option>
                    {fieldReports.map(report => (
                      <option key={report.id} value={report.id}>
                        {report.id} - {report.farmerName} ({report.disease} - {report.severity})
                      </option>
                    ))}
                  </select>
                  <div className="text-xs text-gray-500 mt-1">
                    {selectedReport ? `Selected: ${selectedReport.farmerName} - ${selectedReport.disease}` : 'No report selected - showing general analysis'}
                  </div>
                </div>

                {/* Village Report Selection */}
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">🏘️ Select Village Report for Action</label>
                  <select
                    value={selectedVillageReport?.id || ''}
                    onChange={(e) => {
                      const report = villageReports.find(r => r.id === e.target.value);
                      setSelectedVillageReport(report || null);
                      // Clear field report selection when village report is selected
                      if (report) {
                        setSelectedReport(null);
                      }
                    }}
                    aria-label="Select Village Report for Action"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2f9d58] focus:ring-opacity-30"
                  >
                    <option value="">Choose a specific village report...</option>
                    {villageReports.map(report => (
                      <option key={report.id} value={report.id}>
                        {report.id} - {report.villageName} ({report.disease} - {report.severity})
                      </option>
                    ))}
                  </select>
                  <div className="text-xs text-gray-500 mt-1">
                    {selectedVillageReport ? `Selected: ${selectedVillageReport.villageName} - ${selectedVillageReport.disease}` : 'No village report selected - showing general analysis'}
                  </div>
                </div>

                {/* Agricultural Recommendations Section */}
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">🌿 Agricultural Recommendations</label>
                  
                  {/* Pesticide Recommendations */}
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-gray-900 mb-3">🌱 Pesticide Recommendations</h4>
                    <div className="border border-gray-300 rounded p-3 max-h-48 overflow-y-auto">
                      {(() => {
                        const currentCrop = selectedDisease.split(' (')[1]?.replace(')', '') || 'Unknown';
                        const currentDisease = selectedDisease.split(' ')[0];
                        
                        const filteredPesticides = pesticideRecommendations
                          .filter(pesticide => 
                            pesticide.targetCrop.includes(currentCrop) || 
                            pesticide.targetDisease.some(d => d.toLowerCase().includes(currentDisease.toLowerCase()))
                          );

                        const organicPesticides = filteredPesticides.filter(p => p.type === 'organic');
                        const chemicalPesticides = filteredPesticides.filter(p => p.type === 'chemical');

                        return (
                          <div className="space-y-4">
                            {/* Organic Treatments */}
                            {organicPesticides.length > 0 && (
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                  <h5 className="text-sm font-semibold text-green-700">🟢 ORGANIC TREATMENTS (Recommended)</h5>
                                </div>
                                <div className="space-y-2">
                                  {organicPesticides.map((pesticide, index) => (
                                    <div key={`organic-${index}`} className="border border-green-200 bg-green-50 rounded p-2">
                                      <div className="flex justify-between items-start mb-1">
                                        <span className="text-sm font-medium text-green-800">
                                          {pesticide.name}
                                        </span>
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                          ORGANIC
                                        </span>
                                      </div>
                                      <div className="text-xs text-green-700">
                                        <div><strong>Purpose:</strong> {pesticide.purpose}</div>
                                        <div><strong>Uses:</strong> {pesticide.uses}</div>
                                        <div><strong>Dosage:</strong> {pesticide.dosage}</div>
                                        <div><strong>Method:</strong> {pesticide.applicationMethod}</div>
                                        <div><strong>Effectiveness:</strong> {pesticide.effectiveness}</div>
                                        <div><strong>Cost:</strong> {pesticide.cost}</div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Chemical Treatments */}
                            {chemicalPesticides.length > 0 && (
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                  <h5 className="text-sm font-semibold text-red-700">🟡 CHEMICAL TREATMENTS (Emergency Use Only)</h5>
                                </div>
                                <div className="space-y-2">
                                  {chemicalPesticides.map((pesticide, index) => (
                                    <div key={`chemical-${index}`} className="border border-red-200 bg-red-50 rounded p-2">
                                      <div className="flex justify-between items-start mb-1">
                                        <span className="text-sm font-medium text-red-800">
                                          {pesticide.name}
                                        </span>
                                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                                          CHEMICAL
                                        </span>
                                      </div>
                                      <div className="text-xs text-red-700">
                                        <div><strong>Purpose:</strong> {pesticide.purpose}</div>
                                        <div><strong>Dosage:</strong> {pesticide.dosage}</div>
                                        <div><strong>Method:</strong> {pesticide.applicationMethod}</div>
                                        <div><strong>Effectiveness:</strong> {pesticide.effectiveness}</div>
                                        <div><strong>⚠️ Warning:</strong> Use only under supervision</div>
                                        <div><strong>Cost:</strong> {pesticide.cost}</div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {filteredPesticides.length === 0 && (
                              <div className="text-center text-gray-500 py-4">
                                No specific pesticide recommendations available for this crop/disease combination
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Crop Rotation Recommendations */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-900 mb-2">🔄 Crop Rotation Recommendations</h4>
                    <div className="border border-gray-300 rounded p-2 max-h-40 overflow-y-auto">
                      {(() => {
                        const currentCrop = selectedDisease.split(' (')[1]?.replace(')', '') || 'Unknown';
                        const currentDisease = selectedDisease.split(' ')[0];
                        
                        const rotation = cropRotationRecommendations.find(
                          rec => rec.currentCrop === currentCrop
                        );
                        
                        if (!rotation) return <div className="text-xs text-gray-500">No rotation data available for {currentCrop}</div>;
                        
                        return (
                          <div className="space-y-2">
                            <div className="text-xs font-medium text-gray-900">🌾 Recommended Crops:</div>
                            {rotation.recommendedCrops.map((crop, index) => (
                              <div key={index} className="ml-2 text-xs text-gray-700 border-l border-green-500 pl-2 py-1">
                                <div><strong>{crop.crop}</strong> - {crop.reason}</div>
                                <div className="text-xs text-gray-600">Season: {crop.plantingSeason} | Yield: {crop.expectedYield}</div>
                                <div className="text-xs text-green-600">Benefits: {crop.benefits.join(', ')}</div>
                              </div>
                            ))}
                            
                            <div className="text-xs font-medium text-gray-900 mt-2">⚠️ Crops to Avoid:</div>
                            <div className="ml-2 text-xs text-red-600">
                              {rotation.cropsToAvoid.join(', ')}
                            </div>
                            
                            <div className="text-xs font-medium text-gray-900 mt-2">🌱 Soil Recovery:</div>
                            {rotation.soilRecovery.map((method, index) => (
                              <div key={index} className="ml-2 text-xs text-gray-700 border-l border-blue-500 pl-2 py-1">
                                <div><strong>{method.method}</strong> ({method.duration})</div>
                                <div className="text-xs text-gray-600">Benefits: {method.benefits.join(', ')}</div>
                              </div>
                            ))}
                            
                            <div className="text-xs font-medium text-gray-900 mt-2">🗑️ Residue Management:</div>
                            <div className="ml-2 text-xs text-gray-700">
                              {rotation.residueManagement}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={downloadContainmentReportDirectly}
                  className="w-full bg-[#10b981] text-white py-2.5 rounded hover:bg-[#059669] transition-colors flex items-center justify-center gap-2"
                >
                  📄 Download Full Report
                </button>

              </div>
            </div>

            {/* Field Reports Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm text-gray-900">📋 Incoming Field Reports ({fieldReports.length})</h3>
                <button
                  onClick={applyAutoDetection}
                  className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  🤖 Auto-Detect All
                </button>
              </div>
              
              {/* Auto-Detection Summary */}
              {(autoDetectedRegion || autoDetectedVillages.length > 0) && (
                <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
                  <div className="text-xs font-semibold text-blue-800 mb-2">🔍 Auto-Detection Summary:</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><strong>Region:</strong> {autoDetectedRegion}</div>
                    <div><strong>Villages:</strong> {autoDetectedVillages.length}</div>
                    <div><strong>Farmers:</strong> {autoDetectedFarmers.length}</div>
                    <div><strong>Primary Disease:</strong> {autoDetectedDisease}</div>
                    <div><strong>Severity:</strong> {autoDetectedSeverity}</div>
                    <div><strong>Primary Crop:</strong> {autoDetectedCrop}</div>
                  </div>
                </div>
              )}
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {fieldReports.map((report, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-3 py-2 bg-gray-50 rounded">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-sm text-gray-900">{report.farmerName}</span>
                      <span className="text-xs text-gray-500">{report.reportDate}</span>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">{report.village} • {report.crop} • {report.severity} severity</div>
                    <div className="text-xs text-gray-700 mb-1">{report.description}</div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-blue-600">Confidence: {report.confidence}%</span>
                      <button
                        onClick={() => {
                          // Auto-select the village and farmer from this report
                          if (!selectedVillages.includes(report.village)) {
                            setSelectedVillages([...selectedVillages, report.village]);
                          }
                          const farmerName = `${report.farmerName} - ${report.village}`;
                          if (!selectedFarmers.includes(farmerName)) {
                            setSelectedFarmers([...selectedFarmers, farmerName]);
                          }
                          // Update disease selection to match the report
                          const diseaseMap: { [key: string]: string } = {
                            'Late Blight': 'Late Blight (Potato)',
                            'Bacterial Wilt': 'Bacterial Wilt (Tomato)',
                            'Yellow Rust': 'Yellow Rust (Wheat)'
                          };
                          if (diseaseMap[report.disease]) {
                            setSelectedDisease(diseaseMap[report.disease]);
                          }
                          setSeverity(report.severity);
                          setDataConfidence(report.confidence);
                        }}
                        className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                      >
                        Add to Containment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Supply Chain Connectivity */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm text-gray-900 mb-3">Supply-Chain Connectivity</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Connected Markets:</span>
                  <span className="text-gray-900">
                    {selectedRegion.includes('Punjab') ? '15' : 
                     selectedRegion.includes('Maharashtra') ? '18' :
                     selectedRegion.includes('Karnataka') ? '22' :
                     selectedRegion.includes('Uttar Pradesh') ? '25' : '12'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Daily Throughput:</span>
                  <span className="text-gray-900">
                    {selectedRegion.includes('Punjab') ? '3,200 MT' : 
                     selectedRegion.includes('Maharashtra') ? '4,100 MT' :
                     selectedRegion.includes('Karnataka') ? '5,800 MT' :
                     selectedRegion.includes('Uttar Pradesh') ? '6,900 MT' : '2,400 MT'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dependent Farmers:</span>
                  <span className="text-gray-900">
                    {selectedRegion.includes('Punjab') ? '12,450' : 
                     selectedRegion.includes('Maharashtra') ? '15,680' :
                     selectedRegion.includes('Karnataka') ? '18,920' :
                     selectedRegion.includes('Uttar Pradesh') ? '22,340' : '8,340'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Recommendation */}
          <div className="col-span-2 space-y-6">
            {!decisionResult ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-gray-900 mb-2">Initializing Containment Analysis...</h3>
                <p className="text-sm text-gray-600">
                  Setting up dynamic containment analysis based on current parameters.
                </p>
              </div>
            ) : (
              <div
                style={{
                  marginTop: "24px",
                  padding: "20px",
                  borderRadius: "8px",
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <h3 style={{ color: "#111827", display: "flex", alignItems: "center", gap: "8px" }}>
                    🔄 Live Containment Recommendation
                    <span style={{ fontSize: "12px", color: "#6b7280", backgroundColor: "#e5e7eb", padding: "2px 8px", borderRadius: "12px" }}>
                      AUTO-UPDATING
                    </span>
                  </h3>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>
                    Last Updated: {new Date(decisionResult.timestamp).toLocaleTimeString('en-IN')}
                  </div>
                </div>

                {/* Problem Details from Field Reports */}
                {!selectedVillageReport && (
                <div style={{ marginBottom: "16px" }}>
                  <h4 style={{ color: "#111827", margin: "0 0 12px 0", fontSize: "14px", fontWeight: "bold" }}>
                    📋 Selected Field Report for Action
                  </h4>
                  {selectedReport ? (
                    <div style={{ 
                      padding: "12px", 
                      backgroundColor: "#f8fafc", 
                      border: "1px solid #e2e8f0", 
                      borderRadius: "6px",
                      fontSize: "12px"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <div>
                          <span style={{ fontWeight: "bold", color: "#1e40af" }}>🆔 {selectedReport.id}</span>
                          <span style={{ marginLeft: "8px", fontWeight: "bold" }}>{selectedReport.disease}</span>
                          <span style={{ marginLeft: "4px", color: "#6b7280" }}>({selectedReport.crop})</span>
                        </div>
                        <span style={{ 
                          padding: "2px 6px", 
                          borderRadius: "4px", 
                          fontSize: "10px",
                          backgroundColor: selectedReport.severity === 'Critical' ? '#fee2e2' : 
                                           selectedReport.severity === 'High' ? '#fed7aa' :
                                           selectedReport.severity === 'Medium' ? '#fef3c7' : '#dcfce7',
                          color: selectedReport.severity === 'Critical' ? '#991b1b' : 
                                 selectedReport.severity === 'High' ? '#9a3412' :
                                 selectedReport.severity === 'Medium' ? '#92400e' : '#166534'
                        }}>
                          {selectedReport.severity}
                        </span>
                      </div>
                      <div style={{ marginBottom: "6px" }}>
                        <strong>👤 Farmer:</strong> {selectedReport.farmerName} | 
                        <strong> 📍 Village:</strong> {selectedReport.village} | 
                        <strong> 📊 Confidence:</strong> {selectedReport.confidence}%
                      </div>
                      <div style={{ marginBottom: "6px" }}>
                        <strong>📝 Description:</strong> {selectedReport.description}
                      </div>
                      <div style={{ marginBottom: "6px" }}>
                        <strong>🔬 Symptoms:</strong> {selectedReport.symptoms.join(', ')}
                      </div>
                      <div style={{ marginBottom: "6px" }}>
                        <strong>📅 Report Date:</strong> {selectedReport.reportDate} | 
                        <strong> 📞 Contact:</strong> {selectedReport.farmerContact}
                      </div>
                      <div>
                        <strong>💡 Recommended Action:</strong> {selectedReport.recommendedAction}
                      </div>
                    </div>
                  ) : selectedVillageReport ? null : (
                    <div style={{ 
                      padding: "12px", 
                      backgroundColor: "#fef3c7", 
                      border: "1px solid #fde68a", 
                      borderRadius: "6px",
                      fontSize: "12px",
                      color: "#92400e"
                    }}>
                      ⚠️ No specific field report selected for action
                    </div>
                  )}
                </div>
                )}

                {/* Problem Details from Village Reports */}
                {!selectedReport && (
                <div style={{ marginBottom: "16px" }}>
                  <h4 style={{ color: "#111827", margin: "0 0 12px 0", fontSize: "14px", fontWeight: "bold" }}>
                    🏘️ Selected Village Report for Action
                  </h4>
                  {selectedVillageReport ? (
                    <div style={{ 
                      padding: "12px", 
                      backgroundColor: "#f8fafc", 
                      border: "1px solid #e2e8f0", 
                      borderRadius: "6px",
                      fontSize: "12px"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <div>
                          <span style={{ fontWeight: "bold", color: "#1e40af" }}>🆔 {selectedVillageReport.id}</span>
                          <span style={{ marginLeft: "8px", fontWeight: "bold" }}>{selectedVillageReport.villageName}</span>
                          <span style={{ marginLeft: "4px", color: "#6b7280" }}>({selectedVillageReport.primaryCrop})</span>
                        </div>
                        <span style={{ 
                          padding: "2px 6px", 
                          borderRadius: "4px", 
                          fontSize: "10px",
                          backgroundColor: selectedVillageReport.severity === 'Critical' ? '#fee2e2' : 
                                           selectedVillageReport.severity === 'High' ? '#fed7aa' :
                                           selectedVillageReport.severity === 'Medium' ? '#fef3c7' : '#dcfce7',
                          color: selectedVillageReport.severity === 'Critical' ? '#991b1b' : 
                                 selectedVillageReport.severity === 'High' ? '#9a3412' :
                                 selectedVillageReport.severity === 'Medium' ? '#92400e' : '#166534'
                        }}>
                          {selectedVillageReport.severity}
                        </span>
                      </div>
                      <div style={{ marginBottom: "6px" }}>
                        <strong>👨‍🌾 Agricultural Officer:</strong> {selectedVillageReport.agriculturalOfficer} | 
                        <strong> 📞 Contact:</strong> {selectedVillageReport.officerContact}
                      </div>
                      <div style={{ marginBottom: "6px" }}>
                        <strong>🏘️ Village:</strong> {selectedVillageReport.villageName} | 
                        <strong> 👥 Population:</strong> {selectedVillageReport.population} | 
                        <strong> 📊 Confidence:</strong> {selectedVillageReport.confidence}%
                      </div>
                      <div style={{ marginBottom: "6px" }}>
                        <strong>📊 Farm Impact:</strong> {selectedVillageReport.affectedFarms}/{selectedVillageReport.totalFarms} farms affected | 
                        <strong> 📉 Yield Loss:</strong> {selectedVillageReport.estimatedYieldLoss}
                      </div>
                      <div style={{ marginBottom: "6px" }}>
                        <strong>📝 Description:</strong> {selectedVillageReport.description}
                      </div>
                      <div>
                        <strong>🔬 Symptoms:</strong> {selectedVillageReport.symptoms.join(', ')}
                      </div>
                    </div>
                  ) : selectedReport ? null : (
                    <div style={{ 
                      padding: "12px", 
                      backgroundColor: "#fef3c7", 
                      border: "1px solid #fde68a", 
                      borderRadius: "6px",
                      fontSize: "12px",
                      color: "#92400e"
                    }}>
                      ⚠️ No specific village report selected for action
                    </div>
                  )}
                </div>
                )}

                {/* Disease Image Gallery Section */}
                <div style={{ marginBottom: "16px" }}>
                  <h4 style={{ color: "#111827", margin: "0 0 12px 0", fontSize: "14px", fontWeight: "bold" }}>
                    🖼️ Disease Reference Images - {selectedDisease || 'Select a disease'}
                  </h4>
                  {selectedDisease && diseaseImages[selectedDisease] ? (
                    <div style={{ 
                      padding: "12px", 
                      backgroundColor: "#f8fafc", 
                      border: "1px solid #e2e8f0", 
                      borderRadius: "6px"
                    }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        {diseaseImages[selectedDisease].map((image, index) => (
                          <div key={index} style={{ 
                            border: "1px solid #d1d5db", 
                            borderRadius: "6px", 
                            overflow: "hidden",
                            backgroundColor: "white"
                          }}>
                            <div style={{ position: "relative" }}>
                              <img 
                                src={image.url} 
                                alt={image.title}
                                style={{ 
                                  width: "100%", 
                                  height: "120px", 
                                  objectFit: "cover",
                                  display: "block"
                                }}
                                onError={(e) => {
                                  e.currentTarget.src = '/api/placeholder/300/200';
                                }}
                              />
                              <div style={{ 
                                position: "absolute", 
                                top: "4px", 
                                right: "4px",
                                padding: "2px 6px",
                                borderRadius: "4px",
                                fontSize: "10px",
                                fontWeight: "bold",
                                backgroundColor: image.severity === 'Critical' ? '#dc2626' : 
                                                 image.severity === 'High' ? '#ea580c' :
                                                 image.severity === 'Medium' ? '#ca8a04' : '#16a34a',
                                color: "white"
                              }}>
                                {image.severity}
                              </div>
                            </div>
                            <div style={{ padding: "8px" }}>
                              <div style={{ 
                                fontSize: "11px", 
                                fontWeight: "bold", 
                                color: "#1f2937", 
                                marginBottom: "4px" 
                              }}>
                                {image.title}
                              </div>
                              <div style={{ 
                                fontSize: "10px", 
                                color: "#6b7280",
                                lineHeight: "1.3"
                              }}>
                                {image.description}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div style={{ 
                        marginTop: "8px", 
                        fontSize: "10px", 
                        color: "#6b7280",
                        fontStyle: "italic",
                        textAlign: "center"
                      }}>
                        💡 Reference images help identify disease symptoms and severity levels for accurate containment planning
                      </div>
                    </div>
                  ) : (
                    <div style={{ 
                      padding: "12px", 
                      backgroundColor: "#f3f4f6", 
                      border: "1px solid #d1d5db", 
                      borderRadius: "6px",
                      fontSize: "12px",
                      color: "#6b7280",
                      textAlign: "center"
                    }}>
                      📷 Select a disease type to view reference images and symptom examples
                    </div>
                  )}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                  <div>
                    <p style={{ margin: "0 0 8px 0" }}>
                      <b>Recommended Action:</b> 
                    </p>
                    <div style={{ 
                      padding: "8px 12px", 
                      backgroundColor: decisionResult.severity === 'Critical' ? '#fee2e2' : 
                                       decisionResult.severity === 'High' ? '#fed7aa' :
                                       decisionResult.severity === 'Medium' ? '#fef3c7' : '#dcfce7',
                      border: `1px solid ${decisionResult.severity === 'Critical' ? '#fca5a5' : 
                                      decisionResult.severity === 'High' ? '#fdba74' :
                                      decisionResult.severity === 'Medium' ? '#fde68a' : '#bbf7d0'}`,
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: decisionResult.severity === 'Critical' ? '#991b1b' : 
                             decisionResult.severity === 'High' ? '#9a3412' :
                             decisionResult.severity === 'Medium' ? '#92400e' : '#166534'
                    }}>
                      {decisionResult.action}
                    </div>
                  </div>

                  <div>
                    <p style={{ margin: "0 0 8px 0" }}>
                      <b>Risk Score:</b> 
                    </p>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 12px",
                      backgroundColor: decisionResult.risk >= 0.7 ? '#fee2e2' : 
                                     decisionResult.risk >= 0.4 ? '#fed7aa' : '#dcfce7',
                      border: `1px solid ${decisionResult.risk >= 0.7 ? '#fca5a5' : 
                                      decisionResult.risk >= 0.4 ? '#fdba74' : '#bbf7d0'}`,
                      borderRadius: "6px",
                      fontSize: "16px",
                      fontWeight: 'bold',
                      color: decisionResult.risk >= 0.7 ? '#991b1b' : 
                             decisionResult.risk >= 0.4 ? '#9a3412' : '#166534'
                    }}>
                      <span style={{ fontSize: "20px" }}>
                        {decisionResult.risk >= 0.7 ? '🔴' : decisionResult.risk >= 0.4 ? '🟠' : '🟢'}
                      </span>
                      {decisionResult.risk.toFixed(2)}
                      <span style={{ fontSize: "12px", fontWeight: "normal", color: "#6b7280" }}>
                        ({decisionResult.risk >= 0.7 ? 'Critical' : decisionResult.risk >= 0.4 ? 'Moderate' : 'Low'} Risk)
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                  <div>
                    <p style={{ margin: "0 0 8px 0" }}>
                      <b>Confidence Level:</b> {decisionResult.confidence}%
                    </p>
                    <div style={{ 
                      height: "8px", 
                      backgroundColor: "#e5e7eb", 
                      borderRadius: "4px", 
                      overflow: "hidden",
                      marginBottom: "8px"
                    }}>
                      <div style={{
                        height: "100%",
                        width: `${decisionResult.confidence}%`,
                        backgroundColor: decisionResult.confidence >= 80 ? '#16a34a' : 
                                       decisionResult.confidence >= 60 ? '#eab308' : '#dc2626',
                        transition: "width 0.3s ease"
                      }} />
                    </div>
                  </div>

                  <div>
                    <p style={{ margin: "0 0 8px 0" }}>
                      <b>Response Timeline:</b> {decisionResult.timeline}
                    </p>
                    <div style={{ 
                      padding: "4px 8px", 
                      backgroundColor: decisionResult.severity === 'Critical' ? '#fee2e2' : 
                                       decisionResult.severity === 'High' ? '#fed7aa' :
                                       decisionResult.severity === 'Medium' ? '#fef3c7' : '#dcfce7',
                      border: `1px solid ${decisionResult.severity === 'Critical' ? '#fca5a5' : 
                                      decisionResult.severity === 'High' ? '#fdba74' :
                                      decisionResult.severity === 'Medium' ? '#fde68a' : '#bbf7d0'}`,
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: decisionResult.severity === 'Critical' ? '#991b1b' : 
                             decisionResult.severity === 'High' ? '#9a3412' :
                             decisionResult.severity === 'Medium' ? '#92400e' : '#166534',
                      display: "inline-block"
                    }}>
                      Authority: {decisionResult.authority}
                    </div>
                  </div>
                </div>

                <p style={{ margin: "0 0 16px 0", padding: "12px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "6px" }}>
                  <b>AI Analysis:</b> {decisionResult.explanation}
                </p>

                <div style={{ margin: "0 0 16px 0" }}>
                  <p style={{ margin: "0 0 8px 0", fontWeight: "bold" }}>Recommended Measures:</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {decisionResult.measures.map((measure: string, index: number) => (
                      <span key={index} style={{
                        padding: "4px 8px",
                        backgroundColor: "#e0f2fe",
                        border: "1px solid #7dd3fc",
                        borderRadius: "12px",
                        fontSize: "12px",
                        color: "#0c4a6e"
                      }}>
                        {measure}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Readiness Indicator - Before decision buttons */}
                <div style={{ marginTop: "20px" }}>
                  <ActionReadinessIndicator 
                    inputs={ariInputs}
                    onResultChange={(result) => setAriResult(result)}
                    compact={false}
                  />
                </div>

                {/* Containment Exit Readiness Meter - New Feature */}
                <div style={{ marginTop: "20px" }}>
                  <ContainmentExitReadinessMeter 
                    containmentData={{
                      diseaseType: selectedDisease,
                      severity: severity,
                      region: selectedRegion,
                      risk: decisionResult?.risk || 0,
                      confidence: dataConfidence,
                      authority: decisionResult?.authority || 'District Agricultural Officer',
                      timestamp: decisionResult?.timestamp || new Date().toISOString()
                    }}
                    onExitReadinessUpdate={(data) => {
                      console.log('Exit Readiness Updated:', data);
                    }}
                  />
                </div>

                {/* Action Buttons */}
                <div style={{ marginTop: "20px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <button
                    onClick={handleApproveAndImplement}
                    disabled={ariResult?.level === 'LOW'}
                    style={{
                      padding: "10px 16px",
                      backgroundColor: ariResult?.level === 'LOW' ? "#9ca3af" : "#16a34a",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: ariResult?.level === 'LOW' ? "not-allowed" : "pointer",
                      fontSize: "14px",
                      fontWeight: "500",
                      opacity: ariResult?.level === 'LOW' ? 0.6 : 1
                    }}
                  >
                    {ariResult?.level === 'LOW' ? '❌ Action Not Recommended' : '✅ Approve & Implement'}
                  </button>
                  <button
                    onClick={handleRecommendForReview}
                    style={{
                      padding: "10px 16px",
                      backgroundColor: "#ea580c",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "500"
                    }}
                  >
                    📋 Recommend for Review
                  </button>
                  <button
                    onClick={handleRequestFieldVerification}
                    style={{
                      padding: "10px 16px",
                      backgroundColor: "#2563eb",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "500"
                    }}
                  >
                    🔍 Request Field Verification
                  </button>
                  <button
                    onClick={generateContainmentReport}
                    style={{
                      padding: "10px 16px",
                      backgroundColor: "#7c3aed",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "500"
                    }}
                  >
                    🧾 Generate Containment Report
                  </button>
                </div>
              </div>
            )}

            {/* Decision History */}
            {decisionHistory.length > 0 && (
              <div style={{
                marginTop: "24px",
                padding: "20px",
                borderRadius: "8px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0"
              }}>
                <h3 style={{ marginBottom: "16px", color: "#1e293b" }}>
                  📋 Decision History (Last 3)
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {decisionHistory.map((decision, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "12px",
                        backgroundColor: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "6px",
                        fontSize: "13px"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <span style={{ fontWeight: "bold", color: "#475569" }}>
                          {decision.region} - {decision.disease}
                        </span>
                        <span style={{ color: "#64748b", fontSize: "11px" }}>
                          {decision.timestamp}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: "16px" }}>
                        <span>
                          Action: <b>{decision.action}</b>
                        </span>
                        <span>
                          Risk: 
                          <span style={{
                            color: decision.risk >= 0.7 ? '#dc2626' : 
                                   decision.risk >= 0.4 ? '#ea580c' : '#16a34a',
                            fontWeight: 'bold'
                          }}>
                            {decision.risk >= 0.7 ? '🔴' : decision.risk >= 0.4 ? '🟠' : '🟢'} {decision.risk}
                          </span>
                        </span>
                        <span>
                          Confidence: <b>{decision.confidence}</b>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Governance Panel - Audit Trail */}
          <div className="col-span-1 space-y-6">
            <GovernanceAuditTrail compact={true} />
          </div>
        </div>
      </div>

      {/* Dialog Message */}
      {dialogMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDialogMessage(null)}
          />
          
          {/* Dialog Content */}
          <div className="relative bg-white rounded-xl shadow-2xl border-2 border-[#2f9d58] p-8 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setDialogMessage(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Dialog Header */}
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-2">
                {dialogMessage.type === 'success' && <CheckCircle className="w-6 h-6 text-green-600" />}
                {dialogMessage.type === 'warning' && <AlertTriangle className="w-6 h-6 text-amber-600" />}
                {dialogMessage.type === 'info' && <Info className="w-6 h-6 text-blue-600" />}
                <h3 className="text-lg font-semibold text-gray-900">{dialogMessage.title}</h3>
              </div>
              <p className="text-sm text-gray-600">{dialogMessage.message}</p>
            </div>

            {/* Dialog Details */}
            {dialogMessage.details && (
              <div className="mb-6">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
                    {dialogMessage.details}
                  </pre>
                </div>
              </div>
            )}

            {/* Dialog Actions */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDialogMessage(null)}
                className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2f9d58]/50 transition-all shadow-sm hover:shadow-md"
              >
                Close
              </button>
              <button
                onClick={() => {
                  // Show success message before closing
                  const originalMessage = dialogMessage;
                  setDialogMessage({
                    type: 'success',
                    title: '✅ Done!',
                    message: 'Decision acknowledged successfully!',
                    details: 'Your acknowledgment has been recorded and the decision has been processed.'
                  });
                  
                  // Close dialog after 2 seconds
                  setTimeout(() => {
                    setDialogMessage(null);
                  }, 2000);
                }}
                className={`px-6 py-3 text-sm font-medium text-white border-2 rounded-xl transition-all shadow-sm hover:shadow-md transform hover:scale-105 ${
                  dialogMessage.type === 'success' ? 'bg-green-600 border-green-700 hover:bg-green-700' :
                  dialogMessage.type === 'warning' ? 'bg-amber-600 border-amber-700 hover:bg-amber-700' :
                  'bg-blue-600 border-blue-700 hover:bg-blue-700'
                }`}
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Containment Report Modal */}
      {showReport && reportData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowReport(false)}
          />
          
          {/* Dialog Content */}
          <div className="relative bg-white rounded-xl shadow-2xl border-2 border-[#2f9d58] p-8 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setShowReport(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close report"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Report Header */}
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">🧾 GOVERNMENT-READY CONTAINMENT ADVISORY REPORT</h1>
              <h2 className="text-lg text-gray-700 mb-4">AgriPulseX Decision Intelligence System</h2>
              <div className="flex justify-center gap-6 text-sm text-gray-600">
                <span><strong>Generated:</strong> {new Date().toLocaleString('en-IN')}</span>
                <span><strong>Report ID:</strong> AGR-CONT-{Date.now()}</span>
                <span><strong>Location:</strong> {reportData.location}</span>
              </div>
            </div>

            {/* Report Content */}
            <div className="space-y-6">
              {/* Section 1: Outbreak Summary */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">🧾 SECTION 1: OUTBREAK SUMMARY</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div><strong>Crop affected:</strong> {reportData.cropName}</div>
                  <div><strong>Disease identified:</strong> {reportData.diseaseName}</div>
                  <div><strong>Type:</strong> {reportData.diseaseType}</div>
                  <div><strong>Severity level:</strong> {reportData.severity}</div>
                  <div className="col-span-2"><strong>Mode of spread:</strong> {reportData.modeOfSpread}</div>
                  <div className="col-span-2"><strong>Total villages in region:</strong> {reportData.totalVillages || 0}</div>
                  <div className="col-span-2"><strong>Villages under containment:</strong> {reportData.selectedVillageCount || reportData.villages.length} ({reportData.villages.join(', ')})</div>
                  <div><strong>Total farms affected:</strong> {reportData.affectedFarms}</div>
                  <div><strong>Selected farmers:</strong> {reportData.selectedFarmerDetails?.length || 0}</div>
                </div>
                
                {/* Selected Farmers Details */}
                {reportData.selectedFarmerDetails && reportData.selectedFarmerDetails.length > 0 && (
                  <div className="mt-4 p-4 bg-white rounded border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">👥 Selected Farmers Details:</h4>
                    <div className="space-y-1">
                      {reportData.selectedFarmerDetails.map((farmer, index) => (
                        <div key={index} className="text-sm text-gray-700">• {farmer}</div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Field Reports Section */}
                {reportData.fieldReports && reportData.fieldReports.length > 0 && (
                  <div className="mt-4 p-4 bg-white rounded border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">📋 Field Reports from Farmers:</h4>
                    <div className="space-y-3">
                      {reportData.fieldReports.map((report, index) => (
                        <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium text-gray-900">{report.farmerName} - {report.village}</span>
                            <span className="text-xs text-gray-500">{report.reportDate}</span>
                          </div>
                          
                          {/* Image Section */}
                          {report.imageUrl && (
                            <div className="mb-3">
                              <div className="text-xs font-medium text-gray-700 mb-1">📷 Disease Image:</div>
                              <div className="relative inline-block">
                                <img 
                                  src={report.imageUrl} 
                                  alt={`Disease symptoms on ${report.crop} - ${report.disease}`}
                                  className="max-w-xs h-48 object-cover rounded-lg border border-gray-300 shadow-sm"
                                  onError={(e) => {
                                    e.currentTarget.src = '/api/placeholder/300/200';
                                    e.currentTarget.alt = 'Image not available';
                                  }}
                                />
                                <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                  {report.severity} Severity
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <div className="text-sm text-gray-700 mb-1">{report.description}</div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                            <div><strong>Crop:</strong> {report.crop} ({report.landSize})</div>
                            <div><strong>Contact:</strong> {report.farmerContact}</div>
                            <div><strong>Confidence:</strong> {report.confidence}%</div>
                            <div><strong>Severity:</strong> {report.severity}</div>
                          </div>
                          <div className="text-xs text-gray-600">
                            <strong>Symptoms:</strong> {report.symptoms.join(', ')}
                          </div>
                          <div className="text-xs text-blue-600 mt-1">
                            <strong>Recommended Action:</strong> {report.recommendedAction}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Disease Image Gallery Section */}
                {reportData.fieldReports && reportData.fieldReports.some(report => report.imageUrl) && (
                  <div className="mt-4 p-4 bg-white rounded border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">🖼️ DISEASE IMAGE GALLERY - Visual Evidence</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {reportData.fieldReports
                        .filter(report => report.imageUrl)
                        .map((report, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="relative">
                              <img 
                                src={report.imageUrl} 
                                alt={`${report.disease} on ${report.crop} - ${report.farmerName}`}
                                className="w-full h-40 object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = '/api/placeholder/400/300';
                                  e.currentTarget.alt = 'Image not available';
                                }}
                              />
                              <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded font-medium">
                                {report.severity}
                              </div>
                              <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                {report.confidence}% Confidence
                              </div>
                            </div>
                            <div className="p-3">
                              <div className="font-medium text-sm text-gray-900 mb-1">
                                {report.disease} - {report.crop}
                              </div>
                              <div className="text-xs text-gray-600 mb-1">
                                👤 {report.farmerName} | 📍 {report.village}
                              </div>
                              <div className="text-xs text-gray-500">
                                📅 {report.reportDate}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                    <div className="mt-3 text-xs text-gray-500 text-center">
                      💡 Images help agricultural officers verify disease symptoms and severity levels for accurate containment planning
                    </div>
                  </div>
                )}
              </div>

              {/* Section 2: Containment Directive */}
              <div className="bg-red-50 rounded-lg p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">🚫 SECTION 2: CONTAINMENT DIRECTIVE</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div><strong>Recommended containment radius:</strong> {reportData.containmentRadius} km</div>
                  <div><strong>Buffer and monitoring zones:</strong> {reportData.containmentRadius + 2} km buffer zone established</div>
                  <div className="col-span-2"><strong>Movement restrictions:</strong> Strict control on agricultural produce and equipment movement</div>
                  <div className="col-span-2"><strong>Market and mandi operation status:</strong> {reportData.severity === 'Critical' ? 'Complete shutdown' : reportData.severity === 'High' ? 'Partial operation with screening' : 'Normal operation with monitoring'}</div>
                  <div><strong>Supply-chain routes restricted:</strong> {reportData.villages.length} main routes restricted</div>
                  <div><strong>Routes allowed for continuity:</strong> 2 emergency routes for essential supplies</div>
                </div>
              </div>

              {/* Section 3: Risk & Impact Assessment */}
              <div className="bg-orange-50 rounded-lg p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">📊 SECTION 3: RISK & IMPACT ASSESSMENT</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div><strong>Probability of spread:</strong> {reportData.confidence}% based on field reports</div>
                  <div><strong>Estimated farms affected:</strong> {reportData.affectedFarms} farms</div>
                  <div><strong>Farmer income at risk:</strong> ₹{(reportData.affectedFarms * 25000).toLocaleString('en-IN')}</div>
                  <div><strong>Income protected through targeted containment:</strong> ₹{(reportData.affectedFarms * 20000).toLocaleString('en-IN')}</div>
                  <div className="col-span-2"><strong>Comparison:</strong> No-action vs AI-guided containment saves 80% of potential losses</div>
                </div>
              </div>

              {/* Section 4: Integrated Treatment Advisory */}
              <div className="bg-green-50 rounded-lg p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">🌿 SECTION 4: INTEGRATED TREATMENT ADVISORY</h2>
                
                {/* Dynamic Pesticide Recommendations */}
                {reportData.pesticideRecommendations && reportData.pesticideRecommendations.length > 0 && (
                  <>
                    <h3 className="font-semibold text-green-800 mb-3">🟢 BIO / ORGANIC CONTROL (Primary Recommendation)</h3>
                    <div className="space-y-3 mb-6">
                      {reportData.pesticideRecommendations
                        .filter(pesticide => pesticide.type === 'organic')
                        .map((pesticide, index) => (
                          <div key={index} className="bg-white rounded p-4 border border-green-200">
                            <div className="font-semibold text-green-700">{pesticide.name}</div>
                            <div className="text-sm text-gray-600 mb-1">Purpose: {pesticide.targetDisease.join(', ')} control</div>
                            <div className="text-sm text-gray-600 mb-1">Dosage: {pesticide.dosage}</div>
                            <div className="text-sm text-gray-600 mb-1">Application: {pesticide.applicationMethod}</div>
                            <div className="text-sm text-gray-600 mb-1">Pre-harvest interval: {pesticide.preHarvestInterval}</div>
                            <div className="text-sm text-gray-600 mb-1">Max applications: {pesticide.maxApplications}</div>
                            <div className="text-sm text-gray-600 mb-1">Effectiveness: {pesticide.effectiveness}</div>
                            <div className="text-sm text-gray-600 mb-1">Cost: {pesticide.cost}</div>
                            <div className="text-sm text-gray-600 mb-1">Availability: {pesticide.availability}</div>
                            <div className="text-sm text-orange-600 mt-2">
                              <strong>Safety Precautions:</strong> {pesticide.safetyPrecautions.join(', ')}
                            </div>
                          </div>
                        ))}
                    </div>

                    <h3 className="font-semibold text-yellow-800 mb-3">🟡 CHEMICAL CONTROL (Only if severity increases)</h3>
                    <p className="text-sm font-medium text-red-600 mb-3">⚠ Must clearly state: "Chemical application only under supervision of agriculture officers."</p>
                    <div className="space-y-3">
                      {reportData.pesticideRecommendations
                        .filter(pesticide => pesticide.type === 'chemical')
                        .map((pesticide, index) => (
                          <div key={index} className="bg-white rounded p-4 border border-yellow-200">
                            <div className="font-semibold text-red-700">{pesticide.name}</div>
                            <div className="text-sm text-gray-600 mb-1">Purpose: {pesticide.targetDisease.join(', ')} control</div>
                            <div className="text-sm text-gray-600 mb-1">Dosage: {pesticide.dosage}</div>
                            <div className="text-sm text-gray-600 mb-1">Application: {pesticide.applicationMethod}</div>
                            <div className="text-sm text-gray-600 mb-1">Pre-harvest interval: {pesticide.preHarvestInterval}</div>
                            <div className="text-sm text-gray-600 mb-1">Max applications: {pesticide.maxApplications}</div>
                            <div className="text-sm text-gray-600 mb-1">Effectiveness: {pesticide.effectiveness}</div>
                            <div className="text-sm text-gray-600 mb-1">Cost: {pesticide.cost}</div>
                            <div className="text-sm text-gray-600 mb-1">Availability: {pesticide.availability}</div>
                            <div className="text-sm text-red-600 mt-2">
                              <strong>Safety Precautions:</strong> {pesticide.safetyPrecautions.join(', ')}
                            </div>
                          </div>
                        ))}
                    </div>
                  </>
                )}

                {/* Fallback to static recommendations if no dynamic data */}
                {(!reportData.pesticideRecommendations || reportData.pesticideRecommendations.length === 0) && (
                  <>
                    <h3 className="font-semibold text-green-800 mb-3">🟢 BIO / ORGANIC CONTROL (Primary Recommendation)</h3>
                    <div className="space-y-3 mb-6">
                      <div className="bg-white rounded p-4">
                        <div className="font-semibold">Trichoderma viride</div>
                        <div className="text-sm text-gray-600">Purpose: Biocontrol agent against fungal pathogens</div>
                        <div className="text-sm text-gray-600">Quantity: 2.5 kg per acre</div>
                        <div className="text-sm text-gray-600">Application interval: 15 days</div>
                        <div className="text-sm text-gray-600">Expected effectiveness: 75-85%</div>
                      </div>
                      <div className="bg-white rounded p-4">
                        <div className="font-semibold">Pseudomonas fluorescens</div>
                        <div className="text-sm text-gray-600">Purpose: Antagonistic bacteria for disease suppression</div>
                        <div className="text-sm text-gray-600">Quantity: 5 kg per acre</div>
                        <div className="text-sm text-gray-600">Application interval: 10-12 days</div>
                        <div className="text-sm text-gray-600">Expected effectiveness: 70-80%</div>
                      </div>
                      <div className="bg-white rounded p-4">
                        <div className="font-semibold">Neem Oil Extract</div>
                        <div className="text-sm text-gray-600">Purpose: Natural fungicide and pest repellent</div>
                        <div className="text-sm text-gray-600">Quantity: 2 liters per acre (5% solution)</div>
                        <div className="text-sm text-gray-600">Application interval: 7-10 days</div>
                        <div className="text-sm text-gray-600">Expected effectiveness: 65-75%</div>
                      </div>
                    </div>

                    <h3 className="font-semibold text-yellow-800 mb-3">🟡 CHEMICAL CONTROL (Only if severity increases)</h3>
                    <p className="text-sm font-medium text-red-600 mb-3">⚠ Must clearly state: "Chemical application only under supervision of agriculture officers."</p>
                    <div className="space-y-3">
                      <div className="bg-white rounded p-4">
                        <div className="font-semibold">Mancozeb 75% WP</div>
                        <div className="text-sm text-gray-600">Purpose: Broad-spectrum protectant fungicide</div>
                        <div className="text-sm text-gray-600">Suggested dilution quantity: 500g per acre (2g/L water)</div>
                        <div className="text-sm text-gray-600">Application interval: 10-12 days</div>
                        <div className="text-sm text-gray-600">Maximum number of sprays: 3-4 sprays</div>
                      </div>
                      <div className="bg-white rounded p-4">
                        <div className="font-semibold">Carbendazim 50% WP</div>
                        <div className="text-sm text-gray-600">Purpose: Systemic fungicide for fungal diseases</div>
                        <div className="text-sm text-gray-600">Suggested dilution quantity: 200g per acre (1g/L water)</div>
                        <div className="text-sm text-gray-600">Application interval: 12-15 days</div>
                        <div className="text-sm text-gray-600">Maximum number of sprays: 2-3 sprays</div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Section 5: Crop Rotation & Field Recovery Plan */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">🌾 SECTION 5: CROP ROTATION & FIELD RECOVERY PLAN</h2>
                
                {/* Dynamic Crop Rotation Recommendations */}
                {reportData.cropRotationRecommendation ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-blue-800 mb-2">🌾 Recommended Alternative Crops:</h3>
                      <div className="space-y-2">
                        {reportData.cropRotationRecommendation.recommendedCrops.map((crop, index) => (
                          <div key={index} className="bg-white rounded p-3 border border-blue-200">
                            <div className="font-medium text-gray-900">{crop.crop}</div>
                            <div className="text-sm text-gray-600 mb-1">{crop.reason}</div>
                            <div className="text-xs text-gray-500">
                              <span className="mr-3">Season: {crop.plantingSeason}</span>
                              <span className="mr-3">Expected Yield: {crop.expectedYield}</span>
                            </div>
                            <div className="text-xs text-green-600">
                              Benefits: {crop.benefits.join(', ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-red-800 mb-2">⚠️ Crops to Avoid Next Season:</h3>
                      <div className="bg-red-50 rounded p-3 border border-red-200">
                        <div className="text-sm text-red-700">
                          {reportData.cropRotationRecommendation.cropsToAvoid.join(', ')}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-green-800 mb-2">🌱 Soil Recovery Methods:</h3>
                      <div className="space-y-2">
                        {reportData.cropRotationRecommendation.soilRecovery.map((method, index) => (
                          <div key={index} className="bg-white rounded p-3 border border-green-200">
                            <div className="font-medium text-gray-900">{method.method}</div>
                            <div className="text-xs text-gray-500 mb-1">Duration: {method.duration}</div>
                            <div className="text-xs text-green-600">
                              Benefits: {method.benefits.join(', ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-orange-800 mb-2">🗑️ Residue Management:</h3>
                      <div className="bg-orange-50 rounded p-3 border border-orange-200">
                        <div className="text-sm text-orange-700">
                          {reportData.cropRotationRecommendation.residueManagement}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Fallback to static recommendations */
                  <div className="space-y-2">
                    <div><strong>Crop rotation required:</strong> Yes, for {reportData.severity === 'Critical' ? '3 years' : reportData.severity === 'High' ? '2 years' : '1 year'}</div>
                    <div><strong>Recommended alternative crops:</strong> Pulses, oilseeds, or millets</div>
                    <div><strong>Crops to avoid next season:</strong> Same family crops ({reportData.cropName} varieties)</div>
                    <div><strong>Soil recovery measures:</strong> Green manuring, biofertilizers, organic amendments</div>
                    <div><strong>Residue destruction guidance:</strong> Deep burial or burning as per local regulations</div>
                    <div><strong>Organic soil improvement practices:</strong> Vermicompost, farmyard manure, biochar</div>
                  </div>
                )}
              </div>

              {/* Section 6: Farmer Safety Precautions */}
              <div className="bg-yellow-50 rounded-lg p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">🧤 SECTION 6: FARMER SAFETY PRECAUTIONS</h2>
                <div className="space-y-2">
                  <div><strong>Protective clothing guidance:</strong> Gloves, mask, goggles, and full-sleeve clothing</div>
                  <div><strong>Safe spraying time:</strong> Early morning (6-8 AM) or late evening (5-7 PM)</div>
                  <div><strong>Weather precautions:</strong> Avoid spraying during high winds or rain</div>
                  <div><strong>Re-entry waiting period:</strong> 24-48 hours after chemical application</div>
                  <div><strong>Pre-harvest interval concept:</strong> Wait specified days before harvest</div>
                  <div><strong>Safe pesticide storage and disposal:</strong> Lockable storage, proper container disposal</div>
                </div>
              </div>

              {/* Section 7: Follow-up & Monitoring */}
              <div className="bg-purple-50 rounded-lg p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">🗓️ SECTION 7: FOLLOW-UP & MONITORING</h2>
                <div className="space-y-2">
                  <div><strong>Monitoring frequency:</strong> {reportData.severity === 'Critical' ? 'Daily' : reportData.severity === 'High' ? 'Every 3 days' : 'Weekly'}</div>
                  <div><strong>Re-inspection timeline:</strong> {reportData.severity === 'Critical' ? '48 hours' : reportData.severity === 'High' ? '1 week' : '2 weeks'}</div>
                  <div><strong>Image re-upload schedule:</strong> Every {reportData.severity === 'Critical' ? '2 days' : reportData.severity === 'High' ? '5 days' : '10 days'}</div>
                  <div><strong>Early warning symptoms checklist:</strong> Leaf spots, yellowing, wilting, stunted growth</div>
                </div>
              </div>

              {/* Section 8: Official Advisory Note */}
              <div className="bg-gray-100 rounded-lg p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">⚖️ SECTION 8: OFFICIAL ADVISORY NOTE</h2>
                <div className="space-y-3">
                  <div>
                    <strong>Recommendations based on:</strong>
                    <ul className="ml-4 mt-2 space-y-1">
                      <li>• ICAR guidelines</li>
                      <li>• State Agriculture Department advisories</li>
                      <li>• FAO safe farming practices</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded p-4 border-l-4 border-red-500">
                    <strong>Disclaimer:</strong> This advisory is generated for decision support only. Final implementation must follow instructions issued by local agriculture authorities.
                  </div>
                </div>
              </div>
            </div>

            {/* Report Actions */}
            <div className="flex gap-4 justify-center mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => generateContainmentReportPDF(reportData)}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                📄 Download PDF Report
              </button>
              <button
                onClick={() => setShowReport(false)}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}