import { createFileRoute } from '@tanstack/react-router'
import BlogDetail from '../../pages/blog/BlogDetail'

export const Route = createFileRoute('/blog/$blogId' as const)({
  component: RouteComponent,
})

function RouteComponent() {
  const { blogId } = Route.useParams()
  return <BlogDetail blogId={blogId} />
}
