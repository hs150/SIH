import React, { useState, useEffect } from 'react';
import { Sliders, Zap, CheckCircle2, AlertTriangle, Users, MapPin, ArrowRight, Shield, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

export default function AllocationOptimizerView() {
  const [splitWeight, setSplitWeight] = useState(0.65);
  const [distanceWeight, setDistanceWeight] = useState(0.35);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const runOptimizer = async (wSplit = splitWeight, wDist = distanceWeight) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.optimizeAllocation(wSplit, wDist);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runOptimizer(0.65, 0.35);
  }, []);

  return (
    <div className="view-container">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Optimal Shelter & Resource Allocation Engine
            </h2>
            <span style={{
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: 4,
              padding: '2px 8px',
              fontSize: '0.72rem',
              fontWeight: 700
            }}>
              OR-Tools / Hungarian Matching
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
            Constrained multi-objective optimization balancing transit logistics against sociological community cohesion.
          </p>
        </div>

        <button
          onClick={() => runOptimizer()}
          disabled={loading}
          style={{
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            border: 'none',
            color: '#ffffff',
            padding: '0.55rem 1.25rem',
            borderRadius: 8,
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: '0 0 20px rgba(14, 165, 233, 0.4)'
          }}
        >
          <Zap size={16} className={loading ? 'pulsing-badge-critical' : ''} />
          {loading ? 'Optimizing...' : 'Execute Allocation Optimizer'}
        </button>
      </div>

      {/* Interactive Parameter Sliders Panel */}
      <div className="glass-panel" style={{
        padding: '1.25rem',
        borderRadius: 12,
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem', color: '#38bdf8', fontWeight: 700, fontSize: '0.85rem' }}>
          <Sliders size={18} />
          <span>OBJECTIVE FUNCTION TUNING CONTROLS</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* Community Splitting Penalty Slider */}
          <div style={{ background: 'rgba(11, 15, 25, 0.6)', padding: '1rem', borderRadius: 8, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f1f5f9' }}>
                Community-Splitting Penalty Weight (W_split)
              </label>
              <span style={{
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                fontWeight: 800,
                color: '#38bdf8',
                background: 'rgba(56, 189, 248, 0.15)',
                padding: '1px 8px',
                borderRadius: 4
              }}>
                {(splitWeight * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={splitWeight}
              onChange={e => {
                const val = parseFloat(e.target.value);
                setSplitWeight(val);
                setDistanceWeight(Math.round((1.0 - val) * 100) / 100);
              }}
              style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }}
            />
            <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: '6px 0 0 0' }}>
              Higher weight heavily penalizes separating families and village clusters across disparate shelters, favoring unified social cohesion.
            </p>
          </div>

          {/* Transit Distance Minimization Slider */}
          <div style={{ background: 'rgba(11, 15, 25, 0.6)', padding: '1rem', borderRadius: 8, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f1f5f9' }}>
                Transport Distance Minimization Weight (W_dist)
              </label>
              <span style={{
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                fontWeight: 800,
                color: '#10b981',
                background: 'rgba(16, 185, 129, 0.15)',
                padding: '1px 8px',
                borderRadius: 4
              }}>
                {(distanceWeight * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={distanceWeight}
              onChange={e => {
                const val = parseFloat(e.target.value);
                setDistanceWeight(val);
                setSplitWeight(Math.round((1.0 - val) * 100) / 100);
              }}
              style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
            />
            <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: '6px 0 0 0' }}>
              Higher weight prioritizes closest geographic shelters to reduce fuel logistics and transit exposure during active severe weather.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          color: '#f87171',
          padding: '1rem',
          borderRadius: 8,
          marginBottom: '1.5rem'
        }}>
          {error}
        </div>
      )}

      {/* KPI Readout Cards */}
      {result && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '1rem', borderRadius: 10, borderLeft: '4px solid #38bdf8' }}>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Displaced Population</span>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#f8fafc', marginTop: 4 }}>
                {result.totalDisplacedPopulation?.toLocaleString()}
              </div>
              <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 600 }}>Identified in red zones</span>
            </div>

            <div className="glass-panel" style={{ padding: '1rem', borderRadius: 10, borderLeft: '4px solid #10b981' }}>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Shelter Capacity Match</span>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#10b981', marginTop: 4 }}>
                {result.allocationCoveragePercent}%
              </div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{result.totalAllocatedPopulation?.toLocaleString()} people assigned</span>
            </div>

            <div className="glass-panel" style={{ padding: '1rem', borderRadius: 10, borderLeft: `4px solid ${result.communitySplitsIncurred > 0 ? '#f59e0b' : '#10b981'}` }}>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Community Splits Incurred</span>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: result.communitySplitsIncurred > 0 ? '#f59e0b' : '#10b981', marginTop: 4 }}>
                {result.communitySplitsIncurred}
              </div>
              <span style={{ fontSize: '0.72rem', color: result.communitySplitsIncurred === 0 ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
                {result.communitySplitsIncurred === 0 ? '✓ 100% Village Unity Preserved' : 'Partial fragmentation detected'}
              </span>
            </div>

            <div className="glass-panel" style={{ padding: '1rem', borderRadius: 10, borderLeft: '4px solid #a855f7' }}>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Avg Transit Distance</span>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#f8fafc', marginTop: 4 }}>
                {result.averageTransitDistanceKm} <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>km</span>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#a855f7', fontWeight: 600 }}>Optimized route radius</span>
            </div>
          </div>

          {/* Allocation Matching Plan Table */}
          <div className="glass-panel" style={{ borderRadius: 12, padding: '1.25rem', marginBottom: '1.5rem', overflowX: 'auto' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', margin: '0 0 1rem 0' }}>
              Village-to-Relocation Site Allocation Blueprint
            </h3>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Vulnerable Habitation</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>District</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Population</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Assigned Relocation Site</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Distance</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Cohesion Status</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Fit Score</th>
                </tr>
              </thead>
              <tbody>
                {result.allocations?.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: '#e2e8f0' }}>
                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700, color: '#f8fafc' }}>
                      {item.habitationName}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', color: '#94a3b8' }}>
                      {item.district}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', fontFamily: 'monospace', fontWeight: 700 }}>
                      {item.allocatedPopulation} / {item.habitationPopulation}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <span style={{ color: '#38bdf8', fontWeight: 600 }}>
                        {item.relocationSiteName}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', fontFamily: 'monospace' }}>
                      {item.distanceKm} km
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      {item.communityPreserved ? (
                        <span style={{
                          background: 'rgba(16, 185, 129, 0.15)',
                          color: '#34d399',
                          padding: '2px 8px',
                          borderRadius: 4,
                          fontSize: '0.72rem',
                          fontWeight: 700
                        }}>
                          ✓ PRESERVED
                        </span>
                      ) : (
                        <span style={{
                          background: 'rgba(245, 158, 11, 0.15)',
                          color: '#fbbf24',
                          padding: '2px 8px',
                          borderRadius: 4,
                          fontSize: '0.72rem',
                          fontWeight: 700
                        }}>
                          ⚠ SPLIT
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', fontFamily: 'monospace', fontWeight: 700, color: '#10b981' }}>
                      {item.shelterMatchScore}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Relocation Site Headroom Gauges */}
          <div className="glass-panel" style={{ borderRadius: 12, padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', margin: '0 0 1rem 0' }}>
              Relocation Site Capacity & Utilization Headroom
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {result.siteSummaries?.map(s => (
                <div key={s.siteId} style={{
                  background: 'rgba(11, 15, 25, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 8,
                  padding: '1rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.85rem' }}>{s.siteName}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: s.utilizationPercentage > 85 ? '#ef4444' : '#10b981' }}>
                      {s.utilizationPercentage}% Occupied
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div style={{ width: '100%', height: 8, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
                    <div style={{
                      width: `${Math.min(100, s.utilizationPercentage)}%`,
                      height: '100%',
                      backgroundColor: s.utilizationPercentage > 85 ? '#ef4444' : s.utilizationPercentage > 50 ? '#38bdf8' : '#10b981'
                    }}></div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8' }}>
                    <span>Allocated: <strong style={{ color: '#f1f5f9' }}>{s.allocatedPeople}</strong></span>
                    <span>Remaining Headroom: <strong style={{ color: '#10b981' }}>{s.remainingHeadroom}</strong></span>
                    <span>Max: {s.totalCapacity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
