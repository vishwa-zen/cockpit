import { useMsal } from "@azure/msal-react";
import { useEffect, useState } from "react";

export const useAuth = () => {
  const { instance, accounts } = useMsal();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
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
      await instance.logoutPopup({
        mainWindowRedirectUri: "/login"
      });
      localStorage.clear();
    } catch (error) {
      console.error("Logout failed:", error);
      localStorage.clear();
    }
  };

  return {
    isAuthenticated,
    user,
    logout,
  };
};
