'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { AuthService } from '@/lib/api/services'
import Image from 'next/image'
import SkeletonPostDetail from '@/app/components/SkeletonPostDetail'

// Sample data - sẽ thay bằng API sau
const SAMPLE_POSTS = [
  {
    id: '1',
    title: 'Cần thợ sửa điện nước tại quận 1',
    service: 'Sửa chữa điện nước',
    description: 'Cần thợ có kinh nghiệm sửa chữa hệ thống điện nước trong nhà. Công việc bao gồm: kiểm tra và sửa chữa các điểm điện bị hỏng, thay thế ổ cắm, công tắc, và kiểm tra hệ thống nước.',
    price: '500,000 - 1,000,000 VNĐ',
    location: 'Quận 1, TP.HCM',
    postedBy: {
      name: 'Nguyễn Văn A',
      accountType: 'CUSTOMER',
      avatar: null,
      rating: 4.5,
      reviewsCount: 12
    },
    postedAt: '2 giờ trước',
    status: 'Đang tìm thợ',
    images: [],
    requirements: [
      'Có chứng chỉ hành nghề điện',
      'Kinh nghiệm tối thiểu 2 năm',
      'Có bảo hiểm lao động',
      'Mang theo dụng cụ cá nhân'
    ],
    workSchedule: {
      startDate: '15/11/2025',
      expectedDuration: '1-2 ngày',
      workingHours: '8:00 - 17:00'
    },
    comments: [
      {
        id: '1',
        author: 'Trần Văn B',
        accountType: 'WORKER',
        avatar: null,
        content: 'Em có 5 năm kinh nghiệm sửa điện nước, có thể nhận việc này ạ!',
        postedAt: '1 giờ trước',
        rating: 4.8
      },
      {
        id: '2',
        author: 'Lê Thị C',
        accountType: 'WORKER',
        avatar: null,
        content: 'Chị có thể làm vào cuối tuần được không ạ? Em sẵn sàng nhận việc.',
        postedAt: '30 phút trước',
        rating: 4.6
      }
    ]
  },
  {
    id: '2',
    title: 'Tìm thợ sơn nhà 3 tầng',
    service: 'Sơn nhà',
    description: 'Cần thuê thợ sơn nhà 3 tầng, tổng diện tích khoảng 150m². Yêu cầu sơn lại toàn bộ tường ngoài và trong, bao gồm cả trần nhà.',
    price: '15,000,000 - 20,000,000 VNĐ',
    location: 'Quận 7, TP.HCM',
    postedBy: {
      name: 'Phạm Minh D',
      accountType: 'CUSTOMER',
      avatar: null,
      rating: 4.2,
      reviewsCount: 8
    },
    postedAt: '5 giờ trước',
    status: 'Đang tìm thợ',
    images: [],
    requirements: [
      'Đội ngũ tối thiểu 3-4 người',
      'Có kinh nghiệm sơn nhà cao tầng',
      'Bảo hành tối thiểu 1 năm',
      'Hoàn thành trong 1 tuần'
    ],
    workSchedule: {
      startDate: '20/11/2025',
      expectedDuration: '5-7 ngày',
      workingHours: 'Cả ngày (8:00 - 18:00)'
    },
    comments: [
      {
        id: '3',
        author: 'Đội sơn Hùng Mạnh',
        accountType: 'WORKER',
        avatar: null,
        content: 'Đội em có 5 thợ, chuyên sơn nhà cao tầng. Bảo hành 2 năm ạ!',
        postedAt: '3 giờ trước',
        rating: 4.9
      }
    ]
  },
  {
    id: '3',
    title: 'Cần thợ làm tủ bếp gỗ công nghiệp',
    service: 'Mộc - Đồ gỗ',
    description: 'Cần thợ mộc có tay nghề cao để làm bộ tủ bếp gỗ công nghiệp, bao gồm tủ trên, tủ dưới, quầy bar và các ngăn kéo. Diện tích bếp 4m x 3m.',
    price: 'Thỏa thuận (dự kiến 25-30 triệu)',
    location: 'Quận Bình Thạnh, TP.HCM',
    postedBy: {
      name: 'Hoàng Thu E',
      accountType: 'CUSTOMER',
      avatar: null,
      rating: 4.7,
      reviewsCount: 15
    },
    postedAt: '1 ngày trước',
    status: 'Đang tìm thợ',
    images: [],
    requirements: [
      'Có portfolio về tủ bếp đã làm',
      'Tư vấn thiết kế miễn phí',
      'Bảo hành tối thiểu 2 năm',
      'Có kinh nghiệm 5 năm trở lên'
    ],
    workSchedule: {
      startDate: '25/11/2025',
      expectedDuration: '2-3 tuần',
      workingHours: 'Linh hoạt'
    },
    comments: [
      {
        id: '4',
        author: 'Xưởng mộc Tân Phát',
        accountType: 'WORKER',
        avatar: null,
        content: 'Xưởng em chuyên làm tủ bếp cao cấp, có thể tư vấn thiết kế 3D miễn phí. Bảo hành 3 năm!',
        postedAt: '18 giờ trước',
        rating: 5.0
      },
      {
        id: '5',
        author: 'Nguyễn Văn F',
        accountType: 'WORKER',
        avatar: null,
        content: 'Anh có thể cho em xem hình ảnh không gian bếp được không ạ?',
        postedAt: '12 giờ trước',
        rating: 4.5
      }
    ]
  }
]

interface Comment {
  id: string
  author: string
  accountType: string
  avatar: string | null
  content: string
  postedAt: string
  rating: number
}

interface Post {
  id: string
  title: string
  service: string
  description: string
  price: string
  location: string
  postedBy: {
    name: string
    accountType: string
    avatar: string | null
    rating: number
    reviewsCount: number
  }
  postedAt: string
  status: string
  images: string[]
  requirements: string[]
  workSchedule: {
    startDate: string
    expectedDuration: string
    workingHours: string
  }
  comments: Comment[]
}

export default function PostDetailPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string

  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [isApplying, setIsApplying] = useState(false)

  useEffect(() => {
    // Kiểm tra authentication
    if (!AuthService.isAuthenticated()) {
      router.push('/dang-nhap')
      return
    }

    // Load post data
    loadPost()
  }, [postId])

  const loadPost = () => {
    setLoading(true)
    
    // Tìm post từ sample data
    const foundPost = SAMPLE_POSTS.find(p => p.id === postId)
    
    if (foundPost) {
      setPost(foundPost)
    }
    
    setLoading(false)
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
    const newCommentObj: Comment = {
      id: String(Date.now()),
      author: 'Bạn',
      accountType: 'WORKER',
      avatar: null,
      content: newComment,
      postedAt: 'Vừa xong',
      rating: 4.5
    }
    
    if (post) {
      setPost({
        ...post,
        comments: [...post.comments, newCommentObj]
      })
    }
    
    setNewComment('')
  }

  if (loading) {
    return <SkeletonPostDetail />
  }

  if (!post) {
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
          <div className="flex items-center gap-3">
            <Image 
              src="/thotot-logo.png" 
              alt="THỢ TỐT" 
              width={40} 
              height={40}
              className="object-contain"
            />
            <h1 className="text-xl font-bold text-gray-800">Chi tiết công việc</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Post Info Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              {/* Status Badge */}
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {post.status}
                </span>
              </div>

              {/* Title & Service */}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{post.title}</h1>
              <div className="flex items-center gap-2 text-blue-600 mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span className="font-medium">{post.service}</span>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Mô tả công việc</h3>
                <p className="text-gray-700 leading-relaxed">{post.description}</p>
              </div>

              {/* Price & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Mức lương</p>
                    <p className="font-semibold text-gray-900">{post.price}</p>
                  </div>
                </div>
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
              </div>

              {/* Requirements */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Yêu cầu</h3>
                <ul className="space-y-2">
                  {post.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Work Schedule */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Lịch làm việc</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-700">Ngày bắt đầu: <strong>{post.workSchedule.startDate}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700">Thời gian dự kiến: <strong>{post.workSchedule.expectedDuration}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700">Giờ làm việc: <strong>{post.workSchedule.workingHours}</strong></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Bình luận ({post.comments.length})
              </h3>

              {/* Comment Input */}
              <div className="mb-6">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Viết bình luận..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={handlePostComment}
                    disabled={!newComment.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Gửi bình luận
                  </button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 p-4 bg-gray-50 rounded-lg">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                        {comment.author.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{comment.author}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          comment.accountType === 'WORKER' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {comment.accountType === 'WORKER' ? 'Thợ' : 'Khách hàng'}
                        </span>
                        <div className="flex items-center gap-1 text-sm">
                          <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                          <span className="text-gray-600">{comment.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-1">{comment.content}</p>
                      <span className="text-sm text-gray-500">{comment.postedAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              {/* Posted By */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Người đăng</h3>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
                    {post.postedBy.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{post.postedBy.name}</h4>
                    <span className={`inline-block px-2 py-0.5 rounded text-xs mt-1 ${
                      post.postedBy.accountType === 'WORKER' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {post.postedBy.accountType === 'WORKER' ? 'Thợ' : 'Khách hàng'}
                    </span>
                    <div className="flex items-center gap-1 mt-2">
                      <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">{post.postedBy.rating}</span>
                      <span className="text-sm text-gray-500">({post.postedBy.reviewsCount} đánh giá)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Posted Time */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">Đăng {post.postedAt}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
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
