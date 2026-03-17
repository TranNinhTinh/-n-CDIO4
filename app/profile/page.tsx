'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/app/components/Header'
import { ProfileService, ProfileResponse, UpdateProfileDto, UpdateContactDto, ChangeDisplayNameDto } from '@/lib/api/profile-new.service'
import { PostService } from '@/lib/api/post.service'

export default function Profile() {
  const router = useRouter()
  const [profile, setProfile] = useState<ProfileResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'view' | 'edit' | 'contact' | 'display-name' | 'avatar' | 'my-posts'>('view')
  const [isSaving, setIsSaving] = useState(false)

  // My Posts states
  const [myPosts, setMyPosts] = useState<any[]>([])
  const [postsLoading, setPostsLoading] = useState(false)
  const [postsError, setPostsError] = useState('')
  const [editingPostId, setEditingPostId] = useState<string | null>(null)
  const [editPostForm, setEditPostForm] = useState<any>({})
  const [postsLoaded, setPostsLoaded] = useState(false)

  // Form states
  const [editForm, setEditForm] = useState<UpdateProfileDto>({})
  const [contactForm, setContactForm] = useState<UpdateContactDto>({})
  const [displayNameForm, setDisplayNameForm] = useState({ displayName: '' })
  const [avatarForm, setAvatarForm] = useState({ avatarUrl: '' })

  // Load profile on mount
  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const data = await ProfileService.getMyProfile()
      setProfile(data)
      setEditForm({
        fullName: data.fullName,
        bio: data.bio,
        address: data.address,
        gender: data.gender,
        birthday: data.birthday ? new Date(data.birthday) : undefined,
      })
      setContactForm({
        email: data.email || '',
        phone: data.phone || '',
      })
      setDisplayNameForm({ displayName: data.displayName || '' })
      setAvatarForm({ avatarUrl: data.avatarUrl || '' })
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile')
      console.error('Error loading profile:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async () => {
    try {
      setIsSaving(true)
      setError('')
      const updated = await ProfileService.updateProfile(editForm)
      setProfile(updated)
      setActiveTab('view')
      alert('✅ Profile updated successfully')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdateContact = async () => {
    try {
      setIsSaving(true)
      setError('')
      const updated = await ProfileService.updateContact(contactForm)
      setProfile(updated)
      setActiveTab('view')
      alert('✅ Contact information updated successfully')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update contact')
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangeDisplayName = async () => {
    try {
      setIsSaving(true)
      setError('')
      const response = await ProfileService.changeDisplayName(displayNameForm)
      await loadProfile()
      setActiveTab('view')
      alert(`✅ ${response.message}\nDays until next change: ${response.daysUntilNextChange}`)
    } catch (err: any) {
      const message = err.message || 'Failed to change display name'
      if (err.daysUntilCanChange) {
        setError(`${message}\nDays remaining: ${err.daysUntilCanChange}`)
      } else {
        setError(message)
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdateAvatar = async () => {
    try {
      setIsSaving(true)
      setError('')
      const updated = await ProfileService.updateAvatar(avatarForm)
      setProfile(updated)
      setActiveTab('view')
      alert('✅ Avatar updated successfully')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update avatar')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('⚠️ Are you sure you want to delete your account? This can be recovered within 30 days.')) {
      return
    }

    try {
      setIsSaving(true)
      setError('')
      const response = await ProfileService.deleteAccount()
      alert(response.message)
      localStorage.removeItem('accessToken')
      router.push('/dang-nhap')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account')
    } finally {
      setIsSaving(false)
    }
  }

  // Post APIs
  const loadMyPosts = async () => {
    try {
      setPostsLoading(true)
      setPostsError('')
      const response = await PostService.getMyPosts({ limit: 50 })
      setMyPosts(response.data || [])
      setPostsLoaded(true)
    } catch (err) {
      setPostsError(err instanceof Error ? err.message : 'Failed to load posts')
      console.error('Error loading posts:', err)
    } finally {
      setPostsLoading(false)
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Bạn có chắc muốn xóa bài đăng này?')) {
      return
    }

    try {
      await PostService.deletePost(postId)
      setMyPosts(myPosts.filter(p => p.id !== postId))
      alert('✅ Bài đăng đã xóa')
    } catch (err) {
      setPostsError(err instanceof Error ? err.message : 'Failed to delete post')
    }
  }

  const handleClosePost = async (postId: string) => {
    try {
      const updatedPost = await PostService.closePost(postId)
      setMyPosts(myPosts.map(p => p.id === postId ? updatedPost : p))
      alert('✅ Bài đăng đã đóng')
    } catch (err) {
      setPostsError(err instanceof Error ? err.message : 'Failed to close post')
    }
  }

  const startEditPost = (post: any) => {
    setEditingPostId(post.id)
    setEditPostForm({
      title: post.title,
      description: post.description,
      imageUrls: post.imageUrls || [],
      location: post.location,
      desiredTime: post.desiredTime,
      budget: post.budget,
    })
  }

  const cancelEditPost = () => {
    setEditingPostId(null)
    setEditPostForm({})
  }

  const handleUpdatePost = async (postId: string) => {
    if (!editPostForm.title || !editPostForm.description) {
      alert('Vui lòng điền tiêu đề và mô tả')
      return
    }

    try {
      const updatedPost = await PostService.updatePost(postId, editPostForm)
      setMyPosts(myPosts.map(p => p.id === postId ? updatedPost : p))
      setEditingPostId(null)
      setEditPostForm({})
      alert('✅ Bài đăng đã cập nhật')
    } catch (err) {
      setPostsError(err instanceof Error ? err.message : 'Failed to update post')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 shadow-sm max-w-md w-full text-center">
          <p className="text-red-600 mb-4">Failed to load profile</p>
          <button
            onClick={() => router.push('/home')}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      <div className="flex-1">
        {/* Back Button */}
        <div className="bg-white shadow">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <button
              onClick={() => router.back()}
              className="text-blue-600 hover:text-blue-700"
            >
              ← Back
            </button>
            <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
            <p className="text-gray-600 mt-2">Manage your account information and posts</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {postsError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {postsError}
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="flex border-b overflow-x-auto">
              {[
                { key: 'view', label: 'View Profile' },
                { key: 'edit', label: 'Edit Profile' },
                { key: 'contact', label: 'Contact Info' },
                { key: 'display-name', label: 'Display Name' },
                { key: 'avatar', label: 'Avatar' },
                { key: 'my-posts', label: 'Bài đăng của tôi' },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key as any)
                    if (tab.key === 'my-posts' && !postsLoaded) {
                      loadMyPosts()
                    }
                  }}
                  className={`px-4 py-3 text-sm font-medium transition whitespace-nowrap ${activeTab === tab.key
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* View Profile Tab */}
            {activeTab === 'view' && (
              <div className="space-y-6">
                {profile.avatarUrl && (
                  <div className="flex justify-center">
                    <img
                      src={profile.avatarUrl}
                      alt="Avatar"
                      className="w-24 h-24 rounded-full object-cover border-4 border-blue-600"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Display Name</label>
                    <p className="text-lg text-gray-800">{profile.displayName || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Full Name</label>
                    <p className="text-lg text-gray-800">{profile.fullName || 'Not set'}</p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-600">Email</label>
                    <p className="text-lg text-gray-800">{profile.email || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Phone</label>
                    <p className="text-lg text-gray-800">{profile.phone || 'Not set'}</p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-600">Gender</label>
                    <p className="text-lg text-gray-800">{profile.gender || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Birthday</label>
                    <p className="text-lg text-gray-800">
                      {profile.birthday ? new Date(profile.birthday).toLocaleDateString() : 'Not set'}
                    </p>
                  </div>

                  <div className="col-span-2">
                    <label className="text-sm font-semibold text-gray-600">Address</label>
                    <p className="text-lg text-gray-800">{profile.address || 'Not set'}</p>
                  </div>

                  <div className="col-span-2">
                    <label className="text-sm font-semibold text-gray-600">Bio</label>
                    <p className="text-lg text-gray-800">{profile.bio || 'Not set'}</p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="font-semibold text-gray-600">Verified</label>
                      <p>{profile.isVerified ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <label className="font-semibold text-gray-600">Account Active</label>
                      <p>{profile.isActive ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <label className="font-semibold text-gray-600">Member Since</label>
                      <p>{profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div>
                      <label className="font-semibold text-gray-600">Last Updated</label>
                      <p>{new Date(profile.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Display Name Change Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Display Name Change Info</h3>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>Can change now: {profile.displayNameChangeInfo.canChange ? 'Yes' : 'No'}</p>
                    <p>Changes made: {profile.displayNameChangeInfo.changeCount}</p>
                    <p>Days until next change: {profile.displayNameChangeInfo.daysUntilNextChange}</p>
                    {profile.displayNameChangeInfo.lastChanged && (
                      <p>Last changed: {new Date(profile.displayNameChangeInfo.lastChanged).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="border-t pt-6">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={isSaving}
                    className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 disabled:bg-gray-400"
                  >
                    Delete Account
                  </button>
                  <p className="text-xs text-gray-600 mt-2">Account can be recovered within 30 days</p>
                </div>
              </div>
            )}

            {/* Edit Profile Tab */}
            {activeTab === 'edit' && (
              <form
                onSubmit={e => {
                  e.preventDefault()
                  handleUpdateProfile()
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={editForm.fullName || ''}
                    onChange={e => setEditForm({ ...editForm, fullName: e.target.value })}
                    maxLength={255}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Max 255 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    value={editForm.bio || ''}
                    onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                    maxLength={500}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Max 500 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    value={editForm.address || ''}
                    onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                    maxLength={255}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Max 255 characters</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select
                      value={editForm.gender || ''}
                      onChange={e => setEditForm({ ...editForm, gender: e.target.value || undefined })}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    >
                      <option value="">Not set</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Birthday</label>
                    <input
                      type="date"
                      value={
                        editForm.birthday
                          ? new Date(editForm.birthday).toISOString().split('T')[0]
                          : ''
                      }
                      onChange={e => setEditForm({ ...editForm, birthday: e.target.value ? new Date(e.target.value) : undefined })}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            )}

            {/* Contact Info Tab */}
            {activeTab === 'contact' && (
              <form
                onSubmit={e => {
                  e.preventDefault()
                  handleUpdateContact()
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={contactForm.email || ''}
                    onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={contactForm.phone || ''}
                    onChange={e => setContactForm({ ...contactForm, phone: e.target.value })}
                    placeholder="0901234567"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Vietnam format: 10-11 digits starting with 0 or +84</p>
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {isSaving ? 'Saving...' : 'Update Contact Info'}
                </button>
              </form>
            )}

            {/* Display Name Tab */}
            {activeTab === 'display-name' && (
              <form
                onSubmit={e => {
                  e.preventDefault()
                  handleChangeDisplayName()
                }}
                className="space-y-4"
              >
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>Restriction:</strong> You can only change your display name once every 30 days.
                    {!profile.displayNameChangeInfo.canChange && (
                      <div className="mt-2">
                        Days remaining: <strong>{profile.displayNameChangeInfo.daysUntilNextChange}</strong>
                      </div>
                    )}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Display Name</label>
                  <input
                    type="text"
                    value={displayNameForm.displayName}
                    onChange={e => setDisplayNameForm({ displayName: e.target.value })}
                    minLength={3}
                    maxLength={100}
                    placeholder="3-100 characters"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    disabled={!profile.displayNameChangeInfo.canChange}
                  />
                  <p className="text-xs text-gray-500 mt-1">Letters, numbers, spaces only. 3-100 characters.</p>
                </div>

                <button
                  type="submit"
                  disabled={isSaving || !profile.displayNameChangeInfo.canChange}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {isSaving ? 'Changing...' : 'Change Display Name'}
                </button>
              </form>
            )}

            {/* Avatar Tab */}
            {activeTab === 'avatar' && (
              <form
                onSubmit={e => {
                  e.preventDefault()
                  handleUpdateAvatar()
                }}
                className="space-y-4"
              >
                {avatarForm.avatarUrl && (
                  <div className="flex justify-center mb-4">
                    <img
                      src={avatarForm.avatarUrl}
                      alt="Avatar Preview"
                      className="w-32 h-32 rounded-full object-cover border-4 border-blue-600"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Avatar URL</label>
                  <input
                    type="url"
                    value={avatarForm.avatarUrl}
                    onChange={e => setAvatarForm({ avatarUrl: e.target.value })}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Must be a valid URL. Max 500 characters.</p>
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {isSaving ? 'Uploading...' : 'Update Avatar'}
                </button>
              </form>
            )}

            {/* My Posts Tab */}
            {activeTab === 'my-posts' && (
              <div className="space-y-4">
                {!postsLoaded && (
                  <button
                    onClick={loadMyPosts}
                    disabled={postsLoading}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {postsLoading ? 'Loading...' : 'Load My Posts'}
                  </button>
                )}

                {postsLoading && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-600">Loading posts...</p>
                  </div>
                )}

                {postsLoaded && myPosts.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">You haven't created any posts yet</p>
                    <button
                      onClick={() => router.push('/posts/create')}
                      className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                    >
                      + Create New Post
                    </button>
                  </div>
                )}

                {myPosts.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">My Posts ({myPosts.length})</h3>
                      <button
                        onClick={() => router.push('/posts/create')}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        + New Post
                      </button>
                    </div>

                    {myPosts.map(post => (
                      <div key={post.id} className="border rounded-lg bg-white hover:shadow-md transition">
                        {editingPostId === post.id ? (
                          // Edit Mode
                          <div className="p-6 space-y-4">
                            <h4 className="text-lg font-semibold">Edit Post</h4>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                              <input
                                type="text"
                                value={editPostForm.title || ''}
                                onChange={e => setEditPostForm({ ...editPostForm, title: e.target.value })}
                                maxLength={255}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                              <textarea
                                value={editPostForm.description || ''}
                                onChange={e => setEditPostForm({ ...editPostForm, description: e.target.value })}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <input
                                  type="text"
                                  value={editPostForm.location || ''}
                                  onChange={e => setEditPostForm({ ...editPostForm, location: e.target.value })}
                                  maxLength={255}
                                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Budget (VND)</label>
                                <input
                                  type="number"
                                  value={editPostForm.budget || ''}
                                  onChange={e => setEditPostForm({ ...editPostForm, budget: e.target.value ? parseFloat(e.target.value) : undefined })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Desired Time</label>
                              <input
                                type="datetime-local"
                                value={editPostForm.desiredTime ? new Date(editPostForm.desiredTime).toISOString().slice(0, 16) : ''}
                                onChange={e => setEditPostForm({ ...editPostForm, desiredTime: e.target.value ? new Date(e.target.value) : undefined })}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                              />
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdatePost(post.id)}
                                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                              >
                                Save Changes
                              </button>
                              <button
                                onClick={cancelEditPost}
                                className="flex-1 bg-gray-400 text-white py-2 rounded hover:bg-gray-500"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          // View Mode
                          <div className="p-6">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <h4 className="font-semibold text-lg text-gray-800">{post.title}</h4>
                                <p className="text-gray-600 text-sm mt-1">{post.description?.substring(0, 100)}...</p>
                              </div>
                              <span
                                className={`px-3 py-1 rounded text-sm font-medium whitespace-nowrap ml-2 ${post.status === 'open'
                                  ? 'bg-green-100 text-green-800'
                                  : post.status === 'closed'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-gray-100 text-gray-800'
                                  }`}
                              >
                                {post.status === 'open' ? '✅ Open' : post.status === 'closed' ? '❌ Closed' : post.status}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
                              {post.location && <div>Địa điểm: {post.location}</div>}
                              {post.budget && (
                                <div className="flex items-center gap-1">
                                  <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                                  </svg>
                                  {post.budget.toLocaleString('vi-VN')} VND
                                </div>
                              )}
                              <div>Ngày: {new Date(post.createdAt).toLocaleDateString('vi-VN')}</div>
                              {post.desiredTime && <div>Tg: {new Date(post.desiredTime).toLocaleDateString('vi-VN')}</div>}
                            </div>

                            {post.imageUrls && post.imageUrls.length > 0 && (
                              <div className="mb-4 flex gap-2 overflow-x-auto">
                                {post.imageUrls.map((url: string, idx: number) => (
                                  <img
                                    key={idx}
                                    src={url}
                                    alt={`Post image ${idx + 1}`}
                                    className="h-16 w-16 object-cover rounded"
                                  />
                                ))}
                              </div>
                            )}

                            <div className="flex gap-2 flex-wrap">
                              <button
                                onClick={() => router.push(`/posts/${post.id}`)}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                              >
                                View
                              </button>
                              <button
                                onClick={() => startEditPost(post)}
                                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 text-sm"
                              >
                                Edit
                              </button>
                              {post.status === 'open' && (
                                <button
                                  onClick={() => handleClosePost(post.id)}
                                  className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 text-sm"
                                >
                                  Close
                                </button>
                              )}
                              <button
                                onClick={() => handleDeletePost(post.id)}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
