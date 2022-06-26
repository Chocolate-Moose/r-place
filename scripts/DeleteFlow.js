const ethers = require("ethers");
const { Framework } = require("@superfluid-finance/sdk-core");
const { defaultAbiCoder } = require("ethers/lib/utils");

const receiver = "0x75825e4F250230375Aa664e456C94eED28737F20"

async function deleteFlow() {

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

	const DAIxContract = await sf.loadSuperToken("fDAIx");
	const DAIx = DAIxContract.address;
			
	const deleteFlowOperation = sf.cfaV1.deleteFlow({
		sender: senderAddress,
		receiver: receiver,
		superToken: DAIx,
		userData: `0x` // no message on deletion
	});

	console.log('Cancelling existing money stream...');

	await deleteFlowOperation.exec(sender).then(console.log);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });