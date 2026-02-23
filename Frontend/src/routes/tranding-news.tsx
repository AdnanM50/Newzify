import NewsByTypePage from '@/pages/NewsByTypePage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tranding-news')({
  component: RouteComponent,
})

function RouteComponent() {
  return <NewsByTypePage type="trending" title="Trending News" />
}
