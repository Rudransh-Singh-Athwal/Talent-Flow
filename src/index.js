import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import storageService from "./services/storage";

// Initialize MSW and start app
async function initApp() {
  console.log("Initializing TalentFlow app...");

  // Start MSW first in development
  if (process.env.REACT_APP_ENABLE_MSW === "true") {
    try {
      const { startWorker } = await import("./mocks/browser");
      await startWorker();
      console.log("MSW initialized successfully");
    } catch (error) {
      console.error("Failed to initialize MSW:", error);
      // Continue without MSW if it fails to load
    }
  }

  // Initialize storage
  try {
    await storageService.init();
    console.log("Storage service initialized successfully");
  } catch (error) {
    console.error("Failed to initialize storage service:", error);
  }

  // Render the app
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  console.log("App rendered successfully");
}

// Add error boundary for the entire app initialization
initApp().catch((error) => {
  console.error("Failed to initialize app:", error);

  // Fallback render without MSW
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(
    <React.StrictMode>
      <div style={{ padding: "20px", color: "red" }}>
        <h1>App Initialization Error</h1>
        <p>
          There was an error initializing the app. Please check the console for
          details.
        </p>
        <details>
          <summary>Error Details</summary>
          <pre>{error.message}</pre>
        </details>
      </div>
    </React.StrictMode>
  );
});
