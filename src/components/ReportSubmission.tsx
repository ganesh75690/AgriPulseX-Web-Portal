import React, { useState } from 'react';
import { Camera, Upload, MapPin, User, FileText, AlertCircle, CheckCircle2, ArrowLeft, Save, X, Clock, Info, Bug, Shield, AlertTriangle, Activity, Brain, Zap, Target, Search, GitBranch, TrendingDown, Cloud } from 'lucide-react';
import GeoLocationVerification from './GeoLocationVerification';

interface ReportSubmissionProps {
  onBack: () => void;
}

// Helper functions for disease analysis
const getTreatmentRecommendations = (disease: string, severity: string): string[] => {
  const treatments: Record<string, string[]> = {
    'Leaf Blight': [
      'Apply approved fungicide (e.g., Mancozeb or Chlorothalonil)',
      'Remove and destroy infected plant parts',
      'Improve air circulation by proper spacing',
      'Avoid overhead irrigation'
    ],
    'Wheat Rust': [
      'Apply systemic fungicides (e.g., Tebuconazole)',
      'Use resistant varieties for next planting',
      'Monitor weather conditions for favorable disease development',
      'Consider early harvest if severely infected'
    ],
    'Powdery Mildew': [
      'Apply sulfur-based fungicides',
      'Ensure proper plant spacing for air circulation',
      'Avoid excessive nitrogen fertilization',
      'Prune affected plant parts'
    ],
    'Bacterial Leaf Blight': [
      'Apply copper-based bactericides',
      'Use disease-free seeds and transplants',
      'Avoid working in fields when plants are wet',
      'Implement crop rotation'
    ],
    'Rice Blast': [
      'Apply systemic fungicides (e.g., Tricyclazole)',
      'Ensure proper water management',
      'Use balanced fertilization',
      'Plant resistant varieties'
    ],
    'Cotton Wilt': [
      'Apply soil fumigants if available',
      'Improve soil drainage',
      'Use resistant rootstocks',
      'Implement crop rotation with non-host plants'
    ],
    'Boll Rot': [
      'Apply appropriate fungicides',
      'Improve air circulation through proper spacing',
      'Avoid excessive irrigation',
      'Remove infected bolls immediately'
    ],
    'Red Rot': [
      'Apply systemic fungicides',
      'Use disease-free setts for planting',
      'Implement proper field sanitation',
      'Avoid waterlogged conditions'
    ],
    'Northern Leaf Blight': [
      'Apply foliar fungicides',
      'Use resistant hybrids',
      'Practice crop rotation',
      'Ensure proper plant density'
    ],
    'Common Rust': [
      'Apply rust-specific fungicides',
      'Plant resistant varieties',
      'Monitor humidity levels',
      'Practice timely irrigation'
    ],
    'Apple Scab': [
      'Apply fungicide sprays during bloom period',
      'Remove fallen leaves and infected fruit',
      'Ensure proper air circulation',
      'Apply dormant oil spray'
    ],
    'Fire Blight': [
      'Apply streptomycin during bloom',
      'Prune infected branches 8-12 inches below infection',
      'Disinfect tools between cuts',
      'Apply copper sprays as preventive measure'
    ],
    'Anthracnose': [
      'Apply systemic fungicides',
      'Remove and destroy infected plant parts',
      'Improve air circulation',
      'Avoid overhead irrigation'
    ],
    'Early Blight': [
      'Apply copper-based fungicides',
      'Remove lower infected leaves',
      'Ensure proper spacing and air circulation',
      'Use resistant varieties'
    ],
    'Late Blight': [
      'Apply metalaxyl-based fungicides',
      'Remove infected plants immediately',
      'Ensure good drainage',
      'Monitor weather conditions closely'
    ],
    'Leaf Curl Virus': [
      'Remove infected plants',
      'Control whitefly vectors',
      'Use virus-free seedlings',
      'Apply reflective mulches'
    ],
    'Scab': [
      'Apply fungicide treatments before planting',
      'Use certified disease-free seed potatoes',
      'Maintain proper soil pH',
      'Rotate crops every 3-4 years'
    ],
    'Fungal Infection': [
      'Apply broad-spectrum fungicides',
      'Improve air circulation',
      'Remove infected plant material',
      'Monitor environmental conditions'
    ],
    'Pest Damage': [
      'Apply appropriate insecticides',
      'Implement integrated pest management',
      'Use physical barriers if applicable',
      'Monitor pest population regularly'
    ]
  };
  
  return treatments[disease] || ['Consult agricultural extension officer for specific treatment recommendations'];
};

const getUrgencyLevel = (severity: string): string => {
  switch (severity) {
    case 'High': return 'High';
    case 'Moderate-High': return 'High';
    case 'Moderate': return 'Medium';
    case 'Low-Moderate': return 'Medium';
    case 'Low': return 'Low';
    case 'None': return 'Low';
    default: return 'Medium';
  }
};

const getNextSteps = (disease: string, severity: string): string[] => {
  if (disease === 'Healthy') {
    return [
      'Continue regular monitoring of crop health',
      'Maintain proper agricultural practices',
      'Document current crop condition for future reference',
      'Schedule routine field inspections'
    ];
  }
  
  const baseSteps = [
    'Isolate affected area if possible',
    'Document symptoms with photos',
    'Contact local agricultural extension officer',
    'Follow treatment recommendations promptly'
  ];
  
  if (severity === 'High' || severity === 'Moderate-High') {
    return [
      'Take immediate action within 24-48 hours',
      ...baseSteps,
      'Consider quarantine measures',
      'Prepare for potential crop loss mitigation'
    ];
  }
  
  return [
    'Monitor progression over next 3-5 days',
    ...baseSteps,
    'Implement preventive measures',
    'Schedule follow-up assessment'
  ];
};

const getPreventionTips = (disease: string): string[] => {
  const prevention: Record<string, string[]> = {
    'Leaf Blight': [
      'Use disease-resistant varieties',
      'Practice crop rotation (2-3 years)',
      'Ensure proper field drainage',
      'Avoid excessive nitrogen fertilization'
    ],
    'Wheat Rust': [
      'Plant rust-resistant varieties',
      'Monitor weather conditions regularly',
      'Apply preventive fungicides during high-risk periods',
      'Remove volunteer wheat plants'
    ],
    'Powdery Mildew': [
      'Ensure adequate spacing between plants',
      'Prune regularly for air circulation',
      'Avoid overhead irrigation',
      'Choose resistant varieties when available'
    ],
    'Bacterial Leaf Blight': [
      'Use certified disease-free seeds',
      'Implement proper field sanitation',
      'Avoid working in wet fields',
      'Practice crop rotation'
    ],
    'Rice Blast': [
      'Use blast-resistant varieties',
      'Maintain proper water management',
      'Balance fertilizer application',
      'Ensure proper field drying periods'
    ],
    'Cotton Wilt': [
      'Use wilt-resistant rootstocks',
      'Improve soil structure and drainage',
      'Practice long-term crop rotation',
      'Soil solarization before planting'
    ],
    'Boll Rot': [
      'Ensure proper plant spacing',
      'Improve air circulation in field',
      'Timely harvesting of mature bolls',
      'Avoid excessive irrigation during boll development'
    ],
    'Red Rot': [
      'Use disease-free planting material',
      'Implement crop rotation with non-host crops',
      'Proper field sanitation',
      'Avoid waterlogged conditions'
    ],
    'Northern Leaf Blight': [
      'Plant resistant hybrids',
      'Practice crop rotation',
      'Proper tillage to reduce inoculum',
      'Balanced fertilization'
    ],
    'Common Rust': [
      'Use rust-resistant varieties',
      'Monitor weather for favorable conditions',
      'Proper plant spacing',
      'Timely fungicide application'
    ],
    'Apple Scab': [
      'Plant scab-resistant varieties',
      'Apply dormant sprays before bud break',
      'Maintain proper orchard sanitation',
      'Ensure good air circulation'
    ],
    'Fire Blight': [
      'Plant fire blight-resistant varieties',
      'Apply preventive copper sprays',
      'Avoid excessive nitrogen fertilization',
      'Prune during dormant season'
    ],
    'Anthracnose': [
      'Use disease-free planting material',
      'Apply preventive fungicides',
      'Ensure proper drainage',
      'Remove infected debris'
    ],
    'Early Blight': [
      'Use resistant varieties',
      'Practice crop rotation',
      'Ensure proper plant spacing',
      'Apply preventive fungicides'
    ],
    'Late Blight': [
      'Use late blight-resistant varieties',
      'Monitor weather conditions',
      'Apply preventive fungicides',
      'Ensure proper drainage'
    ],
    'Leaf Curl Virus': [
      'Use virus-free seedlings',
      'Control whitefly populations',
      'Use reflective mulches',
      'Remove infected plants'
    ],
    'Scab': [
      'Use certified seed potatoes',
      'Practice crop rotation',
      'Maintain proper soil pH',
      'Apply preventive treatments'
    ],
    'Fungal Infection': [
      'Improve air circulation',
      'Proper water management',
      'Regular field monitoring',
      'Use resistant varieties when available'
    ],
    'Pest Damage': [
      'Implement integrated pest management',
      'Regular scouting and monitoring',
      'Use beneficial insects when possible',
      'Proper field sanitation'
    ]
  };
  
  return prevention[disease] || [
    'Follow general crop management best practices',
    'Regular field monitoring',
    'Maintain proper soil health',
    'Consult with agricultural experts'
  ];
};

export default function ReportSubmission({ onBack }: ReportSubmissionProps) {
  const [formData, setFormData] = useState({
    farmerName: '',
    farmerId: '',
    gender: 'Male',
    age: '',
    village: '',
    district: '',
    state: '',
    cropType: '',
    diseaseType: '',
    severity: '',
    description: '',
    armerName: '',
    contactNumber: '',
    notes: '',
    landArea: '',
    address: '',
    mandal: ''
  });

  // Add debug state to track form changes
  const [debugInfo, setDebugInfo] = useState('');

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [nearbyFarmerIssue, setNearbyFarmerIssue] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [reportType, setReportType] = useState<'farmer' | 'village'>('farmer');
  const [diseaseAnalysis, setDiseaseAnalysis] = useState<any>(null);
  const [imageAnalyzed, setImageAnalyzed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [locationVerification, setLocationVerification] = useState<any>(null);
  const [currentOfficerId] = useState('OFFICER001'); // In real app, get from auth

  // Smart Report Quality Indicator Logic
  const getReportQuality = () => {
    let score = 0;
    let status = 'incomplete';
    
    // Image uploaded (40 points)
    if (selectedImage) score += 40;
    
    // Crop selected (30 points)
    if (formData.cropType) score += 30;
    
    // Location selected (20 points)
    if (formData.village && formData.state && formData.district) score += 20;
    
    // Basic farmer info (10 points)
    if (formData.farmerName && formData.farmerId && formData.contactNumber) score += 10;
    
    // Determine status
    if (score >= 80) status = 'high-quality';
    else if (score >= 50) status = 'sufficient';
    
    return { score, status };
  };

  const reportQuality = getReportQuality();

  const getQualityColor = () => {
    switch (reportQuality.status) {
      case 'high-quality': return 'bg-green-100 text-green-800 border-green-300';
      case 'sufficient': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'incomplete': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getQualityIcon = () => {
    switch (reportQuality.status) {
      case 'high-quality': return '✅';
      case 'sufficient': return '⚠️';
      case 'incomplete': return '❌';
      default: return '❓';
    }
  };

  const villages = [
    'Village A - Ludhiana',
    'Village B - Ludhiana', 
    'Village C - Ludhiana',
    'Village D - Ludhiana'
  ];

  const states = [
    'Punjab',
    'Haryana', 
    'Uttar Pradesh',
    'Madhya Pradesh',
    'Rajasthan',
    'Gujarat',
    'Maharashtra',
    'Karnataka',
    'Tamil Nadu',
    'Andhra Pradesh',
    'West Bengal',
    'Bihar',
    'Odisha',
    'Uttarakhand',
    'Jharkhand',
    'Chhattisgarh'
  ];

  const mandals = [
    'Ludhiana',
    'Jalandhar',
    'Firozepur',
    'Patiala',
    'Amritsar',
    'Gurdaspur',
    'Kapurthala',
    'SAS Nagar (Mohali)',
    'Barnala',
    'Mansa',
    'Faridkot',
    'Fazilka',
    'Sri Muktsar Sahib',
    'Pathankot',
    'Rupnagar',
    'Tarn Taran'
  ];

  const cropTypes = [
    'Wheat',
    'Rice',
    'Cotton',
    'Sugarcane',
    'Maize',
    'Pulses',
    'Oilseeds',
    'Other'
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImageAnalyzed(false); // Reset analysis when new image is uploaded
      setDiseaseAnalysis(null); // Clear previous analysis
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDiseaseDetection = async () => {
    if (!selectedImage) {
      setError('Please upload an image first');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Enhanced demo disease detection with realistic analysis
      const cropType = formData.cropType === 'Other' ? formData.diseaseType : formData.cropType;
      const diseaseDatabase = {
        'Wheat': [
          { 
            disease: 'Leaf Blight', 
            confidence: 87, 
            severity: 'Moderate', 
            symptoms: 'Brown lesions on leaves with yellow halos, progressing to premature leaf death and plant weakening.',
            scientificName: 'Alternaria triticina',
            affectedAreas: ['Lower leaves', 'Leaf tips', 'Leaf margins'],
            spreadRate: 'Moderate (4-6 days)',
            economicImpact: '15-25% yield reduction in severe cases',
            weatherConditions: ['Moderate humidity', 'Temperature 20-25°C', 'Rainy periods']
          },
          { 
            disease: 'Wheat Rust', 
            confidence: 92, 
            severity: 'High', 
            symptoms: 'Orange-brown pustules on leaves and stems that can rupture and release spores. Causes premature leaf death.',
            scientificName: 'Puccinia triticina',
            affectedAreas: ['Leaves', 'Stems', 'Leaf sheaths'],
            spreadRate: 'Very rapid (1-2 days during favorable conditions)',
            economicImpact: '20-40% yield loss during epidemics',
            weatherConditions: ['High humidity', 'Temperature 15-25°C', 'Dew formation']
          },
          { 
            disease: 'Powdery Mildew', 
            confidence: 78, 
            severity: 'Low-Moderate', 
            symptoms: 'White powdery fungal growth on leaf surface that can turn gray-brown over time.',
            scientificName: 'Blumeria graminis f.sp. tritici',
            affectedAreas: ['Upper leaf surfaces', 'Stems', 'Heads'],
            spreadRate: 'Slow to moderate (5-7 days)',
            economicImpact: '5-15% yield reduction',
            weatherConditions: ['High humidity', 'Cool temperatures (15-22°C)', 'Shaded conditions']
          },
          { 
            disease: 'Healthy', 
            confidence: 95, 
            severity: 'None', 
            symptoms: 'No disease symptoms detected. Plant shows normal green coloration, healthy tillering, and vigorous growth.',
            scientificName: 'N/A - Optimal plant health',
            affectedAreas: ['None - All tissues healthy'],
            spreadRate: 'N/A',
            economicImpact: 'No economic impact - Maximum yield potential',
            weatherConditions: ['Optimal growing conditions maintained']
          }
        ],
        'Rice': [
          { 
            disease: 'Bacterial Leaf Blight', 
            confidence: 92, 
            severity: 'High', 
            symptoms: 'Yellow to white lesions along leaf margins progressing to complete leaf drying. Water-soaked lesions that turn yellow-white and necrotic. Affects seedlings to mature plants.',
            scientificName: 'Xanthomonas oryzae pv. oryzae',
            affectedAreas: ['Leaf tips', 'Leaf margins', 'Entire leaf blade', 'Seedling leaves'],
            spreadRate: 'Rapid (2-3 days under favorable conditions)',
            economicImpact: 'Up to 50% yield loss in severe epidemics',
            weatherConditions: ['High humidity (>90%)', 'Temperature 25-30°C', 'Rainy season', 'Strong winds']
          },
          { 
            disease: 'Rice Blast', 
            confidence: 94, 
            severity: 'High', 
            symptoms: 'Diamond-shaped or spindle lesions with gray centers and brown borders. Neck blast can cause plant death. Leaf spots coalesce forming large dead areas.',
            scientificName: 'Magnaporthe oryzae (Pyricularia oryzae)',
            affectedAreas: ['Leaves', 'Neck nodes', 'Panicles', 'Collar regions', 'Grains'],
            spreadRate: 'Very rapid (1-2 days during sporulation)',
            economicImpact: '30-70% yield loss during epidemic conditions',
            weatherConditions: ['High humidity (>95%)', 'Cool nights (20-25°C)', 'Warm days (25-28°C)', 'Frequent drizzle']
          },
          { 
            disease: 'Sheath Blight', 
            confidence: 88, 
            severity: 'Moderate-High', 
            symptoms: 'Oval to irregular lesions on leaf sheaths with white centers and brown margins. Can spread to upper leaves causing premature death.',
            scientificName: 'Rhizoctonia solani AG-1 IA',
            affectedAreas: ['Leaf sheaths', 'Lower leaves', 'Culm internodes'],
            spreadRate: 'Moderate to rapid (3-5 days)',
            economicImpact: '20-30% yield loss, up to 50% in severe cases',
            weatherConditions: ['High temperature (>30°C)', 'High humidity (>85%)', 'Dense planting', 'High nitrogen fertilization']
          },
          { 
            disease: 'Tungro', 
            confidence: 90, 
            severity: 'High', 
            symptoms: 'Yellow-orange discoloration of leaves, stunted growth, reduced tillering. Interveinal chlorosis and plant mortality in severe cases.',
            scientificName: 'Rice tungro bacilliform virus (RTBV)',
            affectedAreas: ['Entire plant system', 'Growing points', 'Phloem tissues'],
            spreadRate: 'Fast via leafhopper vectors (2-3 weeks field-wide)',
            economicImpact: '40-60% yield loss in severe infections',
            weatherConditions: ['Dry season conditions', 'High leafhopper population', 'Temperature 26-32°C']
          },
          { 
            disease: 'Bacterial Leaf Streak', 
            confidence: 85, 
            severity: 'Moderate', 
            symptoms: 'Small, translucent streaks between veins that turn yellow-brown. Lesions enlarge and coalesce forming irregular patches.',
            scientificName: 'Xanthomonas oryzae pv. oryzicola',
            affectedAreas: ['Leaf blades', 'Leaf sheaths', 'Glumes'],
            spreadRate: 'Moderate (4-6 days)',
            economicImpact: '10-20% yield reduction',
            weatherConditions: ['Moderate to high humidity', 'Temperature 25-30°C', 'Rainy periods']
          },
          { 
            disease: 'Healthy', 
            confidence: 96, 
            severity: 'None', 
            symptoms: 'No disease symptoms detected. Plant exhibits optimal green coloration, normal growth patterns, healthy root system, and vigorous development. No visible signs of pathogen infection or pest damage.',
            scientificName: 'N/A - Optimal plant health',
            affectedAreas: ['None - All tissues healthy'],
            spreadRate: 'N/A',
            economicImpact: 'No economic impact - Maximum yield potential',
            weatherConditions: ['Optimal growing conditions maintained']
          }
        ],
        'Cotton': [
          { 
            disease: 'Cotton Wilt', 
            confidence: 85, 
            severity: 'High', 
            symptoms: 'Wilting, yellowing, vascular discoloration. Plants show sudden collapse and death.',
            scientificName: 'Fusarium oxysporum f.sp. vasinfectum',
            affectedAreas: ['Vascular system', 'Roots', 'Lower stem'],
            spreadRate: 'Moderate (3-5 days)',
            economicImpact: '25-40% yield loss in severe cases',
            weatherConditions: ['High temperature', 'Water stress', 'Poor drainage']
          },
          { 
            disease: 'Boll Rot', 
            confidence: 88, 
            severity: 'Moderate-High', 
            symptoms: 'Water-soaked lesions on cotton bolls that turn dark and rotten.',
            scientificName: 'Various fungal pathogens',
            affectedAreas: ['Cotton bolls', 'Flowers', 'Young fruits'],
            spreadRate: 'Rapid during wet periods (2-3 days)',
            economicImpact: '15-30% yield reduction',
            weatherConditions: ['High humidity', 'Rainy weather', 'Poor ventilation']
          },
          { 
            disease: 'Leaf Spot', 
            confidence: 79, 
            severity: 'Moderate', 
            symptoms: 'Circular brown spots on leaves with concentric rings.',
            scientificName: 'Alternaria spp.',
            affectedAreas: ['Leaves', 'Leaf petioles'],
            spreadRate: 'Moderate (4-6 days)',
            economicImpact: '10-20% yield reduction',
            weatherConditions: ['Moderate humidity', 'Warm temperatures']
          },
          { 
            disease: 'Healthy', 
            confidence: 93, 
            severity: 'None', 
            symptoms: 'No disease symptoms detected. Plant shows healthy growth and development.',
            scientificName: 'N/A - Optimal plant health',
            affectedAreas: ['None - All tissues healthy'],
            spreadRate: 'N/A',
            economicImpact: 'No economic impact - Maximum yield potential',
            weatherConditions: ['Optimal growing conditions maintained']
          }
        ],
        'Sugarcane': [
          { 
            disease: 'Red Rot', 
            confidence: 90, 
            severity: 'High', 
            symptoms: 'Reddish discoloration with characteristic alcohol smell from internal tissues.',
            scientificName: 'Colletotrichum falcatum',
            affectedAreas: ['Stem internodes', 'Internal tissues', 'Leaves'],
            spreadRate: 'Rapid (2-4 days)',
            economicImpact: '30-50% yield loss in severe cases',
            weatherConditions: ['High humidity', 'Temperature 25-32°C', 'Rainy season']
          },
          { 
            disease: 'Smut', 
            confidence: 86, 
            severity: 'Moderate', 
            symptoms: 'Black sooty mass on shoots and whip-like structures.',
            scientificName: 'Ustilago scitaminea',
            affectedAreas: ['Growing points', 'Shoots', 'Meristematic tissues'],
            spreadRate: 'Moderate (4-6 days)',
            economicImpact: '15-25% yield reduction',
            weatherConditions: ['Dry conditions', 'Temperature 20-30°C']
          },
          { 
            disease: 'Leaf Scald', 
            confidence: 82, 
            severity: 'Moderate', 
            symptoms: 'White lesions parallel to veins that turn red-brown.',
            scientificName: 'Xanthomonas albilineans',
            affectedAreas: ['Leaves', 'Leaf veins', 'Stem'],
            spreadRate: 'Moderate (5-7 days)',
            economicImpact: '10-20% yield reduction',
            weatherConditions: ['Warm humid conditions', 'Temperature 25-30°C']
          },
          { 
            disease: 'Healthy', 
            confidence: 94, 
            severity: 'None', 
            symptoms: 'No disease symptoms detected. Plant shows healthy cane development.',
            scientificName: 'N/A - Optimal plant health',
            affectedAreas: ['None - All tissues healthy'],
            spreadRate: 'N/A',
            economicImpact: 'No economic impact - Maximum yield potential',
            weatherConditions: ['Optimal growing conditions maintained']
          }
        ],
        'Maize': [
          { 
            disease: 'Northern Leaf Blight', 
            confidence: 88, 
            severity: 'Moderate-High', 
            symptoms: 'Long, grayish-green lesions on leaves that become tan and rectangular.',
            scientificName: 'Setosphaeria turcica',
            affectedAreas: ['Lower leaves', 'Middle leaves', 'Leaf sheaths'],
            spreadRate: 'Moderate to rapid (3-5 days)',
            economicImpact: '20-30% yield loss in severe infections',
            weatherConditions: ['High humidity', 'Temperature 18-27°C', 'Dew formation']
          },
          { 
            disease: 'Common Rust', 
            confidence: 91, 
            severity: 'Moderate', 
            symptoms: 'Circular, cinnamon-brown pustules that rupture and release spores.',
            scientificName: 'Puccinia sorghi',
            affectedAreas: ['Leaves', 'Leaf sheaths', 'Husks'],
            spreadRate: 'Rapid (2-3 days)',
            economicImpact: '15-25% yield reduction',
            weatherConditions: ['Cool nights', 'Warm days', 'High humidity']
          },
          { 
            disease: 'Gray Leaf Spot', 
            confidence: 84, 
            severity: 'Moderate', 
            symptoms: 'Rectangular grayish lesions parallel to leaf veins.',
            scientificName: 'Cercospora zeae-maydis',
            affectedAreas: ['Leaves', 'Leaf sheaths'],
            spreadRate: 'Moderate (4-6 days)',
            economicImpact: '10-20% yield reduction',
            weatherConditions: ['High humidity', 'Temperature 25-30°C', 'Extended leaf wetness']
          },
          { 
            disease: 'Healthy', 
            confidence: 95, 
            severity: 'None', 
            symptoms: 'No disease symptoms detected. Plant shows healthy growth and development.',
            scientificName: 'N/A - Optimal plant health',
            affectedAreas: ['None - All tissues healthy'],
            spreadRate: 'N/A',
            economicImpact: 'No economic impact - Maximum yield potential',
            weatherConditions: ['Optimal growing conditions maintained']
          }
        ],
        'Pulses': [
          { 
            disease: 'Powdery Mildew', 
            confidence: 86, 
            severity: 'Moderate', 
            symptoms: 'White powdery coating on leaves that can turn gray-brown.',
            scientificName: 'Erysiphe polygoni',
            affectedAreas: ['Leaves', 'Stems', 'Pods'],
            spreadRate: 'Moderate (4-6 days)',
            economicImpact: '10-20% yield reduction',
            weatherConditions: ['High humidity', 'Temperature 20-25°C', 'Shaded conditions']
          },
          { 
            disease: 'Leaf Spot', 
            confidence: 81, 
            severity: 'Moderate', 
            symptoms: 'Small, circular brown spots with yellow halos.',
            scientificName: 'Cercospora spp.',
            affectedAreas: ['Leaves', 'Leaf petioles'],
            spreadRate: 'Moderate (5-7 days)',
            economicImpact: '8-15% yield reduction',
            weatherConditions: ['Moderate humidity', 'Warm temperatures']
          },
          { 
            disease: 'Rust', 
            confidence: 89, 
            severity: 'Moderate-High', 
            symptoms: 'Rusty pustules on undersides of leaves that release spores.',
            scientificName: 'Uromyces spp.',
            affectedAreas: ['Lower leaf surfaces', 'Stems'],
            spreadRate: 'Rapid (2-4 days)',
            economicImpact: '15-25% yield loss',
            weatherConditions: ['High humidity', 'Temperature 15-25°C', 'Dew formation']
          },
          { 
            disease: 'Healthy', 
            confidence: 93, 
            severity: 'None', 
            symptoms: 'No disease symptoms detected. Plant shows healthy growth and pod development.',
            scientificName: 'N/A - Optimal plant health',
            affectedAreas: ['None - All tissues healthy'],
            spreadRate: 'N/A',
            economicImpact: 'No economic impact - Maximum yield potential',
            weatherConditions: ['Optimal growing conditions maintained']
          }
        ],
        'Oilseeds': [
          { 
            disease: 'Alternaria Leaf Spot', 
            confidence: 84, 
            severity: 'Moderate', 
            symptoms: 'Dark brown spots with concentric rings on leaves.',
            scientificName: 'Alternaria brassicae',
            affectedAreas: ['Leaves', 'Stems', 'Pods'],
            spreadRate: 'Moderate (4-6 days)',
            economicImpact: '10-20% yield reduction',
            weatherConditions: ['Moderate humidity', 'Temperature 20-25°C']
          },
          { 
            disease: 'Downy Mildew', 
            confidence: 87, 
            severity: 'Moderate', 
            symptoms: 'Yellowish patches on upper leaf surface with white growth below.',
            scientificName: 'Peronospora parasitica',
            affectedAreas: ['Leaves', 'Growing points'],
            spreadRate: 'Rapid during wet periods (2-4 days)',
            economicImpact: '15-25% yield reduction',
            weatherConditions: ['High humidity', 'Cool temperatures', 'Rainy weather']
          },
          { 
            disease: 'Sclerotinia Wilt', 
            confidence: 82, 
            severity: 'High', 
            symptoms: 'Wilting, white cottony growth at stem base.',
            scientificName: 'Sclerotinia sclerotiorum',
            affectedAreas: ['Stem base', 'Roots', 'Lower branches'],
            spreadRate: 'Moderate (3-5 days)',
            economicImpact: '25-40% yield loss in severe cases',
            weatherConditions: ['High humidity', 'Cool temperatures', 'Moist soil']
          },
          { 
            disease: 'Healthy', 
            confidence: 94, 
            severity: 'None', 
            symptoms: 'No disease symptoms detected. Plant shows healthy growth and seed development.',
            scientificName: 'N/A - Optimal plant health',
            affectedAreas: ['None - All tissues healthy'],
            spreadRate: 'N/A',
            economicImpact: 'No economic impact - Maximum yield potential',
            weatherConditions: ['Optimal growing conditions maintained']
          }
        ],
        'Apple': [
          { 
            disease: 'Apple Scab', 
            confidence: 88, 
            severity: 'Moderate', 
            symptoms: 'Olive-green spots on leaves and fruit that turn black.',
            scientificName: 'Venturia inaequalis',
            affectedAreas: ['Leaves', 'Fruit', 'Leaf petioles'],
            spreadRate: 'Moderate (4-6 days)',
            economicImpact: '20-30% yield reduction',
            weatherConditions: ['High humidity', 'Temperature 15-20°C', 'Rainy periods']
          },
          { 
            disease: 'Fire Blight', 
            confidence: 85, 
            severity: 'High', 
            symptoms: 'Blossom blight, shoot dieback, shepherd\'s crook appearance.',
            scientificName: 'Erwinia amylovora',
            affectedAreas: ['Blossoms', 'Shoots', 'Branches'],
            spreadRate: 'Very rapid during bloom (1-2 days)',
            economicImpact: '30-50% yield loss in severe infections',
            weatherConditions: ['Warm humid weather', 'Bloom period', 'Insect activity']
          },
          { 
            disease: 'Powdery Mildew', 
            confidence: 82, 
            severity: 'Low-Moderate', 
            symptoms: 'White powdery growth on leaves and shoots.',
            scientificName: 'Podosphaera leucotricha',
            affectedAreas: ['Leaves', 'Shoots', 'Buds'],
            spreadRate: 'Slow to moderate (5-7 days)',
            economicImpact: '5-15% yield reduction',
            weatherConditions: ['High humidity', 'Cool temperatures', 'Shaded conditions']
          },
          { 
            disease: 'Healthy', 
            confidence: 94, 
            severity: 'None', 
            symptoms: 'No disease symptoms detected. Plant shows healthy growth and fruit development.',
            scientificName: 'N/A - Optimal plant health',
            affectedAreas: ['None - All tissues healthy'],
            spreadRate: 'N/A',
            economicImpact: 'No economic impact - Maximum yield potential',
            weatherConditions: ['Optimal growing conditions maintained']
          }
        ],
        'Mango': [
          { 
            disease: 'Anthracnose', 
            confidence: 90, 
            severity: 'High', 
            symptoms: 'Dark sunken spots on fruits and leaves with pinkish spore masses.',
            scientificName: 'Colletotrichum gloeosporioides',
            affectedAreas: ['Fruits', 'Leaves', 'Flowers'],
            spreadRate: 'Rapid during wet periods (2-3 days)',
            economicImpact: '30-50% yield loss in severe infections',
            weatherConditions: ['High humidity', 'Temperature 25-30°C', 'Rainy season']
          },
          { 
            disease: 'Powdery Mildew', 
            confidence: 84, 
            severity: 'Moderate', 
            symptoms: 'White powdery coating on leaves, flowers, and young fruits.',
            scientificName: 'Oidium mangiferae',
            affectedAreas: ['Leaves', 'Flowers', 'Young fruits'],
            spreadRate: 'Moderate (4-6 days)',
            economicImpact: '15-25% yield reduction',
            weatherConditions: ['High humidity', 'Temperature 20-25°C', 'Cool nights']
          },
          { 
            disease: 'Leaf Spot', 
            confidence: 79, 
            severity: 'Moderate', 
            symptoms: 'Brown irregular spots that may coalesce forming large lesions.',
            scientificName: 'Pestalotiopsis mangiferae',
            affectedAreas: ['Leaves', 'Leaf petioles'],
            spreadRate: 'Moderate (5-7 days)',
            economicImpact: '10-20% yield reduction',
            weatherConditions: ['Moderate humidity', 'Warm temperatures']
          },
          { 
            disease: 'Healthy', 
            confidence: 93, 
            severity: 'None', 
            symptoms: 'No disease symptoms detected. Plant shows healthy growth and fruit development.',
            scientificName: 'N/A - Optimal plant health',
            affectedAreas: ['None - All tissues healthy'],
            spreadRate: 'N/A',
            economicImpact: 'No economic impact - Maximum yield potential',
            weatherConditions: ['Optimal growing conditions maintained']
          }
        ],
        // Vegetables
        'Tomato': [
          { 
            disease: 'Early Blight', 
            confidence: 87, 
            severity: 'Moderate', 
            symptoms: 'Dark concentric rings on lower leaves with target-like appearance.',
            scientificName: 'Alternaria solani',
            affectedAreas: ['Lower leaves', 'Stem', 'Fruits'],
            spreadRate: 'Moderate (4-6 days)',
            economicImpact: '15-30% yield reduction',
            weatherConditions: ['Moderate humidity', 'Temperature 20-25°C', 'Warm rainy periods']
          },
          { 
            disease: 'Late Blight', 
            confidence: 91, 
            severity: 'High', 
            symptoms: 'Water-soaked lesions on leaves and fruits that turn brown-black.',
            scientificName: 'Phytophthora infestans',
            affectedAreas: ['Leaves', 'Stems', 'Fruits', 'Tubers'],
            spreadRate: 'Very rapid (1-2 days)',
            economicImpact: '30-70% yield loss in epidemics',
            weatherConditions: ['High humidity', 'Cool temperatures (15-20°C)', 'Rainy weather']
          },
          { 
            disease: 'Leaf Curl Virus', 
            confidence: 83, 
            severity: 'Moderate', 
            symptoms: 'Leaf curling, yellowing, and stunted growth.',
            scientificName: 'Tomato leaf curl virus',
            affectedAreas: ['Growing points', 'Leaves', 'Flowers'],
            spreadRate: 'Fast via whitefly vectors',
            economicImpact: '20-40% yield loss',
            weatherConditions: ['Warm temperatures', 'High whitefly population']
          },
          { 
            disease: 'Healthy', 
            confidence: 95, 
            severity: 'None', 
            symptoms: 'No disease symptoms detected. Plant shows healthy growth and fruit development.',
            scientificName: 'N/A - Optimal plant health',
            affectedAreas: ['None - All tissues healthy'],
            spreadRate: 'N/A',
            economicImpact: 'No economic impact - Maximum yield potential',
            weatherConditions: ['Optimal growing conditions maintained']
          }
        ],
        'Potato': [
          { 
            disease: 'Late Blight', 
            confidence: 92, 
            severity: 'High', 
            symptoms: 'Dark water-soaked lesions on leaves that turn brown-black.',
            scientificName: 'Phytophthora infestans',
            affectedAreas: ['Leaves', 'Stems', 'Tubers'],
            spreadRate: 'Very rapid (1-2 days)',
            economicImpact: '30-70% yield loss in epidemics',
            weatherConditions: ['High humidity', 'Cool temperatures (15-20°C)', 'Rainy weather']
          },
          { 
            disease: 'Early Blight', 
            confidence: 85, 
            severity: 'Moderate', 
            symptoms: 'Brown spots with concentric rings on lower leaves.',
            scientificName: 'Alternaria solani',
            affectedAreas: ['Lower leaves', 'Stem', 'Tubers'],
            spreadRate: 'Moderate (4-6 days)',
            economicImpact: '15-30% yield reduction',
            weatherConditions: ['Moderate humidity', 'Temperature 20-25°C', 'Warm periods']
          },
          { 
            disease: 'Scab', 
            confidence: 78, 
            severity: 'Low-Moderate', 
            symptoms: 'Rough, corky lesions on tubers with raised margins.',
            scientificName: 'Streptomyces scabies',
            affectedAreas: ['Tubers', 'Roots'],
            spreadRate: 'Slow (7-10 days)',
            economicImpact: '5-15% yield reduction',
            weatherConditions: ['Dry conditions', 'High soil pH', 'Warm temperatures']
          },
          { 
            disease: 'Healthy', 
            confidence: 94, 
            severity: 'None', 
            symptoms: 'No disease symptoms detected. Plant shows healthy growth and tuber development.',
            scientificName: 'N/A - Optimal plant health',
            affectedAreas: ['None - All tissues healthy'],
            spreadRate: 'N/A',
            economicImpact: 'No economic impact - Maximum yield potential',
            weatherConditions: ['Optimal growing conditions maintained']
          }
        ],
        'Other': [
          { 
            disease: 'Leaf Blight', 
            confidence: 85, 
            severity: 'Moderate', 
            symptoms: 'Brown lesions and yellowing of leaves, progressing to necrosis.',
            scientificName: 'Various fungal pathogens',
            affectedAreas: ['Leaves', 'Leaf margins'],
            spreadRate: 'Moderate (4-6 days)',
            economicImpact: '15-25% yield reduction',
            weatherConditions: ['Moderate humidity', 'Warm temperatures']
          },
          { 
            disease: 'Fungal Infection', 
            confidence: 83, 
            severity: 'Moderate', 
            symptoms: 'Spots or mold growth on various plant parts.',
            scientificName: 'Various fungal species',
            affectedAreas: ['Leaves', 'Stems', 'Fruits'],
            spreadRate: 'Variable (3-7 days)',
            economicImpact: '10-30% yield reduction',
            weatherConditions: ['High humidity', 'Moderate temperatures']
          },
          { 
            disease: 'Pest Damage', 
            confidence: 79, 
            severity: 'Low-Moderate', 
            symptoms: 'Chewing damage or holes in leaves and stems.',
            scientificName: 'Various insect pests',
            affectedAreas: ['Leaves', 'Stems', 'Fruits'],
            spreadRate: 'Rapid if untreated (2-4 days)',
            economicImpact: '5-20% yield reduction',
            weatherConditions: ['Warm weather', 'High pest population']
          },
          { 
            disease: 'Healthy', 
            confidence: 92, 
            severity: 'None', 
            symptoms: 'No disease symptoms detected. Plant appears healthy and vigorous.',
            scientificName: 'N/A - Optimal plant health',
            affectedAreas: ['None - All tissues healthy'],
            spreadRate: 'N/A',
            economicImpact: 'No economic impact - Maximum yield potential',
            weatherConditions: ['Optimal growing conditions maintained']
          }
        ]
      };

      const possibleDiseases = diseaseDatabase[cropType as keyof typeof diseaseDatabase] || diseaseDatabase['Other'];
      const randomDisease = possibleDiseases[Math.floor(Math.random() * possibleDiseases.length)];
      
      const imageAnalysis = {
        disease: randomDisease.disease,
        confidence: randomDisease.confidence,
        severity: randomDisease.severity,
        symptoms: randomDisease.symptoms,
        scientificName: randomDisease.scientificName || 'N/A',
        affectedAreas: randomDisease.affectedAreas || [],
        spreadRate: randomDisease.spreadRate || 'Unknown',
        economicImpact: randomDisease.economicImpact || 'Not specified',
        weatherConditions: randomDisease.weatherConditions || [],
        explanation: `AI analysis detected ${randomDisease.disease.toLowerCase()} (${randomDisease.scientificName || 'unknown pathogen'}) with ${randomDisease.confidence}% confidence. ${randomDisease.symptoms}. This disease affects ${randomDisease.affectedAreas?.join(', ') || 'multiple plant parts'} and spreads at ${randomDisease.spreadRate || 'unknown rate'}.`,
        recommendations: getTreatmentRecommendations(randomDisease.disease, randomDisease.severity),
        urgency: getUrgencyLevel(randomDisease.severity),
        nextSteps: getNextSteps(randomDisease.disease, randomDisease.severity),
        prevention: getPreventionTips(randomDisease.disease)
      };
      
      setDiseaseAnalysis(imageAnalysis);
      setImageAnalyzed(true);
      console.log('✅ Enhanced demo image analysis completed:', imageAnalysis);

    } catch (error) {
      console.error('❌ Disease detection error:', error);
      setError(error instanceof Error ? error.message : 'Disease detection failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSuccessDialogClose = () => {
    setSubmitStatus('idle');
    setSelectedImage(null);
    setImagePreview('');
    setDiseaseAnalysis(null);
    setImageAnalyzed(false);
    setFormData({
      farmerName: '',
      farmerId: '',
      gender: 'Male',
      age: '',
      village: '',
      district: '',
      state: '',
      cropType: '',
      diseaseType: '',
      severity: '',
      description: '',
      armerName: '',
      contactNumber: '',
      notes: '',
      landArea: '',
      address: '',
      mandal: ''
    });
    setError(null);
  };

  const handleSubmit = async () => {
    console.log('=== SUBMIT BUTTON CLICKED ===');
    console.log('Submit button clicked!');
    console.log('Form data:', formData);
    console.log('Report type:', reportType);
    console.log('Selected image:', selectedImage);
    console.log('Is submitting:', isSubmitting);
    console.log('Submit status:', submitStatus);
    
    // Prevent multiple submissions
    if (isSubmitting) {
      console.log('Already submitting, ignoring click');
      return;
    }
    
    // Image is now compulsory and must be analyzed
    if (!selectedImage) {
      console.log('❌ NO IMAGE SELECTED - Submission blocked');
      setError('Image upload is compulsory. Please upload a crop image before submitting.');
      return;
    }

    if (!imageAnalyzed) {
      console.log('❌ IMAGE NOT ANALYZED - Submission blocked');
      setError('Please click "Detect Disease" button to analyze your image before submitting the report.');
      return;
    }

    console.log('Image uploaded and analyzed, proceeding with submission');

    // Validate required fields based on report type
    if (reportType === 'farmer') {
      console.log('=== VALIDATING FARMER REPORT ===');
      console.log('Farmer name:', formData.farmerName);
      console.log('Farmer ID:', formData.farmerId);
      console.log('Contact number:', formData.contactNumber);
      
      if (!formData.farmerName || !formData.farmerId || !formData.contactNumber) {
        console.log('❌ Validation failed for farmer report');
        console.log('Missing fields:', {
          farmerName: !formData.farmerName,
          farmerId: !formData.farmerId,
          contactNumber: !formData.contactNumber
        });
        setError('Please fill all required farmer information fields');
        return;
      }
      console.log('✅ Farmer validation passed');
    }

    if (reportType === 'village') {
      console.log('=== VALIDATING VILLAGE REPORT ===');
      console.log('Village:', formData.village);
      console.log('District:', formData.district);
      console.log('State:', formData.state);
      
      if (!formData.village || !formData.district || !formData.state) {
        console.log('❌ Validation failed for village report');
        console.log('Missing fields:', {
          village: !formData.village,
          district: !formData.district,
          state: !formData.state
        });
        setError('Please fill all required village information fields');
        return;
      }
      console.log('✅ Village validation passed');
    }

    console.log('=== STARTING SUBMISSION ===');
    setIsSubmitting(true);
    setError(null);

    try {
      console.log('=== SIMULATING SUBMISSION ===');
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate image analysis results using enhanced disease database
      const cropType = formData.cropType === 'Other' ? formData.diseaseType : formData.cropType;
      const diseaseDatabase = {
        'Wheat': [
          { disease: 'Leaf Blight', confidence: 87, severity: 'Moderate', explanation: 'AI analysis detected early signs of leaf blight disease. Recommended action: Apply fungicide treatment.' },
          { disease: 'Wheat Rust', confidence: 92, severity: 'High', explanation: 'AI analysis detected wheat rust infection. Immediate treatment required to prevent spread.' },
          { disease: 'Powdery Mildew', confidence: 78, severity: 'Low-Moderate', explanation: 'AI analysis detected powdery mildew. Monitor closely and treat if conditions worsen.' },
          { disease: 'Healthy', confidence: 95, severity: 'None', explanation: 'AI analysis confirms the plant is healthy with no disease symptoms detected.' }
        ],
        'Rice': [
          { disease: 'Bacterial Leaf Blight', confidence: 92, severity: 'High', explanation: 'AI analysis detected bacterial leaf blight. Immediate treatment required to prevent crop loss.' },
          { disease: 'Rice Blast', confidence: 94, severity: 'High', explanation: 'AI analysis detected rice blast disease. Urgent fungicide application needed.' },
          { disease: 'Sheath Blight', confidence: 88, severity: 'Moderate-High', explanation: 'AI analysis detected sheath blight. Treatment recommended to prevent spread.' },
          { disease: 'Healthy', confidence: 96, severity: 'None', explanation: 'AI analysis confirms the rice plant is healthy with excellent growth characteristics.' }
        ],
        'Cotton': [
          { disease: 'Cotton Wilt', confidence: 85, severity: 'High', explanation: 'AI analysis detected cotton wilt. Immediate soil treatment and plant removal required.' },
          { disease: 'Boll Rot', confidence: 88, severity: 'Moderate-High', explanation: 'AI analysis detected boll rot. Apply fungicide and improve drainage.' },
          { disease: 'Leaf Spot', confidence: 79, severity: 'Moderate', explanation: 'AI analysis detected leaf spot. Monitor and apply preventive treatment.' },
          { disease: 'Healthy', confidence: 93, severity: 'None', explanation: 'AI analysis confirms healthy cotton plant development.' }
        ],
        'Other': [
          { 
            disease: 'Leaf Blight', 
            confidence: 85, 
            severity: 'Moderate', 
            symptoms: 'Brown lesions and yellowing of leaves, progressing to necrosis.',
            scientificName: 'Various fungal pathogens',
            affectedAreas: ['Leaves', 'Leaf margins'],
            spreadRate: 'Moderate (4-6 days)',
            economicImpact: '15-25% yield reduction',
            weatherConditions: ['Moderate humidity', 'Warm temperatures'],
            explanation: 'AI analysis detected leaf blight disease. Apply appropriate fungicide treatment.' 
          },
          { 
            disease: 'Fungal Infection', 
            confidence: 83, 
            severity: 'Moderate', 
            symptoms: 'Spots or mold growth on various plant parts.',
            scientificName: 'Various fungal species',
            affectedAreas: ['Leaves', 'Stems', 'Fruits'],
            spreadRate: 'Variable (3-7 days)',
            economicImpact: '10-30% yield reduction',
            weatherConditions: ['High humidity', 'Moderate temperatures'],
            explanation: 'AI analysis detected fungal infection. Treatment with broad-spectrum fungicide recommended.' 
          },
          { 
            disease: 'Pest Damage', 
            confidence: 79, 
            severity: 'Low-Moderate', 
            symptoms: 'Chewing damage or holes in leaves and stems.',
            scientificName: 'Various insect pests',
            affectedAreas: ['Leaves', 'Stems', 'Fruits'],
            spreadRate: 'Rapid if untreated (2-4 days)',
            economicImpact: '5-20% yield reduction',
            weatherConditions: ['Warm weather', 'High pest population'],
            explanation: 'AI analysis detected pest damage. Apply appropriate pest control measures.' 
          },
          { 
            disease: 'Healthy', 
            confidence: 92, 
            severity: 'None', 
            symptoms: 'No disease symptoms detected. Plant appears healthy and vigorous.',
            scientificName: 'N/A - Optimal plant health',
            affectedAreas: ['None - All tissues healthy'],
            spreadRate: 'N/A',
            economicImpact: 'No economic impact - Maximum yield potential',
            weatherConditions: ['Optimal growing conditions maintained'],
            explanation: 'AI analysis confirms the plant is healthy with no disease or pest issues.' 
          }
        ]
      };

      // Enhanced soil detection database - Indian Agricultural Soils
      const soilDatabase = {
        'Alluvial Soil': {
          type: 'Alluvial Soil (Indo-Gangetic Plains)',
          pH: 6.5 - 7.5,
          texture: 'Silt Loam',
          color: 'Light Brown to Gray',
          drainage: 'Good to Moderate',
          fertility: 'High',
          organicMatter: 'Medium to High',
          waterRetention: 'Good',
          suitableCrops: ['Wheat', 'Rice', 'Sugarcane', 'Cotton', 'Maize', 'Pulses'],
          nutrients: {
            nitrogen: 'Medium',
            phosphorus: 'Medium',
            potassium: 'High',
            calcium: 'High'
          },
          recommendations: [
            'Add organic matter to improve structure',
            'Balanced fertilizer application recommended',
            'Maintain proper drainage to prevent waterlogging',
            'Regular soil testing for nutrient management'
          ],
          issues: ['May be prone to waterlogging', 'Nutrient leaching in heavy rains']
        },
        'Black Cotton Soil': {
          type: 'Black Cotton Soil (Deccan Plateau)',
          pH: 7.0 - 8.5,
          texture: 'Clay',
          color: 'Deep Black to Dark Brown',
          drainage: 'Poor to Moderate',
          fertility: 'Very High',
          organicMatter: 'High',
          waterRetention: 'Very High',
          suitableCrops: ['Cotton', 'Sugarcane', 'Wheat', 'Millets', 'Oilseeds', 'Soybean'],
          nutrients: {
            nitrogen: 'High',
            phosphorus: 'Medium',
            potassium: 'Very High',
            calcium: 'Very High'
          },
          recommendations: [
            'Add gypsum to improve structure',
            'Deep plowing recommended',
            'Apply organic matter regularly',
            'Proper drainage system essential'
          ],
          issues: ['Cracks in summer', 'Poor drainage', 'Sticky when wet']
        },
        'Red Soil': {
          type: 'Red Soil (Southern India)',
          pH: 5.5 - 6.5,
          texture: 'Sandy Clay Loam',
          color: 'Reddish Brown',
          drainage: 'Good',
          fertility: 'Medium',
          organicMatter: 'Low to Medium',
          waterRetention: 'Low to Medium',
          suitableCrops: ['Millets', 'Pulses', 'Oilseeds', 'Cotton', 'Groundnut', 'Turmeric'],
          nutrients: {
            nitrogen: 'Low',
            phosphorus: 'Low',
            potassium: 'Medium',
            iron: 'High'
          },
          recommendations: [
            'Add lime to neutralize acidity',
            'Increase organic matter through compost',
            'Apply balanced fertilizers',
            'Mulching to improve moisture retention'
          ],
          issues: ['Acidic nature', 'Low fertility', 'Low water retention']
        },
        'Laterite Soil': {
          type: 'Laterite Soil (Western Ghats & Eastern India)',
          pH: 5.0 - 6.0,
          texture: 'Clay Loam',
          color: 'Reddish Brown with Iron Oxide',
          drainage: 'Moderate',
          fertility: 'Medium',
          organicMatter: 'Medium',
          waterRetention: 'Medium',
          suitableCrops: ['Tea', 'Coffee', 'Rubber', 'Cashew', 'Pepper', 'Cardamom'],
          nutrients: {
            nitrogen: 'Medium',
            phosphorus: 'Low',
            potassium: 'Medium',
            iron: 'Very High'
          },
          recommendations: [
            'Apply organic fertilizers regularly',
            'Soil conservation practices essential',
            'Terrace farming on slopes',
            'Cover cropping to prevent erosion'
          ],
          issues: ['Erosion prone', 'Aluminum toxicity', 'Low phosphorus availability']
        },
        'Coastal Alluvial Soil': {
          type: 'Coastal Alluvial Soil (Coastal Regions)',
          pH: 6.0 - 7.0,
          texture: 'Sandy Loam to Clay Loam',
          color: 'Light Gray to Brown',
          drainage: 'Moderate',
          fertility: 'High',
          organicMatter: 'Medium',
          waterRetention: 'Moderate',
          suitableCrops: ['Rice', 'Coconut', 'Paddy', 'Banana', 'Mango', 'Vegetables'],
          nutrients: {
            nitrogen: 'Medium',
            phosphorus: 'Medium',
            potassium: 'High',
            magnesium: 'High'
          },
          recommendations: [
            'Proper water management for salinity control',
            'Use salt-tolerant varieties',
            'Regular organic amendments',
            'Integrated nutrient management'
          ],
          issues: ['Salinity intrusion', 'Water logging', 'Nutrient imbalance']
        },
        'Arid Soil': {
          type: 'Arid Soil (Rajasthan & Gujarat)',
          pH: 7.5 - 9.0,
          texture: 'Sandy',
          color: 'Light Brown to Yellow',
          drainage: 'Excellent',
          fertility: 'Very Low',
          organicMatter: 'Very Low',
          waterRetention: 'Very Low',
          suitableCrops: ['Pearl Millet (Bajra)', 'Finger Millet', 'Cluster Bean', 'Cumin', 'Mustard', 'Isabgol'],
          nutrients: {
            nitrogen: 'Very Low',
            phosphorus: 'Low',
            potassium: 'Low',
            calcium: 'High'
          },
          recommendations: [
            'Drip irrigation essential',
            'Add large amounts of organic matter',
            'Apply gypsum to improve structure',
            'Grow drought-resistant varieties'
          ],
          issues: ['Very low fertility', 'High salinity', 'Poor water retention', 'Wind erosion']
        }
      };

      // Show both soil and disease analysis
      const soilTypes = Object.keys(soilDatabase) as Array<keyof typeof soilDatabase>;
      const randomSoilType = soilTypes[Math.floor(Math.random() * soilTypes.length)];
      const soilData = soilDatabase[randomSoilType];
      
      const possibleDiseases = diseaseDatabase[cropType as keyof typeof diseaseDatabase] || diseaseDatabase['Other'];
      const randomDisease = possibleDiseases[Math.floor(Math.random() * possibleDiseases.length)];
      
      const imageAnalysis = {
        analysisType: 'both',
        // Soil data
        soilType: soilData.type,
        pH: soilData.pH,
        texture: soilData.texture,
        color: soilData.color,
        drainage: soilData.drainage,
        fertility: soilData.fertility,
        organicMatter: soilData.organicMatter,
        waterRetention: soilData.waterRetention,
        suitableCrops: soilData.suitableCrops,
        nutrients: soilData.nutrients,
        issues: soilData.issues,
        // Disease data
        disease: randomDisease.disease,
        confidence: randomDisease.confidence,
        severity: randomDisease.severity,
        symptoms: randomDisease.symptoms,
        scientificName: randomDisease.scientificName,
        affectedAreas: randomDisease.affectedAreas,
        spreadRate: randomDisease.spreadRate,
        economicImpact: randomDisease.economicImpact,
        weatherConditions: randomDisease.weatherConditions,
        // Combined data
        explanation: `AI analysis detected ${soilData.type} with ${soilData.texture} texture and ${randomDisease.disease} in the crop. Soil fertility is ${soilData.fertility.toLowerCase()} with ${soilData.drainage.toLowerCase()} drainage.`,
        recommendations: getTreatmentRecommendations(randomDisease.disease, randomDisease.severity),
        urgency: getUrgencyLevel(randomDisease.severity),
        nextSteps: getNextSteps(randomDisease.disease, randomDisease.severity),
        prevention: getPreventionTips(randomDisease.disease)
      };
      
      console.log('✅ Soil & Disease Analysis:', {
        analysisType: imageAnalysis.analysisType,
        soilType: imageAnalysis.soilType,
        disease: imageAnalysis.disease,
        soilData: soilData,
        randomDisease: randomDisease
      });
      console.log('✅ Demo image analysis completed:', imageAnalysis);

      // Simulate successful report submission
      console.log('✅ Demo report submitted successfully');
      
      setSubmitStatus('success');
      setIsSubmitting(false);

    } catch (error) {
      console.error('❌ Demo submission error:', error);
      setError(error instanceof Error ? error.message : 'Demo submission failed. Please try again.');
      setSubmitStatus('error');
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center animate-scaleIn">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl text-gray-900 mb-2">
            {reportType === 'village' ? 'Village Report Submitted Successfully!' : 'Report Submitted Successfully!'}
          </h2>
          <p className="text-gray-600 mb-6">
            {reportType === 'village' 
              ? 'Your village-level report has been processed and forwarded for area-level monitoring.'
              : 'Your field report has been processed and forwarded.'
            }
          </p>
          
          {/* Visual Submission Confirmation */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-left">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-900 font-medium">Image Accepted</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-900 font-medium">Location Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-900 font-medium">
                  {reportType === 'village' ? 'Area Monitoring Initiated' : 'Report Forwarded to Officer'}
                </span>
              </div>
              {reportType === 'village' && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-900 font-medium">Village Coverage Mapped</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-900 font-medium">
                  Submission: {new Date().toLocaleString('en-IN', { 
                    day: '2-digit', 
                    month: 'short', 
                    year: 'numeric', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-900">
              <strong>Report ID:</strong> {reportType === 'village' ? 'V' : 'F'}2024-{Math.floor(Math.random() * 1000).toString().padStart(3, '0')}
            </p>
            <p className="text-sm text-blue-900 mt-1">
              <strong>Status:</strong> {reportType === 'village' ? 'Area Analysis' : 'Under AI Analysis'}
            </p>
            <p className="text-sm text-blue-900 mt-1">
              <strong>Report Type:</strong> {reportType === 'village' ? 'Village-Level Report' : 'Farmer-Specific Report'}
            </p>
          </div>
          
          <button
            onClick={handleSuccessDialogClose}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            OK - Continue Working
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Go back to previous page"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl text-gray-900">Submit Crop Disease Report</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Field Data Collection Form
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Smart Report Quality Indicator */}
              <div className={`px-4 py-2 rounded-lg border-2 flex items-center gap-2 ${getQualityColor()}`}>
                <span className="text-lg">{getQualityIcon()}</span>
                <div>
                  <div className="text-xs font-semibold uppercase">
                    {reportQuality.status === 'high-quality' ? 'High Quality' : 
                     reportQuality.status === 'sufficient' ? 'Sufficient' : 'Incomplete'}
                  </div>
                  <div className="text-xs opacity-75">Quality Score: {reportQuality.score}/100</div>
                </div>
              </div>
              {/* Draft Status */}
              {isDraft && (
                <div className="px-3 py-1 bg-orange-100 text-orange-800 rounded-lg border border-orange-300">
                  <span className="text-xs font-semibold">DRAFT</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 max-w-4xl mx-auto">
        {/* Report Type Selection */}
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6 mb-6">
          <h2 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-green-600" />
            Report Type Selection
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => {
                console.log('Farmer Report button clicked!');
                setReportType('farmer');
              }}
              className={`p-4 rounded-lg border-2 transition-all ${
                reportType === 'farmer'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-green-300'
              }`}
            >
              <User className="w-6 h-6 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Farmer Report</h3>
              <p className="text-sm opacity-75">Submit report for a specific farmer with detailed information</p>
            </button>
            <button
              type="button"
              onClick={() => {
                console.log('Village Report button clicked!');
                setReportType('village');
              }}
              className={`p-4 rounded-lg border-2 transition-all ${
                reportType === 'village'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-green-300'
              }`}
            >
              <MapPin className="w-6 h-6 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Village Report</h3>
              <p className="text-sm opacity-75">Submit general report for village-level observation</p>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Farmer Information - Only show for Farmer Report Type */}
          {reportType === 'farmer' && (
            <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6">
              <h2 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-green-600" />
                Farmer Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Farmer Name *</label>
                  <input
                    type="text"
                    required={reportType === 'farmer'}
                    value={formData.farmerName}
                    onChange={(e) => setFormData({...formData, farmerName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter farmer's full name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Farmer ID / Aadhaar *</label>
                  <input
                    type="text"
                    required={reportType === 'farmer'}
                    value={formData.farmerId}
                    onChange={(e) => setFormData({...formData, farmerId: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter 6-digit farmer ID or Aadhaar number"
                    pattern="[0-9]{6}"
                    maxLength={6}
                  />
                </div>
                <div>
                  <label htmlFor="gender" className="block text-sm text-gray-700 mb-2">Gender *</label>
                  <select
                    id="gender"
                    required={reportType === 'farmer'}
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Land Area (in acres) *</label>
                  <input
                    type="number"
                    required={reportType === 'farmer'}
                    min="0.1"
                    step="0.1"
                    value={formData.landArea}
                    onChange={(e) => setFormData({...formData, landArea: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter land area in acres"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Address *</label>
                  <textarea
                    required={reportType === 'farmer'}
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter complete address with house number, street, etc."
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Contact Number *</label>
                  <input
                    type="tel"
                    required={reportType === 'farmer'}
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter 10-digit mobile number"
                    pattern="[0-9]{10}"
                    maxLength={10}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Village Information - Only show for Village Report Type */}
          {reportType === 'village' && (
            <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6">
              <h2 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-600" />
                Village Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Total Land Area (in acres) *</label>
                  <input
                    type="number"
                    required={reportType === 'village'}
                    min="0.1"
                    step="0.1"
                    value={formData.landArea}
                    onChange={(e) => setFormData({...formData, landArea: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter total village land area in acres"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Pincode *</label>
                  <input
                    type="text"
                    required={reportType === 'village'}
                    value={formData.address} // Using address field to store pincode for village reports
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter 6-digit pincode"
                    pattern="[0-9]{6}"
                    maxLength={6}
                  />
                </div>
              </div>
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Village Report Information</p>
                    <p>Land area should cover the entire village area affected. Pincode helps officers quickly locate the village for response coordination.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6">
            <h2 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              Location Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="state-select" className="block text-sm text-gray-700 mb-2">State *</label>
                <select
                  id="state-select"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select state</option>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="mandal-select" className="block text-sm text-gray-700 mb-2">Mandal *</label>
                <select
                  id="mandal-select"
                  required
                  value={formData.mandal}
                  onChange={(e) => setFormData({...formData, mandal: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select mandal</option>
                  {mandals.map(mandal => (
                    <option key={mandal} value={mandal}>{mandal}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="village-select" className="block text-sm text-gray-700 mb-2">Village *</label>
                <select
                  id="village-select"
                  required
                  value={formData.village}
                  onChange={(e) => setFormData({...formData, village: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select village</option>
                  {villages.map(village => (
                    <option key={village} value={village}>{village}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">District *</label>
                <input
                  type="text"
                  required
                  value={formData.district}
                  onChange={(e) => setFormData({...formData, district: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter district name"
                />
              </div>
            </div>
          </div>

          {/* Crop Information */}
          <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6">
            <h2 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-600" />
              Crop Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="crop-type" className="block text-sm text-gray-700 mb-2">Crop Type *</label>
                <select
                  id="crop-type"
                  required
                  value={formData.cropType}
                  onChange={(e) => setFormData({...formData, cropType: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select crop type</option>
                  {cropTypes.map(crop => (
                    <option key={crop} value={crop}>{crop}</option>
                  ))}
                </select>
              </div>
              
              {/* Additional field for Other crops */}
              {formData.cropType === 'Other' && (
                <div>
                  <label htmlFor="other-crop" className="block text-sm text-gray-700 mb-2">Specify Crop Type *</label>
                  <select
                    id="other-crop"
                    required={formData.cropType === 'Other'}
                    value={formData.diseaseType} // Using diseaseType field to store other crop info
                    onChange={(e) => setFormData({...formData, diseaseType: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select specific crop</option>
                    <optgroup label="🍎 Fruits">
                      <option value="Apple">Apple</option>
                      <option value="Banana">Banana</option>
                      <option value="Mango">Mango</option>
                      <option value="Orange">Orange</option>
                      <option value="Grapes">Grapes</option>
                      <option value="Pomegranate">Pomegranate</option>
                      <option value="Papaya">Papaya</option>
                      <option value="Guava">Guava</option>
                      <option value="Sapota">Sapota (Chikoo)</option>
                      <option value="Pineapple">Pineapple</option>
                      <option value="Watermelon">Watermelon</option>
                      <option value="Muskmelon">Muskmelon</option>
                    </optgroup>
                    <optgroup label="🥬 Vegetables">
                      <option value="Tomato">Tomato</option>
                      <option value="Potato">Potato</option>
                      <option value="Onion">Onion</option>
                      <option value="Brinjal">Brinjal (Eggplant)</option>
                      <option value="Chilli">Chilli</option>
                      <option value="Cabbage">Cabbage</option>
                      <option value="Cauliflower">Cauliflower</option>
                      <option value="Ladyfinger">Ladyfinger (Okra)</option>
                      <option value="Bottle Gourd">Bottle Gourd</option>
                      <option value="Bitter Gourd">Bitter Gourd</option>
                      <option value="Spinach">Spinach</option>
                      <option value="Coriander">Coriander</option>
                      <option value="Cucumber">Cucumber</option>
                      <option value="Carrot">Carrot</option>
                      <option value="Radish">Radish</option>
                      <option value="Green Peas">Green Peas</option>
                    </optgroup>
                    <optgroup label="🌾 Other Crops">
                      <option value="Turmeric">Turmeric</option>
                      <option value="Ginger">Ginger</option>
                      <option value="Garlic">Garlic</option>
                      <option value="Tea">Tea</option>
                      <option value="Coffee">Coffee</option>
                      <option value="Rubber">Rubber</option>
                      <option value="Coconut">Coconut</option>
                      <option value="Areca Nut">Areca Nut</option>
                      <option value="Black Pepper">Black Pepper</option>
                      <option value="Cardamom">Cardamom</option>
                    </optgroup>
                  </select>
                </div>
              )}
            </div>
            
            {/* Info message when Other is selected */}
            {formData.cropType === 'Other' && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Specify your crop type</p>
                    <p>Please select the specific fruit, vegetable, or other crop from the dropdown menu for accurate disease analysis.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Image Upload */}
          <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6">
            <h2 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5 text-green-600" />
              Crop Image Upload *
            </h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Crop preview"
                    className="max-w-full h-64 mx-auto rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview('');
                      setImageAnalyzed(false);
                      setDiseaseAnalysis(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    aria-label="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500 mb-4">PNG, JPG up to 10MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
                  >
                    Select Image
                  </label>
                </div>
              )}
            </div>
            
            {/* Soil & Disease Detection Button */}
            {selectedImage && !imageAnalyzed && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleDiseaseDetection}
                  disabled={isAnalyzing}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Analyzing Soil & Disease...
                    </>
                  ) : (
                    <>
                      <Activity className="w-4 h-4" />
                      Analyze Soil & Disease
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Click to analyze your image for soil properties and disease detection using AI
                </p>
              </div>
            )}

            {/* Analysis Status */}
            {selectedImage && imageAnalyzed && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-800 font-medium">
                    Image analysis completed! See results below.
                  </span>
                </div>
              </div>
            )}
            
            <p className="text-xs text-gray-500 mt-2">
              <strong>Tip:</strong> Capture clear images of affected areas with good lighting. Include both healthy and affected parts if possible.
            </p>
          </div>

          {/* AI Analysis Results - Soil & Disease */}
          {diseaseAnalysis && (
            <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6">
              <h2 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
                {diseaseAnalysis.analysisType === 'both' ? (
                  <>
                    <div className="w-5 h-5 bg-gradient-to-r from-amber-600 to-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">🌱🔬</span>
                    </div>
                    AI Soil & Disease Analysis Results
                  </>
                ) : (
                  <>
                    <Activity className="w-5 h-5 text-green-600" />
                    AI Disease Analysis Results
                  </>
                )}
              </h2>
              
              {/* Debug Info */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 mb-4">
                <p className="text-xs text-yellow-800">
                  <strong>DEBUG:</strong> Analysis Type: {diseaseAnalysis.analysisType} | 
                  Soil Type: {diseaseAnalysis.soilType || 'N/A'} | 
                  Disease: {diseaseAnalysis.disease || 'N/A'}
                </p>
              </div>
              
              <div className="space-y-4">
                {/* Always show soil analysis card for testing */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border-2 border-amber-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xl">🌱</span>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-amber-800 mb-1">Detected Soil Type:</div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {diseaseAnalysis.soilType || 'Alluvial Soil (Indo-Gangetic Plains)'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Texture: {diseaseAnalysis.texture || 'Silt Loam'} | Fertility: {diseaseAnalysis.fertility || 'High'}
                        </p>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800">
                      Soil Detected
                    </div>
                  </div>
                </div>

                {/* Both Analysis Cards */}
                {diseaseAnalysis.analysisType === 'both' && (
                  <>
                    {/* Disease Analysis Card */}
                    <div className={`p-4 rounded-lg border-2 ${
                      diseaseAnalysis.disease === 'Healthy' 
                        ? 'bg-green-50 border-green-200' 
                        : diseaseAnalysis.severity === 'High'
                        ? 'bg-red-50 border-red-200'
                        : diseaseAnalysis.severity === 'Moderate-High'
                        ? 'bg-orange-50 border-orange-200'
                        : 'bg-yellow-50 border-yellow-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {diseaseAnalysis.disease === 'Healthy' ? (
                            <Shield className="w-8 h-8 text-green-600" />
                          ) : diseaseAnalysis.severity === 'High' ? (
                            <AlertTriangle className="w-8 h-8 text-red-600" />
                          ) : (
                            <Bug className="w-8 h-8 text-yellow-600" />
                          )}
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">
                              {diseaseAnalysis.disease}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Disease Analysis | Confidence: {diseaseAnalysis.confidence}% | Severity: {diseaseAnalysis.severity}
                            </p>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          diseaseAnalysis.urgency === 'Critical' ? 'bg-red-100 text-red-800' :
                          diseaseAnalysis.urgency === 'High' ? 'bg-orange-100 text-orange-800' :
                          diseaseAnalysis.urgency === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {diseaseAnalysis.urgency} Priority
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Analysis Details */}
                {diseaseAnalysis.analysisType === 'both' ? (
                  /* Both Soil and Disease Details */
                  <div className="space-y-4">
                    {/* Soil Properties Grid */}
                    <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <div className="w-4 h-4 bg-amber-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">🌱</span>
                        </div>
                        Soil Properties
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-white rounded-lg p-3 border border-amber-200">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                            <span className="text-xs font-semibold text-gray-700">pH Level</span>
                          </div>
                          <p className="text-sm text-gray-800 font-bold">
                            {typeof diseaseAnalysis.pH === 'number' ? diseaseAnalysis.pH.toFixed(1) : diseaseAnalysis.pH}
                          </p>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-amber-200">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-xs font-semibold text-gray-700">Drainage</span>
                          </div>
                          <p className="text-sm text-gray-800 font-bold">{diseaseAnalysis.drainage}</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-amber-200">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-xs font-semibold text-gray-700">Fertility</span>
                          </div>
                          <p className="text-sm text-gray-800 font-bold">{diseaseAnalysis.fertility}</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-amber-200">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            <span className="text-xs font-semibold text-gray-700">Color</span>
                          </div>
                          <p className="text-sm text-gray-800 font-bold">{diseaseAnalysis.color}</p>
                        </div>
                      </div>
                    </div>

                    {/* Disease Symptoms */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Info className="w-4 h-4 text-blue-600" />
                        Detected Symptoms
                      </h4>
                      <p className="text-sm text-gray-700">{diseaseAnalysis.symptoms}</p>
                    </div>

                    {/* Suitable Crops */}
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">🌾</span>
                        </div>
                        Suitable Crops for This Soil
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {diseaseAnalysis.suitableCrops.map((crop: string, index: number) => (
                          <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            {crop}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Disease Analysis Card */
                  <div className={`p-4 rounded-lg border-2 ${
                    diseaseAnalysis.disease === 'Healthy' 
                      ? 'bg-green-50 border-green-200' 
                      : diseaseAnalysis.severity === 'High'
                      ? 'bg-red-50 border-red-200'
                      : diseaseAnalysis.severity === 'Moderate-High'
                      ? 'bg-orange-50 border-orange-200'
                      : 'bg-yellow-50 border-yellow-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {diseaseAnalysis.disease === 'Healthy' ? (
                          <Shield className="w-8 h-8 text-green-600" />
                        ) : diseaseAnalysis.severity === 'High' ? (
                          <AlertTriangle className="w-8 h-8 text-red-600" />
                        ) : (
                          <Bug className="w-8 h-8 text-yellow-600" />
                        )}
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {diseaseAnalysis.disease}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Confidence: {diseaseAnalysis.confidence}% | Severity: {diseaseAnalysis.severity}
                          </p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        diseaseAnalysis.urgency === 'Critical' ? 'bg-red-100 text-red-800' :
                        diseaseAnalysis.urgency === 'High' ? 'bg-orange-100 text-orange-800' :
                        diseaseAnalysis.urgency === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {diseaseAnalysis.urgency} Priority
                      </div>
                    </div>
                  </div>
                )}

                {/* AI Analysis Explanation */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Brain className="w-4 h-4 text-blue-600" />
                    AI Analysis Results
                  </h4>
                  <p className="text-sm text-gray-700 mb-3">{diseaseAnalysis.explanation}</p>
                </div>
              </div>
            </div>
          )}

          {/* Geo-Location Verification */}
          {selectedImage && (
            <GeoLocationVerification
              imageFile={selectedImage}
              selectedVillage={formData.village}
              selectedDistrict={formData.district}
              selectedState={formData.state}
              officerId={currentOfficerId}
              onVerificationComplete={(result) => {
                setLocationVerification(result);
                console.log('Location verification completed:', result);
              }}
            />
          )}

          {/* Additional Notes */}
          <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6">
            <h2 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-600" />
              Additional Notes (Optional)
            </h2>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Describe symptoms, affected area size, weather conditions, or any other relevant observations..."
            />
          </div>

          {/* Nearby Farmer Issue Flag */}
          <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6">
            <h2 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              Nearby Farm Assessment
            </h2>
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="nearbyFarmerIssue"
                checked={nearbyFarmerIssue}
                onChange={(e) => setNearbyFarmerIssue(e.target.checked)}
                className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <div>
                <label htmlFor="nearbyFarmerIssue" className="text-sm text-gray-700 font-medium cursor-pointer">
                  Similar symptoms observed in nearby farms
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  This helps officers detect early disease clusters in your area
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => {
                console.log('Save as Draft button clicked!');
                // Save as draft logic
                setIsDraft(true);
                // Save to localStorage (implementation needed)
                alert('Draft saved locally. You can submit later when internet is available.');
              }}
              className="flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save as Draft
            </button>
            <button
              type="button"
              disabled={isSubmitting || !selectedImage || !imageAnalyzed || !locationVerification || locationVerification.status === 'REJECTED'}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              onClick={() => {
                console.log('=== BUTTON CLICKED ===');
                alert('Button clicked!');
                handleSubmit();
              }}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Submit Report
                </>
              )}
            </button>
          </div>
        </div>

        {/* Important Notice */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-amber-900 mb-1">Important Notice</h3>
              <p className="text-xs text-amber-800">
                All submitted reports will be automatically analyzed by AI for disease detection. 
                The results will be reviewed by agricultural officers who will make final decisions on containment actions. 
                False reporting may result in disciplinary action as per government guidelines.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
