import React from 'react';
import { formatDate, parseDurationToSeconds } from '../../utils/formatters';
import { formatSecondsToTime } from '../../utils/formatters';

const SessionList = ({ sessions }) => {
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
        <div key={session.id} className="p-3 bg-slate-50 rounded-md">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-sm">{session.name}</span>
            <span className="text-xs font-bold text-slate-600">{formatSecondsToTime(parseDurationToSeconds(session.total_time))}</span>
          </div>
          <span className="text-xs text-gray-500">{formatDate(session.started_at)}</span>
        </div>
      ))}
    </div>
  );
};

export default React.memo(SessionList);