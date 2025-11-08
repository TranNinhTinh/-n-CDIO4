'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ThoTotLogo from '../components/ThoTotLogo'
import { AuthService, LoginRequest } from '@/lib/api/auth.service'

export default function DangNhap() {
  const router = useRouter()
  const [loginType, setLoginType] = useState<'email' | 'phone'>('email')
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    rememberMe: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Gửi identifier trực tiếp lên backend (có thể là email hoặc phone)
      const identifier = formData.identifier.trim()
      
      console.log(`🔵 Đăng nhập với ${loginType}:`, identifier)
      
      const loginData: LoginRequest = {
        identifier: identifier,
        password: formData.password
      }

      // Gọi API đăng nhập - Backend sẽ tự xử lý email hoặc phone
      const response = await AuthService.login(loginData)
      
      console.log('✅ Đăng nhập thành công:', response)
      
      // Chuyển hướng đến trang home
      router.push('/home')
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Tài khoản hoặc mật khẩu không đúng. Vui lòng kiểm tra lại!')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    // Xử lý đăng nhập bằng Google
    console.log('Google login clicked')
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
        <h2 className="text-xl font-bold text-center text-gray-800 mb-6">Đăng nhập</h2>

        {/* Chuyển đổi loại đăng nhập */}
        <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
          <button
            type="button"
            onClick={() => setLoginType('email')}
            className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition duration-200 ${
              loginType === 'email'
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Email
          </button>
          <button
            type="button"
            onClick={() => setLoginType('phone')}
            className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition duration-200 ${
              loginType === 'phone'
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Số điện thoại
          </button>
        </div>

        {/* Biểu mẫu */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Hiển thị lỗi nếu có */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {loginType === 'email' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.identifier}
                onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="Nhập email đã đăng ký"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Sử dụng email bạn đã đăng ký tài khoản</p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại
              </label>
              <input
                type="tel"
                value={formData.identifier}
                onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="Nhập số điện thoại đã đăng ký"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Nhập số điện thoại bạn đã dùng khi đăng ký (ví dụ: 0129477565)
              </p>
            </div>
          )}

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

          {/* Ghi nhớ đăng nhập & Quên mật khẩu */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">Ghi nhớ đăng nhập</span>
            </label>
            <Link href="/quen-mat-khau" className="text-sm text-blue-500 hover:text-blue-600">
              Quên mật khẩu?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 mt-6 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        {/* Đường phân cách */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-sm text-gray-500">Hoặc</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Đăng nhập bằng Google */}
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span>Đăng nhập bằng Google</span>
        </button>

        {/* Chân trang */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Chưa có tài khoản?{' '}
          <Link href="/dang-ky" className="text-blue-500 hover:text-blue-600 font-medium">
            Đăng ký
          </Link>
        </div>
      </div>
    </div>
  )
}
