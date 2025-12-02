import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://postmaxillary-variably-justa.ngrok-free.dev/api/v1'

/**
 * DELETE /api/notifications/read
 * Xóa tất cả thông báo đã đọc
 */
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized - Missing token' },
        { status: 401 }
      )
    }

    const response = await fetch(`${API_BASE_URL}/notifications/read`, {
      method: 'DELETE',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      }
    })

    if (!response.ok) {
      const data = await response.json()
      return NextResponse.json(
        { error: data.error || 'Failed to delete read notifications' },
        { status: response.status }
      )
    }

    return NextResponse.json(
      { message: 'All read notifications deleted' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error deleting read notifications:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
