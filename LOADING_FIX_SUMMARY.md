# Fix Infinite Loading Issue - Summary

## 🎯 Problem
Khi nhấn vào một cuộc trò chuyện, page cứ "Đang tải dữ liệu..." mãi, không bao giờ hoàn tất.

## 🔍 Root Causes Identified

### 1. **Wrong Profile API Endpoint**
- Code dùng `ProfileService.getUserProfile('me')` 
- Endpoint thực tế là `/api/profile/user/{userId}` (không hỗ trợ 'me')
- **Fix:** Dùng `ProfileService.getMyProfile()` thay vì `getUserProfile('me')`

### 2. **Missing Loading State**
- Không có `messagesLoading` state để track loading status
- UI chỉ check `currentUser && otherUser` nhưng không check xem có đang load không
- **Fix:** Thêm `messagesLoading` state và show loading spinner khi loading

### 3. **Race Condition**
- `selectedConversation` được chọn trước khi `currentUser` load xong
- Khi `currentUser` là null, không thể xác định `otherUserId` đúng
- **Fix:** Thêm `currentUser` vào dependency array và check `if (!currentUser) return`

### 4. **Silent Failures**
- API errors không được log rõ ràng
- Nếu `loadOtherUserProfile()` fail, nó fallback nhưng vẫn cứ load mãi
- **Fix:** Thêm detailed console logs với emoji để dễ debug

### 5. **No Fallback for Failed Loads**
- Nếu `getMyProfile()` hoặc `getUserProfile()` fail, app bị stuck
- **Fix:** Thêm fallback users để vẫn có data để render

## ✅ Changes Made

### File: `/app/tin-nhan/page.tsx`

#### 1. Added Loading State
```typescript
const [messagesLoading, setMessagesLoading] = useState(false)
```

#### 2. Fixed Current User Loading
```typescript
// ❌ Before: ProfileService.getUserProfile('me') - WRONG ENDPOINT
// ✅ After: ProfileService.getMyProfile() - CORRECT ENDPOINT

const loadCurrentUser = async () => {
  try {
    console.log('👤 Loading current user profile...')
    const profile = await ProfileService.getMyProfile()
    console.log('✅ Current user loaded:', profile)
    setCurrentUser({...})
  } catch (error) {
    console.error('❌ Error loading current user:', error)
    // ✅ Added fallback user so app doesn't get stuck
    setCurrentUser({
      id: 'unknown',
      fullName: 'Me',
      displayName: 'Me',
      role: 'CUSTOMER'
    })
  }
}
```

#### 3. Fixed selectedConversation useEffect
```typescript
// ❌ Before: useEffect(() => { ... }, [selectedConversation])
// ✅ After: Properly wait for currentUser to load

useEffect(() => {
  if (!selectedConversation) return
  if (!currentUser) {
    console.log('⏳ Waiting for currentUser to load...')
    return
  }
  
  // Now safe to use currentUser
  loadMessages(selectedConversation.id)
  loadOtherUserProfile(otherUserId)
}, [selectedConversation, currentUser]) // ✅ Added currentUser dependency
```

#### 4. Enhanced loadMessages with Loading State
```typescript
const loadMessages = async (conversationId: string) => {
  try {
    setMessagesLoading(true) // ✅ Start loading
    console.log('📨 Loading messages for conversation:', conversationId)
    const data = await chatService.getMessages(conversationId)
    console.log('✅ Messages loaded:', data.length, 'messages')
    setMessages(data)
  } catch (error) {
    console.error('❌ Error loading messages:', error)
    setMessages([]) // ✅ Set empty array instead of alert
  } finally {
    setMessagesLoading(false) // ✅ End loading
  }
}
```

#### 5. Enhanced loadOtherUserProfile with Fallback
```typescript
const loadOtherUserProfile = async (userId: string) => {
  try {
    console.log('👤 Loading other user profile:', userId)
    const user = await ProfileService.getUserProfile(userId)
    console.log('✅ Other user loaded:', user)
    setOtherUser({...})
  } catch (error) {
    console.error('❌ Error loading other user profile:', error)
    // ✅ Fallback to show something instead of loading forever
    setOtherUser({
      id: userId,
      fullName: 'User',
      displayName: 'User'
    })
  }
}
```

#### 6. Updated UI Loading Logic
```typescript
// ❌ Before: {currentUser && otherUser ? <ChatQuoteFlow /> : <Loading />}
// ✅ After: Separate loading check

{messagesLoading ? (
  <div className="flex-1 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin..."></div>
      <p>Đang tải tin nhắn...</p>
    </div>
  </div>
) : currentUser && otherUser ? (
  <ChatQuoteFlow ... />
) : (
  <div className="flex-1 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin..."></div>
      <p>Đang tải thông tin cuộc trò chuyện...</p>
    </div>
  </div>
)}
```

## 🧪 How to Test

1. **Open DevTools Console (F12)**
2. **Click on a conversation**
3. **Watch the console logs:**
   - Should see: `👤 Loading current user profile...` immediately
   - Should see: `✅ Current user loaded:` within 1-2 seconds
   - Should see: `📨 Setting up conversation:` after currentUser loads
   - Should see: `✅ Messages loaded: X messages` within 1-2 seconds
   - Should see: `✅ Other user loaded:` within 1-2 seconds
4. **After ~3-4 seconds total, messages should appear**

## 🔧 Debugging Guide

See `DEBUG_LOADING_ISSUE.md` for detailed troubleshooting steps.

Quick command in Console:
```js
// Check what's preventing loading from completing
localStorage.getItem('access_token')  // Should not be null
fetch('/api/profile/me').then(r => console.log('Status:', r.status))
```

## 📊 Data Flow

```
Page Load
  ↓
loadCurrentUser() → ProfileService.getMyProfile()
  ├─ Sets currentUser state
  ├─ If fails: Sets fallback user
  └─ Triggers useEffect for selectedConversation
    ↓
selectedConversation + currentUser updated
  ↓
useEffect triggered with [selectedConversation, currentUser]
  ├─ loadMessages() → chatService.getMessages()
  ├─ loadOtherUserProfile() → ProfileService.getUserProfile()
  ├─ chatSocketService.joinConversation()
  └─ Each has fallbacks for errors
    ↓
Messages + User data loaded
  ↓
messagesLoading becomes false
  ↓
ChatQuoteFlow renders with all data
```

## ✨ Result

**Before:** Page stuck on "Đang tải dữ liệu..." forever if any API fails
**After:** 
- Shows appropriate loading message
- Falls back gracefully if APIs fail
- Provides detailed console logs for debugging
- Shows messages within 3-4 seconds with proper error handling
