import { ShieldCheck, X, Info } from 'lucide-react';

interface Props {
  onDismiss: () => void;
}

export function PrivacyNotice({ onDismiss }: Props) {
  return (
    <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
          <ShieldCheck size={20} />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-slate-800">How MissedMate works</h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            MissedMate processes messages <strong>you enter</strong> — it categorizes,
            prioritizes, and summarizes them using local text analysis on your device.
            It does <strong>not</strong> automatically read notifications from WhatsApp,
            Instagram, Gmail, or other apps. A web app cannot access those notifications
            without platform-specific integrations. Paste anything you want organized
            and we'll handle the rest.
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-violet-400 transition-colors hover:bg-violet-100 hover:text-violet-600"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export function PrivacyFooter() {
  return (
    <div className="mt-8 flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
      <Info size={14} className="mt-0.5 shrink-0 text-slate-400" />
      <p>
        MissedMate analyzes text locally in your browser — no data is sent to external
        servers. It does not connect to WhatsApp, Instagram, Gmail, or any notification
        system. All processing uses simple text rules, not AI APIs.
      </p>
    </div>
  );
}
