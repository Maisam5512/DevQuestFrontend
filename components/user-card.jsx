'use client'

import { Card, CardContent } from './ui/card'
import { Crown, Zap, Trophy, Star } from 'lucide-react'

export default function UserCard({ user }) {
  const xpToNextLevel = 1000 - (user?.xp % 1000)

  return (
    <Card className="bg-linear-to-r from-[#4B0082] to-[#6A0DAD] border-0 mb-8 glow-purple">
      <CardContent className="pt-8 pb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-[#FFD700] rounded-lg flex items-center justify-center text-4xl font-bold text-black">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
              <p className="text-[#FFD700] capitalize font-semibold">{user?.role === 'pm' ? 'Project Manager' : user?.role === 'client' ? 'Client' : 'Developer'}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-200">Level</p>
              <p className="text-3xl font-bold text-[#FFD700]">{user?.level || 1}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-200">Total XP</p>
              <p className="text-3xl font-bold text-[#03C988]">{user?.xp || 0}</p>
            </div>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-200">Level Progress</span>
            <span className="text-[#FFD700]">{user?.xp % 1000} / 1000</span>
          </div>
          <div className="w-full bg-[#2a1a4a] rounded-full h-3 overflow-hidden">
            <div
              className="bg-linear-to-r from-[#FFD700] to-[#FFA500] h-full transition-all"
              style={{ width: `${((user?.xp % 1000) / 1000) * 100}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
