import { createFileRoute } from '@tanstack/react-router'
import Registration from '../pages/Registration'

export const Route = createFileRoute('/signup')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Registration />
}
