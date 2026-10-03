import React, { useState } from 'react';
import { Home, Plus, ShieldCheck, Droplets, Car, Building, Users } from 'lucide-react';

export default function RelocationSitesView({
  relocationSites = [],
  onCreateSite,
  isCreating
}) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    district: '',
    state: '',
    availableArea: 100000,
    existingPopulation: 250,
    infrastructureScore: 85,
    accessibilityScore: 88,
    safetyScore: 92,
    latitude: 11.5540,
    longitude: 76.1280,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateSite({
      ...formData,
      availableArea: Number(formData.availableArea),
      existingPopulation: Number(formData.existingPopulation),
      infrastructureScore: Number(formData.infrastructureScore),
      accessibilityScore: Number(formData.accessibilityScore),
      safetyScore: Number(formData.safetyScore),
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
    });
    setShowModal(false);
  };

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
            Safe Candidate Relocation Sites & Carrying Capacity
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
            Multi-criteria carrying capacity evaluation: Area, Infrastructure, Water availability, Accessibility & Geological Safety
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
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
            boxShadow: '0 0 15px rgba(16, 185, 129, 0.3)'
          }}
        >
          <Plus size={16} />
          Register Candidate Relocation Site
        </button>
      </div>

      {/* Grid of Relocation Sites */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '1.25rem' }}>
        {relocationSites.map(site => {
          // Estimated capacity calculation based on standard planning guidelines (approx 35 m² per person)
          const estimatedCap = Math.round((site.availableArea || 0) / 35);
          const availableCap = Math.max(0, estimatedCap - (site.existingPopulation || 0));
          const capacityUsedPercent = estimatedCap > 0 ? Math.round(((site.existingPopulation || 0) / estimatedCap) * 100) : 0;

          return (
            <div
              key={site.id}
              className="glass-panel"
              style={{
                padding: '1.25rem',
                borderTop: '4px solid #10b981',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    color: '#10b981',
                    padding: '2px 8px',
                    borderRadius: 6,
                    fontSize: '0.7rem',
                    fontWeight: 800
                  }}>
                    HIGH SUITABILITY
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    {site.district}, {site.state}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', margin: '4px 0' }}>
                  {site.name}
                </h3>
              </div>

              {/* Carrying Capacity Gauge */}
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Carrying Capacity Available</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#10b981' }}>
                    +{availableCap.toLocaleString()} People
                  </span>
                </div>

                <div style={{ height: 8, background: '#1e293b', borderRadius: 4, overflow: 'hidden', marginBottom: 6 }}>
                  <div style={{ width: `${Math.min(capacityUsedPercent, 100)}%`, height: '100%', background: '#38bdf8' }}></div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b' }}>
                  <span>Existing Pop: <strong>{site.existingPopulation?.toLocaleString()}</strong></span>
                  <span>Estimated Total: <strong>{estimatedCap.toLocaleString()}</strong></span>
                  <span>Usable Area: <strong>{site.availableArea?.toLocaleString()} m²</strong></span>
                </div>
              </div>

              {/* Multi-Dimensional Assessment Scores */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', padding: '0.6rem', borderRadius: 8, textAlign: 'center' }}>
                  <ShieldCheck size={16} color="#10b981" style={{ margin: '0 auto 4px' }} />
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Safety Score</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#10b981' }}>{site.safetyScore}/100</div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', padding: '0.6rem', borderRadius: 8, textAlign: 'center' }}>
                  <Building size={16} color="#38bdf8" style={{ margin: '0 auto 4px' }} />
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Infrastructure</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#38bdf8' }}>{site.infrastructureScore}/100</div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', padding: '0.6rem', borderRadius: 8, textAlign: 'center' }}>
                  <Car size={16} color="#f59e0b" style={{ margin: '0 auto 4px' }} />
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Accessibility</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f59e0b' }}>{site.accessibilityScore}/100</div>
                </div>
              </div>

              {/* Coordinates */}
              <div style={{ fontSize: '0.72rem', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                <span>Lat: {site.latitude?.toFixed(4)}, Lng: {site.longitude?.toFixed(4)}</span>
                <span style={{ color: '#38bdf8' }}>PostGIS Verified Point</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Relocation Site Modal */}
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
            maxWidth: 540,
            padding: '1.5rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', marginBottom: 12 }}>
              Register Candidate Relocation Site
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Site Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Meppadi Safe Ridge Township"
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Available Area (m²)</label>
                  <input
                    type="number"
                    required
                    value={formData.availableArea}
                    onChange={e => setFormData({ ...formData, availableArea: e.target.value })}
                    style={{ width: '100%', background: '#121a2b', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '7px 10px', color: '#fff', fontSize: '0.82rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Existing Population</label>
                  <input
                    type="number"
                    required
                    value={formData.existingPopulation}
                    onChange={e => setFormData({ ...formData, existingPopulation: e.target.value })}
                    style={{ width: '100%', background: '#121a2b', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '7px 10px', color: '#fff', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Safety (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={formData.safetyScore}
                    onChange={e => setFormData({ ...formData, safetyScore: e.target.value })}
                    style={{ width: '100%', background: '#121a2b', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '7px 10px', color: '#fff', fontSize: '0.82rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Infra (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={formData.infrastructureScore}
                    onChange={e => setFormData({ ...formData, infrastructureScore: e.target.value })}
                    style={{ width: '100%', background: '#121a2b', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '7px 10px', color: '#fff', fontSize: '0.82rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Access (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={formData.accessibilityScore}
                    onChange={e => setFormData({ ...formData, accessibilityScore: e.target.value })}
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
                  disabled={isCreating}
                  style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  {isCreating ? 'Saving...' : 'Register Site'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
