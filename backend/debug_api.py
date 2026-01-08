#!/usr/bin/env python3
"""
Test the exact API call with debugging
"""
import requests
import io
from PIL import Image

def create_test_image():
    """Create a simple test image"""
    img = Image.new('RGB', (200, 200), color=(34, 139, 34))
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='JPEG')
    img_bytes.seek(0)
    return img_bytes.getvalue()

def test_api_with_debug():
    """Test API with detailed debugging"""
    farmer_id = "debug_api_farmer"
    
    print(f"Testing API call with farmer_id: {farmer_id}")
    
    # Create and upload image
    raw_bytes = create_test_image()
    files = {'file': ('test.jpg', raw_bytes, 'image/jpeg')}
    data = {
        'farmer_id': farmer_id,
        'region': 'Debug Region'
    }
    
    print("Making API call...")
    response = requests.post("http://127.0.0.1:8000/api/v2/analyze-image", 
                         files=files, data=data, timeout=30)
    
    print(f"Response status: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"Analysis successful: {result['data']['image_analysis']['disease']}")
        print(f"Farmer ID in response: {result['data'].get('farmer_id')}")
        
        # Now check history
        print("\nChecking history...")
        history_response = requests.get(f"http://127.0.0.1:8000/api/v2/farmer-history/{farmer_id}")
        print(f"History response status: {history_response.status_code}")
        
        if history_response.status_code == 200:
            history_data = history_response.json()
            records = history_data.get('records', [])
            print(f"Records found: {len(records)}")
            
            for record in records:
                print(f"  - {record.get('analysis_id')}: {record.get('image_analysis', {}).get('disease')}")
        else:
            print(f"History failed: {history_response.text}")
    else:
        print(f"Analysis failed: {response.text}")

if __name__ == "__main__":
    test_api_with_debug()
