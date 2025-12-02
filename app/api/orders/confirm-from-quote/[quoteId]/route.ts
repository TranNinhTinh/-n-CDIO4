import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://postmaxillary-variably-justa.ngrok-free.dev/api/v1'

/**
 * POST /api/orders/confirm-from-quote/{quoteId}
 * [Provider] Xác nhận làm → Tạo order
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { quoteId: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized - Missing token' },
        { status: 401 }
      )
    }

    const { quoteId } = params
    const body = await request.json()

    const response = await fetch(`${API_BASE_URL}/orders/confirm-from-quote/${quoteId}`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to confirm order' },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: 201 })

  } catch (error) {
    console.error('Error confirming order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
