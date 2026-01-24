from fastapi import FastAPI, File, UploadFile, HTTPException, Query, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, List
import io
import base64
from datetime import datetime, timedelta
import os
import jwt

# Import our advanced analysis modules
from image_detection import analyze_image
from unified_analysis import unified_crop_analysis
from containment_engine import containment_engine
from pdf_generator import pdf_generator
from historical_analysis import historical_engine
from village_analysis import village_engine

app = FastAPI(
    title="AgriPulseX Unified Agricultural Intelligence",
    description="Complete Government-Grade AI System for Crop Disease Management",
    version="3.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "http://localhost:3002",
    "http://127.0.0.1:3002",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://695f974bdcf643fdd3303f75--brilliant-quokka-863185.netlify.app",
    "https://brilliant-quokka-863185.netlify.app"
]

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

# JWT Configuration
SECRET_KEY = "agripulse-secret-key-2024"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

security = HTTPBearer()

class RegistrationRequest(BaseModel):
    name: str
    email: str
    employee_id: str
    designation: str
    department: str
    password: str
    role: str

class RegistrationResponse(BaseModel):
    message: str
    user: dict

# Mock Database
users_db = {
    "officer": {
        "username": "officer@agri.gov.in",
        "password": "officer123",
        "role": "officer",
        "name": "Dr. Rajesh Kumar Sharma",
        "designation": "District Agriculture Officer",
        "region": "Punjab - Ludhiana District",
        "employeeId": "DAO-PB-2018-4523",
        "department": "Department of Agriculture & Farmers Welfare",
        "email": "rajesh.sharma@agri.gov.in",
        "phone": "+91-161-2401234",
        "joinDate": "2018-03-15"
    },
    "field_employee": {
        "username": "field@agri.gov.in", 
        "password": "field123",
        "role": "field-employee",
        "name": "Amit Sharma",
        "designation": "Field Extension Worker",
        "region": "Punjab - Ludhiana District",
        "employeeId": "FAT-PB-2021-7891",
        "department": "Field Operations Division",
        "email": "amit.singh@agri.gov.in",
        "phone": "+91-183-5023456",
        "joinDate": "2021-06-20"
    }
}

# Additional storage for registered users
registered_users_db = {}

reports_db = []
report_id_counter = 1

# Pydantic Models
class LoginRequest(BaseModel):
    username: str
    password: str
    role: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: dict
    role: str

class ReportRequest(BaseModel):
    farmer_name: str
    farmer_id: str
    village: str
    district: str
    crop_type: str
    disease: str
    confidence: int
    severity: str
    image_url: str
    submitted_by: str

class AnalysisRequest(BaseModel):
    farmer_id: Optional[str] = None
    region: Optional[str] = None

class HistoricalRequest(BaseModel):
    farmer_id: Optional[str] = None
    region: Optional[str] = None
    days: Optional[int] = 30

# JWT Functions
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        role: str = payload.get("role")
        if username is None or role is None:
            raise HTTPException(status_code=401, detail="Invalid authentication")
        return {"username": username, "role": role}
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication")

# AUTHENTICATION ENDPOINTS
@app.post("/api/auth/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    user = None
    for role, user_data in users_db.items():
        if user_data["username"] == request.username and user_data["password"] == request.password:
            if role == request.role:
                user = user_data
                break
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"], "role": user["role"]}, 
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "name": user["name"],
            "designation": user["designation"],
            "region": user["region"],
            "employeeId": user.get("employeeId"),
            "department": user.get("department"),
            "email": user.get("email"),
            "phone": user.get("phone"),
            "joinDate": user.get("joinDate")
        },
        "role": user["role"]
    }

@app.post("/api/auth/register")
async def register(request: RegistrationRequest):
    try:
        # Check if user already exists
        for key, user_data in {**users_db, **registered_users_db}.items():
            if user_data["username"] == request.email:
                return {
                    "message": f"User with email {request.email} already exists",
                    "status": "error"
                }
        
        # Add new user to registered_users_db
        new_user = {
            "username": request.email,
            "password": request.password,
            "role": request.role,
            "name": request.name,
            "designation": request.designation,
            "region": "Unknown",  # Would be set based on role
            "employeeId": request.employee_id,
            "department": request.department,
            "email": request.email,
            "phone": "Unknown",  # Would be set during registration
            "joinDate": datetime.now().strftime("%Y-%m-%d")
        }
        
        # Store new user in registered_users_db
        user_key = f"registered_{request.role}_{request.email}"
        registered_users_db[user_key] = new_user
        
        # Auto-login after registration
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": new_user["username"], "role": new_user["role"]}, 
            expires_delta=access_token_expires
        )
        
        return {
            "message": "Registration successful",
            "status": "success",
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "username": new_user["username"],
                "role": new_user["role"],
                "name": new_user["name"],
                "designation": new_user["designation"],
                "region": new_user["region"],
                "employeeId": new_user["employeeId"],
                "department": new_user["department"],
                "email": new_user["email"],
                "phone": new_user["phone"],
                "joinDate": new_user["joinDate"]
            }
        }
        
    except Exception as e:
        return {
            "message": f"Registration failed: {str(e)}",
            "status": "error"
        }

@app.get("/api/auth/me")
async def get_current_user(current_user: dict = Depends(verify_token)):
    try:
        # Find user by username in database (check both original and registered users)
        user_data = None
        for key, data in {**users_db, **registered_users_db}.items():
            if data["username"] == current_user["username"]:
                user_data = data
                break
        
        if not user_data:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {
            "username": user_data["username"],
            "role": user_data["role"],
            "name": user_data["name"],
            "designation": user_data["designation"],
            "region": user_data["region"],
            "employeeId": user_data.get("employeeId"),
            "department": user_data.get("department"),
            "email": user_data.get("email"),
            "phone": user_data.get("phone"),
            "joinDate": user_data.get("joinDate")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving user data: {str(e)}")

# REPORTS MANAGEMENT ENDPOINTS
def detect_village_clusters(reports):
    village_reports = {}
    for report in reports:
        village = report["village"]
        if village not in village_reports:
            village_reports[village] = []
        village_reports[village].append(report)
    
    clusters = []
    for village, v_reports in village_reports.items():
        if len(v_reports) >= 2:
            clusters.append({
                "village": village,
                "report_count": len(v_reports),
                "diseases": list(set(r["disease"] for r in v_reports)),
                "severity": "high" if any(r["severity"] == "High" for r in v_reports) else "medium"
            })
    
    return clusters

@app.post("/api/reports", dependencies=[Depends(verify_token)])
async def submit_report(report: ReportRequest, current_user: dict = Depends(verify_token)):
    global report_id_counter
    
    if current_user["role"] != "field-employee":
        raise HTTPException(status_code=403, detail="Only field employees can submit reports")
    
    new_report = {
        "id": f"F2024-{report_id_counter:03d}",
        **report.dict(),
        "status": "New",
        "submitted_date": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "cluster_detected": False
    }
    
    reports_db.append(new_report)
    report_id_counter += 1
    
    clusters = detect_village_clusters(reports_db)
    for cluster in clusters:
        for report in reports_db:
            if report["village"] == cluster["village"]:
                report["cluster_detected"] = True
    
    return {"message": "Report submitted successfully", "report_id": new_report["id"]}

@app.get("/api/reports", dependencies=[Depends(verify_token)])
async def get_reports(current_user: dict = Depends(verify_token)):
    if current_user["role"] != "officer":
        raise HTTPException(status_code=403, detail="Only officers can view reports")
    
    clusters = detect_village_clusters(reports_db)
    
    return {
        "reports": reports_db,
        "clusters": clusters,
        "total_reports": len(reports_db),
        "new_reports": len([r for r in reports_db if r["status"] == "New"]),
        "clusters_detected": len(clusters)
    }

@app.get("/api/reports/{report_id}", dependencies=[Depends(verify_token)])
async def get_report(report_id: str, current_user: dict = Depends(verify_token)):
    if current_user["role"] != "officer":
        raise HTTPException(status_code=403, detail="Only officers can view report details")
    
    report = next((r for r in reports_db if r["id"] == report_id), None)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    return report

@app.put("/api/reports/{report_id}/status", dependencies=[Depends(verify_token)])
async def update_report_status(report_id: str, status: str, current_user: dict = Depends(verify_token)):
    if current_user["role"] != "officer":
        raise HTTPException(status_code=403, detail="Only officers can update report status")
    
    report = next((r for r in reports_db if r["id"] == report_id), None)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    report["status"] = status
    return {"message": f"Report status updated to {status}"}

@app.post("/api/reports/{report_id}/action", dependencies=[Depends(verify_token)])
async def take_action_on_report(report_id: str, action_data: dict, current_user: dict = Depends(verify_token)):
    if current_user["role"] != "officer":
        raise HTTPException(status_code=403, detail="Only officers can take action on reports")
    
    report = next((r for r in reports_db if r["id"] == report_id), None)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    report["status"] = "Action Required"
    report["action_taken"] = {
        "action_id": action_data.get("action", {}).get("id"),
        "action_title": action_data.get("action", {}).get("title"),
        "assigned_to": action_data.get("action", {}).get("responsible"),
        "notes": action_data.get("notes"),
        "timestamp": action_data.get("timestamp"),
        "initiated_by": current_user["username"]
    }
    
    notification = {
        "type": "containment_action",
        "report_id": report_id,
        "action": action_data.get("action", {}),
        "assigned_to": action_data.get("action", {}).get("responsible"),
        "location": f"{report['village']}, {report['district']}",
        "urgency": "high" if report["severity"] == "High" else "medium"
    }
    
    return {
        "message": "Action initiated successfully",
        "action_id": action_data.get("action", {}).get("id"),
        "report_id": report_id,
        "notification_sent": True,
        "assigned_to": action_data.get("action", {}).get("responsible"),
        "estimated_completion": action_data.get("action", {}).get("timeToImplement")
    }

# IMAGE ANALYSIS ENDPOINTS
@app.post("/api/v2/analyze-image")
async def analyze_crop_image(
    file: UploadFile = File(...),
    farmer_id: Optional[str] = Form(None, description="Farmer identifier"),
    region: Optional[str] = Form(None, description="Agricultural region")
):
    try:
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        image_bytes = await file.read()
        print(f"Received image: {len(image_bytes)} bytes, type: {type(image_bytes)}")
        
        try:
            from image_detection import analyze_image_optimized
            image_results = analyze_image_optimized(image_bytes)
            print("Basic image analysis successful")
            
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
    try:
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        image_bytes = await file.read()
        
        from image_detection import analyze_image_optimized
        image_results = analyze_image_optimized(image_bytes)
        
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
        
        pdf_bytes = pdf_generator.generate_report(analysis_results, image_bytes)
        
        return StreamingResponse(
            io.BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=agri_report_{analysis_results['analysis_id']}.pdf"}
        )
        
    except Exception as e:
        print(f"PDF generation error: {type(e).__name__}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")

# HISTORICAL ANALYSIS ENDPOINTS
@app.get("/api/v2/farmer-history/{farmer_id}")
def get_farmer_history(
    farmer_id: str,
    limit: int = Query(10, description="Maximum number of records to return")
):
    try:
        records = historical_engine.get_farmer_history(farmer_id, limit)
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
    try:
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
    try:
        records = historical_engine.get_farmer_history(farmer_id, limit=50)
        
        if not records:
            return {
                "success": True,
                "farmer_id": farmer_id,
                "trend": "insufficient_data",
                "message": "No historical data available for trend analysis",
                "recommendations": ["Continue regular monitoring to establish baseline"]
            }
        
        trend_analysis = historical_engine.analyze_trend(records)
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

# LEGACY ENDPOINTS FOR BACKWARD COMPATIBILITY
@app.post("/detect-image")
async def legacy_detect_image(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        result = analyze_image(io.BytesIO(image_bytes))
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Detection failed: {str(e)}")

@app.post("/decision")
def legacy_decision_api(data: dict):
    try:
        region = data.get("region", "Unknown")
        disease = data.get("disease", "Unknown")
        severity = data.get("severity", "Medium")
        data_confidence = data.get("dataConfidence", 75)
        
        base_risk = 0.1
        
        region_risk_factors = {
            "Punjab": 0.08,
            "Maharashtra": 0.06,
            "Karnataka": 0.05,
            "Uttar Pradesh": 0.10,
            "Gujarat": 0.07
        }
        
        region_key = region.split(" - ")[0] if " - " in region else region
        region_factor = region_risk_factors.get(region_key, 0.05)
        
        disease_risk_factors = {
            "Late Blight (Potato)": 0.15,
            "Powdery Mildew (Grape)": 0.12,
            "Bacterial Wilt (Tomato)": 0.13,
            "Yellow Rust (Wheat)": 0.10,
            "Stem Rot (Paddy)": 0.12,
            "Early Blight": 0.08,
            "Unknown": 0.05
        }
        
        disease_key = disease.split(" (")[0] if " (" in disease else disease
        disease_factor = disease_risk_factors.get(disease, 0.08)
        
        severity_factors = {
            "Low": 0.05,
            "Medium": 0.15,
            "High": 0.25
        }
        severity_factor = severity_factors.get(severity, 0.15)
        
        confidence_adjustment = (data_confidence - 50) / 200
        
        calculated_risk = base_risk + region_factor + disease_factor + severity_factor + confidence_adjustment
        calculated_risk = min(max(calculated_risk, 0.1), 1.0)
        
        decision = containment_engine.get_containment_decision(
            disease=disease,
            severity=severity,
            confidence=f"{data_confidence}%"
        )
        
        explanation = f"Based on detection of {disease} with {severity} severity and {data_confidence}% confidence in {region}. "
        explanation += f"Risk assessment considers regional agricultural density, disease-specific spread potential, and current severity levels. "
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

# UTILITY FUNCTIONS
def get_risk_level(risk_score: float) -> str:
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

def _generate_trend_recommendations(trend_analysis: dict) -> list:
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
    
    if most_common_disease != "Healthy" and most_common_disease != "None":
        recommendations.append(f"Focus on {most_common_disease} prevention and treatment protocols")
    
    if avg_confidence < 75:
        recommendations.append("Consider additional testing to improve detection confidence")
    
    return recommendations

# SYSTEM INFO ENDPOINTS
@app.get("/")
def root():
    return {
        "status": "AgriPulseX Unified Backend Running",
        "version": "3.0",
        "features": [
            "Complete Authentication System",
            "Image Disease Detection with Heatmap",
            "Auto-Containment Decision Mapping", 
            "PDF Report Generation",
            "Historical Trend Analysis",
            "Report Management System",
            "Employee & Admin Workflows"
        ]
    }

@app.get("/api/v2/info")
def get_system_info():
    return {
        "system": "AgriPulseX Unified Agricultural Intelligence",
        "version": "3.0",
        "capabilities": {
            "authentication": {
                "jwt_tokens": True,
                "role_based_access": True,
                "multi_user_support": True
            },
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
                "includes_images": True,
                "report_management": True
            },
            "historical": {
                "trend_analysis": True,
                "farmer_tracking": True,
                "regional_monitoring": True,
                "data_retention": "Permanent"
            }
        },
        "endpoints": {
            "auth": {
                "login": "/api/auth/login",
                "current_user": "/api/auth/me"
            },
            "reports": {
                "submit": "/api/reports",
                "list": "/api/reports",
                "details": "/api/reports/{report_id}",
                "update_status": "/api/reports/{report_id}/status",
                "take_action": "/api/reports/{report_id}/action"
            },
            "analysis": {
                "analyze_image": "/api/v2/analyze-image",
                "generate_pdf": "/api/v2/generate-pdf",
                "farmer_history": "/api/v2/farmer-history/{farmer_id}",
                "regional_summary": "/api/v2/region-summary/{region}",
                "trend_analysis": "/api/v2/trend-analysis/{farmer_id}"
            },
            "legacy": {
                "detect_image": "/detect-image",
                "decision": "/decision"
            }
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
