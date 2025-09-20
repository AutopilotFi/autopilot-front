import clsx from 'clsx';

export const CommingSoon = ({ fullWidth }: { fullWidth?: boolean }) => (
  <span
    className={clsx(
      'text-xs text-[#9159FF] bg-[#9159FF]/10 px-2 py-1 rounded-full font-medium border border-[#9159FF]/20',
      fullWidth && 'w-full text-center'
    )}
  >
    Coming Soon
  </span>
);
