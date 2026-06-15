import { createFileRoute } from '@tanstack/react-router'
import EditorialsList from '../../../pages/reporter/editorials/EditorialsList'

export const Route = createFileRoute('/reporter-dashboard/editorials/')({
  component: EditorialsList,
})
