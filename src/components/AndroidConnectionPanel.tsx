import { useState } from 'react';
import {
  Smartphone, ShieldCheck, ChevronDown, ChevronUp,
  Power, Wifi, WifiOff, Info, CheckCircle2, AlertCircle,
} from 'lucide-react';
import type { Settings } from '@/types';
import { AppExclusionList } from './AppExclusionList';

interface Props {
  settings: Settings;
  onConnectChange: (connected: boolean) => void;
  onListenerToggle: (enabled: boolean) => void;
  onToggleExclusion: (packageName: string) => void;
  detectedApps: { packageName: string; label: string }[];
}

export function AndroidConnectionPanel({
  settings,
  onConnectChange,
  onListenerToggle,
  onToggleExclusion,
  detectedApps,
}: Props) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
            settings.androidConnected
              ? 'bg-green-50 text-green-600'
              : 'bg-slate-100 text-slate-400'
          }`}>
            <Smartphone size={20} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Android Notification Access</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              {settings.androidConnected
                ? 'Connected — notifications from your Android device are being processed'
                : 'Not connected — connect an Android device to capture real notifications'}
            </p>
          </div>
        </div>
        <button
          onClick={() => onConnectChange(!settings.androidConnected)}
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
            settings.androidConnected
              ? 'border border-slate-200 bg-white text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600'
              : 'bg-violet-600 text-white hover:bg-violet-700 active:scale-95'
          }`}
        >
          {settings.androidConnected ? <><WifiOff size={14} /> Disconnect</> : <><Wifi size={14} /> Connect</>}
        </button>
      </div>

      {/* Status indicator */}
      <div className="mt-3 flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
        {settings.androidConnected ? (
          <>
            <CheckCircle2 size={15} className="text-green-500" />
            <span className="text-xs font-medium text-slate-600">Device connected</span>
            {settings.listenerEnabled ? (
              <span className="ml-auto flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                <Power size={10} /> Listening
              </span>
            ) : (
              <span className="ml-auto flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                <Power size={10} /> Paused
              </span>
            )}
          </>
        ) : (
          <>
            <AlertCircle size={15} className="text-slate-400" />
            <span className="text-xs text-slate-500">No Android device connected</span>
          </>
        )}
      </div>

      {/* Listener toggle */}
      {settings.androidConnected && (
        <div className="mt-3 flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2.5">
          <div className="flex items-center gap-2">
            <Power size={15} className={settings.listenerEnabled ? 'text-green-500' : 'text-slate-400'} />
            <div>
              <p className="text-xs font-semibold text-slate-700">Notification Listener</p>
              <p className="text-xs text-slate-400">
                {settings.listenerEnabled ? 'Capturing notifications from allowed apps' : 'Paused — no new notifications being captured'}
              </p>
            </div>
          </div>
          <button
            onClick={() => onListenerToggle(!settings.listenerEnabled)}
            className={`relative h-6 w-11 rounded-full transition-colors ${
              settings.listenerEnabled ? 'bg-green-500' : 'bg-slate-300'
            }`}
          >
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
              settings.listenerEnabled ? 'translate-x-5' : 'translate-x-0.5'
            }`} />
          </button>
        </div>
      )}

      {/* App exclusion list */}
      {settings.androidConnected && detectedApps.length > 0 && (
        <AppExclusionList
          detectedApps={detectedApps}
          excludedApps={settings.excludedApps}
          onToggleExclusion={onToggleExclusion}
        />
      )}

      {/* Expandable details */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="mt-3 flex items-center gap-1 text-xs font-medium text-slate-400 transition-colors hover:text-slate-600"
      >
        {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        How Android notification access works
      </button>

      {showDetails && (
        <div className="mt-3 space-y-2 rounded-lg bg-slate-50 p-3 text-xs leading-relaxed text-slate-600">
          <div className="flex items-start gap-2">
            <ShieldCheck size={14} className="mt-0.5 shrink-0 text-violet-500" />
            <p>
              <strong>Permission-based:</strong> The Android app uses Android's
              NotificationListenerService, which requires you to grant notification access
              in Android Settings. It never bypasses or circumvents this permission.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Info size={14} className="mt-0.5 shrink-0 text-blue-500" />
            <p>
              <strong>Limited data:</strong> Only information exposed in the notification —
              the source app, title, text, and received time — is read. It cannot access
              complete conversations, hidden messages, or message history.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Power size={14} className="mt-0.5 shrink-0 text-green-500" />
            <p>
              <strong>You're in control:</strong> Disable notification access at any time
              from Android Settings, exclude specific apps, or disconnect entirely.
              All processing happens locally on your device.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
