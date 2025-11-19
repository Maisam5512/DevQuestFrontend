export async function GET(request) {
  const token = request.headers.get('authorization')

  // Mock implementation
  const projects = [
    {
      id: '1',
      title: 'Mobile App Redesign',
      description: 'Redesign the mobile app UI for better UX',
      clientId: 'client1',
      pmId: 'pm1',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      tasksCount: 8
    },
    {
      id: '2',
      title: 'API Integration',
      description: 'Integrate third-party payment API',
      clientId: 'client2',
      pmId: 'pm1',
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      tasksCount: 5
    }
  ]

  return Response.json(projects)
}

export async function POST(request) {
  const { title, description, deadline } = await request.json()

  const project = {
    id: Math.random().toString(36).substr(2, 9),
    title,
    description,
    deadline,
    tasksCount: 0
  }

  return Response.json(project)
}
