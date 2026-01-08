import base64
import io
from PIL import Image
import requests

# Create a simple test image (green should be detected as healthy)
img = Image.new('RGB', (224, 224), color='green')
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
    print("Disease:", result['data']['image_analysis']['disease'])
    print("Confidence:", result['data']['image_analysis']['confidence'])
    print("Severity:", result['data']['image_analysis']['severity'])
    print("Heatmap generated:", 'heatmap' in result['data']['image_analysis'])
else:
    print("❌ Error:", response.text)
