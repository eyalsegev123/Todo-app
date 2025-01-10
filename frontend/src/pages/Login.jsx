// ...existing imports...

const handleLogin = async (credentials) => {
  try {
    const response = await login(credentials);
    // Store both token and user data
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response));
    // Log to verify
    console.log('Stored token:', localStorage.getItem('token'));
    // ...rest of login logic...
  } catch (error) {
    console.error('Login error:', error);
  }
};
