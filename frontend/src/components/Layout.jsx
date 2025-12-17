import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import './Layout.css'

function Layout({ children }) {
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const navItems = [
    { path: '/', label: 'Home', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    )},
    { path: '/metrics', label: 'Metric', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="20" x2="12" y2="10"></line>
        <line x1="18" y1="20" x2="18" y2="4"></line>
        <line x1="6" y1="20" x2="6" y2="16"></line>
      </svg>
    )},
    { path: '/segments', label: 'Segment', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    )},
    { path: '/experiments', label: 'Experiment', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
      </svg>
    )},
    { path: '/insights', label: 'Insights', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
      </svg>
    )},
  ]

  const isActive = (itemPath) => {
    if (itemPath === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(itemPath)
  }

  return (
    <div className="layout">
      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="logo">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#020760" strokeWidth="2">
            <circle cx="12" cy="12" r="2" fill="#020760"></circle>
            <circle cx="6" cy="6" r="2" fill="#020760"></circle>
            <circle cx="18" cy="6" r="2" fill="#020760"></circle>
            <circle cx="6" cy="18" r="2" fill="#020760"></circle>
            <circle cx="18" cy="18" r="2" fill="#020760"></circle>
            <line x1="12" y1="12" x2="7.5" y2="7.5"></line>
            <line x1="12" y1="12" x2="16.5" y2="7.5"></line>
            <line x1="12" y1="12" x2="7.5" y2="16.5"></line>
            <line x1="12" y1="12" x2="16.5" y2="16.5"></line>
          </svg>
          {!isCollapsed && <h1>DATAHUB</h1>}
        </div>
        <nav className="nav">
          {!isCollapsed && <div className="nav-label">MENU</div>}
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              title={isCollapsed ? item.label : ''}
            >
              <span className="nav-icon">{item.icon}</span>
              {!isCollapsed && <span className="nav-label-text">{item.label}</span>}
            </Link>
          ))}
        </nav>
        <button className="sidebar-toggle" onClick={() => setIsCollapsed(!isCollapsed)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {isCollapsed ? (
              <polyline points="9 18 15 12 9 6"></polyline>
            ) : (
              <polyline points="15 18 9 12 15 6"></polyline>
            )}
          </svg>
        </button>
      </aside>
      <main className={`main-content ${isCollapsed ? 'expanded' : ''}`}>
        {children}
      </main>
    </div>
  )
}

export default Layout

