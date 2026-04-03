import React, { useState, useEffect } from 'react';
import { Shield, TrendingUp, AlertTriangle, Users, Activity, Banknote } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { supabase } from '../supabase';
import SimulationPanel from '../components/SimulationPanel';

// Mock Data
const revenueData = [
  { day: 'Mon', premium: 42000, payouts: 12000 },
  { day: 'Tue', premium: 43500, payouts: 15000 },
  { day: 'Wed', premium: 45000, payouts: 38000 }, // Rain event
  { day: 'Thu', premium: 46200, payouts: 18000 },
  { day: 'Fri', premium: 48000, payouts: 14000 },
  { day: 'Sat', premium: 51000, payouts: 22000 },
  { day: 'Sun', premium: 53500, payouts: 19000 },
];

const flagsData = [
  { id: 'CLM-8924', worker: 'Ravi Kumar', type: 'Spoofed Mock Location', status: 'High Risk', score: 12 },
  { id: 'CLM-8921', worker: 'Suresh P', type: 'Unusual Claim Velocity', status: 'Medium Risk', score: 45 },
  { id: 'CLM-8918', worker: 'Amit S', type: 'Device Fingerprint Mismatch', status: 'High Risk', score: 18 },
  { id: 'CLM-8905', worker: 'Deepak M', type: 'Syndicate Pattern Detect', status: 'Critical', score: 8 },
];

const Dashboard = () => {
  const [showSim, setShowSim] = useState(false);
  const [stats, setStats] = useState({
    activePolicies: 0,
    premiumPool: 0,
    claimsProcessing: 0,
    fraudFlags: 0,
    revenueData: [
      { day: 'Mon', premium: 0, payouts: 0 },
      { day: 'Tue', premium: 0, payouts: 0 },
      { day: 'Wed', premium: 0, payouts: 0 },
      { day: 'Thu', premium: 0, payouts: 0 },
      { day: 'Fri', premium: 0, payouts: 0 },
      { day: 'Sat', premium: 0, payouts: 0 },
      { day: 'Sun', premium: 0, payouts: 0 },
    ],
    flagsData: []
  });

  useEffect(() => {
    const fetchData = async () => {
      // 1. Fetch Active Policies Count
      const { count: policyCount } = await supabase
        .from('policies')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // 2. Fetch Premium Pool Sum
      const { data: poolData } = await supabase
        .from('policies')
        .select('weekly_premium')
        .eq('status', 'active');
      const totalPool = poolData?.reduce((acc, curr) => acc + Number(curr.weekly_premium), 0) || 0;

      // 3. Fetch Claims count
      const { count: claimsCount } = await supabase
        .from('claims')
        .select('*', { count: 'exact', head: true });

      // 4. Fetch Fraud Flags (Confidence < 40)
      const { count: fraudCount, data: flags } = await supabase
        .from('claims')
        .select('*', { count: 'exact' })
        .lt('confidence_score', 40)
        .limit(4);

      setStats(prev => ({
        ...prev,
        activePolicies: policyCount || 0,
        premiumPool: totalPool,
        claimsProcessing: claimsCount || 0,
        fraudFlags: fraudCount || 0,
        flagsData: flags?.map(f => ({
          id: f.claim_id,
          worker: f.worker_id,
          type: f.trigger_label,
          status: f.status === 'soft_review' ? 'Review' : 'High Risk',
          score: f.confidence_score
        })) || []
      }));
    };

    fetchData();

    // Set up Realtime subscriptions
    const polSub = supabase.channel('dashboard-policies').on('postgres_changes', { event: '*', schema: 'public', table: 'policies' }, fetchData).subscribe();
    const clmSub = supabase.channel('dashboard-claims').on('postgres_changes', { event: '*', schema: 'public', table: 'claims' }, fetchData).subscribe();

    return () => {
      supabase.removeChannel(polSub);
      supabase.removeChannel(clmSub);
    };
  }, []);

  return (
    <div>
      <div className="page-title">
        Command Center
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ padding: '8px 16px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>
            Export Report
          </button>
          <button 
            onClick={() => setShowSim(true)}
            style={{ padding: '8px 16px', background: 'var(--primary)', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Activity size={16} /> Incident Simulator
          </button>
        </div>
      </div>

      {showSim && <SimulationPanel onClose={() => setShowSim(false)} />}

      <div className="grid-cols-4">
        <div className="glass-card stat-card">
          <div className="stat-header">
            <span className="stat-title">Active Policies</span>
            <div className="stat-icon" style={{ background: 'var(--bg-surface)', color: 'var(--primary)' }}>
              <Shield size={20} />
            </div>
          </div>
          <div className="stat-value">{stats.activePolicies.toLocaleString()}</div>
          <div className="stat-trend trend-up"><TrendingUp size={14} /> Live tracking</div>
        </div>
        
        <div className="glass-card stat-card">
          <div className="stat-header">
            <span className="stat-title">Premium Pool</span>
            <div className="stat-icon" style={{ background: 'var(--bg-card-light)', color: 'var(--success)' }}>
              <Banknote size={20} />
            </div>
          </div>
          <div className="stat-value">₹{(stats.premiumPool / 1000).toFixed(1)}k</div>
          <div className="stat-trend trend-up"><TrendingUp size={14} /> Total active risk</div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-header">
            <span className="stat-title">Claims Processing</span>
            <div className="stat-icon" style={{ background: 'var(--bg-surface)', color: 'var(--primary)' }}>
              <Activity size={20} />
            </div>
          </div>
          <div className="stat-value">{stats.claimsProcessing} events</div>
          <div className="stat-trend trend-up" style={{ color: 'var(--success)' }}><TrendingUp size={14} /> Parametric triggers</div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-header">
            <span className="stat-title">Fraud Flags</span>
            <div className="stat-icon" style={{ background: 'rgba(198, 40, 40, 0.1)', color: 'var(--danger)' }}>
              <AlertTriangle size={20} />
            </div>
          </div>
          <div className="stat-value">{stats.fraudFlags}</div>
          <div className="stat-trend trend-down"><TrendingUp size={14} /> ML Anomaly detect</div>
        </div>
      </div>

      <div className="grid-cols-2">
        <div className="glass-card">
          <div className="card-title">Liquidity vs Payouts (7 Days)</div>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPremium" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPayout" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--danger)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--danger)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Legend iconType="circle" />
                <Area type="monotone" name="Collected Premiums" dataKey="premium" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorPremium)" />
                <Area type="monotone" name="Claim Payouts" dataKey="payouts" stroke="var(--danger)" strokeWidth={3} fillOpacity={1} fill="url(#colorPayout)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card">
          <div className="flex-between" style={{ marginBottom: '20px' }}>
            <div className="card-title" style={{ margin: 0 }}>Active Fraud Alerts</div>
            <a href="/fraud" style={{ color: 'var(--primary)', fontSize: '13px', textDecoration: 'none', fontWeight: 600 }}>View All</a>
          </div>
          
          <table className="data-table">
            <thead>
              <tr>
                <th>Claim ID</th>
                <th>Worker</th>
                <th>Flag Type</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {stats.flagsData.map((flag, i) => (
                <tr key={i}>
                  <td style={{ color: 'var(--primary)', fontWeight: 500 }}>{flag.id}</td>
                  <td>{flag.worker}</td>
                  <td>{flag.type}</td>
                  <td>
                    <span className={`status-chip ${flag.status === 'Critical' ? 'status-danger' : flag.score < 20 ? 'status-danger' : 'status-warning'}`}>
                      {flag.score}/100
                    </span>
                  </td>
                </tr>
              ))}
              {stats.flagsData.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    No critical anomalies detected recently.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
