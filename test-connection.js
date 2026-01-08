const http = require('http');

// Test backend connection
async function testBackend() {
    console.log('Testing backend connection...');
    
    try {
        // Test basic connection
        const response1 = await fetch('http://127.0.0.1:8000/');
        const data1 = await response1.json();
        console.log('✅ Basic connection:', data1.status);
        
        // Test API info
        const response2 = await fetch('http://127.0.0.1:8000/api/v2/info');
        const data2 = await response2.json();
        console.log('✅ API info:', data2.system, 'v' + data2.version);
        
        // Test decision endpoint
        const response3 = await fetch('http://127.0.0.1:8000/decision', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                region: 'Punjab',
                disease: 'Late Blight',
                severity: 'High',
                dataConfidence: 87
            })
        });
        const data3 = await response3.json();
        console.log('✅ Decision API:', data3.action, '(Risk:', data3.risk + ')');
        
        console.log('\n🎉 ALL BACKEND CONNECTIONS WORKING PROPERLY!');
        
    } catch (error) {
        console.error('❌ Connection error:', error.message);
    }
}

testBackend();
