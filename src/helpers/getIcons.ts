export const getProtocolIcon = (protocol: string) => {
  return protocol === 'morpho' ? '/projects/morpho.png' : '/projects/euler.png';
};

export const getAssetIcon = (asset: string): string => {
  switch (asset) {
    case 'USDC':
      return '/coins/usdc.svg';
    case 'ETH':
      return '/coins/eth.svg';
    case 'cbBTC':
      return '/coins/cbBTC.svg';
    default:
      return '/coins/usdc.svg';
  }
};
