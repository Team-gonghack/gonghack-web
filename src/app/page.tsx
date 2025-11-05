export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
          Welcome to <span className="text-blue-600 dark:text-blue-400">Gonghack</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-12 max-w-2xl">
          A modern Next.js application with TailwindCSS
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              ⚡ Fast
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Built with Next.js for optimal performance and SEO
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              🎨 Beautiful
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Styled with TailwindCSS for modern, responsive design
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              🚀 Ready
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Start building your application right away
            </p>
          </div>
        </div>

        <div className="mt-12 flex gap-4">
          <a
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Next.js Docs
          </a>
          <a
            href="https://tailwindcss.com/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-semibold"
          >
            TailwindCSS Docs
          </a>
        </div>
      </main>

      <footer className="mt-16 mb-8 text-gray-600 dark:text-gray-400">
        <p>Built with Next.js and TailwindCSS</p>
      </footer>
    </div>
  );
}
