import React, { useState } from 'react';
import { AlertOctagon, CheckCircle2, Clock, Zap, ArrowUpDown, Search, Building2, MapPin, ExternalLink } from 'lucide-react';

export default function PriorityEngineView({
  habitations = [],
  priorities = [],
  onRecalculateAll,
  onRecalculateSingle,
  isRecalculating,
  onSelectHabitationOnMap
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('ALL');

  // Map priorities to habitation details
  const priorityList = React.useMemo(() => {
    return priorities.map(p => {
      const hab = habitations.find(h => h.id === p.habitationId);
      return {
        ...p,
        district: hab?.district || 'Unknown',
        state: hab?.state || 'Unknown',
        population: hab?.population || 0,
        households: hab?.households || 0,
        vulnerability: hab?.vulnerabilityScore || p.vulnerabilityScore,
      };
    }).sort((a, b) => (b.overallPriorityScore || 0) - (a.overallPriorityScore || 0));
  }, [priorities, habitations]);

  // Filtered priorities
  const filteredList = priorityList.filter(item => {
    const matchesSearch = item.habitationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.state.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'ALL' || item.priorityLevel === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  // KPI counts
  const criticalCount = priorityList.filter(p => p.priorityLevel === 'CRITICAL').length;
  const highCount = priorityList.filter(p => p.priorityLevel === 'HIGH').length;
  const mediumCount = priorityList.filter(p => p.priorityLevel === 'MEDIUM').length;
  const totalAtRiskPop = priorityList
    .filter(p => p.priorityLevel === 'CRITICAL' || p.priorityLevel === 'HIGH')
    .reduce((sum, p) => sum + (p.population || 0), 0);

  const getPriorityBadgeStyle = (level) => {
    switch (level) {
      case 'CRITICAL':
        return { bg: 'rgba(239, 68, 68, 0.2)', border: 'rgba(239, 68, 68, 0.5)', text: '#ef4444', glow: '0 0 10px rgba(239, 68, 68, 0.3)' };
      case 'HIGH':
        return { bg: 'rgba(249, 115, 22, 0.2)', border: 'rgba(249, 115, 22, 0.5)', text: '#f97316', glow: 'none' };
      case 'MEDIUM':
        return { bg: 'rgba(234, 179, 8, 0.2)', border: 'rgba(234, 179, 8, 0.5)', text: '#eab308', glow: 'none' };
      default:
        return { bg: 'rgba(16, 185, 129, 0.2)', border: 'rgba(16, 185, 129, 0.5)', text: '#10b981', glow: 'none' };
    }
  };

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: 1400, margin: '0 auto' }}>
      {/* Critical Alert Banner if immediate relocation needed */}
      {criticalCount > 0 && (
        <div style={{
          background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.2) 0%, rgba(15, 23, 42, 0.8) 100%)',
          borderLeft: '4px solid #ef4444',
          borderRadius: 8,
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          boxShadow: '0 4px 20px rgba(239, 68, 68, 0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="pulsing-badge-critical" style={{
              width: 32, height: 32, borderRadius: '50%', background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <AlertOctagon size={18} color="white" />
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc' }}>
                IMMEDIATE RELOCATION REQUIRED: {criticalCount} HABITATIONS IN CRITICAL RED ZONES
              </div>
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                Total vulnerable population in active hazard pathways: <strong>{totalAtRiskPop.toLocaleString()} citizens</strong>. Immediate shelter allocation recommended.
              </div>
            </div>
          </div>
          <button
            onClick={onRecalculateAll}
            disabled={isRecalculating}
            style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: 6,
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Zap size={14} />
            {isRecalculating ? 'Recomputing AI/GIS Scores...' : 'Recalculate Priorities'}
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div className="glass-panel" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>CRITICAL (IMMEDIATE)</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ef4444', margin: '4px 0' }}>{criticalCount}</div>
          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Imminent hazard zone relocation</div>
        </div>

        <div className="glass-panel" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>HIGH PRIORITY (SHORT TERM)</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f97316', margin: '4px 0' }}>{highCount}</div>
          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Planned phased resettlement</div>
        </div>

        <div className="glass-panel" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>MEDIUM / LOW PRIORITY</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981', margin: '4px 0' }}>{mediumCount}</div>
          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Monitoring & structural mitigation</div>
        </div>

        <div className="glass-panel" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>POPULATION IN CRITICAL ZONES</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8', margin: '4px 0' }}>{totalAtRiskPop.toLocaleString()}</div>
          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Across assessed districts</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 260 }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: 360 }}>
            <Search size={16} color="#64748b" style={{ position: 'absolute', left: 10, top: 10 }} />
            <input
              type="text"
              placeholder="Search by Habitation, District, or State..."
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

          <div style={{ display: 'flex', gap: '0.35rem' }}>
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(lvl => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                style={{
                  background: selectedLevel === lvl ? '#38bdf8' : 'rgba(255, 255, 255, 0.05)',
                  color: selectedLevel === lvl ? '#080c14' : '#cbd5e1',
                  border: 'none',
                  borderRadius: 6,
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onRecalculateAll}
          disabled={isRecalculating}
          style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: 8,
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          <Zap size={15} />
          {isRecalculating ? 'Computing...' : 'Recalculate All Priorities'}
        </button>
      </div>

      {/* Ranked Decision Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94a3b8' }}>
              <th style={{ padding: '0.75rem 1rem', width: 50 }}>RANK</th>
              <th style={{ padding: '0.75rem 1rem' }}>HABITATION / LOCATION</th>
              <th style={{ padding: '0.75rem 1rem' }}>PRIORITY LEVEL</th>
              <th style={{ padding: '0.75rem 1rem' }}>TIMELINE</th>
              <th style={{ padding: '0.75rem 1rem' }}>OVERALL SCORE</th>
              <th style={{ padding: '0.75rem 1rem' }}>MULTI-FACTOR BREAKDOWN</th>
              <th style={{ padding: '0.75rem 1rem' }}>RECOMMENDED SITE</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                  No relocation priorities found. Click "Recalculate All Priorities" to execute decision engine.
                </td>
              </tr>
            ) : (
              filteredList.map((item, idx) => {
                const badge = getPriorityBadgeStyle(item.priorityLevel);
                return (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    {/* Rank */}
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: idx < 3 ? '#38bdf8' : '#64748b' }}>
                      #{idx + 1}
                    </td>

                    {/* Habitation */}
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.88rem' }}>{item.habitationName}</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                        {item.district}, {item.state} • Pop: {item.population?.toLocaleString()}
                      </div>
                    </td>

                    {/* Priority Badge */}
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        background: badge.bg,
                        border: `1px solid ${badge.border}`,
                        color: badge.text,
                        boxShadow: badge.glow,
                        padding: '3px 8px',
                        borderRadius: 6,
                        fontWeight: 800,
                        fontSize: '0.72rem',
                        letterSpacing: '0.04em'
                      }}>
                        {item.priorityLevel}
                      </span>
                    </td>

                    {/* Timeline */}
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        color: item.recommendedTimeline === 'IMMEDIATE' ? '#ef4444' : '#38bdf8',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                      }}>
                        <Clock size={13} />
                        {item.recommendedTimeline?.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Overall Score */}
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.95rem', color: badge.text }}>
                          {item.overallPriorityScore?.toFixed(1)}
                        </span>
                        <div style={{ flex: 1, height: 6, background: '#1e293b', borderRadius: 3, overflow: 'hidden', minWidth: 60 }}>
                          <div style={{
                            width: `${Math.min(item.overallPriorityScore || 0, 100)}%`,
                            height: '100%',
                            background: badge.text
                          }}></div>
                        </div>
                      </div>
                    </td>

                    {/* Breakdown */}
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, fontSize: '0.68rem' }}>
                        <div title="Hazard Score (40% weight)">
                          <span style={{ color: '#94a3b8' }}>Haz:</span> <strong>{item.hazardScore?.toFixed(0)}</strong>
                        </div>
                        <div title="Vulnerability Score (25% weight)">
                          <span style={{ color: '#94a3b8' }}>Vuln:</span> <strong>{item.vulnerabilityScore?.toFixed(0)}</strong>
                        </div>
                        <div title="Disaster History Score (20% weight)">
                          <span style={{ color: '#94a3b8' }}>Hist:</span> <strong>{item.historicalRiskScore?.toFixed(0)}</strong>
                        </div>
                        <div title="Population Score (15% weight)">
                          <span style={{ color: '#94a3b8' }}>Pop:</span> <strong>{item.populationScore?.toFixed(0)}</strong>
                        </div>
                      </div>
                    </td>

                    {/* Recommended Site */}
                    <td style={{ padding: '0.85rem 1rem' }}>
                      {item.recommendedSiteName ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#10b981', fontWeight: 600, fontSize: '0.78rem' }}>
                          <Building2 size={13} />
                          {item.recommendedSiteName}
                        </div>
                      ) : (
                        <span style={{ color: '#64748b', fontSize: '0.75rem', fontStyle: 'italic' }}>
                          Pending Allocation
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <button
                        onClick={() => onRecalculateSingle(item.habitationId)}
                        disabled={isRecalculating}
                        title="Recalculate priority for this settlement"
                        style={{
                          background: 'rgba(56, 189, 248, 0.1)',
                          border: '1px solid rgba(56, 189, 248, 0.25)',
                          color: '#38bdf8',
                          padding: '4px 8px',
                          borderRadius: 6,
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Recalculate
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
