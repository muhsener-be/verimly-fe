import { act, useCallback, useState } from "react";
import React from "react";
import AuthContext from './AuthContext'
import { getMe } from "../services/api";
import { useEffect } from "react";
import { apiStartSession } from "../services/api";
import { apiChangeSessionStatus } from "../services/api";
import { formatSecondsToTime } from "../utils/formatters";
import { parseDurationToSeconds } from "../utils/formatters";





export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Kullanıcı bilgisini saklayan state
  const [loading, setLoading] = useState(true);



  // const [activeSession, setActiveSession] = useState(null); // YENİ STATE
  // YENİ: Sayacın formatlanmış halini tutacak state
  // const [sessionElapsedTime, setSessionElapsedTime] = useState('00:00');

  // YENİ: Tüm sayaç mantığını yöneten useEffect
  // useEffect'i aşağıdaki doğru ve basit haliyle değiştirin
  // useEffect(() => {
  //   let interval;

  //   if (activeSession && activeSession.status === 'RUNNING') {
  //     interval = setInterval(() => {
  //       const startedAtMs = new Date(activeSession.started_at).getTime();

  //       // Hatalı kod yerine doğru parser'ı kullanıyoruz
  //       const totalPauseSeconds = parseDurationToSeconds(activeSession.total_pause);

  //       const nowMs = Date.now();

  //       // Hesaplamayı saniye cinsinden yapıyoruz
  //       const elapsedSeconds = Math.floor((nowMs - startedAtMs) / 1000) - totalPauseSeconds;

  //       // Doğru formatlayıcı ile state'i güncelliyoruz
  //       setSessionElapsedTime(formatSecondsToTime(elapsedSeconds));
  //     }, 1000);
  //   }
  //   else if (activeSession && (activeSession.status === 'PAUSED' || activeSession.status === 'FINISHED')) {
  //     // Duraklatıldığında, backend'den gelen total_time'ı doğru fonksiyonlarla çeviriyoruz
  //     console.log("Active session.total_time : ", activeSession.total_time)
  //     const totalSeconds = parseDurationToSeconds(activeSession.total_time);
  //     console.log("totalSeconds after parsing: ", totalSeconds)

  //     const formatted = formatSecondsToTime(totalSeconds);
  //     console.log("formatted. " , formatted)

  //     setSessionElapsedTime(formatSecondsToTime(totalSeconds));
  //   }

  //   return () => clearInterval(interval);
  // }, [activeSession]);





  // useEffect(() => {
  //   // Bu fonksiyon, uygulama ilk açıldığında çalışır ve
  //   // tarayıcıda geçerli bir cookie olup olmadığını kontrol eder.
  //   const checkLoggedIn = async () => {
  //     try {
  //       const response = await getMe(); // /api/v1/me endpoint'ini çağır
  //       setUser(response.data.user); // Kullanıcı bilgisi varsa state'e ata
  //       setSession(response.active_sessions[0])
  //     } catch (error) {
  //       setUser(null); // Cookie yoksa veya geçersizse kullanıcı null olur
  //       setSession(null);
  //     } finally {
  //       setLoading(false); // Kontrol bitti, yüklenme durumunu kapat
  //     }
  //   };

  //   checkLoggedIn();
  // }, []);


  const login = useCallback((userData) => {
    setUser(userData);
  }, []);


 const logout = useCallback(async () => {
    try {
      // await logoutUser();
    } catch (error) {
      console.error("Logout hatası:", error);
    } finally {
      setUser(null);
    }
  }, []);

  // const startSession = async (taskId, sessionName) => {
  //   try {
  //     // ÖNEMLİ: Backend'den gelen cevabın tam seans bilgisini içermesi gerekiyor.
  //     // Şimdilik gelen cevabı olduğu gibi state'e atıyoruz.
  //     // Eğer cevapta total_pause yoksa, varsayılan olarak 'PT0S' ekleyebiliriz.
  //     const response = await apiStartSession({ task_id: taskId, name: sessionName });
  //     const sessionData = response.data;
  //     if (!sessionData.total_pause) {
  //       sessionData.total_pause = 'PT0S';
  //     }
  //     setActiveSession(sessionData);
  //     return sessionData;
  //   } catch (error) {
  //     console.error("Seans başlatma hatası:", error);
  //     throw error;
  //   }
  // };

  // const pauseSession = async () => {
  //   if (activeSession && activeSession.status === 'RUNNING') {
  //     try {
  //       const response = await apiChangeSessionStatus(activeSession.id, 'PAUSE');
  //       setActiveSession(response.data); // State'i backend'den gelen güncel veriyle değiştir
  //     } catch (error) {
  //       console.error("Seans duraklatılamadı:", error);
  //     }
  //   }
  // };

  // const resumeSession = async () => {
  //   if (activeSession && activeSession.status === 'PAUSED') {
  //     try {
  //       const response = await apiChangeSessionStatus(activeSession.id, 'RESUME');
  //       setActiveSession(response.data);
  //     } catch (error) {
  //       console.error("Seansa devam edilemedi:", error);
  //     }
  //   }
  // };


  // const finishSession = async () => {
  //   if (activeSession) {
  //     try {
  //       await apiChangeSessionStatus(activeSession.id, 'FINISH');
  //       setActiveSession(null); // Biten seans artık aktif değildir, state'i temizle
  //       // TODO: Dashboard'daki görev detaylarını yenilemek için bir mekanizma eklenebilir.
  //     } catch (error) {
  //       console.error("Seans bitirilemedi:", error);
  //     }
  //   }
  // };


const value = { user, loading, login, logout };

  // Provider ile tüm uygulamayı sarıyoruz ve value'yu veriyoruz.
  return (
    <AuthContext.Provider value={value}>
      { children}
    </AuthContext.Provider>
  );
};