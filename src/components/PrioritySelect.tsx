import type { Priority } from '@/types';
import { PRIORITY_CONFIG } from '@/lib/uiConfig';

interface Props {
  value: Priority;
  onChange: (p: Priority) => void;
}

const OPTIONS: Priority[] = ['high', 'medium', 'low'];

export function PrioritySelect({ value, onChange }: Props) {
  const config = PRIORITY_CONFIG[value];
  return (
    <div className="relative inline-block">
      <select
        value={value}
        onChange={e => onChange(e.target.value as Priority)}
        className={`appearance-none rounded-full border px-3 py-1 pr-7 text-xs font-semibold transition-colors cursor-pointer ${config.bg} ${config.text} ${config.border} hover:opacity-80 focus:outline-none focus:ring-2 ${config.ring}`}
      >
        {OPTIONS.map(o => (
          <option key={o} value={o}>
            {PRIORITY_CONFIG[o].label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-current opacity-60">
        ▾
      </span>
    </div>
  );
}
