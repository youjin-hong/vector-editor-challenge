import type { LucideIcon } from 'lucide-react';
import { Tooltip } from '@/shared/ui/Tooltip';

interface ToolButtonProps {
  icon: LucideIcon;
  label: string;
  shortcut?: string;
  isActive: boolean;
  onClick: () => void;
}

export const ToolButton = ({
  icon: Icon,
  label,
  shortcut,
  isActive,
  onClick,
}: ToolButtonProps): JSX.Element => {
  return (
    <Tooltip label={label} shortcut={shortcut}>
      <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center w-full py-2 px-1 rounded-lg transition-all text-xs gap-1
          ${isActive
            ? 'bg-editor-accent text-white shadow-[0_0_8px_rgba(249,115,22,0.3)]'
            : 'text-editor-secondary hover:bg-editor-surface-hover hover:text-editor-primary'
          }`}
      >
        <Icon className="w-5 h-5" />
        <span className="text-[10px] leading-none">{label}</span>
      </button>
    </Tooltip>
  );
};
