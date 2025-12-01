import { useMsal } from "@azure/msal-react";
import { useEffect, useState } from "react";

export const useAuth = () => {
  const { instance, accounts } = useMsal();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check for demo mode first
    const isDemoMode = localStorage.getItem("demo.mode") === "true";
    const storedAccount = localStorage.getItem("msal.account");
    
    if (isDemoMode && storedAccount) {
      try {
        const demoUser = JSON.parse(storedAccount);
        setIsAuthenticated(true);
        setUser(demoUser);
        return;
      } catch (e) {
        console.error("Failed to parse demo user", e);
      }
    }

    // Check MSAL accounts
    if (accounts && accounts.length > 0) {
      setIsAuthenticated(true);
      setUser(accounts[0]);
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [accounts]);

  const logout = async () => {
    try {
      const isDemoMode = localStorage.getItem("demo.mode") === "true";
      
      if (isDemoMode) {
        // Just clear storage for demo mode
        localStorage.clear();
        window.location.href = "/login";
        return;
      }

      // Normal MSAL logout
      await instance.logoutPopup({
        mainWindowRedirectUri: "/login"
      });
      localStorage.clear();
    } catch (error) {
      console.error("Logout failed:", error);
      localStorage.clear();
      window.location.href = "/login";
    }
  };

  return {
    isAuthenticated,
    user,
    logout,
  };
};
