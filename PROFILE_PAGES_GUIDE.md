# Profile Navigation Guide

## Trang Cá Nhân (My Profile)
**Route:** `/profile` (không có ID)

Đây là trang cá nhân của chính người dùng hiện tại. Có đầy đủ các chức năng:
- 👁️ View Profile - Xem thông tin cá nhân
- ✏️ Edit Profile - Chỉnh sửa thông tin (fullName, bio, address, gender, birthday)
- 📞 Contact Info - Cập nhật email và phone
- 📝 Display Name - Đổi Display Name (một lần 30 ngày)
- 🖼️ Avatar - Cập nhật avatar
- 📋 Bài đăng của tôi - Quản lý bài đăng (xem, sửa, đóng, xóa)

**Features:**
- Chỉ chính người dùng mới có quyền truy cập
- Xóa tài khoản (soft delete, khôi phục trong 30 ngày)
- Quản lý đầy đủ các bài đăng

---

## Trang Cá Nhân Công Khai (Public Profile)
**Route:** `/profile/[id]` (có ID người dùng)

Đây là trang công khai để xem thông tin của bất kỳ người dùng nào. Thông tin hiển thị bị giới hạn vì lý do bảo mật.

**Thông tin công khai hiển thị:**
- Avatar
- Display Name
- Role (Customer / Service Provider)
- Bio
- Verification Badge
- Member Since Date
- Posts của người dùng

**Không thể chỉnh sửa** - Chỉ xem thông tin

---

## Cách Sử Dụng AuthorCard Component

Import component:
```tsx
import AuthorCard from '@/app/components/AuthorCard'
```

Sử dụng trong bài viết hoặc các nơi khác:
```tsx
<AuthorCard
  customerId={post.customer.customerId}
  displayName={post.customer.displayName}
  fullName={post.customer.fullName}
  avatarUrl={post.customer.avatarUrl}
  isVerified={post.customer.isVerified}
/>
```

**Props:**
- `customerId`: string (bắt buộc) - ID của người dùng
- `displayName?`: string | null - Display name
- `fullName?`: string | null - Full name
- `avatarUrl?`: string | null - Avatar URL
- `isVerified?`: boolean - Verification status

---

## API Endpoints Sử Dụng

### My Profile (Chính mình)
- `GET /api/profile/me` - Lấy thông tin cá nhân
- `PATCH /api/profile/me` - Cập nhật thông tin
- `PUT /api/profile/contact` - Cập nhật email/phone
- `PUT /api/profile/display-name` - Đổi display name
- `PATCH /api/profile/avatar` - Cập nhật avatar
- `DELETE /api/profile/me` - Xóa tài khoản

### Public Profile (Người khác)
- `GET /api/profile/user/:id` - Lấy thông tin công khai của người dùng khác

---

## Backend Models

### PublicProfileResponseDto
```typescript
{
  id: string                    // User UUID
  role?: 'customer' | 'provider' // User role
  displayName?: string          // Public display name
  avatarUrl?: string           // Avatar URL
  bio?: string                 // User biography
  isVerified?: boolean         // Verification status
  memberSince?: Date           // Member since date
}
```
