'use client'

import Link from 'next/link'
import { Button } from './ui/button'
import { Crown, LogOut, Home, Zap, Trophy, Users } from 'lucide-react'

export default function Navigation({ user, onLogout }) {
  return (
    <nav className="border-b border-[#4B0082]/30 bg-[#0C1B33]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3">
          <Crown className="w-6 h-6 text-[#FFD700]" />
          <span className="text-xl font-bold text-white">DevQuest</span>
        </Link>

        {user && (
          <>
            <div className="hidden md:flex items-center gap-1">
              <Link href="/dashboard">
                <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-[#4B0082]/20">
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/kanban">
                <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-[#4B0082]/20">
                  <Users className="w-4 h-4 mr-2" />
                  Kanban
                </Button>
              </Link>
              <Link href="/leaderboard">
                <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-[#4B0082]/20">
                  <Trophy className="w-4 h-4 mr-2" />
                  Leaderboard
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/profile">
                <div className="flex items-center gap-2 px-3 py-2 bg-[#4B0082]/30 rounded-lg hover:bg-[#4B0082]/50 transition cursor-pointer">
                  <div className="w-8 h-8 bg-[#FFD700] rounded-full flex items-center justify-center text-sm font-bold text-black">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm text-white font-medium">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.xp || 0} XP</p>
                  </div>
                </div>
              </Link>

              <Button
                onClick={onLogout}
                variant="ghost"
                className="text-gray-300 hover:text-red-400 hover:bg-red-900/20"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </nav>
  )
}
