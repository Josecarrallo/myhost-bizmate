"use client"

import { useRouter } from "next/navigation"
import type { FormEvent } from "react"

export default function LoginPage() {
  const router = useRouter()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    router.push("/dashboard")
  }

  return (
    <div className="grid grid-cols-2 min-h-screen bg-[#2a2f3a]">
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <h1 className="text-7xl font-bold tracking-tight mb-4 text-[#FF8C42]">
            MY HOST
            <br />
            BizMate
          </h1>
          <p className="text-2xl font-medium mt-8 text-white">AI Operating System for Property Owners</p>
        </div>
      </div>

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-[#2f3542] rounded-2xl shadow-xl p-12">
            <h2 className="text-2xl font-semibold text-white text-center mb-8">Sign in to your account</h2>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="jose@myhost.com"
                  className="w-full px-4 py-3 bg-[#E3EBF8] border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-[#FF8C42] focus:outline-none focus:border-transparent"
                  defaultValue="jose@myhost.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••••"
                  className="w-full px-4 py-3 bg-[#E3EBF8] border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-[#FF8C42] focus:outline-none focus:border-transparent"
                  defaultValue="password123"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#FF8C42] hover:bg-[#FF7B2E] text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-md"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
