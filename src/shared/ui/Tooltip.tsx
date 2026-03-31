import { type ReactNode } from 'react';

interface TooltipProps {
  label: string;
  shortcut?: string;
  children: ReactNode;
}

export const Tooltip = ({ label, shortcut, children }: TooltipProps): JSX.Element => {
  return (
    <div className="relative group w-full">
      {children}
      <div
        className="
          pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50
          opacity-0 group-hover:opacity-100 transition-opacity duration-150 delay-300
          flex items-center gap-1.5 whitespace-nowrap
          bg-editor-surface border border-editor-border rounded-lg px-2.5 py-1.5
          shadow-[0_4px_12px_rgba(0,0,0,0.4)]
        "
      >
        {/* Arrow */}
        <span
          className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45
            bg-editor-surface border-l border-b border-editor-border"
        />
        <span className="relative text-editor-primary text-xs font-medium">{label}</span>
        {shortcut && (
          <span className="relative text-editor-muted font-mono text-[10px] bg-editor-bg border border-editor-border rounded px-1 py-0.5 leading-none">
            {shortcut}
          </span>
        )}
      </div>
    </div>
  );
};
