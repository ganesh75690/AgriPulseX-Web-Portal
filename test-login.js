import fetch from 'node-fetch';

const testLogin = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'officer@agri.gov.in',
        password: 'officer123',
        role: 'officer'
      })
    });

    const data = await response.json();
    console.log('Login response:', data);
    console.log('Status:', response.status);
  } catch (error) {
    console.error('Login error:', error);
  }
};

testLogin();
