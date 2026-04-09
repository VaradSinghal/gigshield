import React, { useState, useEffect } from 'react';
import { 
  Play, 
  RotateCcw, 
  ShieldCheck, 
  Zap, 
  AlertTriangle, 
  MapPin, 
  CloudRain, 
  Smartphone, 
  ChevronRight,
  ShieldAlert,
  Fingerprint,
  Activity,
  Cpu
} from 'lucide-react';
import { GigKavachApi } from '../api';

const SimulationSuite = () => {
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [step, setStep] = useState(0); // 0: Ready, 1: Premium, 2: Event, 3: Claim, 4: Result

  useEffect(() => {
    fetchScenarios();
  }, []);

  const fetchScenarios = async () => {
    try {
      const data = await GigKavachApi.getScenarios();
      setScenarios(data);
      if (data.length > 0) setSelectedScenario(data[0]);
    } catch (err) {
      console.error("Failed to fetch scenarios:", err);
    }
  };

  const runSimulation = async () => {
    if (!selectedScenario) return;
    setIsRunning(true);
    setResults(null);
    setStep(1);

    setTimeout(() => setStep(2), 1500); 
    setTimeout(() => setStep(3), 3000);

    try {
      const data = await GigKavachApi.runScenario(selectedScenario.id);
      
      setTimeout(() => {
        setResults(data);
        setStep(4);
        setIsRunning(false);
      }, 4500);
    } catch (err) {
      console.error("Simulation error:", err);
      setIsRunning(false);
    }
  };

  const resetAll = () => {
    setStep(0);
    setResults(null);
    setIsRunning(false);
  };

  return (
    <div className="simulation-sentinel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-1px' }}>DIGITAL TWIN SIMULATOR</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Adversarial testing environment for AI Fraud & Parametric Payout engines</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button onClick={resetAll} disabled={isRunning} style={{ padding: '12px 20px', background: 'transparent', border: '1px solid var(--border-glass)', borderRadius: '12px', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <RotateCcw size={18} /> RESET
          </button>
          <button onClick={runSimulation} disabled={isRunning} className="payout-btn" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Play size={18} fill="currentColor" /> INITIATE FULL SEQUENCE
          </button>
        </div>
      </div>

      <div className="grid-cols-3" style={{ gridTemplateColumns: '1fr 2fr 1fr', gap: '40px', alignItems: 'start' }}>
        
        {/* Left: Scenarios */}
        <div className="glass-card" style={{ padding: '24px' }}>
           <h3 className="brand-font" style={{ marginBottom: '24px', fontSize: '16px', color: 'var(--primary)' }}>TEST VECTOR SELECTION</h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {scenarios.map((s) => (
                <div 
                  key={s.id}
                  onClick={() => !isRunning && setSelectedScenario(s)}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid',
                    borderColor: selectedScenario?.id === s.id ? 'var(--primary)' : 'var(--border-glass)',
                    background: selectedScenario?.id === s.id ? 'rgba(0, 229, 255, 0.05)' : 'transparent',
                    cursor: isRunning ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: selectedScenario?.id === s.id ? 'var(--shadow-neon)' : 'none'
                  }}
                >
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '14px' }}>{s.name}</span>
                      {s.expected_outcome === 'auto_approve' ? <ShieldCheck size={14} color="var(--success)" /> : <ShieldAlert size={14} color="var(--danger)" />}
                   </div>
                   <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>TYPE: {s.fraud_type.replace('_', ' ')}</div>
                </div>
              ))}
           </div>
           
           {selectedScenario && (
             <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border-glass)' }}>
                <h4 style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>WORKER SUBJECT DATA</h4>
                <div style={{ display: 'grid', gap: '12px' }}>
                   <div className="flex-between">
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ID:</span>
                      <span style={{ fontSize: '12px', fontWeight: 600 }}>{selectedScenario.profile.worker_id}</span>
                   </div>
                   <div className="flex-between">
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Zone:</span>
                      <span style={{ fontSize: '12px', fontWeight: 600 }}>{selectedScenario.profile.zone}</span>
                   </div>
                   <div className="flex-between">
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Trust Score:</span>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--success)' }}>{(selectedScenario.profile.trust_score * 100).toFixed(0)}%</span>
                   </div>
                </div>
             </div>
           )}
        </div>

        {/* Center: Live Stage */}
        <div className="glass-card neon-border" style={{ padding: '0', overflow: 'hidden', minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
           <div style={{ padding: '24px', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                 {[1,2,3,4].map(i => (
                   <div key={i} style={{ width: '40px', height: '4px', borderRadius: '2px', background: step >= i ? 'var(--primary)' : 'var(--border-glass)', boxShadow: step >= i ? '0 0 10px var(--primary)' : 'none' }} />
                 ))}
              </div>
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1px', color: isRunning ? 'var(--primary)' : 'var(--text-muted)' }}>
                 {isRunning ? 'SEQUENCE ACTIVE' : 'SYSTEM IDLE'}
              </div>
           </div>
           
           <div style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* STAGE 1 */}
              <div style={{ 
                display: 'flex', gap: '24px', alignItems: 'center', padding: '24px', borderRadius: '16px', 
                border: '1px solid', borderColor: step === 1 ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                background: step === 1 ? 'rgba(0, 229, 255, 0.05)' : step > 1 ? 'rgba(0, 255, 148, 0.03)' : 'transparent',
                opacity: step >= 1 ? 1 : 0.3
              }}>
                 <div className="brand-icon" style={{ width: '48px', height: '48px', background: step >= 1 ? 'linear-gradient(135deg, var(--primary), var(--accent))' : '#111' }}>
                    <Zap size={20} color="white" />
                 </div>
                 <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>STAGE 01</div>
                    <div style={{ fontWeight: 700 }}>NEURAL PREMIUM CALCULATION</div>
                    {step === 1 && <div style={{ fontSize: '12px', color: 'var(--primary)', marginTop: '4px' }}>Synthesizing hyper-local risk factors...</div>}
                    {step > 1 && results && <div style={{ fontSize: '14px', color: 'var(--success)', marginTop: '4px', fontWeight: 700 }}>MODERN PRICE GENERATED: ₹{results.premium.weekly_premium}</div>}
                 </div>
              </div>

              {/* STAGE 2 */}
              <div style={{ 
                display: 'flex', gap: '24px', alignItems: 'center', padding: '24px', borderRadius: '16px', 
                border: '1px solid', borderColor: step === 2 ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                background: step === 2 ? 'rgba(0, 229, 255, 0.05)' : step > 2 ? 'rgba(0, 255, 148, 0.03)' : 'transparent',
                opacity: step >= 2 ? 1 : 0.3
              }}>
                 <div className="brand-icon" style={{ width: '48px', height: '48px', background: step >= 2 ? 'linear-gradient(135deg, var(--primary), var(--accent))' : '#111' }}>
                    <CloudRain size={20} color="white" />
                 </div>
                 <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>STAGE 02</div>
                    <div style={{ fontWeight: 700 }}>PARAMETRIC DISRUPTION DETECTION</div>
                    {step === 2 && <div style={{ fontSize: '12px', color: 'var(--primary)', marginTop: '4px' }}>Awaiting IoT trigger signature...</div>}
                    {step > 2 && results && <div style={{ fontSize: '14px', color: 'var(--success)', marginTop: '4px', fontWeight: 700 }}>TRIGGER CONFIRMED: {results.trigger.label}</div>}
                 </div>
              </div>

              {/* STAGE 3 */}
              <div style={{ 
                display: 'flex', gap: '24px', alignItems: 'center', padding: '24px', borderRadius: '16px', 
                border: '1px solid', borderColor: step === 3 ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                background: step === 3 ? 'rgba(0, 229, 255, 0.05)' : step > 3 ? 'rgba(0, 255, 148, 0.03)' : 'transparent',
                opacity: step >= 3 ? 1 : 0.3
              }}>
                 <div className="brand-icon" style={{ width: '48px', height: '48px', background: step >= 3 ? 'linear-gradient(135deg, var(--primary), var(--accent))' : '#111' }}>
                    <Smartphone size={20} color="white" />
                 </div>
                 <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>STAGE 03</div>
                    <div style={{ fontWeight: 700 }}>MOBILE HANDSHAKE & SUBMISSION</div>
                    {step === 3 && <div className="pulse-indicator" style={{ display: 'inline-block', marginRight: '8px' }} />}
                    {step === 3 && <span style={{ fontSize: '12px', color: 'var(--primary)' }}>Intercepting worker app payload...</span>}
                    {step > 3 && <div style={{ fontSize: '14px', color: 'var(--success)', marginTop: '4px', fontWeight: 700 }}>CLAIM TRANSMITTED TO SENTINEL</div>}
                 </div>
              </div>

              {/* STAGE 4 */}
              <div style={{ 
                display: 'flex', gap: '24px', alignItems: 'center', padding: '24px', borderRadius: '16px', 
                border: '1px solid', borderColor: step === 4 ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                background: step === 4 ? (results?.claim.action === 'rejected' ? 'rgba(255, 0, 85, 0.05)' : 'rgba(0, 255, 148, 0.05)') : 'transparent',
                opacity: step >= 4 ? 1 : 0.3
              }}>
                 <div className="brand-icon" style={{ width: '48px', height: '48px', background: step >= 4 ? (results?.claim.action === 'rejected' ? 'var(--danger)' : 'var(--success)') : '#111' }}>
                    <ShieldCheck size={20} color="white" />
                 </div>
                 <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>STAGE 04</div>
                    <div style={{ fontWeight: 700 }}>ADVERSARIAL AI VERDICT</div>
                    {step === 4 && results && (
                      <div style={{ marginTop: '8px' }}>
                         <div style={{ fontSize: '16px', fontWeight: 800, color: results.claim.action === 'rejected' ? 'var(--danger)' : 'var(--success)' }}>
                            {results.claim.action_label.toUpperCase()}
                         </div>
                         <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>CONFIDENCE SCORE: {results.claim.confidence_score}%</div>
                      </div>
                    )}
                 </div>
              </div>

           </div>
        </div>

        {/* Right: Signal Intel */}
        <div className="glass-card" style={{ padding: '24px' }}>
            <h3 className="brand-font" style={{ marginBottom: '24px', fontSize: '16px', color: 'var(--primary)' }}>INTELLIGENCE DECOMPOSITION</h3>
            {results ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                 {Object.entries(results.claim.validation_signals).map(([key, signal]) => (
                   <div key={key} style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)' }}>
                      <div className="flex-between" style={{ marginBottom: '8px' }}>
                         <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px' }}>{key}</span>
                         <span style={{ fontSize: '10px', color: signal.passed ? 'var(--success)' : 'var(--danger)', fontWeight: 700 }}>{signal.passed ? '✓ CLEAR' : '✗ ANOMALY'}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{signal.detail}</div>
                   </div>
                 ))}
                 
                 <div style={{ marginTop: '24px', padding: '16px', borderRadius: '12px', background: 'var(--bg-obsidian)', border: '1px dashed var(--border-glass)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>SYSTEM REASONING</div>
                    <p style={{ fontSize: '13px', fontStyle: 'italic', lineHeight: 1.5 }}>
                       "{results.claim.rejection_reason || results.claim.review_reason || 'Patterns match expected worker behavior profiles. Payout authorized.'}"
                    </p>
                 </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '100px 20px', color: 'var(--text-muted)' }}>
                 <Fingerprint size={48} style={{ opacity: 0.1, marginBottom: '24px' }} />
                 <p style={{ fontSize: '12px', lineHeight: 1.6 }}>Execute simulation sequence to engage signal intelligence decomposition.</p>
              </div>
            )}
        </div>

      </div>
    </div>
  );
};
export default SimulationSuite;
