'use client';
import { ProjectData } from '@/types/globalAppTypes';
import { Plus, Minus, Info, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';
import { useIporActions } from '@/hooks/useIporActions';
import { useBalances } from '@/hooks/useBalances';
import { useWallet } from '@/providers/WalletProvider';
import { useToastContext } from '@/providers/ToastProvider';
import { Address, parseUnits } from 'viem';
import { ConnectWalletButton } from '@/components/ConnectWalletButton';
import { convertAssetsToVault } from '@/lib/contracts/iporVault';
import { formatBalance, getChainNameFromId } from '@/helpers/utils';
import Image from 'next/image';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/UI/TooltipMobileFriendly';

export default function Deposit({
  isNewUser,
  currentProjectData,
  setShowTermsModal,
  refreshAllMetrics,
  isMobile,
  isDarkMode,
}: {
  isNewUser: boolean;
  currentProjectData: ProjectData;
  setShowTermsModal: Dispatch<SetStateAction<boolean>>;
  handleOpenBenchmark: () => void;
  refreshAllMetrics: () => Promise<void>;
  isMobile?: boolean;
  isDarkMode?: boolean;
}) {
  const [depositMode, setDepositMode] = useState<'enter' | 'exit'>('enter');
  const [insuranceEnabled, setInsuranceEnabled] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [txSuccess, setTxSuccess] = useState<string | null>(null);
  const [isRefreshingBalances, setIsRefreshingBalances] = useState(false);

  const { isConnected, chainId, switchChain, publicClient } = useWallet();
  const { deposit, withdraw } = useIporActions();
  const { showSuccess, showError } = useToastContext();

  const isCorrectNetwork = chainId === currentProjectData.chainId;
  const targetChainName = getChainNameFromId(currentProjectData.chainId);

  const handleSwitchNetwork = async () => {
    try {
      await switchChain(currentProjectData.chainId);

      showSuccess('Network Switched!', `Successfully switched to ${targetChainName} network`);
    } catch (error) {
      console.error('Network switching failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to switch network';

      showError('Network Switch Failed', errorMessage);
    }
  };

  // Fetch real-time balances
  const {
    tokenBalanceFormatted,
    vaultBalanceFormatted,
    loading: balancesLoading,
    refetch: refetchBalances,
  } = useBalances(
    currentProjectData.tokenAddress,
    currentProjectData.vaultAddress,
    parseInt(currentProjectData.tokenDecimals)
  );

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) return;

    try {
      setIsProcessing(true);
      setTxSuccess(null);

      const result = await deposit(
        currentProjectData.vaultAddress as Address,
        currentProjectData.tokenAddress as Address,
        depositAmount,
        parseInt(currentProjectData.tokenDecimals)
      );

      setTxSuccess(`Deposit successful! Transaction: ${result.hash}`);
      setDepositAmount('');
      setInsuranceEnabled(false);

      showSuccess(
        'Deposit Successful!',
        `${depositAmount} ${currentProjectData.asset} deposited successfully`,
        result.hash
      );

      await refreshBalancesAfterTransaction();
    } catch (error) {
      let userMessage = 'Deposit failed';
      if (error instanceof Error) {
        if (error.message.includes('User rejected') || error.message.includes('User denied')) {
          userMessage = 'Transaction was cancelled by user';
        } else if (error.message.includes('insufficient funds')) {
          userMessage = 'Insufficient funds for transaction';
        } else if (error.message.includes('network')) {
          userMessage = 'Network error occurred';
        } else {
          userMessage = 'Transaction failed. Please try again.';
        }
      }

      showError('Deposit Failed', userMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle withdraw transaction
  const handleWithdraw = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) return;

    try {
      setIsProcessing(true);
      setTxSuccess(null);

      // Convert underlying token amount to vault shares
      const underlyingAmount = parseUnits(
        depositAmount,
        parseInt(currentProjectData.tokenDecimals)
      );
      const vaultShares = await convertAssetsToVault(
        publicClient,
        currentProjectData.vaultAddress,
        underlyingAmount
      );

      const result = await withdraw(
        currentProjectData.vaultAddress as Address,
        vaultShares.toString()
      );

      setTxSuccess(`Withdrawal successful! Transaction: ${result.hash}`);
      setDepositAmount('');

      showSuccess(
        'Withdrawal Successful!',
        `${depositAmount} ${currentProjectData.asset} withdrawn successfully`,
        result.hash
      );

      await refreshBalancesAfterTransaction();
    } catch (error) {
      console.error('Withdrawal failed:', error);

      let userMessage = 'Withdrawal failed';
      if (error instanceof Error) {
        if (error.message.includes('User rejected') || error.message.includes('User denied')) {
          userMessage = 'Transaction was cancelled by user';
        } else if (error.message.includes('insufficient funds')) {
          userMessage = 'Insufficient funds for transaction';
        } else if (error.message.includes('network')) {
          userMessage = 'Network error occurred';
        } else {
          userMessage = 'Transaction failed. Please try again.';
        }
      }

      showError('Withdrawal Failed', userMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMainAction = async () => {
    if (!isConnected) {
      return;
    }

    // Check if network is correct first
    if (!isCorrectNetwork) {
      await handleSwitchNetwork();
      return;
    }

    if (isNewUser && depositMode === 'enter') {
      setShowTermsModal(true);
      return;
    }

    if (depositMode === 'enter') {
      await handleDeposit();
    } else {
      await handleWithdraw();
    }
  };

  const refreshBalancesAfterTransaction = async () => {
    setIsRefreshingBalances(true);
    const maxAttempts = 3;
    const delays = [1000, 2000, 3000]; // 1s, 2s, 3s delays

    try {
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
          await new Promise(resolve => setTimeout(resolve, delays[attempt]));
          await refetchBalances();
          console.log(`Balance refresh successful on attempt ${attempt + 1}`);
          break;
        } catch (error) {
          console.warn(`Balance refresh attempt ${attempt + 1} failed:`, error);
          if (attempt === maxAttempts - 1) {
            console.error('All balance refresh attempts failed');
            // Show a warning to the user but don't override success message
            if (!txSuccess) {
            }
          }
        }
      }
      await refreshMetricsWithRetry();
    } finally {
      setIsRefreshingBalances(false);
    }
  };

  const refreshMetricsWithRetry = async () => {
    const maxAttempts = 8;
    const baseDelay = 3000;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        if (attempt > 0) {
          const delay = baseDelay * Math.pow(1.5, attempt - 1); // 3s, 4.5s, 6.75s, 10s, 15s, 22s, 33s
          console.log(`Waiting ${delay}ms before metrics retry ${attempt + 1}/${maxAttempts}...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        await refreshAllMetrics();
        return;
      } catch (error) {
        console.warn(`Metrics refresh attempt ${attempt + 1} failed:`, error);

        if (attempt === maxAttempts - 1) {
          console.error('All metrics refresh attempts failed - subgraph may still be syncing');
        }
      }
    }
  };

  // Get current balance for display
  const currentBalance =
    depositMode === 'enter' ? tokenBalanceFormatted : isNewUser ? 0 : vaultBalanceFormatted;
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Deposit Interface */}
        <div className="w-full lg:w-[60%] bg-white rounded-xl p-6 border border-gray-100">
          {/* Full Width Enter/Exit Toggle */}
          <div className="relative bg-gray-100 rounded-2xl p-1 flex mb-6">
            <div
              className={`absolute top-1 h-[calc(100%-8px)] bg-white rounded-xl transition-all duration-300 ease-in-out ${
                depositMode === 'enter'
                  ? 'left-1 w-[calc(50%-4px)]'
                  : 'left-[calc(50%+2px)] w-[calc(50%-4px)]'
              }`}
            ></div>

            <button
              onClick={() => setDepositMode('enter')}
              className={`relative z-10 px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 flex-1 ${
                depositMode === 'enter' ? 'text-[#9159FF]' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Plus
                className={`w-4 h-4 transition-all duration-300 ${
                  depositMode === 'enter' ? 'scale-110' : 'scale-100'
                }`}
              />
              <span>Enter</span>
            </button>

            <button
              onClick={() => setDepositMode('exit')}
              className={`relative z-10 px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 flex-1 ${
                depositMode === 'exit' ? 'text-[#9159FF]' : 'text-gray-500 hover:text-gray-700'
              }`}
              disabled={isNewUser}
            >
              <Minus
                className={`w-4 h-4 transition-all duration-300 ${
                  depositMode === 'exit' ? 'scale-110' : 'scale-100'
                }`}
              />
              <span>Exit</span>
            </button>
          </div>

          {isNewUser && depositMode === 'exit' && (
            <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <Info className="w-5 h-5 text-[#9159FF] flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-purple-900">No Balance to Withdraw</h4>
                  <p className="text-sm text-purple-700">
                    You need to deposit {currentProjectData.asset} first before you can withdraw.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* {txSuccess && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-green-500 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-green-900">Transaction Successful</h4>
                  <p className="text-sm text-green-700 truncate">{txSuccess}</p>
                </div>
              </div>
            </div>s
          )} */}

          {/* Available Balance Section with Integrated Top-up */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">
                  {depositMode === 'enter'
                    ? 'Available in Wallet'
                    : `${currentProjectData.asset} in ${currentProjectData.name} Autopilot`}
                </p>
                <div className="flex items-center space-x-2">
                  <Image
                    width={21}
                    height={21}
                    src={currentProjectData.assetIcon}
                    alt={currentProjectData.asset}
                    className="w-6 h-6"
                  />
                  <div className="flex items-center space-x-2">
                    {(balancesLoading || isRefreshingBalances) && (
                      <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    )}
                    <span className="text-xl font-semibold text-gray-900">
                      {formatBalance(currentBalance, currentProjectData.asset)}
                    </span>
                  </div>
                </div>
              </div>

              {/* {depositMode === 'enter' && (
                <button
                  onClick={() => {}}
                  className="bg-[#9159FF] hover:bg-[#7c3aed] text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Top-up</span>
                </button>
              )} */}
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount to {depositMode === 'enter' ? 'Deposit' : 'Withdraw'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={depositAmount}
                  onChange={e => {
                    setDepositAmount(e.target.value.replace(/[^0-9.]/g, ''));
                    setTxSuccess(null);
                  }}
                  placeholder="0.00"
                  disabled={
                    balancesLoading ||
                    isProcessing ||
                    isRefreshingBalances ||
                    (isConnected && !isCorrectNetwork)
                  }
                  className="w-full p-4 pr-20 border border-gray-200 rounded-lg text-xl font-medium focus:ring-1 focus:ring-purple-300 focus:border-purple-400 transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  <Image
                    width={17.5}
                    height={17.5}
                    src={currentProjectData.assetIcon}
                    alt={currentProjectData.asset}
                    className="w-5 h-5"
                  />
                  <span className="text-sm font-medium text-gray-500">
                    {currentProjectData.asset}
                  </span>
                </div>
              </div>
            </div>

            {/* Percentage Buttons */}
            <div className="grid grid-cols-4 gap-3">
              {[25, 50, 75, 100].map(percentage => (
                <button
                  key={percentage}
                  onClick={() => {
                    const amount =
                      percentage === 100
                        ? currentBalance.toString() // Use full balance without toFixed for 100%
                        : ((currentBalance * percentage) / 100).toFixed(
                            currentProjectData.asset === 'USDC' ? 2 : 6
                          );
                    setDepositAmount(amount);
                    setTxSuccess(null);
                  }}
                  disabled={
                    balancesLoading ||
                    isProcessing ||
                    isRefreshingBalances ||
                    (isConnected && !isCorrectNetwork)
                  }
                  className="py-2.5 px-3 bg-gray-100 hover:bg-purple-100 hover:text-purple-700 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed rounded-lg text-sm font-medium text-gray-700 transition-colors"
                >
                  {percentage}%
                </button>
              ))}
            </div>
          </div>

          {/* Deposit Insurance - Added above supply button for Enter mode */}
          {/* {depositMode === 'enter' && (
            <div className="mb-6 p-4 border border-purple-200 rounded-lg bg-purple-50">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        30-Day Deposit Protection
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        Optional coverage for your deposit against smart contract risks
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Powered by</span>
                      <div className="flex items-center justify-center bg-blue-500/10 border border-blue-300/20 rounded-md px-3 py-1.5 h-8">
                        <img src="/projects/openCover.png" alt="OpenCover" className="h-4 w-auto" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={insuranceEnabled}
                          onChange={e => setInsuranceEnabled(e.target.checked)}
                          className="w-4 h-4 text-purple-600 bg-white border-2 border-gray-300 rounded focus:ring-purple-500 focus:ring-2 checked:bg-purple-600 checked:border-purple-600 transition-all"
                        />
                        <span className="text-sm text-gray-700">Enable protection</span>
                      </label>

                      <div className="group relative">
                        <Info className="w-4 h-4 text-gray-400 cursor-help" />
                        <div className="invisible group-hover:visible absolute z-10 w-64 p-2 mt-1 text-xs text-white bg-gray-900 rounded-md shadow-lg -translate-x-1/2 left-1/2">
                          Covers up to 100% of your deposit against smart contract vulnerabilities
                          and protocol risks for 30 days.
                        </div>
                      </div>
                    </div>

                    {depositAmount && parseFloat(depositAmount) > 0 && (
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {(parseFloat(depositAmount) * 0.0024).toLocaleString('en-US', {
                            minimumFractionDigits: currentProjectData.asset === 'USDC' ? 2 : 6,
                            maximumFractionDigits: currentProjectData.asset === 'USDC' ? 2 : 6,
                          })}{' '}
                          {currentProjectData.asset}
                        </div>
                        <div className="text-xs text-gray-500">Coverage cost (0.24%)</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )} */}

          {/* Network Switching Indicator */}
          {isConnected && !isCorrectNetwork && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-yellow-900">Network Mismatch</h4>
                <p className="text-sm text-yellow-700">
                  Your wallet is connected to{' '}
                  {getChainNameFromId(Number(currentProjectData.chainId))}. This vault is deployed
                  on {targetChainName}. Please use the button below to switch networks.
                </p>
              </div>
            </div>
          )}

          {/* Supply Button with Dynamic Text */}
          {!isConnected ? (
            <div className="w-full">
              <ConnectWalletButton />
            </div>
          ) : (
            <button
              onClick={handleMainAction}
              disabled={
                isProcessing ||
                balancesLoading ||
                isRefreshingBalances ||
                (isNewUser && depositMode === 'exit') ||
                (!isCorrectNetwork
                  ? false
                  : !depositAmount ||
                    parseFloat(depositAmount) <= 0 ||
                    (depositMode === 'enter' && parseFloat(depositAmount) > currentBalance) ||
                    (depositMode === 'exit' && parseFloat(depositAmount) > currentBalance))
              }
              className="w-full bg-[#9159FF] hover:bg-[#7c3aed] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-4 rounded-lg transition-colors text-lg flex items-center justify-center space-x-2"
            >
              {isProcessing && <Loader2 className="w-5 h-5 animate-spin" />}
              <span>
                {(() => {
                  if (isProcessing) {
                    return depositMode === 'enter'
                      ? 'Processing Deposit...'
                      : 'Processing Withdrawal...';
                  }

                  if (isNewUser && depositMode === 'enter') {
                    return 'Accept Terms of Use';
                  }

                  if (!isCorrectNetwork) {
                    return `Change to ${targetChainName} Network`;
                  }

                  const amount = parseFloat(depositAmount);
                  const hasAmount = amount > 0;

                  // Check for insufficient balance
                  if (hasAmount && amount > currentBalance) {
                    return depositMode === 'enter'
                      ? 'Insufficient Wallet Balance'
                      : 'Insufficient Vault Balance';
                  }

                  if (depositMode === 'enter') {
                    if (insuranceEnabled && hasAmount) {
                      return `Supply ${formatBalance(amount, currentProjectData.asset)} & Pay Insurance`;
                    } else if (hasAmount) {
                      return `Supply ${formatBalance(amount, currentProjectData.asset)}`;
                    } else {
                      return `Supply ${currentProjectData.asset}`;
                    }
                  } else {
                    if (hasAmount) {
                      return `Withdraw ${formatBalance(amount, currentProjectData.asset)}`;
                    } else {
                      return `Withdraw ${currentProjectData.asset}`;
                    }
                  }
                })()}
              </span>
            </button>
          )}
          {/* Attribution Footer */}
          <div className="flex items-center justify-between pt-3 pb-5">
            {/* Left: Audited */}
            <TooltipProvider>
              <Tooltip isMobile={isMobile} delayDuration={isMobile ? 0 : 500}>
                <TooltipTrigger isMobile={isMobile} asChild>
                  <div className="flex items-center space-x-1.5 cursor-help tooltip-trigger-mobile">
                    <CheckCircle2
                      className={`w-3.5 h-3.5 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}
                    />
                    <span
                      className={`text-xs underline decoration-dotted decoration-1 underline-offset-2 ${
                        isMobile ? 'mt-1' : '-mt-1'
                      } ${isDarkMode ? 'text-muted-foreground' : 'text-gray-500'}`}
                    >
                      Audited
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  isMobile={isMobile}
                  side={isMobile ? 'bottom' : 'top'}
                  className="w-54 bg-gray-900 text-white"
                  sideOffset={isMobile ? 8 : 4}
                  align="center"
                  avoidCollisions={true}
                  collisionPadding={16}
                >
                  <p className="text-xs">
                    This Autopilot setup underwent 3 audits in 2024/2025 from high profile auditing
                    firms.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Right: IPOR Labs Attribution */}
            <TooltipProvider>
              <Tooltip isMobile={isMobile} delayDuration={isMobile ? 0 : 500}>
                <TooltipTrigger isMobile={isMobile} asChild>
                  <div className="flex items-center space-x-2 cursor-help tooltip-trigger-mobile">
                    <span
                      className={`text-xs underline decoration-dotted decoration-1 underline-offset-2 ${
                        isDarkMode ? 'text-muted-foreground' : 'text-gray-500'
                      }`}
                    >
                      Powered by IPOR Labs AG
                    </span>
                    <Image
                      width={14}
                      height={14}
                      src={'/icons/ipor.png'}
                      alt="IPOR Labs"
                      className="w-4 h-4 rounded-full"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  isMobile={isMobile}
                  side={isMobile ? 'bottom' : 'top'}
                  className="w-64 bg-gray-900 text-white"
                  sideOffset={isMobile ? 8 : 4}
                  align="center"
                  avoidCollisions={true}
                  collisionPadding={16}
                >
                  <p className="text-xs text-left">
                    Some wallet providers might show IPOR instead of Autopilot as the contract or
                    entity you&apos;ll be interacting with.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Right: Transaction Preview + Info Cards */}
        <div className="w-full lg:w-[40%] space-y-6">
          {/* Transaction Preview */}
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Preview</h3>

            {/* Network Warning */}
            {isConnected && !isCorrectNetwork && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2 text-yellow-800">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">Network Mismatch</span>
                </div>
                <p className="text-xs text-yellow-700 mt-1">
                  Switch to {targetChainName} to interact with this vault
                </p>
              </div>
            )}

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {depositMode === 'enter' ? 'Deposit Amount' : 'Withdrawal Amount'}
                </span>
                <span className="font-medium">
                  {depositAmount || '0.00'} {currentProjectData.asset}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Current APY</span>
                <span className="font-medium text-green-600">
                  {(currentProjectData.currentAPY * 100).toFixed(2)}%
                </span>
              </div>
              {depositMode === 'enter' && insuranceEnabled && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Insurance Cost</span>
                  <span className="font-medium text-purple-600">
                    {(parseFloat(depositAmount || '0') * 0.0024).toLocaleString('en-US', {
                      minimumFractionDigits: currentProjectData.asset === 'USDC' ? 2 : 6,
                      maximumFractionDigits: currentProjectData.asset === 'USDC' ? 2 : 6,
                    })}{' '}
                    {currentProjectData.asset}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {depositMode === 'enter' ? 'Entry Fee' : 'Exit Fee'}
                </span>
                <span className="font-medium">$0.00</span>
              </div>

              {depositMode === 'enter' ? (
                <div className="border-t border-gray-100 pt-3 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Est. Yearly Earnings</span>
                    <span className="font-medium text-green-600 tabular-nums">
                      +{' '}
                      {formatBalance(
                        parseFloat(depositAmount || '0') * currentProjectData.currentAPY,
                        currentProjectData.asset
                      )}
                    </span>
                  </div>

                  {/* <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700">Yearly Advantage</span>
                      </div>
                      <span className="font-semibold text-green-600 tabular-nums flex">
                        {parseFloat(depositAmount || '0') > 0 ? (
                          `+ ${formatBalance(parseFloat(depositAmount || '0') * (currentProjectData.currentAPY - currentProjectData.secondBestAPY), currentProjectData.asset)}`
                        ) : (
                          <span className="text-xs md:text-sm font-medium text-green-700 text-right">
                            Enter amount to see benefit
                          </span>
                        )}
                      </span>
                    </div>
                    <p className="text-xs text-green-600">
                      vs. Best {currentProjectData.name} Vault
                      {insuranceEnabled ? ' (after insurance cost)' : ''}
                    </p>
                  </div> */}
                </div>
              ) : (
                <div className="border-t border-gray-100 pt-3 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Remaining Balance</span>
                    <span className="font-medium text-gray-900 tabular-nums">
                      {Math.max(
                        0,
                        currentBalance - parseFloat(depositAmount || '0')
                      ).toLocaleString('en-US', {
                        minimumFractionDigits: currentProjectData.asset === 'USDC' ? 2 : 6,
                        maximumFractionDigits: currentProjectData.asset === 'USDC' ? 2 : 6,
                      })}{' '}
                      {currentProjectData.asset}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Forfeited Yearly Earnings</span>
                    <span className="font-medium text-amber-600 tabular-nums">
                      -
                      {(
                        parseFloat(depositAmount || '0') * currentProjectData.currentAPY
                      ).toLocaleString('en-US', {
                        minimumFractionDigits: currentProjectData.asset === 'USDC' ? 2 : 6,
                        maximumFractionDigits: currentProjectData.asset === 'USDC' ? 2 : 6,
                      })}{' '}
                      {currentProjectData.asset}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* {depositMode === 'enter' && (
              <div className="mt-4 pt-3">
                <p className="text-xs text-gray-500">
                  *Based on 30-day{' '}
                  <button
                    onClick={handleOpenBenchmark}
                    className="text-xs text-purple-600 hover:text-purple-700 underline decoration-dotted underline-offset-2 transition-colors"
                  >
                    Benchmark
                  </button>{' '}
                  APY data
                </p>
              </div>
            )} */}
          </div>

          {/* Info Cards */}
          <div className="space-y-4">
            {/* <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-900 mb-1">Audited &amp; Secure</h4>
                  <p className="text-sm text-green-700">
                    Smart contracts have been audited by leading security firms
                  </p>
                </div>
              </div>
            </div> */}

            {/* {depositMode === 'enter' && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <ExternalLink className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1 text-purple-900">Exit Anytime</h4>
                    <p className="text-sm text-purple-700">
                      Withdraw your funds at any time with no lock-up periods
                    </p>
                  </div>
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}
