# r/eth-place

## Made for ethNYC by Jessica, Vico, and Winston

### Problem Statement
Imagine [r/place](https://www.reddit.com/r/place/), but to claim and color a pixel you send crypto.  Once you stop sending crypto, you no longer have ownership of that pixel and someone else can claim and color it.

### Software Details
We use React for the frontend and Superfluid for continuous transactions and money streaming.  We use Solidity to mint our NFT and for our smart contract.

### Next Steps
If we had more time and more sleep, we would have gotten full functionality for our smart contract and minted our NFT.  We would also have updated the balance display on the frontend so that it updated continuously based on the wallet balance.

### How to Run
The first things you need to do are cloning this repository and installing its
dependencies:

```sh
git clone https://github.com/Chocolate-Moose/r-place.git
cd r-place
npm install
```

Once installed, let's run Hardhat's testing network:

```sh
npx hardhat node
```

Then, on a new terminal, go to the repository's root folder and run this to
deploy your contract:

```sh
npx hardhat run scripts/deploy.js --network localhost
```

Finally, we can run the frontend with:

```sh
cd frontend
npm install
npm start
```
