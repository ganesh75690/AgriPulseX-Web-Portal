#!/usr/bin/env python3
import requests
import json

def test_employee_login():
    print("🔍 Testing Employee Login...")
    login_url = "http://localhost:8000/api/auth/login"
    login_data = {
        "username": "field@agri.gov.in",
        "password": "field123", 
        "role": "field-employee"
    }
    
    try:
        response = requests.post(login_url, json=login_data, headers={"Content-Type": "application/json"})
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        print(f"Response Body: {response.text}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Employee Login successful!")
            print(f"   Token: {result.get('access_token', '')[:50]}...")
            print(f"   User: {result.get('user', {}).get('name')}")
            
            # Test current user
            print("\n2. Testing Current User...")
            token = result["access_token"]
            user_url = "http://localhost:8000/api/auth/me"
            user_response = requests.get(user_url, headers={"Authorization": f"Bearer {token}"})
            
            if user_response.status_code == 200:
                user_data = user_response.json()
                print(f"✅ Current User working!")
                print(f"   Name: {user_data.get('name')}")
                print(f"   Role: {user_data.get('role')}")
            else:
                print(f"❌ User data failed: {user_response.status_code}")
        else:
            print(f"❌ Employee Login failed: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_employee_login()
