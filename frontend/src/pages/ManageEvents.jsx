import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { eventsAPI } from '../services/api';
import { toast } from 'react-toastify';
import ConfirmModal from '../components/ConfirmModal';
import { HiOutlinePencil, HiOutlineTrash, HiPlus, HiOutlineSearch, HiOutlineCalendar } from 'react-icons/hi';

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
              Manage Events
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              View, edit, or delete existing events and their registrations.
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

        <div className="mb-6 max-w-md">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiOutlineSearch className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4].map((i) => <div key={i} className="h-12 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />)}
            </div>
          ) : events.length === 0 ? (
            <div className="p-12 text-center text-gray-500 dark:text-gray-400">
              <HiOutlineCalendar className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm font-medium">No events found matching your search.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Event</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Capacity</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {events.map((event) => (
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatDate(event.date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{event.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{event.capacity > 0 ? event.capacity : 'Unlimited'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-3 items-center">
                          <Link to={`/admin/events/${event._id}/registrations`} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                            Registrations
                          </Link>
                          <button onClick={() => navigate(`/admin/events/edit/${event._id}`)} className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" title="Edit">
                            <HiOutlinePencil className="w-5 h-5" />
                          </button>
                          <button onClick={() => setDeleteModal({ open: true, event })} className="text-gray-400 hover:text-red-600 dark:hover:text-red-400" title="Delete">
                            <HiOutlineTrash className="w-5 h-5" />
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

      <ConfirmModal 
        isOpen={deleteModal.open} 
        title="Delete Event" 
        message={`Are you sure you want to delete "${deleteModal.event?.title}"? This will also remove all registrations.`} 
        confirmText="Delete" 
        danger 
        onConfirm={handleDelete} 
        onCancel={() => setDeleteModal({ open: false, event: null })} 
      />
    </div>
  );
};

export default ManageEvents;
