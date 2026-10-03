import React, { useState } from 'react';
import { Users, Plus, Zap, Trash2, MapPin, Search, Home } from 'lucide-react';

export default function HabitationsView({
  habitations = [],
  onCreateHabitation,
  onDeleteHabitation,
  onAssessHabitation,
  isAssessing
}) {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    district: '',
    state: '',
    population: 500,
    households: 110,
    vulnerabilityScore: 75.0,
    latitude: 11.5362,
    longitude: 76.1661,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateHabitation({
      ...formData,
      population: Number(formData.population),
      households: Number(formData.households),
      vulnerabilityScore: Number(formData.vulnerabilityScore),
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
    });
    setShowModal(false);
  };

  const filtered = habitations.filter(h =>
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
            Vulnerable Habitations Directory
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
            Settlements, villages and wards registered for multi-hazard vulnerability profiling and relocation readiness
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ position: 'relative', width: 260 }}>
            <Search size={15} color="#64748b" style={{ position: 'absolute', left: 10, top: 10 }} />
            <input
              type="text"
              placeholder="Search habitations..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                background: '#121a2b',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 8,
                padding: '0.45rem 0.75rem 0.45rem 2.2rem',
                color: '#f8fafc',
                fontSize: '0.82rem'
              }}
            />
          </div>

          <button
            onClick={() => setShowModal(true)}
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
              color: 'white',
              border: 'none',
              padding: '0.55rem 1.1rem',
              borderRadius: 8,
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 0 15px rgba(56, 189, 248, 0.3)'
            }}
          >
            <Plus size={16} />
            Register Habitation
          </button>
        </div>
      </div>

      {/* Grid of Habitations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1rem' }}>
        {filtered.map(item => {
          const isHighVuln = (item.vulnerabilityScore || 0) >= 80;
          return (
            <div
              key={item.id}
              className="glass-panel"
              style={{
                padding: '1.25rem',
                borderLeft: `4px solid ${isHighVuln ? '#ef4444' : '#38bdf8'}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '0.85rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{
                    background: isHighVuln ? 'rgba(239, 68, 68, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                    border: `1px solid ${isHighVuln ? 'rgba(239, 68, 68, 0.4)' : 'rgba(56, 189, 248, 0.4)'}`,
                    color: isHighVuln ? '#ef4444' : '#38bdf8',
                    padding: '2px 8px',
                    borderRadius: 6,
                    fontSize: '0.7rem',
                    fontWeight: 800
                  }}>
                    VULNERABILITY: {item.vulnerabilityScore?.toFixed(1)}/100
                  </span>
                  <button
                    onClick={() => onDeleteHabitation(item.id)}
                    title="Remove Habitation"
                    style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', margin: '6px 0 2px 0' }}>
                  {item.name}
                </h3>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <MapPin size={12} color="#38bdf8" />
                  {item.district}, {item.state}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, background: 'rgba(255, 255, 255, 0.03)', padding: '0.65rem 0.85rem', borderRadius: 8, fontSize: '0.78rem' }}>
                <div>Population: <strong style={{ color: '#f8fafc' }}>{item.population?.toLocaleString()}</strong></div>
                <div>Households: <strong style={{ color: '#f8fafc' }}>{item.households?.toLocaleString()}</strong></div>
                <div style={{ gridColumn: 'span 2', color: '#64748b', fontSize: '0.72rem' }}>
                  Coordinates: {item.latitude?.toFixed(4)}, {item.longitude?.toFixed(4)}
                </div>
              </div>

              <button
                onClick={() => onAssessHabitation(item.id)}
                disabled={isAssessing}
                style={{
                  width: '100%',
                  background: 'rgba(56, 189, 248, 0.1)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  color: '#38bdf8',
                  padding: '7px 12px',
                  borderRadius: 6,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6
                }}
              >
                <Zap size={14} />
                Assess Risk & Calculate Relocation Priority
              </button>
            </div>
          );
        })}
      </div>

      {/* Add Habitation Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '1rem'
        }}>
          <div className="glass-panel" style={{
            background: '#0d131f',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: 16,
            width: '100%',
            maxWidth: 520,
            padding: '1.5rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', marginBottom: 12 }}>
              Register Vulnerable Habitation
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Settlement / Village Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Attamala Ward"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', background: '#121a2b', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '7px 10px', color: '#fff', fontSize: '0.82rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>District</label>
                  <input
                    type="text"
                    required
                    placeholder="Wayanad"
                    value={formData.district}
                    onChange={e => setFormData({ ...formData, district: e.target.value })}
                    style={{ width: '100%', background: '#121a2b', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '7px 10px', color: '#fff', fontSize: '0.82rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>State</label>
                  <input
                    type="text"
                    required
                    placeholder="Kerala"
                    value={formData.state}
                    onChange={e => setFormData({ ...formData, state: e.target.value })}
                    style={{ width: '100%', background: '#121a2b', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '7px 10px', color: '#fff', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Population</label>
                  <input
                    type="number"
                    required
                    value={formData.population}
                    onChange={e => setFormData({ ...formData, population: e.target.value })}
                    style={{ width: '100%', background: '#121a2b', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '7px 10px', color: '#fff', fontSize: '0.82rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Households</label>
                  <input
                    type="number"
                    required
                    value={formData.households}
                    onChange={e => setFormData({ ...formData, households: e.target.value })}
                    style={{ width: '100%', background: '#121a2b', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '7px 10px', color: '#fff', fontSize: '0.82rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Vuln Score (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    required
                    value={formData.vulnerabilityScore}
                    onChange={e => setFormData({ ...formData, vulnerabilityScore: e.target.value })}
                    style={{ width: '100%', background: '#121a2b', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '7px 10px', color: '#fff', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Latitude</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={formData.latitude}
                    onChange={e => setFormData({ ...formData, latitude: e.target.value })}
                    style={{ width: '100%', background: '#121a2b', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '7px 10px', color: '#fff', fontSize: '0.82rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Longitude</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={formData.longitude}
                    onChange={e => setFormData({ ...formData, longitude: e.target.value })}
                    style={{ width: '100%', background: '#121a2b', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '7px 10px', color: '#fff', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#cbd5e1', padding: '8px 14px', borderRadius: 8, fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Register Habitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
