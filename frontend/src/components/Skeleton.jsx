const Skeleton = ({ className = '', count = 1 }) => {
  return Array.from({ length: count }).map((_, i) => (
    <div key={i} className={`skeleton ${className}`} />
  ));
};

export const EventCardSkeleton = () => (
  <div className="bg-white dark:bg-surface-900 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-800 overflow-hidden">
    <div className="skeleton h-48 rounded-none" />
    <div className="p-5 space-y-3">
      <div className="skeleton h-6 w-3/4" />
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-2/3" />
      <div className="space-y-2 mt-4">
        <div className="skeleton h-4 w-1/2" />
        <div className="skeleton h-4 w-2/3" />
      </div>
      <div className="skeleton h-10 w-full mt-4 rounded-xl" />
    </div>
  </div>
);

export const TableRowSkeleton = ({ cols = 5 }) => (
  <tr>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-6 py-4">
        <div className="skeleton h-4 w-full" />
      </td>
    ))}
  </tr>
);

export default Skeleton;
