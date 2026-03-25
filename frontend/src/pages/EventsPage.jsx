import { useState, useEffect } from 'react';
import { eventsAPI, registrationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import EventCard from '../components/EventCard';
import { EventCardSkeleton } from '../components/Skeleton';
import { HiOutlineSearch, HiOutlineLocationMarker, HiOutlineCalendar, HiOutlineSparkles } from 'react-icons/hi';

const EventsPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [registeredIds, setRegisteredIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (search) params.search = search;
      if (location) params.location = location;
      const res = await eventsAPI.getAll(params);
      setEvents(res.data.events);
      setPagination(res.data.pagination);
    } catch { toast.error('Failed to load events'); } finally { setLoading(false); }
  };

  const fetchRegistrations = async () => {
    if (!user) return;
    try {
      const res = await registrationsAPI.getMine();
      setRegisteredIds(res.data.map(r => r.eventId?._id));
    } catch {}
  };

  useEffect(() => { const t = setTimeout(fetchEvents, 300); return () => clearTimeout(t); }, [search, location, page]);
  useEffect(() => { fetchRegistrations(); }, [user]);

  const handleRegister = async (eventId) => {
    try {
      await registrationsAPI.register(eventId);
      toast.success('Successfully registered! 🎉');
      setRegisteredIds([...registeredIds, eventId]);
      fetchEvents();
    } catch (err) { toast.error(err.response?.data?.message || 'Registration failed'); }
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 hero-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-2">
            <HiOutlineSparkles className="w-5 h-5 text-primary-500" />
            <span className="text-sm font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest">Explore</span>
          </div>
          <h1 className="text-4xl font-extrabold text-surface-900 dark:text-white tracking-tight">Browse Events</h1>
          <p className="text-surface-500 dark:text-surface-400 mt-2 text-lg">Discover what's happening on campus</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="relative flex-1">
            <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search events..."
              className="input"
            />
          </div>
          <div className="relative sm:w-72">
            <HiOutlineLocationMarker className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
            <input
              type="text"
              value={location}
              onChange={(e) => { setLocation(e.target.value); setPage(1); }}
              placeholder="Filter by location..."
              className="input"
            />
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <EventCardSkeleton key={i} />)}
          </div>
        ) : events.length === 0 ? (
          <div className="card p-16 text-center">
            <div className="w-16 h-16 bg-surface-100 dark:bg-surface-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <HiOutlineCalendar className="w-8 h-8 text-surface-400" />
            </div>
            <h3 className="text-lg font-bold text-surface-700 dark:text-surface-300 mb-2">No events found</h3>
            <p className="text-surface-500 dark:text-surface-400">Try adjusting your search or check back later.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, i) => (
                <div key={event._id} style={{ animationDelay: `${0.2 + i * 0.05}s` }}>
                  <EventCard event={event} showRegister={Boolean(user)} isRegistered={registeredIds.includes(event._id)} onRegister={handleRegister} />
                </div>
              ))}
            </div>

            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-5 py-2.5 text-sm font-bold text-surface-600 dark:text-surface-300 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800 disabled:opacity-40 transition-all">
                  Previous
                </button>
                {Array.from({ length: pagination.pages }).map((_, i) => (
                  <button key={i} onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 text-sm font-bold rounded-xl transition-all ${
                      page === i + 1
                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                        : 'text-surface-600 dark:text-surface-300 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 hover:bg-surface-50'
                    }`}>
                    {i + 1}
                  </button>
                ))}
                <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages}
                  className="px-5 py-2.5 text-sm font-bold text-surface-600 dark:text-surface-300 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800 disabled:opacity-40 transition-all">
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
