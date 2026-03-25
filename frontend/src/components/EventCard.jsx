import { Link } from 'react-router-dom';
import { HiOutlineCalendar, HiOutlineLocationMarker, HiOutlineUsers, HiOutlineArrowRight } from 'react-icons/hi';

const EventCard = ({ event, onRegister, isRegistered, showRegister = false, isAdmin = false }) => {
  const eventDate = new Date(event.date);
  const isPast = eventDate < new Date();
  const isFull = event.capacity > 0 && event.registrationCount >= event.capacity;

  const formatDate = (date) =>
    new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(date));

  return (
    <div className="group card overflow-hidden animate-fade-in-up">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        {event.image ? (
          <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 flex items-center justify-center">
            <HiOutlineCalendar className="w-16 h-16 text-white/30" />
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Badges */}
        <div className="absolute top-4 right-4 flex gap-2">
          {isPast && (
            <span className="px-3 py-1.5 bg-surface-900/70 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/10">
              Past Event
            </span>
          )}
          {isFull && !isPast && (
            <span className="px-3 py-1.5 bg-red-500/80 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/10">
              Sold Out
            </span>
          )}
        </div>

        {/* Date badge bottom-left */}
        <div className="absolute bottom-4 left-4">
          <div className="px-3 py-1.5 bg-white/90 dark:bg-surface-900/90 backdrop-blur-md rounded-xl text-xs font-bold text-surface-900 dark:text-surface-100 shadow-lg">
            {formatDate(event.date)}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-extrabold text-surface-900 dark:text-surface-100 mb-2 line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
          {event.title}
        </h3>
        <p className="text-sm text-surface-500 dark:text-surface-400 mb-5 line-clamp-2 leading-relaxed">
          {event.description}
        </p>

        <div className="space-y-2.5 mb-5">
          <div className="flex items-center gap-2.5 text-sm text-surface-600 dark:text-surface-400">
            <div className="w-8 h-8 bg-accent-50 dark:bg-accent-900/20 rounded-lg flex items-center justify-center shrink-0">
              <HiOutlineLocationMarker className="w-4 h-4 text-accent-500" />
            </div>
            <span className="truncate font-medium">{event.location}</span>
          </div>
          {event.capacity > 0 && (
            <div className="flex items-center gap-2.5 text-sm text-surface-600 dark:text-surface-400">
              <div className="w-8 h-8 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center shrink-0">
                <HiOutlineUsers className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{event.registrationCount || 0} / {event.capacity}</span>
                  <span className="text-xs text-surface-400">{Math.round(((event.registrationCount || 0) / event.capacity) * 100)}%</span>
                </div>
                <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-1.5">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-400 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, ((event.registrationCount || 0) / event.capacity) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2.5">
          <Link
            to={isAdmin ? `/admin/events/${event._id}/registrations` : `/events/${event._id}`}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40 hover:bg-primary-100 dark:hover:bg-primary-950/60 rounded-xl transition-all duration-300"
          >
            {isAdmin ? 'Registrations' : 'Details'}
            <HiOutlineArrowRight className="w-3.5 h-3.5" />
          </Link>
          {showRegister && !isPast && !isFull && (
            <button
              onClick={() => onRegister(event._id)}
              disabled={isRegistered}
              className={`flex-1 px-4 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
                isRegistered
                  ? 'bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 cursor-default border border-green-200 dark:border-green-900'
                  : 'btn-primary'
              }`}
            >
              <span>{isRegistered ? '✓ Registered' : 'Register Now'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
