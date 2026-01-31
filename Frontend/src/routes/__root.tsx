import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import Footer from '../components/layout/Footer'
import Header from '../components/layout/Header'

export const Route = createRootRoute({
  component: () => {
    const path = typeof window !== 'undefined' ? window.location.pathname : ''
    const hideLayout = path.startsWith('/admin')
    return (
      <>
        {!hideLayout && <Header />}
        <Outlet />
        {!hideLayout && <Footer />}
        <TanStackRouterDevtools />
      </>
    )
  },
})