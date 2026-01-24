from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional
import jwt
from datetime import datetime, timedelta

app = FastAPI(title="AgriPulseX API", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://localhost:3002",
        "http://127.0.0.1:3002",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:52582",
        "http://127.0.0.1:52582",
        "https://695f974bdcf643fdd3303f75--brilliant-quokka-863185.netlify.app",
        "https://brilliant-quokka-863185.netlify.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock reports database
reports_db = []
report_id_counter = 1

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

# JWT Secret
SECRET_KEY = "your-secret-key-here"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

security = HTTPBearer()

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

@app.post("/api/auth/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    # Accept any login without credential validation
    # Generate user data based on role
    if request.role == "officer":
        user_data = {
            "name": "Government Officer",
            "designation": "District Agriculture Officer", 
            "region": "Punjab - Ludhiana District",
            "username": request.username or "officer@agri.gov.in",
            "role": "officer"
        }
    elif request.role == "field-employee":
        user_data = {
            "name": "Field Employee",
            "designation": "Field Extension Worker",
            "region": "Punjab - Ludhiana District", 
            "username": request.username or "field@agri.gov.in",
            "role": "field-employee"
        }
    else:
        raise HTTPException(status_code=400, detail="Invalid role")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_data["username"], "role": user_data["role"]}, 
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "name": user_data["name"],
            "designation": user_data["designation"],
            "region": user_data["region"]
        },
        "role": user_data["role"]
    }

@app.get("/api/auth/me")
async def get_current_user(current_user: dict = Depends(verify_token)):
    return current_user

# Village Aggregation Logic
def detect_village_clusters(reports):
    village_reports = {}
    for report in reports:
        village = report["village"]
        if village not in village_reports:
            village_reports[village] = []
        village_reports[village].append(report)
    
    clusters = []
    for village, v_reports in village_reports.items():
        if len(v_reports) >= 2:  # Cluster threshold
            clusters.append({
                "village": village,
                "report_count": len(v_reports),
                "diseases": list(set(r["disease"] for r in v_reports)),
                "severity": "high" if any(r["severity"] == "High" for r in v_reports) else "medium"
            })
    
    return clusters

@app.post("/api/reports", dependencies=[Depends(security)])
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
    
    # Check for village clusters
    clusters = detect_village_clusters(reports_db)
    for cluster in clusters:
        for report in reports_db:
            if report["village"] == cluster["village"]:
                report["cluster_detected"] = True
    
    return {"message": "Report submitted successfully", "report_id": new_report["id"]}

@app.get("/api/reports", dependencies=[Depends(security)])
async def get_reports(current_user: dict = Depends(verify_token)):
    if current_user["role"] != "officer":
        raise HTTPException(status_code=403, detail="Only officers can view reports")
    
    # Check for clusters
    clusters = detect_village_clusters(reports_db)
    
    return {
        "reports": reports_db,
        "clusters": clusters,
        "total_reports": len(reports_db),
        "new_reports": len([r for r in reports_db if r["status"] == "New"]),
        "clusters_detected": len(clusters)
    }

@app.get("/api/reports/{report_id}", dependencies=[Depends(security)])
async def get_report(report_id: str, current_user: dict = Depends(verify_token)):
    if current_user["role"] != "officer":
        raise HTTPException(status_code=403, detail="Only officers can view report details")
    
    report = next((r for r in reports_db if r["id"] == report_id), None)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    return report

@app.put("/api/reports/{report_id}/status", dependencies=[Depends(security)])
async def update_report_status(report_id: str, status: str, current_user: dict = Depends(verify_token)):
    if current_user["role"] != "officer":
        raise HTTPException(status_code=403, detail="Only officers can update report status")
    
    report = next((r for r in reports_db if r["id"] == report_id), None)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    report["status"] = status
    return {"message": f"Report status updated to {status}"}

@app.post("/api/reports/{report_id}/action", dependencies=[Depends(security)])
async def take_action_on_report(report_id: str, action_data: dict, current_user: dict = Depends(verify_token)):
    if current_user["role"] != "officer":
        raise HTTPException(status_code=403, detail="Only officers can take action on reports")
    
    report = next((r for r in reports_db if r["id"] == report_id), None)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    # Update report status
    report["status"] = "Action Required"
    report["action_taken"] = {
        "action_id": action_data.get("action", {}).get("id"),
        "action_title": action_data.get("action", {}).get("title"),
        "assigned_to": action_data.get("action", {}).get("responsible"),
        "notes": action_data.get("notes"),
        "timestamp": action_data.get("timestamp"),
        "initiated_by": current_user["username"]
    }
    
    # Simulate sending notifications to field teams
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
