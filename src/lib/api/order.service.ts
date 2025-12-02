// src/lib/api/order.service.ts
import { apiClient } from './client'

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
    const response = await apiClient.post(`/orders/confirm-from-quote/${quoteId}`, data)
    return response.data
  }

  /**
   * [Provider] Thợ xác nhận hoàn thành
   */
  async providerComplete(orderId: string, notes?: string): Promise<Order> {
    const response = await apiClient.post(`/orders/${orderId}/provider-complete`, { notes })
    return response.data
  }

  /**
   * [Customer] Khách hàng xác nhận hoàn thành (finalize)
   */
  async customerComplete(orderId: string, rating?: number, review?: string): Promise<Order> {
    const response = await apiClient.post(`/orders/${orderId}/customer-complete`, { 
      rating, 
      review 
    })
    return response.data
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

    const response = await apiClient.get(`/orders?${queryParams.toString()}`)
    return response.data
  }

  /**
   * Thống kê đơn hàng
   */
  async getStats(): Promise<OrderStats> {
    const response = await apiClient.get('/orders/stats')
    return response.data
  }

  /**
   * Xem chi tiết đơn hàng
   */
  async getOrderById(orderId: string): Promise<Order> {
    const response = await apiClient.get(`/orders/${orderId}`)
    return response.data
  }

  /**
   * Xem đơn hàng theo mã số
   */
  async getOrderByNumber(orderNumber: string): Promise<Order> {
    const response = await apiClient.get(`/orders/number/${orderNumber}`)
    return response.data
  }

  /**
   * Hủy đơn hàng
   */
  async cancelOrder(orderId: string, reason?: string): Promise<Order> {
    const response = await apiClient.post(`/orders/${orderId}/cancel`, { reason })
    return response.data
  }
}

export const orderService = new OrderService()
