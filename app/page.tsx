import Link from 'next/link'
import { Space_Grotesk } from 'next/font/google'
import ThoTotLogo from './components/ThoTotLogo'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })

const stats = [
  { value: '5,200+', label: 'Thợ đã xác thực' },
  { value: '18,000+', label: 'Công việc/tháng' },
  { value: '4.9/5', label: 'Điểm hài lòng' },
]

const highlights = [
  {
    title: 'Đăng yêu cầu trong 2 phút',
    description: 'Chọn hạng mục, thêm hình ảnh, thời gian mong muốn và nhận thông báo ngay khi có thợ phù hợp.',
  },
  {
    title: 'Báo giá minh bạch',
    description: 'So sánh báo giá, xem hồ sơ và “chat” trực tiếp với thợ trước khi chốt.',
  },
  {
    title: 'Theo dõi toàn bộ hành trình',
    description: 'Từ báo giá đến hoàn tất, mọi trạng thái đều hiển thị rõ ràng trong bảng điều khiển.',
  },
]

const steps = [
  {
    id: '01',
    title: 'Tạo yêu cầu',
    body: 'Điền biểu mẫu trực quan, mô tả nhu cầu và vị trí. Thợ Tốt gợi ý thợ phù hợp dựa trên kinh nghiệm và khoảng cách.',
  },
  {
    id: '02',
    title: 'Nhận báo giá & trao đổi',
    body: 'Nhận nhiều báo giá minh bạch, dùng chat tích hợp để hỏi thêm và gửi hình ảnh thực tế.',
  },
  {
    id: '03',
    title: 'Giám sát và đánh giá',
    body: 'Chốt đơn, theo dõi tiến độ, xác nhận hoàn thành và đánh giá chất lượng ngay trên nền tảng.',
  },
]

const testimonials = [
  {
    content:
      'Từ khi dùng Thợ Tốt, team vận hành của tôi không còn phải gọi từng thợ nữa. Báo giá rõ ràng và luôn có người nhận việc đúng hẹn.',
    author: 'Vân Anh – Quản lý tòa nhà',
  },
  {
    content:
      'Là thợ điện nước, tôi dễ dàng nhận khách gần nhà, cập nhật tiến độ và thanh toán đúng quy trình.',
    author: 'Trung Kiên – Thợ đối tác',
  },
]

export default function Home() {
  return (
    <main className={`${spaceGrotesk.className} relative min-h-screen bg-slate-950 text-white overflow-hidden`}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-teal-400/30 blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-cyan-400/20 blur-[200px]" />
      </div>

      <div className="relative z-10">
        <header className="max-w-6xl mx-auto px-6 py-6 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center">
              <ThoTotLogo className="w-10" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-teal-200">Thợ Tốt</p>
              <p className="text-lg font-semibold">Kết nối khách hàng & thợ chuyên nghiệp</p>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-200">
            <Link href="#features" className="hover:text-white transition-colors">
              Tính năng
            </Link>
            <Link href="#steps" className="hover:text-white transition-colors">
              Quy trình
            </Link>
            <Link href="#stories" className="hover:text-white transition-colors">
              Câu chuyện
            </Link>
            <Link
              href="/dang-nhap"
              className="rounded-full border border-white/40 px-4 py-2 text-xs uppercase tracking-wide hover:border-teal-200"
            >
              Đăng nhập
            </Link>
            <Link
              href="/dang-ky"
              className="rounded-full bg-gradient-to-r from-teal-300 to-cyan-300 px-4 py-2 text-xs uppercase tracking-wide text-slate-900"
            >
              Trải nghiệm miễn phí
            </Link>
          </nav>
        </header>

        <section className="max-w-6xl mx-auto px-6 py-14 lg:py-20 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-teal-200">Nền tảng dịch vụ on-demand</p>
            <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Tìm thợ uy tín cho mọi nhu cầu sửa chữa, lắp đặt, vệ sinh chỉ trong vài thao tác.
            </h1>
            <p className="mt-6 text-lg text-slate-200">
              Thợ Tốt giúp khách hàng và thợ giao tiếp, thương lượng và quản lý đơn hàng một cách minh bạch. Không còn gọi điện hay ghi chú rời rạc.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/dang-ky"
                className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-slate-900 font-semibold shadow-lg shadow-teal-400/30"
              >
                Bắt đầu ngay →
              </Link>
              <Link
                href="/dang-nhap"
                className="inline-flex items-center justify-center rounded-full border border-white/40 px-8 py-3 font-semibold text-white hover:border-teal-200"
              >
                Xem bảng điều khiển
              </Link>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.3em] text-slate-300">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/70 to-slate-800/30 p-8 shadow-2xl shadow-teal-500/20">
            <p className="text-xs uppercase tracking-[0.4em] text-teal-200">Điểm nổi bật</p>
            <div className="mt-8 space-y-6">
              {highlights.map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/5 bg-white/5 p-5">
                  <p className="text-lg font-semibold">{item.title}</p>
                  <p className="mt-2 text-sm text-slate-200">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="max-w-6xl mx-auto px-6 py-16">
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 lg:p-12">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-teal-200">Tính năng toàn diện</p>
                <h2 className="mt-4 text-3xl font-bold">Một nền tảng – nhiều công cụ</h2>
              </div>
              <p className="max-w-xl text-slate-200">
                Từ đăng việc, chat, gửi báo giá đến quản lý đơn hàng và thông báo real-time, mọi thứ đều nằm trong giao diện thống nhất.
              </p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {['Đăng & duyệt việc', 'Chat & báo giá', 'Theo dõi đơn hàng'].map((feature, index) => (
                <div key={feature} className="rounded-3xl border border-white/5 bg-gradient-to-b from-slate-900/70 to-slate-900/20 p-6">
                  <p className="text-xs uppercase tracking-[0.4em] text-teal-200">0{index + 1}</p>
                  <h3 className="mt-4 text-2xl font-semibold">{feature}</h3>
                  <p className="mt-3 text-sm text-slate-300">
                    {index === 0 && 'Form hướng dẫn từng bước kèm thư viện hình ảnh và danh mục có sẵn.'}
                    {index === 1 && 'Chat real-time, chia sẻ file, cập nhật trạng thái và thương lượng ngay lập tức.'}
                    {index === 2 && 'Timeline trạng thái, xác nhận hoàn thành và lịch sử thanh toán minh bạch.'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="steps" className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.id} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-3xl font-bold text-teal-200">{step.id}</p>
                <h3 className="mt-4 text-2xl font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm text-slate-200">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="stories" className="max-w-6xl mx-auto px-6 py-16">
          <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-900/30 p-10">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-teal-200">Câu chuyện thành công</p>
                <h2 className="mt-4 text-3xl font-bold">Niềm tin từ cộng đồng</h2>
              </div>
              <Link
                href="/dang-ky"
                className="rounded-full bg-white px-6 py-3 text-slate-900 font-semibold shadow-lg shadow-teal-300/30"
              >
                Trở thành thành viên
              </Link>
            </div>
            <div className="mt-10 grid gap-8 md:grid-cols-2">
              {testimonials.map((item) => (
                <div key={item.author} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <p className="text-lg">“{item.content}”</p>
                  <p className="mt-4 text-xs uppercase tracking-[0.3em] text-teal-200">{item.author}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 pb-20">
          <div className="rounded-[28px] border border-white/10 bg-white/10 p-10 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-teal-200">Sẵn sàng khởi động?</p>
            <h2 className="mt-4 text-3xl font-bold">
              Hơn 5.000 khách hàng và thợ đã dùng Thợ Tốt để xử lý công việc nhanh hơn mỗi ngày.
            </h2>
            <p className="mt-4 text-slate-100">
              Tạo tài khoản miễn phí, khám phá bảng điều khiển trực quan và bắt đầu kết nối chỉ trong vài phút.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/dang-ky"
                className="rounded-full bg-white px-8 py-3 text-slate-900 font-semibold shadow-lg shadow-teal-400/30"
              >
                Đăng ký miễn phí
              </Link>
              <Link
                href="/dang-nhap"
                className="rounded-full border border-white/40 px-8 py-3 font-semibold text-white hover:border-teal-200"
              >
                Tôi đã có tài khoản
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
