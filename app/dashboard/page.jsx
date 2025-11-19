'use client'

import { useEffect, useState } from 'react'
import { Zap, Award, TrendingUp, Users } from 'lucide-react'
import StatCard from '@/components/dashboard/stat-card'
import ProjectCard from '@/components/cards/project-card'

export default function DashboardPage() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const mockProjects = [
    { id: 1, title: 'Landing Page Redesign', status: 'In Progress', progress: 65 },
    { id: 2, title: 'API Integration', status: 'Todo', progress: 0 },
    { id: 3, title: 'Database Migration', status: 'In Review', progress: 85 },
  ]

  if (!user) return null

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 wrap-break-word">
          Welcome back, <span className="gradient-text">{user.name}</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">Track your progress and conquer your quests</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
        <StatCard icon={Zap} label="Total XP" value="2,450" change="+150 this week" />
        <StatCard icon={TrendingUp} label="Current Level" value="5" change="145 XP to next level" />
        <StatCard icon={Award} label="Badges Earned" value="8" change="Collect them all!" />
        <StatCard icon={Users} label="Leaderboard Rank" value="#12" change="Top 5% of realm" />
      </div>

      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Active Quests</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {mockProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  )
}
