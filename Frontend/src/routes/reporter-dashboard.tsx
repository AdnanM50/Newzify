import { createFileRoute } from '@tanstack/react-router'
import ReporterDashboard from '../pages/ReporterDashboard'

export const Route = createFileRoute('/reporter-dashboard')({
  component: Dashboard,
})

function Dashboard() {
  return <ReporterDashboard />
}
