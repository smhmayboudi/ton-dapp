import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <TonConnectUIProvider manifestUrl="https://raw.githubusercontent.com/smhmayboudi/ton-dapp/main/public/tonconnect-manifest.json">
    <App />
  </TonConnectUIProvider>,
);
