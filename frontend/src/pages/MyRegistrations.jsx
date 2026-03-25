import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { registrationsAPI } from '../services/api';
import { toast } from 'react-toastify';
import ConfirmModal from '../components/ConfirmModal';
import { HiOutlineCalendar, HiOutlineLocationMarker, HiOutlineTicket, HiOutlineTrash, HiOutlineArrowRight, HiOutlineSparkles } from 'react-icons/hi';

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
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 hero-pattern">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-2">
            <HiOutlineSparkles className="w-5 h-5 text-primary-500" />
            <span className="text-sm font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest">My Events</span>
          </div>
          <h1 className="text-4xl font-extrabold text-surface-900 dark:text-white tracking-tight">My Registrations</h1>
          <p className="text-surface-500 dark:text-surface-400 mt-2 text-lg">Events you've registered for</p>
        </div>

        {loading ? (
          <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="skeleton h-32 w-full rounded-2xl" />)}</div>
        ) : registrations.length === 0 ? (
          <div className="card p-16 text-center animate-fade-in-up">
            <div className="w-16 h-16 bg-surface-100 dark:bg-surface-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <HiOutlineTicket className="w-8 h-8 text-surface-400" />
            </div>
            <h3 className="text-lg font-bold text-surface-700 dark:text-surface-300 mb-2">No registrations yet</h3>
            <p className="text-surface-500 dark:text-surface-400 mb-6">You haven't registered for any events.</p>
            <Link to="/events" className="btn-primary inline-flex items-center gap-2 text-sm">
              <span>Browse Events</span> <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {registrations.map((reg, i) => {
              const event = reg.eventId;
              if (!event) return null;
              const isPast = new Date(event.date) < new Date();

              return (
                <div key={reg._id} className="card overflow-hidden animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-52 h-36 sm:h-auto shrink-0">
                      {event.image ? <img src={event.image} alt="" className="w-full h-full object-cover" /> : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center min-h-[9rem]">
                          <HiOutlineCalendar className="w-10 h-10 text-white/30" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2.5 mb-1.5">
                          <h3 className="text-lg font-extrabold text-surface-900 dark:text-white">{event.title}</h3>
                          {isPast && <span className="px-2.5 py-1 text-xs font-bold bg-surface-200 dark:bg-surface-700 text-surface-500 rounded-full">Past</span>}
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-surface-500 dark:text-surface-400">
                          <span className="flex items-center gap-1.5 font-medium"><HiOutlineCalendar className="w-4 h-4 text-primary-500" /> {formatDate(event.date)}</span>
                          <span className="flex items-center gap-1.5 font-medium"><HiOutlineLocationMarker className="w-4 h-4 text-accent-500" /> {event.location}</span>
                        </div>
                        <p className="text-xs text-surface-400 mt-2 font-medium">Registered {formatDate(reg.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Link to={`/events/${event._id}`} className="px-4 py-2.5 text-sm font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40 hover:bg-primary-100 dark:hover:bg-primary-950/60 rounded-xl transition-all">
                          Details
                        </Link>
                        {!isPast && (
                          <button onClick={() => setCancelModal({ open: true, reg })} className="p-2.5 text-surface-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-all" title="Cancel">
                            <HiOutlineTrash className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmModal isOpen={cancelModal.open} title="Cancel Registration" message={`Are you sure you want to cancel your registration for "${cancelModal.reg?.eventId?.title}"?`} confirmText="Cancel Registration" danger onConfirm={handleCancel} onCancel={() => setCancelModal({ open: false, reg: null })} />
    </div>
  );
};

export default MyRegistrations;
