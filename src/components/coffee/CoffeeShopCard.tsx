import { Coffee, MapPin, Star, Clock, Phone, Globe } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { CoffeeShop } from '@/types/coffee'

interface CoffeeShopCardProps {
  shop: CoffeeShop
  isSelected: boolean
  onClick: (shop: CoffeeShop) => void
}

export function CoffeeShopCard({ shop, isSelected, onClick }: CoffeeShopCardProps) {
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

  return (
    <div
      className={`group p-4 cursor-pointer transition-all duration-300 ease-out border-l-4 ${
        isSelected 
        ? 'bg-amber-50/50 dark:bg-amber-900/10 border-primary' 
        : 'bg-transparent border-transparent hover:border-amber-300 dark:hover:border-amber-700/50'
      }`}
      onClick={() => onClick(shop)}
    >
      <div className="flex items-start gap-4">
        <div className={`p-2.5 rounded-xl flex-shrink-0 transition-all duration-300 ${
            isSelected 
            ? 'bg-primary text-primary-foreground shadow-md scale-105' 
            : 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 group-hover:scale-105 group-hover:bg-amber-200 dark:group-hover:bg-amber-900/60'
          }`}
        >
          <Coffee className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-bold text-base truncate transition-colors duration-200 ${
            isSelected ? 'text-primary' : 'text-foreground group-hover:text-primary'
          }`}>
            {shop.name}
          </h3>
          <p className="text-sm text-muted-foreground truncate mt-0.5" title={shop.address}>
            {shop.address}
          </p>

          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
            {shop.rating && (
              <Badge className="bg-amber-100/80 hover:bg-amber-200 text-amber-900 dark:bg-amber-500/20 dark:hover:bg-amber-500/30 dark:text-amber-300 border-0 rounded-md py-0.5 px-2 font-bold shadow-none">
                <Star className="w-3 h-3 mr-1.5 fill-current" />
                {shop.rating}
                {shop.totalRatings && <span className="text-amber-700/70 dark:text-amber-400/70 ml-1 font-medium font-sans">({shop.totalRatings})</span>}
              </Badge>
            )}

            {shop.isOpen !== undefined && (
              <Badge
                className={`border-0 rounded-md py-0.5 px-2 font-bold shadow-none ${
                  shop.isOpen
                  ? 'bg-emerald-100/80 hover:bg-emerald-200 text-emerald-900 dark:bg-emerald-500/20 dark:hover:bg-emerald-500/30 dark:text-emerald-400'
                  : 'bg-red-100/80 hover:bg-red-200 text-red-900 dark:bg-red-500/20 dark:hover:bg-red-500/30 dark:text-red-400'
                }`}
              >
                <Clock className="w-3 h-3 mr-1.5" />
                {shop.isOpen ? 'Open Now' : 'Closed'}
              </Badge>
            )}

            {shop.distance && (
              <Badge variant="outline" className="border-border/50 text-muted-foreground bg-transparent rounded-md py-0.5 px-2 font-medium shadow-none">
                <MapPin className="w-3 h-3 mr-1.5" />
                {formatDistance(shop.distance)}
              </Badge>
            )}
          </div>

          {shop.priceLevel && (
            <p className="text-xs text-muted-foreground mt-2">
              {renderPriceLevel(shop.priceLevel)}
            </p>
          )}

          <div className="flex items-center gap-2.5 mt-3.5 pt-3 border-t border-border/30 opacity-60 group-hover:opacity-100 transition-opacity">
            {shop.phone && (
              <a
                href={`tel:${shop.phone}`}
                className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors hover:bg-muted/50 px-2 py-1 rounded-md"
                onClick={(e) => e.stopPropagation()}
              >
                <Phone className="w-3.5 h-3.5" />
                Call
              </a>
            )}
            {shop.website && (
              <a
                href={shop.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-secondary-foreground hover:bg-secondary transition-colors px-2 py-1 rounded-md"
                onClick={(e) => e.stopPropagation()}
              >
                <Globe className="w-3.5 h-3.5" />
                Website
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
