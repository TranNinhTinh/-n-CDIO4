'use client'

import { useState, useEffect } from 'react'
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

  // Tự động điền thông tin đăng nhập đã lưu (không tự động submit)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const credentials = AuthService.getRememberedCredentials()
      if (credentials) {
        // Chỉ điền vào form, không tự động đăng nhập
        setFormData({
          identifier: credentials.identifier,
          password: credentials.password,
          rememberMe: true
        })
        console.log('✅ Đã tự động điền thông tin đăng nhập đã lưu')
      }
    }
  }, [])

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
      const response = await AuthService.login(loginData, formData.rememberMe)
      
      console.log('✅ Đăng nhập thành công:', response)
      
      // Lưu user data vào localStorage để sử dụng sau này
      if (response.user) {
        localStorage.setItem('user_data', JSON.stringify(response.user))
      }
      
      // Chuyển hướng đến trang home
      router.push('/home')
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Email hoặc số điện thoại hoặc mật khẩu không đúng. Vui lòng kiểm tra lại!')
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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full transform transition-all duration-300 hover:shadow-3xl">
        {/* Phần đầu trang */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4 animate-fade-in">
            <ThoTotLogo className="w-56 md:w-64" />
          </div>
          <p className="text-gray-600 text-sm font-medium">Kết nối khách hàng và thợ chuyên nghiệp</p>
        </div>

        {/* Tiêu đề */}
        <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-6">
          Đăng nhập
        </h2>

        {/* Chuyển đổi loại đăng nhập */}
        <div className="flex rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 p-1.5 mb-6 shadow-inner">
          <button
            type="button"
            onClick={() => setLoginType('email')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-300 transform ${
              loginType === 'email'
                ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg scale-105'
                : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
            }`}
          >
            📧 Email
          </button>
          <button
            type="button"
            onClick={() => setLoginType('phone')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-300 transform ${
              loginType === 'phone'
                ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg scale-105'
                : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
            }`}
          >
            📱 Số điện thoại
          </button>
        </div>

        {/* Biểu mẫu */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Hiển thị lỗi nếu có */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg text-sm animate-shake shadow-md">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          {loginType === 'email' ? (
            <div className="transform transition-all duration-300">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📧 Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.identifier}
                  onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                  className="w-full px-4 py-3 pl-10 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all duration-300 hover:border-gray-400"
                  placeholder="Nhập email đã đăng ký"
                  required
                />
                <span className="absolute left-3 top-3.5 text-gray-400">✉️</span>
              </div>
              <p className="text-xs text-gray-500 mt-1.5 ml-1">Sử dụng email bạn đã đăng ký tài khoản</p>
            </div>
          ) : (
            <div className="transform transition-all duration-300">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📱 Số điện thoại
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={formData.identifier}
                  onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                  className="w-full px-4 py-3 pl-10 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all duration-300 hover:border-gray-400"
                  placeholder="Nhập số điện thoại đã đăng ký"
                  required
                />
                <span className="absolute left-3 top-3.5 text-gray-400">📞</span>
              </div>
              <p className="text-xs text-gray-500 mt-1.5 ml-1">
                Nhập số điện thoại bạn đã dùng khi đăng ký (ví dụ: 0129477565)
              </p>
            </div>
          )}

          <div className="transform transition-all duration-300">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🔒 Mật khẩu
            </label>
            <div className="relative">
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 pl-10 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all duration-300 hover:border-gray-400"
                placeholder="Nhập mật khẩu"
                required
              />
              <span className="absolute left-3 top-3.5 text-gray-400">🔐</span>
            </div>
          </div>

          {/* Ghi nhớ đăng nhập & Quên mật khẩu */}
          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                className="w-4 h-4 text-teal-500 border-gray-300 rounded focus:ring-teal-500 cursor-pointer"
              />
              <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-800 transition">
                Ghi nhớ đăng nhập
              </span>
            </label>
            <Link 
              href="/quen-mat-khau" 
              className="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors duration-200 hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 mt-6 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transform hover:scale-105 hover:shadow-lg active:scale-95"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Đang đăng nhập...
              </span>
            ) : (
              '🚀 Đăng nhập'
            )}
          </button>
        </form>

        {/* Đường phân cách */}
        <div className="flex items-center my-8">
          <div className="flex-1 border-t-2 border-gray-200"></div>
          <span className="px-4 text-sm font-semibold text-gray-500">Hoặc</span>
          <div className="flex-1 border-t-2 border-gray-200"></div>
        </div>

        {/* Đăng nhập bằng Google */}
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-white hover:bg-gray-50 border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 transform hover:scale-105 hover:shadow-lg active:scale-95 hover:border-gray-400"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span>Đăng nhập bằng Google</span>
        </button>

        {/* Chân trang */}
        <div className="mt-8 text-center text-sm">
          <span className="text-gray-600">Chưa có tài khoản? </span>
          <Link href="/dang-ky" className="text-teal-600 hover:text-teal-700 font-bold transition-colors duration-200 hover:underline">
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  )
}
