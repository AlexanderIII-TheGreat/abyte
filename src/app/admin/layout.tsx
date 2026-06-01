import { AdminShell } from '@/components/admin/AdminShell'

export const metadata = {
  title: 'abyte panel',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminShell>{children}</AdminShell>
}
