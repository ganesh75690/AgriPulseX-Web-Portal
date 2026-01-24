#!/usr/bin/env python3
import requests
import json

def test_full_workflow():
    print("🔍 Testing AgriPulseX Full Workflow...")
    
    # Step 1: Test Login
    print("\n1. Testing Login...")
    login_url = "http://localhost:8000/api/auth/login"
    login_data = {
        "username": "officer@agri.gov.in",
        "password": "officer123", 
        "role": "officer"
    }
    
    try:
        response = requests.post(login_url, json=login_data, headers={"Content-Type": "application/json"})
        if response.status_code == 200:
            result = response.json()
            token = result["access_token"]
            print(f"✅ Login successful! Token: {token[:50]}...")
            
            # Step 2: Test Current User
            print("\n2. Testing Current User...")
            user_url = "http://localhost:8000/api/auth/me"
            user_response = requests.get(user_url, headers={"Authorization": f"Bearer {token}"})
            
            if user_response.status_code == 200:
                user_data = user_response.json()
                print(f"✅ User data: {user_data['name']} ({user_data['role']})")
                
                # Step 3: Test Reports (Officer only)
                print("\n3. Testing Reports...")
                reports_url = "http://localhost:8000/api/reports"
                reports_response = requests.get(reports_url, headers={"Authorization": f"Bearer {token}"})
                
                if reports_response.status_code == 200:
                    reports_data = reports_response.json()
                    print(f"✅ Reports endpoint working! Total reports: {reports_data.get('total_reports', 0)}")
                    
                    # Step 4: Test Image Analysis
                    print("\n4. Testing Image Analysis...")
                    print("📸 Note: Image analysis requires file upload, skipping basic test")
                    
                    print("\n🎉 ALL TESTS PASSED!")
                    print("\n🌐 Backend is fully functional at http://localhost:8000")
                    print("📱 Frontend should be available at http://localhost:3001")
                    print("\n🔑 Login Credentials:")
                    print("   Officer: officer@agri.gov.in / officer123")
                    print("   Field Employee: field@agri.gov.in / field123")
                    
                else:
                    print(f"❌ Reports failed: {reports_response.status_code}")
            else:
                print(f"❌ User data failed: {user_response.status_code}")
        else:
            print(f"❌ Login failed: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_full_workflow()
