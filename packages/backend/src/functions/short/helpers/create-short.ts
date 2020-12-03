import crypto from "crypto";
import { ethers } from "ethers";

export function createShort(): string {
  const hexString = "0x" + crypto.randomBytes(16).toString("hex");
  return ethers.utils.base58.encode(hexString);
}
