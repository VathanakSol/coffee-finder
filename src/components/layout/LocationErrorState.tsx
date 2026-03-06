import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Navigation } from 'lucide-react'

interface LocationErrorStateProps {
  error: string
  onRetry: () => void
}

export function LocationErrorState({ error, onRetry }: LocationErrorStateProps) {
  return (
    <Card className="max-w-md mx-auto bg-white dark:bg-gray-800 shadow-xl border-red-200 dark:border-red-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <MapPin className="w-5 h-5" />
          Location Error
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={onRetry} variant="outline">
          <Navigation className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </CardContent>
    </Card>
  )
}
