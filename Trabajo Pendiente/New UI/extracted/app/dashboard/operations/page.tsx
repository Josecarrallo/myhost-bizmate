import { Sidebar } from "@/components/sidebar"
import { OperationsContent } from "@/components/operations-content"

export default function OperationsPage() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <OperationsContent />
      </main>
    </div>
  )
}
