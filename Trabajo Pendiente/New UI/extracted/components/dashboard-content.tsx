"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Sparkles, TrendingUp, Home, DollarSign, Calendar, Phone } from "lucide-react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"

export function DashboardContent() {
  const [input, setInput] = useState("")
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/overview-agent" }),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || status !== "ready") return
    sendMessage({ text: input })
    setInput("")
  }

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="p-8 pb-6 border-b border-border">
        <h1 className="text-4xl font-bold text-foreground mb-2 text-balance">Good morning, Jose Carrallo</h1>
        <p className="text-sm text-muted-foreground">Owner Executive Summary - Tuesday, December 23, 2025</p>
      </div>

      <div className="p-8 space-y-6">
        <Card className="relative overflow-hidden border-primary/20 bg-card">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="relative p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-primary/15 p-3.5 ring-1 ring-primary/30 shadow-lg shadow-primary/20">
                  <Sparkles className="h-7 w-7 text-primary" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-foreground">MyHost AI - Today's Snapshot</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    You have <span className="text-foreground font-semibold">33 active bookings</span> with an occupancy
                    rate of <span className="text-foreground font-semibold">78.57%</span>. 1 guest is checking in today.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Total revenue: <span className="text-foreground font-semibold">$48,375</span>. Average nightly rate:{" "}
                    <span className="text-foreground font-semibold">$256</span>.
                  </p>
                </div>
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 shadow-lg shadow-primary/20">
                Ask MyHost AI
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-4 gap-6">
          <Card className="relative overflow-hidden border-primary/20 bg-card">
            <div className="absolute inset-0 bg-primary/10 blur-2xl" />
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-primary">Total Revenue</span>
                <div className="rounded-lg bg-primary/15 p-2 ring-1 ring-primary/30">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-foreground">$48,375</div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-primary">+12%</span>
                  <span className="text-xs text-muted-foreground">All time</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="relative overflow-hidden border-secondary/20 bg-card">
            <div className="absolute inset-0 bg-secondary/10 blur-2xl" />
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-secondary">Occupancy Rate</span>
                <div className="rounded-lg bg-secondary/15 p-2 ring-1 ring-secondary/30">
                  <TrendingUp className="h-5 w-5 text-secondary" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-foreground">78.57%</div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-secondary">+5%</span>
                  <span className="text-xs text-muted-foreground">Active bookings</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="relative overflow-hidden border-chart-3/20 bg-card">
            <div className="absolute inset-0 bg-chart-3/10 blur-2xl" />
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-chart-3">Active Bookings</span>
                <div className="rounded-lg bg-chart-3/15 p-2 ring-1 ring-chart-3/30">
                  <Calendar className="h-5 w-5 text-chart-3" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-foreground">33</div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-chart-3">+3</span>
                  <span className="text-xs text-muted-foreground">Confirmed</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="relative overflow-hidden border-border bg-card">
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-muted-foreground">Properties</span>
                <div className="rounded-lg bg-accent p-2 ring-1 ring-border">
                  <Home className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-foreground">48</div>
                <div className="text-xs text-muted-foreground">Active listings</div>
              </div>
            </div>
          </Card>
        </div>

        <Card className="border-warning/20 bg-card">
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-warning/15 p-2 ring-1 ring-warning/30 shadow-lg shadow-warning/10">
                <Calendar className="h-5 w-5 text-warning" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Check-ins Today (1)</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-bold text-foreground mb-1">Carlos Ruiz</h4>
                <p className="text-sm text-muted-foreground">Villa Sunset</p>
                <p className="text-xs text-muted-foreground mt-1">1 guest • 3 nights</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="border-warning/30 text-warning hover:bg-warning/10 bg-transparent"
              >
                View Details
              </Button>
            </div>
          </div>
        </Card>

        <Card className="border-border bg-card mb-8">
          <div className="border-b border-border p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/15 p-2.5 ring-1 ring-primary/30 shadow-lg shadow-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Chat with MyHost AI</h3>
                <p className="text-xs text-muted-foreground">Ask questions about your business operations</p>
              </div>
            </div>
          </div>

          <div className="p-6 min-h-[300px] max-h-[400px] overflow-y-auto space-y-4">
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="mx-auto rounded-full bg-primary/15 p-4 w-16 h-16 flex items-center justify-center ring-1 ring-primary/30 shadow-lg shadow-primary/20">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">How can I help you today?</h3>
                  <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                    Ask me about property performance, bookings, revenue, or any business insights.
                  </p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/30 shadow-lg shadow-primary/10">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-primary/10 text-foreground ring-1 ring-primary/20"
                        : "bg-accent text-foreground"
                    }`}
                  >
                    {message.parts.map((part, index) => {
                      if (part.type === "text") {
                        return (
                          <p key={index} className="text-sm whitespace-pre-wrap leading-relaxed">
                            {part.text}
                          </p>
                        )
                      }
                      return null
                    })}
                  </div>
                  {message.role === "user" && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-foreground text-xs font-bold ring-1 ring-border">
                      JC
                    </div>
                  )}
                </div>
              ))
            )}
            {status === "streaming" && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 animate-pulse ring-1 ring-primary/30">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div className="rounded-2xl bg-accent px-4 py-3">
                  <div className="flex gap-1">
                    <div
                      className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-border p-6">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your business metrics..."
                disabled={status !== "ready"}
                className="flex-1 bg-accent border-border text-foreground placeholder:text-muted-foreground"
              />
              <Button
                type="submit"
                disabled={!input.trim() || status !== "ready"}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      </div>

      <div className="fixed bottom-8 right-8">
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl shadow-primary/30 rounded-full px-6 py-6 text-base font-bold flex items-center gap-3 ring-1 ring-primary/40">
          <Phone className="h-5 w-5" />
          Talk to Ayu
        </Button>
        <div className="mt-2 text-center">
          <p className="text-xs text-muted-foreground">24/7 Voice Assistant</p>
          <p className="text-xs text-muted-foreground/70">Ayu - Izumi Hotel Receptionist</p>
        </div>
      </div>
    </div>
  )
}
