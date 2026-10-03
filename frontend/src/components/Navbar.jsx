import React from 'react';
import { Shield, Radio, User, LogOut, RefreshCw, Layers } from 'lucide-react';

export default function Navbar({ user, onLogout, activeTab, setActiveTab, onRefreshData, isRefreshing }) {
  const tabs = [
    { id: 'map', label: 'GIS Command Map', icon: Layers },
    { id: 'priorities', label: 'Relocation Priorities', icon: Shield },
    { id: 'redzones', label: 'Red Zones', icon: Radio },
    { id: 'relocations', label: 'Safe Relocation Sites', icon: User },
    { id: 'hazards', label: 'Hazard Events', icon: Shield },
    { id: 'habitations', label: 'Habitations Directory', icon: User },
  ];

  return (
    <header className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      borderRadius: 0,
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      padding: '0.75rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      backgroundColor: 'rgba(10, 15, 26, 0.92)'
    }}>
      {/* Brand & Problem Statement ID */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: 38,
          height: 38,
          borderRadius: 8,
          background: 'linear-gradient(135deg, #ef4444 0%, #3b82f6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(239, 68, 68, 0.4)'
        }}>
          <Shield size={22} color="#ffffff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#f8fafc', margin: 0 }}>
              AASHRAYA <span style={{ color: '#38bdf8', fontWeight: 600 }}>GIS</span>
            </h1>
            <span style={{
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: 4,
              padding: '1px 6px',
              fontSize: '0.7rem',
              fontWeight: 700
            }}>
              SIH 26191
            </span>
          </div>
          <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: 0, fontWeight: 500 }}>
            Intelligent Red-Zone Identification & Vulnerable Relocation Assessment
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', overflowX: 'auto' }}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.85rem',
                borderRadius: 8,
                fontSize: '0.82rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#38bdf8' : '#cbd5e1',
                backgroundColor: isActive ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                border: isActive ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <tab.icon size={15} color={isActive ? '#38bdf8' : '#94a3b8'} />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Status & User Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Backend Status indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.35rem 0.65rem',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          borderRadius: 20,
          fontSize: '0.72rem',
          color: '#10b981',
          fontWeight: 600
        }}>
          <span style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            backgroundColor: '#10b981',
            boxShadow: '0 0 8px #10b981'
          }}></span>
          PostGIS Connected
        </div>

        {/* Refresh button */}
        <button
          onClick={onRefreshData}
          disabled={isRefreshing}
          title="Refresh Backend Data"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#e2e8f0',
            padding: '0.45rem',
            borderRadius: 8,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease'
          }}
        >
          <RefreshCw size={15} className={isRefreshing ? 'pulsing-badge-critical' : ''} />
        </button>

        {/* User profile & Logout */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f1f5f9' }}>{user.name}</div>
              <div style={{ fontSize: '0.68rem', color: '#38bdf8', fontWeight: 700 }}>{user.role}</div>
            </div>
            <button
              onClick={onLogout}
              title="Sign Out"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: '#ef4444',
                padding: '0.45rem',
                borderRadius: 8,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
