import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/Editorials' as const)({
  component: RouteComponent,
})

function RouteComponent() {
  return null
}
