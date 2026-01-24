from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional
import uvicorn

app = FastAPI(title="AgriPulseX Simple Login API")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Pydantic Models
class LoginRequest(BaseModel):
    username: str
    password: str
    role: Optional[str] = None

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: dict
    role: str

# Simple Login - Accepts Any Credentials
@app.post("/api/auth/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    # Accept any username/password combination
    # Generate a simple token for any login
    access_token = f"simple_token_{request.username}_{request.password}"
    
    # Determine role based on username or provided role
    if request.role:
        role = request.role
    elif "officer" in request.username.lower():
        role = "officer"
    else:
        role = "field-employee"
    
    # Create user data based on role
    if role == "officer":
        user_data = {
            "name": "Dr. Rajesh Kumar Sharma",
            "designation": "District Agriculture Officer",
            "region": "Punjab - Ludhiana District",
            "employeeId": "DAO-PB-2018-4523",
            "department": "Department of Agriculture & Farmers Welfare",
            "email": request.username,
            "phone": "+91-161-2401234",
            "joinDate": "2018-03-15"
        }
    else:
        user_data = {
            "name": "Amit Sharma",
            "designation": "Field Extension Worker",
            "region": "Punjab - Ludhiana District",
            "employeeId": "FAT-PB-2021-7891",
            "department": "Field Operations Division",
            "email": request.username,
            "phone": "+91-183-5023456",
            "joinDate": "2021-06-20"
        }
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_data,
        "role": role
    }

# Simple User Info Endpoint
@app.get("/api/auth/me")
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    # For simple login, we'll just return basic user info
    # In a real app, you'd validate the token here
    
    # Default to officer if no specific role detected
    role = "field-employee"
    if "officer" in credentials.credentials.lower():
        role = "officer"
    
    if role == "officer":
        user_data = {
            "name": "Dr. Rajesh Kumar Sharma",
            "designation": "District Agriculture Officer",
            "region": "Punjab - Ludhiana District",
            "employeeId": "DAO-PB-2018-4523",
            "department": "Department of Agriculture & Farmers Welfare",
            "email": credentials.credentials,
            "phone": "+91-161-2401234",
            "joinDate": "2018-03-15"
        }
    else:
        user_data = {
            "name": "Amit Sharma",
            "designation": "Field Extension Worker",
            "region": "Punjab - Ludhiana District",
            "employeeId": "FAT-PB-2021-7891",
            "department": "Field Operations Division",
            "email": credentials.credentials,
            "phone": "+91-183-5023456",
            "joinDate": "2021-06-20"
        }
    
    return {
        "username": credentials.credentials,
        "role": role,
        "name": user_data["name"],
        "designation": user_data["designation"],
        "region": user_data["region"],
        "employeeId": user_data["employeeId"],
        "department": user_data["department"],
        "email": user_data["email"],
        "phone": user_data["phone"],
        "joinDate": user_data["joinDate"]
    }

# Health Check
@app.get("/")
async def root():
    return {"status": "Simple AgriPulseX Login API Running", "version": "1.0"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
