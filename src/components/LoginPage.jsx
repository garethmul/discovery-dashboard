import React, { useState } from 'react';

const LoginPage = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Check if there's an error parameter in the URL
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('error') === 'invalid') {
      setError('Invalid password. Please try again.');
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!password) {
      setError('Password is required');
      return;
    }
    
    // Submit the form - it will be handled by the server-side middleware
    document.getElementById('login-form').submit();
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: '#f5f5f5'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: '2rem',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          Discovery Dashboard
        </h1>

        {error && (
          <div style={{
            padding: '0.75rem',
            marginBottom: '1rem',
            background: '#fee2e2',
            color: '#b91c1c',
            borderRadius: '4px'
          }}>
            {error}
          </div>
        )}

        <form 
          id="login-form"
          action="/auth/login" 
          method="POST"
          onSubmit={handleSubmit}
        >
          <div style={{ marginBottom: '1rem' }}>
            <label 
              htmlFor="password"
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #d1d5db'
              }}
              placeholder="Enter dashboard password"
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.625rem',
              background: '#1d4ed8',
              color: 'white',
              borderRadius: '4px',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage; 