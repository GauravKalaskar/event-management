import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventsAPI, registrationsAPI } from '../services/api';
import { HiOutlineCalendar, HiOutlineUsers, HiOutlineTrendingUp, HiPlus } from 'react-icons/hi';

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
    { label: 'Total Events', value: stats.events, icon: HiOutlineCalendar, bgColor: 'bg-blue-500' },
    { label: 'Upcoming Events', value: stats.upcoming, icon: HiOutlineTrendingUp, bgColor: 'bg-green-500' },
    { label: 'Total Registrations', value: stats.registrations, icon: HiOutlineUsers, bgColor: 'bg-purple-500' },
  ];

  const formatDate = (d) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(d));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
              Admin Dashboard
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Welcome back, {user?.name}. Here's what's happening.
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Link to="/admin/events/new" 
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <HiPlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Create Event
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
          {statCards.map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
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
            </div>
          ))}
        </div>

        {/* Recent Events Table */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Recent Events</h3>
            <Link to="/admin/events" className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
              View all
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map((i) => <div key={i} className="h-10 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />)}
              </div>
            ) : recentEvents.length === 0 ? (
              <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                <HiOutlineCalendar className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm font-medium">No events found.</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Event</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Registrations</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {recentEvents.map((event) => (
                    <tr key={event._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            {event.image ? (
                              <img className="h-10 w-10 rounded-md object-cover" src={event.image} alt="" />
                            ) : (
                              <div className="h-10 w-10 rounded-md bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                                {event.title.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{event.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(event.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {event.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                          {event.regCount || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link to={`/admin/events/${event._id}/registrations`} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
