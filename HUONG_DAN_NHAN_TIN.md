# Hướng Dẫn Nhắn Tin Với Thợ

## 🎯 Cách Nhắn Tin Với Thợ

### 1️⃣ Từ Trang Chủ (Home)
Khi xem bài đăng trên trang chủ:
- Mỗi bài đăng có nút **"Nhắn tin"** màu xanh ở phần actions (dưới bài đăng)
- Click nút **"Nhắn tin"** để mở cuộc trò chuyện với người đăng bài
- Hệ thống sẽ tự động:
  - Tạo cuộc trò chuyện mới (nếu chưa có)
  - Hoặc mở cuộc trò chuyện hiện có
  - Chuyển bạn đến trang Tin nhắn

**Lưu ý:** Nút "Nhắn tin" chỉ hiển thị với bài đăng của người khác (không hiển thị với bài của chính bạn)

### 2️⃣ Từ Trang Chi Tiết Bài Đăng
Khi xem chi tiết một bài đăng:
- Ở sidebar bên phải có 2 nút:
  - **"Ứng tuyển ngay"** - Gửi yêu cầu làm việc
  - **"Nhắn tin với người đăng"** - Mở chat trực tiếp

**Lưu ý:** Nếu đây là bài đăng của bạn, các nút sẽ không hiển thị và thay bằng thông báo "Đây là bài đăng của bạn"

### 3️⃣ Từ Trang Tin Nhắn
Truy cập trực tiếp: `/tin-nhan`
- Xem tất cả cuộc trò chuyện
- Tìm kiếm tin nhắn
- Gửi/nhận tin nhắn
- Xóa cuộc trò chuyện
- Đóng cuộc trò chuyện

## 📱 Tính Năng Chat

### Khi Bạn Click "Nhắn tin":
1. ✅ Hệ thống tự động tạo cuộc trò chuyện với người đăng bài
2. ✅ Chuyển đến trang tin nhắn
3. ✅ Cuộc trò chuyện mới sẽ xuất hiện trong danh sách
4. ✅ Bạn có thể bắt đầu gửi tin nhắn ngay

### Các Tính Năng Có Sẵn:
- 💬 Gửi tin nhắn văn bản
- 📝 Xem lịch sử tin nhắn
- 👀 Đánh dấu đã đọc tự động
- 🔔 Hiển thị số tin nhắn chưa đọc
- 🔍 Tìm kiếm tin nhắn
- 🗑️ Xóa cuộc trò chuyện
- 🔒 Đóng cuộc trò chuyện

## 🚀 Quy Trình Sử Dụng

### Tình Huống 1: Tìm Thợ và Nhắn Tin
```
1. Vào trang chủ (/home)
2. Xem các bài đăng tìm việc của thợ
3. Click "Nhắn tin" ở bài đăng bạn quan tâm
4. Hệ thống chuyển đến trang tin nhắn
5. Bắt đầu trò chuyện với thợ
```

### Tình Huống 2: Xem Chi Tiết và Nhắn Tin
```
1. Click vào một bài đăng để xem chi tiết
2. Đọc mô tả công việc, giá cả, địa điểm
3. Click "Nhắn tin với người đăng" ở sidebar
4. Thảo luận chi tiết về công việc qua chat
5. Thỏa thuận và bắt đầu làm việc
```

### Tình Huống 3: Quản Lý Tin Nhắn
```
1. Vào trang tin nhắn (/tin-nhan)
2. Xem tất cả cuộc trò chuyện
3. Click vào cuộc trò chuyện để xem
4. Gửi tin nhắn mới
5. Xóa hoặc đóng cuộc trò chuyện khi không cần
```

## 🔐 Bảo Mật

- ✅ Yêu cầu đăng nhập để nhắn tin
- ✅ Mỗi tin nhắn được liên kết với user ID
- ✅ Không thể nhắn tin với chính mình
- ✅ Bearer token authentication

## 📊 API Endpoints

### Tạo Cuộc Trò Chuyện
```
POST /api/chat/conversations/direct
Body: { "workerId": "user_id_của_thợ" }
```

### Gửi Tin Nhắn
```
POST /api/chat/conversations/{conversationId}/messages
Body: { "content": "Nội dung tin nhắn" }
```

### Xem Tin Nhắn
```
GET /api/chat/conversations/{conversationId}/messages
```

Xem thêm trong file `CHAT_API_DOCUMENTATION.md`

## 💡 Tips

1. **Nhắn tin nhiều người:**
   - Bạn có thể nhắn tin với nhiều thợ khác nhau
   - Mỗi cuộc trò chuyện độc lập
   - Quản lý tất cả trong trang tin nhắn

2. **Tìm kiếm nhanh:**
   - Dùng ô tìm kiếm trong trang tin nhắn
   - Tìm theo tên hoặc nội dung tin nhắn

3. **Theo dõi:**
   - Badge đỏ hiển thị số tin nhắn chưa đọc
   - Tin nhắn tự động đánh dấu đã đọc khi mở

## 🐛 Xử Lý Lỗi

### "Không thể xác định người đăng bài"
- Bài đăng có thể thiếu thông tin
- Thử refresh trang và thử lại

### "Không thể tạo cuộc trò chuyện"
- Kiểm tra kết nối internet
- Đăng nhập lại nếu cần
- Kiểm tra token còn hạn

### "Bạn không thể nhắn tin với chính mình"
- Đây là bài đăng của bạn
- Bạn không thể tự nhắn tin cho mình

## 📞 Hỗ Trợ

Nếu gặp vấn đề:
1. Check console logs (F12 > Console)
2. Check Network tab (F12 > Network)
3. Xem file `CHAT_API_DOCUMENTATION.md` để biết thêm chi tiết
