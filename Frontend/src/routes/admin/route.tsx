import { createFileRoute, Outlet, Link, useRouterState } from '@tanstack/react-router'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Settings,
  User
} from 'lucide-react'

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
})

function AdminLayout() {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/news', label: 'News', icon: Package },
    { path: '/admin/category', label: 'category', icon: ShoppingCart },
  ]

  const isActive = (path: string) => {
    if (path === '/admin') {
      return currentPath === '/admin'
    }
    return currentPath.startsWith(path)
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-logo">
            <div className="admin-logo-icon">M</div>
            <span className="admin-logo-text">MarketHub</span>
          </div>
          <span className="admin-badge">Admin</span>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`admin-nav-item ${isActive(item.path) ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <h1 className="admin-header-title">Admin Dashboard</h1>
          <div className="admin-header-actions">
            <button className="admin-icon-btn">
              <Settings size={20} />
            </button>
            <button className="admin-icon-btn">
              <User size={20} />
            </button>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
