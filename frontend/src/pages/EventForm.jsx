import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { eventsAPI } from '../services/api';
import { toast } from 'react-toastify';
import { HiOutlineSparkles } from 'react-icons/hi';

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
  }, [id]);

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
    <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950">
      <div className="w-14 h-14 border-4 border-primary-200 dark:border-primary-900 border-t-primary-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 hero-pattern">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-2">
            <HiOutlineSparkles className="w-5 h-5 text-primary-500" />
            <span className="text-sm font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest">{isEdit ? 'Edit' : 'Create'}</span>
          </div>
          <h1 className="text-4xl font-extrabold text-surface-900 dark:text-white tracking-tight">{isEdit ? 'Edit Event' : 'Create New Event'}</h1>
          <p className="text-surface-500 dark:text-surface-400 mt-2">{isEdit ? 'Update the event details below' : 'Fill in the details to create a new event'}</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-8 space-y-5 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div>
            <label className="block text-sm font-bold text-surface-700 dark:text-surface-300 mb-2">Title <span className="text-red-500">*</span></label>
            <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Event title"
              className="w-full px-4 py-3.5 bg-surface-50 dark:bg-surface-800 border-2 border-surface-200 dark:border-surface-700 rounded-xl text-surface-900 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all" />
          </div>

          <div>
            <label className="block text-sm font-bold text-surface-700 dark:text-surface-300 mb-2">Description <span className="text-red-500">*</span></label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Describe the event..."
              className="w-full px-4 py-3.5 bg-surface-50 dark:bg-surface-800 border-2 border-surface-200 dark:border-surface-700 rounded-xl text-surface-900 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-surface-700 dark:text-surface-300 mb-2">Date & Time <span className="text-red-500">*</span></label>
              <input type="datetime-local" name="date" value={form.date} onChange={handleChange}
                className="w-full px-4 py-3.5 bg-surface-50 dark:bg-surface-800 border-2 border-surface-200 dark:border-surface-700 rounded-xl text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-bold text-surface-700 dark:text-surface-300 mb-2">Location <span className="text-red-500">*</span></label>
              <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="Event venue"
                className="w-full px-4 py-3.5 bg-surface-50 dark:bg-surface-800 border-2 border-surface-200 dark:border-surface-700 rounded-xl text-surface-900 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-surface-700 dark:text-surface-300 mb-2">Image URL</label>
              <input type="url" name="image" value={form.image} onChange={handleChange} placeholder="https://..."
                className="w-full px-4 py-3.5 bg-surface-50 dark:bg-surface-800 border-2 border-surface-200 dark:border-surface-700 rounded-xl text-surface-900 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-bold text-surface-700 dark:text-surface-300 mb-2">Capacity <span className="text-surface-400 text-xs">(0 = unlimited)</span></label>
              <input type="number" name="capacity" value={form.capacity} onChange={handleChange} placeholder="0" min="0"
                className="w-full px-4 py-3.5 bg-surface-50 dark:bg-surface-800 border-2 border-surface-200 dark:border-surface-700 rounded-xl text-surface-900 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all" />
            </div>
          </div>

          {form.image && (
            <div className="rounded-2xl overflow-hidden border-2 border-surface-200 dark:border-surface-700 shadow-lg">
              <img src={form.image} alt="Preview" className="w-full h-48 object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => navigate('/admin/events')} className="px-6 py-3.5 text-sm font-bold text-surface-600 dark:text-surface-300 bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 rounded-xl transition-all">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 btn-primary py-3.5 text-base flex items-center justify-center gap-2">
              {loading ? (
                <span className="flex items-center gap-2"><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</span>
              ) : <span>{isEdit ? 'Update Event' : 'Create Event'}</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
