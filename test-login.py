#!/usr/bin/env python3
import requests
import json

def test_login():
    url = "http://localhost:8000/api/auth/login"
    data = {
        "username": "officer@agri.gov.in",
        "password": "officer123", 
        "role": "officer"
    }
    
    try:
        response = requests.post(url, json=data, headers={"Content-Type": "application/json"})
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        print(f"Response Body: {response.text}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"Success! Token: {result.get('access_token', 'N/A')}")
            print(f"User: {result.get('user', {})}")
        else:
            print("Login failed!")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_login()
