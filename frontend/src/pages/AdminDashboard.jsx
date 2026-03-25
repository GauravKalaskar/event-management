import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventsAPI, registrationsAPI } from '../services/api';
import { HiOutlineCalendar, HiOutlineUsers, HiOutlineClipboardList, HiOutlinePlusCircle, HiOutlineArrowRight, HiOutlineTrendingUp } from 'react-icons/hi';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ events: 0, registrations: 0, upcoming: 0 });
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsRes = await eventsAPI.getAll({ limit: 100 });
        const events = eventsRes.data.events;
        const upcoming = events.filter(e => new Date(e.date) > new Date()).length;

        let totalRegistrations = 0;
        for (const event of events.slice(0, 5)) {
          try {
            const regRes = await registrationsAPI.getForEvent(event._id);
            totalRegistrations += regRes.data.length;
            event.regCount = regRes.data.length;
          } catch { event.regCount = 0; }
        }

        setStats({ events: events.length, registrations: totalRegistrations, upcoming });
        setRecentEvents(events.slice(0, 5));
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const statCards = [
    { label: 'Total Events', value: stats.events, icon: HiOutlineCalendar, gradient: 'stat-indigo', shadow: 'shadow-primary-500/20' },
    { label: 'Upcoming', value: stats.upcoming, icon: HiOutlineTrendingUp, gradient: 'stat-emerald', shadow: 'shadow-green-500/20' },
    { label: 'Registrations', value: stats.registrations, icon: HiOutlineUsers, gradient: 'stat-rose', shadow: 'shadow-red-500/20' },
  ];

  const formatDate = (d) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(d));

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 hero-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl font-extrabold text-surface-900 dark:text-white tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-surface-500 dark:text-surface-400 mt-2 text-lg">Welcome back, <span className="font-semibold text-surface-700 dark:text-surface-300">{user?.name}</span> 👋</p>
          </div>
          <Link to="/admin/events/new" className="btn-primary flex items-center gap-2 text-sm self-start animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <HiOutlinePlusCircle className="w-5 h-5" />
            <span>Create Event</span>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {statCards.map((stat, i) => (
            <div key={stat.label} className={`${stat.gradient} rounded-2xl p-7 shadow-xl ${stat.shadow} text-white relative overflow-hidden animate-fade-in-up`} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-8 -translate-x-8" />
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
            </div>
          ))}
        </div>

        {/* Recent Events */}
        <div className="card overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between px-7 py-5 border-b border-surface-200 dark:border-surface-800">
            <h2 className="text-xl font-extrabold text-surface-900 dark:text-white">Recent Events</h2>
            <Link to="/admin/events" className="flex items-center gap-1.5 text-sm text-primary-600 dark:text-primary-400 font-bold hover:underline">
              View all <HiOutlineArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => <div key={i} className="skeleton h-14 w-full" />)}
            </div>
          ) : recentEvents.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-16 h-16 bg-surface-100 dark:bg-surface-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <HiOutlineCalendar className="w-8 h-8 text-surface-400" />
              </div>
              <p className="text-surface-500 dark:text-surface-400 font-medium">No events yet. Create your first event!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="table-header">
                    <th className="text-left px-7 py-4 text-xs font-bold text-surface-500 uppercase tracking-wider">Event</th>
                    <th className="text-left px-7 py-4 text-xs font-bold text-surface-500 uppercase tracking-wider">Date</th>
                    <th className="text-left px-7 py-4 text-xs font-bold text-surface-500 uppercase tracking-wider">Location</th>
                    <th className="text-left px-7 py-4 text-xs font-bold text-surface-500 uppercase tracking-wider">Registrations</th>
                    <th className="text-left px-7 py-4 text-xs font-bold text-surface-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                  {recentEvents.map((event) => (
                    <tr key={event._id} className="hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors duration-200">
                      <td className="px-7 py-5">
                        <div className="flex items-center gap-3.5">
                          {event.image ? (
                            <img src={event.image} alt="" className="w-11 h-11 rounded-xl object-cover shadow-sm" />
                          ) : (
                            <div className="w-11 h-11 bg-gradient-to-br from-primary-400 to-accent-400 rounded-xl shadow-sm" />
                          )}
                          <span className="text-sm font-bold text-surface-900 dark:text-surface-100">{event.title}</span>
                        </div>
                      </td>
                      <td className="px-7 py-5 text-sm text-surface-500 dark:text-surface-400 font-medium">{formatDate(event.date)}</td>
                      <td className="px-7 py-5 text-sm text-surface-500 dark:text-surface-400 font-medium">{event.location}</td>
                      <td className="px-7 py-5">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 font-bold rounded-full text-xs">
                          <HiOutlineUsers className="w-3.5 h-3.5" />
                          {event.regCount || 0}
                        </span>
                      </td>
                      <td className="px-7 py-5">
                        <Link to={`/admin/events/${event._id}/registrations`} className="text-sm text-primary-600 dark:text-primary-400 font-bold hover:underline">
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
