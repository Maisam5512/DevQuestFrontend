export async function GET(request) {
  try {
    const response = await fetch('http://localhost:4000/api/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      return Response.json(
        { message: 'Failed to fetch users from backend' },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Filter users by role to get only PMs
    const pms = data.users?.filter(user => user.role === 'PM') || []

    return Response.json({ users: pms })
  } catch (error) {
    console.error('[v0] Error fetching users:', error)
    return Response.json(
      { message: 'Failed to fetch users', error: error.message },
      { status: 500 }
    )
  }
}
