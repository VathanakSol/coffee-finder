'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Coffee, Locate, Search, Loader2, Github, ArrowRight } from 'lucide-react'
import { LocationState } from '@/types/coffee'

interface HeaderProps {
  location: LocationState
  searchQuery: string
  setSearchQuery: (query: string) => void
  loading: boolean
  onRefreshLocation: () => void
  onSearch: () => void
  onKeyDown: (e: React.KeyboardEvent) => void
}

export function Header({
  location,
  searchQuery,
  setSearchQuery,
  loading,
  onRefreshLocation,
  onSearch,
  onKeyDown
}: HeaderProps) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <>
      {/* Open Source Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700 text-white px-4 py-2 relative z-[60]">
        <div className="container mx-auto flex items-center justify-center text-xs md:text-sm font-medium gap-2 text-gray-300">
          <Github className="w-4 h-4 text-gray-400" />
          <span>Proudly open-source on GitHub.</span>
          <a
            href="https://github.com/VathanakSol/coffee-finder"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400 hover:text-amber-300 transition-colors inline-flex items-center gap-1 group"
          >
            Star the repo
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-amber-200/50 dark:border-gray-800/50 shadow-sm transition-all duration-300">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            {/* Logo & Mobile Actions Section */}
            <div className="flex items-center justify-between w-full md:w-auto gap-4">
              <div className="flex items-center gap-3 group cursor-pointer transition-transform duration-300">
                <div className="relative bg-gradient-to-br from-amber-500 to-orange-600 p-2.5 rounded-2xl shadow-lg shadow-amber-500/20 transition-all duration-500 group-hover:shadow-amber-500/40 group-hover:-translate-y-0.5">
                  <Coffee className="w-6 h-6 text-white transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent transition-colors duration-300">
                    Coffee Finder
                  </h1>
                  <p className="text-xs text-muted-foreground font-medium tracking-wide">
                    Discover local spots
                  </p>
                </div>
              </div>

              {/* Mobile Refresh Button */}
              <div className="flex items-center gap-2 md:hidden">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onRefreshLocation}
                  disabled={location.loading}
                  className="h-10 w-10 rounded-xl border-amber-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 hover:bg-amber-50 dark:hover:bg-gray-700 transition-all active:scale-95"
                >
                  {location.loading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-amber-600 dark:text-amber-400" />
                  ) : (
                    <Locate className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  )}
                </Button>
              </div>
            </div>

            {/* Search Bar & Desktop Actions */}
            <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto flex-1 md:max-w-xl lg:max-w-2xl justify-end">
              <div className="relative flex-1 w-full group">
                <div className={`absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-xl blur transition-opacity duration-300 ${isFocused ? 'opacity-30' : 'opacity-0 group-hover:opacity-10'}`} />
                <div className="relative">
                  <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${isFocused ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground group-hover:text-amber-500/70'}`} />
                  <Input
                    type="text"
                    placeholder="Find your perfect coffee..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={onKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="w-full pl-12 pr-4 h-11 md:h-12 bg-white/90 dark:bg-gray-800/90 border-amber-200/60 dark:border-gray-700/60 focus:border-amber-500 dark:focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 rounded-xl text-base shadow-sm transition-all duration-300"
                  />
                </div>
              </div>

              <Button
                onClick={onSearch}
                disabled={loading || !location.lat}
                size="lg"
                className="h-11 md:h-12 px-4 md:px-6 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-lg shadow-amber-600/20 hover:shadow-amber-600/40 transition-all duration-300 active:scale-95 group"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span className="flex items-center gap-2 font-medium">
                    <Search className="w-4 h-4 md:hidden group-hover:scale-110 transition-transform duration-300" />
                    <span className="hidden md:inline">Search</span>
                  </span>
                )}
              </Button>

              {/* Desktop Refresh Button */}
              <Button
                variant="outline"
                size="lg"
                onClick={onRefreshLocation}
                disabled={location.loading}
                className="hidden md:flex h-12 px-4 rounded-xl border-amber-200/60 dark:border-gray-700/60 bg-white/50 dark:bg-gray-800/50 hover:bg-amber-50 dark:hover:bg-gray-700 hover:border-amber-300 dark:hover:border-gray-600 transition-all duration-300 active:scale-95 group"
              >
                {location.loading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-amber-600 dark:text-amber-400" />
                ) : (
                  <Locate className="w-5 h-5 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform duration-300" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
