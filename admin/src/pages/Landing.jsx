import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Activity, Cpu, Zap, ChevronRight } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      backgroundColor: 'var(--bg-obsidian)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Animated Elements */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '800px',
        height: '800px',
        background: 'radial-gradient(circle, rgba(0, 229, 255, 0.05) 0%, transparent 70%)',
        zIndex: 0
      }} />
      
      <div className="main-wrapper" style={{ 
        zIndex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'transparent'
      }}>
        <div className="glass-card neon-border" style={{ 
          maxWidth: '500px', 
          width: '90%', 
          textAlign: 'center',
          padding: '60px 40px',
          background: 'rgba(10, 15, 25, 0.8)'
        }}>
          <div className="brand-icon" style={{ margin: '0 auto 32px', width: '64px', height: '64px' }}>
            <Shield size={32} color="white" />
          </div>
          
          <h1 style={{ 
            fontSize: '42px', 
            fontWeight: 800, 
            marginBottom: '16px',
            background: 'linear-gradient(to bottom, #FFFFFF 0%, #A0AEC0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            SENTINEL COMMAND
          </h1>
          
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '18px', 
            lineHeight: 1.6,
            marginBottom: '40px'
          }}>
            Advanced Parametric AI Insurance Operating System. 
            Real-time disruption monitoring and autonomous claim verification initialized.
          </p>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '16px',
            marginBottom: '40px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <Activity size={20} color="var(--primary)" style={{ marginBottom: '8px' }} />
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Live Feeds</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Cpu size={20} color="var(--accent)" style={{ marginBottom: '8px' }} />
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>AI Core</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Zap size={20} color="var(--success)" style={{ marginBottom: '8px' }} />
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Auto Payout</div>
            </div>
          </div>

          <button 
            onClick={() => navigate('/dashboard')}
            className="payout-btn"
            style={{ 
              width: '100%', 
              fontSize: '18px', 
              padding: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}
          >
            INITIALIZE COMMAND CENTER
            <ChevronRight size={20} />
          </button>
          
          <div style={{ 
            marginTop: '24px', 
            fontSize: '12px', 
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <div className="pulse-indicator" />
            SYSTEMS READY · V5.0 SENTINEL
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
