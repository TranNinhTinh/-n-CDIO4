import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_DOMAIN || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'

/**
 * POST /api/quotes/{id}/accept-for-chat
 * [Customer] Chấp nhận quote để mở chat
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized - Missing token' },
        { status: 401 }
      )
    }

    const { id } = params

    console.log('🔔 [Accept Quote] QuoteId:', id)
    console.log('🔔 [Accept Quote] Calling backend API...')

    // Backend có thể yêu cầu body, gửi empty object
    const response = await fetch(`${API_BASE_URL}/quotes/${id}/accept-for-chat`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify({})
    })

    const data = await response.json()
    
    console.log('🔔 [Accept Quote] Backend response:', data)
    console.log('🔔 [Accept Quote] Status:', response.status)
    console.log('🔔 [Accept Quote] Response keys:', Object.keys(data))
    console.log('🔔 [Accept Quote] Full response:', JSON.stringify(data, null, 2))

    if (!response.ok) {
      console.error('❌ [Accept Quote] Error:', data)
      return NextResponse.json(
        { error: data.error || 'Failed to accept quote' },
        { status: response.status }
      )
    }

    // Kiểm tra nhiều cấu trúc response có thể có
    const conversationId = data.conversationId || 
                          data.data?.conversationId || 
                          data.conversation?.id ||
                          data.data?.conversation?.id

    console.log('✅ [Accept Quote] Success! ConversationId:', conversationId)
    console.log('✅ [Accept Quote] Provider will receive notification via backend')

    // Trả về response chuẩn với conversationId ở top level
    return NextResponse.json({
      ...data,
      conversationId: conversationId
    }, { status: 200 })

  } catch (error) {
    console.error('Error accepting quote:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
