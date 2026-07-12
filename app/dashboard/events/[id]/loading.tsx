import { Skeleton } from "@/components/ui/skeleton";

export default function EditEventLoading() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-4 w-40" />
      </div>

      <Skeleton className="h-20 w-full rounded-xl" />

      {Array.from({ length: 2 }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10"
        >
          <Skeleton className="h-6 w-44" />
          <div className="grid gap-5 sm:grid-cols-2">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
