import { Link } from 'react-router-dom';
import { HiOutlineCalendar, HiOutlineLocationMarker, HiOutlineUsers } from 'react-icons/hi';

const EventCard = ({ event, onRegister, isRegistered, showRegister = false, isAdmin = false }) => {
  const eventDate = new Date(event.date);
  const isPast = eventDate < new Date();
  const isFull = event.capacity > 0 && event.registrationCount >= event.capacity;
  const capacityPercent = event.capacity > 0 ? Math.min(100, ((event.registrationCount || 0) / event.capacity) * 100) : 0;

  const formatDate = (date) =>
    new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(date));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
      {/* Image Container */}
      <div className="relative h-48 w-full bg-gray-100 dark:bg-gray-700 flex-shrink-0">
        {event.image ? (
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <HiOutlineCalendar className="h-12 w-12 text-gray-400" />
          </div>
        )}
        
        {/* Status Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          {isPast && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 shadow-sm">
              Past
            </span>
          )}
          {isFull && !isPast && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 shadow-sm">
              Sold Out
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate" title={event.title}>
          {event.title}
        </h3>
        
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2 min-h-[2.5rem]">
          {event.description}
        </p>

        <div className="mt-4 space-y-2 flex-1">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <HiOutlineCalendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
            <span className="truncate">{formatDate(event.date)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <HiOutlineLocationMarker className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
            <span className="truncate">{event.location}</span>
          </div>

          {event.capacity > 0 && (
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <div className="flex items-center">
                  <HiOutlineUsers className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                  <span>{event.registrationCount || 0} / {event.capacity} Registered</span>
                </div>
                <span>{Math.round(capacityPercent)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${capacityPercent}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-5 flex items-center justify-between gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
          <Link
            to={isAdmin ? `/admin/events/${event._id}/registrations` : `/events/${event._id}`}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            {isAdmin ? 'Manage' : 'View Details'}
          </Link>
          
          {showRegister && !isPast && !isFull && (
            <button
              onClick={() => onRegister(event._id)}
              disabled={isRegistered}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm transition-colors ${
                isRegistered
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 cursor-default'
                  : 'text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {isRegistered ? '✓ Registered' : 'Register Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
