import React, { useState } from 'react';
import { Radio, Plus, Trash2, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';

export default function RedZonesView({ redZones = [], onCreateRedZone, onDeleteRedZone, isCreating }) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    riskLevel: 'CRITICAL',
    reason: '',
    source: '',
    // Default polygon format: minLng minLat, maxLng maxLat
    coordsText: '76.15 11.52, 76.19 11.52, 76.19 11.56, 76.15 11.56, 76.15 11.52'
  });

  const getRiskColor = (level) => {
    switch (level) {
      case 'CRITICAL': return { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.4)' };
      case 'HIGH': return { color: '#f97316', bg: 'rgba(249, 115, 22, 0.15)', border: 'rgba(249, 115, 22, 0.4)' };
      case 'MEDIUM': return { color: '#eab308', bg: 'rgba(234, 179, 8, 0.15)', border: 'rgba(234, 179, 8, 0.4)' };
      default: return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.4)' };
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateRedZone(formData);
    setShowModal(false);
  };

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: 1400, margin: '0 auto' }}>
      {/* Header with Add Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
            Hazard Red Zones Intelligence
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
            Geospatial demarcations of high-danger zones where permanent habitation poses extreme risk
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          style={{
            background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
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
            boxShadow: '0 0 15px rgba(239, 68, 68, 0.3)'
          }}
        >
          <Plus size={16} />
          Demarcate New Red Zone
        </button>
      </div>

      {/* Grid of Red Zones */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1rem' }}>
        {redZones.map(zone => {
          const risk = getRiskColor(zone.riskLevel);
          const coordsCount = zone.coordinates?.[0]?.[0]?.length || 0;
          return (
            <div
              key={zone.id}
              className="glass-panel"
              style={{
                padding: '1.25rem',
                borderLeft: `4px solid ${risk.color}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '0.85rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{
                    background: risk.bg,
                    border: `1px solid ${risk.border}`,
                    color: risk.color,
                    padding: '2px 8px',
                    borderRadius: 6,
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    letterSpacing: '0.04em'
                  }}>
                    {zone.riskLevel} RED ZONE
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    {zone.active ? 'ACTIVE ZONE' : 'INACTIVE'}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', margin: '4px 0' }}>
                  {zone.name}
                </h3>
                <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600, marginBottom: 8 }}>
                  Authority: {zone.source || 'National Disaster Authority'}
                </div>

                <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.4, margin: '8px 0' }}>
                  {zone.reason}
                </p>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '0.65rem 0.85rem',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.75rem'
              }}>
                <span style={{ color: '#94a3b8' }}>
                  MultiPolygon Vertices: <strong>{coordsCount > 0 ? coordsCount : 'Defined in PostGIS'}</strong>
                </span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>
                  GIST Indexed
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for creating a new Red Zone */}
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
              Demarcate New Red Zone
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Zone Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Parvati Valley Inundation Corridor"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', background: '#121a2b', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '8px 10px', color: '#fff', fontSize: '0.82rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Risk Level</label>
                  <select
                    value={formData.riskLevel}
                    onChange={e => setFormData({ ...formData, riskLevel: e.target.value })}
                    style={{ width: '100%', background: '#121a2b', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '8px 10px', color: '#fff', fontSize: '0.82rem' }}
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Source / Agency</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GSI / NDMA"
                    value={formData.source}
                    onChange={e => setFormData({ ...formData, source: e.target.value })}
                    style={{ width: '100%', background: '#121a2b', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '8px 10px', color: '#fff', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Hazard Justification / Reason</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Geological reasons making this area unsuitable for permanent habitation..."
                  value={formData.reason}
                  onChange={e => setFormData({ ...formData, reason: e.target.value })}
                  style={{ width: '100%', background: '#121a2b', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '8px 10px', color: '#fff', fontSize: '0.82rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>
                  Polygon Coordinates (Lng Lat pairs, comma separated)
                </label>
                <input
                  type="text"
                  required
                  value={formData.coordsText}
                  onChange={e => setFormData({ ...formData, coordsText: e.target.value })}
                  style={{ width: '100%', background: '#121a2b', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '8px 10px', color: '#fff', fontSize: '0.78rem', fontFamily: 'monospace' }}
                />
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Must be a closed loop (first and last coordinate match)</span>
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
                  style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  {isCreating ? 'Saving to PostGIS...' : 'Save Red Zone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
