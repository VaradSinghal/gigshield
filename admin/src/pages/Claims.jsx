import React, { useState, useEffect } from 'react';
import { Search, Filter, CheckCircle, XCircle, Clock, ChevronDown, ChevronUp, Shield, Zap, Eye, ThumbsUp, ThumbsDown, Sliders, DollarSign, Activity, FileText } from 'lucide-react';
import { supabase } from '../supabase';

const triggerStats = [
  { name: 'Heavy Rainfall', count: 847, payout: '₹3.2L', color: 'var(--primary)', pct: 42 },
  { name: 'Severe AQI', count: 412, payout: '₹1.4L', color: 'var(--accent)', pct: 20 },
  { name: 'Flooding', count: 228, payout: '₹1.8L', color: 'var(--danger)', pct: 11 },
  { name: 'Extreme Heat', count: 356, payout: '₹0.9L', color: 'var(--warning)', pct: 18 },
  { name: 'Civic Disruption', count: 180, payout: '₹0.7L', color: 'var(--primary)', pct: 9 },
];

const Claims = () => {
  const [filter, setFilter] = useState('All');
  const [expandedRow, setExpandedRow] = useState(null);
  const [reviewActions, setReviewActions] = useState({});
  const [claimsData, setClaimsData] = useState([]);

  useEffect(() => {
    const fetchClaims = async () => {
      const { data } = await supabase
        .from('claims')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (data) {
        setClaimsData(data.map(c => ({
          id: c.claim_id,
          date: new Date(c.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' }),
          worker: c.worker_id,
          zone: c.zone,
          trigger: c.trigger_label,
          triggerDetail: c.trigger_data,
          amount: c.payout_amount,
          status: c.status === 'approved' ? 'AUTO-APPROVED' : c.status === 'soft_review' ? 'REVIEW' : 'REJECTED',
          confidence: c.confidence_score,
          hours: c.inactive_hours,
          signals: c.validation_signals || { api_failure: true }
        })));
      }
    };
    fetchClaims();

    const sub = supabase.channel('claims-registry-updates').on('postgres_changes', { event: '*', schema: 'public', table: 'claims' }, fetchClaims).subscribe();
    return () => supabase.removeChannel(sub);
  }, []);

  const handleAction = async (claimId, action) => {
    setReviewActions(prev => ({ ...prev, [claimId]: action }));
    const status = action === 'approved' ? 'approved' : 'rejected';
    await supabase.from('claims').update({ status }).eq('claim_id', claimId);
  };

  const getStatusBadge = (claim) => {
    const action = reviewActions[claim.id];
    const status = action ? action.toUpperCase() : claim.status;
    
    if (status.includes('APPROVE')) return <span className="badge-neon badge-success">{status}</span>;
    if (status.includes('REJECT')) return <span className="badge-neon badge-danger">{status}</span>;
    return <span className="badge-neon badge-warning">{status}</span>;
  };

  return (
    <div className="claims-sentinel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-1px' }}>FINANCIAL REGISTRY</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Autonomous parametric payout ledger and settlement controls</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
             <button className="payout-btn" style={{ background: 'transparent', border: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileText size={18} /> EXPORT LEDGER
             </button>
        </div>
      </div>

      <div className="grid-auto" style={{ padding: 0, marginBottom: '40px' }}>
        <div className="glass-card stat-item">
          <span className="stat-label">System Autonomy</span>
          <div className="stat-value">85.7%</div>
          <div style={{ fontSize: '12px', color: 'var(--success)' }}>✓ EXCEEDS TARGET RECOVERY</div>
        </div>
        <div className="glass-card stat-item">
          <span className="stat-label">Loss Adjustment</span>
          <div className="stat-value">58.2%</div>
          <div style={{ fontSize: '12px', color: 'var(--primary)' }}>NOMINAL RISK SPREAD</div>
        </div>
        <div className="glass-card stat-item">
          <span className="stat-label">Mean Confidence</span>
          <div className="stat-value">79.3</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>PHASE 5 NEURAL VALIDATION</div>
        </div>
      </div>

      <div className="glass-card" style={{ marginBottom: '40px', padding: '32px' }}>
        <h3 className="brand-font" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
           <Activity size={20} color="var(--primary)" /> TRIGGER DISTRIBUTION
        </h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {triggerStats.map((t, i) => (
            <div key={i} style={{ flex: '1', minWidth: '180px', padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>{t.name}</div>
              <div style={{ fontSize: '24px', fontWeight: 800 }}>{t.payout}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '11px' }}>
                <span style={{ color: 'var(--text-muted)' }}>{t.count} CLAIMS</span>
                <span style={{ color: t.color, fontWeight: 700 }}>{t.pct}%</span>
              </div>
              <div style={{ marginTop: '10px', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                <div style={{ height: '100%', width: `${t.pct}%`, background: t.color, boxShadow: `0 0 10px ${t.color}` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card" style={{ padding: '0' }}>
        <div style={{ padding: '32px', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <h3 className="brand-font" style={{ margin: 0 }}>SETTLEMENT LOG</h3>
           <div style={{ display: 'flex', gap: '12px' }}>
              <div className="header-search" style={{ background: 'rgba(0,0,0,0.3)', width: '300px' }}>
                 <Search size={16} />
                 <input type="text" placeholder="Filter by Claim ID or Worker..." />
              </div>
           </div>
        </div>

        <div style={{ padding: '24px 32px 40px' }}>
          <table className="sentinel-table">
            <thead>
              <tr>
                <th width="40"></th>
                <th>CLAIM ID</th>
                <th>WORKER IDENT</th>
                <th>TRIGGER EVENT</th>
                <th>CONFIDENCE</th>
                <th>PAYOUT</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {claimsData.map((claim, i) => (
                <React.Fragment key={i}>
                  <tr onClick={() => setExpandedRow(expandedRow === i ? null : i)} style={{ cursor: 'pointer' }}>
                    <td>{expandedRow === i ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}</td>
                    <td style={{ color: 'var(--primary)', fontWeight: 700 }}>{claim.id}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{claim.worker}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{claim.zone}</div>
                    </td>
                    <td>
                       <div style={{ fontSize: '13px' }}>{claim.trigger}</div>
                       <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{claim.triggerDetail}</div>
                    </td>
                    <td>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '40px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                             <div style={{ height: '100%', width: `${claim.confidence}%`, background: claim.confidence > 70 ? 'var(--success)' : 'var(--warning)', borderRadius: '2px' }} />
                          </div>
                          <span style={{ fontSize: '12px', fontWeight: 700 }}>{claim.confidence}%</span>
                       </div>
                    </td>
                    <td style={{ fontWeight: 800 }}>₹{claim.amount}</td>
                    <td>{getStatusBadge(claim)}</td>
                  </tr>
                  
                  {expandedRow === i && (
                    <tr>
                      <td colSpan="7" style={{ padding: '0 16px 16px' }}>
                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
                           <h4 style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 800, marginBottom: '20px', letterSpacing: '1px' }}>SENTINEL VALIDATION SIGNALS</h4>
                           
                           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                              {Object.entries(claim.signals).map(([key, signal], k) => (
                                <div key={k} style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-glass)', textAlign: 'center' }}>
                                   <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>{key}</div>
                                   <div style={{ fontWeight: 700, color: signal.pass !== false ? 'var(--success)' : 'var(--danger)' }}>
                                      {signal.score !== undefined ? `${signal.score} PTS` : (signal.pass !== false ? '✓ PASS' : '✗ FAIL')}
                                   </div>
                                </div>
                              ))}
                           </div>

                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                 PARAMETRIC AUDIT: {claim.hours} HRS @ BASE RATE · AUTO-SETTLED
                              </div>
                              {claim.status === 'REVIEW' && !reviewActions[claim.id] && (
                                <div style={{ display: 'flex', gap: '12px' }}>
                                   <button onClick={(e) => { e.stopPropagation(); handleAction(claim.id, 'approved'); }} className="payout-btn" style={{ padding: '8px 20px', fontSize: '12px' }}>AUTHORIZE</button>
                                   <button onClick={(e) => { e.stopPropagation(); handleAction(claim.id, 'rejected'); }} style={{ padding: '8px 20px', fontSize: '12px', background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: '12px', cursor: 'pointer' }}>BLOCK</button>
                                </div>
                              )}
                           </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


export default Claims;
