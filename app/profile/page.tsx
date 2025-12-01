'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthService, UserService } from '@/lib/api/services'
import { ProfileService } from '@/lib/api/profile.service'
import type { Profile, UpdateProfileRequest, UpdateContactRequest } from '@/lib/api/profile.service'
import SkeletonProfile from '@/app/components/SkeletonProfile'

// Danh sách 63 tỉnh/thành phố Việt Nam
const VIETNAM_PROVINCES = [
  'An Giang', 'Bà Rịa - Vũng Tàu', 'Bắc Giang', 'Bắc Kạn', 'Bạc Liêu',
  'Bắc Ninh', 'Bến Tre', 'Bình Định', 'Bình Dương', 'Bình Phước',
  'Bình Thuận', 'Cà Mau', 'Cần Thơ', 'Cao Bằng', 'Đà Nẵng',
  'Đắk Lắk', 'Đắk Nông', 'Điện Biên', 'Đồng Nai', 'Đồng Tháp',
  'Gia Lai', 'Hà Giang', 'Hà Nam', 'Hà Nội', 'Hà Tĩnh',
  'Hải Dương', 'Hải Phòng', 'Hậu Giang', 'Hòa Bình', 'Hưng Yên',
  'Khánh Hòa', 'Kiên Giang', 'Kon Tum', 'Lai Châu', 'Lâm Đồng',
  'Lạng Sơn', 'Lào Cai', 'Long An', 'Nam Định', 'Nghệ An',
  'Ninh Bình', 'Ninh Thuận', 'Phú Thọ', 'Phú Yên', 'Quảng Bình',
  'Quảng Nam', 'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị', 'Sóc Trăng',
  'Sơn La', 'Tây Ninh', 'Thái Bình', 'Thái Nguyên', 'Thanh Hóa',
  'Thừa Thiên Huế', 'Tiền Giang', 'TP Hồ Chí Minh', 'Trà Vinh', 'Tuyên Quang',
  'Vĩnh Long', 'Vĩnh Phúc', 'Yên Bái'
]

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'info' | 'contact' | 'avatar'>('info')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  // Form data cho thông tin cá nhân
  const [formData, setFormData] = useState({
    fullName: '',
    displayName: '',
    bio: '',
    phone: ''
  })

  // Form data cho thông tin liên hệ
  const [contactData, setContactData] = useState({
    phone: '',
    email: '',
    address: '',
    city: '',
    district: '',
    ward: ''
  })

  // Kiểm tra authentication và load user data
  useEffect(() => {
    const loadUserData = async () => {
      console.log('🔍 Starting to load user data...')
      console.log('🔑 Token exists:', !!localStorage.getItem('access_token'))
      console.log('🔑 Token value:', localStorage.getItem('access_token')?.substring(0, 50) + '...')
      
      if (!AuthService.isAuthenticated()) {
        console.log('❌ Not authenticated, redirecting to login')
        router.push('/dang-nhap')
        return
      }

      console.log('✅ User is authenticated')

      try {
        // Thử gọi ProfileService trước, nếu lỗi thì dùng UserService
        let userData: Profile
        try {
          console.log('📞 Calling ProfileService.getMyProfile()...')
          userData = await ProfileService.getMyProfile()
          console.log('✅ ProfileService success:', userData)
        } catch (profileError) {
          console.log('⚠️ ProfileService failed:', profileError)
          console.log('📞 Trying UserService.getCurrentUser() fallback...')
          // Fallback to UserService
          const userFromUserService = await UserService.getCurrentUser()
          console.log('✅ UserService success:', userFromUserService)
          userData = {
            ...userFromUserService,
            displayName: userFromUserService.fullName,
            bio: ''
          } as Profile
        }
        
        console.log('✅ Final User Data Loaded:', userData)
        
        setUser(userData)
        setFormData({
          fullName: userData.fullName || '',
          displayName: userData.displayName || userData.fullName || '',
          bio: userData.bio || '',
          phone: userData.phone || ''
        })
        setContactData({
          phone: userData.contactInfo?.phone || userData.phone || '',
          email: userData.contactInfo?.email || userData.email || '',
          address: userData.contactInfo?.address || '',
          city: userData.contactInfo?.city || '',
          district: userData.contactInfo?.district || '',
          ward: userData.contactInfo?.ward || ''
        })
        
        console.log('✅ Form Data Set:', {
          fullName: userData.fullName,
          displayName: userData.displayName,
          email: userData.email,
          phone: userData.phone
        })
      } catch (err) {
        console.error('❌ Lỗi khi tải thông tin:', err)
        setError('Không thể tải thông tin người dùng. Vui lòng đăng nhập lại.')
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
      // Thử ProfileService trước, nếu lỗi thì dùng UserService
      try {
        const updateData: UpdateProfileRequest = {
          fullName: formData.fullName,
          displayName: formData.displayName,
          bio: formData.bio,
          phone: formData.phone
        }

        const updatedUser = await ProfileService.updateProfile(updateData)
        setUser(updatedUser)
      } catch (profileError) {
        console.log('⚠️ ProfileService update failed, using UserService fallback')
        // Fallback to UserService
        const userUpdateData = {
          fullName: formData.fullName,
          phone: formData.phone
        }
        const updatedUser = await UserService.updateUser(userUpdateData)
        setUser({
          ...updatedUser,
          displayName: formData.displayName,
          bio: formData.bio
        } as Profile)
      }
      
      setSuccess('Cập nhật thông tin thành công!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('❌ Update Error:', err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Không thể cập nhật thông tin')
      }
    } finally {
      setSaving(false)
    }
  }

  // Cập nhật thông tin liên hệ
  const handleUpdateContact = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)

    try {
      const updatedUser = await ProfileService.updateContact(contactData)
      setUser(updatedUser)
      setSuccess('Cập nhật thông tin liên hệ thành công!')
      
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Không thể cập nhật thông tin liên hệ')
      }
    } finally {
      setSaving(false)
    }
  }

  // Upload avatar
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError('')
    setSuccess('')
    setUploadingAvatar(true)

    try {
      const updatedUser = await ProfileService.updateAvatarFile(file)
      setUser(updatedUser)
      setSuccess('Cập nhật avatar thành công!')
      
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Không thể cập nhật avatar')
      }
    } finally {
      setUploadingAvatar(false)
    }
  }

  // Xóa tài khoản
  const handleDeleteAccount = async () => {
    if (!confirm('⚠️ Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác!')) {
      return
    }

    try {
      await ProfileService.deleteAccount()
      setSuccess('Tài khoản đã được xóa!')
      setTimeout(() => {
        AuthService.logout()
        router.push('/dang-nhap')
      }, 2000)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Không thể xóa tài khoản')
      }
    }
  }

  // Loading state
  if (loading) {
    return <SkeletonProfile />
  }

  // Debug: Log user state
  console.log('🎨 Rendering Profile with user:', user)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Avatar */}
              <div className="relative">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt="Avatar" 
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    {(user?.fullName || user?.email || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {user?.displayName || user?.fullName || user?.email?.split('@')[0] || 'Người dùng'}
                </h1>
                <p className="text-gray-600">{user?.email || 'No email'}</p>
                {user?.phone && <p className="text-sm text-gray-500">📞 {user.phone}</p>}
                {user?.bio && <p className="text-sm text-gray-500 mt-1">{user.bio}</p>}
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
                onClick={() => setActiveTab('contact')}
                className={`flex-1 px-6 py-4 text-center font-medium transition ${
                  activeTab === 'contact'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                📞 Thông tin liên hệ
              </button>
              <button
                onClick={() => setActiveTab('avatar')}
                className={`flex-1 px-6 py-4 text-center font-medium transition ${
                  activeTab === 'avatar'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                🖼️ Avatar
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
                    Tên hiển thị
                  </label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Nhập tên hiển thị"
                  />
                  <p className="text-xs text-gray-500 mt-1">Tên này sẽ được hiển thị công khai</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giới thiệu bản thân
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Viết một vài dòng về bản thân..."
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email không thể thay đổi</p>
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

            {/* Tab Thông tin liên hệ */}
            {activeTab === 'contact' && (
              <form onSubmit={handleUpdateContact} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại liên hệ
                  </label>
                  <input
                    type="tel"
                    value={contactData.phone}
                    onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email liên hệ
                  </label>
                  <input
                    type="email"
                    value={contactData.email}
                    onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Nhập email liên hệ"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    value={contactData.address}
                    onChange={(e) => setContactData({ ...contactData, address: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Số nhà, tên đường..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tỉnh/Thành phố <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={contactData.city}
                      onChange={(e) => setContactData({ ...contactData, city: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                    >
                      <option value="">-- Chọn tỉnh/thành phố --</option>
                      {VIETNAM_PROVINCES.map((province) => (
                        <option key={province} value={province}>
                          {province}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quận/Huyện
                    </label>
                    <input
                      type="text"
                      value={contactData.district}
                      onChange={(e) => setContactData({ ...contactData, district: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Nhập quận/huyện"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phường/Xã
                    </label>
                    <input
                      type="text"
                      value={contactData.ward}
                      onChange={(e) => setContactData({ ...contactData, ward: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Nhập phường/xã"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {saving ? 'Đang lưu...' : 'Cập nhật thông tin liên hệ'}
                </button>
              </form>
            )}

            {/* Tab Avatar */}
            {activeTab === 'avatar' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="inline-block relative">
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt="Avatar" 
                        className="w-40 h-40 rounded-full object-cover mx-auto"
                      />
                    ) : (
                      <div className="w-40 h-40 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-6xl font-bold mx-auto">
                        {user?.fullName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    Chọn ảnh để cập nhật avatar của bạn
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tải ảnh lên
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={uploadingAvatar}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Chấp nhận: JPG, PNG, GIF. Tối đa 5MB
                  </p>
                </div>

                {uploadingAvatar && (
                  <div className="text-center text-blue-600">
                    Đang tải ảnh lên...
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Các hành động khác */}
        <div className="mt-6 space-y-4">
          <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800">Xóa tài khoản</h3>
              <p className="text-sm text-gray-600">Xóa vĩnh viễn tài khoản của bạn</p>
            </div>
            <button
              onClick={handleDeleteAccount}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition"
            >
              Xóa tài khoản
            </button>
          </div>

          <div className="text-center">
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
    </div>
  )
}
