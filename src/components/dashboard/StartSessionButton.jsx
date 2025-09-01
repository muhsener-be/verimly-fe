import React from 'react';
import { useAuth } from '../../contexts/AuthProvider';
import Button from '../ui/Button';
import { PlayCircle } from 'lucide-react';

const StartSessionButton = ({ taskId }) => {
  // Bu küçük bileşen, gürültülü context'i tek başına dinleyecek.
  const { startSession, activeSession } = useAuth();


  const handleStartSession = async () => {
    const sessionName = prompt("Yeni seans için bir isim girin:", "Çalışma Seansı");
    if (sessionName && taskId) {
      try {
        await startSession(taskId, sessionName);
      } catch (error) {
        alert("Seans başlatılamadı. Aktif bir seansınız olabilir.");
      }
    }
  };

  return (
    <Button
      onClick={handleStartSession}
      disabled={!!activeSession} // Sadece bu buton, aktif seans var mı diye kontrol ediyor.
    >
      <PlayCircle size={16} className="mr-2" />
      Seans Başlat
    </Button>
  );
};

export default React.memo(StartSessionButton);