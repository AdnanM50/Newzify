import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useState } from 'react'
import ReporterSidebar from '../../components/layout/ReporterSidebar'
import ReporterHeader from '../../components/layout/ReporterHeader'

export const Route = createFileRoute('/reporter-dashboard')({
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
