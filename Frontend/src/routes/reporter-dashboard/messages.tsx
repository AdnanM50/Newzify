import { createFileRoute } from '@tanstack/react-router'
import MessagingPage from '../../components/messaging/MessagingPage'
import { SocketProvider } from '../../context/SocketContext'

export const Route = createFileRoute('/reporter-dashboard/messages')({
    component: ReporterMessages,
})

function ReporterMessages() {
    return (
        <SocketProvider>
            <MessagingPage panelType="reporter" />
        </SocketProvider>
    )
}
