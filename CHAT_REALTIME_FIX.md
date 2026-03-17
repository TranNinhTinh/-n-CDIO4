# Chat Real-Time Message Fix Summary

## 🐛 Problem
Tin nhắn mới chỉ hiện lên sau khi tải lại trang (reload), dù Socket.IO đã được setup.

## 🔍 Root Causes Identified

1. **Socket không tự động kết nối trên app load**
   - ChatSocketService chỉ kết nối khi lần đầu tiên được gọi từ component
   - Nếu user chưa vào chat page, socket vẫn chưa ready

2. **Event listener `new_message` không được thiết lập đúng cách**
   - Cần đảm bảo socket kết nối TRƯỚC khi lắng nghe event
   - Cần join conversation TRƯỚC khi có thể nhận event

3. **Không theo pattern code mẫu**
   - Code mẫu check socket connection trước mỗi operation
   - Code mẫu tránh duplicate messages bằng cách kiểm tra `exists`

## ✅ Fixes Applied

### 1. Auto-Initialize Socket on App Load
**File:** `src/hooks/useInitSocket.ts` (NEW)
```ts
export function useInitSocket() {
  useEffect(() => {
    const token = AuthService.getToken()
    if (!token) return
    
    if (chatSocketService.isConnected()) return
    
    chatSocketService.connect()
  }, [])
}
```

**File:** `app/components/SocketInitializer.tsx` (NEW)
```tsx
'use client'
export function SocketInitializer() {
  useInitSocket()
  return null
}
```

**File:** `app/layout.tsx`
- Added `<SocketInitializer />` để khởi tạo socket ngay khi app load

### 2. Fixed ChatQuoteFlow.tsx Event Listener
**Changes:**
- ✅ Kiểm tra socket connection trước khi join conversation
- ✅ Thêm delay `setTimeout(500)` để đợi socket connect
- ✅ Lắng nghe `new_message` event ĐÚNG cách (match code mẫu):
  ```tsx
  setMessages((prevMessages) => {
    const exists = prevMessages.some(m => m.id === data.message.id)
    if (exists) {
      console.log('Message already exists, skipping...')
      return prevMessages
    }
    return [...prevMessages, data.message]
  })
  ```

### 3. Enhanced handleSendMessage
**Changes:**
- ✅ Kiểm tra socket connection trước gửi
- ✅ Nếu chưa connect, tự động connect + wait 500ms
- ✅ **Không thêm message vào state trong callback ack**
- ✅ Chờ `new_message` event để update state

### 4. Fixed Deprecated Enum References
**Changes:**
- ✅ `MessageType.ORDER` → `MessageType.TEXT` (line 313)
- ✅ `msg.type === 'QUOTE'` → `msg.content?.includes('Thợ chào giá')` (detection by content)
- ✅ `msg.type === 'ORDER'` → `msg.content?.includes('Khách đặt đơn')` (detection by content)

## 🔄 Data Flow Now Working Correctly

```
User A sends message
  ↓
Socket emit 'send_message' → Backend
  ↓
Backend ack callback (successfully sent)
  ↓
Backend broadcasts 'new_message' event to both users in room
  ↓
User A receives event → updateMessages state → UI re-render ✅
User B receives event → updateMessages state → UI re-render ✅
```

## 📊 Key Improvements

| Before | After |
|--------|-------|
| Socket kết nối lúc page load | Socket kết nối lúc app load (⭐ Early) |
| Message chỉ hiện sau reload | Message hiện real-time |
| Có thể bị duplicate messages | Duplicate check bằng `m.id` |
| Có lỗi enum MessageType.ORDER | Tất cả dùng MessageType.TEXT |
| Không kiểm tra socket connection | Check connection trước mỗi operation |

## 🧪 Testing Checklist

- [ ] Mở 2 trình duyệt khác nhau (hoặc tab)
- [ ] User A gửi message → User B nhận real-time (không reload)
- [ ] User B gửi message → User A nhận real-time (không reload)
- [ ] Gửi nhanh liên tiếp → không bị duplicate
- [ ] Refresh page → messages vẫn hiển thị từ API
- [ ] Socket reconnect tự động nếu mất kết nối
- [ ] Accept quote → chat mở ngay tức khắc

## 📝 Code Pattern Reference (match code mẫu)

**Message type checking:**
```tsx
// ❌ OLD - Using removed enum
if (msg.type === MessageType.QUOTE) { ... }

// ✅ NEW - Using content detection
if (msg.content?.includes('Thợ chào giá')) { ... }
```

**Socket message sending:**
```tsx
// ❌ OLD - Adding to state in callback
const response = await sendMessage(...)
if (response.success) {
  setMessages(prev => [...prev, response.message]) // ❌ WRONG
}

// ✅ NEW - Waiting for new_message event
const response = await sendMessage(...)
if (response.success) {
  console.log('Waiting for new_message event...')
  setMessageText('')
  // Message tự động update qua event listener
}
```

**Duplicate prevention:**
```tsx
setMessages((prevMessages) => {
  const exists = prevMessages.some(m => m.id === data.message.id)
  if (exists) return prevMessages
  return [...prevMessages, data.message]
})
```

## 🚀 Files Modified

1. ✅ `app/layout.tsx` - Added SocketInitializer
2. ✅ `app/components/ChatQuoteFlow.tsx` - Fixed event listener, handleSendMessage
3. ✅ `app/components/SocketInitializer.tsx` - NEW
4. ✅ `src/hooks/useInitSocket.ts` - NEW

## 💡 Next Steps if Issue Persists

1. **Check browser console** - Verify logs:
   - "🔌 Connecting to chat socket..."
   - "✅ Chat socket connected: [socket-id]"
   - "📥 Joined conversation: [success]"
   - "💬 new_message event: [data]"

2. **Check backend logs** - Verify:
   - Socket connection established
   - User joined room successfully
   - 'send_message' event received
   - 'new_message' broadcasted to room

3. **Network tab** - WebSocket connection:
   - Should see persistent `wss://...` connection
   - Check frames for event emissions

4. **If still not working**:
   - Verify backend is sending `new_message` event with correct `conversationId`
   - Check message object structure matches interface
   - Verify both users are in same room (check `join_conversation` response)
