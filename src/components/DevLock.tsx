import React, { useState } from 'react';

const DEV_PASSWORD = 'aarlyteam123';
const STORAGE_KEY = 'dev_access_granted';

const DevLock: React.FC<{ onUnlock: () => void }> = ({ onUnlock }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === DEV_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, 'true');
      onUnlock();
    } else {
      setError('Incorrect password.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f3f4f6',
    }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '1rem',
        boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
        maxWidth: 350,
        width: '100%',
        textAlign: 'center',
      }}>
        <h2 style={{ marginBottom: '1rem' }}>Currently in Development</h2>
        <p style={{ marginBottom: '1.5rem' }}>
          If you are a developer, enter the password to access the website.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              border: '1px solid #d1d5db',
              marginBottom: '1rem',
              fontSize: '1rem',
            }}
          />
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              background: '#2563eb',
              color: 'white',
              fontWeight: 600,
              fontSize: '1rem',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Unlock
          </button>
        </form>
        {error && <div style={{ color: 'red', marginTop: '1rem' }}>{error}</div>}
      </div>
    </div>
  );
};

export function isDevAccessGranted() {
  return localStorage.getItem(STORAGE_KEY) === 'true';
}

export default DevLock;
