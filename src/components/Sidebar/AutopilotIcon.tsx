interface AutopilotIconProps {
  className?: string;
  size?: number;
}

export function AutopilotIcon({ className = "", size = 24 }: AutopilotIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer navigation ring */}
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />

      {/* Inner automation core */}
      <circle
        cx="12"
        cy="12"
        r="3"
        fill="currentColor"
      />

      {/* Navigation indicators (4 directional points) */}
      <circle cx="12" cy="3" r="1.5" fill="currentColor" />
      <circle cx="21" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="21" r="1.5" fill="currentColor" />
      <circle cx="3" cy="12" r="1.5" fill="currentColor" />

      {/* Connecting lines showing automation */}
      <line x1="12" y1="6" x2="12" y2="9" stroke="currentColor" strokeWidth="1.5" />
      <line x1="18" y1="12" x2="15" y2="12" stroke="currentColor" strokeWidth="1.5" />
      <line x1="12" y1="18" x2="12" y2="15" stroke="currentColor" strokeWidth="1.5" />
      <line x1="6" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}