"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Bot,
  MessageSquare,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Building,
  Calendar,
  UsersRound,
  Database,
  Globe,
  CheckSquare,
  Star,
  Mail,
  BarChart3,
  DollarSign,
  Zap,
  FileText,
  Share2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const menuItems = [
  { href: "/dashboard", label: "OVERVIEW", icon: LayoutDashboard },
  {
    label: "OPERATIONS & GUESTS",
    icon: Users,
    submenu: [
      { href: "/dashboard/operations", label: "Dashboard", icon: LayoutDashboard },
      { href: "/dashboard/properties", label: "Properties", icon: Building },
      { href: "/dashboard/bookings", label: "Bookings", icon: Calendar },
      { href: "/dashboard/calendar", label: "Calendar", icon: Calendar },
      { href: "/dashboard/guests", label: "Guests", icon: UsersRound },
    ],
  },
  {
    label: "REVENUE & PRICING",
    icon: TrendingUp,
    submenu: [
      { href: "/dashboard/payments", label: "Payments", icon: DollarSign },
      { href: "/dashboard/smart-pricing", label: "Smart Pricing", icon: Zap },
      { href: "/dashboard/reports", label: "Reports", icon: FileText },
      { href: "/dashboard/channel-integration", label: "Channel Integration", icon: Share2 },
    ],
  },
  { href: "/dashboard/pms-core", label: "PMS CORE (INTERNAL AGENT)", icon: Bot },
  {
    label: "GUEST MANAGEMENT (EXTERNAL AGENT)",
    icon: MessageSquare,
    submenu: [
      { href: "/dashboard/guest-database", label: "Guest Database / CRM", icon: Database },
      { href: "/dashboard/booking-engine", label: "Booking Engine Config", icon: Globe },
      { href: "/dashboard/digital-checkin", label: "Digital Check-in Setup", icon: CheckSquare },
      { href: "/dashboard/reviews", label: "Reviews Management", icon: Star },
      { href: "/dashboard/marketing", label: "Marketing Campaigns", icon: Mail },
      { href: "/dashboard/guest-analytics", label: "Guest Analytics", icon: BarChart3 },
    ],
  },
  { href: "/dashboard/settings", label: "SETTINGS", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [openMenus, setOpenMenus] = useState<string[]>([
    "OPERATIONS & GUESTS",
    "REVENUE & PRICING",
    "GUEST MANAGEMENT (EXTERNAL AGENT)",
  ])

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => (prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]))
  }

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex-shrink-0">
      <div className="flex h-full flex-col">
        <div className="p-6 border-b border-sidebar-border relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/10 blur-3xl" />
          <div className="relative">
            <h1 className="font-bold text-2xl tracking-tight text-sidebar-foreground">MY HOST</h1>
            <p className="text-sm text-muted-foreground font-medium">BizMate</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const hasSubmenu = "submenu" in item && item.submenu
            const isOpen = openMenus.includes(item.label)
            const isActive = !hasSubmenu && pathname === item.href

            if (hasSubmenu) {
              return (
                <div key={item.label}>
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={cn(
                      "group w-full flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold transition-all",
                      isOpen
                        ? "bg-sidebar-accent text-sidebar-foreground"
                        : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </div>
                    {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </button>
                  {isOpen && (
                    <div className="ml-6 mt-1 space-y-0.5">
                      {item.submenu.map((subItem) => {
                        const SubIcon = subItem.icon
                        const isSubActive = pathname === subItem.href
                        return (
                          <Link key={subItem.href} href={subItem.href}>
                            <div
                              className={cn(
                                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-all",
                                isSubActive
                                  ? "bg-primary/15 text-primary border-l-2 border-primary"
                                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                              )}
                            >
                              <SubIcon className="h-3.5 w-3.5" />
                              <span>{subItem.label}</span>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            }

            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "group flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-semibold transition-all",
                    isActive
                      ? "bg-primary/15 text-primary border-l-2 border-primary"
                      : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </div>
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-xs font-semibold">Logout</span>
          </Button>
        </div>
      </div>
    </aside>
  )
}
