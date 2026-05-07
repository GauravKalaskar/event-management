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

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const navLinkClass = (path) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive(path)
        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800'
    }`;

  const mobileNavLinkClass = (path) =>
    `block px-3 py-2 rounded-md text-base font-medium ${
      isActive(path)
        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800'
    }`;

  const adminLinks = [
    { path: '/admin', label: 'Dashboard' },
    { path: '/admin/events', label: 'Manage Events' },
  ];

  const studentLinks = [
    { path: '/student', label: 'Dashboard' },
    { path: '/events', label: 'Browse Events' },
    { path: '/student/registrations', label: 'My Registrations' },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to={isAdmin ? '/admin' : user ? '/student' : '/login'} className="flex items-center gap-2">
                <HiOutlineAcademicCap className="h-8 w-8 text-blue-600 dark:text-blue-500" />
                <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight hidden sm:block">CampusEvents</span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
              {user && links.map((link) => (
                <Link key={link.path} to={link.path} className={navLinkClass(link.path)}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            
            {/* Dark mode toggle */}
            <button
              onClick={() => setDark(!dark)}
              className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span className="sr-only">Toggle theme</span>
              {dark ? <HiOutlineSun className="h-5 w-5" /> : <HiOutlineMoon className="h-5 w-5" />}
            </button>

            {user ? (
              <div className="hidden sm:flex items-center gap-4 ml-4">
                <div className="text-sm text-right">
                  <div className="font-medium text-gray-900 dark:text-white leading-tight">{user.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 capitalize leading-tight">{user.role}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 dark:text-red-400 dark:bg-red-900/30 dark:hover:bg-red-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  <HiOutlineLogout className="mr-2 h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link to="/login" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                <Link to="/register" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden ml-2">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <span className="sr-only">Open main menu</span>
                {mobileOpen ? <HiOutlineX className="block h-6 w-6" /> : <HiOutlineMenu className="block h-6 w-6" />}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user && links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={mobileNavLinkClass(link.path)}
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className={mobileNavLinkClass('/login')}>Login</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className={mobileNavLinkClass('/register')}>Get Started</Link>
              </>
            )}
          </div>
          {user && (
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium leading-none text-gray-800 dark:text-white">{user.name}</div>
                  <div className="text-sm font-medium leading-none text-gray-500 dark:text-gray-400 mt-1">{user.email}</div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-800 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
