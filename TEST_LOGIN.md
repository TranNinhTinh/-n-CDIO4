# 🔧 FIX: Lỗi Đăng Nhập

## ❌ Lỗi Ban Đầu
```
identifier must be a string
```

## ✅ Nguyên Nhân
Backend yêu cầu trường `identifier` (có thể là email hoặc phone) thay vì `email`

## 🔨 Đã Sửa

### 1. Cập nhật LoginRequest interface
```typescript
// Trước:
export interface LoginRequest {
  email: string
  password: string
}

// Sau:
export interface LoginRequest {
  identifier: string  // Có thể là email hoặc phone
  password: string
}
```

### 2. Cập nhật trang đăng nhập
```typescript
// Trước:
const loginData: LoginRequest = {
  email: loginType === 'email' ? formData.email : formData.phone,
  password: formData.password
}

// Sau:
const loginData: LoginRequest = {
  identifier: loginType === 'email' ? formData.email : formData.phone,
  password: formData.password
}
```

### 3. Cải thiện thông báo lỗi

#### Login:
- **401/Unauthorized/Invalid**: "Tài khoản hoặc mật khẩu không đúng. Vui lòng kiểm tra lại!"
- **400**: "Thông tin đăng nhập không hợp lệ. Vui lòng kiểm tra lại!"
- **404**: "Tài khoản không tồn tại. Vui lòng đăng ký tài khoản mới!"

#### Register:
- **409/Exist/Duplicate**: "Email hoặc số điện thoại đã được sử dụng. Vui lòng thử email/số điện thoại khác!"
- **400**: "Thông tin đăng ký không hợp lệ. Vui lòng kiểm tra lại!"

---

## 🧪 Cách Test

### Test 1: Đăng ký tài khoản mới
```
1. Vào: http://localhost:3001/dang-ky
2. Chọn: CUSTOMER
3. Email: test123@example.com
4. Phone: 0912345678
5. Password: Password123!
6. Confirm: Password123!
7. Nhấn "Đăng ký"
8. Kiểm tra: 
   - Có alert "Đăng ký thành công!"?
   - Có redirect về /dang-nhap?
```

### Test 2: Đăng nhập bằng Email
```
1. Vào: http://localhost:3001/dang-nhap
2. Chọn tab: Email
3. Email: test123@example.com
4. Password: Password123!
5. Nhấn "Đăng nhập"
6. Kiểm tra:
   - Console log: identifier được gửi đúng?
   - Có redirect về /home?
```

### Test 3: Đăng nhập bằng Phone
```
1. Vào: http://localhost:3001/dang-nhap
2. Chọn tab: Số điện thoại
3. Phone: 0912345678
4. Password: Password123!
5. Nhấn "Đăng nhập"
6. Kiểm tra:
   - Console log: identifier được gửi đúng?
   - Có redirect về /home?
```

### Test 4: Lỗi đăng nhập
```
1. Vào: http://localhost:3001/dang-nhap
2. Email: wrong@email.com
3. Password: wrongpassword
4. Nhấn "Đăng nhập"
5. Kiểm tra:
   - Hiển thị: "Tài khoản hoặc mật khẩu không đúng. Vui lòng kiểm tra lại!"
   - Màu đỏ, rõ ràng
```

### Test 5: Đăng ký email trùng
```
1. Đăng ký tài khoản với email đã tồn tại
2. Kiểm tra:
   - Hiển thị: "Email hoặc số điện thoại đã được sử dụng..."
```

---

## 📋 Format Dữ Liệu Gửi Lên Backend

### Login:
```json
{
  "identifier": "test@example.com",  // hoặc "0912345678"
  "password": "Password123!"
}
```

### Register:
```json
{
  "email": "test@example.com",
  "password": "Password123!",
  "confirmPassword": "Password123!",
  "phoneNumber": "0912345678",
  "accountType": "CUSTOMER"  // hoặc "WORKER"
}
```

---

## 🎯 Kết Quả

✅ **Login đã hoạt động** với cả Email và Phone  
✅ **Thông báo lỗi rõ ràng, dễ hiểu**  
✅ **Validation đầy đủ**  
✅ **Flow hoàn chỉnh: Đăng ký → Đăng nhập → Home**

---

## 🔍 Debug Console Logs

Khi đăng nhập, console sẽ hiển thị:

```javascript
🔵 Login Request: {
  url: '/api/auth/login',
  data: { identifier: 'test@example.com', password: '***' }
}
🔵 Login Response Status: 200
✅ Login Success: { user: {...} }
```

Nếu lỗi:

```javascript
❌ Login Error Response: {...}
// Hiển thị: "Tài khoản hoặc mật khẩu không đúng..."
```
