'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthService } from '@/lib/api/auth.service'
import Image from 'next/image'

interface Message {
  id: string
  userId: string
  userName: string
  userAvatar: string
  lastMessage: string
  timestamp: string
  unreadCount: number
  isOnline: boolean
}

interface ChatMessage {
  id: string
  senderId: string
  content: string
  timestamp: string
  isRead: boolean
}

// Dữ liệu mẫu tin nhắn
const MOCK_CONVERSATIONS: Message[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Thợ Điện Minh',
    userAvatar: '⚡',
    lastMessage: 'Em có thể đến vào chiều nay được không ạ?',
    timestamp: '5 phút trước',
    unreadCount: 2,
    isOnline: true
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Nguyễn Văn A',
    userAvatar: '👨',
    lastMessage: 'Cảm ơn anh đã sửa giúp em!',
    timestamp: '1 giờ trước',
    unreadCount: 0,
    isOnline: false
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Thợ Nước Toàn',
    userAvatar: '🔧',
    lastMessage: 'Anh cho em hỏi địa chỉ cụ thể ạ',
    timestamp: '2 giờ trước',
    unreadCount: 1,
    isOnline: true
  },
  {
    id: '4',
    userId: 'user4',
    userName: 'Lê Thị Hoa',
    userAvatar: '👩',
    lastMessage: 'Giá này em đồng ý nha',
    timestamp: '3 giờ trước',
    unreadCount: 0,
    isOnline: false
  },
  {
    id: '5',
    userId: 'user5',
    userName: 'Điện Lạnh Hưng',
    userAvatar: '❄️',
    lastMessage: 'Em sẽ qua vào sáng mai ạ',
    timestamp: '5 giờ trước',
    unreadCount: 3,
    isOnline: true
  },
  {
    id: '6',
    userId: 'user6',
    userName: 'Mộc Tâm',
    userAvatar: '🪵',
    lastMessage: 'Tủ bếp đã hoàn thành rồi ạ',
    timestamp: '1 ngày trước',
    unreadCount: 0,
    isOnline: false
  }
]

const MOCK_CHAT_MESSAGES: { [key: string]: ChatMessage[] } = {
  '1': [
    { id: '1', senderId: 'user1', content: 'Chào anh, em thấy bài đăng sửa điện của anh', timestamp: '10:30', isRead: true },
    { id: '2', senderId: 'me', content: 'Chào em, vâng em có thể qua được không?', timestamp: '10:32', isRead: true },
    { id: '3', senderId: 'user1', content: 'Em có thể đến vào chiều nay được không ạ?', timestamp: '10:35', isRead: false },
    { id: '4', senderId: 'user1', content: 'Khoảng 2h chiều em rảnh ạ', timestamp: '10:36', isRead: false }
  ],
  '2': [
    { id: '1', senderId: 'user2', content: 'Cảm ơn anh đã sửa giúp em!', timestamp: 'Hôm qua', isRead: true },
    { id: '2', senderId: 'me', content: 'Dạ không có gì ạ. Lần sau cần gì cứ liên hệ em nhé', timestamp: 'Hôm qua', isRead: true }
  ],
  '3': [
    { id: '1', senderId: 'user3', content: 'Xin chào, em thấy anh cần thợ nước', timestamp: '09:00', isRead: true },
    { id: '2', senderId: 'me', content: 'Vâng đúng rồi em', timestamp: '09:15', isRead: true },
    { id: '3', senderId: 'user3', content: 'Anh cho em hỏi địa chỉ cụ thể ạ', timestamp: '09:20', isRead: false }
  ]
}

export default function MessagesPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [conversations, setConversations] = useState<Message[]>(MOCK_CONVERSATIONS)
  const [selectedChat, setSelectedChat] = useState<Message | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const checkAuth = () => {
      if (!AuthService.isAuthenticated()) {
        router.push('/dang-nhap')
      } else {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [router])

  const handleSelectChat = (conversation: Message) => {
    setSelectedChat(conversation)
    setChatMessages(MOCK_CHAT_MESSAGES[conversation.id] || [])
    
    // Mark as read
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversation.id ? { ...conv, unreadCount: 0 } : conv
      )
    )
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'me',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      isRead: false
    }

    setChatMessages(prev => [...prev, message])
    setNewMessage('')

    // Update last message in conversation
    setConversations(prev =>
      prev.map(conv =>
        conv.id === selectedChat.id
          ? { ...conv, lastMessage: newMessage, timestamp: 'Vừa xong' }
          : conv
      )
    )
  }

  const filteredConversations = conversations.filter(conv =>
    conv.userName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-3 border-b border-gray-200">
          <div className="flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Thợ Tốt"
              width={120}
              height={95}
              className="object-contain"
              style={{ maxWidth: '120px', height: 'auto' }}
            />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            <a href="/profile" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">U</div>
              <div className="flex-1"><div className="font-medium text-sm">Người dùng</div></div>
            </a>

            <a href="/home" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-sm">Trang chủ</span>
            </a>

            <a href="/tin-nhan" className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-sm">Tin nhắn</span>
              {totalUnread > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{totalUnread}</span>
              )}
            </a>

            <a href="/thong-bao" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="text-sm">Thông báo</span>
            </a>

            <a href="/da-luu" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <span className="text-sm">Đã lưu</span>
            </a>

            <a href="/lich-su" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">Lịch sử yêu cầu</span>
            </a>

            <a href="/yeu-thich" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-sm">Thợ yêu thích</span>
            </a>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={async () => {
              await AuthService.logout()
              router.push('/dang-nhap')
            }}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-medium">Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* Main Content - Messages */}
      <div className="flex-1 flex">
        {/* Conversations List */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Tin nhắn</h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm tin nhắn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => handleSelectChat(conversation)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition ${
                  selectedChat?.id === conversation.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl">
                      {conversation.userAvatar}
                    </div>
                    {conversation.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">{conversation.userName}</h3>
                      <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                      {conversation.unreadCount > 0 && (
                        <span className="ml-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        {selectedChat ? (
          <div className="flex-1 flex flex-col bg-gray-50">
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-lg">
                      {selectedChat.userAvatar}
                    </div>
                    {selectedChat.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">{selectedChat.userName}</h2>
                    <p className="text-xs text-gray-500">{selectedChat.isOnline ? 'Đang hoạt động' : 'Không hoạt động'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.senderId === 'me'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <span
                      className={`text-xs mt-1 block ${
                        message.senderId === 'me' ? 'text-blue-100' : 'text-gray-500'
                      }`}
                    >
                      {message.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Chọn một cuộc trò chuyện</h3>
              <p className="text-gray-500">Chọn từ danh sách bên trái để bắt đầu nhắn tin</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
