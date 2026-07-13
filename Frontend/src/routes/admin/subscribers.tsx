import { createFileRoute } from '@tanstack/react-router'
import Subscribers from '../../pages/admin/Subscribers'

export const Route = createFileRoute('/admin/subscribers')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Subscribers />
}
