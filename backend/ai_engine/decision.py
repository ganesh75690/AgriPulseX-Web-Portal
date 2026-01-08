def generate_decision(data: dict):
    severity = data["severity"]
    confidence = data["confidence"]
    connectivity = data["connectivity"]

    if severity > 0.7 and confidence > 0.75:
        action = "Strong Containment"
        radius = 5
    elif severity > 0.4:
        action = "Moderate Containment"
        radius = 3
    else:
        action = "Monitoring Only"
        radius = 1

    return {
        "action": action,
        "radius_km": radius,
        "confidence": confidence,
        "explanation": [
            f"Disease severity assessed at {severity*100:.0f}%",
            f"Confidence level is {confidence*100:.0f}%",
            f"Supply-chain connectivity index {connectivity}"
        ]
    }