import { NextRequest, NextResponse } from 'next/server'

// GET /api/chat/conversations/[id]/messages - Lấy tin nhắn của conversation
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params

    // Mock messages
    const mockMessages = [
      {
        id: 'm1',
        conversationId: id,
        senderId: 'worker1',
        senderName: 'Nguyễn Văn A',
        senderAvatar: '/avatars/worker1.jpg',
        content: 'Xin chào! Tôi có thể giúp gì cho bạn?',
        isRead: true,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'm2',
        conversationId: id,
        senderId: 'user1',
        senderName: 'Tôi',
        content: 'Tôi cần sửa điện',
        isRead: true,
        createdAt: new Date(Date.now() - 3000000).toISOString(),
      },
      {
        id: 'm3',
        conversationId: id,
        senderId: 'worker1',
        senderName: 'Nguyễn Văn A',
        senderAvatar: '/avatars/worker1.jpg',
        content: 'Vâng, tôi có thể đến địa chỉ của bạn vào lúc nào?',
        isRead: false,
        createdAt: new Date(Date.now() - 1800000).toISOString(),
      },
    ]

    return NextResponse.json(mockMessages, { status: 200 })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/chat/conversations/[id]/messages - Gửi tin nhắn
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params
    const body = await request.json()
    const { content } = body

    if (!content || content.trim() === '') {
      return NextResponse.json(
        { message: 'Content is required' },
        { status: 400 }
      )
    }

    // Mock new message
    const newMessage = {
      id: `m${Date.now()}`,
      conversationId: id,
      senderId: 'user1',
      senderName: 'Tôi',
      content: content.trim(),
      isRead: false,
      createdAt: new Date().toISOString(),
    }

    // Trong production, lưu message vào database
    // await saveMessage(newMessage)

    return NextResponse.json(newMessage, { status: 201 })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
