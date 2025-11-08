import Link from 'next/link'
import ThoTotLogo from './components/ThoTotLogo'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="mb-8">
          <div className="flex justify-center mb-6">
            <ThoTotLogo className="w-64 md:w-72" />
          </div>
          <p className="text-gray-600">Kết nối khách hàng và thợ chuyên nghiệp</p>
        </div>
        
        <div className="space-y-4">
          <Link href="/dang-nhap" className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200">
            Đăng nhập
          </Link>
          <Link href="/dang-ky" className="block w-full bg-white hover:bg-gray-50 text-blue-500 font-semibold py-3 px-6 rounded-lg border-2 border-blue-500 transition duration-200">
            Đăng ký
          </Link>
        </div>
      </div>
    </main>
  )
}
