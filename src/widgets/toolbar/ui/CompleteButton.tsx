import type { JSX } from 'react';
import { Check } from 'lucide-react';
import { Tooltip } from '@/shared/ui/Tooltip';

interface CompleteButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export const CompleteButton = ({ onClick, disabled }: CompleteButtonProps): JSX.Element => {
  return (
    <Tooltip label="Complete Polygon" shortcut="Enter">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`flex flex-col items-center justify-center w-full py-2 px-1 rounded-lg transition-all text-xs gap-1
          ${disabled
            ? 'opacity-30 pointer-events-none text-editor-muted'
            : 'text-editor-success hover:bg-editor-surface-hover'
          }`}
      >
        <Check className="w-5 h-5" />
        <span className="text-[10px] leading-none">Done</span>
      </button>
    </Tooltip>
  );
};
