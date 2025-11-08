# 🔍 DEBUG: Lỗi Đăng Nhập Bằng Phone

## ❌ **LỖI HIỆN TẠI:**

```
Proxy Login Response: 401
message: 'Invalid email or phone'
```

**Identifier gửi lên:** `0129477565`

---

## 🔎 **NGUYÊN NHÂN CÓ THỂ:**

### 1. **Số điện thoại không tồn tại trong database**
- Bạn đã đăng ký với email chứ không phải phone này
- Hoặc đăng ký với phone khác

### 2. **Format số điện thoại không khớp**
Khi đăng ký:
- Backend có thể lưu: `+84129477565`
- Hoặc: `84129477565`
- Hoặc: `0129477565`

Khi đăng nhập:
- Bạn nhập: `0129477565`
- Nhưng backend tìm không thấy vì format khác

### 3. **Backend chỉ hỗ trợ login bằng Email**
- Có thể backend chưa implement tìm user bằng phone
- Chỉ tìm bằng email

---

## ✅ **CÁCH KHẮC PHỤC:**

### **Giải pháp 1: Đăng nhập bằng EMAIL** (Khuyến nghị)

```
1. Vào: http://localhost:3001/dang-nhap
2. Chọn tab: "Email" (không phải Phone)
3. Nhập email bạn đã dùng khi đăng ký
4. Password: mytinh123!
5. Đăng nhập ✅
```

### **Giải pháp 2: Kiểm tra tài khoản đã đăng ký**

Hãy nhớ lại:
- Bạn đã đăng ký với **EMAIL NÀO**?
- Email đó là gì? (ví dụ: mytinh@example.com)
- Dùng email đó để đăng nhập thay vì phone

---

## 🧪 **TEST:**

### Test 1: Đăng ký tài khoản MỚI với cả Email và Phone
```bash
# Vào: http://localhost:3001/dang-ky

Email: test123@example.com
Phone: 0129477565
Password: mytinh123!
Confirm: mytinh123!
Account Type: CUSTOMER

→ Đăng ký
→ Alert "Thành công"
→ Redirect về /dang-nhap
```

### Test 2: Đăng nhập bằng EMAIL (vừa đăng ký)
```bash
# Vào: http://localhost:3001/dang-nhap

Chọn tab: Email
Email: test123@example.com
Password: mytinh123!

→ Đăng nhập
→ Vào /home ✅
```

### Test 3: Đăng nhập bằng PHONE (kiểm tra backend)
```bash
# Vào: http://localhost:3001/dang-nhap

Chọn tab: Số điện thoại
Phone: 0129477565
Password: mytinh123!

→ Đăng nhập
→ Nếu lỗi 401: Backend chưa hỗ trợ login bằng phone
→ Dùng Email thay thế
```

---

## 📊 **KIỂM TRA DATABASE (Nếu có quyền):**

Nếu bạn có thể truy cập database backend, hãy kiểm tra:

```sql
-- Xem user với phone này có tồn tại không
SELECT * FROM users WHERE phoneNumber = '0129477565';
SELECT * FROM users WHERE phoneNumber = '+84129477565';
SELECT * FROM users WHERE phoneNumber = '84129477565';

-- Hoặc xem tất cả users
SELECT id, email, phoneNumber FROM users;
```

---

## 🎯 **KẾT LUẬN:**

### Backend hiện tại:
- ✅ **Hỗ trợ đăng nhập bằng EMAIL** - Hoạt động tốt
- ❌ **Chưa hỗ trợ đăng nhập bằng PHONE** - Trả về 401 "Invalid email or phone"

### Khuyến nghị:
1. **Sử dụng EMAIL để đăng nhập** (đã test hoạt động)
2. Nếu muốn dùng phone, cần kiểm tra backend có hỗ trợ không
3. Có thể backend cần update để tìm user bằng phoneNumber field

---

## 💡 **THÔNG BÁO CHO NGƯỜI DÙNG:**

Tôi đã thêm thông báo trong form đăng nhập:

> ⚠️ **Lưu ý:** Hiện tại chỉ hỗ trợ đăng nhập bằng Email. Vui lòng chọn tab Email!

Người dùng sẽ biết phải dùng Email thay vì Phone.

---

## 🚀 **HÀNH ĐỘNG TIẾP THEO:**

1. **Thử đăng nhập bằng EMAIL** thay vì phone
2. Nếu không nhớ email, **đăng ký tài khoản mới**
3. Nếu cần thiết phải login bằng phone, **liên hệ team backend** để thêm feature này

Hãy thử lại với **EMAIL** và cho tôi biết kết quả! ✅
