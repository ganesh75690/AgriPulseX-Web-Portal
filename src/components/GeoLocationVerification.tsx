import React, { useState, useEffect } from 'react';
import { MapPin, Camera, Clock, Shield, AlertTriangle, CheckCircle2, X, Download, FileText, AlertCircle, Smartphone, Image as ImageIcon } from 'lucide-react';

interface VillageData {
  name: string;
  district: string;
  state: string;
  centerLat: number;
  centerLng: number;
  radius: number; // meters
}

interface ImageMetadata {
  gpsLatitude?: number;
  gpsLongitude?: number;
  dateTimeOriginal?: Date;
  deviceModel?: string;
  hasGPS: boolean;
}

interface VerificationResult {
  status: 'VERIFIED' | 'REVIEW_REQUIRED' | 'REJECTED' | 'ERROR';
  distance?: number;
  trustScore?: number;
  message: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  timeDifference?: string;
  deviceAuthenticity?: string;
}

interface GeoLocationVerificationProps {
  imageFile: File;
  selectedVillage: string;
  selectedDistrict: string;
  selectedState: string;
  officerId: string;
  onVerificationComplete: (result: VerificationResult) => void;
}

// Sample village dataset (in real app, this would come from backend)
const VILLAGE_DATASET: VillageData[] = [
  {
    name: 'Rajapur',
    district: 'Yavatmal',
    state: 'Maharashtra',
    centerLat: 20.3891,
    centerLng: 78.1307,
    radius: 1500
  },
  {
    name: 'Chandrapur',
    district: 'Chandrapur',
    state: 'Maharashtra',
    centerLat: 19.9615,
    centerLng: 79.2961,
    radius: 2000
  },
  {
    name: 'Wardha',
    district: 'Wardha',
    state: 'Maharashtra',
    centerLat: 20.7453,
    centerLng: 78.6022,
    radius: 1800
  },
  {
    name: 'Amravati',
    district: 'Amravati',
    state: 'Maharashtra',
    centerLat: 21.1463,
    centerLng: 77.7798,
    radius: 2500
  }
];

export default function GeoLocationVerification({
  imageFile,
  selectedVillage,
  selectedDistrict,
  selectedState,
  officerId,
  onVerificationComplete
}: GeoLocationVerificationProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [imageMetadata, setImageMetadata] = useState<ImageMetadata | null>(null);
  const [showDetailedReport, setShowDetailedReport] = useState(false);

  // Haversine formula to calculate distance between two GPS coordinates
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in meters
  };

  // Convert DMS to Decimal Degrees
  const convertDMSToDecimal = (dms: any): number => {
    if (typeof dms === 'number') return dms;
    
    if (dms && typeof dms === 'object') {
      let degrees = dms.degrees || 0;
      let minutes = dms.minutes || 0;
      let seconds = dms.seconds || 0;
      
      if (typeof minutes === 'object') {
        minutes = minutes.numerator / minutes.denominator;
      }
      if (typeof seconds === 'object') {
        seconds = seconds.numerator / seconds.denominator;
      }
      
      return degrees + minutes/60 + seconds/3600;
    }
    
    return 0;
  };

  // Extract EXIF metadata from image (DEMO MODE)
  const extractImageMetadata = async (file: File): Promise<ImageMetadata> => {
    // Simulate processing delay for realistic UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Demo device profiles with realistic data
    const deviceProfiles = [
      {
        hasGPS: true,
        gpsLatitude: 20.3891 + (Math.random() - 0.5) * 0.01, // Around Rajapur
        gpsLongitude: 78.1307 + (Math.random() - 0.5) * 0.01,
        dateTimeOriginal: new Date(Date.now() - Math.random() * 12 * 60 * 60 * 1000), // Within 12 hours
        deviceModel: ['Samsung Galaxy S21', 'iPhone 13', 'Redmi Note 10', 'OnePlus 9'][Math.floor(Math.random() * 4)]
      },
      {
        hasGPS: true,
        gpsLatitude: 19.9615 + (Math.random() - 0.5) * 0.01, // Around Chandrapur
        gpsLongitude: 79.2961 + (Math.random() - 0.5) * 0.01,
        dateTimeOriginal: new Date(Date.now() - Math.random() * 8 * 60 * 60 * 1000), // Within 8 hours
        deviceModel: ['iPhone 12', 'Samsung A52', 'Realme 8', 'Vivo V21'][Math.floor(Math.random() * 4)]
      },
      {
        hasGPS: true,
        gpsLatitude: 20.7453 + (Math.random() - 0.5) * 0.01, // Around Wardha
        gpsLongitude: 78.6022 + (Math.random() - 0.5) * 0.01,
        dateTimeOriginal: new Date(Date.now() - Math.random() * 6 * 60 * 60 * 1000), // Within 6 hours
        deviceModel: ['Motorola G40', 'Oppo A74', 'Poco X3', 'Nokia 5.4'][Math.floor(Math.random() * 4)]
      },
      {
        hasGPS: false, // 10% chance of no GPS for demo
        dateTimeOriginal: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        deviceModel: ['Unknown Device', 'Basic Phone'][Math.floor(Math.random() * 2)]
      }
    ];

    // 90% chance of having GPS data
    const selectedProfile = Math.random() < 0.9 
      ? deviceProfiles[Math.floor(Math.random() * 3)] // First 3 have GPS
      : deviceProfiles[3]; // No GPS profile

    return {
      hasGPS: selectedProfile.hasGPS,
      gpsLatitude: selectedProfile.gpsLatitude,
      gpsLongitude: selectedProfile.gpsLongitude,
      dateTimeOriginal: selectedProfile.dateTimeOriginal,
      deviceModel: selectedProfile.deviceModel
    };
  };

  // Check device authenticity
  const checkDeviceAuthenticity = (metadata: ImageMetadata): { score: number; status: string } => {
    let score = 100;
    let status = 'Authentic Device';
    
    // Check for common signs of manipulation
    if (!metadata.deviceModel) {
      score -= 30;
      status = 'Device Unknown';
    }
    
    if (!metadata.hasGPS) {
      score -= 50;
      status = 'GPS Disabled';
    }
    
    // In real implementation, you would check for:
    // - EXIF manipulation
    // - Screenshot detection
    // - Image editing software signatures
    // - Downloaded image markers
    
    return { score, status };
  };

  // Calculate time difference
  const calculateTimeDifference = (captureTime: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - captureTime.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 24) {
      return `${Math.floor(diffHours / 24)} days ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m ago`;
    } else {
      return `${diffMinutes} minutes ago`;
    }
  };

  // Calculate image quality score
  const calculateImageQuality = (file: File): number => {
    let score = 100;
    
    // Check file size (should be reasonable for smartphone photos)
    if (file.size < 50000) { // Less than 50KB
      score -= 30;
    } else if (file.size > 10000000) { // More than 10MB
      score -= 20;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      score -= 50;
    }
    
    return Math.max(0, score);
  };

  // Main verification function (DEMO MODE)
  const performVerification = async () => {
    setIsVerifying(true);
    
    try {
      // Step 1: Extract image metadata (DEMO)
      const metadata = await extractImageMetadata(imageFile);
      setImageMetadata(metadata);
      
      // Check if GPS data is available
      if (!metadata.hasGPS || !metadata.gpsLatitude || !metadata.gpsLongitude) {
        setVerificationResult({
          status: 'REJECTED',
          message: 'Location data not found. Please enable GPS and retake photo.',
          trustScore: 0
        });
        onVerificationComplete({
          status: 'REJECTED',
          message: 'Location data not found. Please enable GPS and retake photo.',
          trustScore: 0
        });
        return;
      }
      
      // Step 2: Find village data (DEMO - use sample data)
      const villageData = VILLAGE_DATASET.find(
        v => v.name === selectedVillage && 
             v.district === selectedDistrict && 
             v.state === selectedState
      );
      
      // If no exact match, use the first village as demo fallback
      const demoVillageData = villageData || VILLAGE_DATASET[0];
      
      // Step 3: Calculate distance (DEMO - realistic simulation)
      const baseDistance = calculateDistance(
        metadata.gpsLatitude,
        metadata.gpsLongitude,
        demoVillageData.centerLat,
        demoVillageData.centerLng
      );
      
      // Demo: 70% chance of being within village, 20% nearby, 10% far away
      let finalDistance = baseDistance;
      const randomFactor = Math.random();
      
      if (randomFactor < 0.7) {
        // Within village (70% chance)
        finalDistance = Math.random() * 100; // 0-100 meters
      } else if (randomFactor < 0.9) {
        // Nearby (20% chance)
        finalDistance = 100 + Math.random() * 400; // 100-500 meters
      } else {
        // Far away (10% chance)
        finalDistance = 500 + Math.random() * 1000; // 500-1500 meters
      }
      
      // Step 4: Time validation
      const timeDifference = metadata.dateTimeOriginal 
        ? calculateTimeDifference(metadata.dateTimeOriginal)
        : 'Unknown';
      
      const isTimeValid = metadata.dateTimeOriginal 
        ? (Date.now() - metadata.dateTimeOriginal.getTime()) < 24 * 60 * 60 * 1000 // Within 24 hours
        : false;
      
      // Step 5: Device authenticity check (DEMO)
      const deviceCheck = checkDeviceAuthenticity(metadata);
      
      // Step 6: Image quality check (DEMO)
      const imageQuality = calculateImageQuality(imageFile);
      
      // Step 7: Calculate trust score (DEMO - realistic scoring)
      const gpsScore = finalDistance <= 100 ? 40 : finalDistance <= 500 ? 25 : 10;
      const timeScore = isTimeValid ? 30 : 15;
      const deviceScore = deviceCheck.score * 0.2; // 20% weight
      const qualityScore = imageQuality * 0.1; // 10% weight
      
      const totalTrustScore = Math.round(gpsScore + timeScore + deviceScore + qualityScore);
      
      // Step 8: Determine verification status (DEMO)
      let status: 'VERIFIED' | 'REVIEW_REQUIRED' | 'REJECTED';
      let message: string;
      
      if (finalDistance <= 100 && isTimeValid && totalTrustScore >= 70) {
        status = 'VERIFIED';
        message = '✅ Image location verified successfully - GPS matches village coordinates';
      } else if (finalDistance <= 500 && isTimeValid && totalTrustScore >= 50) {
        status = 'REVIEW_REQUIRED';
        message = '⚠️ Location requires manual review - GPS near village boundary';
      } else {
        status = 'REJECTED';
        message = finalDistance > 500 
          ? '❌ Uploaded image does not belong to selected village location.'
          : '❌ Image verification failed - multiple validation errors detected.';
      }
      
      const result: VerificationResult = {
        status,
        distance: finalDistance,
        trustScore: totalTrustScore,
        message,
        coordinates: {
          lat: metadata.gpsLatitude,
          lng: metadata.gpsLongitude
        },
        timeDifference,
        deviceAuthenticity: deviceCheck.status
      };
      
      setVerificationResult(result);
      onVerificationComplete(result);
      
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationResult({
        status: 'ERROR',
        message: 'Verification failed. Please try again.',
        trustScore: 0
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // Generate verification report
  const generateReport = () => {
    if (!verificationResult || !imageMetadata) return '';
    
    const villageData = VILLAGE_DATASET.find(
      v => v.name === selectedVillage && 
           v.district === selectedDistrict && 
           v.state === selectedState
    );
    
    return `
GEO-TAGGED LOCATION VERIFICATION REPORT
========================================

OFFICER DETAILS
---------------
Officer ID: ${officerId}
Verification Date: ${new Date().toLocaleString('en-IN')}

IMAGE DETAILS
-------------
File Name: ${imageFile.name}
File Size: ${(imageFile.size / 1024 / 1024).toFixed(2)} MB
Capture Device: ${imageMetadata.deviceModel || 'Unknown'}
Capture Time: ${imageMetadata.dateTimeOriginal?.toLocaleString('en-IN') || 'Unknown'}

LOCATION VERIFICATION
--------------------
Village: ${selectedVillage}
District: ${selectedDistrict}
State: ${selectedState}

Geo-Coordinates:
Latitude: ${verificationResult.coordinates?.lat.toFixed(6)}° N
Longitude: ${verificationResult.coordinates?.lng.toFixed(6)}° E

Distance from Village Center: ${verificationResult.distance?.toFixed(2)} meters
Village Boundary Radius: ${villageData?.radius || 0} meters

VALIDATION RESULTS
------------------
GPS Match: ${verificationResult.distance ? (verificationResult.distance <= 100 ? '✅ Verified' : verificationResult.distance <= 500 ? '⚠️ Review Required' : '❌ Mismatch') : '❌ Failed'}
Time Verification: ${verificationResult.timeDifference} (${verificationResult.timeDifference?.includes('hour') || verificationResult.timeDifference?.includes('minute') ? '✅ Valid' : '⚠️ Old'})
Device Authenticity: ${verificationResult.deviceAuthenticity}

EVIDENCE TRUST SCORE: ${verificationResult.trustScore}%
- GPS Accuracy: ${verificationResult.distance ? (verificationResult.distance <= 100 ? '40/40' : verificationResult.distance <= 500 ? '25/40' : '10/40') : '0/40'}
- Time Validity: ${verificationResult.timeDifference?.includes('hour') || verificationResult.timeDifference?.includes('minute') ? '30/30' : '15/30'}
- Device Authenticity: ${Math.round((imageMetadata.deviceModel ? 100 : 70) * 0.2)}/20
- Image Quality: ${Math.round(calculateImageQuality(imageFile) * 0.1)}/10

FINAL STATUS: ${verificationResult.status}
${verificationResult.status === 'VERIFIED' ? '✅ Image verified and location confirmed' : 
  verificationResult.status === 'REVIEW_REQUIRED' ? '⚠️ Manual review recommended' : 
  '❌ Verification failed'}

MAP REFERENCE
-------------
Verified within ${verificationResult.distance ? (verificationResult.distance <= villageData?.radius! ? 'village boundary' : 'outside village boundary') : 'unknown location'}

AUDIT TRAIL
-----------
Verification ID: VER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}
System Generated: ${new Date().toISOString()}
IP Address: [System Recorded]
Device Fingerprint: [System Recorded]

============================
This is an electronically generated report.
No signature required.
    `.trim();
  };

  const downloadReport = () => {
    const report = generateReport();
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `geo-verification-${selectedVillage}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (imageFile) {
      performVerification();
    }
  }, [imageFile]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED': return 'bg-green-100 text-green-800 border-green-200';
      case 'REVIEW_REQUIRED': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
      case 'ERROR': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VERIFIED': return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'REVIEW_REQUIRED': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'REJECTED': return <X className="w-5 h-5 text-red-600" />;
      case 'ERROR': return <AlertTriangle className="w-5 h-5 text-gray-600" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  if (isVerifying) {
    return (
      <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Verifying Location...</h3>
            <p className="text-sm text-gray-600">Analyzing GPS coordinates and validating authenticity</p>
          </div>
        </div>
      </div>
    );
  }

  if (!verificationResult) {
    return (
      <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6">
        <div className="text-center py-8">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Location Verification</h3>
          <p className="text-sm text-gray-600">Upload an image to verify its geo-location</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-600" />
          Geo-Location Verification
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">DEMO MODE</span>
        </h2>
        <div className={`px-3 py-1 rounded-full text-sm font-semibold border flex items-center gap-2 ${getStatusColor(verificationResult.status)}`}>
          {getStatusIcon(verificationResult.status)}
          {verificationResult.status}
        </div>
      </div>

      {/* Verification Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            Location Details
          </h4>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Village:</span> {selectedVillage}</p>
            <p><span className="font-medium">District:</span> {selectedDistrict}, {selectedState}</p>
            {verificationResult.coordinates && (
              <>
                <p><span className="font-medium">Latitude:</span> {verificationResult.coordinates.lat.toFixed(6)}° N</p>
                <p><span className="font-medium">Longitude:</span> {verificationResult.coordinates.lng.toFixed(6)}° E</p>
              </>
            )}
            {verificationResult.distance && (
              <p><span className="font-medium">Distance:</span> {verificationResult.distance.toFixed(2)}m from center</p>
            )}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Camera className="w-4 h-4 text-blue-600" />
            Image Details
          </h4>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Device:</span> {imageMetadata?.deviceModel || 'Unknown'}</p>
            <p><span className="font-medium">Capture Time:</span> {verificationResult.timeDifference || 'Unknown'}</p>
            <p><span className="font-medium">File Size:</span> {(imageFile.size / 1024 / 1024).toFixed(2)} MB</p>
            <p><span className="font-medium">GPS Data:</span> {imageMetadata?.hasGPS ? '✅ Available' : '❌ Missing'}</p>
          </div>
        </div>
      </div>

      {/* Trust Score */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-gray-900">Evidence Trust Score</h4>
          <span className="text-2xl font-bold text-blue-600">{verificationResult.trustScore || 0}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${verificationResult.trustScore || 0}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {(verificationResult.trustScore || 0) >= 70 ? 'High confidence in location authenticity' :
           (verificationResult.trustScore || 0) >= 50 ? 'Moderate confidence - manual review recommended' :
           'Low confidence - verification failed'}
        </p>
      </div>

      {/* Status Message */}
      <div className={`rounded-lg p-4 mb-6 ${
        verificationResult.status === 'VERIFIED' ? 'bg-green-50 border border-green-200' :
        verificationResult.status === 'REVIEW_REQUIRED' ? 'bg-yellow-50 border border-yellow-200' :
        'bg-red-50 border border-red-200'
      }`}>
        <div className="flex items-start gap-3">
          {getStatusIcon(verificationResult.status)}
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Verification Status</h4>
            <p className="text-sm text-gray-700">{verificationResult.message}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowDetailedReport(!showDetailedReport)}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <FileText className="w-4 h-4" />
          {showDetailedReport ? 'Hide' : 'Show'} Detailed Report
        </button>
        
        <button
          onClick={downloadReport}
          className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download Report
        </button>
      </div>

      {/* Detailed Report */}
      {showDetailedReport && (
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Detailed Verification Report</h4>
          <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono bg-white p-3 rounded border">
            {generateReport()}
          </pre>
        </div>
      )}
    </div>
  );
}
