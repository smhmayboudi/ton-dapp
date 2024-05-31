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
          <a
            onClick={() => {
              sendIncrement();
            }}
          >
            Send Increment
          </a>
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
    setOptions({
      actionsConfiguration: {
        twaReturnUrl: "https://t.me/ton-dapp/start",
      },
      language: lang as Locales,
    });
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
        <TonAddress />
        <TonConnectModal />
        <TonConnectUI />
        <TonWallet />
      </div>
    </>
  );
}

export default App;
