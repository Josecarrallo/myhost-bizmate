"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Bell, Shield, CreditCard, User } from "lucide-react"

export function SettingsContent() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application preferences</p>
      </div>

      {/* Settings Sections */}
      <div className="grid gap-6">
        {/* Profile Settings */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 p-2.5">
                <User className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold">Profile Settings</h3>
            </div>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" placeholder="+62 123 456 7890" />
              </div>
              <Button className="mt-2 bg-gradient-to-r from-primary to-accent">Save Changes</Button>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 p-2.5">
                <Bell className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold">Notifications</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: "Email Notifications", description: "Receive email updates about bookings and guests" },
                { label: "Push Notifications", description: "Get push notifications for important updates" },
                { label: "SMS Alerts", description: "Receive SMS alerts for urgent matters" },
                { label: "Weekly Reports", description: "Get weekly performance reports via email" },
              ].map((setting) => (
                <div
                  key={setting.label}
                  className="flex items-center justify-between py-3 border-b border-border/40 last:border-0"
                >
                  <div>
                    <p className="font-medium">{setting.label}</p>
                    <p className="text-sm text-muted-foreground">{setting.description}</p>
                  </div>
                  <Switch />
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Security */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 p-2.5">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold">Security</h3>
            </div>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <Button className="mt-2 bg-gradient-to-r from-primary to-accent">Update Password</Button>
            </div>
          </div>
        </Card>

        {/* Billing */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 p-2.5">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold">Billing & Subscription</h3>
            </div>
            <div className="space-y-4">
              <div className="rounded-xl bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 p-4">
                <p className="text-sm font-medium text-muted-foreground mb-1">Current Plan</p>
                <p className="text-2xl font-bold">Professional</p>
                <p className="text-sm text-muted-foreground mt-2">$99/month - Billed annually</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">Change Plan</Button>
                <Button variant="outline">View Invoices</Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
