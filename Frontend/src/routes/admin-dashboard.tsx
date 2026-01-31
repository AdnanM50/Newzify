import React from 'react'
import './admin-dashboard.css'

const stats = [
  { title: 'Total Users', value: 50, color: '#3b82f6' },
  { title: 'Total Trainers', value: 12, color: '#10b981' },
  { title: 'Total Employees', value: 7, color: '#f59e0b' },
  { title: 'Total Groups', value: 5, color: '#8b5cf6' },
  { title: 'Total Orders', value: 24, color: '#fb923c' },
  { title: 'Total Active Subscriptions', value: 46, color: '#22c55e' },
]

export default function AdminDashboard() {
  return (
    <div className="admin-wrap">
      <aside className="sidebar">
        <div className="brand">Gymstick</div>
        <nav className="menu">
          <a className="menu-item active">📊 Dashboard</a>
          <a className="menu-item">👥 Members</a>
          <a className="menu-item">🏋️ Trainers</a>
          <a className="menu-item">👥 Group</a>
          <div className="menu-section">SUBSCRIPTION</div>
          <a className="menu-item">📝 Subscription Plan</a>
          <a className="menu-item">📜 Subscription History</a>
          <div className="menu-section">PRODUCTS</div>
          <a className="menu-item">📁 Category</a>
          <a className="menu-item">🛍️ Products</a>
          <a className="menu-item">🧾 Orders</a>
        </nav>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="top-left">&nbsp;</div>
          <div className="top-right">
            <button className="icon-btn">✉️</button>
            <button className="icon-btn">🔔</button>
            <button className="live">Live Site</button>
            <select className="lang">
              <option>English</option>
            </select>
            <div className="avatar">👤</div>
          </div>
        </header>

        <section className="stats-grid">
          {stats.map((s) => (
            <div key={s.title} className="stat-card">
              <div className="stat-left">
                <div className="stat-title">{s.title}</div>
                <div className="stat-value">{s.value}</div>
              </div>
              <div className="stat-icon" style={{ background: s.color }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="rgba(255,255,255,0.2)" />
                </svg>
              </div>
            </div>
          ))}
        </section>

        <section className="charts">
          <div className="chart-card">
            <h3>Total Earning Analysis - 2026</h3>
            <div className="chart-placeholder">
              <div className="grid-lines" />
            </div>
          </div>

          <div className="chart-card">
            <h3>Sales Analytics</h3>
            <div className="donut-wrap">
              <svg viewBox="0 0 36 36" className="donut">
                <path className="donut-seg" d="M18 2.0845a15.9155 15.9155 0 1 1 0 31.831a15.9155 15.9155 0 1 1 0-31.831" stroke="#1e90ff" strokeWidth="6" strokeDasharray="50 50" strokeLinecap="butt" fill="none" transform="rotate(-90 18 18)" />
                <path className="donut-seg" d="M18 2.0845a15.9155 15.9155 0 1 1 0 31.831a15.9155 15.9155 0 1 1 0-31.831" stroke="#10b981" strokeWidth="6" strokeDasharray="47 53" strokeLinecap="butt" fill="none" transform="rotate(-90 18 18) translate(0 -0.4)" />
                <circle cx="18" cy="18" r="9" fill="#fff" />
              </svg>
              <div className="donut-legend">
                <div><span className="dot blue"/> <strong>50.0 %</strong></div>
                <div><span className="dot green"/> <strong>47.0 %</strong></div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
