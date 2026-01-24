"""
AgriPulseX Weather Intelligence System
FastAPI backend for weather-based disease containment analysis
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import random
import json

app = FastAPI(
    title="AgriPulseX Weather Intelligence API",
    description="Weather-based disease containment analysis for agricultural disease management",
    version="1.0.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data Models
class CurrentWeather(BaseModel):
    temperature: float
    humidity: float
    rainfall24h: float
    windSpeed: float
    cloudCover: float
    condition: str
    pressure: float
    visibility: float
    uvIndex: float
    lastUpdated: str

class ForecastDay(BaseModel):
    date: str
    day: str
    temperature: Dict[str, float]
    humidity: float
    rainfall: float
    windSpeed: float
    condition: str
    cloudCover: float

class WeatherData(BaseModel):
    location: str
    current: CurrentWeather
    forecast: List[ForecastDay]

class ContainmentAdjustment(BaseModel):
    originalRadius: float
    adjustedRadius: float
    adjustmentReason: str

class WeatherRiskAnalysis(BaseModel):
    riskScore: int
    riskLevel: str
    explanations: List[str]
    recommendations: List[str]
    earlyWarnings: List[str]
    containmentAdjustment: ContainmentAdjustment

class WeatherRequest(BaseModel):
    location: str
    disease: str
    severity: str
    baseContainmentRadius: float

class WeatherResponse(BaseModel):
    weatherData: WeatherData
    riskAnalysis: WeatherRiskAnalysis
    timestamp: str

# Indian agricultural regions with climate data
INDIAN_REGIONS = {
    "Punjab - Amritsar": {
        "base_temp": 25,
        "humidity_range": (60, 85),
        "monsoon_months": [6, 7, 8, 9],
        "crop_season": "Rabi"
    },
    "Maharashtra - Nashik": {
        "base_temp": 28,
        "humidity_range": (55, 80),
        "monsoon_months": [6, 7, 8, 9],
        "crop_season": "Kharif"
    },
    "Karnataka - Bangalore Rural": {
        "base_temp": 26,
        "humidity_range": (50, 75),
        "monsoon_months": [5, 6, 7, 8, 9, 10],
        "crop_season": "Year-round"
    },
    "Uttar Pradesh - Meerut": {
        "base_temp": 27,
        "humidity_range": (55, 80),
        "monsoon_months": [6, 7, 8, 9],
        "crop_season": "Zaid"
    },
    "Gujarat - Anand": {
        "base_temp": 29,
        "humidity_range": (50, 75),
        "monsoon_months": [6, 7, 8, 9],
        "crop_season": "Kharif"
    }
}

# Weather conditions
WEATHER_CONDITIONS = [
    "Clear", "Partly Cloudy", "Cloudy", "Light Rain", 
    "Moderate Rain", "Heavy Rain", "Thunderstorm"
]

# Disease-specific optimal conditions
DISEASE_CONDITIONS = {
    "Late Blight": {
        "optimal_temp": (18, 25),
        "optimal_humidity": (85, 95),
        "type": "fungal",
        "spread_factor": "wind_rain"
    },
    "Yellow Rust": {
        "optimal_temp": (15, 22),
        "optimal_humidity": (80, 90),
        "type": "fungal",
        "spread_factor": "wind"
    },
    "Bacterial Wilt": {
        "optimal_temp": (25, 32),
        "optimal_humidity": (70, 85),
        "type": "bacterial",
        "spread_factor": "water"
    },
    "Powdery Mildew": {
        "optimal_temp": (20, 28),
        "optimal_humidity": (60, 80),
        "type": "fungal",
        "spread_factor": "wind"
    },
    "Leaf Blight": {
        "optimal_temp": (22, 30),
        "optimal_humidity": (75, 90),
        "type": "fungal",
        "spread_factor": "rain_splash"
    }
}

def generate_realistic_weather(location: str) -> WeatherData:
    """Generate realistic weather data for Indian agricultural regions"""
    region_data = INDIAN_REGIONS.get(location, INDIAN_REGIONS["Punjab - Amritsar"])
    current_month = datetime.now().month
    
    # Adjust for monsoon season
    is_monsoon = current_month in region_data["monsoon_months"]
    base_temp = region_data["base_temp"]
    
    # Add seasonal variation
    if current_month in [12, 1, 2]:  # Winter
        base_temp -= 5
    elif current_month in [3, 4, 5]:  # Spring
        base_temp += 2
    elif current_month in [6, 7, 8, 9]:  # Monsoon
        base_temp += 1
    
    # Generate current weather
    current_condition = random.choice(WEATHER_CONDITIONS)
    if is_monsoon and "Rain" not in current_condition:
        current_condition = random.choice(["Light Rain", "Moderate Rain", "Cloudy"])
    
    current_weather = CurrentWeather(
        temperature=round(base_temp + random.uniform(-4, 4), 1),
        humidity=random.randint(*region_data["humidity_range"]),
        rainfall24h=round(random.uniform(0, 30 if is_monsoon else 10), 1),
        windSpeed=round(random.uniform(5, 20), 1),
        cloudCover=random.randint(20, 90),
        condition=current_condition,
        pressure=round(random.uniform(1000, 1020), 1),
        visibility=round(random.uniform(5, 15), 1),
        uvIndex=random.randint(1, 11),
        lastUpdated=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    )
    
    # Generate 7-day forecast
    forecast = []
    for i in range(1, 8):
        future_date = datetime.now() + timedelta(days=i)
        day_temp = base_temp + random.uniform(-3, 3)
        
        forecast_day = ForecastDay(
            date=future_date.strftime("%Y-%m-%d"),
            day=future_date.strftime("%a"),
            temperature={
                "min": round(day_temp - 5, 1),
                "max": round(day_temp + 5, 1)
            },
            humidity=random.randint(*region_data["humidity_range"]),
            rainfall=round(random.uniform(0, 25 if is_monsoon else 8), 1),
            windSpeed=round(random.uniform(5, 18), 1),
            condition=random.choice(WEATHER_CONDITIONS),
            cloudCover=random.randint(20, 90)
        )
        forecast.append(forecast_day)
    
    return WeatherData(
        location=location,
        current=current_weather,
        forecast=forecast
    )

def calculate_weather_risk(weather: WeatherData, disease: str, severity: str, base_radius: float) -> WeatherRiskAnalysis:
    """Calculate weather-based disease risk using explainable rule-based logic"""
    current = weather.current
    forecast = weather.forecast
    
    risk_score = 0
    explanations = []
    recommendations = []
    early_warnings = []
    
    # Get disease-specific conditions
    disease_info = DISEASE_CONDITIONS.get(disease, DISEASE_CONDITIONS["Late Blight"])
    optimal_temp = disease_info["optimal_temp"]
    optimal_humidity = disease_info["optimal_humidity"]
    disease_type = disease_info["type"]
    spread_factor = disease_info["spread_factor"]
    
    # 1. Humidity Analysis (Critical for fungal diseases)
    if current.humidity > 85:
        risk_score += 25
        explanations.append(f"High humidity ({current.humidity}%) creates favorable conditions for {disease_type} disease spread")
        recommendations.append("Increase fungicide application frequency")
        early_warnings.append("Fungal infection risk elevated due to high humidity")
    elif current.humidity > 75:
        risk_score += 15
        explanations.append(f"Moderate humidity ({current.humidity}%) may support {disease_type} development")
    
    # 2. Rainfall Analysis
    if current.rainfall24h > 20:
        risk_score += 20
        explanations.append(f"Heavy rainfall ({current.rainfall24h}mm) facilitates pathogen dispersal")
        recommendations.append("Enhance drainage systems in affected areas")
        earlyWarnings.append("Heavy rainfall increases disease transmission risk")
    elif current.rainfall24h > 10:
        risk_score += 10
        explanations.append(f"Moderate rainfall ({current.rainfall24h}mm) may aid pathogen spread")
    
    # 3. Continuous Rainfall Analysis
    consecutive_rain_days = sum(1 for day in forecast[:3] if day.rainfall > 5)
    if consecutive_rain_days >= 3:
        risk_score += 15
        explanations.append(f"Continuous rainfall expected for {consecutive_rain_days} days")
        recommendations.append("Prepare for extended disease monitoring period")
        early_warnings.append(f"Extended rainfall period may cause {disease} outbreak")
    
    # 4. Wind Speed Analysis (Critical for spore dispersal)
    if current.windSpeed > 15:
        risk_score += 15
        explanations.append(f"Strong winds ({current.windSpeed} km/h) can spread {disease_type} spores across farms")
        recommendations.append("Increase containment radius to prevent cross-farm transmission")
        early_warnings.append("Strong winds may accelerate disease spread")
    elif current.windSpeed > 10:
        risk_score += 8
        explanations.append(f"Moderate winds ({current.windSpeed} km/h) may aid local disease spread")
    
    # 5. Temperature Analysis
    if optimal_temp[0] <= current.temperature <= optimal_temp[1]:
        risk_score += 10
        explanations.append(f"Temperature ({current.temperature}°C) is optimal for pathogen activity")
    elif abs(current.temperature - optimal_temp[0]) < 5 or abs(current.temperature - optimal_temp[1]) < 5:
        risk_score += 5
        explanations.append(f"Temperature ({current.temperature}°C) is near optimal range for pathogen")
    
    # 6. Cloud Cover Analysis
    if current.cloudCover > 80:
        risk_score += 5
        explanations.append(f"Heavy cloud cover ({current.cloudCover}%) creates humid microclimate")
    
    # 7. Disease-Specific Risk Factors
    if disease_type == "fungal":
        if current.humidity > 80 and current.rainfall24h > 5:
            risk_score += 10
            explanations.append("High humidity and rainfall create ideal conditions for fungal diseases")
            recommendations.push("Apply preventive fungicide in buffer zones")
    
    elif disease_type == "bacterial":
        if current.rainfall24h > 10 and current.temperature > 25:
            risk_score += 10
            explanations.append("Warm and wet conditions favor bacterial disease spread")
            recommendations.push("Apply copper-based bactericides preventively")
    
    # 8. Spread Factor Specific Analysis
    if spread_factor == "wind" and current.windSpeed > 12:
        risk_score += 8
        explanations.append("Wind conditions favor airborne disease transmission")
    
    elif spread_factor == "rain_splash" and current.rainfall24h > 8:
        risk_score += 8
        explanations.append("Rainfall intensity favors splash dispersal")
    
    elif spread_factor == "water" and current.rainfall24h > 5:
        risk_score += 8
        explanations.append("Water-mediated dispersal risk elevated")
    
    # 9. Severity Multiplier
    severity_multipliers = {
        "Critical": 1.5,
        "High": 1.3,
        "Medium": 1.1,
        "Low": 1.0
    }
    risk_score = int(risk_score * severity_multipliers.get(severity, 1.0))
    
    # 10. Determine Risk Level
    if risk_score >= 60:
        risk_level = "High"
        recommendations.extend([
            "Implement emergency containment protocols",
            "Increase monitoring frequency to twice daily",
            "Prepare for immediate treatment deployment"
        ])
        adjusted_radius = base_radius * 1.5
    elif risk_score >= 35:
        risk_level = "Moderate"
        recommendations.extend([
            "Enhanced surveillance required",
            "Consider preventive treatment in buffer zones"
        ])
        adjusted_radius = base_radius * 1.2
    else:
        risk_level = "Low"
        recommendations.extend([
            "Continue standard monitoring protocols",
            "Maintain current containment measures"
        ])
        adjusted_radius = base_radius
    
    # 11. Generate Early Warnings based on forecast
    high_risk_days = sum(1 for day in forecast 
                        if day.humidity > 85 and day.rainfall > 10)
    
    if high_risk_days >= 2:
        early_warnings.extend([
            f"Disease-favorable weather expected in next {high_risk_days} days",
            "Preventive containment recommended"
        ])
    
    if any(day.windSpeed > 20 for day in forecast):
        early_warnings.append("High wind speeds expected - enhanced containment advised")
    
    # 12. Containment Adjustment
    if adjusted_radius > base_radius:
        adjustment_reason = f"Weather conditions ({risk_level} risk) require expanded containment to prevent disease spread"
    else:
        adjustment_reason = "Current weather conditions allow standard containment measures"
    
    return WeatherRiskAnalysis(
        riskScore=min(100, risk_score),
        riskLevel=risk_level,
        explanations=explanations,
        recommendations=recommendations,
        earlyWarnings=early_warnings,
        containmentAdjustment=ContainmentAdjustment(
            originalRadius=base_radius,
            adjustedRadius=round(adjusted_radius, 1),
            adjustmentReason=adjustment_reason
        )
    )

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "AgriPulseX Weather Intelligence API",
        "version": "1.0.0",
        "description": "Weather-based disease containment analysis for agricultural disease management"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/api/weather/analyze", response_model=WeatherResponse)
async def analyze_weather_risk(request: WeatherRequest):
    """Analyze weather risk for disease containment"""
    try:
        # Generate weather data
        weather_data = generate_realistic_weather(request.location)
        
        # Calculate risk analysis
        risk_analysis = calculate_weather_risk(
            weather_data, 
            request.disease, 
            request.severity, 
            request.baseContainmentRadius
        )
        
        return WeatherResponse(
            weatherData=weather_data,
            riskAnalysis=risk_analysis,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing weather risk: {str(e)}")

@app.get("/api/weather/locations")
async def get_available_locations():
    """Get list of available agricultural regions"""
    return {
        "locations": list(INDIAN_REGIONS.keys()),
        "count": len(INDIAN_REGIONS)
    }

@app.get("/api/weather/diseases")
async def get_supported_diseases():
    """Get list of supported diseases with their conditions"""
    return {
        "diseases": list(DISEASE_CONDITIONS.keys()),
        "conditions": DISEASE_CONDITIONS
    }

@app.post("/api/weather/current/{location}")
async def get_current_weather(location: str):
    """Get current weather for a specific location"""
    try:
        weather_data = generate_realistic_weather(location)
        return {
            "location": weather_data.location,
            "current": weather_data.current,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching weather data: {str(e)}")

@app.post("/api/weather/forecast/{location}")
async def get_weather_forecast(location: str, days: int = 7):
    """Get weather forecast for a specific location"""
    try:
        weather_data = generate_realistic_weather(location)
        return {
            "location": weather_data.location,
            "forecast": weather_data.forecast[:days],
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching forecast data: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
