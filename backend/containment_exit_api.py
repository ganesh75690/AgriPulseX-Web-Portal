from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v2", tags=["containment-exit"])

class ExitReadinessRequest(BaseModel):
    containment_id: Optional[str] = None
    disease_type: str
    severity: str
    containment_start_date: str
    affected_villages: int
    total_villages: int
    new_cases_last_24h: int
    new_cases_last_7d: int
    image_confidence_avg: float
    supply_routes_affected: int
    supply_routes_total: int
    field_data_confidence: float

class ExitReadinessResponse(BaseModel):
    exit_score: int
    status: str
    expected_days: str
    breakdown: Dict[str, str]
    recommendation: str
    factors: Dict[str, float]
    calculation_timestamp: str
    advisory_level: str

def get_disease_specific_factors(disease: str, severity: str) -> dict:
    """Get disease-specific factors for calculation"""
    disease_profiles = {
        'Late Blight (Potato)': {
            'spread_rate': 0.15 if severity == 'Critical' else 0.10 if severity == 'High' else 0.05,
            'recovery_time': 21 if severity == 'Critical' else 14 if severity == 'High' else 10,
            'image_detection_accuracy': 0.85,
            'route_impact': 0.7,
            'containment_duration_factor': 0.6 if severity == 'Critical' else 0.8,
            'critical_disease': True
        },
        'Powdery Mildew (Grape)': {
            'spread_rate': 0.12 if severity == 'Critical' else 0.08 if severity == 'High' else 0.04,
            'recovery_time': 18 if severity == 'Critical' else 12 if severity == 'High' else 8,
            'image_detection_accuracy': 0.90,
            'route_impact': 0.5,
            'containment_duration_factor': 0.7 if severity == 'Critical' else 0.9,
            'critical_disease': False
        },
        'Bacterial Wilt (Tomato)': {
            'spread_rate': 0.20 if severity == 'Critical' else 0.15 if severity == 'High' else 0.08,
            'recovery_time': 28 if severity == 'Critical' else 21 if severity == 'High' else 14,
            'image_detection_accuracy': 0.75,
            'route_impact': 0.8,
            'containment_duration_factor': 0.5 if severity == 'Critical' else 0.7,
            'critical_disease': True
        },
        'Yellow Rust (Wheat)': {
            'spread_rate': 0.18 if severity == 'Critical' else 0.12 if severity == 'High' else 0.06,
            'recovery_time': 25 if severity == 'Critical' else 18 if severity == 'High' else 12,
            'image_detection_accuracy': 0.88,
            'route_impact': 0.6,
            'containment_duration_factor': 0.6 if severity == 'Critical' else 0.8,
            'critical_disease': False
        },
        'Stem Rot (Paddy)': {
            'spread_rate': 0.14 if severity == 'Critical' else 0.09 if severity == 'High' else 0.05,
            'recovery_time': 20 if severity == 'Critical' else 15 if severity == 'High' else 10,
            'image_detection_accuracy': 0.82,
            'route_impact': 0.7,
            'containment_duration_factor': 0.7 if severity == 'Critical' else 0.9,
            'critical_disease': False
        }
    }
    
    return disease_profiles.get(disease, {
        'spread_rate': 0.08,
        'recovery_time': 14,
        'image_detection_accuracy': 0.80,
        'route_impact': 0.6,
        'containment_duration_factor': 0.8,
        'critical_disease': False
    })
    """Calculate disease spread reduction based on new case trends"""
    if new_cases_7d == 0:
        return 100.0
    
    daily_avg = new_cases_7d / 7
    if daily_avg == 0:
        return 100.0
    
    reduction_percentage = max(0, (daily_avg - new_cases_24h) / daily_avg * 100)
    return min(100, reduction_percentage)

def calculate_report_confidence(field_confidence: float, image_confidence: float) -> float:
    """Calculate overall report confidence"""
    return (field_confidence * 0.6 + image_confidence * 0.4)

def calculate_image_health_score(image_confidence: float) -> float:
    """Calculate image health score (inverse of infection confidence)"""
    return max(0, 100 - image_confidence)

def calculate_route_safety(affected_routes: int, total_routes: int) -> float:
    """Calculate supply route safety index"""
    if total_routes == 0:
        return 100.0
    
    safe_percentage = ((total_routes - affected_routes) / total_routes) * 100
    return safe_percentage

def calculate_containment_duration(start_date: str) -> float:
    """Calculate containment duration score (longer is better up to 14 days)"""
    try:
        start = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
        now = datetime.now()
        duration_days = (now - start).days
        
        # Optimal duration is 7-14 days
        if duration_days >= 14:
            return 100.0
        elif duration_days >= 7:
            return 80.0
        elif duration_days >= 4:
            return 60.0
        else:
            return (duration_days / 4) * 60
    except:
        return 50.0

def determine_status(exit_score: float) -> tuple[str, str, str]:
    """Determine exit status, expected days, and recommendation"""
    if exit_score < 40:
        status = "Unsafe"
        expected_days = "10+"
        recommendation = "Maintain strict containment. Disease spread still active. Reassess after 72 hours."
        advisory_level = "HIGH RISK"
    elif exit_score < 70:
        status = "Partial Exit Possible"
        expected_days = "4-6"
        recommendation = "Allow partial reopening of outer buffer zones. Maintain core containment for 72 more hours."
        advisory_level = "MODERATE RISK"
    else:
        status = "Safe Exit Recommended"
        expected_days = "1-3"
        recommendation = "Safe to gradually lift containment restrictions. Monitor for 48 hours post-exit."
        advisory_level = "LOW RISK"
    
    return status, expected_days, recommendation, advisory_level

def get_breakdown_status(factors: Dict[str, float]) -> Dict[str, str]:
    """Determine breakdown status for each factor"""
    breakdown = {}
    
    # Disease Spread Trend
    if factors['spread_reduction'] >= 80:
        breakdown['spread'] = 'decreasing'
    elif factors['spread_reduction'] >= 40:
        breakdown['spread'] = 'stable'
    else:
        breakdown['spread'] = 'increasing'
    
    # Image Health
    if factors['image_health'] >= 80:
        breakdown['imageHealth'] = 'high'
    elif factors['image_health'] >= 60:
        breakdown['imageHealth'] = 'moderate'
    else:
        breakdown['imageHealth'] = 'low'
    
    # Routes Safety
    if factors['route_safety'] >= 80:
        breakdown['routes'] = 'safe'
    elif factors['route_safety'] >= 60:
        breakdown['routes'] = 'caution'
    else:
        breakdown['routes'] = 'unsafe'
    
    # Confidence
    if factors['report_confidence'] >= 80:
        breakdown['confidence'] = 'high'
    elif factors['report_confidence'] >= 60:
        breakdown['confidence'] = 'moderate'
    else:
        breakdown['confidence'] = 'low'
    
    return breakdown

@router.post("/calculate-exit-readiness", response_model=ExitReadinessResponse)
async def calculate_exit_readiness(request: ExitReadinessRequest):
    """
    Calculate containment exit readiness score using explainable AI logic.
    
    This endpoint helps government officers determine when it's safe to lift
    containment restrictions after a plant disease outbreak.
    
    Calculation Formula:
    ExitScore = (SpreadReduction × 30%) + (ReportConfidence × 25%) + 
                (ImageHealthScore × 20%) + (RouteSafetyIndex × 15%) + 
                (ContainmentDuration × 10%)
    """
    try:
        logger.info(f"Calculating exit readiness for containment: {request.containment_id}")
        
        # Calculate individual factors
        spread_reduction = calculate_spread_reduction(
            request.new_cases_last_24h, 
            request.new_cases_last_7d
        )
        
        report_confidence = calculate_report_confidence(
            request.field_data_confidence, 
            request.image_confidence_avg
        )
        
        image_health_score = calculate_image_health_score(request.image_confidence_avg)
        
        route_safety_index = calculate_route_safety(
            request.supply_routes_affected, 
            request.supply_routes_total
        )
        
        containment_duration = calculate_containment_duration(request.containment_start_date)
        
        # Calculate weighted exit score
        exit_score = (
            (spread_reduction * 0.30) +
            (report_confidence * 0.25) +
            (image_health_score * 0.20) +
            (route_safety_index * 0.15) +
            (containment_duration * 0.10)
        )
        
        # Round to nearest integer
        exit_score = round(min(100, max(0, exit_score)))
        
        # Determine status and recommendations
        status, expected_days, recommendation, advisory_level = determine_status(exit_score)
        
        # Get breakdown status
        breakdown = get_breakdown_status({
            'spread_reduction': spread_reduction,
            'image_health': image_health_score,
            'route_safety': route_safety_index,
            'report_confidence': report_confidence
        })
        
        # Prepare factors for response
        factors = {
            'spread_reduction': round(spread_reduction, 1),
            'report_confidence': round(report_confidence, 1),
            'image_health_score': round(image_health_score, 1),
            'route_safety_index': round(route_safety_index, 1),
            'containment_duration': round(containment_duration, 1)
        }
        
        response = ExitReadinessResponse(
            exit_score=exit_score,
            status=status,
            expected_days=expected_days,
            breakdown=breakdown,
            recommendation=recommendation,
            factors=factors,
            calculation_timestamp=datetime.now().isoformat(),
            advisory_level=advisory_level
        )
        
        logger.info(f"Exit readiness calculated: {exit_score}% - {status}")
        return response
        
    except Exception as e:
        logger.error(f"Error calculating exit readiness: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to calculate exit readiness: {str(e)}")

@router.get("/exit-readiness-status/{containment_id}")
async def get_exit_readiness_status(containment_id: str):
    """Get current exit readiness status for a specific containment"""
    try:
        # This would typically fetch from database
        # For now, return a mock response
        mock_response = ExitReadinessResponse(
            exit_score=68,
            status="Partial Exit Possible",
            expected_days="4-6",
            breakdown={
                "spread": "stable",
                "imageHealth": "moderate",
                "routes": "safe",
                "confidence": "high"
            },
            recommendation="Allow partial reopening of outer buffer zones. Maintain core containment for 72 more hours.",
            factors={
                "spread_reduction": 65.0,
                "report_confidence": 85.0,
                "image_health_score": 70.0,
                "route_safety_index": 80.0,
                "containment_duration": 60.0
            },
            calculation_timestamp=datetime.now().isoformat(),
            advisory_level="MODERATE RISK"
        )
        
        return mock_response
        
    except Exception as e:
        logger.error(f"Error fetching exit readiness status: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch exit readiness status: {str(e)}")

@router.get("/exit-readiness-guidelines")
async def get_exit_readiness_guidelines():
    """Get official guidelines for containment exit readiness"""
    return {
        "title": "Plant Quarantine Order - Containment Exit Guidelines",
        "version": "2.0",
        "last_updated": datetime.now().isoformat(),
        "guidelines": {
            "score_interpretation": {
                "0-40": {
                    "status": "Unsafe to lift containment",
                    "action": "Maintain strict containment",
                    "monitoring": "Reassess every 24 hours"
                },
                "41-70": {
                    "status": "Partial exit possible",
                    "action": "Allow partial reopening of outer buffer zones",
                    "monitoring": "Reassess every 48 hours"
                },
                "71-100": {
                    "status": "Safe exit recommended",
                    "action": "Gradually lift containment restrictions",
                    "monitoring": "Monitor for 48 hours post-exit"
                }
            },
            "factor_weights": {
                "spread_reduction": "30%",
                "report_confidence": "25%",
                "image_health_score": "20%",
                "route_safety_index": "15%",
                "containment_duration": "10%"
            },
            "authority_levels": {
                "district_approval": "Required for partial exit",
                "state_approval": "Required for full exit",
                "national_monitoring": "Ongoing surveillance"
            },
            "post_exit_monitoring": {
                "duration": "Minimum 14 days",
                "reporting_frequency": "Daily for first 7 days, then every 3 days",
                "trigger_conditions": "Any new case triggers immediate reassessment"
            }
        },
        "contact_information": {
            "department": "Department of Agriculture",
            "emergency_hotline": "1800-180-1551",
            "email": "plant.quarantine@agri.gov.in"
        }
    }
