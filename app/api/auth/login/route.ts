import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = 'https://postmaxillary-variably-justa.ngrok-free.dev'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('🔵 Proxy Login Request:', body)

    // Xử lý identifier: nếu là số điện thoại, thử nhiều format
    let loginAttempts = [body]
    
    // Kiểm tra nếu identifier là số điện thoại (chỉ chứa số và bắt đầu bằng 0)
    if (body.identifier && /^0\d{9,10}$/.test(body.identifier)) {
      console.log('📱 Phát hiện số điện thoại, thử nhiều format...')
      
      // Thử các format khác nhau
      loginAttempts = [
        body, // Format gốc: 0129477565
        { ...body, identifier: body.identifier.replace(/^0/, '+84') }, // +84129477565
        { ...body, identifier: body.identifier.replace(/^0/, '84') },  // 84129477565
      ]
    }

    let lastError = null
    
    // Thử đăng nhập với từng format
    for (const attempt of loginAttempts) {
      try {
        console.log('🔄 Thử đăng nhập với:', attempt.identifier)
        
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
          body: JSON.stringify(attempt),
        })

        const data = await response.json()
        
        // Nếu thành công (status 200-299), return ngay
        if (response.ok) {
          console.log('✅ Đăng nhập thành công với format:', attempt.identifier)
          return NextResponse.json(data, { status: response.status })
        }
        
        // Lưu lại lỗi cuối cùng
        lastError = { data, status: response.status }
        console.log(`❌ Thất bại với ${attempt.identifier}:`, response.status)
        
      } catch (err) {
        console.error('❌ Lỗi khi thử format:', attempt.identifier, err)
        lastError = { data: { message: String(err) }, status: 500 }
      }
    }
    
    // Nếu tất cả đều thất bại, trả về lỗi cuối cùng
    console.log('❌ Tất cả các format đều thất bại')
    return NextResponse.json(
      lastError?.data || { message: 'Login failed' }, 
      { status: lastError?.status || 401 }
    )
    
  } catch (error) {
    console.error('❌ Proxy Login Error:', error)
    return NextResponse.json(
      { message: 'Internal server error', error: String(error) },
      { status: 500 }
    )
  }
}
