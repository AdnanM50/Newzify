import { createFileRoute } from '@tanstack/react-router'
import BlogCreate from '../../../pages/reporter/blog/BlogCreate'

export const Route = createFileRoute('/reporter-dashboard/blog/create' as const)({
  component: RouteComponent,
})

function RouteComponent() {
  return <BlogCreate />
}
