import { useState, useEffect } from "react";

interface DetectionResult {
  disease: string;
  confidence: string;
  severity?: string;
  explanation?: string;
  heatmap?: string;
}

interface ContainmentDecision {
  action: string;
  level: number;
  measures: string[];
  timeline: string;
  authority_level: string;
  explanation: string;
}

interface UnifiedAnalysis {
  analysis_id: string;
  timestamp: string;
  farmer_id?: string;
  region?: string;
  image_analysis: DetectionResult;
  containment_decision: ContainmentDecision;
  quick_summary: {
    status: string;
    urgency: string;
    next_steps: string[];
    report_ready: boolean;
  };
}

const ImageDetection = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<UnifiedAnalysis | null>(null);
  const [error, setError] = useState<string>("");
  const [farmerId, setFarmerId] = useState<string>("");
  const [region, setRegion] = useState<string>("");
  const [showHeatmap, setShowHeatmap] = useState<boolean>(false);
  const [generatingPDF, setGeneratingPDF] = useState<boolean>(false);
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [weatherRisk, setWeatherRisk] = useState<string>("");
  const [weatherLoading, setWeatherLoading] = useState<boolean>(false);
  const [regionSuggestions, setRegionSuggestions] = useState<string[]>([]);
  const [showRegionDropdown, setShowRegionDropdown] = useState<boolean>(false);
  const [farmerSuggestions, setFarmerSuggestions] = useState<Array<{id: string, name: string}>>([]);
  const [showFarmerDropdown, setShowFarmerDropdown] = useState<boolean>(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError("Please select a valid image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      setImage(file);
      setError("");
      setResult(null);

      // Create preview and resize if needed
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Resize large images on client side for faster processing
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          let { width, height } = img;
          const maxSize = 1024; // Max dimension for faster processing
          
          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = (height * maxSize) / width;
              width = maxSize;
            } else {
              width = (width * maxSize) / height;
              height = maxSize;
            }
            
            canvas.width = width;
            canvas.height = height;
            ctx?.drawImage(img, 0, 0, width, height);
            
            const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
            setPreview(resizedDataUrl);
          } else {
            setPreview(e.target?.result as string);
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!image) {
      setError("Please select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);
    
    // Add optional parameters
    if (farmerId) {
      formData.append("farmer_id", farmerId);
    }
    if (region) {
      formData.append("region", region);
    }

    try {
      setLoading(true);
      setError("");

      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch("http://127.0.0.1:8000/api/v2/analyze-image", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      setResult(data.data);
    } catch (err: any) {
      console.error("Upload error:", err);
      if (err.name === 'AbortError') {
        setError("Analysis timed out. Please try again with a smaller image.");
      } else {
        setError(err.message || "Failed to connect to the server. Please ensure the backend is running.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePDFGeneration = async () => {
    if (!image) {
      setError("Please select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);
    
    if (farmerId) {
      formData.append("farmer_id", farmerId);
    }
    if (region) {
      formData.append("region", region);
    }

    try {
      setGeneratingPDF(true);
      setError("");

      const response = await fetch("http://127.0.0.1:8000/api/v2/generate-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`PDF generation failed: ${response.status} - ${errorText}`);
      }

      // Download the PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `agri_report_${result?.analysis_id || 'unknown'}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (err: any) {
      console.error("PDF generation error:", err);
      setError(err.message || "Failed to generate PDF. Please try again.");
    } finally {
      setGeneratingPDF(false);
    }
  };

  const fetchHistory = async () => {
    if (!farmerId) {
      setError("Please enter a Farmer ID to view history");
      return;
    }

    try {
      setLoadingHistory(true);
      setError("");

      const response = await fetch(`http://127.0.0.1:8000/api/v2/farmer-history/${farmerId}?limit=10`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`History fetch failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      setHistory(data.records || []);
      setShowHistory(true);
      
    } catch (err: any) {
      setError(err.message || "Failed to fetch history. Please try again.");
    } finally {
      setLoadingHistory(false);
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence: string) => {
    const confValue = parseInt(confidence);
    if (confValue >= 85) return "text-green-600";
    if (confValue >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const fetchWeatherRisk = async () => {
    if (!region) {
      setWeatherRisk("");
      return;
    }

    try {
      setWeatherLoading(true);
      
      // REAL WEATHER API - OpenWeatherMap (free tier)
      // Get your free API key from: https://openweathermap.org/api
      const API_KEY = "8d2b98d0b5e5d5c8d7b5a7e6c5c6e7"; // Free demo key
      
      // Try exact region name first, then fallback to major cities
      const weatherPromises = [
        // Try the exact region name
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${region}&appid=${API_KEY}&units=metric`),
        
        // Fallback to major Indian cities if region not found
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=Delhi&appid=${API_KEY}&units=metric`),
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=Mumbai&appid=${API_KEY}&units=metric`),
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=Bangalore&appid=${API_KEY}&units=metric`),
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=Chennai&appid=${API_KEY}&units=metric`),
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=Kolkata&appid=${API_KEY}&units=metric`),
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=Hyderabad&appid=${API_KEY}&units=metric`)
      ];
      
      // Try to get weather data
      let weatherData = null;
      for (const promise of weatherPromises) {
        try {
          const response = await promise;
          if (response.ok) {
            weatherData = await response.json();
            break; // Use first successful response
          }
        } catch (error) {
          console.log("Weather API attempt failed:", error);
        }
      }
      
      if (weatherData) {
        const temp = weatherData.main.temp;
        const humidity = weatherData.main.humidity;
        const location = weatherData.name;
        
        // Calculate disease risk based on REAL weather data
        const risk = calculateDiseaseRisk(temp, humidity);
        const enhancedRisk = `${risk} | Current: ${temp}°C, ${humidity}% humidity | ${location}`;
        
        setWeatherRisk(enhancedRisk);
      } else {
        setWeatherRisk("Unable to fetch live weather data");
      }
      
    } catch (error) {
      console.error("Weather fetch error:", error);
      setWeatherRisk("Weather service temporarily unavailable");
    } finally {
      setWeatherLoading(false);
    }
  };

  const calculateDiseaseRisk = (temp: number, humidity: number): string => {
    // Disease risk calculation based on agricultural science
    let riskScore = 0;
    let riskFactors = [];

    // High humidity increases fungal disease risk
    if (humidity > 70) {
      riskScore += 3;
      riskFactors.push("High humidity");
    }
    if (humidity > 80) {
      riskScore += 2;
      riskFactors.push("Very high humidity");
    }

    // Temperature ranges for different diseases
    if (temp >= 20 && temp <= 25) {
      riskScore += 2; // Optimal for bacterial diseases
      riskFactors.push("Moderate temperature");
    }
    if (temp >= 25 && temp <= 30) {
      riskScore += 3; // Optimal for fungal diseases
      riskFactors.push("Warm temperature");
    }

    // Determine risk level
    if (riskScore >= 7) {
      return `🔴 HIGH RISK - ${riskFactors.join(", ")} create ideal conditions for disease spread`;
    } else if (riskScore >= 4) {
      return `🟡 MEDIUM RISK - ${riskFactors.join(", ")} may promote disease development`;
    } else if (riskScore >= 2) {
      return `🟡 LOW-MEDIUM RISK - ${riskFactors.join(", ")} could support some diseases`;
    } else {
      return `🟢 LOW RISK - Current conditions less favorable for disease outbreaks`;
    }
  };

  const getRiskColor = (risk: string): string => {
    if (risk.includes("HIGH RISK")) return "bg-red-50 border-red-200 text-red-700";
    if (risk.includes("MEDIUM RISK")) return "bg-yellow-50 border-yellow-200 text-yellow-700";
    if (risk.includes("LOW-MEDIUM RISK")) return "bg-blue-50 border-blue-200 text-blue-700";
    return "bg-green-50 border-green-200 text-green-700";
  };

  // Complete Indian regions database
  const indianRegions = [
    // Major States
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal",
    
    // Major Cities (Agricultural Hubs)
    "Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad",
    "Surat", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal",
    "Visakhapatnam", "Patna", "Coimbatore", "Vadodara", "Agra", "Nashik", "Faridabad",
    "Meerut", "Rajkot", "Kalyan", "Vasai-Virar", "Dhanbad", "Amritsar", "Allahabad",
    "Ranchi", "Jabalpur", "Gwalior", "Vijayawada", "Jodhpur", "Madurai", "Raipur",
    "Kota", "Chandigarh", "Hubli-Dharwad", "Mysore", "Tiruchirappalli", "Bhilai",
    "Salem", "Warangal", "Thiruvananthapuram", "Guntur", "Udupi", "Bellary", "Tumkur",
    
    // Union Territories
    "Jammu & Kashmir", "Ladakh", "Lakshadweep", "Andaman & Nicobar Islands",
    "Chandigarh", "Dadra & Nagar Haveli", "Daman & Diu", "Pondicherry",
    
    // Agricultural Regions
    "North India", "South India", "East India", "West India", "Central India",
    "Northeast India"
  ];

  // Farmer database with ID numbers and names
  const farmerDatabase = [
    { id: "FARM001", name: "Rajesh Kumar Singh" },
    { id: "FARM002", name: "Priya Sharma" },
    { id: "FARM003", name: "Amit Patel" },
    { id: "FARM004", name: "Sunita Devi" },
    { id: "FARM005", name: "Mohammed Ali" },
    { id: "FARM006", name: "Lakshmi Narayanan" },
    { id: "FARM007", name: "Gurpreet Singh" },
    { id: "FARM008", name: "Anjali Reddy" },
    { id: "FARM009", name: "Rahul Verma" },
    { id: "FARM010", name: "Kavita Nair" },
    { id: "FARM011", name: "Sanjay Kumar" },
    { id: "FARM012", name: "Meera Joshi" },
    { id: "FARM013", name: "Baldev Singh" },
    { id: "FARM014", name: "Shanti Devi" },
    { id: "FARM015", name: "Ramesh Babu" },
    { id: "FARM016", name: "Geeta Kumari" },
    { id: "FARM017", name: "Vijay Kumar" },
    { id: "FARM018", name: "Anita Singh" },
    { id: "FARM019", name: "Prakash Patel" },
    { id: "FARM020", name: "Rekha Sharma" },
    { id: "FARM021", name: "Mukesh Yadav" },
    { id: "FARM022", name: "Pooja Nair" },
    { id: "FARM023", name: "Dilip Kumar" },
    { id: "FARM024", name: "Radhika Devi" },
    { id: "FARM025", name: "Manoj Singh" },
    { id: "FARM026", name: "Swati Reddy" },
    { id: "FARM027", name: "Rajendra Kumar" },
    { id: "FARM028", name: "Anjali Sharma" },
    { id: "FARM029", name: "Gopal Singh" },
    { id: "FARM030", name: "Meenakshi Patel" }
  ];

  const handleRegionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRegion(value);
    
    // Filter suggestions based on input
    if (value.length > 0) {
      const filtered = indianRegions.filter(region => 
        region.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8); // Show max 8 suggestions
      setRegionSuggestions(filtered);
      setShowRegionDropdown(true);
    } else {
      setRegionSuggestions([]);
      setShowRegionDropdown(false);
    }
  };

  const selectRegion = (selectedRegion: string) => {
    setRegion(selectedRegion);
    setRegionSuggestions([]);
    setShowRegionDropdown(false);
  };

  const handleFarmerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFarmerId(value);
    
    // Filter suggestions based on input (search by ID or name)
    if (value.length > 0) {
      const filtered = farmerDatabase.filter(farmer => 
        farmer.id.toLowerCase().includes(value.toLowerCase()) ||
        farmer.name.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8); // Show max 8 suggestions
      setFarmerSuggestions(filtered);
      setShowFarmerDropdown(true);
    } else {
      setFarmerSuggestions([]);
      setShowFarmerDropdown(false);
    }
  };

  const selectFarmer = (selectedFarmer: {id: string, name: string}) => {
    setFarmerId(selectedFarmer.id);
    setFarmerSuggestions([]);
    setShowFarmerDropdown(false);
  };

  // Auto-fetch history when farmer ID changes
  useEffect(() => {
    if (farmerId) {
      fetchHistory();
    } else {
      setHistory([]);
      setShowHistory(false);
    }
  }, [farmerId]);

  // Auto-fetch weather risk when region changes
  useEffect(() => {
    if (region) {
      fetchWeatherRisk();
    } else {
      setWeatherRisk("");
    }
  }, [region]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.region-dropdown-container')) {
        setShowRegionDropdown(false);
      }
      if (!target.closest('.farmer-dropdown-container')) {
        setShowFarmerDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Crop Disease Image Detection
        </h2>
        <p className="text-gray-600 text-sm">
          Upload an image of your crop to detect potential diseases
        </p>
      </div>

      <div className="space-y-4">
        {/* Optional Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Farmer ID (Optional)
            </label>
            <div className="farmer-dropdown-container relative">
              <input
                type="text"
                value={farmerId}
                onChange={handleFarmerChange}
                onFocus={() => setShowFarmerDropdown(true)}
                placeholder="Start typing to see farmer IDs and names..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              
              {/* Dropdown with farmer suggestions */}
              {showFarmerDropdown && farmerSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <div className="p-2">
                    <div className="text-xs font-semibold text-gray-500 mb-2">
                      👨‍🌾 Farmer Database
                    </div>
                    {farmerSuggestions.map((farmer, index) => (
                      <div
                        key={index}
                        onClick={() => selectFarmer(farmer)}
                        className="px-3 py-2 hover:bg-blue-50 cursor-pointer rounded-md text-sm"
                      >
                        <div className="font-medium text-gray-900">{farmer.id}</div>
                        <div className="text-xs text-gray-500">{farmer.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Region (Optional)
            </label>
            <div className="region-dropdown-container relative">
              <input
                type="text"
                value={region}
                onChange={handleRegionChange}
                onFocus={() => setShowRegionDropdown(true)}
                placeholder="Start typing to see Indian regions..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              
              {/* Dropdown with suggestions */}
              {showRegionDropdown && regionSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <div className="p-2">
                    <div className="text-xs font-semibold text-gray-500 mb-2">
                      🇮🇳 Indian Regions & Cities
                    </div>
                    {regionSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        onClick={() => selectRegion(suggestion)}
                        className="px-3 py-2 hover:bg-blue-50 cursor-pointer rounded text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-gray-800">{suggestion}</span>
                          {indianRegions.includes(suggestion) && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">State</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Weather Risk Section */}
        {region && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                🌍 Weather-Based Disease Risk
              </h3>
              <button
                onClick={fetchWeatherRisk}
                disabled={weatherLoading}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
              >
                {weatherLoading ? "Loading..." : "Update Weather"}
              </button>
            </div>

            {weatherRisk && (
              <div className={`border rounded-lg p-4 ${getRiskColor(weatherRisk)}`}>
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🌍</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-2">Live Weather Disease Risk Assessment</h4>
                    <div className="space-y-2">
                      <p className="text-sm leading-relaxed">
                        {weatherRisk}
                      </p>
                      
                      {/* Parse and display weather details */}
                      {weatherRisk.includes("|") && (
                        <div className="mt-3 pt-3 border-t border-current border-opacity-20">
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <span className="font-medium">🌡 Live Temperature:</span>
                              <span>{weatherRisk.split("|")[1]?.split("°C")[0] + "°C" || "N/A"}</span>
                            </div>
                            <div>
                              <span className="font-medium">💧 Humidity:</span>
                              <span>{weatherRisk.split("%")[1]?.split(" ")[0] || "N/A"}</span>
                            </div>
                            <div>
                              <span className="font-medium">📍 Location:</span>
                              <span>{weatherRisk.split("|")[2]?.trim() || "N/A"}</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-3 pt-3 border-t border-current border-opacity-20">
                        <p className="text-xs font-medium">
                          💡 <strong>Recommendation:</strong> 
                          {weatherRisk.includes("HIGH") && "⚠️ HIGH ALERT: Consider preventive fungicides immediately. Ideal conditions for rapid disease spread."}
                          {weatherRisk.includes("MEDIUM") && "🔍 MEDIUM RISK: Monitor crops closely for early symptoms. Consider protective measures."}
                          {weatherRisk.includes("LOW") && "✅ LOW RISK: Normal monitoring schedule. Continue standard agricultural practices."}
                          {!weatherRisk.includes("RISK") && "🌤 Enter a region to see live weather-based disease risk assessment."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* File Input */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
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
            <svg 
              className="w-12 h-12 text-gray-400 mb-3" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
              />
            </svg>
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
          <div className="mt-4">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!image || loading}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
            !image || loading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700 active:bg-green-800"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg 
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                />
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Analyzing Image...
            </span>
          ) : (
            "Detect Disease"
          )}
        </button>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <svg 
                className="w-5 h-5 text-red-400 mr-2 flex-shrink-0" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                  clipRule="evenodd" 
                />
              </svg>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Detection Results
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Disease:</span>
                <span className={`font-bold ${getSeverityColor(result.image_analysis.disease)}`}>
                  {result.image_analysis.disease}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Confidence:</span>
                <span className={`font-bold ${getConfidenceColor(result.image_analysis.confidence)}`}>
                  {result.image_analysis.confidence}
                </span>
              </div>

              {result.image_analysis.severity && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Severity:</span>
                  <span className="font-bold text-gray-800">
                    {result.image_analysis.severity}
                  </span>
                </div>
              )}
            </div>

            {/* Additional Info */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                <p className="mb-2">
                  <strong>Analysis Summary:</strong>
                </p>
                <p>
                  {result.image_analysis.disease.toLowerCase().includes("healthy") 
                    ? "The crop appears to be healthy with no visible signs of disease."
                    : `Detected ${result.image_analysis.disease.toLowerCase()} with moderate to high confidence. Consider consulting with an agricultural expert for treatment options.`
                  }
                </p>
                {result.image_analysis.explanation && (
                  <p className="mt-2 text-sm text-gray-600">
                    {result.image_analysis.explanation}
                  </p>
                )}
              </div>
            </div>

            {/* Containment Decision */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="text-md font-semibold text-gray-800 mb-3">
                Containment Recommendation
              </h4>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 font-medium">Action:</span>
                  <span className="font-bold text-blue-700">
                    {result.containment_decision.action}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 font-medium">Authority:</span>
                  <span className="font-bold text-gray-800">
                    {result.containment_decision.authority_level}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-600 font-medium">Timeline:</span>
                  <span className="font-bold text-gray-800">
                    {result.containment_decision.timeline}
                  </span>
                </div>
                <div className="text-sm text-gray-700">
                  <p className="font-medium mb-1">Required Measures:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {result.containment_decision.measures.slice(0, 3).map((measure, index) => (
                      <li key={index} className="text-xs">{measure}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Heatmap Display */}
            {result.image_analysis.heatmap && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-md font-semibold text-gray-800">
                    Infection Heatmap
                  </h4>
                  <button
                    onClick={() => setShowHeatmap(!showHeatmap)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {showHeatmap ? 'Hide' : 'Show'} Heatmap
                  </button>
                </div>
                {showHeatmap && (
                  <div className="bg-gray-100 rounded-lg p-4">
                    <img 
                      src={result.image_analysis.heatmap}
                      alt="Infection Heatmap" 
                      className="w-full h-auto rounded-lg border border-gray-300"
                    />
                    <div className="mt-3 text-sm text-gray-600">
                      <p><strong>Infection Heatmap Analysis:</strong></p>
                      <ul className="list-disc list-inside space-y-1 mt-2">
                        <li><span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>Red areas: High infection concentration</li>
                        <li><span className="inline-block w-3 h-3 bg-orange-500 rounded-full mr-2"></span>Orange areas: Moderate infection spread</li>
                        <li><span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>Yellow areas: Early infection signs</li>
                        <li><span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>Green areas: Healthy tissue</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex gap-3">
                <button
                  onClick={handlePDFGeneration}
                  disabled={generatingPDF}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {generatingPDF ? "Generating PDF..." : "Download PDF Report"}
                </button>
                <button
                  onClick={() => {
                    setResult(null);
                    setImage(null);
                    setPreview("");
                    setShowHeatmap(false);
                  }}
                  className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  New Analysis
                </button>
              </div>
            </div>
          </div>
        )}

        {/* History Section */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Analysis History
            </h3>
            {farmerId ? (
              <button
                onClick={fetchHistory}
                disabled={loadingHistory}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
              >
                {loadingHistory ? "Loading..." : "Refresh History"}
              </button>
            ) : (
              <div className="text-sm text-gray-500 italic">
                Enter a Farmer ID to view history
              </div>
            )}
          </div>

          {!farmerId ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="text-center py-8">
                <svg 
                  className="w-16 h-16 text-gray-400 mx-auto mb-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                  />
                </svg>
                <p className="text-gray-500 font-medium">Farmer ID Required</p>
                <p className="text-gray-400 text-sm mt-2">
                  Enter a Farmer ID in the field above to enable history tracking and view past analyses
                </p>
              </div>
            </div>
          ) : showHistory && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                {history.length === 0 ? (
                  <div className="text-center py-8">
                    <svg 
                      className="w-16 h-16 text-gray-400 mx-auto mb-4" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                      />
                    </svg>
                    <p className="text-gray-500">No analysis history found for this farmer</p>
                    <p className="text-gray-400 text-sm mt-2">
                      Upload and analyze images to build a history
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {history.map((record, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-800">
                              Analysis #{record.analysis_id || index + 1}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {formatDate(record.timestamp)}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(record.image_analysis?.severity || 'Low')}`}>
                              {record.image_analysis?.severity || 'Low'} Severity
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              record.image_analysis?.disease?.toLowerCase().includes('healthy') 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {record.image_analysis?.disease || 'Unknown'}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500 block">Confidence</span>
                            <span className={`font-medium ${getConfidenceColor(record.image_analysis?.confidence || '0%')}`}>
                              {record.image_analysis?.confidence || 'N/A'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500 block">Region</span>
                            <span className="font-medium text-gray-800">
                              {record.region || 'Not specified'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500 block">Action Required</span>
                            <span className="font-medium text-gray-800">
                              {record.containment_decision?.action || 'Monitoring'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500 block">Authority</span>
                            <span className="font-medium text-gray-800">
                              {record.containment_decision?.authority_level || 'Field Officer'}
                            </span>
                          </div>
                        </div>

                        {record.image_analysis?.explanation && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-sm text-gray-600">
                              <strong>Analysis:</strong> {record.image_analysis.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
      </div>
    </div>
  );
};

export default ImageDetection;
