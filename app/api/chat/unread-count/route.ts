import { NextRequest, NextResponse } from 'next/server'

// GET /api/chat/unread-count - Đếm tổng tin nhắn chưa đọc
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Trong production, đếm số tin nhắn chưa đọc từ database
    // const unreadCount = await countUnreadMessages(userId)

    // Mock response
    const unreadCount = 5

    return NextResponse.json({ unreadCount }, { status: 200 })
  } catch (error) {
    console.error('Error getting unread count:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
