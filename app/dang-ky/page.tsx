'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ThoTotLogo from '../components/ThoTotLogo'
import { AuthService, RegisterRequest } from '@/lib/api/auth.service'

export default function DangKy() {
  const router = useRouter()
  const [accountType, setAccountType] = useState<'CUSTOMER' | 'WORKER' | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Kiểm tra loại tài khoản
    if (!accountType) {
      setError('Vui lòng chọn loại tài khoản!')
      return
    }
    
    // Kiểm tra mật khẩu khớp
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!')
      return
    }

    setLoading(true)

    try {
      // Chuẩn bị dữ liệu đăng ký
      const registerData: RegisterRequest = {
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        phoneNumber: formData.phone,
        accountType: accountType
      }

      // Gọi API đăng ký
      const response = await AuthService.register(registerData)
      
      console.log('✅ Đăng ký thành công:', response)
      
      // Xóa token sau khi đăng ký (buộc người dùng phải đăng nhập lại)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
      }
      
      // Chuyển hướng đến trang đăng nhập
      alert('Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.')
      router.push('/dang-nhap')
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Đăng ký thất bại. Vui lòng kiểm tra lại thông tin!')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        {/* Phần đầu trang */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <ThoTotLogo className="w-56 md:w-64" />
          </div>
          <p className="text-gray-600 text-sm">Kết nối khách hàng và thợ chuyên nghiệp</p>
        </div>

        {/* Tiêu đề */}
        <h2 className="text-xl font-bold text-center text-gray-800 mb-6">Đăng ký tài khoản</h2>

        {/* Chọn loại tài khoản */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3 text-center">Loại tài khoản</p>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setAccountType('CUSTOMER')}
              className={`flex-1 p-4 rounded-lg border-2 transition duration-200 ${
                accountType === 'CUSTOMER'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                  accountType === 'CUSTOMER' ? 'bg-blue-500' : 'bg-gray-300'
                }`}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className={`text-sm font-medium ${
                  accountType === 'CUSTOMER' ? 'text-blue-500' : 'text-gray-600'
                }`}>
                  Khách hàng
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setAccountType('WORKER')}
              className={`flex-1 p-4 rounded-lg border-2 transition duration-200 ${
                accountType === 'WORKER'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                  accountType === 'WORKER' ? 'bg-blue-500' : 'bg-gray-300'
                }`}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className={`text-sm font-medium ${
                  accountType === 'WORKER' ? 'text-blue-500' : 'text-gray-600'
                }`}>
                  Thợ
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Biểu mẫu */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Hiển thị lỗi nếu có */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="Email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="Số điện thoại"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="Mật khẩu"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="Xác nhận mật khẩu"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 mt-6 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>

        {/* Chân trang */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Đã có tài khoản?{' '}
          <Link href="/dang-nhap" className="text-blue-500 hover:text-blue-600 font-medium">
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  )
}
