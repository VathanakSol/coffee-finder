'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GoogleMap, panToLocation } from '@/components/google-map'
import { 
  Coffee, 
  MapPin, 
  Navigation, 
  Star, 
  Clock, 
  Phone, 
  Globe,
  Search,
  Loader2,
  Locate
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface CoffeeShop {
  id: string
  name: string
  address: string
  rating?: number
  totalRatings?: number
  isOpen?: boolean
  phone?: string
  website?: string
  distance?: number
  photos?: string[]
  location: {
    lat: number
    lng: number
  }
  priceLevel?: number
  types?: string[]
}

interface LocationState {
  lat: number | null
  lng: number | null
  loading: boolean
  error: string | null
}

export default function Home() {
  const [location, setLocation] = useState<LocationState>({
    lat: null,
    lng: null,
    loading: true,
    error: null
  })
  const [coffeeShops, setCoffeeShops] = useState<CoffeeShop[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedShop, setSelectedShop] = useState<CoffeeShop | null>(null)
  const [discoveryMode, setDiscoveryMode] = useState<'all' | 'popular' | 'trending'>('all')

  // Get user's current location
  const getCurrentLocation = useCallback(() => {
    setLocation(prev => ({ ...prev, loading: true, error: null }))
    
    if (!navigator.geolocation) {
      setLocation({
        lat: null,
        lng: null,
        loading: false,
        error: 'Geolocation is not supported by your browser'
      })
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          loading: false,
          error: null
        })
      },
      (error) => {
        let errorMessage = 'Unable to get your location'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location access.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out'
            break
        }
        setLocation({
          lat: null,
          lng: null,
          loading: false,
          error: errorMessage
        })
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }, [])

  // Initialize map
  useEffect(() => {
    getCurrentLocation()
  }, [getCurrentLocation])

  // Fetch nearby coffee shops
  const fetchCoffeeShops = useCallback(async (lat: number, lng: number, query?: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        lat: lat.toString(),
        lng: lng.toString(),
        ...(query && { query })
      })
      
      const response = await fetch(`/api/coffee-shops?${params}`)
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      setCoffeeShops(data.shops || [])
    } catch (error) {
      console.error('Error fetching coffee shops:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch nearby coffee shops. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch coffee shops when location is available
  useEffect(() => {
    if (location.lat && location.lng) {
      fetchCoffeeShops(location.lat, location.lng)
    }
  }, [location.lat, location.lng, fetchCoffeeShops])

  // Handle search
  const handleSearch = () => {
    if (location.lat && location.lng) {
      fetchCoffeeShops(location.lat, location.lng, searchQuery)
    }
  }

  // Handle key press for search
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // Handle shop selection
  const handleShopSelect = (shop: CoffeeShop) => {
    setSelectedShop(shop)
    panToLocation(shop.location.lat, shop.location.lng, 17)
  }

  // Format distance
  const formatDistance = (meters?: number) => {
    if (!meters) return ''
    if (meters < 1000) {
      return `${Math.round(meters)}m away`
    }
    return `${(meters / 1000).toFixed(1)}km away`
  }

  // Render price level
  const renderPriceLevel = (level?: number) => {
    if (!level) return null
    return '💰'.repeat(level)
  }

  const popularShops = useMemo(() => {
    return [...coffeeShops]
      .sort((a, b) => {
        const ratingDiff = (b.rating || 0) - (a.rating || 0)
        if (ratingDiff !== 0) {
          return ratingDiff
        }

        const reviewsDiff = (b.totalRatings || 0) - (a.totalRatings || 0)
        if (reviewsDiff !== 0) {
          return reviewsDiff
        }

        return (a.distance || Number.MAX_SAFE_INTEGER) - (b.distance || Number.MAX_SAFE_INTEGER)
      })
      .slice(0, 10)
  }, [coffeeShops])

  const trendingShops = useMemo(() => {
    const scoreShop = (shop: CoffeeShop) => {
      const openScore = shop.isOpen ? 3 : 0
      const ratingScore = (shop.rating || 0) / 2
      const engagementScore = (shop.totalRatings || 0) / 200
      const infoScore = (shop.website ? 1 : 0) + (shop.phone ? 1 : 0)
      const distancePenalty = Math.min((shop.distance || 3000) / 1000, 3)
      return openScore + ratingScore + engagementScore + infoScore - distancePenalty
    }

    return [...coffeeShops]
      .sort((a, b) => scoreShop(b) - scoreShop(a))
      .slice(0, 10)
  }, [coffeeShops])

  const visibleShops = useMemo(() => {
    if (discoveryMode === 'popular') {
      return popularShops
    }

    if (discoveryMode === 'trending') {
      return trendingShops
    }

    return coffeeShops
  }, [coffeeShops, discoveryMode, popularShops, trendingShops])

  const featuredPopular = popularShops[0]
  const featuredTrending = trendingShops[0]

  // Prepare map markers
  const mapMarkers = visibleShops.map(shop => ({
    id: shop.id,
    position: shop.location,
    title: shop.name,
    address: shop.address,
    rating: shop.rating,
    totalRatings: shop.totalRatings,
    isOpen: shop.isOpen,
    distance: shop.distance,
    phone: shop.phone,
    website: shop.website,
    onClick: () => handleShopSelect(shop)
  }))

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-amber-200 dark:border-gray-700 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-amber-600 to-orange-600 p-2 rounded-xl shadow-lg">
                <Coffee className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">
                  Coffee Finder
                </h1>
                <p className="text-xs text-muted-foreground">Discover local coffee spots</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={getCurrentLocation}
                disabled={location.loading}
                className="hidden sm:flex"
              >
                {location.loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Locate className="w-4 h-4" />
                )}
                <span className="ml-2">Refresh</span>
              </Button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="mt-4 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for coffee shops..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-10 bg-white dark:bg-gray-800 border-amber-200 dark:border-gray-600 focus:border-amber-400"
              />
            </div>
            <Button 
              onClick={handleSearch}
              disabled={loading || !location.lat}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {location.error ? (
          <Card className="max-w-md mx-auto bg-white dark:bg-gray-800 shadow-xl border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <MapPin className="w-5 h-5" />
                Location Error
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{location.error}</p>
              <Button onClick={getCurrentLocation} variant="outline">
                <Navigation className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : location.loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-200 to-orange-200 animate-pulse" />
              <Coffee className="w-10 h-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-700" />
            </div>
            <p className="mt-4 text-muted-foreground">Getting your location...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map Section */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <Card className="overflow-hidden shadow-xl border-amber-200 dark:border-gray-700">
                {location.lat && location.lng && (
                  <GoogleMap
                    center={{ lat: location.lat, lng: location.lng }}
                    markers={mapMarkers}
                    zoom={15}
                    className="w-full h-[400px] md:h-[500px] lg:h-[600px]"
                  />
                )}
              </Card>
            </div>

            {/* Coffee Shops List */}
            <div className="lg:col-span-1 order-1 lg:order-2">
              <Card className="shadow-xl border-amber-200 dark:border-gray-700">
                <CardHeader className="bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Coffee className="w-5 h-5" />
                    Discover Coffee Shops
                  </CardTitle>
                  <p className="text-sm text-amber-100">
                    {visibleShops.length} places found
                  </p>
                  <Tabs
                    value={discoveryMode}
                    onValueChange={(value) => setDiscoveryMode(value as 'all' | 'popular' | 'trending')}
                  >
                    <TabsList className="grid grid-cols-3 bg-white/20">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="popular">Popular</TabsTrigger>
                      <TabsTrigger value="trending">Trending</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardHeader>
                <CardContent className="p-0">
                  {(featuredPopular || featuredTrending) && !loading && (
                    <div className="p-4 border-b border-amber-100 dark:border-gray-700 space-y-2">
                      {featuredPopular && (
                        <button
                          type="button"
                          className="w-full text-left rounded-md border border-amber-200 dark:border-amber-700 px-3 py-2 hover:bg-amber-50 dark:hover:bg-gray-800"
                          onClick={() => handleShopSelect(featuredPopular)}
                        >
                          <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">Most Popular</p>
                          <p className="text-sm font-semibold truncate">{featuredPopular.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{featuredPopular.address}</p>
                        </button>
                      )}

                      {featuredTrending && (
                        <button
                          type="button"
                          className="w-full text-left rounded-md border border-orange-200 dark:border-orange-700 px-3 py-2 hover:bg-orange-50 dark:hover:bg-gray-800"
                          onClick={() => handleShopSelect(featuredTrending)}
                        >
                          <p className="text-xs text-orange-700 dark:text-orange-300 font-medium">Trending Now</p>
                          <p className="text-sm font-semibold truncate">{featuredTrending.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{featuredTrending.address}</p>
                        </button>
                      )}
                    </div>
                  )}

                  {loading ? (
                    <div className="p-4 space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-2">
                          <Skeleton className="h-5 w-3/4" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                      ))}
                    </div>
                  ) : visibleShops.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      <Coffee className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No coffee shops found nearby</p>
                      <p className="text-sm mt-2">Try searching with different keywords</p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[500px] lg:h-[550px]">
                      <div className="divide-y divide-amber-100 dark:divide-gray-700">
                        {visibleShops.map((shop, index) => (
                          <div
                            key={shop.id || index}
                            className={`p-4 cursor-pointer transition-all hover:bg-amber-50 dark:hover:bg-gray-800 ${
                              selectedShop?.id === shop.id ? 'bg-amber-50 dark:bg-gray-800' : ''
                            }`}
                            onClick={() => handleShopSelect(shop)}
                          >
                            <div className="flex items-start gap-3">
                              <div className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900 dark:to-orange-900 rounded-lg p-2 flex-shrink-0">
                                <Coffee className="w-5 h-5 text-amber-700 dark:text-amber-300" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                  {shop.name}
                                </h3>
                                <p className="text-sm text-muted-foreground truncate mt-1">
                                  {shop.address}
                                </p>
                                
                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                  {shop.rating && (
                                    <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                                      <Star className="w-3 h-3 mr-1 fill-amber-500 text-amber-500" />
                                      {shop.rating}
                                      {shop.totalRatings && ` (${shop.totalRatings})`}
                                    </Badge>
                                  )}
                                  
                                  {shop.isOpen !== undefined && (
                                    <Badge 
                                      variant={shop.isOpen ? 'default' : 'secondary'}
                                      className={shop.isOpen 
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                      }
                                    >
                                      <Clock className="w-3 h-3 mr-1" />
                                      {shop.isOpen ? 'Open' : 'Closed'}
                                    </Badge>
                                  )}
                                  
                                  {shop.distance && (
                                    <Badge variant="outline" className="border-amber-200 text-amber-700 dark:border-amber-700 dark:text-amber-300">
                                      <MapPin className="w-3 h-3 mr-1" />
                                      {formatDistance(shop.distance)}
                                    </Badge>
                                  )}
                                </div>
                                
                                {shop.priceLevel && (
                                  <p className="text-xs text-muted-foreground mt-2">
                                    {renderPriceLevel(shop.priceLevel)}
                                  </p>
                                )}
                                
                                <div className="flex items-center gap-3 mt-3">
                                  {shop.phone && (
                                    <a 
                                      href={`tel:${shop.phone}`}
                                      className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Phone className="w-4 h-4" />
                                    </a>
                                  )}
                                  {shop.website && (
                                    <a 
                                      href={shop.website}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Globe className="w-4 h-4" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-amber-200 dark:border-gray-700 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            <Coffee className="w-4 h-4 text-amber-600" />
            Coffee Finder - Find your perfect coffee spot nearby
          </p>
        </div>
      </footer>
    </div>
  )
}
