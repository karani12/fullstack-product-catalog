import Navbar from '@/app/components/Navbar'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6">
      <Navbar />
      <main className="overflow-y-auto mt-6">{children}</main>
    </div>
  )
}
