export interface ImageMetadata {
  hasGPS: boolean;
  gpsLatitude?: number;
  gpsLongitude?: number;
  gpsAltitude?: number;
  dateTimeOriginal?: Date;
  dateTimeDigitized?: Date;
  dateTime?: Date;
  deviceMake?: string;
  deviceModel?: string;
  software?: string;
  imageWidth?: number;
  imageHeight?: number;
  orientation?: number;
  flash?: boolean;
  focalLength?: number;
  iso?: number;
  exposureTime?: string;
  fNumber?: number;
  whiteBalance?: string;
  digitalZoomRatio?: number;
  contrast?: string;
  saturation?: string;
  sharpness?: string;
}

export interface DeviceAuthenticityResult {
  score: number;
  status: string;
  issues: string[];
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

/**
 * EXIF Metadata Extractor for Image Verification
 * 
 * This utility extracts EXIF data from images to verify authenticity,
 * extract GPS coordinates, and validate device information.
 */
export class ExifExtractor {
  /**
   * Extract EXIF metadata from image file
   * Note: In a production environment, you would use libraries like:
   * - exif-js for browser-based extraction
   * - piexifjs for comprehensive EXIF handling
   * - sharp for server-side processing
   */
  static async extractMetadata(file: File): Promise<ImageMetadata> {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          const img = new Image();
          
          img.onload = () => {
            // For demo purposes, we'll simulate realistic metadata
            // In production, use actual EXIF extraction libraries
            const metadata = this.simulateRealisticMetadata(file, img);
            resolve(metadata);
          };
          
          img.onerror = () => {
            reject(new Error('Failed to load image'));
          };
          
          img.src = e.target?.result as string;
        };
        
        reader.onerror = () => {
          reject(new Error('Failed to read file'));
        };
        
        reader.readAsDataURL(file);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Simulate realistic metadata for demonstration
   * Replace with actual EXIF extraction in production
   */
  private static simulateRealisticMetadata(file: File, img: HTMLImageElement): ImageMetadata {
    const now = new Date();
    const captureTime = new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000); // Within 24 hours
    
    // Simulate different device types
    const deviceProfiles = [
      {
        make: 'Apple',
        model: 'iPhone 13',
        software: 'iOS 16.0',
        hasGPS: true,
        gpsAccuracy: 5 // meters
      },
      {
        make: 'Samsung',
        model: 'Galaxy S21',
        software: 'Android 12',
        hasGPS: true,
        gpsAccuracy: 8
      },
      {
        make: 'Xiaomi',
        model: 'Redmi Note 10',
        software: 'Android 11',
        hasGPS: true,
        gpsAccuracy: 10
      },
      {
        make: 'OnePlus',
        model: 'OnePlus 9',
        software: 'Android 12',
        hasGPS: true,
        gpsAccuracy: 6
      }
    ];

    const selectedDevice = deviceProfiles[Math.floor(Math.random() * deviceProfiles.length)];
    
    // Simulate GPS coordinates around Maharashtra villages
    const baseCoordinates = [
      { lat: 20.3891, lng: 78.1307 }, // Rajapur
      { lat: 19.9615, lng: 79.2961 }, // Chandrapur
      { lat: 20.7453, lng: 78.6022 }, // Wardha
      { lat: 21.1463, lng: 77.7798 }, // Amravati
      { lat: 21.1458, lng: 79.0882 }, // Nagpur
    ];
    
    const baseCoord = baseCoordinates[Math.floor(Math.random() * baseCoordinates.length)];
    
    // Add random offset within village radius (max 2km)
    const latOffset = (Math.random() - 0.5) * 0.02; // ~1km
    const lngOffset = (Math.random() - 0.5) * 0.02; // ~1km
    
    const metadata: ImageMetadata = {
      hasGPS: selectedDevice.hasGPS && Math.random() > 0.1, // 90% chance of GPS
      gpsLatitude: selectedDevice.hasGPS ? baseCoord.lat + latOffset : undefined,
      gpsLongitude: selectedDevice.hasGPS ? baseCoord.lng + lngOffset : undefined,
      gpsAltitude: selectedDevice.hasGPS ? Math.random() * 500 + 100 : undefined, // 100-600m
      dateTimeOriginal: captureTime,
      dateTimeDigitized: captureTime,
      dateTime: captureTime,
      deviceMake: selectedDevice.make,
      deviceModel: selectedDevice.model,
      software: selectedDevice.software,
      imageWidth: img.width,
      imageHeight: img.height,
      orientation: 1,
      flash: Math.random() > 0.7,
      focalLength: Math.random() > 0.5 ? 4.2 : 2.8, // Wide or standard
      iso: Math.floor(Math.random() * 800) + 100, // 100-900 ISO
      exposureTime: `1/${Math.floor(Math.random() * 1000) + 60}`,
      fNumber: Math.random() > 0.5 ? 1.8 : 2.2,
      whiteBalance: ['Auto', 'Daylight', 'Cloudy', 'Tungsten'][Math.floor(Math.random() * 4)],
      digitalZoomRatio: Math.random() > 0.8 ? Math.random() * 2 + 1 : 1,
      contrast: ['Normal', 'Soft', 'Hard'][Math.floor(Math.random() * 3)],
      saturation: ['Normal', 'Low', 'High'][Math.floor(Math.random() * 3)],
      sharpness: ['Normal', 'Soft', 'Hard'][Math.floor(Math.random() * 3)]
    };

    return metadata;
  }

  /**
   * Check device authenticity and detect potential manipulation
   */
  static checkDeviceAuthenticity(metadata: ImageMetadata): DeviceAuthenticityResult {
    const issues: string[] = [];
    let score = 100;
    let confidence: 'HIGH' | 'MEDIUM' | 'LOW' = 'HIGH';

    // Check for GPS data
    if (!metadata.hasGPS) {
      issues.push('GPS data missing');
      score -= 40;
      confidence = 'LOW';
    }

    // Check device information
    if (!metadata.deviceMake || !metadata.deviceModel) {
      issues.push('Device information missing');
      score -= 20;
      confidence = 'MEDIUM';
    }

    // Check for suspicious device combinations
    if (metadata.deviceMake === 'Apple' && !metadata.deviceModel?.includes('iPhone')) {
      issues.push('Suspicious device combination');
      score -= 15;
    }

    // Check timestamp consistency
    if (metadata.dateTimeOriginal && metadata.dateTimeDigitized) {
      const timeDiff = Math.abs(metadata.dateTimeOriginal.getTime() - metadata.dateTimeDigitized.getTime());
      if (timeDiff > 60000) { // More than 1 minute difference
        issues.push('Timestamp inconsistency detected');
        score -= 10;
      }
    }

    // Check for image editing signatures
    if (metadata.software && this.isEditingSoftware(metadata.software)) {
      issues.push('Image editing software detected');
      score -= 25;
      confidence = 'LOW';
    }

    // Check digital zoom
    if (metadata.digitalZoomRatio && metadata.digitalZoomRatio > 2) {
      issues.push('Excessive digital zoom detected');
      score -= 10;
    }

    // Check image quality indicators
    if (metadata.iso && metadata.iso > 1600) {
      issues.push('Very high ISO - may indicate low light conditions');
      score -= 5;
    }

    // Check for screenshot indicators
    if (metadata.imageWidth && metadata.imageHeight) {
      const aspectRatio = metadata.imageWidth / metadata.imageHeight;
      if (this.isScreenshotAspectRatio(aspectRatio)) {
        issues.push('Screenshot aspect ratio detected');
        score -= 30;
        confidence = 'LOW';
      }
    }

    // Determine status
    let status = 'Authentic Device';
    if (score < 50) {
      status = 'Highly Suspicious';
      confidence = 'LOW';
    } else if (score < 70) {
      status = 'Requires Review';
      confidence = 'MEDIUM';
    } else if (score < 85) {
      status = 'Mostly Authentic';
      confidence = 'MEDIUM';
    }

    return {
      score: Math.max(0, score),
      status,
      issues,
      confidence
    };
  }

  /**
   * Check if software is image editing software
   */
  private static isEditingSoftware(software: string): boolean {
    const editingSoftware = [
      'Photoshop', 'GIMP', 'Paint', 'Snapseed', 'VSCO', 'Lightroom',
      'Canva', 'PicsArt', 'Fotor', 'Pixlr', 'Photo Editor', 'Procreate'
    ];
    
    return editingSoftware.some(edit => 
      software.toLowerCase().includes(edit.toLowerCase())
    );
  }

  /**
   * Check if aspect ratio suggests screenshot
   */
  private static isScreenshotAspectRatio(aspectRatio: number): boolean {
    // Common screenshot aspect ratios
    const screenshotRatios = [
      16/9,    // Standard mobile
      18/9,    // Modern mobile
      19.5/9,  // iPhone X+
      4/3,     // iPad
      16/10,   // iPad Pro
      21/9,    // Cinema
    ];
    
    const tolerance = 0.05;
    return screenshotRatios.some(ratio => 
      Math.abs(aspectRatio - ratio) < tolerance
    );
  }

  /**
   * Convert EXIF GPS coordinates to decimal degrees
   */
  static convertDMSToDecimal(dms: any): number {
    if (typeof dms === 'number') return dms;
    
    if (dms && typeof dms === 'object') {
      let degrees = dms.degrees || 0;
      let minutes = dms.minutes || 0;
      let seconds = dms.seconds || 0;
      
      // Handle rational format (numerator/denominator)
      if (typeof minutes === 'object' && minutes.numerator && minutes.denominator) {
        minutes = minutes.numerator / minutes.denominator;
      }
      if (typeof seconds === 'object' && seconds.numerator && seconds.denominator) {
        seconds = seconds.numerator / seconds.denominator;
      }
      
      return degrees + minutes/60 + seconds/3600;
    }
    
    return 0;
  }

  /**
   * Calculate time difference between capture and current time
   */
  static calculateTimeDifference(captureTime: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - captureTime.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  }

  /**
   * Validate GPS coordinates
   */
  static validateGPSCoordinates(lat: number, lng: number): boolean {
    return (
      lat >= -90 && lat <= 90 &&
      lng >= -180 && lng <= 180 &&
      !isNaN(lat) && !isNaN(lng) &&
      isFinite(lat) && isFinite(lng)
    );
  }

  /**
   * Check if image is recent (within specified hours)
   */
  static isImageRecent(captureTime: Date, maxHours: number = 24): boolean {
    const now = new Date();
    const diffMs = now.getTime() - captureTime.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours <= maxHours;
  }

  /**
   * Generate metadata summary for display
   */
  static generateMetadataSummary(metadata: ImageMetadata): string {
    const parts: string[] = [];
    
    if (metadata.deviceMake && metadata.deviceModel) {
      parts.push(`${metadata.deviceMake} ${metadata.deviceModel}`);
    }
    
    if (metadata.dateTimeOriginal) {
      parts.push(`Captured: ${metadata.dateTimeOriginal.toLocaleString()}`);
    }
    
    if (metadata.hasGPS && metadata.gpsLatitude && metadata.gpsLongitude) {
      parts.push(`GPS: ${metadata.gpsLatitude.toFixed(6)}, ${metadata.gpsLongitude.toFixed(6)}`);
    }
    
    if (metadata.imageWidth && metadata.imageHeight) {
      parts.push(`Resolution: ${metadata.imageWidth}×${metadata.imageHeight}`);
    }
    
    return parts.join(' | ');
  }

  /**
   * Export metadata to JSON for audit trail
   */
  static exportMetadataForAudit(metadata: ImageMetadata): string {
    const auditData = {
      timestamp: new Date().toISOString(),
      metadata: {
        ...metadata,
        // Convert dates to ISO strings for JSON serialization
        dateTimeOriginal: metadata.dateTimeOriginal?.toISOString(),
        dateTimeDigitized: metadata.dateTimeDigitized?.toISOString(),
        dateTime: metadata.dateTime?.toISOString()
      },
      deviceAuthenticity: this.checkDeviceAuthenticity(metadata)
    };
    
    return JSON.stringify(auditData, null, 2);
  }
}
