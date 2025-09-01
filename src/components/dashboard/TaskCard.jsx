import React from 'react';
import { Flag, Calendar } from 'lucide-react';

// Tarihleri daha okunaklı bir formata çeviren yardımcı fonksiyon
const formatDate = (dateString) => {
  if (!dateString) return 'Tarih Yok';
  const date = new Date(dateString);
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

// Öncelik ve Durum için renkleri belirleyen objeler
const priorityColors = {
  HIGH: 'text-red-600',
  MEDIUM: 'text-yellow-600',
  LOW: 'text-green-600',
};

const statusColors = {
    NOT_STARTED: 'bg-gray-200 text-gray-800',
    IN_PROGRESS: 'bg-blue-200 text-blue-800',
    DONE: 'bg-emerald-200 text-emerald-800',
};

const TaskCard = ({ task, onClick }) => {
  const priorityColor = priorityColors[task.priority] || 'text-gray-600';
  const statusStyle = statusColors[task.status] || statusColors.NOT_STARTED;

  return (
    <div 
        onClick={onClick}
        className="p-4 bg-white border rounded-lg shadow-sm cursor-pointer hover:border-emerald-500 transition-colors"
    >
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-gray-800 pr-2">{task.name}</h3>
        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusStyle}`}>
          {task.status.replace('_', ' ')}
        </span>
      </div>
      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
        {task.description || 'Açıklama yok'}
      </p>
      <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
        <div className={`flex items-center gap-1.5 ${priorityColor}`}>
          <Flag size={14} />
          <span>{task.priority || 'Belirsiz'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar size={14} />
          <span>{formatDate(task.due_date)}</span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TaskCard);