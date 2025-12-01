import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication, EventType, AuthenticationResult } from "@azure/msal-browser";
import { msalConfig } from "./config/authConfig";
import { Toaster } from "./components/ui/toaster";
import { SignInSection } from "./screens/Frame/sections/SignInSection";
import { HomeSearchSection } from "./screens/Frame/sections/HomeSearchSection";
import { IssueSearchSection } from "./screens/Frame/sections/IssueSearchSection";
import { IssueDetailsSection } from "./screens/Frame/sections/IssueDetailsSection";

// Create the MSAL instance outside the component to prevent recreation
const msalInstance = new PublicClientApplication(msalConfig);

// Component to handle the app rendering after MSAL is ready
const App = () => {
  const [isMsalInitialized, setIsMsalInitialized] = useState(false);

  useEffect(() => {
    const initializeMsal = async () => {
      try {
        // Initialize MSAL
        await msalInstance.initialize();
        
        // Check if there are already accounts logged in
        const accounts = msalInstance.getAllAccounts();
        if (accounts.length > 0) {
          msalInstance.setActiveAccount(accounts[0]);
        }

        // Add event callback for login success
        msalInstance.addEventCallback((event) => {
          if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
            const payload = event.payload as AuthenticationResult;
            const account = payload.account;
            msalInstance.setActiveAccount(account);
            console.log("✅ Login Success:", account.username);
          }
        });

        setIsMsalInitialized(true);
        console.log("✅ MSAL Initialized");
      } catch (error) {
        console.error("❌ MSAL Initialization Failed:", error);
      }
    };

    initializeMsal();
  }, []);

  if (!isMsalInitialized) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Initializing Security...</p>
        </div>
      </div>
    );
  }

  return (
    <MsalProvider instance={msalInstance}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<SignInSection />} />
          <Route path="/home" element={<HomeSearchSection />} />
          <Route path="/search" element={<IssueSearchSection />} />
          <Route path="/issue/:id" element={<IssueDetailsSection />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </MsalProvider>
  );
};

const root = createRoot(document.getElementById("app") as HTMLElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
