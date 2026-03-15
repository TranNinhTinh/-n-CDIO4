# Debug Loading Issue - Hướng dẫn khắc phục

## Vấn đề
Khi nhấn vào một cuộc trò chuyện, nó cứ loading mãi, không hiển thị tin nhắn.

## Nguyên nhân có thể

### 1. API Call Bị Lỗi
Hãy mở **Developer Console** (F12) và xem logs:

```
👤 Loading current user profile...      ← Nếu không thấy này, app chưa load
✅ Current user loaded: {...}           ← Nếu không thấy, getUserProfile/getMyProfile bị lỗi
📨 Setting up conversation: xxx         ← Nếu không thấy, conversation không được chọn
📨 Loading messages for conversation... ← Nếu không thấy, loadMessages không chạy
✅ Messages loaded: X messages          ← Nếu không thấy, getMessages API bị lỗi
👤 Loading other user profile: xxx      ← Nếu không thấy, loadOtherUserProfile không chạy
✅ Other user loaded: {...}             ← Nếu không thấy, getUserProfile bị lỗi
```

### 2. Kiểm tra Console Errors

**Nhìn vào cột "Errors" trong Developer Console:**

```
❌ Error loading current user: [ERROR_DETAILS]
❌ Error loading messages: [ERROR_DETAILS]
❌ Error loading other user profile: [ERROR_DETAILS]
```

## Các Trường Hợp Thường Gặp

### Case 1: Authentication Token Expired
**Log:** Tất cả API call đều trả về 401 Unauthorized
**Giải pháp:** 
- Logout rồi login lại
- Hoặc check token expiration logic

### Case 2: Backend API URL Sai
**Log:** Network tab hiển thị 404 NOT FOUND
**Endpoints cần kiểm tra:**
```
GET /api/profile/me              ← Lấy profile của user hiện tại
GET /api/profile/user/{userId}   ← Lấy profile của user khác
GET /chat/conversations/{id}/messages   ← Lấy tin nhắn
```

### Case 3: CORS Error
**Log:** "Access to XMLHttpRequest blocked by CORS policy"
**Giải pháp:** 
- Check backend CORS configuration
- Hoặc dùng Next.js API proxy route

### Case 4: currentUser Không Load
**Log:** "⏳ Waiting for currentUser to load..." liên tục
**Giải pháp:**
- Check `ProfileService.getMyProfile()` có hoạt động không
- Fallback logic đã được thêm - nó sẽ set placeholder user nếu API fail

## Cải Thiện Được Làm

✅ **Thêm detailed logging** - Giúp dễ debug hơn
✅ **Thêm messagesLoading state** - Show loading spinner riêng
✅ **Thêm currentUser dependency** - Đảm bảo currentUser load trước
✅ **Thêm fallback users** - Nếu profile API fail, vẫn có data để hiển thị
✅ **Dùng getMyProfile()** - Đúng endpoint thay vì getUserProfile('me')

## Test Steps

1. **Mở DevTools (F12)**
2. **Goto Console tab**
3. **Nhấn vào một conversation**
4. **Xem logs xuất hiện không:**
   - Nếu có `✅` logs → API call thành công, vấn đề ở UI rendering
   - Nếu có `❌` logs → API call fail, check error message
   - Nếu không có logs → App logic không chạy (check dependencies)

## Quick Fixes to Try

### Fix 1: Check Network Tab
Trong DevTools → Network tab, kiểm tra các request:
- `/api/profile/me` - Status code gì?
- `/chat/conversations` - Status code gì?
- `/chat/conversations/{id}/messages` - Status code gì?

### Fix 2: Check Token
```js
// Trong console, chạy:
localStorage.getItem('access_token')
// Nếu null hoặc empty → cần login lại
```

### Fix 3: Force Refresh
```js
// Bấm Ctrl+Shift+R (hard refresh)
// Hoặc clear localStorage:
localStorage.clear()
// Rồi refresh page
```

## Nếu Vẫn Không Được

Ghi lại những gì bạn thấy:
1. Console logs (đầy đủ từ khi chọn conversation)
2. Network tab errors (screenshot)
3. Browser DevTools errors (screenshot)

Rồi share thông tin đó để debug tiếp.
