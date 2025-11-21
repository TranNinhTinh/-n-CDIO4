import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = 'https://postmaxillary-variably-justa.ngrok-free.dev'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('🔵 Proxy Register Request:', JSON.stringify(body, null, 2))

    // Format phone number nếu cần
    let phone = body.phone || body.phoneNumber
    if (phone && !phone.startsWith('+')) {
      if (phone.startsWith('0')) {
        phone = '+84' + phone.substring(1)
      } else if (!phone.startsWith('84')) {
        phone = '+84' + phone
      } else {
        phone = '+' + phone
      }
    }

    // Chuẩn bị payload cho backend
    const registerPayload = {
      fullName: body.fullName,
      email: body.email,
      phone: phone,
      password: body.password,
      role: body.role, // Backend yêu cầu role: 'customer' hoặc 'provider'
    }
    
    console.log('📤 Sending to backend:', JSON.stringify({ ...registerPayload, password: '***' }, null, 2))

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
      { success: false, message: 'Internal server error', error: String(error) },
      { status: 500 }
    )
  }
}
