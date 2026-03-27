import { HiOutlineAcademicCap, HiOutlineHeart } from 'react-icons/hi';

const Footer = () => {
  return (
    <footer className="border-t border-surface-200 dark:border-surface-800 bg-white/80 dark:bg-surface-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-md shadow-primary-500/20">
              <HiOutlineAcademicCap className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold gradient-text">CampusEvents</span>
          </div>

          {/* Copyright */}
          <p className="text-sm text-surface-400 dark:text-surface-500 flex items-center gap-1">
            Made with <HiOutlineHeart className="w-3.5 h-3.5 text-red-400" /> for college communities
          </p>

          {/* Year */}
          <p className="text-xs text-surface-400 dark:text-surface-500 font-medium">
            © {new Date().getFullYear()} CampusEvents
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
