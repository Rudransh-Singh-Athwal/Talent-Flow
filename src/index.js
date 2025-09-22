import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import storageService from "./services/storage";

// Start MSW
// if (process.env.NODE_ENV === "development") {
//   const { worker } = require("./mocks/browser");
//   worker.start({
//     onUnhandledRequest: "bypass",
//   });
// }

// Initialize storage and render app
async function initApp() {
  // await storageService.init();

  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

initApp();
