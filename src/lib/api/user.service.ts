import { API_CONFIG, TOKEN_KEYS } from './config'

// Types cho User API
export interface User {
  id: string
  email: string
  phone?: string | null
  phoneNumber?: string | null
  fullName?: string | null
  avatar?: string | null
  accountType: 'CUSTOMER' | 'WORKER'
  createdAt: string
  updatedAt?: string
}

export interface UpdateUserRequest {
  fullName?: string
  phone?: string
  avatar?: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

// User Service
export class UserService {
  private static getHeaders() {
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN)
      : null

    return {
      ...API_CONFIG.HEADERS,
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  }

  // Lấy thông tin user hiện tại
  static async getCurrentUser(): Promise<User> {
    try {
      console.log('🔵 Get Current User Request')

      const response = await fetch(
        '/api/profile/me',
        {
          method: 'GET',
          headers: this.getHeaders(),
        }
      )

      console.log('🔵 Get User Response Status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Get User Error:', errorText)
        throw new Error('Không thể lấy thông tin người dùng')
      }

      const result = await response.json()
      console.log('✅ Get User Success:', result)
      
      return result.data || result
    } catch (error) {
      console.error('❌ Get User Error:', error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Có lỗi xảy ra khi lấy thông tin người dùng')
    }
  }

  // Cập nhật thông tin user
  static async updateUser(data: UpdateUserRequest): Promise<User> {
    try {
      console.log('🔵 Update User Request:', data)

      const response = await fetch(
        '/api/profile/me',
        {
          method: 'PATCH',
          headers: this.getHeaders(),
          body: JSON.stringify(data),
        }
      )

      console.log('🔵 Update User Response Status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Update User Error:', errorText)
        throw new Error('Không thể cập nhật thông tin')
      }

      const result = await response.json()
      console.log('✅ Update User Success:', result)
      
      return result.data || result
    } catch (error) {
      console.error('❌ Update User Error:', error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Có lỗi xảy ra khi cập nhật thông tin')
    }
  }

  // Đổi mật khẩu
  static async changePassword(data: ChangePasswordRequest): Promise<void> {
    try {
      console.log('🔵 Change Password Request')

      const response = await fetch(
        `${API_CONFIG.BASE_URL}/users/change-password`,
        {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(data),
        }
      )

      console.log('🔵 Change Password Response Status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Change Password Error:', errorText)
        
        let error
        try {
          error = JSON.parse(errorText)
        } catch {
          error = { message: errorText || 'Đổi mật khẩu thất bại' }
        }
        
        throw new Error(error.message || 'Đổi mật khẩu thất bại')
      }

      console.log('✅ Change Password Success')
    } catch (error) {
      console.error('❌ Change Password Error:', error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Có lỗi xảy ra khi đổi mật khẩu')
    }
  }
}
