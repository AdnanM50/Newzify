import { createFileRoute } from '@tanstack/react-router'
import MessagingPage from '../../components/messaging/MessagingPage'
import { SocketProvider } from '../../context/SocketContext'

export const Route = createFileRoute('/admin/messages')({
    component: AdminMessages,
})

function AdminMessages() {
    return (
        <SocketProvider>
            <MessagingPage panelType="admin" />
        </SocketProvider>
    )
}
