"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageSquare, Send, Sparkles } from "lucide-react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"

export function GuestManagementAgent() {
  const [input, setInput] = useState("")
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/guest-agent" }),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || status !== "ready") return
    sendMessage({ text: input })
    setInput("")
  }

  return (
    <div className="flex h-full flex-col p-8">
      {/* Header */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 p-3 shadow-lg">
            <MessageSquare className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Guest Management Agent</h1>
            <p className="text-muted-foreground">External AI assistant for guest communications</p>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <Card className="flex flex-1 flex-col border-border/50 bg-card/50 backdrop-blur overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center space-y-4 max-w-md">
                <div className="mx-auto rounded-full bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 p-4 w-16 h-16 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Welcome to Guest Management Agent</h3>
                <p className="text-sm text-muted-foreground">
                  I can help you manage guest communications, handle inquiries, send personalized messages, and provide
                  excellent customer service.
                </p>
                <div className="grid gap-2 pt-4">
                  {[
                    "Draft a welcome message for new guests",
                    "Handle a booking inquiry",
                    "Create a check-out reminder",
                  ].map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      className="justify-start text-left h-auto py-3 bg-transparent"
                      onClick={() => {
                        setInput(suggestion)
                        const form = document.querySelector("form")
                        form?.requestSubmit()
                      }}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500">
                    <MessageSquare className="h-4 w-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 text-white"
                      : "bg-muted"
                  }`}
                >
                  {message.parts.map((part, index) => {
                    if (part.type === "text") {
                      return (
                        <p key={index} className="text-sm whitespace-pre-wrap">
                          {part.text}
                        </p>
                      )
                    }
                    return null
                  })}
                </div>
                {message.role === "user" && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">
                    YOU
                  </div>
                )}
              </div>
            ))
          )}
          {status === "streaming" && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 animate-pulse">
                <MessageSquare className="h-4 w-4 text-white" />
              </div>
              <div className="rounded-2xl bg-muted px-4 py-3">
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

        {/* Input */}
        <div className="border-t border-border/40 p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me about guest communications..."
              disabled={status !== "ready"}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={!input.trim() || status !== "ready"}
              className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 hover:opacity-90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
