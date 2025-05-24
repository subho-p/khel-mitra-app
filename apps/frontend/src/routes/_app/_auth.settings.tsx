import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/_auth/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/_auth/settings"!</div>
}
