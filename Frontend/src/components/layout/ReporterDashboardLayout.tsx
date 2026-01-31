import React from 'react'
import UserSidebar from './UserSidebar'

interface Props {
  children: React.ReactNode
}

const ReporterDashboardLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:space-x-6">
          {/* Sidebar - collapses above md */}
          <div className="mb-6 md:mb-0 md:w-72">
            <UserSidebar />
          </div>

          {/* Main content */}
          <main className="flex-1">
            <div className="bg-white rounded shadow-sm p-4 md:p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default ReporterDashboardLayout
