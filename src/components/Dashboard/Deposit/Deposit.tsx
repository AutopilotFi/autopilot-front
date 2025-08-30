'use client';
import { ProjectData } from '@/types/globalAppTypes';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/UI/Tooltip';
import { Plus, Minus, Info, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { Dispatch, SetStateAction, useState } from 'react';

export default function Deposit({
  isNewUser,
  currentProjectData,
  setShowTermsModal,
  handleOpenBenchmark,
}: {
  isNewUser: boolean;
  currentProjectData: ProjectData;
  setShowTermsModal: Dispatch<SetStateAction<boolean>>;
  handleOpenBenchmark: () => void;
}) {
  const [depositMode, setDepositMode] = useState<'enter' | 'exit'>('enter');
  const [insuranceEnabled, setInsuranceEnabled] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Deposit Interface */}
        <div className="w-full lg:w-[60%] bg-white rounded-xl pt-5 px-5 pb-0 border border-gray-100">
          {/* Full Width Enter/Exit Toggle */}
          <div className="relative bg-gray-100 rounded-2xl p-1 flex mb-5">
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
                depositMode === 'enter' ? 'text-green-600' : 'text-gray-500 hover:text-gray-700'
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
                depositMode === 'exit' ? 'text-green-600' : 'text-gray-500 hover:text-gray-700'
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

          {/* Available Balance Section with Integrated Top-up */}
          <div className="bg-gray-50 rounded-xl p-4 mb-5">
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
                  <span className="text-xl font-semibold text-gray-900">
                    {depositMode === 'enter'
                      ? currentProjectData.walletBalance.toLocaleString('en-US', {
                          minimumFractionDigits: currentProjectData.asset === 'USDC' ? 2 : 6,
                          maximumFractionDigits: currentProjectData.asset === 'USDC' ? 2 : 6,
                        })
                      : isNewUser
                        ? '0.00'
                        : currentProjectData.autopilotBalance.toLocaleString('en-US', {
                            minimumFractionDigits: currentProjectData.asset === 'USDC' ? 2 : 6,
                            maximumFractionDigits: currentProjectData.asset === 'USDC' ? 2 : 6,
                          })}{' '}
                    {currentProjectData.asset}
                  </span>
                </div>
              </div>

              {/* {depositMode === 'enter' && (
                        <button
                            onClick={() => console.log('Top-up clicked')}
                            className="bg-[#9159FF] hover:bg-[#7c3aed] text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Top-up</span>
                        </button>
                        )} */}
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-4 mb-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount to {depositMode === 'enter' ? 'Deposit' : 'Withdraw'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={depositAmount}
                  onChange={e => setDepositAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                  placeholder="0.00"
                  className="w-full p-4 pr-20 border border-gray-200 rounded-lg text-xl font-medium focus:ring-1 focus:ring-purple-300 focus:border-purple-400 transition-colors"
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
                    const balance =
                      depositMode === 'enter'
                        ? currentProjectData.walletBalance
                        : isNewUser
                          ? 0
                          : currentProjectData.autopilotBalance;
                    const amount = ((balance * percentage) / 100).toFixed(
                      currentProjectData.asset === 'USDC' ? 2 : 6
                    );
                    setDepositAmount(amount);
                  }}
                  className="py-2.5 px-3 bg-gray-100 hover:bg-purple-100 hover:text-purple-700 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                >
                  {percentage}%
                </button>
              ))}
            </div>
          </div>

          {/* Supply Button with Dynamic Text */}
          <button
            onClick={() => {
              if (isNewUser && depositMode === 'enter') {
                setShowTermsModal(true);
                return;
              }
              if (!depositAmount) return;
              console.log(
                `${depositMode === 'enter' ? 'Depositing' : 'Withdrawing'} ${depositAmount} ${currentProjectData.asset}`
              );
              setDepositAmount('');
              setInsuranceEnabled(false);
            }}
            disabled={isNewUser && depositMode === 'exit'}
            className="w-full bg-[#9159FF] hover:bg-[#7c3aed] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-4 rounded-lg transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] mb-5"
          >
            {(() => {
              if (isNewUser && depositMode === 'enter') {
                return 'Accept Terms of Use';
              }

              const amount = parseFloat(depositAmount);
              const hasAmount = amount > 0;

              if (depositMode === 'enter') {
                if (insuranceEnabled && hasAmount) {
                  return `Supply ${amount.toLocaleString('en-US', {
                    minimumFractionDigits: currentProjectData.asset === 'USDC' ? 2 : 4,
                    maximumFractionDigits: currentProjectData.asset === 'USDC' ? 2 : 4,
                  })} ${currentProjectData.asset} & Pay Insurance`;
                } else if (hasAmount) {
                  return `Supply ${amount.toLocaleString('en-US', {
                    minimumFractionDigits: currentProjectData.asset === 'USDC' ? 2 : 4,
                    maximumFractionDigits: currentProjectData.asset === 'USDC' ? 2 : 4,
                  })} ${currentProjectData.asset}`;
                } else {
                  return `Supply ${currentProjectData.asset}`;
                }
              } else {
                if (hasAmount) {
                  return `Withdraw ${amount.toLocaleString('en-US', {
                    minimumFractionDigits: currentProjectData.asset === 'USDC' ? 2 : 4,
                    maximumFractionDigits: currentProjectData.asset === 'USDC' ? 2 : 4,
                  })} ${currentProjectData.asset}`;
                } else {
                  return `Withdraw ${currentProjectData.asset}`;
                }
              }
            })()}
          </button>
        </div>

        {/* Right: Transaction Preview + Info Cards */}
        <div className="w-full lg:w-[40%] space-y-6">
          {/* Transaction Preview */}
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Preview</h3>
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
                <div className="flex items-center space-x-1">
                  <span className="text-gray-600">30d APY*</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-3 h-3 text-gray-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <p className="text-xs">
                          Past performance is indicative only and does not guarantee future results.
                          APY rates are variable and subject to market conditions.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
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
                <span className="font-medium">0.00 USDC</span>
              </div>

              {depositMode === 'enter' ? (
                <div className="border-t border-gray-100 pt-3 space-y-3">
                  <div className="flex justify-between">
                    <div className="flex items-center space-x-1">
                      <span className="text-gray-600">
                        <span className="hidden sm:inline">
                          Projected Yearly Earnings (at current rate)
                        </span>
                        <span className="sm:hidden">Projected Yearly Earnings</span>
                      </span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-3 h-3 text-gray-400 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs">
                            <p className="text-xs">
                              Calculated as a linear projection at the current rate. Actual results
                              depend on compounding cadence, fees, and rate changes.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <span className="font-medium text-green-600 tabular-nums">
                      +
                      {(
                        parseFloat(depositAmount || '0') * currentProjectData.currentAPY
                      ).toLocaleString('en-US', {
                        minimumFractionDigits: currentProjectData.asset === 'USDC' ? 2 : 6,
                        maximumFractionDigits: currentProjectData.asset === 'USDC' ? 2 : 6,
                      })}{' '}
                      {currentProjectData.asset}
                    </span>
                  </div>

                  <div className="hidden bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700">Yearly Advantage</span>
                      </div>
                      <span className="font-semibold text-green-600 tabular-nums">
                        {parseFloat(depositAmount || '0') > 0 ? (
                          `+${(
                            parseFloat(depositAmount || '0') *
                            (currentProjectData.currentAPY - currentProjectData.secondBestAPY)
                          ).toLocaleString('en-US', {
                            minimumFractionDigits: currentProjectData.asset === 'USDC' ? 2 : 6,
                            maximumFractionDigits: currentProjectData.asset === 'USDC' ? 2 : 6,
                          })} ${currentProjectData.asset}`
                        ) : (
                          <span className="text-sm font-medium text-green-700">
                            Enter amount to see benefit
                          </span>
                        )}
                      </span>
                    </div>
                    <p className="text-xs text-green-600">
                      vs. Best {currentProjectData.name} Vault
                      {insuranceEnabled ? ' (after insurance cost)' : ''}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="border-t border-gray-100 pt-3 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Remaining Balance</span>
                    <span className="font-medium text-gray-900 tabular-nums">
                      {Math.max(
                        0,
                        (isNewUser ? 0 : currentProjectData.autopilotBalance) -
                          parseFloat(depositAmount || '0')
                      ).toLocaleString('en-US', {
                        minimumFractionDigits: currentProjectData.asset === 'USDC' ? 2 : 6,
                        maximumFractionDigits: currentProjectData.asset === 'USDC' ? 2 : 6,
                      })}{' '}
                      {currentProjectData.asset}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Projected Forfeited Yearly Earnings</span>
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

            {depositMode === 'enter' && (
              <div className="mt-4 pt-3 space-y-2">
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
                <p className="text-xs text-gray-500 leading-relaxed max-w-full">
                  <span className="hidden sm:inline">
                    Projection is illustrative. Based on 30-day APY of{' '}
                    {(currentProjectData.currentAPY * 100).toFixed(2)}% and subject to compounding
                    frequency and rate changes.
                  </span>
                  <span className="sm:hidden">
                    Projection only; rates & compounding may change.
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Info Cards */}
          {/* <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <div className="flex items-start space-x-3">
                        <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-green-900 mb-1">Audited &amp; Secure</h4>
                            <p className="text-sm text-green-700">
                            Smart contracts have been audited by leading security firms
                            </p>
                        </div>
                        </div>
                    </div>

                    {depositMode === 'enter' && (
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
                    )}
                </div> */}
        </div>
      </div>
    </div>
  );
}
