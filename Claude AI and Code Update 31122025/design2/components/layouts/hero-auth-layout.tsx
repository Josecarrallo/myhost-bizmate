"use client"

import type React from "react"
import { theme } from "@/lib/theme"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface HeroAuthLayoutProps {
  title: string
  subtitle: string
  primaryAction?: {
    label: string
    onClick?: () => void
  }
  backgroundImage: string
  children?: React.ReactNode
}

export function HeroAuthLayout({ title, subtitle, primaryAction, backgroundImage, children }: HeroAuthLayoutProps) {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center overflow-hidden font-sans">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Overlay */}
      <div className={cn("absolute inset-0 z-10", theme.heroAuth.overlay)} />

      {/* Content Container */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 pt-16 pb-12 flex-grow flex flex-col items-center justify-center">
        <div className="mb-20 text-center">
          <span className="text-6xl md:text-8xl font-extrabold tracking-tighter text-[#FF8C42] drop-shadow-2xl">
            MY HOST BizMate
          </span>
        </div>

        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left Side: Marketing Copy */}
          <div className="w-full md:w-1/2 text-white text-left space-y-6">
            <h1 className={theme.heroAuth.headlineSize}>{title}</h1>

            <div className="space-y-4">
              <p className={cn(theme.heroAuth.subheadlineSize, "max-w-xl leading-relaxed text-white")}>{subtitle}</p>
            </div>

            {primaryAction && (
              <div className="pt-4">
                <button
                  onClick={primaryAction.onClick}
                  className={cn(theme.heroAuth.buttonStyle, "flex items-center gap-2 group")}
                >
                  {primaryAction.label}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </div>

          {/* Right Side: Form / Children */}
          <div className="w-full md:w-auto flex justify-center md:justify-end">{children}</div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="relative z-20 w-full bg-black/40 backdrop-blur-sm border-t border-white/10 py-6 px-6">
        <div className="max-w-7xl mx-auto text-center text-white/80 text-sm md:text-base whitespace-nowrap overflow-hidden text-ellipsis">
          Built for property owners and operators to manage, communicate, and grow smarter with intelligent agents.
        </div>
      </footer>
    </div>
  )
}
