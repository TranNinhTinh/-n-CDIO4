import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://postmaxillary-variably-justa.ngrok-free.dev/api/v1'

/**
 * GET /api/orders/stats
 * Thống kê đơn hàng
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized - Missing token' },
        { status: 401 }
      )
    }

    const response = await fetch(`${API_BASE_URL}/orders/stats`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      }
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to fetch order stats' },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: 200 })

  } catch (error) {
    console.error('Error fetching order stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
