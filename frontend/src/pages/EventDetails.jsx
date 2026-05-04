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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-10 h-10 border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );

  if (!event) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <p className="text-gray-500 font-medium">Event not found.</p>
    </div>
  );

  const isPast = new Date(event.date) < new Date();
  const isFull = event.capacity > 0 && event.registrationCount >= event.capacity;
  const capacityPercent = event.capacity > 0 ? Math.min(100, ((event.registrationCount || 0) / event.capacity) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <Link to="/events" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <HiOutlineArrowLeft className="mr-1 h-4 w-4" aria-hidden="true" />
            Back to Events
          </Link>
        </div>

        <div>
          {/* Hero Image */}
          {event.image && (
            <div className="rounded-xl overflow-hidden mb-8 shadow-sm border border-gray-200 dark:border-gray-700">
              <img src={event.image} alt={event.title} className="w-full h-64 sm:h-96 object-cover" />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {isPast && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">Past Event</span>}
                  {isFull && !isPast && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">Sold Out</span>}
                  {isRegistered && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">✓ Registered</span>}
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                  {event.title}
                </h1>
              </div>

              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">About this Event</h3>
                <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                  {event.description}
                </div>
              </div>
            </div>

            {/* Sidebar Details */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-6">
                <div className="flex items-start">
                  <HiOutlineCalendar className="flex-shrink-0 mr-3 h-6 w-6 text-gray-400" aria-hidden="true" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Date & Time</h4>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{formatDate(event.date)}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <HiOutlineLocationMarker className="flex-shrink-0 mr-3 h-6 w-6 text-gray-400" aria-hidden="true" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Location</h4>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{event.location}</p>
                  </div>
                </div>

                {event.createdBy && (
                  <div className="flex items-start">
                    <HiOutlineUser className="flex-shrink-0 mr-3 h-6 w-6 text-gray-400" aria-hidden="true" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">Organized by</h4>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{event.createdBy.name}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start">
                  <HiOutlineUsers className="flex-shrink-0 mr-3 h-6 w-6 text-gray-400" aria-hidden="true" />
                  <div className="w-full">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Capacity</h4>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {event.registrationCount || 0} / {event.capacity > 0 ? event.capacity : 'Unlimited'} Registered
                    </p>
                    {event.capacity > 0 && (
                      <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${capacityPercent}%` }} />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Area */}
              {user && !isPast && (
                <button
                  onClick={handleRegister}
                  disabled={isRegistered || isFull || registering}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                    isRegistered
                      ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                      : isFull
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                  }`}
                >
                  {registering ? (
                    'Registering...'
                  ) : isRegistered ? (
                    '✓ You are Registered'
                  ) : isFull ? (
                    'Event is Full'
                  ) : (
                    <span className="flex items-center"><HiOutlineTicket className="mr-2 h-5 w-5" /> Register Now</span>
                  )}
                </button>
              )}

              {!user && (
                <Link to="/login" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Login to Register
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
