'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthService } from '@/lib/api/auth.service'
import Image from 'next/image'
import Link from 'next/link'

interface Notification {
  id: string
  type: 'comment' | 'job' | 'message' | 'review' | 'system'
  title: string
  content: string
  time: string
  isRead: boolean
  actionUrl?: string
  userAvatar?: string
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'comment',
    title: 'Thợ Điện Minh đã bình luận bài viết của bạn',
    content: 'Em có thể nhận việc này vào chiều nay ạ!',
    time: '5 phút trước',
    isRead: false,
    actionUrl: '/posts/1',
    userAvatar: '⚡'
  },
  {
    id: '2',
    type: 'job',
    title: 'Có công việc phù hợp với bạn',
    content: 'Cần thợ sửa điều hòa tại Quận 1 - Mức lương: 500,000đ',
    time: '30 phút trước',
    isRead: false,
    actionUrl: '/posts/5'
  },
  {
    id: '3',
    type: 'message',
    title: 'Tin nhắn mới từ Nguyễn Văn A',
    content: 'Anh có thể qua sửa vào ngày mai được không ạ?',
    time: '1 giờ trước',
    isRead: false,
    actionUrl: '/tin-nhan',
    userAvatar: '👨'
  },
  {
    id: '4',
    type: 'review',
    title: 'Lê Thị Hoa đã đánh giá bạn',
    content: '⭐⭐⭐⭐⭐ Thợ làm việc rất tốt, nhiệt tình!',
    time: '2 giờ trước',
    isRead: true,
    actionUrl: '/profile',
    userAvatar: '👩'
  },
  {
    id: '5',
    type: 'job',
    title: 'Bài đăng của bạn có người quan tâm',
    content: '12 người đã xem bài đăng "Cần thợ sửa điện"',
    time: '3 giờ trước',
    isRead: true,
    actionUrl: '/posts/1'
  },
  {
    id: '6',
    type: 'system',
    title: 'Cập nhật mới từ Thợ Tốt',
    content: 'Chúng tôi đã thêm tính năng lọc thợ theo khu vực!',
    time: '5 giờ trước',
    isRead: true
  },
  {
    id: '7',
    type: 'comment',
    title: 'Điện Lạnh Hưng đã trả lời bình luận của bạn',
    content: 'Em có thể qua ngay bây giờ ạ',
    time: '1 ngày trước',
    isRead: true,
    actionUrl: '/posts/3',
    userAvatar: '❄️'
  },
  {
    id: '8',
    type: 'job',
    title: 'Công việc đã hoàn thành',
    content: 'Khách hàng đã xác nhận hoàn thành công việc "Sửa điện nhà"',
    time: '1 ngày trước',
    isRead: true,
    actionUrl: '/lich-su'
  },
  {
    id: '9',
    type: 'message',
    title: 'Tin nhắn mới từ Mộc Tâm',
    content: 'Tủ bếp đã xong rồi anh, anh qua kiểm tra nhé',
    time: '2 ngày trước',
    isRead: true,
    actionUrl: '/tin-nhan',
    userAvatar: '🪵'
  },
  {
    id: '10',
    type: 'review',
    title: 'Trần Văn B đã đánh giá bạn',
    content: '⭐⭐⭐⭐ Làm tốt, giá hợp lý',
    time: '2 ngày trước',
    isRead: true,
    actionUrl: '/profile',
    userAvatar: '🔧'
  },
  {
    id: '11',
    type: 'system',
    title: 'Nhắc nhở: Cập nhật hồ sơ',
    content: 'Hãy cập nhật kỹ năng và kinh nghiệm của bạn để được nhiều việc hơn',
    time: '3 ngày trước',
    isRead: true,
    actionUrl: '/profile'
  },
  {
    id: '12',
    type: 'job',
    title: 'Có 5 công việc mới phù hợp',
    content: 'Kiểm tra ngay để không bỏ lỡ cơ hội!',
    time: '3 ngày trước',
    isRead: true,
    actionUrl: '/home'
  }
]

export default function NotificationsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

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

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    )
  }

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, isRead: true }))
    )
  }

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'comment':
        return (
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        )
      case 'job':
        return (
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        )
      case 'message':
        return (
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        )
      case 'review':
        return (
          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        )
      case 'system':
        return (
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )
      default:
        return null
    }
  }

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.isRead)
    : notifications

  const unreadCount = notifications.filter(n => !n.isRead).length

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

            <a href="/tin-nhan" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-sm">Tin nhắn</span>
            </a>

            <a href="/thong-bao" className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="text-sm">Thông báo</span>
              {unreadCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{unreadCount}</span>
              )}
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

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">Thông báo</h1>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Đánh dấu đã đọc tất cả
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-4 border-b border-gray-200">
              <button
                onClick={() => setFilter('all')}
                className={`pb-3 px-2 font-medium transition ${
                  filter === 'all'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Tất cả ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`pb-3 px-2 font-medium transition ${
                  filter === 'unread'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Chưa đọc ({unreadCount})
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Không có thông báo</h3>
                <p className="text-gray-500">Bạn đã xem hết thông báo</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`bg-white rounded-lg border transition hover:shadow-md ${
                      notification.isRead ? 'border-gray-200' : 'border-blue-200 bg-blue-50'
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex items-start gap-4">
                        {notification.userAvatar ? (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-lg flex-shrink-0">
                            {notification.userAvatar}
                          </div>
                        ) : (
                          getNotificationIcon(notification.type)
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 text-sm">{notification.title}</h3>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{notification.content}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">{notification.time}</span>
                            <div className="flex items-center gap-2">
                              {!notification.isRead && (
                                <button
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                >
                                  Đánh dấu đã đọc
                                </button>
                              )}
                              {notification.actionUrl && (
                                <Link
                                  href={notification.actionUrl}
                                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                >
                                  Xem chi tiết →
                                </Link>
                              )}
                              <button
                                onClick={() => handleDelete(notification.id)}
                                className="text-xs text-red-600 hover:text-red-700 font-medium"
                              >
                                Xóa
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
