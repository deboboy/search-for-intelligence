import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer className="bg-gray-100 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <Separator className="mb-4" />
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-600 mb-2 sm:mb-0">© 2024 Last Myle, LLC. All rights reserved.</p>
          <nav className="space-x-4">
            <a href="https://www.frankmartinez.xyz/message" className="text-sm text-gray-600 hover:text-gray-900">Research Inquiries</a>
          </nav>
        </div>
      </div>
    </footer>
  )
}