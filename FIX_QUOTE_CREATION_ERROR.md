# Sửa Lỗi "Failed to create quote"

## 🐛 Nguyên Nhân Lỗi

Lỗi **"Failed to create quote"** xảy ra do **mismatch kiểu dữ liệu** giữa Frontend và Backend:

### Backend API Expect:
```typescript
interface CreateQuoteDto {
  postId: string
  price: number
  description: string
  estimatedDuration?: number  // ❗ NUMBER (phút)
}
```

### Frontend Gửi (SAI):
```typescript
{
  postId: "xxx",
  price: 500000,
  description: "...",
  estimatedDuration: "2-3 giờ"  // ❌ STRING
}
```

**Kết quả:** Backend reject request vì kiểu dữ liệu không đúng.

---

## ✅ Các Sửa Đổi

### 1. Sửa Interface trong `quote.service.ts`

**Trước:**
```typescript
export interface CreateQuoteRequest {
  postId: string
  price: number
  description: string
  estimatedDuration?: string  // ❌ SAI
}
```

**Sau:**
```typescript
export interface CreateQuoteRequest {
  postId: string
  price: number
  description: string
  estimatedDuration?: number  // ✅ ĐÚNG - Thời gian tính bằng phút
}
```

### 2. Sửa Form Input trong `QuoteSection.tsx`

**Trước:**
```tsx
<input
  type="text"
  placeholder="VD: 2-3 giờ"
/>
```

**Sau:**
```tsx
<input
  type="number"
  placeholder="VD: 120 (2 giờ)"
/>
```

### 3. Sửa Logic Submit

**Trước:**
```typescript
estimatedDuration: quoteForm.estimatedDuration || undefined  // ❌ String
```

**Sau:**
```typescript
estimatedDuration: quoteForm.estimatedDuration 
  ? parseInt(quoteForm.estimatedDuration)  // ✅ Parse sang number
  : undefined
```

### 4. Cải Thiện Hiển Thị Thời Gian

Thêm helper function để hiển thị thời gian dễ đọc:

```tsx
{quote.estimatedDuration && (
  <p className="text-xs text-gray-500 mb-2">
    ⏱️ Thời gian dự kiến: {
      quote.estimatedDuration >= 60 
        ? `${Math.floor(quote.estimatedDuration / 60)} giờ ${quote.estimatedDuration % 60 > 0 ? `${quote.estimatedDuration % 60} phút` : ''}`
        : `${quote.estimatedDuration} phút`
    }
  </p>
)}
```

**Ví dụ:**
- `120` phút → "2 giờ"
- `150` phút → "2 giờ 30 phút"
- `45` phút → "45 phút"

### 5. Thêm Logging Chi Tiết

Để dễ debug, đã thêm console.log ở nhiều điểm:

#### Frontend Service (`quote.service.ts`):
```typescript
console.log('Creating quote with data:', data)
console.log('Token:', token ? 'present' : 'missing')
console.log('Response status:', response.status)
console.log('Quote created successfully:', result)
```

#### API Route (`app/api/quotes/route.ts`):
```typescript
console.log('Creating quote - Body:', body)
console.log('API_BASE_URL:', API_BASE_URL)
console.log('Backend response status:', response.status)
console.log('Backend response data:', data)
```

#### Component (`QuoteSection.tsx`):
```typescript
console.log('Submitting quote for post:', postId)
console.log('Quote created:', result)
```

---

## 🧪 Cách Test

### Test 1: Gửi báo giá đơn giản
```
1. Đăng nhập tài khoản Thợ
2. Vào một bài đăng của khách hàng
3. Nhấn "Gửi báo giá cho công việc này"
4. Điền:
   - Giá: 500000
   - Mô tả: "Tôi có thể làm việc này trong 2 giờ"
   - Thời gian dự kiến: 120 (phút)
5. Nhấn "Gửi báo giá"

✅ Kết quả: "Đã gửi báo giá thành công!"
```

### Test 2: Gửi báo giá không có thời gian
```
1. Điền:
   - Giá: 300000
   - Mô tả: "Tôi có thể làm ngay"
   - Thời gian: (để trống)
2. Nhấn "Gửi báo giá"

✅ Kết quả: Vẫn gửi thành công (estimatedDuration là optional)
```

### Test 3: Kiểm tra Console Log
Mở Developer Tools (F12) → Console tab

```
Creating quote with data: {postId: "xxx", price: 500000, description: "...", estimatedDuration: 120}
Token: present
Response status: 201
Quote created successfully: {id: "yyy", ...}
```

✅ Không có lỗi màu đỏ

### Test 4: Khách hàng nhận thông báo
```
1. Đăng nhập tài khoản Khách hàng (chủ bài đăng)
2. Vào trang /thong-bao
3. ✅ Thấy thông báo "Bạn có báo giá mới..."
```

---

## 📊 So Sánh Trước & Sau

### Trước Sửa
```typescript
// Form nhập text tự do
<input type="text" placeholder="VD: 2-3 giờ" />

// Gửi lên backend
{
  estimatedDuration: "2-3 giờ"  // ❌ Backend reject
}

// Kết quả
Error: Failed to create quote
```

### Sau Sửa
```typescript
// Form nhập số phút
<input type="number" placeholder="VD: 120 (2 giờ)" />

// Parse sang number trước khi gửi
{
  estimatedDuration: 120  // ✅ Backend accept
}

// Hiển thị đẹp cho user
"Thời gian dự kiến: 2 giờ"

// Kết quả
Success: Đã gửi báo giá thành công!
```

---

## 📝 Quy Tắc Nhập Thời Gian

### Backend API Rules:
- `estimatedDuration` là **số nguyên** (integer)
- Đơn vị: **phút** (minutes)
- Optional: có thể bỏ trống

### Cách nhập:
- 30 phút → nhập `30`
- 1 giờ → nhập `60`
- 2 giờ → nhập `120`
- 2 giờ 30 phút → nhập `150`
- 3 giờ → nhập `180`

### Hiển thị tự động:
- `30` → "30 phút"
- `60` → "1 giờ"
- `120` → "2 giờ"
- `150` → "2 giờ 30 phút"

---

## 🎯 Kết Luận

✅ **Đã sửa lỗi:** Mismatch kiểu dữ liệu `estimatedDuration`
- Từ: `string` → Sang: `number` (phút)

✅ **Đã cải thiện:**
- Form input dễ hiểu hơn (nhập số phút)
- Hiển thị thời gian dễ đọc hơn (tự động convert)
- Thêm logging chi tiết để debug
- Auto reload danh sách báo giá sau khi gửi thành công

✅ **Các chức năng hoạt động:**
- Gửi báo giá ✓
- Nhận thông báo ✓
- Chấp nhận báo giá → Mở chat ✓
- Từ chối báo giá ✓
- Đặt đơn từ báo giá ✓

---

## 🔍 Nếu Vẫn Lỗi

Nếu vẫn gặp lỗi, kiểm tra:

### 1. Token có hợp lệ không?
```javascript
// Mở Console trong browser
localStorage.getItem('token')
// Phải có giá trị, không null
```

### 2. Backend API có chạy không?
```javascript
// Kiểm tra trong Console log
API_BASE_URL: https://postmaxillary-variably-justa.ngrok-free.dev/api/v1
Backend response status: 201  // ✅ Thành công
// Hoặc
Backend response status: 400  // ❌ Có lỗi
```

### 3. Xem chi tiết error từ backend
```javascript
// Trong Console tab, tìm log màu đỏ
Backend error: {
  error: "...",
  message: "...",
  statusCode: 400
}
```

### 4. Kiểm tra Network tab
```
F12 → Network tab → Filter: Fetch/XHR
→ Tìm request POST /api/quotes
→ Xem Request Payload và Response
```

---

## 📞 Support

Nếu cần debug thêm:
1. Chụp màn hình Console logs
2. Chụp màn hình Network tab (request/response)
3. Gửi cho dev để phân tích chi tiết
