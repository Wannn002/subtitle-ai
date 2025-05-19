import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Subtitles, Upload, Edit, Download } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home', icon: <Subtitles className="w-5 h-5" /> },
    { path: '/upload', label: 'Upload', icon: <Upload className="w-5 h-5" /> },
    { path: '/editor', label: 'Editor', icon: <Edit className="w-5 h-5" /> },
    { path: '/export', label: 'Export', icon: <Download className="w-5 h-5" /> }
  ];

  return (
    <header className="bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <Link to="/" className="flex items-center text-blue-500 mb-4 md:mb-0">
            <Subtitles className="w-8 h-8 mr-2" />
            <span className="text-2xl font-bold">SubtitleAI</span>
          </Link>
          
          <nav>
            <ul className="flex space-x-1 sm:space-x-4">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    className={`flex items-center px-2 sm:px-3 py-2 rounded-md text-sm transition-colors duration-200 hover:bg-gray-700 hover:text-blue-400 ${
                      location.pathname === item.path 
                        ? 'bg-gray-700 text-blue-400' 
                        : 'text-gray-300'
                    }`}
                  >
                    <span className="mr-1">{item.icon}</span>
                    <span className="hidden sm:inline">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;