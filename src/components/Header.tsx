import { Bell, RotateCcw, Trash, Smartphone } from 'lucide-react';

interface Props {
  onResetDemo: () => void;
  onClearAll: () => void;
  messageCount: number;
  androidConnected: boolean;
}

export function Header({ onResetDemo, onClearAll, messageCount, androidConnected }: Props) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 text-white shadow-md shadow-violet-200">
            <Bell size={18} />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 sm:text-lg">MissedMate</h1>
            <p className="hidden text-xs text-slate-400 sm:block">Smart notification manager for students</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {androidConnected && (
            <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-600">
              <Smartphone size={12} />
              <span className="hidden sm:inline">Android connected</span>
              <span className="sm:hidden">Connected</span>
            </span>
          )}
          {messageCount > 0 && (
            <span className="hidden rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500 sm:inline">
              {messageCount} {messageCount === 1 ? 'message' : 'messages'}
            </span>
          )}
          <button
            onClick={onResetDemo}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50"
            title="Reset to demo data"
          >
            <RotateCcw size={14} />
            <span className="hidden sm:inline">Reset demo</span>
          </button>
          <button
            onClick={onClearAll}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            title="Delete all messages"
          >
            <Trash size={14} />
            <span className="hidden sm:inline">Clear all</span>
          </button>
        </div>
      </div>
    </header>
  );
}
