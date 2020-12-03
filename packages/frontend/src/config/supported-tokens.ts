import daiLogo from "../assets/token-logos/dai.svg";
import ethLogo from "../assets/token-logos/eth.svg";
import { supportedTokens } from "@zksync500/shared/supported-tokens";

export const supportedTokensWithIcons: Record<
  keyof typeof supportedTokens,
  typeof supportedTokens[keyof typeof supportedTokens] & { icon: typeof daiLogo }
> = {
  DAI: {
    decimals: 18,
    icon: daiLogo,
  },
  ETH: {
    decimals: 18,
    icon: ethLogo,
  },
};
