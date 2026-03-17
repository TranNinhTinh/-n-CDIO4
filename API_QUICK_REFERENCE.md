# 🚀 API Quick Reference Guide

## How to Use APIs in Your Components

---

## 📚 Import Services

```typescript
// Profile APIs
import { ProfileService } from '@/src/lib/api/profile.service'

// Posts APIs
import { PostService } from '@/src/lib/api/post.service'

// Notifications APIs
import { notificationService } from '@/src/lib/api/notification.service'

// Quotes APIs
import { quoteService } from '@/src/lib/api/quote.service'

// Chat APIs
import { chatService } from '@/src/lib/api/chat.service'

// Orders APIs
import { orderService } from '@/src/lib/api/order.service'
```

---

## 📝 Common Usage Examples

### 1. Profile Management

```typescript
// Get current user profile
const profile = await ProfileService.getMyProfile()

// Update profile
const updated = await ProfileService.updateProfile({
  fullName: "Nguyễn Văn A",
  bio: "Thợ điện chuyên nghiệp"
})

// Update avatar
const withAvatar = await ProfileService.updateAvatarFile(file)

// Search workers
const results = await ProfileService.searchProfiles({
  accountType: 'WORKER',
  city: 'Hà Nội',
  skills: 'điện',
  minRating: 4
})

// Get public profile
const userProfile = await ProfileService.getUserProfile(userId)
```

### 2. Posts Management

```typescript
// Get feed
const feed = await PostService.getFeed({ limit: 20 })

// Create post
const newPost = await PostService.createPost({
  title: "Cần thợ sửa điện",
  content: "Mô tả công việc...",
  categoryId: "category-uuid",
  budget: 500000,
  location: "Hà Nội"
})

// Update post
const updated = await PostService.updatePost(postId, {
  title: "Tiêu đề mới"
})

// Close post
await PostService.closePost(postId)

// Get my posts
const myPosts = await PostService.getMyPosts({ limit: 10 })

// Delete post
await PostService.deletePost(postId)
```

### 3. Notifications

```typescript
// Get notifications
const notifications = await notificationService.getNotifications({
  limit: 20
})

// Get unread count
const { unreadCount } = await notificationService.getUnreadCount()

// Mark as read
await notificationService.markAsRead(notificationId)

// Mark all as read
await notificationService.markAllAsRead()

// Delete notification
await notificationService.deleteNotification(notificationId)

// Delete all read
await notificationService.deleteAllRead()
```

### 4. Quotes Management

```typescript
// [Provider] Create quote
const quote = await quoteService.createQuote({
  postId: "post-uuid",
  price: 500000,
  description: "Báo giá chi tiết...",
  estimatedDuration: 120 // minutes
})

// [Provider] Revise quote in chat
const revision = await quoteService.reviseQuote(quoteId, {
  price: 450000,
  description: "Giá mới..."
})

// [Provider] Cancel quote
await quoteService.cancelQuote(quoteId, "Lý do hủy")

// [Provider] Get my quotes
const myQuotes = await quoteService.getMyQuotes({
  status: 'PENDING',
  limit: 10
})

// [Customer] Accept quote
const { conversationId } = await quoteService.acceptQuoteForChat(quoteId)

// [Customer] Reject quote
await quoteService.rejectQuote(quoteId, "Lý do từ chối")

// [Customer] Request order
const { orderId } = await quoteService.requestOrder(quoteId)

// Get quotes for post
const quotes = await quoteService.getQuotesByPostId(postId)

// Get quote with revisions
const quoteWithHistory = await quoteService.getQuoteWithRevisions(quoteId)
```

### 5. Chat Management

```typescript
// Get conversations
const conversations = await chatService.getConversations()

// Create direct conversation
const conversation = await chatService.createDirectConversation({
  workerId: "worker-uuid"
})

// Get messages
const messages = await chatService.getMessages(conversationId)

// Send message
const message = await chatService.sendMessage(conversationId, {
  content: "Xin chào!"
})

// Mark as read
await chatService.markAsRead(conversationId)

// Get unread count
const { unreadCount } = await chatService.getUnreadCount()

// Close conversation
await chatService.closeConversation(conversationId)

// Search messages
const results = await chatService.searchMessages({
  query: "báo giá",
  limit: 10
})

// Delete conversation
await chatService.deleteConversation(conversationId)
```

### 6. Orders Management

```typescript
// [Provider] Confirm order from quote
const order = await orderService.confirmFromQuote(quoteId, {
  estimatedCompletionDate: "2024-12-20",
  notes: "Ghi chú..."
})

// [Provider] Mark as complete
await orderService.providerComplete(orderId, "Đã hoàn thành")

// [Customer] Confirm completion
await orderService.customerComplete(orderId, 5, "Rất hài lòng!")

// Get my orders
const orders = await orderService.getOrders({
  status: 'IN_PROGRESS',
  role: 'customer',
  limit: 20
})

// Get order statistics
const stats = await orderService.getStats()

// Get order details
const order = await orderService.getOrderById(orderId)

// Get order by number
const order = await orderService.getOrderByNumber("ORD-12345")

// Cancel order
await orderService.cancelOrder(orderId, "Lý do hủy")
```

---

## 🎯 React Component Example

```typescript
'use client'

import { useEffect, useState } from 'react'
import { PostService } from '@/src/lib/api/post.service'
import { quoteService } from '@/src/lib/api/quote.service'

export default function PostDetailPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState(null)
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [params.id])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load post and quotes in parallel
      const [postData, quotesData] = await Promise.all([
        PostService.getPostById(params.id),
        quoteService.getQuotesByPostId(params.id)
      ])
      
      setPost(postData)
      setQuotes(quotesData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptQuote = async (quoteId: string) => {
    try {
      const { conversationId } = await quoteService.acceptQuoteForChat(quoteId)
      
      // Navigate to chat
      window.location.href = `/tin-nhan?conversation=${conversationId}`
    } catch (error) {
      alert('Không thể chấp nhận báo giá')
    }
  }

  const handleRejectQuote = async (quoteId: string) => {
    try {
      await quoteService.rejectQuote(quoteId, "Không phù hợp")
      await loadData() // Reload
    } catch (error) {
      alert('Không thể từ chối báo giá')
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      
      <h2>Báo giá ({quotes.length})</h2>
      {quotes.map(quote => (
        <div key={quote.id}>
          <p>Giá: {quote.price.toLocaleString()}đ</p>
          <p>{quote.description}</p>
          <button onClick={() => handleAcceptQuote(quote.id)}>
            Chấp nhận
          </button>
          <button onClick={() => handleRejectQuote(quote.id)}>
            Từ chối
          </button>
        </div>
      ))}
    </div>
  )
}
```

---

## 🔐 Authentication

All services automatically include the authentication token from localStorage:

```typescript
// Token is automatically added to headers
const token = localStorage.getItem('access_token')

// No need to manually add auth header
// Services handle this internally
```

---

## ⚠️ Error Handling

```typescript
try {
  const post = await PostService.createPost(data)
  // Success
} catch (error) {
  if (error.message.includes('401')) {
    // Token expired - redirect to login
    window.location.href = '/dang-nhap'
  } else {
    // Show error message
    alert(error.message)
  }
}
```

---

## 📦 TypeScript Types

All services return typed data:

```typescript
// Types are automatically inferred
const profile: Profile = await ProfileService.getMyProfile()
const posts: PostResponseDto[] = await PostService.getFeed()
const quote: Quote = await quoteService.getQuoteById(id)
```

Import types when needed:

```typescript
import type { 
  Profile, 
  UpdateProfileRequest 
} from '@/src/lib/api/profile.service'

import type {
  Quote,
  CreateQuoteRequest
} from '@/src/lib/api/quote.service'

import type {
  Order,
  OrderStats
} from '@/src/lib/api/order.service'
```

---

## 🚦 Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Process response |
| 201 | Created | Resource created |
| 400 | Bad Request | Check input data |
| 401 | Unauthorized | Redirect to login |
| 403 | Forbidden | Show permission error |
| 404 | Not Found | Show not found message |
| 500 | Server Error | Show error message |

---

## 💡 Best Practices

1. **Always use try-catch**
   ```typescript
   try {
     const data = await service.method()
   } catch (error) {
     handleError(error)
   }
   ```

2. **Show loading states**
   ```typescript
   const [loading, setLoading] = useState(false)
   
   setLoading(true)
   const data = await service.method()
   setLoading(false)
   ```

3. **Handle errors gracefully**
   ```typescript
   catch (error) {
     if (error.message.includes('token')) {
       // Auth error
     } else {
       // Other error
     }
   }
   ```

4. **Use parallel requests**
   ```typescript
   const [data1, data2] = await Promise.all([
     service1.method(),
     service2.method()
   ])
   ```

5. **Clean up resources**
   ```typescript
   useEffect(() => {
     let cancelled = false
     
     async function load() {
       const data = await service.method()
       if (!cancelled) setData(data)
     }
     
     load()
     return () => { cancelled = true }
   }, [])
   ```

---

## 🎨 UI Integration Examples

### Loading Skeleton
```typescript
{loading ? (
  <SkeletonPost />
) : (
  <PostCard post={post} />
)}
```

### Error State
```typescript
{error ? (
  <div className="text-red-500">
    {error.message}
  </div>
) : (
  <Content />
)}
```

### Empty State
```typescript
{posts.length === 0 ? (
  <div>Chưa có bài đăng nào</div>
) : (
  posts.map(post => <PostCard key={post.id} post={post} />)
)}
```

---

## 📞 Support

If you encounter any issues:

1. Check the console for error messages
2. Verify authentication token exists
3. Check network tab in DevTools
4. Verify backend is running
5. Check API_BASE_URL in config

---

*Quick reference guide - Last updated: December 10, 2025*
