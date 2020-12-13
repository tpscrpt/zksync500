import { ethers } from "hardhat";
import { expect } from "chai";
import { Short } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { tokens } from "../config/rinkeby";
import { formatBytes32String } from "ethers/lib/utils";

// eslint-disable-next-line
type Parameters<T> = T extends (...args: infer T) => any ? T : never;

describe("Short", () => {
  let testData: Parameters<Short["create"]>;
  let updatedTestData: Parameters<Short["update"]>;

  let short: Short;
  let signers: SignerWithAddress[];

  beforeEach(async () => {
    signers = await ethers.getSigners();
    const shortFactory = await ethers.getContractFactory("Short");
    short = (await shortFactory.deploy()) as Short;
    testData = [
      formatBytes32String("test-short"),
      "10000000000000000000",
      signers[1].address,
      tokens["ETH"],
    ];
    updatedTestData = [
      formatBytes32String("test-short"),
      "5000000000000000000",
      signers[1].address,
      tokens["ETH"],
    ];
  });

  it("Should allow creating a short and converting it", async () => {
    await short.create(...testData);
    const { amount, to, token } = await short.convert(testData[0]);
    expect([amount.toString(), to, token]).to.all.members(testData.slice(1));
  });

  it("Should not allow creating one which already exists", async () => {
    const mustFail = true;
    try {
      await short.create(...testData);
      await short.create(...testData);
      if (mustFail) throw "MUST_FAIL";
    } catch (e) {
      expect(mustFail).to.eq(true);
      expect(e.message).to.match(/SHORT_ALREADY_EXISTS/);
    }
  });

  it("Should allow the creator to edit it", async () => {
    await short.create(...testData);
    await short.update(...updatedTestData);
    const { amount } = await short.convert(testData[0]);
    expect(amount.toString()).to.eq(updatedTestData[1]);
  });

  it("Should not allow someone else to edit it", async () => {
    const mustFail = true;
    try {
      await short.create(...testData);
      await short.connect(signers[1]).update(...updatedTestData);
      if (mustFail) throw "MUST_FAIL";
    } catch (e) {
      expect(mustFail).to.eq(true);
      expect(e.message).to.match(/ONLY_CREATOR_CAN_UPDATE/);
    }
  });

  it("Should allow setting a new creator and that creator to edit it", async () => {
    await short.create(...testData);
    await short.changeCreator(testData[0], signers[2].address);
    await short.connect(signers[2]).update(...updatedTestData);
    const { amount } = await short.convert(testData[0]);
    expect(amount.toString()).to.eq(updatedTestData[1]);
  });
});
