import { createRootRoute, Outlet, useLocation } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import Footer from '../components/layout/Footer'
import Header from '../components/layout/Header'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const location = useLocation()
  const hideLayout = location.pathname.startsWith('/admin')

  return (
    <>
      {!hideLayout && <Header />}
      <Outlet />
      {!hideLayout && <Footer />}
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}