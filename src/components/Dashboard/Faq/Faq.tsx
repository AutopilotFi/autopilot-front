export default function Faq() {
  return (
    <div className="bg-white rounded-lg border border-gray-100 p-4 sm:p-6 lg:p-8">
      {/* FAQ Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
          Frequently Asked Questions
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Everything you need to know about USDC Autopilot and how it works
        </p>
      </div>

      {/* FAQ Items */}
      <div className="space-y-6 sm:space-y-8">
        {/* Question 1 - Why use Autopilot */}
        <div>
          <div className="flex items-start space-x-3 mb-3 sm:mb-4">
            <div className="flex-shrink-0 min-w-[24px] h-6 bg-purple-100 text-purple-600 rounded-md flex items-center justify-center text-sm font-semibold px-2">
              1
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">
              Why should I use Autopilot?
            </h3>
          </div>
          <div className="ml-0 sm:ml-9 space-y-3 text-gray-700 text-sm sm:text-base">
            <p>
              On Morpho, the vault offering the highest yield changes frequently. With a single
              deposit into Autopilot, liquidity is continuously allocated across the top-performing
              and most efficient Morpho vaults. This structure provides higher yield potential over
              time than relying on any single standalone Morpho vault.
            </p>
          </div>
        </div>

        {/* Question 2 - Autopilot's edge */}
        <div>
          <div className="flex items-start space-x-3 mb-3 sm:mb-4">
            <div className="flex-shrink-0 min-w-[24px] h-6 bg-purple-100 text-purple-600 rounded-md flex items-center justify-center text-sm font-semibold px-2">
              2
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">
              Where&apos;s Autopilot&apos;s edge — what&apos;s the key benefit?
            </h3>
          </div>
          <div className="ml-0 sm:ml-9 space-y-3 text-gray-700 text-sm sm:text-base">
            <p>
              Imagine there are 10 USDC vaults on Morpho. If you pick manually, your odds of
              selecting the vault that will remain the best over time are only about 10%. Depositing
              into Autopilot increases those odds to nearly 100%, since the algorithm reallocates
              liquidity automatically whenever a vault becomes more efficient.
            </p>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4">
              <p className="font-semibold text-purple-800 text-sm sm:text-base">
                That&apos;s the edge: Autopilot doesn&apos;t try to predict the winner once — it
                keeps finding the winner for you, 24/7.
              </p>
            </div>
          </div>
        </div>

        {/* Question 3 - How it works and characteristics (swapped with question 7) */}
        <div>
          <div className="flex items-start space-x-3 mb-3 sm:mb-4">
            <div className="flex-shrink-0 min-w-[24px] h-6 bg-purple-100 text-purple-600 rounded-md flex items-center justify-center text-sm font-semibold px-2">
              3
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">
              How does USDC Autopilot for Morpho work — what are its characteristics?
            </h3>
          </div>
          <div className="ml-0 sm:ml-9 space-y-3 text-gray-700 text-sm sm:text-base">
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  <strong>Algorithmic allocations only</strong> – no manual or discretionary
                  intervention.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  <strong>Non-custodial</strong> – users always retain ownership of their funds.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  <strong>Native to Morpho</strong> – liquidity is only supplied to curated USDC
                  Morpho vaults (Base chain).
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  <strong>No asset conversion or bridging</strong> – USDC remains USDC, never
                  swapped or moved across chains.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  <strong>On-chain transparency</strong> – every (re)allocation is visible on-chain.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  <strong>High-frequency optimization</strong> – algorithm runs continuous
                  simulations and reallocates in minutes when economically viable.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  <strong>Consistent efficiency</strong> – designed to keep performance near the top
                  of Morpho yields over time, not chase short-term peaks.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Question 4 - Higher APY elsewhere */}
        <div>
          <div className="flex items-start space-x-3 mb-3 sm:mb-4">
            <div className="flex-shrink-0 min-w-[24px] h-6 bg-purple-100 text-purple-600 rounded-md flex items-center justify-center text-sm font-semibold px-2">
              4
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">
              I&apos;m currently seeing a higher APY on one Morpho vault — why not just use that?
            </h3>
          </div>
          <div className="ml-0 sm:ml-9 space-y-3 text-gray-700 text-sm sm:text-base">
            <p>
              A single Morpho vault may display the best rate today, but relative performance shifts
              quickly. Depositing directly into one vault means you must monitor conditions and
              reallocate manually when yields change. Depositing into Autopilot removes this burden
              — it tracks all Morpho vaults in real time and reallocates liquidity automatically,
              aiming for stronger net performance over time.
            </p>
          </div>
        </div>

        {/* Question 5 - How Autopilot differs */}
        <div>
          <div className="flex items-start space-x-3 mb-3 sm:mb-4">
            <div className="flex-shrink-0 min-w-[24px] h-6 bg-purple-100 text-purple-600 rounded-md flex items-center justify-center text-sm font-semibold px-2">
              5
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">
              How does Autopilot differ from other optimizers?
            </h3>
          </div>
          <div className="ml-0 sm:ml-9 space-y-3 text-gray-700 text-sm sm:text-base">
            <p>
              Autopilot is purpose-built for Morpho. Liquidity deposited into Autopilot never leaves
              the Morpho ecosystem, is never bridged across chains, and is never converted into
              other assets. The algorithm reallocates liquidity only among curated Morpho vaults,
              acting as a kind of &quot;yield genie&quot; that continuously seeks out the most
              efficient positions without requiring user intervention.
            </p>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4">
              <p className="font-semibold text-purple-800 text-sm sm:text-base">
                🧞‍♂️ Think of it as your personal yield genie — always working to find the best
                opportunities within Morpho&apos;s trusted ecosystem.
              </p>
            </div>
          </div>
        </div>

        {/* Question 6 - Rebalancing frequency (swapped with question 3) */}
        <div>
          <div className="flex items-start space-x-3 mb-3 sm:mb-4">
            <div className="flex-shrink-0 min-w-[24px] h-6 bg-purple-100 text-purple-600 rounded-md flex items-center justify-center text-sm font-semibold px-2">
              6
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">
              How often does Autopilot rebalance?
            </h3>
          </div>
          <div className="ml-0 sm:ml-9 space-y-3 text-gray-700 text-sm sm:text-base">
            <p>
              The optimization algorithm continuously runs simulations to determine where liquidity
              is most efficiently supplied within Morpho. When conditions shift, Autopilot can
              execute reallocations in minutes, often several times per hour, provided it is
              economically viable. This frequency is unmatched by manual management.
            </p>
          </div>
        </div>

        {/* Question 7 */}
        <div>
          <div className="flex items-start space-x-3 mb-3 sm:mb-4">
            <div className="flex-shrink-0 min-w-[24px] h-6 bg-purple-100 text-purple-600 rounded-md flex items-center justify-center text-sm font-semibold px-2">
              7
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">
              What happens with manually claimable rewards like MORPHO?
            </h3>
          </div>
          <div className="ml-0 sm:ml-9 space-y-3 text-gray-700 text-sm sm:text-base">
            <p>
              Any rewards are claimed automatically by the Autopilot and converted into more of the
              underlying asset, such as USDC, increasing the strength of your position going
              forward.
            </p>
          </div>
        </div>

        {/* Question 8 */}
        <div>
          <div className="flex items-start space-x-3 mb-3 sm:mb-4">
            <div className="flex-shrink-0 min-w-[24px] h-6 bg-purple-100 text-purple-600 rounded-md flex items-center justify-center text-sm font-semibold px-2">
              8
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">
              Does Autopilot handle points programs that we see on the Morpho App?
            </h3>
          </div>
          <div className="ml-0 sm:ml-9 space-y-3 text-gray-700 text-sm sm:text-base">
            <p>
              Yes. Once available and claimable, Autopilot also processes tokens from points
              programs that Morpho vaults are entitled to, converting them into additional
              underlying tokens and boosting overall performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
