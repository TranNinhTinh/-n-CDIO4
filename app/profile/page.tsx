'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthService, UserService } from '@/lib/api/services'
import type { User, UpdateUserRequest, ChangePasswordRequest } from '@/lib/api/services'
import SkeletonProfile from '@/app/components/SkeletonProfile'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'info' | 'password'>('info')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Form data cho thông tin cá nhân
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: ''
  })

  // Form data cho đổi mật khẩu
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Kiểm tra authentication và load user data
  useEffect(() => {
    const loadUserData = async () => {
      if (!AuthService.isAuthenticated()) {
        router.push('/dang-nhap')
        return
      }

      try {
        const userData = await UserService.getCurrentUser()
        setUser(userData)
        setFormData({
          fullName: userData.fullName || '',
          phone: userData.phone || userData.phoneNumber || '',
          email: userData.email
        })
      } catch (err) {
        console.error('Lỗi khi tải thông tin:', err)
        setError('Không thể tải thông tin người dùng')
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [router])

  // Cập nhật thông tin cá nhân
  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)

    try {
      const updateData: UpdateUserRequest = {
        fullName: formData.fullName,
        phone: formData.phone
      }

      const updatedUser = await UserService.updateUser(updateData)
      setUser(updatedUser)
      setSuccess('Cập nhật thông tin thành công!')
      
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Không thể cập nhật thông tin')
      }
    } finally {
      setSaving(false)
    }
  }

  // Đổi mật khẩu
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Mật khẩu mới và xác nhận không khớp!')
      return
    }

    if (passwordData.newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự!')
      return
    }

    setSaving(true)

    try {
      await UserService.changePassword(passwordData)
      setSuccess('Đổi mật khẩu thành công!')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Không thể đổi mật khẩu')
      }
    } finally {
      setSaving(false)
    }
  }

  // Loading state
  if (loading) {
    return <SkeletonProfile />
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Avatar */}
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {user?.fullName?.charAt(0).toUpperCase() || user?.email.charAt(0).toUpperCase()}
              </div>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {user?.fullName || 'Người dùng'}
                </h1>
                <p className="text-gray-600">{user?.email}</p>
                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${
                  user?.accountType === 'WORKER' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {user?.accountType === 'WORKER' ? '👷 Thợ' : '👤 Khách hàng'}
                </span>
              </div>
            </div>

            <button
              onClick={() => router.push('/home')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              ← Quay lại
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('info')}
                className={`flex-1 px-6 py-4 text-center font-medium transition ${
                  activeTab === 'info'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                📋 Thông tin cá nhân
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`flex-1 px-6 py-4 text-center font-medium transition ${
                  activeTab === 'password'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                🔒 Đổi mật khẩu
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Thông báo */}
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            {/* Tab Thông tin cá nhân */}
            {activeTab === 'info' && (
              <form onSubmit={handleUpdateInfo} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Nhập họ và tên"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email không thể thay đổi</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại tài khoản
                  </label>
                  <input
                    type="text"
                    value={user?.accountType === 'WORKER' ? 'Thợ' : 'Khách hàng'}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Loại tài khoản không thể thay đổi</p>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {saving ? 'Đang lưu...' : 'Cập nhật thông tin'}
                </button>
              </form>
            )}

            {/* Tab Đổi mật khẩu */}
            {activeTab === 'password' && (
              <form onSubmit={handleChangePassword} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu hiện tại
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Nhập mật khẩu hiện tại"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu mới
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Nhập mật khẩu mới"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Mật khẩu phải có ít nhất 6 ký tự</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Xác nhận mật khẩu mới
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Nhập lại mật khẩu mới"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {saving ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Đăng xuất */}
        <div className="mt-6 text-center">
          <button
            onClick={async () => {
              await AuthService.logout()
              router.push('/dang-nhap')
            }}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            🚪 Đăng xuất
          </button>
        </div>
      </div>
    </div>
  )
}
