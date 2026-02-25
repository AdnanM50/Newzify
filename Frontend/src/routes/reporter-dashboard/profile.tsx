import { createFileRoute } from '@tanstack/react-router'
import Profile from '../../pages/admin/profile'

export const Route = createFileRoute('/reporter-dashboard/profile')({
  component: Profile,
})
