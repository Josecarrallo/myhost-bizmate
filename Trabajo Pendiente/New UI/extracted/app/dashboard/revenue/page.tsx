import { Sidebar } from "@/components/sidebar"
import { RevenueContent } from "@/components/revenue-content"

export default function RevenuePage() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <RevenueContent />
      </main>
    </div>
  )
}
