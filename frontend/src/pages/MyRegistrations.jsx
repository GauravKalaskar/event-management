import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { registrationsAPI } from '../services/api';
import { toast } from 'react-toastify';
import ConfirmModal from '../components/ConfirmModal';
import { HiOutlineCalendar, HiOutlineLocationMarker, HiOutlineTicket, HiOutlineTrash } from 'react-icons/hi';

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelModal, setCancelModal] = useState({ open: false, reg: null });

  const fetchRegistrations = async () => {
    try { const res = await registrationsAPI.getMine(); setRegistrations(res.data); }
    catch { toast.error('Failed to load'); } finally { setLoading(false); }
  };

  useEffect(() => { fetchRegistrations(); }, []);

  const handleCancel = async () => {
    try {
      await registrationsAPI.cancel(cancelModal.reg._id);
      toast.success('Registration cancelled');
      setCancelModal({ open: false, reg: null });
      fetchRegistrations();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const formatDate = (d) => new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(d));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Registrations</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Events you have registered to attend.</p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />)}
          </div>
        ) : registrations.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
            <HiOutlineTicket className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No registrations</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 mb-6">You haven't registered for any events yet.</p>
            <Link to="/events" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {registrations.map((reg) => {
              const event = reg.eventId;
              if (!event) return null;
              const isPast = new Date(event.date) < new Date();

              return (
                <div key={reg._id} className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="sm:flex">
                    <div className="sm:flex-shrink-0 sm:w-48 h-48 sm:h-auto">
                      {event.image ? (
                        <img src={event.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                          <HiOutlineCalendar className="h-12 w-12 text-blue-500" />
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate pr-4">{event.title}</h3>
                          {isPast && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">Past</span>}
                        </div>
                        <div className="mt-2 flex flex-col sm:flex-row sm:flex-wrap sm:gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center mt-2 sm:mt-0"><HiOutlineCalendar className="mr-1.5 h-4 w-4 text-gray-400" /> {formatDate(event.date)}</span>
                          <span className="flex items-center mt-2 sm:mt-0"><HiOutlineLocationMarker className="mr-1.5 h-4 w-4 text-gray-400" /> {event.location}</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Registered {formatDate(reg.createdAt)}</p>
                        <div className="flex space-x-3">
                          <Link to={`/events/${event._id}`} className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                            Details
                          </Link>
                          {!isPast && (
                            <button onClick={() => setCancelModal({ open: true, reg })} className="text-sm font-medium text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300" title="Cancel Registration">
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmModal 
        isOpen={cancelModal.open} 
        title="Cancel Registration" 
        message={`Are you sure you want to cancel your registration for "${cancelModal.reg?.eventId?.title}"?`} 
        confirmText="Cancel Registration" 
        danger 
        onConfirm={handleCancel} 
        onCancel={() => setCancelModal({ open: false, reg: null })} 
      />
    </div>
  );
};

export default MyRegistrations;
