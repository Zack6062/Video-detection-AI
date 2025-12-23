
import React from 'react';
import { User, AuthView } from '../types';

interface HeaderProps {
  user: User | null;
  onViewChange: (view: AuthView) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onViewChange, onLogout }) => {
  return (
    <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => onViewChange(user ? AuthView.DASHBOARD : AuthView.LOGIN)}
        >
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-xl font-black text-white tracking-tighter uppercase italic">VideoLens</span>
        </div>

        <nav className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right">
                <p className="text-sm font-bold text-white leading-none">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <button
                onClick={onLogout}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-semibold px-4 py-2 rounded-lg border border-gray-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={() => onViewChange(AuthView.LOGIN)}
                className="text-gray-400 hover:text-white font-medium text-sm"
              >
                Log In
              </button>
              <button
                onClick={() => onViewChange(AuthView.SIGNUP)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-5 py-2 rounded-lg transition-transform hover:scale-105 active:scale-95"
              >
                Join Now
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
