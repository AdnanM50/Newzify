import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import ReporterSidebar from '../../components/layout/ReporterSidebar'
import ReporterHeader from '../../components/layout/ReporterHeader'
import { getUserRole } from '../../helpers/auth'

export const Route = createFileRoute('/reporter-dashboard')({
  beforeLoad: ({ location }: { location: { href: string } }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
    const role = getUserRole();
    if (role !== 'reporter') {
      throw redirect({
        to: '/login',
      })
    }
  },
  component: ReporterLayout,
})

function ReporterLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <ReporterSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <ReporterHeader setSidebarOpen={setIsSidebarOpen} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
