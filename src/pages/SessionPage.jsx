import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, X } from 'lucide-react';

// Saat rakamları için stil
const timeSegmentStyle = "text-8xl md:text-9xl font-bold text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-900 px-4 py-2 rounded-lg shadow-inner";
const colonStyle = "text-8xl md:text-9xl font-bold text-gray-400 dark:text-gray-600 animate-pulse";

const FullScreenClock = () => {
  const { sessionElapsedTime } = useAuth();
  const [time, setTime] = useState({ hours: '00', minutes: '00', seconds: '00' });

  useEffect(() => {
    const parts = sessionElapsedTime.split(':');
    if (parts.length === 3) {
      setTime({ hours: parts[0], minutes: parts[1], seconds: parts[2] });
    } else if (parts.length === 2) {
      setTime({ hours: '00', minutes: parts[0], seconds: parts[1] });
    }
  }, [sessionElapsedTime]);

  return (
    <div className="flex items-center justify-center gap-4">
      <div className={timeSegmentStyle}>{time.hours}</div>
      <div className={colonStyle}>:</div>
      <div className={timeSegmentStyle}>{time.minutes}</div>
      <div className={colonStyle}>:</div>
      <div className="text-4xl md:text-5xl font-semibold text-gray-500 dark:text-gray-400 self-end mb-3">
        {time.seconds}
      </div>
    </div>
  );
};

const SessionPage = () => {
  const { activeSession } = useAuth();
  const navigate = useNavigate();
  
  // ThemeProvider'ı henüz tam entegre etmediğimiz için basit bir toggle yapalım
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    // Aktif seans yoksa dashboard'a geri yönlendir
    if (!activeSession) {
      navigate('/dashboard');
    }
  }, [activeSession, navigate]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.remove(theme);
    document.documentElement.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
  };
  
  if (!activeSession) {
    return null; // Yönlendirme gerçekleşene kadar hiçbir şey gösterme
  }

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen transition-colors duration-500 ${theme === 'dark' ? 'bg-black' : 'bg-gray-50'}`}>
        <div className="absolute top-4 right-4 flex gap-4">
             <button onClick={toggleTheme} className="p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
            </button>
            <button onClick={() => navigate('/dashboard')} className="p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                <X size={24} />
            </button>
        </div>

        <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-600 dark:text-gray-300 mb-8">{activeSession.name}</h1>
            <FullScreenClock />
        </div>
    </div>
  );
};

export default SessionPage;