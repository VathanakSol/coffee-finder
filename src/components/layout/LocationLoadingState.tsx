import { Coffee, MapPin, Radar } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function LocationLoadingState() {
  return (
    <Card className="mx-auto max-w-xl overflow-hidden border-amber-200/70 shadow-xl backdrop-blur-sm dark:border-gray-700 dark:bg-gray-950/75">
      <CardContent className="flex flex-col items-center px-6 py-10 text-center md:px-8 md:py-12">
        <div className="relative flex h-32 w-32 items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-amber-200/70 bg-linear-to-br from-amber-100 via-orange-50 to-yellow-100 dark:border-amber-500/20 dark:from-amber-500/10 dark:via-gray-900 dark:to-orange-500/10" />
          <div
            className="absolute inset-3 rounded-full border border-dashed border-amber-300/80 animate-spin dark:border-amber-400/30"
            style={{ animationDuration: "12s" }}
          />
          <div className="absolute inset-7 rounded-full bg-white/80 shadow-inner dark:bg-gray-950/80" />
          <div className="absolute h-full w-full animate-ping rounded-full border border-amber-300/50 dark:border-amber-400/20" />

          <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg dark:bg-amber-100 dark:text-gray-950">
            <Coffee className="h-7 w-7" />
          </div>

          <MapPin className="absolute right-4 top-4 h-5 w-5 text-orange-500 dark:text-orange-300" />
          <Radar className="absolute bottom-4 left-4 h-5 w-5 text-amber-600 dark:text-amber-300" />
        </div>

        <div className="mt-6 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">
            Locating You
          </p>
          <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-50 md:text-2xl">
            Finding nearby coffee spots around your current location.
          </h2>
        </div>
      </CardContent>
    </Card>
  );
}
