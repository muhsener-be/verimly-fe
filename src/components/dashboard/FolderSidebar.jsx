import React from 'react';

const FolderSidebar = ({ folders, selectedFolderId, onSelectFolder }) => {
  return (
    <aside className="w-1/4 min-w-[250px] bg-slate-50 border-r p-4 flex flex-col overflow-y-auto">
      <nav className="flex-grow">
        <ul>
          {folders.map(folder => (
            <li key={folder.id}>
              <button
                onClick={() => onSelectFolder(folder.id)}
                className={`w-full flex items-center gap-3 p-2 rounded text-left transition-colors ${
                  selectedFolderId === folder.id ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-slate-200'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: folder.label_color_hex || '#94a3b8' }}
                />
                <span className="flex-1 truncate">{folder.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default FolderSidebar;