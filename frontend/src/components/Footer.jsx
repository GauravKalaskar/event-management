import { HiOutlineAcademicCap, HiHeart } from 'react-icons/hi';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start items-center md:order-1">
            <HiOutlineAcademicCap className="h-6 w-6 text-blue-600 dark:text-blue-500 mr-2" />
            <span className="text-gray-900 dark:text-white font-bold text-lg">CampusEvents</span>
          </div>
          <div className="mt-4 md:mt-0 md:order-2">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} CampusEvents. All rights reserved.
            </p>
          </div>
          <div className="mt-4 md:mt-0 md:order-3">
             <p className="text-center text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center">
              Made with <HiHeart className="h-4 w-4 mx-1 text-red-500" /> for students
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
