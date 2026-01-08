def explain_decision(action: str):
    explanations = {
        "Strong Containment": "Immediate action required to prevent rapid spread.",
        "Moderate Containment": "Controlled measures recommended to reduce risk.",
        "Monitoring Only": "Situation stable; no containment required yet."
    }
    return explanations.get(action, "No explanation available.")