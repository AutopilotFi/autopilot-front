import Portfolio from '@/components/Portfolio';
import { PortfolioData, LatestEarningData } from '@/types/globalAppTypes';

const getPortfolioData = () => {
  const portfolioData: PortfolioData = [
    {
      protocol: 'morpho',
      asset: 'USDC',
      balance: 206915,
      usdValue: 206915,
      earnings: 9309,
      earningsUsd: 9309,
      apy: 8.75,
      status: 'active',
    },
    {
      protocol: 'morpho',
      asset: 'ETH',
      balance: 77.5,
      usdValue: 310000,
      earnings: 0.775,
      earningsUsd: 3100,
      apy: 3.83,
      status: 'active',
    },
    {
      protocol: 'morpho',
      asset: 'cbBTC',
      balance: 0.4,
      usdValue: 40000,
      earnings: 0.008,
      earningsUsd: 800,
      apy: 1.91,
      status: 'active',
    },
  ];
  const latestEarningsData: LatestEarningData = [
    {
      asset: 'USDC',
      amount: 22.35,
      value: 22.35,
      time: '1hr',
      icon: '/coins/usdc.png',
      protocol: 'morpho',
    },
    {
      asset: 'ETH',
      amount: 0.0019,
      value: 7.6,
      time: '2hr',
      icon: '/coins/eth.png',
      protocol: 'morpho',
    },
    {
      asset: 'cbBTC',
      amount: 0.000018,
      value: 1.8,
      time: '3hr',
      icon: '/coins/cbBTC.png',
      protocol: 'morpho',
    },
    {
      asset: 'USDC',
      amount: 18.92,
      value: 18.92,
      time: '4hr',
      icon: '/coins/usdc.png',
      protocol: 'morpho',
    },
    {
      asset: 'ETH',
      amount: 0.0015,
      value: 6.0,
      time: '5hr',
      icon: '/coins/eth.png',
      protocol: 'morpho',
    },
    {
      asset: 'USDC',
      amount: 15.67,
      value: 15.67,
      time: '6hr',
      icon: '/coins/usdc.png',
      protocol: 'morpho',
    },
    {
      asset: 'cbBTC',
      amount: 0.000015,
      value: 1.5,
      time: '7hr',
      icon: '/coins/cbBTC.png',
      protocol: 'morpho',
    },
    {
      asset: 'USDC',
      amount: 19.82,
      value: 19.82,
      time: '8hr',
      icon: '/coins/usdc.png',
      protocol: 'morpho',
    },
    {
      asset: 'ETH',
      amount: 0.0021,
      value: 8.4,
      time: '9hr',
      icon: '/coins/eth.png',
      protocol: 'morpho',
    },
    {
      asset: 'cbBTC',
      amount: 0.00002,
      value: 2.0,
      time: '10hr',
      icon: '/coins/cbBTC.png',
      protocol: 'morpho',
    },
  ];
  return { portfolioData, latestEarningsData };
};

export default function PortfolioPage() {
  const { portfolioData, latestEarningsData } = getPortfolioData();
  return <Portfolio portfolioData={portfolioData} latestEarningsData={latestEarningsData} />;
}
