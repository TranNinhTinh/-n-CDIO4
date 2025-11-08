# ✅ Flow Đăng Ký & Đăng Nhập

## 📋 Luồng Hoạt Động

### 1️⃣ Đăng Ký (Register)
**URL:** http://localhost:3001/dang-ky

**Các bước:**
1. Người dùng chọn loại tài khoản: **CUSTOMER** (Khách hàng) hoặc **WORKER** (Thợ)
2. Điền form:
   - Email
   - Số điện thoại
   - Mật khẩu
   - Xác nhận mật khẩu
3. Nhấn nút **"Đăng ký"**
4. ✅ Nếu thành công:
   - Hiển thị thông báo: "Đăng ký thành công! Vui lòng đăng nhập để tiếp tục."
   - Tự động chuyển về trang đăng nhập: `/dang-nhap`
5. ❌ Nếu thất bại:
   - Hiển thị lỗi phía trên form

### 2️⃣ Đăng Nhập (Login)
**URL:** http://localhost:3001/dang-nhap

**Các bước:**
1. Chọn phương thức đăng nhập: **Email** hoặc **Số điện thoại**
2. Điền form:
   - Email/Số điện thoại
   - Mật khẩu
   - (Tùy chọn) Ghi nhớ đăng nhập
3. Nhấn nút **"Đăng nhập"**
4. ✅ Nếu thành công:
   - Lưu access_token & refresh_token vào localStorage
   - Tự động chuyển đến trang home: `/home`
5. ❌ Nếu thất bại:
   - Hiển thị lỗi phía trên form

### 3️⃣ Trang Home
**URL:** http://localhost:3001/home

**Hiển thị:**
- Dashboard với các bài đăng tìm thợ
- Sidebar với danh mục dịch vụ
- Nút "Bạn cần tìm thợ gì?" để tạo bài đăng mới
- 10 bài đăng mẫu với các dịch vụ khác nhau

---

## 🔧 Cấu Trúc API

### Client → Next.js Proxy → Backend

```
Browser (Client)
    ↓ fetch('/api/auth/login')
Next.js API Route (app/api/auth/login/route.ts)
    ↓ fetch('https://postmaxillary-variably-justa.ngrok-free.dev/api/v1/auth/login')
Backend API (ngrok)
    ↓ Response
Next.js Proxy
    ↓ Response
Browser (Client)
```

**Lợi ích:** Tránh CORS vì request đầu tiên là same-origin (localhost → localhost)

---

## 📂 File Liên Quan

### Pages:
- `app/dang-ky/page.tsx` - Trang đăng ký
- `app/dang-nhap/page.tsx` - Trang đăng nhập  
- `app/home/page.tsx` - Trang home sau khi đăng nhập

### API Service:
- `src/lib/api/auth.service.ts` - Service xử lý authentication
- `src/lib/api/config.ts` - Cấu hình API endpoints

### Proxy Routes:
- `app/api/auth/login/route.ts` - Proxy cho login
- `app/api/auth/register/route.ts` - Proxy cho register

### Components:
- `app/components/ThoTotLogo.tsx` - Logo THỢ TỐT

---

## 🧪 Cách Test

### 1. Test Đăng Ký:
```bash
# Mở browser: http://localhost:3001/dang-ky
1. Chọn loại tài khoản: CUSTOMER hoặc WORKER
2. Email: test@example.com
3. Số điện thoại: 0987654321
4. Mật khẩu: Password123!
5. Xác nhận mật khẩu: Password123!
6. Nhấn "Đăng ký"
7. Kiểm tra có chuyển về /dang-nhap không
```

### 2. Test Đăng Nhập:
```bash
# Mở browser: http://localhost:3001/dang-nhap
1. Chọn Email hoặc Số điện thoại
2. Nhập thông tin vừa đăng ký
3. Nhấn "Đăng nhập"
4. Kiểm tra có chuyển đến /home không
5. Mở DevTools → Application → Local Storage
6. Kiểm tra có access_token & refresh_token không
```

### 3. Test Flow Hoàn Chỉnh:
```bash
1. Đăng ký tài khoản mới → Chuyển về đăng nhập
2. Đăng nhập bằng tài khoản vừa tạo → Vào trang home
3. Kiểm tra localStorage có token
4. Refresh trang home → Vẫn giữ đăng nhập (nếu có remember me)
```

---

## 🐛 Debug

### Kiểm tra Console:
```javascript
// Mở DevTools (F12) → Console
// Sẽ thấy các log:

🔵 Register Request: { ... }
🔵 Register Response Status: 201
✅ Register Success: { user: {...} }

🔵 Login Request: { ... }
🔵 Login Response Status: 200
✅ Login Success: { user: {...} }
```

### Kiểm tra Network:
```
DevTools → Network tab:
- Tìm request: /api/auth/register hoặc /api/auth/login
- Status: 200 (OK) hoặc 201 (Created)
- Response: { accessToken, refreshToken, user }
```

### Kiểm tra Server Terminal:
```bash
# Terminal chạy dev server sẽ hiển thị:
🔵 Proxy Register Request: { ... }
🔵 Proxy Register Response: 201 { ... }

🔵 Proxy Login Request: { ... }
🔵 Proxy Login Response: 200 { ... }
```

---

## ✅ Tính Năng Đã Hoàn Thành

- [x] Trang đăng ký với chọn loại tài khoản (CUSTOMER/WORKER)
- [x] Trang đăng nhập với Email/Số điện thoại
- [x] Validation form (email, password match, account type)
- [x] Tích hợp API thật qua proxy routes
- [x] Xử lý lỗi và hiển thị thông báo
- [x] Lưu token vào localStorage
- [x] Loading state khi đang xử lý
- [x] Chuyển hướng sau đăng ký: → /dang-nhap
- [x] Chuyển hướng sau đăng nhập: → /home
- [x] Trang home với 10 bài đăng mẫu
- [x] Logo THỢ TỐT
- [x] Responsive design với Tailwind CSS

---

## 🚀 Cách Chạy

```bash
# 1. Install dependencies (nếu chưa)
npm install

# 2. Chạy dev server
npm run dev

# 3. Mở browser
http://localhost:3001

# 4. Test flow:
# - Vào /dang-ky
# - Tạo tài khoản mới
# - Được redirect về /dang-nhap
# - Đăng nhập
# - Vào /home
```

---

## 📌 Notes

- Backend API sử dụng ngrok tunnel (có thể hết hạn)
- Nếu API không hoạt động, kiểm tra link ngrok còn valid không
- Token được lưu trong localStorage (client-side)
- Proxy routes giúp tránh CORS issues
- Sau khi đăng ký phải đăng nhập lại (bảo mật hơn)
