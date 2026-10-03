import React, { useState, useEffect } from 'react';
import { Cpu, AlertCircle, BarChart3, TrendingUp, ShieldAlert, CheckCircle, Info } from 'lucide-react';
import { api } from '../services/api';

export default function PredictiveModelView() {
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPredictiveData = async () => {
    setLoading(true);
    try {
      const data = await api.getPredictiveAssessments();
      setAssessments(data || []);
      if (data && data.length > 0) {
        setSelectedAssessment(data[0]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictiveData();
  }, []);

  const getTierColor = (tier) => {
    switch (tier) {
      case 'CRITICAL':
        return '#ef4444';
      case 'HIGH':
        return '#f97316';
      case 'MODERATE':
        return '#f59e0b';
      default:
        return '#10b981';
    }
  };

  return (
    <div className="view-container">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              AI Multi-Hazard Geophysical Susceptibility Engine
            </h2>
            <span style={{
              background: 'rgba(168, 85, 247, 0.15)',
              color: '#c084fc',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              borderRadius: 4,
              padding: '2px 8px',
              fontSize: '0.72rem',
              fontWeight: 700
            }}>
              Gradient-Boosted Ensemble
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
            Multi-variable predictive inference computing pre-emptive landslide & flood risk before physical event occurrence.
          </p>
        </div>

        {/* Methodology Transparency Disclaimer Banner */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: 8,
          padding: '0.5rem 1rem',
          maxWidth: 420,
          fontSize: '0.72rem',
          color: '#cbd5e1',
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <Info size={16} color="#38bdf8" />
          <span>
            <strong>Scientific Methodology:</strong> Features calibrated on DEM slope gradients, live Open-Meteo atmospheric radar, and USGS seismic feeds.
          </span>
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
          Running geophysical ensemble inference...
        </div>
      )}

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#f87171', padding: '1rem', borderRadius: 8 }}>
          {error}
        </div>
      )}

      {!loading && assessments.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.35fr', gap: '1.5rem' }}>
          {/* Habitations Risk Roster */}
          <div className="glass-panel" style={{ borderRadius: 12, padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f1f5f9', margin: '0 0 0.85rem 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>VULNERABILITY RANKING ROSTER</span>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{assessments.length} habitations evaluated</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '650px', overflowY: 'auto' }}>
              {assessments.map(item => {
                const isSelected = selectedAssessment?.habitationId === item.habitationId;
                const tierColor = getTierColor(item.riskTier);

                return (
                  <div
                    key={item.habitationId}
                    onClick={() => setSelectedAssessment(item)}
                    style={{
                      background: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'rgba(11, 15, 25, 0.6)',
                      border: isSelected ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: 8,
                      padding: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.88rem' }}>
                        {item.habitationName}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                        {item.district} • Population: {item.population?.toLocaleString()}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        display: 'inline-block',
                        background: `${tierColor}20`,
                        color: tierColor,
                        border: `1px solid ${tierColor}50`,
                        borderRadius: 4,
                        padding: '2px 8px',
                        fontSize: '0.72rem',
                        fontWeight: 800
                      }}>
                        {item.riskTier}
                      </span>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f1f5f9', marginTop: 3, fontFamily: 'monospace' }}>
                        {(item.susceptibilityScore * 100).toFixed(0)}% Risk
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Feature Importance & Mitigation Protocol Panel */}
          {selectedAssessment && (
            <div className="glass-panel" style={{ borderRadius: 12, padding: '1.5rem', backgroundColor: '#0d1527' }}>
              {/* Profile Card */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                    {selectedAssessment.habitationName}
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
                    District: {selectedAssessment.district} | Population: {selectedAssessment.population?.toLocaleString()}
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: '1.8rem',
                    fontWeight: 900,
                    fontFamily: 'monospace',
                    color: getTierColor(selectedAssessment.riskTier)
                  }}>
                    {(selectedAssessment.susceptibilityScore * 100).toFixed(0)}
                    <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}> / 100</span>
                  </div>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    color: getTierColor(selectedAssessment.riskTier),
                    textTransform: 'uppercase'
                  }}>
                    {selectedAssessment.riskTier} SUSCEPTIBILITY
                  </span>
                </div>
              </div>

              {/* Action Directive */}
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 8,
                padding: '0.85rem 1rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10
              }}>
                <ShieldAlert size={20} color="#ef4444" style={{ marginTop: 2, flexShrink: 0 }} />
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#f87171', textTransform: 'uppercase' }}>
                    RECOMMENDED DISASTER MANAGEMENT ACTION
                  </span>
                  <p style={{ fontSize: '0.82rem', color: '#f1f5f9', margin: '4px 0 0 0', fontWeight: 600 }}>
                    {selectedAssessment.recommendedAction}
                  </p>
                </div>
              </div>

              {/* Feature Importance Breakdown */}
              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#38bdf8', margin: '0 0 0.85rem 0', display: 'flex', alignItems: 'center', gap: 6 }}>
                <BarChart3 size={16} />
                <span>EXPLAINABLE FEATURE-IMPORTANCE BREAKDOWN</span>
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {selectedAssessment.features?.map((f, i) => (
                  <div key={i} style={{ background: 'rgba(11, 15, 25, 0.6)', padding: '0.85rem 1rem', borderRadius: 8, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f1f5f9' }}>
                        {f.feature}
                      </span>
                      <span style={{
                        fontFamily: 'monospace',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        color: f.contribution > 20 ? '#ef4444' : '#38bdf8'
                      }}>
                        +{f.contribution}% Contribution
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8', marginBottom: 6 }}>
                      <span>Input Telemetry: <strong style={{ color: '#cbd5e1' }}>{f.value}</strong></span>
                      <span>Ensemble Weight: {f.weight}%</span>
                    </div>

                    {/* Bar visual */}
                    <div style={{ width: '100%', height: 6, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{
                        width: `${Math.min(100, f.contribution * 3.3)}%`,
                        height: '100%',
                        backgroundColor: f.contribution > 20 ? '#ef4444' : f.contribution > 12 ? '#f59e0b' : '#38bdf8'
                      }}></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Model Confidence & Disclaimer Footer */}
              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: '#94a3b8' }}>
                <span>Model Confidence: <strong style={{ color: '#10b981' }}>{selectedAssessment.confidenceRating}</strong></span>
                <span style={{ fontStyle: 'italic' }}>Deterministic Geophysical Pipeline</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
