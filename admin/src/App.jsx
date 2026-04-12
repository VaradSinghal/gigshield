import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { Shield, Home, AlertCircle, Map, Zap, Search, Bell, Settings, Users, Cpu } from 'lucide-react';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Claims from './pages/Claims';
import RiskMap from './pages/RiskMap';
import Fraud from './pages/Fraud';
import SimulationSuite from './pages/SimulationSuite';
import Workers from './pages/Workers';

const SentinelLayout = ({ children }) => {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  if (isLanding) return <>{children}</>;

  return (
    <div className="sentinel-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-icon">
              <Shield size={22} color="white" />
            </div>
            <span>SENTINEL</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Home size={20} /> Dashboard
          </NavLink>
          <NavLink to="/claims" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
             <Zap size={20} /> Claims Registry
          </NavLink>
          <NavLink to="/risk" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Map size={20} /> Risk Map
          </NavLink>
          <NavLink to="/fraud" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <AlertCircle size={20} /> Fraud Core
          </NavLink>
          <NavLink to="/simulation" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Cpu size={20} /> Simulation
          </NavLink>

          <div style={{ margin: '32px 0 16px', fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px', fontWeight: 700, padding: '0 16px' }}>Operations</div>

          <NavLink to="/workers" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Users size={20} /> Workers
          </NavLink>
          <a href="#" className="nav-item">
            <Settings size={20} /> Settings
          </a>
        </nav>
        
        <div style={{ padding: '24px', borderTop: '1px solid var(--border-glass)', fontSize: '12px', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="pulse-indicator" />
            SYSTEM STABLE
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-wrapper">
        <header className="content-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
             <h2 className="page-title" style={{ margin: 0, fontSize: '20px' }}>Command Center</h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <button className="icon-btn" style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <Bell size={20} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '24px', borderLeft: '1px solid var(--border-glass)' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>Sentinel Admin</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>OPERATIONS LEVEL 5</div>
              </div>
              <div className="brand-icon" style={{ width: '36px', height: '36px', borderRadius: '50%' }}>
                SA
              </div>
            </div>
          </div>
        </header>

        <div style={{ padding: '40px' }}>
          {children}
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <SentinelLayout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/claims" element={<Claims />} />
          <Route path="/risk" element={<RiskMap />} />
          <Route path="/fraud" element={<Fraud />} />
          <Route path="/simulation" element={<SimulationSuite />} />
          <Route path="/workers" element={<Workers />} />
        </Routes>
      </SentinelLayout>
    </BrowserRouter>
  );
}

export default App;
