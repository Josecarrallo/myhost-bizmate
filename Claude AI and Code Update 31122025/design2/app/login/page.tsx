"use client"

import { HeroAuthLayout } from "@/components/layouts/hero-auth-layout"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <HeroAuthLayout
      title="Empowering Property Owners with Intelligence"
      subtitle="An AI-powered operating system for modern property owners. Manage operations, guests, marketing and AI agents from one intelligent platform."
      backgroundImage="/modern-bali-architecture-luxury-villa.jpg"
    >
      <div className="space-y-6">
        <LoginForm />
      </div>
    </HeroAuthLayout>
  )
}
