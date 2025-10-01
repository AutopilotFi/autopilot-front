import { Info } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import { Tab } from '../Dashboard';

export default function Faq({
  isDarkMode,
  setActiveTab,
}: {
  isDarkMode?: boolean;
  setActiveTab: Dispatch<SetStateAction<Tab>>;
}) {
  return (
    <div
      className={`rounded-xl border p-6 md:p-8 ${
        isDarkMode ? 'bg-card border-border' : 'bg-white border-gray-100'
      }`}
    >
      <div className="mb-8">
        <h3
          className={`text-xl font-semibold mb-2 ${
            isDarkMode ? 'text-foreground' : 'text-gray-900'
          }`}
        >
          Frequently Asked Questions
        </h3>
        <p className={`${isDarkMode ? 'text-muted-foreground' : 'text-gray-600'}`}>
          Everything you need to know about this USDC Autopilot and how it works
        </p>
      </div>

      <div className="space-y-8">
        {/* Question 1 */}
        <div>
          <div className="flex items-center space-x-4 mb-3">
            <div className="w-8 h-8 bg-[#9159FF] text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ">
              1
            </div>
            <h4 className={`font-semibold ${isDarkMode ? 'text-foreground' : 'text-gray-900'}`}>
              Why should I use this Autopilot?
            </h4>
          </div>
          <p
            className={`leading-relaxed ${isDarkMode ? 'text-muted-foreground' : 'text-gray-700'}`}
          >
            On Morpho, the vault offering the highest yield changes frequently. With a single
            deposit into this Autopilot, liquidity is continuously allocated across the most
            efficient USDC vaults on Morpho Base. This setup is designed to provide stronger yield
            potential over time than relying on a single standalone vault.
          </p>
        </div>

        {/* Question 2 */}
        <div>
          <div className="flex items-center space-x-4 mb-3">
            <div className="w-8 h-8 bg-[#9159FF] text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
              2
            </div>
            <h4 className={`font-semibold  ${isDarkMode ? 'text-foreground' : 'text-gray-900'}`}>
              Where is this Autopilot&apos;s edge - what is the key benefit?
            </h4>
          </div>
          <div>
            <p
              className={`leading-relaxed mb-4 ${
                isDarkMode ? 'text-muted-foreground' : 'text-gray-700'
              }`}
            >
              Imagine there are 10 USDC vaults on Morpho Base. Picking manually means the chance of
              selecting the vault that will remain the best over time is only about 10%. Depositing
              into this Autopilot increases those odds to nearly 100%, since the algorithm
              reallocates liquidity automatically whenever a vault becomes more efficient.
            </p>
            <p
              className={`leading-relaxed ${
                isDarkMode ? 'text-muted-foreground' : 'text-gray-700'
              }`}
            >
              That is the edge: this Autopilot does not try to predict the winner once, it keeps
              reallocating toward whichever vaults are most efficient on Base, 24/7.
            </p>
          </div>
        </div>

        {/* Question 3 */}
        <div>
          <div className="flex items-center space-x-4 mb-3">
            <div className="w-8 h-8 bg-[#9159FF] text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ">
              3
            </div>
            <h4 className={`font-semibold  ${isDarkMode ? 'text-foreground' : 'text-gray-900'}`}>
              How does this USDC Autopilot for Morpho work - what are its characteristics?
            </h4>
          </div>
          <div
            className={`leading-relaxed space-y-2 ${
              isDarkMode ? 'text-muted-foreground' : 'text-gray-700'
            }`}
          >
            <p>
              <strong>Algorithmic allocations only</strong> - no manual or discretionary
              intervention.
            </p>
            <p>
              <strong>Non-custodial</strong> - funds remain under the user&apos;s ownership.
            </p>
            <p>
              <strong>Native to Morpho Base</strong> - liquidity is only supplied to curated USDC
              vaults on Base.
            </p>
            <p>
              <strong>No asset conversion or bridging</strong> - USDC remains USDC at all times,
              never converted into other stablecoins or assets.
            </p>
            <p>
              <strong>On-chain transparency</strong> - every (re)allocation is visible on-chain.
            </p>
            <p>
              <strong>High-frequency optimization</strong> - the algorithm runs continuous
              simulations and reallocates in minutes when economically viable.
            </p>
            <p>
              <strong>Consistent efficiency</strong> - designed to keep performance near the top of
              Morpho yields over time, not chase short-term peaks.
            </p>
          </div>
        </div>

        {/* Question 4 */}
        <div>
          <div className="flex items-center space-x-4 mb-3">
            <div className="w-8 h-8 bg-[#9159FF] text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ">
              4
            </div>
            <h4 className={`font-semibold  ${isDarkMode ? 'text-foreground' : 'text-gray-900'}`}>
              I&apos;m currently seeing a higher APY on one Morpho vault - why not just use that?
            </h4>
          </div>
          <p
            className={`leading-relaxed ${isDarkMode ? 'text-muted-foreground' : 'text-gray-700'}`}
          >
            A single Morpho vault on Base may show the best rate today, but relative performance
            shifts quickly. Depositing directly into one vault requires constant monitoring and
            manual reallocations when yields change. Depositing into this Autopilot removes that
            burden, as it tracks all USDC vaults on Base in real time and reallocates liquidity
            automatically, aiming for stronger net performance over time.
          </p>
        </div>

        {/* Question 5 */}
        <div>
          <div className="flex items-center space-x-4 mb-3">
            <div className="w-8 h-8 bg-[#9159FF] text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ">
              5
            </div>
            <h4 className={`font-semibold  ${isDarkMode ? 'text-foreground' : 'text-gray-900'}`}>
              How does this Autopilot differ from other optimizers?
            </h4>
          </div>
          <div>
            <p
              className={`leading-relaxed mb-4 ${
                isDarkMode ? 'text-muted-foreground' : 'text-gray-700'
              }`}
            >
              This Autopilot is purpose-built for Morpho on Base. Liquidity never leaves the Morpho
              ecosystem, is never bridged across chains, and is not converted into other assets.
              USDC always remains USDC within this setup. The algorithm reallocates liquidity only
              among curated USDC vaults on Base, continuously seeking out the most efficient
              positions without requiring manual input.
            </p>
            <p
              className={`leading-relaxed ${
                isDarkMode ? 'text-muted-foreground' : 'text-gray-700'
              }`}
            >
              Think of it as a kind of yield engine - always working to identify the best available
              opportunities within Morpho&apos;s trusted USDC vaults on Base.
            </p>
          </div>
        </div>

        {/* Question 6 */}
        <div>
          <div className="flex items-center space-x-4 mb-3">
            <div className="w-8 h-8 bg-[#9159FF] text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ">
              6
            </div>
            <h4 className={`font-semibold  ${isDarkMode ? 'text-foreground' : 'text-gray-900'}`}>
              How often does this Autopilot rebalance?
            </h4>
          </div>
          <div>
            <p
              className={`leading-relaxed mb-4 ${
                isDarkMode ? 'text-muted-foreground' : 'text-gray-700'
              }`}
            >
              The optimization algorithm continuously runs simulations to determine where liquidity
              is most efficiently supplied within Morpho. When conditions shift, this Autopilot can
              execute reallocations in minutes, often several times per hour, provided it is
              economically viable. This frequency is far higher than what can be achieved with
              manual management.
            </p>
            <button
              onClick={() => {
                setActiveTab('allocations');
                window.scrollTo(0, 0);
              }}
              className="px-4 py-2 bg-[#9159FF] hover:bg-[#7c3aed] text-white text-sm font-medium rounded-lg transition-colors"
            >
              Open <span className="font-bold">Allocation</span> History
            </button>
          </div>
        </div>

        {/* Question 7 */}
        <div>
          <div className="flex items-center space-x-4 mb-3">
            <div className="w-8 h-8 bg-[#9159FF] text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ">
              7
            </div>
            <h4 className={`font-semibold  ${isDarkMode ? 'text-foreground' : 'text-gray-900'}`}>
              What happens with manually claimable rewards like MORPHO?
            </h4>
          </div>
          <p className={`leading-relaxed${isDarkMode ? 'text-muted-foreground' : 'text-gray-700'}`}>
            Any rewards are claimed automatically by this Autopilot and converted into more of the
            underlying asset - always USDC, not other stablecoins or assets - which strengthens the
            overall position.
          </p>
        </div>

        {/* Question 8 */}
        <div id="faq-questions-8-9">
          <div className="flex items-center space-x-4 mb-3">
            <div className="w-8 h-8 bg-[#9159FF] text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ">
              8
            </div>
            <h4 className={`font-semibold  ${isDarkMode ? 'text-foreground' : 'text-gray-900'}`}>
              Does this Autopilot handle points programs that appear on the Morpho App?
            </h4>
          </div>
          <div>
            <p
              className={`leading-relaxed mb-3 ${
                isDarkMode ? 'text-muted-foreground' : 'text-gray-700'
              }`}
            >
              Yes. Once available and claimable, this Autopilot processes tokens from points
              programs that Morpho vaults are entitled to, converting them into additional
              underlying tokens and boosting overall performance, while the base asset remains USDC.
            </p>
            <div
              className={`border rounded-lg p-3 flex items-center space-x-3 ${
                isDarkMode ? 'bg-green-900/30 border-green-700/50' : 'bg-green-50 border-green-200'
              }`}
            >
              <div className="flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <Info className="w-3 h-3 text-white" />
              </div>
              <p
                className={`text-sm font-medium ${
                  isDarkMode ? 'text-green-300' : 'text-green-800'
                }`}
              >
                Check the APY indicator in the top right corner of the product to see potential
                exposure to active points programs.
              </p>
            </div>
          </div>
        </div>

        {/* Question 9 */}
        <div>
          <div className="flex items-center space-x-4 mb-3">
            <div className="w-8 h-8 bg-[#9159FF] text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ">
              9
            </div>
            <h4 className={`font-semibold  ${isDarkMode ? 'text-foreground' : 'text-gray-900'}`}>
              Will I receive all the points programs shown in the APY breakdown?
            </h4>
          </div>
          <div>
            <p
              className={`leading-relaxed mb-3 ${
                isDarkMode ? 'text-muted-foreground' : 'text-gray-700'
              }`}
            >
              The APY breakdown lists all points programs currently available across USDC Morpho
              vaults on Base. This Autopilot&apos;s algorithm prioritizes onchain yield efficiency
              first, so liquidity is routed to the vaults where yield production is strongest.
            </p>
            <p
              className={`leading-relaxed mb-3 ${
                isDarkMode ? 'text-muted-foreground' : 'text-gray-700'
              }`}
            >
              When allocations flow into vaults with active points programs, rewards that later
              become claimable at TGE or airdrop are processed by this Autopilot, converted into
              additional USDC, and added to the position. If allocations are not directed to vaults
              with points programs, those programs will simply not apply to Autopilot users.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
