import daiLogo from "../assets/token-logos/dai.svg";
import ethLogo from "../assets/token-logos/eth.svg";

export const supportedTokens: Record<string, { decimals: number; icon: string }> = {
  DAI: {
    decimals: 18,
    icon: daiLogo,
  },
  ETH: {
    decimals: 18,
    icon: ethLogo,
  },
};
