#!/usr/bin/env python3
import requests
import json

def test_simple_login():
    print("🔍 Testing Simple Backend Login...")
    login_url = "http://localhost:8000/api/auth/login"
    
    # Test with any credentials
    test_credentials = [
        {"username": "admin", "password": "admin", "role": "officer"},
        {"username": "test", "password": "test", "role": "field-employee"},
        {"username": "anyuser", "password": "anypass", "role": "officer"},
        {"username": "employee", "password": "emp123", "role": "field-employee"}
    ]
    
    for i, creds in enumerate(test_credentials, 1):
        print(f"\n{i}. Testing with: {creds['username']} / {creds['password']} (Role: {creds['role']})")
        
        try:
            response = requests.post(login_url, json=creds, headers={"Content-Type": "application/json"})
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ SUCCESS! Login works!")
                print(f"   Token: {result.get('access_token', '')[:30]}...")
                print(f"   User: {result.get('user', {}).get('name')}")
                print(f"   Role: {result.get('role')}")
                print(f"   Email: {result.get('user', {}).get('email')}")
            else:
                print(f"❌ Failed: {response.status_code}")
                print(f"   Response: {response.text}")
                
        except Exception as e:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_simple_login()
