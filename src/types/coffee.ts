export interface CoffeeShop {
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

export type CoffeeSortOption = 'distance' | 'rating' | 'name'

export interface CoffeeFilters {
  radius: number
  minRating: number
  openNow: boolean
  onlyWithWebsite: boolean
  onlyWithPhone: boolean
  sortBy: CoffeeSortOption
}

export const DEFAULT_COFFEE_FILTERS: CoffeeFilters = {
  radius: 8000,
  minRating: 0,
  openNow: false,
  onlyWithWebsite: false,
  onlyWithPhone: false,
  sortBy: 'distance',
}

export interface LocationState {
  lat: number | null
  lng: number | null
  loading: boolean
  error: string | null
}
