import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://postmaxillary-variably-justa.ngrok-free.dev/api/v1'

/**
 * GET /api/v1/profile/user/{id}
 * Lấy thông tin profile công khai của user khác
 * 
 * Headers:
 * - Authorization: Bearer {access_token} (optional - có thể xem mà không cần đăng nhập)
 * 
 * Params:
 * - id: string (User ID)
 * 
 * Response 200:
 * {
 *   "id": "string",
 *   "displayName": "string",
 *   "avatar": "string",
 *   "bio": "string",
 *   "accountType": "CUSTOMER" | "WORKER",
 *   "rating": number,           // Đánh giá trung bình (nếu là WORKER)
 *   "totalReviews": number,     // Tổng số đánh giá
 *   "completedJobs": number,    // Số công việc đã hoàn thành (nếu là WORKER)
 *   "joinedAt": "string",       // Ngày tham gia
 *   "isVerified": boolean,      // Tài khoản đã xác thực
 *   "skills": string[],         // Kỹ năng (nếu là WORKER)
 *   "location": {
 *     "city": "string",
 *     "district": "string"
 *   }
 * }
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { error: 'User ID không hợp lệ' },
        { status: 400 }
      )
    }

    const authHeader = request.headers.get('authorization')
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    }

    // Add authorization if available
    if (authHeader) {
      headers['Authorization'] = authHeader
    }

    const response = await fetch(`${API_BASE_URL}/profile/user/${id}`, {
      method: 'GET',
      headers,
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Không thể lấy thông tin user' },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('❌ Get User Profile Error:', error)
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi lấy thông tin user' },
      { status: 500 }
    )
  }
}
