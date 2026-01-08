"""
Government-Grade Agricultural Containment Decision Engine
Maps disease detection results to appropriate containment actions
"""

from typing import Dict, Any
from datetime import datetime

class ContainmentDecisionEngine:
    """
    Converts disease detection results into containment recommendations
    following government agricultural protocols
    """
    
    def __init__(self):
        # Government-standard containment protocols
        self.containment_matrix = {
            "Healthy": {
                "Low": {
                    "action": "Routine Monitoring",
                    "level": 1,
                    "measures": [
                        "Continue regular field inspections",
                        "Maintain crop health monitoring",
                        "Document baseline conditions"
                    ],
                    "timeline": "Weekly monitoring",
                    "authority_level": "Field Officer"
                }
            },
            "Early Blight": {
                "Low": {
                    "action": "Targeted Treatment",
                    "level": 2,
                    "measures": [
                        "Apply approved fungicides within 48 hours",
                        "Remove affected plant parts",
                        "Increase monitoring frequency to twice weekly"
                    ],
                    "timeline": "Immediate action + 2 weeks monitoring",
                    "authority_level": "Agricultural Officer"
                },
                "Medium": {
                    "action": "Moderate Containment",
                    "level": 3,
                    "measures": [
                        "Quarantine affected zone (50m radius)",
                        "Systematic fungicide application",
                        "Soil treatment and nutrient management",
                        "Daily monitoring for 7 days"
                    ],
                    "timeline": "Immediate + 4 weeks monitoring",
                    "authority_level": "District Agriculture Officer"
                },
                "High": {
                    "action": "Strong Containment",
                    "level": 4,
                    "measures": [
                        "Immediate field quarantine (100m radius)",
                        "Emergency fungicide protocol",
                        "Crop rotation recommendation",
                        "Regional notification system activation"
                    ],
                    "timeline": "Emergency response + 6 weeks monitoring",
                    "authority_level": "Regional Director"
                }
            },
            "Late Blight": {
                "Low": {
                    "action": "Rapid Response",
                    "level": 3,
                    "measures": [
                        "Immediate fungicide application",
                        "Field boundary establishment",
                        "Weather monitoring integration",
                        "Neighbor farm notification"
                    ],
                    "timeline": "Within 24 hours + 3 weeks monitoring",
                    "authority_level": "District Agriculture Officer"
                },
                "Medium": {
                    "action": "Emergency Containment",
                    "level": 4,
                    "measures": [
                        "Field quarantine (200m radius)",
                        "Aggressive treatment protocol",
                        "Community advisory issuance",
                        "Supply chain notification"
                    ],
                    "timeline": "Within 12 hours + 6 weeks monitoring",
                    "authority_level": "Regional Director"
                },
                "High": {
                    "action": "Critical Response",
                    "level": 5,
                    "measures": [
                        "Regional emergency declaration",
                        "Multi-field coordinated response",
                        "State agricultural authority notification",
                        "Public health advisory coordination"
                    ],
                    "timeline": "Immediate + 8 weeks monitoring",
                    "authority_level": "State Agriculture Secretary"
                }
            },
            "Unknown Stress": {
                "Low": {
                    "action": "Investigation Required",
                    "level": 2,
                    "measures": [
                        "Laboratory sample collection",
                        "Expert consultation request",
                        "Enhanced monitoring protocol",
                        "Preventive measures implementation"
                    ],
                    "timeline": "Sample analysis + 2 weeks monitoring",
                    "authority_level": "Agricultural Officer"
                },
                "Medium": {
                    "action": "Expert Assessment",
                    "level": 3,
                    "measures": [
                        "Pathology laboratory testing",
                        "Regional expert deployment",
                        "Precautionary containment measures",
                        "Stakeholder notification"
                    ],
                    "timeline": "Expert analysis + 4 weeks monitoring",
                    "authority_level": "District Agriculture Officer"
                },
                "High": {
                    "action": "Emergency Investigation",
                    "level": 4,
                    "measures": [
                        "State laboratory priority testing",
                        "Emergency expert team deployment",
                        "Temporary containment measures",
                        "Regional agricultural alert"
                    ],
                    "timeline": "Priority analysis + 6 weeks monitoring",
                    "authority_level": "Regional Director"
                }
            }
        }
    
    def get_containment_decision(self, disease: str, severity: str, confidence: str) -> Dict[str, Any]:
        """
        Generate containment decision based on disease detection results
        
        Args:
            disease: Detected disease name
            severity: Severity level (Low/Medium/High)
            confidence: Detection confidence percentage
            
        Returns:
            Dictionary containing complete containment recommendation
        """
        
        # Extract numeric confidence
        confidence_value = int(confidence.replace('%', ''))
        
        # Get base containment protocol
        if disease in self.containment_matrix and severity in self.containment_matrix[disease]:
            base_protocol = self.containment_matrix[disease][severity]
        else:
            # Fallback to Unknown Stress protocol
            base_protocol = self.containment_matrix["Unknown Stress"]["Medium"]
        
        # Adjust confidence-based modifiers
        if confidence_value >= 90:
            confidence_modifier = "High confidence - Immediate action recommended"
        elif confidence_value >= 75:
            confidence_modifier = "Moderate confidence - Proceed with standard protocol"
        else:
            confidence_modifier = "Lower confidence - Consider additional verification"
        
        # Generate comprehensive decision
        decision = {
            "disease": disease,
            "severity": severity,
            "confidence": confidence,
            "containment_action": base_protocol["action"],
            "containment_level": base_protocol["level"],
            "measures": base_protocol["measures"],
            "timeline": base_protocol["timeline"],
            "authority_level": base_protocol["authority_level"],
            "confidence_modifier": confidence_modifier,
            "decision_timestamp": datetime.now().isoformat(),
            "decision_explanation": self._generate_explanation(disease, severity, confidence_value, base_protocol)
        }
        
        return decision
    
    def _generate_explanation(self, disease: str, severity: str, confidence: int, protocol: Dict) -> str:
        """
        Generate human-readable explanation for the containment decision
        """
        
        explanation = f"Based on detection of {disease} with {severity} severity "
        explanation += f"and {confidence}% confidence, the system recommends "
        explanation += f"'{protocol['action']}' (Level {protocol['level']}). "
        
        if disease == "Healthy":
            explanation += "No immediate containment measures required. Continue routine monitoring."
        elif "Blight" in disease:
            explanation += f"Due to the contagious nature of {disease}, "
            if severity == "High":
                explanation += "immediate regional coordination is essential to prevent spread."
            elif severity == "Medium":
                explanation += "field-level containment with neighbor notification is necessary."
            else:
                explanation += "targeted treatment should prevent progression."
        else:
            explanation += "Further investigation is recommended to identify the specific stress factor."
        
        return explanation

# Global instance for use across the application
containment_engine = ContainmentDecisionEngine()
