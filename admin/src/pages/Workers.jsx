import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, ShieldCheck, MapPin, Activity, AlertOctagon } from 'lucide-react';
import { GigKavachApi } from '../api';

const Workers = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GigKavachApi.getWorkers()
      .then(res => setWorkers(res.data))
      .catch(err => console.error("Error fetching workers:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="fade-in">
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="page-title">Fleet Operators Registry</h1>
          <p className="page-subtitle">Manage worker profiles, trust scores, and platform activities.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-secondary"><Filter size={16} /> Filters</button>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '0' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-glass)', display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '12px', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search by ID, Name, or Zone..." 
              style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)', padding: '10px 16px 10px 48px', borderRadius: '8px', color: 'white', fontSize: '14px' }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '11px', letterSpacing: '1px' }}>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>WORKER ID</th>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>ZONE</th>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>PLATFORM</th>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>AI TRUST SCORE</th>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>EARNINGS (WK)</th>
                <th style={{ padding: '16px 24px', fontWeight: 600, textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading registry...</td>
                </tr>
              ) : workers.map((worker) => (
                <tr key={worker.worker_id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{worker.worker_id}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Joined {new Date(worker.created_at).toLocaleDateString()}</div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                      <MapPin size={14} color="var(--primary)" /> {worker.city} • {worker.zone}
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {worker.primary_platform} • {worker.vehicle_type}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ flex: 1, height: '6px', background: 'var(--bg-card)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${worker.trust_score}%`, background: worker.trust_score > 80 ? 'var(--success)' : worker.trust_score > 50 ? 'var(--warning)' : 'var(--danger)' }} />
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 700, width: '30px', color: worker.trust_score > 80 ? 'var(--success)' : worker.trust_score > 50 ? 'var(--warning)' : 'var(--danger)' }}>
                        {worker.trust_score}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)' }}>
                    ₹{worker.avg_weekly_income}
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <button className="icon-btn" title="Audit Worker"><Activity size={18} /></button>
                    <button className="icon-btn" title="Ban / Restrict" style={{ marginLeft: '8px', color: 'var(--danger)' }}><AlertOctagon size={18} /></button>
                  </td>
                </tr>
              ))}
              {workers.length === 0 && !loading && (
                <tr>
                  <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No workers registered yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Workers;
