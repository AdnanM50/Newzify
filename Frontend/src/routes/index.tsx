import { createFileRoute } from '@tanstack/react-router'
import Home from '../pages/App'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
   <Home />
  )
}