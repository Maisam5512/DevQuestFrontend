'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles, Zap, Trophy, Users, Target, Gamepad2 } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-700 bg-slate-950/95 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">DevQuest</span>
          </div>
          <div className="flex gap-3">
            <Link href="/login" className="btn-outline">
              Login
            </Link>
            <Link href="/register" className="btn-primary">
              Start Quest
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-linear-to-b from-blue-600/10 to-transparent pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-slate-400">Welcome to the ultimate gaming experience</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white text-balance">
              Turn Project <span className="gradient-text">Management</span> into an <span className="gradient-text">RPG Adventure</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto text-balance">
              Gamify your workflow. Level up your team. Complete quests. Earn XP. Climb the leaderboard and become a legend.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="btn-primary inline-flex items-center justify-center gap-2">
                Start Your Quest <ArrowRight className="w-4 h-4" />
              </Link>
              <button className="btn-outline">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-900/30 border-y border-slate-700">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-slate-300 text-lg">Everything you need to gamify project management</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: 'XP & Leveling', desc: 'Earn experience for every task completed. Auto-calculate levels and unlock new achievements.' },
              { icon: Trophy, title: 'Badges & Achievements', desc: 'Collect unique badges. First Task, 5 Tasks Completed, Level 5+. Show off your skills.' },
              { icon: Users, title: 'Team Leaderboard', desc: 'Real-time global ranking. Compete with teammates. See who is the top adventurer.' },
              { icon: Target, title: 'Role-Based System', desc: 'Client, PM, Developer. Each role has unique powers, responsibilities, and abilities.' },
              { icon: Gamepad2, title: 'Kanban Board', desc: 'Drag and drop tasks through To Do, In Progress, Review, Done. Real-time sync.' },
              { icon: Trophy, title: 'Real-Time Updates', desc: 'Watch leaderboards update instantly. See teammate progress live. No refresh needed.' },
            ].map((feature, i) => {
              const Icon = feature.icon
              return (
                <div key={i} className="card-glow p-6 group">
                  <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600/30 transition">
                    <Icon className="w-6 h-6 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm">{feature.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Choose Your Path</h2>
            <p className="text-slate-300 text-lg">Every role is essential to the quest</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { emoji: '🎯', role: 'Client', subtitle: 'Quest Giver', desc: 'Create projects and track real-time progress' },
              { emoji: '👑', role: 'Project Manager', subtitle: 'Guild Master', desc: 'Manage teams and assign quests' },
              { emoji: '⚔️', role: 'Developer', subtitle: 'Adventurer', desc: 'Complete tasks and dominate leaderboards' },
            ].map((item, i) => (
              <div key={i} className="card-glow p-8 text-center hover:border-cyan-500/50 transition">
                <div className="text-5xl mb-6">{item.emoji}</div>
                <h3 className="text-2xl font-bold text-white mb-2">{item.role}</h3>
                <p className="text-sm text-cyan-400 font-medium mb-4">{item.subtitle}</p>
                <p className="text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900/50 border-y border-slate-700">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Start Your Adventure?</h2>
          <p className="text-slate-300 mb-8 text-lg">Join thousands of developers and managers turning work into an epic quest.</p>
          <Link href="/register" className="btn-primary inline-flex items-center gap-2">
            Begin Quest <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/30 py-12">
        <div className="container mx-auto px-6 text-center text-slate-400">
          <p>© 2025 DevQuest. Turn work into an adventure. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
