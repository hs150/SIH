import React, { useState, useEffect } from 'react';
import { RefreshCw, Radio, CloudRain, Flame, CheckCircle, AlertTriangle, ShieldCheck, Download, FileText, PlusCircle } from 'lucide-react';
import { api } from '../services/api';

export default function ProvenanceStrip({ onDataRefreshed, onOpenSosModal }) {
  const [statuses, setStatuses] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState(null);

  const fetchStatus = async () => {
    try {
      const data = await api.getIngestionStatus();
      setStatuses(data || []);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchStatus();
    const timer = setInterval(fetchStatus, 30000); // 30s polling
    return () => clearInterval(timer);
  }, []);

  const handleSyncNow = async () => {
    setIsSyncing(true);
    setSyncFeedback('Querying USGS FDSN & Open-Meteo atmospheric radar...');
    try {
      const res = await api.syncLiveData();
      setSyncFeedback(`Sync complete: ${res.usgsEventsIngested} USGS seismic events, ${res.meteoAlertsActive} flood alerts active.`);
      await fetchStatus();
      if (onDataRefreshed) {
        onDataRefreshed();
      }
      setTimeout(() => setSyncFeedback(null), 5000);
    } catch (err) {
      setSyncFeedback(`Sync error: ${err.message}`);
      setTimeout(() => setSyncFeedback(null), 6000);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleExportGeoJson = () => {
    window.open(api.getGeoJsonDownloadUrl(), '_blank');
  };

  const handlePrintPlan = () => {
    window.print();
  };

  const getSourceIcon = (source) => {
    switch (source) {
      case 'USGS':
        return <Radio size={13} color="#38bdf8" />;
      case 'OPEN_METEO':
        return <CloudRain size={13} color="#60a5fa" />;
      case 'FIRMS':
        return <Flame size={13} color="#fb923c" />;
      default:
        return <ShieldCheck size={13} color="#10b981" />;
    }
  };

  const getStatusBadge = (status, live) => {
    if (status === 'SUCCESS') {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: '#10b981', fontSize: '0.68rem', fontWeight: 600 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 6px #10b981' }}></span>
          LIVE
        </span>
      );
    }
    if (status === 'STANDBY') {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: '#94a3b8', fontSize: '0.68rem', fontWeight: 600 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#64748b' }}></span>
          STANDBY
        </span>
      );
    }
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: '#f59e0b', fontSize: '0.68rem', fontWeight: 600 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#f59e0b' }}></span>
        MONITORING
      </span>
    );
  };

  return (
    <div style={{
      background: 'linear-gradient(90deg, #090d16 0%, #0d1527 50%, #090d16 100%)',
      borderBottom: '1px solid rgba(56, 189, 248, 0.2)',
      padding: '0.4rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '0.75rem',
      fontSize: '0.75rem',
      color: '#cbd5e1'
    }}>
      {/* Real Data Provenance Feeds */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.68rem' }}>
          <span>Telemetry Feeds:</span>
        </div>

        {statuses.map(st => (
          <div key={st.source} title={st.message} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(56, 189, 248, 0.15)',
            borderRadius: 6,
            padding: '2px 8px'
          }}>
            {getSourceIcon(st.source)}
            <span style={{ fontWeight: 600, color: '#f1f5f9' }}>{st.source}</span>
            {getStatusBadge(st.status, st.live)}
          </div>
        ))}

        {syncFeedback && (
          <span style={{ color: '#38bdf8', fontSize: '0.72rem', fontWeight: 600, fontStyle: 'italic' }}>
            {syncFeedback}
          </span>
        )}
      </div>

      {/* Control Actions: Real Sync, Export QGIS, SOS Field Report */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button
          onClick={handleSyncNow}
          disabled={isSyncing}
          style={{
            background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.25) 0%, rgba(56, 189, 248, 0.15) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            color: '#38bdf8',
            borderRadius: 6,
            padding: '3px 10px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.72rem',
            display: 'flex',
            alignItems: 'center',
            gap: 5
          }}
          title="Query USGS Earthquake API & Open-Meteo Radar immediately"
        >
          <RefreshCw size={12} className={isSyncing ? 'pulsing-badge-critical' : ''} />
          {isSyncing ? 'Syncing Feeds...' : 'Sync Real Data'}
        </button>

        <button
          onClick={handleExportGeoJson}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#e2e8f0',
            borderRadius: 6,
            padding: '3px 9px',
            cursor: 'pointer',
            fontWeight: 500,
            fontSize: '0.72rem',
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}
          title="Export GeoJSON layers for QGIS / ArcGIS"
        >
          <Download size={12} color="#38bdf8" />
          QGIS GeoJSON
        </button>

        <button
          onClick={handlePrintPlan}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#e2e8f0',
            borderRadius: 6,
            padding: '3px 9px',
            cursor: 'pointer',
            fontWeight: 500,
            fontSize: '0.72rem',
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}
          title="Print official DDMA Action Plan Brief"
        >
          <FileText size={12} color="#10b981" />
          DDMA Plan
        </button>

        <button
          onClick={onOpenSosModal}
          style={{
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#f87171',
            borderRadius: 6,
            padding: '3px 10px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.72rem',
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}
          title="Submit ground emergency SOS report"
        >
          <PlusCircle size={12} />
          + Field SOS
        </button>
      </div>
    </div>
  );
}
