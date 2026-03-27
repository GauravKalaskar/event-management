import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventsAPI, registrationsAPI } from '../services/api';
import { HiOutlineCalendar, HiOutlineClipboardList, HiOutlineTicket, HiOutlineArrowRight, HiOutlineSparkles } from 'react-icons/hi';
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
    { label: 'Available Events', value: upcomingEvents.length, icon: HiOutlineCalendar, gradient: 'stat-indigo', shadow: 'shadow-primary-500/20', link: '/events' },
    { label: 'My Registrations', value: registrations.length, icon: HiOutlineTicket, gradient: 'stat-emerald', shadow: 'shadow-green-500/20', link: '/student/registrations' },
    { label: 'Upcoming', value: registrations.filter(r => new Date(r.eventId?.date) > new Date()).length, icon: HiOutlineClipboardList, gradient: 'stat-amber', shadow: 'shadow-amber-500/20', link: '/student/registrations' },
  ];

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 hero-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="animate-fade-in-up mb-10">
          <div className="flex items-center gap-2 mb-2">
            <HiOutlineSparkles className="w-5 h-5 text-primary-500" />
            <span className="text-sm font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest">Student Dashboard</span>
          </div>
          <h1 className="text-4xl font-extrabold text-surface-900 dark:text-white tracking-tight">
            Welcome, {user?.name}! 👋
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mt-2 text-lg">Discover and register for amazing college events</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, i) => (
            <Link to={stat.link} key={stat.label} className={`block ${stat.gradient} rounded-2xl p-7 shadow-xl ${stat.shadow} text-white relative overflow-hidden animate-fade-in-up hover:-translate-y-1 hover:shadow-2xl transition-all duration-300`} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white/70 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-4xl font-extrabold mt-2">
                    {loading ? <span className="inline-block w-16 h-10 bg-white/10 rounded-lg animate-pulse" /> : stat.value}
                  </p>
                </div>
                <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <stat.icon className="w-7 h-7 text-white/80" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Events Header */}
        <div className="flex items-center justify-between mb-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-2xl font-extrabold text-surface-900 dark:text-white">Upcoming Events</h2>
          <Link to="/events" className="flex items-center gap-1.5 text-sm text-primary-600 dark:text-primary-400 font-bold hover:underline">
            View all <HiOutlineArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <EventCardSkeleton key={i} />)}
          </div>
        ) : upcomingEvents.length === 0 ? (
          <div className="card p-16 text-center">
            <div className="w-16 h-16 bg-surface-100 dark:bg-surface-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <HiOutlineCalendar className="w-8 h-8 text-surface-400" />
            </div>
            <p className="text-surface-500 dark:text-surface-400 font-medium">No upcoming events at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.slice(0, 6).map((event, i) => (
              <div key={event._id} style={{ animationDelay: `${0.4 + i * 0.1}s` }}>
                <EventCard event={event} isRegistered={registeredIds.includes(event._id)} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
