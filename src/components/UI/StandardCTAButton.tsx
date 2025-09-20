import { Wallet } from 'lucide-react';

// Standardized button component for new user CTAs
const StandardCTAButton = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className="inline-flex items-center px-4 py-2 bg-[#9159FF] hover:bg-[#7c3aed] text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
  >
    <Wallet className="w-4 h-4 mr-2" />
    {children}
  </button>
);

export default StandardCTAButton;
