import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import {
  Locales,
  TonConnectButton,
  useIsConnectionRestored,
  useTonAddress,
  useTonConnectModal,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";
import { useCounterContract } from "./hooks/useCounterContract";
import { useTonConnect } from "./hooks/useTonConnect";
import "@twa-dev/sdk";
import { Address, beginCell, toNano } from "@ton/ton";

export const CounterContract = () => {
  const { value, address } = useCounterContract();

  return (
    <>
      <div className="Card">
        <b>Contract Counter Address</b>
        <div>{address}</div>
      </div>

      <div className="Card">
        <b>Contract Counter Value</b>
        <div>{value ?? "Loading..."}</div>
      </div>
    </>
  );
};

export const CounterContractSendIncrement = () => {
  const { connected } = useTonConnect();
  const { sendIncrement } = useCounterContract();

  return (
    connected && (
      <>
        <div className="Card">
          <button
            onClick={() => {
              sendIncrement();
            }}
          >
            Send Increment
          </button>
        </div>
      </>
    )
  );
};

export const IsConnectionRestored = () => {
  const isConnectionRestored = useIsConnectionRestored();

  return isConnectionRestored ? (
    <>
      <div className="Card">
        <b style={{ color: "green" }}>Is Connection Restored</b>
      </div>
    </>
  ) : (
    <>
      <div className="Card">
        <b style={{ color: "red" }}>Is Connection Restored</b>
      </div>
    </>
  );
};

export const SendTransactionJetton = () => {
  const { connected } = useTonConnect();
  const [tonConnectUI] = useTonConnectUI();

  const Wallet_DST = Address.parse(
    "kQDWGcc-KJW7OmdUbaVskkkuF64k6rrhUTG152UkSFXZpIKL"
  );
  const Wallet_SRC = Address.parse(
    "kQDWGcc-KJW7OmdUbaVskkkuF64k6rrhUTG152UkSFXZpIKL"
  );
  const body = beginCell()
    .storeUint(0x0f8a7ea5, 32) // jetton transfer op code
    .storeUint(0, 64) // query_id:uint64
    .storeCoins(1000000) // amount:(VarUInteger 16) -  Jetton amount for transfer (decimals = 6 - jUSDT, 9 - default)
    .storeAddress(Wallet_DST) // destination:MsgAddress
    .storeAddress(Wallet_SRC) // response_destination:MsgAddress
    .storeUint(0, 1) // custom_payload:(Maybe ^Cell)
    .storeCoins(toNano(0.05)) // forward_ton_amount:(VarUInteger 16) - if >0, will send notification message
    .storeUint(0, 1) // forward_payload:(Either Cell ^Cell)
    .endCell();

  const jettonWalletContract = Address.parse(
    "kQDWGcc-KJW7OmdUbaVskkkuF64k6rrhUTG152UkSFXZpIKL"
  );
  const myTransaction = {
    validUntil: Math.floor(Date.now() / 1000) + 360,
    messages: [
      {
        address: jettonWalletContract.toRawString(), // sender jetton wallet
        amount: toNano(0.05).toString(), // for commission fees, excess will be returned
        payload: body.toBoc().toString("base64"), // payload with jetton transfer body
      },
    ],
  };

  return (
    connected && (
      <>
        <div className="Card">
          <button onClick={() => tonConnectUI.sendTransaction(myTransaction)}>
            Send Transaction Jetton
          </button>
        </div>
      </>
    )
  );
};

export const SendTransactionJettonForwardPayload = () => {
  const { connected } = useTonConnect();
  const [tonConnectUI] = useTonConnectUI();

  const forwardPayload = beginCell()
    .storeUint(0, 32) // 0 opcode means we have a comment
    .storeStringTail("Hello, TON!")
    .endCell();

  const Wallet_DST = Address.parse(
    "kQDWGcc-KJW7OmdUbaVskkkuF64k6rrhUTG152UkSFXZpIKL"
  );
  const Wallet_SRC = Address.parse(
    "kQDWGcc-KJW7OmdUbaVskkkuF64k6rrhUTG152UkSFXZpIKL"
  );
  const body = beginCell()
    .storeUint(0x0f8a7ea5, 32) // opcode for jetton transfer
    .storeUint(0, 64) // query id
    .storeCoins(toNano(5)) // jetton amount, amount * 10^9
    .storeAddress(Wallet_DST) // TON wallet destination address
    .storeAddress(Wallet_SRC) // response excess destination
    .storeBit(0) // no custom payload
    .storeCoins(toNano(0.02)) // forward amount (if >0, will send notification message)
    .storeBit(1) // we store forwardPayload as a reference
    .storeRef(forwardPayload)
    .endCell();

  const jettonWalletContract = Address.parse(
    "kQDWGcc-KJW7OmdUbaVskkkuF64k6rrhUTG152UkSFXZpIKL"
  );
  const myTransaction = {
    validUntil: Math.floor(Date.now() / 1000) + 360,
    messages: [
      {
        address: jettonWalletContract.toRawString(), // sender jetton wallet
        amount: toNano(0.05).toString(), // for commission fees, excess will be returned
        payload: body.toBoc().toString("base64"), // payload with jetton transfer body
      },
    ],
  };

  return (
    connected && (
      <>
        <div className="Card">
          <button onClick={() => tonConnectUI.sendTransaction(myTransaction)}>
            Send Transaction Jetton Forward Payload
          </button>
        </div>
      </>
    )
  );
};

export const SendTransactionTon = () => {
  const { connected } = useTonConnect();
  const [tonConnectUI] = useTonConnectUI();

  const body = beginCell()
    .storeUint(0, 32) // write 32 zero bits to indicate that a text comment will follow
    .storeStringTail("Hello, TON!") // write our text comment
    .endCell();
  const destination = Address.parse(
    "kQDWGcc-KJW7OmdUbaVskkkuF64k6rrhUTG152UkSFXZpIKL"
  );
  const myTransaction = {
    validUntil: Math.floor(Date.now() / 1000) + 360,
    messages: [
      {
        address: destination.toRawString(),
        amount: toNano(0.05).toString(),
        payload: body.toBoc().toString("base64"), // payload with comment in body
      },
    ],
  };

  return (
    connected && (
      <>
        <div className="Card">
          <button onClick={() => tonConnectUI.sendTransaction(myTransaction)}>
            Send Transaction Ton
          </button>
        </div>
      </>
    )
  );
};

export const TonAddress = () => {
  const tonAddressRaw = useTonAddress(false);
  const tonAddressUserFriendly = useTonAddress();

  return (
    tonAddressUserFriendly && (
      <>
        <div className="Card">
          <b>Ton Address Raw</b>
          <div>{tonAddressRaw}</div>
        </div>
        <div className="Card">
          <b>Ton Address User Friendly</b>
          <div>{tonAddressUserFriendly}</div>
        </div>
      </>
    )
  );
};

export const TonConnectModal = () => {
  const tonConnectModal = useTonConnectModal();

  return (
    <>
      <div className="Card">
        <b>Ton Connect Modal</b>
        <div>{JSON.stringify(tonConnectModal)}</div>
      </div>
    </>
  );
};

export const TonConnectUI = () => {
  const [tonConnectUI, setOptions] = useTonConnectUI();

  const onLanguageChange = (lang: string) => {
    setOptions({ language: lang as Locales });
  };

  return (
    <>
      <div className="Card">
        <label>language</label>
        <select onChange={(e) => onLanguageChange(e.target.value)}>
          <option value="en">en</option>
          <option value="ru">ru</option>
        </select>
      </div>
      <div className="Card">
        <b>Ton Connect UI</b>
        <div>{JSON.stringify(tonConnectUI.modalState)}</div>
      </div>
    </>
  );
};

export const TonWallet = () => {
  const wallet = useTonWallet();

  return (
    wallet && (
      <div>
        <div className="Card">
          <b>Ton Wallet</b>
          <div>{JSON.stringify(wallet)}</div>
        </div>
      </div>
    )
  );
};

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <TonConnectButton style={{ float: "right" }} />
      </div>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React + SWC + TS</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <div>
        <CounterContract />
        <CounterContractSendIncrement />
        <IsConnectionRestored />
        <SendTransactionJetton />
        <SendTransactionJettonForwardPayload />
        <SendTransactionTon />
        <TonAddress />
        <TonConnectModal />
        <TonConnectUI />
        <TonWallet />
      </div>
    </>
  );
}

export default App;
