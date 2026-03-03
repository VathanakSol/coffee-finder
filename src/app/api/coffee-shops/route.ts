import { NextRequest, NextResponse } from 'next/server'

interface OverpassElement {
  id: number
  lat?: number
  lon?: number
  center?: {
    lat: number
    lon: number
  }
  tags?: Record<string, string>
}

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
  location: {
    lat: number
    lng: number
  }
  priceLevel?: number
  types?: string[]
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const radius = 6371000
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return radius * c
}

function buildAddress(tags: Record<string, string> | undefined): string {
  if (!tags) {
    return 'Address not available'
  }

  const street = tags['addr:street']
  const houseNumber = tags['addr:housenumber']
  const city = tags['addr:city'] || tags['addr:town'] || tags['addr:village']

  const firstLine = [houseNumber, street].filter(Boolean).join(' ').trim()
  if (firstLine && city) {
    return `${firstLine}, ${city}`
  }
  if (firstLine) {
    return firstLine
  }
  if (city) {
    return city
  }
  if (tags['addr:full']) {
    return tags['addr:full']
  }
  return 'Address not available'
}

function normalizeElement(element: OverpassElement, userLat: number, userLng: number): CoffeeShop | null {
  const lat = element.lat ?? element.center?.lat
  const lon = element.lon ?? element.center?.lon

  if (lat === undefined || lon === undefined) {
    return null
  }

  const tags = element.tags || {}
  const name = tags.name || 'Coffee Shop'
  const distance = calculateDistance(userLat, userLng, lat, lon)

  return {
    id: `osm-${element.id}`,
    name,
    address: buildAddress(tags),
    isOpen: undefined,
    phone: tags.phone || tags['contact:phone'],
    website: tags.website || tags['contact:website'],
    distance,
    location: {
      lat,
      lng: lon,
    },
    types: ['cafe'],
  }
}

function generateMockCoffeeShops(lat: number, lng: number) {
  const coffeeShopNames = [
    'The Cozy Bean',
    'Morning Brew Café',
    'Artisan Coffee House',
    'Bean There, Drank That',
    'The Coffee Corner',
    'Café Aroma',
    'The Roasted Bean',
    'Perk Up Coffee',
    'The Daily Grind',
    'Espresso Express',
  ]

  const addresses = [
    '123 Main Street',
    '456 Oak Avenue',
    '789 Maple Road',
    '321 Pine Lane',
    '654 Cedar Drive',
    '987 Birch Way',
    '147 Elm Street',
    '258 Walnut Avenue',
    '369 Cherry Lane',
    '741 Spruce Road',
  ]

  return coffeeShopNames
    .map((name, index) => {
      const latOffset = (Math.random() - 0.5) * 0.02
      const lngOffset = (Math.random() - 0.5) * 0.02

      return {
        id: `mock-${index}`,
        name,
        address: addresses[index],
        rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
        totalRatings: Math.floor(50 + Math.random() * 500),
        isOpen: Math.random() > 0.3,
        phone: `+1 (555) ${String(Math.floor(100 + Math.random() * 900))}-${String(
          Math.floor(1000 + Math.random() * 9000)
        )}`,
        website: `https://example.com/${name.toLowerCase().replaceAll(/\s+/g, '-')}`,
        distance: Math.round(100 + Math.random() * 1500),
        location: {
          lat: lat + latOffset,
          lng: lng + lngOffset,
        },
        priceLevel: Math.ceil(Math.random() * 3),
        types: ['cafe', 'food', 'store'],
      }
    })
    .sort((a, b) => a.distance - b.distance)
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')
  const query = searchParams.get('query')
  const radius = searchParams.get('radius') || '8000'

  if (!lat || !lng) {
    return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 })
  }

  const latitude = Number.parseFloat(lat)
  const longitude = Number.parseFloat(lng)
  const radiusMeters = Number.parseInt(radius, 10)

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return NextResponse.json({ error: 'Invalid latitude or longitude' }, { status: 400 })
  }

  if (Number.isNaN(radiusMeters) || radiusMeters < 100 || radiusMeters > 100000) {
    return NextResponse.json({ error: 'Radius must be between 100 and 100000 meters' }, { status: 400 })
  }

  try {
    const normalizedQuery = (query || '').trim()
    const escapedQuery = normalizedQuery.replaceAll('"', '').replaceAll('\\', '')

    const nameFilter = escapedQuery
      ? `["name"~"${escapedQuery}",i]`
      : ''

    const overpassQuery = `
[out:json][timeout:25];
(
  node["amenity"="cafe"]${nameFilter}(around:${radiusMeters},${latitude},${longitude});
  way["amenity"="cafe"]${nameFilter}(around:${radiusMeters},${latitude},${longitude});
  relation["amenity"="cafe"]${nameFilter}(around:${radiusMeters},${latitude},${longitude});
);
out center tags;
`

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8',
      },
      body: overpassQuery,
      next: { revalidate: 120 },
    })

    if (!response.ok) {
      throw new Error(`Overpass request failed with status ${response.status}`)
    }

    const data = (await response.json()) as { elements?: OverpassElement[] }
    const elements = data.elements || []

    const shops = elements
      .map((element) => normalizeElement(element, latitude, longitude))
      .filter((shop): shop is CoffeeShop => shop !== null)
      .sort((a, b) => (a.distance || 0) - (b.distance || 0))
      .slice(0, 60)

    if (shops.length === 0) {
      return NextResponse.json({ shops: [] })
    }

    return NextResponse.json({ shops })
  } catch (error) {
    console.error('Error fetching coffee shops from Overpass:', error)
    return NextResponse.json({ shops: generateMockCoffeeShops(latitude, longitude) })
  }
}
