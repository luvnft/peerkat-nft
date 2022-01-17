import { init } from "../../../services/XrpService";
import { ActionTree } from "vuex";
import { NFT } from "../../../models/NFT";
import { NFTState } from "./state";
type line = {
  balance: string;
  limit: string;
  account: string;
  currency: string;
};
interface FetchParams {
  walletAddress: string;
  nodetype: string;
  // handleError: (error: string) => void;
}

const actions: ActionTree<NFT, NFTState> = {
  async initXrpClient({ commit }, nodetype: string): Promise<void> {
    const client = await init(nodetype);
    commit("setXrpClient", client);
  },
  async fetchNftLines(
    { commit, getters },
    { walletAddress }: FetchParams
  ): Promise<void> {
    const client = getters.getXrpClient;
    const lines = await client.fetchNftLines(walletAddress);
    commit("setLines", lines);
  },
  async fetchNext({ commit, getters }): Promise<void> {
    const client = getters.getXrpClient;
    const count = getters.getAll.length;
    const nextLines = getters.getLines.slice(count, count + 4);
    const nextNfts: NFT[] = await Promise.all(
      nextLines.map(async (line: line) => {
        const { account, currency } = line;
        return client.fetchOne(account, currency);
      })
    );
    commit("setAll", nextNfts);
  },
};
export default actions;
