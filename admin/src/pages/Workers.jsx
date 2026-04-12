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
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-light)', display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '12px', color: 'var(--text-muted-light)' }} />
            <input 
              type="text" 
              placeholder="Search by ID, Name, or Zone..." 
              style={{ width: '100%', background: 'var(--surface-secondary)', border: '1px solid var(--border-light)', padding: '10px 16px 10px 48px', borderRadius: '8px', color: 'var(--text-dark)', fontSize: '14px', outline: 'none' }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
            <table className="sentinel-table">
            <thead>
              <tr>
                <th>Worker ID</th>
                <th>Zone</th>
                <th>Platform</th>
                <th>AI Trust Score</th>
                <th>Earnings (Wk)</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted-light)' }}>Loading registry...</td>
                </tr>
              ) : workers.map((worker) => (
                <tr key={worker.worker_id} className="hover-row">
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{worker.worker_id}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted-light)' }}>Joined {new Date(worker.created_at).toLocaleDateString()}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-dark)' }}>
                      <MapPin size={14} color="var(--primary)" /> {worker.city} • {worker.zone}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted-light)' }}>{worker.primary_platform} • {worker.vehicle_type}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ flex: 1, height: '8px', background: 'var(--surface-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${worker.trust_score}%`, background: worker.trust_score > 80 ? 'var(--success)' : worker.trust_score > 50 ? 'var(--warning)' : 'var(--danger)' }} />
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 600, width: '30px', color: worker.trust_score > 80 ? 'var(--success)' : worker.trust_score > 50 ? 'var(--warning)' : 'var(--danger)' }}>
                        {worker.trust_score}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-dark)' }}>₹{worker.avg_weekly_income}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="icon-btn" style={{ background: 'transparent', border: 'none', cursor: 'pointer' }} title="Audit Worker"><Activity size={18} color="var(--text-muted-light)" /></button>
                    <button className="icon-btn" style={{ background: 'transparent', border: 'none', cursor: 'pointer', marginLeft: '8px' }} title="Ban / Restrict"><AlertOctagon size={18} color="var(--danger)" /></button>
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
