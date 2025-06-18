import { Skeleton } from "@/components/ui/skeleton";

function Loading() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-y-8">
        {/* Quiz Title Skeleton */}
        <Skeleton className="h-8 w-[40%]" />

        {/* Question block skeletons */}
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-3">
              {/* Question text */}
              <Skeleton className="h-5 w-[70%]" />

              {/* Answer options */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[85%]" />
                <Skeleton className="h-4 w-[88%]" />
                <Skeleton className="h-4 w-[80%]" />
              </div>
            </div>
          ))}
        </div>

        {/* Submit button skeleton */}
        <div className="pt-6">
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export default Loading;
