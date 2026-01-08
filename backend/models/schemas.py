from pydantic import BaseModel

class DecisionInput(BaseModel):
    severity: float
    confidence: float
    connectivity: float
    region: str
    disease: str

class DecisionOutput(BaseModel):
    action: str
    radius_km: int
    confidence: float
    explanation: list