import { theme } from "@/lib/theme"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

export function LoginForm() {
  return (
    <div
      className={cn(theme.heroAuth.cardStyle, "transition-all duration-300 hover:shadow-2xl border border-white/20")}
    >
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Sign In</h2>
        <div className="mt-2 h-1 w-12 bg-[#FF8C42] mx-auto rounded-full" />
        <p className="text-slate-500 mt-3 font-medium">Sign in to your property dashboard</p>
      </div>

      <form className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-700 font-semibold ml-1">
            Email Address
          </Label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#FF8C42] transition-colors" />
            <Input
              id="email"
              type="email"
              placeholder="jose@myhost.com"
              className="pl-12 h-14 bg-slate-50 border-slate-200 focus:border-[#FF8C42] focus:ring-[#FF8C42] text-base transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between ml-1">
            <Label htmlFor="password" title="Password" className="text-slate-700 font-semibold">
              Password
            </Label>
            <button type="button" className="text-xs text-[#FF8C42] font-bold hover:underline">
              Forgot?
            </button>
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#FF8C42] transition-colors" />
            <Input
              id="password"
              type="password"
              placeholder="•••••••••"
              className="pl-12 h-14 bg-slate-50 border-slate-200 focus:border-[#FF8C42] focus:ring-[#FF8C42] text-base transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          className={cn(
            theme.heroAuth.buttonStyle,
            "w-full h-14 flex items-center justify-center text-lg font-bold shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all",
          )}
        >
          Sign In
        </button>

        <div className="text-center pt-6 border-t border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">AI Powered · Secure · Private</p>
        </div>
      </form>
    </div>
  )
}
