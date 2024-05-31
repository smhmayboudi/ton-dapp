import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <TonConnectUIProvider
    actionsConfiguration={{ twaReturnUrl: "https://t.me/github_ton_dapp_bot/ton_dapp" }}
    manifestUrl="https://raw.githubusercontent.com/smhmayboudi/ton-dapp/main/public/tonconnect-manifest.json"
    uiPreferences={{ borderRadius: "s" }}
  >
    <App />
  </TonConnectUIProvider>
);
