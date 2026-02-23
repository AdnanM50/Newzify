import NewsByTypePage from '@/pages/NewsByTypePage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/top-stories')({
  component: RouteComponent,
})

function RouteComponent() {
  return <NewsByTypePage type="top_story" title="Top Stories" />
}
