export async function PUT(request, { params }) {
  const { status } = await request.json()

  // Mock implementation
  return Response.json({
    id: params.id,
    status,
    message: 'Task status updated'
  })
}
