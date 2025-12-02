import { NextRequest, NextResponse } from 'next/server'

// POST /api/chat/conversations/direct - Tạo conversation riêng với thợ
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
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

    // Mock new conversation
    const newConversation = {
      id: `conv${Date.now()}`,
      workerId,
      workerName: 'Thợ mới',
      workerAvatar: '/avatars/default.jpg',
      lastMessage: null,
      lastMessageTime: null,
      unreadCount: 0,
      isClosed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Trong production:
    // 1. Kiểm tra xem conversation với thợ này đã tồn tại chưa
    // 2. Nếu chưa, tạo mới conversation
    // 3. Nếu có rồi, trả về conversation hiện tại
    // const conversation = await findOrCreateConversation(userId, workerId)

    return NextResponse.json(newConversation, { status: 201 })
  } catch (error) {
    console.error('Error creating conversation:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
