import { Moon, Sun } from 'lucide-react';

interface DarkModeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
  className?: string;
}

export function DarkModeToggle({ isDarkMode, onToggle, className = '' }: DarkModeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`
        relative inline-flex items-center justify-center w-10 h-10
        rounded-lg bg-secondary hover:bg-accent transition-all duration-300
        group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        hover:shadow-lg hover:shadow-primary/20 active:scale-95 active:shadow-sm
        hover:scale-105 focus:scale-105
        before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r
        before:from-primary/10 before:to-primary/5 before:opacity-0
        before:transition-opacity before:duration-300 hover:before:opacity-100
        ${className}
      `}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative w-5 h-5">
        <Sun
          className={`
            absolute inset-0 w-5 h-5 text-primary transition-all duration-300 transform
            ${isDarkMode ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}
          `}
        />
        <Moon
          className={`
            absolute inset-0 w-5 h-5 text-primary transition-all duration-300 transform
            ${isDarkMode ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}
          `}
        />
      </div>
    </button>
  );
}
