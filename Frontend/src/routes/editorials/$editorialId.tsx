import { createFileRoute } from '@tanstack/react-router'
import EditorialDetails from '../../pages/EditorialDetails'

export const Route = createFileRoute('/editorials/$editorialId')({
  component: EditorialDetails,
})
