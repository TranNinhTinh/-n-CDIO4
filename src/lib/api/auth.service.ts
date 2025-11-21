import { TOKEN_KEYS } from './config'
import apiClient from './client'
import type { 
  LoginDto, 
  RegisterDto, 
  LoginResponseDto, 
  RegisterResponseDto 
} from './index'

// Types cho API request/response
export interface LoginRequest extends LoginDto {}

export interface RegisterRequest extends RegisterDto {
  role?: 'customer' | 'provider'
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    email?: string
    phone?: string
    fullName?: string
  }
}

// Auth Service sử dụng SDK
export class AuthService {

  // Đăng nhập
  static async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      console.log('🔵 Login Request:', { ...data, password: '***' })

      // Gọi qua proxy route để tránh CORS
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()
      
      console.log('✅ Login Response Status:', response.status)
      console.log('✅ Login Response Data:', responseData)

      if (!response.ok) {
        const errorMessage = responseData.message || 'Đăng nhập thất bại'
        console.error('❌ Login failed:', errorMessage)
        throw new Error(errorMessage)
      }

      if (!responseData.data) {
        throw new Error('Không nhận được dữ liệu từ server')
      }

      const result = responseData.data
      
      // Lưu token vào localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, result.accessToken)
        localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, result.refreshToken)
      }

      console.log('✅ Login Success!')

      return {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: result.user as any
      }
    } catch (error: any) {
      console.error('❌ Login Error:', error)
      
      let userMessage = 'Đăng nhập thất bại'
      
      if (error?.message) {
        userMessage = error.message
      }
      
      throw new Error(userMessage)
    }
  }

  // Đăng ký
  static async register(data: RegisterRequest): Promise<{ success: boolean, message: string }> {
    try {
      console.log('🔵 Register Request:', { ...data, password: '***' })

      // Gọi qua proxy route để tránh CORS
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()
      
      console.log('✅ Register API Response Status:', response.status)
      console.log('✅ Register API Response Data:', responseData)

      // Kiểm tra nếu response không OK (status 4xx, 5xx)
      if (!response.ok) {
        console.error('❌ Register failed with status:', response.status)
        const errorMessage = responseData.message || 'Đăng ký thất bại'
        throw new Error(errorMessage)
      }

      // Kiểm tra nếu response có success field và = false
      if (responseData.success === false) {
        console.error('❌ Register failed:', responseData.message)
        throw new Error(responseData.message || 'Đăng ký thất bại')
      }

      console.log('✅ Register Success!')

      // Trả về success để component redirect về trang đăng nhập
      return {
        success: true,
        message: responseData.message || 'Đăng ký thành công'
      }
    } catch (error: any) {
      console.error('❌ Register Error:', error)
      
      let userMessage = 'Đăng ký thất bại'
      
      if (error?.message) {
        userMessage = error.message
      }
      
      throw new Error(userMessage)
    }
  }

  // Làm mới token
  static async refreshToken(): Promise<AuthResponse> {
    try {
      const response = await apiClient.auth.authControllerRefresh()
      
      if (!response.data || !response.data.data) {
        throw new Error('Làm mới token thất bại')
      }

      const result = response.data.data
      
      // Cập nhật token mới
      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, result.accessToken)
        localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, result.refreshToken)
      }

      return {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: result.user as any
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Có lỗi xảy ra khi làm mới token')
    }
  }

  // Đăng xuất
  static async logout(): Promise<void> {
    try {
      await apiClient.auth.authControllerLogout()
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error)
    } finally {
      // Xóa token khỏi localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN)
        localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN)
      }
    }
  }

  // Lấy access token
  static getAccessToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN)
  }

  // Kiểm tra đã đăng nhập
  static isAuthenticated(): boolean {
    return !!this.getAccessToken()
  }
}
