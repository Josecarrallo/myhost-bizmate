import { Sidebar } from "@/components/sidebar"
import { GuestManagementAgent } from "@/components/guest-management-agent"

export default function GuestManagementPage() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <GuestManagementAgent />
      </main>
    </div>
  )
}
