'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthService } from '@/lib/api/auth.service'
import { notificationService, type Notification } from '@/lib/api/notification.service'
import { socketService } from '@/lib/api/socket.service'
import { quoteService, type Quote } from '@/lib/api/quote.service'
import { ProfileService } from '@/lib/api/profile.service'
import { chatService } from '@/lib/api/chat.service'
import { orderService } from '@/lib/api/order.service'

export default function ThongBaoPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [unreadCount, setUnreadCount] = useState(0)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  
  // Modal state cho báo giá
  const [showQuoteModal, setShowQuoteModal] = useState(false)
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)
  const [quoteLoading, setQuoteLoading] = useState(false)
  const [quotes, setQuotes] = useState<Quote[]>([])

  useEffect(() => {
    const token = AuthService.getToken()
    if (!token) {
      router.push('/dang-nhap')
      return
    }

    fetchNotifications()
    fetchUnreadCount()

    // Kết nối socket để nhận notifications real-time
    socketService.connect()

    // Lắng nghe notification mới
    const unsubscribeNew = socketService.on('notification:new', (notification: Notification) => {
      console.log('🔔 Received new notification via socket:', notification)
      
      // Thêm notification mới vào đầu danh sách
      setNotifications(prev => [notification, ...prev])
      
      // Tăng unread count
      setUnreadCount(prev => prev + 1)
      
      // Hiển thị browser notification (nếu được phép)
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/logo.png'
        })
      }
    })

    // Lắng nghe khi notification được đánh dấu đã đọc
    const unsubscribeRead = socketService.on('notification:read', (data: { notificationId: string }) => {
      console.log('✓ Notification marked as read via socket:', data.notificationId)
      
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === data.notificationId ? { ...notif, isRead: true } : notif
        )
      )
    })

    // Lắng nghe khi tất cả notification được đánh dấu đã đọc
    const unsubscribeAllRead = socketService.on('notification:all_read', () => {
      console.log('✓ All notifications marked as read via socket')
      
      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })))
      setUnreadCount(0)
    })

    // Yêu cầu quyền browser notification
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('Browser notification permission:', permission)
      })
    }

    // Cleanup
    return () => {
      unsubscribeNew()
      unsubscribeRead()
      unsubscribeAllRead()
      // Không disconnect socket ở đây vì có thể dùng ở trang khác
    }
  }, [router])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await notificationService.getNotifications({ limit: 50 })
      console.log('📬 Notifications response:', response)
      console.log('📬 Notifications data:', response.data)
      console.log('📬 Notifications count:', response.data?.length)
      
      // Xử lý cả 2 trường hợp: response.data hoặc response là array trực tiếp
      let notificationsArray: Notification[] = []
      if (Array.isArray(response)) {
        // Backend trả về array trực tiếp
        notificationsArray = response
      } else if (response.data && Array.isArray(response.data)) {
        // Backend trả về { data: [...] }
        notificationsArray = response.data
      } else if (response.notifications && Array.isArray(response.notifications)) {
        // Backend có thể dùng key "notifications"
        notificationsArray = response.notifications
      }
      
      console.log('📬 Final notifications array:', notificationsArray)
      console.log('📬 Notifications length:', notificationsArray.length)
      setNotifications(notificationsArray)
    } catch (err: any) {
      console.error('❌ Error fetching notifications:', err)
      setError('Không thể tải thông báo')
    } finally {
      setLoading(false)
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount()
      setUnreadCount(response.unreadCount)
    } catch (err) {
      console.error('Error fetching unread count:', err)
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId)
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      )
      fetchUnreadCount()
    } catch (err) {
      console.error('Error marking as read:', err)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead()
      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })))
      setUnreadCount(0)
    } catch (err) {
      console.error('Error marking all as read:', err)
    }
  }

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId)
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId))
      fetchUnreadCount()
    } catch (err) {
      console.error('Error deleting notification:', err)
    }
  }

  const handleDeleteAllRead = async () => {
    const readNotifications = notifications.filter(n => n.isRead)
    const readCount = readNotifications.length
    
    console.log('🗑️ handleDeleteAllRead called')
    console.log('🗑️ Total notifications:', notifications.length)
    console.log('🗑️ Read count:', readCount)
    console.log('🗑️ Read notifications:', readNotifications.map(n => ({ id: n.id, title: n.title, isRead: n.isRead })))
    
    if (readCount === 0) {
      alert('Không có thông báo đã đọc nào để xóa')
      return
    }
    
    if (!confirm(`Bạn có chắc muốn xóa ${readCount} thông báo đã đọc không?\n\nHành động này không thể hoàn tác.`)) {
      console.log('🗑️ User cancelled deletion')
      return
    }
    
    try {
      console.log('🗑️ Starting deletion process...')
      console.log('🗑️ Method: Delete each notification individually')
      
      // Xóa từng thông báo đã đọc
      let successCount = 0
      let errorCount = 0
      
      for (const notification of readNotifications) {
        try {
          console.log(`🗑️ Deleting notification ${notification.id}...`)
          await notificationService.deleteNotification(notification.id)
          successCount++
          console.log(`✅ Deleted ${successCount}/${readCount}`)
        } catch (err: any) {
          console.error(`❌ Failed to delete ${notification.id}:`, err.message)
          errorCount++
        }
      }
      
      console.log(`🗑️ Deletion complete: ${successCount} success, ${errorCount} failed`)
      
      // Lọc bỏ tất cả notification đã đọc
      setNotifications(prev => prev.filter(notif => !notif.isRead))
      
      // Refresh unread count để đảm bảo đúng
      await fetchUnreadCount()
      
      if (errorCount === 0) {
        console.log('✅ All read notifications deleted successfully')
        alert(`✅ Đã xóa ${successCount} thông báo đã đọc`)
      } else {
        alert(`⚠️ Đã xóa ${successCount}/${readCount} thông báo.\n${errorCount} thông báo không xóa được.`)
      }
    } catch (err: any) {
      console.error('❌ Error deleting read notifications:', err)
      console.error('❌ Error message:', err.message)
      console.error('❌ Error stack:', err.stack)
      alert(`Không thể xóa thông báo: ${err.message}`)
    }
  }

  // Xử lý click vào notification báo giá
  const handleViewQuoteNotification = async (notification: Notification) => {
    console.log('=== CLICK NOTIFICATION ===')
    console.log('🔍 Type:', notification.type)
    console.log('🔍 Title:', notification.title)
    console.log('🔍 Message:', notification.message)
    console.log('🔍 Data object:', notification.data)
    console.log('🔍 Metadata object:', (notification as any).metadata)
    console.log('🔍 Full notification:', JSON.stringify(notification, null, 2))
    
    // Đánh dấu đã đọc
    if (!notification.isRead) {
      await handleMarkAsRead(notification.id)
    }
    
    // Backend gửi data trong field "metadata", KHÔNG phải "data"
    const metadata = (notification as any).metadata || notification.data
    
    let postId = null
    let quoteId = null
    
    if (metadata) {
      console.log('🔍 Found metadata/data:', metadata)
      
      // Lấy postId và quoteId từ metadata
      postId = metadata.postId || metadata.post_id || metadata.postID
      quoteId = metadata.quoteId || metadata.quote_id || metadata.quoteID
      
      console.log('🔍 Extracted postId:', postId)
      console.log('🔍 Extracted quoteId:', quoteId)
    } else {
      console.warn('⚠️ notification.metadata và notification.data đều null/undefined')
    }
    
    if (!postId) {
      console.error('❌ KHÔNG TÌM THẤY postId trong notification')
      alert(
        '⚠️ Thông báo thiếu thông tin bài đăng.\n\n' +
        'Vui lòng vào "Bài đăng của tôi" để xem tất cả báo giá.'
      )
      router.push('/bai-dang-cua-toi')
      return
    }
    
    console.log('✅ PostId found:', postId)
    
    // Load tất cả quotes của post này
    try {
      setQuoteLoading(true)
      console.log('📡 Loading quotes for post:', postId)
      
      const quotesData = await quoteService.getQuotesByPostId(postId)
      console.log('📋 Quotes loaded:', quotesData)
      console.log('📋 Number of quotes:', quotesData.length)
      
      if (quotesData.length === 0) {
        alert('Không tìm thấy báo giá nào cho bài đăng này')
        return
      }
      
      // 🔥 GỌI API LẤY TÊN THẬT CỦA TỪNG PROVIDER
      const enhancedQuotes = await Promise.all(
        quotesData.map(async (quote) => {
          let realProviderName = quote.providerName || null
          let providerAvatar = quote.providerAvatar || null
          let providerEmail = null
          let providerPhone = null
          
          // Nếu có providerId, gọi API lấy profile
          if (quote.providerId) {
            try {
              console.log('🔍 Fetching profile for provider:', quote.providerId)
              const profile = await ProfileService.getUserProfile(quote.providerId)
              console.log('✅ Provider profile:', profile)
              
              // Lấy tên theo thứ tự ưu tiên
              realProviderName = profile.displayName || 
                                profile.fullName || 
                                profile.email?.split('@')[0] ||
                                realProviderName
              providerAvatar = profile.avatar || providerAvatar
              providerEmail = profile.email
              providerPhone = profile.phone
              
              console.log('✅ Real provider name:', realProviderName)
            } catch (error) {
              console.error('❌ Failed to fetch provider profile:', error)
            }
          }
          
          return {
            ...quote,
            providerName: realProviderName,
            providerAvatar,
            providerEmail,
            providerPhone
          }
        })
      )
      
      console.log('✅ Enhanced quotes with real names:', enhancedQuotes)
      setQuotes(enhancedQuotes)
      setShowQuoteModal(true)
    } catch (error: any) {
      console.error('❌ Error loading quotes:', error)
      alert(error.message || 'Không thể tải thông tin báo giá')
    } finally {
      setQuoteLoading(false)
    }
  }
  
  // Chấp nhận báo giá và chuyển đến chat
  const handleAcceptQuote = async (quoteId: string) => {
    try {
      setQuoteLoading(true)
      console.log('\n=== START ACCEPT QUOTE FLOW ===')
      console.log('📤 QuoteId:', quoteId)
      
      // Tìm quote để lấy providerId
      const quote = quotes.find(q => q.id === quoteId)
      console.log('🔍 Quote data:', quote)
      console.log('🔍 ProviderId:', quote?.providerId)
      
      if (!quote || !quote.providerId) {
        throw new Error('Không tìm thấy thông tin người thợ')
      }
      
      // Step 1: Accept quote (backend sẽ thay đổi status thành accepted_for_chat)
      console.log('\n📤 Step 1: Calling acceptQuoteForChat API...')
      let response
      let backendAcceptSuccess = false
      
      try {
        response = await quoteService.acceptQuoteForChat(quoteId)
        console.log('✅ Quote accepted, response:', response)
        
        // Kiểm tra nếu backend accept thành công
        if (response.success !== false) {
          backendAcceptSuccess = true
          console.log('✅ Backend accept thành công')
        } else {
          console.warn('⚠️ Backend accept thất bại, nhưng vẫn tiếp tục tạo conversation')
        }
      } catch (error: any) {
        console.error('❌ Backend accept quote lỗi:', error)
        console.warn('⚠️ Sẽ vẫn tiếp tục tạo conversation để user có thể chat')
        // KHÔNG throw error, vẫn tiếp tục
      }
      
      // Step 2: Tạo conversation với worker (LUÔN TẠO MỚI để đảm bảo có conversation)
      console.log('\n💬 Step 2: Creating conversation with worker...')
      let conversationId = null
      
      try {
        console.log('💬 Calling createDirectConversation with workerId:', quote.providerId)
        const conversation = await chatService.createDirectConversation({
          workerId: quote.providerId
        })
        conversationId = conversation.id
        console.log('✅ Conversation created successfully!')
        console.log('✅ ConversationId:', conversationId)
        console.log('✅ Conversation data:', conversation)
      } catch (error: any) {
        console.error('❌ Failed to create conversation:', error)
        console.error('❌ Error message:', error.message)
        console.error('❌ Error stack:', error.stack)
        
        // KHÔNG throw error, vẫn cho phép user vào trang chat
        // Hoặc conversation đã tồn tại, hoặc sẽ tạo từ trang chat
        console.warn('⚠️ Không tạo được conversation ngay, nhưng vẫn redirect đến chat')
        conversationId = null
      }
      
      // Step 3: Tạo đơn hàng từ báo giá
      console.log('\n📦 Step 3: Creating order from quote...')
      let orderCreated = false
      let orderNumber = null
      
      try {
        console.log('📦 Calling confirmFromQuote API with quoteId:', quoteId)
        const orderResponse = await orderService.confirmFromQuote(quoteId, {
          notes: `Khách hàng đã chấp nhận báo giá ${quote.price.toLocaleString('vi-VN')}đ`
        })
        console.log('✅ Order created successfully:', orderResponse)
        orderCreated = true
        orderNumber = orderResponse.orderNumber
        console.log('✅ Order number:', orderNumber)
      } catch (error: any) {
        console.error('❌ Failed to create order:', error)
        console.error('❌ Error message:', error.message)
        
        if (error.message.includes('400') || error.message.includes('Bad Request')) {
          console.warn('⚠️ Backend chưa hỗ trợ API tạo đơn hàng')
          console.warn('⚠️ Bỏ qua tạo đơn hàng, chỉ tạo conversation để chat')
        } else {
          console.warn('⚠️ Không tạo được đơn hàng, nhưng vẫn tiếp tục')
        }
        // KHÔNG throw error, vẫn cho phép chat và xử lý sau
      }
      
      // Step 4: Gửi tin nhắn đầu tiên cho thợ (nếu có conversationId)
      if (conversationId) {
        console.log('\n📤 Step 4: Sending initial message to worker...')
        try {
          let initialMessage = `Xin chào! Tôi đã chấp nhận báo giá ${quote.price.toLocaleString('vi-VN')}đ của bạn cho công việc "${quote.description}".`
          
          if (orderCreated && orderNumber) {
            initialMessage += `\n\n📦 Đơn hàng #${orderNumber} đã được tạo. Hãy vào trang "Đơn hàng" để xem chi tiết!`
          }
          
          initialMessage += `\n\nChúng ta có thể trao đổi thêm không?`
          
          console.log('📤 Sending message:', initialMessage)
          
          await chatService.sendMessage(conversationId, {
            content: initialMessage
          })
          
          console.log('✅ Initial message sent successfully!')
        } catch (error: any) {
          console.error('❌ Failed to send initial message:', error)
          console.warn('⚠️ Không gửi được tin nhắn đầu tiên, nhưng vẫn tiếp tục')
          // KHÔNG throw error, vẫn redirect đến chat
        }
      }
      
      console.log('\n✅ === ACCEPT QUOTE FLOW COMPLETED ===')
      console.log('✅ Backend accept:', backendAcceptSuccess ? 'Success' : 'Failed but continued')
      console.log('✅ Order created:', orderCreated ? `Yes (${orderNumber})` : 'No')
      console.log('✅ ConversationId:', conversationId || 'Will load from chat page')
      console.log('✅ Redirecting to chat...')
      
      // Đóng modal trước khi redirect
      setShowQuoteModal(false)
      setSelectedQuote(null)
      
      // Thông báo thành công
      let message = '✅ Đã chấp nhận báo giá!\n\n'
      
      if (orderCreated && orderNumber) {
        message += `📦 Đơn hàng #${orderNumber} đã được tạo!\n`
        message += '👉 Bạn và người thợ đều có thể xem đơn hàng trong trang "Đơn hàng"\n\n'
      } else {
        message += '⚠️ Lưu ý: Hệ thống đơn hàng đang trong giai đoạn phát triển.\n'
        message += '💬 Bạn có thể chat với người thợ để thảo luận chi tiết công việc.\n\n'
      }
      
      if (conversationId) {
        message += '💬 Đang chuyển đến trang tin nhắn với người thợ...'
      } else {
        message += '💬 Đang chuyển đến trang tin nhắn...\nBạn có thể tìm cuộc trò chuyện với người thợ ở đó.'
      }
      
      alert(message)
      
      // Đợi 500ms để backend có thời gian xử lý và lưu conversation
      console.log('⏳ Waiting 500ms for backend to process...')
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // LUÔN LUÔN chuyển đến trang tin nhắn, dù có lỗi
      if (conversationId) {
        console.log('💬 Redirecting to specific conversation:', conversationId)
        router.push(`/tin-nhan?conversation=${conversationId}`)
      } else {
        console.log('💬 Redirecting to chat page')
        router.push('/tin-nhan')
      }
      
    } catch (error: any) {
      console.error('\n❌ === ACCEPT QUOTE FLOW FAILED ===')
      console.error('❌ Error:', error)
      console.error('❌ Message:', error.message)
      console.error('❌ Stack:', error.stack)
      
      // Dù có lỗi, vẫn thử redirect đến trang chat
      setShowQuoteModal(false)
      setSelectedQuote(null)
      
      const shouldRedirect = confirm(
        '⚠️ Có lỗi xảy ra: ' + (error.message || 'Không rõ nguyên nhân') + 
        '\n\nBạn có muốn vào trang tin nhắn để kiểm tra không?'
      )
      
      if (shouldRedirect) {
        console.log('💬 User chose to redirect to chat despite error')
        router.push('/tin-nhan')
      }
    } finally {
      setQuoteLoading(false)
    }
  }
  
  // Từ chối báo giá
  const handleRejectQuote = async (quoteId: string) => {
    const reason = prompt('Lý do từ chối (tùy chọn):')
    
    // Nếu user cancel prompt
    if (reason === null) {
      console.log('ℹ️ User cancelled reject')
      return
    }
    
    try {
      setQuoteLoading(true)
      console.log('\n📝 [Reject Quote] QuoteId:', quoteId)
      console.log('📝 [Reject Quote] Reason:', reason || 'No reason')
      
      await quoteService.rejectQuote(quoteId, reason || undefined)
      
      console.log('✅ [Reject Quote] Quote rejected successfully')
      console.log('✅ [Reject Quote] Provider will receive notification from backend')
      
      // Cập nhật quotes list
      setQuotes(prev => prev.map(q => 
        q.id === quoteId ? { ...q, status: 'REJECTED' } : q
      ))
      
      // Thông báo thành công với thông tin rõ ràng
      alert(
        '✅ Đã từ chối báo giá!\n\n' +
        '🔔 Người thợ sẽ nhận được thông báo từ chối' +
        (reason ? `\n📝 Lý do: "${reason}"` : '')
      )
    } catch (error: any) {
      console.error('❌ [Reject Quote] Error:', error)
      alert(error.message || 'Không thể từ chối báo giá')
    } finally {
      setQuoteLoading(false)
    }
  }



  const filteredNotifications = (notifications || []).filter(notif => {
    if (filter === 'unread') return !notif.isRead
    return true
  })

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'quote':
        return '💰'
      case 'order':
        return '📦'
      case 'message':
        return '💬'
      case 'post':
        return '📝'
      case 'review':
        return '⭐'
      case 'system':
        return '🔔'
      default:
        return '📢'
    }
  }

  const formatTime = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMs = now.getTime() - time.getTime()
    const diffInMinutes = Math.floor(diffInMs / 60000)
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInMinutes < 1) return 'Vừa xong'
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`
    if (diffInHours < 24) return `${diffInHours} giờ trước`
    if (diffInDays < 7) return `${diffInDays} ngày trước`
    return time.toLocaleDateString('vi-VN')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông báo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
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
              <h1 className="text-2xl font-bold">
                Thông báo {unreadCount > 0 && `(${unreadCount})`}
              </h1>
            </div>
            <div className="flex space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-orange-600 hover:text-orange-700 px-3 py-1 rounded-lg hover:bg-orange-50 transition-colors"
                >
                  ✓ Đọc tất cả
                </button>
              )}
              {notifications.some(n => n.isRead) && (
                <button
                  onClick={handleDeleteAllRead}
                  className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700 px-3 py-1 rounded-lg hover:bg-red-50 transition-colors font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Xóa đã đọc</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-4 border-b">
            <button
              onClick={() => setFilter('all')}
              className={`pb-2 px-1 ${
                filter === 'all'
                  ? 'border-b-2 border-orange-500 text-orange-600 font-medium'
                  : 'text-gray-600'
              }`}
            >
              Tất cả ({notifications?.length || 0})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`pb-2 px-1 ${
                filter === 'unread'
                  ? 'border-b-2 border-orange-500 text-orange-600 font-medium'
                  : 'text-gray-600'
              }`}
            >
              Chưa đọc ({unreadCount})
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {(filteredNotifications?.length || 0) === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-6xl mb-4">🔔</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'unread' ? 'Không có thông báo chưa đọc' : 'Chưa có thông báo'}
            </h3>
            <p className="text-gray-500">
              {filter === 'unread'
                ? 'Bạn đã đọc tất cả thông báo'
                : 'Các thông báo mới sẽ xuất hiện ở đây'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredNotifications.map((notification) => {
              const isQuoteNotification = notification.type === 'new_quote_received'
              
              // Debug: Log notification data
              console.log('🔍 Notification type:', notification.type)
              console.log('🔍 Is quote notification:', isQuoteNotification)
              console.log('🔍 Notification data:', notification.data)
              
              return (
              <div
                key={notification.id}
                onClick={() => {
                  console.log('👆 Clicked notification:', notification)
                  if (isQuoteNotification) {
                    handleViewQuoteNotification(notification)
                  } else {
                    console.log('⚠️ Not a quote notification, type:', notification.type)
                  }
                }}
                className={`rounded-lg shadow-sm hover:shadow-md transition-all ${
                  !notification.isRead 
                    ? 'bg-white border-l-4 border-orange-500' 
                    : 'bg-gray-50 border-l-4 border-gray-200 opacity-75'
                } ${isQuoteNotification ? 'cursor-pointer hover:scale-[1.01]' : ''}`}
              >
                <div className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-2xl">
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-900 mb-1">
                            {notification.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatTime(notification.createdAt)}
                          </p>
                          
                          {/* Hiển thị hint cho notification báo giá */}
                          {notification.type === 'new_quote_received' && (
                            <p className="mt-2 text-xs text-blue-600 font-medium">
                              👆 Nhấn vào đây để xem báo giá và chấp nhận/từ chối
                            </p>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.isRead && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleMarkAsRead(notification.id)
                              }}
                              className="p-1 text-orange-600 hover:bg-orange-50 rounded"
                              title="Đánh dấu đã đọc"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteNotification(notification.id)
                            }}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Xóa thông báo"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )})}
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
              <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="text-xs mt-1">Thông báo</span>
          </button>
          <button onClick={() => router.push('/profile')} className="flex flex-col items-center p-2 text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs mt-1">Cá nhân</span>
          </button>
        </div>
      </div>

      {/* Modal Báo Giá */}
      {showQuoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => {
          setShowQuoteModal(false)
          setSelectedQuote(null)
          setQuotes([])
        }}>
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Header - Fixed */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4 flex items-center justify-between rounded-t-lg">
              <div>
                <h2 className="text-xl font-bold">💼 Thông tin báo giá</h2>
                <p className="text-sm text-orange-100 mt-1">Xem và quyết định chấp nhận hay từ chối</p>
              </div>
              <button
                onClick={() => {
                  setShowQuoteModal(false)
                  setSelectedQuote(null)
                  setQuotes([])
                }}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="p-6 overflow-y-auto flex-1">
              {quoteLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Đang tải báo giá...</p>
                </div>
              ) : quotes.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">📭</div>
                  <p className="text-gray-600 font-medium">Không tìm thấy báo giá</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-blue-800">
                      <span className="font-bold">💡 Lưu ý:</span> Sau khi chấp nhận báo giá, bạn có thể trò chuyện với thợ trong mục "Tin nhắn"
                    </p>
                  </div>
                  {quotes.map((quote) => {
                    console.log('📋 Quote item:', quote)
                    console.log('📋 Quote status:', quote.status)
                    console.log('📋 Provider info from API:', quote.providerName, quote.providerEmail, quote.providerPhone)
                    
                    // Normalize status (backend trả về 'pending' chữ thường)
                    const normalizedStatus = quote.status?.toUpperCase() || 'PENDING'
                    
                    // Tên thợ đã được load từ API getUserProfile
                    const providerName = quote.providerName || 'Thợ (chưa có tên)'
                    const providerAvatar = quote.providerAvatar || null
                    const providerEmail = (quote as any).providerEmail || null
                    const providerPhone = (quote as any).providerPhone || null
                    
                    console.log('✅ Final provider name:', providerName)
                    console.log('✅ Provider contact:', providerEmail, providerPhone)
                    
                    return (
                    <div
                      key={quote.id}
                      className={`border-2 rounded-lg p-4 ${
                        normalizedStatus === 'PENDING' 
                          ? 'border-blue-400 bg-blue-50' 
                          : normalizedStatus === 'ACCEPTED' || normalizedStatus === 'IN_CHAT'
                          ? 'border-green-400 bg-green-50'
                          : 'border-gray-300 bg-gray-50'
                      }`}
                    >
                      {/* Thông tin thợ */}
                      <div className="flex items-center gap-3 mb-4 bg-white rounded-lg p-3 shadow-sm">
                        {providerAvatar ? (
                          <img
                            src={providerAvatar}
                            alt={providerName}
                            className="w-14 h-14 rounded-full object-cover ring-2 ring-orange-200"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center ring-2 ring-orange-200">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 text-lg">{providerName}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              normalizedStatus === 'PENDING' ? 'bg-blue-100 text-blue-700' :
                              normalizedStatus === 'ACCEPTED' || normalizedStatus === 'IN_CHAT' ? 'bg-green-100 text-green-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {normalizedStatus === 'PENDING' && '⏳ Đang chờ xác nhận'}
                              {normalizedStatus === 'ACCEPTED' && '✅ Đã chấp nhận'}
                              {normalizedStatus === 'IN_CHAT' && '💬 Đang trò chuyện'}
                              {normalizedStatus === 'REJECTED' && '❌ Đã từ chối'}
                              {!quote.status && '⏳ Chưa xác nhận'}
                            </span>
                          </div>
                          
                          {/* Thông tin liên hệ của thợ */}
                          {(providerEmail || providerPhone) && (
                            <div className="mt-2 pt-2 border-t border-orange-100 space-y-1">
                              {providerEmail && (
                                <p className="text-xs text-gray-600">
                                  📧 {providerEmail}
                                </p>
                              )}
                              {providerPhone && (
                                <p className="text-xs text-gray-600">
                                  📞 {providerPhone}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Chi tiết báo giá */}
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600">Giá:</p>
                          <p className="text-2xl font-bold text-orange-600">
                            {parseFloat(quote.price.toString()).toLocaleString('vi-VN')}đ
                          </p>
                        </div>

                        {quote.estimatedDuration && (
                          <div>
                            <p className="text-sm text-gray-600">Thời gian ước tính:</p>
                            <p className="text-lg font-semibold text-gray-900">
                              {quote.estimatedDuration} phút
                            </p>
                          </div>
                        )}

                        <div>
                          <p className="text-sm text-gray-600 mb-1">Mô tả:</p>
                          <p className="text-gray-900">{quote.description}</p>
                        </div>

                        <div className="text-xs text-gray-500">
                          Gửi lúc: {new Date(quote.createdAt).toLocaleString('vi-VN')}
                        </div>
                      </div>

                      {/* Actions - Làm nổi bật hơn */}
                      {(normalizedStatus === 'PENDING' || !quote.status || quote.status === 'pending') && (
                        <div className="mt-6 pt-4 border-t-2 border-orange-200 bg-orange-50/50 rounded-b-lg p-4 -mx-4 -mb-4">
                          <p className="text-sm text-gray-700 mb-3 font-bold text-center">
                            👇 Bạn muốn làm gì với báo giá này? 👇
                          </p>
                          <div className="flex gap-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleAcceptQuote(quote.id)
                              }}
                              disabled={quoteLoading}
                              className="flex-1 bg-green-500 text-white px-6 py-4 rounded-lg font-bold text-lg hover:bg-green-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                            >
                              <div className="flex items-center justify-center gap-2">
                                <span className="text-2xl">✅</span>
                                <span>Chấp nhận</span>
                              </div>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRejectQuote(quote.id)
                              }}
                              disabled={quoteLoading}
                              className="flex-1 bg-red-500 text-white px-6 py-4 rounded-lg font-bold text-lg hover:bg-red-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                            >
                              <div className="flex items-center justify-center gap-2">
                                <span className="text-2xl">❌</span>
                                <span>Từ chối</span>
                              </div>
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 text-center mt-3">
                            Chấp nhận để mở chat với thợ, hoặc từ chối nếu không phù hợp
                          </p>
                        </div>
                      )}

                      {(normalizedStatus === 'ACCEPTED' || normalizedStatus === 'IN_CHAT') && (
                        <div className="mt-4 bg-green-100 text-green-800 px-4 py-3 rounded-lg text-center font-medium">
                          ✅ Đã chấp nhận báo giá này. Bạn có thể nhắn tin với thợ trong mục "Tin nhắn"
                        </div>
                      )}

                      {normalizedStatus === 'REJECTED' && (
                        <div className="mt-4 bg-red-100 text-red-800 px-4 py-3 rounded-lg text-center font-medium">
                          ❌ Đã từ chối báo giá này
                        </div>
                      )}
                    </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer - Fixed */}
            {!quoteLoading && quotes.length > 0 && (
              <div className="bg-gray-50 border-t px-6 py-4">
                <p className="text-xs text-gray-500 text-center mb-2">
                  Tổng số báo giá: <span className="font-bold">{quotes.length}</span>
                </p>
                <button
                  onClick={() => {
                    setShowQuoteModal(false)
                    setSelectedQuote(null)
                    setQuotes([])
                  }}
                  className="w-full bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                >
                  Đóng
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
