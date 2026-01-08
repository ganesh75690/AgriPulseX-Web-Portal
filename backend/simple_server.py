from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import json
from datetime import datetime

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/decision")
def decision_api(data: dict):
    """Simple decision endpoint for testing"""
    print(f"Received decision data: {data}")
    
    # Simple logic based on severity
    severity = data.get("severity", "Medium")
    if severity == "High":
        return {
            "action": "Strong Containment",
            "risk": 0.8,
            "confidence": "87%",
            "explanation": "High severity detected requiring immediate action"
        }
    elif severity == "Medium":
        return {
            "action": "Moderate Containment", 
            "risk": 0.5,
            "confidence": "75%",
            "explanation": "Medium severity requiring standard containment protocols"
        }
    else:
        return {
            "action": "Monitoring Only",
            "risk": 0.2,
            "confidence": "60%",
            "explanation": "Low severity, monitoring recommended"
        }

@app.post("/api/v2/analyze-image")
async def analyze_image(file: UploadFile = File(...), farmer_id: str = Form(""), region: str = Form("")):
    """Simple image analysis endpoint"""
    print(f"=== IMAGE ANALYSIS REQUEST ===")
    print(f"File received: {file.filename if file else 'None'}")
    print(f"Farmer ID: {farmer_id}")
    print(f"Region: {region}")
    print(f"Content type: {file.content_type if file else 'None'}")
    
    # Simulate processing
    await file.read()
    
    return {
        "data": {
            "analysis_id": f"ANL-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "timestamp": datetime.now().isoformat(),
            "farmer_id": farmer_id,
            "region": region,
            "image_analysis": {
                "disease": "Late Blight",
                "confidence": "85%",
                "severity": "High",
                "explanation": "Late blight detected with high confidence in potato leaves",
                "heatmap": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
            },
            "containment_decision": {
                "action": "Strong Containment",
                "level": 4,
                "measures": [
                    "Quarantine affected area (5km radius)",
                    "Apply approved fungicides immediately",
                    "Remove and destroy infected plants",
                    "Monitor neighboring fields daily"
                ],
                "timeline": "Immediate action + 21 days monitoring",
                "authority_level": "District Agricultural Officer",
                "explanation": "High severity late blight requires immediate containment action"
            },
            "quick_summary": {
                "status": "Critical",
                "urgency": "High",
                "next_steps": [
                    "Implement containment measures immediately",
                    "Notify neighboring farms",
                    "Schedule follow-up inspection in 7 days"
                ],
                "report_ready": True
            }
        }
    }

@app.post("/api/v2/generate-pdf")
async def generate_pdf(file: UploadFile = File(...), farmer_id: str = Form(""), region: str = Form("")):
    """Simple PDF generation endpoint"""
    print(f"Generating PDF for farmer {farmer_id} in {region}")
    
    # Simulate PDF generation
    await file.read()
    
    return {
        "message": "PDF generated successfully",
        "download_url": f"/api/v2/download/report-{datetime.now().strftime('%Y%m%d%H%M%S')}.pdf"
    }

@app.get("/api/v2/farmer-history/{farmer_id}")
def get_farmer_history(farmer_id: str, limit: int = 10):
    """Simple farmer history endpoint"""
    print(f"Getting history for farmer {farmer_id}")
    
    return {
        "farmer_id": farmer_id,
        "total_records": 3,
        "records": [
            {
                "analysis_id": "ANL-20240101080000",
                "timestamp": "2024-01-01T08:00:00",
                "disease": "Early Blight",
                "confidence": "72%",
                "severity": "Medium"
            },
            {
                "analysis_id": "ANL-20240101140000", 
                "timestamp": "2024-01-01T14:00:00",
                "disease": "Healthy",
                "confidence": "95%",
                "severity": "Low"
            },
            {
                "analysis_id": "ANL-20240102090000",
                "timestamp": "2024-01-02T09:00:00", 
                "disease": "Late Blight",
                "confidence": "88%",
                "severity": "High"
            }
        ]
    }

@app.get("/")
def root():
    return {"message": "AgriPulseX Backend is running"}

if __name__ == "__main__":
    import uvicorn
    print("Starting simple server on http://127.0.0.1:8001")
    uvicorn.run(app, host="127.0.0.1", port=8001)
