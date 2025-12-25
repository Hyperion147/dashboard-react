import { Skeleton } from "@repo/ui/skeleton";
import { Tabs, TabsContent } from "@repo/ui/tabs";

export function CompanyPageSkeleton() {
  return (
    <div className="p-4">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between px-2 mb-4">
        <div className="flex items-center gap-4">
          <div className="space-y-3">
            {/* Company name */}
            <Skeleton className="h-8 w-[300px]" />
            
            {/* ID and badges */}
            <div className="flex gap-2">
              <Skeleton className="h-5 w-[150px]" />
              <Skeleton className="h-5 w-[80px] rounded-full" />
              <Skeleton className="h-5 w-[80px] rounded-full" />
            </div>
          </div>
        </div>
        
        {/* Action button */}
        <Skeleton className="h-9 w-9 rounded-md" />
      </div>

      {/* Tabs Skeleton */}
      <Tabs value="overview">
        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Overview content skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-9 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-20 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-9 w-full" />
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-9 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-9 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-9 w-full" />
              </div>
            </div>
          </div>

          {/* Address section skeleton */}
          <div className="space-y-4 pt-4 border-t">
            <Skeleton className="h-6 w-[150px]" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
