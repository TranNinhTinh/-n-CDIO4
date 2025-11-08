import Image from 'next/image'

export default function ThoTotLogo({ className = "w-64" }: { className?: string }) {
  return (
    <div className={className}>
      <Image 
        src="/logo.png" 
        alt="Thợ Tốt Logo" 
        width={680} 
        height={540}
        className="w-full h-auto"
        priority
      />
    </div>
  )
}
