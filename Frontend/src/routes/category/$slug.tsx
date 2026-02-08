import { createFileRoute } from '@tanstack/react-router'
import CategoryPage from '../../pages/CategoryPage'

export const Route = createFileRoute('/category/$slug')({
  component: RouteComponent,
})

function RouteComponent() {
  const { slug } = Route.useParams()
  return <CategoryPage slug={slug} />
}
