import React, { useContext, useState, useEffect, useRef } from 'react';
import { ThemeContext } from '../App';
import * as Lucide from 'lucide-react';
import StartMenu from './StartMenu';

const Taskbar = ({ openWindows, onFocus, activeWindow, onOpen, settings }) => {
  const { theme, toggleTheme, colors } = useContext(ThemeContext);
  const [time, setTime] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000 * 30); // Update every 30 seconds
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const activeStartButtonBg = theme === 'dark' ? colors.dark.accent + '80' : colors.light.accent + '80';
  const initials = settings?.fullName?.split(' ').map(n => n[0]).join('').substring(0, 2) || 'OS';

  return (
    <footer className="h-12 bg-slate-200/70 dark:bg-slate-900/50 backdrop-blur-lg flex items-center justify-between px-2 gap-2 border-t border-slate-300/50 dark:border-slate-700/50 w-full flex-shrink-0 z-[100000]">
      <div className="flex items-center gap-2">
        <div ref={menuRef} className="relative">
             <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Start Menu"
                className={`p-2 rounded-md transition-colors w-10 h-10 flex items-center justify-center ${!isMenuOpen && 'hover:bg-black/10 dark:hover:bg-white/10'}`}
                style={{ backgroundColor: isMenuOpen ? activeStartButtonBg : 'transparent' }}
             >
                <p className="text-lg font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">{initials}</p>
            </button>
            {isMenuOpen && <StartMenu onOpen={onOpen} onClose={() => setIsMenuOpen(false)} />}
        </div>

        <div className="h-8 border-l border-slate-400/50 dark:border-slate-600/50"></div>
        
        <div className="flex items-center gap-1">
            {openWindows.map(win => {
                const Icon = Lucide[win.icon] || Lucide.Folder;
                const isActive = win.id === activeWindow;
                return (
                    <button 
                        key={win.id}
                        onClick={() => onFocus(win.id)}
                        className={`px-3 py-1.5 flex items-center gap-2 rounded-md text-sm transition-colors ${isActive ? 'bg-black/10 dark:bg-white/10' : 'hover:bg-black/10 dark:hover:bg-white/10'}`}
                        title={win.title}
                    >
                       <Icon size={16} /> 
                    </button>
                )
            })}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-xs text-center text-slate-700 dark:text-slate-300">
            <div>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            <div>{time.toLocaleDateString([], { month: '2-digit', day: '2-digit', year: 'numeric' })}</div>
        </div>
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
        >
          {theme === 'dark' ? <Lucide.Sun size={18} /> : <Lucide.Moon size={18} />}
        </button>
      </div>
    </footer>
  );
};

export default Taskbar;
