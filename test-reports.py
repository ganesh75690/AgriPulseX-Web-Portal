#!/usr/bin/env python3
import requests
import json

def test_reports():
    url = "http://localhost:8000/api/reports"
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJvZmZpY2VyQGFncmkuZ292LmluIiwicm9zZSI6Im9mZmljZXIiLCJleHAiOjE3NjgyMjI5MDF9.E_WjnexT8O1A7ObXUgHjvJ6_A0DnwBZys2OYeB1kj9o"
    
    try:
        response = requests.get(url, headers={"Authorization": f"Bearer {token}"})
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        print(f"Response Body: {response.text}")
        
        if response.status_code == 200:
            result = response.json()
            print("Reports endpoint working!")
            print(f"Total reports: {result.get('total_reports', 0)}")
        else:
            print("Reports endpoint failed!")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_reports()
