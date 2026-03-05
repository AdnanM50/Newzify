import { createFileRoute } from '@tanstack/react-router'
import PageSettings from '../../pages/admin/PageSettings'

export const Route = createFileRoute('/admin/page-settings')({
  component: PageSettings,
})
