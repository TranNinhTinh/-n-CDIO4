'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthService } from '@/lib/api/auth.service'
import { orderService, type Order, type OrderStats } from '@/lib/api/order.service'

export default function DonHangPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<OrderStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [roleFilter, setRoleFilter] = useState<'customer' | 'provider' | ''>('')

  useEffect(() => {
    const token = AuthService.getToken()
    if (!token) {
      router.push('/dang-nhap')
      return
    }

    fetchOrders()
    fetchStats()
  }, [router, statusFilter, roleFilter])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await orderService.getOrders({
        status: statusFilter || undefined,
        role: roleFilter || undefined,
        limit: 50
      })
      setOrders(response.data)
    } catch (err: any) {
      console.error('Error fetching orders:', err)
      setError('Không thể tải đơn hàng')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await orderService.getStats()
      setStats(response)
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }

  const handleProviderComplete = async (orderId: string) => {
    if (!confirm('Bạn đã hoàn thành công việc này?')) return
    
    try {
      await orderService.providerComplete(orderId)
      fetchOrders()
      fetchStats()
    } catch (err) {
      console.error('Error completing order:', err)
      alert('Không thể hoàn thành đơn hàng')
    }
  }

  const handleCustomerComplete = async (orderId: string) => {
    const rating = prompt('Đánh giá từ 1-5 sao:')
    if (!rating) return

    const review = prompt('Nhận xét của bạn:')
    
    try {
      await orderService.customerComplete(orderId, parseInt(rating), review || '')
      fetchOrders()
      fetchStats()
    } catch (err) {
      console.error('Error completing order:', err)
      alert('Không thể hoàn thành đơn hàng')
    }
  }

  const handleCancelOrder = async (orderId: string) => {
    const reason = prompt('Lý do hủy đơn:')
    if (!reason) return
    
    try {
      await orderService.cancelOrder(orderId, reason)
      fetchOrders()
      fetchStats()
    } catch (err) {
      console.error('Error canceling order:', err)
      alert('Không thể hủy đơn hàng')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800'
      case 'IN_PROGRESS':
        return 'bg-purple-100 text-purple-800'
      case 'PROVIDER_COMPLETED':
        return 'bg-orange-100 text-orange-800'
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Đang chờ'
      case 'CONFIRMED':
        return 'Đã xác nhận'
      case 'IN_PROGRESS':
        return 'Đang thực hiện'
      case 'PROVIDER_COMPLETED':
        return 'Thợ đã hoàn thành'
      case 'COMPLETED':
        return 'Hoàn thành'
      case 'CANCELLED':
        return 'Đã hủy'
      default:
        return status
    }
  }

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải đơn hàng...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold">Quản lý đơn hàng</h1>
            </div>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Tổng đơn</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3">
                <p className="text-xs text-yellow-600 mb-1">Đang chờ</p>
                <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <p className="text-xs text-purple-600 mb-1">Đang làm</p>
                <p className="text-2xl font-bold text-purple-700">{stats.inProgress}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xs text-green-600 mb-1">Hoàn thành</p>
                <p className="text-2xl font-bold text-green-700">{stats.completed}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-3">
                <p className="text-xs text-red-600 mb-1">Đã hủy</p>
                <p className="text-2xl font-bold text-red-700">{stats.cancelled}</p>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            <button
              onClick={() => setStatusFilter('')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                statusFilter === '' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setStatusFilter('PENDING')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                statusFilter === 'PENDING' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Đang chờ
            </button>
            <button
              onClick={() => setStatusFilter('IN_PROGRESS')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                statusFilter === 'IN_PROGRESS' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Đang làm
            </button>
            <button
              onClick={() => setStatusFilter('COMPLETED')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                statusFilter === 'COMPLETED' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Hoàn thành
            </button>
          </div>

          <div className="flex space-x-2 mt-2">
            <button
              onClick={() => setRoleFilter('')}
              className={`px-4 py-2 rounded-lg text-sm ${
                roleFilter === '' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Tất cả vai trò
            </button>
            <button
              onClick={() => setRoleFilter('customer')}
              className={`px-4 py-2 rounded-lg text-sm ${
                roleFilter === 'customer' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Khách hàng
            </button>
            <button
              onClick={() => setRoleFilter('provider')}
              className={`px-4 py-2 rounded-lg text-sm ${
                roleFilter === 'provider' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Thợ
            </button>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có đơn hàng</h3>
            <p className="text-gray-500">Các đơn hàng của bạn sẽ xuất hiện ở đây</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-bold text-gray-900">#{order.orderNumber}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{order.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>👤 {order.customerName || 'Khách hàng'}</span>
                        <span>🔧 {order.providerName || 'Thợ'}</span>
                        <span>📅 {new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-lg font-bold text-orange-600">
                        {order.price.toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 mt-3 pt-3 border-t">
                    <button
                      onClick={() => router.push(`/don-hang/${order.id}`)}
                      className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
                    >
                      Xem chi tiết
                    </button>
                    
                    {order.status === 'CONFIRMED' && roleFilter === 'provider' && (
                      <button
                        onClick={() => handleProviderComplete(order.id)}
                        className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
                      >
                        Hoàn thành
                      </button>
                    )}
                    
                    {order.status === 'PROVIDER_COMPLETED' && roleFilter === 'customer' && (
                      <button
                        onClick={() => handleCustomerComplete(order.id)}
                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                      >
                        Xác nhận & Đánh giá
                      </button>
                    )}
                    
                    {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium"
                      >
                        Hủy
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-10">
        <div className="max-w-md mx-auto flex justify-around">
          <button onClick={() => router.push('/home')} className="flex flex-col items-center p-2 text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs mt-1">Trang chủ</span>
          </button>
          <button onClick={() => router.push('/tin-nhan')} className="flex flex-col items-center p-2 text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-xs mt-1">Tin nhắn</span>
          </button>
          <button className="flex flex-col items-center p-2 text-orange-600">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            <span className="text-xs mt-1">Đơn hàng</span>
          </button>
          <button onClick={() => router.push('/profile')} className="flex flex-col items-center p-2 text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs mt-1">Cá nhân</span>
          </button>
        </div>
      </div>
    </div>
  )
}
