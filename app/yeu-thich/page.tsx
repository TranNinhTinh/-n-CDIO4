'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthService } from '@/lib/api/auth.service'
import Image from 'next/image'

interface Worker {
  id: string
  name: string
  avatar: string
  service: string
  rating: number
  reviewCount: number
  completedJobs: number
  location: string
  phone: string
  specialties: string[]
  experience: string
  hourlyRate: string
  isVerified: boolean
  isOnline: boolean
  lastActive: string
}

const MOCK_WORKERS: Worker[] = [
  {
    id: '1',
    name: 'Thợ Điện Minh',
    avatar: '⚡',
    service: 'Sửa chữa điện',
    rating: 4.9,
    reviewCount: 156,
    completedJobs: 234,
    location: 'Hải Châu, Đà Nẵng',
    phone: '0905123456',
    specialties: ['Điện dân dụng', 'Điện công nghiệp', 'Điện lạnh'],
    experience: '8 năm',
    hourlyRate: '150,000 - 200,000đ/giờ',
    isVerified: true,
    isOnline: true,
    lastActive: 'Đang hoạt động'
  },
  {
    id: '2',
    name: 'Thợ Nước Toàn',
    avatar: '🔧',
    service: 'Thợ nước',
    rating: 4.8,
    reviewCount: 98,
    completedJobs: 145,
    location: 'Thanh Khê, Đà Nẵng',
    phone: '0912345678',
    specialties: ['Sửa ống nước', 'Thông tắc', 'Lắp đặt thiết bị vệ sinh'],
    experience: '5 năm',
    hourlyRate: '120,000 - 180,000đ/giờ',
    isVerified: true,
    isOnline: false,
    lastActive: '2 giờ trước'
  },
  {
    id: '3',
    name: 'Mộc Tâm',
    avatar: '🪵',
    service: 'Thợ mộc',
    rating: 5.0,
    reviewCount: 67,
    completedJobs: 89,
    location: 'Sơn Trà, Đà Nẵng',
    phone: '0923456789',
    specialties: ['Tủ bếp', 'Nội thất gỗ', 'Sửa chữa đồ gỗ'],
    experience: '10 năm',
    hourlyRate: '180,000 - 250,000đ/giờ',
    isVerified: true,
    isOnline: true,
    lastActive: 'Đang hoạt động'
  },
  {
    id: '4',
    name: 'Điện Lạnh Hưng',
    avatar: '❄️',
    service: 'Điện lạnh',
    rating: 4.7,
    reviewCount: 124,
    completedJobs: 178,
    location: 'Ngũ Hành Sơn, Đà Nẵng',
    phone: '0934567890',
    specialties: ['Sửa máy lạnh', 'Vệ sinh máy lạnh', 'Lắp đặt điều hòa'],
    experience: '7 năm',
    hourlyRate: '150,000 - 200,000đ/giờ',
    isVerified: true,
    isOnline: true,
    lastActive: 'Đang hoạt động'
  },
  {
    id: '5',
    name: 'Thợ Sơn Phát',
    avatar: '🎨',
    service: 'Sơn nhà',
    rating: 4.6,
    reviewCount: 45,
    completedJobs: 67,
    location: 'Cẩm Lệ, Đà Nẵng',
    phone: '0945678901',
    specialties: ['Sơn nhà', 'Sơn epoxy', 'Chống thấm'],
    experience: '6 năm',
    hourlyRate: '140,000 - 190,000đ/giờ',
    isVerified: false,
    isOnline: false,
    lastActive: '1 ngày trước'
  },
  {
    id: '6',
    name: 'Kỹ Thuật Bảo An',
    avatar: '📹',
    service: 'Lắp camera',
    rating: 4.9,
    reviewCount: 82,
    completedJobs: 112,
    location: 'Liên Chiểu, Đà Nẵng',
    phone: '0956789012',
    specialties: ['Camera an ninh', 'Hệ thống báo động', 'Kiểm soát ra vào'],
    experience: '9 năm',
    hourlyRate: '200,000 - 300,000đ/giờ',
    isVerified: true,
    isOnline: false,
    lastActive: '3 giờ trước'
  }
]

export default function FavoritesPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [favorites, setFavorites] = useState<Worker[]>(MOCK_WORKERS)
  const [selectedService, setSelectedService] = useState<string>('all')

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

  const handleRemoveFavorite = (id: string) => {
    setFavorites(prev => prev.filter(worker => worker.id !== id))
  }

  const services = ['all', ...Array.from(new Set(favorites.map(w => w.service)))]
  const filteredWorkers = selectedService === 'all' 
    ? favorites 
    : favorites.filter(w => w.service === selectedService)

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

            <a href="/yeu-thich" className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">Thợ yêu thích</span>
              <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{favorites.length}</span>
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
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Thợ yêu thích</h1>
            
            {/* Service Filter */}
            <div className="flex gap-2 flex-wrap">
              {services.map((service) => (
                <button
                  key={service}
                  onClick={() => setSelectedService(service)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    selectedService === service
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {service === 'all' ? 'Tất cả' : service}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-6">
            {filteredWorkers.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Chưa có thợ yêu thích</h3>
                <p className="text-gray-500">Thêm thợ vào danh sách yêu thích để liên hệ nhanh hơn</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredWorkers.map((worker) => (
                  <div key={worker.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl">
                              {worker.avatar}
                            </div>
                            {worker.isOnline && (
                              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-bold text-gray-900">{worker.name}</h3>
                              {worker.isVerified && (
                                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <p className="text-sm text-blue-600 font-medium">{worker.service}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveFavorite(worker.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Bỏ yêu thích"
                        >
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="text-center p-2 bg-yellow-50 rounded-lg">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="font-bold text-gray-900">{worker.rating}</span>
                          </div>
                          <p className="text-xs text-gray-600">{worker.reviewCount} đánh giá</p>
                        </div>
                        <div className="text-center p-2 bg-green-50 rounded-lg">
                          <div className="font-bold text-gray-900 mb-1">{worker.completedJobs}</div>
                          <p className="text-xs text-gray-600">Việc hoàn thành</p>
                        </div>
                        <div className="text-center p-2 bg-blue-50 rounded-lg">
                          <div className="font-bold text-gray-900 mb-1">{worker.experience}</div>
                          <p className="text-xs text-gray-600">Kinh nghiệm</p>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="space-y-2 mb-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          <span>{worker.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-semibold text-green-600">{worker.hourlyRate}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {worker.isOnline ? worker.lastActive : `Hoạt động ${worker.lastActive}`}
                        </div>
                      </div>

                      {/* Specialties */}
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-2">Chuyên môn:</p>
                        <div className="flex flex-wrap gap-2">
                          {worker.specialties.map((specialty, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm">
                          Nhắn tin
                        </button>
                        <button className="flex-1 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium text-sm">
                          Gọi điện
                        </button>
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
