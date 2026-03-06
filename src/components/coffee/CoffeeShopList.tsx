import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Coffee } from 'lucide-react'
import { CoffeeShop } from '@/types/coffee'
import { CoffeeShopCard } from './CoffeeShopCard'

interface CoffeeShopListProps {
  visibleShops: CoffeeShop[]
  loading: boolean
  discoveryMode: 'all' | 'popular' | 'trending'
  setDiscoveryMode: (mode: 'all' | 'popular' | 'trending') => void
  featuredPopular?: CoffeeShop
  featuredTrending?: CoffeeShop
  selectedShop: CoffeeShop | null
  onShopSelect: (shop: CoffeeShop) => void
}

export function CoffeeShopList({
  visibleShops,
  loading,
  discoveryMode,
  setDiscoveryMode,
  featuredPopular,
  featuredTrending,
  selectedShop,
  onShopSelect
}: CoffeeShopListProps) {
  return (
    <Card className="shadow-xl bg-background/95 backdrop-blur-sm border border-border/50 h-full flex flex-col overflow-hidden transition-all duration-300">
      <CardHeader className="relative bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 dark:from-amber-600 dark:via-orange-600 dark:to-rose-700 text-white rounded-t-xl flex-shrink-0 pb-6 pt-5 px-5">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-white mb-1 shadow-sm">
              <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-md">
                <Coffee className="w-5 h-5 text-white" />
              </div>
              Discover
            </CardTitle>
            <p className="text-xs font-medium text-amber-50 dark:text-amber-100 flex items-center gap-1.5 opacity-90">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              {visibleShops.length} places found nearby
            </p>
          </div>
        </div>

        <Tabs
          value={discoveryMode}
          onValueChange={(value) => setDiscoveryMode(value as 'all' | 'popular' | 'trending')}
          className="relative z-10 mt-5 w-full"
        >
          <TabsList className="grid grid-cols-3 bg-black/20 backdrop-blur-md p-1 rounded-lg border border-white/10 shadow-inner h-10 w-full mb-0">
            <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-orange-600 dark:data-[state=active]:bg-gray-900 rounded-md text-xs font-semibold text-white transition-all">All</TabsTrigger>
            <TabsTrigger value="popular" className="data-[state=active]:bg-white data-[state=active]:text-orange-600 dark:data-[state=active]:bg-gray-900 rounded-md text-xs font-semibold text-white transition-all">Popular</TabsTrigger>
            <TabsTrigger value="trending" className="data-[state=active]:bg-white data-[state=active]:text-orange-600 dark:data-[state=active]:bg-gray-900 rounded-md text-xs font-semibold text-white transition-all">Trending</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent className="p-0 flex-1 overflow-hidden flex flex-col bg-background relative">
        {(featuredPopular || featuredTrending) && !loading && (
          <div className="p-3 bg-muted/30 border-b border-border/50 space-y-2.5 flex-shrink-0 z-10 shadow-sm relative">
            {featuredPopular && (
              <button
                type="button"
                className="group w-full text-left rounded-lg bg-card border border-amber-200/50 dark:border-amber-900/30 p-3 shadow-sm hover:shadow-md hover:border-amber-400/50 dark:hover:border-amber-500/50 transition-all duration-300 relative overflow-hidden"
                onClick={() => onShopSelect(featuredPopular)}
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-400 group-hover:bg-amber-500 transition-colors"></div>
                <div className="pl-2">
                  <p className="text-[10px] uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold mb-0.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    Local Favorite
                  </p>
                  <p className="text-sm font-bold text-foreground truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">{featuredPopular.name}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[90%]">{featuredPopular.address}</p>
                </div>
              </button>
            )}

            {featuredTrending && (
              <button
                type="button"
                className="group w-full text-left rounded-lg bg-card border border-orange-200/50 dark:border-orange-900/30 p-3 shadow-sm hover:shadow-md hover:border-orange-400/50 dark:hover:border-orange-500/50 transition-all duration-300 relative overflow-hidden"
                onClick={() => onShopSelect(featuredTrending)}
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-orange-400 group-hover:bg-orange-500 transition-colors"></div>
                <div className="pl-2">
                  <p className="text-[10px] uppercase tracking-wider text-orange-600 dark:text-orange-400 font-bold mb-0.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                    Trending Now
                  </p>
                  <p className="text-sm font-bold text-foreground truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">{featuredTrending.name}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[90%]">{featuredTrending.address}</p>
                </div>
              </button>
            )}
          </div>
        )}

        {loading ? (
          <div className="p-5 space-y-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4 items-center">
                <Skeleton className="h-12 w-12 rounded-xl flex-shrink-0" />
                <div className="space-y-2.5 flex-1">
                  <Skeleton className="h-4 w-[75%]" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-[40%]" />
                </div>
              </div>
            ))}
          </div>
        ) : visibleShops.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground flex-1 flex flex-col items-center justify-center bg-muted/10">
            <div className="bg-muted p-4 rounded-full mb-4">
              <Coffee className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <p className="font-semibold text-foreground">No coffee shops found</p>
            <p className="text-xs mt-1.5 max-w-[200px] leading-relaxed">
              Try exploring a different area or removing your search filters.
            </p>
          </div>
        ) : (
          <ScrollArea className="flex-1 px-3 min-h-0">
            <div className="flex flex-col gap-3 pb-6 pt-2">
              <div className="flex items-center justify-between px-1.5 mb-1 mt-1">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-primary" />
                  {discoveryMode === 'all'
                    ? 'All Available Coffee Shops'
                    : discoveryMode === 'popular'
                      ? 'Popular Nearby'
                      : 'Trending Locations'}
                </h3>
                <span className="text-xs font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full border border-border/50">
                  {visibleShops.length} Results
                </span>
              </div>

              {visibleShops.map((shop, index) => (
                <div
                  className="bg-card rounded-xl border border-border/60 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-300 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:border-primary/40 group/listitem"
                  key={shop.id || index}
                >
                  <CoffeeShopCard
                    shop={shop}
                    isSelected={selectedShop?.id === shop.id}
                    onClick={onShopSelect}
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
