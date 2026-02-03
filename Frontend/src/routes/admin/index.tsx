import { createFileRoute } from '@tanstack/react-router'
import { DollarSign, Users, Store, ShoppingCart, TrendingUp } from 'lucide-react'

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
})

function AdminDashboard() {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$84,230',
      change: '+24% from last month',
      changeType: 'positive',
      icon: DollarSign,
      iconBg: '#FFE4E1',
      iconColor: '#FF6B6B',
    },
    {
      title: 'Active Users',
      value: '2,450',
      change: '+18% growth',
      changeType: 'positive',
      icon: Users,
      iconBg: '#E8F4FD',
      iconColor: '#7C3AED',
    },
    {
      title: 'Active Vendors',
      value: '156',
      change: '+12 new vendors',
      changeType: 'positive',
      icon: Store,
      iconBg: '#F3E8FF',
      iconColor: '#10B981',
    },
    {
      title: 'Total Orders',
      value: '1,893',
      change: '+32% this week',
      changeType: 'positive',
      icon: ShoppingCart,
      iconBg: '#FEF3C7',
      iconColor: '#8B5CF6',
    },
  ]

  const topVendors = [
    { rank: 1, name: 'TechStore Pro', orders: 156, revenue: '$24,500' },
    { rank: 2, name: 'FashionHub', orders: 132, revenue: '$18,200' },
    { rank: 3, name: 'HomeDecor Plus', orders: 98, revenue: '$15,800' },
    { rank: 4, name: 'SportGear', orders: 87, revenue: '$12,400' },
  ]

  const chartData = [
    { month: 'Jan', value: 2000 },
    { month: 'Feb', value: 3500 },
    { month: 'Mar', value: 4200 },
    { month: 'Apr', value: 4800 },
    { month: 'May', value: 6200 },
    { month: 'Jun', value: 7000 },
    { month: 'Jul', value: 7500 },
  ]

  const maxValue = Math.max(...chartData.map(d => d.value))

  return (
    <div className="admin-dashboard">
      {/* Stats Cards */}
      <div className="admin-stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="admin-stat-card">
              <div className="admin-stat-header">
                <span className="admin-stat-title">{stat.title}</span>
                <div 
                  className="admin-stat-icon"
                  style={{ backgroundColor: stat.iconBg }}
                >
                  <Icon size={20} style={{ color: stat.iconColor }} />
                </div>
              </div>
              <div className="admin-stat-value">{stat.value}</div>
              <div className={`admin-stat-change ${stat.changeType}`}>
                {stat.change}
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts and Vendors Section */}
      <div className="admin-charts-section">
        {/* Sales Overview Chart */}
        <div className="admin-chart-card">
          <div className="admin-card-header">
            <h3><TrendingUp size={20} /> Sales Overview</h3>
          </div>
          <div className="admin-chart-container">
            <div className="admin-chart-y-axis">
              <span>8000</span>
              <span>6000</span>
              <span>4000</span>
              <span>2000</span>
              <span>0</span>
            </div>
            <div className="admin-chart-area">
              <svg viewBox="0 0 700 200" className="admin-chart-svg">
                <defs>
                  <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                {/* Area */}
                <path
                  d={`M 0 200 ${chartData.map((d, i) => {
                    const x = (i / (chartData.length - 1)) * 700
                    const y = 200 - (d.value / maxValue) * 180
                    return `L ${x} ${y}`
                  }).join(' ')} L 700 200 Z`}
                  fill="url(#chartGradient)"
                />
                {/* Line */}
                <path
                  d={`M ${chartData.map((d, i) => {
                    const x = (i / (chartData.length - 1)) * 700
                    const y = 200 - (d.value / maxValue) * 180
                    return `${i === 0 ? '' : 'L '}${x} ${y}`
                  }).join(' ')}`}
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="3"
                />
                {/* Points */}
                {chartData.map((d, i) => {
                  const x = (i / (chartData.length - 1)) * 700
                  const y = 200 - (d.value / maxValue) * 180
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="5"
                      fill="#F59E0B"
                    />
                  )
                })}
              </svg>
              <div className="admin-chart-x-axis">
                {chartData.map(d => (
                  <span key={d.month}>{d.month}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top Vendors */}
        <div className="admin-vendors-card">
          <div className="admin-card-header">
            <h3><Users size={20} /> Top Vendors</h3>
            <a href="#" className="admin-link">View All</a>
          </div>
          <div className="admin-vendors-list">
            {topVendors.map((vendor) => (
              <div key={vendor.rank} className="admin-vendor-item">
                <div className="admin-vendor-rank">#{vendor.rank}</div>
                <div className="admin-vendor-avatar"></div>
                <div className="admin-vendor-info">
                  <span className="admin-vendor-name">{vendor.name}</span>
                  <span className="admin-vendor-orders">{vendor.orders} orders</span>
                </div>
                <div className="admin-vendor-revenue">{vendor.revenue}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
