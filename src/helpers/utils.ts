import { CHAIN_IDS, MATICSCAN_URL, ARBISCAN_URL, BASESCAN_URL, ZKSYNCSCAN_URL, ETHERSCAN_URL } from "@/consts/constants";
import BigNumber from "bignumber.js";

/**
 * Formats a number into a human-readable currency string with abbreviations
 * @param value - The number to format
 * @param currency - The currency symbol (default: '$')
 * @param decimals - Number of decimal places to show (default: 2)
 * @returns Formatted string like "$3.67M", "$1.2B", etc.
 */
export const formatCurrency = (
  value: number, 
  currency: string = '$', 
  decimals: number = 2
): string => {
  if (value === 0) return `${currency}0`;
  
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  
  if (absValue >= 1e12) {
    return `${sign}${currency}${(absValue / 1e12).toFixed(decimals)}T`;
  } else if (absValue >= 1e9) {
    return `${sign}${currency}${(absValue / 1e9).toFixed(decimals)}B`;
  } else if (absValue >= 1e6) {
    return `${sign}${currency}${(absValue / 1e6).toFixed(decimals)}M`;
  } else if (absValue >= 1e3) {
    return `${sign}${currency}${(absValue / 1e3).toFixed(decimals)}K`;
  } else {
    return `${sign}${currency}${absValue.toFixed(decimals)}`;
  }
};

/**
 * Formats a percentage value
 * @param value - The percentage value (0-100)
 * @param decimals - Number of decimal places to show (default: 2)
 * @returns Formatted string like "8.75%"
 */
export const formatPercentage = (
  value: number, 
  decimals: number = 2
): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Formats a number with locale-specific formatting
 * @param value - The number to format
 * @param locale - The locale to use (default: 'en-US')
 * @param options - Intl.NumberFormatOptions
 * @returns Formatted string
 */
export const formatLocaleNumber = (
  value: number,
  locale: string = 'en-US',
  options?: Intl.NumberFormatOptions
): string => {
  return new Intl.NumberFormat(locale, options).format(value);
};

export const getExplorerLink = (chainId: number): string => {
  switch (chainId) {
    case CHAIN_IDS.POLYGON:
      return MATICSCAN_URL;
    case CHAIN_IDS.ARBITRUM:
      return ARBISCAN_URL;
    case CHAIN_IDS.BASE:
      return BASESCAN_URL;
    case CHAIN_IDS.ZKSYNC:
      return ZKSYNCSCAN_URL;
    default:
      return ETHERSCAN_URL;
  }
};

export const fromWei = (wei: string | number, decimals: number, decimalsToDisplay = 2, format = false): string | number => {
  let result: string | number = '0';

  try {
    if (wei != null) {
      const weiAmountInBN = new BigNumber(wei);

      if (!weiAmountInBN.isNaN() && weiAmountInBN.isGreaterThan(0)) {
        // Ensure decimalsToDisplay is a valid number
        const displayDecimals = parseInt(decimalsToDisplay.toString(), 10);
        if (!isNaN(displayDecimals)) {
          result = weiAmountInBN
            .div(new BigNumber(10).exponentiatedBy(decimals))
            .toFixed(displayDecimals);

          if (format) {
            result = parseFloat(result);
          }
        } else {
          console.error('Invalid value for decimalsToDisplay:', decimalsToDisplay);
        }
      }
    }
  } catch (error) {
    console.error('Error converting wei to decimal:', error);
  }

  return result;
};

export const formatNumber = (value: number, decimals = 2): string => {
  return value.toFixed(decimals);
};

export const formatFrequency = (value: number): string => {
  if (value === 0 || !isFinite(value)) {
    return '-';
  }

  const days = Math.floor(value / (24 * 3600));
  const hours = Math.floor((value % (24 * 3600)) / 3600);
  const minutes = Math.floor((value % 3600) / 60);

  const daysText = days > 0 ? `${days}d` : '';
  const hoursText = hours > 0 ? `${hours}h` : '';
  const minutesText = minutes > 0 ? `${minutes}m` : '';

  return [daysText, hoursText, minutesText].filter(Boolean).join(' ');
};

export const formatDate = (value: number): string => {
  const date = new Date(value * 1000); // Convert seconds to milliseconds
  const year = date.getFullYear();
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const monthNum = date.getMonth();
  const month = monthNames[monthNum];
  const day = date.getDate();

  return `${month} ${day} ${year}`;
};

export const formatBalance = (balance: number, asset: string, decimals: number = 6): string => {
  if (balance > 0 && balance < 0.00001) {
    return `<0.00001 ${asset}`;
  } else if (balance === 0 && balance > -0.00001) {
    return `0.00 ${asset}`;
  }
  
  return `${balance.toLocaleString('en-US', {
    minimumFractionDigits: asset === 'USDC' ? 2 : Math.min(decimals, 6),
    maximumFractionDigits: asset === 'USDC' ? 2 : Math.min(decimals, 6)
  })} ${asset}`;
};

export const toWei = (token: string | number, decimals: number, decimalsToDisplay?: number): string => {
  if (token != null) {
    token = token.toString();
  }
  let tokenAmountInBN = new BigNumber(token);

  if (typeof decimals !== 'undefined' && tokenAmountInBN.isGreaterThan(0)) {
    tokenAmountInBN = tokenAmountInBN.multipliedBy(new BigNumber(10).exponentiatedBy(decimals));

    if (typeof decimalsToDisplay !== 'undefined') {
      tokenAmountInBN = tokenAmountInBN.decimalPlaces(decimalsToDisplay);
    }

    return tokenAmountInBN.toFixed();
  }
  return '0';
};
