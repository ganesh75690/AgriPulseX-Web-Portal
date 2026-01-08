// Test different risk calculations
const testCases = [
    {region: "Punjab - Amritsar", disease: "Late Blight (Potato)", severity: "High", dataConfidence: 87},
    {region: "Karnataka - Bangalore Rural", disease: "Late Blight (Potato)", severity: "High", dataConfidence: 87},
    {region: "Punjab - Amritsar", disease: "Late Blight (Potato)", severity: "Low", dataConfidence: 60},
    {region: "Karnataka - Bangalore Rural", disease: "Late Blight (Potato)", severity: "Low", dataConfidence: 60}
];

async function testRiskCalculation() {
    for (const testCase of testCases) {
        console.log(`\nTesting: ${testCase.region}, ${testCase.severity} severity, ${testCase.dataConfidence}% confidence`);
        
        const response = await fetch('http://127.0.0.1:8000/decision', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testCase)
        });
        
        const result = await response.json();
        console.log(`Risk: ${result.risk}, Action: ${result.action}`);
        console.log(`Explanation: ${result.explanation.substring(0, 100)}...`);
    }
}

testRiskCalculation();
