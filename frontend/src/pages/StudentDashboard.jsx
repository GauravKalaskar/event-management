import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventsAPI, registrationsAPI } from '../services/api';
import { HiOutlineCalendar, HiOutlineClipboardList, HiOutlineTicket } from 'react-icons/hi';
import EventCard from '../components/EventCard';
import { EventCardSkeleton } from '../components/Skeleton';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, regsRes] = await Promise.all([eventsAPI.getAll({ limit: 6 }), registrationsAPI.getMine()]);
        setEvents(eventsRes.data.events);
        setRegistrations(regsRes.data);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const upcomingEvents = events.filter(e => new Date(e.date) > new Date());
  const registeredIds = registrations.map(r => r.eventId?._id);

  const stats = [
    { label: 'Available Events', value: upcomingEvents.length, icon: HiOutlineCalendar, bgColor: 'bg-blue-500', link: '/events' },
    { label: 'My Registrations', value: registrations.length, icon: HiOutlineTicket, bgColor: 'bg-green-500', link: '/student/registrations' },
    { label: 'Upcoming', value: registrations.filter(r => new Date(r.eventId?.date) > new Date()).length, icon: HiOutlineClipboardList, bgColor: 'bg-purple-500', link: '/student/registrations' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome, {user?.name}!
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Discover and register for amazing college events.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
          {stats.map((stat) => (
            <Link to={stat.link} key={stat.label} className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`rounded-md p-3 ${stat.bgColor} bg-opacity-10 dark:bg-opacity-20`}>
                      <stat.icon className={`h-6 w-6 ${stat.bgColor.replace('bg-', 'text-')}`} aria-hidden="true" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{stat.label}</dt>
                      <dd>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {loading ? <span className="inline-block w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" /> : stat.value}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Events Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Upcoming Events</h2>
          <Link to="/events" className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
            View all
          </Link>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <EventCardSkeleton key={i} />)}
          </div>
        ) : upcomingEvents.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
            <HiOutlineCalendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No upcoming events</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Check back later for new events.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.slice(0, 6).map((event) => (
              <EventCard key={event._id} event={event} isRegistered={registeredIds.includes(event._id)} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default StudentDashboard;
