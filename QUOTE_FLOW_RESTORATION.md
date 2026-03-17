# 🔧 Khôi Phục Luồng Báo Giá Trên Trang Chi Tiết Bài Viết

## 📋 Vấn Đề
Chi tiết bài viết (post detail) bị mất đi flow chức năng **Báo giá** của thợ/service provider, chỉ hiển thị:
- ✅ Ứng tuyển ngay
- ✅ Nhắn tin với người đăng
- ❌ **Gửi báo giá (MISSING)**

Khách hàng (chủ bài đăng) có thể xem danh sách báo giá, nhưng thợ không thể gửi báo giá trực tiếp từ trang chi tiết bài viết.

---

## ✅ Giải Pháp Triển Khai

### 1. **Thêm Nút "Gửi Báo Giá"** (Xanh lá)
- Vị trí: Sidebar bên phải, dưới cùng của Action Buttons
- Hiển thị cho: Non-owners (thợ/service providers)
- Màu sắc: `bg-green-600` để phân biệt với các nút khác
- Sắp xếp: **Gửi báo giá** → Ứng tuyển ngay → Nhắn tin

```tsx
<button
  onClick={() => setShowQuoteModal(true)}
  className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
>
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
  <span>Gửi báo giá</span>
</button>
```

### 2. **Modal Form Báo Giá**
Modal hiện lên khi nhấn nút "Gửi báo giá" với các trường:

#### **Các Trường Input:**
- **Giá báo giá (đ)** - *Bắt buộc* ⭐
  - Type: `number`
  - Placeholder: "Nhập giá báo giá"
  
- **Mô tả công việc** - *Tùy chọn*
  - Type: `textarea` (4 dòng)
  - Placeholder: "Mô tả chi tiết công việc bạn có thể làm..."
  
- **Thời gian dự kiến (phút)** - *Tùy chọn*
  - Type: `number`
  - Placeholder: "Nhập thời gian (tính bằng phút)"

#### **Nút Hành Động:**
- **Hủy** - Đóng modal mà không lưu
- **Gửi báo giá** - Gửi báo giá (có loading spinner khi đang xử lý)

### 3. **Xử Lý Logic Khi Gửi Báo Giá**

```tsx
const handleSubmitQuote = async (e: React.FormEvent) => {
  // 1. Kiểm tra input
  if (!quoteForm.price.trim()) {
    alert('Vui lòng nhập giá báo giá')
    return
  }

  // 2. Gửi báo giá qua API
  const quoteResult = await quoteService.createQuote({
    postId: post.id,
    price: parseFloat(quoteForm.price),
    description: quoteForm.description,
    estimatedDuration: quoteForm.estimatedDuration ? parseInt(quoteForm.estimatedDuration) : undefined
  })

  // 3. Tạo conversation với chủ bài đăng (để có thể chat)
  const conversation = await chatService.createDirectConversation({
    providerId: post.customerId
  })

  // 4. Đóng modal và điều hướng đến trang tin nhắn
  setShowQuoteModal(false)
  setQuoteForm({ price: '', description: '', estimatedDuration: '' })
  alert('Đã gửi báo giá thành công! Chuyển đến trang tin nhắn...')
  router.push('/tin-nhan')
}
```

### 4. **States Mới Thêm**
```tsx
// Quote form states
const [showQuoteModal, setShowQuoteModal] = useState(false)
const [quoteForm, setQuoteForm] = useState({
  price: '',
  description: '',
  estimatedDuration: ''
})
const [isSubmittingQuote, setIsSubmittingQuote] = useState(false)
```

---

## 📁 File Được Cập Nhật

### `app/posts/[id]/page.tsx`
- ✅ Import `quoteService` để gửi báo giá
- ✅ Thêm states cho quote form
- ✅ Thêm handler `handleSubmitQuote()`
- ✅ Thêm nút "Gửi báo giá" trong sidebar (trước "Ứng tuyển ngay")
- ✅ Thêm Modal form báo giá ở cuối trang
- ✅ Fix: Sử dụng `providerId` thay vì `workerId` trong `createDirectConversation`
- ✅ Fix: Sử dụng `post.customer.id` thay vì `post.customer.customerId`

---

## 🔄 Luồng Hoàn Chỉnh: Thợ Gửi Báo Giá

```
1. Thợ xem chi tiết bài đăng
   ↓
2. Nhấn nút "Gửi báo giá" (Xanh lá)
   ↓
3. Modal hiện lên với form
   ├─ Giá báo giá (bắt buộc)
   ├─ Mô tả công việc (tùy chọn)
   └─ Thời gian dự kiến (tùy chọn)
   ↓
4. Nhấn "Gửi báo giá"
   ├─ API: quoteService.createQuote()
   ├─ API: chatService.createDirectConversation()
   └─ Thành công → Chuyển đến "/tin-nhan"
   ↓
5. Chủ bài đăng nhận thông báo "Báo giá mới"
   ├─ Xem danh sách báo giá trên post detail
   ├─ Nhấn "Chấp nhận báo giá"
   └─ Mở chat để thảo luận
```

---

## 🧪 Cách Kiểm Tra

### Test Case 1: Gửi Báo Giá Thành Công
1. Đăng nhập với tài khoản thợ (provider)
2. Vào trang chi tiết một bài đăng (không phải của bạn)
3. Nhấn nút "Gửi báo giá" (xanh lá)
4. Nhập:
   - Giá: `500000`
   - Mô tả: "Tôi có thể hoàn thành trong 2 ngày"
   - Thời gian: `120` (phút)
5. Nhấn "Gửi báo giá"
6. ✅ Nên thấy thông báo "Đã gửi báo giá thành công!"
7. ✅ Tự động chuyển đến trang `/tin-nhan`

### Test Case 2: Kiểm Tra Trên Trang Chủ (Customer)
1. Đăng nhập với tài khoản khách hàng (customer)
2. Vào trang chi tiết bài đăng của bạn
3. ✅ Nên thấy section "Báo Giá" với danh sách báo giá vừa nhận
4. ✅ Có thể xem chi tiết báo giá từ thợ
5. ✅ Có thể "Chấp nhận báo giá" để mở chat

### Test Case 3: Kiểm Tra Giao Diện
- ✅ Nút "Gửi báo giá" chỉ hiển thị cho non-owners
- ✅ Nút "Gửi báo giá" ở vị trí đầu tiên trong action buttons (trên "Ứng tuyển ngay")
- ✅ Modal có tiêu đề "Gửi báo giá" rõ ràng
- ✅ Modal có nút Hủy và Gửi báo giá
- ✅ Nút loading spinner khi đang gửi

---

## 🎨 UI/UX Improvements
- ✅ Màu xanh lá (`green-600`) phân biệt rõ ràng với các nút khác
- ✅ Icon tiền tệ phù hợp với chức năng
- ✅ Modal responsive trên mobile
- ✅ Confirm message trước khi submit
- ✅ Loading state rõ ràng (spinner + "Đang gửi...")
- ✅ Error handling với alert messages
- ✅ Auto-redirect đến tin nhắn để tiếp tục đàm phán

---

## 💡 Lợi Ích
1. **Cho Thợ:**
   - Có thể gửi báo giá trực tiếp từ trang chi tiết
   - Tự động tạo conversation để chat với khách hàng
   - Tăng conversion rate (gửi báo giá → nhận đơn hàng)

2. **Cho Khách Hàng:**
   - Nhận báo giá từ nhiều thợ
   - So sánh giá và chất lượng dịch vụ
   - Chọn thợ phù hợp nhất

3. **Cho Ứng Dụng:**
   - Hoàn thiện luồng báo giá → đơn hàng
   - Tăng engagement giữa thợ và khách hàng
   - Giảm tỷ lệ bỏ cuộc

---

## 📝 Notes
- Báo giá bắt buộc phải nhập giá, các trường khác tùy chọn
- Tự động tạo conversation để chuẩn bị cho việc chat sau
- Redirect đến `/tin-nhan` để thợ có thể tiếp tục đàm phán với khách hàng
- Notification tự động được backend gửi cho khách hàng khi thợ submit báo giá
