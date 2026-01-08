#!/usr/bin/env python3
"""
Test PDF generation with the fixes
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

def test_pdf_generation():
    """Test the PDF generation endpoint"""
    url = "http://127.0.0.1:8000/api/v2/generate-pdf"
    
    # Create test image
    raw_bytes = create_test_image()
    
    # Prepare file for upload
    files = {'file': ('test.jpg', raw_bytes, 'image/jpeg')}
    data = {
        'farmer_id': 'test_farmer',
        'region': 'test_region'
    }
    
    try:
        print("Testing PDF generation with fixes...")
        print(f"Image size: {len(raw_bytes)} bytes")
        
        response = requests.post(url, files=files, data=data, timeout=30)
        
        print(f"Status Code: {response.status_code}")
        print(f"Content-Type: {response.headers.get('content-type', 'N/A')}")
        
        if response.status_code == 200:
            # Check if we got a PDF
            content_type = response.headers.get('content-type', '')
            if 'application/pdf' in content_type:
                pdf_size = len(response.content)
                print(f"✅ PDF generated successfully!")
                print(f"PDF size: {pdf_size:,} bytes")
                
                # Save PDF for inspection
                with open('test_report.pdf', 'wb') as f:
                    f.write(response.content)
                print("PDF saved as 'test_report.pdf'")
                return True
            else:
                print(f"❌ Expected PDF, got: {content_type}")
                print(f"Response: {response.text[:200]}...")
                return False
        else:
            print(f"❌ PDF generation failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"Error: {type(e).__name__}: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_pdf_generation()
    if success:
        print("\n🎉 PDF generation error has been FIXED!")
    else:
        print("\n❌ PDF generation error still exists")
