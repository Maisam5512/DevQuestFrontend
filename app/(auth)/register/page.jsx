'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Gamepad2, Mail, Lock, User, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'

export default function RegisterPage() {
  const { register } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'developer',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { name, email, password, confirmPassword, role } = formData

      if (!name || !email || !password || !confirmPassword) {
        toast.error('Please fill in all fields')
        return
      }

      if (password !== confirmPassword) {
        toast.error('Passwords do not match')
        return
      }

      if (password.length < 6) {
        toast.error('Password must be at least 6 characters')
        return
      }

      await register(name, email, password, role)

      toast.success('Welcome to DevQuest, ' + name + '!')
      router.push('/dashboard')
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.')
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
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Join DevQuest</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 sm:mt-2">Begin your epic adventure</p>
        </div>

        <div className="card-glow p-6 sm:p-8 mb-4 sm:mb-6">
          <form onSubmit={handleRegister} className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-white mb-1 sm:mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
                <input type="text" name="name" placeholder="Your name" value={formData.name} onChange={handleChange} className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition" />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-white mb-1 sm:mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
                <input type="email" name="email" placeholder="adventurer@example.com" value={formData.email} onChange={handleChange} className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition" />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-white mb-1 sm:mb-2">Select Your Role</label>
              <select name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-2 sm:py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition">
                <option value="client">Client (Quest Giver)</option>
                <option value="pm">Project Manager (Guild Master)</option>
                <option value="developer">Developer (Adventurer)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-white mb-1 sm:mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
                <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition" />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-white mb-1 sm:mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
                <input type="password" name="confirmPassword" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition" />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base py-2 sm:py-2.5 mt-4 sm:mt-6">
              {isLoading ? 'Creating account...' : <>Start Adventure <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        </div>

        <div className="text-center mb-4">
          <p className="text-xs sm:text-sm text-slate-400">
            Already have an account? <Link href="/login" className="text-blue-500 font-medium hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </main>
  )
}
