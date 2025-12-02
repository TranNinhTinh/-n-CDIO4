import { NextRequest, NextResponse } from 'next/server'

// Mock database - trong production nên dùng database thật
let conversations: any[] = []

// GET /api/chat/conversations - Lấy danh sách conversations
export async function GET(request: NextRequest) {
  try {
    // Lấy token từ header
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Trong production, decode token để lấy userId và filter conversations
    // const userId = decodeToken(token).userId
    
    // Mock response
    const mockConversations = [
      {
        id: '1',
        workerId: 'worker1',
        workerName: 'Nguyễn Văn A',
        workerAvatar: '/avatars/worker1.jpg',
        lastMessage: 'Xin chào, tôi có thể giúp gì cho bạn?',
        lastMessageTime: new Date().toISOString(),
        unreadCount: 2,
        isClosed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        workerId: 'worker2',
        workerName: 'Trần Thị B',
        workerAvatar: '/avatars/worker2.jpg',
        lastMessage: 'Cảm ơn bạn đã sử dụng dịch vụ',
        lastMessageTime: new Date().toISOString(),
        unreadCount: 0,
        isClosed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    return NextResponse.json(mockConversations, { status: 200 })
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
