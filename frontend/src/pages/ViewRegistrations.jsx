import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { eventsAPI, registrationsAPI } from '../services/api';
import { toast } from 'react-toastify';
import { HiOutlineArrowLeft, HiOutlineCalendar, HiOutlineUsers, HiOutlineSparkles } from 'react-icons/hi';

const ViewRegistrations = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventRes, regRes] = await Promise.all([eventsAPI.getById(eventId), registrationsAPI.getForEvent(eventId)]);
        setEvent(eventRes.data);
        setRegistrations(regRes.data);
      } catch { toast.error('Failed to load data'); } finally { setLoading(false); }
    };
    fetchData();
  }, [eventId]);

  const formatDate = (d) => new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(d));

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950">
      <div className="w-14 h-14 border-4 border-primary-200 dark:border-primary-900 border-t-primary-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 hero-pattern">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/admin/events" className="inline-flex items-center gap-2 text-sm text-surface-500 hover:text-primary-600 dark:text-surface-400 dark:hover:text-primary-400 mb-8 font-semibold transition-colors group">
          <HiOutlineArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Events
        </Link>

        {event && (
          <div className="card p-7 mb-6 animate-fade-in-up">
            <div className="flex items-start gap-5">
              {event.image ? <img src={event.image} alt="" className="w-20 h-20 rounded-2xl object-cover shadow-md shrink-0" /> : <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-accent-400 rounded-2xl shadow-md shrink-0" />}
              <div>
                <h1 className="text-2xl font-extrabold text-surface-900 dark:text-white">{event.title}</h1>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-surface-500 dark:text-surface-400">
                  <span className="flex items-center gap-1.5 font-medium"><HiOutlineCalendar className="w-4 h-4 text-primary-500" /> {formatDate(event.date)}</span>
                  <span className="flex items-center gap-1.5 font-medium"><HiOutlineUsers className="w-4 h-4 text-green-500" /> {registrations.length} / {event.capacity > 0 ? event.capacity : '∞'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="card overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="px-7 py-5 border-b border-surface-200 dark:border-surface-800 flex items-center gap-2">
            <HiOutlineSparkles className="w-5 h-5 text-primary-500" />
            <h2 className="text-lg font-extrabold text-surface-900 dark:text-white">Registered Students ({registrations.length})</h2>
          </div>

          {registrations.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-16 h-16 bg-surface-100 dark:bg-surface-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <HiOutlineUsers className="w-8 h-8 text-surface-400" />
              </div>
              <p className="text-surface-500 font-medium">No students have registered yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="table-header">
                    {['#', 'Student', 'Email', 'Registered On'].map((h) => (
                      <th key={h} className="text-left px-7 py-4 text-xs font-bold text-surface-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                  {registrations.map((reg, i) => (
                    <tr key={reg._id} className="hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors duration-200">
                      <td className="px-7 py-5 text-sm text-surface-400 font-bold">{i + 1}</td>
                      <td className="px-7 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-accent-400 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-sm">
                            {reg.userId?.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-bold text-surface-900 dark:text-surface-100">{reg.userId?.name}</span>
                        </div>
                      </td>
                      <td className="px-7 py-5 text-sm text-surface-500 font-medium">{reg.userId?.email}</td>
                      <td className="px-7 py-5 text-sm text-surface-500 font-medium">{formatDate(reg.createdAt)}</td>
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

export default ViewRegistrations;
