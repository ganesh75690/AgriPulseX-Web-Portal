// Test image analysis endpoint
async function testImageAnalysis() {
    try {
        console.log('Testing image analysis endpoint...');
        
        // Create a simple test image (1x1 pixel PNG)
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#00FF00'; // Green color (should detect as healthy)
        ctx.fillRect(0, 0, 100, 100);
        
        // Convert to blob
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        const formData = new FormData();
        formData.append('file', blob, 'test-image.png');
        
        console.log('Sending request to /api/v2/analyze-image...');
        
        const response = await fetch('http://127.0.0.1:8000/api/v2/analyze-image', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('✅ Image analysis successful!');
        console.log('Disease:', result.data?.image_analysis?.disease);
        console.log('Confidence:', result.data?.image_analysis?.confidence);
        console.log('Severity:', result.data?.image_analysis?.severity);
        console.log('Heatmap generated:', !!result.data?.image_analysis?.heatmap);
        
        return result;
        
    } catch (error) {
        console.error('❌ Image analysis failed:', error.message);
        return null;
    }
}

// Test the decision endpoint too
async function testDecisionEndpoint() {
    try {
        console.log('\nTesting decision endpoint...');
        
        const response = await fetch('http://127.0.0.1:8000/decision', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                region: 'Punjab - Amritsar',
                disease: 'Late Blight (Potato)',
                severity: 'High',
                dataConfidence: 87
            })
        });
        
        const result = await response.json();
        console.log('✅ Decision endpoint working!');
        console.log('Risk:', result.risk);
        console.log('Action:', result.action);
        
    } catch (error) {
        console.error('❌ Decision endpoint failed:', error.message);
    }
}

// Run both tests
testImageAnalysis().then(() => testDecisionEndpoint());
