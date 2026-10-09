import { ShieldCheck, X, Info, Smartphone } from 'lucide-react';

interface Props {
  onDismiss: () => void;
  androidConnected: boolean;
}

export function PrivacyNotice({ onDismiss, androidConnected }: Props) {
  return (
    <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
          <ShieldCheck size={20} />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-slate-800">How MissedMate works</h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            MissedMate categorizes, prioritizes, and summarizes notifications using
            local text analysis on your device. {androidConnected ? (
              <strong>You've connected an Android device</strong>
            ) : (
              <>You can <strong>connect an Android device</strong> to automatically capture
              notifications from apps like WhatsApp, Gmail, and Instagram, or <strong>paste
              messages manually</strong> in the web dashboard.</>
            )} All processing happens locally — no notification content is ever sent to an
            external server.
          </p>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            <Smartphone size={11} className="mr-1 inline" />
            Android notification access reads only what's visible in notifications (source app,
            title, text, and time). It cannot read complete conversations or hidden messages.
            You can exclude apps or disable access at any time.
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
        MissedMate processes notifications locally — no data is sent to external servers.
        Android notification access reads only the information exposed in notifications
        (source app, title, text, received time), not complete conversations or hidden messages.
        You can exclude specific apps, disable notification access, or delete all data at any time.
        All categorization, prioritization, and summarization uses local text rules, not paid AI APIs.
      </p>
    </div>
  );
}
