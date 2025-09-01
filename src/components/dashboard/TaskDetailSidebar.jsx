import React from 'react';
import { formatDate, formatSecondsToTime, parseDurationToSeconds } from '../../utils/formatters';
import { Calendar, Flag, Hash, Clock } from 'lucide-react';
import SessionList from './SessionList'; // SessionList'i buradan import ediyoruz
import Button from '../ui/Button';
import { PlayCircle } from 'lucide-react';
import { useSession } from '../../contexts/SessionProvider';
import StartSessionButton from './StartSessionButton';

const TaskDetailSidebar = ({ task, loading }) => {


  // const handleStartSession = async () => {
  //   const sessionName = prompt("Yeni seans için bir isim girin:", "Çalışma Seansı");
  //   if (sessionName && task) {
  //     try {
  //       await startSession(task.id, sessionName);
  //       // Başarılı olduğunda belki bir bildirim gösterilebilir.
  //     } catch (error) {
  //       alert("Seans başlatılamadı. Aktif bir seansınız olabilir.");
  //     }
  //   }
  // };


  if (loading) {
    return <aside className="w-1/3 border-l p-6"><p>Detaylar yükleniyor...</p></aside>;
  }

  if (!task) {
    return (
      <aside className="w-1/3 border-l p-6 flex items-center justify-center">
        <p className="text-gray-500">Detayları görmek için bir görev seçin.</p>
      </aside>
    );
  }

  const DetailItem = ({ icon, label, value }) => (
    <div className="flex items-center text-sm">
      <div className="w-6">{icon}</div>
      <span className="text-gray-500 mr-2">{label}:</span>
      <span className="font-semibold text-gray-800">{value}</span>
      {console.log('detail item value: ', value)}

    </div>
  );

  return (
    <aside className="w-1/3 border-l bg-white flex flex-col overflow-hidden">
      {/* 1. Görev Detayları Bölümü */}
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold mb-4">{task.name}</h2>
        {/* <Button
          onClick={handleStartSession}
          disabled={!!activeSession} // Zaten aktif bir seans varsa butonu pasif yap
        >
          <PlayCircle size={16} className="mr-2" />
          Seans Başlat
        </Button> */}
        <StartSessionButton taskId={task.id} />
        <p className="text-sm text-gray-600 mb-6">{task.description || 'Açıklama yok.'}</p>
        <div className="space-y-3">
          <DetailItem icon={<Hash size={16} className="text-gray-400" />} label="Durum" value={task.status} />
          <DetailItem icon={<Flag size={16} className="text-gray-400" />} label="Öncelik" value={task.priority} />
          <DetailItem icon={<Calendar size={16} className="text-gray-400" />} label="Bitiş Tarihi" value={formatDate(task.due_date)} />
          <DetailItem icon={<Clock size={16} className="text-gray-400" />} label="Toplam Süre" value={formatSecondsToTime(parseDurationToSeconds(task.total_time))} />
        </div>
      </div>

      {/* 2. Seanslar Bölümü */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Çalışma Seansları</h3>
        <SessionList sessions={task.sessions} />
      </div>
    </aside>
  );
};

export default React.memo(TaskDetailSidebar);