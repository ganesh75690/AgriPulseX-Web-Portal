from flask import Flask, request, jsonify
from flask_cors import CORS
import logging

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/api/v2/impact-recommendation', methods=['POST'])
def calculate_impact_recommendation():
    """
    Impact Recommendation Lens (IRL) API
    Translates farmer income loss calculations into policy-ready decision guidance
    """
    try:
        data = request.get_json()
        
        # Extract input parameters
        income_loss = data.get('income_loss', 0)
        income_saved = data.get('income_saved', 0)
        farms_affected = data.get('farms_affected', 0)
        region = data.get('region', 'Unknown')
        
        # Policy thresholds (in rupees)
        district_threshold = data.get('district_threshold', 5000000)  # ₹50L
        state_threshold = data.get('state_threshold', 15000000)      # ₹150L
        
        # Impact classification logic
        if income_loss < district_threshold:
            impact_status = "Acceptable"
            recommendation = "Current containment measures are appropriate. Continue monitoring market indicators."
            reasons = [
                "Loss within district tolerance limits",
                "Minimal farmer distress expected", 
                "Market stability maintained"
            ]
        elif income_loss < state_threshold:
            impact_status = "Sensitive"
            recommendation = "Phased containment with route-level restriction advised. Monitor farmer distress weekly."
            reasons = [
                "Loss exceeds district threshold but within state limits",
                "Moderate farmer distress risk",
                "Supply chain disruption observed"
            ]
        else:
            impact_status = "Critical"
            recommendation = "Consider reducing containment radius or implementing targeted restrictions only."
            reasons = [
                "Loss exceeds state tolerance levels",
                "High farmer distress risk",
                "Economic instability likely"
            ]
        
        # Generate additional context-specific reasons
        if farms_affected > 1000:
            reasons.append("High farm density in affected area")
        elif farms_affected > 500:
            reasons.append("Moderate farm concentration observed")
            
        if income_saved > 0:
            reasons.append("Containment measures showing positive economic impact")
        
        response = {
            "income_loss": income_loss,
            "income_saved": income_saved,
            "impact_status": impact_status,
            "recommendation": recommendation,
            "reason": reasons,
            "district_threshold": district_threshold,
            "state_threshold": state_threshold,
            "farms_affected": farms_affected,
            "region": region,
            "policy_guidance": {
                "advisory_level": impact_status,
                "action_required": "immediate" if impact_status == "Critical" else "monitor" if impact_status == "Sensitive" else "continue",
                "review_frequency": "daily" if impact_status == "Critical" else "weekly" if impact_status == "Sensitive" else "monthly"
            }
        }
        
        logger.info(f"IRL calculation completed: {impact_status} impact for {region}")
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Error in impact recommendation calculation: {str(e)}")
        return jsonify({
            "error": "Failed to calculate impact recommendation",
            "details": str(e)
        }), 500

@app.route('/api/v2/impact-recommendation/sample', methods=['GET'])
def get_sample_impact_data():
    """
    Returns sample IRL data for testing and demonstration
    """
    sample_data = [
        {
            "income_loss": 12400000,
            "income_saved": 8600000,
            "impact_status": "Sensitive",
            "recommendation": "Partial containment with route-level restriction advised.",
            "reason": ["High farm density", "Moderate supply-chain dependency", "Perishable crop category"],
            "district_threshold": 5000000,
            "state_threshold": 15000000,
            "farms_affected": 850,
            "region": "Punjab"
        },
        {
            "income_loss": 3200000,
            "income_saved": 12000000,
            "impact_status": "Acceptable",
            "recommendation": "Current containment measures are appropriate. Continue monitoring market indicators.",
            "reason": ["Loss within district limits", "Low farmer distress", "Stable market conditions"],
            "district_threshold": 5000000,
            "state_threshold": 15000000,
            "farms_affected": 120,
            "region": "Gujarat"
        },
        {
            "income_loss": 28000000,
            "income_saved": 15000000,
            "impact_status": "Critical",
            "recommendation": "Consider reducing containment radius or implementing targeted restrictions only.",
            "reason": ["Loss exceeds state tolerance", "High farmer distress risk", "Economic instability likely"],
            "district_threshold": 5000000,
            "state_threshold": 15000000,
            "farms_affected": 2100,
            "region": "Uttar Pradesh"
        }
    ]
    
    return jsonify({
        "samples": sample_data,
        "description": "Sample Impact Recommendation Lens data for testing"
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
