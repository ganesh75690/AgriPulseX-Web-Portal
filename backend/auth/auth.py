def login(data: dict):
    if data.get("employeeId"):
        return {
            "status": "success",
            "role": "Officer",
            "message": "Login successful"
        }
    return {"status": "failed"}