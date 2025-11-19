'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Gamepad2, Mail, Lock, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!email || !password) {
        toast.error('Please fill in all fields')
        return
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        toast.error('Invalid email format')
        return
      }

      await new Promise(resolve => setTimeout(resolve, 1000))

      localStorage.setItem('user', JSON.stringify({
        id: '1',
        email,
        name: email.split('@')[0],
        role: 'developer',
        xp: 0,
        level: 1,
      }))

      toast.success('Welcome back, adventurer!')
      router.push('/dashboard')
    } catch (error) {
      toast.error('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-linear-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <Gamepad2 className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">DevQuest</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 sm:mt-2">Enter the realm of productivity</p>
        </div>

        <div className="card-glow p-6 sm:p-8 mb-4 sm:mb-6">
          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-white mb-1 sm:mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
                <input
                  type="email"
                  placeholder="adventurer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-white mb-1 sm:mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base py-2 sm:py-2.5">
              {isLoading ? 'Entering realm...' : <>Login <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        </div>

        <div className="text-center mb-6">
          <p className="text-xs sm:text-sm text-slate-400">
            Don't have an account? <Link href="/register" className="text-blue-500 font-medium hover:underline">Create one</Link>
          </p>
        </div>

        <div className="p-3 sm:p-4 bg-slate-900 border border-slate-700 rounded-lg">
          <p className="text-xs text-slate-400 text-center">
            <span className="font-semibold text-cyan-400">Demo:</span> Use any email/password to login
          </p>
        </div>
      </div>
    </main>
  )
}
