import React, { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "./alert";
import { Button } from "./button";
import { RefreshCwIcon, WifiOffIcon } from "lucide-react";
import { apiService } from "../../services/api";

export const ConnectionStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isChecking, setIsChecking] = useState(false);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      // Try to ping the API
      await apiService.get(
        "/servicenow/technician/FS_Cockpit_Integration/incidents",
        {
          silent: true,
          showErrorToast: false,
        }
      );
      setIsOnline(true);
    } catch (error) {
      setIsOnline(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();

    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);

    return () => clearInterval(interval);
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <Alert variant="destructive">
        <WifiOffIcon className="h-4 w-4" />
        <AlertTitle>Cannot Connect to API Server</AlertTitle>
        <AlertDescription className="mt-2 space-y-2">
          <p>Unable to reach the API at http://127.0.0.1:8003</p>
          <p className="text-xs">Please ensure:</p>
          <ul className="text-xs list-disc list-inside space-y-1">
            <li>API server is running on port 8003</li>
            <li>CORS is enabled for localhost:3000</li>
            <li>No firewall blocking the connection</li>
          </ul>
          <Button
            size="sm"
            variant="outline"
            onClick={checkConnection}
            disabled={isChecking}
            className="mt-2"
          >
            <RefreshCwIcon
              className={`h-3 w-3 mr-2 ${isChecking ? "animate-spin" : ""}`}
            />
            {isChecking ? "Checking..." : "Retry Connection"}
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
};
