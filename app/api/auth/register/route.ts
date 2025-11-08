import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = 'https://postmaxillary-variably-justa.ngrok-free.dev'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('🔵 Proxy Register Request:', JSON.stringify(body, null, 2))

    // Thử các tên field khác nhau cho phone
    const registerPayload = {
      ...body,
      // Đảm bảo có cả phoneNumber và phone
      phone: body.phoneNumber || body.phone,
      phoneNumber: body.phoneNumber || body.phone,
    }
    
    console.log('📤 Sending to backend:', JSON.stringify(registerPayload, null, 2))

    const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
      body: JSON.stringify(registerPayload),
    })

    const data = await response.json()
    console.log('🔵 Proxy Register Response:', response.status, JSON.stringify(data, null, 2))

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('❌ Proxy Register Error:', error)
    return NextResponse.json(
      { message: 'Internal server error', error: String(error) },
      { status: 500 }
    )
  }
}
