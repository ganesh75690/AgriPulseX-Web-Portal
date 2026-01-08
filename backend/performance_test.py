#!/usr/bin/env python3
"""
Performance test for image detection optimization
"""
import time
import io
from PIL import Image
import numpy as np
from image_detection import analyze_image_optimized

def create_test_image():
    """Create a test image for performance testing"""
    # Create a 800x600 test image with some plant-like colors
    img = Image.new('RGB', (800, 600), color=(34, 139, 34))  # Forest green background
    
    # Add some yellow spots (simulating disease)
    pixels = np.array(img)
    for _ in range(1000):
        x, y = np.random.randint(0, 800), np.random.randint(0, 600)
        pixels[y:y+10, x:x+10] = [255, 255, 0]  # Yellow spots
    
    # Add some brown spots
    for _ in range(500):
        x, y = np.random.randint(0, 800), np.random.randint(0, 600)
        pixels[y:y+8, x:x+8] = [139, 69, 19]  # Brown spots
    
    test_img = Image.fromarray(pixels)
    
    # Convert to bytes
    img_bytes = io.BytesIO()
    test_img.save(img_bytes, format='JPEG')
    img_bytes.seek(0)
    
    return img_bytes

def test_performance():
    """Test the performance of optimized image detection"""
    print("Creating test image...")
    test_image = create_test_image()
    
    print("Running performance test...")
    start_time = time.time()
    
    result = analyze_image_optimized(test_image)
    
    end_time = time.time()
    processing_time = end_time - start_time
    
    print(f"\nPerformance Results:")
    print(f"Processing Time: {processing_time:.2f} seconds")
    print(f"Detection Result: {result['disease']}")
    print(f"Confidence: {result['confidence']}")
    print(f"Severity: {result['severity']}")
    
    if processing_time < 3.0:
        print("✅ Performance is GOOD (< 3 seconds)")
    elif processing_time < 5.0:
        print("⚠️ Performance is ACCEPTABLE (< 5 seconds)")
    else:
        print("❌ Performance needs IMPROVEMENT (> 5 seconds)")
    
    return processing_time

if __name__ == "__main__":
    test_performance()
