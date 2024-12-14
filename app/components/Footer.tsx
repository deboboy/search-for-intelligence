

export function Footer() {
  return (
    <footer className="bg-gray-100 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-600 mb-2 sm:mb-0">© 2024 Last Myle, LLC. All rights reserved.</p>
          <p className="text-sm text-gray-600">v{process.env.NEXT_PUBLIC_VERSION || '0.3.0'}</p>
          <nav className="space-x-4">
            <a href="https://www.lastmyle.co/connect" className="text-sm text-gray-600 hover:text-gray-900">Custom experiments?</a>
          </nav>
        </div>
      </div>
    </footer>
  )
}