import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);

// Add error handling for the worker
worker.events.on("request:start", ({ request }) => {
  console.log("MSW intercepted:", request.method, request.url);
});

worker.events.on("request:match", ({ request }) => {
  console.log("MSW matched:", request.method, request.url);
});

worker.events.on("request:unhandled", ({ request }) => {
  console.log("MSW unhandled:", request.method, request.url);
});

// Enhanced start function with better error handling
export async function startWorker() {
  try {
    await worker.start({
      onUnhandledRequest: "bypass",
      serviceWorker: {
        url: "/mockServiceWorker.js",
        options: {
          scope: "/",
        },
      },
    });
    console.log("MSW worker started successfully");
  } catch (error) {
    console.error("Failed to start MSW worker:", error);
    throw error;
  }
}
