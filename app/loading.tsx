import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background p-6 md:p-8 pt-24 md:pl-72">
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>

        {/* Stats grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-6 bg-card border-border">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Content skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6 bg-card border-border">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-5 w-32" />
              </div>
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
                    <Skeleton className="h-2 w-2 rounded-full mt-2" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-3 w-3" />
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-5 w-28" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-20 flex-col gap-2 border border-border rounded-lg p-4">
                    <Skeleton className="h-6 w-6 mx-auto" />
                    <Skeleton className="h-4 w-16 mx-auto" />
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Featured cities skeleton */}
        <Card className="p-6 bg-card border-border">
          <Skeleton className="h-5 w-48 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4 bg-muted/20 rounded-lg text-center">
                <Skeleton className="h-5 w-20 mx-auto mb-2" />
                <Skeleton className="h-4 w-24 mx-auto" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
