export async function GET(request) {
  // Mock implementation
  const leaderboard = [
    { id: 'u1', name: 'Shadowblade', xp: 15000, level: 15 },
    { id: 'u2', name: 'Frostmage', xp: 12500, level: 13 },
    { id: 'u3', name: 'Ironclad', xp: 10000, level: 11 },
    { id: 'u4', name: 'Speedrunner', xp: 8500, level: 9 },
    { id: 'u5', name: 'Codesmith', xp: 7250, level: 8 },
    { id: 'u6', name: 'Nightwalker', xp: 6000, level: 7 },
    { id: 'u7', name: 'Beastmaster', xp: 5200, level: 6 },
    { id: 'u8', name: 'Mystic', xp: 4100, level: 5 }
  ]

  return Response.json(leaderboard)
}
