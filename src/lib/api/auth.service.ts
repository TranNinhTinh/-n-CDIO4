import { API_CONFIG, TOKEN_KEYS } from './config'

// Types cho API request/response
export interface LoginRequest {
  identifier: string  // Có thể là email hoặc phone
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  confirmPassword: string
  phoneNumber: string
  accountType: 'CUSTOMER' | 'WORKER'
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    email: string
    phoneNumber: string
    accountType: string
    createdAt: string
  }
}

export interface ApiError {
  message: string
  statusCode: number
  error?: string
}

// Auth Service
export class AuthService {
  private static getHeaders() {
    return {
      ...API_CONFIG.HEADERS,
    }
  }

  // Đăng nhập
  static async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      console.log('🔵 Login Request:', {
        url: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`,
        data: { ...data, password: '***' }
      })

      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`,
        {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(data),
        }
      )

      console.log('🔵 Login Response Status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Login Error Response:', errorText)
        
        let error: ApiError
        try {
          error = JSON.parse(errorText)
        } catch {
          error = { message: errorText || 'Đăng nhập thất bại', statusCode: response.status }
        }
        
        // Tùy chỉnh thông báo lỗi thân thiện
        let userMessage = error.message || 'Đăng nhập thất bại'
        if (response.status === 401 || error.message?.toLowerCase().includes('unauthorized') || 
            error.message?.toLowerCase().includes('invalid') || error.message?.toLowerCase().includes('incorrect')) {
          userMessage = 'Email/Số điện thoại hoặc mật khẩu không đúng. Vui lòng kiểm tra lại!'
        } else if (response.status === 400) {
          userMessage = 'Thông tin đăng nhập không hợp lệ. Vui lòng kiểm tra lại!'
        } else if (response.status === 404) {
          userMessage = 'Tài khoản không tồn tại. Vui lòng đăng ký tài khoản mới!'
        }
        
        throw new Error(userMessage)
      }

      const result: AuthResponse = await response.json()
      console.log('✅ Login Success:', { user: result.user })
      
      // Lưu token vào localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, result.accessToken)
        localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, result.refreshToken)
      }

      return result
    } catch (error) {
      console.error('❌ Login Error:', error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Có lỗi xảy ra khi đăng nhập')
    }
  }

  // Đăng ký
  static async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      console.log('🔵 Register Request:', {
        url: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REGISTER}`,
        data: { ...data, password: '***', confirmPassword: '***' }
      })

      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REGISTER}`,
        {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(data),
        }
      )

      console.log('🔵 Register Response Status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Register Error Response:', errorText)
        
        let error: ApiError
        try {
          error = JSON.parse(errorText)
        } catch {
          error = { message: errorText || 'Đăng ký thất bại', statusCode: response.status }
        }
        
        // Tùy chỉnh thông báo lỗi thân thiện
        let userMessage = error.message || 'Đăng ký thất bại'
        if (response.status === 409 || error.message?.toLowerCase().includes('exist') || 
            error.message?.toLowerCase().includes('duplicate')) {
          userMessage = 'Email hoặc số điện thoại đã được sử dụng. Vui lòng thử email/số điện thoại khác!'
        } else if (response.status === 400) {
          userMessage = 'Thông tin đăng ký không hợp lệ. Vui lòng kiểm tra lại!'
        }
        
        throw new Error(userMessage)
      }

      const result: AuthResponse = await response.json()
      console.log('✅ Register Success:', { user: result.user })
      
      // Lưu token vào localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, result.accessToken)
        localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, result.refreshToken)
      }

      return result
    } catch (error) {
      console.error('❌ Register Error:', error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Có lỗi xảy ra khi đăng ký')
    }
  }

  // Làm mới token
  static async refreshToken(): Promise<AuthResponse> {
    try {
      const refreshToken = typeof window !== 'undefined' 
        ? localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN)
        : null

      if (!refreshToken) {
        throw new Error('Không tìm thấy refresh token')
      }

      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REFRESH}`,
        {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify({ refreshToken }),
        }
      )

      if (!response.ok) {
        const error: ApiError = await response.json()
        throw new Error(error.message || 'Làm mới token thất bại')
      }

      const result: AuthResponse = await response.json()
      
      // Cập nhật token mới
      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, result.accessToken)
        localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, result.refreshToken)
      }

      return result
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
      const accessToken = typeof window !== 'undefined'
        ? localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN)
        : null

      if (accessToken) {
        await fetch(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGOUT}`,
          {
            method: 'POST',
            headers: {
              ...this.getHeaders(),
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        )
      }
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
