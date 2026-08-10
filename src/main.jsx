import React from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider, SignedIn, SignedOut, SignIn } from "@clerk/clerk-react";
import App from "./App.jsx";
import "./index.css";

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Centered sign-in shown to signed-out visitors.
function SignInScreen() {
  return (
    <div style={{ minHeight: "100dvh", display: "grid", placeItems: "center", padding: 24 }}>
      <SignIn routing="virtual" />
    </div>
  );
}

// Fail loudly-but-friendly if the key is missing rather than throwing deep in Clerk.
function MissingKey() {
  return (
    <div style={{ maxWidth: 520, margin: "60px auto", padding: 24, fontFamily: "system-ui" }}>
      <h1>Configuration needed</h1>
      <p>
        <code>VITE_CLERK_PUBLISHABLE_KEY</code> is not set. Copy <code>.env.example</code> to{" "}
        <code>.env.local</code> and fill in your Clerk keys, then restart the dev server.
      </p>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {publishableKey ? (
      <ClerkProvider publishableKey={publishableKey} afterSignOutUrl="/">
        <SignedIn>
          <App />
        </SignedIn>
        <SignedOut>
          <SignInScreen />
        </SignedOut>
      </ClerkProvider>
    ) : (
      <MissingKey />
    )}
  </React.StrictMode>
);
