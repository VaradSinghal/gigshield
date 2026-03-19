import React, { useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import { Layers, CloudRain, Wind, Sun, AlertTriangle } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

const CHENNAI_CENTER = [13.0427, 80.2507];

const HOTSPOTS = [
  { lat: 13.00, lng: 80.22, intensity: 1.0, count: 600, radius: 0.04, name: 'Velachery South', trigger: 'Flooding Alert' },
  { lat: 13.09, lng: 80.28, intensity: 0.9, count: 500, radius: 0.03, name: 'North Chennai', trigger: 'Civic Disruption' },
  { lat: 12.92, lng: 80.23, intensity: 0.8, count: 400, radius: 0.05, name: 'Sholinganallur', trigger: 'Heavy Rainfall' },
  { lat: 13.05, lng: 80.24, intensity: 0.6, count: 250, radius: 0.02, name: 'T. Nagar Central', trigger: 'Severe AQI' },
];

// Helper to generate a normal distribution curve
const gaussianRandom = () => {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
};

// Custom component to wire leaflet.heat into react-leaflet
const HeatmapLayer = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Mapbox/Google Maps aesthetic colors
    const heatOptions = {
      radius: 25,
      blur: 35,
      maxZoom: 14,
      max: 1.0,
      gradient: {
        0.2: '#00b894', // Safe Green
        0.4: '#00cec9', // Cyan
        0.6: '#fdaa49', // Warning Orange
        0.8: '#ff6b6b', // Danger Red
        1.0: '#e84393'  // Critical Pink
      }
    };

    const heatLayer = L.heatLayer(points, heatOptions).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
};

const RiskMap = () => {
  // Generate random data points clustered around the hotspots for the heat map
  const heatPoints = useMemo(() => {
    const points = [];
    
    HOTSPOTS.forEach(hs => {
      for (let i = 0; i < hs.count; i++) {
        // Generate a point around the hotspot
        const latOffset = gaussianRandom() * hs.radius * 0.5;
        const lngOffset = gaussianRandom() * hs.radius * 0.5;
        
        // Intensity drops off based on distance from center
        const distance = Math.sqrt(latOffset * latOffset + lngOffset * lngOffset);
        const pointIntensity = hs.intensity * Math.exp(-Math.pow(distance / hs.radius, 2));

        points.push([hs.lat + latOffset, hs.lng + lngOffset, pointIntensity]);
      }
    });

    // Add some random background noise points across the city
    for (let i = 0; i < 300; i++) {
      points.push([
        CHENNAI_CENTER[0] + (Math.random() - 0.5) * 0.3,
        CHENNAI_CENTER[1] + (Math.random() - 0.5) * 0.3,
        Math.random() * 0.3
      ]);
    }

    return points;
  }, []);

  return (
    <div>
      <div className="page-title">
        Live City Risk Map
        <span className="status-chip status-success" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }}></span>
          Live Sync Active
        </span>
      </div>

      <div style={{ display: 'flex', gap: '24px', height: 'calc(100vh - 180px)' }}>
        {/* Map Area */}
        <div className="glass-card" style={{ flex: 1, padding: 0, overflow: 'hidden', position: 'relative', border: '1px solid var(--border-subtle)' }}>
          <MapContainer 
            center={CHENNAI_CENTER} 
            zoom={12} 
            style={{ height: '100%', width: '100%', backgroundColor: '#0d1117' }}
            zoomControl={false}
          >
            {/* Ultra-dark voyager map tiles for maximum contrast with heatmap */}
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
            />
            {/* Render smoothly blended Heatmap Layer */}
            <HeatmapLayer points={heatPoints} />
            
            {/* Drop city labels back on top so they aren't obscured by the heat layer */}
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png"
            />
          </MapContainer>
          
          {/* Map Controls */}
          <div style={{ position: 'absolute', top: '24px', left: '24px', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 1000 }}>
            <button style={{ width: '40px', height: '40px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
              <Layers size={20} />
            </button>
            <button style={{ width: '40px', height: '40px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
              <CloudRain size={20} />
            </button>
            <button style={{ width: '40px', height: '40px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
              <Wind size={20} />
            </button>
            <button style={{ width: '40px', height: '40px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
              <Sun size={20} />
            </button>
          </div>
        </div>

        {/* Sidebar Data */}
        <div style={{ width: '380px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
          <div className="glass-card">
            <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={20} color="var(--warning)" /> Priority Disruption Alerts
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Continuous risk density monitoring detecting active triggers in major areas.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {HOTSPOTS.map((zone, idx) => {
                const colors = ['#e84393', '#ff6b6b', '#fdaa49', '#00cec9'];
                const riskLevel = Math.round(zone.intensity * 100);
                
                return (
                  <div key={idx} style={{ padding: '16px', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-subtle)', borderLeft: `4px solid ${colors[idx % colors.length]}` }}>
                    <div className="flex-between" style={{ marginBottom: '12px' }}>
                      <div style={{ fontWeight: 600, fontSize: '15px' }}>{zone.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Risk Index: <span style={{ color: colors[idx % colors.length], fontWeight: '800', fontSize: '16px' }}>{riskLevel}</span></div>
                    </div>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      <span style={{ fontSize: '11px', background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.2)', padding: '4px 8px', borderRadius: '6px', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                        <AlertTriangle size={12} /> {zone.trigger}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskMap;
