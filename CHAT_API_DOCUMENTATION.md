# Tài liệu API Chat - Đã Triển khai

## Tổng quan
Hệ thống chat đã được triển khai đầy đủ với tất cả các API endpoints theo thiết kế và giao diện người dùng hiện đại.

## API Endpoints Đã Triển khai

### 1. GET /api/chat/conversations
**Mô tả:** Lấy danh sách tất cả các cuộc trò chuyện của người dùng

**Backend:** `app/api/chat/conversations/route.ts`

**Frontend Service:** `chatService.getConversations()`

**Response:**
```json
[
  {
    "id": "string",
    "workerId": "string",
    "workerName": "string",
    "workerAvatar": "string",
    "lastMessage": "string",
    "lastMessageTime": "string",
    "unreadCount": number,
    "isClosed": boolean,
    "createdAt": "string",
    "updatedAt": "string"
  }
]
```

### 2. GET /api/chat/conversations/{id}
**Mô tả:** Xem chi tiết một cuộc trò chuyện

**Backend:** `app/api/chat/conversations/[id]/route.ts`

**Frontend Service:** `chatService.getConversationById(id)`

### 3. DELETE /api/chat/conversations/{id}
**Mô tả:** Xóa một cuộc trò chuyện

**Backend:** `app/api/chat/conversations/[id]/route.ts`

**Frontend Service:** `chatService.deleteConversation(id)`

### 4. POST /api/chat/conversations/direct
**Mô tả:** Tạo cuộc trò chuyện mới với thợ

**Backend:** `app/api/chat/conversations/direct/route.ts`

**Frontend Service:** `chatService.createDirectConversation({ workerId })`

**Request Body:**
```json
{
  "workerId": "string"
}
```

### 5. POST /api/chat/conversations/{id}/messages
**Mô tả:** Gửi tin nhắn mới

**Backend:** `app/api/chat/conversations/[id]/messages/route.ts`

**Frontend Service:** `chatService.sendMessage(conversationId, { content })`

**Request Body:**
```json
{
  "content": "string"
}
```

### 6. GET /api/chat/conversations/{id}/messages
**Mô tả:** Lấy tất cả tin nhắn trong cuộc trò chuyện

**Backend:** `app/api/chat/conversations/[id]/messages/route.ts`

**Frontend Service:** `chatService.getMessages(conversationId)`

**Response:**
```json
[
  {
    "id": "string",
    "conversationId": "string",
    "senderId": "string",
    "senderName": "string",
    "senderAvatar": "string",
    "content": "string",
    "isRead": boolean,
    "createdAt": "string"
  }
]
```

### 7. POST /api/chat/conversations/{id}/read
**Mô tả:** Đánh dấu tất cả tin nhắn trong cuộc trò chuyện là đã đọc

**Backend:** `app/api/chat/conversations/[id]/read/route.ts`

**Frontend Service:** `chatService.markAsRead(conversationId)`

### 8. GET /api/chat/unread-count
**Mô tả:** Đếm tổng số tin nhắn chưa đọc

**Backend:** `app/api/chat/unread-count/route.ts`

**Frontend Service:** `chatService.getUnreadCount()`

**Response:**
```json
{
  "unreadCount": number
}
```

### 9. POST /api/chat/conversations/{id}/close
**Mô tả:** Đóng cuộc trò chuyện

**Backend:** `app/api/chat/conversations/[id]/close/route.ts`

**Frontend Service:** `chatService.closeConversation(conversationId)`

### 10. GET /api/chat/search
**Mô tả:** Tìm kiếm tin nhắn

**Backend:** `app/api/chat/search/route.ts`

**Frontend Service:** `chatService.searchMessages({ query, limit })`

**Query Parameters:**
- `query`: string (required)
- `limit`: number (optional)

## Cấu trúc Files

### Backend API Routes
```
app/api/chat/
├── conversations/
│   ├── route.ts                    (GET - List conversations)
│   ├── [id]/
│   │   ├── route.ts               (GET, DELETE - Detail/Delete conversation)
│   │   ├── close/
│   │   │   └── route.ts           (POST - Close conversation)
│   │   ├── messages/
│   │   │   └── route.ts           (GET, POST - Get/Send messages)
│   │   └── read/
│   │       └── route.ts           (POST - Mark as read)
│   └── direct/
│       └── route.ts                (POST - Create direct conversation)
├── unread-count/
│   └── route.ts                    (GET - Unread count)
└── search/
    └── route.ts                    (GET - Search messages)
```

### Frontend Structure
```
src/lib/api/
└── chat.service.ts                 (Chat API service với tất cả methods)

app/components/
├── ConversationItem.tsx            (Component hiển thị item cuộc trò chuyện)
├── MessageList.tsx                 (Component hiển thị danh sách tin nhắn)
└── MessageInput.tsx                (Component nhập tin nhắn)

app/tin-nhan/
└── page.tsx                        (Trang chính của chat)
```

## Tính năng Giao diện

### Trang Chat (app/tin-nhan/page.tsx)
- ✅ Danh sách cuộc trò chuyện với avatar, tên, tin nhắn cuối, thời gian
- ✅ Hiển thị số tin nhắn chưa đọc
- ✅ Tìm kiếm tin nhắn
- ✅ Chọn cuộc trò chuyện để xem chi tiết
- ✅ Hiển thị danh sách tin nhắn theo thời gian
- ✅ Gửi tin nhắn mới
- ✅ Xóa cuộc trò chuyện
- ✅ Đóng cuộc trò chuyện
- ✅ Đánh dấu đã đọc tự động
- ✅ Real-time updates (với state management)
- ✅ Loading states
- ✅ Error handling

### Components

#### ConversationItem
- Hiển thị avatar người dùng
- Tên người dùng
- Tin nhắn cuối cùng
- Thời gian
- Badge số tin nhắn chưa đọc
- Nút xóa cuộc trò chuyện
- Active state khi được chọn

#### MessageList
- Hiển thị tin nhắn theo ngày
- Phân biệt tin nhắn gửi/nhận
- Avatar người gửi
- Thời gian gửi
- Trạng thái đã đọc/chưa đọc
- Auto-scroll xuống tin nhắn mới nhất

#### MessageInput
- Input field để nhập tin nhắn
- Nút gửi
- Disable khi đang gửi
- Enter để gửi tin nhắn

## Authentication
Tất cả các API endpoints đều yêu cầu Bearer token trong header:
```
Authorization: Bearer <access_token>
```

Token được lấy từ `localStorage.getItem('access_token')`

## Lưu ý Production

### Backend
Hiện tại backend đang sử dụng mock data. Trong production cần:
1. Kết nối với database thật (PostgreSQL, MongoDB, etc.)
2. Implement WebSocket/Socket.IO cho real-time messaging
3. Xử lý pagination cho conversations và messages
4. Implement file upload cho attachments
5. Add rate limiting
6. Implement proper authorization checks

### Database Schema Đề xuất
```sql
-- Conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  worker_id UUID NOT NULL,
  is_closed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id),
  sender_id UUID NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_conversations_user ON conversations(user_id);
CREATE INDEX idx_conversations_worker ON conversations(worker_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);
```

## Testing

### Chạy ứng dụng
```bash
cd doan
npm run dev
```

### Kiểm tra các tính năng
1. Truy cập http://localhost:3000/tin-nhan
2. Kiểm tra load danh sách conversations
3. Click vào conversation để xem messages
4. Gửi tin nhắn mới
5. Test tìm kiếm
6. Test xóa conversation
7. Test đóng conversation

## API Integration

Để kết nối với backend thật, cập nhật `BASE_URL` trong `src/lib/api/config.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: 'https://your-backend-api.com/api/v1',
  // ...
}
```

## Troubleshooting

### Lỗi "Unauthorized"
- Kiểm tra token trong localStorage
- Đảm bảo đã đăng nhập
- Kiểm tra token chưa hết hạn

### Không load được conversations
- Kiểm tra network tab trong DevTools
- Xem response từ API
- Kiểm tra CORS settings

### Tin nhắn không gửi được
- Kiểm tra content không empty
- Xem console logs
- Verify API endpoint đang hoạt động

## Cải tiến trong tương lai
1. ✨ WebSocket cho real-time messaging
2. 📎 File attachments (images, documents)
3. 📱 Push notifications
4. 🎤 Voice messages
5. 👀 Typing indicators
6. ✅ Message reactions
7. 📌 Pin conversations
8. 🔍 Advanced search với filters
9. 🗂️ Message threading
10. 📊 Message analytics

## Hỗ trợ
Nếu có vấn đề, kiểm tra:
- Console logs trong browser
- Network requests trong DevTools
- Server logs trong terminal
