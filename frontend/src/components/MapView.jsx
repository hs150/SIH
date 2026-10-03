import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { AlertTriangle, Home, Shield, Flame, Compass, RefreshCw, Zap } from 'lucide-react';

// Custom Marker Helpers
const createCustomIcon = (color, label, pulse = false) => {
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `
      <div style="
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        background: ${color};
        color: white;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 12px ${color};
        font-weight: 700;
        font-size: 11px;
        ${pulse ? 'animation: pulse-critical 1.8s infinite;' : ''}
      ">
        ${label}
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
};

// Component to handle map view navigation
function ChangeMapView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export default function MapView({
  habitations = [],
  redZones = [],
  hazards = [],
  relocationSites = [],
  priorities = [],
  onAssessHabitation,
  isAssessing
}) {
  // Map center defaults to India overview
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]);
  const [mapZoom, setMapZoom] = useState(5);
  
  // Layer visibility state
  const [showRedZones, setShowRedZones] = useState(true);
  const [showHabitations, setShowHabitations] = useState(true);
  const [showHazards, setShowHazards] = useState(true);
  const [showRelocationSites, setShowRelocationSites] = useState(true);
  const [tileLayer, setTileLayer] = useState('dark');

  // Priority lookup map for fast color resolution
  const priorityMap = React.useMemo(() => {
    const map = {};
    priorities.forEach(p => {
      map[p.habitationId] = p;
    });
    return map;
  }, [priorities]);

  const tileUrls = {
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    streets: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  };

  const getPriorityColor = (level) => {
    switch (level) {
      case 'CRITICAL': return '#ef4444';
      case 'HIGH': return '#f97316';
      case 'MEDIUM': return '#eab308';
      case 'LOW': return '#10b981';
      default: return '#3b82f6';
    }
  };

  const hotspots = [
    { name: 'Wayanad (Landslides)', coords: [11.54, 76.16], zoom: 12 },
    { name: 'Joshimath (Subsidence)', coords: [30.56, 79.56], zoom: 12 },
    { name: 'Shimla / Rampur (Flash Floods)', coords: [31.42, 77.62], zoom: 11 },
    { name: 'Majuli (River Erosion)', coords: [26.96, 94.22], zoom: 11 },
    { name: 'Kendrapara (Coastal Surge)', coords: [20.65, 86.90], zoom: 10 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 65px)', padding: '1rem', gap: '0.75rem' }}>
      {/* Control Bar */}
      <div className="glass-panel" style={{
        padding: '0.65rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        {/* Layer Toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Layers:
          </span>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', cursor: 'pointer', color: '#f1f5f9' }}>
            <input
              type="checkbox"
              checked={showRedZones}
              onChange={e => setShowRedZones(e.target.checked)}
              style={{ accentColor: '#ef4444' }}
            />
            <span style={{ width: 10, height: 10, background: '#ef4444', borderRadius: 2, display: 'inline-block' }}></span>
            Red Zones ({redZones.length})
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', cursor: 'pointer', color: '#f1f5f9' }}>
            <input
              type="checkbox"
              checked={showHabitations}
              onChange={e => setShowHabitations(e.target.checked)}
              style={{ accentColor: '#38bdf8' }}
            />
            <span style={{ width: 10, height: 10, background: '#38bdf8', borderRadius: '50%', display: 'inline-block' }}></span>
            Habitations ({habitations.length})
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', cursor: 'pointer', color: '#f1f5f9' }}>
            <input
              type="checkbox"
              checked={showRelocationSites}
              onChange={e => setShowRelocationSites(e.target.checked)}
              style={{ accentColor: '#10b981' }}
            />
            <span style={{ width: 10, height: 10, background: '#10b981', borderRadius: '50%', display: 'inline-block' }}></span>
            Safe Relocation Sites ({relocationSites.length})
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', cursor: 'pointer', color: '#f1f5f9' }}>
            <input
              type="checkbox"
              checked={showHazards}
              onChange={e => setShowHazards(e.target.checked)}
              style={{ accentColor: '#f59e0b' }}
            />
            <span style={{ width: 10, height: 10, background: '#f59e0b', borderRadius: '50%', display: 'inline-block' }}></span>
            Hazard Events ({hazards.length})
          </label>
        </div>

        {/* Hotspots & Basemap selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Compass size={15} color="#38bdf8" />
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Jump to:</span>
            {hotspots.map((spot, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setMapCenter(spot.coords);
                  setMapZoom(spot.zoom);
                }}
                style={{
                  background: 'rgba(56, 189, 248, 0.1)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  color: '#38bdf8',
                  borderRadius: 6,
                  padding: '2px 8px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {spot.name.split(' ')[0]}
              </button>
            ))}
          </div>

          <select
            value={tileLayer}
            onChange={e => setTileLayer(e.target.value)}
            style={{
              background: '#121a2b',
              color: '#f8fafc',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 6,
              padding: '3px 8px',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            <option value="dark">Carto Dark Basemap</option>
            <option value="satellite">ESRI Satellite</option>
            <option value="streets">OpenStreetMap</option>
          </select>
        </div>
      </div>

      {/* Map Canvas */}
      <div style={{ flex: 1, position: 'relative', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ width: '100%', height: '100%' }}
          zoomControl={true}
        >
          <ChangeMapView center={mapCenter} zoom={mapZoom} />
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap'
            url={tileUrls[tileLayer]}
          />

          {/* 1. Red Zone Polygons */}
          {showRedZones && redZones.map(zone => {
            if (!zone.coordinates || !zone.coordinates.length) return null;
            
            // Convert GeoJSON [lng, lat] to Leaflet [lat, lng]
            const multiPolygons = zone.coordinates.map(polygon => 
              polygon.map(ring => ring.map(coord => [coord[1], coord[0]]))
            );

            const color = getPriorityColor(zone.riskLevel);

            return multiPolygons.map((poly, pIdx) => (
              <Polygon
                key={`${zone.id}-${pIdx}`}
                positions={poly}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: 0.35,
                  weight: 2,
                  dashArray: zone.riskLevel === 'CRITICAL' ? '4, 4' : null
                }}
              >
                <Popup>
                  <div style={{ minWidth: 220 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{
                        background: color,
                        color: 'white',
                        fontWeight: 800,
                        fontSize: '0.7rem',
                        padding: '2px 6px',
                        borderRadius: 4
                      }}>
                        RED ZONE: {zone.riskLevel}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{zone.source}</span>
                    </div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '4px 0' }}>{zone.name}</h3>
                    <p style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: 4 }}>{zone.reason}</p>
                  </div>
                </Popup>
              </Polygon>
            ));
          })}

          {/* 2. Habitations Markers */}
          {showHabitations && habitations.map(h => {
            if (!h.latitude || !h.longitude) return null;
            const priority = priorityMap[h.id];
            const level = priority ? priority.priorityLevel : (h.vulnerabilityScore > 80 ? 'CRITICAL' : 'MEDIUM');
            const color = getPriorityColor(level);
            const isCritical = level === 'CRITICAL';

            return (
              <Marker
                key={h.id}
                position={[h.latitude, h.longitude]}
                icon={createCustomIcon(color, isCritical ? '!' : 'H', isCritical)}
              >
                <Popup>
                  <div style={{ minWidth: 240 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{
                        background: color,
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '0.68rem',
                        padding: '1px 6px',
                        borderRadius: 4
                      }}>
                        {level} PRIORITY
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{h.district}, {h.state}</span>
                    </div>
                    
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, marginTop: 4, marginBottom: 4 }}>{h.name}</h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: '0.75rem', margin: '8px 0', background: 'rgba(255,255,255,0.05)', padding: 6, borderRadius: 6 }}>
                      <div>Pop: <strong>{h.population?.toLocaleString()}</strong></div>
                      <div>Households: <strong>{h.households}</strong></div>
                      <div>Vuln: <strong>{h.vulnerabilityScore?.toFixed(1)}/100</strong></div>
                      <div>Risk: <strong>{priority ? `${priority.hazardScore?.toFixed(1)}/100` : 'Pending'}</strong></div>
                    </div>

                    {priority?.recommendedSiteName && (
                      <div style={{ fontSize: '0.75rem', color: '#10b981', marginBottom: 8, fontWeight: 600 }}>
                        Rec. Site: {priority.recommendedSiteName}
                      </div>
                    )}

                    <button
                      onClick={() => onAssessHabitation(h.id)}
                      disabled={isAssessing}
                      style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '6px 10px',
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
                      {isAssessing ? 'Computing...' : 'Recalculate Relocation Priority'}
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* 3. Relocation Sites Markers */}
          {showRelocationSites && relocationSites.map(site => {
            if (!site.latitude || !site.longitude) return null;
            return (
              <Marker
                key={site.id}
                position={[site.latitude, site.longitude]}
                icon={createCustomIcon('#10b981', 'S')}
              >
                <Popup>
                  <div style={{ minWidth: 230 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ background: '#10b981', color: 'white', fontSize: '0.68rem', padding: '1px 6px', borderRadius: 4, fontWeight: 700 }}>
                        CANDIDATE SAFE SITE
                      </span>
                    </div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, marginTop: 4, marginBottom: 4 }}>{site.name}</h3>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: 6 }}>{site.district}, {site.state}</div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.08)', padding: 6, borderRadius: 6 }}>
                      <div>Area: <strong>{site.availableArea?.toLocaleString()} m²</strong></div>
                      <div>Existing Pop: <strong>{site.existingPopulation}</strong></div>
                      <div>Safety Score: <strong>{site.safetyScore}/100</strong></div>
                      <div>Infra Score: <strong>{site.infrastructureScore}/100</strong></div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* 4. Hazard Events Markers */}
          {showHazards && hazards.map(hazard => {
            if (!hazard.latitude || !hazard.longitude) return null;
            return (
              <CircleMarker
                key={hazard.id}
                center={[hazard.latitude, hazard.longitude]}
                radius={9}
                pathOptions={{
                  color: '#f59e0b',
                  fillColor: '#f59e0b',
                  fillOpacity: 0.8,
                  weight: 2
                }}
              >
                <Popup>
                  <div style={{ minWidth: 220 }}>
                    <span style={{ background: '#f59e0b', color: 'black', fontSize: '0.68rem', padding: '1px 6px', borderRadius: 4, fontWeight: 800 }}>
                      HAZARD: {hazard.hazardType}
                    </span>
                    <div style={{ fontSize: '0.78rem', marginTop: 4, fontWeight: 700 }}>
                      Severity: {hazard.severity}/100 | Date: {hazard.eventDate}
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: 4 }}>{hazard.description}</p>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
