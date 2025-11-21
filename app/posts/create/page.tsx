'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PostService } from '@/lib/api/post.service'
import { AuthService } from '@/lib/api/auth.service'
import type { CreatePostDto } from '@/lib/api'

export default function CreatePostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    // Kiểm tra authentication
    if (!AuthService.isAuthenticated()) {
      alert('Vui lòng đăng nhập để tạo bài đăng!')
      router.push('/dang-nhap')
      return
    }
    setCheckingAuth(false)
  }, [])
  const [formData, setFormData] = useState<CreatePostDto>({
    title: '',
    description: '',
    location: '',
    desiredTime: '',
    budget: undefined,
    imageUrls: []
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.title.trim()) {
      setError('Vui lòng nhập tiêu đề!')
      return
    }
    if (!formData.description.trim()) {
      setError('Vui lòng nhập mô tả!')
      return
    }

    setLoading(true)

    try {
      const postData: CreatePostDto = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        ...(formData.location && { location: formData.location.trim() }),
        ...(formData.desiredTime && { desiredTime: new Date(formData.desiredTime).toISOString() }),
        ...(formData.budget && { budget: Number(formData.budget) }),
        ...(formData.imageUrls && formData.imageUrls.length > 0 && { imageUrls: formData.imageUrls })
      }

      console.log('📝 Creating post with data:', postData)

      const result = await PostService.createPost(postData)
      
      console.log('✅ Post created successfully:', result)
      alert('Tạo bài đăng thành công!')
      router.push(`/posts/${result.id}`)
    } catch (err: any) {
      console.error('❌ Lỗi tạo bài đăng:', err)
      
      // Kiểm tra nếu là lỗi authentication
      if (err.message.includes('đăng nhập') || err.message.includes('phiên')) {
        setError(err.message)
        setTimeout(() => {
          router.push('/dang-nhap')
        }, 2000)
      } else {
        setError(err.message || 'Tạo bài đăng thất bại!')
      }
    } finally {
      setLoading(false)
    }
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra đăng nhập...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/home" className="text-blue-500 hover:text-blue-600 flex items-center gap-2 mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Tạo bài đăng mới</h1>
          <p className="text-gray-600 mt-2">Mô tả công việc bạn cần để tìm thợ phù hợp</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Tiêu đề */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiêu đề <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Ví dụ: Cần thợ sửa điện nước tại nhà"
                required
              />
            </div>

            {/* Mô tả */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả chi tiết <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                placeholder="Mô tả chi tiết công việc cần làm..."
                rows={6}
                required
              />
            </div>

            {/* Địa điểm */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Địa điểm
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Ví dụ: Quận 1, TP.HCM"
              />
            </div>

            {/* Thời gian mong muốn */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thời gian mong muốn
              </label>
              <input
                type="datetime-local"
                value={formData.desiredTime}
                onChange={(e) => setFormData({ ...formData, desiredTime: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Ngân sách */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngân sách (VNĐ)
              </label>
              <input
                type="number"
                value={formData.budget || ''}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Ví dụ: 500000"
                min="0"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Đang tạo...' : 'Tạo bài đăng'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
