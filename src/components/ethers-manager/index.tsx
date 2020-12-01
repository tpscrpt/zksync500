import { ethers } from "ethers"
import * as React from "react"
import { useState } from "react"
import { EthersContext } from "../../hooks/ethers-context"
import { EthersType } from "../../hooks/ethers-context/types"

type Props = {
  children: JSX.Element[]
}

export function EthersManager(props: Props): JSX.Element {
  const [ethersState, setEthersState] = useState<EthersType>({ network: "rinkeby", address: "0xd965Cd540d2B80e7ef2840Ff097016B3A0e930fC" })

  // TODO: ethers provider change set network

  return (
    <EthersContext.Provider value={ethersState}>
      {...props.children}
    </EthersContext.Provider>
  )
}