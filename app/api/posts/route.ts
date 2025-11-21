import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = 'https://postmaxillary-variably-justa.ngrok-free.dev'

// Create new post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const authHeader = request.headers.get('authorization')

    console.log('🔵 Proxy Create Post Request:', JSON.stringify(body, null, 2))
    console.log('🔑 Auth Header:', authHeader ? authHeader.substring(0, 30) + '...' : 'MISSING')

    if (!authHeader) {
      console.error('❌ No authorization header provided!')
      return NextResponse.json(
        { success: false, message: 'Unauthorized - No token provided' },
        { status: 401 }
      )
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        'Authorization': authHeader,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    console.log('🔵 Proxy Create Post Response:', response.status, JSON.stringify(data, null, 2))

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('❌ Proxy Create Post Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: String(error) },
      { status: 500 }
    )
  }
}
