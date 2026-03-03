import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[1fr_20px] items-center justify-items-center min-h-[calc(100vh-72px)] p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 items-center sm:items-start">
        <h1 className="text-4xl font-bold tracking-tight">
          My Next.js App
        </h1>
        <p className="text-lg text-center sm:text-left max-w-lg text-gray-600 dark:text-gray-400">
          Welcome to your company portal. Built with Next.js, TypeScript, Tailwind CSS, Clerk, and Supabase.
        </p>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            href="/quotes"
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          >
            View Quotes
          </Link>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read the Docs
          </a>
        </div>
      </main>
      <footer className="flex gap-6 flex-wrap items-center justify-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Company Portal</p>
      </footer>
    </div>
  );
}
