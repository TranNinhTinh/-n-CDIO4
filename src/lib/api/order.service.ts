// src/lib/api/order.service.ts
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

export interface Order {
  id: string
  orderNumber: string
  quoteId: string
  postId: string
  customerId: string
  providerId: string
  customerName?: string
  providerName?: string
  price: number
  description: string
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'PROVIDER_COMPLETED' | 'COMPLETED' | 'CANCELLED'
  providerCompletedAt?: string
  customerCompletedAt?: string
  createdAt: string
  updatedAt: string
}

export interface OrderStats {
  total: number
  pending: number
  inProgress: number
  completed: number
  cancelled: number
  totalRevenue?: number
}

export interface ConfirmOrderRequest {
  estimatedCompletionDate?: string
  notes?: string
}

class OrderService {
  /**
   * [Provider] Xác nhận làm → Tạo order
   */
  async confirmFromQuote(quoteId: string, data?: ConfirmOrderRequest): Promise<Order> {
    console.log('📦 [OrderService] Confirming order from quote:', quoteId)
    
    const response = await authenticatedFetch(`/api/orders/confirm-from-quote/${quoteId}`, {
      method: 'POST',
      body: JSON.stringify(data || {})
    })
    
    if (!response.ok) {
      const error = await response.json()
      console.error('❌ [OrderService] Confirm order error:', error)
      throw new Error(error.error || 'Failed to confirm order')
    }
    
    const result = await response.json()
    console.log('✅ [OrderService] Order confirmed:', result)
    return result
  }

  /**
   * [Provider] Thợ xác nhận hoàn thành
   */
  async providerComplete(orderId: string, notes?: string): Promise<Order> {
    const response = await authenticatedFetch(`/api/orders/${orderId}/provider-complete`, {
      method: 'POST',
      body: JSON.stringify({ notes })
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to complete order')
    }
    
    return response.json()
  }

  /**
   * [Customer] Khách hàng xác nhận hoàn thành (finalize)
   */
  async customerComplete(orderId: string, rating?: number, review?: string): Promise<Order> {
    const response = await authenticatedFetch(`/api/orders/${orderId}/customer-complete`, {
      method: 'POST',
      body: JSON.stringify({ rating, review })
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to complete order')
    }
    
    return response.json()
  }

  /**
   * Lấy danh sách đơn hàng của tôi
   */
  async getOrders(params?: {
    status?: string
    role?: 'customer' | 'provider'
    limit?: number
    cursor?: string
  }): Promise<{
    data: Order[]
    nextCursor?: string
    hasMore: boolean
    total: number
  }> {
    const queryParams = new URLSearchParams()
    if (params?.status) queryParams.append('status', params.status)
    if (params?.role) queryParams.append('role', params.role)
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.cursor) queryParams.append('cursor', params.cursor)

    const response = await authenticatedFetch(`/api/orders?${queryParams.toString()}`, {
      method: 'GET'
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to get orders')
    }
    
    return response.json()
  }

  /**
   * Thống kê đơn hàng
   */
  async getStats(): Promise<OrderStats> {
    const response = await authenticatedFetch('/api/orders/stats', {
      method: 'GET'
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to get stats')
    }
    
    return response.json()
  }

  /**
   * Xem chi tiết đơn hàng
   */
  async getOrderById(orderId: string): Promise<Order> {
    const response = await authenticatedFetch(`/api/orders/${orderId}`, {
      method: 'GET'
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to get order')
    }
    
    return response.json()
  }

  /**
   * Xem đơn hàng theo mã số
   */
  async getOrderByNumber(orderNumber: string): Promise<Order> {
    const response = await authenticatedFetch(`/api/orders/number/${orderNumber}`, {
      method: 'GET'
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to get order')
    }
    
    return response.json()
  }

  /**
   * Hủy đơn hàng
   */
  async cancelOrder(orderId: string, reason?: string): Promise<Order> {
    const response = await authenticatedFetch(`/api/orders/${orderId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to cancel order')
    }
    
    return response.json()
  }
}

export const orderService = new OrderService()
