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
          <h1 className="page-title" style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '-0.5px' }}>Digital Twin Simulator</h1>
          <p className="page-subtitle">Adversarial testing environment for AI Fraud & Parametric Payout engines</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button onClick={resetAll} disabled={isRunning} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <RotateCcw size={18} /> Reset
          </button>
          <button onClick={runSimulation} disabled={isRunning} className="payout-btn" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Play size={18} fill="currentColor" /> Initiate Sequence
          </button>
        </div>
      </div>

      <div className="grid-cols-3" style={{ gridTemplateColumns: '1fr 2fr 1fr', gap: '40px', alignItems: 'start' }}>
        
        {/* Left: Scenarios */}
        <div className="glass-card" style={{ padding: '24px' }}>
           <h3 className="brand-font" style={{ marginBottom: '24px', fontSize: '16px', color: 'var(--text-dark)' }}>Test Vector Selection</h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {scenarios.map((s) => (
                <div 
                  key={s.id}
                  onClick={() => !isRunning && setSelectedScenario(s)}
                  style={{
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: selectedScenario?.id === s.id ? 'var(--primary)' : 'var(--border-light)',
                    background: selectedScenario?.id === s.id ? 'var(--bg-light)' : 'var(--surface-secondary)',
                    cursor: isRunning ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: selectedScenario?.id === s.id ? '0 0 0 1px var(--primary)' : 'none'
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
                      <span style={{ fontSize: '13px', color: 'var(--text-muted-light)' }}>Zone:</span>
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>{selectedScenario.profile.zone}</span>
                   </div>
                   <div className="flex-between">
                      <span style={{ fontSize: '13px', color: 'var(--text-muted-light)' }}>Trust Score:</span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--success)' }}>{(selectedScenario.profile.trust_score * 100).toFixed(0)}%</span>
                   </div>
                </div>
             </div>
           )}
        </div>

        {/* Center: Live Stage */}
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden', minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
           <div style={{ padding: '24px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-secondary)' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                 {[1,2,3,4].map(i => (
                   <div key={i} style={{ width: '40px', height: '4px', borderRadius: '4px', background: step >= i ? 'var(--primary)' : 'var(--border-light)' }} />
                 ))}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-sans)', color: isRunning ? 'var(--primary)' : 'var(--text-muted-light)' }}>
                 {isRunning ? 'Sequence Active' : 'System Idle'}
              </div>
           </div>
           
           <div style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* STAGE 1 */}
              <div style={{ 
                display: 'flex', gap: '24px', alignItems: 'center', padding: '24px', borderRadius: '8px', 
                border: '1px solid', borderColor: step === 1 ? 'var(--primary)' : 'var(--border-light)',
                background: step === 1 ? 'var(--surface-secondary)' : 'var(--bg-light)',
                opacity: step >= 1 ? 1 : 0.4
              }}>
                 <div className="brand-icon" style={{ width: '48px', height: '48px', background: step >= 1 ? 'var(--primary)' : 'var(--surface-secondary)' }}>
                    <Zap size={20} color={step >= 1 ? 'white' : 'var(--text-muted-light)'} />
                 </div>
                 <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted-light)', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>Stage 01</div>
                    <div style={{ fontWeight: 600, fontSize: '15px' }}>Neural Premium Calculation</div>
                    {step === 1 && <div style={{ fontSize: '13px', color: 'var(--primary)', marginTop: '4px' }}>Synthesizing hyper-local risk factors...</div>}
                    {step > 1 && results && <div style={{ fontSize: '14px', color: 'var(--success)', marginTop: '4px', fontWeight: 600 }}>Policy active: ₹{results.premium.weekly_premium}</div>}
                 </div>
              </div>

              {/* STAGE 2 */}
              <div style={{ 
                display: 'flex', gap: '24px', alignItems: 'center', padding: '24px', borderRadius: '8px', 
                border: '1px solid', borderColor: step === 2 ? 'var(--primary)' : 'var(--border-light)',
                background: step === 2 ? 'var(--surface-secondary)' : 'var(--bg-light)',
                opacity: step >= 2 ? 1 : 0.4
              }}>
                 <div className="brand-icon" style={{ width: '48px', height: '48px', background: step >= 2 ? 'var(--primary)' : 'var(--surface-secondary)' }}>
                    <CloudRain size={20} color={step >= 2 ? 'white' : 'var(--text-muted-light)'} />
                 </div>
                 <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted-light)', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>Stage 02</div>
                    <div style={{ fontWeight: 600, fontSize: '15px' }}>Parametric Disruption Detection</div>
                    {step === 2 && <div style={{ fontSize: '13px', color: 'var(--primary)', marginTop: '4px' }}>Awaiting IoT trigger signature...</div>}
                    {step > 2 && results && <div style={{ fontSize: '14px', color: 'var(--success)', marginTop: '4px', fontWeight: 600 }}>Trigger confirmed: {results.trigger.label}</div>}
                 </div>
              </div>

              {/* STAGE 3 */}
              <div style={{ 
                display: 'flex', gap: '24px', alignItems: 'center', padding: '24px', borderRadius: '8px', 
                border: '1px solid', borderColor: step === 3 ? 'var(--primary)' : 'var(--border-light)',
                background: step === 3 ? 'var(--surface-secondary)' : 'var(--bg-light)',
                opacity: step >= 3 ? 1 : 0.4
              }}>
                 <div className="brand-icon" style={{ width: '48px', height: '48px', background: step >= 3 ? 'var(--primary)' : 'var(--surface-secondary)' }}>
                    <Smartphone size={20} color={step >= 3 ? 'white' : 'var(--text-muted-light)'} />
                 </div>
                 <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted-light)', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>Stage 03</div>
                    <div style={{ fontWeight: 600, fontSize: '15px' }}>Mobile Handshake & Submission</div>
                    {step === 3 && <span style={{ fontSize: '13px', color: 'var(--primary)' }}>Intercepting worker app payload...</span>}
                    {step > 3 && <div style={{ fontSize: '14px', color: 'var(--success)', marginTop: '4px', fontWeight: 600 }}>Claim Transmitted</div>}
                 </div>
              </div>

              {/* STAGE 4 */}
              <div style={{ 
                display: 'flex', gap: '24px', alignItems: 'center', padding: '24px', borderRadius: '8px', 
                border: '1px solid', borderColor: step === 4 ? 'var(--primary)' : 'var(--border-light)',
                background: step === 4 ? 'var(--surface-secondary)' : 'var(--bg-light)',
                opacity: step >= 4 ? 1 : 0.4
              }}>
                 <div className="brand-icon" style={{ width: '48px', height: '48px', background: step >= 4 ? (results?.claim.action === 'rejected' ? 'var(--danger)' : 'var(--success)') : 'var(--surface-secondary)' }}>
                    <ShieldCheck size={20} color={step >= 4 ? 'white' : 'var(--text-muted-light)'} />
                 </div>
                 <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted-light)', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>Stage 04</div>
                    <div style={{ fontWeight: 600, fontSize: '15px' }}>Adversarial AI Verdict</div>
                    {step === 4 && results && (
                      <div style={{ marginTop: '8px' }}>
                         <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-dark)' }}>
                            {results.claim.action_label}
                         </div>
                         <div style={{ fontSize: '12px', color: 'var(--text-muted-light)' }}>Confidence Score: {results.claim.confidence_score}%</div>
                      </div>
                    )}
                 </div>
              </div>

           </div>
        </div>

        {/* Right: Signal Intel */}
        <div className="glass-card dark" style={{ padding: '24px' }}>
            <h3 className="brand-font" style={{ marginBottom: '24px', fontSize: '16px' }}>Intelligence Decomposition</h3>
            {results ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                 {Object.entries(results.claim.validation_signals).map(([key, signal]) => (
                   <div key={key} style={{ padding: '16px', borderRadius: '8px', background: 'var(--bg-card-dark)', border: '1px solid var(--border-dark)' }}>
                      <div className="flex-between" style={{ marginBottom: '8px' }}>
                         <span style={{ fontSize: '13px', fontWeight: 600, textTransform: 'capitalize' }}>{key}</span>
                         <span style={{ fontSize: '12px', color: signal.passed ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>{signal.passed ? '✓ Clear' : '✗ Anomaly'}</span>
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text-muted-dark)', lineHeight: 1.4 }}>{signal.detail}</div>
                   </div>
                 ))}
                 
                 <div style={{ marginTop: '24px', padding: '16px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px dashed var(--border-dark)' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted-dark)', marginBottom: '8px', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>System Reasoning</div>
                    <p style={{ fontSize: '14px', lineHeight: 1.5, color: '#eef0f3' }}>
                       "{results.claim.rejection_reason || results.claim.review_reason || 'Patterns match expected worker behavior profiles. Payout authorized.'}"
                    </p>
                 </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '100px 20px', color: 'var(--text-muted-dark)' }}>
                 <Fingerprint size={48} style={{ opacity: 0.2, marginBottom: '24px' }} />
                 <p style={{ fontSize: '13px', lineHeight: 1.6 }}>Execute simulation sequence to engage signal intelligence decomposition.</p>
              </div>
            )}
        </div>

      </div>
    </div>
  );
};
export default SimulationSuite;
