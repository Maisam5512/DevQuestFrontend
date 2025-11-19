export async function POST(request) {
  const { email, password } = await request.json()

  // Mock implementation - replace with actual backend
  const user = {
    id: 'user123',
    name: 'Adventurer',
    email,
    role: 'developer',
    xp: 2500,
    level: 3,
    badges: ['first_task', '5_tasks', 'level_3']
  }

  const token = 'mock-jwt-token-' + user.id

  return Response.json({ user, token })
}
