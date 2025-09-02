import React from 'react';
import { formatDate, parseDurationToSeconds, formatSecondsToTime } from '../../utils/formatters';
import { MoreHorizontal, Play, Pause, Square, Repeat } from 'lucide-react';
import { useAuth } from '../../contexts/AuthProvider';


// Durumlar için renk ve metin stilleri
const statusStyles = {
  RUNNING: {
    text: 'ÇALIŞIYOR',
    style: 'bg-green-100 text-green-800 border-green-200',
  },
  PAUSED: {
    text: 'DURAKLATILDI',
    style: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  FINISHED: {
    text: 'BİTTİ',
    style: 'bg-gray-100 text-gray-700 border-gray-200',
  },
};

// Her bir seans için aksiyon menüsü bileşeni
const SessionActions = ({ session , onAction}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { activeSession, pauseSession, resumeSession, finishSession } = useAuth();
  
  // Eğer başka bir seans aktifse, bu seans üzerinde işlem yapılamaz.
  const isAnotherSessionRunning = activeSession && activeSession.status === 'RUNNING' && activeSession.id !== session.id;

  const handleAction = async (action, sessionId) => {
    setIsOpen(false);
    try {
        switch (action) {
            case 'PAUSE':
                await pauseSession();
                break;
            case 'RESUME':
            case 'RESTART': // "Yeniden Başlat" da "RESUME" ile aynı endpoint'i kullanıyor
                await resumeSession(sessionId);
                break;
            case 'FINISH':
                await finishSession(sessionId);
                break;
            default:
                break;
        }
    } catch (error) {
        alert(error.message || "İşlem gerçekleştirilemedi.");
    } finally {
        // Dashboard'un görev listesini ve detaylarını yenilemesi için haber veriyoruz.
        if (onAction) onAction();
    }
  };


  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="p-1 rounded-full hover:bg-gray-200 transition-colors"
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
      >
        <MoreHorizontal size={16} />
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-20">
          <ul>
            {session.status === 'RUNNING' && (
              <>
                <li><button onClick={() => handleAction('PAUSE', session.id)} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"><Pause size={14} /> Duraklat</button></li>
                <li><button onClick={() => handleAction('FINISH', session.id)} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"><Square size={14} /> Bitir</button></li>
              </>
            )}
            {session.status === 'PAUSED' && (
              <>
                <li><button disabled={isAnotherSessionRunning} onClick={() => handleAction('RESUME', session.id)} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"><Play size={14} /> Devam Et</button></li>
                <li><button onClick={() => handleAction('FINISH', session.id)} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"><Square size={14} /> Bitir</button></li>
              </>
            )}
             {session.status === 'FINISHED' && (
              <>
                <li><button disabled={isAnotherSessionRunning} onClick={() => handleAction('RESTART', session.id)} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"><Repeat size={14} /> Devam Et</button></li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};









const SessionList = ({ sessions, onAction }) => {


  if (!sessions || sessions.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        Bu görev için seans bulunmuyor.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sessions.map(session => (
        <div key={session.id} className="p-3 bg-white border rounded-md">
          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold text-sm text-gray-800">{session.name}</span>
            <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">
                    {formatSecondsToTime(parseDurationToSeconds(session.total_time))}
                </span>
                <SessionActions session={session} />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">{formatDate(session.started_at)}</span>
            {session.status && (
                 <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${statusStyles[session.status]?.style || 'bg-gray-100'}`}>
                    {statusStyles[session.status]?.text || session.status}
                </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(SessionList);