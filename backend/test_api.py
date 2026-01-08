#!/usr/bin/env python3
"""
Test script to debug the UTF-8 error
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
    return img_bytes

def test_api():
    """Test the API endpoint"""
    url = "http://127.0.0.1:8000/api/v2/analyze-image"
    
    # Create test image
    img_bytes = create_test_image()
    
    # Prepare file for upload
    files = {'file': ('test.jpg', img_bytes, 'image/jpeg')}
    data = {
        'farmer_id': 'test_farmer',
        'region': 'test_region'
    }
    
    try:
        print("Sending request to API...")
        response = requests.post(url, files=files, data=data, timeout=30)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ API call successful!")
            print(f"Disease: {result['data']['image_analysis']['disease']}")
        else:
            print("❌ API call failed")
            
    except Exception as e:
        print(f"Error: {type(e).__name__}: {str(e)}")

if __name__ == "__main__":
    test_api()
