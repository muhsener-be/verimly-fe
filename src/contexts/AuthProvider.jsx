import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMe, loginUser, logoutUser, apiStartSession, apiChangeSessionStatus } from '../services/api';
import { parseDurationToSeconds, formatSecondsToTime } from '../utils/formatters';

// Context'i oluşturuyoruz
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [sessionElapsedTime, setSessionElapsedTime] = useState('00:00');
  const [loading, setLoading] = useState(true); // Sadece ilk açılış için

  // --- Session Zamanlayıcı Mantığı (SessionProvider'dan taşındı) ---
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

  // --- İlk Yükleme Mantığı ---
  useEffect(() => {
    const checkUserAndSession = async () => {
      try {
        const { data } = await getMe();
        setUser(data.user);
        const sessionData = data.active_sessions && data.active_sessions.length > 0 ? data.active_sessions[0] : null;
        if (sessionData && !sessionData.total_pause) {
          sessionData.total_pause = 'PT0S';
        }
        setActiveSession(sessionData);
      } catch (error) {
        setUser(null);
        setActiveSession(null);
      } finally {
        setLoading(false);
      }
    };
    checkUserAndSession();
  }, []);

  // --- Auth ve Session Fonksiyonları ---

  const login = useCallback((loginData) => {
    setUser(loginData.user);
    const sessionData = loginData.active_sessions && loginData.active_sessions.length > 0 ? loginData.active_sessions[0] : null;
    if (sessionData && !sessionData.total_pause) {
      sessionData.total_pause = 'PT0S';
    }
    setActiveSession(sessionData);
    setLoading(false);
  }, []);
  
  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout hatası:", error);
    } finally {
      setUser(null);
      setActiveSession(null);
    }
  }, []);

  const startSession = async (taskId, sessionName) => {
    const response = await apiStartSession({ task_id: taskId, name: sessionName });
    const sessionData = response.data;
    if (!sessionData.total_pause) {
      sessionData.total_pause = 'PT0S';
    }
    setActiveSession(sessionData);
    return sessionData;
  };
  
  const pauseSession = async () => {
    if (activeSession && activeSession.status === 'RUNNING') {
      const response = await apiChangeSessionStatus(activeSession.id, 'PAUSE');
      setActiveSession(response.data);
    }
  };

  const resumeSession = async () => {
    if (activeSession && activeSession.status === 'PAUSED') {
      const response = await apiChangeSessionStatus(activeSession.id, 'RESUME');
      setActiveSession(response.data);
    }
  };

  const finishSession = async () => {
    if (activeSession) {
      await apiChangeSessionStatus(activeSession.id, 'FINISH');
      setActiveSession(null);
      setSessionElapsedTime('00:00');
    }
  };
  
  // Context aracılığıyla sağlanacak tüm değerler
  const value = {
    user,
    loading,
    login,
    logout,
    activeSession,
    sessionElapsedTime,
    startSession,
    pauseSession,
    resumeSession,
    finishSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook'u da buradan export ediyoruz
export const useAuth = () => useContext(AuthContext);