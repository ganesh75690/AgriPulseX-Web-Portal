#!/usr/bin/env python3
import requests
import json

def test_registration():
    print("🔍 Testing Registration...")
    reg_url = "http://localhost:8000/api/auth/register"
    reg_data = {
        "name": "Test User",
        "email": "test@agri.gov.in",
        "employee_id": "TEST-001",
        "designation": "Test Designation",
        "department": "Test Department",
        "password": "test123",
        "role": "field-employee"
    }
    
    try:
        response = requests.post(reg_url, json=reg_data, headers={"Content-Type": "application/json"})
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        print(f"Response Body: {response.text}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Registration successful!")
            print(f"Message: {result.get('message')}")
            print(f"Status: {result.get('status')}")
        else:
            print(f"❌ Registration failed: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_registration()
