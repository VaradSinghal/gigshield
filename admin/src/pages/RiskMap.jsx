import React, { useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import { Layers, CloudRain, Wind, Sun, AlertTriangle, RefreshCw, Activity, Terminal } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { supabase } from '../supabase';

const CHENNAI_CENTER = [13.0427, 80.2507];

const DEFAULT_HOTSPOTS = [
  { lat: 13.00, lng: 80.22, intensity: 0.5, count: 100, radius: 0.04, name: 'Velachery South', trigger: 'Baseline Risk' },
  { lat: 13.09, lng: 80.28, intensity: 0.4, count: 80, radius: 0.03, name: 'North Chennai', trigger: 'Baseline Risk' },
];

const gaussianRandom = () => {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
};

const HeatmapLayer = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const heatOptions = {
      radius: 25,
      blur: 35,
      maxZoom: 14,
      max: 1.0,
      gradient: {
        0.2: '#eef0f3',
        0.4: '#578bfa',
        0.6: '#0052ff', // Coinbase Blue
        0.8: '#cf2027', // Danger
        1.0: '#cf2027'  // Critical
      }
    };

    const heatLayer = L.heatLayer(points, heatOptions).addTo(map);
    return () => { map.removeLayer(heatLayer); };
  }, [map, points]);

  return null;
};

const RiskMap = () => {
  const [activeHotspots, setActiveHotspots] = React.useState(DEFAULT_HOTSPOTS);

  useEffect(() => {
    const fetchTriggers = async () => {
      const { data } = await supabase.from('active_triggers').select('*').eq('status', 'active');
      if (data && data.length > 0) {
        const mapped = data.map(t => ({
          lat: CHENNAI_CENTER[0] + (Math.random() - 0.5) * 0.1,
          lng: CHENNAI_CENTER[1] + (Math.random() - 0.5) * 0.1,
          intensity: t.risk_level / 10,
          count: Math.floor(t.risk_level * 100),
          radius: 0.04,
          name: t.zone,
          trigger: t.label
        }));
        setActiveHotspots([...DEFAULT_HOTSPOTS, ...mapped]);
      } else {
        setActiveHotspots(DEFAULT_HOTSPOTS);
      }
    };

    fetchTriggers();
    const triggerSub = supabase.channel('risk-map-sentinel').on('postgres_changes', { event: '*', schema: 'public', table: 'active_triggers' }, fetchTriggers).subscribe();
    return () => supabase.removeChannel(triggerSub);
  }, []);

  const heatPoints = useMemo(() => {
    const points = [];
    activeHotspots.forEach(hs => {
      const count = hs.count || 100;
      for (let i = 0; i < count; i++) {
        const latOffset = gaussianRandom() * (hs.radius || 0.04) * 0.5;
        const lngOffset = gaussianRandom() * (hs.radius || 0.04) * 0.5;
        const distance = Math.sqrt(latOffset * latOffset + lngOffset * lngOffset);
        // Active incident points can go up to their intensity (0.4 - 1.0)
        const pointIntensity = (hs.intensity || 0.5) * Math.exp(-Math.pow(distance / (hs.radius || 0.04), 2));
        points.push([hs.lat + latOffset, hs.lng + lngOffset, pointIntensity]);
      }
    });

    for (let i = 0; i < 50; i++) {
      points.push([
        CHENNAI_CENTER[0] + (Math.random() - 0.5) * 0.3,
        CHENNAI_CENTER[1] + (Math.random() - 0.5) * 0.3,
        Math.random() * 0.05 // Background noise kept exceedingly low (0.05 vs 0.3)
      ]);
    }
    return points;
  }, [activeHotspots]);

  // Generate proper geospatial grids spanning Chennai bounds
  const mapGrids = useMemo(() => {
    const lines = [];
    const step = 0.02; // ~2km logical bounds
    // Latitudes (Horizontal lines)
    for (let lat = 12.8; lat <= 13.3; lat += step) {
      lines.push([[lat, 79.9], [lat, 80.6]]);
    }
    // Longitudes (Vertical lines)
    for (let lng = 79.9; lng <= 80.6; lng += step) {
      lines.push([[12.8, lng], [13.3, lng]]);
    }
    return lines;
  }, []);

  return (
    <div className="risk-sentinel">
      <div className="flex-between" style={{ marginBottom: '40px' }}>
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>Tactical Risk Terminal</h1>
          <p className="page-subtitle">Multi-layer geospatial intelligence and disruption telemetry</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: 'rgba(0, 82, 255, 0.05)', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
          <div className="pulse-indicator" style={{ background: 'var(--primary)' }} />
          <span style={{ fontSize: '13px', fontFamily: 'var(--font-sans)', fontWeight: 600, color: 'var(--primary)' }}>Live Geospatial Sync</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '40px', height: 'calc(100vh - 220px)' }}>
        {/* Map Area */}
        <div className="glass-card" style={{ flex: 1, padding: 0, overflow: 'hidden', position: 'relative' }}>
          <MapContainer 
            center={CHENNAI_CENTER} 
            zoom={12} 
            style={{ height: '100%', width: '100%', backgroundColor: '#f7f7f7' }}
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; CARTO'
            />
            <HeatmapLayer points={heatPoints} />
            {mapGrids.map((line, idx) => (
              <Polyline key={idx} positions={line} color="rgba(0, 82, 255, 0.15)" weight={1} dashArray="4 4" />
            ))}
          </MapContainer>
          
          <div style={{ position: 'absolute', top: '24px', left: '24px', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 1000 }}>
             {[Layers, CloudRain, Wind, Sun].map((Icon, idx) => (
               <button key={idx} style={{ width: '42px', height: '42px', background: 'var(--bg-light)', border: '1px solid var(--border-light)', borderRadius: '8px', color: 'var(--text-muted-light)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} />
               </button>
             ))}
          </div>
        </div>

        {/* Sidebar Data */}
        <div style={{ width: '420px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto', paddingRight: '12px' }}>
          <div className="glass-card" style={{ padding: '32px', background: 'var(--bg-card-dark)', color: 'var(--text-light)' }}>
            <h3 className="brand-font" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '16px' }}>
               <Terminal size={18} color="var(--primary)" /> Signal Intelligence
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {activeHotspots.filter(h => h.trigger !== 'Baseline Risk').map((zone, idx) => {
                const colors = ['var(--primary)', 'var(--text-light)', 'var(--warning)', 'var(--danger)'];
                const riskLevel = Math.round((zone.intensity || 0) * 100);
                
                return (
                  <div key={idx} style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid var(--border-dark)', borderLeft: `4px solid ${colors[idx % colors.length]}` }}>
                    <div className="flex-between" style={{ marginBottom: '16px' }}>
                      <span style={{ fontWeight: 600, fontSize: '15px' }}>{zone.name}</span>
                      <span className="badge-neon" style={{ background: 'var(--bg-card-dark)', border: '1px solid var(--border-dark)', color: colors[idx % colors.length] }}>IDX: {riskLevel}</span>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                       <Activity size={14} color="var(--text-muted-dark)" />
                       <span style={{ fontSize: '13px', color: 'var(--text-muted-dark)', fontWeight: 600 }}>{zone.trigger} Disruption Active</span>
                    </div>
                  </div>
                );
              })}
              {activeHotspots.filter(h => h.trigger !== 'Baseline Risk').length === 0 && (
                <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted-dark)' }}>
                  <Sun size={32} style={{ marginBottom: '20px', opacity: 0.2 }} />
                  <div style={{ fontSize: '13px', letterSpacing: '0.5px' }}>Geospatial conditions stable. No active intercepts.</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default RiskMap;
