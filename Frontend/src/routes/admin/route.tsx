import { createFileRoute, Outlet } from '@tanstack/react-router'
import React, { useState } from 'react'
import AdminSidebar from '../../components/layout/AdminSidebar'
import AdminHeader from '../../components/layout/AdminHeader'
// import { useUser } from '../../context/user'

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
})

function AdminLayout() {
  // const { user, isLoading } = useUser()
  // const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // useEffect(() => {
  //   if ((!user || user.role !== 'admin')) {
  //     navigate({ to: '/login' })
  //   }
  // }, [user, isLoading, navigate])

  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-50">
  //       <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
  //     </div>
  //   )
  // }

  // if (!user || user.role !== 'admin') {
  //   return null
  // }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <AdminHeader setSidebarOpen={setIsSidebarOpen} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
