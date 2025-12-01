import { useMsal } from "@azure/msal-react";
import { useEffect, useState } from "react";

export const useAuth = () => {
  const { instance, accounts } = useMsal();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check for demo mode
    const demoUser = sessionStorage.getItem("demo.user");
    if (demoUser) {
      try {
        const parsedUser = JSON.parse(demoUser);
        setIsAuthenticated(true);
        setUser(parsedUser);
        return;
      } catch (e) {
        console.error("Failed to parse demo user", e);
      }
    }

    // Check for MSAL accounts
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
      // Clear demo mode
      sessionStorage.removeItem("demo.user");
      
      // Logout from MSAL if authenticated
      if (accounts && accounts.length > 0) {
        await instance.logoutPopup();
      }
      
      sessionStorage.clear();
    } catch (error) {
      console.error("Logout failed:", error);
      // Force clear session even if logout fails
      sessionStorage.clear();
    }
  };

  return {
    isAuthenticated,
    user,
    logout,
  };
};
