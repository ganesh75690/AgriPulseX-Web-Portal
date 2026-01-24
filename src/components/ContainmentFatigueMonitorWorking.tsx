import React, { useState, useEffect, useCallback } from 'react';
import { Shield, Search, AlertTriangle, CheckCircle, X, TrendingUp, Activity, Target, BarChart3 } from 'lucide-react';

// Sample village data for demo
interface VillageData {
  name: string;
  score: number;
  level: string;
  emoji: string;
  population: string;
  area: string;
  mainCrop: string;
  households: string;
  lastContainment: string;
  officer: string;
  district: string;
  state: string;
  coordinates: string;
  literacyRate: string;
  avgIncome: string;
  // Contact details
  sarpanchName: string;
  sarpanchPhone: string;
  sarpanchEmail: string;
  agricultureOfficer: string;
  agricultureOfficerPhone: string;
  healthOfficer: string;
  healthOfficerPhone: string;
  panchayatOffice: string;
  panchayatPhone: string;
  emergencyContact: string;
  nearestHospital: string;
  nearestPoliceStation: string;
  bankBranch: string;
  postOffice: string;
}

interface CFMResponse {
  village_name: string;
  assessment_date: string;
  fatigue_metrics: {
    containment_actions_90_days: number;
    total_restriction_days: number;
    days_since_last_action: number;
    reporting_activity_score: number;
    reporting_trend: string;
  };
  fatigue_score: number;
  fatigue_status: {
    level: string;
    color: string;
    emoji: string;
    recommendation: string;
  };
  explainability: {
    primary_factors: string[];
    mitigation_suggestions: string[];
  };
  policy_recommendations: {
    immediate_action: string;
    administrative_note: string;
    compliance_risk: string;
  };
}

const ContainmentFatigueMonitorWorking: React.FC = () => {
  const sampleVillages: VillageData[] = [
    { 
      name: 'Rampur', 
      score: 72, 
      level: 'High', 
      emoji: '🔴',
      population: '12,450',
      area: '45.2 km²',
      mainCrop: 'Wheat',
      households: '2,890',
      lastContainment: '15 days ago',
      officer: 'Rajesh Kumar',
      district: 'Bareilly',
      state: 'Uttar Pradesh',
      coordinates: '28.8°N, 79.4°E',
      literacyRate: '68%',
      avgIncome: '₹45,000/year',
      // Contact details
      sarpanchName: 'Smt. Anita Devi',
      sarpanchPhone: '+91-98765-43210',
      sarpanchEmail: 'sarpanch.rampur@up.gov.in',
      agricultureOfficer: 'Rajesh Kumar',
      agricultureOfficerPhone: '+91-98765-54321',
      healthOfficer: 'Dr. Sunita Sharma',
      healthOfficerPhone: '+91-98765-65432',
      panchayatOffice: 'Rampur Gram Panchayat',
      panchayatPhone: '+91-5819-234567',
      emergencyContact: '108 Ambulance',
      nearestHospital: 'District Hospital Bareilly (12 km)',
      nearestPoliceStation: 'Rampur Thana (2 km)',
      bankBranch: 'SBI Rampur',
      postOffice: 'Rampur PO (Pin: 243001)'
    },
    { 
      name: 'Biharipur', 
      score: 45, 
      level: 'Moderate', 
      emoji: '🟡',
      population: '8,230',
      area: '32.1 km²',
      mainCrop: 'Rice',
      households: '1,950',
      lastContainment: '30 days ago',
      officer: 'Anita Singh',
      district: 'Vaishali',
      state: 'Bihar',
      coordinates: '25.9°N, 85.2°E',
      literacyRate: '62%',
      avgIncome: '₹38,000/year',
      // Contact details
      sarpanchName: 'Shri Ram Singh',
      sarpanchPhone: '+91-98765-76543',
      sarpanchEmail: 'sarpanch.biharipur@bih.gov.in',
      agricultureOfficer: 'Anita Singh',
      agricultureOfficerPhone: '+91-98765-87654',
      healthOfficer: 'Dr. Rajesh Verma',
      healthOfficerPhone: '+91-98765-98765',
      panchayatOffice: 'Biharipur Gram Panchayat',
      panchayatPhone: '+91-6212-345678',
      emergencyContact: '108 Ambulance',
      nearestHospital: 'PHC Hajipur (8 km)',
      nearestPoliceStation: 'Biharipur Chowki (1 km)',
      bankBranch: 'PNB Biharipur',
      postOffice: 'Biharipur PO (Pin: 844502)'
    },
    { 
      name: 'Kheda', 
      score: 28, 
      level: 'Low', 
      emoji: '🟢',
      population: '6,780',
      area: '28.5 km²',
      mainCrop: 'Cotton',
      households: '1,420',
      lastContainment: '60 days ago',
      officer: 'Mahesh Patel',
      district: 'Kheda',
      state: 'Gujarat',
      coordinates: '22.8°N, 72.7°E',
      literacyRate: '74%',
      avgIncome: '₹52,000/year',
      // Contact details
      sarpanchName: 'Shri Mahendra Patel',
      sarpanchPhone: '+91-98765-23456',
      sarpanchEmail: 'sarpanch.kheda@gujarat.gov.in',
      agricultureOfficer: 'Mahesh Patel',
      agricultureOfficerPhone: '+91-98765-34567',
      healthOfficer: 'Dr. Anita Desai',
      healthOfficerPhone: '+91-98765-45678',
      panchayatOffice: 'Kheda Gram Panchayat',
      panchayatPhone: '+91-2694-234567',
      emergencyContact: '108 Ambulance',
      nearestHospital: 'Civil Hospital Kheda (5 km)',
      nearestPoliceStation: 'Kheda Thana (0.5 km)',
      bankBranch: 'BOI Kheda',
      postOffice: 'Kheda PO (Pin: 387110)'
    },
    { 
      name: 'Madhavpur', 
      score: 58, 
      level: 'Moderate', 
      emoji: '🟡',
      population: '9,120',
      area: '38.7 km²',
      mainCrop: 'Sugarcane',
      households: '2,100',
      lastContainment: '22 days ago',
      officer: 'Priya Sharma',
      district: 'Maharajganj',
      state: 'Uttar Pradesh',
      coordinates: '27.1°N, 83.5°E',
      literacyRate: '59%',
      avgIncome: '₹41,000/year',
      // Contact details
      sarpanchName: 'Shri Gopal Singh',
      sarpanchPhone: '+91-98765-56789',
      sarpanchEmail: 'sarpanch.madhavpur@up.gov.in',
      agricultureOfficer: 'Priya Sharma',
      agricultureOfficerPhone: '+91-98765-67890',
      healthOfficer: 'Dr. Meera Singh',
      healthOfficerPhone: '+91-98765-78901',
      panchayatOffice: 'Madhavpur Gram Panchayat',
      panchayatPhone: '+91-5521-345678',
      emergencyContact: '108 Ambulance',
      nearestHospital: 'CHC Maharajganj (12 km)',
      nearestPoliceStation: 'Madhavpur Chowki (2 km)',
      bankBranch: 'SBI Madhavpur',
      postOffice: 'Madhavpur PO (Pin: 273305)'
    },
    { 
      name: 'Shivpuri', 
      score: 81, 
      level: 'High', 
      emoji: '🔴',
      population: '15,670',
      area: '52.3 km²',
      mainCrop: 'Pulses',
      households: '3,450',
      lastContainment: '8 days ago',
      officer: 'Ravi Verma',
      district: 'Shivpuri',
      state: 'Madhya Pradesh',
      coordinates: '25.4°N, 77.4°E',
      literacyRate: '55%',
      avgIncome: '₹35,000/year',
      // Contact details
      sarpanchName: 'Shri Babu Lal',
      sarpanchPhone: '+91-98765-89012',
      sarpanchEmail: 'sarpanch.shivpuri@mp.gov.in',
      agricultureOfficer: 'Ravi Verma',
      agricultureOfficerPhone: '+91-98765-90123',
      healthOfficer: 'Dr. Sunil Sharma',
      healthOfficerPhone: '+91-98765-01234',
      panchayatOffice: 'Shivpuri Gram Panchayat',
      panchayatPhone: '+91-7492-456789',
      emergencyContact: '108 Ambulance',
      nearestHospital: 'District Hospital Shivpuri (8 km)',
      nearestPoliceStation: 'Shivpuri Thana (1 km)',
      bankBranch: 'CBG Shivpuri',
      postOffice: 'Shivpuri PO (Pin: 473551)'
    },
    { 
      name: 'Gokulnagar', 
      score: 34, 
      level: 'Low', 
      emoji: '🟢',
      population: '7,890',
      area: '31.2 km²',
      mainCrop: 'Millets',
      households: '1,680',
      lastContainment: '45 days ago',
      officer: 'Sunita Rao',
      district: 'Raichur',
      state: 'Karnataka',
      coordinates: '16.2°N, 77.3°E',
      literacyRate: '71%',
      avgIncome: '₹48,000/year',
      // Contact details
      sarpanchName: 'Smt. Lakshmi Devi',
      sarpanchPhone: '+91-98765-34567',
      sarpanchEmail: 'sarpanch.gokulnagar@karnataka.gov.in',
      agricultureOfficer: 'Sunita Rao',
      agricultureOfficerPhone: '+91-98765-45678',
      healthOfficer: 'Dr. Ramesh Kumar',
      healthOfficerPhone: '+91-98765-56789',
      panchayatOffice: 'Gokulnagar Gram Panchayat',
      panchayatPhone: '+91-8512-234567',
      emergencyContact: '108 Ambulance',
      nearestHospital: 'PHC Raichur (15 km)',
      nearestPoliceStation: 'Gokulnagar Chowki (1.5 km)',
      bankBranch: 'KGB Gokulnagar',
      postOffice: 'Gokulnagar PO (Pin: 584123)'
    },
    { 
      name: 'Chandpur', 
      score: 67, 
      level: 'Moderate', 
      emoji: '🟡',
      population: '11,230',
      area: '42.8 km²',
      mainCrop: 'Maize',
      households: '2,560',
      lastContainment: '18 days ago',
      officer: 'Amit Kumar',
      district: 'Bulandshahr',
      state: 'Uttar Pradesh',
      coordinates: '28.4°N, 77.8°E',
      literacyRate: '64%',
      avgIncome: '₹43,000/year',
      // Contact details
      sarpanchName: 'Shri Rajendra Singh',
      sarpanchPhone: '+91-98765-67890',
      sarpanchEmail: 'sarpanch.chandpur@up.gov.in',
      agricultureOfficer: 'Amit Kumar',
      agricultureOfficerPhone: '+91-98765-78901',
      healthOfficer: 'Dr. Poonam Singh',
      healthOfficerPhone: '+91-98765-89012',
      panchayatOffice: 'Chandpur Gram Panchayat',
      panchayatPhone: '+91-5713-456789',
      emergencyContact: '108 Ambulance',
      nearestHospital: 'CHC Bulandshahr (10 km)',
      nearestPoliceStation: 'Chandpur Thana (1 km)',
      bankBranch: 'PNB Chandpur',
      postOffice: 'Chandpur PO (Pin: 203203)'
    },
    { 
      name: 'Dhanpuri', 
      score: 23, 
      level: 'Low', 
      emoji: '🟢',
      population: '5,450',
      area: '24.6 km²',
      mainCrop: 'Vegetables',
      households: '1,120',
      lastContainment: '75 days ago',
      officer: 'Geeta Devi',
      district: 'Dhanbad',
      state: 'Jharkhand',
      coordinates: '23.8°N, 86.4°E',
      literacyRate: '69%',
      avgIncome: '₹46,000/year',
      // Contact details
      sarpanchName: 'Shri Mukesh Kumar',
      sarpanchPhone: '+91-98765-90123',
      sarpanchEmail: 'sarpanch.dhanpuri@jharkhand.gov.in',
      agricultureOfficer: 'Geeta Devi',
      agricultureOfficerPhone: '+91-98765-01234',
      healthOfficer: 'Dr. Anita Kumari',
      healthOfficerPhone: '+91-98765-12345',
      panchayatOffice: 'Dhanpuri Gram Panchayat',
      panchayatPhone: '+91-3262-345678',
      emergencyContact: '108 Ambulance',
      nearestHospital: 'PHC Dhanbad (8 km)',
      nearestPoliceStation: 'Dhanpuri Chowki (1 km)',
      bankBranch: 'SBI Dhanpuri',
      postOffice: 'Dhanpuri PO (Pin: 828109)'
    },
    { 
      name: 'Keshavpur', 
      score: 76, 
      level: 'High', 
      emoji: '🔴',
      population: '13,890',
      area: '48.9 km²',
      mainCrop: 'Wheat',
      households: '3,120',
      lastContainment: '12 days ago',
      officer: 'Vikram Singh',
      district: 'Mainpuri',
      state: 'Uttar Pradesh',
      coordinates: '27.2°N, 79.0°E',
      literacyRate: '61%',
      avgIncome: '₹39,000/year',
      // Contact details
      sarpanchName: 'Shri Dharmendra Singh',
      sarpanchPhone: '+91-98765-01234',
      sarpanchEmail: 'sarpanch.keshavpur@up.gov.in',
      agricultureOfficer: 'Vikram Singh',
      agricultureOfficerPhone: '+91-98765-12345',
      healthOfficer: 'Dr. Rajni Singh',
      healthOfficerPhone: '+91-98765-23456',
      panchayatOffice: 'Keshavpur Gram Panchayat',
      panchayatPhone: '+91-5672-456789',
      emergencyContact: '108 Ambulance',
      nearestHospital: 'CHC Mainpuri (15 km)',
      nearestPoliceStation: 'Keshavpur Thana (2 km)',
      bankBranch: 'PNB Keshavpur',
      postOffice: 'Keshavpur PO (Pin: 205263)'
    },
    { 
      name: 'Nandigram', 
      score: 41, 
      level: 'Moderate', 
      emoji: '🟡',
      population: '8,760',
      area: '35.4 km²',
      mainCrop: 'Rice',
      households: '1,890',
      lastContainment: '28 days ago',
      officer: 'Anjali Patel',
      district: 'East Medinipur',
      state: 'West Bengal',
      coordinates: '22.5°N, 88.2°E',
      literacyRate: '67%',
      avgIncome: '₹42,000/year',
      // Contact details
      sarpanchName: 'Shri Gopal Chatterjee',
      sarpanchPhone: '+91-98765-12345',
      sarpanchEmail: 'sarpanch.nandigram@wb.gov.in',
      agricultureOfficer: 'Anjali Patel',
      agricultureOfficerPhone: '+91-98765-23456',
      healthOfficer: 'Dr. Smita Banerjee',
      healthOfficerPhone: '+91-98765-34567',
      panchayatOffice: 'Nandigram Gram Panchayat',
      panchayatPhone: '+91-3474-456789',
      emergencyContact: '108 Ambulance',
      nearestHospital: 'BPHC Nandigram (5 km)',
      nearestPoliceStation: 'Nandigram Thana (1 km)',
      bankBranch: 'UCO Nandigram',
      postOffice: 'Nandigram PO (Pin: 721624)'
    }
  ];

  const [villageName, setVillageName] = useState<string>('Rampur');
  const [cfmData, setCfmData] = useState<CFMResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [displayScore, setDisplayScore] = useState<number>(72);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredVillages, setFilteredVillages] = useState<VillageData[]>([]);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const [reportStatus, setReportStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [reportMessage, setReportMessage] = useState<string>('');
  const [acknowledgeStatus, setAcknowledgeStatus] = useState<'idle' | 'success'>('idle');

  const getVillageData = (village: string) => {
    const sample = sampleVillages.find(v => v.name.toLowerCase() === village.toLowerCase());
    if (sample) {
      return {
        village_name: sample.name,
        assessment_date: new Date().toISOString().split('T')[0],
        fatigue_metrics: {
          containment_actions_90_days: sample.level === 'High' ? 6 : sample.level === 'Moderate' ? 4 : 2,
          total_restriction_days: sample.level === 'High' ? 45 : sample.level === 'Moderate' ? 25 : 15,
          days_since_last_action: sample.level === 'High' ? 8 : sample.level === 'Moderate' ? 20 : 35,
          reporting_activity_score: sample.level === 'High' ? 3 : sample.level === 'Moderate' ? 6 : 8,
          reporting_trend: sample.level === 'High' ? 'decreasing' : 'stable'
        },
        fatigue_score: sample.score,
        fatigue_status: {
          level: sample.level,
          color: sample.level === 'High' ? 'Red' : sample.level === 'Moderate' ? 'Yellow' : 'Green',
          emoji: sample.emoji,
          recommendation: sample.level === 'High' ? 'Avoid strict lockdown' : sample.level === 'Moderate' ? 'Use targeted restrictions' : 'Normal containment acceptable'
        },
        explainability: {
          primary_factors: [
            sample.level === 'High' ? 'High containment frequency' : 'Moderate containment activity',
            sample.level === 'High' ? 'Extended restriction period' : 'Normal restriction period',
            sample.level === 'High' ? 'Recent containment action' : 'Adequate time since last action'
          ],
          mitigation_suggestions: [
            'Use targeted route restrictions instead of area lockdown',
            'Increase community engagement before containment',
            'Provide advance notice to farmers',
            'Offer compensation support during restrictions'
          ]
        },
        policy_recommendations: {
          immediate_action: sample.level === 'High' ? 'Advisory-only approach' : sample.level === 'Moderate' ? 'Partial containment' : 'Standard containment',
          administrative_note: 'Final authority remains with the government officer',
          compliance_risk: sample.level === 'High' ? 'High' : sample.level === 'Moderate' ? 'Medium' : 'Low'
        }
      };
    }
    return null;
  };

  const fetchFatigueData = async (village: string) => {
    setLoading(true);
    setError(null);
    
    // Use demo data
    const demoData = getVillageData(village);
    if (demoData) {
      setCfmData(demoData);
      setDisplayScore(demoData.fatigue_score);
    } else {
      setError('Village not found');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFatigueData(villageName);
  }, [villageName]);

  // Search functionality
  useEffect(() => {
    const filtered = sampleVillages.filter(village =>
      village.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVillages(filtered);
    setShowSearchResults(searchTerm.length > 0);
  }, [searchTerm]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleVillageSelect = (village: string) => {
    setVillageName(village);
    setSearchTerm('');
    setShowSearchResults(false);
    setReportStatus('idle');
  };

  const handleReportToEmployee = async () => {
    if (!cfmData) return;
    
    setReportStatus('sending');
    setReportMessage('');
    
    try {
      // Simulate API call to report to field employees
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create report data
      const reportData = {
        village_name: cfmData.village_name,
        fatigue_score: cfmData.fatigue_score,
        fatigue_level: cfmData.fatigue_status.level,
        assessment_date: cfmData.assessment_date,
        recommendations: cfmData.policy_recommendations.immediate_action,
        compliance_risk: cfmData.policy_recommendations.compliance_risk,
        reported_by: 'System Administrator',
        reported_at: new Date().toISOString()
      };
      
      // Simulate successful report
      console.log('Report sent to field employees:', reportData);
      
      setReportStatus('success');
      setReportMessage(`Successfully reported ${cfmData.village_name} fatigue status to field employees. They will receive the assessment and recommendations.`);
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setReportStatus('idle');
        setReportMessage('');
      }, 5000);
      
    } catch (error) {
      console.error('Error reporting to field employees:', error);
      setReportStatus('error');
      setReportMessage('Failed to send report to field employees. Please try again.');
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setReportStatus('idle');
        setReportMessage('');
      }, 5000);
    }
  };

  const handleAcknowledge = () => {
    // Simple demo - show success message immediately
    setAcknowledgeStatus('success');
    
    // Hide message after 10 seconds (increased from 3 seconds)
    setTimeout(() => {
      setAcknowledgeStatus('idle');
    }, 10000);
  };

  const handleSearchBlur = () => {
    setTimeout(() => setShowSearchResults(false), 200);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading fatigue data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!cfmData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Containment Fatigue Indicator</h1>
              <p className="text-sm text-gray-600">Community compliance risk assessment based on past interventions</p>
            </div>
          </div>
          <div className="w-full h-px bg-gray-200 mt-4"></div>
        </div>

        {/* Search Box at Top */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search villages..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => setShowSearchResults(true)}
              onBlur={handleSearchBlur}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            {/* Search Results Dropdown */}
            {showSearchResults && filteredVillages.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {filteredVillages.map((village) => (
                  <button
                    key={village.name}
                    onClick={() => handleVillageSelect(village.name)}
                    className="w-full px-4 py-4 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <span className="text-lg mt-1">{village.emoji}</span>
                        <div className="text-left">
                          <div className="font-semibold text-gray-900">{village.name}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            {village.level} Fatigue ({village.score}) • {village.district}, {village.state}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {village.population} people • {village.area} • {village.mainCrop}
                          </div>
                          <div className="text-xs text-gray-500">
                            Officer: {village.officer} • Literacy: {village.literacyRate}
                          </div>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        village.level === 'High' ? 'bg-red-100 text-red-800' :
                        village.level === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {village.level}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Village Buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            {sampleVillages.map((village) => (
              <button
                key={village.name}
                onClick={() => setVillageName(village.name)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  villageName === village.name
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {village.emoji} {village.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Central Number Display */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                {/* Large Number Display in Rectangle Box */}
                <div className="mb-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-gray-300 p-8">
                  <div className="text-5xl font-bold text-gray-900 transition-all duration-1000">
                    {Math.round(displayScore)}
                  </div>
                  <div className="text-sm text-gray-600 mt-2">Fatigue Score / 100</div>
                </div>
                
                {/* Report Status Display */}
                {reportStatus !== 'idle' && (
                  <div className={`mt-4 p-4 rounded-lg border ${
                    reportStatus === 'success' ? 'bg-green-50 border-green-200' :
                    reportStatus === 'error' ? 'bg-red-50 border-red-200' :
                    'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="flex items-center space-x-3">
                      {reportStatus === 'sending' && (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      )}
                      {reportStatus === 'success' && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                      {reportStatus === 'error' && (
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      )}
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${
                          reportStatus === 'success' ? 'text-green-900' :
                          reportStatus === 'error' ? 'text-red-900' :
                          'text-blue-900'
                        }`}>
                          {reportStatus === 'sending' && 'Sending report to field employees...'}
                          {reportStatus === 'success' && 'Report sent successfully!'}
                          {reportStatus === 'error' && 'Report failed. Please try again.'}
                        </p>
                        {reportMessage && (
                          <p className={`text-xs mt-1 ${
                            reportStatus === 'success' ? 'text-green-700' :
                            reportStatus === 'error' ? 'text-red-700' :
                            'text-blue-700'
                          }`}>
                            {reportMessage}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Report Button */}
                <button
                  onClick={handleReportToEmployee}
                  disabled={reportStatus === 'sending'}
                  className={`w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                    reportStatus === 'sending'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                  }`}
                >
                  {reportStatus === 'sending' ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Sending Report...</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4" />
                      <span>Report to Field Employees</span>
                    </>
                  )}
                </button>

                {/* Acknowledge Button */}
                <button
                  onClick={handleAcknowledge}
                  className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg transition-all"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Acknowledge Assessment</span>
                </button>

                {/* Acknowledge Success Message */}
                {acknowledgeStatus === 'success' && (
                  <div className="mt-3 p-4 bg-green-500 text-white rounded-lg border-2 border-green-600 shadow-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-white" />
                      <div>
                        <div className="font-bold text-lg">✅ Done!</div>
                        <div className="text-sm">Assessment acknowledged successfully!</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Field Officer Acknowledgment Details */}
                {acknowledgeStatus === 'success' && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-600" />
                      Acknowledgment Sent to Field Officers
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Village:</span>
                        <span className="font-medium text-blue-900">{cfmData.village_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Fatigue Score:</span>
                        <span className="font-medium text-blue-900">{cfmData.fatigue_score}/100</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Risk Level:</span>
                        <span className={`font-medium ${cfmData.fatigue_status.level === 'High' ? 'text-red-900' : cfmData.fatigue_status.level === 'Moderate' ? 'text-yellow-900' : 'text-green-900'}`}>
                          {cfmData.fatigue_status.level}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Recommended Action:</span>
                        <span className="font-medium text-blue-900">{cfmData.policy_recommendations.immediate_action}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Compliance Risk:</span>
                        <span className="font-medium text-blue-900">{cfmData.policy_recommendations.compliance_risk}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Acknowledged By:</span>
                        <span className="font-medium text-blue-900">System Administrator</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Time:</span>
                        <span className="font-medium text-blue-900">{new Date().toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <div className="text-xs text-blue-700">
                        <strong>Message to Officers:</strong> "Please review the fatigue assessment and implement recommended containment strategies. Monitor community compliance closely and report any changes immediately."
                      </div>
                    </div>

                    {/* Containment Methods for Field Officers */}
                    <div className="mt-4 pt-4 border-t border-blue-200">
                      <h5 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-600" />
                        Containment Methods to Implement
                      </h5>
                      <div className="space-y-3">
                        {cfmData.fatigue_status.level === 'High' && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <div className="font-medium text-red-900 mb-2">🔴 High Fatigue - Advisory-Only Approach</div>
                            <ul className="text-xs text-red-800 space-y-1">
                              <li>• <strong>Avoid strict lockdown</strong> - Use advisory-only approach</li>
                              <li>• <strong>Community engagement</strong> - Hold village meetings twice weekly</li>
                              <li>• <strong>Voluntary compliance</strong> - Request cooperation, don't enforce</li>
                              <li>• <strong>Targeted awareness</strong> - Focus on high-risk areas only</li>
                              <li>• <strong>Compensation support</strong> - Provide immediate financial aid</li>
                              <li>• <strong>Route monitoring</strong> - Monitor key supply routes only</li>
                              <li>• <strong>Daily reporting</strong> - Submit compliance reports by 6 PM</li>
                            </ul>
                          </div>
                        )}

                        {cfmData.fatigue_status.level === 'Moderate' && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <div className="font-medium text-yellow-900 mb-2">🟡 Moderate Fatigue - Partial Containment</div>
                            <ul className="text-xs text-yellow-800 space-y-1">
                              <li>• <strong>Route restrictions</strong> - Limit movement on 3 key routes</li>
                              <li>• <strong>Time-bound measures</strong> - Apply restrictions 6 AM - 8 PM only</li>
                              <li>• <strong>Advance notice</strong> - Give 48-hour notice before actions</li>
                              <li>• <strong>Community leaders</strong> - Involve sarpanch in decisions</li>
                              <li>• <strong>Compensation package</strong> - Prepare support for affected families</li>
                              <li>• <strong>Alternative routes</strong> - Provide 2 alternate supply routes</li>
                              <li>• <strong>Bi-daily reporting</strong> - Submit reports morning and evening</li>
                            </ul>
                          </div>
                        )}

                        {cfmData.fatigue_status.level === 'Low' && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="font-medium text-green-900 mb-2">🟢 Low Fatigue - Standard Containment</div>
                            <ul className="text-xs text-green-800 space-y-1">
                              <li>• <strong>Standard protocols</strong> - Apply regular containment measures</li>
                              <li>• <strong>Area restrictions</strong> - Implement 2km containment zone</li>
                              <li>• <strong>Supply chain control</strong> - Monitor all supply routes</li>
                              <li>• <strong>Regular monitoring</strong> - Daily village patrols</li>
                              <li>• <strong>Community cooperation</strong> - Expect good compliance</li>
                              <li>• <strong>Standard reporting</strong> - Submit daily compliance reports</li>
                              <li>• <strong>Preventive measures</strong> - Focus on disease prevention</li>
                            </ul>
                          </div>
                        )}

                        {/* Universal Procedures */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <div className="font-medium text-gray-900 mb-2">📋 Universal Procedures (All Levels)</div>
                          <ul className="text-xs text-gray-700 space-y-1">
                            <li>• <strong>Disease surveillance</strong> - Monitor for new symptoms daily</li>
                            <li>• <strong>Farmer outreach</strong> - Contact 5 farmers daily for updates</li>
                            <li>• <strong>Supply chain tracking</strong> - Log all agricultural movement</li>
                            <li>• <strong>Emergency response</strong> - Maintain 24/7 contact availability</li>
                            <li>• <strong>Data recording</strong> - Update containment logs in real-time</li>
                            <li>• <strong>Coordination</strong> - Work with health and agriculture officers</li>
                          </ul>
                        </div>

                        {/* Contact Protocol */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <div className="font-medium text-blue-900 mb-2">📞 Emergency Contact Protocol</div>
                          <div className="text-xs text-blue-800 space-y-1">
                            <div><strong>Immediate escalation:</strong> Call district officer if compliance drops below 50% - <span className="font-bold text-blue-600">📞 1800-123-4567</span></div>
                            <div><strong>Health emergency:</strong> Contact health officer immediately for disease outbreaks - <span className="font-bold text-blue-600">📞 1800-987-6543</span></div>
                            <div><strong>Supply disruption:</strong> Report to agriculture office for alternative arrangements - <span className="font-bold text-blue-600">📞 1800-555-1234</span></div>
                            <div><strong>Community unrest:</strong> Inform police station and district administration - <span className="font-bold text-blue-600">📞 100 (Police) | 1800-777-8888</span></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Status Badge */}
                <div className={`inline-flex items-center px-4 py-3 rounded-full text-sm font-medium mt-4 ${
                  cfmData.fatigue_status.level === 'High' ? 'bg-red-100 text-red-800' :
                  cfmData.fatigue_status.level === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  <span className="mr-2">{cfmData.fatigue_status.emoji}</span>
                  {cfmData.fatigue_status.level} Community Fatigue
                </div>
                
                {/* Visual Progress Bar */}
                <div className="mt-6">
                  <div className="mb-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Fatigue Level</span>
                      <span>{displayScore.toFixed(1)} / 100</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full transition-all duration-1000 ${
                        displayScore <= 33 ? 'bg-green-500' :
                        displayScore <= 66 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${displayScore}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Low (0-33)</span>
                    <span>Moderate (34-66)</span>
                    <span>High (67-100)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Village Details Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Village Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(() => {
                  const currentVillage = sampleVillages.find(v => v.name === cfmData.village_name);
                  if (!currentVillage) return null;
                  
                  return (
                    <>
                      {/* Basic Information */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">Basic Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Name:</span>
                            <span className="font-medium">{currentVillage.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">District:</span>
                            <span className="font-medium">{currentVillage.district}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">State:</span>
                            <span className="font-medium">{currentVillage.state}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Coordinates:</span>
                            <span className="font-medium">{currentVillage.coordinates}</span>
                          </div>
                        </div>
                      </div>

                      {/* Demographics */}
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-3">Demographics</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-blue-700">Population:</span>
                            <span className="font-medium text-blue-900">{currentVillage.population}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-700">Area:</span>
                            <span className="font-medium text-blue-900">{currentVillage.area}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-700">Households:</span>
                            <span className="font-medium text-blue-900">{currentVillage.households}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-700">Literacy Rate:</span>
                            <span className="font-medium text-blue-900">{currentVillage.literacyRate}</span>
                          </div>
                        </div>
                      </div>

                      {/* Agricultural Information */}
                      <div className="bg-green-50 rounded-lg p-4">
                        <h4 className="font-medium text-green-900 mb-3">Agricultural Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-green-700">Main Crop:</span>
                            <span className="font-medium text-green-900">{currentVillage.mainCrop}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-green-700">Avg Income:</span>
                            <span className="font-medium text-green-900">{currentVillage.avgIncome}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-green-700">Last Containment:</span>
                            <span className="font-medium text-green-900">{currentVillage.lastContainment}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-green-700">Fatigue Level:</span>
                            <span className="font-medium text-green-900">{currentVillage.level}</span>
                          </div>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="bg-purple-50 rounded-lg p-4">
                        <h4 className="font-medium text-purple-900 mb-3">Contact Information</h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-purple-700">Sarpanch:</span>
                            <div className="font-medium text-purple-900">{currentVillage.sarpanchName}</div>
                            <div className="text-purple-600">{currentVillage.sarpanchPhone}</div>
                          </div>
                          <div>
                            <span className="text-purple-700">Agriculture Officer:</span>
                            <div className="font-medium text-purple-900">{currentVillage.agricultureOfficer}</div>
                            <div className="text-purple-600">{currentVillage.agricultureOfficerPhone}</div>
                          </div>
                          <div>
                            <span className="text-purple-700">Health Officer:</span>
                            <div className="font-medium text-purple-900">{currentVillage.healthOfficer}</div>
                            <div className="text-purple-600">{currentVillage.healthOfficerPhone}</div>
                          </div>
                          <div>
                            <span className="text-purple-700">Panchayat Office:</span>
                            <div className="font-medium text-purple-900">{currentVillage.panchayatOffice}</div>
                            <div className="text-purple-600">{currentVillage.panchayatPhone}</div>
                          </div>
                        </div>
                      </div>

                      {/* Emergency Services */}
                      <div className="bg-red-50 rounded-lg p-4">
                        <h4 className="font-medium text-red-900 mb-3">Emergency Services</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-red-700">Emergency:</span>
                            <span className="font-medium text-red-900">{currentVillage.emergencyContact}</span>
                          </div>
                          <div>
                            <span className="text-red-700">Nearest Hospital:</span>
                            <div className="font-medium text-red-900">{currentVillage.nearestHospital}</div>
                          </div>
                          <div>
                            <span className="text-red-700">Police Station:</span>
                            <div className="font-medium text-red-900">{currentVillage.nearestPoliceStation}</div>
                          </div>
                          <div>
                            <span className="text-red-700">Bank Branch:</span>
                            <div className="font-medium text-red-900">{currentVillage.bankBranch}</div>
                          </div>
                          <div>
                            <span className="text-red-700">Post Office:</span>
                            <div className="font-medium text-red-900">{currentVillage.postOffice}</div>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Explanation Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Why fatigue is high</h3>
              <div className={`border-l-4 ${
                cfmData.fatigue_status.level === 'High' ? 'border-red-400 bg-red-50' :
                cfmData.fatigue_status.level === 'Moderate' ? 'border-yellow-400 bg-yellow-50' :
                'border-green-400 bg-green-50'
              } p-4 rounded`}>
                <ul className="space-y-2 text-sm text-gray-700">
                  {cfmData.explainability.primary_factors.map((factor, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-gray-400 mr-2">•</span>
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommendation Panel */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Operational Recommendation</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 mb-2">
                      {cfmData.policy_recommendations.immediate_action}
                    </p>
                    <p className="text-xs text-blue-700">
                      {cfmData.policy_recommendations.administrative_note}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Historical Context Strip */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Historical Context (Past 90 Days)</h3>
              <div className="relative">
                {/* Timeline */}
                <div className="h-2 bg-gray-200 rounded-full mb-4">
                  <div className="h-2 bg-blue-500 rounded-full" style={{ width: '75%' }}></div>
                </div>
                
                {/* Event Markers */}
                <div className="relative h-8">
                  <div className="absolute left-0 top-2 w-3 h-3 bg-red-500 rounded-full border-2 border-white" title="Full lockdown - 75 days ago"></div>
                  <div className="absolute left-1/4 top-2 w-3 h-3 bg-yellow-500 rounded-full border-2 border-white" title="Partial restriction - 45 days ago"></div>
                  <div className="absolute left-1/2 top-2 w-3 h-3 bg-yellow-500 rounded-full border-2 border-white" title="Route restriction - 30 days ago"></div>
                  <div className="absolute left-3/4 top-2 w-3 h-3 bg-red-500 rounded-full border-2 border-white" title="Full lockdown - 15 days ago"></div>
                  <div className="absolute right-0 top-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white" title="No restrictions - 60 days ago"></div>
                </div>
                
                {/* Labels */}
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>90 days ago</span>
                  <span>Today</span>
                </div>
              </div>
            </div>

            {/* Knowledge Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Understanding Containment Fatigue</h3>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">What is Containment Fatigue?</h4>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    Containment fatigue occurs when communities become less cooperative with disease control measures due to repeated restrictions, economic hardship, and disruption of daily life. This psychological phenomenon reduces compliance with containment protocols.
                  </p>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-900 mb-2">Key Indicators</h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Decreased reporting of disease symptoms</li>
                    <li>• Resistance to movement restrictions</li>
                    <li>• Non-compliance with containment protocols</li>
                    <li>• Increased community protests or complaints</li>
                    <li>• Reduced participation in awareness programs</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-2">Best Practices for Management</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Use targeted route restrictions instead of area lockdowns</li>
                    <li>• Provide advance notice and clear communication</li>
                    <li>• Offer compensation support during restrictions</li>
                    <li>• Engage community leaders in decision-making</li>
                    <li>• Rotate containment strategies to reduce monotony</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Government Guidelines</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    The Ministry of Agriculture recommends maintaining fatigue scores below 66 through balanced containment strategies. High fatigue scores (greater than 67) require immediate policy review and community engagement initiatives.
                  </p>
                </div>
              </div>
            </div>

            {/* Regional Statistics Dashboard */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Regional Fatigue Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-red-700 text-sm font-medium">High Fatigue</span>
                    <span className="text-red-500 text-lg">🔴</span>
                  </div>
                  <div className="text-2xl font-bold text-red-900">3</div>
                  <div className="text-xs text-red-600">Villages need immediate attention</div>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-yellow-700 text-sm font-medium">Moderate Fatigue</span>
                    <span className="text-yellow-500 text-lg">🟡</span>
                  </div>
                  <div className="text-2xl font-bold text-yellow-900">4</div>
                  <div className="text-xs text-yellow-600">Villages require monitoring</div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-700 text-sm font-medium">Low Fatigue</span>
                    <span className="text-green-500 text-lg">🟢</span>
                  </div>
                  <div className="text-2xl font-bold text-green-900">3</div>
                  <div className="text-xs text-green-600">Villages stable</div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-700 text-sm font-medium">Avg Score</span>
                    <span className="text-blue-500 text-lg">📊</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-900">52.3</div>
                  <div className="text-xs text-blue-600">Regional average</div>
                </div>
              </div>
              
              {/* District Breakdown */}
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-3">District-wise Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm font-medium">Uttar Pradesh (3 villages)</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">Avg: 68.3</span>
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">High Risk</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm font-medium">Bihar (1 village)</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">Avg: 45.0</span>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Moderate</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">Other States (6 villages)</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">Avg: 42.7</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Low Risk</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trend Analysis */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">30-Day Fatigue Trend</h3>
              <div className="space-y-4">
                <div className="relative h-32 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                  <div className="absolute inset-0 flex items-end justify-between px-4 pb-4">
                    <div className="w-8 bg-green-400 rounded-t" style={{ height: '40%' }} title="Day 1: 41"></div>
                    <div className="w-8 bg-green-400 rounded-t" style={{ height: '45%' }} title="Day 5: 44"></div>
                    <div className="w-8 bg-yellow-400 rounded-t" style={{ height: '55%' }} title="Day 10: 52"></div>
                    <div className="w-8 bg-yellow-400 rounded-t" style={{ height: '60%' }} title="Day 15: 58"></div>
                    <div className="w-8 bg-yellow-400 rounded-t" style={{ height: '65%' }} title="Day 20: 63"></div>
                    <div className="w-8 bg-red-400 rounded-t" style={{ height: '70%' }} title="Day 25: 68"></div>
                    <div className="w-8 bg-red-400 rounded-t" style={{ height: '72%' }} title="Day 30: 72"></div>
                  </div>
                  <div className="absolute top-2 left-4 text-xs text-gray-600">Fatigue Score Trend</div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium text-red-900">Worsening Trend</span>
                    </div>
                    <div className="text-xs text-red-700">Score increased by 31 points in 30 days</div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-900">Critical Threshold</span>
                    </div>
                    <div className="text-xs text-yellow-700">Expected to reach 80 in next 2 weeks</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Activity className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Action Required</span>
                    </div>
                    <div className="text-xs text-blue-700">Immediate intervention recommended</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Predictive Insights */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Predictive Insights & Risk Assessment</h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                  <h4 className="font-medium text-purple-900 mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    Next 30 Days Forecast
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-purple-700 mb-1">Predicted Fatigue Score</div>
                      <div className="text-2xl font-bold text-purple-900">78-85</div>
                      <div className="text-xs text-purple-600">High probability of severe fatigue</div>
                    </div>
                    <div>
                      <div className="text-sm text-purple-700 mb-1">Compliance Risk</div>
                      <div className="text-2xl font-bold text-red-600">87%</div>
                      <div className="text-xs text-purple-600">Likelihood of non-compliance</div>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <h4 className="font-medium text-orange-900 mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-orange-600" />
                    Recommended Interventions
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5"></div>
                      <div>
                        <div className="text-sm font-medium text-orange-900">Community Engagement Program</div>
                        <div className="text-xs text-orange-700">Launch awareness campaign within 7 days</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5"></div>
                      <div>
                        <div className="text-sm font-medium text-orange-900">Compensation Package</div>
                        <div className="text-xs text-orange-700">Prepare financial support for affected households</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5"></div>
                      <div>
                        <div className="text-sm font-medium text-orange-900">Strategy Revision</div>
                        <div className="text-xs text-orange-700">Shift from area lockdown to route restrictions</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
                  <h4 className="font-medium text-teal-900 mb-3 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-teal-600" />
                    Impact Projections
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-teal-900">-42%</div>
                      <div className="text-xs text-teal-700">Expected compliance rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-teal-900">3.2x</div>
                      <div className="text-xs text-teal-700">Disease spread risk increase</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-teal-900">₹28L</div>
                      <div className="text-xs text-teal-700">Potential economic loss</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContainmentFatigueMonitorWorking;
