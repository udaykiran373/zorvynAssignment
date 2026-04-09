import React, { useState } from 'react';
import axios from 'axios';
import './index.css';

// Components
import Dashboard from './components/Dashboard';
import Records from './components/Records';
import Users from './components/Users';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'https://finance-api-9khq.onrender.com';

function App() {
  const [error, setError] = useState('');
  const [authMode, setAuthMode] = useState('login');
  
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', role: 'Admin' });
  
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/api/auth/login', {
          email: authForm.email,
          password: authForm.password
      });
      setUser(res.data.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/api/auth/register', {
        name: authForm.name || 'Demo Initializer', // auto fallback
        email: authForm.email,
        password: authForm.password,
        role: authForm.role
      });
      setUser(res.data.data.user);
    } catch (err) {
      if (err.response?.data?.message?.includes('Duplicate')) {
          setError('Email is already registered. Please Sign In instead.');
      } else {
          setError(err.response?.data?.message || err.message || 'Registration rejected by Network constraints');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get('/api/auth/logout');
      setUser(null); setActiveTab('dashboard');
    } catch(err) { console.error(err); }
  }

  // Auth Layout Rendering
  if (!user) {
    return (
      <div className="container auth-wrapper">
        <div className="glass auth-card">
          <h1>Finance OS</h1>
          <p style={{color: 'var(--text-muted)'}}>
              {authMode === 'login' ? 'Sign in to access your dashboard' : 'Create an account to begin'}
          </p>
          
          {/* TAB TOGGLES FOR AUTH SCREEN */}
          <div className="tabs" style={{justifyContent: 'center', marginTop: '1.5rem'}}>
              <button 
                className={`tab-btn ${authMode === 'login' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); setAuthMode('login'); setError(''); }}
              >Sign In</button>
              <button 
                className={`tab-btn ${authMode === 'register' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); setAuthMode('register'); setError(''); }}
              >Register</button>
          </div>

          <form onSubmit={authMode === 'login' ? handleLoginSubmit : handleRegisterSubmit}>
            {authMode === 'register' && (
                <input type="text" className="input-field" placeholder="Full Name" 
                value={authForm.name} onChange={e => setAuthForm({...authForm, name: e.target.value})} required={authMode === 'register'} />
            )}
            
            <input type="text" className="input-field" placeholder="Email / Username" 
              value={authForm.email} onChange={e => setAuthForm({...authForm, email: e.target.value})} required />
            
            <input type="password" className="input-field" placeholder="Password" 
              value={authForm.password} onChange={e => setAuthForm({...authForm, password: e.target.value})} required />
            
            {authMode === 'register' && (
                <select className="input-select" value={authForm.role} onChange={e => setAuthForm({...authForm, role: e.target.value})}>
                <option value="Viewer">Apply for: Viewer</option>
                <option value="Analyst">Apply for: Analyst</option>
                <option value="Admin">Apply for: Admin</option>
                </select>
            )}

            {error && <div className="error-msg">{error}</div>}
            
            <button type="submit" className="btn-primary">
                {authMode === 'login' ? 'Access Account' : 'Register Securely'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <nav className="glass nav-bar">
        <div className="nav-brand">Finance OS</div>
        <div className="nav-user">
          <span className="badge">{user.role}</span>
          <span>{user.name}</span>
          <button className="btn-logout" onClick={handleLogout}>Disconnect</button>
        </div>
      </nav>

      {/* RBAC Tab Controller */}
      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >Overview</button>
        
        {/* Viewers cannot see records tab by project specification */}
        {(user.role === 'Analyst' || user.role === 'Admin') && (
          <button 
            className={`tab-btn ${activeTab === 'records' ? 'active' : ''}`}
            onClick={() => setActiveTab('records')}
          >Ledger Data</button>
        )}

        {/* Only Admins can see Users tab */}
        {user.role === 'Admin' && (
          <button 
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >Identity Access</button>
        )}
      </div>

      {activeTab === 'dashboard' && <Dashboard user={user} />}
      {activeTab === 'records' && <Records userRole={user.role} />}
      {activeTab === 'users' && <Users />}

    </div>
  );
}

export default App;
