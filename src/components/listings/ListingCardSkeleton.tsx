export default function ListingCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton h-48 rounded-none" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-4 w-24 rounded-full" />
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-2/3" />
        <div className="flex justify-between mt-4">
          <div className="skeleton h-3.5 w-28" />
          <div className="skeleton h-3.5 w-20" />
        </div>
      </div>
    </div>
  )
}
