# Thợ Tốt - Authentication UI

Giao diện đăng ký và đăng nhập được xây dựng với React, Next.js, và Tailwind CSS.

## Cài đặt

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt.

## Các trang

- `/` - Trang chủ
- `/dang-ky-buoc-1` - Đăng ký bước 1
- `/dang-ky-buoc-2` - Đăng ký bước 2
- `/dang-nhap` - Đăng nhập

## Công nghệ sử dụng

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Hooks** - State management

## Tính năng

✅ Form đăng ký 2 bước
✅ Form đăng nhập với email/số điện thoại
✅ Đăng nhập bằng Google
✅ Responsive design
✅ Validation form
✅ Remember me
✅ Quên mật khẩu link

## Cấu trúc thư mục

```
doan/
├── app/
│   ├── dang-ky-buoc-1/
│   │   └── page.tsx
│   ├── dang-ky-buoc-2/
│   │   └── page.tsx
│   ├── dang-nhap/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```
