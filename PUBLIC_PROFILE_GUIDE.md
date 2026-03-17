# 📱 Public Profile Implementation Guide

## Overview
Đã tích hợp hoàn toàn hệ thống để xem trang cá nhân công khai của bất kỳ người dùng nào.

---

## 🎯 Route Map

### 1. My Profile (Trang cá nhân của chính mình)
```
Route: /profile
Method: Không cần ID
Quyền: Chỉ chính người dùng đó mới xem được
```

**Features:**
- ✏️ Edit all profile information
- 📝 Manage all posts
- 🗑️ Delete account
- 🔐 All personal settings

---

### 2. Public Profile (Xem trang cá nhân người khác)
```
Route: /profile/[id]
Method: GET /api/profile/user/:id
Quyền: Bất kỳ ai cũng có thể xem
```

**Displayed Information (Công khai):**
- Avatar URL
- Display Name
- Role (Customer/Provider)
- Bio
- Verification Badge ✅
- Member Since Date
- All their public posts

**NOT Displayed (Không hiển thị - bảo mật):**
- Email
- Phone
- Full Name
- Address
- Gender
- Birthday
- All personal settings

---

## 🧩 AuthorCard Component

### Location
```
/app/components/AuthorCard.tsx
```

### Usage
```tsx
import AuthorCard from '@/app/components/AuthorCard'

// In your component:
<AuthorCard
  customerId={post.customer.customerId}
  displayName={post.customer.displayName}
  fullName={post.customer.fullName}
  avatarUrl={post.customer.avatarUrl}
  isVerified={post.customer.isVerified}
/>
```

### Props
```typescript
interface AuthorCardProps {
  customerId: string              // Required: User UUID
  displayName?: string | null     // Optional
  fullName?: string | null        // Optional (falls back to displayName)
  avatarUrl?: string | null       // Optional
  isVerified?: boolean            // Optional
}
```

### Features
✅ Click to navigate to public profile  
✅ Hover effects and animations  
✅ Verification badge display  
✅ Default avatar generation  
✅ Auto-fallback from displayName to fullName  

---

## 📍 Where It's Already Integrated

### 1. Post Detail Page (/posts/[id])
```tsx
import AuthorCard from '@/app/components/AuthorCard'

// In sidebar section:
<div className="mb-6">
  <h3 className="text-lg font-semibold text-gray-900 mb-3">Người đăng</h3>
  <div className="border border-gray-200 rounded-lg p-0 hover:border-blue-300">
    <AuthorCard
      customerId={post.customer.customerId}
      displayName={post.customer.displayName}
      fullName={post.customer.fullName}
      avatarUrl={post.customer.avatarUrl}
      isVerified={post.customer.isVerified}
    />
  </div>
</div>
```

---

## 🔌 API Integration

### Get Public Profile
```typescript
// In ProfileService (profile-new.service.ts)
static async getPublicProfile(userId: string): Promise<PublicProfileResponse>
```

**Request:**
```
GET /api/profile/user/{userId}
```

**Response:**
```typescript
{
  id: string                      // User UUID
  role?: 'customer' | 'provider'
  displayName?: string
  avatarUrl?: string
  bio?: string
  isVerified?: boolean
  memberSince?: Date
}
```

**Error Responses:**
- `400` - Invalid UUID format
- `404` - User not found or account inactive
- `500` - Server error

---

## 🎨 UI Design

### Public Profile Page Layout

```
┌─────────────────────────────────────────────────┐
│ ← Back                                          │
│ Public Profile                                  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│                  [Avatar]                       │
│         Display Name ✅ (Verified)              │
│       🔧 Service Provider (or 👤 Customer)      │
│              "Bio text here"                    │
│        Member since January 1, 2025             │
│                                                  │
│  ┌──────────────┬──────────────┐               │
│  │ User ID      │ Account      │               │
│  │ uuid-xxx     │ 🟢 Active    │               │
│  ├──────────────┼──────────────┤               │
│  │ Role         │ Verification │               │
│  │ provider     │ ✅ Verified  │               │
│  └──────────────┴──────────────┘               │
└─────────────────────────────────────────────────┘

┌─ About ────────────── Posts ──────────────────┐
│                                                │
│ [Profile Information]                         │
│                                                │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ Interested in this user's services?             │
│ Create a service request and get in touch       │
│              [Create Service Request]           │
└─────────────────────────────────────────────────┘
```

---

## 🚀 How to Use

### From Home Page
1. User sees a post in the feed
2. Clicks on author avatar or AuthorCard component
3. Navigates to `/profile/[userId]`
4. Sees public profile information
5. Can click "Create Service Request" to engage

### From Post Detail Page
1. User reads post details
2. Clicks on "Người đăng" (Posted By) section
3. AuthorCard displays with avatar, name, and verification badge
4. User clicks AuthorCard to view full public profile
5. Can see all posts from this user and engage

---

## 📝 Implementation Checklist

- ✅ Public profile page created (`/app/profile/[id]/page.tsx`)
- ✅ AuthorCard component created (`/app/components/AuthorCard.tsx`)
- ✅ Integrated AuthorCard into post detail page
- ✅ API integration with ProfileService.getPublicProfile()
- ✅ UI design with tabs (About, Posts)
- ✅ Verification badge display
- ✅ Role badge (Provider/Customer)
- ✅ Error handling and loading states
- ✅ Navigation and routing setup
- ✅ Documentation complete

---

## 🔒 Privacy & Security

### What's Protected
- Email addresses (never shown publicly)
- Phone numbers (never shown publicly)
- Full legal names (only display name shown)
- Personal addresses
- Gender and birthday
- Account settings

### What's Public
- Display name (chosen by user)
- Avatar (if user set one)
- Bio (what user wants to share)
- Role (customer/provider)
- Verification status
- Member since date
- Public posts

---

## 🎯 Next Steps

### Optional Enhancements
1. **Add reviews/ratings section** to public profile
2. **Show completed jobs count** for providers
3. **Add follow/bookmark** functionality
4. **Display social links** in bio
5. **Add contact button** for direct messaging
6. **Show response time** for service providers
7. **Add portfolio/portfolio** items for providers

---

## 📞 Contact & Support
For questions or improvements, refer to backend API documentation.
