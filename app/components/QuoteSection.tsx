'use client'

import { useState, useEffect } from 'react'
import { quoteService, type Quote } from '@/lib/api/quote.service'
import { chatService } from '@/lib/api/chat.service'
import { useRouter } from 'next/navigation'

interface QuoteSectionProps {
  postId: string
  isPostOwner: boolean
}

export default function QuoteSection({ postId, isPostOwner }: QuoteSectionProps) {
  const router = useRouter()
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(false)
  const [showQuoteForm, setShowQuoteForm] = useState(false)
  const [quoteForm, setQuoteForm] = useState({
    price: '',
    description: '',
    estimatedDuration: ''  // Nhập số phút
  })

  useEffect(() => {
    if (isPostOwner) {
      loadQuotes()
    }
  }, [postId, isPostOwner])

  const loadQuotes = async () => {
    try {
      setLoading(true)
      const data = await quoteService.getQuotesByPostId(postId)
      setQuotes(data)
    } catch (err) {
      console.error('Error loading quotes:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateQuote = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      console.log('Submitting quote for post:', postId)
      const result = await quoteService.createQuote({
        postId,
        price: parseFloat(quoteForm.price),
        description: quoteForm.description,
        estimatedDuration: quoteForm.estimatedDuration ? parseInt(quoteForm.estimatedDuration) : undefined
      })
      
      console.log('Quote created:', result)
      setShowQuoteForm(false)
      setQuoteForm({ price: '', description: '', estimatedDuration: '' })
      alert('Đã gửi báo giá thành công!')
      // Tải lại danh sách báo giá nếu là chủ bài đăng
      if (isPostOwner) {
        loadQuotes()
      }
    } catch (err: any) {
      console.error('Failed to create quote:', err)
      alert(err.message || 'Không thể gửi báo giá. Vui lòng kiểm tra console để xem chi tiết lỗi.')
    }
  }

  const handleAcceptQuote = async (quoteId: string) => {
    if (!confirm('Bạn muốn chấp nhận báo giá này để mở chat?')) return
    
    try {
      const response = await quoteService.acceptQuoteForChat(quoteId)
      alert('Đã chấp nhận báo giá! Chuyển đến chat...')
      router.push('/tin-nhan')
    } catch (err: any) {
      alert(err.message || 'Không thể chấp nhận báo giá')
    }
  }

  const handleRejectQuote = async (quoteId: string) => {
    const reason = prompt('Lý do từ chối:')
    if (!reason) return
    
    try {
      await quoteService.rejectQuote(quoteId, reason)
      loadQuotes()
    } catch (err: any) {
      alert(err.message || 'Không thể từ chối báo giá')
    }
  }

  const handleRequestOrder = async (quoteId: string) => {
    if (!confirm('Bạn muốn đặt đơn với báo giá này?')) return
    
    try {
      const response = await quoteService.requestOrder(quoteId)
      alert('Đã gửi yêu cầu đặt đơn thành công!')
      router.push('/don-hang')
    } catch (err: any) {
      alert(err.message || 'Không thể đặt đơn')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      case 'IN_CHAT':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Đang chờ'
      case 'ACCEPTED':
        return 'Đã chấp nhận'
      case 'REJECTED':
        return 'Đã từ chối'
      case 'IN_CHAT':
        return 'Đang trao đổi'
      default:
        return status
    }
  }

  // Nếu không phải chủ bài đăng, hiển thị nút báo giá
  if (!isPostOwner) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 mt-4">
        <h3 className="font-bold text-lg mb-3">💰 Báo giá</h3>
        
        {!showQuoteForm ? (
          <button
            onClick={() => setShowQuoteForm(true)}
            className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium"
          >
            Gửi báo giá cho công việc này
          </button>
        ) : (
          <form onSubmit={handleCreateQuote} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá đề xuất (VNĐ) *
              </label>
              <input
                type="number"
                required
                value={quoteForm.price}
                onChange={(e) => setQuoteForm({...quoteForm, price: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="VD: 500000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả chi tiết *
              </label>
              <textarea
                required
                value={quoteForm.description}
                onChange={(e) => setQuoteForm({...quoteForm, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                rows={3}
                placeholder="Mô tả chi tiết về dịch vụ bạn cung cấp..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thời gian dự kiến (phút) - Tùy chọn
              </label>
              <input
                type="number"
                min="1"
                value={quoteForm.estimatedDuration}
                onChange={(e) => setQuoteForm({...quoteForm, estimatedDuration: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="VD: 120 (2 giờ) - Có thể bỏ trống"
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="flex-1 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium"
              >
                Gửi báo giá
              </button>
              <button
                type="button"
                onClick={() => setShowQuoteForm(false)}
                className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium"
              >
                Hủy
              </button>
            </div>
          </form>
        )}
      </div>
    )
  }

  // Nếu là chủ bài đăng, hiển thị danh sách báo giá
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mt-4">
      <h3 className="font-bold text-lg mb-3">💰 Các báo giá ({quotes.length})</h3>
      
      {loading ? (
        <p className="text-center text-gray-500 py-4">Đang tải...</p>
      ) : quotes.length === 0 ? (
        <p className="text-center text-gray-500 py-4">Chưa có báo giá nào</p>
      ) : (
        <div className="space-y-3">
          {quotes.map((quote) => (
            <div key={quote.id} className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    {quote.providerAvatar || '🔧'}
                  </div>
                  <div>
                    <p className="font-medium">{quote.providerName || 'Thợ'}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(quote.status)}`}>
                      {getStatusText(quote.status)}
                    </span>
                  </div>
                </div>
                <p className="text-lg font-bold text-orange-600">
                  {quote.price.toLocaleString('vi-VN')}đ
                </p>
              </div>
              
              <p className="text-sm text-gray-700 mb-2">{quote.description}</p>
              
              {quote.estimatedDuration && (
                <p className="text-xs text-gray-500 mb-2">
                  ⏱️ Thời gian dự kiến: {
                    quote.estimatedDuration >= 60 
                      ? `${Math.floor(quote.estimatedDuration / 60)} giờ ${quote.estimatedDuration % 60 > 0 ? `${quote.estimatedDuration % 60} phút` : ''}`
                      : `${quote.estimatedDuration} phút`
                  }
                </p>
              )}
              
              <p className="text-xs text-gray-400 mb-3">
                {new Date(quote.createdAt).toLocaleDateString('vi-VN')}
              </p>
              
              {quote.status === 'PENDING' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAcceptQuote(quote.id)}
                    className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
                  >
                    Chấp nhận & Mở chat
                  </button>
                  <button
                    onClick={() => handleRejectQuote(quote.id)}
                    className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium"
                  >
                    Từ chối
                  </button>
                </div>
              )}
              
              {quote.status === 'IN_CHAT' && (
                <button
                  onClick={() => handleRequestOrder(quote.id)}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                >
                  Đặt đơn ngay
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
