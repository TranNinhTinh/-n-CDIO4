// src/lib/api/notification.service.ts
import { AuthService } from './auth.service'

// Helper function để xử lý fetch với authentication
async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = AuthService.getToken()
  
  if (!token) {
    console.error('❌ No token found')
    AuthService.handleTokenExpired()
    throw new Error('Vui lòng đăng nhập để tiếp tục')
  }
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  
  // Xử lý lỗi 401 - Token invalid/expired
  if (response.status === 401) {
    console.error('❌ Token invalid - redirecting to login')
    AuthService.handleTokenExpired()
    throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!')
  }
  
  return response
}

export interface Notification {
  id: string
  userId: string
  type: string
  title: string
  message: string
  data?: any
  isRead: boolean
  createdAt: string
  updatedAt: string
}

export interface NotificationsResponse {
  data: Notification[]
  nextCursor?: string
  hasMore: boolean
  total: number
}

export interface UnreadCountResponse {
  unreadCount: number
}

class NotificationService {
  /**
   * Lấy danh sách thông báo
   */
  async getNotifications(params?: {
    limit?: number
    cursor?: string
  }): Promise<NotificationsResponse> {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.cursor) queryParams.append('cursor', params.cursor)

    console.log('📬 Calling notifications API:', `/api/notifications?${queryParams.toString()}`)
    
    const response = await authenticatedFetch(`/api/notifications?${queryParams.toString()}`, {
      method: 'GET'
    })
    
    if (!response.ok) {
      const error = await response.json()
      console.error('❌ Get notifications error:', error)
      throw new Error(error.error || 'Failed to fetch notifications')
    }
    
    const result = await response.json()
    console.log('📬 Notifications service result:', result)
    console.log('📬 Result type:', typeof result)
    console.log('📬 Result is array:', Array.isArray(result))
    console.log('📬 Result.data:', result.data)
    console.log('📬 Result keys:', Object.keys(result))
    return result
  }

  /**
   * Đếm số thông báo chưa đọc
   */
  async getUnreadCount(): Promise<UnreadCountResponse> {
    const response = await authenticatedFetch('/api/notifications/unread-count', {
      method: 'GET'
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch unread count')
    }
    
    return response.json()
  }

  /**
   * Đánh dấu thông báo đã đọc
   */
  async markAsRead(notificationId: string): Promise<{ message: string }> {
    const response = await authenticatedFetch(`/api/notifications/${notificationId}/read`, {
      method: 'POST'
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to mark as read')
    }
    
    return response.json()
  }

  /**
   * Đánh dấu tất cả thông báo đã đọc
   */
  async markAllAsRead(): Promise<{ message: string }> {
    const response = await authenticatedFetch('/api/notifications/mark-all-read', {
      method: 'POST'
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to mark all as read')
    }
    
    return response.json()
  }

  /**
   * Xóa một thông báo
   */
  async deleteNotification(notificationId: string): Promise<{ message: string }> {
    const response = await authenticatedFetch(`/api/notifications/${notificationId}`, {
      method: 'DELETE'
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to delete notification')
    }
    
    return response.json()
  }

  /**
   * Xóa tất cả thông báo đã đọc
   */
  async deleteAllRead(): Promise<{ message: string }> {
    const response = await authenticatedFetch('/api/notifications/read', {
      method: 'DELETE'
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to delete all read')
    }
    
    return response.json()
  }
}

export const notificationService = new NotificationService()
