import { MutationTree } from "vuex";
import { XrplClient } from "xrpl-client";
import { NFT } from "../../../models/NFT";
import { NFTState, SharedNFTs } from "./state";
interface addSharedParams {
  shared: NFT;
  offer?: any;
  nodetype: keyof SharedNFTs;
  walletaddress: string;
}
interface deleteSharedParams {
  currency: string;
  nodetype: keyof SharedNFTs;
  walletaddress: string;
}
const mutations: MutationTree<NFTState> = {
  setXrpClient(state: NFTState, xrpClient: typeof XrplClient): void {
    state.xrpClient = xrpClient;
  },
  setIsConnected(state: NFTState, isConnected: boolean): void {
    state.isConnected = isConnected;
  },
  setAll(state: NFTState, all: Array<any>): void {
    state.all = [...state.all, ...all];
  },
  setAllXls20(state: NFTState, allXls20: Array<any>): void {
    state.allXls20 = [...state.allXls20, ...allXls20];
  },
  setSellOffers(state: NFTState, sellOffers: Array<any>): void {
    state.sellOffers = [...state.sellOffers, ...sellOffers];
  },
  setLines(state: NFTState, lines: Array<any>): void {
    state.lines = lines;
  },
  setXls20(state: NFTState, xls20nfts: Array<any>): void {
    state.xls20nfts = xls20nfts;
  },
  setCurrent(state: NFTState, nft: NFT): void {
    state.currentNFT = nft;
  },
  resetAll(state: NFTState): void {
    state.lines = [];
    state.all = [];
  },
  initSharedStore(state: NFTState, walletaddress) {
    state.sharedwithme[walletaddress] = {
      TESTNET: [],
      MAINNET: [],
      CUSTOM: [],
      DEVNET: [],
    };
  },
  initSharedBuyOffersStore(state: NFTState, walletaddress) {
    state.sharedBuyOffers[walletaddress] = {};
  },
  addSharedBuyOffer(state: NFTState, { buyoffer, walletaddress, nftID }: any) {
    if (!state.sharedBuyOffers[walletaddress]) {
      state.sharedBuyOffers[walletaddress] = {};
    }
    if (!state.sharedBuyOffers[walletaddress][nftID]) {
      state.sharedBuyOffers[walletaddress][nftID] = [buyoffer];
    } else {
      const exist =
        state.sharedBuyOffers[walletaddress][nftID].filter((o: any) => {
          return o.nft_offer_index == buyoffer.nft_offer_index;
        }).length > 0;
      if (!exist) {
        state.sharedBuyOffers[walletaddress][nftID] = [
          ...state.sharedBuyOffers[walletaddress][nftID],
          buyoffer,
        ];
      }
    }
  },
  addShared(
    state: NFTState,
    { shared, nodetype, walletaddress, offer }: addSharedParams
  ): void {
    const exist = state.sharedwithme[walletaddress][nodetype].find(
      (n: { issuer: string; currency: string }) => {
        return n.issuer === shared.issuer && n.currency === shared.currency;
      }
    );
    if (!exist) {
      if (offer) {
        shared.selloffers = [];
        shared.selloffers = [offer];
      }
      state.sharedwithme[walletaddress][nodetype] = [
        ...state.sharedwithme[walletaddress][nodetype],
        shared,
      ];
    }
    if (exist && offer) {
      const offerExists =
        exist.selloffers &&
        exist.selloffers.filter((o: any) => {
          o.nft_offer_index == offer.nft_offer_index;
        }).length > 0;
      if (!offerExists) {
        exist.selloffers = [...exist.selloffers, offer];
      }
    }
  },

  addSellOffer(state, offers) {
    if (state.currentNFT) {
      state.currentNFT.selloffers = offers ? offers : [];

      const { currency } = state.currentNFT;
      console.log("addSellOffer", currency);
      const currentNft: any = state.allXls20.filter(
        (n) => n.currency === currency
      );
      console.log("addSellOffer", currentNft);

      if (currentNft) {
        currentNft.selloffers = offers ? offers : [];
      }
    }
  },
  deleteSellOffer(state, { offerID }) {
    console.log("deleteSellOffer", offerID);
    console.log("deleteSellOffer state.currentNFT", state.currentNFT);

    if (state.currentNFT) {
      state.currentNFT.selloffers = state.currentNFT.selloffers.filter(
        (o: any) => {
          console.log(" state.currentNFT", o.nft_offer_index);

          return o.nft_offer_index === offerID;
        }
      );
      const { currency } = state.currentNFT;
      const currentNft: any = state.allXls20.filter(
        (n) => n.currency === currency
      );
      if (currentNft) {
        currentNft.selloffers = currentNft.selloffers.filter((o: any) => {
          console.log("currentNft", o.nft_offer_index);

          return o.nft_offer_index === offerID;
        });
      }
    }
  },
  addBuyOffer(state, { offers }) {
    if (state.currentNFT) state.currentNFT.buyoffers = offers ? offers : [];
  },
  // deleteBuyOffer(state, { offerID }) {
  //   if (state.currentNFT)
  //     state.currentNFT.buyoffers.filter(
  //       (o: any) => o.nft_offer_index === offerID
  //     );
  // },
  deleteShared(
    state: NFTState,
    { currency, nodetype, walletaddress }: deleteSharedParams
  ): void {
    state.sharedwithme[walletaddress][nodetype] = state.sharedwithme[
      walletaddress
    ][nodetype].filter((n) => n.currency !== currency);
  },
};

export default mutations;
