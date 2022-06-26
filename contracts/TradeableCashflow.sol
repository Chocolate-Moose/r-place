//SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import {RedirectAll, ISuperToken, IConstantFlowAgreementV1, ISuperfluid} from "./RedirectAll.sol";

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/* Hello and welcome to your first Super App!
* In order to deploy this contract, you'll need a few things
* Get the deployed SF addresses here: https://docs.superfluid.finance/superfluid/resources/networks
* or using the js-sdk as shown here https://docs.superfluid.finance/superfluid/protocol-tutorials/setup-local-environment
*/

contract TradeableCashflow is ERC721, RedirectAll {

  constructor (
    address owner,
    string memory _name,
    string memory _symbol,
    ISuperfluid host,
    ISuperToken acceptedToken
  )
    ERC721 ( _name, _symbol ) {
      // Base URI for computing {tokenURI}. If set, the resulting URI for each
      // token will be the concatenation of the `baseURI` and the `tokenId`. Empty
      // by default, can be overridden in child contracts.
      function _baseURI() internal override view virtual returns (string memory) {
        return ""; //TODO: netlify name. It will store as 
      }
    }
    RedirectAll (
      host,
      acceptedToken,
      owner
    )
    {
      _mint(owner, 1); // TODO: Get a unique tokenID.
    }
}