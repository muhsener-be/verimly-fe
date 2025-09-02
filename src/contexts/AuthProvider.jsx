import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// ... diğer importlar aynı ...
import { getMe, logoutUser, apiStartSession, apiChangeSessionStatus } from '../services/api';
import { parseDurationToSeconds, formatSecondsToTime } from '../utils/formatters';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // ... state tanımlamaları ve useEffect'ler aynı kalacak ...
  const [user, setUser] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [sessionElapsedTime, setSessionElapsedTime] = useState('00:00');
  const [loading, setLoading] = useState(true);

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

  // --- Auth Fonksiyonları ---
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


  // --- YENİ VE GÜNCELLENMİŞ SEANS FONKSİYONLARI ---

  const startSession = async (taskId, sessionName) => {
    if (activeSession) throw new Error("Zaten aktif bir seans var.");
    const response = await apiStartSession({ task_id: taskId, name: sessionName });
    const sessionData = response.data;
    if (!sessionData.total_pause) sessionData.total_pause = 'PT0S';
    setActiveSession(sessionData);
    return sessionData;
  };
  
  const pauseSession = async () => {
    if (activeSession && activeSession.status === 'RUNNING') {
      const response = await apiChangeSessionStatus(activeSession.id, 'PAUSE');
      setActiveSession(response.data);
    }
  };

  // Hem PAUSED hem de FINISHED durumundan devam etmeyi bu fonksiyon yönetecek
  const resumeSession = async (sessionIdToResume) => {
    const sessionId = sessionIdToResume || activeSession?.id;
    if (!sessionId) return;
    
    // Zaten çalışan bir seans varsa yeni bir seans başlatmayı engelle
    if (activeSession && activeSession.status === 'RUNNING' && activeSession.id !== sessionId) {
        throw new Error("Önce mevcut seansı duraklatmalı veya bitirmelisiniz.");
    }

    const response = await apiChangeSessionStatus(sessionId, 'RESUME');
    setActiveSession(response.data);
  };
  
  const finishSession = async (sessionIdToFinish) => {
    const sessionId = sessionIdToFinish || activeSession?.id;
    if (!sessionId) return;

    await apiChangeSessionStatus(sessionId, 'FINISH');
    
    // Eğer bitirilen seans aktif seans ise, state'i temizle
    if (activeSession && activeSession.id === sessionId) {
      setActiveSession(null);
      setSessionElapsedTime('00:00');
    }
    // Değilse, Dashboard'un listeyi yenilemesi gerekecek (bu otomatik olmalı)
  };
  
  const value = {
    user,
    loading,
    login,
    logout,
    activeSession,
    sessionElapsedTime,
    startSession,
    pauseSession,
    resumeSession, // Artık ID alabiliyor
    finishSession, // Artık ID alabiliyor
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);