import React, { useState } from 'react';
import { CloudRain, Wind, AlertCircle, X, Zap } from 'lucide-react';
import { supabase } from '../supabase';

const SimulationPanel = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const triggerIncident = async (type, label, zone, risk) => {
    setLoading(true);
    setStatus(`Triggering ${label}...`);
    
    const triggerId = `TRG-${Math.floor(Math.random() * 90000) + 10000}`;
    
    const { error } = await supabase
      .from('active_triggers')
      .upsert({
        trigger_id: triggerId,
        city: 'Chennai',
        zone: zone,
        label: label,
        threshold: risk > 7 ? 'Critical' : 'Moderate',
        current_value: risk > 7 ? 'Extreme' : 'Above Threshold',
        risk_level: risk,
        status: 'active',
        source: 'IoT Sensor Mesh',
        updated_at: new Date().toISOString()
      }, { onConflict: 'trigger_id, city, zone' });

    if (error) {
      console.error('Trigger Error:', error);
      setStatus(`Error: ${error.message}`);
    } else {
      setStatus(`Success! ${label} active in ${zone}.`);
      setTimeout(() => setStatus(null), 3000);
    }
    setLoading(false);
  };

  return (
    <div style={{ position: 'fixed', top: 0, right: 0, width: '400px', height: '100vh', background: 'var(--bg-card)', boxShadow: '-4px 0 24px rgba(0,0,0,0.1)', zIndex: 2000, padding: '32px', display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--border-subtle)' }}>
      <div className="flex-between" style={{ marginBottom: '32px' }}>
        <h2 style={{ margin: 0, fontSize: '20px', color: 'var(--text-primary)' }}>Incident Simulator</h2>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24} /></button>
      </div>

      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
        Use this panel to simulate real-world environmental disruptions. This will trigger the parametric engine and notify active workers in affected zones.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <button 
          disabled={loading}
          onClick={() => triggerIncident('weather', 'Heavy Rainfall', 'Velachery', 8.5)}
          style={{ padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px', textAlign: 'left' }}
        >
          <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(52, 152, 219, 0.1)', color: '#3498db' }}><CloudRain size={24} /></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Heavy Rainfall (Velachery)</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Trigger 8.5 Risk Score</div>
          </div>
        </button>

        <button 
          disabled={loading}
          onClick={() => triggerIncident('aqi', 'Severe AQI Alert', 'T. Nagar', 7.2)}
          style={{ padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px', textAlign: 'left' }}
        >
          <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(155, 89, 182, 0.1)', color: '#9b59b6' }}><Wind size={24} /></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Severe AQI (T. Nagar)</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Trigger 7.2 Risk Score</div>
          </div>
        </button>

        <button 
          disabled={loading}
          onClick={() => triggerIncident('civic', 'Zone Lockdown', 'Adyar', 9.8)}
          style={{ padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px', textAlign: 'left' }}
        >
          <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c' }}><AlertCircle size={24} /></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Zone Lockdown (Adyar)</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Trigger 9.8 Risk Score</div>
          </div>
        </button>
      </div>

      <div style={{ marginTop: 'auto' }}>
        {status && (
          <div style={{ padding: '12px', borderRadius: '8px', background: status.includes('Success') ? 'rgba(46, 204, 113, 0.1)' : 'rgba(52, 152, 219, 0.1)', color: status.includes('Success') ? '#27ae60' : '#2980b9', fontSize: '13px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
             <Zap size={16} /> {status}
          </div>
        )}
        
        <button 
          onClick={async () => {
            const { error } = await supabase.from('active_triggers').delete().neq('zone', 'Baseline');
            if (!error) setStatus('All active triggers cleared.');
          }}
          style={{ width: '100%', padding: '12px', marginTop: '16px', background: 'none', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}
        >
          Clear All Active Triggers
        </button>
      </div>
    </div>
  );
};

export default SimulationPanel;
