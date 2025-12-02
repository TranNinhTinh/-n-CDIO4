import { NextRequest, NextResponse } from 'next/server'

// GET /api/chat/search - Tìm kiếm tin nhắn
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('query')
    const limit = searchParams.get('limit') || '20'

    if (!query) {
      return NextResponse.json(
        { message: 'Query parameter is required' },
        { status: 400 }
      )
    }

    // Mock search results
    const mockResults = [
      {
        id: 'm1',
        conversationId: '1',
        senderId: 'worker1',
        senderName: 'Nguyễn Văn A',
        senderAvatar: '/avatars/worker1.jpg',
        content: `Tìm thấy: ${query}`,
        isRead: true,
        createdAt: new Date().toISOString(),
      },
    ]

    // Trong production:
    // const results = await searchMessages(userId, query, parseInt(limit))

    return NextResponse.json(mockResults, { status: 200 })
  } catch (error) {
    console.error('Error searching messages:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
