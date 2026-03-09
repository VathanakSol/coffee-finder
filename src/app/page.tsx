'use client'

import { useState, useEffect, useCallback, useMemo, useEffectEvent, startTransition } from 'react'
import { Card } from '@/components/ui/card'
import { GoogleMap, panToLocation } from '@/components/google-map'
import { toast } from '@/hooks/use-toast'
import {
  CoffeeFilters,
  CoffeeShop,
  DEFAULT_COFFEE_FILTERS,
  LocationState,
} from '@/types/coffee'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { LocationErrorState } from '@/components/layout/LocationErrorState'
import { LocationLoadingState } from '@/components/layout/LocationLoadingState'
import { CoffeeShopList } from '@/components/coffee/CoffeeShopList'
import { ContributorSection } from '@/components/layout/ContributorSection'

function sortCoffeeShops(shops: CoffeeShop[], sortBy: CoffeeFilters['sortBy']) {
  const sortedShops = [...shops]

  if (sortBy === 'rating') {
    return sortedShops.sort((a, b) => {
      const ratingDiff = (b.rating || 0) - (a.rating || 0)
      if (ratingDiff !== 0) {
        return ratingDiff
      }

      return (a.distance || Number.MAX_SAFE_INTEGER) - (b.distance || Number.MAX_SAFE_INTEGER)
    })
  }

  if (sortBy === 'name') {
    return sortedShops.sort((a, b) => a.name.localeCompare(b.name))
  }

  return sortedShops.sort(
    (a, b) => (a.distance || Number.MAX_SAFE_INTEGER) - (b.distance || Number.MAX_SAFE_INTEGER)
  )
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
  const [filters, setFilters] = useState<CoffeeFilters>(DEFAULT_COFFEE_FILTERS)

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
  const fetchCoffeeShops = useCallback(async (
    lat: number,
    lng: number,
    query?: string,
    radius = DEFAULT_COFFEE_FILTERS.radius
  ) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        lat: lat.toString(),
        lng: lng.toString(),
        radius: radius.toString(),
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

  const fetchCoffeeShopsForCurrentState = useEffectEvent((lat: number, lng: number) => {
    fetchCoffeeShops(lat, lng, searchQuery, filters.radius)
  })

  // Fetch coffee shops when location is available
  useEffect(() => {
    if (location.lat && location.lng) {
      fetchCoffeeShopsForCurrentState(location.lat, location.lng)
    }
  }, [location.lat, location.lng])

  // Handle search
  const handleSearch = () => {
    if (location.lat && location.lng) {
      fetchCoffeeShops(location.lat, location.lng, searchQuery, filters.radius)
    }
  }

  const handleApplyFilters = (nextFilters: CoffeeFilters) => {
    const radiusChanged = nextFilters.radius !== filters.radius

    startTransition(() => {
      setFilters(nextFilters)
    })

    if (radiusChanged && location.lat && location.lng) {
      fetchCoffeeShops(location.lat, location.lng, searchQuery, nextFilters.radius)
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

  const activeFilterCount = useMemo(() => {
    let count = 0

    if (filters.radius !== DEFAULT_COFFEE_FILTERS.radius) count += 1
    if (filters.minRating > DEFAULT_COFFEE_FILTERS.minRating) count += 1
    if (filters.openNow) count += 1
    if (filters.onlyWithWebsite) count += 1
    if (filters.onlyWithPhone) count += 1
    if (filters.sortBy !== DEFAULT_COFFEE_FILTERS.sortBy) count += 1

    return count
  }, [filters])

  const filteredShops = useMemo(() => {
    return coffeeShops.filter((shop) => {
      if ((shop.distance || Number.MAX_SAFE_INTEGER) > filters.radius) {
        return false
      }

      if (filters.openNow && shop.isOpen !== true) {
        return false
      }

      if (filters.onlyWithWebsite && !shop.website) {
        return false
      }

      if (filters.onlyWithPhone && !shop.phone) {
        return false
      }

      if (filters.minRating > 0 && (shop.rating || 0) < filters.minRating) {
        return false
      }

      return true
    })
  }, [coffeeShops, filters])

  const allSortedShops = useMemo(() => {
    return sortCoffeeShops(filteredShops, filters.sortBy)
  }, [filteredShops, filters.sortBy])

  const popularShops = useMemo(() => {
    return [...filteredShops]
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
  }, [filteredShops])

  const trendingShops = useMemo(() => {
    const scoreShop = (shop: CoffeeShop) => {
      const openScore = shop.isOpen ? 3 : 0
      const ratingScore = (shop.rating || 0) / 2
      const engagementScore = (shop.totalRatings || 0) / 200
      const infoScore = (shop.website ? 1 : 0) + (shop.phone ? 1 : 0)
      const distancePenalty = Math.min((shop.distance || 3000) / 1000, 3)
      return openScore + ratingScore + engagementScore + infoScore - distancePenalty
    }

    return [...filteredShops]
      .sort((a, b) => scoreShop(b) - scoreShop(a))
      .slice(0, 10)
  }, [filteredShops])

  const visibleShops = useMemo(() => {
    if (discoveryMode === 'popular') {
      return popularShops
    }

    if (discoveryMode === 'trending') {
      return trendingShops
    }

    return allSortedShops
  }, [allSortedShops, discoveryMode, popularShops, trendingShops])

  const featuredPopular = popularShops[0]
  const featuredTrending = trendingShops[0]

  useEffect(() => {
    if (selectedShop && !visibleShops.some((shop) => shop.id === selectedShop.id)) {
      setSelectedShop(null)
    }
  }, [selectedShop, visibleShops])

  // Prepare map markers
  const mapMarkers = visibleShops.map((shop) => ({
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
      <Header
        location={location}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        loading={loading}
        filters={filters}
        activeFilterCount={activeFilterCount}
        onRefreshLocation={getCurrentLocation}
        onSearch={handleSearch}
        onApplyFilters={handleApplyFilters}
        onKeyDown={handleKeyDown}
      />

      <main className="flex-1 container mx-auto px-4 py-6">
        {location.error ? (
          <LocationErrorState error={location.error} onRetry={getCurrentLocation} />
        ) : location.loading ? (
          <LocationLoadingState />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full md:min-h-[600px]">
            {/* Map Section */}
            <div className="lg:col-span-2 order-2 lg:order-1 h-[400px] md:h-[500px] lg:h-[600px]">
              <Card className="overflow-hidden shadow-xl border-amber-200 dark:border-gray-700 h-full">
                {location.lat && location.lng && (
                  <GoogleMap
                    center={{ lat: location.lat, lng: location.lng }}
                    markers={mapMarkers}
                    zoom={15}
                    className="w-full h-full"
                  />
                )}
              </Card>
            </div>

            {/* Coffee Shops List */}
            <div className="lg:col-span-1 order-1 lg:order-2 h-[500px] lg:h-[600px]">
              <CoffeeShopList
                visibleShops={visibleShops}
                loading={loading}
                discoveryMode={discoveryMode}
                setDiscoveryMode={setDiscoveryMode}
                featuredPopular={featuredPopular}
                featuredTrending={featuredTrending}
                selectedShop={selectedShop}
                onShopSelect={handleShopSelect}
              />
            </div>
          </div>
        )}

        <ContributorSection />
      </main>

      <Footer />
    </div>
  )
}
