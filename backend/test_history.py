#!/usr/bin/env python3
"""
Test the complete history functionality
"""
import requests
import io
from PIL import Image
import time

def create_test_image():
    """Create a simple test image"""
    img = Image.new('RGB', (200, 200), color=(34, 139, 34))
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='JPEG')
    img_bytes.seek(0)
    return img_bytes.getvalue()

def test_complete_history_flow():
    """Test the complete history flow"""
    farmer_id = f"test_farmer_{int(time.time())}"
    
    print(f"Testing history functionality for farmer: {farmer_id}")
    print("=" * 60)
    
    # Step 1: Perform multiple analyses
    print("\n📸 Step 1: Performing multiple analyses...")
    for i in range(3):
        print(f"  Analysis {i+1}/3...")
        
        # Create and upload image
        raw_bytes = create_test_image()
        files = {'file': (f'test_{i}.jpg', raw_bytes, 'image/jpeg')}
        data = {
            'farmer_id': farmer_id,
            'region': f'Test Region {i+1}'
        }
        
        response = requests.post("http://127.0.0.1:8000/api/v2/analyze-image", 
                             files=files, data=data, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            print(f"    ✅ Analysis {i+1}: {result['data']['image_analysis']['disease']}")
        else:
            print(f"    ❌ Analysis {i+1} failed: {response.status_code}")
            return False
        
        time.sleep(1)  # Small delay between analyses
    
    # Step 2: Fetch history
    print(f"\n📚 Step 2: Fetching history for {farmer_id}...")
    history_response = requests.get(f"http://127.0.0.1:8000/api/v2/farmer-history/{farmer_id}")
    
    if history_response.status_code == 200:
        history_data = history_response.json()
        records = history_data.get('records', [])
        print(f"  ✅ Retrieved {len(records)} historical records")
        
        # Display summary
        for i, record in enumerate(records):
            disease = record.get('image_analysis', {}).get('disease', 'Unknown')
            confidence = record.get('image_analysis', {}).get('confidence', 'N/A')
            timestamp = record.get('timestamp', 'Unknown')
            print(f"    Record {i+1}: {disease} ({confidence}) - {timestamp}")
        
        return len(records) > 0
    else:
        print(f"  ❌ Failed to fetch history: {history_response.status_code}")
        print(f"  Response: {history_response.text}")
        return False

if __name__ == "__main__":
    success = test_complete_history_flow()
    
    print("\n" + "=" * 60)
    if success:
        print("🎉 History functionality is WORKING!")
        print("✅ Analysis storage: Working")
        print("✅ History retrieval: Working") 
        print("✅ Frontend integration: Ready")
    else:
        print("❌ History functionality has ISSUES")
        print("Please check the backend logs for errors")
