import {
  Address,
  TonClient,
  beginCell,
  StateInit,
  storeStateInit,
} from "@ton/ton";

export async function jettonWalletStateInit() {
  const client = new TonClient({
    endpoint: "https://toncenter.com/api/v2/jsonRPC",
    apiKey: "put your api key",
  });

  const jettonWalletAddress = Address.parse("Sender_Jetton_Wallet");
  const jettonWalletDataResult = await client.runMethod(
    jettonWalletAddress,
    "get_wallet_data",
  );
  jettonWalletDataResult.stack.readNumber();
  const ownerAddress = jettonWalletDataResult.stack.readAddress();
  const jettonMasterAddress = jettonWalletDataResult.stack.readAddress();
  const jettonCode = jettonWalletDataResult.stack.readCell();
  const jettonData = beginCell()
    .storeCoins(0)
    .storeAddress(ownerAddress)
    .storeAddress(jettonMasterAddress)
    .storeRef(jettonCode)
    .endCell();

  const stateInit: StateInit = {
    code: jettonCode,
    data: jettonData,
  };

  const stateInitCell = beginCell().store(storeStateInit(stateInit)).endCell();

  console.log(new Address(0, stateInitCell.hash()));
}
