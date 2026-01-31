import { createFileRoute } from '@tanstack/react-router'
import UserDashboard from '../pages/UserDashboard'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  return <UserDashboard />
}
