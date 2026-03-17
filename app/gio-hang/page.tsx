'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AuthService } from '@/lib/api/auth.service'
import { quoteService, type Quote } from '@/lib/api/quote.service'
import { orderService } from '@/lib/api/order.service'

export default function GioHangPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [error, setError] = useState('')

  // Kiểm tra authentication và load quotes đã chấp nhận
  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      router.push('/dang-nhap')
      return
    }
    
    loadAcceptedQuotes()
  }, [router])

  const loadAcceptedQuotes = async () => {
    try {
      setIsLoading(true)
      // Load các quote đã chấp nhận (status = ACCEPTED hoặc IN_CHAT)
      const allQuotes = await quoteService.getMyQuotes({ limit: 50 })
      const acceptedQuotes = allQuotes.filter((q: Quote) => 
        q.status === 'ACCEPTED' || q.status === 'IN_CHAT'
      )
      setQuotes(acceptedQuotes)
    } catch (err: any) {
      console.error('Error loading quotes:', err)
      setError('Không thể tải danh sách báo giá')
    } finally {
      setIsLoading(false)
    }
  }
      avatarColor: 'bg-blue-500'
    },
    {
      id: 3,
      serviceName: 'Làm tủ bếp',
      workerName: 'Thợ Mộc Tuấn',
      price: 3500000,
      date: '25/11/2025',
      time: '08:00',
      location: 'Sơn Trà, Đà Nẵng',
      status: 'pending',
      description: 'Làm tủ bếp gỗ công nghiệp cao cấp, thiết kế hiện đại.',
      avatar: '🔨',
      avatarColor: 'bg-yellow-600'
    }
  ])

  // Xóa item khỏi giỏ hàng
  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id))
  }

  // Tính tổng tiền
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price, 0)

  // Phí dịch vụ (3%)
  const serviceFee = Math.round(totalAmount * 0.03)

  // Tổng thanh toán
  const finalAmount = totalAmount + serviceFee

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/home" className="text-gray-600 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Giỏ hàng của bạn</h1>
            </div>
            <Link href="/home">
              <Image
                src="/logo.png"
                alt="Thợ Tốt"
                width={80}
                height={63}
                className="object-contain"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cartItems.length === 0 ? (
          // Giỏ hàng trống
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Giỏ hàng trống</h2>
            <p className="text-gray-500 mb-6">Bạn chưa có yêu cầu nào đang chờ xử lý</p>
            <Link 
              href="/home"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Tìm kiếm dịch vụ
            </Link>
          </div>
        ) : (
          // Giỏ hàng có sản phẩm
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Danh sách items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Yêu cầu đang xử lý ({cartItems.length})
                </h2>
              </div>

              {cartItems.map(item => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
                  <div className="flex items-start space-x-4">
                    {/* Avatar */}
                    <div className={`w-16 h-16 ${item.avatarColor} rounded-lg flex items-center justify-center text-3xl flex-shrink-0`}>
                      {item.avatar}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{item.serviceName}</h3>
                          <p className="text-sm text-gray-600">{item.workerName}</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition"
                          title="Xóa"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      {/* Status */}
                      <div className="mb-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === 'confirmed' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {item.status === 'confirmed' ? '✓ Đã xác nhận' : '⏳ Chờ xác nhận'}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-3">{item.description}</p>

                      {/* Details */}
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{item.date} lúc {item.time}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          <span>{item.location}</span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Giá dịch vụ:</span>
                          <span className="text-xl font-bold text-blue-600">
                            {item.price.toLocaleString('vi-VN')}đ
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-4 flex items-center space-x-3">
                        <button className="flex-1 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition text-sm font-medium">
                          Liên hệ thợ
                        </button>
                        <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                          Xem chi tiết
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Thanh toán */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Tóm tắt đơn hàng</h2>

                {/* Chi tiết giá */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tạm tính ({cartItems.length} dịch vụ)</span>
                    <span className="text-gray-900 font-medium">{totalAmount.toLocaleString('vi-VN')}đ</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phí dịch vụ (3%)</span>
                    <span className="text-gray-900 font-medium">{serviceFee.toLocaleString('vi-VN')}đ</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-base font-semibold text-gray-900">Tổng cộng</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {finalAmount.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mã giảm giá */}
                <div className="mb-6">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Nhập mã giảm giá"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    />
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm font-medium">
                      Áp dụng
                    </button>
                  </div>
                </div>

                {/* Nút thanh toán */}
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold text-base mb-4">
                  Xác nhận đặt dịch vụ
                </button>

                {/* Thông tin bổ sung */}
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex items-start space-x-2 text-xs text-gray-600">
                    <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Thanh toán sau khi hoàn thành công việc</span>
                  </div>
                  <div className="flex items-start space-x-2 text-xs text-gray-600">
                    <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Được hỗ trợ 24/7</span>
                  </div>
                  <div className="flex items-start space-x-2 text-xs text-gray-600">
                    <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Bảo hành chất lượng dịch vụ</span>
                  </div>
                </div>

                {/* Phương thức thanh toán */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-600 mb-3 font-medium">Phương thức thanh toán:</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded">
                      <span className="text-lg">💵</span>
                    </div>
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded">
                      <span className="text-lg">💳</span>
                    </div>
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded">
                      <span className="text-lg">🏦</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
