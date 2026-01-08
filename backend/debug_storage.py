#!/usr/bin/env python3
"""
Debug the historical storage issue
"""
import sys
import os
sys.path.append('.')

from historical_analysis import historical_engine

# Test data
test_analysis = {
    "analysis_id": "TEST_001",
    "timestamp": "2026-01-07T21:30:00",
    "farmer_id": "debug_farmer",
    "region": "debug_region",
    "image_analysis": {
        "disease": "Healthy",
        "severity": "Low",
        "confidence": "90%"
    }
}

print("Testing historical storage...")
print(f"Storage path: {historical_engine.storage_path}")
print(f"Storage path exists: {os.path.exists(historical_engine.storage_path)}")

try:
    result = historical_engine.store_analysis(test_analysis)
    print(f"Storage result: {result}")
    
    # Try to retrieve
    records = historical_engine.get_farmer_history("debug_farmer")
    print(f"Retrieved {len(records)} records")
    
    for record in records:
        print(f"  Record: {record.analysis_id} - {record.disease}")
        
except Exception as e:
    print(f"Error: {type(e).__name__}: {str(e)}")
    import traceback
    traceback.print_exc()
