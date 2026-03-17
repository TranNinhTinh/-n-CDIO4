# ✅ CHECKLIST KIỂM TRA CHỨC NĂNG CHO NGƯỜI DÙNG

## 📋 Hướng dẫn test ứng dụng ThoTot

---

## 1️⃣ ĐĂNG KÝ & ĐĂNG NHẬP

### Test Đăng Ký (`/dang-ky`)
- [ ] Mở trang đăng ký
- [ ] Nhập email, password, fullName, phone
- [ ] Click "Đăng ký"
- [ ] Kiểm tra có redirect về trang đăng nhập không
- [ ] Kiểm tra có hiển thị thông báo thành công không

### Test Đăng Nhập (`/dang-nhap`)
- [ ] Nhập email và password đã đăng ký
- [ ] Click "Đăng nhập"
- [ ] Kiểm tra có redirect về trang home không
- [ ] Kiểm tra token được lưu trong localStorage không

---

## 2️⃣ TRANG CHỦ (`/home`)

### Test Hiển Thị Feed
- [ ] Trang home load được danh sách bài đăng
- [ ] Mỗi bài đăng hiển thị đầy đủ: tiêu đề, mô tả, avatar, thời gian
- [ ] Avatar người đăng hiển thị đúng
- [ ] Click vào bài đăng → chuyển đến trang chi tiết

### Test Tìm Kiếm
- [ ] Nhập từ khóa vào ô search
- [ ] Kết quả tìm kiếm hiển thị real-time
- [ ] Click vào kết quả → xem profile người đó

### Test Sắp Xếp
- [ ] Thử các option sort: Latest, Relevant, Recent, Urgent
- [ ] Kiểm tra bài đăng được sắp xếp đúng

### Test Thông Báo & Tin Nhắn
- [ ] Kiểm tra số thông báo chưa đọc hiển thị đúng
- [ ] Kiểm tra số tin nhắn chưa đọc hiển thị đúng
- [ ] Click vào icon → chuyển đến trang tương ứng

---

## 3️⃣ PROFILE (`/profile`)

### Test Xem Profile
- [ ] Trang profile load được thông tin người dùng
- [ ] Avatar hiển thị đúng
- [ ] Thông tin cá nhân hiển thị: tên, email, phone

### Test Cập Nhật Thông Tin Cá Nhân
- [ ] Click tab "Thông tin cá nhân"
- [ ] Sửa fullName, displayName, bio, phone
- [ ] Click "Cập nhật"
- [ ] Kiểm tra có thông báo thành công không
- [ ] Reload trang → thông tin mới được lưu

### Test Cập Nhật Liên Hệ
- [ ] Click tab "Thông tin liên hệ"
- [ ] Sửa address, city, district, ward
- [ ] Click "Cập nhật"
- [ ] Kiểm tra lưu thành công

### Test Upload Avatar
- [ ] Click tab "Avatar"
- [ ] Chọn file ảnh (< 5MB)
- [ ] Click "Cập nhật avatar"
- [ ] Kiểm tra ảnh hiển thị ngay lập tức
- [ ] Reload trang → avatar mới được giữ

---

## 4️⃣ TẠO BÀI ĐĂNG (`/posts/create`)

### Test Tạo Bài Mới
- [ ] Click "Tạo bài đăng" từ home
- [ ] Nhập tiêu đề, mô tả
- [ ] (Optional) Nhập location, budget, desired time
- [ ] Click "Đăng bài"
- [ ] Kiểm tra có thông báo thành công không
- [ ] Kiểm tra redirect đến trang chi tiết bài đăng

### Test Sửa Bài Đăng
- [ ] Vào "Bài đăng của tôi"
- [ ] Click "Sửa" trên một bài đăng
- [ ] Form được pre-fill với dữ liệu cũ
- [ ] Sửa thông tin
- [ ] Click "Cập nhật"
- [ ] Kiểm tra cập nhật thành công

---

## 5️⃣ CHI TIẾT BÀI ĐĂNG (`/posts/[id]`)

### Test Xem Chi Tiết
- [ ] Click vào một bài đăng
- [ ] Thông tin đầy đủ hiển thị
- [ ] Avatar người đăng hiển thị
- [ ] Thời gian, location, budget hiển thị đúng

### Test Báo Giá (Dành cho Thợ)
- [ ] Scroll xuống phần "Báo giá"
- [ ] Click "Tạo báo giá"
- [ ] Nhập giá, mô tả, thời gian dự kiến
- [ ] Click "Gửi báo giá"
- [ ] Kiểm tra báo giá xuất hiện trong danh sách

### Test Xem Báo Giá (Dành cho Khách)
- [ ] Vào bài đăng của mình
- [ ] Kiểm tra danh sách báo giá
- [ ] Click "Chấp nhận" một báo giá → mở chat
- [ ] Click "Từ chối" một báo giá → báo giá bị xóa

### Test Chat với Người Đăng
- [ ] Click "Nhắn tin"
- [ ] Redirect đến trang tin nhắn
- [ ] Conversation được tạo tự động

### Test Quản Lý Bài (Chủ bài)
- [ ] Click menu "..." trên bài của mình
- [ ] Thử "Sửa" → redirect đến form sửa
- [ ] Thử "Đóng bài" → status chuyển thành CLOSED
- [ ] Thử "Xóa" → bài bị xóa và redirect về home

---

## 6️⃣ BÀI ĐĂNG CỦA TÔI (`/bai-dang-cua-toi`)

### Test Hiển Thị Danh Sách
- [ ] Load được tất cả bài đăng của mình
- [ ] Thống kê đúng: Tất cả, Đang mở, Đã đóng
- [ ] Mỗi bài hiển thị đầy đủ thông tin

### Test Filter
- [ ] Click tab "Tất cả" → hiển thị tất cả
- [ ] Click tab "Đang mở" → chỉ hiển thị OPEN
- [ ] Click tab "Đã đóng" → chỉ hiển thị CLOSED
- [ ] Count trên mỗi tab đúng

### Test Các Hành Động
- [ ] Click "Xem" → đến trang chi tiết
- [ ] Click "Sửa" → đến form edit
- [ ] Click "Đóng" → status chuyển CLOSED
- [ ] Click "Xóa" → bài bị xóa khỏi danh sách

---

## 7️⃣ TIN NHẮN (`/tin-nhan`)

### Test Danh Sách Conversations
- [ ] Load được danh sách conversations
- [ ] Tin nhắn cuối cùng hiển thị
- [ ] Số tin chưa đọc hiển thị đúng
- [ ] Conversations sắp xếp theo thời gian mới nhất

### Test Chat
- [ ] Click vào một conversation
- [ ] Load được danh sách messages
- [ ] Nhập tin nhắn và gửi
- [ ] Tin nhắn xuất hiện ngay lập tức
- [ ] Scroll lên xem tin cũ

### Test Real-time
- [ ] Mở 2 trình duyệt (2 tài khoản khác nhau)
- [ ] Gửi tin từ trình duyệt 1
- [ ] Kiểm tra trình duyệt 2 nhận được tin ngay lập tức
- [ ] Số tin chưa đọc tự động tăng

### Test Đánh Dấu Đã Đọc
- [ ] Click vào conversation có tin chưa đọc
- [ ] Số chưa đọc giảm xuống 0
- [ ] Badge "unread" biến mất

### Test Tìm Kiếm
- [ ] Nhập từ khóa vào ô search
- [ ] Kết quả tìm kiếm hiển thị đúng tin nhắn

---

## 8️⃣ THÔNG BÁO (`/thong-bao`)

### Test Hiển Thị Thông Báo
- [ ] Load được danh sách thông báo
- [ ] Thông báo chưa đọc có highlight
- [ ] Icon đúng với từng loại thông báo
- [ ] Số thông báo chưa đọc hiển thị

### Test Real-time
- [ ] Mở 2 trình duyệt
- [ ] Tạo báo giá từ trình duyệt 1 (thợ)
- [ ] Trình duyệt 2 (khách) nhận thông báo ngay
- [ ] Browser notification xuất hiện (nếu đã cho phép)

### Test Đánh Dấu Đã Đọc
- [ ] Click "Đánh dấu đã đọc" trên một thông báo
- [ ] Thông báo chuyển sang trạng thái đã đọc
- [ ] Click "Đánh dấu tất cả đã đọc"
- [ ] Tất cả thông báo chuyển sang đã đọc

### Test Xóa Thông Báo
- [ ] Click "Xóa" trên một thông báo
- [ ] Thông báo biến mất khỏi danh sách
- [ ] Click "Xóa tất cả đã đọc"
- [ ] Tất cả thông báo đã đọc bị xóa

### Test Filter
- [ ] Click "Tất cả" → hiển thị tất cả
- [ ] Click "Chưa đọc" → chỉ hiển thị chưa đọc

### Test Xử Lý Thông Báo Báo Giá
- [ ] Click vào thông báo có báo giá mới
- [ ] Modal chi tiết báo giá xuất hiện
- [ ] Có thể xem giá, mô tả, thời gian
- [ ] Click "Chấp nhận" → mở chat
- [ ] Click "Từ chối" → báo giá bị hủy

---

## 9️⃣ ĐƠN HÀNG (`/don-hang`)

### Test Hiển Thị Danh Sách
- [ ] Load được danh sách đơn hàng
- [ ] Mỗi đơn hiển thị: số đơn, status, giá, thông tin
- [ ] Status badge màu sắc đúng

### Test Thống Kê
- [ ] Số liệu thống kê hiển thị đúng
- [ ] Total, Pending, In Progress, Completed, Cancelled
- [ ] Tổng doanh thu (nếu có)

### Test Filter
- [ ] Filter theo status: All, Pending, In Progress, Completed, Cancelled
- [ ] Filter theo role: All, Customer, Provider
- [ ] Danh sách lọc đúng

### Test Quản Lý Đơn - Provider
- [ ] Vào một đơn hàng ở trạng thái IN_PROGRESS
- [ ] Click "Hoàn thành"
- [ ] Nhập ghi chú
- [ ] Status chuyển thành PROVIDER_COMPLETED

### Test Quản Lý Đơn - Customer
- [ ] Vào đơn hàng ở trạng thái PROVIDER_COMPLETED
- [ ] Click "Xác nhận hoàn thành"
- [ ] Nhập đánh giá (1-5 sao)
- [ ] Viết review
- [ ] Status chuyển thành COMPLETED

### Test Hủy Đơn
- [ ] Click "Hủy đơn"
- [ ] Nhập lý do hủy
- [ ] Đơn chuyển sang CANCELLED

### Test Xem Chi Tiết
- [ ] Click vào một đơn hàng
- [ ] Xem đầy đủ thông tin: order number, timeline, giá, người liên quan

---

## 🔟 LUỒNG HOÀN CHỈNH

### Test Luồng Khách Hàng Đăng Bài → Nhận Báo Giá → Đặt Đơn
1. [ ] Đăng nhập tài khoản CUSTOMER
2. [ ] Tạo bài đăng mới từ home
3. [ ] Chờ thợ báo giá (hoặc dùng tài khoản thợ khác để test)
4. [ ] Nhận thông báo có báo giá mới
5. [ ] Vào bài đăng → xem danh sách báo giá
6. [ ] Chấp nhận một báo giá → mở chat
7. [ ] Chat với thợ
8. [ ] Thợ xác nhận làm → tạo order
9. [ ] Theo dõi order trong trang "Đơn hàng"
10. [ ] Thợ hoàn thành → khách xác nhận → đánh giá

### Test Luồng Thợ Nhận Việc
1. [ ] Đăng nhập tài khoản WORKER
2. [ ] Xem feed bài đăng
3. [ ] Vào bài đăng phù hợp
4. [ ] Tạo báo giá
5. [ ] Chờ khách chấp nhận (nhận thông báo)
6. [ ] Chat với khách
7. [ ] Xác nhận làm việc → tạo order
8. [ ] Làm việc
9. [ ] Hoàn thành công việc → đánh dấu
10. [ ] Chờ khách xác nhận → nhận tiền

---

## ✅ CHECKLIST TỔNG HỢP

### Chức Năng Cơ Bản
- [ ] Đăng ký tài khoản mới
- [ ] Đăng nhập
- [ ] Đăng xuất
- [ ] Xem và sửa profile
- [ ] Upload avatar

### Bài Đăng
- [ ] Xem feed bài đăng
- [ ] Tạo bài đăng mới
- [ ] Sửa bài đăng
- [ ] Xóa bài đăng
- [ ] Đóng bài đăng
- [ ] Xem chi tiết bài đăng
- [ ] Tìm kiếm bài đăng

### Báo Giá
- [ ] Tạo báo giá cho bài đăng
- [ ] Xem danh sách báo giá
- [ ] Chấp nhận báo giá
- [ ] Từ chối báo giá
- [ ] Sửa báo giá
- [ ] Hủy báo giá

### Chat
- [ ] Xem danh sách conversations
- [ ] Gửi tin nhắn
- [ ] Nhận tin nhắn real-time
- [ ] Đánh dấu đã đọc
- [ ] Tìm kiếm tin nhắn
- [ ] Xóa conversation

### Thông Báo
- [ ] Xem danh sách thông báo
- [ ] Nhận thông báo real-time
- [ ] Đánh dấu đã đọc
- [ ] Đánh dấu tất cả đã đọc
- [ ] Xóa thông báo
- [ ] Xóa tất cả đã đọc
- [ ] Filter thông báo

### Đơn Hàng
- [ ] Xem danh sách đơn hàng
- [ ] Xem thống kê đơn hàng
- [ ] Filter đơn hàng
- [ ] Thợ hoàn thành đơn
- [ ] Khách xác nhận hoàn thành
- [ ] Đánh giá & review
- [ ] Hủy đơn hàng

---

## 🐛 GHI CHÚ LỖI

Nếu gặp lỗi, ghi chú lại:

### Lỗi 1:
- **Trang:** 
- **Hành động:** 
- **Lỗi:** 
- **Console log:** 

### Lỗi 2:
- **Trang:** 
- **Hành động:** 
- **Lỗi:** 
- **Console log:** 

---

## 💡 MẸO TEST

1. **Mở Developer Console** (F12) để xem logs
2. **Test với 2 tài khoản** (1 CUSTOMER, 1 WORKER) để test chat và thông báo
3. **Mở 2 trình duyệt** để test real-time features
4. **Cho phép browser notifications** để test thông báo
5. **Kiểm tra localStorage** để xem token và dữ liệu cached
6. **Test trên mobile** (responsive) nếu có thể

---

*Checklist này giúp bạn kiểm tra đầy đủ tất cả chức năng của ứng dụng ThoTot*  
*Đánh dấu ✅ khi hoàn thành mỗi mục*
