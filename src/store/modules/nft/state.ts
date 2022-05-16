import { XrplClient } from "xrpl-client";
import { NFT } from "../../../models/NFT";

export interface SharedNFTs {
  TESTNET: Array<NFT>;
  MAINNET: Array<NFT>;
  DEVNET: Array<NFT>;
  CUSTOM: Array<NFT>;
}
export interface SharedNFTsByWallet {
  [walletaddress: string]: SharedNFTs;
}
export interface NFTState {
  all: Array<NFT>;
  sharedwithme: SharedNFTsByWallet;
  lines: Array<NFT>;
  xls20nfts: Array<any>;
  allXls20: Array<any>;
  sellOffers: Array<any>;
  buyOffers: Array<any>;
  xrpClient: typeof XrplClient | null;
  isConnected: boolean;
}

const state = (): NFTState => ({
  all: [],
  allXls20: [],
  sellOffers: [],
  buyOffers: [],
  sharedwithme: {},
  lines: [],
  xls20nfts: [],
  xrpClient: null,
  isConnected: false,
});

export default state;
