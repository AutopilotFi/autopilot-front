import { X, Globe, CheckCircle2, UserCheck, AlertTriangle, TrendingDownIcon } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

export default function TermsModal({
  setShowTermsModal,
}: {
  setShowTermsModal: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Acknowledge terms</h2>
          <button
            onClick={() => setShowTermsModal(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Terms Content */}
        <div className="space-y-6">
          <p className="text-gray-700 text-sm leading-relaxed">
            By accessing or using Autopilot&apos;s products and services, I agree to the{' '}
            <span className="text-green-600 underline cursor-pointer hover:text-green-700">
              Terms of Service
            </span>
            {', '}
            <span className="text-green-600 underline cursor-pointer hover:text-green-700">
              Privacy Policy
            </span>
            {', and '}
            <span className="text-green-600 underline cursor-pointer hover:text-green-700">
              Risk Disclosures
            </span>
            {'. I further acknowledge and warrant:'}
          </p>

          {/* Terms List */}
          <div className="space-y-4">
            {/* Restricted Jurisdiction */}
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <p className="text-gray-700 text-sm">
                I am not a resident of, located in, or incorporated in any Restricted Jurisdiction.
                I will not access this site or use our products or services while in any restricted
                locations, nor use a VPN to mask my location.
              </p>
            </div>

            {/* Jurisdiction Permission */}
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
              <p className="text-gray-700 text-sm">
                I am permitted to access this platform and use Autopilot services under the laws of
                my jurisdiction.
              </p>
            </div>

            {/* Sanctioned Person */}
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <UserCheck className="w-4 h-4 text-white" />
              </div>
              <p className="text-gray-700 text-sm">
                I am not a Sanctioned Person (as defined in the Terms of Service) nor acting on
                behalf of one.
              </p>
            </div>

            {/* Experimental Nature */}
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-4 h-4 text-white" />
              </div>
              <p className="text-gray-700 text-sm">
                The Platform, Protocols, and related services are experimental and may result in
                complete loss of funds. Autopilot and its affiliates do not custody or control user
                assets or transactions; all operations are performed by the underlying protocols.
              </p>
            </div>

            {/* DeFi Risks */}
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingDownIcon className="w-4 h-4 text-white" />
              </div>
              <p className="text-gray-700 text-sm">
                I understand the risks of decentralized finance and engaging with blockchain and
                web3 services, including but not limited to technical, operational, market,
                liquidity, and regulatory risks.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-8">
          <button
            onClick={() => setShowTermsModal(false)}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors"
          >
            Reject
          </button>
          <button
            onClick={() => {
              setShowTermsModal(false);
              // Here you would normally handle terms acceptance
            }}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
