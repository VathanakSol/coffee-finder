import { Coffee, Heart, Github, Twitter, Globe } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl border-t border-amber-200/50 dark:border-gray-800/50 py-2 transition-colors duration-300">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">

        {/* Brand & Copyright */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <p className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
            <Coffee className="w-4 h-4 text-amber-600 dark:text-amber-500" />
            Coffee Finder<span className="text-xs">
              &copy; {currentYear} &mdash; Find your perfect coffee spot.
            </span>
          </p>
        </div>

        {/* Made with Love & Founder */}
        <div className="flex items-center gap-1.5 text-xs font-medium  dark:bg-gray-900/50 px-3 py-1.5 rounded-full border border-amber-100 dark:border-gray-800">
          Made with by
          <a
            href="https://github.com/VathanakSol"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-700 dark:text-amber-400 font-bold hover:underline transition-all"
          >
            Vathanak Sol
          </a>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-4">
          <a href="https://github.com/VathanakSol" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-gray-900 dark:hover:text-white transition-colors duration-300" aria-label="GitHub">
            <Github className="w-4 h-4" />
          </a>
          <a href="https://naktech.netlify.app" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-emerald-500 transition-colors duration-300" aria-label="Website">
            <Globe className="w-4 h-4" />
          </a>
        </div>

      </div>
    </footer>
  )
}
