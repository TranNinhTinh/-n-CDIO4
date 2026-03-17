import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://postmaxillary-variably-justa.ngrok-free.dev/api/v1'

// POST /api/chat/conversations/direct - Tạo conversation riêng với thợ
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { workerId } = body

    if (!workerId) {
      return NextResponse.json(
        { message: 'Worker ID is required' },
        { status: 400 }
      )
    }

    console.log('🔔 [Create Direct Conversation] WorkerId:', workerId)
    console.log('🔔 [Create Direct Conversation] Calling backend API...')

    // Backend yêu cầu "providerId" không phải "workerId"
    const response = await fetch(`${API_BASE_URL}/chat/conversations/direct`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify({ providerId: workerId })  // ✅ Đổi key thành providerId
    })

    const data = await response.json()
    
    console.log('🔔 [Create Direct Conversation] Backend response:', data)
    console.log('🔔 [Create Direct Conversation] Status:', response.status)

    if (!response.ok) {
      console.error('❌ [Create Direct Conversation] Error:', data)
      return NextResponse.json(
        { message: data.message || 'Failed to create conversation' },
        { status: response.status }
      )
    }

    console.log('✅ [Create Direct Conversation] Success! ConversationId:', data.id)

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('❌ [Create Direct Conversation] Error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
