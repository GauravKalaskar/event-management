import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { HiOutlineAcademicCap, HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlineArrowRight } from 'react-icons/hi';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { toast.error('Please fill in all fields'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      const user = await register(form.name, form.email, form.password, form.role);
      toast.success(`Welcome, ${user.name}!`);
      navigate(user.role === 'admin' ? '/admin' : '/student');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex hero-pattern">
      {/* Left - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900">
        <div className="absolute top-20 left-20 w-72 h-72 bg-accent-500/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        <div className="relative z-10 flex flex-col justify-center items-center px-12 lg:px-20 text-white w-full h-full text-center lg:text-left lg:items-start">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center mb-10 border border-white/20 shadow-2xl">
            <HiOutlineAcademicCap className="w-10 h-10" />
          </div>
          <h1 className="text-5xl font-extrabold leading-tight mb-6">
            Start Your<br />Campus<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-pink-300">Journey Today</span>
          </h1>
          <p className="text-lg text-primary-200/80 leading-relaxed max-w-md">
            Create an account and get instant access to all college events, workshops, and cultural activities.
          </p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 bg-white dark:bg-surface-950">
        <div className="w-full max-w-[420px]">
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl shadow-xl shadow-primary-500/25 mb-4">
              <HiOutlineAcademicCap className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-surface-900 dark:text-white tracking-tight">Create Account</h2>
            <p className="text-surface-500 dark:text-surface-400 mt-2">Join CampusEvents today for free</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-surface-700 dark:text-surface-300 mb-2">Full Name</label>
              <div className="relative">
                <HiOutlineUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" className="input" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-surface-700 dark:text-surface-300 mb-2">Email</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@college.edu" className="input" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-bold text-surface-700 dark:text-surface-300 mb-2">Password</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                  <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Min 6 chars" className="input" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-surface-700 dark:text-surface-300 mb-2">Confirm</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                  <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" className="input" />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary py-3.5 text-base flex items-center justify-center gap-2 mt-6">
              {loading ? (
                <span className="flex items-center gap-2"><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating...</span>
              ) : (
                <><span>Create Account</span><HiOutlineArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-surface-500 dark:text-surface-400 mt-6">
            Already have an account? <Link to="/login" className="text-primary-600 dark:text-primary-400 font-bold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
