#!/usr/bin/env python3
"""
Test the API with the UTF-8 fix
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
    return img_bytes.getvalue()  # Return raw bytes

def test_api():
    """Test the API endpoint with raw bytes"""
    url = "http://127.0.0.1:8000/api/v2/analyze-image"
    
    # Create test image as raw bytes
    raw_bytes = create_test_image()
    
    # Prepare file for upload
    files = {'file': ('test.jpg', raw_bytes, 'image/jpeg')}
    data = {
        'farmer_id': 'test_farmer',
        'region': 'test_region'
    }
    
    try:
        print("Testing API with UTF-8 fix...")
        print(f"Image size: {len(raw_bytes)} bytes")
        print(f"First few bytes: {raw_bytes[:10].hex()}")
        
        response = requests.post(url, files=files, data=data, timeout=30)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ API call successful!")
            print(f"Disease: {result['data']['image_analysis']['disease']}")
            print(f"Confidence: {result['data']['image_analysis']['confidence']}")
            print(f"Severity: {result['data']['image_analysis']['severity']}")
            return True
        else:
            print(f"❌ API call failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"Error: {type(e).__name__}: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_api()
    if success:
        print("\n🎉 UTF-8 error has been FIXED!")
    else:
        print("\n❌ UTF-8 error still exists")
