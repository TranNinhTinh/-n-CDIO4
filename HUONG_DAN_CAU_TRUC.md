# 📚 HƯỚNG DẪN CẤU TRÚC DỰ ÁN THỢ TỐT

## 🏠 TRANG CHỦ (HOME PAGE)

**File:** `app/page.tsx`  
**URL:** `http://localhost:3000/`

Đây là trang đầu tiên người dùng nhìn thấy khi truy cập website.

### Nội dung:
- Logo và tên ứng dụng "THỢ TỐT"
- 2 nút chính:
  - **Đăng nhập** → Chuyển đến `/dang-nhap`
  - **Đăng ký** → Chuyển đến `/dang-ky-buoc-1`

---

## 🔗 SƠ ĐỒ KẾT NỐI CÁC TRANG

```
┌─────────────────────────────────────────────────────────────┐
│                    TRANG CHỦ (/)                             │
│                   app/page.tsx                               │
│                                                              │
│  ┌──────────────┐              ┌──────────────┐            │
│  │ Nút Đăng nhập│──────────────│ Nút Đăng ký  │            │
│  └──────┬───────┘              └──────┬───────┘            │
└─────────┼──────────────────────────────┼──────────────────┘
          │                               │
          ▼                               ▼
┌─────────────────────┐         ┌─────────────────────┐
│   TRANG ĐĂNG NHẬP   │         │ ĐĂNG KÝ BƯỚC 1      │
│   /dang-nhap        │         │ /dang-ky-buoc-1     │
│ app/dang-nhap/      │         │ app/dang-ky-buoc-1/ │
│      page.tsx       │         │      page.tsx       │
│                     │         │                     │
│ • Email/SĐT         │         │ • Email             │
│ • Mật khẩu          │         │ • Mật khẩu          │
│ • Ghi nhớ           │         │ • Xác nhận MK       │
│ • Google login      │         │                     │
│                     │         │                     │
│ Links:              │         │ Links:              │
│ → Quên mật khẩu     │         │ → Đăng nhập ◄───────┼──┐
│ → Đăng ký           │         │ → Tiếp tục          │  │
└──────┬──────────────┘         └──────┬──────────────┘  │
       │                               │                  │
       │                               ▼                  │
       │                    ┌─────────────────────┐       │
       │                    │ ĐĂNG KÝ BƯỚC 2      │       │
       │                    │ /dang-ky-buoc-2     │       │
       │                    │ app/dang-ky-buoc-2/ │       │
       │                    │      page.tsx       │       │
       │                    │                     │       │
       │                    │ • Chọn loại TK:     │       │
       │                    │   - Khách hàng      │       │
       │                    │   - Thợ             │       │
       │                    │ • Email             │       │
       │                    │ • Số điện thoại     │       │
       │                    │                     │       │
       │                    │ Links:              │       │
       │                    │ → Đăng nhập ◄───────┼───────┘
       │                    │ → Tiếp tục          │
       │                    └─────────────────────┘
       │
       ▼
┌─────────────────────┐
│  QUÊN MẬT KHẨU      │
│  /quen-mat-khau     │
│ app/quen-mat-khau/  │
│      page.tsx       │
│                     │
│ BƯỚC 1:             │
│ • Nhập Email/SĐT    │
│ • Gửi mã xác thực   │
│       ↓             │
│ BƯỚC 2:             │
│ • Nhập mã 6 số      │
│ • Gửi lại mã        │
│ • Quay lại          │
│       ↓             │
│ BƯỚC 3:             │
│ • Mật khẩu mới      │
│ • Xác nhận MK       │
│                     │
│ Links:              │
│ → Đăng nhập         │
└─────────────────────┘
```

---

## 🔑 CÁCH LINK HOẠT ĐỘNG

### 1️⃣ **Component `<Link>` từ Next.js**

Next.js sử dụng component `<Link>` để điều hướng giữa các trang:

```tsx
import Link from 'next/link'

// Ví dụ:
<Link href="/dang-nhap">Đăng nhập</Link>
```

### 2️⃣ **Các link trong từng trang:**

#### **Trang Chủ** (`app/page.tsx`)
```tsx
<Link href="/dang-nhap">Đăng nhập</Link>      // → Đến trang đăng nhập
<Link href="/dang-ky-buoc-1">Đăng ký</Link>   // → Đến đăng ký bước 1
```

#### **Trang Đăng nhập** (`app/dang-nhap/page.tsx`)
```tsx
<Link href="/quen-mat-khau">Quên mật khẩu?</Link>    // → Đến quên mật khẩu
<Link href="/dang-ky-buoc-1">Đăng nhập</Link>        // → Đến đăng ký (có lỗi text)
```

#### **Đăng ký Bước 1** (`app/dang-ky-buoc-1/page.tsx`)
```tsx
<Link href="/dang-nhap">Đăng nhập</Link>              // → Quay lại đăng nhập
<button type="submit">Tiếp tục</button>               // → Sẽ chuyển đến bước 2
```

#### **Đăng ký Bước 2** (`app/dang-ky-buoc-2/page.tsx`)
```tsx
<Link href="/dang-nhap">Đăng nhập</Link>              // → Quay lại đăng nhập
<button type="submit">Tiếp tục</button>               // → Hoàn tất đăng ký
```

#### **Quên mật khẩu** (`app/quen-mat-khau/page.tsx`)
```tsx
<Link href="/dang-nhap">Đăng nhập</Link>              // → Quay lại đăng nhập
```

---

## 📁 CẤU TRÚC THỨ MỤC

```
doan/
├── app/
│   ├── page.tsx                    ← TRANG CHỦ (/)
│   ├── layout.tsx                  ← Layout chung cho tất cả trang
│   ├── globals.css                 ← CSS toàn cục
│   │
│   ├── dang-nhap/
│   │   └── page.tsx                ← Trang đăng nhập (/dang-nhap)
│   │
│   ├── dang-ky-buoc-1/
│   │   └── page.tsx                ← Đăng ký bước 1 (/dang-ky-buoc-1)
│   │
│   ├── dang-ky-buoc-2/
│   │   └── page.tsx                ← Đăng ký bước 2 (/dang-ky-buoc-2)
│   │
│   └── quen-mat-khau/
│       └── page.tsx                ← Quên mật khẩu (/quen-mat-khau)
│
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 🎯 QUY TẮC ROUTING CỦA NEXT.JS

Next.js sử dụng **File-based Routing**:

| File Path                          | URL Route          |
|------------------------------------|-------------------|
| `app/page.tsx`                     | `/`               |
| `app/dang-nhap/page.tsx`           | `/dang-nhap`      |
| `app/dang-ky-buoc-1/page.tsx`      | `/dang-ky-buoc-1` |
| `app/dang-ky-buoc-2/page.tsx`      | `/dang-ky-buoc-2` |
| `app/quen-mat-khau/page.tsx`       | `/quen-mat-khau`  |

---

## 🐛 LỖI CẦN SỬA

### ⚠️ **Trang Đăng nhập** - Footer sai text:
```tsx
// HIỆN TẠI (SAI):
<div className="mt-6 text-center text-sm text-gray-600">
  Đã có tài khoản?{' '}
  <Link href="/dang-ky-buoc-1">Đăng nhập</Link>
</div>

// NÊN SỬA THÀNH:
<div className="mt-6 text-center text-sm text-gray-600">
  Chưa có tài khoản?{' '}
  <Link href="/dang-ky-buoc-1">Đăng ký</Link>
</div>
```

---

## 💡 LƯU Ý

1. **Trang chủ** (`app/page.tsx`) là điểm bắt đầu của ứng dụng
2. **Link component** từ Next.js tự động xử lý navigation không reload trang
3. **URL path** được tự động tạo dựa trên tên thư mục trong `app/`
4. Tất cả trang đều sử dụng layout chung từ `app/layout.tsx`
5. CSS toàn cục được import trong `app/globals.css`

---

## 🚀 CÁCH THÊM TRANG MỚI

Ví dụ muốn tạo trang "Về chúng tôi":

1. Tạo folder mới: `app/ve-chung-toi/`
2. Tạo file: `app/ve-chung-toi/page.tsx`
3. URL tự động: `http://localhost:3000/ve-chung-toi`
4. Link từ trang khác:
   ```tsx
   <Link href="/ve-chung-toi">Về chúng tôi</Link>
   ```

---

📝 **Ghi chú:** File này giải thích cấu trúc dự án và cách các trang kết nối với nhau.
