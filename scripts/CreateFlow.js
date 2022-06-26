import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Spinner,
  Card
} from "react-bootstrap";
import "./createFlow.css";

const ethers = require("ethers");
const { Framework } = require("@superfluid-finance/sdk-core");
const { defaultAbiCoder } = require("ethers/lib/utils");

const receiver = "0x75825e4F250230375Aa664e456C94eED28737F20"
const flowRate = 385802469135802; // $1k per month

async function createNewFlow(flowRate) {

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

export const CreateFlow = () => {
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts"
      });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      // let account = currentAccount;
      // Setup listener! This is for the case where a user comes to our site
      // and connected their wallet for the first time.
      // setupEventListener()
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });
    const chain = await window.ethereum.request({ method: "eth_chainId" });
    let chainId = chain;
    console.log("chain ID:", chain);
    console.log("global Chain Id:", chainId);
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
      // Setup listener! This is for the case where a user comes to our site
      // and ALREADY had their wallet connected + authorized.
      // setupEventListener()
    } else {
      console.log("No authorized account found");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  function CreateButton({ isLoading, children, ...props }) {
    return (
      <Button variant="success" className="button" {...props}>
        {isButtonLoading ? <Spinner animation="border" /> : children}
      </Button>
    );
  }

  return (
    <div>
      <h2>Create a Flow</h2>
      {currentAccount === "" ? (
        <button id="connectWallet" className="button" onClick={connectWallet}>
          Connect Wallet
        </button>
      ) : (
        <Card className="connectedWallet">
          {`${currentAccount.substring(0, 4)}...${currentAccount.substring(
            38
          )}`}
        </Card>
      )}
      <Form>
        <CreateButton
          onClick={() => {
            setIsButtonLoading(true);
            createNewFlow(flowRate);
            setTimeout(() => {
              setIsButtonLoading(false);
            }, 1000);
          }}
        >
          Click to Create Your Stream
        </CreateButton>
      </Form>

      <div className="description">
        <p>
          Go to the CreateFlow.js component and look at the <b>createFlow() </b>
          function to see under the hood
        </p>
        <div className="calculation">
          <p>Your flow will be equal to:</p>
          <p>
            <b>${flowRate !== " " ? flowRate : 0}</b> DAIx/month
          </p>
        </div>
      </div>
    </div>
  );
};
