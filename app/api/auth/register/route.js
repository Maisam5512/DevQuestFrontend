export async function POST(request) {
  const { name, email, password, role } = await request.json()

  // Mock implementation - replace with actual backend
  const user = {
    id: Math.random().toString(36).substr(2, 9),
    name,
    email,
    role,
    xp: 0,
    level: 1,
    badges: []
  }

  const token = 'mock-jwt-token-' + user.id

  return Response.json({ user, token })
}
