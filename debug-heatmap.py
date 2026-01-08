import base64
import io
from PIL import Image
import requests
import json

# Create a simple test image (should detect some disease)
img = Image.new('RGB', (224, 224), color='brown')  # Brown color should trigger disease detection
img_bytes = io.BytesIO()
img.save(img_bytes, format='PNG')
img_bytes.seek(0)

# Test the image analysis endpoint
files = {'file': ('test.png', img_bytes, 'image/png')}
response = requests.post('http://127.0.0.1:8000/api/v2/analyze-image', files=files)

print("Status Code:", response.status_code)
if response.status_code == 200:
    result = response.json()
    print("✅ Image Analysis Success!")
    print("\n=== RESPONSE STRUCTURE ===")
    print(json.dumps(result, indent=2))
    
    # Check heatmap specifically
    if 'data' in result and 'image_analysis' in result['data']:
        heatmap_data = result['data']['image_analysis'].get('heatmap', '')
        print(f"\n=== HEATMAP ANALYSIS ===")
        print(f"Heatmap exists: {bool(heatmap_data)}")
        print(f"Heatmap length: {len(heatmap_data)}")
        print(f"Heatmap starts with: {heatmap_data[:50]}...")
        
        # Check if it's a valid base64 data URL
        if heatmap_data.startswith('data:image'):
            print("✅ Heatmap is properly formatted as data URL")
        else:
            print("❌ Heatmap is not formatted as data URL")
            print("Should start with: data:image/jpeg;base64,")
    else:
        print("❌ No heatmap data found in response")
else:
    print("❌ Error:", response.text)
