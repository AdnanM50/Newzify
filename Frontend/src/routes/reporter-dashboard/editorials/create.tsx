import { createFileRoute } from '@tanstack/react-router'
import EditorialCreate from '../../../pages/reporter/editorials/EditorialCreate'

export const Route = createFileRoute('/reporter-dashboard/editorials/create')({
  component: EditorialCreate,
})
