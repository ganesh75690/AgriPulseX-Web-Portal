from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from datetime import datetime
from typing import List, Dict, Any, Optional
import uuid
import re

app = FastAPI(title="AgriPulseX Backend", version="1.0.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Mock Database
users_db = {
    "field@agri.gov.in": {
        "id": "user_1",
        "email": "field@agri.gov.in",
        "password": "field123",
        "name": "Field Employee",
        "role": "field-employee",
        "token": "field_token_12345"
    },
    "officer@agri.gov.in": {
        "id": "user_2", 
        "email": "officer@agri.gov.in",
        "password": "officer123",
        "name": "Agricultural Officer",
        "role": "officer",
        "token": "officer_token_67890"
    }
}

reports_db = []
report_id_counter = 1

# Pydantic Models
class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    token: str
    user: Dict[str, Any]

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

class ImageAnalysis(BaseModel):
    disease: str
    confidence: str
    severity: str

# Helper Functions
def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    print(f"🔍 Backend received token: {token}")
    
    # Check for mock tokens from frontend
    if token and token.startswith('mock-jwt-token-'):
        print("✅ Mock token detected, allowing access")
        return {
            "id": "user_1",
            "email": "field@agri.gov.in",
            "name": "Field Employee",
            "role": "field-employee"
        }
    
    # Check real tokens in database
    for user in users_db.values():
        if user.get("token") == token:
            print(f"✅ Real token found for user: {user['email']}")
            return user
    
    print("❌ Invalid token - rejecting access")
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid token"
    )

def detect_village_clusters(reports: List[Dict]) -> List[Dict]:
    """Simple clustering logic based on village"""
    village_counts = {}
    for report in reports:
        village = report.get("village", "Unknown")
        village_counts[village] = village_counts.get(village, 0) + 1
    
    clusters = []
    for village, count in village_counts.items():
        if count >= 2:  # Cluster if 2+ reports from same village
            clusters.append({
                "village": village,
                "report_count": count,
                "severity": "High"
            })
    
    return clusters

# API Endpoints
@app.post("/api/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    user = users_db.get(request.email)
    
    if not user or user["password"] != request.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    return LoginResponse(
        token=user["token"],
        user={
            "id": user["id"],
            "email": user["email"],
            "name": user["name"],
            "role": user["role"]
        }
    )

@app.post("/api/reports/analyze", response_model=Dict[str, Any])
async def analyze_image(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Mock image analysis endpoint"""
    current_user = verify_token(credentials)
    
    if current_user["role"] != "field-employee":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only field employees can analyze images"
        )
    
    # Mock analysis results
    diseases = ["Leaf Rust", "Wheat Blast", "Powdery Mildew", "Bacterial Blight"]
    severities = ["Low", "Medium", "High"]
    
    return {
        "success": True,
        "data": {
            "image_analysis": {
                "disease": diseases[report_id_counter % len(diseases)],
                "confidence": f"{75 + (report_id_counter % 20)}%",
                "severity": severities[report_id_counter % len(severities)]
            }
        }
    }

@app.post("/api/reports", response_model=Dict[str, str])
async def submit_report(
    report: ReportRequest,
    current_user: Dict = Depends(verify_token)
):
    global report_id_counter
    
    if current_user["role"] != "field-employee":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only field employees can submit reports"
        )
    
    new_report = {
        "id": f"F2024-{report_id_counter:03d}",
        **report.dict(),
        "status": "New",
        "submitted_date": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "cluster_detected": False,
        "imageUrl": report.image_url if report.image_url else ""
    }
    
    reports_db.append(new_report)
    report_id_counter += 1
    
    # Check for village clusters
    clusters = detect_village_clusters(reports_db)
    for cluster in clusters:
        for report in reports_db:
            if report["village"] == cluster["village"]:
                report["cluster_detected"] = True
    
    return {"message": "Report submitted successfully", "report_id": new_report["id"]}

@app.get("/api/reports", response_model=Dict[str, Any])
async def get_reports(current_user: Dict = Depends(verify_token)):
    print(f"🔍 Get reports called by user: {current_user['email']}, role: {current_user['role']}")
    
    # Allow both officers and field employees to view reports
    if current_user["role"] not in ["officer", "field-employee"]:
        print(f"❌ Access denied for role: {current_user['role']}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only officers and field employees can view reports"
        )
    
    print(f"✅ Access granted for {current_user['role']}")
    
    # Check for clusters
    clusters = detect_village_clusters(reports_db)
    
    return {
        "reports": reports_db,
        "clusters": clusters,
        "total_reports": len(reports_db),
        "new_reports": len([r for r in reports_db if r["status"] == "New"]),
        "clusters_detected": len(clusters)
    }

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("start_backend:app", host="0.0.0.0", port=8000, reload=True)
