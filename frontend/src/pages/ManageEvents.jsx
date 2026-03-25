import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { eventsAPI } from '../services/api';
import { toast } from 'react-toastify';
import ConfirmModal from '../components/ConfirmModal';
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlusCircle, HiOutlineSearch, HiOutlineCalendar, HiOutlineSparkles } from 'react-icons/hi';

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteModal, setDeleteModal] = useState({ open: false, event: null });
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const res = await eventsAPI.getAll({ limit: 100, search });
      setEvents(res.data.events);
    } catch { toast.error('Failed to load events'); } finally { setLoading(false); }
  };

  useEffect(() => { const t = setTimeout(fetchEvents, 300); return () => clearTimeout(t); }, [search]);

  const handleDelete = async () => {
    try {
      await eventsAPI.delete(deleteModal.event._id);
      toast.success('Event deleted successfully');
      setDeleteModal({ open: false, event: null });
      fetchEvents();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to delete'); }
  };

  const formatDate = (d) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(d));

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 hero-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-fade-in-up">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <HiOutlineSparkles className="w-5 h-5 text-primary-500" />
              <span className="text-sm font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest">Management</span>
            </div>
            <h1 className="text-4xl font-extrabold text-surface-900 dark:text-white tracking-tight">Manage Events</h1>
          </div>
          <Link to="/admin/events/new" className="btn-primary flex items-center gap-2 text-sm self-start">
            <HiOutlinePlusCircle className="w-5 h-5" /><span>Create Event</span>
          </Link>
        </div>

        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="relative max-w-md">
            <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search events..." className="input" />
          </div>
        </div>

        <div className="card overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {loading ? (
            <div className="p-6 space-y-3">{[1, 2, 3, 4].map((i) => <div key={i} className="skeleton h-16 w-full" />)}</div>
          ) : events.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-16 h-16 bg-surface-100 dark:bg-surface-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <HiOutlineCalendar className="w-8 h-8 text-surface-400" />
              </div>
              <p className="text-surface-500 font-medium">No events found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="table-header">
                    {['Event', 'Date', 'Location', 'Capacity', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-7 py-4 text-xs font-bold text-surface-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                  {events.map((event) => (
                    <tr key={event._id} className="hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors duration-200">
                      <td className="px-7 py-5">
                        <div className="flex items-center gap-3.5">
                          {event.image ? <img src={event.image} alt="" className="w-11 h-11 rounded-xl object-cover shadow-sm" /> : <div className="w-11 h-11 bg-gradient-to-br from-primary-400 to-accent-400 rounded-xl shadow-sm" />}
                          <span className="text-sm font-bold text-surface-900 dark:text-surface-100">{event.title}</span>
                        </div>
                      </td>
                      <td className="px-7 py-5 text-sm text-surface-500 font-medium">{formatDate(event.date)}</td>
                      <td className="px-7 py-5 text-sm text-surface-500 font-medium">{event.location}</td>
                      <td className="px-7 py-5 text-sm text-surface-500 font-medium">{event.capacity > 0 ? event.capacity : '∞'}</td>
                      <td className="px-7 py-5">
                        <div className="flex items-center gap-1.5">
                          <Link to={`/admin/events/${event._id}/registrations`} className="px-3 py-1.5 text-xs font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40 hover:bg-primary-100 rounded-lg transition-all">
                            Registrations
                          </Link>
                          <button onClick={() => navigate(`/admin/events/edit/${event._id}`)} className="p-2 text-surface-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/40 rounded-lg transition-all" title="Edit">
                            <HiOutlinePencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteModal({ open: true, event })} className="p-2 text-surface-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-all" title="Delete">
                            <HiOutlineTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal isOpen={deleteModal.open} title="Delete Event" message={`Are you sure you want to delete "${deleteModal.event?.title}"? This will also remove all registrations.`} confirmText="Delete" danger onConfirm={handleDelete} onCancel={() => setDeleteModal({ open: false, event: null })} />
    </div>
  );
};

export default ManageEvents;
