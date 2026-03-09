'use client'

import { useState } from 'react'
import { Clock3, Globe, Phone, RotateCcw, SlidersHorizontal, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  CoffeeFilters,
  CoffeeSortOption,
  DEFAULT_COFFEE_FILTERS,
} from '@/types/coffee'
import { cn } from '@/lib/utils'

interface AdvancedFiltersSheetProps {
  filters: CoffeeFilters
  activeFilterCount: number
  onApply: (filters: CoffeeFilters) => void
}

const sortOptions: Array<{ value: CoffeeSortOption; label: string; description: string }> = [
  { value: 'distance', label: 'Nearest', description: 'Closest coffee shops first' },
  { value: 'rating', label: 'Top rated', description: 'Highest ratings first' },
  { value: 'name', label: 'A-Z', description: 'Alphabetical order' },
]

const ratingOptions = [
  { value: 0, label: 'Any' },
  { value: 3, label: '3.0+' },
  { value: 4, label: '4.0+' },
  { value: 4.5, label: '4.5+' },
]

function formatRadius(radius: number) {
  if (radius < 1000) {
    return `${radius} m`
  }

  const kilometers = radius / 1000
  return `${Number.isInteger(kilometers) ? kilometers.toFixed(0) : kilometers.toFixed(1)} km`
}

export function AdvancedFiltersSheet({
  filters,
  activeFilterCount,
  onApply,
}: AdvancedFiltersSheetProps) {
  const [open, setOpen] = useState(false)
  const [draftFilters, setDraftFilters] = useState(filters)

  const updateDraft = <K extends keyof CoffeeFilters>(key: K, value: CoffeeFilters[K]) => {
    setDraftFilters((current) => ({ ...current, [key]: value }))
  }

  const handleReset = () => {
    setDraftFilters(DEFAULT_COFFEE_FILTERS)
  }

  const handleApply = () => {
    onApply(draftFilters)
    setOpen(false)
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setDraftFilters(filters)
    }

    setOpen(nextOpen)
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="h-11 md:h-12 px-3 md:px-4 rounded-xl border-amber-200/60 dark:border-gray-700/60 bg-white/50 dark:bg-gray-800/50 hover:bg-amber-50 dark:hover:bg-gray-700 hover:border-amber-300 dark:hover:border-gray-600 transition-all duration-300 active:scale-95"
        >
          <SlidersHorizontal className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span className="hidden md:inline font-medium">Filters</span>
          <span
            className={cn(
              'inline-flex min-w-6 justify-center rounded-full px-2 py-0.5 text-[11px] font-bold',
              activeFilterCount > 0
                ? 'bg-amber-500 text-white'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {activeFilterCount}
          </span>
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:max-w-md border-l-amber-200/60 dark:border-l-gray-800">
        <SheetHeader className="space-y-2 border-b border-border/60 pb-5">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <SlidersHorizontal className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            Advanced Filters
          </SheetTitle>
          <SheetDescription>
            Adjust search radius, minimum rating, and which shop details should be required.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="radius" className="text-sm font-semibold text-foreground">
                Search Radius
              </Label>
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800 dark:bg-amber-500/15 dark:text-amber-300">
                {formatRadius(draftFilters.radius)}
              </span>
            </div>

            <input
              id="radius"
              type="range"
              min={500}
              max={20000}
              step={500}
              value={draftFilters.radius}
              onChange={(event) => updateDraft('radius', Number(event.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-linear-to-r from-amber-200 via-orange-300 to-rose-400 accent-orange-500"
            />

            <p className="text-xs leading-relaxed text-muted-foreground">
              Expand the radius to search a wider area. Smaller values keep results nearby and faster to scan.
            </p>
          </section>

          <Separator />

          <section className="space-y-3">
            <Label className="text-sm font-semibold text-foreground">Sort Results</Label>
            <div className="grid grid-cols-1 gap-2">
              {sortOptions.map((option) => {
                const isActive = draftFilters.sortBy === option.value

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateDraft('sortBy', option.value)}
                    className={cn(
                      'rounded-xl border p-3 text-left transition-all duration-200',
                      isActive
                        ? 'border-orange-400 bg-orange-50 shadow-sm dark:border-orange-500/60 dark:bg-orange-500/10'
                        : 'border-border/60 bg-card hover:border-amber-300 hover:bg-muted/40'
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{option.label}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{option.description}</p>
                      </div>
                      <span
                        className={cn(
                          'h-2.5 w-2.5 rounded-full transition-colors',
                          isActive ? 'bg-orange-500' : 'bg-muted-foreground/30'
                        )}
                      />
                    </div>
                  </button>
                )
              })}
            </div>
          </section>

          <Separator />

          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" />
              <Label className="text-sm font-semibold text-foreground">Minimum Rating</Label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {ratingOptions.map((option) => {
                const isActive = draftFilters.minRating === option.value

                return (
                  <Button
                    key={option.value}
                    type="button"
                    variant={isActive ? 'default' : 'outline'}
                    onClick={() => updateDraft('minRating', option.value)}
                    className={cn(
                      'justify-center rounded-xl',
                      isActive && 'bg-linear-to-r from-amber-600 to-orange-600 text-white hover:from-amber-500 hover:to-orange-500'
                    )}
                  >
                    {option.label}
                  </Button>
                )
              })}
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Ratings and opening status depend on the source data available for each shop.
            </p>
          </section>

          <Separator />

          <section className="space-y-3">
            <Label className="text-sm font-semibold text-foreground">Required Details</Label>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => updateDraft('openNow', !draftFilters.openNow)}
                className={cn(
                  'flex items-center justify-between rounded-xl border p-3 text-left transition-all duration-200',
                  draftFilters.openNow
                    ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-500/50 dark:bg-emerald-500/10'
                    : 'border-border/60 bg-card hover:border-amber-300 hover:bg-muted/40'
                )}
              >
                <div className="flex items-center gap-3">
                  <Clock3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Open now only</p>
                    <p className="mt-1 text-xs text-muted-foreground">Show shops currently marked as open.</p>
                  </div>
                </div>
                <span className={cn('rounded-full px-2 py-1 text-[11px] font-bold', draftFilters.openNow ? 'bg-emerald-600 text-white' : 'bg-muted text-muted-foreground')}>
                  {draftFilters.openNow ? 'On' : 'Off'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => updateDraft('onlyWithWebsite', !draftFilters.onlyWithWebsite)}
                className={cn(
                  'flex items-center justify-between rounded-xl border p-3 text-left transition-all duration-200',
                  draftFilters.onlyWithWebsite
                    ? 'border-sky-300 bg-sky-50 dark:border-sky-500/50 dark:bg-sky-500/10'
                    : 'border-border/60 bg-card hover:border-amber-300 hover:bg-muted/40'
                )}
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Website available</p>
                    <p className="mt-1 text-xs text-muted-foreground">Keep only shops with a website link.</p>
                  </div>
                </div>
                <span className={cn('rounded-full px-2 py-1 text-[11px] font-bold', draftFilters.onlyWithWebsite ? 'bg-sky-600 text-white' : 'bg-muted text-muted-foreground')}>
                  {draftFilters.onlyWithWebsite ? 'On' : 'Off'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => updateDraft('onlyWithPhone', !draftFilters.onlyWithPhone)}
                className={cn(
                  'flex items-center justify-between rounded-xl border p-3 text-left transition-all duration-200',
                  draftFilters.onlyWithPhone
                    ? 'border-violet-300 bg-violet-50 dark:border-violet-500/50 dark:bg-violet-500/10'
                    : 'border-border/60 bg-card hover:border-amber-300 hover:bg-muted/40'
                )}
              >
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Phone number available</p>
                    <p className="mt-1 text-xs text-muted-foreground">Keep only shops with call details.</p>
                  </div>
                </div>
                <span className={cn('rounded-full px-2 py-1 text-[11px] font-bold', draftFilters.onlyWithPhone ? 'bg-violet-600 text-white' : 'bg-muted text-muted-foreground')}>
                  {draftFilters.onlyWithPhone ? 'On' : 'Off'}
                </span>
              </button>
            </div>
          </section>
        </div>

        <SheetFooter className="border-t border-border/60 bg-background/95">
          <Button type="button" variant="outline" onClick={handleReset} className="w-full rounded-xl">
            <RotateCcw className="w-4 h-4" />
            Reset Filters
          </Button>
          <Button
            type="button"
            onClick={handleApply}
            className="w-full rounded-xl bg-linear-to-r from-amber-600 to-orange-600 text-white hover:from-amber-500 hover:to-orange-500"
          >
            Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}