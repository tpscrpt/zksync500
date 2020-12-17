import { useWeb3React } from "@web3-react/core";
import * as React from "react";
import { createContext, useEffect } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { Short } from "@zksync500/ethereum/typechain/Short";
import { abi } from "@zksync500/ethereum/artifacts/contracts/Short.sol/Short.json";
import { ethers } from "ethers";

export const ContractContext = createContext<Short | undefined>(undefined);

const contractAddress: Record<number, string> = {
  1: "0x850F436e04a2762f7C179E2D1a84E1Fd9735Cd50",
  3: "0x0BD9E23AA7bCE0Fe062684544CA88530Df566532",
  4: "0xfa1ff35dedc9B145107b3c463c7210063f3391C3",
};

export const ContractProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const { library, active, chainId } = useWeb3React<Web3Provider>();
  const [contract, setContract] = React.useState<Short>();

  useEffect(() => {
    if (active && !contract && library && chainId) {
      setContract(new ethers.Contract(contractAddress[chainId], abi, library) as Short);
    }
  }, [active]);

  return <ContractContext.Provider value={contract}>{children}</ContractContext.Provider>;
};
