from .graph import build_graph

def supply_chain_status():
    return {
        "total_routes": 24,
        "operational": 18,
        "restricted": 4,
        "monitoring": 2,
        "status": "75% Operational"
    }