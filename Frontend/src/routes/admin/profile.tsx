import { createFileRoute } from '@tanstack/react-router'
import AdminProfile from '../../pages/admin/profile'

export const Route = createFileRoute('/admin/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AdminProfile />
}
