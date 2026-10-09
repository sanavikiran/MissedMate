import { Ban, Check } from 'lucide-react';

interface Props {
  detectedApps: { packageName: string; label: string }[];
  excludedApps: string[];
  onToggleExclusion: (packageName: string) => void;
}

export function AppExclusionList({ detectedApps, excludedApps, onToggleExclusion }: Props) {
  if (detectedApps.length === 0) return null;

  return (
    <div className="mt-3">
      <p className="mb-2 text-xs font-semibold text-slate-400">App filters</p>
      <p className="mb-2 text-xs text-slate-500">
        Exclude apps to stop processing their notifications. Toggle off to resume.
      </p>
      <div className="space-y-1.5">
        {detectedApps.map(app => {
          const isExcluded = excludedApps.includes(app.packageName);
          return (
            <div
              key={app.packageName}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <div className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${
                  isExcluded ? 'bg-slate-100 text-slate-400' : 'bg-violet-50 text-violet-600'
                }`}>
                  {app.label.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className={`text-xs font-medium ${isExcluded ? 'text-slate-400' : 'text-slate-700'}`}>
                    {app.label}
                  </p>
                  <p className="text-xs text-slate-300">{app.packageName}</p>
                </div>
              </div>
              <button
                onClick={() => onToggleExclusion(app.packageName)}
                className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                  isExcluded
                    ? 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                    : 'bg-green-50 text-green-600 hover:bg-green-100'
                }`}
              >
                {isExcluded ? <><Ban size={11} /> Excluded</> : <><Check size={11} /> Active</>}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
