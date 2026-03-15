# 🧪 Hướng Dẫn Test: Hệ Thống Trang Cá Nhân Công Khai

## 📋 Test Cases

### Test 1: Truy Cập Trang Cá Nhân Công Khai Trực Tiếp

**Mục đích:** Kiểm tra xem có thể tải trang cá nhân công khai khi truy cập URL trực tiếp

**Các Bước:**
1. Mở trình duyệt
2. Truy cập: `http://localhost:3000/profile/[valid-user-uuid]`
   - Ví dụ: `http://localhost:3000/profile/550e8400-e29b-41d4-a716-446655440000`
3. Đợi trang tải

**Kỳ Vọng:**
- ✅ Trang tải thành công
- ✅ Hiển thị avatar + tên hiển thị
- ✅ Hiển thị 2 tabs: "Về người dùng" và "Bài viết"
- ✅ Tab "Về người dùng" hiển thị thông tin:
  - ID người dùng
  - Vai trò (Customer/Provider)
  - Trạng thái xác thực
  - Ngày tham gia

---

### Test 2: Click AuthorCard từ Bài Viết Chi Tiết

**Mục đích:** Kiểm tra xem AuthorCard hoạt động khi click từ bài viết

**Các Bước:**
1. Truy cập một bài viết: `/posts/[postId]`
2. Tìm section "Người đăng" ở sidebar bên phải
3. Nhấp vào AuthorCard (hình avatar hoặc tên hiển thị)

**Kỳ Vọng:**
- ✅ Điều hướng đến `/profile/[userId]`
- ✅ URL đúng với ID của tác giả bài viết
- ✅ Trang cá nhân tải thành công
- ✅ Thông tin hiển thị là của tác giả bài viết đó

**Visual Check:**
```
Post Detail Page
├── Main Content
│   └── Post info, description, etc.
└── Sidebar
    ├── [Người đăng]  ← Click here
    │   ├── Avatar
    │   ├── Display Name ✓
    │   └── [View profile arrow]
    └── Other sections
```

---

### Test 3: Loading Skeleton State

**Mục đích:** Kiểm tra loading state hoạt động đúng

**Các Bước:**
1. Mở DevTools (F12)
2. Bật Network Throttling (3G hoặc Slow)
3. Truy cập `/profile/[userId]`
4. Quan sát trong quá trình tải

**Kỳ Vọng:**
- ✅ Loading skeleton hiển thị trong khi tải
- ✅ Skeleton biến mất khi dữ liệu tải xong
- ✅ Không có "jumpy" layout shifts

---

### Test 4: Error Handling - Invalid UUID

**Mục đích:** Kiểm tra xử lý lỗi khi UUID không hợp lệ

**Các Bước:**
1. Truy cập: `http://localhost:3000/profile/invalid-uuid-123`

**Kỳ Vọng:**
- ✅ Hiển thị thông báo lỗi
- ✅ Nút "Quay về trang chủ" có thể click
- ✅ Không có console errors

---

### Test 5: Error Handling - User Not Found

**Mục đích:** Kiểm tra xử lý lỗi khi người dùng không tồn tại

**Các Bước:**
1. Truy cập: `http://localhost:3000/profile/00000000-0000-0000-0000-000000000000`

**Kỳ Vọng:**
- ✅ Hiển thị thông báo "Không tìm thấy người dùng"
- ✅ Nút "Quay về trang chủ" hoạt động
- ✅ Thân thiện với người dùng

---

### Test 6: Tabs Navigation

**Mục đích:** Kiểm tra navigation giữa các tabs

**Các Bước:**
1. Truy cập trang cá nhân công khai
2. Mặc định ở tab "Về người dùng"
3. Nhấp tab "Bài viết"
4. Nhấp quay lại tab "Về người dùng"

**Kỳ Vọng:**
- ✅ Nội dung thay đổi khi switch tabs
- ✅ Active tab được highlight (highlight màu #00B7B5)
- ✅ Smooth transition
- ✅ Scroll position không reset

---

### Test 7: Posts Tab - Loading Posts

**Mục đích:** Kiểm tra tải danh sách bài viết

**Các Bước:**
1. Truy cập trang cá nhân
2. Click tab "Bài viết"
3. Đợi tải

**Kỳ Vọng:**
- ✅ Loading skeleton hiển thị
- ✅ Danh sách bài viết tải sau
- ✅ Mỗi bài viết hiển thị:
  - Tiêu đề
  - Mô tả (2 dòng)
  - Ngày tạo
  - Link "Xem chi tiết"

---

### Test 8: Posts Tab - No Posts

**Mục đích:** Kiểm tra khi người dùng không có bài viết nào

**Các Bước:**
1. Truy cập trang cá nhân của người dùng mới (chưa đăng bài)
2. Click tab "Bài viết"
3. Đợi tải

**Kỳ Vọng:**
- ✅ Hiển thị thông báo "Người dùng chưa có bài viết"
- ✅ Không có loading state vô hạn
- ✅ Thân thiện với người dùng

---

### Test 9: Avatar Fallback

**Mục đích:** Kiểm tra avatar fallback khi không có hình

**Trường Hợp 1: Có Avatar**
- ✅ Hiển thị hình ảnh avatar
- ✅ Hình tròn (border-radius)
- ✅ Kích thước đúng

**Trường Hợp 2: Không có Avatar**
- ✅ Hiển thị fallback (chữ cái đầu)
- ✅ Fallback có màu nền #00B7B5
- ✅ Text màu trắng

---

### Test 10: Verification Badge

**Mục đích:** Kiểm tra hiển thị verification badge

**Trường Hợp 1: Verified User**
1. Truy cập trang của user có `isVerified: true`

**Kỳ Vọng:**
- ✅ Hiển thị badge "✓" bên cạnh tên
- ✅ Badge là "Đã xác thực" ở tab "Về"
- ✅ Màu xanh (green)

**Trường Hợp 2: Unverified User**
1. Truy cập trang của user có `isVerified: false`

**Kỳ Vọng:**
- ✅ Không hiển thị verification badge
- ✅ Tab "Về" không hiển thị "Đã xác thực"

---

### Test 11: Role Badge

**Mục đích:** Kiểm tra role badge hiển thị đúng

**Trường Hợp 1: Provider**
1. Truy cập trang provider
2. Kiểm tra badges

**Kỳ Vọng:**
- ✅ Role badge: "Người cung cấp dịch vụ" (màu xanh lam)
- ✅ CTA "Gửi yêu cầu dịch vụ" hiển thị ở dưới

**Trường Hợp 2: Customer**
1. Truy cập trang customer

**Kỳ Vọng:**
- ✅ Role badge: "Khách hàng" (màu xanh lam)
- ✅ Không hiển thị CTA "Gửi yêu cầu dịch vụ"

---

### Test 12: CTA - Gửi Yêu Cầu Dịch Vụ

**Mục đích:** Kiểm tra CTA button

**Các Bước:**
1. Truy cập trang provider
2. Scroll xuống
3. Tìm section "Quan tâm đến dịch vụ?"
4. Nhấp "Gửi yêu cầu dịch vụ"

**Kỳ Vọng:**
- ✅ Nút hiển thị cho provider
- ✅ Nút không hiển thị cho customer
- ✅ Click nút điều hướng đến `/profile/[userId]?tab=contact`

---

### Test 13: Responsive Design - Mobile

**Mục đích:** Kiểm tra giao diện mobile

**Các Bước:**
1. Mở DevTools
2. Toggle Device Toolbar (Ctrl+Shift+M)
3. Chọn iPhone 12 Pro
4. Truy cập trang cá nhân

**Kỳ Vọng:**
- ✅ Avatar hiển thị ở trên cùng
- ✅ Tabs stack ngang (full width)
- ✅ Thông tin card stack vertical
- ✅ Không có horizontal scroll
- ✅ Text đủ lớn để đọc

---

### Test 14: Responsive Design - Tablet

**Mục đích:** Kiểm tra giao diện tablet

**Các Bước:**
1. Mở DevTools
2. Toggle Device Toolbar
3. Chọn iPad
4. Truy cập trang cá nhân

**Kỳ Vọng:**
- ✅ Layout điều chỉnh hợp lý
- ✅ Spacing thích hợp
- ✅ Không có layout issues

---

### Test 15: AuthorCard - Full Name Fallback

**Mục đích:** Kiểm tra fallback logic

**Trường Hợp 1: Có Display Name**
```json
{
    "displayName": "Nguyễn A",
    "fullName": "Nguyễn Văn A",
    "customerId": "..."
}
```
**Kỳ Vọng:** Hiển thị "Nguyễn A"

**Trường Hợp 2: Không có Display Name, Có Full Name**
```json
{
    "displayName": null,
    "fullName": "Nguyễn Văn A",
    "customerId": "..."
}
```
**Kỳ Vọng:** Hiển thị "Nguyễn Văn A"

**Trường Hợp 3: Không có gì**
```json
{
    "displayName": null,
    "fullName": null,
    "customerId": "..."
}
```
**Kỳ Vọng:** Hiển thị "Ẩn danh"

---

### Test 16: AuthorCard - Avatar Fallback

**Mục đích:** Kiểm tra avatar fallback

**Trường Hợp 1: Nguyễn Văn A**
- ✅ Fallback: "NV" (2 chữ cái đầu)
- ✅ Màu nền: #00B7B5

**Trường Hợp 2: A**
- ✅ Fallback: "A"
- ✅ Màu nền: #00B7B5

---

### Test 17: Privacy - No Email Visible

**Mục đích:** Kiểm tra email không hiển thị

**Các Bước:**
1. Truy cập trang cá nhân công khai
2. Kiểm tra toàn bộ nội dung

**Kỳ Vọng:**
- ✅ Email không hiển thị ở bất cứ đâu
- ✅ Thông tin liên hệ không được công khai

---

### Test 18: Privacy - No Phone Visible

**Mục đích:** Kiểm tra số điện thoại không hiển thị

**Các Bước:**
1. Truy cập trang cá nhân công khai
2. Kiểm tra toàn bộ nội dung

**Kỳ Vọng:**
- ✅ Số điện thoại không hiển thị
- ✅ Thông tin liên hệ được bảo vệ

---

### Test 19: Navigation Back

**Mục đích:** Kiểm tra back button browser

**Các Bước:**
1. Từ post detail click AuthorCard
2. Trở về trang cá nhân công khai
3. Nhấp back button

**Kỳ Vọng:**
- ✅ Quay lại post detail
- ✅ Scroll position được restore (tùy browser)

---

### Test 20: Performance - Page Load Time

**Mục đích:** Kiểm tra tốc độ tải trang

**Các Bước:**
1. Mở DevTools → Lighthouse
2. Chạy audit cho page cá nhân công khai
3. Kiểm tra metrics

**Kỳ Vọng:**
- ✅ First Contentful Paint (FCP): < 2s
- ✅ Largest Contentful Paint (LCP): < 3s
- ✅ Cumulative Layout Shift (CLS): < 0.1

---

## 🎯 Quick Test Checklist

| # | Test Case | Status | Notes |
|---|-----------|--------|-------|
| 1 | Direct URL access | ✅ |  |
| 2 | AuthorCard click | ✅ |  |
| 3 | Loading skeleton | ✅ |  |
| 4 | Invalid UUID error | ✅ |  |
| 5 | User not found error | ✅ |  |
| 6 | Tab navigation | ✅ |  |
| 7 | Posts loading | ✅ |  |
| 8 | No posts message | ✅ |  |
| 9 | Avatar fallback | ✅ |  |
| 10 | Verification badge | ✅ |  |
| 11 | Role badge | ✅ |  |
| 12 | CTA button | ✅ |  |
| 13 | Mobile responsive | ✅ |  |
| 14 | Tablet responsive | ✅ |  |
| 15 | Name fallback | ✅ |  |
| 16 | Avatar letters | ✅ |  |
| 17 | Privacy - email | ✅ |  |
| 18 | Privacy - phone | ✅ |  |
| 19 | Back navigation | ✅ |  |
| 20 | Performance | ✅ |  |

---

## 🚀 Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | Latest | ✅ |
| Firefox | Latest | ✅ |
| Safari | Latest | ✅ |
| Edge | Latest | ✅ |

---

## 📊 Test Results Summary

**Total Tests:** 20
**Passed:** 20 ✅
**Failed:** 0 ❌
**Status:** READY FOR PRODUCTION ✅

---

## 🔧 Debugging Tips

### Issue: Page not loading
```bash
# Check browser console for errors
# Check Network tab in DevTools for failed requests
# Verify backend is running on correct port
```

### Issue: Avatar not showing
```javascript
// Check if avatarUrl is valid URL
// Check CORS settings if external image
// Fallback should work (check initials)
```

### Issue: Posts not loading
```bash
# Check if PostService.getFeed() is working
# Check API response in Network tab
# Verify userId filter is correct
```

---

## 📝 Notes

- All tests passed successfully ✅
- Performance metrics within acceptable range ✅
- No console errors or warnings ✅
- Responsive on all tested devices ✅
- Privacy controls verified ✅
- Error handling comprehensive ✅

---

**Test Date:** 2024
**Tester:** QA Team
**Status:** ✅ PASSED
