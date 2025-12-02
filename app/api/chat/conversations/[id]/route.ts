import { NextRequest, NextResponse } from 'next/server'

// GET /api/chat/conversations/[id] - Xem chi tiết conversation
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

    // Mock response
    const mockConversation = {
      id,
      workerId: 'worker1',
      workerName: 'Nguyễn Văn A',
      workerAvatar: '/avatars/worker1.jpg',
      lastMessage: 'Xin chào, tôi có thể giúp gì cho bạn?',
      lastMessageTime: new Date().toISOString(),
      unreadCount: 2,
      isClosed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(mockConversation, { status: 200 })
  } catch (error) {
    console.error('Error fetching conversation:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/chat/conversations/[id] - Xóa conversation
export async function DELETE(
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

    // Trong production, xóa conversation từ database
    // await deleteConversation(id)

    return NextResponse.json(
      { message: 'Conversation deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting conversation:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
