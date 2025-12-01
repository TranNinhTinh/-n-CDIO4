import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://postmaxillary-variably-justa.ngrok-free.dev/api/v1'

/**
 * PATCH /api/v1/profile/avatar
 * Cập nhật avatar của user
 * 
 * Headers:
 * - Authorization: Bearer {access_token}
 * - Content-Type: multipart/form-data
 * 
 * Body (FormData):
 * - avatar: File (image file - jpg, jpeg, png, gif)
 * 
 * Hoặc Body (JSON):
 * {
 *   "avatarUrl": "string"    // URL của avatar
 * }
 * 
 * Response 200:
 * {
 *   "id": "string",
 *   "avatar": "string",       // URL của avatar mới
 *   "updatedAt": "string"
 * }
 */
export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized - Token không tồn tại' },
        { status: 401 }
      )
    }

    const contentType = request.headers.get('content-type')

    let response: Response

    // Handle multipart/form-data (file upload)
    if (contentType?.includes('multipart/form-data')) {
      const formData = await request.formData()
      const avatarFile = formData.get('avatar')

      if (!avatarFile || !(avatarFile instanceof File)) {
        return NextResponse.json(
          { error: 'File avatar không hợp lệ' },
          { status: 400 }
        )
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
      if (!allowedTypes.includes(avatarFile.type)) {
        return NextResponse.json(
          { error: 'Chỉ chấp nhận file ảnh (jpg, jpeg, png, gif)' },
          { status: 400 }
        )
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (avatarFile.size > maxSize) {
        return NextResponse.json(
          { error: 'Kích thước file tối đa 5MB' },
          { status: 400 }
        )
      }

      response = await fetch(`${API_BASE_URL}/profile/avatar`, {
        method: 'PATCH',
        headers: {
          'Authorization': authHeader,
          'ngrok-skip-browser-warning': 'true',
        },
        body: formData,
      })
    } 
    // Handle JSON (avatar URL)
    else {
      const body = await request.json()

      if (!body.avatarUrl) {
        return NextResponse.json(
          { error: 'URL avatar không được để trống' },
          { status: 400 }
        )
      }

      // Validate URL format
      try {
        new URL(body.avatarUrl)
      } catch {
        return NextResponse.json(
          { error: 'URL avatar không hợp lệ' },
          { status: 400 }
        )
      }

      response = await fetch(`${API_BASE_URL}/profile/avatar`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(body),
      })
    }

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Không thể cập nhật avatar' },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('❌ Update Avatar Error:', error)
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi cập nhật avatar' },
      { status: 500 }
    )
  }
}
