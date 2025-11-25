
import React from 'react';
import { HistoryItem } from '../types';
import { Clock, ChevronRight, Trash2 } from 'lucide-react';

interface HistorySidebarProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ history, onSelect, onClear }) => {
  return (
    <div className="w-full lg:w-80 flex flex-col h-full bg-transparent">
      <div className="p-4 border-b border-slate-200 dark:border-gray-800 flex justify-between items-center">
        <div className="flex items-center gap-2 text-slate-800 dark:text-gray-100 font-semibold">
          <Clock className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          <span>History</span>
        </div>
        {history.length > 0 && (
          <button 
            onClick={onClear} 
            className="text-xs text-slate-500 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {history.length === 0 ? (
          <div className="text-center py-10 text-slate-500 dark:text-gray-500 text-sm">
            No history yet.<br/>Start generating!
          </div>
        ) : (
          history.map((item) => (
            <div 
              key={item.id}
              onClick={() => onSelect(item)}
              className="group flex items-start gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800/80 cursor-pointer transition-all border border-transparent hover:border-slate-200 dark:hover:border-gray-700"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 dark:text-gray-300 truncate group-hover:text-brand-600 dark:group-hover:text-brand-300">
                  {item.intent}
                </p>
                <p className="text-xs text-slate-500 dark:text-gray-500 mt-1 truncate">
                  {new Date(item.timestamp).toLocaleTimeString()} &middot; {item.generatedPrompt.substring(0, 30)}...
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 dark:text-gray-600 group-hover:text-slate-600 dark:group-hover:text-gray-400 mt-1" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistorySidebar;
