'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { AuthService } from '@/lib/api/auth.service'
import { PostService } from '@/lib/api/post.service'
import { ProfileService } from '@/lib/api/profile.service'
import { chatService } from '@/lib/api/chat.service'
import { notificationService } from '@/lib/api/notification.service'
import { socketService } from '@/lib/api/socket.service'
import { chatSocketService } from '@/lib/api/chat-socket.service'
import SkeletonPost from '@/app/components/SkeletonPost'

export default function HomePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [postContent, setPostContent] = useState('')
  const [postTitle, setPostTitle] = useState('')
  const [postLoading, setPostLoading] = useState(false)
  const [postError, setPostError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [showCategories, setShowCategories] = useState(true)
  const [showServices, setShowServices] = useState(true)
  const [posts, setPosts] = useState<any[]>([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0)
  const [unreadMessageCount, setUnreadMessageCount] = useState(0)
  
  // States cho các tính năng mới
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set())
  const [interestedPosts, setInterestedPosts] = useState<Set<string>>(new Set())
  const [notifiedPosts, setNotifiedPosts] = useState<Set<string>>(new Set())
  const [hiddenPosts, setHiddenPosts] = useState<Set<string>>(new Set())
  
  // Search states
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  
  // Filter and sort states
  const [sortBy, setSortBy] = useState<'latest' | 'relevant' | 'recent' | 'urgent'>('latest')
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)

  // Load số thông báo và tin nhắn chưa đọc
  const loadUnreadCounts = async () => {
    try {
      const [notificationData, messageData] = await Promise.all([
        notificationService.getUnreadCount().catch(() => ({ count: 0 })),
        chatService.getUnreadCount().catch(() => ({ unreadCount: 0 }))
      ])
      
      setUnreadNotificationCount(notificationData.count || 0)
      setUnreadMessageCount(messageData.unreadCount || 0)
    } catch (error) {
      console.error('❌ Lỗi load số chưa đọc:', error)
    }
  }

  // Load bài đăng từ API
  const loadPosts = async () => {
    try {
      setLoadingPosts(true)
      const response = await PostService.getFeed({ limit: 20 })
      
      // Response type là FeedResponseDto: { data: PostResponseDto[], nextCursor?, total, hasMore }
      if (response.data && Array.isArray(response.data)) {
        setPosts(response.data)
      } else {
        console.warn('⚠️ Không có bài đăng nào')
        setPosts([])
      }
    } catch (error) {
      console.error('❌ Lỗi load bài đăng:', error)
      setPosts([])
    } finally {
      setLoadingPosts(false)
    }
  }

  // Sắp xếp bài viết dựa trên sortBy
  const getSortedPosts = () => {
    if (!posts || posts.length === 0) return []
    
    let sortedPosts = [...posts]
    
    switch (sortBy) {
      case 'latest':
        // Sắp xếp theo ngày tạo mới nhất
        sortedPosts.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime()
          const dateB = new Date(b.createdAt).getTime()
          return dateB - dateA
        })
        break
      
      case 'relevant':
        // Sắp xếp theo độ phù hợp (có thể dựa trên likes, comments)
        sortedPosts.sort((a, b) => {
          const scoreA = (a.likes || 0) + (a.comments || 0) * 2
          const scoreB = (b.likes || 0) + (b.comments || 0) * 2
          return scoreB - scoreA
        })
        break
      
      case 'recent':
        // Sắp xếp theo cập nhật gần đây
        sortedPosts.sort((a, b) => {
          const dateA = new Date(a.updatedAt || a.createdAt).getTime()
          const dateB = new Date(b.updatedAt || b.createdAt).getTime()
          return dateB - dateA
        })
        break
      
      case 'urgent':
        // Hiển thị bài gấp trước, sau đó theo thời gian
        sortedPosts.sort((a, b) => {
          if (a.urgent && !b.urgent) return -1
          if (!a.urgent && b.urgent) return 1
          const dateA = new Date(a.createdAt).getTime()
          const dateB = new Date(b.createdAt).getTime()
          return dateB - dateA
        })
        break
      
      default:
        break
    }
    
    return sortedPosts
  }

  // Tìm kiếm profiles
  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    
    if (!query.trim()) {
      setShowSearchResults(false)
      setSearchResults([])
      return
    }

    try {
      setSearchLoading(true)
      setShowSearchResults(true)
      
      // Tìm kiếm cả WORKER và CUSTOMER
      const response = await ProfileService.searchProfiles({
        q: query.trim(),
        limit: 10,
        sortBy: 'rating',
        order: 'desc'
      })
      
      setSearchResults(response.data || [])
    } catch (error) {
      console.error('❌ Lỗi tìm kiếm:', error)
      setSearchResults([])
    } finally {
      setSearchLoading(false)
    }
  }

  // Đóng kết quả tìm kiếm và menu khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.search-container')) {
        setShowSearchResults(false)
      }
      // Đóng dropdown menu khi click bên ngoài
      if (!target.closest('.post-menu-container')) {
        setOpenMenuId(null)
      }
      // Đóng filter dropdown khi click bên ngoài
      if (!target.closest('.filter-dropdown-container')) {
        setShowFilterDropdown(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Load saved/interested/notified/hidden posts from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('savedPosts')
      const interested = localStorage.getItem('interestedPosts')
      const notified = localStorage.getItem('notifiedPosts')
      const hidden = localStorage.getItem('hiddenPosts')
      
      if (saved) setSavedPosts(new Set(JSON.parse(saved)))
      if (interested) setInterestedPosts(new Set(JSON.parse(interested)))
      if (notified) setNotifiedPosts(new Set(JSON.parse(notified)))
      if (hidden) setHiddenPosts(new Set(JSON.parse(hidden)))
    } catch (error) {
      console.error('❌ Không thể load dữ liệu từ localStorage:', error)
    }
  }, [])

  // Kiểm tra authentication khi component mount
  useEffect(() => {
    const checkAuth = async () => {
      if (!AuthService.isAuthenticated()) {
        // Chưa đăng nhập, chuyển về trang đăng nhập
        router.push('/dang-nhap')
      } else {
        // Load thông tin user từ API
        try {
          const userData = await ProfileService.getMyProfile()
          setCurrentUser(userData)
        } catch (error) {
          console.error('❌ Không thể load thông tin user:', error)
        }
        
        setIsLoading(false)
        // Load bài đăng và số chưa đọc
        await loadPosts()
        await loadUnreadCounts()
        
        // Kết nối socket để nhận cập nhật real-time cho badge numbers
        socketService.connect()
        chatSocketService.connect()
        
        // ===== NOTIFICATION SOCKET EVENTS =====
        // Lắng nghe thông báo mới
        const unsubscribeNew = socketService.on('notification:new', async (notification) => {
          console.log('🔔 [Home] Nhận thông báo mới:', notification)
          console.log('🔔 [Home] Notification isRead:', notification.isRead)
          
          // RELOAD số đếm chính xác từ API thay vì tăng thủ công
          // Điều này tránh trường hợp backend gửi nhiều thông báo cùng lúc khi kết nối
          try {
            const notificationData = await notificationService.getUnreadCount()
            setUnreadNotificationCount(notificationData.count || 0)
            console.log('✅ [Home] Đã cập nhật unread count từ API:', notificationData.count)
          } catch (error) {
            console.error('❌ [Home] Lỗi reload unread count:', error)
          }
          
          // Hiển thị browser notification CHỈ KHI chưa đọc
          if (!notification.isRead && Notification.permission === 'granted') {
            new Notification('Thông báo mới', {
              body: notification.message || 'Bạn có thông báo mới',
              icon: '/logo.png'
            })
          }
        })
        
        // Lắng nghe khi đánh dấu đã đọc
        const unsubscribeRead = socketService.on('notification:read', ({ notificationId }) => {
          console.log('✅ [Home] Thông báo đã đọc:', notificationId)
          // Giảm unread count
          setUnreadNotificationCount(prev => Math.max(0, prev - 1))
        })
        
        // Lắng nghe khi đánh dấu tất cả đã đọc
        const unsubscribeAllRead = socketService.on('notification:all_read', () => {
          console.log('✅ [Home] Tất cả thông báo đã đọc')
          setUnreadNotificationCount(0)
        })
        
        // ===== CHAT SOCKET EVENTS =====
        // Lắng nghe tin nhắn mới để cập nhật badge
        const unsubscribeChatNewMessage = chatSocketService.on('new_message', (data: any) => {
          console.log('💬 [Home] Tin nhắn mới:', data)
          // Tăng message count
          setUnreadMessageCount(prev => prev + 1)
        })
        
        // Lắng nghe khi chat connected để lấy unread count
        const unsubscribeChatConnected = chatSocketService.on('connected', (data: { userId: string; unreadCount: number }) => {
          console.log('💬 [Home] Chat connected:', data)
          setUnreadMessageCount(data.unreadCount)
        })
        
        // Lắng nghe unread count update từ chat
        const unsubscribeChatUnread = chatSocketService.on('unread_updated', (data: { conversationId: string; increment: number }) => {
          console.log('💬 [Home] Chat unread updated:', data)
          setUnreadMessageCount(prev => Math.max(0, prev + data.increment))
        })
        
        // Yêu cầu quyền hiển thị browser notification
        if (Notification.permission === 'default') {
          Notification.requestPermission().then(permission => {
            console.log('🔔 Browser notification permission:', permission)
          })
        }
        
        // Cleanup khi component unmount
        return () => {
          // Notification socket cleanup
          unsubscribeNew()
          unsubscribeRead()
          unsubscribeAllRead()
          socketService.disconnect()
          
          // Chat socket cleanup
          unsubscribeChatNewMessage()
          unsubscribeChatConnected()
          unsubscribeChatUnread()
          chatSocketService.disconnect()
        }
      }
    }
    
    checkAuth()
  }, [router])

  // Dữ liệu mẫu cho danh sách lĩnh vực
  const categories = [
    { id: 'danang', name: 'Thợ Điện Đà Nẵng', icon: '⚡' },
    { id: 'uytin', name: 'Thợ Sen Uy Tín', icon: '🔧' },
    { id: 'chuyennghiep', name: 'Thợ Mộc Chuyên Nghiệp', icon: '🔨' }
  ]

  const services = [
    { id: 'dien', name: 'Sửa chữa điện', icon: '⚡', color: 'text-orange-500' },
    { id: 'sen', name: 'Thợ sen', icon: '🔧', color: 'text-blue-500' },
    { id: 'moc', name: 'Thợ mộc', icon: '🔨', color: 'text-yellow-600' },
    { id: 'dieuhoa', name: 'Sửa điều hòa', icon: '❄️', color: 'text-cyan-500' },
    { id: 'nha', name: 'Vệ sinh nhà cửa', icon: '🧹', color: 'text-green-500' }
  ]

  // Không còn dữ liệu giả - chỉ dùng dữ liệu thật từ API

  // Handlers cho post actions
  const handleClosePost = async (postId: string) => {
    if (!confirm('Bạn có chắc muốn đóng bài đăng này?')) return
    
    try {
      await PostService.closePost(postId)
      alert('Đóng bài đăng thành công!')
      await loadPosts() // Reload posts
      setOpenMenuId(null)
    } catch (error: any) {
      console.error('Error closing post:', error)
      alert(error.message || 'Không thể đóng bài đăng')
    }
  }

  const handleEditPost = (postId: string) => {
    router.push(`/posts/create?edit=${postId}`)
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Bạn có chắc muốn xóa bài đăng này? Hành động này không thể hoàn tác!')) return
    
    try {
      await PostService.deletePost(postId)
      alert('Xóa bài đăng thành công!')
      await loadPosts() // Reload posts
      setOpenMenuId(null)
    } catch (error: any) {
      console.error('Error deleting post:', error)
      alert(error.message || 'Không thể xóa bài đăng')
    }
  }

  // Nhắn tin với người đăng bài
  const handleSendMessageToAuthor = async (post: any) => {
    const authorId = post.customerId || post.customer?.id
    
    if (!authorId) {
      alert('Không thể xác định người đăng bài')
      return
    }

    if (currentUser && authorId === currentUser.id) {
      alert('Bạn không thể nhắn tin với chính mình')
      return
    }

    try {
      // Tạo hoặc mở cuộc trò chuyện
      await chatService.createDirectConversation({ workerId: authorId })
      // Chuyển đến trang tin nhắn
      router.push('/tin-nhan')
    } catch (error: any) {
      console.error('Error creating conversation:', error)
      alert(error.message || 'Không thể tạo cuộc trò chuyện')
    }
  }

  // Dữ liệu mẫu cho bài đăng (dùng khi không có API)
  const mockPosts = [
    {
      id: 1,
      author: 'Nguyễn Thị Mai',
      time: '8 giờ trước',
      location: 'Hải Châu, Đà Nẵng',
      title: 'Cần thợ sửa điện tại nhà nào. Mất điện toàn bộ đường Lê Duẩn. Ai sánh có thể đến ngay giúp em',
      status: 'Đăng',
      price: '200,000 - 300,000đ',
      urgent: true,
      comments: 8,
      shares: 2,
      likes: 8,
      avatar: '😊',
      avatarColor: 'from-yellow-400 to-orange-500',
      commentList: [
        {
          id: 1,
          author: 'Thợ Điện Minh',
          avatar: 'Đ',
          avatarBg: 'bg-blue-500',
          badge: 'THỢ',
          content: 'Chào chị, e chuyên sửa điện dân dụng 2 năm. Giờ nay có sánh, có thể kiểm tra và sửa được...',
          time: '1 giờ trước',
          likes: 8
        },
        {
          id: 2,
          author: 'Điện Lạnh Phát',
          avatar: 'Đ',
          avatarBg: 'bg-green-500',
          badge: 'THỢ',
          content: 'Em nhận sửa chữa điện tại nhà. Có kinh nghiệm...',
          time: '2 giờ trước',
          likes: 5
        }
      ]
    },
    {
      id: 2,
      author: 'Trần Văn Hùng',
      time: '3 giờ trước',
      location: 'Thanh Khê, Đà Nẵng',
      title: 'Cần thợ sửa ống nước bị rò rỉ gấp. Nước chảy từ tầng 2 xuống tầng 1. Nhà đang ngập nước, cần người đến ngay',
      status: 'Đăng',
      price: '150,000 - 250,000đ',
      urgent: true,
      comments: 12,
      shares: 1,
      likes: 15,
      avatar: '👨‍🔧',
      avatarColor: 'from-blue-400 to-blue-600',
      commentList: [
        {
          id: 1,
          author: 'Thợ Nước Toàn',
          avatar: 'N',
          avatarBg: 'bg-blue-600',
          badge: 'THỢ',
          content: 'Anh ơi, em là thợ nước chuyên nghiệp 5 năm kinh nghiệm. Giờ này em rảnh, có thể qua ngay ạ!',
          time: '2 giờ trước',
          likes: 10
        }
      ]
    },
    {
      id: 3,
      author: 'Lê Thị Hoa',
      time: '5 giờ trước',
      location: 'Sơn Trà, Đà Nẵng',
      title: 'Tìm thợ làm tủ bếp theo yêu cầu. Em có bản thiết kế sẵn rồi, cần thợ tư vấn và báo giá',
      status: 'Đăng',
      price: 'Thương lượng',
      urgent: false,
      comments: 6,
      shares: 3,
      likes: 12,
      avatar: '🏠',
      avatarColor: 'from-pink-400 to-pink-600',
      commentList: [
        {
          id: 1,
          author: 'Mộc Tâm',
          avatar: 'M',
          avatarBg: 'bg-yellow-600',
          badge: 'THỢ',
          content: 'Chào chị, em chuyên làm tủ bếp và nội thất gỗ. Có thể qua xem bản vẽ và báo giá cho chị ạ',
          time: '4 giờ trước',
          likes: 7
        }
      ]
    },
    {
      id: 4,
      author: 'Phạm Minh Tuấn',
      time: '6 giờ trước',
      location: 'Ngũ Hành Sơn, Đà Nẵng',
      title: 'Máy lạnh không lạnh, có tiếng kêu lạ. Cần thợ qua kiểm tra và sửa chữa. Máy Daikin 1.5HP dùng được 3 năm',
      status: 'Đăng',
      price: '200,000 - 400,000đ',
      urgent: false,
      comments: 9,
      shares: 2,
      likes: 10,
      avatar: '❄️',
      avatarColor: 'from-cyan-400 to-blue-500',
      commentList: [
        {
          id: 1,
          author: 'Điện Lạnh Hưng',
          avatar: 'H',
          avatarBg: 'bg-cyan-600',
          badge: 'THỢ',
          content: 'Anh cho em xin địa chỉ, em qua kiểm tra miễn phí. Chuyên sửa máy lạnh các hãng',
          time: '5 giờ trước',
          likes: 6
        }
      ]
    },
    {
      id: 5,
      author: 'Võ Thị Lan',
      time: '1 ngày trước',
      location: 'Cẩm Lệ, Đà Nẵng',
      title: 'Cần người vệ sinh nhà cửa tổng vệ sinh cuối năm. Nhà 2 tầng khoảng 120m2, cần lau dọn kỹ',
      status: 'Đang thực hiện',
      price: '500,000 - 700,000đ',
      urgent: false,
      comments: 15,
      shares: 5,
      likes: 20,
      avatar: '🧹',
      avatarColor: 'from-green-400 to-green-600',
      commentList: [
        {
          id: 1,
          author: 'Vệ Sinh Lan Anh',
          avatar: 'L',
          avatarBg: 'bg-green-600',
          badge: 'THỢ',
          content: 'Chị ơi, em nhận vệ sinh tổng vệ sinh nhà cửa, có đội ngũ 3 người làm nhanh và sạch ạ',
          time: '20 giờ trước',
          likes: 12
        }
      ]
    },
    {
      id: 6,
      author: 'Nguyễn Văn Bình',
      time: '1 ngày trước',
      location: 'Liên Chiểu, Đà Nẵng',
      title: 'Sửa cửa cuốn bị kẹt không lên xuống được. Cần thợ có kinh nghiệm đến sửa',
      status: 'Hoàn thành',
      price: '300,000đ',
      urgent: false,
      comments: 4,
      shares: 1,
      likes: 8,
      avatar: '🚪',
      avatarColor: 'from-gray-400 to-gray-600',
      commentList: []
    },
    {
      id: 7,
      author: 'Hoàng Thị Thu',
      time: '2 ngày trước',
      location: 'Hải Châu, Đà Nẵng',
      title: 'Tìm thợ sơn nhà trong và ngoài. Nhà 3 tầng, cần sơn lại toàn bộ. Ai có kinh nghiệm inbox báo giá nhé',
      status: 'Đăng',
      price: 'Thương lượng',
      urgent: false,
      comments: 18,
      shares: 8,
      likes: 25,
      avatar: '🎨',
      avatarColor: 'from-purple-400 to-purple-600',
      commentList: [
        {
          id: 1,
          author: 'Thợ Sơn Minh',
          avatar: 'S',
          avatarBg: 'bg-purple-600',
          badge: 'THỢ',
          content: 'Chị ơi em nhận sơn nhà, có đội thợ 5 người, làm nhanh và đẹp. Em qua xem nhà và báo giá cho chị nhé',
          time: '1 ngày trước',
          likes: 15
        },
        {
          id: 2,
          author: 'Sơn Đẹp Pro',
          avatar: 'P',
          avatarBg: 'bg-indigo-600',
          badge: 'THỢ',
          content: 'Em chuyên sơn nhà, sơn epoxy. Bảo hành 2 năm ạ',
          time: '1 ngày trước',
          likes: 8
        }
      ]
    },
    {
      id: 8,
      author: 'Đỗ Minh Châu',
      time: '2 ngày trước',
      location: 'Thanh Khê, Đà Nẵng',
      title: 'Cần thợ lắp camera an ninh cho cửa hàng. Cần lắp 4 camera, có hệ thống lưu trữ',
      status: 'Đăng',
      price: '2,000,000 - 3,000,000đ',
      urgent: true,
      comments: 11,
      shares: 3,
      likes: 14,
      avatar: '📹',
      avatarColor: 'from-red-400 to-red-600',
      commentList: [
        {
          id: 1,
          author: 'Kỹ Thuật Bảo An',
          avatar: 'K',
          avatarBg: 'bg-red-600',
          badge: 'THỢ',
          content: 'Anh ơi, em chuyên lắp đặt camera giám sát, có nhiều gói giá khác nhau. Em qua khảo sát và tư vấn miễn phí ạ',
          time: '1 ngày trước',
          likes: 9
        }
      ]
    },
    {
      id: 9,
      author: 'Trương Văn Nam',
      time: '3 ngày trước',
      location: 'Sơn Trà, Đà Nẵng',
      title: 'Bồn cầu bị tắc nghẽn, nước không chảy. Cần thợ thông tắc bồn cầu gấp',
      status: 'Hoàn thành',
      price: '150,000đ',
      urgent: true,
      comments: 7,
      shares: 1,
      likes: 9,
      avatar: '🚽',
      avatarColor: 'from-teal-400 to-teal-600',
      commentList: [
        {
          id: 1,
          author: 'Thông Tắc 24/7',
          avatar: 'T',
          avatarBg: 'bg-teal-600',
          badge: 'THỢ',
          content: 'Em nhận thông tắc bồn cầu, thông cống, hút bể phốt. Bảo hành 6 tháng',
          time: '3 ngày trước',
          likes: 5
        }
      ]
    },
    {
      id: 10,
      author: 'Lý Thị Nga',
      time: '3 ngày trước',
      location: 'Ngũ Hành Sơn, Đà Nẵng',
      title: 'Cần thợ làm cửa nhôm kính cho ban công. Diện tích khoảng 15m2, cần tư vấn loại kính tốt',
      status: 'Đăng',
      price: 'Thương lượng',
      urgent: false,
      comments: 13,
      shares: 4,
      likes: 18,
      avatar: '🪟',
      avatarColor: 'from-sky-400 to-sky-600',
      commentList: [
        {
          id: 1,
          author: 'Nhôm Kính Phát Đạt',
          avatar: 'N',
          avatarBg: 'bg-sky-600',
          badge: 'THỢ',
          content: 'Chị ơi, em chuyên làm cửa nhôm kính các loại. Em qua đo đạc và báo giá cho chị ạ',
          time: '2 ngày trước',
          likes: 11
        }
      ]
    }
  ]

  // Helper function để render avatar
  const renderAvatar = (size: 'small' | 'medium' | 'large' = 'medium') => {
    const sizeClasses = {
      small: 'w-8 h-8 text-sm',
      medium: 'w-10 h-10 text-base',
      large: 'w-12 h-12 text-lg'
    }
    const className = `${sizeClasses[size]} rounded-full flex items-center justify-center`

    if (currentUser?.avatar) {
      return (
        <img 
          src={currentUser.avatar} 
          alt="Avatar" 
          className={`${className} object-cover`}
        />
      )
    }
    
    return (
      <div className={`${className} bg-blue-500 text-white font-semibold`}>
        {currentUser?.fullName?.charAt(0).toUpperCase() || 'U'}
      </div>
    )
  }

  // Hiển thị loading khi đang kiểm tra authentication
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
    <div className="flex h-screen bg-gray-50">
      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg mx-4 shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Tạo bài viết</h2>
              <button 
                onClick={() => setShowCreatePost(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4">
              {/* User Info */}
              <div className="flex items-center space-x-3 mb-4">
                {renderAvatar('medium')}
                <div>
                  <div className="font-semibold text-gray-800">{currentUser?.fullName || currentUser?.displayName || 'Người dùng'}</div>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <span>Công khai</span>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              {postError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {postError}
                </div>
              )}

              {/* Title */}
              <input
                type="text"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder="Tiêu đề (ví dụ: Cần thợ sửa điện)"
                className="w-full p-3 mb-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Description */}
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="Mô tả chi tiết công việc cần làm..."
                className="w-full min-h-[150px] p-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-lg"
              />

              {/* Action Icons */}
              <div className="border border-gray-300 rounded-lg p-3 mb-4">
                <div className="text-sm text-gray-500 text-center">
                  Hoặc <button 
                    onClick={() => {
                      setShowCreatePost(false)
                      router.push('/posts/create')
                    }}
                    className="text-blue-500 hover:underline"
                  >
                    tạo bài đăng chi tiết hơn
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                disabled={postLoading || !postTitle.trim() || !postContent.trim()}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={async () => {
                  if (!postTitle.trim() || !postContent.trim()) {
                    setPostError('Vui lòng nhập tiêu đề và mô tả!')
                    return
                  }

                  setPostLoading(true)
                  setPostError('')

                  try {
                    const result = await PostService.createPost({
                      title: postTitle.trim(),
                      description: postContent.trim()
                    })

                    console.log('✅ Tạo bài đăng thành công:', result)
                    setShowCreatePost(false)
                    setPostContent('')
                    setPostTitle('')
                    alert('Tạo bài đăng thành công!')
                    
                    // Reload danh sách bài đăng để hiển thị bài mới
                    await loadPosts()
                    
                    // Có thể chuyển đến trang chi tiết nếu muốn
                    // router.push(`/posts/${result.id}`)
                  } catch (error: any) {
                    console.error('❌ Lỗi tạo bài:', error)
                    setPostError(error.message || 'Không thể tạo bài đăng. Vui lòng thử lại!')
                  } finally {
                    setPostLoading(false)
                  }
                }}
              >
                {postLoading ? 'Đang đăng...' : 'Đăng bài'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo/Header */}
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

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            {/* Người dùng */}
            <Link 
              href="/profile"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-blue-50 text-blue-600 transition cursor-pointer"
            >
              {renderAvatar('small')}
              <div className="flex-1">
                <div className="font-medium text-sm">{currentUser?.fullName || currentUser?.displayName || 'Người dùng'}</div>
                <div className="text-xs text-gray-500">Xem trang cá nhân</div>
              </div>
            </Link>

            {/* Menu items */}
            <Link href="/home" className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-sm">Trang chủ</span>
            </Link>

            <Link href="/don-hang" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <span className="text-sm">Đơn hàng</span>
            </Link>

            <Link href="/tin-nhan" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-sm">Tin nhắn</span>
              {unreadMessageCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadMessageCount}
                </span>
              )}
            </Link>

            <Link href="/thong-bao" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="text-sm">Thông báo</span>
              {unreadNotificationCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadNotificationCount}
                </span>
              )}
            </Link>

            <Link href="/da-luu" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <span className="text-sm">Đã lưu</span>
            </Link>

            <Link href="/bai-dang-cua-toi" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm">Bài đăng của tôi</span>
            </Link>

            <Link href="/lich-su" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">Lịch sử yêu cầu</span>
            </Link>

            <Link href="/yeu-thich" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-sm">Thợ yêu thích</span>
            </Link>
          </div>

          {/* Lĩnh vực của bạn */}
          <div className="mt-6">
            <button 
              onClick={() => setShowCategories(!showCategories)}
              className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <span className="font-medium">Lĩnh vực của bạn</span>
              <svg 
                className={`w-4 h-4 transition-transform duration-200 ${showCategories ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showCategories && (
              <div className="mt-2 space-y-1">
                {categories.map(cat => (
                  <a key={cat.id} href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 text-sm">
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Khám phá thêm mục */}
          <div className="mt-6">
            <button 
              onClick={() => setShowServices(!showServices)}
              className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <span className="font-medium">Khám phá thêm mục</span>
              <svg 
                className={`w-4 h-4 transition-transform duration-200 ${showServices ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showServices && (
              <div className="mt-2 space-y-1">
                {services.map(service => (
                  <a key={service.id} href="#" className={`flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-sm ${service.color}`}>
                    <span>{service.icon}</span>
                    <span className="text-gray-700">{service.name}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Nút Đăng xuất */}
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
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-2xl search-container">
              <input
                type="text"
                placeholder="Tìm thợ, khách hàng..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchQuery && setShowSearchResults(true)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              
              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                  {searchLoading ? (
                    <div className="p-4 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                      <p className="mt-2">Đang tìm kiếm...</p>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {searchResults.map((profile) => (
                        <button
                          key={profile.id}
                          onClick={() => {
                            router.push(`/profile?userId=${profile.id}`)
                            setShowSearchResults(false)
                            setSearchQuery('')
                          }}
                          className="w-full p-3 hover:bg-gray-50 flex items-center space-x-3 text-left transition"
                        >
                          <div className="flex-shrink-0">
                            {profile.avatar ? (
                              <img
                                src={profile.avatar}
                                alt={profile.displayName || profile.fullName}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                                {(profile.displayName || profile.fullName || 'U').charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <p className="font-medium text-gray-900 truncate">
                                {profile.displayName || profile.fullName || 'Người dùng'}
                              </p>
                              {profile.isVerified && (
                                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              )}
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                profile.accountType === 'WORKER' 
                                  ? 'bg-orange-100 text-orange-700' 
                                  : 'bg-blue-100 text-blue-700'
                              }`}>
                                {profile.accountType === 'WORKER' ? '🔧 Thợ' : '👤 Khách'}
                              </span>
                            </div>
                            {profile.bio && (
                              <p className="text-sm text-gray-500 truncate mt-0.5">
                                {profile.bio}
                              </p>
                            )}
                            <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                              {profile.rating && (
                                <span className="flex items-center">
                                  ⭐ {profile.rating.toFixed(1)}
                                </span>
                              )}
                              {profile.completedJobs !== undefined && (
                                <span>
                                  ✅ {profile.completedJobs} công việc
                                </span>
                              )}
                              {profile.location?.city && (
                                <span>
                                  📍 {profile.location.city}
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <svg className="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <p className="font-medium">Không tìm thấy kết quả</p>
                      <p className="text-sm mt-1">Thử tìm kiếm với từ khóa khác</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Thông báo */}
            <Link href="/thong-bao" className="relative hover:bg-gray-100 p-2 rounded-full transition">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadNotificationCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadNotificationCount}
                </span>
              )}
            </Link>

            {/* Đơn hàng */}
            <Link href="/don-hang" className="relative hover:bg-gray-100 p-2 rounded-full transition">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </Link>

            <Link href="/profile" className="cursor-pointer">
              {renderAvatar('small')}
            </Link>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-3xl mx-auto py-6 px-4">
            {/* Create Post Section */}
            <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
              <div className="flex items-center space-x-3">
                {renderAvatar('medium')}
                <input
                  type="text"
                  placeholder="Bạn cần tìm thợ gì?"
                  onClick={() => setShowCreatePost(true)}
                  readOnly
                  className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 cursor-pointer"
                />
              </div>
              
              {/* Filter Buttons */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <button className="flex items-center space-x-2 px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">Ảnh/Video</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-medium">Vị trí</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">Thời gian</span>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm mb-4">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`flex-1 px-6 py-3 text-sm font-medium ${
                    activeTab === 'all'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => setActiveTab('services')}
                  className={`flex-1 px-6 py-3 text-sm font-medium ${
                    activeTab === 'services'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Gần tôi
                </button>
                <button
                  onClick={() => setActiveTab('jobs')}
                  className={`flex-1 px-6 py-3 text-sm font-medium ${
                    activeTab === 'jobs'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Gấp
                </button>
              </div>
            </div>

            {/* Filter and Sort Section */}
            <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
              <div className="flex items-center justify-between gap-3">
                {/* Left: Sort Buttons */}
                <div className="flex items-center gap-2 flex-1">
                  <button
                    onClick={() => setSortBy('latest')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      sortBy === 'latest'
                        ? 'bg-blue-500 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Đăng Mới
                  </button>
                  <button
                    onClick={() => setSortBy('relevant')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      sortBy === 'relevant'
                        ? 'bg-blue-500 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Phù hợp
                  </button>
                  <button
                    onClick={() => setSortBy('recent')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      sortBy === 'recent'
                        ? 'bg-blue-500 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Gần đây
                  </button>
                  <button
                    onClick={() => setSortBy('urgent')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      sortBy === 'urgent'
                        ? 'bg-blue-500 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Gấp
                  </button>
                </div>

                {/* Right: More Filters Dropdown */}
                <div className="relative filter-dropdown-container">
                  <button
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    <span>Bộ lọc</span>
                    <svg className={`w-4 h-4 transition-transform ${
                      showFilterDropdown ? 'rotate-180' : ''
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Filter Dropdown */}
                  {showFilterDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                      <button className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 text-sm transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Theo giá</span>
                      </button>
                      <button className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 text-sm transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Theo địa điểm</span>
                      </button>
                      <button className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 text-sm transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span>Theo danh mục</span>
                      </button>
                      <div className="border-t border-gray-200 my-2"></div>
                      <button className="w-full px-4 py-2.5 text-left hover:bg-blue-50 flex items-center gap-3 text-blue-600 text-sm transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Đặt lại bộ lọc</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Posts */}
            {loadingPosts ? (
              <>
                <SkeletonPost />
                <SkeletonPost />
                <SkeletonPost />
              </>
            ) : posts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Chưa có bài đăng nào</h3>
                <p className="text-gray-500 mb-6">Hãy là người đầu tiên tạo bài đăng!</p>
                <button
                  onClick={() => setShowCreatePost(true)}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Tạo bài đăng
                </button>
              </div>
            ) : (
              getSortedPosts()
                .filter(post => !hiddenPosts.has(post.id)) // Lọc bỏ các bài viết đã ẩn
                .map(post => {
                // Kiểm tra xem bài viết có phải của currentUser không
                // So sánh nhiều trường có thể có
                const isMyPost = 
                  post.customerId === currentUser?.id || 
                  post.customer?.id === currentUser?.id ||
                  post.userId === currentUser?.id ||
                  post.authorId === currentUser?.id ||
                  // So sánh theo tên nếu không có ID
                  (post.customer?.fullName === currentUser?.fullName && currentUser?.fullName)
                
                const postAuthor = isMyPost ? currentUser : post.customer
                
                return (
                <div key={post.id} className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
                  {/* Post Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {/* Hiển thị avatar của currentUser nếu có */}
                      {currentUser?.avatar && isMyPost ? (
                        <img 
                          src={currentUser.avatar} 
                          alt="Avatar" 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : postAuthor?.avatar ? (
                        <img 
                          src={postAuthor.avatar} 
                          alt="Avatar" 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className={`w-10 h-10 bg-gradient-to-br ${post.avatarColor || postAuthor?.avatarUrl || 'from-blue-400 to-blue-600'} rounded-full flex items-center justify-center text-white font-semibold`}>
                          {post.avatar || (postAuthor?.fullName ? postAuthor.fullName.charAt(0).toUpperCase() : currentUser?.fullName?.charAt(0).toUpperCase() || 'U')}
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-800">{postAuthor?.fullName || post.author || currentUser?.fullName || 'Người dùng'}</h3>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>{post.time || new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                          <span>•</span>
                          <span>{post.location || 'Chưa cập nhật'}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Dropdown Menu - Luôn hiển thị nút, kiểm tra ownership trong menu */}
                    <div className="relative post-menu-container">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenMenuId(openMenuId === post.id ? null : post.id)
                        }}
                        className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>

                      {/* Dropdown Menu */}
                      {openMenuId === post.id && (
                        <div 
                          className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Kiểm tra ownership */}
                          {currentUser && post.customerId === currentUser.id ? (
                            <>
                              {/* Menu cho chủ bài viết */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEditPost(post.id)
                                }}
                                className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 text-sm transition-colors"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <span>Chỉnh sửa</span>
                              </button>

                              {post.status === 'OPEN' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleClosePost(post.id)
                                  }}
                                  className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 text-sm transition-colors"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span>Đóng bài đăng</span>
                                </button>
                              )}

                              <div className="border-t border-gray-200 my-2"></div>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeletePost(post.id)
                                }}
                                className="w-full px-4 py-2.5 text-left hover:bg-red-50 flex items-center gap-3 text-red-600 text-sm transition-colors"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span>Xóa</span>
                              </button>
                            </>
                          ) : (
                            <>
                              {/* Menu cho người dùng khác */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setOpenMenuId(null)
                                  const newInterested = new Set(interestedPosts)
                                  if (newInterested.has(post.id)) {
                                    newInterested.delete(post.id)
                                    alert('Đã bỏ quan tâm bài viết!')
                                  } else {
                                    newInterested.add(post.id)
                                    alert('Đã quan tâm đến bài viết!')
                                  }
                                  setInterestedPosts(newInterested)
                                  localStorage.setItem('interestedPosts', JSON.stringify([...newInterested]))
                                }}
                                className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 text-sm transition-colors"
                              >
                                <svg className={`w-5 h-5 ${interestedPosts.has(post.id) ? 'fill-red-500 text-red-500' : ''}`} fill={interestedPosts.has(post.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <span>{interestedPosts.has(post.id) ? 'Bỏ quan tâm' : 'Quan tâm'}</span>
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setOpenMenuId(null)
                                  const newSaved = new Set(savedPosts)
                                  if (newSaved.has(post.id)) {
                                    newSaved.delete(post.id)
                                    console.log('🗑️ Đã bỏ lưu bài viết:', post.id)
                                    alert('Đã bỏ lưu bài viết!')
                                  } else {
                                    newSaved.add(post.id)
                                    console.log('💾 Đã lưu bài viết:', post.id)
                                    console.log('💾 Danh sách đã lưu:', [...newSaved])
                                    alert('Đã lưu bài viết!')
                                  }
                                  setSavedPosts(newSaved)
                                  localStorage.setItem('savedPosts', JSON.stringify([...newSaved]))
                                  console.log('💾 Đã cập nhật localStorage:', localStorage.getItem('savedPosts'))
                                }}
                                className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 text-sm transition-colors"
                              >
                                <svg className={`w-5 h-5 ${savedPosts.has(post.id) ? 'fill-blue-500 text-blue-500' : ''}`} fill={savedPosts.has(post.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                </svg>
                                <span>{savedPosts.has(post.id) ? 'Bỏ lưu' : 'Lưu bài viết'}</span>
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setOpenMenuId(null)
                                  const newNotified = new Set(notifiedPosts)
                                  if (newNotified.has(post.id)) {
                                    newNotified.delete(post.id)
                                    alert('Đã tắt thông báo cho bài viết này!')
                                  } else {
                                    newNotified.add(post.id)
                                    alert('Đã bật thông báo cho bài viết này!')
                                  }
                                  setNotifiedPosts(newNotified)
                                  localStorage.setItem('notifiedPosts', JSON.stringify([...newNotified]))
                                }}
                                className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 text-sm transition-colors"
                              >
                                <svg className={`w-5 h-5 ${notifiedPosts.has(post.id) ? 'fill-yellow-500 text-yellow-500' : ''}`} fill={notifiedPosts.has(post.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <span>{notifiedPosts.has(post.id) ? 'Tắt thông báo' : 'Bật thông báo cho bài viết này'}</span>
                              </button>

                              <div className="border-t border-gray-200 my-2"></div>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setOpenMenuId(null)
                                  const newHidden = new Set(hiddenPosts)
                                  newHidden.add(post.id)
                                  setHiddenPosts(newHidden)
                                  localStorage.setItem('hiddenPosts', JSON.stringify([...newHidden]))
                                  alert('Đã ẩn bài viết! Bài viết sẽ không hiển thị nữa.')
                                }}
                                className="w-full px-4 py-2.5 text-left hover:bg-red-50 flex items-center gap-3 text-red-600 text-sm transition-colors"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                                <span>Ẩn bài viết</span>
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <Link href={`/posts/${post.id}`} className="block p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <p className="text-gray-800 mb-3 hover:text-blue-600">{post.title}</p>
                  <div className="flex items-center space-x-3 text-sm">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full font-medium ${
                      post.status === 'Đăng' ? 'bg-green-100 text-green-800' :
                      post.status === 'Đang thực hiện' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {post.status}
                    </span>
                    <span className="inline-flex items-center text-green-600 font-semibold">
                      {post.price}
                    </span>
                    {post.urgent && (
                      <span className="inline-flex items-center text-orange-500">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        Gấp
                      </span>
                    )}
                  </div>
                </Link>

                {/* Image Placeholder */}
                <div className="bg-gradient-to-br from-blue-100 to-blue-50 h-48 flex items-center justify-center">
                  <svg className="w-16 h-16 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>

                {/* Post Stats */}
                <div className="px-4 py-2 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                  <span>{post.likes} lượt thích</span>
                  <div className="flex items-center space-x-4">
                    <span>{post.comments} bình luận</span>
                    <span>•</span>cd
                    <span>{post.shares} lượt chia sẻ</span>
                  </div>
                </div>

                {/* Post Actions */}
                <div className="px-4 py-2 border-t border-gray-100 flex items-center justify-around">
                  <button className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 rounded-lg transition">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    <span className="text-gray-700 font-medium">Thích</span>
                  </button>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/posts/${post.id}?action=quote`)
                    }}
                    className="flex items-center space-x-2 px-4 py-2 hover:bg-green-50 rounded-lg transition"
                  >
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-green-600 font-medium">Chào giá</span>
                  </button>

                  <button className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 rounded-lg transition">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <span className="text-gray-700 font-medium">Chia sẻ</span>
                  </button>
                </div>

                {/* Comments Section */}
                {post.commentList && post.commentList.length > 0 && (
                  <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                    {post.commentList.map((comment: any) => (
                      <div key={comment.id} className="flex items-start space-x-3 mb-3 last:mb-0">
                        <div className={`w-8 h-8 ${comment.avatarBg} rounded-full flex items-center justify-center text-white text-sm font-semibold`}>
                          {comment.avatar}
                        </div>
                        <div className="flex-1 bg-white rounded-lg p-3 shadow-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-sm">{comment.author}</span>
                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                              {comment.badge}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{comment.content}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span>{comment.time}</span>
                            <button className="text-blue-600 hover:underline">Thích</button>
                            <button className="text-blue-600 hover:underline">Trả lời</button>
                            <span>👍 {comment.likes}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

