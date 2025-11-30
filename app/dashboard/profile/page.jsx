'use client'

import { useEffect, useState } from 'react'
import { User, Zap, TrendingUp, Award } from 'lucide-react'

export default function ProfilePage() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  if (!user) return null
 
  //const badges = ['First Quest', '5 Tasks', 'Level 5', 'Speedrunner', 'Legendary']

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 sm:mb-8">My Profile</h1>

      <div className="card-glow p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-linear-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <User className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{user.name}</h2>
            <p className="text-xs sm:text-sm text-slate-400 capitalize mt-1">{user.role==='pm'?'Project Manager':user.role}</p>
            <p className="text-xs sm:text-sm text-cyan-400 font-medium mt-2">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-slate-900 rounded-lg p-3 sm:p-4 text-center">
            <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2">
              <Zap className="w-4 h-4 text-blue-500" />
              <span className="text-lg sm:text-2xl font-bold text-white">{user.xp}</span>
            </div>
            <p className="text-xs text-slate-400">Total XP</p>
          </div>
          <div className="bg-slate-900 rounded-lg p-3 sm:p-4 text-center">
            <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span className="text-lg sm:text-2xl font-bold text-white">{user.level}</span>
            </div>
            <p className="text-xs text-slate-400">Level</p>
          </div>
          <div className="bg-slate-900 rounded-lg p-3 sm:p-4 text-center">
            <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2">
              <Award className="w-4 h-4 text-purple-500" />
              <span className="text-lg sm:text-2xl font-bold text-white">{user.badges.length}</span>
            </div>
            <p className="text-xs text-slate-400">Badges</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Achievements</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {user.badges.map((badge, i) => (
            <div key={i} className="card-glow p-4 text-center">
              <div className="text-2xl sm:text-3xl mb-2">🏆</div>
              <p className="text-xs sm:text-sm font-medium text-white wrap-break-word">{badge}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
