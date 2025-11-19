'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Trophy, Medal, Award, ArrowRight } from 'lucide-react'

export default function LeaderboardPreview({ leaderboard }) {
  const getMedalIcon = (rank) => {
    if (rank === 1) return <Trophy className="w-4 h-4 text-[#FFD700]" />
    if (rank === 2) return <Medal className="w-4 h-4 text-gray-400" />
    if (rank === 3) return <Award className="w-4 h-4 text-orange-600" />
    return <span className="text-xs font-bold text-gray-400">{rank}</span>
  }

  return (
    <Card className="bg-[#4B0082]/30 border-[#6A0DAD]/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-[#FFD700]" />
          Top Adventurers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {leaderboard.map((entry, idx) => (
          <div key={entry.id} className="flex items-center justify-between p-2 bg-[#2a1a4a] rounded-lg">
            <div className="flex items-center gap-3 flex-1">
              {getMedalIcon(idx + 1)}
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{entry.name}</p>
                <p className="text-xs text-gray-400">Lvl {entry.level}</p>
              </div>
            </div>
            <p className="text-sm font-bold text-[#FFD700]">{entry.xp}</p>
          </div>
        ))}

        <Link href="/leaderboard" className="mt-4 block">
          <Button variant="outline" className="w-full border-[#6A0DAD] text-gray-300 hover:bg-[#4B0082]/20">
            View Full Leaderboard
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
