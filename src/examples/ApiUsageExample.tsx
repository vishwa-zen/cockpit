import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { ticketService, type Ticket } from "../services/ticketService";
import { ApiError } from "../services/api";

/**
 * Example component demonstrating API service usage
 */
export const ApiUsageExample: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);

  // Example: Fetch tickets on mount
  useEffect(() => {
    loadTickets();
  }, []);

  // Example: Load tickets with error handling
  const loadTickets = async () => {
    setLoading(true);
    try {
      const response = await ticketService.getTickets(1, 10);
      setTickets(response.tickets);
    } catch (error) {
      // Error is already handled by API service (toast shown)
      // You can add additional error handling here if needed
      if (error instanceof ApiError) {
        console.error("Failed to load tickets:", error.getUserMessage());
      }
    } finally {
      setLoading(false);
    }
  };

  // Example: Create ticket
  const handleCreateTicket = async () => {
    try {
      const newTicket = await ticketService.createTicket({
        title: "New Ticket",
        description: "Test ticket",
        device: "LAPTOP-001",
        priority: "high",
        status: "open",
        reporter: "john.doe@example.com",
      });
      
      // Add to list
      setTickets([newTicket, ...tickets]);
    } catch (error) {
      // Error handled by API service
    }
  };

  // Example: Update ticket
  const handleUpdateTicket = async (id: string) => {
    try {
      const updated = await ticketService.updateTicket(id, {
        status: "in-progress",
      });
      
      // Update in list
      setTickets(tickets.map(t => t.id === id ? updated : t));
    } catch (error) {
      // Error handled by API service
    }
  };

  // Example: Delete ticket
  const handleDeleteTicket = async (id: string) => {
    try {
      await ticketService.deleteTicket(id);
      
      // Remove from list
      setTickets(tickets.filter(t => t.id !== id));
    } catch (error) {
      // Error handled by API service
    }
  };

  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>API Service Example</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={loadTickets} disabled={loading}>
              {loading ? "Loading..." : "Refresh Tickets"}
            </Button>
            <Button onClick={handleCreateTicket}>Create Ticket</Button>
          </div>

          <div className="space-y-2">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="flex items-center justify-between p-4 border rounded"
              >
                <div>
                  <p className="font-medium">{ticket.title}</p>
                  <p className="text-sm text-gray-500">{ticket.id}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleUpdateTicket(ticket.id)}
                  >
                    Update
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteTicket(ticket.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
