import { createRootRoute,  Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import Footer from '../components/layout/Footer'
import Header from '../components/layout/Header'

export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      {/* This is where the child routes will be rendered */}
      <Outlet />
      <Footer />
      <TanStackRouterDevtools  />
    </>
  ),
})