import React from 'react';
import { LayoutDashboard, KanbanSquare, Code2, GitBranch } from 'lucide-react';

export default function Sidebar() {
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Overview' },
    { icon: <KanbanSquare size={20} />, label: 'Kanban Board' },
    { icon: <Code2 size={20} />, label: 'Tech Stack' },
  ];

  return (
    <div className="w-64 h-screen bg-slate-900 border-r border-slate-800 fixed left-0 top-0 flex flex-col p-6">
      <div className="flex items-center gap-3 mb-10">
        <div className="bg-blue-600 p-2 rounded-lg text-white">
          <GitBranch size={24} />
        </div>
        <h1 className="text-xl font-bold tracking-wider text-white">DevPulse</h1>
      </div>
      
      <nav className="flex-1 space-y-2">
        {menuItems.map((item, index) => (
          <button 
            key={index} 
            className={`flex items-center gap-4 w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              index === 0 
                ? 'bg-blue-600/10 text-blue-400' 
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="pt-4 border-t border-slate-800 text-xs text-slate-500">
        Connected to GitHub API
      </div>
    </div>
  );
}