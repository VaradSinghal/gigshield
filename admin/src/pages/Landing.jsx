import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ChevronRight, Activity, Cpu, ShieldCheck } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      backgroundColor: 'var(--bg-light)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }}>
      {/* Navigation Bar */}
      <header style={{
        padding: '24px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--border-light)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/gigkavach-logo.svg" alt="GigKavach AI" style={{ height: '80px' }} />
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button className="btn-secondary" style={{ border: 'none', background: 'transparent' }}>Platform</button>
          <button className="btn-secondary" style={{ border: 'none', background: 'transparent' }}>Company</button>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-secondary"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>

          <h1 style={{
            fontSize: '80px',
            fontWeight: 500,
            letterSpacing: '-2.5px',
            lineHeight: 1.0,
            color: 'var(--text-dark)',
            marginBottom: '24px',
            fontFamily: 'var(--font-display)'
          }}>
            The future of gig worker protection.
          </h1>

          <p style={{
            color: 'var(--text-muted-light)',
            fontSize: '20px',
            lineHeight: 1.5,
            marginBottom: '48px',
            maxWidth: '600px',
            margin: '0 auto 48px',
            fontFamily: 'var(--font-text)'
          }}>
            GigKavach is an institutional parametric insurance OS. We deploy autonomous ML engines to protect your delivery fleet from environmental hazards with zero-touch payouts.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button
              onClick={() => navigate('/dashboard')}
              className="payout-btn"
              style={{ padding: '20px 48px', fontSize: '18px' }}
            >
              Access Sentinel
            </button>
            <button
              className="btn-secondary"
              style={{ padding: '20px 48px', fontSize: '18px', background: 'var(--surface-secondary)' }}
            >
              View Documentation
            </button>
          </div>
        </div>

        {/* Feature Teasers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '32px',
          marginTop: '100px',
          maxWidth: '1000px',
          width: '100%'
        }}>
          <div style={{ textAlign: 'left', padding: '32px', border: '1px solid var(--border-light)', borderRadius: '16px' }}>
            <Activity size={24} color="var(--primary)" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '8px' }}>Parametric Engine</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted-light)', lineHeight: 1.5 }}>Real-time connection to civic disruption feeds, IMD weather warnings, and local traffic grids driving instant verification.</p>
          </div>

          <div style={{ textAlign: 'left', padding: '32px', border: '1px solid var(--border-light)', borderRadius: '16px', background: 'var(--bg-card-dark)' }}>
            <Cpu size={24} color="#eef0f3" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#ffffff', marginBottom: '8px' }}>Risk Intelligence</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted-dark)', lineHeight: 1.5 }}>Multi-Layer Perceptron neural nets execute autonomous fraud detection bounding geographic GPS anomalies in milliseconds.</p>
          </div>

          <div style={{ textAlign: 'left', padding: '32px', border: '1px solid var(--border-light)', borderRadius: '16px' }}>
            <ShieldCheck size={24} color="var(--success)" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '8px' }}>Zero-Touch Claims</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted-light)', lineHeight: 1.5 }}>The moment an environmental risk passes the AI threshold, funds are cryptographically dispatched. No user input required.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
