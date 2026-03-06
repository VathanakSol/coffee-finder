import { Coffee } from 'lucide-react'

export function LocationLoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-200 to-orange-200 animate-pulse" />
        <Coffee className="w-10 h-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-700" />
      </div>
      <p className="mt-4 text-muted-foreground">Getting your location...</p>
    </div>
  )
}
