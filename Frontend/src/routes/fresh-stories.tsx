import NewsByTypePage from '@/pages/NewsByTypePage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/fresh-stories')({
  component: RouteComponent,
})

function RouteComponent() {
  return <NewsByTypePage type="fresh" title="Fresh Stories" />
}
