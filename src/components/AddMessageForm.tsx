import { useState } from 'react';
import { Plus, Send, X } from 'lucide-react';

interface Props {
  onAdd: (source: string, title: string, body: string) => void;
}

export function AddMessageForm({ onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) {
      setError('Please enter a message to process');
      return;
    }
    onAdd(
      source.trim() || 'Manual Entry',
      title.trim() || body.trim().slice(0, 60),
      body.trim(),
    );
    setSource('');
    setTitle('');
    setBody('');
    setError('');
    setOpen(false);
  }

  function handleClose() {
    setOpen(false);
    setError('');
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-white py-3 text-sm font-medium text-slate-500 transition-all hover:border-violet-400 hover:text-violet-600"
      >
        <Plus size={18} />
        Add a message
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <Plus size={16} className="text-violet-500" />
          Add a new message
        </h3>
        <button
          onClick={handleClose}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          <X size={16} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Source (optional)</label>
            <input
              type="text"
              value={source}
              onChange={e => setSource(e.target.value)}
              placeholder="e.g. Gmail, Group Chat"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-300 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Title (optional)</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Short title or subject"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-300 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Message</label>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Paste or type a notification here. MissedMate will categorize, prioritize, and summarize it automatically."
            rows={4}
            className="w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-300 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200"
          />
        </div>
        {error && <p className="text-xs font-medium text-red-500">{error}</p>}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-violet-700 active:scale-95"
          >
            <Send size={15} />
            Process message
          </button>
        </div>
      </form>
    </div>
  );
}
