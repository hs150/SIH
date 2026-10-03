import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginModal({ onLogin, isOpen }) {
  const [email, setEmail] = useState('admin@sih.local');
  const [password, setPassword] = useState('Admin@123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onLogin(email, password);
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoAdmin = () => {
    setEmail('admin@sih.local');
    setPassword('Admin@123');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(5, 8, 15, 0.88)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 3000,
      padding: '1rem'
    }}>
      <div className="glass-panel" style={{
        background: '#0d131f',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(56, 189, 248, 0.15)',
        borderRadius: 20,
        width: '100%',
        maxWidth: 440,
        padding: '2rem',
        position: 'relative'
      }}>
        {/* Header Icon */}
        <div style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          background: 'linear-gradient(135deg, #ef4444 0%, #3b82f6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)'
        }}>
          <Shield size={28} color="white" />
        </div>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 4px 0' }}>
            AASHRAYA-GIS Command
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
            SIH 26191 — Disaster Decision Support Portal
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 8,
            padding: '0.65rem 0.85rem',
            color: '#ef4444',
            fontSize: '0.78rem',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: '1rem'
          }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>
              Authorized Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="#64748b" style={{ position: 'absolute', left: 12, top: 11 }} />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  background: '#121a2b',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: 8,
                  padding: '9px 12px 9px 36px',
                  color: '#fff',
                  fontSize: '0.85rem'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#64748b" style={{ position: 'absolute', left: 12, top: 11 }} />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  background: '#121a2b',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: 8,
                  padding: '9px 12px 9px 36px',
                  color: '#fff',
                  fontSize: '0.85rem'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #3b82f6 100%)',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              padding: '10px 16px',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 0 20px rgba(56, 189, 248, 0.25)',
              marginTop: 4
            }}
          >
            {loading ? 'Authenticating with Spring Security...' : 'Enter Command Portal'}
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Quick Demo Credentials helper */}
        <div style={{
          marginTop: '1.25rem',
          padding: '0.75rem',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px dashed rgba(255, 255, 255, 0.15)',
          borderRadius: 8,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: 4 }}>
            Demonstration Credentials Preloaded:
          </div>
          <code style={{ fontSize: '0.75rem', color: '#38bdf8', display: 'block' }}>
            admin@sih.local / Admin@123
          </code>
        </div>
      </div>
    </div>
  );
}
