import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { useEffect, useState, createContext, useContext } from 'react';
import UserSidebar from '../components/layout/UserSidebar';

interface DashboardContextType {
  userProfile: any;
  fetchUserProfile: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardLayout');
  }
  return context;
};

export const Route = createFileRoute('/dashboard')({
  beforeLoad: ({ location }) => {
    if (!localStorage.getItem('token')) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: DashboardLayout,
})

function DashboardLayout() {
  const [userProfile, setUserProfile] = useState<any>(null);

  const fetchUserProfile = async () => {
    try {
      const response: any = await fetch('https://newzify-backend-kappa.vercel.app/api/v1/user/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        setUserProfile(result.data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <DashboardContext.Provider value={{ userProfile, fetchUserProfile }}>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <aside className="lg:w-64 w-full flex-shrink-0">
              <UserSidebar user={userProfile} />
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </DashboardContext.Provider>
  )
}
