import React from 'react';
import TaskCard from './TaskCard';

const TaskList = ({ tasks, loading, onSelectTask }) => {
  if (loading) {
    return <div className="flex-1 p-6"><p>Görevler yükleniyor...</p></div>;
  }

  return (
    <section className="flex-1 p-6 flex flex-col overflow-hidden bg-slate-50">
      {tasks.length === 0 ? (
        <div className="flex-1 flex items-center justify-center bg-slate-50 rounded-lg">
          <p className="text-gray-500">Bu klasörde görev bulunmuyor.</p>
        </div>
      ) : (
        <div className="space-y-3 overflow-y-auto pr-2"> {/* Sağa scrollbar için boşluk */}
          {tasks.map(task => (
            <TaskCard 
                key={task.id} 
                task={task}
                onClick={() => onSelectTask(task.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default TaskList;