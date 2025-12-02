'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { AuthService } from '@/lib/api/auth.service'
import { PostService } from '@/lib/api/post.service'
import { chatService } from '@/lib/api/chat.service'
import type { PostResponseDto } from '@/lib/api'
import Image from 'next/image'
import SkeletonPostDetail from '@/app/components/SkeletonPostDetail'
import ThoTotLogo from '@/app/components/ThoTotLogo'
import QuoteSection from '@/app/components/QuoteSection'

export default function PostDetailPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string

  const [post, setPost] = useState<PostResponseDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [isApplying, setIsApplying] = useState(false)
  const [error, setError] = useState('')
  const [showMenu, setShowMenu] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [authorAvatar, setAuthorAvatar] = useState<string | null>(null)

  useEffect(() => {
    // Kiểm tra authentication
    if (!AuthService.isAuthenticated()) {
      router.push('/dang-nhap')
      return
    }

    // Load current user from localStorage
    const userDataStr = localStorage.getItem('user_data')
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr)
        setCurrentUser(userData)
      } catch (e) {
        console.error('Error parsing user data:', e)
      }
    }

    // Load post data
    loadPost()
  }, [postId])

  const loadPost = async () => {
    setLoading(true)
    setError('')
    
    try {
      const data = await PostService.getPostById(postId)
      console.log('📦 Post data loaded:', data)
      setPost(data)
      
      // Lấy userId từ customer object
      let userId = null
      if (data.customer && typeof data.customer === 'object') {
        userId = data.customer.id
        console.log('👤 Customer ID from object:', userId)
      } else if (data.customerId) {
        userId = data.customerId
        console.log('🆔 Customer ID direct:', userId)
      }
      
      if (userId) {
        const avatarKey = `user_avatar_${userId}`
        console.log('🔑 Looking for avatar key:', avatarKey)
        const savedAvatar = localStorage.getItem(avatarKey)
        
        if (savedAvatar) {
          setAuthorAvatar(savedAvatar)
          console.log('✅ Avatar loaded successfully')
        } else {
          console.warn('⚠️ No avatar in localStorage for userId:', userId)
          console.log('💡 User needs to upload avatar in profile page first')
        }
      } else {
        console.error('❌ Could not find userId in post data')
      }
    } catch (err: any) {
      console.error('Error loading post:', err)
      setError(err.message || 'Không thể tải bài đăng')
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async () => {
    setIsApplying(true)
    
    // TODO: Call API để apply cho công việc
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    alert('Đã gửi yêu cầu ứng tuyển thành công!')
    setIsApplying(false)
  }

  const handlePostComment = async () => {
    if (!newComment.trim()) return
    
    // TODO: Call API để post comment
    alert('Chức năng bình luận sẽ được cập nhật sau!')
    setNewComment('')
  }

  const handleClosePost = async () => {
    if (!confirm('Bạn có chắc muốn đóng bài đăng này?')) return
    
    try {
      await PostService.closePost(postId)
      alert('Đóng bài đăng thành công!')
      loadPost() // Reload to see updated status
      setShowMenu(false)
    } catch (error: any) {
      console.error('Error closing post:', error)
      alert(error.message || 'Không thể đóng bài đăng')
    }
  }

  const handleEditPost = () => {
    router.push(`/posts/create?edit=${postId}`)
  }

  const handleDeletePost = async () => {
    if (!confirm('Bạn có chắc muốn xóa bài đăng này? Hành động này không thể hoàn tác!')) return
    
    try {
      await PostService.deletePost(postId)
      alert('Xóa bài đăng thành công!')
      router.push('/home')
    } catch (error: any) {
      console.error('Error deleting post:', error)
      alert(error.message || 'Không thể xóa bài đăng')
    }
  }

  // Nhắn tin với người đăng bài
  const handleSendMessage = async () => {
    if (!post?.customerId) {
      alert('Không thể xác định người đăng bài')
      return
    }

    try {
      // Tạo hoặc mở cuộc trò chuyện với người đăng bài
      const conversation = await chatService.createDirectConversation({ 
        workerId: post.customerId 
      })
      
      // Chuyển đến trang tin nhắn
      router.push('/tin-nhan')
    } catch (error: any) {
      console.error('Error creating conversation:', error)
      alert(error.message || 'Không thể tạo cuộc trò chuyện')
    }
  }

  // Kiểm tra xem user có phải chủ bài đăng không
  const isOwner = currentUser && post && currentUser.id === post.customerId

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)
    
    if (days > 0) return `${days} ngày trước`
    if (hours > 0) return `${hours} giờ trước`
    return 'Vừa xong'
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }

  if (loading) {
    return <SkeletonPostDetail />
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy bài đăng</h2>
          <p className="text-gray-600 mb-4">Bài đăng này có thể đã bị xóa hoặc không tồn tại.</p>
          <button
            onClick={() => router.push('/home')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.push('/home')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-800">Chi tiết công việc</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Post Info Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              {/* Header với Status và Menu */}
              <div className="flex items-start justify-between mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {post.status}
                </span>
                
                {/* Dropdown Menu (chỉ hiển thị nếu là chủ bài đăng) */}
                {isOwner && (
                  <div className="relative">
                    <button
                      onClick={() => setShowMenu(!showMenu)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {showMenu && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                        <button
                          onClick={handleEditPost}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span>Chỉnh sửa bài đăng</span>
                        </button>

                        {post.status === 'OPEN' && (
                          <button
                            onClick={handleClosePost}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Đóng bài đăng</span>
                          </button>
                        )}

                        <div className="border-t border-gray-200 my-2"></div>

                        <button
                          onClick={handleDeletePost}
                          className="w-full px-4 py-2 text-left hover:bg-red-50 flex items-center gap-3 text-red-600 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Xóa bài đăng</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Mô tả công việc</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{post.description}</p>
              </div>

              {/* Images */}
              {post.imageUrls && post.imageUrls.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Hình ảnh</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {post.imageUrls.map((url, index) => (
                      <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                        <Image 
                          src={url} 
                          alt={`Image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Price & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {post.budget && (
                  <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Ngân sách</p>
                      <p className="font-semibold text-gray-900">{formatCurrency(post.budget)}</p>
                    </div>
                  </div>
                )}
                {post.location && (
                  <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Địa điểm</p>
                      <p className="font-semibold text-gray-900">{post.location}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Desired Time */}
              {post.desiredTime && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Thời gian mong muốn</h3>
                  <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-700">
                      {new Date(post.desiredTime).toLocaleDateString('vi-VN', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Quotes Section */}
            <QuoteSection 
              postId={postId} 
              isPostOwner={isOwner}
            />

            {/* Comments Section - Coming soon */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Bình luận
              </h3>
              <p className="text-gray-500 text-center py-8">
                Chức năng bình luận sẽ được cập nhật sớm
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              {/* Posted By */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Người đăng</h3>
                <div className="flex items-start gap-3">
                  {authorAvatar ? (
                    <img 
                      src={authorAvatar} 
                      alt={post.customer.fullName || 'Avatar'} 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
                      {post.customer.fullName ? post.customer.fullName.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{post.customer.fullName || 'Người dùng'}</h4>
                  </div>
                </div>
              </div>

              {/* Posted Time */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">Đăng {formatDate(post.createdAt)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {!isOwner && (
                  <>
                    <button
                      onClick={handleApply}
                      disabled={isApplying}
                      className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center justify-center gap-2"
                    >
                      {isApplying ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Đang gửi...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Ứng tuyển ngay</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleSendMessage}
                      className="w-full py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>Nhắn tin với người đăng</span>
                    </button>
                  </>
                )}

                {isOwner && (
                  <div className="text-center py-4 text-gray-500">
                    Đây là bài đăng của bạn
                  </div>
                )}

                <button className="w-full py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>Nhắn tin</span>
                </button>

                <button className="w-full py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <span>Lưu lại</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
