import { createFileRoute } from '@tanstack/react-router'
import AdminDashboard from './admin-dashboard'

export const Route = createFileRoute('/admin')({
  component: Dashboard,
})

function Dashboard() {
  return <AdminDashboard />
}
