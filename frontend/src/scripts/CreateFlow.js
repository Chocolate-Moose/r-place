const ethers = require("ethers");
const { Framework } = require("@superfluid-finance/sdk-core");
const { defaultAbiCoder } = require("ethers/lib/utils");

const receiver = "0x75825e4F250230375Aa664e456C94eED28737F20"
const flowRate = 385802469135802; // $1k per month

export async function createNewFlow(flowRate) {

  //NOTE: this is currently for usage on the Testnet 
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const sender= provider.getSigner();
  const chainId = await window.ethereum.request({ method: "eth_chainId" });
  const senderAddress = await sender.getAddress();

  const sf = await Framework.create({
    chainId: Number(chainId),
    provider: provider,
    customSubgraphQueriesEndpoint: "",
    dataMode: "WEB3_ONLY"
  });

  // Example message with the first three pixels changed to red, green, blue
  const message = defaultAbiCoder.encode(['uint[]', 'string[]'], [[0, 1, 2], ["#FF0000", "#00FF00", "#0000FF"]]);

  const DAIxContract = await sf.loadSuperToken("fDAIx");
  const DAIx = DAIxContract.address;
  
  try {
    const createFlowOperation = sf.cfaV1.createFlow({
      receiver: receiver,
      flowRate: flowRate,
      superToken: DAIx,
      userData: `${message}`
    });

    console.log("Creating your stream...");

    const result = await createFlowOperation.exec(sender);
    console.log(result);
    console.log(defaultAbiCoder.decode(['uint[]', 'string[]'], message))

    console.log(
      `Congrats - you've just created a money stream!
        View Your Stream At: https://app.superfluid.finance/dashboard/${receiver}
        Chain ID: ${chainId}
        Super Token: DAIx
        Sender: ${senderAddress}
        Receiver: ${receiver}
        FlowRate: ${flowRate}
        `
    );
  } catch (error) {
    console.log(
      "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
    );
    console.error(error);
  }
}