const Skeleton = ({ className = '', count = 1 }) => {
  return Array.from({ length: count }).map((_, i) => (
    <div key={i} className={`bg-gray-200 dark:bg-gray-700 animate-pulse rounded ${className}`} />
  ));
};

export const EventCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
    <div className="bg-gray-200 dark:bg-gray-700 animate-pulse h-48 w-full" />
    <div className="p-5 flex-1 space-y-4">
      <div className="bg-gray-200 dark:bg-gray-700 animate-pulse h-6 w-3/4 rounded" />
      <div className="space-y-2">
        <div className="bg-gray-200 dark:bg-gray-700 animate-pulse h-4 w-full rounded" />
        <div className="bg-gray-200 dark:bg-gray-700 animate-pulse h-4 w-2/3 rounded" />
      </div>
      <div className="space-y-2 pt-4">
        <div className="bg-gray-200 dark:bg-gray-700 animate-pulse h-4 w-1/2 rounded" />
        <div className="bg-gray-200 dark:bg-gray-700 animate-pulse h-4 w-1/3 rounded" />
      </div>
      <div className="pt-4 flex justify-between gap-2 border-t border-gray-100 dark:border-gray-700 mt-auto">
        <div className="bg-gray-200 dark:bg-gray-700 animate-pulse h-8 w-16 rounded" />
        <div className="bg-gray-200 dark:bg-gray-700 animate-pulse h-8 w-24 rounded" />
      </div>
    </div>
  </div>
);

export const TableRowSkeleton = ({ cols = 5 }) => (
  <tr>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-6 py-4">
        <div className="bg-gray-200 dark:bg-gray-700 animate-pulse h-4 w-full rounded" />
      </td>
    ))}
  </tr>
);

export default Skeleton;
