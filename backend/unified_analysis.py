"""
Unified Agricultural Analysis System
Integrates image detection, heatmap generation, and containment decisions
"""

from typing import Dict, Any
from image_detection import analyze_image_optimized
from containment_engine import containment_engine

def unified_crop_analysis(image_bytes, farmer_id: str = None, region: str = None) -> Dict[str, Any]:
    """
    Perform comprehensive crop analysis combining:
    - Image disease detection
    - Heatmap generation
    - Containment decision mapping
    - Government-grade reporting
    
    Args:
        image_bytes: Raw image data for analysis
        farmer_id: Optional farmer identifier
        region: Optional regional information
        
    Returns:
        Complete analysis results with containment recommendations
    """
    
    try:
        print(f"Starting analysis with {len(image_bytes)} bytes")
        
        # Step 1: Perform optimized image analysis
        print("Step 1: Performing image analysis...")
        image_results = analyze_image_optimized(image_bytes)
        print("Image analysis completed successfully")
        
        # Step 2: Generate containment decision
        print("Step 2: Generating containment decision...")
        containment_decision = containment_engine.get_containment_decision(
            disease=image_results["disease"],
            severity=image_results["severity"],
            confidence=image_results["confidence"]
        )
        print("Containment decision generated successfully")
        
        # Step 3: Create unified response
        print("Step 3: Creating unified response...")
        unified_results = {
            "analysis_id": f"ANA_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "timestamp": datetime.now().isoformat(),
            "farmer_id": farmer_id,
            "region": region,
            
            # Image Analysis Results
            "image_analysis": {
                "disease": image_results["disease"],
                "confidence": image_results["confidence"],
                "severity": image_results["severity"],
                "explanation": image_results["explanation"],
                "heatmap": image_results["heatmap"]
            },
            
            # Containment Decision
            "containment_decision": {
                "action": containment_decision["containment_action"],
                "level": containment_decision["containment_level"],
                "measures": containment_decision["measures"],
                "timeline": containment_decision["timeline"],
                "authority_level": containment_decision["authority_level"],
                "explanation": containment_decision["decision_explanation"]
            },
            
            # Summary for Quick Action
            "quick_summary": {
                "status": "Healthy" if image_results["disease"] == "Healthy" else "Action Required",
                "urgency": "Low" if image_results["severity"] == "Low" else 
                         "Medium" if image_results["severity"] == "Medium" else "High",
                "next_steps": containment_decision["measures"][:2],  # First 2 critical steps
                "report_ready": True
            }
        }
        
        print("Unified analysis completed successfully")
        return unified_results
        
    except Exception as e:
        print(f"Error in unified_crop_analysis: {type(e).__name__}: {str(e)}")
        raise e

from datetime import datetime
