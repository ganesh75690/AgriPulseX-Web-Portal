// Fix for "Failed to fetch" error
// Add this to your LoginPage.tsx handlePasswordSignIn function

const handlePasswordSignIn = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    setNotice('Signing in...');
    
    // Add proper error handling and logging
    console.log('Attempting login with:', {
      username: displayIdentifier || identifier,
      role: selectedRole
    });
    
    const response = await authService.login({
      username: displayIdentifier || identifier,
      password: password || "any", // Use default if empty
      role: selectedRole
    });
    
    console.log('Login response:', response);
    
    if (response.access_token) {
      console.log('Login successful!');
      setNotice('Signed in successfully!');
      rotateImage();
      onLogin(selectedRole);
    } else {
      console.error('Login failed:', response);
      setNotice(response.error || 'Login failed. Please try again.');
    }
  } catch (error) {
    console.error('Login error:', error);
    setNotice('Network error. Please check your connection.');
  }
};
