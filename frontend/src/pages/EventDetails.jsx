import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { eventsAPI, registrationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { HiOutlineCalendar, HiOutlineLocationMarker, HiOutlineUsers, HiOutlineArrowLeft, HiOutlineUser, HiOutlineTicket } from 'react-icons/hi';

const EventDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventRes = await eventsAPI.getById(id);
        setEvent(eventRes.data);
        if (user) {
          const regsRes = await registrationsAPI.getMine();
          setIsRegistered(regsRes.data.some(r => r.eventId?._id === id));
        }
      } catch { toast.error('Failed to load event'); } finally { setLoading(false); }
    };
    fetchData();
  }, [id, user]);

  const handleRegister = async () => {
    setRegistering(true);
    try {
      await registrationsAPI.register(id);
      toast.success('Successfully registered! 🎉');
      setIsRegistered(true);
      setEvent(prev => ({ ...prev, registrationCount: (prev.registrationCount || 0) + 1 }));
    } catch (err) { toast.error(err.response?.data?.message || 'Registration failed'); } finally { setRegistering(false); }
  };

  const formatDate = (d) => new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(d));

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950">
      <div className="w-14 h-14 border-4 border-primary-200 dark:border-primary-900 border-t-primary-600 rounded-full animate-spin" />
    </div>
  );

  if (!event) return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950">
      <p className="text-surface-500 font-medium">Event not found.</p>
    </div>
  );

  const isPast = new Date(event.date) < new Date();
  const isFull = event.capacity > 0 && event.registrationCount >= event.capacity;
  const capacityPercent = event.capacity > 0 ? Math.min(100, ((event.registrationCount || 0) / event.capacity) * 100) : 0;

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 hero-pattern">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/events" className="inline-flex items-center gap-2 text-sm text-surface-500 hover:text-primary-600 dark:text-surface-400 dark:hover:text-primary-400 mb-8 font-semibold transition-colors group">
          <HiOutlineArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Events
        </Link>

        <div className="animate-fade-in-up">
          {/* Hero Image */}
          {event.image && (
            <div className="rounded-3xl overflow-hidden mb-8 shadow-2xl shadow-surface-900/10 dark:shadow-surface-900/50">
              <img src={event.image} alt={event.title} className="w-full h-72 sm:h-[24rem] object-cover" />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {isPast && <span className="px-3 py-1.5 text-xs font-bold bg-surface-200 dark:bg-surface-700 text-surface-500 rounded-full">Past Event</span>}
                  {isFull && !isPast && <span className="px-3 py-1.5 text-xs font-bold bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-full">Sold Out</span>}
                  {isRegistered && <span className="px-3 py-1.5 text-xs font-bold bg-green-100 dark:bg-green-950/50 text-green-600 dark:text-green-400 rounded-full">✓ You're registered</span>}
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-surface-900 dark:text-white tracking-tight leading-tight">
                  {event.title}
                </h1>
              </div>

              <div className="card p-7">
                <h3 className="text-sm font-bold text-surface-400 uppercase tracking-widest mb-4">About this Event</h3>
                <p className="text-surface-600 dark:text-surface-300 leading-relaxed whitespace-pre-wrap text-base">
                  {event.description}
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              <div className="card p-6 space-y-5">
                {[
                  { icon: HiOutlineCalendar, bg: 'bg-primary-50 dark:bg-primary-950/40', color: 'text-primary-600 dark:text-primary-400', label: 'Date & Time', value: formatDate(event.date) },
                  { icon: HiOutlineLocationMarker, bg: 'bg-accent-50 dark:bg-accent-950/40', color: 'text-accent-600 dark:text-accent-400', label: 'Location', value: event.location },
                  ...(event.createdBy ? [{ icon: HiOutlineUser, bg: 'bg-purple-50 dark:bg-purple-950/40', color: 'text-purple-600 dark:text-purple-400', label: 'Organized by', value: event.createdBy.name }] : []),
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3.5">
                    <div className={`w-11 h-11 ${item.bg} rounded-xl flex items-center justify-center shrink-0`}>
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-surface-400 uppercase tracking-wider">{item.label}</p>
                      <p className="text-sm font-bold text-surface-900 dark:text-surface-100 mt-0.5">{item.value}</p>
                    </div>
                  </div>
                ))}

                {/* Capacity */}
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 bg-green-50 dark:bg-green-950/40 rounded-xl flex items-center justify-center shrink-0">
                    <HiOutlineUsers className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-surface-400 uppercase tracking-wider">Capacity</p>
                    <p className="text-sm font-bold text-surface-900 dark:text-surface-100 mt-0.5">
                      {event.registrationCount || 0} / {event.capacity > 0 ? event.capacity : '∞'}
                    </p>
                    {event.capacity > 0 && (
                      <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2 mt-2">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-400 h-2 rounded-full transition-all duration-700" style={{ width: `${capacityPercent}%` }} />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Register Button */}
              {user && !isPast && (
                <button
                  onClick={handleRegister}
                  disabled={isRegistered || isFull || registering}
                  className={`w-full py-4 px-6 font-bold rounded-2xl transition-all duration-300 text-center text-base ${
                    isRegistered
                      ? 'bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 border-2 border-green-200 dark:border-green-900'
                      : isFull
                      ? 'bg-surface-100 dark:bg-surface-800 text-surface-400 cursor-not-allowed'
                      : 'btn-primary animate-pulse-glow'
                  }`}
                >
                  {registering ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Registering...
                    </span>
                  ) : isRegistered ? '✓ You are Registered' : isFull ? 'Event is Full' : (
                    <span className="flex items-center justify-center gap-2"><HiOutlineTicket className="w-5 h-5" /> Register Now</span>
                  )}
                </button>
              )}

              {!user && (
                <Link to="/login" className="block w-full btn-primary text-center py-4 text-base">
                  <span>Login to Register</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
