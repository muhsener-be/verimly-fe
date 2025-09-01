import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiStartSession, apiChangeSessionStatus  } from '../services/api';
import { parseDurationToSeconds, formatSecondsToTime } from '../utils/formatters';
import { useCallback } from 'react';
import { getMe } from '../services/api';

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [activeSession, setActiveSession] = useState(null);
  const [sessionElapsedTime, setSessionElapsedTime] = useState('00:00');





  useEffect(() => {
    let interval;
    if (activeSession && activeSession.status === 'RUNNING') {
      interval = setInterval(() => {
        const startedAtMs = new Date(activeSession.started_at).getTime();
        const totalPauseSeconds = parseDurationToSeconds(activeSession.total_pause);
        const nowMs = Date.now();
        const elapsedSeconds = Math.floor((nowMs - startedAtMs) / 1000) - totalPauseSeconds;
        setSessionElapsedTime(formatSecondsToTime(elapsedSeconds));
      }, 1000);
    } else if (activeSession && (activeSession.status === 'PAUSED' || activeSession.status === 'FINISHED')) {
      const totalSeconds = parseDurationToSeconds(activeSession.total_time);
      setSessionElapsedTime(formatSecondsToTime(totalSeconds));
    }
    return () => clearInterval(interval);
  }, [activeSession]);




  const initializeSession = useCallback((sessionData) => {
    // Backend'den gelen verinin tutarlı olduğundan emin olalım
    if (sessionData && !sessionData.total_pause) {
      sessionData.total_pause = 'PT0S';
    }
    setActiveSession(sessionData);
  }, []);




   const startSession = async (taskId, sessionName) => {
     try {
       // ÖNEMLİ: Backend'den gelen cevabın tam seans bilgisini içermesi gerekiyor.
       // Şimdilik gelen cevabı olduğu gibi state'e atıyoruz.
       // Eğer cevapta total_pause yoksa, varsayılan olarak 'PT0S' ekleyebiliriz.
       const response = await apiStartSession({ task_id: taskId, name: sessionName });
       const sessionData = response.data;
       if (!sessionData.total_pause) {
         sessionData.total_pause = 'PT0S';
       }
       setActiveSession(sessionData);
       return sessionData;
     } catch (error) {
       console.error("Seans başlatma hatası:", error);
       throw error;
     }
   };


  const pauseSession = async () => {
    if (activeSession && activeSession.status === 'RUNNING') {
      try {
        const response = await apiChangeSessionStatus(activeSession.id, 'PAUSE');
        setActiveSession(response.data); // State'i backend'den gelen güncel veriyle değiştir
      } catch (error) {
        console.error("Seans duraklatılamadı:", error);
      }
    }
  };

  const resumeSession = async () => {
    if (activeSession && activeSession.status === 'PAUSED') {
      try {
        const response = await apiChangeSessionStatus(activeSession.id, 'RESUME');
        setActiveSession(response.data);
      } catch (error) {
        console.error("Seansa devam edilemedi:", error);
      }
    }
  };


  const finishSession = async () => {
    if (activeSession) {
      try {
        await apiChangeSessionStatus(activeSession.id, 'FINISH');
        setActiveSession(null); // Biten seans artık aktif değildir, state'i temizle
        setSessionElapsedTime(formatSecondsToTime(0));
        // TODO: Dashboard'daki görev detaylarını yenilemek için bir mekanizma eklenebilir.
      } catch (error) {
        console.error("Seans bitirilemedi:", error);
      }
    }
  };



useEffect(() => {
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = '';

        if (activeSession) {
            // 1. "PAUSE" isteğini her durumda gönderiyoruz.
            const url = `${process.env.REACT_APP_API_BASE_URL}/api/v1/sessions/${activeSession.id}/status`;
            const payload = { action: 'PAUSE' };
            const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
            navigator.sendBeacon(url, blob);

            // 2. Eğer kullanıcı sayfada kalırsa, bu PAUSE işlemini geri alacak
            //    olan zamanlayıcıyı kuruyoruz.
            setTimeout(() => {
                // Bu kod sadece kullanıcı sayfadan ayrılmazsa çalışır.
                console.log("User stayed on the page, resuming session...");
                resumeSession();
            }, 1000); // 1 saniye sonra
        }
    };

    if (activeSession && activeSession.status === 'RUNNING') {
        window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
    };
}, [activeSession, resumeSession]);



  const value = {
    activeSession,
    sessionElapsedTime,
    startSession,
    pauseSession,
    resumeSession,
    finishSession,
    initializeSession
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);