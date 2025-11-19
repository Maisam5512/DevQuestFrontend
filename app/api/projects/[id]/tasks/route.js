export async function GET(request, { params }) {
  const { id } = params

  // Mock implementation
  const tasks = [
    {
      id: '1',
      projectId: id,
      title: 'Design Wireframes',
      description: 'Create wireframes for mobile app',
      status: 'todo',
      priority: 'high',
      xpReward: 150,
      assignedTo: 'dev1'
    },
    {
      id: '2',
      projectId: id,
      title: 'Create UI Components',
      description: 'Build reusable React components',
      status: 'inprogress',
      priority: 'high',
      xpReward: 200,
      assignedTo: 'dev2'
    },
    {
      id: '3',
      projectId: id,
      title: 'Setup Database',
      description: 'Configure MongoDB and schemas',
      status: 'review',
      priority: 'medium',
      xpReward: 100,
      assignedTo: 'dev1'
    },
    {
      id: '4',
      projectId: id,
      title: 'API Testing',
      description: 'Write tests for all endpoints',
      status: 'done',
      priority: 'medium',
      xpReward: 80,
      assignedTo: 'dev3'
    }
  ]

  return Response.json(tasks)
}

export async function POST(request, { params }) {
  const { title, description, priority, xpReward } = await request.json()

  const task = {
    id: Math.random().toString(36).substr(2, 9),
    projectId: params.id,
    title,
    description,
    priority,
    xpReward,
    status: 'todo'
  }

  return Response.json(task)
}
