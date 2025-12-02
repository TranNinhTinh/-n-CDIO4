import { NextRequest, NextResponse } from 'next/server'

// POST /api/chat/conversations/[id]/close - Đóng conversation
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

    // Trong production, cập nhật conversation status trong database
    // await closeConversation(id)

    return NextResponse.json(
      { message: 'Conversation closed successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error closing conversation:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
