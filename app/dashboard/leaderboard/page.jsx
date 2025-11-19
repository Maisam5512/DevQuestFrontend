'use client'

import { Trophy } from 'lucide-react'

export default function LeaderboardPage() {
  const leaderboard = [
    { rank: 1, name: 'Alex Chen', xp: 5840, level: 12, badge: '👑' },
    { rank: 2, name: 'Jordan Smith', xp: 5320, level: 11, badge: '🥈' },
    { rank: 3, name: 'Casey Taylor', xp: 4950, level: 10, badge: '🥉' },
    { rank: 4, name: 'Morgan Lee', xp: 4120, level: 9, badge: '⚡' },
    { rank: 5, name: 'Riley Davis', xp: 3890, level: 8, badge: '🔥' },
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 flex items-center gap-2 sm:gap-3">
          <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 shrink-0" />
          <span className="wrap-break-word">Global Leaderboard</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">Compete with adventurers around the realm</p>
      </div>

      <div className="card-glow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-900/50">
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-white">Rank</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-white">Name</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-white">Level</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-white">XP</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, idx) => (
                <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-900/30 transition">
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg sm:text-2xl">{entry.badge}</span>
                      <span className="font-bold text-white text-xs sm:text-base">#{entry.rank}</span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <span className="font-medium text-white text-xs sm:text-base wrap-break-word">{entry.name}</span>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                      <span className="text-white font-medium text-xs sm:text-base">L{entry.level}</span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <span className="font-bold text-blue-500 text-xs sm:text-base">{entry.xp.toLocaleString()}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
