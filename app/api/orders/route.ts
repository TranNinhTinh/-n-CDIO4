import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://postmaxillary-variably-justa.ngrok-free.dev/api/v1'

/**
 * GET /api/orders
 * Lấy danh sách đơn hàng của tôi
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

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || ''
    const role = searchParams.get('role') || ''
    const limit = searchParams.get('limit') || '20'
    const cursor = searchParams.get('cursor') || ''

    const queryString = new URLSearchParams({
      limit,
      ...(status && { status }),
      ...(role && { role }),
      ...(cursor && { cursor })
    }).toString()

    const response = await fetch(`${API_BASE_URL}/orders?${queryString}`, {
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
        { error: data.error || 'Failed to fetch orders' },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: 200 })

  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
