import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/Podcasts' as const)({
  component: RouteComponent,
})

function RouteComponent() {
  return null
}
