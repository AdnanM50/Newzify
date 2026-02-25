import { createFileRoute } from '@tanstack/react-router'
import Dashboard from '../../pages/reporter/Dashboard'

export const Route = createFileRoute('/reporter-dashboard/')({
  component: Dashboard,
})
