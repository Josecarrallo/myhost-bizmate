import { Sidebar } from "@/components/sidebar"
import { PmsCoreAgent } from "@/components/pms-core-agent"

export default function PmsCorePage() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <PmsCoreAgent />
      </main>
    </div>
  )
}
