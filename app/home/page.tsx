'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { AuthService } from '@/lib/api/auth.service'
import SkeletonPost from '@/app/components/SkeletonPost'

export default function HomePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [postContent, setPostContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Kiểm tra authentication khi component mount
  useEffect(() => {
    const checkAuth = () => {
      if (!AuthService.isAuthenticated()) {
        // Chưa đăng nhập, chuyển về trang đăng nhập
        router.push('/dang-nhap')
      } else {
        setIsLoading(false)
      }
    }
    
    checkAuth()
  }, [router])

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

  // Dữ liệu mẫu cho bài đăng
  const posts = [
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
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  U
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Người dùng</div>
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
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="Bạn đang tìm gì thế ?"
                className="w-full min-h-[150px] p-3 text-gray-800 placeholder-gray-400 focus:outline-none resize-none text-lg"
              />

              {/* Action Icons */}
              <div className="border border-gray-300 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Thêm vào bài viết của bạn</span>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition">
                      <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition">
                      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                      </svg>
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition">
                      <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition">
                      <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition">
                      <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition">
                      <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                onClick={() => {
                  // Xử lý đăng bài
                  console.log('Đăng bài:', postContent)
                  setShowCreatePost(false)
                  setPostContent('')
                }}
              >
                Đăng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo/Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Thợ Tốt"
              width={150}
              height={120}
              className="object-contain"
            />
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            {/* Người dùng */}
            <a 
              href="/profile"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition cursor-pointer"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                U
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">Người dùng</div>
                <div className="text-xs text-gray-500">Xem trang cá nhân</div>
              </div>
            </a>

            {/* Menu items */}
            <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-sm">Trang chủ</span>
            </a>

            <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-sm">Tin nhắn</span>
              <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">6</span>
            </a>

            <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="text-sm">Thông báo</span>
              <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">12</span>
            </a>

            <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <span className="text-sm">Đã lưu</span>
            </a>

            <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">Lịch sử yêu cầu</span>
            </a>

            <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-sm">Thợ yêu thích</span>
            </a>
          </div>

          {/* Lĩnh vực của bạn */}
          <div className="mt-6">
            <button className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
              <span className="font-medium">Lĩnh vực của bạn</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="mt-2 space-y-1">
              {categories.map(cat => (
                <a key={cat.id} href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 text-sm">
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Khám phá thêm mục */}
          <div className="mt-6">
            <button className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
              <span className="font-medium">Khám phá thêm mục</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="mt-2 space-y-1">
              {services.map(service => (
                <a key={service.id} href="#" className={`flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-sm ${service.color}`}>
                  <span>{service.icon}</span>
                  <span className="text-gray-700">{service.name}</span>
                </a>
              ))}
            </div>
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
            <div className="relative flex-1 max-w-2xl">
              <input
                type="text"
                placeholder="Bạn cần tìm gì?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <button className="relative">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
            </button>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer">
              U
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-3xl mx-auto py-6 px-4">
            {/* Create Post Section */}
            <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  U
                </div>
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

            {/* Posts */}
            {isLoading ? (
              <>
                <SkeletonPost />
                <SkeletonPost />
                <SkeletonPost />
              </>
            ) : (
              posts.map(post => (
                <div key={post.id} className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
                  {/* Post Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${post.avatarColor} rounded-full flex items-center justify-center text-white font-semibold`}>
                        {post.avatar}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{post.author}</h3>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>{post.time}</span>
                          <span>•</span>
                          <span>{post.location}</span>
                        </div>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
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
                  <button className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 rounded-lg transition">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="text-gray-700 font-medium">Chào giá</span>
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
                    {post.commentList.map(comment => (
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
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

