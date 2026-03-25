import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { HiOutlineAcademicCap, HiOutlineSun, HiOutlineMoon, HiOutlineMenu, HiOutlineX, HiOutlineLogout } from 'react-icons/hi';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const navLinkClass = (path) =>
    `relative px-4 py-2 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 ${
      isActive(path)
        ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 shadow-sm'
        : 'text-surface-500 hover:text-surface-900 hover:bg-surface-100/80 dark:text-surface-400 dark:hover:text-surface-100 dark:hover:bg-surface-800/80'
    }`;

  const adminLinks = [
    { path: '/admin', label: '📊 Dashboard' },
    { path: '/admin/events', label: '📅 Manage Events' },
  ];

  const studentLinks = [
    { path: '/student', label: '🏠 Dashboard' },
    { path: '/events', label: '🎪 Browse Events' },
    { path: '/student/registrations', label: '🎟️ My Registrations' },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <nav className={`sticky top-0 z-50 glass transition-all duration-500 ${scrolled ? 'shadow-lg shadow-surface-900/5 dark:shadow-surface-900/30' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[4.5rem]">
          {/* Logo */}
          <Link to={isAdmin ? '/admin' : user ? '/student' : '/login'} className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-all duration-500 group-hover:scale-105">
                <HiOutlineAcademicCap className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-500" />
            </div>
            <span className="text-xl font-extrabold gradient-text hidden sm:block tracking-tight">CampusEvents</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {user && links.map((link) => (
              <Link key={link.path} to={link.path} className={navLinkClass(link.path)}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            <button
              onClick={() => setDark(!dark)}
              className="relative p-2.5 rounded-xl text-surface-500 hover:text-surface-700 hover:bg-surface-100 dark:text-surface-400 dark:hover:text-surface-200 dark:hover:bg-surface-800 transition-all duration-300"
              aria-label="Toggle theme"
            >
              <div className="relative w-5 h-5">
                {dark ? <HiOutlineSun className="w-5 h-5 absolute inset-0 animate-fade-in" /> : <HiOutlineMoon className="w-5 h-5 absolute inset-0 animate-fade-in" />}
              </div>
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                {/* User avatar */}
                <div className="hidden sm:flex items-center gap-3 pl-3 pr-4 py-1.5 rounded-2xl bg-surface-100/80 dark:bg-surface-800/80 border border-surface-200/60 dark:border-surface-700/60">
                  <div className="w-9 h-9 bg-gradient-to-br from-primary-400 via-primary-500 to-accent-500 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-md shadow-primary-500/20">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-sm leading-tight">
                    <p className="font-bold text-surface-900 dark:text-surface-100">{user.name}</p>
                    <p className="text-xs text-surface-500 dark:text-surface-400 capitalize font-medium">{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 hover:bg-red-100 dark:hover:bg-red-950/80 border border-red-200/60 dark:border-red-900/60 rounded-xl transition-all duration-300 hover:shadow-md hover:shadow-red-500/10"
                >
                  <HiOutlineLogout className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-5 py-2.5 text-sm font-bold text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white hover:bg-surface-100 dark:hover:bg-surface-800 rounded-xl transition-all duration-300">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm px-5 py-2.5">
                  <span>Get Started</span>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2.5 rounded-xl text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all"
            >
              {mobileOpen ? <HiOutlineX className="w-5 h-5" /> : <HiOutlineMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-1 animate-slide-down">
            {user && links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`block ${navLinkClass(link.path)}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
