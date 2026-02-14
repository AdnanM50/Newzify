import { createFileRoute } from '@tanstack/react-router'
import Reporters from '../../pages/admin/Reporters'

export const Route = createFileRoute('/admin/reporters')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Reporters />
}
