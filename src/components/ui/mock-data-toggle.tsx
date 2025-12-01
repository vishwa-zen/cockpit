import React, { useState, useEffect } from "react";
import { Button } from "./button";
import { Badge } from "./badge";
import { DatabaseIcon, WifiIcon } from "lucide-react";
import { shouldUseMockData, toggleMockData } from "../../services/mockData";

export const MockDataToggle: React.FC = () => {
  const [useMock, setUseMock] = useState(shouldUseMockData());

  useEffect(() => {
    setUseMock(shouldUseMockData());
  }, []);

  const handleToggle = () => {
    const newState = toggleMockData();
    setUseMock(newState);
    
    // Reload page to apply changes
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex items-center gap-2 bg-white rounded-lg shadow-lg border border-[#e1e8f0] p-3">
        <Badge
          variant={useMock ? "default" : "outline"}
          className="text-xs"
        >
          {useMock ? (
            <>
              <DatabaseIcon className="w-3 h-3 mr-1" />
              Mock Data
            </>
          ) : (
            <>
              <WifiIcon className="w-3 h-3 mr-1" />
              Live API
            </>
          )}
        </Badge>
        <Button
          size="sm"
          variant="outline"
          onClick={handleToggle}
          className="text-xs h-7"
        >
          Switch to {useMock ? "Live API" : "Mock Data"}
        </Button>
      </div>
    </div>
  );
};
