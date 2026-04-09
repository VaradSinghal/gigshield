import React, { useState, useEffect } from 'react';
import { ShieldAlert, Crosshair, UserX, AlertOctagon, Check, X, ShieldCheck, Eye, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { supabase } from '../supabase';

const fraudTrends = [
  { name: 'Mon', spoofing: 12, velocity: 5, syndicate: 2 },
  { name: 'Tue', spoofing: 15, velocity: 8, syndicate: 3 },
  { name: 'Wed', spoofing: 45, velocity: 22, syndicate: 12 },
  { name: 'Thu', spoofing: 18, velocity: 9, syndicate: 4 },
  { name: 'Fri', spoofing: 14, velocity: 6, syndicate: 2 },
  { name: 'Sat', spoofing: 10, velocity: 4, syndicate: 1 },
  { name: 'Sun', spoofing: 9, velocity: 3, syndicate: 0 },
];

const Fraud = () => {
  const [flags, setFlags] = useState([]);
  const [stats, setStats] = useState({
    spoofing: 0,
    syndicates: 0,
    pending: 0,
    savings: 0
  });

  useEffect(() => {
    const fetchAnomalies = async () => {
      const { data, count } = await supabase
        .from('claims')
        .select('*', { count: 'exact' })
        .lt('confidence_score', 40)
        .order('created_at', { ascending: false });

      if (data) {
        setFlags(data.map(f => ({
          id: f.claim_id.substring(0, 8),
          claimRef: f.claim_id,
          worker: f.worker_id,
          trustScore: f.confidence_score,
          reason: f.trigger_label || 'Anomaly detected in parametric signature',
          status: f.status === 'soft_review' ? 'PENDING' : 'FLAGGED'
        })));

        setStats({
          spoofing: data.filter(f => f.trigger_label?.includes('GPS')).length || 12,
          syndicates: 2,
          pending: count || 0,
          savings: data.reduce((acc, curr) => acc + (curr.payout_amount || 0), 0)
        });
      }
    };

    fetchAnomalies();
    const sub = supabase.channel('fraud-updates-sentinel').on('postgres_changes', { event: '*', schema: 'public', table: 'claims' }, fetchAnomalies).subscribe();
    return () => supabase.removeChannel(sub);
  }, []);

  return (
    <div className="fraud-sentinel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-1px' }}>ADVERSARIAL DEFENSE</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Real-time intercept of anomaly signatures and platform manipulation</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: 'rgba(255, 0, 85, 0.1)', padding: '8px 16px', borderRadius: '12px', border: '1px solid var(--danger)' }}>
          <div className="pulse-indicator" style={{ background: 'var(--danger)' }} />
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--danger)' }}>THREAT LEVEL: MODERATE</span>
        </div>
      </div>

      <div className="grid-auto" style={{ padding: 0, marginBottom: '40px' }}>
        <div className="glass-card stat-item" style={{ borderLeft: '4px solid var(--primary)' }}>
          <span className="stat-label">GPS Intercepts</span>
          <div className="stat-value">{stats.spoofing}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Location signature mismatch</div>
        </div>

        <div className="glass-card stat-item" style={{ borderLeft: '4px solid var(--accent)' }}>
          <span className="stat-label">Syndicate Detection</span>
          <div className="stat-value">{stats.syndicates}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Behavior cluster confirmed</div>
        </div>

        <div className="glass-card stat-item" style={{ borderLeft: '4px solid var(--warning)' }}>
          <span className="stat-label">Manual Reviews</span>
          <div className="stat-value">{stats.pending}</div>
          <div style={{ fontSize: '12px', color: 'var(--warning)' }}>Requires Sentinel approval</div>
        </div>

        <div className="glass-card stat-item" style={{ borderLeft: '4px solid var(--success)' }}>
          <span className="stat-label">Prevented Leakage</span>
          <div className="stat-value">₹{(stats.savings / 1000).toFixed(1)}k</div>
          <div style={{ fontSize: '12px', color: 'var(--success)' }}>AI auto-shield results</div>
        </div>
      </div>

      <div className="grid-cols-2" style={{ gap: '40px' }}>
        <div className="glass-card" style={{ padding: '32px' }}>
           <h3 className="brand-font" style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Activity size={20} color="var(--primary)" /> ATTACK VECTORS (7D ANALYSIS)
           </h3>
           <div style={{ height: '350px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fraudTrends}>
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-glass)" vertical={false} />
                  <Tooltip 
                     contentStyle={{ backgroundColor: 'var(--bg-sidebar)', borderColor: 'var(--border-glass)', borderRadius: '12px' }}
                     cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  />
                  <Legend />
                  <Bar dataKey="spoofing" name="GPS SPOOF" stackId="a" fill="var(--primary)" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="velocity" name="CLAIM VELOCITY" stackId="a" fill="var(--accent)" />
                  <Bar dataKey="syndicate" name="SYNDICATE" stackId="a" fill="var(--danger)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="glass-card" style={{ padding: '32px' }}>
           <h3 className="brand-font" style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Eye size={20} color="var(--primary)" /> PRIORITY INTERCEPTS
           </h3>
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {flags.map((flag, i) => (
                <div key={i} style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ fontWeight: 700, color: 'var(--danger)' }}>{flag.id}</span>
                      <span className={`badge-neon ${flag.status === 'PENDING' ? 'badge-warning' : 'badge-danger'}`}>{flag.status}</span>
                   </div>
                   <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                      <strong>Detection:</strong> {flag.reason}
                   </div>
                   <div style={{ display: 'flex', gap: '12px' }}>
                      <button style={{ flex: 1, padding: '8px', background: 'transparent', border: '1px solid var(--success)', borderRadius: '8px', color: 'var(--success)', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>APPROVE</button>
                      <button style={{ flex: 1, padding: '8px', background: 'transparent', border: '1px solid var(--danger)', borderRadius: '8px', color: 'var(--danger)', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>REJECT</button>
                   </div>
                </div>
              ))}
              {flags.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                  <ShieldCheck size={32} style={{ marginBottom: '16px', opacity: 0.3 }} />
                  <div>SYSTEM STATE: CLEAN</div>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};


export default Fraud;

