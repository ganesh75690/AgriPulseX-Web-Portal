import cv2
import numpy as np
import base64
from PIL import Image
import io
from concurrent.futures import ThreadPoolExecutor
import functools
import os
import datetime

def generate_heatmap_optimized(image_bytes, yellow_mask=None, brown_mask=None, edges=None):
    """
    Optimized heatmap generation using pre-computed masks
    """
    # --- Load original image ---
    # Convert bytes to BytesIO for PIL
    if isinstance(image_bytes, bytes):
        image_bytes = io.BytesIO(image_bytes)
    
    image = Image.open(image_bytes).convert("RGB")
    original_size = image.size
    img = np.array(image)
    
    # --- Resize for processing ---
    processed_img = cv2.resize(img, (224, 224))
    
    # --- Use pre-computed masks if provided, otherwise compute them ---
    if yellow_mask is None or brown_mask is None or edges is None:
        hsv = cv2.cvtColor(processed_img, cv2.COLOR_RGB2HSV)
        yellow_mask = cv2.inRange(hsv, (20, 100, 100), (35, 255, 255))
        brown_mask = cv2.inRange(hsv, (10, 50, 20), (20, 200, 200))
        gray = cv2.cvtColor(processed_img, cv2.COLOR_RGB2GRAY)
        edges = cv2.Canny(gray, 80, 160)
    
    # --- Create optimized heatmap overlay ---
    heatmap = np.zeros_like(processed_img)
    
    # Vectorized color assignment
    heatmap[brown_mask > 0] = [255, 0, 0]      # Red for high severity
    heatmap[yellow_mask > 0] = [255, 165, 0]   # Orange for medium severity  
    heatmap[edges > 0] = [255, 255, 0]         # Yellow for texture irregularities
    
    # --- Apply transparency ---
    alpha = 0.4
    overlay = cv2.addWeighted(processed_img, 1 - alpha, heatmap, alpha, 0)
    
    # --- Resize back to original dimensions ---
    heatmap_resized = cv2.resize(overlay, original_size)
    
    # --- Optimized base64 encoding ---
    _, buffer = cv2.imencode('.jpg', cv2.cvtColor(heatmap_resized, cv2.COLOR_RGB2BGR))
    heatmap_base64 = base64.b64encode(buffer).decode('utf-8')
    heatmap_base64 = f"data:image/jpeg;base64,{heatmap_base64}"  # Add data URL prefix
    
    return heatmap_base64

def generate_explainable_heatmap(image_bytes, yellow_mask=None, brown_mask=None, edges=None):
    """
    Generate explainable heatmap with detailed analysis of infected regions
    Returns both overlay image and analysis details
    """
    # --- Load original image ---
    if isinstance(image_bytes, bytes):
        image_bytes = io.BytesIO(image_bytes)
    
    image = Image.open(image_bytes).convert("RGB")
    original_size = image.size
    img = np.array(image)
    
    # --- Resize for processing ---
    processed_img = cv2.resize(img, (224, 224))
    
    # --- Generate masks if not provided ---
    if yellow_mask is None or brown_mask is None or edges is None:
        hsv = cv2.cvtColor(processed_img, cv2.COLOR_RGB2HSV)
        yellow_mask = cv2.inRange(hsv, (20, 100, 100), (35, 255, 255))
        brown_mask = cv2.inRange(hsv, (10, 50, 20), (20, 200, 200))
        gray = cv2.cvtColor(processed_img, cv2.COLOR_RGB2GRAY)
        edges = cv2.Canny(gray, 80, 160)
    
    # --- Create analysis of infected regions ---
    analysis = analyze_infected_regions(yellow_mask, brown_mask, edges)
    
    # --- Create explainable heatmap overlay ---
    heatmap = np.zeros_like(processed_img)
    
    # Color coding with transparency
    # Red: High severity (brown mask)
    heatmap[brown_mask > 0] = [255, 0, 0]  # Red
    
    # Orange: Medium severity (yellow mask) 
    heatmap[yellow_mask > 0] = [255, 165, 0]  # Orange
    
    # Yellow: Low severity / texture issues (edges)
    heatmap[edges > 0] = [255, 255, 0]  # Yellow
    
    # --- Apply overlay ---
    alpha = 0.6
    overlay = cv2.addWeighted(processed_img, 1 - alpha, heatmap, alpha, 0)
    
    # --- Resize back to original dimensions ---
    heatmap_resized = cv2.resize(overlay, original_size)
    
    # --- Save overlay image for explainability ---
    overlay_filename = f"heatmap_overlay_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
    overlay_path = f"uploads/heatmaps/{overlay_filename}"
    
    # Ensure uploads directory exists
    os.makedirs("uploads/heatmaps", exist_ok=True)
    
    # Save overlay image
    cv2.imwrite(overlay_path, cv2.cvtColor(heatmap_resized, cv2.COLOR_RGB2BGR))
    
    # --- Generate base64 for frontend ---
    _, buffer = cv2.imencode('.jpg', cv2.cvtColor(heatmap_resized, cv2.COLOR_RGB2BGR))
    heatmap_base64 = base64.b64encode(buffer).decode('utf-8')
    heatmap_base64 = f"data:image/jpeg;base64,{heatmap_base64}"  # Add data URL prefix
    
    return {
        "heatmap_base64": heatmap_base64,
        "overlay_path": overlay_path,
        "analysis": analysis
    }

def analyze_infected_regions(yellow_mask, brown_mask, edges):
    """
    Analyze infected regions for explainability
    """
    analysis = {
        "total_pixels": yellow_mask.size + brown_mask.size,
        "infected_percentage": ((np.count_nonzero(yellow_mask) + np.count_nonzero(brown_mask)) / (yellow_mask.size + brown_mask.size)) * 100,
        "high_severity_regions": np.count_nonzero(brown_mask),
        "medium_severity_regions": np.count_nonzero(yellow_mask),
        "texture_irregularities": np.count_nonzero(edges),
        "infection_clusters": find_infection_clusters(yellow_mask, brown_mask),
        "spatial_distribution": analyze_spatial_distribution(yellow_mask, brown_mask)
    }
    return analysis

def find_infection_clusters(yellow_mask, brown_mask):
    """
    Find distinct infection clusters using connected components
    """
    combined_mask = np.logical_or(yellow_mask > 0, brown_mask > 0)
    num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(combined_mask.astype(np.uint8), 8, cv2.CV_8S)
    
    clusters = []
    for i in range(1, min(num_labels, 6)):  # Max 6 clusters
        if stats[i, cv2.CC_STAT_AREA] > 100:  # Only significant clusters
            clusters.append({
                "cluster_id": i,
                "pixel_count": int(stats[i, cv2.CC_STAT_AREA]),
                "centroid": centroids[i].tolist(),
                "severity": "high" if i in np.where(brown_mask > 0)[0] else "medium"
            })
    
    return clusters

def analyze_spatial_distribution(yellow_mask, brown_mask):
    """
    Analyze spatial distribution of infected areas
    """
    h, w = yellow_mask.shape[:2]
    
    # Divide image into quadrants
    quadrants = {
        "top_left": yellow_mask[:h//2, :w//2],
        "top_right": yellow_mask[:h//2, w//2:],
        "bottom_left": yellow_mask[h//2:, :w//2],
        "bottom_right": yellow_mask[h//2:, w//2:]
    }
    
    distribution = {}
    for quadrant_name, quadrant_data in quadrants.items():
        infected_pixels = np.count_nonzero(quadrant_data)
        total_pixels = quadrant_data.size
        infection_rate = (infected_pixels / total_pixels) * 100 if total_pixels > 0 else 0
        
        distribution[quadrant_name] = {
            "infection_rate": infection_rate,
            "status": "high" if infection_rate > 15 else "medium" if infection_rate > 8 else "low"
        }
    
    return distribution

def analyze_image_optimized(image_bytes):
    """
    Highly optimized image analysis with minimal processing
    """
    import time
    start_time = time.time()
    
    # --- Fast image loading and resizing ---
    if isinstance(image_bytes, bytes):
        image_bytes = io.BytesIO(image_bytes)
    
    # Use PIL for faster loading and direct resizing
    image = Image.open(image_bytes).convert("RGB")
    img = np.array(image.resize((224, 224)))  # Resize in one step
    
    # --- Optimized single-pass processing ---
    hsv = cv2.cvtColor(img, cv2.COLOR_RGB2HSV)
    
    # Vectorized mask creation - batch operations
    yellow_mask = cv2.inRange(hsv, (20, 100, 100), (35, 255, 255))
    brown_mask = cv2.inRange(hsv, (10, 50, 20), (20, 200, 200))
    green_mask = cv2.inRange(hsv, (36, 50, 50), (85, 255, 255))
    
    total_pixels = 224 * 224  # Fixed size for faster calculation
    
    # --- Optimized calculations using numpy operations ---
    yellow_count = np.count_nonzero(yellow_mask)
    brown_count = np.count_nonzero(brown_mask)
    green_count = np.count_nonzero(green_mask)
    
    yellow_pct = (yellow_count / total_pixels) * 100
    brown_pct = (brown_count / total_pixels) * 100
    green_pct = (green_count / total_pixels) * 100
    
    # --- Simplified edge detection only if needed ---
    gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
    edges = cv2.Canny(gray, 80, 160)
    edge_density = (np.count_nonzero(edges) / total_pixels) * 100
    
    # --- Fast disease classification ---
    if green_pct > 70:
        disease = "Healthy"
        base_confidence = 90
        severity = "Low"
    elif brown_pct > 12:
        disease = "Late Blight"
        base_confidence = 82
        severity = "High" if brown_pct > 20 else "Medium"
    elif yellow_pct > 18:
        disease = "Early Blight"
        base_confidence = 75
        severity = "Medium" if yellow_pct > 25 else "Low"
    else:
        disease = "Unknown Stress"
        base_confidence = 60
        severity = "Low"
    
    # --- Quick confidence calculation ---
    confidence = min(base_confidence + (edge_density * 0.5), 95)
    
    # --- Simple explanation ---
    explanation = f"Analysis shows {disease} with {int(confidence)}% confidence. Affected area: {round(yellow_pct + brown_pct, 1)}%."
    
    # --- Fast heatmap generation without complex analysis ---
    original_bytes = image_bytes.getvalue() if hasattr(image_bytes, 'getvalue') else image_bytes
    heatmap_base64 = generate_heatmap_optimized(original_bytes, yellow_mask, brown_mask, edges)
    
    processing_time = time.time() - start_time
    print(f"Image analysis completed in {processing_time:.2f}s")
    
    return {
        "disease": disease,
        "confidence": f"{int(confidence)}%",
        "severity": severity,
        "explanation": explanation,
        "heatmap": heatmap_base64,
        "processing_time": f"{processing_time:.2f}s"
    }

def analyze_image(image_bytes):
    """Legacy wrapper for compatibility"""
    return analyze_image_optimized(image_bytes)