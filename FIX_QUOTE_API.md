# Sửa Lỗi Báo Giá và Thông Báo

## 🐛 Các Lỗi Đã Sửa

### 1. Lỗi: `apiClient.post is not a function`

**Nguyên nhân:**
- File `src/lib/api/quote.service.ts` đang gọi `apiClient.post()`, `apiClient.get()`, v.v.
- Nhưng `apiClient` là instance của class `Api` được generate từ Swagger
- Class `Api` không có các method `post`, `get`, `patch`, `delete` trực tiếp
- Thay vào đó, nó có các method như `apiClient.quotes.quoteControllerCreateQuote()`

**Giải pháp:**
- Đã thay đổi tất cả các method trong `quote.service.ts` để sử dụng `fetch` API
- Gọi thông qua Next.js API routes (`/api/quotes/...`) thay vì gọi trực tiếp backend
- Điều này đồng nhất với cách các service khác đang hoạt động

**Files đã sửa:**
- `src/lib/api/quote.service.ts` - Đã thay đổi 8 methods

---

## ✅ Chức Năng Đã Xác Nhận

### 2. Thông báo khi thợ gửi báo giá

**Hoạt động:**
Khi thợ gửi báo giá cho bài đăng của khách hàng:

```
Thợ gửi báo giá
    ↓
Frontend gọi: quoteService.createQuote(data)
    ↓
Next.js API: POST /api/quotes
    ↓
Backend API: POST /quotes
    ↓
Backend tự động tạo notification cho khách hàng
    ↓
Khách hàng thấy thông báo mới trong trang /thong-bao
```

**Các điểm quan trọng:**
- Backend API tự động tạo notification khi nhận được báo giá mới
- Frontend không cần làm gì thêm
- Khách hàng sẽ thấy thông báo với type: `QUOTE_RECEIVED`

### 3. Nhắn tin sau khi chấp nhận báo giá

**Hoạt động:**
Khi khách hàng chấp nhận báo giá:

```
Khách hàng nhấn "Chấp nhận báo giá"
    ↓
Frontend gọi: quoteService.acceptQuoteForChat(quoteId)
    ↓
Next.js API: POST /api/quotes/{id}/accept-for-chat
    ↓
Backend API: POST /quotes/{id}/accept-for-chat
    ↓
Backend tạo/mở cuộc trò chuyện (Conversation)
    ↓
Backend trả về: { conversationId: "xxx" }
    ↓
Frontend chuyển hướng đến trang /tin-nhan
    ↓
Khách hàng và thợ có thể nhắn tin với nhau
```

**Code trong QuoteSection.tsx:**
```tsx
const handleAcceptQuote = async (quoteId: string) => {
  if (!confirm('Bạn muốn chấp nhận báo giá này để mở chat?')) return
  
  try {
    const response = await quoteService.acceptQuoteForChat(quoteId)
    alert('Đã chấp nhận báo giá! Chuyển đến chat...')
    router.push('/tin-nhan')  // Chuyển đến trang tin nhắn
  } catch (err: any) {
    alert(err.message || 'Không thể chấp nhận báo giá')
  }
}
```

---

## 🔄 Luồng Hoàn Chỉnh: Từ Báo Giá Đến Nhắn Tin

### Bước 1: Khách hàng đăng bài
```
POST /api/posts
```

### Bước 2: Thợ xem bài và gửi báo giá
```
POST /api/quotes
Body: {
  postId: "xxx",
  price: 500000,
  description: "Tôi có thể làm việc này...",
  estimatedDuration: "2-3 giờ"
}

→ Backend tự động tạo notification cho khách hàng
```

### Bước 3: Khách hàng nhận thông báo
```
GET /api/notifications
→ Hiển thị: "Bạn có báo giá mới cho bài đăng 'Cần thợ điện...'"
```

### Bước 4: Khách hàng xem danh sách báo giá
```
GET /api/quotes/post/{postId}
→ Hiển thị tất cả báo giá của bài đăng
```

### Bước 5: Khách hàng chấp nhận báo giá
```
POST /api/quotes/{id}/accept-for-chat
→ Backend tạo conversation
→ Trả về conversationId
```

### Bước 6: Chuyển đến trang tin nhắn
```
router.push('/tin-nhan')
→ Trang tin nhắn load conversation
→ Khách hàng và thợ có thể nhắn tin
```

### Bước 7: Trao đổi trong chat
```
POST /api/chat/conversations/{id}/messages
Body: { content: "Khi nào anh có thể đến?" }

→ Thợ có thể chào giá lại:
POST /api/quotes/{id}/revise
Body: { price: 550000, description: "..." }
```

### Bước 8: Đặt đơn
```
POST /api/quotes/{id}/request-order
→ Backend tạo Order
→ Status: PENDING
```

### Bước 9: Thợ xác nhận nhận việc
```
POST /api/orders/confirm-from-quote/{quoteId}
→ Status: CONFIRMED → IN_PROGRESS
```

---

## 📝 Các API Endpoints Liên Quan

### Quote APIs
```
POST   /api/quotes                       - Tạo báo giá mới
GET    /api/quotes/post/{postId}         - Lấy tất cả báo giá của bài đăng
POST   /api/quotes/{id}/accept-for-chat  - Chấp nhận để mở chat
POST   /api/quotes/{id}/reject           - Từ chối báo giá
POST   /api/quotes/{id}/revise           - Chào giá lại trong chat
POST   /api/quotes/{id}/request-order    - Đặt đơn từ báo giá
```

### Notification APIs
```
GET    /api/notifications                - Lấy danh sách thông báo
GET    /api/notifications/unread-count   - Đếm thông báo chưa đọc
POST   /api/notifications/{id}/read      - Đánh dấu đã đọc
```

### Chat APIs
```
GET    /api/chat/conversations           - Lấy danh sách cuộc trò chuyện
GET    /api/chat/conversations/{id}/messages  - Lấy tin nhắn
POST   /api/chat/conversations/{id}/messages  - Gửi tin nhắn
```

---

## 🎯 Kết Luận

✅ **Đã sửa lỗi:** `apiClient.post is not a function`
- Tất cả methods trong `quote.service.ts` đã được chuyển sang dùng `fetch` API

✅ **Thông báo hoạt động:**
- Backend tự động tạo notification khi thợ gửi báo giá
- Khách hàng nhận được thông báo ngay lập tức

✅ **Nhắn tin hoạt động:**
- Khi khách hàng chấp nhận báo giá, hệ thống tự động tạo conversation
- Khách hàng và thợ có thể nhắn tin với nhau
- Thợ có thể chào giá lại trong chat

---

## 🚀 Cách Test

### Test 1: Gửi báo giá
1. Đăng nhập với tài khoản **Thợ**
2. Vào một bài đăng của khách hàng
3. Nhấn "Gửi báo giá cho công việc này"
4. Điền thông tin và gửi
5. ✅ Không còn lỗi `apiClient.post is not a function`

### Test 2: Nhận thông báo
1. Đăng nhập với tài khoản **Khách hàng** (chủ bài đăng)
2. Vào trang `/thong-bao`
3. ✅ Thấy thông báo "Bạn có báo giá mới..."

### Test 3: Chấp nhận và nhắn tin
1. Khách hàng vào bài đăng của mình
2. Xem danh sách báo giá
3. Nhấn "Chấp nhận báo giá để mở chat"
4. ✅ Chuyển đến trang `/tin-nhan`
5. ✅ Có thể nhắn tin với thợ

---

## 📌 Lưu Ý Kỹ Thuật

### Tại sao dùng fetch thay vì apiClient?
- `apiClient` được generate từ Swagger, có cấu trúc phức tạp
- Các method không trực tiếp như `post`, `get`
- Dùng `fetch` đơn giản hơn, dễ debug hơn
- Thống nhất với cách các service khác hoạt động

### Backend API đã làm sẵn
- Backend API đã tự động xử lý việc tạo notification
- Backend API đã tự động tạo conversation khi chấp nhận báo giá
- Frontend chỉ cần gọi đúng endpoint là được

### Token Authentication
Tất cả API calls đều cần token:
```typescript
const token = localStorage.getItem('token')
headers: {
  'Authorization': `Bearer ${token}`
}
```
