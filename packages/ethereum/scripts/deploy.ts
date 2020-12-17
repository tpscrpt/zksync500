import { formatBytes32String } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { tokens } from "../config/rinkeby";
import { Short } from "../typechain/Short";

async function deploy() {
  try {
    const shortFactory = await ethers.getContractFactory("Short");
    const short = (await shortFactory.deploy()) as Short;
    console.log("done deploying");
    const firstTx = await short.create(
      formatBytes32String(""),
      "10000000000000000",
      "0xC8F8abEf84Cd3fFf8fEE6ea8b6e3A85A871B0c04",
      tokens["ETH"],
      "WORK",
    );
    const firstTxReceipt = await firstTx.wait();
    process.exit(firstTxReceipt.status ? 0 : 1);
  } catch (e) {
    console.log(e);
  }
}

deploy();
