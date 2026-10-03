import React, { useState } from 'react';
import { Flame, Plus, Calendar, AlertTriangle, FileText } from 'lucide-react';

export default function HazardEventsView({
  hazards = [],
  onCreateHazard,
  isCreating
}) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    hazardType: 'LANDSLIDE',
    severity: 92.0,
    eventDate: new Date().toISOString().split('T')[0],
    source: 'Geological Survey of India',
    description: '',
    latitude: 11.5420,
    longitude: 76.1750,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateHazard({
      ...formData,
      severity: Number(formData.severity),
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
    });
    setShowModal(false);
  };

  const getHazardBadge = (type) => {
    switch (type) {
      case 'LANDSLIDE': return { color: '#ef4444', label: 'Landslide / Debris Flow' };
      case 'LAND_SUBSIDENCE': return { color: '#f97316', label: 'Land Subsidence' };
      case 'CLOUDBURST': return { color: '#38bdf8', label: 'Cloudburst / Flash Flood' };
      case 'RIVER_EROSION': return { color: '#06b6d4', label: 'Riverbank Erosion' };
      default: return { color: '#f59e0b', label: type };
    }
  };

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
            Historical & Real-Time Hazard Events Catalog
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
            Multi-source spatial catalog of disaster trigger incidents used to calibrate hazard score matrices
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
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
            boxShadow: '0 0 15px rgba(245, 158, 11, 0.3)'
          }}
        >
          <Plus size={16} />
          Report / Record Hazard Event
        </button>
      </div>

      {/* Grid of Hazard Events */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1rem' }}>
        {hazards.map(item => {
          const badge = getHazardBadge(item.hazardType);
          return (
            <div
              key={item.id}
              className="glass-panel"
              style={{
                padding: '1.25rem',
                borderLeft: `4px solid ${badge.color}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '0.85rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{
                    background: `${badge.color}22`,
                    border: `1px solid ${badge.color}55`,
                    color: badge.color,
                    padding: '2px 8px',
                    borderRadius: 6,
                    fontSize: '0.72rem',
                    fontWeight: 800
                  }}>
                    {badge.label}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', color: '#94a3b8' }}>
                    <Calendar size={13} />
                    {item.eventDate}
                  </div>
                </div>

                <div style={{ margin: '8px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Event Severity Impact:</span>
                    <strong style={{ fontSize: '0.9rem', color: badge.color }}>{item.severity?.toFixed(1)}/100</strong>
                  </div>
                  <div style={{ height: 6, background: '#1e293b', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min(item.severity || 0, 100)}%`, height: '100%', background: badge.color }}></div>
                  </div>
                </div>

                <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.4, margin: '8px 0' }}>
                  {item.description}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 8 }}>
                <span>Source: <strong style={{ color: '#94a3b8' }}>{item.source}</strong></span>
                <span>Lat: {item.latitude?.toFixed(4)}, Lng: {item.longitude?.toFixed(4)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Hazard Modal */}
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
              Report / Record Hazard Event
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Hazard Type</label>
                  <select
                    value={formData.hazardType}
                    onChange={e => setFormData({ ...formData, hazardType: e.target.value })}
                    style={{ width: '100%', background: '#121a2b', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '7px 10px', color: '#fff', fontSize: '0.82rem' }}
                  >
                    <option value="LANDSLIDE">LANDSLIDE</option>
                    <option value="LAND_SUBSIDENCE">LAND SUBSIDENCE</option>
                    <option value="CLOUDBURST">CLOUDBURST</option>
                    <option value="RIVER_EROSION">RIVER EROSION</option>
                    <option value="COASTAL_INUNDATION">COASTAL INUNDATION</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Severity (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    required
                    value={formData.severity}
                    onChange={e => setFormData({ ...formData, severity: e.target.value })}
                    style={{ width: '100%', background: '#121a2b', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '7px 10px', color: '#fff', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Event Date</label>
                  <input
                    type="date"
                    required
                    value={formData.eventDate}
                    onChange={e => setFormData({ ...formData, eventDate: e.target.value })}
                    style={{ width: '100%', background: '#121a2b', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '7px 10px', color: '#fff', fontSize: '0.82rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Source / Reporting Body</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. IMD / GSI / SDMA"
                    value={formData.source}
                    onChange={e => setFormData({ ...formData, source: e.target.value })}
                    style={{ width: '100%', background: '#121a2b', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '7px 10px', color: '#fff', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Event Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Details of the hazard, debris trajectory, damage..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', background: '#121a2b', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '7px 10px', color: '#fff', fontSize: '0.82rem' }}
                />
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
                  disabled={isCreating}
                  style={{ background: '#f59e0b', color: 'black', border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}
                >
                  {isCreating ? 'Saving...' : 'Record Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
