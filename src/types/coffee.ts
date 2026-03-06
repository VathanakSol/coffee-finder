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

export interface LocationState {
  lat: number | null
  lng: number | null
  loading: boolean
  error: string | null
}
