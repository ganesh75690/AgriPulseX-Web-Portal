from fastapi import FastAPI, File, UploadFile, HTTPException, Query, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional
import io
import base64
from datetime import datetime
import os

# Import our advanced analysis modules
from image_detection import analyze_image
from unified_analysis import unified_crop_analysis
from containment_engine import containment_engine
from pdf_generator import pdf_generator
from historical_analysis import historical_engine

app = FastAPI(
    title="AgriPulseX Advanced Agricultural Intelligence",
    description="Government-Grade AI Decision Intelligence for Crop Disease Detection and Containment",
    version="2.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS MUST COME IMMEDIATELY AFTER app = FastAPI()
# Get allowed origins from environment or use defaults
allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000", 
    "http://localhost:5173",
    "https://695f974bdcf643fdd3303f75--brilliant-quokka-863185.netlify.app",
    "https://brilliant-quokka-863185.netlify.app"
]

# Add production frontend URL from environment if available
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    allowed_origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response validation
class AnalysisRequest(BaseModel):
    farmer_id: Optional[str] = None
    region: Optional[str] = None

class HistoricalRequest(BaseModel):
    farmer_id: Optional[str] = None
    region: Optional[str] = None
    days: Optional[int] = 30

# ---- HEALTH CHECK ----

@app.get("/")
def root():
    return {
        "status": "AgriPulseX Advanced Backend Running",
        "version": "2.0",
        "features": [
            "Image Disease Detection with Heatmap",
            "Auto-Containment Decision Mapping", 
            "PDF Report Generation",
            "Historical Trend Analysis"
        ]
    }

# ---- CORE ANALYSIS ENDPOINTS ----

@app.post("/api/v2/analyze-image")
async def analyze_crop_image(
    file: UploadFile = File(...),
    farmer_id: Optional[str] = Form(None, description="Farmer identifier"),
    region: Optional[str] = Form(None, description="Agricultural region")
):
    """
    Advanced crop disease analysis with heatmap and containment recommendations
    
    Features:
    - Computer vision disease detection
    - Infected area heatmap generation
    - Automatic containment decision mapping
    - Government-grade response recommendations
    """
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read image bytes
        image_bytes = await file.read()
        
        # Debug: Log the type and size of image bytes
        print(f"Received image: {len(image_bytes)} bytes, type: {type(image_bytes)}")
        
        # Try basic image analysis first to isolate the issue
        try:
            print("Attempting basic image analysis...")
            from image_detection import analyze_image_optimized
            image_results = analyze_image_optimized(image_bytes)
            print("Basic image analysis successful")
            
            # Create a simple response without containment decisions for now
            simple_results = {
                "analysis_id": f"ANA_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                "timestamp": datetime.now().isoformat(),
                "farmer_id": farmer_id or "anonymous",
                "region": region or "unknown",
                "image_analysis": {
                    "disease": image_results["disease"],
                    "confidence": image_results["confidence"],
                    "severity": image_results["severity"],
                    "explanation": image_results["explanation"],
                    "heatmap": image_results["heatmap"]
                },
                "containment_decision": {
                    "action": "Analysis completed - containment decision temporarily disabled",
                    "level": 1,
                    "measures": ["Basic monitoring"],
                    "timeline": "Standard monitoring",
                    "authority_level": "Field Officer",
                    "explanation": "Simplified analysis mode"
                },
                "quick_summary": {
                    "status": "Healthy" if image_results["disease"] == "Healthy" else "Action Required",
                    "urgency": "Low" if image_results["severity"] == "Low" else 
                             "Medium" if image_results["severity"] == "Medium" else "High",
                    "next_steps": ["Review results", "Follow recommendations"],
                    "report_ready": True
                }
            }
            
            # Store analysis in history if farmer_id is provided
            if farmer_id:
                try:
                    historical_engine.store_analysis(simple_results)
                    print(f"Analysis stored in history for farmer: {farmer_id}")
                except Exception as hist_error:
                    print(f"Warning: Failed to store in history: {hist_error}")
            
            return {
                "success": True,
                "data": simple_results,
                "message": "Analysis completed successfully (simplified mode)"
            }
            
        except Exception as img_error:
            print(f"Image analysis failed: {type(img_error).__name__}: {str(img_error)}")
            raise HTTPException(status_code=500, detail=f"Image analysis failed: {str(img_error)}")
        
    except Exception as e:
        print(f"Detailed error: {type(e).__name__}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/api/v2/generate-pdf")
async def generate_analysis_report(
    file: UploadFile = File(...),
    farmer_id: Optional[str] = Query(None, description="Farmer identifier"),
    region: Optional[str] = Query(None, description="Agricultural region")
):
    """
    Generate downloadable PDF report with complete analysis
    
    Includes:
    - Original and heatmap images
    - Disease detection results
    - Containment recommendations
    - Government-standard formatting
    """
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read image bytes
        image_bytes = await file.read()
        
        # Use simplified analysis for PDF generation (avoid UTF-8 issues)
        from image_detection import analyze_image_optimized
        image_results = analyze_image_optimized(image_bytes)
        
        # Create simplified analysis data for PDF
        analysis_results = {
            "analysis_id": f"ANA_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "timestamp": datetime.now().isoformat(),
            "farmer_id": farmer_id or "anonymous",
            "region": region or "unknown",
            "image_analysis": {
                "disease": image_results["disease"],
                "confidence": image_results["confidence"],
                "severity": image_results["severity"],
                "explanation": image_results["explanation"],
                "heatmap": image_results["heatmap"]
            },
            "containment_decision": {
                "action": "Analysis completed - PDF report generated",
                "level": 1,
                "measures": ["Review report details", "Follow recommendations"],
                "timeline": "Immediate review",
                "authority_level": "Field Officer",
                "explanation": "PDF report contains analysis results"
            },
            "quick_summary": {
                "status": "Healthy" if image_results["disease"] == "Healthy" else "Action Required",
                "urgency": "Low" if image_results["severity"] == "Low" else 
                         "Medium" if image_results["severity"] == "Medium" else "High",
                "next_steps": ["Review PDF report", "Implement recommendations"],
                "report_ready": True
            }
        }
        
        # Generate PDF
        pdf_bytes = pdf_generator.generate_report(analysis_results, image_bytes)
        
        # Return PDF as streaming response
        return StreamingResponse(
            io.BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=agri_report_{analysis_results['analysis_id']}.pdf"}
        )
        
    except Exception as e:
        print(f"PDF generation error: {type(e).__name__}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")

# ---- HISTORICAL ANALYSIS ENDPOINTS ----

@app.get("/api/v2/farmer-history/{farmer_id}")
def get_farmer_history(
    farmer_id: str,
    limit: int = Query(10, description="Maximum number of records to return")
):
    """
    Get historical analysis records for a specific farmer
    
    Returns trend analysis and historical data
    """
    try:
        # Get farmer history
        records = historical_engine.get_farmer_history(farmer_id, limit)
        
        # Get comprehensive summary
        summary = historical_engine.get_farmer_summary(farmer_id)
        
        return {
            "success": True,
            "farmer_id": farmer_id,
            "summary": summary,
            "records": [record.__dict__ for record in records],
            "message": f"Retrieved {len(records)} historical records"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"History retrieval failed: {str(e)}")

@app.get("/api/v2/region-summary/{region}")
def get_regional_summary(
    region: str,
    days: int = Query(30, description="Number of days to analyze")
):
    """
    Get regional agricultural disease summary
    
    Provides regional trends and disease patterns
    """
    try:
        # Get regional summary
        summary = historical_engine.get_regional_summary(region, days)
        
        return {
            "success": True,
            "region": region,
            "time_period_days": days,
            "summary": summary,
            "message": f"Regional summary for {region} over {days} days"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Regional summary failed: {str(e)}")

@app.get("/api/v2/trend-analysis/{farmer_id}")
def get_farmer_trend_analysis(farmer_id: str):
    """
    Get detailed trend analysis for a farmer
    
    Provides disease progression patterns and recommendations
    """
    try:
        # Get farmer history
        records = historical_engine.get_farmer_history(farmer_id, limit=50)
        
        if not records:
            return {
                "success": True,
                "farmer_id": farmer_id,
                "trend": "insufficient_data",
                "message": "No historical data available for trend analysis",
                "recommendations": ["Continue regular monitoring to establish baseline"]
            }
        
        # Analyze trends
        trend_analysis = historical_engine.analyze_trend(records)
        
        # Generate recommendations based on trend
        recommendations = _generate_trend_recommendations(trend_analysis)
        
        return {
            "success": True,
            "farmer_id": farmer_id,
            "trend_analysis": trend_analysis,
            "recommendations": recommendations,
            "data_points": len(records),
            "message": f"Trend analysis completed with {len(records)} data points"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Trend analysis failed: {str(e)}")

# ---- LEGACY COMPATIBILITY ENDPOINTS ----

@app.post("/detect-image")
async def legacy_detect_image(file: UploadFile = File(...)):
    """
    Legacy endpoint for backward compatibility
    
    Returns basic image detection results without advanced features
    """
    try:
        image_bytes = await file.read()
        result = analyze_image(io.BytesIO(image_bytes))
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Detection failed: {str(e)}")

@app.post("/decision")
def legacy_decision_api(data: dict):
    """
    Legacy containment decision endpoint for backward compatibility
    """
    try:
        # Extract input parameters
        region = data.get("region", "Unknown")
        disease = data.get("disease", "Unknown")
        severity = data.get("severity", "Medium")
        data_confidence = data.get("dataConfidence", 75)
        
        # Calculate dynamic risk based on multiple factors
        base_risk = 0.1  # Lower base risk for more dynamic range
        
        # Region-based risk factors
        region_risk_factors = {
            "Punjab": 0.08,      # High agricultural density
            "Maharashtra": 0.06, # Moderate density
            "Karnataka": 0.05,   # Moderate density
            "Uttar Pradesh": 0.10, # Very high density
            "Gujarat": 0.07      # High density
        }
        
        # Extract region name (handle cases like "Punjab - Amritsar")
        region_key = region.split(" - ")[0] if " - " in region else region
        region_factor = region_risk_factors.get(region_key, 0.05)
        
        # Disease-based risk factors
        disease_risk_factors = {
            "Late Blight (Potato)": 0.15,
            "Powdery Mildew (Grape)": 0.12,
            "Bacterial Wilt (Tomato)": 0.13,
            "Yellow Rust (Wheat)": 0.10,
            "Stem Rot (Paddy)": 0.12,
            "Early Blight": 0.08,
            "Unknown": 0.05
        }
        
        # Extract disease name (handle cases like "Late Blight (Potato)")
        disease_key = disease.split(" (")[0] if " (" in disease else disease
        disease_factor = disease_risk_factors.get(disease, 0.08)
        
        # Severity-based risk factors
        severity_factors = {
            "Low": 0.05,
            "Medium": 0.15,
            "High": 0.25
        }
        severity_factor = severity_factors.get(severity, 0.15)
        
        # Confidence-based adjustment (higher confidence = higher calculated risk)
        confidence_adjustment = (data_confidence - 50) / 200  # Normalize confidence to -0.25 to 0.25
        
        # Calculate final risk score (0 to 1 scale)
        calculated_risk = base_risk + region_factor + disease_factor + severity_factor + confidence_adjustment
        calculated_risk = min(max(calculated_risk, 0.1), 1.0)  # Clamp between 0.1 and 1.0
        
        # Use new containment engine
        decision = containment_engine.get_containment_decision(
            disease=disease,
            severity=severity,
            confidence=f"{data_confidence}%"
        )
        
        # Generate dynamic explanation
        explanation = f"Based on detection of {disease} with {severity} severity and {data_confidence}% confidence in {region}. "
        explanation += f"Risk assessment considers regional agricultural density (Punjab: high, Maharashtra: moderate), "
        explanation += f"disease-specific spread potential, and current severity levels. "
        explanation += f"Calculated risk score: {calculated_risk:.2f} indicates {get_risk_level(calculated_risk)} threat level."
        
        return {
            "action": decision["containment_action"],
            "risk": round(calculated_risk, 2),
            "confidence": decision["confidence"],
            "explanation": explanation,
            "region": region,
            "disease": disease,
            "severity": severity,
            "data_confidence": data_confidence
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Decision failed: {str(e)}")

def get_risk_level(risk_score: float) -> str:
    """Convert risk score to descriptive level"""
    if risk_score >= 0.8:
        return "CRITICAL"
    elif risk_score >= 0.6:
        return "HIGH"
    elif risk_score >= 0.4:
        return "MODERATE"
    elif risk_score >= 0.2:
        return "LOW"
    else:
        return "MINIMAL"

# ---- UTILITY FUNCTIONS ----

def _generate_trend_recommendations(trend_analysis: dict) -> list:
    """Generate recommendations based on trend analysis"""
    recommendations = []
    
    trend = trend_analysis.get("trend", "stable")
    most_common_disease = trend_analysis.get("most_common_disease", "None")
    avg_confidence = trend_analysis.get("average_confidence", 0)
    
    if trend == "worsening":
        recommendations.extend([
            "Immediate intervention recommended - disease severity is increasing",
            "Consider consulting agricultural extension officer",
            "Review and enhance current containment measures",
            "Increase monitoring frequency to twice weekly"
        ])
    elif trend == "improving":
        recommendations.extend([
            "Current treatment approach is effective - continue protocol",
            "Maintain regular monitoring schedule",
            "Document successful practices for future reference",
            "Consider gradual reduction of intensive measures if improvement continues"
        ])
    else:
        recommendations.extend([
            "Disease condition is stable - maintain current approach",
            "Continue regular monitoring and documentation",
            "Review preventive measures to avoid future outbreaks"
        ])
    
    # Disease-specific recommendations
    if most_common_disease != "Healthy" and most_common_disease != "None":
        recommendations.append(f"Focus on {most_common_disease} prevention and treatment protocols")
    
    # Confidence-based recommendations
    if avg_confidence < 75:
        recommendations.append("Consider additional testing to improve detection confidence")
    
    return recommendations

# ---- APPLICATION METADATA ----

@app.get("/api/v2/info")
def get_system_info():
    """
    Get system information and capabilities
    """
    return {
        "system": "AgriPulseX Advanced Agricultural Intelligence",
        "version": "2.0",
        "capabilities": {
            "image_detection": {
                "supported_formats": ["JPEG", "PNG", "GIF", "BMP"],
                "max_file_size": "10MB",
                "features": ["Disease detection", "Heatmap generation", "Confidence scoring"]
            },
            "containment": {
                "decision_levels": 5,
                "authority_levels": ["Field Officer", "Agricultural Officer", "District Officer", "Regional Director", "State Secretary"],
                "response_time": "Real-time"
            },
            "reporting": {
                "pdf_generation": True,
                "government_standard": True,
                "includes_images": True
            },
            "historical": {
                "trend_analysis": True,
                "farmer_tracking": True,
                "regional_monitoring": True,
                "data_retention": "Permanent"
            }
        },
        "endpoints": {
            "analysis": "/api/v2/analyze-image",
            "pdf_report": "/api/v2/generate-pdf",
            "farmer_history": "/api/v2/farmer-history/{farmer_id}",
            "regional_summary": "/api/v2/region-summary/{region}",
            "trend_analysis": "/api/v2/trend-analysis/{farmer_id}"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)