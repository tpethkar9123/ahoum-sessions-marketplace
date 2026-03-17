import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { LogIn, Github, Mail } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('USER');
  const [error, setError] = useState('');

  const handleDevLogin = async () => {
    try {
      const res = await api.post('/auth/oauth/', {
        provider: 'dev',
        role: role,
        email: role === 'CREATOR' ? 'creator@ahoum.com' : 'user@ahoum.com',
        name: role === 'CREATOR' ? 'Demo Creator' : 'Demo User'
      });
      login(res.data.access, res.data.user);
      navigate(role === 'CREATOR' ? '/creator-dashboard' : '/user-dashboard');
    } catch (err) {
      setError('Login failed. Ensure backend is running.');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await api.post('/auth/oauth/', {
        provider: 'google',
        token: credentialResponse.credential,
        role: role
      });
      login(res.data.access, res.data.user);
      navigate(role === 'CREATOR' ? '/creator-dashboard' : '/user-dashboard');
    } catch (err) {
      setError('Google auth failed.');
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="glass card animate-fade" style={{ width: '100%', maxWidth: '400px', padding: '3rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Welcome Back</h2>
        
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Continue as:</label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={() => setRole('USER')}
              style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: role === 'USER' ? 'var(--primary)' : 'transparent' }}
            >User</button>
            <button 
              onClick={() => setRole('CREATOR')}
              style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: role === 'CREATOR' ? 'var(--primary)' : 'transparent' }}
            >Creator</button>
          </div>
        </div>

        {error && <p style={{ color: '#ff4d4d', fontSize: '0.85rem', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google login failed')}
          />
          
          <button onClick={handleDevLogin} className="glass" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', padding: '0.8rem', width: '100%' }}>
            <LogIn size={20} />
            Continue with Dev Account
          </button>
        </div>

        <p className="text-muted" style={{ marginTop: '2rem', fontSize: '0.8rem', textAlign: 'center' }}>
          By continuing, you agree to our Terms of Service.
        </p>
      </div>
    </div>
  );
};

export default Login;
