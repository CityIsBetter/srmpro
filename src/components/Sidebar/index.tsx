// components/Sidebar.tsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaBook, FaCalendar, FaChartBar, FaBars, FaTimes, FaSun, FaMoon } from 'react-icons/fa';
import { MdLogout } from "react-icons/md";
import { motion } from 'framer-motion';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [theme, setTheme] = useState('light');
  const pathname = usePathname();

  // Retrieve theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  // Toggle sidebar collapsed state (no persistence)
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Toggle theme between light and dark and save to localStorage
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  return (
    <motion.div
      initial={{ width: '250px' }}
      animate={{ width: isCollapsed ? '73px' : '300px' }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="h-screen bg-white text-gray-800 dark:bg-gray-900 dark:text-white shadow-lg flex flex-col justify-between overflow-hidden"
    >
      <div className='flex flex-col'>
        <div className={`flex items-center justify-between ${isCollapsed ? 'mt-4 ml-2 p-0' : 'p-4'}`}>
          <h1 className={`text-2xl font-bold ${isCollapsed ? 'hidden' : 'block'} ml-4`}>
            SRMPRO
          </h1>
          <button
            onClick={toggleSidebar}
            className={`text-2xl ${isCollapsed ? 'p-4' : 'p-2'} hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md`}
          >
            {isCollapsed ? <FaBars /> : <FaTimes />}
          </button>
        </div>

        <nav className="flex flex-col mt-4 flex-grow">
          <Link
            href="/home"
            className={`flex items-center p-4 hover:bg-gray-200 dark:hover:bg-gray-800 mx-2 my-1 hover:scale-95 rounded-xl transition ${pathname === '/home' ? 'bg-gray-300 dark:bg-gray-700' : ''}`}
          >
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: isCollapsed ? 1 : 1 }}
              transition={{ duration: 0.3 }}
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'}`}
            >
              <FaHome className={`text-2xl ${isCollapsed ? 'm-0' : 'mr-3'}`} />
            </motion.div>
            <span className={`whitespace-nowrap transition-opacity ${isCollapsed ? 'opacity-0' : 'ml-2 opacity-100'}`}>Home</span>
          </Link>

          <Link
            href="/attendance"
            className={`flex items-center p-4 hover:bg-gray-200 dark:hover:bg-gray-800 mx-2 my-1 hover:scale-95 rounded-xl transition ${pathname === '/attendance' ? 'bg-gray-300 dark:bg-gray-700' : ''}`}
          >
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: isCollapsed ? 1 : 1 }}
              transition={{ duration: 0.3 }}
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'}`}
            >
              <FaBook className={`text-2xl ${isCollapsed ? '' : 'mr-3'}`} />
            </motion.div>
            <span className={`ml-2 whitespace-nowrap transition-opacity ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>Attendance</span>
          </Link>

          <Link
            href="/marks"
            className={`flex items-center p-4 hover:bg-gray-200 dark:hover:bg-gray-800 mx-2 my-1 hover:scale-95 rounded-xl transition ${pathname === '/marks' ? 'bg-gray-300 dark:bg-gray-700' : ''}`}
          >
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: isCollapsed ? 1 : 1 }}
              transition={{ duration: 0.3 }}
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'}`}
            >
              <FaChartBar className={`text-2xl ${isCollapsed ? '' : 'mr-3'}`} />
            </motion.div>
            <span className={`ml-2 whitespace-nowrap transition-opacity ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>Marks</span>
          </Link>

          <Link
            href="/time-table"
            className={`flex items-center p-4 hover:bg-gray-200 dark:hover:bg-gray-800 mx-2 my-1 hover:scale-95 rounded-xl transition ${pathname === '/time-table' ? 'bg-gray-300 dark:bg-gray-700' : ''}`}
          >
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: isCollapsed ? 1 : 1 }}
              transition={{ duration: 0.3 }}
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'}`}
            >
              <FaCalendar className={`text-2xl ${isCollapsed ? '' : 'mr-3'}`} />
            </motion.div>
            <span className={`ml-2 whitespace-nowrap transition-opacity ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>TimeTable</span>
          </Link>
        </nav>
      </div>

      <nav className="flex flex-col">
        <button
          onClick={toggleTheme}
          className="flex items-center p-4 hover:bg-gray-200 dark:hover:bg-gray-800 transition mx-2 my-1 hover:scale-95 rounded-xl"
        >
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: isCollapsed ? 1 : 1 }}
            transition={{ duration: 0.3 }}
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'}`}
          >
            {theme === 'light' ? <FaSun className="text-2xl" /> : <FaMoon className="text-2xl" />}
          </motion.div>
          <span className={`ml-2 whitespace-nowrap transition-opacity ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
            {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
          </span>
        </button>

        <Link
          href="/logout"
          className={`flex items-center p-4 hover:bg-gray-200 dark:hover:bg-gray-800 mx-2 my-1 hover:scale-95 rounded-xl transition text-red-400`}
        >
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: isCollapsed ? 1 : 1 }}
            transition={{ duration: 0.3 }}
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'}`}
          >
            <MdLogout className={`text-2xl ${isCollapsed ? '' : 'mr-3'}`} />
          </motion.div>
          <span className={`ml-2 whitespace-nowrap transition-opacity ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>Logout</span>
        </Link>
      </nav>
    </motion.div>
  );
}
