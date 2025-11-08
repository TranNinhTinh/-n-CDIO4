import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Thợ Tốt - Kết nối khách hàng và thợ chuyên nghiệp',
  description: 'Nền tảng kết nối khách hàng với thợ chuyên nghiệp',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  )
}
