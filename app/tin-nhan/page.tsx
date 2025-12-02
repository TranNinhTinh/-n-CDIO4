'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { chatService, Conversation, Message } from '@/lib/api/chat.service'
import { chatSocketService } from '@/lib/api/chat-socket.service'
import { AuthService } from '@/lib/api/auth.service'
import ConversationItem from '@/app/components/ConversationItem'
import MessageList from '@/app/components/MessageList'
import MessageInput from '@/app/components/MessageInput'

export default function ChatPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [unreadCount, setUnreadCount] = useState(0)

  // Giả sử userId - trong production lấy từ auth context
  const currentUserId = 'user1'

  // Load conversations và kết nối socket
  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      router.push('/dang-nhap')
      return
    }

    loadConversations()
    loadUnreadCount()

    // Kết nối chat socket
    chatSocketService.connect()

    // Lắng nghe tin nhắn mới
    const unsubscribeNewMessage = chatSocketService.on('new_message', (data: { conversationId: string; message: Message }) => {
      console.log('💬 Tin nhắn mới:', data)

      // Nếu đang xem conversation này, thêm message vào list
      if (selectedConversation?.id === data.conversationId) {
        setMessages(prev => [...prev, data.message])
        // Đánh dấu đã đọc ngay
        chatSocketService.markAsRead(data.conversationId)
      }

      // Cập nhật conversation list
      setConversations(prev => {
        const updated = prev.map(conv => {
          if (conv.id === data.conversationId) {
            return {
              ...conv,
              lastMessage: data.message.content || 'File đính kèm',
              lastMessageTime: data.message.createdAt,
              unreadCount: selectedConversation?.id === data.conversationId ? 0 : conv.unreadCount + 1
            }
          }
          return conv
        })
        // Sắp xếp lại theo thời gian message mới nhất
        return updated.sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime())
      })

      // Hiển thị browser notification nếu không đang xem conversation đó
      if (selectedConversation?.id !== data.conversationId && Notification.permission === 'granted') {
        new Notification('Tin nhắn mới', {
          body: data.message.content || 'Bạn có tin nhắn mới',
          icon: '/logo.png'
        })
      }

      // Reload unread count
      loadUnreadCount()
    })

    // Lắng nghe khi messages được đánh dấu đã đọc
    const unsubscribeMessagesRead = chatSocketService.on('messages_read', (data: { conversationId: string; readBy: string }) => {
      console.log('✅ Messages đã đọc:', data)
      
      // Cập nhật UI để hiển thị checkmark
      if (selectedConversation?.id === data.conversationId) {
        setMessages(prev => prev.map(msg => ({
          ...msg,
          isRead: true,
          readAt: new Date()
        })))
      }
    })

    // Lắng nghe user typing
    const unsubscribeTyping = chatSocketService.on('user_typing', (data: { conversationId: string; userId: string; isTyping: boolean }) => {
      console.log('⌨️ User typing:', data)
      // TODO: Hiển thị "đang nhập..." trong UI
    })

    // Lắng nghe unread count update
    const unsubscribeUnreadUpdated = chatSocketService.on('unread_updated', (data: { conversationId: string; increment: number }) => {
      console.log('🔢 Unread updated:', data)
      loadUnreadCount()
    })

    // Lắng nghe kết nối thành công
    const unsubscribeConnected = chatSocketService.on('connected', (data: { userId: string; unreadCount: number }) => {
      console.log('🔔 Chat connected:', data)
      setUnreadCount(data.unreadCount)
    })

    // Yêu cầu quyền browser notification
    if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('🔔 Browser notification permission:', permission)
      })
    }

    // Cleanup
    return () => {
      unsubscribeNewMessage()
      unsubscribeMessagesRead()
      unsubscribeTyping()
      unsubscribeUnreadUpdated()
      unsubscribeConnected()
      chatSocketService.disconnect()
    }
  }, [])

  // Load messages khi chọn conversation
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id)
      markAsRead(selectedConversation.id)
      
      // Join conversation room để nhận messages real-time
      chatSocketService.joinConversation(selectedConversation.id)
      
      // Cleanup: Leave room khi chuyển conversation
      return () => {
        chatSocketService.leaveConversation(selectedConversation.id)
      }
    }
  }, [selectedConversation])

  const loadConversations = async () => {
    try {
      setLoading(true)
      const data = await chatService.getConversations()
      setConversations(data)
      
      // 🔥 Kiểm tra xem có query param conversation không
      // Nếu có, tự động chọn conversation đó
      const conversationIdFromUrl = searchParams.get('conversation')
      if (conversationIdFromUrl && data.length > 0) {
        const targetConversation = data.find(c => c.id === conversationIdFromUrl)
        if (targetConversation) {
          console.log('💬 Auto-selecting conversation from URL:', conversationIdFromUrl)
          setSelectedConversation(targetConversation)
          
          // Xóa query param khỏi URL (optional - để URL sạch hơn)
          window.history.replaceState({}, '', '/tin-nhan')
        }
      }
    } catch (error) {
      console.error('Error loading conversations:', error)
      alert('Không thể tải danh sách cuộc trò chuyện')
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (conversationId: string) => {
    try {
      const data = await chatService.getMessages(conversationId)
      setMessages(data)
    } catch (error) {
      console.error('Error loading messages:', error)
      alert('Không thể tải tin nhắn')
    }
  }

  const loadUnreadCount = async () => {
    try {
      const data = await chatService.getUnreadCount()
      setUnreadCount(data.unreadCount)
    } catch (error) {
      console.error('Error loading unread count:', error)
    }
  }

  const markAsRead = async (conversationId: string) => {
    try {
      // Gửi qua WebSocket để real-time
      if (chatSocketService.isConnected()) {
        await chatSocketService.markAsRead(conversationId)
      } else {
        await chatService.markAsRead(conversationId)
      }
      
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
        )
      )
      loadUnreadCount()
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  const handleSendMessage = async (content: string) => {
    if (!selectedConversation) return

    try {
      setSendingMessage(true)
      
      // Gửi qua WebSocket để có real-time response
      const response = await chatSocketService.sendMessage(selectedConversation.id, {
        type: 'text',
        content
      })

      if (response.success && response.message) {
        // Message đã được thêm vào qua event 'new_message', không cần thêm ở đây
        console.log('✅ Message sent successfully:', response.message)
      } else {
        throw new Error(response.error || 'Failed to send message')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Không thể gửi tin nhắn')
    } finally {
      setSendingMessage(false)
    }
  }

  const handleDeleteConversation = async (conversationId: string) => {
    if (!confirm('Bạn có chắc muốn xóa cuộc trò chuyện này?')) return

    try {
      await chatService.deleteConversation(conversationId)
      setConversations((prev) => prev.filter((conv) => conv.id !== conversationId))
      if (selectedConversation?.id === conversationId) {
        setSelectedConversation(null)
        setMessages([])
      }
    } catch (error) {
      console.error('Error deleting conversation:', error)
      alert('Không thể xóa cuộc trò chuyện')
    }
  }

  const handleCloseConversation = async () => {
    if (!selectedConversation) return
    if (!confirm('Bạn có chắc muốn đóng cuộc trò chuyện này?')) return

    try {
      await chatService.closeConversation(selectedConversation.id)
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedConversation.id ? { ...conv, isClosed: true } : conv
        )
      )
      setSelectedConversation((prev: Conversation | null) => (prev ? { ...prev, isClosed: true } : null))
      alert('Đã đóng cuộc trò chuyện')
    } catch (error) {
      console.error('Error closing conversation:', error)
      alert('Không thể đóng cuộc trò chuyện')
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadConversations()
      return
    }

    try {
      const results = await chatService.searchMessages({ query: searchQuery })
      console.log('Search results:', results)
      alert(`Tìm thấy ${results.length} kết quả`)
    } catch (error) {
      console.error('Error searching:', error)
      alert('Không thể tìm kiếm')
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Conversation List */}
      <div className="w-full md:w-96 bg-white border-r flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => router.push('/home')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Quay lại trang chủ"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div className="flex items-center justify-between flex-1">
              <h1 className="text-2xl font-bold">Tin nhắn</h1>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {unreadCount} chưa đọc
                </span>
              )}
            </div>
          </div>
          
          {/* Search */}
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Tìm kiếm tin nhắn..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p>Chưa có cuộc trò chuyện nào</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={selectedConversation?.id === conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                onDelete={() => handleDeleteConversation(conversation.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                  {selectedConversation.workerAvatar ? (
                    <img
                      src={selectedConversation.workerAvatar}
                      alt={selectedConversation.workerName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white font-bold">
                      {selectedConversation.workerName.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="font-semibold">{selectedConversation.workerName}</h2>
                  <p className="text-sm text-gray-500">
                    {selectedConversation.isClosed ? 'Đã đóng' : 'Đang hoạt động'}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                {!selectedConversation.isClosed && (
                  <button
                    onClick={handleCloseConversation}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                    title="Đóng cuộc trò chuyện"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Messages */}
            <MessageList messages={messages} currentUserId={currentUserId} />

            {/* Message Input */}
            {!selectedConversation.isClosed && (
              <MessageInput
                onSend={handleSendMessage}
                disabled={sendingMessage}
              />
            )}
            {selectedConversation.isClosed && (
              <div className="p-4 bg-gray-100 text-center text-gray-600">
                Cuộc trò chuyện đã được đóng
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-lg">Chọn một cuộc trò chuyện để bắt đầu</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
