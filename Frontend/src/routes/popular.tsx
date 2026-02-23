import NewsByTypePage from '@/pages/NewsByTypePage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/popular')({
  component: RouteComponent,
})

function RouteComponent() {
  return <NewsByTypePage type="popular" title="Popular News" />
}
