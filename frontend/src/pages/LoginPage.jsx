import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { HiOutlineAcademicCap, HiOutlineMail, HiOutlineLockClosed, HiOutlineArrowRight } from 'react-icons/hi';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === 'admin' ? '/admin' : '/student');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex hero-pattern">
      {/* Left - Decorative Sidebar */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900">
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-accent-500/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center px-12 lg:px-20 text-white w-full h-full text-center lg:text-left lg:items-start">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center mb-10 border border-white/20 shadow-2xl">
            <HiOutlineAcademicCap className="w-10 h-10" />
          </div>
          <h1 className="text-5xl font-extrabold leading-tight mb-6">
            Discover &<br />Join Amazing<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-pink-300">College Events</span>
          </h1>
          <p className="text-lg text-primary-200/80 leading-relaxed max-w-md">
            Browse upcoming events, register instantly, and never miss out on what's happening on campus.
          </p>

          {/* Stats */}
          <div className="flex gap-12 mt-16 pb-10">
            {[{ n: '500+', l: 'Students' }, { n: '50+', l: 'Events' }, { n: '20+', l: 'Categories' }].map((s) => (
              <div key={s.l} className="text-center lg:text-left">
                <p className="text-4xl font-black tracking-tight">{s.n}</p>
                <p className="text-sm text-primary-200 mt-2 font-semibold uppercase tracking-wider">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white dark:bg-surface-950">
        <div className="w-full max-w-[420px]">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl shadow-xl shadow-primary-500/25 mb-4">
              <HiOutlineAcademicCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold gradient-text">CampusEvents</h1>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-surface-900 dark:text-white tracking-tight">Welcome back</h2>
            <p className="text-surface-500 dark:text-surface-400 mt-2 text-base">Sign in to your account to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-surface-700 dark:text-surface-300 mb-2">Email Address</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@college.edu"
                  className="input"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-surface-700 dark:text-surface-300 mb-2">Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 text-base flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <>
                  <span>Sign In</span>
                  <HiOutlineArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-surface-500 dark:text-surface-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 dark:text-primary-400 font-bold hover:underline">
              Create one for free
            </Link>
          </p>


        </div>
      </div>
    </div>
  );
};

export default LoginPage;
