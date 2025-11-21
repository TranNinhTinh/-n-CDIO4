import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = 'https://postmaxillary-variably-justa.ngrok-free.dev'

// Close post
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')

    console.log('🔵 Proxy Close Post Request:', params.id)

    const response = await fetch(`${API_BASE_URL}/api/v1/posts/${params.id}/close`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        ...(authHeader ? { 'Authorization': authHeader } : {}),
      },
    })

    const data = await response.json()
    console.log('🔵 Proxy Close Post Response:', response.status, data)

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('❌ Proxy Close Post Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: String(error) },
      { status: 500 }
    )
  }
}
