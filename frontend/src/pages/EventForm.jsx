import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { eventsAPI } from '../services/api';
import { toast } from 'react-toastify';
import { HiOutlineCalendar } from 'react-icons/hi';

const EventForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [form, setForm] = useState({ title: '', description: '', date: '', location: '', image: '', capacity: '' });

  useEffect(() => {
    if (isEdit) {
      const fetchEvent = async () => {
        try {
          const res = await eventsAPI.getById(id);
          const e = res.data;
          setForm({ title: e.title, description: e.description, date: new Date(e.date).toISOString().slice(0, 16), location: e.location, image: e.image || '', capacity: e.capacity || '' });
        } catch { toast.error('Failed to load event'); navigate('/admin/events'); } finally { setFetching(false); }
      };
      fetchEvent();
    }
  }, [id, navigate, isEdit]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.date || !form.location) { toast.error('Please fill all required fields'); return; }
    setLoading(true);
    try {
      const data = { ...form, capacity: form.capacity ? parseInt(form.capacity) : 0 };
      if (isEdit) { await eventsAPI.update(id, data); toast.success('Event updated!'); }
      else { await eventsAPI.create(data); toast.success('Event created!'); }
      navigate('/admin/events');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); } finally { setLoading(false); }
  };

  if (fetching) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-10 h-10 border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
              {isEdit ? 'Edit Event' : 'Create New Event'}
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {isEdit ? 'Update the details for this event.' : 'Fill out the form below to create a new event.'}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6 space-y-6">
            
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Event Title <span className="text-red-500">*</span>
              </label>
              <input type="text" name="title" id="title" required value={form.title} onChange={handleChange} placeholder="Annual Tech Symposium"
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea name="description" id="description" rows={4} required value={form.description} onChange={handleChange} placeholder="Provide details about the event..."
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-none" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date & Time <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiOutlineCalendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input type="datetime-local" name="date" id="date" required value={form.date} onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location <span className="text-red-500">*</span>
                </label>
                <input type="text" name="location" id="location" required value={form.location} onChange={handleChange} placeholder="Main Auditorium"
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cover Image URL
                </label>
                <input type="url" name="image" id="image" value={form.image} onChange={handleChange} placeholder="https://example.com/image.jpg"
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              
              <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Capacity <span className="font-normal text-gray-500">(0 for unlimited)</span>
                </label>
                <input type="number" name="capacity" id="capacity" min="0" value={form.capacity} onChange={handleChange} placeholder="0"
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
            </div>

            {form.image && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image Preview</label>
                <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 h-48 w-full max-w-sm">
                  <img src={form.image} alt="Event Preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
              </div>
            )}

            <div className="pt-5 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button type="button" onClick={() => navigate('/admin/events')} 
                className="bg-white dark:bg-gray-800 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={loading} 
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors">
                {loading ? 'Saving...' : isEdit ? 'Update Event' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventForm;
