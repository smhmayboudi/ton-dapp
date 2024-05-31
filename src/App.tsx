import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import {
  TonConnectButton,
  useTonAddress,
  useTonWallet,
} from "@tonconnect/ui-react";
import { useCounterContract } from "./hooks/useCounterContract";
import { useTonConnect } from "./hooks/useTonConnect";
import "@twa-dev/sdk";

export const Address = () => {
  const userFriendlyAddress = useTonAddress();
  const rawAddress = useTonAddress(false);

  return (
    userFriendlyAddress && (
      <>
        <div className="Card">
          <b>Wallet User-friendly Address</b>
          <div>{userFriendlyAddress}</div>
        </div>
        <div className="Card">
          <b>Wallet Raw Address</b>
          <div>{rawAddress}</div>
        </div>
      </>
    )
  );
};

export const SmartContracIncrement = () => {
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
            Increment
          </a>
        </div>
      </>
    )
  );
};

export const SmartContractDetails = () => {
  const { value, address } = useCounterContract();

  return (
    <>
      <div className="Card">
        <b>Smart Contract Counter Address</b>
        <div>{address}</div>
      </div>

      <div className="Card">
        <b>Smart Contract Counter Value</b>
        <div>{value ?? "Loading..."}</div>
      </div>
    </>
  );
};

export const WalletDetails = () => {
  const wallet = useTonWallet();

  return (
    wallet && (
      <div>
        <div className="Card">
          <b>Wallet Details</b>
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
        <SmartContractDetails />
        <SmartContracIncrement />
        <Address />
        <WalletDetails />
      </div>
    </>
  );
}

export default App;
