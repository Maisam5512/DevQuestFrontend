import { authAPI } from '@/lib/api'

export async function GET(request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/projects`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      return Response.json({ message: 'Failed to fetch projects' }, { status: 404 })
    }

    const projects = await response.json()
    return Response.json(projects)
  } catch (error) {
    console.error('[v0] Error fetching projects:', error)
    return Response.json({ message: 'Server error' }, { status: 500 })
  }
}

export async function POST(request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')

  try {
    const body = await request.json()

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: body.title,
        description: body.description,
        pm: body.pm,
        deadline: body.deadline,
        tags: body.tags || [],
        projectXp: body.projectXp || 0
      })
    })

    if (!response.ok) {
      const error = await response.json()
      return Response.json(error, { status: response.status })
    }

    const project = await response.json()
    return Response.json(project, { status: 201 })
  } catch (error) {
    console.error('[v0] Error creating project:', error)
    return Response.json({ message: 'Server error' }, { status: 500 })
  }
}
