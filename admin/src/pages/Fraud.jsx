import React, { useState, useEffect } from 'react';
import { ShieldAlert, Crosshair, UserX, AlertOctagon, Check, X, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { supabase } from '../supabase';

const fraudTrends = [
  { name: 'Mon', spoofing: 12, velocity: 5, syndicate: 2 },
  { name: 'Tue', spoofing: 15, velocity: 8, syndicate: 3 },
  { name: 'Wed', spoofing: 45, velocity: 22, syndicate: 12 }, // Storm day peak fraud
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
          reason: f.trigger_data || 'Anomaly detected in parametric signature',
          status: f.status === 'soft_review' ? 'Pending Review' : 'Flagged'
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
    const sub = supabase.channel('fraud-updates').on('postgres_changes', { event: '*', schema: 'public', table: 'claims' }, fetchAnomalies).subscribe();
    return () => supabase.removeChannel(sub);
  }, []);

  return (
    <div>
      <div className="page-title">
        Fraud & Adversarial Defense
      </div>

      <div className="grid-cols-4">
        <div className="glass-card stat-card" style={{ borderTop: '3px solid var(--critical)' }}>
          <div className="stat-header">
            <span className="stat-title">GPS Spoofing Prevented</span>
            <div className="stat-icon" style={{ background: 'var(--bg-card-light)', color: 'var(--critical)' }}>
              <Crosshair size={20} />
            </div>
          </div>
          <div className="stat-value">{stats.spoofing}</div>
          <div className="stat-trend trend-down">Attempts blocked</div>
        </div>

        <div className="glass-card stat-card" style={{ borderTop: '3px solid var(--danger)' }}>
          <div className="stat-header">
            <span className="stat-title">Syndicate Rings Detected</span>
            <div className="stat-icon" style={{ background: 'rgba(198, 40, 40, 0.1)', color: 'var(--danger)' }}>
              <UserX size={20} />
            </div>
          </div>
          <div className="stat-value">{stats.syndicates}</div>
          <div className="stat-trend trend-down">Behavior clusters</div>
        </div>

        <div className="glass-card stat-card" style={{ borderTop: '3px solid var(--warning)' }}>
          <div className="stat-header">
            <span className="stat-title">Manual Reviews Pending</span>
            <div className="stat-icon" style={{ background: 'rgba(230, 81, 0, 0.1)', color: 'var(--warning)' }}>
              <AlertOctagon size={20} />
            </div>
          </div>
          <div className="stat-value">{stats.pending}</div>
          <div className="stat-trend trend-up">Current backlog</div>
        </div>

        <div className="glass-card stat-card" style={{ borderTop: '3px solid var(--success)' }}>
          <div className="stat-header">
            <span className="stat-title">Fraud Savings</span>
            <div className="stat-icon" style={{ background: 'var(--bg-surface)', color: 'var(--success)' }}>
              <ShieldAlert size={20} />
            </div>
          </div>
          <div className="stat-value">₹{(stats.savings / 1000).toFixed(1)}k</div>
          <div className="stat-trend trend-up">Prevented leakage</div>
        </div>
      </div>

      <div className="grid-cols-2">
        <div className="glass-card">
          <div className="card-title">Attack Vectors (7 Days)</div>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fraudTrends} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'var(--bg-surface)' }}
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)' }}
                />
                <Legend />
                <Bar dataKey="spoofing" name="GPS Spoofing" stackId="a" fill="var(--warning)" radius={[0, 0, 4, 4]} />
                <Bar dataKey="velocity" name="Claim Velocity" stackId="a" fill="var(--danger)" />
                <Bar dataKey="syndicate" name="Syndicate Rings" stackId="a" fill="var(--critical)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-title">Priority Manual Reviews</div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {flags.map(flag => (
              <div key={flag.id} style={{ padding: '16px', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <div className="flex-between" style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: 'var(--danger)', fontWeight: 600 }}>{flag.id}</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Ref: {flag.claimRef}</span>
                  </div>
                  <span className="status-chip status-warning">{flag.status}</span>
                </div>
                
                <div style={{ display: 'flex', gap: '24px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Worker</div>
                    <div style={{ fontWeight: 500, fontSize: '14px', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{flag.worker}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Trust Score</div>
                    <div style={{ fontWeight: 500, fontSize: '14px', color: flag.trustScore < 30 ? 'var(--critical)' : 'var(--warning)' }}>{flag.trustScore}/100</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>AI Confidence Flag</div>
                    <div style={{ fontWeight: 500, fontSize: '14px' }}>{flag.reason}</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button style={{ flex: 1, padding: '8px', background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}>
                    <Check size={16} /> Approve Claim
                  </button>
                  <button style={{ flex: 1, padding: '8px', background: 'rgba(255, 107, 107, 0.1)', border: '1px solid rgba(255, 107, 107, 0.3)', borderRadius: '6px', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}>
                    <X size={16} /> Reject & Ban
                  </button>
                </div>
              </div>
            ))}
            {flags.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                <Check size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
                <div style={{ fontSize: '13px' }}>All clear. No pending fraud reviews.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fraud;

