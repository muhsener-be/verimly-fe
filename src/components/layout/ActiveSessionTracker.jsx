import React from 'react';
import { useState } from 'react';

import {Timer, Pause, Play, Square } from 'lucide-react'
import { useAuth } from '../../contexts/AuthProvider';


const ActiveSessionTracker = () => {
  // Gerekli bilgileri doğrudan context'ten alıyoruz
   const { 
    activeSession, 
    sessionElapsedTime,
    pauseSession,
    resumeSession,
    finishSession 
  } = useAuth();

const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!activeSession) return null;


  const isPaused = activeSession.status === 'PAUSED';

  const handleTogglePause = () => {
    isPaused ? resumeSession() : pauseSession();
    setIsMenuOpen(false);
  };

    const handleFinish = () => {
    finishSession();
    setIsMenuOpen(false);
  };


  return (
<div className="relative">
      {/* Ana Buton */}
      <button 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${
          isPaused 
          ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' 
          : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
        }`}
      >
        {isPaused ? <Pause size={16} /> : <Timer size={16} />}
        <span>{activeSession.name}</span>
        <span className="font-mono bg-white px-1.5 rounded">{sessionElapsedTime}</span>
      </button>

      {/* Açılır Menü */}
      {isMenuOpen && (
        <div className="absolute top-full mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
          <ul className="py-1">
            <li>
              <button onClick={handleTogglePause} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                {isPaused ? <Play size={16}/> : <Pause size={16}/>}
                {isPaused ? 'Devam Et' : 'Duraklat'}
              </button>
            </li>
            <li>
              <button onClick={handleFinish} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                <Square size={16} />
                Seansı Bitir
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ActiveSessionTracker;